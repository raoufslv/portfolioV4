import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-scroll";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Home, FolderKanban, User, Bot, Mail, Moon, Sun, Languages } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const SCROLL_OFFSET = -80;

const NavbarDock = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { name: t("nav.home"), to: "hero", icon: Home },
    { name: t("nav.projects"), to: "projects", icon: FolderKanban },
    { name: t("nav.about"), to: "about", icon: User },
    { name: t("nav.chatbot"), to: "chatbot", icon: Bot },
    { name: t("nav.contact"), to: "contact", icon: Mail },
  ];

  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  const dockTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 400, damping: 30 };

  return (
    <>
      <Link
        to="hero"
        spy
        smooth
        offset={SCROLL_OFFSET}
        duration={500}
        className="fixed left-4 top-5 z-50 hidden cursor-pointer font-display text-lg font-bold text-primary-600 dark:text-primary-400 sm:left-6 sm:block md:text-xl"
      >
        Raouf<span className="text-secondary-600 dark:text-secondary-400">.Abdallah</span>
      </Link>

      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center sm:top-5">
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={dockTransition}
          className="pointer-events-auto"
          aria-label="Main navigation"
        >
          <div className="flex w-fit items-center gap-1 rounded-full border border-light-300/80 bg-light-100/90 px-2 py-2 shadow-lg backdrop-blur-md dark:border-dark-400/50 dark:bg-dark-600/90">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                spy
                smooth
                offset={SCROLL_OFFSET}
                duration={500}
                activeClass="!text-primary-600 dark:!text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                className="group relative flex cursor-pointer items-center rounded-full px-2.5 py-2 text-dark-400 transition-colors hover:text-primary-600 dark:text-light-300 dark:hover:text-primary-400 sm:px-3"
                title={link.name}
              >
                <Icon size={18} aria-hidden />
                <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-dark-500 px-2 py-1 text-xs text-light-100 opacity-0 transition-opacity group-hover:opacity-100">
                  {link.name}
                </span>
              </Link>
            );
          })}

          <div className="mx-1 h-6 w-px bg-light-300 dark:bg-dark-400" aria-hidden />

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full p-2 text-dark-400 transition-colors hover:bg-light-300 dark:text-light-300 dark:hover:bg-dark-400"
            aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center rounded-full p-2 text-dark-400 transition-colors hover:bg-light-300 dark:text-light-300 dark:hover:bg-dark-400"
              aria-expanded={langOpen}
              aria-label="Change language"
            >
              <Languages size={18} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute left-1/2 top-full z-50 mt-2 w-32 -translate-x-1/2 overflow-hidden rounded-lg border border-light-300 bg-light-100 shadow-lg dark:border-dark-400 dark:bg-dark-500"
                >
                  <button
                    type="button"
                    onClick={() => toggleLanguage("en")}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-light-200 dark:hover:bg-dark-400 ${
                      i18n.language === "en" ? "text-primary-600 dark:text-primary-400" : ""
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleLanguage("fr")}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-light-200 dark:hover:bg-dark-400 ${
                      i18n.language === "fr" ? "text-primary-600 dark:text-primary-400" : ""
                    }`}
                  >
                    Français
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </div>
        </motion.nav>
      </div>
    </>
  );
};

export default NavbarDock;
