import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, GraduationCap } from 'lucide-react';
import SectionHeader from './common/SectionHeader';
import Section from './layout/Section';
import { containerVariants, itemVariants } from '@/lib/motionVariants';

interface TimelineItem {
  id: number;
  title: string;
  organization: string;
  period: string;
  description: string;
  type: 'education' | 'experience';
  current?: boolean;
}

type ResumeFilter = 'all' | 'experience' | 'education';

const Resume: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [filter, setFilter] = useState<ResumeFilter>('experience');

  const timelineItems = t('resume.timeline', { returnObjects: true }) as TimelineItem[];
  const experienceItems = timelineItems.filter((item) => item.type === 'experience');
  const educationItems = timelineItems.filter((item) => item.type === 'education');

  const filters: { key: ResumeFilter; label: string }[] = [
    { key: 'all', label: t('resume.filterAll') },
    { key: 'experience', label: t('resume.experience') },
    { key: 'education', label: t('resume.education') },
  ];

  const showExperience = filter === 'all' || filter === 'experience';
  const showEducation = filter === 'all' || filter === 'education';

  const isCurrent = (item: TimelineItem) =>
    item.current ?? /present|présent/i.test(item.period);

  const renderTimeline = (
    items: TimelineItem[],
    accent: 'primary' | 'secondary'
  ) => (
    <div
      className={`relative space-y-6 border-l-2 pl-8 ${
        accent === 'primary'
          ? 'border-primary-600 dark:border-primary-400'
          : 'border-secondary-600 dark:border-secondary-400'
      }`}
    >
      {items.map((item) => (
        <div key={item.id} className="relative">
          <div
            className={`absolute -left-[41px] h-5 w-5 rounded-full border-4 border-light-100 dark:border-dark-600 ${
              accent === 'primary'
                ? 'bg-primary-600 dark:bg-primary-400'
                : 'bg-secondary-600 dark:bg-secondary-400'
            }`}
          />
          <div className="rounded-lg bg-light-100 p-5 shadow-md transition-shadow hover:shadow-lg dark:bg-dark-600">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                  accent === 'primary'
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-900/20 dark:text-secondary-400'
                }`}
              >
                {item.period}
              </span>
              {isCurrent(item) && (
                <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400">
                  {t('resume.current')}
                </span>
              )}
            </div>
            <h4 className="text-lg font-semibold">{item.title}</h4>
            <p
              className={`mb-2 text-sm ${
                accent === 'primary'
                  ? 'text-secondary-600 dark:text-secondary-400'
                  : 'text-primary-600 dark:text-primary-400'
              }`}
            >
              {item.organization}
            </p>
            <p className="text-sm text-dark-400 dark:text-light-300">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Section id="resume" alternate>
      <SectionHeader title={t('resume.title')} subtitle={t('resume.subtitle')} />

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              filter === f.key
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-light-300 hover:bg-primary-100 dark:bg-dark-400 dark:hover:bg-primary-900/20'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div ref={ref}>
        <motion.div
          key={filter}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className={`grid gap-8 ${
            filter === 'all' ? 'grid-cols-1 lg:grid-cols-2' : 'mx-auto max-w-2xl grid-cols-1'
          }`}
        >
          {showExperience && (
            <motion.div variants={itemVariants}>
              <div className="mb-6 flex items-center">
                <Briefcase className="mr-2 text-primary-600 dark:text-primary-400" size={24} />
                <h3 className="font-display text-2xl font-bold">{t('resume.experience')}</h3>
              </div>
              {renderTimeline(experienceItems, 'primary')}
            </motion.div>
          )}
          {showEducation && (
            <motion.div variants={itemVariants}>
              <div className="mb-6 flex items-center">
                <GraduationCap className="mr-2 text-secondary-600 dark:text-secondary-400" size={24} />
                <h3 className="font-display text-2xl font-bold">{t('resume.education')}</h3>
              </div>
              {renderTimeline(educationItems, 'secondary')}
            </motion.div>
          )}
        </motion.div>
      </div>
    </Section>
  );
};

export default Resume;
