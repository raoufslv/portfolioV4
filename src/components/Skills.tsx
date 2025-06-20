import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeader from './common/SectionHeader';
import {
  SiReact, SiTypescript, SiHtml5, SiCss3, SiTailwindcss, SiNextdotjs,
  SiNodedotjs, SiExpress, SiPhp, SiLaravel,
  SiMysql, SiMongodb, SiPostgresql, SiRedis, SiDocker, SiGit, SiGithubactions, SiLinux,
  SiFlutter, SiDart, SiAndroidstudio, SiPython,
  SiPytorch, SiTensorflow, SiOpencv, SiScikitlearn,
  SiFigma, SiPostman, SiFastapi
} from 'react-icons/si';
import { GlowingEffect } from "./ui/glowing-effect";

interface Skill {
  name: string;
  icon: React.ReactNode;
}

interface SkillCategory {
  title: string;
  translationKey: string;
  skills: Skill[];
}

const Skills: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const skillCategories: SkillCategory[] = [
    {
      title: 'Frontend',
      translationKey: 'skills.frontend',
      skills: [
        { name: 'HTML5', icon: <SiHtml5 className="w-8 h-8" /> },
        { name: 'CSS3', icon: <SiCss3 className="w-8 h-8" /> },
        { name: 'TypeScript', icon: <SiTypescript className="w-8 h-8" /> },
        { name: 'React', icon: <SiReact className="w-8 h-8" /> },
        { name: 'Next.js', icon: <SiNextdotjs className="w-8 h-8" /> },
        { name: 'Tailwind CSS', icon: <SiTailwindcss className="w-8 h-8" /> }
      ]
    },
    {
      title: 'Backend',
      translationKey: 'skills.backend',
      skills: [
        { name: 'Node.js', icon: <SiNodedotjs className="w-8 h-8" /> },
        { name: 'Express.js', icon: <SiExpress className="w-8 h-8" /> },
        { name: 'PHP', icon: <SiPhp className="w-8 h-8" /> },
        { name: 'Fast API', icon: <SiFastapi className="w-8 h-8" /> },
      ]
    },
    {
      title: 'Database',
      translationKey: 'skills.database',
      skills: [
        { name: 'MySQL', icon: <SiMysql className="w-8 h-8" /> },
        { name: 'MongoDB', icon: <SiMongodb className="w-8 h-8" /> },
        { name: 'PostgreSQL', icon: <SiPostgresql className="w-8 h-8" /> },
        { name: 'Redis', icon: <SiRedis className="w-8 h-8" /> }
      ]
    },
    {
      title: 'Mobile',
      translationKey: 'skills.mobile',
      skills: [
        { name: 'React Native', icon: <SiReact className="w-8 h-8" /> },
        { name: 'Flutter', icon: <SiFlutter className="w-8 h-8" /> },
        { name: 'Dart', icon: <SiDart className="w-8 h-8" /> },
        { name: 'Android Studio', icon: <SiAndroidstudio className="w-8 h-8" /> }
      ]
    },
    {
      title: 'AI/ML Frameworks',
      translationKey: 'skills.ai',
      skills: [
        { name: 'Python', icon: <SiPython className="w-8 h-8" /> },
        { name: 'PyTorch', icon: <SiPytorch className="w-8 h-8" /> },
        { name: 'TensorFlow', icon: <SiTensorflow className="w-8 h-8" /> },
        { name: 'OpenCV', icon: <SiOpencv className="w-8 h-8" /> },
        { name: 'Scikit-learn', icon: <SiScikitlearn className="w-8 h-8" /> }
      ]
    },
    {
      title: 'Other Tools',
      translationKey: 'skills.tools',
      skills: [
        { name: 'Figma', icon: <SiFigma className="w-8 h-8" /> },
        { name: 'Postman', icon: <SiPostman className="w-8 h-8" /> },
        { name: 'Docker', icon: <SiDocker className="w-8 h-8" /> },
        { name: 'Git', icon: <SiGit className="w-8 h-8" /> },
        { name: 'GitHub Actions', icon: <SiGithubactions className="w-8 h-8" /> },
        { name: 'Linux', icon: <SiLinux className="w-8 h-8" /> }
      ]
    }
  ];



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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="skills" className="py-20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-section">
        <SectionHeader title={t('skills.title')} subtitle={t('skills.subtitle')} />

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              variants={itemVariants}
              className="relative bg-light-100 dark:bg-dark-600 p-6 rounded-lg shadow-md"
            >
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />

              <h3 className="text-xl font-semibold mb-6 text-primary-600 dark:text-primary-400">
                {t(category.translationKey)}
              </h3>

              <div className="grid grid-cols-3 gap-4">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-light-300 dark:hover:bg-dark-400 transition-colors"
                  >
                    <div className="text-primary-600 dark:text-primary-400 mb-2">
                      {skill.icon}
                    </div>
                    <span className="text-sm font-medium text-center">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;