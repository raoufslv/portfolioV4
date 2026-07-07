const DEFAULT_CHAT_MODEL = "openrouter/free";

export const CHAT_MODEL_FALLBACKS = [
  "openrouter/free",
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "qwen/qwen-2.5-7b-instruct:free",
] as const;

export function getPrimaryChatModel(): string {
  return import.meta.env.VITE_OPENROUTER_MODEL ?? DEFAULT_CHAT_MODEL;
}

export function getChatModelCandidates(preferred?: string): string[] {
  const primary = preferred ?? getPrimaryChatModel();
  return [...new Set([primary, ...CHAT_MODEL_FALLBACKS])];
}

export function isRetryableChatError(status: number, message: string): boolean {
  if ([408, 429, 500, 502, 503, 504].includes(status)) return true;

  const normalized = message.toLowerCase();
  return (
    normalized.includes("provider returned error") ||
    normalized.includes("rate limit") ||
    normalized.includes("overloaded") ||
    normalized.includes("temporarily unavailable")
  );
}
