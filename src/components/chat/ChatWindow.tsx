import { RefObject } from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
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
}: ChatWindowProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-primary-500/20 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-dark-600/90"
    >
      <div className="flex items-center justify-between border-b border-dark-400/10 px-5 py-4 dark:border-dark-300/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-dark-600 dark:text-light-100">
              {t("about.description1")}
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-dark-400 dark:text-light-400">{t("about.online")}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="chat-scrollbar min-h-[420px] h-[min(560px,62dvh)] max-h-[75dvh] space-y-4 overflow-y-auto bg-light-100/50 px-4 py-5 sm:min-h-[480px] sm:h-[min(620px,68dvh)] sm:px-5 dark:bg-dark-500/30"
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
      />
    </motion.div>
  );
}
