import reactIcon from '../assets/Icons/react-2.svg';
import jsIcon from '../assets/Icons/JS.svg';
import htmlIcon from '../assets/Icons/HTML.svg';
import cssIcon from '../assets/Icons/CSS.svg';
import csharpIcon from '../assets/Icons/Csharp.svg';
import cppIcon from '../assets/Icons/C++.svg';
import javaIcon from '../assets/Icons/java-4 (1).svg';
import mysqlIcon from '../assets/Icons/mysql-logo-pure.svg';
import azureIcon from '../assets/Icons/microsoftazure-svgrepo-com.svg';
import supabaseIcon from '../assets/Icons/supabase-logo-icon 1.svg';
import vercelIcon from '../assets/Icons/Vercel.svg';
import figmaIcon from '../assets/Icons/figma-svgrepo-com.svg';
import githubIcon from '../assets/Icons/github-142-svgrepo-com.svg';

export const skills = [
  {
    id: 'react',
    name: 'React',
    icon: reactIcon,
    mode: 'dev',
    category: { pt: 'Front-End', en: 'Front-End' },
    level: 90,
    color: '#61DAFB',
    description: {
      pt: 'Construção de SPAs, hooks customizados, Context API, componentização escalável e integração com GSAP.',
      en: 'Building SPAs, custom hooks, Context API, scalable component architecture, and GSAP integration.',
    },
    relatedSlugs: ['financas-sem-fronteiras', 'instituto-criativo-dashboard', 'comedoria-da-tia'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: jsIcon,
    mode: 'dev',
    category: { pt: 'Linguagem', en: 'Language' },
    level: 88,
    color: '#F7DF1E',
    description: {
      pt: 'ES6+, manipulação assíncrona de APIs, Canvas 2D, lógica interativa de jogos e otimização de DOM.',
      en: 'ES6+, async API handling, 2D Canvas, interactive game logic, and DOM performance optimization.',
    },
    relatedSlugs: ['o-acampamento', 'pet-shop', 'instituto-criativo-dashboard'],
  },
  {
    id: 'html',
    name: 'HTML5',
    icon: htmlIcon,
    mode: 'dev',
    category: { pt: 'Front-End', en: 'Front-End' },
    level: 95,
    color: '#E34F26',
    description: {
      pt: 'Estruturação semântica, acessibilidade (ARIA), SEO técnico e formulários modernos.',
      en: 'Semantic markup, accessibility (ARIA), technical SEO, and modern accessible forms.',
    },
    relatedSlugs: ['financas-sem-fronteiras', 'o-acampamento', 'dia-das-maes'],
  },
  {
    id: 'css',
    name: 'CSS3',
    icon: cssIcon,
    mode: 'both',
    category: { pt: 'Estilização & UI', en: 'Styling & UI' },
    level: 92,
    color: '#1572B6',
    description: {
      pt: 'Grid, Flexbox, Design Tokens, CSS 3D Transforms, animações performáticas e responsividade fluida.',
      en: 'Grid, Flexbox, Design Tokens, CSS 3D Transforms, high-FPS animations, and fluid responsiveness.',
    },
    relatedSlugs: ['financas-sem-fronteiras', 'comedoria-da-tia', 'dia-das-maes'],
  },
  {
    id: 'figma',
    name: 'Figma',
    icon: figmaIcon,
    mode: 'both',
    category: { pt: 'UI/UX Design', en: 'UI/UX Design' },
    level: 94,
    color: '#F24E1E',
    description: {
      pt: 'Prototipagem interativa, Design Systems, Auto Layout, Wireframing e handoff preciso para código.',
      en: 'Interactive prototyping, Design Systems, Auto Layout, wireframing, and pixel-accurate code handoff.',
    },
    relatedSlugs: ['comedoria-da-tia', 'maratona-sbc-2025', 'financas-sem-fronteiras'],
  },
  {
    id: 'csharp',
    name: 'C#',
    icon: csharpIcon,
    mode: 'dev',
    category: { pt: 'Back-End', en: 'Back-End' },
    level: 78,
    color: '#9B4F96',
    description: {
      pt: 'Desenvolvimento de APIs, lógica orientada a objetos e integração com serviços em nuvem no Azure.',
      en: 'API development, object-oriented programming, and cloud integration with Microsoft Azure.',
    },
    relatedSlugs: ['instituto-criativo-dashboard'],
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: cppIcon,
    mode: 'dev',
    category: { pt: 'IoT & Sistemas', en: 'IoT & Systems' },
    level: 75,
    color: '#00599C',
    description: {
      pt: 'Programação de microcontroladores (Arduino / ESP32), leitura de sensores e automação de hardware.',
      en: 'Microcontroller programming (Arduino / ESP32), sensor telemetry, and hardware automation.',
    },
    relatedSlugs: ['barreira-ecologica-bea'],
  },
  {
    id: 'java',
    name: 'Java',
    icon: javaIcon,
    mode: 'dev',
    category: { pt: 'Mobile & OOP', en: 'Mobile & OOP' },
    level: 74,
    color: '#ED8B00',
    description: {
      pt: 'Desenvolvimento Android nativo no Android Studio e fundamentos sólidos de Orientação a Objetos.',
      en: 'Native Android development in Android Studio and solid Object-Oriented Programming principles.',
    },
    relatedSlugs: ['comedoria-da-tia'],
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: mysqlIcon,
    mode: 'dev',
    category: { pt: 'Banco de Dados', en: 'Database' },
    level: 80,
    color: '#4479A1',
    description: {
      pt: 'Modelagem relacional, consultas otimizadas, CRUD completo e integração com aplicações web.',
      en: 'Relational modeling, optimized queries, full CRUD systems, and web application integration.',
    },
    relatedSlugs: ['instituto-criativo-dashboard', 'pet-shop'],
  },
  {
    id: 'supabase',
    name: 'Supabase',
    icon: supabaseIcon,
    mode: 'dev',
    category: { pt: 'BaaS & PostgreSQL', en: 'BaaS & PostgreSQL' },
    level: 82,
    color: '#3ECF8E',
    description: {
      pt: 'Autenticação, PostgreSQL em tempo real, Storage e APIs instantâneas para apps web e mobile.',
      en: 'Authentication, real-time PostgreSQL, Storage, and instant APIs for web and mobile apps.',
    },
    relatedSlugs: ['comedoria-da-tia'],
  },
  {
    id: 'azure',
    name: 'Azure',
    icon: azureIcon,
    mode: 'dev',
    category: { pt: 'Cloud', en: 'Cloud' },
    level: 72,
    color: '#0078D4',
    description: {
      pt: 'Hospedagem de serviços, bancos em nuvem e deploy de soluções corporativas acadêmicas.',
      en: 'Cloud service hosting, managed databases, and deployment of enterprise-grade academic solutions.',
    },
    relatedSlugs: ['instituto-criativo-dashboard'],
  },
  {
    id: 'vercel',
    name: 'Vercel',
    icon: vercelIcon,
    mode: 'dev',
    category: { pt: 'Deploy & Edge', en: 'Deploy & Edge' },
    level: 88,
    color: '#FFFFFF',
    description: {
      pt: 'CI/CD contínuo, previews por branch e hospedagem de alta performance para aplicações React/Vite.',
      en: 'Continuous CI/CD, branch previews, and high-performance edge hosting for React/Vite apps.',
    },
    relatedSlugs: ['financas-sem-fronteiras', 'comedoria-da-tia'],
  },
  {
    id: 'github',
    name: 'Git & GitHub',
    icon: githubIcon,
    mode: 'dev',
    category: { pt: 'Versionamento', en: 'Version Control' },
    level: 88,
    color: '#F05032',
    description: {
      pt: 'Fluxo de branches, pull requests, code review e trabalho colaborativo em equipes ágeis.',
      en: 'Branching workflows, pull requests, code reviews, and collaborative agile teamwork.',
    },
    relatedSlugs: ['barreira-ecologica-bea', 'instituto-criativo-dashboard'],
  },
];

// Ferramentas & Competências específicas de Design para o modo Design e CV Lab
export const designCapabilities = [
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    badge: 'UI/UX',
    color: '#FF4D00',
    level: 93,
    description: {
      pt: 'Arquitetura de informação, fluxos de usuário, wireframes de alta fidelidade e interfaces responsivas.',
      en: 'Information architecture, user flows, high-fidelity wireframes, and responsive interfaces.',
    },
  },
  {
    id: 'brand-identity',
    name: 'Identidade Visual',
    badge: 'BRAND',
    color: '#AA1719',
    level: 90,
    description: {
      pt: 'Criação de logotipos, mascotes, paletas tipográficas e manuais completos para eventos e empresas.',
      en: 'Logo creation, mascots, typographic systems, and comprehensive visual guidelines for events and brands.',
    },
  },
  {
    id: 'photoshop',
    name: 'Adobe Photoshop',
    badge: 'Ps',
    color: '#31A8FF',
    level: 86,
    description: {
      pt: 'Manipulação de imagens, tratamento visual, mockups realistas, embalagens e composições gráficas.',
      en: 'Image manipulation, visual retouching, realistic mockups, packaging, and graphic compositions.',
    },
  },
  {
    id: 'editorial-print',
    name: 'Design Editorial & Impresso',
    badge: 'PRINT',
    color: '#E63946',
    level: 88,
    description: {
      pt: 'Diagramação de revistas, álbuns de figurinhas, catálogos comerciais, crachás, cartazes e camisetas.',
      en: 'Editorial layout for magazines, sticker albums, commercial catalogs, badges, posters, and apparel.',
    },
  },
  {
    id: 'design-systems',
    name: 'Design Systems',
    badge: 'DS',
    color: '#8338EC',
    level: 87,
    description: {
      pt: 'Tokens de design, bibliotecas de componentes reutilizáveis no Figma alinhadas diretamente ao React/CSS.',
      en: 'Design tokens and reusable component libraries in Figma mapped directly to React/CSS.',
    },
  },
  {
    id: 'packaging',
    name: 'Embalagens & Catálogos',
    badge: 'PACK',
    color: '#FB8500',
    level: 84,
    description: {
      pt: 'Adaptação de embalagens de produto e desenvolvimento de catálogos comerciais de alto impacto (Volcano).',
      en: 'Product packaging adaptation and high-impact commercial sales catalogs (Volcano).',
    },
  },
];
