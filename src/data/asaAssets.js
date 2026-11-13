const asaModules = import.meta.glob(
  '../assets/images/Projetos/ASA-App/*.{png,jpeg,jpg,webp}',
  { eager: true, import: 'default' }
);

const byName = Object.fromEntries(
  Object.entries(asaModules).map(([path, url]) => [path.split('/').pop(), url])
);

export const asaCover = byName['Mural.png'] || byName['360.png'] || Object.values(byName)[0];

export const asaWebFrames = [
  {
    key: 'Mural.png',
    title: {
      pt: 'asa-web-zeta.vercel.app - Mural & Visão Geral',
      en: 'asa-web-zeta.vercel.app - Notice Board & Overview',
    },
    caption: {
      pt: 'Mural web principal do ecossistema ASA para comunicação e avisos.',
      en: 'Main ASA web notice board for communication and announcements.',
    },
  },
  {
    key: '360.png',
    title: {
      pt: 'Visão 360° do Aluno & Acompanhamento',
      en: 'Student 360° View & Tracking',
    },
    caption: {
      pt: 'Painel 360° consolidando histórico, atendimentos e status do aluno.',
      en: '360° dashboard consolidating student history, support tickets, and status.',
    },
  },
  {
    key: 'Triagem.png',
    title: {
      pt: 'Módulo de Triagem & Encaminhamento',
      en: 'Triage & Routing Module',
    },
    caption: {
      pt: 'Fluxo web de triagem para direcionamento rápido de demandas.',
      en: 'Web triage flow for fast routing of student and staff requests.',
    },
  },
  {
    key: 'Senhas.png',
    title: {
      pt: 'Painel de Senhas & Atendimento',
      en: 'Queue Tickets & Service Panel',
    },
    caption: {
      pt: 'Gerenciamento de filas e chamada de senhas de atendimento.',
      en: 'Queue management and service ticket calling panel.',
    },
  },
  {
    key: 'Documentos.png',
    title: {
      pt: 'Central de Documentos',
      en: 'Document Center',
    },
    caption: {
      pt: 'Organização e consulta de documentos acadêmicos e administrativos.',
      en: 'Organization and lookup of academic and administrative documents.',
    },
  },
  {
    key: '4D-ADM.png',
    title: {
      pt: 'Administração 4D',
      en: '4D Administration',
    },
    caption: {
      pt: 'Área administrativa dedicada à gestão e acompanhamento 4D.',
      en: 'Dedicated administrative module for 4D management and tracking.',
    },
  },
  {
    key: 'Agente.png',
    title: {
      pt: 'Assistente / Agente Inteligente',
      en: 'Intelligent Assistant / Agent',
    },
    caption: {
      pt: 'Interface do agente inteligente integrado para suporte e orientações.',
      en: 'Integrated intelligent agent interface for support and guidance.',
    },
  },
  {
    key: 'Algebra.png',
    title: {
      pt: 'Módulo Álgebra / Apoio Acadêmico',
      en: 'Algebra / Academic Support Module',
    },
    caption: {
      pt: 'Tela de apoio acadêmico e conteúdos integrados na plataforma.',
      en: 'Academic support view and integrated learning resources.',
    },
  },
]
  .filter((item) => byName[item.key])
  .map((item) => ({
    title: item.title,
    image: byName[item.key],
    caption: item.caption,
  }));

const mobileScreens = [
  { key: 'Entrada.jpeg', pt: 'Tela de Entrada (Splash)', en: 'Splash Screen' },
  { key: 'Onboarding1.jpeg', pt: 'Onboarding — Boas-vindas (01/03)', en: 'Onboarding — Welcome (01/03)' },
  { key: 'Onboarding2.jpeg', pt: 'Onboarding — Recursos (02/03)', en: 'Onboarding — Features (02/03)' },
  { key: 'Onboarding3.jpeg', pt: 'Onboarding — Começar (03/03)', en: 'Onboarding — Get Started (03/03)' },
  { key: 'Home-Aluno.jpeg', pt: 'Home — Visão do Aluno', en: 'Home — Student View' },
  { key: 'Home-Funcionário.jpeg', pt: 'Home — Visão do Funcionário', en: 'Home — Staff View' },
  { key: 'Ficha-Aluno.jpeg', pt: 'Ficha Completa do Aluno', en: 'Student Record' },
  { key: 'CAA.jpeg', pt: 'CAA — Central de Atendimento', en: 'CAA — Support Center' },
  { key: '4D.jpeg', pt: 'Módulo 4D (Mobile)', en: '4D Module (Mobile)' },
  { key: 'Chat.jpeg', pt: 'Chat & Atendimento Direto', en: 'Chat & Direct Support' },
  { key: 'Docs.jpeg', pt: 'Documentos & Solicitações', en: 'Documents & Requests' },
  { key: 'Educacional.jpeg', pt: 'Área Educacional', en: 'Educational Area' },
  { key: 'Perfil.jpeg', pt: 'Perfil do Usuário', en: 'User Profile' },
];

export const asaMobileGallery = mobileScreens
  .filter((item) => byName[item.key])
  .map((item) => ({
    image: byName[item.key],
    caption: { pt: item.pt, en: item.en },
  }));
