import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import SectionHeader from "./common/SectionHeader";
import Section from "./layout/Section";
import { itemVariants, containerVariants } from "@/lib/motionVariants";

const About = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Section id="about" alternate>
      <SectionHeader title={t("about.title")} subtitle={t("about.subtitle")} />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-12"
      >
        <motion.div
          variants={itemVariants}
          className="flex justify-center md:col-span-4"
        >
          <div className="relative h-40 w-40 overflow-hidden rounded-2xl border-2 border-primary-500/30 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 shadow-lg sm:h-48 sm:w-48">
            <div className="flex h-full w-full items-center justify-center font-display text-5xl font-bold text-primary-600 dark:text-primary-400">
              RA
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-8">
          <p className="mb-4 text-lg leading-relaxed text-dark-400 dark:text-light-300">
            {t("about.bio1")}
          </p>
          <p className="mb-4 text-lg leading-relaxed text-dark-400 dark:text-light-300">
            {t("about.bio2")}
          </p>
          <p className="text-lg leading-relaxed text-dark-400 dark:text-light-300">
            {t("about.bio3")}
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default About;
