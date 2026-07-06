import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  SiReact, SiTypescript, SiNextdotjs, SiTailwindcss,
  SiNodedotjs, SiPython, SiPostgresql, SiSupabase,
  SiVercel,
} from 'react-icons/si';
import SectionHeader from './common/SectionHeader';
import Section from './layout/Section';
import { GlowingEffect } from './ui/glowing-effect';
import { containerVariants, itemVariants } from '@/lib/motionVariants';

const TOP_LOGOS = [
  { name: 'React', icon: <SiReact className="h-7 w-7" /> },
  { name: 'TypeScript', icon: <SiTypescript className="h-7 w-7" /> },
  { name: 'Next.js', icon: <SiNextdotjs className="h-7 w-7" /> },
  { name: 'Tailwind', icon: <SiTailwindcss className="h-7 w-7" /> },
  { name: 'Node.js', icon: <SiNodedotjs className="h-7 w-7" /> },
  { name: 'PostgreSQL', icon: <SiPostgresql className="h-7 w-7" /> },
  { name: 'Supabase', icon: <SiSupabase className="h-7 w-7" /> },
  { name: 'Vercel AI', icon: <SiVercel className="h-7 w-7" /> },
];

const Skills: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const groups = [
    {
      key: 'skills.frontend',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      glow: true,
    },
    {
      key: 'skills.backend',
      skills: ['Node.js', 'Express', 'Python', 'REST APIs', 'PostgreSQL'],
      glow: false,
    },
    {
      key: 'skills.ai',
      skills: ['Vercel AI SDK', 'OpenAI API', 'Multi-agents', 'PyTorch'],
      glow: true,
    },
  ];

  return (
    <Section id="skills">
      <SectionHeader title={t('skills.title')} subtitle={t('skills.subtitle')} />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="mx-auto max-w-5xl"
      >
        <motion.div
          variants={itemVariants}
          className="mb-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {TOP_LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="flex flex-col items-center gap-1 text-primary-600 dark:text-primary-400"
              title={logo.name}
            >
              {logo.icon}
              <span className="text-xs font-medium text-dark-400 dark:text-light-300">{logo.name}</span>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {groups.map((group) => (
            <motion.div
              key={group.key}
              variants={itemVariants}
              className="relative rounded-xl border border-dark-400/10 bg-light-100 p-5 shadow-md dark:border-dark-300/20 dark:bg-dark-600"
            >
              {group.glow && (
                <GlowingEffect
                  spread={40}
                  glow
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
              )}
              <h3 className="mb-3 font-display text-lg font-semibold text-primary-600 dark:text-primary-400">
                {t(group.key)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-light-300 px-2.5 py-1 text-xs font-medium dark:bg-dark-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
};

export default Skills;
