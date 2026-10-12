import {
  getChatModelCandidates,
  getChatCompletionBody,
  getChatProxyBody,
  isRetryableChatError,
} from "@/lib/chatConfig";
import { readStreamPayload } from "@/lib/chatModels";

interface Message {
  role: string;
  content: string;
}

interface StreamChatOptions {
  messages: Message[];
  onChunk: (chunk: string) => void;
  onRetry?: () => void;
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

function usesServerSideFallback(): boolean {
  return getChatEndpoint() === "/api/chat";
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

function throwChatError(message: string, status: number): never {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  throw error;
}

function consumePayload(payload: string, onChunk: (chunk: string) => void): boolean {
  const parsed = readStreamPayload(payload);
  if (parsed.kind === "error") {
    throwChatError(parsed.message, parsed.status);
  }
  if (parsed.kind === "content") {
    onChunk(parsed.content);
    return true;
  }
  return false;
}

async function readStreamResponse(
  response: Response,
  onChunk: (chunk: string) => void
): Promise<void> {
  if (!response.ok) {
    const message = await readErrorMessage(response);
    throwChatError(message, response.status);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throwChatError("Streaming not supported", 502);
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let received = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      if (consumePayload(trimmed.slice(5).trim(), onChunk)) received = true;
    }
  }

  const trailing = buffer.trim();
  if (trailing) {
    const payload = trailing.startsWith("data:") ? trailing.slice(5).trim() : trailing;
    if (consumePayload(payload, onChunk)) received = true;
  }

  if (!received) {
    throwChatError("Empty chat response", 502);
  }
}

async function streamViaProxy(
  messages: Message[],
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(getChatEndpoint(), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(getChatProxyBody(messages, true)),
    signal,
  });
  await readStreamResponse(response, onChunk);
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
    body: JSON.stringify(getChatCompletionBody(model, messages, true)),
    signal,
  });
  await readStreamResponse(response, onChunk);
}

export async function streamChatCompletion({
  messages,
  onChunk,
  onRetry,
  signal,
}: StreamChatOptions): Promise<void> {
  if (usesServerSideFallback()) {
    await streamViaProxy(messages, onChunk, signal);
    return;
  }

  const candidates = getChatModelCandidates();
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

      onRetry?.();
      console.warn(
        `Chat model "${candidate}" unavailable, trying the next model...`,
        chatError.message
      );
    }
  }

  throw lastError ?? new Error("Chat API error");
}
