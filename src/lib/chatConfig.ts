import {
  CHAT_COMPLETION_OPTIONS,
  getChatModelCandidates,
  isRetryableChatError,
} from "./chatModels";

export { getChatModelCandidates, isRetryableChatError };

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

/** Production proxy picks models server-side from CHAT_MODELS. */
export function getChatProxyBody(messages: unknown[], stream: boolean) {
  return { messages, stream };
}
