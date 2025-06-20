import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { LampContainer } from "./ui/lamp";

const Hero: React.FC = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-light-100 dark:bg-dark-600"
    >


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 lg:pt-24 relative z-10">
        <motion.div
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <LampContainer className="">

            {/* Hero Content */}
            <motion.p
              className="text-lg md:text-xl mb-2 text-primary-600 dark:text-primary-400 font-medium"
              variants={itemVariants}
            >
              {t('hero.greeting')}
            </motion.p>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2"
              variants={itemVariants}
            >
              {t('hero.name')}
            </motion.h1>

            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-secondary-600 dark:text-secondary-400"
              variants={itemVariants}
            >
              {t('hero.title')}
            </motion.h2>

            <motion.p
              className="text-sm sm:text-base md:text-lg mb-8 max-w-2xl text-dark-400 dark:text-light-300"
              variants={itemVariants}
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto justify-center items-center"
              variants={itemVariants}
            >
              <Link
                to="projects"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {t('hero.cta')}
              </Link>
              <Link
                to="contact"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="px-6 py-3 border border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 font-medium rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all cursor-pointer"
              >
                {t('hero.contact')}
              </Link>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-12"
              variants={itemVariants}
            >
              <a
                href="https://github.com/raoufslv"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-light-300 dark:bg-dark-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/raoufslv/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-light-300 dark:bg-dark-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:devcode.raouf@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-light-300 dark:bg-dark-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Mail"
              >
                <Mail size={20} />
              </a>
            </motion.div>

            {/* Scroll Down Indicator */}
            <motion.div
              className="absolute bottom-[-4rem] md:bottom-[-2rem] left-1/2 transform -translate-x-1/2 flex flex-col items-center"
              animate={{ y: [0, 10, 0], x: [-40, -40, -40] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Link
                to="about"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="flex flex-col items-center cursor-pointer text-dark-400 dark:text-light-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <span className="text-sm font-medium mb-2">Scroll Down</span>
                <ArrowDown size={20} />
              </Link>
            </motion.div>
          </LampContainer>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;