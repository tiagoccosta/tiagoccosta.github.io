export type Language = 'en' | 'pt';
export type Theme = 'dark' | 'light';

export type GameCategory =
  | 'all'
  | 'console-pc'
  | 'multiplayer-backend'
  | 'mobile'
  | 'ar-tools';

export interface LocalizedText {
  en: string;
  pt: string;
}

export interface GameWork {
  id: string;
  title: string;
  subtitle: LocalizedText;
  role: LocalizedText;
  description: LocalizedText;
  // TODO: Add specific technicalChallenge notes / engineering decisions for featured titles.
  technicalChallenge?: LocalizedText;
  image: string;
  platforms: string[];
  tech: string[];
  categories: Exclude<GameCategory, 'all'>[];
  highlight?: LocalizedText;
}

export interface ExperienceItem {
  id: string;
  company: string;
  period: LocalizedText;
  role: LocalizedText;
  summary: LocalizedText;
  highlights: LocalizedText[];
  tech?: string[];
}

export interface EducationItem {
  id: string;
  degree: LocalizedText;
  institution: string;
  note: LocalizedText;
}

export interface LanguageProficiency {
  id: string;
  name: LocalizedText;
  level: LocalizedText;
}

export interface SkillGroup {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  items: string[];
}

export interface PersonalProject {
  id: string;
  title: string;
  kind: LocalizedText;
  description: LocalizedText;
  url: string;
  actionLabel: LocalizedText;
  iconImage?: string;
  tech: string[];
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  tier: string;
  track: LocalizedText;
  url: string;
}

const EMAIL_PARTS = ['tiago_sa', 'msn.com'] as const;

export function getContactEmail(): string {
  return `${EMAIL_PARTS[0]}@${EMAIL_PARTS[1]}`;
}

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/tiago-costa-8ba908148',
  github: 'https://github.com/tiagoccosta',
  unityAssetStore: 'https://assetstore.unity.com/publishers/29605',
} as const;

export const PAGE_TITLES: LocalizedText = {
  en: 'Tiago C. Costa — Game Developer & Software Engineer',
  pt: 'Tiago C. Costa — Desenvolvedor de Jogos & Engenheiro de Software',
};

