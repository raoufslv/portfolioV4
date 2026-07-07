/** Fast, lightweight free instruct models (no reasoning router). */
const DEFAULT_CHAT_MODEL = "tencent/hy3:free";

export const CHAT_MODEL_FALLBACKS = [
  "tencent/hy3:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "liquid/lfm-2.5-1.2b-instruct:free",
] as const;

export const CHAT_COMPLETION_OPTIONS = {
  max_tokens: 320,
  temperature: 0.5,
  include_reasoning: false,
  reasoning: {
    effort: "none",
    exclude: true,
  },
} as const;

export function getPrimaryChatModel(): string {
  return import.meta.env.VITE_OPENROUTER_MODEL ?? DEFAULT_CHAT_MODEL;
}

export function getChatModelCandidates(preferred?: string): string[] {
  const primary = preferred ?? getPrimaryChatModel();
  return [...new Set([primary, ...CHAT_MODEL_FALLBACKS])];
}

export function getChatCompletionBody(
  model: string,
  messages: unknown[],
  stream: boolean
) {
  return {
    model,
    messages,
    stream,
    ...CHAT_COMPLETION_OPTIONS,
  };
}

export function isRetryableChatError(status: number, message: string): boolean {
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
