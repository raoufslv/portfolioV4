import { motion } from "framer-motion";
import { X, ExternalLink, Github } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Project } from "@/data/projects";
import ProjectPlaceholder from "../common/ProjectPlaceholder";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t } = useTranslation();
  const accent = project.accentColor ?? "#0ea5e9";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-500/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-dark-400/10 bg-light-100 shadow-xl dark:border-dark-300/20 dark:bg-dark-600"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-light-300 bg-light-100/95 px-6 py-4 backdrop-blur dark:border-dark-400 dark:bg-dark-600/95">
          <h3 id="project-modal-title" className="font-display text-2xl font-bold">
            {project.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-dark-400 transition-colors hover:bg-light-300 dark:text-light-300 dark:hover:bg-dark-400"
            aria-label={t("projects.closeModal")}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {project.caseStudy && (
            <div
              className="mb-6 space-y-4 rounded-lg border p-5"
              style={{ borderColor: `${accent}44`, backgroundColor: `${accent}08` }}
            >
              <div>
                <h4 className="mb-1 text-sm font-semibold uppercase tracking-wide text-dark-400 dark:text-light-300">
                  {t("projects.caseStudyProblem")}
                </h4>
                <p className="text-sm">{project.caseStudy.problem}</p>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-semibold uppercase tracking-wide text-dark-400 dark:text-light-300">
                  {t("projects.caseStudyRole")}
                </h4>
                <p className="text-sm">{project.caseStudy.role}</p>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-semibold uppercase tracking-wide text-dark-400 dark:text-light-300">
                  {t("projects.caseStudyResult")}
                </h4>
                <p className="text-sm">{project.caseStudy.result}</p>
              </div>
            </div>
          )}

          <div className="mb-6 max-h-[300px] overflow-y-auto chat-scrollbar">
            {project.confidential ? (
              <div className="space-y-4">
                <ProjectPlaceholder title={project.title} variant="modal" />
                {project.highlights && project.highlights.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-lg font-semibold">{t("projects.confidential.highlights")}</h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-dark-400 dark:text-light-300">
                      {project.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              project.images.map((image, index) => (
                <div key={index} className="mb-5">
                  <p className="mb-2 text-sm font-medium text-dark-400 dark:text-light-300">
                    {t("projects.page", { n: index + 1 })}
                  </p>
                  <img
                    src={image}
                    alt={`${project.title} — ${t("projects.page", { n: index + 1 })}`}
                    loading="lazy"
                    className="w-full rounded-lg border border-light-300 object-cover dark:border-dark-400"
                  />
                </div>
              ))
            )}
          </div>

          <p className="mb-4 text-dark-400 dark:text-light-300">{project.description}</p>

          <div className="mb-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-light-300 px-3 py-1 text-sm font-medium dark:bg-dark-400"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                <ExternalLink size={16} className="mr-2" />
                {t("projects.viewDemo")}
              </a>
            )}
            {project.codeUrl && (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-dark-400/20 bg-light-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-light-400 dark:border-dark-300/30 dark:bg-dark-400 dark:hover:bg-dark-300"
              >
                <Github size={16} className="mr-2" />
                {t("projects.viewCode")}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
