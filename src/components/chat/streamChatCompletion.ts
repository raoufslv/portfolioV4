interface Message {
  role: string;
  content: string;
}

interface StreamChatOptions {
  messages: Message[];
  model: string;
  onChunk: (chunk: string) => void;
  signal?: AbortSignal;
}

function getChatEndpoint(): string {
  if (import.meta.env.VITE_CHAT_API_URL) {
    return import.meta.env.VITE_CHAT_API_URL;
  }
  if (import.meta.env.DEV && import.meta.env.VITE_OPENROUTER_API_KEY) {
    return "https://openrouter.ai/api/v1/chat/completions";
  }
  return "/api/chat";
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (import.meta.env.DEV && import.meta.env.VITE_OPENROUTER_API_KEY) {
    headers.Authorization = `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`;
  }
  return headers;
}

export async function streamChatCompletion({
  messages,
  model,
  onChunk,
  signal,
}: StreamChatOptions): Promise<void> {
  const response = await fetch(getChatEndpoint(), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message ?? errorData.error ?? "Chat API error");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Streaming not supported");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;

      const payload = trimmed.slice(6);
      if (payload === "[DONE]") continue;

      try {
        const parsed = JSON.parse(payload);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) onChunk(delta);
      } catch {
        // Skip malformed SSE chunks
      }
    }
  }
}
