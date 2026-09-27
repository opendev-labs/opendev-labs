import React, { useState, useEffect } from 'react';
import { PromptInput } from './PromptInput';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Lock,
} from 'lucide-react';
import { getPromptQuota, isUserPro, openPricingPage, type PromptQuota } from '../services/promptQuotaService';
import { ScreenBarBiasLight } from './ScreenBarBiasLight';
import { StudioBackground } from './StudioBackground';

interface WelcomeScreenProps {
  onSendMessage: (prompt: string) => void;
  isThinking: boolean;
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  onOpenProModal?: (reason: 'export' | 'quota') => void;
}

interface PromptCapsule {
  category: string;
  label: string;
  prompt: string;
}

const ALL_PROMPT_CAPSULES: PromptCapsule[] = [
  // Row 1 items (SaaS, AI, Dashboards)
  {
    category: 'AI',
    label: 'Create an AI agent chat interface',
    prompt: 'Build a futuristic AI agent chat interface with streaming thought trace logs, latency counter, code syntax highlighting, and dark cyber aesthetics.'
  },
  {
    category: 'SaaS',
    label: 'Create a landing page',
    prompt: 'Generate a high-converting SaaS landing page with animated hero section, feature showcase grid, social proof logo wall, pricing tiers, and FAQ accordion.'
  },
  {
    category: 'Dashboards',
    label: 'Create a dashboard',
    prompt: 'Build an executive analytics dashboard with dark theme cards, key metric KPI counters, interactive bar/line charts, and responsive sidebar menu.'
  },
  {
    category: 'Forms',
    label: 'Create a login page',
    prompt: 'Build a modern, responsive user login page with email/password input fields, remember me checkbox, social OAuth buttons, glassmorphic card styling, and subtle hover animations.'
  },
  {
    category: 'FinTech',
    label: 'Create a crypto trading terminal',
    prompt: 'Build an Institutional Crypto Trading Desk with live candlestick charting, real-time order book ladder, trade history tape, and position leverage calculator.'
  },
  {
    category: 'SaaS',
    label: 'Create a pricing page',
    prompt: 'Create a sleek pricing table with monthly/annual billing toggle switch, recommended popular tier highlight badge, feature checklist, and CTA buttons.'
  },
  {
    category: 'Productivity',
    label: 'Create a Kanban sprint board',
    prompt: 'Build a Linear-inspired Kanban sprint board with draggable task cards, priority badges (Urgent, High, Medium, Low), sprint progress meter, and quick-add task drawer.'
  },
  {
    category: 'Apps',
    label: 'Create a product page',
    prompt: 'Create an e-commerce product detail page with multi-angle image gallery preview, size/color variant selector, quantity counter, add-to-cart drawer, and customer reviews.'
  },
  {
    category: 'Creative',
    label: 'Create a 3D generative particle canvas',
    prompt: 'Build an interactive HTML5 canvas 3D particle playground with particle density sliders, gravity physics toggles, neon glow color gradients, and PNG export.'
  },
  {
    category: 'Forms',
    label: 'Create a multi-step form',
    prompt: 'Create a multi-step wizard form with step indicator progress bar, form validation, animated tab transitions, and summary submission view.'
  },
  {
    category: 'DevOps',
    label: 'Create an incident war room',
    prompt: 'Create a DevOps incident war room with interactive server rack topology, streaming Prometheus metrics graphs, incident timeline, and severity alerts.'
  },

  // Row 2 items (FinTech, Productivity, Portfolios, Tools)
  {
    category: 'FinTech',
    label: 'Create a Neo-Bank credit card manager',
    prompt: 'Build a futuristic Neo-Bank web app featuring an interactive 3D holographic credit card, one-click freeze toggle, spending breakdown donut chart, and transaction list.'
  },
  {
    category: 'Portfolios',
    label: 'Create a portfolio website',
    prompt: 'Build an interactive developer portfolio website with dynamic typing header, filterable projects grid, skills badge cloud, timeline experience, and dark aesthetic.'
  },
  {
    category: 'AI',
    label: 'Create a multi-LLM benchmark arena',
    prompt: 'Build a multi-model LLM benchmark arena with side-by-side prompt generation testing, tokens/second speed benchmarks, markdown rendering, and community voting.'
  },
  {
    category: 'Productivity',
    label: 'Create a Notion-style block editor',
    prompt: 'Create a Notion-style modular workspace with slash-command menu (/heading, /todo, /code), draggable block reordering, and instant markdown preview.'
  },
  {
    category: 'Creative',
    label: 'Create a 16-step beat machine DAW',
    prompt: 'Build a browser-based 16-step drum machine sequencer with 4 tracks (Kick, Snare, Hi-Hat, Synth), BPM tempo tap, mute/solo controls, and audio frequency visualizer.'
  },
  {
    category: 'SaaS',
    label: 'Create a database SQL studio',
    prompt: 'Build a Supabase-style cloud database studio with Monaco SQL editor, editable data table grid, schema relationships view, and CSV export.'
  },
  {
    category: 'Portfolios',
    label: 'Create a blog',
    prompt: 'Build a modern tech blog landing page with featured articles grid, tag filtering, reading time indicators, newsletter subscription box, and dark mode aesthetic.'
  },
  {
    category: 'Forms',
    label: 'Create a contact page',
    prompt: 'Build a modern contact page with interactive contact form, embedded location map preview, social links, office working hours, and toast notification on submit.'
  },
  {
    category: 'Apps',
    label: 'Create a limited sneaker drop page',
    prompt: 'Build a streetwear limited drop page with 3D product card tilt, live scarcity countdown timer, size availability matrix, and slide-over quick checkout drawer.'
  },
  {
    category: 'Productivity',
    label: 'Create an Eisenhower focus matrix',
    prompt: 'Create an Eisenhower 4-quadrant priority matrix paired with a Pomodoro focus timer, ambient lofi background noise generator, and streak tracker.'
  },
  {
    category: 'AI',
    label: 'Create a voice AI assistant interface',
    prompt: 'Create a neuromorphic voice AI assistant UI with pulsating soundwave visualizer, live speech-to-text transcript feed with speaker tags, and audio gain sliders.'
  },

  // Row 3 items (Tools, Creative, Web3, SaaS)
  {
    category: 'FinTech',
    label: 'Create a DeFi yield optimizer matrix',
    prompt: 'Create a DeFi liquidity pool dashboard with real-time APY comparison across chains, interactive impermanent loss calculator, and 1-click staking simulator.'
  },
  {
    category: 'DevOps',
    label: 'Create an API rate-limit inspector',
    prompt: 'Build a cloud API gateway monitor with real-time HTTP traffic waterfall, latency histogram, token bucket rate limiter visualizer, and endpoint tester.'
  },
  {
    category: 'Creative',
    label: 'Create a luxury watch 360 configurator',
    prompt: 'Design a luxury watch customizer studio with bezel finish selectors, dial sunburst textures, live ticking watch hands, and real-time MSRP pricing ticker.'
  },
  {
    category: 'AI',
    label: 'Create an AI code review cockpit',
    prompt: 'Develop an AI pull request review dashboard with inline code diff viewer, automated OWASP security score cards, and 1-click refactoring suggestion preview.'
  },
  {
    category: 'Productivity',
    label: 'Create a system architecture canvas',
    prompt: 'Build an interactive system architecture canvas with draggable cloud nodes (Database, Redis, API, CDN), animated SVG bezier connection cables, and auto-layout.'
  },
  {
    category: 'SaaS',
    label: 'Create a feature flag rollout dashboard',
    prompt: 'Build a feature flag and experimentation dashboard with animated switches, canary rollout percentage sliders (1% to 100%), and cohort rules builder.'
  },
  {
    category: 'Apps',
    label: 'Create a mechanical keyboard sound lab',
    prompt: 'Develop an artisan mechanical keyboard studio with layout selection, interactive audio click sound simulation on keypress, and keycap colorway presets.'
  },
  {
    category: 'FinTech',
    label: 'Create a startup cap table simulator',
    prompt: 'Build a startup cap table and vesting curve simulator with 4-year equity vesting graph, 1-year cliff indicator, and round dilution model (Seed to Series B).'
  },
  {
    category: 'Apps',
    label: 'Create a coffee subscription planner',
    prompt: 'Create a specialty coffee roaster subscription portal with interactive flavor radar chart, brewing method guide, and delivery frequency slider.'
  },
  {
    category: 'Portfolios',
    label: 'Create a developer terminal portfolio',
    prompt: 'Build a developer portfolio with an interactive terminal CLI responding to commands, experience timeline with glow connectors, and calendar booking drawer.'
  }
];

