import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  ExternalLink,
  CheckCircle2,
  Globe,
  CreditCard,
  Building2,
  Mail,
  Phone,
  Github,
  Layers,
  Bot,
  Terminal,
  Sparkles,
  Cpu,
  FlaskConical,
  Laptop
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';
import { MiniDesktopPreview } from '../components/ui/MiniDesktopPreview';

import { TypewriterHeading } from '../components/ui/TypewriterHeading';
import { cn } from '../lib/utils';

const landingPhrases = [
  "Engineering High-Performance Web Applications",
  "Tailored Software Development & Custom Handover Builds",
  "Reliable Monthly Retainers Starting at ₹3,000–₹4,000/mo",
  "Daily Automated Backups & 24/7 Server Health Monitoring",
  "Full Intellectual Property Ownership & Clean Source Code",
  "Trusted by Fast-Growing Startups & Leading Enterprises"
];

interface ShowcaseProject {
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

const showcaseProjects: ShowcaseProject[] = [
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

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<'all' | 'production' | 'experimental'>('all');

  const filteredProjects = activeCategory === 'all'
    ? showcaseProjects
    : showcaseProjects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
      {/* 1. Header Navigation (Shared Navbar with top-right Dark Mode Toggle) */}
      <Navbar />

      {/* 2. Hero Section (Fits 100dvh screen cleanly - Text top-centered, CTA buttons pinned to bottom of viewport) */}
      <section className="min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col justify-between items-center pt-16 pb-4 sm:pt-20 sm:pb-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 relative overflow-hidden transition-colors">
        {/* Hero Background Image (Folded Paper) */}
        <div className="absolute inset-0 bg-[url('/folded-paper-bg.png')] bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-30 pointer-events-none z-0" />

        {/* Subtle corner ambient accents matching wave color palette */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/5 dark:bg-blue-400/10 blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-indigo-500/5 dark:bg-indigo-400/10 blur-3xl pointer-events-none z-0" />

        <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20 z-0" particleCount={30} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10 w-full flex flex-col justify-between items-center flex-1 h-full">
          
          {/* Top & Middle Section: Badge + Dynamic Typewriter Heading */}
          <div className="my-auto pt-2 sm:pt-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-6"
            >
              <span className="px-4 py-1.5 rounded-full bg-zinc-100/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 shadow-xs">
                Trusted by fast-growing startups and enterprises
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 sm:mt-10 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 dark:text-white max-w-5xl mx-auto leading-[1.06] min-h-[140px] sm:min-h-[180px] flex items-center justify-center"
            >
              <TypewriterHeading phrases={landingPhrases} pauseDuration={3500} typingSpeed={40} deletingSpeed={20} />
            </motion.h1>
          </div>

          {/* Bottom Section: Shifted Subtitle + Bottom Pinned CTA Buttons */}
          <div className="w-full mt-auto pt-4 pb-2 sm:pb-4 flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Flexible development models tailored to your business: choose a{' '}
              <span className="text-zinc-900 dark:text-white font-extrabold">One-Time Handover Build</span> or a{' '}
              <span className="text-zinc-900 dark:text-white font-extrabold">Monthly Retainer starting at ₹3,000–₹4,000/mo</span> for continuous maintenance and daily backups.
            </motion.p>

            {/* Action Buttons (Pinned to bottom of initial screen before scrolling) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <button
                onClick={() => navigate('/solutions')}
                className="w-full sm:w-auto h-12 sm:h-13 px-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold text-base hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
              >
                Explore Solutions <ArrowRight className="size-4" />
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full sm:w-auto h-12 sm:h-13 px-8 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-900 dark:text-white font-extrabold text-base hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-xs cursor-pointer"
              >
                Explore Plans & Pricing
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2.5 Professional Software Projects & Experimental Labs Showcase Section */}
      <section className="py-16 sm:py-20 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Professional Header & Subtitle */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-block px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-3 border border-blue-500/20">
              DEPLOYED SYSTEMS & EXPERIMENTAL LABS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Featured Projects & Live Production Builds
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl mx-auto">
              Explore high-performance web applications, interactive web terminal IDEs, neural AI engines, and experimental software systems engineered by OpenDev-Labs.
            </p>

            {/* Interactive Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
              <button
                onClick={() => setActiveCategory('all')}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer",
                  activeCategory === 'all'
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-md"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
                )}
              >
                All Projects ({showcaseProjects.length})
              </button>
              <button
                onClick={() => setActiveCategory('production')}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer",
                  activeCategory === 'production'
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50"
                )}
              >
                Production Builds ({showcaseProjects.filter(p => p.category === 'production').length})
              </button>
              <button
                onClick={() => setActiveCategory('experimental')}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer",
                  activeCategory === 'experimental'
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50"
                )}
              >
                Experimental Labs ({showcaseProjects.filter(p => p.category === 'experimental').length})
              </button>
            </div>
          </div>

          {/* 11 Live Desktop Miniature Screen Preview Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10">
            {filteredProjects.map((project) => (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "group block rounded-xl border border-zinc-300 dark:border-zinc-800 bg-[#09090b] overflow-hidden transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-1 relative",
                  project.badgeColor
                )}
              >
                {/* Miniature Screen Live Desktop Preview Container */}
                <MiniDesktopPreview
                  url={project.url}
                  title={`${project.name} Live Miniature Preview`}
                  fallbackImg={project.fallbackImg}
                />

                {/* Card Footer Info */}
                <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 border-t border-zinc-200 dark:border-zinc-800 relative z-20 bg-white dark:bg-[#09090b]">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {project.logoImg ? (
                      <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={project.logoImg}
                          alt={project.name}
                          className="w-full h-full object-contain dark:invert"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="size-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 flex items-center justify-center shrink-0 font-extrabold text-xs font-mono text-blue-500">
                        {project.name.charAt(0)}
                      </div>
                    )}

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="size-1.5 bg-emerald-500 animate-pulse rounded-full shrink-0" />
                        <span className="font-mono font-bold text-xs text-zinc-900 dark:text-white truncate group-hover:text-blue-500 transition-colors">
                          {project.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                        {project.displayUrl}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {project.categoryLabel}
                    </span>
                    <ExternalLink className="size-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Solutions Overview Section */}
      <section className="py-24 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3 border border-blue-500/20">
              Software Delivery Options
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Two Modern Ways to Build Your Product
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm">
              We offer simple transparent pricing models so you get exactly what your project needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Card 1: One Time Handover */}
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-sm">
              <div>
                <div className="size-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center mb-6 font-bold">
                  <Code2 className="size-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white">One-Time Handover Build</h3>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                  We build your full web application or software system from scratch, complete with automated deployment scripts, source code, and full IP ownership handover.
                </p>

                <div className="mt-6 space-y-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                    <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                    Complete Git repository & source code ownership
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                    <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                    Production-ready infrastructure configuration
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                    <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                    30 days of post-launch bug warranty included
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  onClick={() => navigate('/solutions')}
                  variant="outline"
                  className="w-full h-11 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-extrabold rounded-xl"
                >
                  Learn About One-Time Builds →
                </Button>
              </div>
            </div>

            {/* Card 2: Monthly Retainer */}
            <div className="rounded-3xl border-2 border-blue-600 dark:border-blue-500 bg-white dark:bg-zinc-900 p-8 flex flex-col justify-between shadow-lg relative">
              <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                Recommended
              </div>

              <div>
                <div className="size-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 font-bold">
                  <Layers className="size-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                  Monthly Retainer <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">₹3,000–₹4,000/mo</span>
                </h3>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                  Ideal for ongoing operations. Includes continuous feature updates, daily automated database backups, priority bug fixes, and 24/7 server monitoring.
                </p>

                <div className="mt-6 space-y-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                    <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    Automated daily database & media backups
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                    <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    Continuous uptime monitoring & security patches
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                    <CheckCircle2 className="size-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    Dedicated developer hours allocated every month
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  onClick={() => navigate('/solutions')}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl"
                >
                  Explore Retainer Plans →
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Bash Automation Highlight Banner */}
      <section className="py-20 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
              <Terminal className="size-3.5" /> Bash Automation & Shell Scripting Mastery
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Autonomous Shell Automation by Yash Ramteke
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              We build production-grade POSIX bash automation scripts, self-healing server cron jobs, and high-frequency Linux infrastructure pipelines.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                onClick={() => navigate('/automation')}
                className="h-11 px-6 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs rounded-xl flex items-center gap-2"
              >
                Launch Automation Suite <Terminal className="size-4" />
              </Button>
              <a
                href="/iamyashramteke/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-6 border border-zinc-700 text-white hover:bg-zinc-900 font-extrabold text-xs rounded-xl inline-flex items-center gap-1.5"
              >
                Yash Ramteke Portfolio <ExternalLink className="size-3.5 text-zinc-400" />
              </a>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 font-mono text-xs w-full sm:w-80 shadow-2xl text-zinc-300">
              <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-800 pb-2 mb-3">
                <span>opendev-labs-cli</span>
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-amber-400">$ agentbash sync --cluster</p>
              <p className="text-zinc-400 text-[11px] mt-1">[✓] System health verified</p>
              <p className="text-zinc-400 text-[11px]">[✓] 11 projects synced</p>
              <p className="text-emerald-400 font-bold text-[11px] mt-2">Ready! Status: 100% OK</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact CTA */}
      <section className="py-24 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-3 border border-zinc-200 dark:border-zinc-700">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            Need Custom Web Application & Automation Engineering?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs max-w-xl mx-auto mb-8 font-medium">
            Work directly with Yash Shirish Ramteke & OpenDev-Labs.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 text-xs font-mono">
            <a
              href="mailto:opendev.office@gmail.com"
              className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center gap-2 hover:border-blue-600 transition-colors shadow-xs"
            >
              <Mail className="size-6 text-zinc-900 dark:text-white" />
              <span className="font-bold text-zinc-900 dark:text-white">Work Mail</span>
              <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">opendev.office@gmail.com</span>
            </a>

            <a
              href="tel:8169568582"
              className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center gap-2 hover:border-blue-600 transition-colors shadow-xs"
            >
              <Phone className="size-6 text-zinc-900 dark:text-white" />
              <span className="font-bold text-zinc-900 dark:text-white">Phone / WhatsApp</span>
              <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">+91 81695 68582</span>
            </a>

            <a
              href="https://github.com/opendev-labs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center gap-2 hover:border-blue-600 transition-colors shadow-xs"
            >
              <Github className="size-6 text-zinc-900 dark:text-white" />
              <span className="font-bold text-zinc-900 dark:text-white">GitHub Org</span>
              <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">github.com/opendev-labs</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. Shared Footer */}
      <Footer />
    </div>
  );
};
