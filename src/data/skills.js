import reactIcon from '../assets/Icons/react-2.svg';
import jsIcon from '../assets/Icons/JS.svg';
import htmlIcon from '../assets/Icons/HTML.svg';
import cssIcon from '../assets/Icons/CSS.svg';
import csharpIcon from '../assets/Icons/Csharp.svg';
import cppIcon from '../assets/Icons/C++.svg';
import cIcon from '../assets/Icons/C.svg';
import pythonIcon from '../assets/Icons/Python.svg';
import javaIcon from '../assets/Icons/java-4 (1).svg';
import androidStudioIcon from '../assets/Icons/AndroidStudio.svg';
import mysqlIcon from '../assets/Icons/mysql-logo-pure.svg';
import azureIcon from '../assets/Icons/microsoftazure-svgrepo-com.svg';
import supabaseIcon from '../assets/Icons/supabase-logo-icon 1.svg';
import vercelIcon from '../assets/Icons/Vercel.svg';
import figmaIcon from '../assets/Icons/figma-svgrepo-com.svg';
import photoshopIcon from '../assets/Icons/Photoshop.svg';
import githubIcon from '../assets/Icons/github-142-svgrepo-com.svg';

export const skills = [
  {
    id: 'react',
    name: 'React',
    icon: reactIcon,
    mode: 'dev',
    category: { pt: 'Front-End', en: 'Front-End' },
    level: 80,
    color: '#61DAFB',
    description: {
      pt: 'SPAs modernas, hooks customizados, Context API, arquitetura de componentes escalável e integração com GSAP.',
      en: 'Modern SPAs, custom hooks, Context API, scalable component architecture, and GSAP integration.',
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
      pt: 'ES6+, manipulação assíncrona de APIs, Canvas 2D interativo, árvores de decisão em jogos e otimização DOM.',
      en: 'ES6+, async APIs, interactive 2D Canvas, game state machines, and high-performance DOM scripting.',
    },
    relatedSlugs: ['o-acampamento', 'pet-shop', 'instituto-criativo-dashboard'],
  },
  {
    id: 'csharp',
    name: 'C#',
    icon: csharpIcon,
    mode: 'dev',
    category: { pt: 'Linguagem & Back-End', en: 'Language & Back-End' },
    level: 60,
    color: '#9B4F96',
    description: {
      pt: 'Lógica orientada a objetos (POO), desenvolvimento de APIs e integração de dados com Microsoft Azure.',
      en: 'Object-Oriented Programming (OOP), API development, and cloud data integration with Microsoft Azure.',
    },
    relatedSlugs: ['instituto-criativo-dashboard'],
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: cppIcon,
    mode: 'dev',
    category: { pt: 'IoT & Microprocessadores', en: 'IoT & Microprocessors' },
    level: 30,
    color: '#00599C',
    description: {
      pt: 'Programação de microcontroladores (Arduino & ESP32), leitura contínua de sensores infravermelhos e motores de passo.',
      en: 'Microcontroller programming (Arduino & ESP32), continuous IR sensor telemetry, and stepper motor robotics.',
    },
    relatedSlugs: ['barreira-ecologica-bea'],
  },
  {
    id: 'c-lang',
    name: 'C',
    icon: cIcon,
    mode: 'dev',
    category: { pt: 'Linguagem & Fundamentos', en: 'Language & Fundamentals' },
    level: 20,
    color: '#00599C',
    description: {
      pt: 'Estruturas de dados fundamentais, ponteiros, alocação de memória e algoritmos de base na FECAP.',
      en: 'Core data structures, pointers, memory allocation, and foundational algorithms at FECAP.',
    },
    relatedSlugs: ['barreira-ecologica-bea'],
  },
  {
    id: 'python',
    name: 'Python',
    icon: pythonIcon,
    mode: 'dev',
    category: { pt: 'Linguagem & Automação', en: 'Language & Automation' },
    level: 75,
    color: '#3776AB',
    description: {
      pt: 'Scripts de automação, manipulação de dados, prototipagem ágil e algoritmos acadêmicos.',
      en: 'Automation scripting, data wrangling, rapid prototyping, and academic computing algorithms.',
    },
    relatedSlugs: [],
  },
  {
    id: 'java',
    name: 'Java',
    icon: javaIcon,
    mode: 'dev',
    category: { pt: 'Mobile & POO', en: 'Mobile & OOP' },
    level: 40,
    color: '#ED8B00',
    description: {
      pt: 'Desenvolvimento Android Studio nativo, princípios de POO e integração mobile com APIs REST.',
      en: 'Native Android Studio development, OOP principles, and mobile integration with RESTful services.',
    },
    relatedSlugs: ['comedoria-da-tia'],
  },
  {
    id: 'android-studio',
    name: 'Android Studio',
    icon: androidStudioIcon,
    mode: 'dev',
    category: { pt: 'Desenvolvimento Mobile', en: 'Mobile Development' },
    level: 50,
    color: '#3DDC84',
    description: {
      pt: 'Criação de aplicativos mobile para Android (Java/React Native), emuladores, ciclo de vida e layouts XML.',
      en: 'Android mobile app creation (Java/React Native), emulators, activity lifecycle, and responsive layouts.',
    },
    relatedSlugs: ['comedoria-da-tia'],
  },
  {
    id: 'html',
    name: 'HTML5',
    icon: htmlIcon,
    mode: 'dev',
    category: { pt: 'Front-End Semântico', en: 'Semantic Front-End' },
    level: 95,
    color: '#E34F26',
    description: {
      pt: 'Estruturação semântica, conformidade WCAG/ARIA para leitores de tela e boas práticas de SEO.',
      en: 'Semantic markup, WCAG/ARIA accessibility for assistive tech, and technical SEO hygiene.',
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
      pt: 'Grid, Flexbox, Design Tokens, transformações 3D no espaço, animações e responsividade sem scroll horizontal.',
      en: 'Grid, Flexbox, Design Tokens, 3D space transforms, high-FPS animations, and clean responsive layouts.',
    },
    relatedSlugs: ['financas-sem-fronteiras', 'comedoria-da-tia', 'dia-das-maes'],
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: mysqlIcon,
    mode: 'dev',
    category: { pt: 'Banco de Dados', en: 'Database' },
    level: 50,
    color: '#4479A1',
    description: {
      pt: 'Modelagem relacional, consultas normalizadas, CRUD e persistência para sistemas de gestão.',
      en: 'Relational database schema modeling, normalized queries, CRUD, and persistent application storage.',
    },
    relatedSlugs: ['instituto-criativo-dashboard', 'pet-shop'],
  },
  {
    id: 'supabase',
    name: 'Supabase',
    icon: supabaseIcon,
    mode: 'dev',
    category: { pt: 'BaaS & PostgreSQL', en: 'BaaS & PostgreSQL' },
    level: 80,
    color: '#3ECF8E',
    description: {
      pt: 'PostgreSQL em nuvem, realtime database subscriptions, autenticação de usuários e cloud storage.',
      en: 'Managed PostgreSQL, real-time database subscriptions, user authentication, and media storage.',
    },
    relatedSlugs: ['comedoria-da-tia'],
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    icon: azureIcon,
    mode: 'dev',
    category: { pt: 'Cloud & Infra', en: 'Cloud & Infra' },
    level: 30,
    color: '#0078D4',
    description: {
      pt: 'Hospedagem de serviços corporativos acadêmicos, bancos gerenciados e deploy de aplicações.',
      en: 'Academic enterprise services hosting, managed database provisioning, and production deployment.',
    },
    relatedSlugs: ['instituto-criativo-dashboard'],
  },
  {
    id: 'vercel',
    name: 'Vercel',
    icon: vercelIcon,
    mode: 'dev',
    category: { pt: 'Deploy & Edge', en: 'Deploy & Edge' },
    level: 85,
    color: '#FFFFFF',
    description: {
      pt: 'Deploy contínuo integrado ao GitHub, gerenciamento de domínios customizados e build edge otimizado.',
      en: 'Continuous GitHub-connected deployments, custom domain routing, and optimized edge builds.',
    },
    relatedSlugs: ['financas-sem-fronteiras', 'comedoria-da-tia'],
  },
  {
    id: 'github',
    name: 'Git & GitHub',
    icon: githubIcon,
    mode: 'dev',
    category: { pt: 'Versionamento', en: 'Version Control' },
    level: 80,
    color: '#F05032',
    description: {
      pt: 'Fluxos de branch (Git Flow), pull requests, resolução de conflitos e histórico de commits limpo.',
      en: 'Branching workflows (Git Flow), pull requests, merge conflict resolution, and clean commit history.',
    },
    relatedSlugs: ['barreira-ecologica-bea', 'instituto-criativo-dashboard'],
  },
];

