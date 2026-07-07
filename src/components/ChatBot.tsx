import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X } from "lucide-react";
import ChatWindow from "./chat/ChatWindow";
import { streamChatCompletion } from "./chat/streamChatCompletion";
import { assistantSystemMessage } from "@/data/assistant-context";
import { useChatWidget } from "@/context/ChatWidgetContext";

import { getPrimaryChatModel } from "@/lib/chatConfig";

interface Message {
  role: string;
  content: string;
}

export default function ChatBot() {
  const { t, i18n } = useTranslation();
  const { isOpen, close, toggle } = useChatWidget();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: t("about.description2") },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMessages((prev) => {
      const first = prev[0];
      if (first?.role === "assistant") {
        return [{ ...first, content: t("about.description2") }, ...prev.slice(1)];
      }
      return prev;
    });
  }, [i18n.language, t]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (widgetRef.current?.contains(event.target as Node)) return;
      close();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, close]);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom, isOpen]);

  const sendMessage = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || loading) return;

    const userMessage = { role: "user", content: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages([...updatedMessages, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      await streamChatCompletion({
        messages: [assistantSystemMessage, ...updatedMessages],
        model: getPrimaryChatModel(),
        onChunk: (chunk) => {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant") {
              next[next.length - 1] = {
                ...last,
                content: last.content + chunk,
              };
            }
            return next;
          });
        },
        signal: abortController.signal,
      });

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && !last.content.trim()) {
          return [
            ...prev.slice(0, -1),
            { role: "assistant", content: t("about.errorMessage") },
          ];
        }
        return prev;
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;

      console.error("Error fetching response:", error);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content === "") {
          return [
            ...prev.slice(0, -1),
            { role: "assistant", content: t("about.errorMessage") },
          ];
        }
        return [...prev, { role: "assistant", content: t("about.errorMessage") }];
      });
    } finally {
      if (abortRef.current === abortController) {
        abortRef.current = null;
      }
      setLoading(false);
    }
  };

  const showSuggestedPrompts = messages.length === 1 && messages[0]?.role === "assistant";

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] sm:bottom-6 sm:right-6">
      <div ref={widgetRef} className="pointer-events-auto relative">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="chat-panel"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformOrigin: "bottom right" }}
              className="absolute bottom-full right-0 mb-3 w-[min(calc(100vw-2rem),24rem)] sm:w-[min(calc(100vw-3rem),26rem)]"
            >
              <ChatWindow
                variant="floating"
                messages={messages}
                input={input}
                loading={loading}
                containerRef={containerRef}
                onInputChange={setInput}
                onSend={() => sendMessage()}
                onPromptSelect={(prompt) => {
                  setInput(prompt);
                  sendMessage(prompt);
                }}
                onClose={close}
                showSuggestedPrompts={showSuggestedPrompts}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? t("chat.close") : t("chat.open")}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg shadow-primary-600/30 transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:ring-offset-dark-500"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} aria-hidden />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <Bot size={24} aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
        {!isOpen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-primary-600 bg-emerald-400" />
          </span>
        )}
        </motion.button>
      </div>
    </div>
  );
}
