import type { TFunction } from "i18next";
import { projectMeta, type Project } from "@/data/projects";

interface ProjectText {
  description: string;
  highlights?: string[];
  caseStudy?: { problem: string; role: string; result: string };
}

export function getProjects(t: TFunction): Project[] {
  const items = t("projects.items", { returnObjects: true }) as Record<string, ProjectText>;

  return projectMeta.map((meta) => {
    const text = items[String(meta.id)] ?? { description: "" };
    return {
      ...meta,
      description: text.description,
      highlights: text.highlights,
      caseStudy: text.caseStudy,
    };
  });
}
