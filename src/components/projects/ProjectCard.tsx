import { motion } from "framer-motion";
import { ExternalLink, Github, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import type { Project } from "@/data/projects";
import ProjectPlaceholder from "../common/ProjectPlaceholder";
import { itemVariants } from "@/lib/motionVariants";

interface ProjectCardProps {
  project: Project;
  compact?: boolean;
  hoveredId: number | null;
  onHover: (id: number | null) => void;
  onSelect: (id: number) => void;
}

export default function ProjectCard({
  project,
  compact = false,
  hoveredId,
  onHover,
  onSelect,
}: ProjectCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={itemVariants}
      layout
      className="overflow-hidden rounded-xl border border-dark-400/10 bg-light-100 shadow-md transition-shadow hover:shadow-xl dark:border-dark-300/20 dark:bg-dark-600"
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={`relative overflow-hidden ${compact ? "h-36" : "h-48"}`}>
        {project.confidential ? (
          <ProjectPlaceholder title={project.title} variant="card" />
        ) : (
          <img
            src={project.headerImage || project.images[0]}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        )}
        <AnimatePresence>
          {hoveredId === project.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center gap-4 bg-dark-500/80"
            >
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-primary-600 p-2 text-white hover:bg-primary-700"
                  aria-label={`${t("projects.viewDemo")} - ${project.title}`}
                >
                  <Eye size={20} />
                </a>
              )}
              {project.codeUrl && (
                <a
                  href={project.codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-secondary-600 p-2 text-white hover:bg-secondary-700"
                  aria-label={`${t("projects.viewCode")} - ${project.title}`}
                >
                  <Github size={20} />
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={compact ? "p-4" : "p-6"}>
        <h3 className={`font-semibold ${compact ? "text-lg" : "text-xl"} mb-2`}>
          {project.title}
        </h3>
        <p className="mb-4 text-sm text-dark-400 dark:text-light-300 line-clamp-2">
          {project.description}
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, compact ? 3 : 5).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-light-300 px-2 py-1 text-xs dark:bg-dark-400"
            >
              {tech}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onSelect(project.id)}
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
        >
          {t("projects.details")}
          <ExternalLink size={16} className="ml-1" />
        </button>
      </div>
    </motion.div>
  );
}
