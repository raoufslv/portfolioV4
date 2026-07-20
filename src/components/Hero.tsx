import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, LucideIcon } from 'lucide-react';
import { LampContainer } from './ui/lamp';
import { useChatWidget } from '@/context/ChatWidgetContext';

const SCROLL_LINK_PROPS = {
  spy: true,
  smooth: true,
  offset: -80,
  duration: 500,
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const SOCIAL_LINKS = [
  { href: 'https://github.com/raoufslv', label: 'GitHub', icon: Github },
  { href: 'https://www.linkedin.com/in/raoufslv/', label: 'LinkedIn', icon: Linkedin },
  { href: 'mailto:raouf.abdallah03@gmail.com', label: 'Mail', icon: Mail },
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

function HeroCtaButtons({ workLabel, chatLabel }: { workLabel: string; chatLabel: string }) {
  const { open } = useChatWidget();

  return (
    <motion.div variants={fadeUp} className="mb-8 flex w-full flex-col items-center justify-center gap-3 sm:mb-10 sm:w-auto sm:flex-row sm:gap-4">
      <Link
        to="projects"
        {...SCROLL_LINK_PROPS}
        className="w-full cursor-pointer rounded-lg bg-primary-600 px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg sm:w-auto"
      >
        {workLabel}
      </Link>
      <button
        type="button"
        onClick={open}
        className="w-full cursor-pointer rounded-lg border border-secondary-600 px-6 py-3 font-medium text-secondary-600 transition-all hover:bg-secondary-50 dark:border-secondary-400 dark:text-secondary-400 dark:hover:bg-secondary-900/10 sm:w-auto"
      >
        {chatLabel}
      </button>
    </motion.div>
  );
}

function HeroSocialLinks() {
  return (
    <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 sm:gap-4">
      {SOCIAL_LINKS.map((link) => (
        <SocialIconLink key={link.label} {...link} />
      ))}
    </motion.div>
  );
}

function HeroScrollHint() {
  const { t } = useTranslation();

  return (
    <motion.div
      className="flex shrink-0 flex-col items-center pb-4 sm:pb-6 motion-reduce:animate-none"
      animate={{ y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
    >
      <Link
        to="projects"
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
      className="relative flex min-h-screen min-h-dvh flex-col overflow-hidden bg-light-100 dark:bg-dark-600"
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pt-16 sm:px-6 sm:pt-[4.5rem] lg:px-8">
        <motion.div
          className="flex w-full max-w-3xl flex-col items-center text-center"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <LampContainer>
            <motion.p
              variants={fadeUp}
              className="mb-1 pt-2 text-base font-medium text-primary-600 dark:text-primary-400 sm:mb-2 sm:pt-3 sm:text-lg md:pt-4 md:text-xl"
            >
              {t('hero.greeting')}
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="font-display mb-2 text-display font-bold tracking-tight text-dark-600 dark:text-light-100"
            >
              {t('hero.name')}
            </motion.h1>

            <motion.h2
              variants={fadeUp}
              className="text-lg font-semibold text-secondary-600 dark:text-secondary-400 sm:text-xl md:text-2xl lg:text-3xl"
            >
              {t('hero.title')}
            </motion.h2>
          </LampContainer>

          <motion.p
            variants={fadeUp}
            className="mb-3 mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-primary-600 dark:text-primary-400 sm:mt-5"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
              {t('hero.status')}
            </span>
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mb-6 max-w-2xl text-sm text-dark-400 dark:text-light-300 sm:mb-8 sm:text-base md:text-lg"
          >
            {t('hero.description')}
          </motion.p>

          <HeroCtaButtons workLabel={t('hero.cta')} chatLabel={t('hero.ctaChat')} />
          <HeroSocialLinks />
        </motion.div>
      </div>

      <HeroScrollHint />
    </section>
  );
};

export default Hero;