export function WelcomeScreen({
  onSendMessage,
  isThinking,
  selectedModelId,
  onModelChange,
  onOpenProModal
}: WelcomeScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quota, setQuota] = useState<PromptQuota>(() => getPromptQuota());
  const [isPro, setIsPro] = useState<boolean>(() => isUserPro());

  useEffect(() => {
    const updateQuota = () => {
      setQuota(getPromptQuota());
      setIsPro(isUserPro());
    };
    updateQuota();
    window.addEventListener('storage', updateQuota);
    window.addEventListener('openstudio-quota-changed', updateQuota);
    return () => {
      window.removeEventListener('storage', updateQuota);
      window.removeEventListener('openstudio-quota-changed', updateQuota);
    };
  }, []);

  const categories = ['All', 'SaaS', 'Dashboards', 'AI', 'FinTech', 'Forms', 'Portfolios', 'Apps', 'Creative', 'Productivity'];

  const handlePillClick = (capsule: PromptCapsule) => {
    if (quota.isLocked && !isPro) {
      openPricingPage();
      return;
    }
    onSendMessage(capsule.prompt);
  };

  // Divide into 3 marquee rows for smooth looping when "All" is active
  const third = Math.ceil(ALL_PROMPT_CAPSULES.length / 3);
  const row1 = ALL_PROMPT_CAPSULES.slice(0, third);
  const row2 = ALL_PROMPT_CAPSULES.slice(third, third * 2);
  const row3 = ALL_PROMPT_CAPSULES.slice(third * 2);

  // Duplicated arrays for seamless continuous looping
  const row1Items = [...row1, ...row1];
  const row2Items = [...row2, ...row2];
  const row3Items = [...row3, ...row3];

  const filteredPills = selectedCategory === 'All'
    ? []
    : ALL_PROMPT_CAPSULES.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#000000] text-zinc-100 selection:bg-white/20 selection:text-white relative overflow-x-hidden overflow-y-auto custom-scrollbar">
      {/* 🌌 LIVE 2D ANIMATED LIGHT BACKGROUND */}
      <StudioBackground />

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 py-8 my-auto w-full max-w-7xl mx-auto">
        <div className="w-full max-w-4xl flex flex-col items-center text-center">

          {/* DAILY QUOTA STATUS PILL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4"
          >
            {isPro ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>OpenStudio Pro Active • Unlimited Generations</span>
              </div>
            ) : quota.isLocked ? (
              <button
                onClick={openPricingPage}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/95 border border-amber-500/50 text-amber-200 text-xs font-semibold hover:bg-zinc-800 hover:border-amber-400 transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.2)] group"
                title="Open Pricing Page"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Daily Quota Reached (0/6 Left) • Unlock 6 Tomorrow or Go Pro</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-black font-extrabold ml-1">Upgrade</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-medium backdrop-blur-md">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-300" />
                </span>
                <span>
                  <strong className="text-white font-semibold">{quota.remaining} of {quota.total}</strong> free prompts remaining today
                </span>
                <span className="text-zinc-500 text-[11px]">• Resets at midnight</span>
                <button
                  onClick={openPricingPage}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 ml-1 hover:underline cursor-pointer"
                  title="View OpenStudio Pro Plans"
                >
                  Get Pro
                </button>
              </div>
            )}
          </motion.div>

          {/* MAIN HEADLINE */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-2 mb-4"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#f4f4f5] leading-tight font-sans">
              What do you want to create?
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm font-normal">
              Powered by <span className="text-white font-semibold">OpenStudio Intelligence</span> & <span className="text-zinc-300 font-semibold">CodeDevBox Cloud VM</span>
            </p>
          </motion.div>

          {/* FLOATING PROMPT INPUT WITH LED STRIP UNDERGLOW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="w-full max-w-3xl mb-6 relative group"
            style={{ isolation: 'isolate' }}
          >
            {/* 🔲 RECTANGULAR LED STRIP — glows from all 4 sides of the input border */}
            <ScreenBarBiasLight />

            <div className="relative z-10">
              <PromptInput
                onSendMessage={onSendMessage}
                disabled={isThinking}
                selectedModelId={selectedModelId}
                onModelChange={onModelChange}
              />
            </div>
          </motion.div>

          {/* CATEGORY TABS (SLEEK SMALL CAPSULES) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="flex flex-wrap items-center justify-center gap-1 mb-5 bg-zinc-900/80 border border-zinc-800/80 p-0.5 rounded-full backdrop-blur-xl max-w-2xl"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-black shadow-md scale-105'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* 🚀 SMALL PROMPT CAPSULES (MOVING MARQUEE LIKE HOMEPAGE FRAMEWORKS) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="w-full max-w-5xl mt-1 relative z-10"
        >
          {selectedCategory === 'All' ? (
            /* 3-ROW CONTINUOUS MOVING SMALL MARQUEE CAPSULES */
            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] flex flex-col gap-2 py-1">
              
              {/* Row 1: Moving Left */}
              <div className="flex w-max animate-marquee space-x-2 py-0.5">
                {row1Items.map((pill, index) => (
                  <button
                    key={`r1-${pill.label}-${index}`}
                    onClick={() => handlePillClick(pill)}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-zinc-300 text-[11px] font-medium hover:border-zinc-500 hover:text-white hover:bg-zinc-800 hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-md shrink-0 select-none whitespace-nowrap"
                    title={pill.prompt}
                  >
                    <span>{pill.label}</span>
                  </button>
                ))}
              </div>

              {/* Row 2: Moving Right */}
              <div className="flex w-max animate-marquee-reverse space-x-2 py-0.5">
                {row2Items.map((pill, index) => (
                  <button
                    key={`r2-${pill.label}-${index}`}
                    onClick={() => handlePillClick(pill)}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-zinc-300 text-[11px] font-medium hover:border-zinc-500 hover:text-white hover:bg-zinc-800 hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-md shrink-0 select-none whitespace-nowrap"
                    title={pill.prompt}
                  >
                    <span>{pill.label}</span>
                  </button>
                ))}
              </div>

              {/* Row 3: Moving Left */}
              <div className="flex w-max animate-marquee space-x-2 py-0.5">
                {row3Items.map((pill, index) => (
                  <button
                    key={`r3-${pill.label}-${index}`}
                    onClick={() => handlePillClick(pill)}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-zinc-300 text-[11px] font-medium hover:border-zinc-500 hover:text-white hover:bg-zinc-800 hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-md shrink-0 select-none whitespace-nowrap"
                    title={pill.prompt}
                  >
                    <span>{pill.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* FILTERED SMALL CATEGORY CAPSULES CLOUD */
            <div className="flex flex-wrap items-center justify-center gap-2 w-full max-w-3xl mx-auto py-3">
              {filteredPills.map((pill) => (
                <button
                  key={pill.label}
                  onClick={() => handlePillClick(pill)}
                  className="px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-zinc-300 text-[11px] font-medium hover:border-zinc-500 hover:text-white hover:bg-zinc-800 hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-md"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          )}

          <div className="text-center mt-2">
            <span className="text-[10px] text-zinc-500 font-medium tracking-wide">
              Tip: Hover to pause • Click any capsule to build in Studio
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}