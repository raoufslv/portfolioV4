import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Project } from "@/data/projects";
import ProjectPlaceholder from "../common/ProjectPlaceholder";
import { itemVariants } from "@/lib/motionVariants";

const FEATURED_IDS = [0, 14, 1];

interface FeaturedBentoProps {
  projects: Project[];
  onSelect: (id: number) => void;
}

export default function FeaturedBento({ projects, onSelect }: FeaturedBentoProps) {
  const { t } = useTranslation();
  const featured = FEATURED_IDS.map((id) => projects.find((p) => p.id === id)).filter(
    (p): p is Project => Boolean(p)
  );
  const [hero, ...secondary] = featured;

  if (!hero) return null;

  const renderCard = (project: Project, large = false) => (
    <motion.article
      key={project.id}
      variants={itemVariants}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-dark-400/10 bg-light-100 shadow-md transition-shadow hover:shadow-xl dark:border-dark-300/20 dark:bg-dark-600 ${
        large ? "col-span-12 h-full lg:col-span-8" : ""
      }`}
      style={{ borderColor: project.accentColor ? `${project.accentColor}33` : undefined }}
    >
      <div
        className={`relative shrink-0 overflow-hidden ${
          large ? "min-h-48 flex-1 sm:min-h-56" : "h-40"
        }`}
      >
        {project.confidential ? (
          <ProjectPlaceholder title={project.title} variant="card" />
        ) : (
          <img
            src={project.headerImage || project.images[0]}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-dark-500/90 via-dark-500/20 to-transparent"
          aria-hidden
        />
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <h3 className={`font-display font-bold text-light-100 ${large ? "text-2xl sm:text-3xl" : "text-lg"}`}>
            {project.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-light-200/90">{project.description}</p>
        </div>
      </div>

      <div className="shrink-0 space-y-4 p-5 sm:p-6">
        {large && project.confidential && project.highlights && project.highlights.length > 0 && (
          <ul className="space-y-1.5 border-t border-light-300/60 pt-4 dark:border-dark-400/60">
            {project.highlights.slice(0, 4).map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2 text-sm text-dark-400 dark:text-light-300"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: project.accentColor ?? "#0ea5e9" }}
                  aria-hidden
                />
                {highlight}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, large ? 5 : 3).map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-light-300 px-2.5 py-0.5 text-xs font-medium dark:bg-dark-400"
              >
                {tech}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onSelect(project.id)}
            className="inline-flex items-center text-sm font-semibold transition-colors"
            style={{ color: project.accentColor ?? undefined }}
          >
            {t("projects.caseStudy")}
            <ExternalLink size={14} className="ml-1" />
          </button>
        </div>
      </div>
    </motion.article>
  );

  return (
    <div className="mb-16 grid grid-cols-12 items-stretch gap-6">
      {renderCard(hero, true)}
      <div className="col-span-12 flex flex-col gap-6 lg:col-span-4">
        {secondary.map((project) => renderCard(project))}
      </div>
    </div>
  );
}
