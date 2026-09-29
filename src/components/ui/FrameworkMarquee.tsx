import React from 'react';

export interface FrameworkItem {
  name: string;
  category: string;
  svgFile: string;
  invertInDark?: boolean;
}

export const frameworks: FrameworkItem[] = [
  { name: 'React 19', category: 'UI Engine', svgFile: 'react.svg' },
  { name: 'Next.js 15', category: 'Full-Stack', svgFile: 'nextdotjs.svg', invertInDark: true },
  { name: 'TypeScript 5', category: 'Type Safety', svgFile: 'typescript.svg' },
  { name: 'Tailwind CSS', category: 'Styling', svgFile: 'tailwindcss.svg' },
  { name: 'Firebase', category: 'Database & Auth', svgFile: 'firebase.svg' },
  { name: 'Google Cloud', category: 'Cloud Infra', svgFile: 'google-cloud.svg' },
  { name: 'Gemini AI', category: 'GenAI & Agents', svgFile: 'gemini-ai.svg' },
  { name: 'Python 3.12', category: 'AI & Data', svgFile: 'python.svg' },
  { name: 'Node.js', category: 'Runtime', svgFile: 'nodejs.svg' },
  { name: 'PostgreSQL', category: 'Database', svgFile: 'postgresql.svg' },
  { name: 'Docker', category: 'Containers', svgFile: 'docker.svg' },
  { name: 'Vite', category: 'Build Tool', svgFile: 'vite.svg' },
  { name: 'Three.js', category: '3D Graphics', svgFile: 'threejs.svg', invertInDark: true },
  { name: 'POSIX Bash', category: 'Automation', svgFile: 'gnu-bash.svg' },
  { name: 'Razorpay', category: 'Payments', svgFile: 'razorpay.svg' },
  { name: 'Vercel', category: 'Edge Platform', svgFile: 'vercel.svg', invertInDark: true },
  { name: 'GitHub Actions', category: 'CI/CD', svgFile: 'githubactions.svg' },
  { name: 'GitHub', category: 'Code Hosting', svgFile: 'github.svg', invertInDark: true },
  { name: 'Git', category: 'Version Control', svgFile: 'git.svg' },
  { name: 'Hugging Face', category: 'AI Models', svgFile: 'huggingface.svg' },
  { name: 'Ollama', category: 'Local LLM', svgFile: 'ollama.svg', invertInDark: true },
  { name: 'OpenRouter', category: 'AI Gateway', svgFile: 'openrouter.svg', invertInDark: true },
  { name: 'Bun', category: 'JS Runtime', svgFile: 'bun.svg' },
  { name: 'FastAPI', category: 'Python API', svgFile: 'fastapi.svg' },
  { name: 'Django', category: 'Web Framework', svgFile: 'django.svg' },
  { name: 'Flask', category: 'Microservice', svgFile: 'flask.svg', invertInDark: true },
  { name: 'NestJS', category: 'Node Framework', svgFile: 'nestjs.svg' },
  { name: 'Express.js', category: 'HTTP API', svgFile: 'express.svg', invertInDark: true },
  { name: 'Rust', category: 'Systems Engine', svgFile: 'rust.svg', invertInDark: true },
  { name: 'Go', category: 'Microservices', svgFile: 'go.svg' },
  { name: 'Svelte', category: 'UI Framework', svgFile: 'svelte.svg' },
  { name: 'Vue.js 3', category: 'UI Framework', svgFile: 'vuedotjs.svg' },
  { name: 'Angular', category: 'Enterprise UI', svgFile: 'angular.svg' },
  { name: 'Nuxt.js', category: 'SSR Framework', svgFile: 'nuxt.svg' },
  { name: 'Astro', category: 'Content Engine', svgFile: 'astro.svg', invertInDark: true },
  { name: 'Redux Toolkit', category: 'State', svgFile: 'redux.svg' },
  { name: 'GraphQL', category: 'API Query', svgFile: 'graphql.svg' },
  { name: 'Radix UI', category: 'Primitives', svgFile: 'radixui.svg', invertInDark: true },
  { name: 'shadcn/ui', category: 'UI Components', svgFile: 'shadcnui.svg', invertInDark: true },
  { name: 'Framer Motion', category: 'Animations', svgFile: 'framermotion.svg' },
  { name: 'JavaScript', category: 'Web Standard', svgFile: 'javascript.svg' },
  { name: 'HTML5', category: 'Markup', svgFile: 'html5.svg' },
  { name: 'Sass / SCSS', category: 'Styling', svgFile: 'sass.svg' },
  { name: 'Webpack', category: 'Bundler', svgFile: 'webpack.svg' },
  { name: 'Turborepo', category: 'Monorepo', svgFile: 'turborepo.svg' },
  { name: 'pnpm', category: 'Package Manager', svgFile: 'pnpm.svg' },
  { name: 'npm', category: 'Node Registry', svgFile: 'npm.svg' },
  { name: 'Yarn', category: 'Package Manager', svgFile: 'yarn.svg' },
  { name: 'Linux', category: 'Kernel OS', svgFile: 'linux.svg' },
  { name: 'Ubuntu', category: 'Linux Server', svgFile: 'ubuntu.svg' },
  { name: 'Hostinger', category: 'Cloud Hosting', svgFile: 'hostinger.svg' },
  { name: 'Google', category: 'Cloud Services', svgFile: 'google.svg' },
  { name: 'Figma', category: 'UI/UX Design', svgFile: 'figma.svg' },
  { name: 'Postman', category: 'API Testing', svgFile: 'postman.svg' },
  { name: 'ESLint', category: 'Code Quality', svgFile: 'eslint.svg' },
];

