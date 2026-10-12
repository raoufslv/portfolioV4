/** Tried in order. A removed or failing model falls through to the next one. */
export const CHAT_MODELS = [
  "nvidia/nemotron-3.5-lightning:free",
  "google/gemma-4-26b-a4b-it:free",
  "poolside/laguna-xs-2.1:free",
] as const;

/** Single source of truth — not overridden by Netlify/Vercel env vars. */
export function getPrimaryChatModel(): string {
  return CHAT_MODELS[0];
}

export const CHAT_COMPLETION_OPTIONS = {
  max_tokens: 320,
  temperature: 0.5,
  include_reasoning: false,
  reasoning: {
    effort: "none",
    exclude: true,
  },
} as const;

export function getChatModelCandidates(): string[] {
  return [...CHAT_MODELS];
}

export function isRetryableChatError(status: number, message: string): boolean {
  if ([400, 402, 404, 408, 410, 429, 500, 502, 503, 504].includes(status)) {
    return true;
  }

  const normalized = message.toLowerCase();
  return (
    normalized.includes("provider returned error") ||
    normalized.includes("rate limit") ||
    normalized.includes("rate-limited") ||
    normalized.includes("overloaded") ||
    normalized.includes("temporarily unavailable") ||
    normalized.includes("unavailable") ||
    normalized.includes("no endpoints found") ||
    normalized.includes("not a valid model") ||
    normalized.includes("model not found") ||
    normalized.includes("no longer") ||
    normalized.includes("deprecated") ||
    normalized.includes("use this slug instead")
  );
}

export function readChatError(
  data: unknown,
  httpStatus: number
): { status: number; message: string } {
  const nested =
    data && typeof data === "object" && "error" in data
      ? (data as { error?: unknown }).error
      : undefined;

  let message = "Chat API error";
  let code: number | undefined;

  if (typeof nested === "string" && nested.trim()) {
    message = nested;
  } else if (nested && typeof nested === "object") {
    const error = nested as { message?: unknown; code?: unknown };
    if (typeof error.message === "string" && error.message.trim()) {
      message = error.message;
    }
    if (typeof error.code === "number") code = error.code;
  }

  const status = httpStatus >= 400 ? httpStatus : (code ?? httpStatus);
  return { status, message };
}

export type StreamPayload =
  | { kind: "empty" }
  | { kind: "content"; content: string }
  | { kind: "error"; status: number; message: string; body: unknown };

export function readStreamPayload(payload: string): StreamPayload {
  const trimmed = payload.trim();
  if (!trimmed || trimmed === "[DONE]") return { kind: "empty" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { kind: "empty" };
  }

  if (!parsed || typeof parsed !== "object") return { kind: "empty" };

  if ("error" in parsed && (parsed as { error?: unknown }).error) {
    const { status, message } = readChatError(parsed, 0);
    return { kind: "error", status, message, body: parsed };
  }

  const choice = (
    parsed as {
      choices?: Array<{ delta?: { content?: unknown }; message?: { content?: unknown } }>;
    }
  ).choices?.[0];
  const delta = choice?.delta?.content;
  const full = choice?.message?.content;
  const content = typeof delta === "string" ? delta : typeof full === "string" ? full : "";

  if (!content) return { kind: "empty" };
  return { kind: "content", content };
}

export type StreamInspection =
  | { kind: "pending" }
  | { kind: "content" }
  | { kind: "error"; status: number; message: string; body: unknown };

/** Look at a partial OpenRouter body without committing to a model that already failed. */
export function inspectBufferedStream(buffer: string): StreamInspection {
  const trimmed = buffer.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    const payload = readStreamPayload(trimmed);
    if (payload.kind === "error") return payload;
    if (payload.kind === "content") return { kind: "content" };
  }

  const lines = buffer.split("\n");
  const completeCount = buffer.endsWith("\n") ? lines.length : Math.max(0, lines.length - 1);
  let sawContent = false;

  for (let index = 0; index < completeCount; index += 1) {
    const payload = sseData(lines[index]);
    if (payload === null) continue;
    const parsed = readStreamPayload(payload);
    if (parsed.kind === "error" && !sawContent) return parsed;
    if (parsed.kind === "content") sawContent = true;
  }

  if (sawContent) return { kind: "content" };
  return { kind: "pending" };
}

function sseData(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) return null;
  return trimmed.slice(5).trim();
}