export const UI_COPY = {
  nav: {
    games: { en: 'Games', pt: 'Jogos' },
    experience: { en: 'Experience', pt: 'Experiência' },
    about: { en: 'About & Stack', pt: 'Sobre & Stack' },
    projects: { en: 'Projects & Tools', pt: 'Projetos & Tools' },
    education: { en: 'Education & Certs', pt: 'Formação & Certs' },
    contact: { en: 'Contact', pt: 'Contato' },
  },
  hero: {
    badge: {
      en: 'Open to Game Studio Opportunities',
      pt: 'Aberto a Oportunidades em Estúdios de Jogos',
    },
    role: {
      en: 'Game Developer & Software Engineer',
      pt: 'Desenvolvedor de Jogos & Engenheiro de Software',
    },
    headlinePrefix: {
      en: 'Shipping games across',
      pt: 'Publicando jogos para',
    },
    headlineHighlight: {
      en: 'Console, PC & Mobile.',
      pt: 'Console, PC e Mobile.',
    },
    pitch: {
      en: 'Software engineer specialized in Unity3D, C#, and AI-powered pipelines — with shipped titles for Nintendo Switch, Xbox, Steam, Android, iOS, and WebGL across gameplay, cross-platform porting, multiplayer, and .NET / Java backends.',
      pt: 'Engenheiro de software especializado em Unity3D, C# e pipelines com IA — com títulos publicados para Nintendo Switch, Xbox, Steam, Android, iOS e WebGL em gameplay, porting multiplataforma, multiplayer e backends em .NET e Java.',
    },
    exploreCta: {
      en: 'Browse Games',
      pt: 'Ver Jogos',
    },
    sim: {
      label: { en: 'Boids', pt: 'Boids' },
      attract: { en: 'Attract', pt: 'Atrair' },
      repel: { en: 'Repel', pt: 'Repelir' },
      vectors: { en: 'Vectors', pt: 'Vetores' },
      pause: { en: 'Pause', pt: 'Pausar' },
      play: { en: 'Play', pt: 'Retomar' },
      pointerHint: {
        en: 'Move or click to steer',
        pt: 'Mova ou clique para interagir',
      },
    },
    platformsLabel: {
      en: 'Target Platforms',
      pt: 'Plataformas',
    },
    location: {
      en: 'São Paulo - SP, Brazil',
      pt: 'São Paulo - SP, Brasil',
    },
  },
  games: {
    eyebrow: { en: 'Portfolio', pt: 'Portfólio' },
    featuredLabel: { en: 'Featured Releases', pt: 'Destaques' },
    libraryLabel: { en: 'Complete Library', pt: 'Biblioteca Completa' },
    title: {
      en: 'Game Library & Shipped Titles',
      pt: 'Biblioteca de Jogos & Lançamentos',
    },
    subtitle: {
      en: 'Commercial releases, multi-platform console ports, multiplayer systems, and interactive applications.',
      pt: 'Lançamentos comerciais, portings multiplataforma para consoles, sistemas multiplayer e aplicações interativas.',
    },
    filters: [
      { id: 'all' as const, label: { en: 'All', pt: 'Todos' } },
      { id: 'console-pc' as const, label: { en: 'Console & PC', pt: 'Console & PC' } },
      {
        id: 'multiplayer-backend' as const,
        label: { en: 'Multiplayer & Backend', pt: 'Multiplayer & Backend' },
      },
      { id: 'mobile' as const, label: { en: 'Mobile', pt: 'Mobile' } },
      { id: 'ar-tools' as const, label: { en: 'AR & Bots', pt: 'AR & Bots' } },
    ],
    viewDetails: { en: 'View Details', pt: 'Ver Detalhes' },
    modalRole: { en: 'Role & Contribution', pt: 'Papel & Contribuição' },
    modalChallenge: {
      en: 'Technical Challenge & Highlights',
      pt: 'Desafio Técnico & Destaques',
    },
    modalPlatforms: { en: 'Target Platforms', pt: 'Plataformas' },
    modalTech: { en: 'Technologies', pt: 'Tecnologias' },
    close: { en: 'Close', pt: 'Fechar' },
  },
  experience: {
    eyebrow: { en: 'Career', pt: 'Carreira' },
    title: { en: 'Professional Experience', pt: 'Experiência Profissional' },
    subtitle: {
      en: 'Studios, software teams, and shipped systems in chronological order.',
      pt: 'Estúdios, times de engenharia e sistemas entregues em ordem cronológica.',
    },
  },
  about: {
    eyebrow: { en: 'About', pt: 'Sobre' },
    title: { en: 'About & Technical Stack', pt: 'Sobre & Stack Técnica' },
    paragraphs: [
      {
        en: 'I am Tiago C. Costa, a game developer and software engineer with experience shipping commercial products across mobile, desktop, web, and console ecosystems.',
        pt: 'Sou Tiago C. Costa, desenvolvedor de jogos e engenheiro de software com experiência em entregas comerciais para mobile, desktop, web e consoles.',
      },
      {
        en: 'With solid experience in the Unity3D engine and multiple releases for Android, iOS, Xbox, Nintendo Switch, and Steam, I work primarily on gameplay engineering and cross-platform porting, while also building dedicated multiplayer servers and backend integrations with .NET, Java, PlayFab, Beamable, and Firebase.',
        pt: 'Com experiência sólida na engine Unity3D e múltiplos lançamentos para Android, iOS, Xbox, Nintendo Switch e Steam, atuo principalmente na engenharia de gameplay e porting multiplataforma, além de servidores multiplayer dedicados e integrações backend com .NET, Java, PlayFab, Beamable e Firebase.',
      },
      {
        en: 'Beyond commercial game production, I have extensive hands-on experience implementing AI-powered pipelines, alongside Virtual & Augmented Reality (VR/AR) systems and reusable developer tooling.',
        pt: 'Além da produção comercial de jogos, possuo ampla experiência na implementação de pipelines com IA, sistemas de Realidade Virtual e Aumentada (VR/AR) e ferramentas reutilizáveis para desenvolvimento.',
      },
    ],
  },
  projects: {
    eyebrow: { en: 'Open Source & Tools', pt: 'Open Source & Ferramentas' },
    title: {
      en: 'Personal Projects & Developer Tools',
      pt: 'Projetos Pessoais & Ferramentas',
    },
    subtitle: {
      en: 'Published Unity Asset Store tooling, open-source networking/AI libraries, and independent Android releases.',
      pt: 'Ferramenta publicada na Unity Asset Store, bibliotecas open-source de rede e IA e jogos independentes no Android.',
    },
  },
  education: {
    eyebrow: { en: 'Background', pt: 'Formação' },
    title: {
      en: 'Education, Certificates & Languages',
      pt: 'Formação, Certificados & Idiomas',
    },
    subtitle: {
      en: 'Academic background, verified engineering assessments, and working languages.',
      pt: 'Formação acadêmica, certificações técnicas verificadas e idiomas de trabalho.',
    },
    degreeLabel: { en: 'Academic Background', pt: 'Formação Acadêmica' },
    languagesLabel: { en: 'Languages', pt: 'Idiomas' },
    certificatesLabel: { en: 'Verified Certificates', pt: 'Certificados Verificados' },
    verifyLabel: { en: 'Verify Certificate', pt: 'Verificar Certificado' },
  },
  contact: {
    eyebrow: { en: 'Contact', pt: 'Contato' },
    title: {
      en: "Let's build your next shipped title.",
      pt: 'Vamos construir seu próximo lançamento.',
    },
    subtitle: {
      en: 'Available for Game Programmer, Unity Developer, and Software Engineer roles — remote or relocation.',
      pt: 'Disponível para vagas de Game Programmer, Unity Developer e Software Engineer — remoto ou presencial.',
    },
    copyEmail: { en: 'Copy Email', pt: 'Copiar E-mail' },
    copied: { en: 'Email Copied!', pt: 'E-mail Copiado!' },
    sendEmail: { en: 'Send Email', pt: 'Enviar E-mail' },
    locationLabel: { en: 'Based in', pt: 'Localização' },
    copyright: {
      en: 'Tiago C. Costa. All rights reserved.',
      pt: 'Tiago C. Costa. Todos os direitos reservados.',
    },
  },
} as const;