export const FrameworkMarquee: React.FC = () => {
  const half = Math.ceil(frameworks.length / 2);
  const row1 = frameworks.slice(0, half);
  const row2 = frameworks.slice(half);

  // Duplicate arrays for seamless continuous looping
  const row1Items = [...row1, ...row1];
  const row2Items = [...row2, ...row2];

  return (
    <div className="w-full pt-1 sm:pt-2 pb-1 relative z-10 overflow-hidden">
      <div className="text-center mb-1.5 sm:mb-2">
        <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-sans">
          POWERED BY ENTERPRISE FRAMEWORKS & CLOUD INFRASTRUCTURE (55+ OFFICIAL TECH STACKS)
        </span>
      </div>

      {/* Marquee Container with edge fade overlay & HERO UI CAPSULE SHAPED GLASS BORDERS */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] flex flex-col gap-2">
        {/* Row 1: Moving Left */}
        <div className="flex w-max animate-marquee space-x-2.5 py-0.5">
          {row1Items.map((item, index) => (
            <div
              key={`r1-${item.name}-${index}`}
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md text-zinc-800 dark:text-zinc-200 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 hover:scale-105 transition-all cursor-pointer group shrink-0"
              title={`${item.name} (${item.category})`}
            >
              <img
                src={`/tech-logos/${item.svgFile}`}
                alt={item.name}
                className={`size-5 object-contain shrink-0 transition-transform group-hover:scale-110 ${
                  item.invertInDark ? 'dark:invert' : ''
                }`}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-extrabold text-xs tracking-tight text-zinc-900 dark:text-white font-sans">
                {item.name}
              </span>
              <span className="text-[9px] font-semibold text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 font-sans">
                {item.category}
              </span>
            </div>
          ))}
        </div>

        {/* Row 2: Moving Right */}
        <div className="flex w-max animate-marquee-reverse space-x-3 py-1">
          {row2Items.map((item, index) => (
            <div
              key={`r2-${item.name}-${index}`}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md text-zinc-800 dark:text-zinc-200 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 hover:scale-105 transition-all cursor-pointer group shrink-0"
              title={`${item.name} (${item.category})`}
            >
              <img
                src={`/tech-logos/${item.svgFile}`}
                alt={item.name}
                className={`size-5 object-contain shrink-0 transition-transform group-hover:scale-110 ${
                  item.invertInDark ? 'dark:invert' : ''
                }`}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-extrabold text-xs tracking-tight text-zinc-900 dark:text-white font-sans">
                {item.name}
              </span>
              <span className="text-[9px] font-semibold text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 font-sans">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
