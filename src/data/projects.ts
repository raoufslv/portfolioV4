export interface ProjectMeta {
  id: number;
  title: string;
  headerImage?: string;
  images: string[];
  categories: string[];
  technologies: string[];
  demoUrl?: string;
  codeUrl?: string;
  confidential?: boolean;
  featured?: boolean;
  accentColor?: string;
}

export interface Project extends ProjectMeta {
  description: string;
  highlights?: string[];
  caseStudy?: { problem: string; role: string; result: string };
}

import SheTalks from "@/assets/images/SheTalks.png";
import SheTalks1 from "@/assets/images/SheTalks pics/homePage.png";
import SheTalks2 from "@/assets/images/SheTalks pics/LoginPage.png";
import SheTalks3 from "@/assets/images/SheTalks pics/posterPage.png";
import SheTalks4 from "@/assets/images/SheTalks pics/SignupPage.png";
import SheTalks5 from "@/assets/images/SheTalks pics/postsPage.png";

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

import TixNovaApp2 from "@/assets/images/TixNova pics/tixnova-app.png";
import TixNovaApp from "@/assets/images/TixNova pics/tixnova-app2.png";

import DSADashboard from "@/assets/images/DSA pics/dashboard_full.png";
import DSAQueryInterface from "@/assets/images/DSA pics/ai_query_interface.png";
import DSAQueryResult from "@/assets/images/DSA pics/ai_query_result.png";
import DSAActionsByPlatform from "@/assets/images/DSA pics/actions_by_platform.png";
import DSAOverviewTimeseries from "@/assets/images/DSA pics/overview_timeseries.png";
import DSAEuMap from "@/assets/images/DSA pics/eu_map_overview.png";

