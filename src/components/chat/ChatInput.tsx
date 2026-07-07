import { useRef, useEffect, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChatInputProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  compact?: boolean;
}

export default function ChatInput({ value, loading, onChange, onSend, compact = false }: ChatInputProps) {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && value.trim()) onSend();
    }
  };

  const inputSize = compact ? "min-h-[44px]" : "min-h-[52px]";
  const buttonSize = compact ? "h-[44px] w-[44px]" : "h-[52px] w-[52px]";

  return (
    <div className={`flex items-end gap-2 border-t border-dark-400/10 bg-light-50/80 dark:border-dark-300/20 dark:bg-dark-500/50 ${compact ? "p-3" : "p-4"}`}>
      <textarea
        ref={textareaRef}
        rows={compact ? 1 : 2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        placeholder={t("about.chatPlaceholder")}
        className={`scrollbar-none max-h-[120px] overflow-y-auto ${inputSize} flex-1 resize-none rounded-xl border border-dark-400/15 bg-white px-3 py-2.5 text-sm text-dark-700 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-60 dark:border-dark-300/30 dark:bg-dark-400 dark:text-light-100 dark:placeholder:text-light-400 sm:px-4 sm:py-3`}
      />
      <button
        type="button"
        onClick={onSend}
        disabled={loading || !value.trim()}
        aria-label={t("about.sendButton")}
        className={`flex ${buttonSize} shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <Send size={compact ? 18 : 20} />
      </button>
    </div>
  );
}