export const FEATURED_GAME_IDS = [
  'super-mombo-quest',
  'dwarf-journey',
  'adventure-llama',
  'war-romano',
] as const;

export const SHIPPED_PLATFORMS = [
  'Nintendo Switch',
  'Xbox',
  'Steam',
  'Android',
  'iOS',
  'WebGL',
] as const;

// TODO: Populate EXPERIENCE_ITEMS with companies, studios, roles, periods, and highlights from LinkedIn.
// Example entry shape:
// {
//   id: 'studio-name',
//   company: 'Studio Name',
//   period: { en: '2022 – Present', pt: '2022 – Atual' },
//   role: { en: 'Unity / Game Software Engineer', pt: 'Engenheiro de Software Unity / Games' },
//   summary: { en: '...', pt: '...' },
//   highlights: [{ en: '...', pt: '...' }],
//   tech: ['Unity3D', 'C#', '.NET'],
// }
export const EXPERIENCE_ITEMS: ExperienceItem[] = [];

export const EDUCATION_ITEMS: EducationItem[] = [
  {
    id: 'unyleya-bioinformatics',
    degree: {
      en: 'Postgraduate Degree (Lato Sensu) in Bioinformatics',
      pt: 'Pós-Graduação Lato Sensu em Bioinformática',
    },
    institution: 'Faculdade Unyleya',
    note: {
      en: 'Foundations in algorithms, data processing, and computational modeling.',
      pt: 'Base em algoritmos, processamento de dados e modelagem computacional.',
    },
  },
  // TODO: Add undergraduate degree or complementary specializations if desired.
];

export const LANGUAGE_PROFICIENCIES: LanguageProficiency[] = [
  {
    id: 'pt',
    name: { en: 'Portuguese', pt: 'Português' },
    level: { en: 'Native', pt: 'Nativo' },
  },
  {
    id: 'en',
    name: { en: 'English', pt: 'Inglês' },
    level: { en: 'Intermediate', pt: 'Intermediário' },
  },
];

