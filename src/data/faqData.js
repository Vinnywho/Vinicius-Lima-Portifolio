export const faqItems = [
  {
    id: 'hire-model',
    category: 'general',
    question: {
      pt: 'Qual é a sua disponibilidade para contratação e modelos de trabalho?',
      en: 'What is your current availability and preferred work engagement model?',
    },
    answer: {
      pt: 'Estou disponível para oportunidades como Desenvolvedor Front-End Júnior, Estágio em Engenharia de Software, ou projetos Freelance como Front-End / UI Designer. Atuo tanto em modelo remoto quanto presencial/híbrido na região de São Paulo capital.',
      en: 'I am available for Junior Front-End Developer roles, Software Engineering internships, or Freelance Front-End / UI Design contracts. I work remotely or on-site/hybrid in the greater São Paulo area.',
    },
  },
  {
    id: 'stack-preference',
    category: 'frontend',
    question: {
      pt: 'Qual é o seu stack principal no desenvolvimento front-end?',
      en: 'What is your primary tech stack for front-end development?',
    },
    answer: {
      pt: 'Trabalho prioritariamente com React, JavaScript moderno (ES6+), CSS3 nativo com variáveis e cascade layers, GSAP (ScrollTrigger, Flip), HTML semântico e Vite. Também possuo vivência com TypeScript, C#, C++, Git/GitHub e integração com serviços cloud como Firebase.',
      en: 'I primarily work with React, modern JavaScript (ES6+), native CSS3 with custom properties and cascade layers, GSAP (ScrollTrigger, Flip), semantic HTML, and Vite. I also have hands-on experience with TypeScript, C#, C++, Git/GitHub, and cloud integrations like Firebase.',
    },
  },
  {
    id: 'figma-to-code',
    category: 'design',
    question: {
      pt: 'Como você realiza a transição entre Figma e código front-end?',
      en: 'How do you handle the transition between Figma designs and front-end code?',
    },
    answer: {
      pt: 'Por dominar ambos os lados, não há atrito ou "telefone sem fio". Crio componentes no Figma já pensando na arquitetura modular do React, tokens de design (espaçamento, cores, tipografia) e microinterações. No código, a fidelidade visual é pixel-perfect com responsividade nativa para mobile, tablet e desktop.',
      en: 'Because I master both disciplines, there is zero friction. I build Figma components designed around React modular architectures, design tokens (spacing, palette, type scale), and micro-interactions. In code, the output matches pixel-perfect fidelity with clean responsive breakpoints.',
    },
  },
  {
    id: 'performance-cwv',
    category: 'frontend',
    question: {
      pt: 'Como você garante que animações com GSAP não pesem na performance?',
      en: 'How do you ensure GSAP animations and canvas effects do not degrade performance?',
    },
    answer: {
      pt: 'Utilizo transformações aceleradas por GPU (transform3d, opacity), requestAnimationFrame, throttle em eventos de scroll/cursor, e respeito total à preferência do sistema por movimento reduzido (prefers-reduced-motion). Todas as animações são desacopladas do ciclo de render pesado do React.',
      en: 'I rely exclusively on GPU-accelerated transforms (transform3d, opacity), requestAnimationFrame loops, event throttling on scroll/pointer listeners, and strict adherence to prefers-reduced-motion media queries. Heavy DOM renders are kept isolated from animation frames.',
    },
  },
  {
    id: 'design-services',
    category: 'design',
    question: {
      pt: 'Quais tipos de projetos de design você desenvolve?',
      en: 'What types of design projects do you create?',
    },
    answer: {
      pt: 'Desenvolvo desde interfaces digitais completas (UI/UX para web e mobile, design systems, protótipos interativos de alta fidelidade) até identidade visual, marcas, embalagens, ilustrações autorais e materiais para eventos (como fui Designer Oficial da Maratona SBC 2025).',
      en: 'I craft complete digital interfaces (web & mobile UI/UX, design systems, clickable high-fidelity prototypes), brand identities, packaging, expressive character art, and event collateral (such as serving as Official Designer for the 2025 SBC Programming Marathon).',
    },
  },
  {
    id: 'project-timeline',
    category: 'process',
    question: {
      pt: 'Como funciona o processo de entrega e prazos de um projeto?',
      en: 'What does your project timeline and delivery process look like?',
    },
    answer: {
      pt: 'O processo é dividido em 4 etapas claras: 1) Briefing e alinhamento de escopo; 2) Prototipação / Wireframes no Figma para validação rápida; 3) Desenvolvimento front-end incremental com deploys contínuos para acompanhamento em tempo real; 4) QA, otimização de performance e entrega final.',
      en: 'The workflow is structured into 4 stages: 1) Discovery and scope definition; 2) Figma prototyping and wireframing for early sign-off; 3) Iterative front-end development with preview deploys for real-time tracking; 4) QA testing, performance audit, and final handoff.',
    },
  },
  {
    id: 'whatsapp-contact',
    category: 'process',
    question: {
      pt: 'Qual é o canal mais rápido para falar com você sobre uma proposta?',
      en: 'What is the fastest way to reach you about an opportunity or quote?',
    },
    answer: {
      pt: 'O canal mais ágil é o meu WhatsApp comercial ou LinkedIn. Você pode usar o formulário no final de qualquer página para redigir sua mensagem pré-formatada ou clicar no botão direto.',
      en: 'The quickest channel is via WhatsApp or LinkedIn. You can use the contact form at the bottom of any page to generate a pre-formatted inquiry or click the direct WhatsApp link.',
    },
  },
];
