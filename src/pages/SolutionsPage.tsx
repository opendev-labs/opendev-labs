import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Server,
  Layers,
  Database,
  Lock,
  Clock,
  ChevronRight,
  Cpu,
  Terminal,
  Globe,
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Live2DWavesCanvas } from '../components/ui/Live2DWavesCanvas';
import { useNavigate } from 'react-router-dom';
import { TypewriterHeading } from '../components/ui/TypewriterHeading';

const heroPhrases = [
  "Engineering Solutions Tailored for Scalable Growth",
  "High-Performance Web Platforms & Full-Stack Apps",
  "GenAI Agent Workflows & Multi-LLM Orchestration",
  "Cloud DevOps, Daily Bash Automation & Server Monitoring",
  "100% Source Code Handover with Complete IP Ownership",
  "Production-Grade Architecture Delivered on Schedule"
];

export const SolutionsPage: React.FC = () => {
  const navigate = useNavigate();

  const solutionPillars = [
    {
      id: 'web_apps',
      icon: Code2,
      title: 'Full-Stack Web & SaaS Platforms',
      subtitle: 'Custom High-Performance Applications',
      description: 'Modern React, Next.js, and TypeScript web platforms engineered with tailored UI/UX, responsive layouts, and robust backend APIs built for speed.',
      badges: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'REST & GraphQL'],
      features: [
        '100% Source Code & Git Repository Ownership',
        'Sub-second page loads & SEO optimization',
        'Responsive layouts for mobile, tablet & desktop',
        'Clean, modular component architecture'
      ],
      color: 'blue'
    },
    {
      id: 'genai',
      icon: Cpu,
      title: 'GenAI, Autonomous Agents & OpenStudio',
      subtitle: 'Prompt-to-App Builder & Multi-LLM Systems',
      description: 'Production AI workflows powered by OpenStudio 2.0 — our autonomous app builder with 6 free daily prompts & plans from ₹222/mo — alongside custom multi-agent swarms, self-healing code generators, and RAG retrieval pipelines.',
      badges: ['OpenStudio 2.0', 'Gemini 2.5', 'Claude 3.7', 'DeepSeek R1', 'Sandpack', 'LangChain'],
      features: [
        'OpenStudio 2.0: 6 Free Prompts Everyday (Plans from ₹222/mo)',
        'Live in-browser Sandpack execution & multi-file Monaco editor',
        '1-Click GitHub repository synchronization & ZIP export',
        'Autonomous bug patching & self-healing test execution',
        'Sub-second latency checks & vector database retrieval'
      ],
      color: 'indigo'
    },
    {
      id: 'cloud_devops',
      icon: Terminal,
      title: 'Cloud DevOps & Bash Automation',
      subtitle: 'Infrastructure & System Reliability',
      description: 'Automated server provisioning, daily bash maintenance scripts, zero-downtime deployment pipelines, and custom API webhook handlers.',
      badges: ['Hostinger', 'Vercel', 'Google Cloud', 'Docker', 'Bash Scripts', 'CI/CD Pipelines'],
      features: [
        'Automated daily database & file backups',
        '24/7 server health alerts & response checks',
        'Automated SSL renewals & DNS management',
        'Custom cron jobs & server maintenance scripts'
      ],
      color: 'emerald'
    },
    {
      id: 'data_security',
      icon: Database,
      title: 'Real-Time Data & Security',
      subtitle: 'Enterprise Database & Hardening',
      description: 'Scalable database schemas, real-time data synchronization, Firebase Firestore & PostgreSQL tuning, and end-to-end security hardening.',
      badges: ['Firebase Firestore', 'PostgreSQL', 'MySQL', 'Redis Cache', 'JWT & Auth', '99.99% SLA'],
      features: [
        '99.99% server uptime guarantee compliance',
        'Encrypted data streams & secure authentication',
        'Automated database snapshots & instant restores',
        'Role-based access control (RBAC) architecture'
      ],
      color: 'amber'
    },
    {
      id: 'mobile_crossplatform',
      icon: Globe,
      title: 'Cross-Platform Mobile Apps',
      subtitle: 'React Native & Flutter Ecosystems',
      description: 'Native iOS and Android mobile architectures built with single codebase efficiency, smooth 120 FPS animations, and native device hardware API integrations.',
      badges: ['React Native', 'Expo', 'Flutter', 'iOS & Android', 'Push Notifications', 'Offline First'],
      features: [
        'App Store & Google Play automated release pipelines',
        'Biometric authentication & local encrypted storage',
        'Native device camera, location & offline caching',
        'Sub-second fluid gestures and clean state architecture'
      ],
      color: 'blue'
    },
    {
      id: 'api_microservices',
      icon: Server,
      title: 'High-Throughput APIs & Microservices',
      subtitle: 'Distributed Systems & Event Streams',
      description: 'Distributed REST & gRPC microservices, event-driven architectures with Kafka and Redis queues, designed for ultra-low latency and peak traffic resilience.',
      badges: ['Go', 'Node.js', 'Redis', 'WebSockets', 'GraphQL', 'Docker'],
      features: [
        'Sub-10ms response times with Redis caching layers',
        'Zero-downtime rolling canary deployments',
        'End-to-end rate limiting, telemetry & DDoS defense',
        'WebSocket live duplex streams and pub/sub queues'
      ],
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col justify-center items-center pt-20 pb-12 sm:pt-24 sm:pb-16 overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <Live2DWavesCanvas className="absolute inset-0 pointer-events-none opacity-80 z-0" waveCount={5} verticalBaseStart={0.35} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center my-auto w-full">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 shadow-xs mb-6">
              <Zap className="size-4 text-blue-500" /> Enterprise Software Engineering & Autonomous Systems
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.06] text-zinc-900 dark:text-white h-[210px] sm:h-[250px] lg:h-[270px] flex items-center justify-center text-center overflow-hidden"
          >
            <TypewriterHeading phrases={heroPhrases} pauseDuration={3500} typingSpeed={40} deletingSpeed={20} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 sm:mt-8 text-base sm:text-xl lg:text-2xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            We architect end-to-end full-stack web products, autonomous AI agent pipelines, and continuous maintenance retainers backed by <span className="font-extrabold text-zinc-900 dark:text-white">100% IP ownership</span> and <span className="font-extrabold text-zinc-900 dark:text-white">99.99% server SLA</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              onClick={() => navigate('/pricing')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs h-12 px-8 rounded-xl shadow-lg shadow-blue-600/20 active:scale-98"
            >
              View Maintenance & Pricing Plans →
            </Button>
            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              className="font-extrabold text-xs h-12 px-8 rounded-xl border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Start Project Consultation
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Featured AI Flagship: OpenStudio 2.0 (Subscription Based) ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white border border-zinc-800 relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/10 blur-[90px] pointer-events-none rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Featured AI Flagship
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="size-3" /> 6 Prompts Free Everyday
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
                OpenStudio 2.0: Build Full-Stack Apps from Natural Language
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6 font-normal">
                Now available as a developer-first subscription! Generate complete React and Next.js applications in seconds with real-time Sandpack browser execution, multi-file Monaco editing, and 1-click GitHub repository synchronization.
              </p>

              {/* Pricing & Benefit Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                  <div className="text-xs text-zinc-400 font-semibold">Free Tier</div>
                  <div className="text-lg font-black text-emerald-400">₹0 / mo</div>
                  <div className="text-[10px] text-zinc-400">6 prompts everyday</div>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-900/90 border border-blue-500/40">
                  <div className="text-xs text-blue-400 font-semibold">Standard</div>
                  <div className="text-lg font-black text-white">₹222 / mo</div>
                  <div className="text-[10px] text-zinc-400 line-through">₹1,649/mo</div>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-900/90 border border-purple-500/40">
                  <div className="text-xs text-purple-400 font-semibold">Pro Ultra</div>
                  <div className="text-lg font-black text-white">₹12,222 / mo</div>
                  <div className="text-[10px] text-zinc-400">1M Context • R1</div>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                  <div className="text-xs text-zinc-400 font-semibold">Code Rights</div>
                  <div className="text-lg font-black text-white">100% IP</div>
                  <div className="text-[10px] text-zinc-400">Export ZIP or GitHub</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/openstudio')}
                  className="h-11 px-6 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105"
                >
                  Explore OpenStudio <ArrowRight className="size-4" />
                </button>
                <button
                  onClick={() => navigate('/openstudio/pricing')}
                  className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-105"
                >
                  <Sparkles className="size-4" />
                  View Subscription Plans
                </button>
                <button
                  onClick={() => navigate('/ai')}
                  className="h-11 px-5 rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-all cursor-pointer"
                >
                  All AI Solutions
                </button>
              </div>
            </div>

            {/* Visual Terminal / Feature Summary Card */}
            <div className="w-full lg:w-96 rounded-2xl bg-black/80 border border-zinc-800 p-5 font-mono text-xs text-zinc-300 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full bg-red-500" />
                  <div className="size-2.5 rounded-full bg-amber-500" />
                  <div className="size-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] text-zinc-500">openstudio.opendev-labs.com</span>
              </div>
              <div className="space-y-2">
                <div className="text-zinc-500">// Initialize Workspace</div>
                <div className="text-blue-400">$ openstudio init --model gemini-2.5</div>
                <div className="text-emerald-400">✓ 6 daily free credits allocated</div>
                <div className="text-emerald-400">✓ Sandpack runtime container mounted</div>
                <div className="text-emerald-400">✓ Monaco AST code parser active</div>
                <div className="text-zinc-400 mt-2">// Ready for prompt compilation</div>
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-200">
                  &quot;Build a multi-tier SaaS billing dashboard with dark theme and Stripe checkout&quot;
                </div>
                <div className="text-cyan-400 font-bold">⚡ App generated in 1.4s</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Engineering Solution Pillars Grid */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">
            Engineering Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
            End-to-End Technical Solutions
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
            From greenfield SaaS products to autonomous AI agent systems and daily server bash automation, we engineer software for scale and zero-downtime performance.
          </p>
        </div>

        {/* Core Pillars - 3 cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutionPillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="hero-glass-card rounded-2xl p-6 flex flex-col justify-between border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 shadow-xs hover:shadow-lg relative group overflow-hidden"
              >
                <div>
                  {/* Top Icon & Subtitle Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-11 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-300">
                      <IconComponent className="size-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-extrabold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                      {pillar.subtitle}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal mb-4 min-h-[40px]">
                    {pillar.description}
                  </p>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {pillar.badges.slice(0, 4).map((badge, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold"
                      >
                        {badge}
                      </span>
                    ))}
                    {pillar.badges.length > 4 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
                        +{pillar.badges.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
                    {pillar.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <button
                    onClick={() => navigate('/pricing')}
                    className="w-full py-2.5 px-3 rounded-lg text-xs font-extrabold bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-200 dark:border-zinc-800"
                  >
                    <span>Configure Plan & Pricing</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Engagement Models Section - 3 cards per row */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">
              Flexible Engagement
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
              Choose Your Development Engagement Model
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
              Transparent options from autonomous AI generation to dedicated engineering retainers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Model 1: Autonomous AI Builder (OpenStudio) */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500/50 transition-all shadow-xs hover:shadow-md">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="size-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Sparkles className="size-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase border border-blue-200 dark:border-blue-800">
                    Self-Serve AI
                  </span>
                </div>

                <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-1.5">
                  OpenStudio Autonomous AI
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal mb-4 min-h-[40px]">
                  Build apps instantly with natural language prompts, in-browser Sandpack execution, and multi-file Monaco code editor.
                </p>
                
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    6 Free Prompts Everyday (₹0 Forever)
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    Standard Subscription from ₹222/mo
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    100% Code Ownership & ZIP Export
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    1-Click GitHub Repository Sync
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                <Button
                  onClick={() => navigate('/openstudio')}
                  className="flex-1 h-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold rounded-lg text-xs"
                >
                  Launch Studio
                </Button>
                <Button
                  onClick={() => navigate('/openstudio/pricing')}
                  variant="outline"
                  className="flex-1 h-10 text-xs font-bold rounded-lg border-zinc-300 dark:border-zinc-700"
                >
                  Pricing Plans
                </Button>
              </div>
            </div>

            {/* Model 2: One-Time Handover Build */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-xs hover:shadow-md">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="size-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Code2 className="size-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-[10px] font-extrabold uppercase">
                    One-Time Build
                  </span>
                </div>

                <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-1.5">
                  One-Time Handover Build
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal mb-4 min-h-[40px]">
                  Custom engineering delivered with production code, CI/CD scripts, and complete IP ownership. Ideal for standalone products.
                </p>
                
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    100% Source Code & Git Ownership
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    Automated Deployment & Build Scripts
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    30 Days Post-Launch Bug Warranty
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    Production Security & SSL Setup
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  onClick={() => navigate('/pricing')}
                  className="w-full h-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold rounded-lg text-xs"
                >
                  Get Build Quote →
                </Button>
              </div>
            </div>

            {/* Model 3: Continuous Maintenance Retainer (Flagship) */}
            <div className="rounded-2xl border-2 border-blue-600 dark:border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 p-6 flex flex-col justify-between relative shadow-lg">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                Flagship Retainer
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="size-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <RefreshCw className="size-5 animate-spin-slow" />
                  </div>
                  <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 font-mono bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    From $50 / ₹4,000 mo
                  </span>
                </div>

                <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-1.5">
                  Continuous Retainer
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal mb-4 min-h-[40px]">
                  Daily automated backups, 24/7 server health monitoring, zero-downtime patches, and priority developer availability.
                </p>

                <div className="pt-4 border-t border-blue-200/60 dark:border-blue-900/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    Automated Daily Database Snapshots
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    24/7 Server Uptime Monitoring
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    Zero-Downtime Hotfix Patches
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    Direct Developer Slack & WhatsApp
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-200/60 dark:border-blue-900/60">
                <Button
                  onClick={() => navigate('/pricing')}
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs shadow-md"
                >
                  Configure Retainer →
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Enterprise Security & Uptime Standards Banner */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold uppercase tracking-wider mb-4">
              <ShieldCheck className="size-4" /> Production Quality Standards
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Built with Enterprise Precision & Zero Vendor Lock-in
            </h3>
            <p className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
              Every system delivered by OpenDev-Labs comes with complete IP ownership, clear documentation, modular source code, and daily automated cloud snapshots. You maintain total control over your codebase and deployment environments.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-zinc-800">
              <div>
                <span className="text-2xl font-black text-blue-400 block">100%</span>
                <span className="text-[11px] font-semibold text-zinc-400">IP Code Ownership</span>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-400 block">99.99%</span>
                <span className="text-[11px] font-semibold text-zinc-400">Uptime SLA Target</span>
              </div>
              <div>
                <span className="text-2xl font-black text-amber-400 block">24/7</span>
                <span className="text-[11px] font-semibold text-zinc-400">Server Health Monitoring</span>
              </div>
              <div>
                <span className="text-2xl font-black text-purple-400 block">Daily</span>
                <span className="text-[11px] font-semibold text-zinc-400">Automated Backups</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full text-center">
        <div className="rounded-3xl bg-blue-50/30 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-8 sm:p-12">
          <h3 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white">
            Ready to Build Your Custom Software Solution?
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Get in touch with Lead Architect Yash Ramteke to discuss your project scope, select a retainer plan, or request a custom full-stack quote.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() => navigate('/pricing')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs h-12 px-8 rounded-xl shadow-md shadow-blue-600/20"
            >
              Explore Maintenance Pricing →
            </Button>
            <a
              href="https://wa.me/918169568582"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-md"
            >
              <span>WhatsApp Direct Inquiry</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SolutionsPage;