export const GAME_WORKS: GameWork[] = [
  {
    id: 'super-mombo-quest',
    title: 'Super Mombo Quest',
    subtitle: {
      en: '2D Action Platformer • Metroidvania',
      pt: 'Plataforma de Ação 2D • Metroidvania',
    },
    role: {
      en: 'Gameplay Engineer & Console/PC Porting',
      pt: 'Engenheiro de Gameplay & Porting Console/PC',
    },
    description: {
      en: '2D game that won the Best Game by Popular Vote award at the BIG Festival. Worked on client engineering for gameplay aspects, integration with platform gaming services, and porting to Steam, Nintendo Switch, and Xbox.',
      pt: 'Jogo 2D vencedor do prêmio de Melhor Jogo pelo Voto Popular no BIG Festival. Atuei na engenharia de cliente para mecânicas de gameplay, integração com serviços das plataformas e porting para Steam, Nintendo Switch e Xbox.',
    },
    image: 'images/portfolio-mombo.jpg',
    platforms: ['Steam', 'Nintendo Switch', 'Xbox'],
    tech: ['Unity3D', 'C#', 'Platform Services', 'Console Porting'],
    categories: ['console-pc'],
    highlight: {
      en: 'BIG Festival Winner',
      pt: 'Vencedor BIG Festival',
    },
  },
  {
    id: 'dwarf-journey',
    title: 'Dwarf Journey',
    subtitle: {
      en: '2D Action Roguelite Platformer',
      pt: 'Plataforma Roguelite de Ação 2D',
    },
    role: {
      en: 'Client Engineering & Multi-Platform Porting',
      pt: 'Engenharia de Cliente & Porting Multiplataforma',
    },
    description: {
      en: '2D action game where I was responsible for client engineering and complete cross-platform porting across Android, Steam, iOS, Nintendo Switch, and Xbox.',
      pt: 'Jogo de ação 2D no qual fui responsável pela engenharia de cliente e pelo porting completo para todas as plataformas: Android, Steam, iOS, Nintendo Switch e Xbox.',
    },
    image: 'images/portfolio-dwarf.jpg',
    platforms: ['Steam', 'Nintendo Switch', 'Xbox', 'Android', 'iOS'],
    tech: ['Unity3D', 'C#', 'Console Porting', 'Mobile'],
    categories: ['console-pc', 'mobile'],
  },
  {
    id: 'adventure-llama',
    title: 'Adventure Llama',
    subtitle: {
      en: '2D Puzzle Platformer',
      pt: 'Plataforma Puzzle 2D',
    },
    role: {
      en: 'Console & Steam Porting Engineer',
      pt: 'Engenheiro de Porting Console & Steam',
    },
    description: {
      en: 'Platformer game. Worked on porting the title to Xbox, Nintendo Switch, and Steam platforms, as well as post-launch adjustments and fixes for updates.',
      pt: 'Jogo de plataforma. Atuei no porting para Xbox, Nintendo Switch e Steam, além de ajustes técnicos e correções para atualizações.',
    },
    image: 'images/portfolio-llhama.jpg',
    platforms: ['Xbox', 'Nintendo Switch', 'Steam'],
    tech: ['Unity3D', 'C#', 'Console Porting'],
    categories: ['console-pc'],
  },
  {
    id: 'golf-battle-royale',
    title: 'Golf Battle Royale',
    subtitle: {
      en: '3D Multiplayer Competitive Sports',
      pt: 'Esporte Multiplayer 3D Competitivo',
    },
    role: {
      en: 'Client Finishing, Cloud Delivery & Optimization',
      pt: 'Finalização de Cliente, Cloud Delivery & Otimização',
    },
    description: {
      en: '3D multiplayer game targeting Android and iOS. Focused on the final stages of production, integration with cloud content delivery, bug fixing, and runtime optimization.',
      pt: 'Jogo multiplayer 3D para Android e iOS. Atuei principalmente nas etapas finais de produção, integração com entrega de conteúdo em nuvem (Cloud Content Delivery), correção de bugs e otimização.',
    },
    image: 'images/portfolio-golfbattle.jpg',
    platforms: ['Android', 'iOS'],
    tech: ['Unity3D', 'C#', 'Multiplayer', 'Cloud Delivery', 'Optimization'],
    categories: ['multiplayer-backend', 'mobile'],
  },
  {
    id: 'war-romano',
    title: 'War Romano',
    subtitle: {
      en: 'Digital Strategy Board Game • Multiplayer',
      pt: 'Jogo Digital de Estratégia • Multiplayer',
    },
    role: {
      en: 'Lead Client (Unity3D) & Dedicated Server (Java)',
      pt: 'Cliente Principal (Unity3D) & Servidor Dedicado (Java)',
    },
    description: {
      en: 'Digital adaptation of the War strategy board game, a multiplayer title targeting Android, iOS, and WebGL. Responsible for the majority of the Unity3D client and the dedicated Java server development.',
      pt: 'Versão digital do clássico jogo de estratégia War, com multiplayer para Android, iOS e WebGL. Responsável pela maior parte do desenvolvimento do cliente em Unity3D e do servidor dedicado em Java.',
    },
    image: 'images/portfolio-warromano.jpg',
    platforms: ['Android', 'iOS', 'WebGL'],
    tech: ['Unity3D', 'C#', 'Java', 'Dedicated Server'],
    categories: ['multiplayer-backend', 'mobile'],
  },
  {
    id: 'war-classico',
    title: 'War Clássico',
    subtitle: {
      en: 'Digital Strategy Board Game • Multiplayer',
      pt: 'Jogo Digital de Estratégia • Multiplayer',
    },
    role: {
      en: 'Client (C#) & Server (Java) Maintenance',
      pt: 'Manutenção de Cliente (C#) & Servidor (Java)',
    },
    description: {
      en: 'Digital version of the classic War multiplayer game for Android, iOS, and WebGL. Worked on live maintenance and bug fixing across both the Java dedicated server and Unity C# client.',
      pt: 'Versão digital multiplayer do War Clássico para Android, iOS e WebGL. Atuei na manutenção contínua e correção de bugs tanto no servidor dedicado em Java quanto no cliente em C#.',
    },
    image: 'images/portfolio-warclassico.jpg',
    platforms: ['Android', 'iOS', 'WebGL'],
    tech: ['Unity3D', 'C#', 'Java', 'Multiplayer'],
    categories: ['multiplayer-backend', 'mobile'],
  },
  {
    id: 'rapala-world-fish-tour',
    title: 'Rapala: World Fish Tour',
    subtitle: {
      en: '3D Fishing Simulation',
      pt: 'Simulação de Pesca 3D',
    },
    role: {
      en: 'Gameplay Programmer (Prototype to Release)',
      pt: 'Programador de Gameplay (Protótipo ao Lançamento)',
    },
    description: {
      en: '3D fishing-themed game targeting Android and iOS platforms. Contributed across multiple areas of development, from early prototyping through final release.',
      pt: 'Jogo 3D com temática de pesca para Android e iOS. Participei de diversas frentes do desenvolvimento, desde a prototipação inicial até o lançamento.',
    },
    image: 'images/portfolio-rapala.jpg',
    platforms: ['Android', 'iOS'],
    tech: ['Unity3D', 'C#', '3D Gameplay'],
    categories: ['mobile'],
  },
  {
    id: 'golf-galaxy',
    title: 'Golf Galaxy',
    subtitle: {
      en: '2D Mobile Arcade Golf',
      pt: 'Golfe Arcade 2D para Mobile',
    },
    role: {
      en: 'Client Engineering & Firebase Backend',
      pt: 'Engenharia de Cliente & Backend Firebase',
    },
    description: {
      en: '2D mobile game where I handled client engineering in Unity3D as well as backend systems built using Firebase.',
      pt: 'Jogo 2D mobile no qual fui responsável pela engenharia de cliente em Unity3D e pelo desenvolvimento do backend utilizando Firebase.',
    },
    image: 'images/portfolio-golfgalaxy.jpg',
    platforms: ['Android', 'iOS'],
    tech: ['Unity3D', 'C#', 'Firebase', 'Serverless'],
    categories: ['multiplayer-backend', 'mobile'],
  },
  {
    id: 'tactacs',
    title: 'TacTacs',
    subtitle: {
      en: 'Kids Interactive App & Park AR',
      pt: 'Aplicativo Infantil & Realidade Aumentada',
    },
    role: {
      en: 'Full App & Augmented Reality Developer',
      pt: 'Desenvolvedor Completo do App & AR',
    },
    description: {
      en: 'Collection of mini-games with music and illustration content from the TacTacs team. Built puzzles, assembly, painting, musical games, video playback, and augmented reality poster interactions for the TacTacs park.',
      pt: 'Coleção de minijogos musicais e ilustrações da equipe TacTacs. Participei do desenvolvimento completo, incluindo quebra-cabeças, montagem, pintura, jogos musicais, exibição de clipes e interações em realidade aumentada com pôsteres no parque TacTacs.',
    },
    image: 'images/portfolio-tactacs.jpg',
    platforms: ['Android', 'iOS', 'AR'],
    tech: ['Unity3D', 'C#', 'Augmented Reality', 'Mini-Games'],
    categories: ['mobile', 'ar-tools'],
  },
  {
    id: 'primetour-viagens',
    title: 'PrimeTour Viagens',
    subtitle: {
      en: 'AR Interactive Travel Magazine',
      pt: 'Revista de Viagens Interativa em AR',
    },
    role: {
      en: 'Full 2019 AR App & Backend Migration',
      pt: 'Desenvolvimento Completo AR 2019 & Backend',
    },
    description: {
      en: 'Interactive travel magazine application powered by augmented reality. Built the complete 2019 version featuring 3D models rendered directly over physical magazine pages.',
      pt: 'Aplicativo para promoção de revista de viagens com realidade aumentada. Desenvolvi a versão 2019 completa, projetando modelos 3D sobre as ilustrações da revista.',
    },
    image: 'images/portfolio-primetour.jpg',
    platforms: ['Android', 'iOS', 'AR'],
    tech: ['Unity3D', 'C#', 'Augmented Reality', '3D'],
    categories: ['mobile', 'ar-tools'],
  },
  {
    id: 'orubes-bot',
    title: "Orube's Bot",
    subtitle: {
      en: 'Discord Game Bot & Web Service',
      pt: 'Bot de Jogos no Discord & Web Service',
    },
    role: {
      en: 'Full .NET Core Backend & Systems Developer',
      pt: 'Desenvolvedor Backend .NET Core Completo',
    },
    description: {
      en: 'Gamified Discord bot featuring mini-games, quizzes, challenges, virtual coins, and rewards. Built a complete .NET Core console application with SQLite and DynamoDB persistence, socket integration, and a companion web service.',
      pt: 'Sistema de bot para Discord com minijogos, quizzes, desafios, moedas virtuais e recompensas para interação com a comunidade. Desenvolvido integralmente em .NET Core com armazenamento em SQLite e DynamoDB, sockets e web service.',
    },
    image: 'images/portfolio-botoorube.jpg',
    platforms: ['Discord', '.NET Core'],
    tech: ['.NET Core', 'C#', 'SQLite', 'DynamoDB', 'Sockets'],
    categories: ['multiplayer-backend', 'ar-tools'],
  },
  {
    id: 'dr-moku',
    title: 'Dr Moku',
    subtitle: {
      en: 'Gamified Language Learning',
      pt: 'Aprendizado Gamificado de Idiomas',
    },
    role: {
      en: 'Unity UI & Layout Specialist',
      pt: 'Especialista em UI & Layout Unity',
    },
    description: {
      en: 'Gamified language learning application. Focused on diagnosing and fixing UI and layout-related issues across mobile aspect ratios.',
      pt: 'Aplicativo gamificado de aprendizado de idiomas. Atuei principalmente na correção de problemas de interface e responsividade de layout.',
    },
    image: 'images/portfolio-drmoku.jpg',
    platforms: ['Android', 'iOS'],
    tech: ['Unity3D', 'C#', 'UI / UX'],
    categories: ['mobile'],
  },
  {
    id: 'sea-creatures',
    title: 'Sea Creatures',
    subtitle: {
      en: '3D Multiplayer Mobile Game',
      pt: 'Jogo 3D Multiplayer Mobile',
    },
    role: {
      en: 'Creator & Gameplay/Network Programmer',
      pt: 'Criador & Programador de Gameplay/Rede',
    },
    description: {
      en: '3D Unity game built in C# targeting Android, featuring local Wi-Fi multiplayer support.',
      pt: 'Jogo 3D construído em Unity3D e C# para Android, contando com modo multiplayer local via Wi-Fi.',
    },
    image: 'images/game-sc.jpg',
    platforms: ['Android'],
    tech: ['Unity3D', 'C#', 'Wi-Fi Multiplayer'],
    categories: ['multiplayer-backend', 'mobile'],
  },
  {
    id: 'raccoon',
    title: 'Raccoon',
    subtitle: {
      en: '3D Bluetooth Multiplayer Game',
      pt: 'Jogo 3D Multiplayer via Bluetooth',
    },
    role: {
      en: 'Creator, Unity C# & Android Java Plugin',
      pt: 'Criador, Unity C# & Plugin Java Android',
    },
    description: {
      en: '3D Android game developed with Unity3D/C# and a custom native Java plugin enabling peer-to-peer multiplayer over Bluetooth.',
      pt: 'Jogo 3D para Android construído com Unity3D/C# e plugin nativo em Java para partidas multiplayer via Bluetooth.',
    },
    image: 'images/game-rac.jpg',
    platforms: ['Android'],
    tech: ['Unity3D', 'C#', 'Java', 'Bluetooth'],
    categories: ['multiplayer-backend', 'mobile'],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'engines-languages',
    title: { en: 'Engines & Languages', pt: 'Engines & Linguagens' },
    subtitle: {
      en: 'Core production stack for gameplay, tools & native plugins',
      pt: 'Stack principal para gameplay, ferramentas e plugins nativos',
    },
    items: ['Unity3D', 'C#', '.NET / .NET Core', 'Java', 'JavaScript', 'C++'],
  },
  {
    id: 'platforms-porting',
    title: { en: 'Platforms & Porting', pt: 'Plataformas & Porting' },
    subtitle: {
      en: 'Certification-ready builds, TRC/lotcheck & multi-target releases',
      pt: 'Builds prontos para publicação, adaptação de controles e multi-plataforma',
    },
    items: ['Nintendo Switch', 'Xbox', 'Steam (PC)', 'Android', 'iOS', 'WebGL'],
  },
  {
    id: 'multiplayer-backend',
    title: { en: 'Multiplayer & Backend', pt: 'Multiplayer & Backend' },
    subtitle: {
      en: 'Authoritative servers, live-ops services & cloud persistence',
      pt: 'Servidores dedicados, serviços live-ops e persistência em nuvem',
    },
    items: [
      'Dedicated Servers (Java)',
      'PlayFab',
      'Beamable',
      'Firebase',
      'Cloud Content Delivery',
      'SQLite & DynamoDB',
      'TCP / UDP / Wi-Fi / Bluetooth',
    ],
  },
  {
    id: 'core-focus',
    title: { en: 'Engineering Focus', pt: 'Foco de Engenharia' },
    subtitle: {
      en: 'What I bring to a game development or software team',
      pt: 'Onde agrego mais valor em times de jogos e software',
    },
    items: [
      'Gameplay Architecture',
      'Cross-Platform Porting',
      'AI-Powered Pipelines',
      'VR / AR Systems',
      'Memory & Frame Optimization',
    ],
  },
];

