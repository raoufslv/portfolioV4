import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getProjects } from "@/lib/getProjects";

export function useProjects() {
  const { t, i18n } = useTranslation();
  return useMemo(() => getProjects(t), [t, i18n.language]);
}
