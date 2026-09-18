export interface ShowcaseProject {
  id: string;
  name: string;
  url: string;
  displayUrl: string;
  category: 'production' | 'experimental';
  categoryLabel: string;
  badgeColor: string;
  logoImg?: string;
  fallbackImg?: string;
}

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: 'elite-tradinghub',
    name: 'Elite-Trading Hub',
    url: 'https://www.elite-tradinghub.com',
    displayUrl: 'www.elite-tradinghub.com',
    category: 'production',
    categoryLabel: 'Production Platform',
    badgeColor: 'hover:border-blue-500',
    logoImg: '/logo-elite-tradinghub.png',
    fallbackImg: '/thumb-elite-tradinghub.png',
  },
  {
    id: 'vishwaleader',
    name: 'Vishwa Leader Institute',
    url: 'https://www.vishwaleader.com',
    displayUrl: 'www.vishwaleader.com',
    category: 'production',
    categoryLabel: 'EdTech Gateway',
    badgeColor: 'hover:border-amber-500',
    logoImg: '/logo-vishwaleader.png',
    fallbackImg: '/thumb-vishwaleader.png',
  },
  {
    id: 'opendev-labs',
    name: 'OpenDev-Labs Engine',
    url: 'https://www.opendev-labs.com',
    displayUrl: 'www.opendev-labs.com',
    category: 'production',
    categoryLabel: 'Engineering Engine',
    badgeColor: 'hover:border-emerald-500',
    logoImg: '/logo-opendevlabs.png',
    fallbackImg: '/thumb-opendevlabs.png',
  },
  {
    id: 'yash-portfolio',
    name: 'Yash Ramteke Portfolio',
    url: 'https://www.opendev-labs.com/iamyashramteke',
    displayUrl: 'opendev-labs.com/iamyashramteke',
    category: 'production',
    categoryLabel: 'Lead Engineer Portfolio',
    badgeColor: 'hover:border-purple-500',
  },
  {
    id: 'agentbash',
    name: 'AgentBash AI Engine',
    url: 'https://agentbash.vercel.app/',
    displayUrl: 'agentbash.vercel.app',
    category: 'experimental',
    categoryLabel: 'AI Agent CLI',
    badgeColor: 'hover:border-cyan-500',
  },
  {
    id: 'esoteric-intelligence',
    name: 'Esoteric Intelligence',
    url: 'https://esotericintelligence.vercel.app/',
    displayUrl: 'esotericintelligence.vercel.app',
    category: 'experimental',
    categoryLabel: 'AI Neural Lab',
    badgeColor: 'hover:border-violet-500',
  },
  {
    id: 'vterm',
    name: 'vTerm Terminal Engine',
    url: 'https://vterm.onrender.com/',
    displayUrl: 'vterm.onrender.com',
    category: 'experimental',
    categoryLabel: 'Web Terminal IDE',
    badgeColor: 'hover:border-green-500',
  },
  {
    id: 'opendev-github',
    name: 'OpenDev-Labs GitHub Hub',
    url: 'https://opendev-labs.github.io/',
    displayUrl: 'opendev-labs.github.io',
    category: 'experimental',
    categoryLabel: 'Open Source Hub',
    badgeColor: 'hover:border-zinc-500',
  },
  {
    id: 'ebookstall',
    name: 'EbookStall Platform',
    url: 'https://ebookstall.vercel.app/',
    displayUrl: 'ebookstall.vercel.app',
    category: 'experimental',
    categoryLabel: 'Digital Storefront',
    badgeColor: 'hover:border-rose-500',
  },
  {
    id: 'nanopi-ai',
    name: 'NanoPi AI Engine',
    url: 'https://opendev-labs-nanopi.hf.space',
    displayUrl: 'opendev-labs-nanopi.hf.space',
    category: 'experimental',
    categoryLabel: 'HuggingFace AI Space',
    badgeColor: 'hover:border-orange-500',
  },
  {
    id: 'qbet-quantum',
    name: 'QBET Quantum System',
    url: 'https://opendev-labs.github.io/QBET/',
    displayUrl: 'opendev-labs.github.io/QBET',
    category: 'experimental',
    categoryLabel: 'Quantum Emulation',
    badgeColor: 'hover:border-teal-500',
  },
];
