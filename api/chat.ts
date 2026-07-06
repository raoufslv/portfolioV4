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
    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://raoufabdallah.me",
        "X-Title": "Raouf Portfolio",
      },
      body: JSON.stringify({ model, messages, stream }),
    });

    if (!upstream.ok) {
      const errorData = await upstream.json().catch(() => ({}));
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
  } catch (error) {
    console.error("Chat proxy error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
