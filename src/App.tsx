import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import NavbarDock from './components/NavbarDock';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import ChatBot from './components/ChatBot';
import Skills from './components/Skills';
import Resume from './components/Resume';
import Testimonial from './components/Testimonial';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import './i18n/config';
import { TracingBeam } from './components/ui/tracing-beam';

/** Set to true when testimonial is approved by tech lead */
const SHOW_TESTIMONIAL = false;

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-light-200 text-dark-500 transition-colors duration-300 dark:bg-dark-500 dark:text-light-200">
        <NavbarDock />
        <main>
          <Hero />
          <TracingBeam>
            <div className="relative h-full antialiased pt-4">
              <Projects />
              <About />
              <ChatBot />
              <Skills />
              <Resume />
              {SHOW_TESTIMONIAL && <Testimonial />}
              <Contact />
            </div>
          </TracingBeam>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
