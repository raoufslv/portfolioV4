import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutChatBot from './components/ChatBot';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import './i18n/config';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set document language attribute to match i18n language
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-light-200 text-dark-500 dark:bg-dark-500 dark:text-light-200 transition-colors duration-300">
        <Navbar />
        <main>
          <Hero />
          <AboutChatBot />
          <Skills />
          <Projects />
          <Resume />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;