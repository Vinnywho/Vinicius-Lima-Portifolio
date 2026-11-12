import revistasImg from '../assets/images/revistas.webp';
import comedoriaImg from '../assets/images/dispositivos_comedoria.webp';
import barreiraImg from '../assets/images/Projetos/383340179-3af2d9d0-9894-4afb-aace-7c225ca56bab 1.png';
import petshopImg from '../assets/images/Projetos/434983031-1a4a1ce0-cd4f-4084-abc9-3694f2cdb74c 1.png';
import dashboardImg from '../assets/images/Projetos/DASHBOARD.png';
import jogoImg from '../assets/images/Projetos/image 35.png';
import maeImg from '../assets/images/Projetos/image 36.png';
import maeAltImg from '../assets/images/Projetos/image 36-1.png';
import financasImg from '../assets/images/Projetos/financassemfronteira.webp';
import sebraeImg from '../assets/images/Projetos/Sebrae/sebrae.png';
import Os from '../assets/images/Projetos/Sebrae/os.png';
import Relatorios from '../assets/images/Projetos/Sebrae/relatorios.png';
import LoginBlue from '../assets/images/Projetos/Sebrae/login.png';
import FinancasLP from '../assets/images/Projetos/Financas/financassemfronteiras.png';
import rdd from '../assets/images/Projetos/Financas/rdd.png';
import Brandbook from '../assets/images/Projetos/Financas/Brandbook.png';
import finSec12 from '../assets/images/Projetos/Financas/section12.png';
import finSec13 from '../assets/images/Projetos/Financas/section13.png';
import finSec14 from '../assets/images/Projetos/Financas/section14.png';
import finSec15 from '../assets/images/Projetos/Financas/section15.png';
import finSec16 from '../assets/images/Projetos/Financas/section16.png';
import finSec17 from '../assets/images/Projetos/Financas/section17.png';

import cppIcon from '../assets/Icons/C++.svg';
import jsIcon from '../assets/Icons/JS.svg';
import reactIcon from '../assets/Icons/react-2.svg';
import htmlIcon from '../assets/Icons/HTML.svg';
import cssIcon from '../assets/Icons/CSS.svg';
import figmaIcon from '../assets/Icons/figma-svgrepo-com.svg';
import azureIcon from '../assets/Icons/microsoftazure-svgrepo-com.svg';
import csharpIcon from '../assets/Icons/Csharp.svg';
import mysqlIcon from '../assets/Icons/mysql-logo-pure.svg';
import vercelIcon from '../assets/Icons/Vercel.svg';
import supabaseIcon from '../assets/Icons/supabase-logo-icon 1.svg';
import javaIcon from '../assets/Icons/java-4 (1).svg';