export const designCapabilities = [
  {
    id: 'figma',
    name: 'Figma',
    icon: figmaIcon,
    color: '#F24E1E',
    level: 95,
    description: {
      pt: 'Prototipagem interativa, Design Systems com tokens, Auto Layout responsivo e handoff milimétrico para código.',
      en: 'Interactive prototyping, token-based Design Systems, responsive Auto Layout, and precise dev handoff.',
    },
    relatedSlugs: ['comedoria-da-tia', 'maratona-sbc-2025', 'financas-sem-fronteiras'],
  },
  {
    id: 'photoshop',
    name: 'Adobe Photoshop',
    icon: photoshopIcon,
    color: '#31A8FF',
    level: 70,
    description: {
      pt: 'Manipulação de imagens, criação de mockups realistas, tratamento de fotos, embalagens comerciais e peças para impressão.',
      en: 'Image manipulation, realistic mockups, photo retouching, commercial packaging, and print collateral.',
    },
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    icon: figmaIcon,
    color: '#0066FF',
    level: 90,
    description: {
      pt: 'Pesquisa com usuários, mapeamento de jornadas, wireframing de alta fidelidade e interfaces digitais fluidas.',
      en: 'User research, journey mapping, high-fidelity wireframing, and fluid digital interface design.',
    },
  },
  {
    id: 'brand-identity',
    name: 'Identidade Visual',
    icon: photoshopIcon,
    color: '#AA1719',
    level: 85,
    description: {
      pt: 'Criação de marcas, mascotes, tipografia expressiva e sistemas visuais completos para eventos e iniciativas corporativas.',
      en: 'Branding, mascots, expressive typography, and comprehensive visual systems for events and corporate brands.',
    },
  },
  {
    id: 'editorial-print',
    name: 'Design Editorial & Gráfico',
    icon: figmaIcon,
    color: '#0052CC',
    level: 70,
    description: {
      pt: 'Diagramação de revistas completas, álbuns de figurinhas colecionáveis, catálogos de venda, crachás e cartazes.',
      en: 'Complete magazine layout, collectible sticker albums, sales catalogs, badges, and exhibition posters.',
    },
  },
  {
    id: 'packaging-catalogs',
    name: 'Embalagens & Catálogos',
    icon: photoshopIcon,
    color: '#2563EB',
    level: 75,
    description: {
      pt: 'Adequação gráfica de embalagens para linhas industriais e confecção de catálogos comerciais de vendas (Volcano).',
      en: 'Product line packaging design and commercial sales catalogs tailored for retail performance (Volcano).',
    },
  },
];
