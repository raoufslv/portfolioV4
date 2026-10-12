import { CHAT_COMPLETION_OPTIONS, CHAT_MODELS, getChatModelCandidates, isRetryableChatError } from "./chatModels";

export { getChatModelCandidates, isRetryableChatError };

export function getPrimaryChatModel(): string {
  return import.meta.env.VITE_OPENROUTER_MODEL ?? CHAT_MODELS[0];
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
