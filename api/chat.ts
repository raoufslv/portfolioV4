import { completeWithModelFallback } from "../src/lib/chatProxy";

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

  try {
    const response = await completeWithModelFallback({
      apiKey,
      preferredModel:
        model ?? process.env.OPENROUTER_MODEL ?? process.env.VITE_OPENROUTER_MODEL,
      messages: messages ?? [],
      stream,
    });

    const contentType = response.headers.get("content-type") ?? "application/json";
    res.setHeader("Content-Type", contentType);
    const cacheControl = response.headers.get("cache-control");
    if (cacheControl) res.setHeader("Cache-Control", cacheControl);

    if (contentType.includes("application/json") || !response.body) {
      const data = await response.json().catch(() => ({ error: "Chat API error" }));
      return res.status(response.status).json(data);
    }

    res.status(response.status);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
    res.end();
  } catch (error) {
    console.error("Chat proxy error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
