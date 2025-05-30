import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, GraduationCap } from 'lucide-react';
import SectionHeader from './common/SectionHeader';

interface TimelineItem {
  id: number;
  title: string;
  organization: string;
  period: string;
  description: string;
  type: 'education' | 'experience';
}

const Resume: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const timelineItems = t('resume.timeline', { returnObjects: true }) as TimelineItem[];
  const experienceItems = timelineItems.filter(item => item.type === 'experience');
  const educationItems = timelineItems.filter(item => item.type === 'education');


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="resume" className="py-20 bg-light-100 dark:bg-dark-600">
      <div className="container  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-section">
        <SectionHeader title={t('resume.title')} subtitle={t('resume.subtitle')} />
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4"
        >
          {/* Experience Section */}
          <div>
            <div className="flex items-center mb-6">
              <Briefcase className="text-primary-600 dark:text-primary-400 mr-2" size={24} />
              <h3 className="text-2xl font-bold">{t('resume.experience')}</h3>
            </div>

            <div className="relative pl-8 border-l-2 border-primary-600 dark:border-primary-400 space-y-8">
              {experienceItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="absolute -left-[41px] bg-primary-600 dark:bg-primary-400 w-5 h-5 rounded-full border-4 border-light-100 dark:border-dark-600" />

                  <div className="bg-light-200 dark:bg-dark-500 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full mb-2">
                      {item.period}
                    </span>
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-2">{item.organization}</p>
                    <p className="text-dark-400 dark:text-light-300 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div>
            <div className="flex items-center mb-6">
              <GraduationCap className="text-secondary-600 dark:text-secondary-400 mr-2" size={24} />
              <h3 className="text-2xl font-bold">{t('resume.education')}</h3>
            </div>

            <div className="relative pl-8 border-l-2 border-secondary-600 dark:border-secondary-400 space-y-8">
              {educationItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="absolute -left-[41px] bg-secondary-600 dark:bg-secondary-400 w-5 h-5 rounded-full border-4 border-light-100 dark:border-dark-600" />

                  <div className="bg-light-200 dark:bg-dark-500 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <span className="inline-block px-3 py-1 bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 text-xs font-medium rounded-full mb-2">
                      {item.period}
                    </span>
                    <h4 className="text-lg font-semibold">{item.title}</h4>
                    <p className="text-primary-600 dark:text-primary-400 text-sm mb-2">{item.organization}</p>
                    <p className="text-dark-400 dark:text-light-300 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;