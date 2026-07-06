import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import ChatMarkdown from "./ChatMarkdown";

interface ChatMessageProps {
  role: string;
  content: string;
  isStreaming?: boolean;
}

export default function ChatMessage({ role, content, isStreaming = false }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-primary-600 text-white"
            : "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 sm:max-w-[80%] ${
          isUser
            ? "rounded-br-md bg-primary-600 text-white"
            : "rounded-bl-md border border-dark-400/10 bg-light-200 text-dark-600 dark:border-dark-300/20 dark:bg-dark-400/40 dark:text-light-300"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
        ) : (
          <>
            <ChatMarkdown content={content} />
            {isStreaming && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary-500 align-middle dark:bg-primary-400" />
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
