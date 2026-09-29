import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';
import { FrameworkMarquee } from '../components/ui/FrameworkMarquee';
import { TypewriterHeading } from '../components/ui/TypewriterHeading';
import { createHandoffUrl, getOpenStudioUrl } from '../lib/authSession';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Eye,
  Code,
  Rocket,
  ShieldCheck,
  Terminal,
  Zap,
  Layers,
  ChevronRight,
  ExternalLink,
  Play,
  CheckCircle2,
  Laptop,
  Check,
  Bot,
  RefreshCw,
} from 'lucide-react';

const studioPhrases = [
  "Build Full-Stack Apps from a Single Prompt",
  "Autonomous AI Full-Stack React & Next.js Builder",
  "Live Sandpack Execution with Real-Time Hot Reload",
  "Multi-File Monaco Code Editor with Instant Disk Storage",
  "One-Click Deployment to GitHub Pages, Vercel & Netlify",
  "Powered by Gemini 2.5, Claude 3.7, GPT-4o & DeepSeek R1"
];

/**
 * opendev-labs.com/openstudio
 * OpenStudio Landing Page aligned with official opendev-labs.github.io UI and Pitch Black Theme.
 */
const OpenStudioLandingPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [promptText, setPromptText] = useState(
    'Build a real-time crypto trading terminal with dark glassmorphism, live candlestick charts, and orderbook execution.'
  );
  const [selectedModel, setSelectedModel] = useState('Gemini 2.5 Flash');

  // Scope pitch black dark mode ONLY to OpenStudio page; restore user theme on unmount
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');

    return () => {
      if (theme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
      } else {
        root.classList.add('dark');
        root.classList.remove('light');
      }
    };
  }, [theme]);

  const handleLaunchStudio = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const studioUrl = getOpenStudioUrl();
    if (!user) {
      navigate(`/auth?redirect=${encodeURIComponent(studioUrl)}`);
    } else {
      const handoff = createHandoffUrl(studioUrl, user);
      window.location.href = handoff;
    }
  };

  return (
    <div className="dark min-h-screen bg-black text-white flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* ── 1. Header Navigation ── */}
      <Navbar />

      {/* ── 2. Hero Section (True full-screen 100dvh viewport height with full-bleed background image) ── */}
      {/* ── 2. Hero Section (True full-screen 100dvh viewport height with full-bleed background image & visible animated strip) ── */}
      <section className="h-screen h-[100dvh] max-h-screen overflow-hidden w-full flex flex-col justify-between items-center pt-20 pb-2 sm:pt-22 sm:pb-3 border-b border-zinc-800/80 bg-black hero-spotlight relative transition-colors">
        {/* Hero Background Image - 4K Microsoft Surface Ribbon (Full Screen) */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none z-0 opacity-85"
          style={{ backgroundImage: "url('/microsoft-surface-3840x2160-26627.png')" }}
        />
        {/* Pitch Black Gradient Vignette for seamless contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black pointer-events-none z-0" />

        {/* Ambient Corner Accents */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none z-0" />

        <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-20 z-0" particleCount={25} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10 w-full flex flex-col justify-between items-center flex-1 h-full overflow-hidden">
          {/* Top Pill Beacon */}
          <div className="my-auto pt-1 sm:pt-2 w-full flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-2 mb-2 sm:mb-3"
            >
              <span className="hero-pill-badge bg-black/80 border-zinc-700/80 text-zinc-100 backdrop-blur-md shadow-2xl">
                <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
                OpenStudio 2.0 • 6 Free Prompts Everyday
              </span>
            </motion.div>

            {/* Dynamic Typewriter Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08] h-[105px] sm:h-[135px] lg:h-[155px] flex items-center justify-center text-center overflow-hidden drop-shadow-lg"
            >
              <TypewriterHeading phrases={studioPhrases} pauseDuration={3500} typingSpeed={40} deletingSpeed={20} />
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-xs sm:text-sm lg:text-base text-zinc-200 max-w-2xl mx-auto leading-relaxed mb-4 drop-shadow-sm font-medium"
            >
              Your autonomous AI co-pilot for building web applications — with live side-by-side Sandpack execution, multi-file code editing, and one-click GitHub deployments. Includes 6 free prompts everyday!
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <button
                onClick={handleLaunchStudio}
                className="w-full sm:w-auto h-11 sm:h-12 px-8 rounded-full bg-white text-black font-extrabold text-sm sm:text-base hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
              >
                Launch OpenStudio <ArrowRight className="size-4" />
              </button>
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto h-11 sm:h-12 px-8 rounded-full border border-white/20 bg-zinc-900/90 backdrop-blur-md text-white font-extrabold text-sm sm:text-base hover:bg-zinc-800 transition-all shadow-sm cursor-pointer hover:scale-105"
                >
                  My Dashboard
                </button>
              ) : (
                <button
                  onClick={() => navigate('/auth?redirect=/openstudio')}
                  className="w-full sm:w-auto h-11 sm:h-12 px-8 rounded-full border border-white/20 bg-zinc-900/90 backdrop-blur-md text-white font-extrabold text-sm sm:text-base hover:bg-zinc-800 transition-all shadow-sm cursor-pointer hover:scale-105"
                >
                  Sign In
                </button>
              )}
            </motion.div>
          </div>

          {/* Bottom Framework Marquee visible right on screen with hero */}
          <div className="w-full mt-auto pt-1 pb-1 sm:pb-2 flex flex-col items-center">
            <FrameworkMarquee />
          </div>
        </div>
      </section>

      {/* ── 3. Interactive Studio Sandbox Preview Section (Pitch Black) ── */}
      <section className="py-20 px-4 sm:px-6 bg-black border-b border-zinc-800/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <span className="hero-pill-badge bg-zinc-900/90 border-zinc-800 text-zinc-200 mb-2">
              <Sparkles className="size-3.5 text-blue-400" />
              Live Workspace Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Instant Generation. Zero Config.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
              Test how natural language prompts transform into runnable React applications with live Monaco code editor.
            </p>
          </div>

          {/* Interactive Window Mockup */}
          <div className="rounded-3xl bg-zinc-950/90 border border-zinc-800 p-4 sm:p-6 text-left relative overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* Window Controls */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-500/80" />
                <div className="size-3 rounded-full bg-amber-500/80" />
                <div className="size-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs font-mono text-zinc-400">
                  OpenStudio / workspace-preview
                </span>
              </div>

              {/* Model Switcher */}
              <div className="hidden sm:flex items-center gap-1.5 bg-zinc-900 p-1 rounded-full border border-zinc-800 text-[11px]">
                {['Gemini 2.5 Flash', 'Claude 3.7', 'GPT-4o', 'DeepSeek R1'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedModel(m)}
                    className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                      selectedModel === m
                        ? 'bg-zinc-800 text-blue-400 shadow-sm font-bold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input Box */}
            <div className="mb-6">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-black border border-zinc-800 focus-within:border-blue-500 transition-all shadow-sm">
                <Sparkles className="size-5 text-blue-400 shrink-0 animate-pulse" />
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-hidden font-medium"
                  placeholder="Describe your full-stack application..."
                />
                <button
                  onClick={handleLaunchStudio}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Build</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Preview vs Code Tabs */}
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-blue-950/60 text-blue-400 border border-blue-800/60'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Eye className="size-3.5" /> Live Preview
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'code'
                      ? 'bg-blue-950/60 text-blue-400 border border-blue-800/60'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Code className="size-3.5" /> App.tsx Source
                </button>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Sandpack Node 20 Active
              </span>
            </div>

            {/* Sandbox Container */}
            <div className="rounded-2xl border border-zinc-800 bg-black p-4 sm:p-6 min-h-[260px] font-mono text-xs overflow-hidden">
              {activeTab === 'preview' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2 font-sans font-bold text-white text-sm">
                      <span className="size-2.5 rounded-full bg-blue-500" />
                      Crypto Terminal Dashboard
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-bold">
                      BTC/USD: $94,820.50 (+4.82%)
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-3">
                      <span className="text-zinc-500 text-[10px] block">24h Volume</span>
                      <span className="text-sm font-bold text-white">$42.8 Billion</span>
                    </div>
                    <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-3">
                      <span className="text-zinc-500 text-[10px] block">Latency</span>
                      <span className="text-sm font-bold text-blue-400">12ms Instant</span>
                    </div>
                    <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-3">
                      <span className="text-zinc-500 text-[10px] block">Engine</span>
                      <span className="text-sm font-bold text-purple-400">{selectedModel}</span>
                    </div>
                  </div>
                  <div className="h-24 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-center text-zinc-400 text-xs">
                    <div className="text-center space-y-1">
                      <Terminal className="size-5 text-blue-400 mx-auto" />
                      <p className="font-sans font-semibold text-zinc-200">Live Code Execution Ready</p>
                      <p className="text-[11px] text-zinc-500">Open Studio to customize, edit in Monaco, or deploy with 1-click.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <pre className="text-zinc-300 leading-relaxed overflow-x-auto text-[11px]">
{`import React, { useState } from 'react';
import { Card, Button, Badge } from '@heroui/react';

export default function TradingTerminal() {
  const [pair, setPair] = useState('BTC/USDT');

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
          OpenStudio Terminal
        </h1>
        <Badge color="primary">Model: ${selectedModel}</Badge>
      </header>
      {/* Live Sandpack Execution */}
    </div>
  );
}`}
                </pre>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Bento Features Grid (Pitch Black) ── */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full bg-black">
        <div className="text-center mb-14 space-y-3">
          <span className="hero-pill-badge bg-zinc-900/90 border-zinc-800 text-zinc-200">
            <Cpu className="size-3.5 text-blue-400" />
            Core Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Built for Developers Who Value Speed
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
            From natural language prompt to deployed repository with zero complex setup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Sparkles className="size-5 text-blue-400" />,
              title: 'Multi-Model AI Engine',
              desc: 'Seamlessly switch between Gemini 2.5 Flash, Claude 3.7 Sonnet, DeepSeek R1, and GPT-4o for code generation.',
              badge: 'Multi-LLM',
            },
            {
              icon: <Eye className="size-5 text-sky-400" />,
              title: 'Real-Time Sandpack Sandbox',
              desc: 'Isolated client-side runtime executes React, TypeScript, and TailwindCSS apps live with 0s build latency.',
              badge: 'Instant Live',
            },
            {
              icon: <Code className="size-5 text-indigo-400" />,
              title: 'Full Monaco Workspace',
              desc: 'Multi-file code explorer, intelligent auto-complete, syntax highlighting, and local disk synchronization.',
              badge: 'Pro Editor',
            },
            {
              icon: <Rocket className="size-5 text-amber-400" />,
              title: '1-Click GitHub Deploy',
              desc: 'Connect your personal GitHub account to automatically create repositories and publish to GitHub Pages & Vercel.',
              badge: 'Fast Deploy',
            },
            {
              icon: <Layers className="size-5 text-emerald-400" />,
              title: 'Enterprise Starter Kits',
              desc: 'Production-ready architectures for SaaS dashboards, client portals, crypto terminals, and agency applications.',
              badge: 'Batteries Included',
            },
            {
              icon: <ShieldCheck className="size-5 text-purple-400" />,
              title: 'Sovereign Account Gateway',
              desc: 'Single sign-on across all OpenDev-Labs tools and client dashboards with isolated tokens and personal data privacy.',
              badge: 'Sovereign',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-3xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all p-6 relative overflow-hidden group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="size-11 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/50 px-2.5 py-1 rounded-full border border-blue-800/60">
                  {f.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Call To Action Banner (Pitch Black) ── */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full bg-black">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-zinc-950 to-black border border-zinc-800 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-500/15 blur-[120px] pointer-events-none" />

          <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] bg-blue-950/50 px-3.5 py-1 rounded-full border border-blue-500/30 mb-4 inline-block">
            Start Building
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white">
            Turn Your Ideas Into Production Code Today
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Free forever for personal development. Connect your GitHub account and start generating full applications in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={handleLaunchStudio}
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-black font-extrabold text-sm hover:bg-zinc-200 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              Open Studio Now <ArrowRight className="size-4" />
            </button>
            <button
              onClick={() => navigate('/openstudio/pricing')}
              className="w-full sm:w-auto h-12 px-7 rounded-full border border-blue-500/40 bg-blue-950/40 text-blue-200 font-semibold text-sm hover:bg-blue-900/60 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="size-4 text-cyan-400" />
              View Subscription Pricing
            </button>
            <button
              onClick={() => navigate('/auth?redirect=/openstudio')}
              className="w-full sm:w-auto h-12 px-7 rounded-full border border-zinc-700 bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-800 transition-all active:scale-95 cursor-pointer"
            >
              Sign In with Account
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. Footer ── */}
      <Footer />
    </div>
  );
};

export default OpenStudioLandingPage;
