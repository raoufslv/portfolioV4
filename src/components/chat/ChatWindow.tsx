import { RefObject } from "react";
import { Bot, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatTypingIndicator from "./ChatTypingIndicator";
import SuggestedPrompts from "./SuggestedPrompts";

interface Message {
  role: string;
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  input: string;
  loading: boolean;
  containerRef: RefObject<HTMLDivElement>;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onPromptSelect: (prompt: string) => void;
  showSuggestedPrompts: boolean;
  variant?: "section" | "floating";
  onClose?: () => void;
}

export default function ChatWindow({
  messages,
  input,
  loading,
  containerRef,
  onInputChange,
  onSend,
  onPromptSelect,
  showSuggestedPrompts,
  variant = "section",
  onClose,
}: ChatWindowProps) {
  const { t } = useTranslation();
  const isFloating = variant === "floating";

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-primary-500/20 bg-white/95 shadow-2xl backdrop-blur-md dark:bg-dark-600/95 ${
        isFloating ? "w-full" : "mx-auto max-w-4xl shadow-xl"
      }`}
    >
      <div className="flex items-center justify-between border-b border-dark-400/10 px-4 py-3 dark:border-dark-300/20 sm:px-5 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400 sm:h-10 sm:w-10">
            <Bot size={isFloating ? 20 : 22} />
          </div>
          <div>
            <h2 className="text-base font-bold text-dark-600 dark:text-light-100 sm:text-lg">
              {t("about.description1")}
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-dark-400 dark:text-light-400">{t("about.online")}</span>
            </div>
          </div>
        </div>
        {isFloating && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-dark-400 transition-colors hover:bg-light-200 hover:text-dark-600 dark:text-light-400 dark:hover:bg-dark-500 dark:hover:text-light-100"
            aria-label={t("chat.close")}
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className={`chat-scrollbar space-y-4 overflow-y-auto bg-light-100/50 px-4 py-4 dark:bg-dark-500/30 sm:px-5 sm:py-5 ${
          isFloating
            ? "h-[min(52dvh,28rem)]"
            : "min-h-[420px] h-[min(560px,62dvh)] max-h-[75dvh] sm:min-h-[480px] sm:h-[min(620px,68dvh)]"
        }`}
      >
        {messages.map((msg, idx) => {
          const isStreamingMessage =
            loading && idx === messages.length - 1 && msg.role === "assistant" && msg.content.length > 0;

          if (loading && idx === messages.length - 1 && msg.role === "assistant" && msg.content === "") {
            return null;
          }

          return (
            <ChatMessage
              key={idx}
              role={msg.role}
              content={msg.content}
              isStreaming={isStreamingMessage}
            />
          );
        })}

        {showSuggestedPrompts && (
          <SuggestedPrompts onSelect={onPromptSelect} />
        )}

        {loading &&
          messages[messages.length - 1]?.role === "assistant" &&
          messages[messages.length - 1]?.content === "" && (
          <div className="flex gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
              <Bot size={16} />
            </div>
            <div className="rounded-2xl rounded-bl-md border border-dark-400/10 bg-light-200 px-4 py-2 dark:border-dark-300/20 dark:bg-dark-400/40">
              <ChatTypingIndicator />
            </div>
          </div>
        )}
      </div>

      <ChatInput
        value={input}
        loading={loading}
        onChange={onInputChange}
        onSend={onSend}
        compact={isFloating}
      />
    </div>
  );
}