export const projectMeta: ProjectMeta[] = [
  {
    id: 0,
    title: 'Rakoono',
    images: [],
    confidential: true,
    categories: ['web', 'ai'],
    technologies: ['Next.js', 'TypeScript', 'React', 'Supabase', 'Vercel AI SDK', 'Playwright'],
    demoUrl: 'https://www.linkedin.com/company/rakoono',
    featured: true,
    accentColor: '#0ea5e9',
  },
  {
    id: 14,
    title: 'DSA transparency dashboard',
    headerImage: DSADashboard,
    images: [DSAQueryInterface, DSAQueryResult, DSAActionsByPlatform, DSAOverviewTimeseries, DSAEuMap],
    categories: ['web', 'ai'],
    technologies: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Prisma', 'GCP', 'Gemini', 'Docker'],
    demoUrl: 'https://www.linkedin.com/posts/raoufslv_tr%C3%A8s-content-de-repartager-ce-projet-sur-ugcPost-7463156950277742592-AsPr/',
    codeUrl: 'https://github.com/raouf-rak/dsa-dashboard',
    featured: true,
    accentColor: '#8b5cf6',
  },
  {
    id: 1,
    title: 'CGVortex',
    headerImage: CGVortex,
    images: [CGVortex1, CGVortex2, CGVortex3],
    categories: ['web'],
    technologies: ['React', 'MongoDB', 'Express', 'Node.js', 'Tailwind'],
    demoUrl: 'https://www.cgvortex.com/',
    featured: true,
    accentColor: '#f97316',
  },
  {
    id: 2,
    title: 'Ekri-Echri',
    headerImage: EkriEchri,
    images: [EkriEchri1, EkriEchri2, EkriEchri3, EkriEchri4, EkriEchri5, EkriEchri6, EkriEchri7, EkriEchri8],
    categories: ['web'],
    technologies: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'PHP'],
    demoUrl: 'https://ekri-echri.000webhostapp.com/',
  },
  {
    id: 3,
    title: 'MC Got Visuals',
    headerImage: MGV,
    images: [MGV1, MGV2, MGV3, MGV4, MGV5, MGV6, MGV7, MGV8, MGV9, MGV10],
    categories: ['web', 'design'],
    technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
    demoUrl: 'https://mgv.microclub.info/',
  },
  {
    id: 4,
    title: 'AladoShop',
    headerImage: AladoShop,
    images: [AladoShop1],
    categories: ['web'],
    technologies: ['Ecwid CMS'],
    demoUrl: 'https://alado-shop.company.site/',
  },
  {
    id: 5,
    title: 'AI site',
    headerImage: AISite,
    images: [AISite, AISite1, AISite3, AISite4, AISite5, AISite6],
    categories: ['web'],
    technologies: ['HTML', 'CSS'],
    demoUrl: 'https://raoufslv.github.io/AI-Article/',
    codeUrl: 'https://github.com/raoufslv/AI-Article',
  },
  {
    id: 7,
    title: 'SheTalks',
    headerImage: SheTalks,
    images: [SheTalks, SheTalks1, SheTalks2, SheTalks3, SheTalks4, SheTalks5],
    categories: ['web'],
    technologies: ['React', 'MongoDB', 'Express', 'Node.js', 'Tailwind CSS'],
    codeUrl: 'https://github.com/raoufslv/SheTalks-IWD-23',
  },
  {
    id: 8,
    title: 'Image analogy generator',
    headerImage: ImageAnalogy,
    images: [ImageAnalogy, ImageAnalogy1, ImageAnalogy2],
    categories: ['ai'],
    technologies: ['Python', 'Neural Networks', 'TensorFlow'],
    codeUrl: 'https://github.com/raoufslv/Image-Analogy-sequence-prediction',
  },
  {
    id: 9,
    title: 'River puzzle game',
    headerImage: RiverPuzzle,
    images: [RiverPuzzle, RiverPuzzle1, RiverPuzzle2],
    categories: ['game'],
    technologies: ['OpenGL', 'C++'],
    demoUrl: 'https://drive.google.com/file/d/1bNo6hrjzTAfh5Y81zqyxEIHadYoYb2Bz/view',
    codeUrl: 'https://github.com/raoufslv/OpenGL-Project-3D-Game',
  },
  {
    id: 10,
    title: 'Sokoban puzzle',
    headerImage: sokoban1,
    images: [sokoban1, sokoban2, sokoban3, sokoban4],
    categories: ['game', 'ai'],
    technologies: ['Python', 'BFS Algorithm', 'A* Algorithm'],
    codeUrl: 'https://github.com/raoufslv/SokoPuzzle',
  },
  {
    id: 11,
    title: 'Mancala game',
    headerImage: mancala1,
    images: [mancala1, mancala2],
    categories: ['game', 'ai'],
    technologies: ['Python', 'Pygame', 'AI'],
    codeUrl: 'https://github.com/raoufslv/mancala',
  },
  {
    id: 12,
    title: 'Deepfake interface',
    headerImage: DeepFakeInterface,
    images: [DeepFakeInterface],
    categories: ['design'],
    technologies: ['Python', 'Tkinter'],
    codeUrl: 'https://github.com/raoufslv/DFL-GUI',
  },
  {
    id: 13,
    title: 'Bastion app',
    headerImage: BastionApp,
    images: [BastionApp, BastionApp2],
    categories: ['mobile'],
    technologies: ['Flutter', 'Dart'],
    codeUrl: 'https://github.com/raoufslv/bastionApp',
  },
  {
    id: 15,
    title: 'TixNova',
    headerImage: TixNovaApp,
    images: [TixNovaApp, TixNovaApp2],
    categories: ['mobile', 'blockchain'],
    technologies: ['React Native', 'Solidity', 'Hardhat', 'Ethereum', 'MetaMask', 'Web3.js'],
    demoUrl: 'https://www.linkedin.com/posts/wissam-kerrouche-33aa8823b_blockchain-nft-web3-ugcPost-7339238696212131843-Nf_A?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD1Jqu8BGVDeyvbOKNAIks3sGDZdabt3WZY',
    codeUrl: 'https://www-apps.univ-lehavre.fr/forge/tpe-tixnova',
  },
];
