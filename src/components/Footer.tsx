import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-scroll';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      icon: <Github size={20} />,
      url: 'https://github.com/raoufslv'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={20} />,
      url: 'https://linkedin.com/in/raoufslv'
    },
    {
      name: 'Email',
      icon: <Mail size={20} />,
      url: 'mailto:devcode.raouf@gmail.com'
    }
  ];

  const navLinks = [
    { name: t('nav.home'), to: 'hero' },
    { name: t('nav.about'), to: 'about' },
    { name: t('nav.skills'), to: 'skills' },
    { name: t('nav.projects'), to: 'projects' },
    { name: t('nav.resume'), to: 'resume' },
    { name: t('nav.contact'), to: 'contact' }
  ];

  return (
    <footer className="bg-light-100 dark:bg-dark-600 pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-light-300 dark:border-dark-400 pb-8">
          {/* Logo */}
          <div className="mb-6 md:mb-0">
            <Link
              to="hero"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="text-2xl font-bold cursor-pointer transition-colors text-primary-600 dark:text-primary-400"
            >
              Raouf<span className="text-secondary-600 dark:text-secondary-400">.dev</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 md:mb-0">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-light-300 dark:bg-dark-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-6 text-sm text-dark-400 dark:text-light-300">
          <p>
            &copy; {currentYear} Raouf Abdallah. {t('footer.rights')}
          </p>
          <p className="mt-2">{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;