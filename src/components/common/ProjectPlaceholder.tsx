import React from 'react';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';

interface ProjectPlaceholderProps {
  title: string;
  variant?: 'card' | 'modal';
}

const ProjectPlaceholder: React.FC<ProjectPlaceholderProps> = ({ title, variant = 'card' }) => {
  const { t } = useTranslation();
  const isCard = variant === 'card';

  return (
    <div
      className={`flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-secondary-900/90 ${
        isCard ? 'h-full w-full p-6' : 'rounded-lg p-10 min-h-[200px]'
      }`}
      aria-label={t('projects.confidential.ariaLabel', { title })}
    >
      <div
        className={`flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ${
          isCard ? 'w-12 h-12 mb-3' : 'w-16 h-16 mb-4'
        }`}
      >
        <Lock className={isCard ? 'w-5 h-5 text-white/90' : 'w-7 h-7 text-white/90'} />
      </div>
      <p className={`font-semibold text-white ${isCard ? 'text-sm' : 'text-lg'}`}>
        {t('projects.confidential.title')}
      </p>
      <p className={`text-white/70 mt-1 ${isCard ? 'text-xs line-clamp-2' : 'text-sm max-w-md'}`}>
        {t('projects.confidential.description')}
      </p>
    </div>
  );
};

export default ProjectPlaceholder;
