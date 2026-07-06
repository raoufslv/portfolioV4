import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const dotAnimation = {
  initial: { opacity: 0.3, y: 0 },
  animate: { opacity: 1, y: -4 },
};

export default function ChatTypingIndicator() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 px-1 py-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-primary-500 dark:bg-primary-400"
            variants={dotAnimation}
            initial="initial"
            animate="animate"
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
      <span className="text-xs text-dark-400 dark:text-light-400">{t("about.thinking")}</span>
    </div>
  );
}
