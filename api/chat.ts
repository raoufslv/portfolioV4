type VercelResponse = {
  status: (code: number) => {
    json: (data: unknown) => void;
    end: () => void;
  };
  setHeader: (name: string, value: string) => void;
  write: (chunk: string) => void;
  end: () => void;
};

type ChatRequestBody = {
  model?: string;
  messages?: unknown[];
  stream?: boolean;
};

const CHAT_MODEL_FALLBACKS = [
  "tencent/hy3:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "liquid/lfm-2.5-1.2b-instruct:free",
];

const CHAT_COMPLETION_OPTIONS = {
  max_tokens: 320,
  temperature: 0.5,
  include_reasoning: false,
  reasoning: {
    effort: "none",
    exclude: true,
  },
};

function getChatModelCandidates(preferred?: string): string[] {
  const primary =
    preferred ??
    process.env.OPENROUTER_MODEL ??
    process.env.VITE_OPENROUTER_MODEL ??
    "tencent/hy3:free";
  return [...new Set([primary, ...CHAT_MODEL_FALLBACKS])];
}

function isRetryable(status: number, message: string): boolean {
  if ([408, 429, 500, 502, 503, 504].includes(status)) return true;
  const normalized = message.toLowerCase();
  return (
    normalized.includes("provider returned error") ||
    normalized.includes("rate limit") ||
    normalized.includes("overloaded") ||
    normalized.includes("temporarily unavailable")
  );
}

async function proxyChat(
  apiKey: string,
  model: string,
  messages: unknown[],
  stream: boolean
) {
  return fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://raoufabdallah.me",
      "X-Title": "Raouf Portfolio",
    },
    body: JSON.stringify({
      model,
      messages,
      stream,
      ...CHAT_COMPLETION_OPTIONS,
    }),
  });
}

export default async function handler(
  req: { method?: string; body?: ChatRequestBody },
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY ?? process.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OpenRouter API key not configured" });
  }

  const { model, messages, stream = true } = req.body ?? {};
  const candidates = getChatModelCandidates(model);
  let lastError: { status: number; body: unknown } | null = null;

  try {
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index];
      const upstream = await proxyChat(apiKey, candidate, messages ?? [], stream);

      if (!upstream.ok) {
        const errorData = await upstream.json().catch(() => ({}));
        const message =
          typeof errorData?.error === "string"
            ? errorData.error
            : errorData?.error?.message ?? "Chat API error";

        lastError = { status: upstream.status, body: errorData };

        if (index < candidates.length - 1 && isRetryable(upstream.status, message)) {
          console.warn(`Chat model "${candidate}" failed, trying fallback...`);
          continue;
        }

        return res.status(upstream.status).json(errorData);
      }

      if (!stream) {
        const data = await upstream.json();
        return res.status(200).json(data);
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const reader = upstream.body?.getReader();
      if (!reader) {
        return res.status(500).json({ error: "Streaming not supported" });
      }

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
      res.end();
      return;
    }

    return res.status(lastError?.status ?? 502).json(lastError?.body ?? { error: "Chat API error" });
  } catch (error) {
    console.error("Chat proxy error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
