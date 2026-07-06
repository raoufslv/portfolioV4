import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHeader from "./common/SectionHeader";
import Section from "./layout/Section";
import FeaturedBento from "./projects/FeaturedBento";
import ProjectCard from "./projects/ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import { containerVariants, itemVariants } from "@/lib/motionVariants";

const ProjectModal = lazy(() => import("./projects/ProjectModal"));

const Projects = () => {
  const { t } = useTranslation();
  const projects = useProjects();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeFilter, setActiveFilter] = useState("web");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const filters = [
    { key: "all", label: t("projects.filter.all") },
    { key: "web", label: t("projects.filter.web") },
    { key: "mobile", label: t("projects.filter.mobile") },
    { key: "game", label: t("projects.filter.game") },
    { key: "ai", label: t("projects.filter.ai") },
    { key: "design", label: t("projects.filter.design") },
  ];

  const featuredIds = new Set([0, 14, 1]);
  const secondaryProjects = projects.filter((p) => !featuredIds.has(p.id));
  const filteredProjects =
    activeFilter === "all"
      ? secondaryProjects
      : secondaryProjects.filter((p) => p.categories.includes(activeFilter));

  const selected = selectedProject !== null ? projects.find((p) => p.id === selectedProject) : null;

  return (
    <Section id="projects">
      <SectionHeader title={t("projects.title")} subtitle={t("projects.subtitle")} />

      <FeaturedBento projects={projects} onSelect={setSelectedProject} />

      <h3 className="mb-6 text-center font-display text-section font-semibold">
        {t("projects.other")}
      </h3>

      <motion.div
        className="mb-12 flex flex-wrap justify-center gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filters.map((filter) => (
          <motion.button
            key={filter.key}
            type="button"
            onClick={() => setActiveFilter(filter.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeFilter === filter.key
                ? "bg-primary-600 text-white shadow-md"
                : "bg-light-300 hover:bg-primary-100 hover:text-primary-600 dark:bg-dark-400 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
            }`}
            variants={itemVariants}
          >
            {filter.label}
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        ref={ref}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              compact
              hoveredId={hoveredProject}
              onHover={setHoveredProject}
              onSelect={setSelectedProject}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <Suspense fallback={null}>
            <ProjectModal project={selected} onClose={() => setSelectedProject(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default Projects;
