import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import Section from "./layout/Section";
import { itemVariants, containerVariants } from "@/lib/motionVariants";

const LOGOS = ["Rakoono", "Station F"];

const Testimonial = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Section id="testimonial" alternate>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.blockquote
          variants={itemVariants}
          className="mb-8 text-lg italic leading-relaxed text-dark-400 dark:text-light-300 md:text-xl"
        >
          &ldquo;{t("testimonial.quote")}&rdquo;
        </motion.blockquote>
        <motion.p variants={itemVariants} className="mb-10 text-sm font-medium text-dark-400 dark:text-light-300">
          — {t("testimonial.author")}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
        >
          {LOGOS.map((logo) => (
            <span
              key={logo}
              className="rounded-lg border border-light-300 bg-light-100 px-5 py-2.5 font-display text-sm font-semibold tracking-wide text-dark-400 dark:border-dark-400 dark:bg-dark-600 dark:text-light-300"
            >
              {logo}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default Testimonial;
