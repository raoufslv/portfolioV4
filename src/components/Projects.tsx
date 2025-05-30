import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Eye, ExternalLink, Github } from 'lucide-react';
import SectionHeader from './common/SectionHeader';

interface Project {
  id: number;
  title: string;
  description: string;
  headerImage?: string;
  images: string[];
  categories: string[];
  technologies: string[];
  demoUrl?: string;
  codeUrl?: string;
}

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [activeFilter, setActiveFilter] = useState('web');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<null | number>(null);

  const filters = [
    { key: 'all', label: t('projects.filter.all') },
    { key: 'web', label: t('projects.filter.web') },
    { key: 'mobile', label: t('projects.filter.mobile') },
    { key: 'game', label: t('projects.filter.game') },
    { key: 'ai', label: t('projects.filter.ai') },
    { key: 'design', label: t('projects.filter.design') }
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.categories.includes(activeFilter));

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
    <section id="projects" className="py-20 bg-light-200 dark:bg-dark-500">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-section">
        <SectionHeader title={t('projects.title')} subtitle={t('projects.subtitle')} />

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filters.map((filter) => (
            <motion.button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeFilter === filter.key
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-light-300 dark:bg-dark-400 hover:bg-primary-100 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              variants={itemVariants}
            >
              {filter.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, y: 20 }}
                className="bg-light-100 dark:bg-dark-600 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow "
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={project.headerImage || project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                  />

                  {/* Overlay */}
                  <AnimatePresence>
                    {hoveredProject === project.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-dark-500/80 flex items-center justify-center gap-4"
                      >
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                            aria-label={`${t('projects.viewDemo')} - ${project.title}`}
                          >
                            <Eye size={20} />
                          </a>
                        )}
                        {project.codeUrl && (
                          <a
                            href={project.codeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-secondary-600 text-white rounded-full hover:bg-secondary-700 transition-colors"
                            aria-label={`${t('projects.viewCode')} - ${project.title}`}
                          >
                            <Github size={20} />
                          </a>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-dark-400 dark:text-light-300 mb-4 text-sm">{project.description}</p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-light-300 dark:bg-dark-400 text-xs rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedProject(project.id)}
                    className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                  >
                    {t('projects.details')}
                    <ExternalLink size={16} className="ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Project Details Modal */}
        {selectedProject !== null && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedProject(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {(() => {
                const project = projects.find(p => p.id === selectedProject);
                if (!project) return null;

                return (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold">{project.title}</h3>
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Close modal"
                      >
                        X
                      </button>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                      <div className="space-y-4"></div>
                      {project.images.map((image, index) => (
                        <div key={index}>
                          <h1 className="text-lg font-semibold mb-2">page {index + 1}</h1>
                          <img
                            src={image}
                            alt={`${project.title} - image ${index + 1}`}
                            className="w-full object-cover rounded-lg mb-5 border dark:border-gray-700"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300">{project.description}</p>

                      <div>
                        <h4 className="text-lg font-semibold mb-2">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-4 pt-4">
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary flex items-center bg-primary-600 text-white hover:bg-primary-700 transition-colors p-2 rounded-md"
                            >
                              <ExternalLink size={16} className="mr-2" />
                              {t('projects.viewDemo')}
                            </a>
                          )}
                          {project.codeUrl && (
                            <a
                              href={project.codeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-outline flex items-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors p-2 rounded-md"
                            >
                              <Github size={16} className="mr-2" />
                              {t('projects.viewCode')}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )
        }
      </div >
    </section >
  );
};
export default Projects;


import SheTalks from "@/assets/images/SheTalks.png";
import SheTalks1 from "@/assets/images/SheTalks pics/homePage.png";
import SheTalks2 from "@/assets/images/SheTalks pics/LoginPage.png";
import SheTalks3 from "@/assets/images/SheTalks pics/posterPage.png";
import SheTalks4 from "@/assets/images/SheTalks pics/SignupPage.png";
import SheTalks5 from "@/assets/images/SheTalks pics/postsPage.png";

import thumpnail from "@/assets/images/thumpnail.png";
import portfolio from "@/assets/images/portfolio pics/portfolio.png";

import BastionApp from "@/assets/images/BastionApp pics/Capture.jpg";
import BastionApp2 from "@/assets/images/BastionApp pics/Capture2.jpg";

import DeepFakeInterface from "@/assets/images/DeepFakeInterface pics/Figma Design.png";

import ImageAnalogy from "@/assets/images/ImageAnalogy pics/results1.png";
import ImageAnalogy1 from "@/assets/images/ImageAnalogy pics/results2.png";
import ImageAnalogy2 from "@/assets/images/ImageAnalogy pics/results3.png";

import RiverPuzzle from "@/assets/images/RiverPuzzle pics/game_lost.png";
import RiverPuzzle1 from "@/assets/images/RiverPuzzle pics/game_won.png";
import RiverPuzzle2 from "@/assets/images/RiverPuzzle pics/screenshot_text_rendering.png";

import sokoban1 from "@/assets/images/sokoban pics/sokoban1.png";
import sokoban2 from "@/assets/images/sokoban pics/sokoban2.png";
import sokoban3 from "@/assets/images/sokoban pics/sokoban3.png";
import sokoban4 from "@/assets/images/sokoban pics/sokoban4.png";

import AISite from "@/assets/images/AI-Site.png";
import AISite1 from "@/assets/images/AI pics/Home.png";
import AISite3 from "@/assets/images/AI pics/ComputerVision.png";
import AISite4 from "@/assets/images/AI pics/Machinlearning.png";
import AISite5 from "@/assets/images/AI pics/Deeplearning.png";
import AISite6 from "@/assets/images/AI pics/NLP.png";

import CGVortex from "@/assets/images/CGVortex.png";
import CGVortex1 from "@/assets/images/CGVortex pics/www.cgvortex.com_.png";
import CGVortex2 from "@/assets/images/CGVortex pics/www.cgvortex2.com_.png";
import CGVortex3 from "@/assets/images/CGVortex pics/www.cgvortex3.com_.png";

import AladoShop from "@/assets/images/Aladoshop pics/aladoshop.png";
import AladoShop1 from "@/assets/images/Aladoshop pics/home.png";

import mancala1 from "@/assets/images/mancala pics/mancala1.png";
import mancala2 from "@/assets/images/mancala pics/mancala2.png";

import EkriEchri from "@/assets/images/Ekri&Echri.png";
import EkriEchri1 from "@/assets/images/EKRI&ECHRI pics/Home.png";
import EkriEchri2 from "@/assets/images/EKRI&ECHRI pics/Annonces.png";
import EkriEchri3 from "@/assets/images/EKRI&ECHRI pics/Annonce.png";
import EkriEchri4 from "@/assets/images/EKRI&ECHRI pics/deposer Annonce.png";
import EkriEchri5 from "@/assets/images/EKRI&ECHRI pics/Modifier Annonce.png";
import EkriEchri6 from "@/assets/images/EKRI&ECHRI pics/Admin.png";
import EkriEchri7 from "@/assets/images/EKRI&ECHRI pics/signIn.png";
import EkriEchri8 from "@/assets/images/EKRI&ECHRI pics/LogIn.png";

import MGV from "@/assets/images/MGV.png";
import MGV1 from "@/assets/images/MGV pics/home-light.png";
import MGV2 from "@/assets/images/MGV pics/home-dark.png";
import MGV3 from "@/assets/images/MGV pics/Intro-light.png";
import MGV4 from "@/assets/images/MGV pics/Intro-dark.png";
import MGV5 from "@/assets/images/MGV pics/Agenda-light.png";
import MGV6 from "@/assets/images/MGV pics/Agenda-dark.png";
import MGV7 from "@/assets/images/MGV pics/Card-light.png";
import MGV8 from "@/assets/images/MGV pics/Card-dark.png";
import MGV9 from "@/assets/images/MGV pics/question-light.png";
import MGV10 from "@/assets/images/MGV pics/question-dark.png";

const projects: Project[] = [
  {
    id: 1,
    title: 'CGVortex',
    description: 'A marketplace for 3D add-ons, built with the MERN stack and tailwind.',
    headerImage: CGVortex,
    images: [
      CGVortex1,
      CGVortex2,
      CGVortex3
    ],
    categories: ['web'],
    technologies: ['React', 'MongoDB', 'Express', 'Node.js', 'Tailwind'],
    demoUrl: 'https://www.cgvortex.com/'
  },
  {
    id: 2,
    title: 'Ekri-Echri',
    description: 'A house rental platform for the Algerian market, built with the HTML, CSS (Bootstrap), and JS and PHP.',
    headerImage: EkriEchri,
    images: [
      EkriEchri1,
      EkriEchri2,
      EkriEchri3,
      EkriEchri4,
      EkriEchri5,
      EkriEchri6,
      EkriEchri7,
      EkriEchri8
    ],
    categories: ['web'],
    technologies: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'PHP'],
    demoUrl: 'https://ekri-echri.000webhostapp.com/',
  },
  {
    id: 3,
    title: 'MC Got Visuals',
    description: 'A showcase website for a motion graphics hackathon event, built with Nextjs, tailwind and framer-motion.',
    headerImage: MGV,
    images: [
      MGV1, MGV2, MGV3, MGV4, MGV5, MGV6, MGV7, MGV8, MGV9, MGV10
    ],
    categories: ['web', 'design'],
    technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
    demoUrl: 'https://mgv.microclub.info/',
  },
  {
    id: 4,
    title: 'AladoShop',
    description: 'An e-commerce platform for a local business, with ecwid CMS platform.',
    headerImage: AladoShop,
    images: [
      AladoShop1
    ],
    categories: ['web'],
    technologies: ['Ecwid CMS'],
    demoUrl: 'https://alado-shop.company.site/',
  },
  {
    id: 5,
    title: 'AI Site',
    description: 'An AI article website, built only with HTML and CSS.',
    headerImage: AISite,
    images: [
      AISite, AISite1, AISite3, AISite4, AISite5, AISite6
    ],
    categories: ['web'],
    technologies: ['HTML', 'CSS'],
    demoUrl: 'https://raoufslv.github.io/AI-Article/',
    codeUrl: 'https://github.com/raoufslv/AI-Article'
  },
  {
    id: 6,
    title: 'Portfolio',
    description: 'My old portfolio website, showcasing my work and skills at the time built with React & tailwind.',
    headerImage: thumpnail,
    images: [
      portfolio
    ],
    categories: ['web'],
    technologies: ['React', 'Tailwind CSS'],
    demoUrl: 'https://raouf-abdallah.netlify.app',
    codeUrl: 'https://github.com/raoufslv/portfolioV2'
  },
  {
    id: 7,
    title: 'SheTalks',
    description: 'A Mental health platform for women, built with the MERN stack and tailwind.',
    headerImage: SheTalks,
    images: [
      SheTalks, SheTalks1, SheTalks2, SheTalks3, SheTalks4, SheTalks5
    ],
    categories: ['web'],
    technologies: ['React', 'MongoDB', 'Express', 'Node.js', 'Tailwind CSS'],
    codeUrl: 'https://github.com/raoufslv/SheTalks-IWD-23'
  },
  {
    id: 8,
    title: 'Image Analogy Generator',
    description: 'Using a neural network to generate images based on a given analogy.',
    headerImage: ImageAnalogy,
    images: [
      ImageAnalogy, ImageAnalogy1, ImageAnalogy2
    ],
    categories: ['ai'],
    technologies: ['Python', 'Neural Networks', 'TensorFlow'],
    codeUrl: 'https://github.com/raoufslv/Image-Analogy-sequence-prediction'
  },
  {
    id: 9,
    title: 'River Puzzle Game',
    description: 'A puzzle game that challenges the player to cross a river with a set of rules, built with OpenGL.',
    headerImage: RiverPuzzle,
    images: [
      RiverPuzzle, RiverPuzzle1, RiverPuzzle2
    ],
    categories: ['game'],
    technologies: ['OpenGL', 'C++'],
    demoUrl: 'https://drive.google.com/file/d/1bNo6hrjzTAfh5Y81zqyxEIHadYoYb2Bz/view',
    codeUrl: 'https://github.com/raoufslv/OpenGL-Project-3D-Game'
  },
  {
    id: 10,
    title: 'Sokoban Puzzle',
    description: 'A puzzle game where i implemented Breadth First Search algorithm and Astar algorithm to solve the levels.',
    headerImage: sokoban1,
    images: [
      sokoban1, sokoban2, sokoban3, sokoban4
    ],
    categories: ['game', 'ai'],
    technologies: ['Python', 'BFS Algorithm', 'A* Algorithm'],
    codeUrl: 'https://github.com/raoufslv/SokoPuzzle'
  },
  {
    id: 11,
    title: 'Mancala Game',
    description: 'A Manacala game built with python and pygame, with an AI player.',
    headerImage: mancala1,
    images: [
      mancala1, mancala2
    ],
    categories: ['game', 'ai'],
    technologies: ['Python', 'Pygame', 'AI'],
    codeUrl: 'https://github.com/raoufslv/mancala'
  },
  {
    id: 12,
    title: 'DeepFake Interface',
    description: 'A user interface for a deepfake software, built with python and tkinter.',
    headerImage: DeepFakeInterface,
    images: [
      DeepFakeInterface
    ],
    categories: ['design'],
    technologies: ['Python', 'Tkinter'],
    codeUrl: 'https://github.com/raoufslv/DFL-GUI'
  },
  {
    id: 13,
    title: 'Bastion App',
    description: 'A mobile app that helps users get a better knowledge of the monuments of the city of Algiers, built with Flutter.',
    headerImage: BastionApp,
    images: [
      BastionApp, BastionApp2
    ],
    categories: ['mobile'],
    technologies: ['Flutter', 'Dart'],
    codeUrl: 'https://github.com/raoufslv/bastionApp'
  }
];