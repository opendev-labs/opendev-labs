import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { OceanShader } from '../components/ui/OceanShader';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Waves,
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
} from 'lucide-react';

/**
 * opendev-labs.com/openstudio
 * HeroUI Pro Powered Landing Page with metishipping.com's hyper-realistic 3D Seascape Ocean
 * and interactive panoramic sea exploration (mouse left/right navigates the vista).
 */
const OpenStudioLandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [promptText, setPromptText] = useState('Build a real-time crypto trading terminal with dark glassmorphism, live candlestick charts, and orderbook execution.');
  const [selectedModel, setSelectedModel] = useState('Gemini 2.5 Flash');

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative selection:bg-[#00f2fe]/30 selection:text-white font-sans">
      {/* ── LIVE 3D HYPER-REALISTIC OCEAN SHADER FROM METISHIPPING.COM ── */}
      <OceanShader />

      {/* HeroUI Pro Contrast Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-slate-950/30 pointer-events-none z-[1]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent pointer-events-none z-[1]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950/85 to-transparent pointer-events-none z-[1]" />

      {/* ── HEROUI PRO FLOATING GLASS NAVBAR ── */}
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-between gap-6 px-5 sm:px-6 py-2.5 rounded-full bg-slate-950/70 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/40 max-w-5xl w-full">
          {/* Brand */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="size-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] shadow-[0_0_15px_rgba(0,242,254,0.35)]">
              <img src="/favicon.png" alt="OpenDev-Labs" className="size-full rounded-full object-cover" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                OpenDev
              </span>
              <span className="text-zinc-600 font-mono text-xs">/</span>
              <span className="text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
                OpenStudio
              </span>
            </div>
          </a>

          {/* Quick Nav Links (HeroUI Pro Style) */}
          <div className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-300">
            <a href="#features" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">
              Features
            </a>
            <a href="#models" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">
              AI Models
            </a>
            <a href="#demo" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">
              Live Sandbox
            </a>
            <a
              href="https://openstudio.opendev-labs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1"
            >
              Direct Studio <ExternalLink className="size-3 text-cyan-400" />
            </a>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2.5">
                <span className="hidden sm:inline-block text-[11px] font-mono text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-500/20">
                  {user.email}
                </span>
                <a
                  href="https://openstudio.opendev-labs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs hover:shadow-[0_0_20px_rgba(0,242,254,0.45)] hover:scale-105 active:scale-95 transition-all"
                >
                  Launch App →
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/auth')}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/auth?redirect=/openstudio')}
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 font-bold text-xs hover:shadow-[0_0_20px_rgba(0,242,254,0.5)] hover:scale-105 active:scale-95 transition-all"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 pt-32 sm:pt-36 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* HeroUI Pro Chip: Live Sea Navigation Active */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-xl shadow-[0_0_25px_rgba(0,242,254,0.2)] mb-6"
        >
          <Compass className="size-3.5 text-cyan-400 animate-spin-slow" />
          <span>Move cursor left or right across the screen to explore the sea vista</span>
          <span className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
        </motion.div>

        {/* HeroUI Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white max-w-4xl mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
        >
          Build Full-Stack Apps{' '}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 drop-shadow-[0_0_40px_rgba(0,242,254,0.4)]">
            From a Single Prompt
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-200 max-w-2xl leading-relaxed mb-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
        >
          OpenStudio is your autonomous AI co-pilot for building web applications, complete with live Sandpack execution, multi-file code editing, and one-click GitHub deployments.
        </motion.p>

        {/* HeroUI Pro Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mb-14"
        >
          <a
            href="https://openstudio.opendev-labs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 h-12 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 font-extrabold text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_35px_rgba(0,242,254,0.45)] flex items-center justify-center gap-2 group"
          >
            Launch OpenStudio
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <button
            onClick={() => {
              const el = document.getElementById('demo');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-7 h-12 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="size-3.5 text-cyan-400 fill-cyan-400" />
            Watch Sandbox Demo
          </button>
        </motion.div>

        {/* ── HEROUI FLOATING TRUST CAPSULE ── */}
        <div className="w-full flex justify-center mb-16">
          <div className="inline-flex items-center gap-3 sm:gap-6 px-5 py-2 rounded-full bg-slate-950/60 border border-white/10 backdrop-blur-xl text-xs text-slate-300 font-medium shadow-2xl">
            <div className="flex items-center gap-1.5 shrink-0">
              <Zap className="size-3.5 text-cyan-400" />
              <span>&lt; 2.5s Generation Speed</span>
            </div>
            <span className="text-white/20 shrink-0">•</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>Zero Local Setup</span>
            </div>
            <span className="text-white/20 shrink-0">•</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <Rocket className="size-3.5 text-sky-400" />
              <span>1-Click GitHub Deploy</span>
            </div>
          </div>
        </div>

        {/* ── HEROUI PRO INTERACTIVE STUDIO MOCKUP / LIVE SANDBOX ── */}
        <div id="demo" className="w-full max-w-5xl rounded-3xl bg-slate-950/75 border border-white/15 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-4 sm:p-6 text-left relative overflow-hidden">
          {/* Ambient Card Glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

          {/* Window Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-red-500/80" />
              <div className="size-3 rounded-full bg-amber-500/80" />
              <div className="size-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs font-mono text-slate-400">OpenStudio — Workspace / live-preview</span>
            </div>

            {/* Model Pill Switcher (HeroUI Pro Style) */}
            <div className="hidden sm:flex items-center gap-1.5 bg-black/40 p-1 rounded-full border border-white/10 text-[11px]">
              {['Gemini 2.5 Flash', 'Claude 3.7', 'GPT-4o', 'DeepSeek R1'].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedModel(m)}
                  className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                    selectedModel === m
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Prompt Input Field */}
          <div className="mb-6 relative">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-black/50 border border-white/15 focus-within:border-cyan-400/60 focus-within:shadow-[0_0_25px_rgba(0,242,254,0.2)] transition-all">
              <Sparkles className="size-5 text-cyan-400 shrink-0 animate-pulse" />
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-hidden font-medium"
                placeholder="Describe the application you want to build..."
              />
              <a
                href="https://openstudio.opendev-labs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold text-xs hover:brightness-110 shrink-0 transition-all flex items-center gap-1.5"
              >
                <span>Generate</span>
                <ChevronRight className="size-3.5" />
              </a>
            </div>
          </div>

          {/* Live Preview vs Code Switcher Tab Bar */}
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="size-3.5" /> Live Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'code'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="size-3.5" /> Source Code (App.tsx)
              </button>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Running Sandpack Node 20
            </span>
          </div>

          {/* Sandbox Content Screen */}
          <div className="rounded-2xl border border-white/10 bg-black/60 p-4 sm:p-6 min-h-[280px] font-mono text-xs overflow-hidden">
            {activeTab === 'preview' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-cyan-400" />
                    <span className="font-bold text-white font-sans text-sm">Crypto Terminal Pro</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                    <span>BTC/USD: $94,820.50 (+4.82%)</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <span className="text-slate-400 text-[10px] block">24h Volume</span>
                    <span className="text-sm font-bold text-white">$42.8 Billion</span>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <span className="text-slate-400 text-[10px] block">Order Execution</span>
                    <span className="text-sm font-bold text-cyan-400">12ms Instant</span>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <span className="text-slate-400 text-[10px] block">AI Copilot</span>
                    <span className="text-sm font-bold text-indigo-400">{selectedModel}</span>
                  </div>
                </div>
                <div className="h-28 rounded-xl bg-gradient-to-r from-cyan-950/30 via-slate-900/40 to-blue-950/30 border border-white/10 flex items-center justify-center text-slate-400 text-xs">
                  <div className="text-center space-y-1">
                    <Terminal className="size-6 text-cyan-400 mx-auto" />
                    <p className="text-white font-sans font-semibold">Interactive Sandbox Active</p>
                    <p className="text-slate-400 text-[11px]">Click Launch to experience the full Monaco studio with live hot-reload.</p>
                  </div>
                </div>
              </div>
            ) : (
              <pre className="text-slate-300 leading-relaxed overflow-x-auto text-[11px]">
{`import React, { useState } from 'react';
import { Card, Button, Badge } from '@heroui/react';

export default function TradingApp() {
  const [activePair, setActivePair] = useState('BTC/USDT');

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-sky-300">
          OpenStudio Terminal
        </h1>
        <Badge color="success" variant="flat">Engine: ${selectedModel}</Badge>
      </header>
      {/* Real-time WebSockets & Orderbook rendered dynamically */}
    </div>
  );
}`}
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURES GRID (HeroUI Pro Cards) ── */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-[0.25em] bg-cyan-950/40 px-3.5 py-1 rounded-full border border-cyan-500/20">
            Engine Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Everything You Need To Ship In Minutes
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            From raw natural language prompts to deployed GitHub repositories and production hosting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: <Sparkles className="size-5 text-cyan-400" />,
              title: 'Multi-Model Generation',
              desc: 'Seamlessly switch between Gemini 2.5 Flash, Claude 3.7 Sonnet, DeepSeek R1, and GPT-4o on the fly.',
              badge: 'Fast & Accurate',
            },
            {
              icon: <Eye className="size-5 text-sky-400" />,
              title: 'Live Sandpack Runtime',
              desc: 'Isolated browser container executes React, TypeScript, and TailwindCSS in real-time with 0s latency.',
              badge: 'Real-time',
            },
            {
              icon: <Code className="size-5 text-indigo-400" />,
              title: 'Full Monaco Workspace',
              desc: 'Multi-file code explorer, intelligent auto-complete, syntax highlighting, and virtual disk storage.',
              badge: 'Pro Editor',
            },
            {
              icon: <Rocket className="size-5 text-amber-400" />,
              title: '1-Click GitHub Deploy',
              desc: 'Connect your personal GitHub to auto-create repositories and publish instantly to GitHub Pages & Vercel.',
              badge: 'Instant Publish',
            },
            {
              icon: <Layers className="size-5 text-emerald-400" />,
              title: 'Templates & Starter Kits',
              desc: 'Pre-configured architectures for SaaS dashboards, landing pages, crypto terminals, and agency portals.',
              badge: 'Pre-built',
            },
            {
              icon: <ShieldCheck className="size-5 text-purple-400" />,
              title: 'Single Sovereign Auth',
              desc: 'One seamless login across all OpenDev-Labs products with isolated credentials and personal security.',
              badge: 'Encrypted',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-xl hover:border-cyan-400/40 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,242,254,0.18)] hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="size-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-950/50 px-2.5 py-1 rounded-full border border-cyan-500/20">
                  {f.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
                {f.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HEROUI PRO CALL TO ACTION BANNER ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/15 backdrop-blur-2xl text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none" />

          <span className="text-xs font-bold text-cyan-400 uppercase tracking-[0.25em] bg-cyan-950/50 px-3.5 py-1 rounded-full border border-cyan-500/30 mb-4 inline-block">
            Start Building Today
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Turn Your Thoughts Into Production Software
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Free forever for personal development. Connect your personal GitHub and launch your dream apps right now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="https://openstudio.opendev-labs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-extrabold text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,242,254,0.4)] flex items-center justify-center gap-2"
            >
              Open Studio Now
              <ArrowRight className="size-4" />
            </a>
            <button
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto px-7 h-12 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm transition-all active:scale-95"
            >
              Sign In with Sovereign Account
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl bg-slate-950/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>© 2026 OpenDev-Labs · Lead Architect Yash Ramteke</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://openstudio.opendev-labs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            openstudio.opendev-labs.com <ArrowRight className="size-3" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default OpenStudioLandingPage;