export const PERSONAL_PROJECTS: PersonalProject[] = [
  {
    id: 'sequenciator-system',
    title: 'Sequenciator System',
    kind: { en: 'Unity Asset Store Tool', pt: 'Ferramenta na Unity Asset Store' },
    description: {
      en: 'Commercial Unity3D tool published on the official Asset Store for sequencing game events and project workflows.',
      pt: 'Ferramenta publicada oficialmente na Unity Asset Store para sequenciamento de eventos e fluxos em projetos Unity3D.',
    },
    url: 'https://assetstore.unity.com/packages/templates/systems/sequenciatorsystem-106106',
    actionLabel: { en: 'View on Asset Store', pt: 'Ver na Asset Store' },
    tech: ['Unity3D', 'C#', 'Editor Tooling'],
  },
  {
    id: 'tnet',
    title: 'tNet Library',
    kind: { en: 'Open-Source Networking', pt: 'Biblioteca Open-Source de Rede' },
    description: {
      en: 'Open-source Java networking library for TCP/UDP connection management, including samples for chats, games, and distributed systems.',
      pt: 'Biblioteca open-source em Java para gerenciamento de conexões TCP/UDP, com exemplos para chats, jogos e sistemas distribuídos.',
    },
    url: 'https://github.com/tiagoccosta/tNet',
    actionLabel: { en: 'View on GitHub', pt: 'Ver no GitHub' },
    tech: ['Java', 'TCP / UDP', 'Networking'],
  },
  {
    id: 'vbrain',
    title: 'vBrain Library',
    kind: { en: 'Open-Source AI', pt: 'Biblioteca Open-Source de IA' },
    description: {
      en: 'Java library for building and managing artificial neural networks for AI experiments and game agents.',
      pt: 'Biblioteca em Java para criação e gerenciamento de redes neurais artificiais aplicadas a inteligência artificial.',
    },
    url: 'https://github.com/tiagoccosta/vBrain',
    actionLabel: { en: 'View on GitHub', pt: 'Ver no GitHub' },
    tech: ['Java', 'Neural Networks', 'AI'],
  },
  {
    id: 'sea-creatures-store',
    title: 'Sea Creatures',
    kind: { en: 'Indie Android Release', pt: 'Lançamento Indie Android' },
    description: {
      en: '3D game built with Unity3D and C# featuring local Wi-Fi multiplayer on Android.',
      pt: 'Jogo 3D criado em Unity3D e C# para Android com suporte a multiplayer via Wi-Fi.',
    },
    url: 'https://play.google.com/store/apps/details?id=com.BC_Aplicativos.SeaCreatures',
    actionLabel: { en: 'Google Play', pt: 'Google Play' },
    iconImage: 'images/sea-creatures-icon.jpg',
    tech: ['Unity3D', 'C#', 'Android'],
  },
  {
    id: 'raccoon-store',
    title: 'Raccoon vs Dog',
    kind: { en: 'Indie Android Release', pt: 'Lançamento Indie Android' },
    description: {
      en: '3D multiplayer Android game built in Unity3D/C# with a custom Java Bluetooth/Wi-Fi connectivity layer.',
      pt: 'Jogo 3D multiplayer para Android construído em Unity3D/C# com camada nativa em Java para conexão Bluetooth/Wi-Fi.',
    },
    url: 'https://play.google.com/store/apps/details?id=com.BC_Aplicativos.Raccon',
    actionLabel: { en: 'Google Play', pt: 'Google Play' },
    iconImage: 'images/raccoon-icon.png',
    tech: ['Unity3D', 'C#', 'Java'],
  },
];

export const CERTIFICATES: Certificate[] = [
  {
    id: 'csharp-sql',
    title: 'C# Algorithms and SQL',
    issuer: 'TestDome',
    tier: 'Gold',
    track: {
      en: 'C# Programming, Data Structures & SQL Queries',
      pt: 'Programação C#, Estruturas de Dados & Consultas SQL',
    },
    url: 'https://www.testdome.com/cert/46a9fad772a241bfa3dda0a5845c95a8',
  },
  {
    id: 'android-java',
    title: 'Android and Java',
    issuer: 'TestDome',
    tier: 'Gold',
    track: {
      en: 'Native Android Development & Java Engineering',
      pt: 'Desenvolvimento Android Nativo & Engenharia Java',
    },
    url: 'https://www.testdome.com/cert/0b7d95b44f69419aa2e45891a7e7d0a7',
  },
  {
    id: 'java-sql',
    title: 'Java Algorithms and SQL',
    issuer: 'TestDome',
    tier: 'Gold',
    track: {
      en: 'Java Algorithms, Problem Solving & SQL',
      pt: 'Algoritmos em Java, Resolução de Problemas & SQL',
    },
    url: 'https://www.testdome.com/cert/77d43a480c104753a2e36f7d8a011f47',
  },
];
