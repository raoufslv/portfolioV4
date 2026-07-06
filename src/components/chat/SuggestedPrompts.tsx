import { useTranslation } from "react-i18next";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

export default function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  const { t } = useTranslation();

  const prompts = [
    { key: "about.suggestedProjects", value: t("about.suggestedProjectsQuery") },
    { key: "about.suggestedStack", value: t("about.suggestedStackQuery") },
    { key: "about.suggestedExperience", value: t("about.suggestedExperienceQuery") },
  ];

  return (
    <div className="flex flex-wrap gap-2 px-1 pt-1">
      {prompts.map((prompt) => (
        <button
          key={prompt.key}
          type="button"
          onClick={() => onSelect(prompt.value)}
          className="rounded-full border border-primary-500/30 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:border-primary-500/50 hover:bg-primary-100 dark:border-primary-400/30 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/40"
        >
          {t(prompt.key)}
        </button>
      ))}
    </div>
  );
}
