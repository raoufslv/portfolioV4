import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, LucideIcon } from 'lucide-react';
import { LampContainer } from './ui/lamp';

const SCROLL_LINK_PROPS = {
  spy: true,
  smooth: true,
  offset: -70,
  duration: 500,
} as const;

const HERO_CONTENT_ANIMATION = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
};

const SOCIAL_LINKS = [
  { href: 'https://github.com/raoufslv', label: 'GitHub', icon: Github },
  { href: 'https://www.linkedin.com/in/raoufslv/', label: 'LinkedIn', icon: Linkedin },
  { href: 'mailto:devcode.raouf@gmail.com', label: 'Mail', icon: Mail },
] as const;

const socialLinkClassName =
  'rounded-full bg-light-300 p-2.5 transition-colors hover:bg-primary-100 hover:text-primary-600 dark:bg-dark-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-400';

function SocialIconLink({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={socialLinkClassName} aria-label={label}>
      <Icon size={20} />
    </a>
  );
}

function HeroCtaButtons({ projectsLabel, contactLabel }: { projectsLabel: string; contactLabel: string }) {
  return (
    <div className="mb-8 flex w-full flex-col items-center justify-center gap-3 sm:mb-10 sm:w-auto sm:flex-row sm:gap-4">
      <Link
        to="projects"
        {...SCROLL_LINK_PROPS}
        className="w-full cursor-pointer rounded-lg bg-primary-600 px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg sm:w-auto"
      >
        {projectsLabel}
      </Link>
      <Link
        to="contact"
        {...SCROLL_LINK_PROPS}
        className="w-full cursor-pointer rounded-lg border border-primary-600 px-6 py-3 font-medium text-primary-600 transition-all hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/10 sm:w-auto"
      >
        {contactLabel}
      </Link>
    </div>
  );
}

function HeroSocialLinks() {
  return (
    <div className="mb-6 flex flex-wrap justify-center gap-3 sm:mb-8 sm:gap-4">
      {SOCIAL_LINKS.map((link) => (
        <SocialIconLink key={link.label} {...link} />
      ))}
    </div>
  );
}

function HeroScrollHint() {
  const { t } = useTranslation();

  return (
    <motion.div
      className="flex flex-col items-center pb-6 sm:pb-8"
      animate={{ y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
    >
      <Link
        to="about"
        {...SCROLL_LINK_PROPS}
        className="flex cursor-pointer flex-col items-center text-dark-400 transition-colors hover:text-primary-600 dark:text-light-300 dark:hover:text-primary-400"
      >
        <span className="mb-2 text-sm font-medium">{t('hero.scroll')}</span>
        <ArrowDown size={20} />
      </Link>
    </motion.div>
  );
}

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-4.5rem)] flex-col items-center justify-center overflow-hidden bg-light-100 py-8 dark:bg-dark-600 sm:min-h-[calc(100svh-4rem)]"
    >
      <div className="container relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <LampContainer>
          <motion.div
            className="flex w-full flex-col items-center text-center"
            {...HERO_CONTENT_ANIMATION}
          >
            <motion.div
              className="mb-3 h-px w-[10rem] bg-cyan-400 sm:mb-4 sm:w-[14rem] md:w-[20rem] lg:w-[26rem] xl:w-[32rem]"
              initial={{ opacity: 0, scaleX: 0.5 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            />

            <p className="mb-2 text-base font-medium text-primary-600 dark:text-primary-400 sm:text-lg md:text-xl">
              {t('hero.greeting')}
            </p>

            <h1 className="mb-2 text-3xl font-bold text-dark-600 dark:text-light-100 sm:text-4xl md:text-5xl lg:text-6xl">
              {t('hero.name')}
            </h1>

            <h2 className="mb-4 text-lg font-semibold text-secondary-600 dark:text-secondary-400 sm:mb-6 sm:text-xl md:text-2xl lg:text-3xl">
              {t('hero.title')}
            </h2>

            <p className="mb-6 max-w-2xl text-sm text-dark-400 dark:text-light-300 sm:mb-8 sm:text-base md:text-lg">
              {t('hero.description')}
            </p>

            <HeroCtaButtons projectsLabel={t('hero.cta')} contactLabel={t('hero.contact')} />
            <HeroSocialLinks />
            <HeroScrollHint />
          </motion.div>
        </LampContainer>
      </div>
    </section>
  );
};

export default Hero;
