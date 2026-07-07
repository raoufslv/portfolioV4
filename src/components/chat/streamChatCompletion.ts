import {
  getChatModelCandidates,
  isRetryableChatError,
} from "@/lib/chatConfig";

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

async function readErrorMessage(response: Response): Promise<string> {
  const errorData = await response.json().catch(() => ({}));
  const nested = errorData.error;
  if (typeof nested === "string") return nested;
  if (nested?.message) return nested.message;
  return "Chat API error";
}

async function streamWithModel(
  model: string,
  messages: Message[],
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
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
    const message = await readErrorMessage(response);
    const error = new Error(message) as Error & { status?: number };
    error.status = response.status;
    throw error;
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

export async function streamChatCompletion({
  messages,
  model,
  onChunk,
  signal,
}: StreamChatOptions): Promise<void> {
  const candidates = getChatModelCandidates(model);
  let lastError: Error | null = null;

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];

    try {
      await streamWithModel(candidate, messages, onChunk, signal);
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }

      const chatError = error as Error & { status?: number };
      lastError = chatError instanceof Error ? chatError : new Error("Chat API error");

      const canRetry =
        index < candidates.length - 1 &&
        isRetryableChatError(chatError.status ?? 0, chatError.message);

      if (!canRetry) {
        throw lastError;
      }

      console.warn(`Chat model "${candidate}" failed, trying fallback...`, chatError.message);
    }
  }

  throw lastError ?? new Error("Chat API error");
}