export const projects = [
  {
    id: 'sebrae-blue',
    slug: 'sebrae-blue',
    category: 'dev',
    featured: true,
    year: '2026',
    accentColor: '#0066FF',
    coverImage: sebraeImg,
    title: {
      pt: 'Sebrae Blue',
      en: 'Sebrae Blue',
    },
    shortDesc: {
      pt: 'Dashboard administrativo para gestão de Ordens de Serviço, clientes e métricas de desempenho, desenvolvido em React e Supabase.',
      en: 'Administrative dashboard for managing service orders, clients, and performance metrics, built with React and Supabase.',
    },
    fullDesc: {
      pt: 'Projeto de dashboard administrativo desenvolvido para a Blue Consult em conjunto com o Sebrae, uma iniciativa de inovação e suporte à empresa. A plataforma permite gerenciar Ordens de Serviço, clientes e métricas de desempenho em tempo real, utilizando React para a interface e Supabase para o backend.',
      en: 'Administrative dashboard project developed for Blue Consult in collaboration with Sebrae, an innovation and business support initiative. The platform enables real-time management of Service Orders, clients, and performance metrics, utilizing React for the interface and Supabase for the backend.',
    },
    liveUrl: 'https://sebrae-three.vercel.app',
    repoUrl: 'https://github.com/Vinnywho/SEBRAE',
    techs: [
      { name: 'React', icon: reactIcon },
      { name: 'HTML5', icon: htmlIcon },
      { name: 'CSS3', icon: cssIcon },
      { name: 'Vercel', icon: vercelIcon },
      { name: 'Figma', icon: figmaIcon },
      { name: 'Supabase', icon: supabaseIcon },
    ],
    devDetails: {
      challenge: {
        pt: 'Entender o fluxo da empresa no dia a dia e desenvolver um dashboard administrativo eficiente para a Blue Consult em colaboração com o Sebrae, permitindo o gerenciamento em tempo real de Ordens de Serviço, clientes e métricas de desempenho.',
        en: 'Understand the company\'s daily workflow and develop an efficient administrative dashboard for Blue Consult in collaboration with Sebrae, enabling real-time management of Service Orders, clients, and performance metrics.',
      },
      solution: {
        pt: 'Desenvolvimento de um dashboard em React com componentes modulares, layout responsivo e integração com Supabase para gerenciamento de dados em tempo real. A interface foi projetada para ser intuitiva e eficiente, facilitando o trabalho da equipe da Blue Consult.',
        en: 'Development of a React dashboard with modular components, responsive layout, and Supabase integration for real-time data management. The interface was designed to be intuitive and efficient, facilitating the work of the Blue Consult team.'
      },
      highlights: {
        pt: [
          'Dashboard administrativo em produção para a Blue Consult em parceria com o Sebrae.',
          'Integração em tempo real com Supabase para gerenciamento de Ordens de Serviço, clientes e métricas.',
          'Interface responsiva e intuitiva, projetada para facilitar o trabalho da equipe.',
        ],
        en: [
          'Administrative dashboard in production for Blue Consult in partnership with Sebrae.',
          'Real-time integration with Supabase for managing Service Orders, clients, and metrics.',
          'Responsive and intuitive interface designed to facilitate the team\'s workflow.',
        ],
      },
      scrollFrames: [
        {
          title: {
            pt: 'sebrae-three.vercel.app — Login & Acesso ao Sistema',
            en: 'sebrae-three.vercel.app — Login & System Access',
          },
          image: LoginBlue,
          caption: {
            pt: 'Tela de autenticação do sistema Sebrae Blue — role dentro da janela para inspecionar.',
            en: 'Sebrae Blue authentication screen — scroll inside the frame to inspect.',
          },
        },
        {
          title: {
            pt: 'Dashboard Principal — Visão Geral e Métricas',
            en: 'Main Dashboard — Overview & Metrics',
          },
          image: sebraeImg,
          caption: {
            pt: 'Painel administrativo com indicadores de desempenho em tempo real.',
            en: 'Administrative panel with real-time performance indicators.',
          },
        },
        {
          title: {
            pt: 'Gestão de Ordens de Serviço (OS)',
            en: 'Service Order (SO) Management',
          },
          image: Os,
          caption: {
            pt: 'Fluxo de criação, acompanhamento e controle de Ordens de Serviço.',
            en: 'Creation, tracking, and control workflow for Service Orders.',
          },
        },
        {
          title: {
            pt: 'Módulo de Relatórios & Análises',
            en: 'Reports & Analytics Module',
          },
          image: Relatorios,
          caption: {
            pt: 'Visualização consolidada de relatórios gerenciais para a Blue Consult.',
            en: 'Consolidated management reports view for Blue Consult.',
          },
        },
      ],
    }
  },
  {
    id: 'financas-sem-fronteiras',
    slug: 'financas-sem-fronteiras',
    category: 'both',
    featured: true,
    year: '2025',
    accentColor: '#274646',
    coverImage: financasImg,
    title: {
      pt: 'Finanças Sem Fronteiras',
      en: 'Finanças Sem Fronteiras',
    },
    shortDesc: {
      pt: 'Landing page e blog profissional desenvolvida para Finanças Sem Fronteiras, uma iniciativa de educação financeira e inclusão social.',
      en: 'Production landing page and blog built for Finanças Sem Fronteiras, a financial education and social inclusion initiative.',
    },
    fullDesc: {
      pt: `Produção de uma Landing page e blog empresarial desenvolvida sob medida para o projeto Finanças Sem Fronteiras, iniciativa liderada por Janina Janino focada em promover educação financeira e inclusão social por meio de cursos, mentorias e conteúdos acessíveis.
      Rebranding completo da marca desde a logo até toda a identidade visual, além de criar presença digital profissional de alta conversão e carregamento instantâneo para uma empresa real apresentar seus programas educacionais e captar novos alunos e parceiros. 
      Desenvolvimento de Mockups criativos para reforçar a identidade da marca.
      `,
      en: 'Bespoke corporate landing page and blog engineered for Finanças Sem Fronteiras, an initiative led by Janina Janino dedicated to advancing financial literacy and social inclusion through accessible courses and mentoring.',
    },
    liveUrl: 'https://financassemfronteira.com.br/',
    repoUrl: 'https://github.com/Vinnywho',
    techs: [
      { name: 'React', icon: reactIcon },
      { name: 'HTML5', icon: htmlIcon },
      { name: 'CSS3', icon: cssIcon },
      { name: 'Vercel', icon: vercelIcon },
      { name: 'Figma', icon: figmaIcon },
      { name: 'Supabase', icon: supabaseIcon },
    ],
    devDetails: {
      challenge: {
        pt: 'Criar presença digital profissional de alta conversão e carregamento instantâneo para uma empresa real apresentar seus programas educacionais e captar novos alunos e parceiros.',
        en: 'Deliver a high-converting, fast-loading digital presence for a real business to showcase educational programs and capture leads.',
      },
      solution: {
        pt: 'Desenvolvimento em React com componentes modulares, layout responsivo de ponta a ponta prototipado previamente no Figma, hierarquia visual clara e deploy contínuo otimizado na Vercel.',
        en: 'Built in React with modular components, end-to-end responsive layout prototyped in Figma, clear visual hierarchy, and continuous edge deployment on Vercel.',
      },
      highlights: {
        pt: [
          'Projeto real em produção atendendo cliente comercial.',
          'Fidelidade entre protótipo no Figma e código React.',
          'Otimização para dispositivos móveis e SEO.',
          'Animações e transições suaves para engajamento do usuário usando AOS.',
        ],
        en: [
          'Live production website serving a real business client.',
          'Pixel-accurate translation from Figma prototype to React components.',
          'Mobile-first responsiveness and SEO optimization.',
          'Smooth animations and transitions for user engagement using AOS.',
        ],
      },
      gallery: [financasImg],
    },
    designShowcase: {
      client: 'Finanças Sem Fronteiras (Janina Janino)',
      role: {
        pt: 'UI/UX Designer & Desenvolvedor Front-End',
        en: 'UI/UX Designer & Front-End Developer',
      },
      deliverables: {
        pt: ['Rebranding & Identidade Visual', 'UI/UX Design', 'Mockups Criativos', 'Blog & Área Restrita'],
        en: ['Rebranding & Brand Identity', 'UI/UX Design', 'Creative Mockups', 'Blog & Admin Portal'],
      },
      palette: ['#183636', '#AD894F', '#D7C36B', '#1E1E1E', '#FFFFFF'],
      typography: {
        heading: 'Montserrat Bold',
        body: 'Montserrat Regular',
      },
      behanceBlocks: [
        {
          type: 'hero-image',
          image: financasImg,
          caption: {
            pt: 'Mockup principal de apresentação da nova identidade visual e experiência multi-dispositivo do projeto Finanças Sem Fronteiras.',
            en: 'Primary presentation mockup showcasing the refreshed brand identity and responsive Finanças Sem Fronteiras experience.',
          },
        },
        {
          type: 'text-section',
          heading: {
            pt: '01. Rebranding & Direção Visual',
            en: '01. Rebranding & Visual Direction',
          },
          body: {
            pt: 'Todo o sistema visual foi redesenhado a partir da nova logomarca, unindo o verde petróleo profundo ao dourado acolhedor e tons creme de alta legibilidade. O objetivo foi transmitir segurança, empatia e rigor técnico para tornar a Educação Financeira Comportamental acessível.',
            en: 'The entire visual system was rebuilt around a refreshed logo, pairing deep forest green with warm gold accents and soft cream surfaces to convey trust, empathy, and behavioral clarity.',
          },
        },
        {
          type: 'scroll-frame',
          title: {
            pt: 'Brandbook Digital — Role para inspecionar a identidade visual completa',
            en: 'Brandbook Digital — Scroll to inspect the full brand identity',
          },
          image: Brandbook,
          caption: {
            pt: 'Visão contínua do Brandbook em produção',
            en: 'Full continuous scroll view of the live Brandbook',
          },
        },
        {
          type: 'text-section',
          heading: {
            pt: '02. Site & Blog Profissional',
            en: '02. Professional Website & Blog',
          },
          body: {
            pt: 'Todo o site foi desenvolvido em React com componentes modulares, layout responsivo de ponta a ponta prototipado previamente no Figma, hierarquia visual clara e deploy contínuo otimizado na Vercel.',
            en: 'The entire website was developed in React with modular components, a responsive layout prototyped in Figma, clear visual hierarchy, and continuous deployment optimized on Vercel.',
          },
        },
        {
          type: 'metrics',
          items: [
            { value: '+17', label: { pt: 'Telas & Seções Projetadas', en: 'Designed Screens & Sections' } },
            { value: '100%', label: { pt: 'Site & Blog em Produção', en: 'Live Website & Blog' } },
            { value: 'Full', label: { pt: 'Rebranding + UI/UX', en: 'Rebranding + UI/UX' } },
          ],
        },
        {
          type: 'scroll-frame',
          title: {
            pt: 'financassemfronteira.com.br — Role para navegar pela Landing Page completa',
            en: 'financassemfronteira.com.br — Scroll to inspect the full Landing Page',
          },
          image: FinancasLP,
          caption: {
            pt: 'Visão contínua da Landing Page em produção (Hero, Performance & Pilares, Soluções, Blog, Contato e Footer).',
            en: 'Full continuous scroll view of the live Landing Page (Hero, Performance & Pillars, Solutions, Blog, Contact, and Footer).',
          },
        },
        {
          type: 'scroll-frame',
          title: {
            pt: 'financassemfronteira.com.br/conversa-de-reconhecimento — Role para conhecer o RDD',
            en: 'financassemfronteira.com.br/conversa-de-reconhecimento — Scroll to meet the RDD',
          },
          image: rdd,
          caption: {
            pt: 'Um primeiro encontro para conhecer a abordagem da Finanças sem Fronteira, entender o AFINCO e a metodologia RRDD e descobrir se esse acompanhamento faz sentido para o seu momento.',
            en: 'A first meeting to learn about the approach of Finanças sem Fronteira, understand AFINCO and the RRDD methodology, and discover if this coaching makes sense for your current moment.',
          },
        },
        {
          type: 'gallery-grid',
          heading: {
            pt: 'Páginas de Soluções & Área Restrita',
            en: 'Solution Pages & Restricted Portal',
          },
          items: [
            {
              image: finSec12,
              caption: {
                pt: 'Página dedicada de “Consultoria e Foco” com recorte fotográfico circular e listagem de benefícios.',
                en: 'Dedicated “Consulting & Focus” page with framed photography and key outcomes.',
              },
            },
            {
              image: finSec13,
              caption: {
                pt: 'Página “Formações e Cursos” apresentando metodologia presencial e acesso ao curso online.',
                en: '“Training & Courses” layout showcasing workshops and online course links.',
              },
            },
            {
              image: finSec14,
              caption: {
                pt: 'Página “Roda de conversa, Workshops e oficinas” valorizando fotografias reais das dinâmicas em grupo.',
                en: '“Workshops & Circles” page spotlighting real community session photos.',
              },
            },
            {
              image: finSec15,
              caption: {
                pt: 'Página “Outras atividades” voltada a palestras e programas corporativos sob medida.',
                en: '“Other Activities” layout tailored to corporate talks and custom mentoring.',
              },
            },
            {
              image: finSec17,
              caption: {
                pt: 'Tela de autenticação da Área Restrita para administração de publicações do Blog.',
                en: 'Restricted Admin Portal login UI for managing blog posts and content.',
              },
            },
          ],
        },
        {
          type: 'scroll-frame',
          title: {
            pt: 'Leitura do Artigo Completo no Blog — Role para inspecionar a tipografia editorial',
            en: 'Full Blog Article View — Scroll to inspect editorial typography',
          },
          image: finSec16,
          caption: {
            pt: 'Página interna de artigo do Blog (“Meu primeiro salário: e agora?”) projetada para leitura confortável e conversão para a Conversa de Reconhecimento.',
            en: 'Internal Blog article layout designed for comfortable long-form reading and discovery call conversion.',
          },
        },
      ],
    },
  },
  {
    id: 'maratona-sbc-2025',
    slug: 'maratona-sbc-2025',
    category: 'design',
    featured: true,
    year: '2025',
    accentColor: '#AA1719',
    coverImage: revistasImg,
    title: {
      pt: 'Maratona SBC 2025',
      en: 'SBC Programming Marathon 2025',
    },
    shortDesc: {
      pt: 'Identidade visual completa, mascotes, editorial, camisetas, crachás e álbum de figurinhas oficial da edição sediada pela FECAP.',
      en: 'Complete visual identity, mascots, editorial layout, apparel, badges, and official sticker album for the FECAP-hosted edition.',
    },
    fullDesc: {
      pt: 'Participei da Maratona SBC de Programação em 2025 como competidor na primeira fase, me encantei pelo projeto, e a convite da Diretora de Patrocínios, Lucy Mary Tabutti, me tornei o designer oficial da edição. Desenvolvi o design da logo, mascotes, camisetas, cartazes, crachás, revista e álbum de figurinhas, todos utilizados no dia oficial da competição sediada pela FECAP.',
      en: 'I joined the 2025 SBC Programming Marathon as a first-phase competitor, fell in love with the initiative, and at the invitation of Sponsorship Director Lucy Mary Tabutti became the official designer for the edition. I crafted the logo, mascots, t-shirts, posters, badges, official magazine, and sticker album—all deployed live at the FECAP-hosted competition.',
    },
    liveUrl: 'https://maratona.institutocriativo.org.br',
    repoUrl: null,
    techs: [
      { name: 'Figma', icon: figmaIcon },
      { name: 'HTML5', icon: htmlIcon },
      { name: 'CSS3', icon: cssIcon },
    ],
    designShowcase: {
      client: 'Maratona SBC de Programação / Instituto Criativo / FECAP',
      role: {
        pt: 'Designer Gráfico Oficial & Direção de Arte',
        en: 'Official Graphic Designer & Art Direction',
      },
      deliverables: {
        pt: ['Identidade Visual', 'Mascotes', 'Revista & Álbum', 'Camisetas & Crachás', 'Sinalização'],
        en: ['Brand Identity', 'Mascots', 'Magazine & Sticker Album', 'Apparel & Badges', 'Event Signage'],
      },
      palette: ['#AA1719', '#0E0E0E', '#FBFBF2', '#F4A261', '#1D3557'],
      typography: {
        heading: 'Montserrat Black / Display Urbano',
        body: 'Montserrat Regular & Medium',
      },
      behanceBlocks: [
        {
          type: 'hero-image',
          image: revistasImg,
          caption: {
            pt: 'Mockup da revista oficial e peças editoriais produzidas para competidores, coaches e patrocinadores.',
            en: 'Official magazine mockup and editorial collateral produced for competitors, coaches, and sponsors.',
          },
        },
        {
          type: 'text-section',
          heading: { pt: '01. Conceito & Direção Criativa', en: '01. Concept & Creative Direction' },
          body: {
            pt: 'O desafio era traduzir a intensidade lógica da programação competitiva em um sistema visual energético, colecionável e memorável. A criação de mascotes e de um álbum de figurinhas transformou a interação entre equipes e patrocinadores durante todo o dia do evento.',
            en: 'The challenge was translating the intense logic of competitive programming into an energetic, collectible, and memorable visual system. Creating mascots and a physical sticker album boosted interaction across teams and sponsors throughout the event day.',
          },
        },
        {
          type: 'metrics',
          items: [
            { value: '+10', label: { pt: 'Peças Gráficas Oficiais', en: 'Official Print & Digital Assets' } },
            { value: '100%', label: { pt: 'Adotado no Dia do Evento', en: 'Deployed on Event Day' } },
            { value: 'FECAP', label: { pt: 'Sede Oficial 2025', en: '2025 Official Host' } },
          ],
        },
      ],
    },
  },
  {
    id: 'comedoria-da-tia',
    slug: 'comedoria-da-tia',
    category: 'both',
    featured: true,
    year: '2025',
    accentColor: '#244F33',
    coverImage: comedoriaImg,
    title: {
      pt: 'Comedoria da Tia App & Web',
      en: 'Comedoria da Tia App & Web',
    },
    shortDesc: {
      pt: 'Ecossistema mobile e web desenvolvido no 3º período da faculdade para eliminar filas e digitalizar pedidos no campus.',
      en: 'Mobile and web ecosystem built during my 3rd university semester to eliminate campus canteen queues and digitize orders.',
    },
    fullDesc: {
      pt: 'Projeto integrador desenvolvido durante o 3º período da graduação. Um aplicativo mobile Android integrado a uma plataforma web de gestão criados para solucionar gargalos reais do empreendimento dentro do campus: filas longas nos intervalos e falta de visibilidade sobre o estoque em tempo real.',
      en: 'Capstone project built during my 3rd university semester. An Android mobile app integrated with a web management dashboard created to solve real bottlenecks at a campus eatery: long break-time queues and lack of real-time product availability.',
    },
    liveUrl: 'https://cantina-v2.vercel.app/',
    repoUrl: 'https://github.com/Vinnywho',
    techs: [
      { name: 'React', icon: reactIcon },
      { name: 'Java', icon: javaIcon },
      { name: 'Supabase', icon: supabaseIcon },
      { name: 'Vercel', icon: vercelIcon },
      { name: 'Figma', icon: figmaIcon },
    ],
    devDetails: {
      challenge: {
        pt: 'Durante os intervalos acadêmicos de 15 minutos, a cantina enfrentava filas extensas e clientes desistiam por não saberem quais salgados ou bebidas ainda estavam disponíveis.',
        en: 'During 15-minute academic breaks, the campus canteen faced severe queues and lost orders because students had no visibility on real-time item stock.',
      },
      solution: {
        pt: 'Arquitetamos uma plataforma dupla: um app mobile (Android/Java) para pedidos antecipados pelos alunos com retirada rápida via código, sincronizado em tempo real via Supabase (PostgreSQL) com um painel web React hospedado na Vercel para a equipe da cantina.',
        en: 'We architected a dual platform: a mobile Android app (Java) for advance student ordering and quick code pickup, synced in real time via Supabase (PostgreSQL) with a React web operations panel hosted on Vercel.',
      },
      highlights: {
        pt: [
          'Sincronização em tempo real de disponibilidade de estoque e status do pedido.',
          'Separação clara de fluxos: Cliente (Mobile) vs Operação/Cozinha (Web).',
          'Prototipação completa no Figma validada com usuários reais do campus.',
        ],
        en: [
          'Real-time synchronization of product availability and order status.',
          'Clear flow separation: Customer (Mobile) vs Kitchen/Counter Ops (Web).',
          'End-to-end Figma prototyping validated with real campus students.',
        ],
      },
      gallery: [comedoriaImg],
    },
    designShowcase: {
      client: 'Comedoria da Tia — Projeto Integrador FECAP',
      role: {
        pt: 'UI/UX Designer & Desenvolvedor Front-End',
        en: 'UI/UX Designer & Front-End Developer',
      },
      deliverables: {
        pt: ['Pesquisa UX', 'Wireframes', 'UI Mobile & Web', 'Design System', 'Prototipação'],
        en: ['UX Research', 'Wireframes', 'Mobile & Web UI', 'Design System', 'Prototyping'],
      },
      palette: ['#244F33', '#F4EFE6', '#E07A5F', '#1E1E1E', '#FFFFFF'],
      typography: {
        heading: 'Montserrat Bold',
        body: 'Inter / Montserrat',
      },
      behanceBlocks: [
        {
          type: 'hero-image',
          image: comedoriaImg,
          caption: {
            pt: 'Interface responsiva multi-dispositivo: experiência fluida no celular do estudante e no painel da cantina.',
            en: 'Cross-device responsive interface: seamless experience across student mobile devices and counter displays.',
          },
        },
        {
          type: 'text-section',
          heading: { pt: '01. Design Orientado à Agilidade', en: '01. Speed-Oriented Design' },
          body: {
            pt: 'A paleta verde-oliva e creme evoca comida artesanal e acolhimento, mantendo alto contraste para decisões rápidas em fila. O fluxo de compra foi reduzido para no máximo 3 toques entre escolher o lanche e confirmar o horário de retirada.',
            en: 'The forest-green and cream palette evokes warmth and homemade food while preserving crisp contrast for rapid choices. Checkout was streamlined to at most 3 taps from menu selection to pickup confirmation.',
          },
        },
      ],
    },
  },
  {
    id: 'instituto-criativo-dashboard',
    slug: 'instituto-criativo-dashboard',
    category: 'dev',
    featured: false,
    year: '2025',
    accentColor: '#0078D4',
    coverImage: dashboardImg,
    title: {
      pt: 'Instituto Criativo Dashboard',
      en: 'Instituto Criativo Dashboard',
    },
    shortDesc: {
      pt: 'Dashboard corporativo que centraliza atividades, presença e métricas em tempo real integrado com C#, Azure e MySQL.',
      en: 'Enterprise dashboard centralizing activities, attendance, and real-time metrics powered by C#, Azure, and MySQL.',
    },
    fullDesc: {
      pt: 'Solução corporativa desenvolvida no 2º semestre integrando front-end React com back-end C#, nuvem Microsoft Azure e banco relacional MySQL. Oferece visualização estratégica de dados, controle de presença e geração de relatórios em tempo real.',
      en: 'Enterprise web application built in the 2nd semester integrating a React front-end with a C# back-end, Microsoft Azure cloud, and MySQL relational database. Delivers strategic KPIs, attendance tracking, and real-time reporting.',
    },
    liveUrl: 'https://github.com/2025-1-NADS2/Projeto3',
    repoUrl: 'https://github.com/2025-1-NADS2/Projeto3',
    techs: [
      { name: 'React', icon: reactIcon },
      { name: 'JavaScript', icon: jsIcon },
      { name: 'C#', icon: csharpIcon },
      { name: 'MySQL', icon: mysqlIcon },
      { name: 'Azure', icon: azureIcon },
      { name: 'Figma', icon: figmaIcon },
    ],
    devDetails: {
      challenge: {
        pt: 'Substituir planilhas fragmentadas de controle de atividades e presença por um painel único, seguro e atualizável em tempo real.',
        en: 'Replace fragmented activity and attendance spreadsheets with a unified, secure, real-time analytics portal.',
      },
      solution: {
        pt: 'Construção de SPA em React consumindo API REST em C# hospedada no Microsoft Azure com persistência estruturada em MySQL e interface prototipada no Figma.',
        en: 'React SPA consuming a C# REST API hosted on Microsoft Azure backed by MySQL relational storage and a Figma-designed interface.',
      },
      highlights: {
        pt: [
          'Integração full-stack completa: React + C# + Azure + MySQL.',
          'Painéis gerenciais com filtragem dinâmica e relatórios em tempo real.',
        ],
        en: [
          'Full-stack integration: React + C# + Azure + MySQL.',
          'Management views with dynamic filtering and live reporting.',
        ],
      },
      gallery: [dashboardImg],
    },
  },
  {
    id: 'barreira-ecologica-bea',
    slug: 'barreira-ecologica-bea',
    category: 'dev',
    featured: false,
    year: '2024',
    accentColor: '#00599C',
    coverImage: barreiraImg,
    title: {
      pt: 'Barreira Ecológica Automática (B.E.A.)',
      en: 'Automatic Ecological Barrier (B.E.A.)',
    },
    shortDesc: {
      pt: 'Sistema IoT em C++ com Arduino/ESP32 e sensores infravermelhos para recolhimento autônomo de lixo flutuante.',
      en: 'C++ IoT system with Arduino/ESP32 and infrared sensors for autonomous floating waste collection in urban rivers.',
    },
    fullDesc: {
      pt: 'Projeto de IoT e sustentabilidade desenvolvido no 1º semestre da FECAP. A B.E.A. utiliza microcontroladores, sensores infravermelhos e motores de passo programados em C++ para detectar e remover detritos de superfícies aquáticas de forma autônoma, prevenindo entupimentos e enchentes urbanas.',
      en: 'IoT & sustainability hardware/software project built in the 1st semester at FECAP. B.E.A. uses microcontrollers, infrared sensors, and stepper motors programmed in C++ to autonomously detect and collect floating debris, helping prevent urban flooding.',
    },
    liveUrl: 'https://github.com/2024-2-NADS1/Projeto1',
    repoUrl: 'https://github.com/2024-2-NADS1/Projeto1',
    techs: [
      { name: 'C++', icon: cppIcon },
    ],
    devDetails: {
      challenge: {
        pt: 'Detectar detritos flutuantes com baixo custo energético e acionar mecanismos físicos de coleta sem intervenção humana constante.',
        en: 'Detect floating waste reliably on low power and actuate mechanical collection paddles autonomously.',
      },
      solution: {
        pt: 'Firmware embarcado em C++ com leitura contínua de sensores IR, controle preciso de motores de passo e prototipagem física integrada.',
        en: 'Embedded C++ firmware reading IR sensor arrays with precision stepper motor control on a physical prototype.',
      },
      highlights: {
        pt: [
          'Programação embarcada de baixo nível em C++.',
          'Impacto socioambiental direto aplicado à realidade urbana de São Paulo.',
        ],
        en: [
          'Low-level embedded C++ programming.',
          'Direct environmental impact tailored to urban flood prevention.',
        ],
      },
      gallery: [barreiraImg],
    },
  },
  {
    id: 'pet-shop',
    slug: 'pet-shop',
    category: 'dev',
    featured: false,
    year: '2024',
    accentColor: '#F7DF1E',
    coverImage: petshopImg,
    title: {
      pt: 'Pet Shop — Gestão & Agendamentos',
      en: 'Pet Shop — Management & Scheduling',
    },
    shortDesc: {
      pt: 'Plataforma web completa de CRUD para cadastro de clientes, pets, histórico fotográfico e agendamento de serviços.',
      en: 'Full CRUD web platform for client/pet registration, photo history, and service scheduling.',
    },
    fullDesc: {
      pt: 'Sistema completo de CRUD desenvolvido para otimizar o fluxo diário de pet shops, permitindo cadastro de tutores e pets, registro fotográfico de atendimentos e agendamento organizado de banho, tosa e consultas.',
      en: 'End-to-end CRUD system built to streamline daily pet shop operations, supporting owner and pet profiles, service photo logs, and organized appointment scheduling.',
    },
    liveUrl: 'https://github.com/Vinnywho/PetShop',
    repoUrl: 'https://github.com/Vinnywho/PetShop',
    techs: [
      { name: 'JavaScript', icon: jsIcon },
      { name: 'HTML5', icon: htmlIcon },
      { name: 'CSS3', icon: cssIcon },
      { name: 'MySQL', icon: mysqlIcon },
      { name: 'Figma', icon: figmaIcon },
    ],
    devDetails: {
      challenge: {
        pt: 'Centralizar o histórico dos pets e evitar conflitos de horários em agendas feitas manualmente.',
        en: 'Centralize pet service history and eliminate scheduling conflicts common in manual notebooks.',
      },
      solution: {
        pt: 'Aplicação web com interface amigável prototipada no Figma, lógica de validação em JavaScript e persistência relacional em MySQL.',
        en: 'Web application with a Figma-designed UI, JavaScript validation logic, and MySQL relational persistence.',
      },
      highlights: {
        pt: [
          'CRUD completo com relacionamento entre tutores, pets e agendamentos.',
          'Histórico fotográfico integrado ao perfil do animal.',
        ],
        en: [
          'Full CRUD connecting owners, pets, and scheduled services.',
          'Integrated photo history on each pet profile.',
        ],
      },
      gallery: [petshopImg],
    },
  },
  {
    id: 'o-acampamento',
    slug: 'o-acampamento',
    category: 'dev',
    featured: false,
    year: '2024',
    accentColor: '#AA1719',
    coverImage: jogoImg,
    title: {
      pt: 'O Acampamento — Text Adventure',
      en: 'The Camp — Text Adventure',
    },
    shortDesc: {
      pt: 'Jogo interativo de narrativa ramificada em JavaScript com múltiplos finais e sistema dinâmico de vidas.',
      en: 'Branching narrative web game in JavaScript featuring multiple endings and a dynamic life system.',
    },
    fullDesc: {
      pt: 'Desenvolvido em JavaScript puro, este jogo explora narrativa interativa e tomada de decisão sob pressão: cada escolha altera o estado de sobrevivência do personagem e desbloqueia caminhos e finais distintos.',
      en: 'Built in vanilla JavaScript, this interactive fiction game focuses on branching choices under pressure where every decision affects player survival and unlocks distinct endings.',
    },
    liveUrl: 'https://github.com/Vinnywho/O-Acampamento',
    repoUrl: 'https://github.com/Vinnywho/O-Acampamento',
    techs: [
      { name: 'JavaScript', icon: jsIcon },
      { name: 'HTML5', icon: htmlIcon },
      { name: 'CSS3', icon: cssIcon },
      { name: 'Figma', icon: figmaIcon },
    ],
    devDetails: {
      challenge: {
        pt: 'Estruturar uma máquina de estados narrativa limpa sem dependências externas, mantendo a imersão visual e sonora do jogador.',
        en: 'Structure a clean narrative state machine without external dependencies while keeping strong visual immersion.',
      },
      solution: {
        pt: 'Grafo de decisões em JavaScript vanilla com gerenciamento de inventário/vidas, transições dinâmicas e interface temática.',
        en: 'Vanilla JavaScript decision graph with state/lives management, dynamic transitions, and atmospheric UI.',
      },
      highlights: {
        pt: [
          'Lógica de múltiplos finais baseada em árvore de decisões.',
          'JavaScript puro focado em manipulação de estado e UX lúdica.',
        ],
        en: [
          'Multi-ending logic driven by a branching decision tree.',
          'Pure JavaScript state management and playful UX.',
        ],
      },
      gallery: [jogoImg],
    },
  },
  {
    id: 'dia-das-maes',
    slug: 'dia-das-maes',
    category: 'both',
    featured: false,
    year: '2024',
    accentColor: '#E63946',
    coverImage: maeImg,
    title: {
      pt: 'Homenagem — Dia das Mães',
      en: 'Mother’s Day Tribute Experience',
    },
    shortDesc: {
      pt: 'Experiência web afetiva e interativa criada como presente personalizado com animações e layout exclusivo.',
      en: 'Interactive and heartfelt web experience crafted as a personalized gift with custom animations and layout.',
    },
    fullDesc: {
      pt: 'Página comemorativa desenvolvida como presente especial para o Dia das Mães, unindo sensibilidade visual, tipografia afetiva e interatividade front-end para criar uma lembrança digital memorável.',
      en: 'Commemorative interactive web page crafted as a Mother’s Day gift, combining warm visual storytelling, typography, and front-end craft.',
    },
    liveUrl: 'https://papaya-cascaron-060459.netlify.app/mae',
    repoUrl: null,
    techs: [
      { name: 'HTML5', icon: htmlIcon },
      { name: 'CSS3', icon: cssIcon },
      { name: 'JavaScript', icon: jsIcon },
      { name: 'Figma', icon: figmaIcon },
    ],
    devDetails: {
      challenge: {
        pt: 'Criar uma experiência emocional responsiva que funcionasse perfeitamente no celular para ser aberta no momento da surpresa.',
        en: 'Build an emotional, mobile-ready interactive card that shines on smartphones.',
      },
      solution: {
        pt: 'Layout autoral pensado no Figma e implementado em HTML/CSS/JS com animações suaves e deploy rápido na Netlify.',
        en: 'Bespoke layout designed in Figma and coded in HTML/CSS/JS with smooth animations deployed on Netlify.',
      },
      highlights: {
        pt: [
          'Design emocional 100% personalizado.',
          'Foco em microinterações e responsividade mobile.',
        ],
        en: [
          '100% custom emotional UI design.',
          'Focus on micro-interactions and mobile responsiveness.',
        ],
      },
      gallery: [maeImg, maeAltImg],
    },
    designShowcase: {
      client: 'Projeto Pessoal / Homenagem',
      role: {
        pt: 'Direção de Arte & Front-End',
        en: 'Art Direction & Front-End',
      },
      deliverables: {
        pt: ['Direção Visual', 'UI Afetiva', 'Desenvolvimento Web'],
        en: ['Visual Direction', 'Emotional UI', 'Web Build'],
      },
      palette: ['#E63946', '#FFF1E6', '#2B2D42', '#FFB5A7'],
      typography: {
        heading: 'Display Editorial',
        body: 'Montserrat',
      },
      behanceBlocks: [
        {
          type: 'hero-image',
          image: maeImg,
          caption: {
            pt: 'Tela inicial da homenagem digital, equilibrando fotografia afetiva e tipografia expressiva.',
            en: 'Hero screen of the digital tribute, balancing warm photography and expressive typography.',
          },
        },
        {
          type: 'hero-image',
          image: maeAltImg,
          caption: {
            pt: 'Seções interativas e cards visuais adaptados para leitura confortável no smartphone.',
            en: 'Interactive sections and visual cards tailored for comfortable mobile reading.',
          },
        },
      ],
    },
  },
];
