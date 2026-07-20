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

type ChatRequestBody = {
  model?: string;
  messages?: unknown[];
  stream?: boolean;
};

function getApiKey(): string | undefined {
  return process.env.OPENROUTER_API_KEY ?? process.env.VITE_OPENROUTER_API_KEY;
}

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
    normalized.includes("rate-limited") ||
    normalized.includes("overloaded") ||
    normalized.includes("temporarily unavailable")
  );
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function proxyChat(
  apiKey: string,
  model: string,
  messages: unknown[],
  stream: boolean
): Promise<Response> {
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

export default async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return jsonResponse(500, { error: "OpenRouter API key not configured" });
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body" });
  }

  const { model, messages, stream = true } = body;
  const candidates = getChatModelCandidates(model);
  let lastError: { status: number; body: unknown } | null = null;

  try {
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index];
      const upstream = await proxyChat(apiKey, candidate, messages ?? [], stream);

      if (!upstream.ok) {
        const errorData = await upstream.json().catch(() => ({}));
        const message =
          typeof (errorData as { error?: unknown }).error === "string"
            ? (errorData as { error: string }).error
            : ((errorData as { error?: { message?: string } }).error?.message ??
              "Chat API error");

        lastError = { status: upstream.status, body: errorData };

        if (index < candidates.length - 1 && isRetryable(upstream.status, message)) {
          console.warn(`Chat model "${candidate}" failed, trying fallback...`);
          continue;
        }

        return jsonResponse(upstream.status, errorData);
      }

      if (!stream) {
        const data = await upstream.json();
        return jsonResponse(200, data);
      }

      if (!upstream.body) {
        return jsonResponse(500, { error: "Streaming not supported" });
      }

      return new Response(upstream.body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    return jsonResponse(
      lastError?.status ?? 502,
      lastError?.body ?? { error: "Chat API error" }
    );
  } catch (error) {
    console.error("Chat proxy error:", error);
    return jsonResponse(500, { error: "Internal server error" });
  }
};
