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
import { FrameworkMarquee } from '../components/ui/FrameworkMarquee';

import { TypewriterHeading } from '../components/ui/TypewriterHeading';
import { cn } from '../lib/utils';
import { showcaseProjects } from '../data/showcaseProjects';

const landingPhrases = [
  "Engineering High-Performance Web Applications",
  "Tailored Software Development & Custom Handover Builds",
  "Reliable Monthly Retainers Starting at ₹3,000–₹4,000/mo",
  "Daily Automated Backups & 24/7 Server Health Monitoring",
  "Full Intellectual Property Ownership & Clean Source Code",
  "Trusted by Fast-Growing Startups & Leading Enterprises"
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [projectCategory, setProjectCategory] = useState<'all' | 'production' | 'experimental'>('all');

  const filteredShowcaseProjects = projectCategory === 'all'
    ? showcaseProjects
    : showcaseProjects.filter(p => p.category === projectCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
      {/* 1. Header Navigation (Shared Navbar with top-right Dark Mode Toggle) */}
      <Navbar />

      {/* 2. Hero Section (Fits 100dvh screen cleanly - Text top-centered, CTA buttons pinned to bottom of viewport) */}
      <section className="min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col justify-between items-center pt-16 pb-4 sm:pt-20 sm:pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 hero-spotlight relative overflow-hidden transition-colors">
        {/* Hero Background Image (Folded Paper) */}
        <div className="absolute inset-0 bg-[url('/folded-paper-bg.png')] bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-30 pointer-events-none z-0" />

        {/* Subtle corner ambient accents matching wave color palette */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/5 dark:bg-blue-400/10 blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-indigo-500/5 dark:bg-indigo-400/10 blur-3xl pointer-events-none z-0" />

        <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20 z-0" particleCount={30} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10 w-full flex flex-col justify-between items-center flex-1 h-full">
          
          {/* Top & Middle Section: Badge + Dynamic Typewriter Heading + Action Buttons */}
          <div className="my-auto pt-2 sm:pt-4 w-full flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-6"
            >
              <span className="hero-pill-badge">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Trusted by fast-growing startups and enterprises
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-2 sm:mt-4 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 dark:text-white max-w-5xl mx-auto leading-[1.06] h-[210px] sm:h-[250px] lg:h-[270px] flex items-center justify-center text-center overflow-hidden"
            >
              <TypewriterHeading phrases={landingPhrases} pauseDuration={3500} typingSpeed={40} deletingSpeed={20} />
            </motion.h1>

            {/* Action Buttons (Immediately below typewriter heading) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mt-4"
            >
              <button
                onClick={() => navigate('/solutions')}
                className="w-full sm:w-auto h-12 sm:h-13 px-8 rounded-full bg-black dark:bg-white text-white dark:text-black font-extrabold text-base hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
              >
                Explore Solutions <ArrowRight className="size-4" />
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full sm:w-auto h-12 sm:h-13 px-8 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-900 dark:text-white font-extrabold text-base hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-sm cursor-pointer hover:scale-105"
              >
                Explore Plans & Pricing
              </button>
            </motion.div>
          </div>

          {/* Bottom Section: 2-Row Framework Marquee + Subtitle Paragraph below Marquee */}
          <div className="w-full mt-auto pt-2 pb-2 sm:pb-4 flex flex-col items-center">
            {/* Frameworks & Tech Stack Animated Moving Marquee */}
            <FrameworkMarquee />

            {/* Subtitle paragraph (Moved below 2-row icon animation) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-3 text-xs sm:text-sm lg:text-base text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Flexible development models tailored to your business: choose a{' '}
              <span className="text-zinc-900 dark:text-white font-extrabold">One-Time Handover Build</span> or a{' '}
              <span className="text-zinc-900 dark:text-white font-extrabold">Monthly Retainer starting at ₹3,000–₹4,000/mo</span> for continuous maintenance and daily backups.
            </motion.p>
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

      {/* 3.5 Featured Projects & Live Production Builds Section */}
      <section className="py-16 sm:py-20 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Professional Header & Subtitle */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-block px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-3 border border-blue-500/20 font-sans">
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
                onClick={() => setProjectCategory('all')}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer",
                  projectCategory === 'all'
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-md"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
                )}
              >
                All Projects ({showcaseProjects.length})
              </button>
              <button
                onClick={() => setProjectCategory('production')}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer",
                  projectCategory === 'production'
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50"
                )}
              >
                Production Builds ({showcaseProjects.filter(p => p.category === 'production').length})
              </button>
              <button
                onClick={() => setProjectCategory('experimental')}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer",
                  projectCategory === 'experimental'
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50"
                )}
              >
                Experimental Labs ({showcaseProjects.filter(p => p.category === 'experimental').length})
              </button>
            </div>
          </div>

          {/* Live Desktop Miniature Screen Preview Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10">
            {filteredShowcaseProjects.map((project) => (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="hero-glass-card hover:border-blue-500/50 group flex flex-col justify-between transition-all duration-300 hover:shadow-2xl overflow-hidden rounded-2xl"
              >
                <div>
                  <div className="relative border-b border-zinc-200 dark:border-zinc-800">
                    <MiniDesktopPreview
                      url={project.url}
                      title={project.name}
                    />

                    <div className="absolute top-3 left-3 z-20">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border shadow-md",
                        project.category === 'production'
                          ? "bg-blue-950/80 text-blue-400 border-blue-500/30"
                          : "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                      )}>
                        {project.categoryLabel}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30 backdrop-blur-[2px]">
                      <span className="px-4 py-2 rounded-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-extrabold text-xs flex items-center gap-2 shadow-xl">
                        Open Project <ExternalLink className="size-3.5" />
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors flex items-center justify-between">
                      <span>{project.name}</span>
                      <ExternalLink className="size-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1">
                      {project.displayUrl}
                    </p>
                  </div>
                </div>
              </a>
            ))}
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

          <div className="grid sm:grid-cols-3 gap-4 text-xs font-sans">
            <a
              href="mailto:opendev.office@gmail.com"
              className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center gap-2 hover:border-blue-600 transition-colors shadow-xs group"
            >
              <Mail className="size-6 text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors" />
              <span className="font-extrabold text-zinc-900 dark:text-white text-sm">Work Mail</span>
              <span className="text-zinc-600 dark:text-zinc-400 font-medium text-xs">opendev.office@gmail.com</span>
            </a>

            <a
              href="https://wa.me/918169568582"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center gap-2 hover:border-emerald-600 transition-colors shadow-xs group"
            >
              <Phone className="size-6 text-zinc-900 dark:text-white group-hover:text-emerald-600 transition-colors" />
              <span className="font-extrabold text-zinc-900 dark:text-white text-sm">Phone / WhatsApp</span>
              <span className="text-zinc-600 dark:text-zinc-400 font-medium text-xs">+91 81695 68582</span>
            </a>

            <a
              href="https://github.com/opendev-labs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center gap-2 hover:border-purple-600 transition-colors shadow-xs group"
            >
              <Github className="size-6 text-zinc-900 dark:text-white group-hover:text-purple-600 transition-colors" />
              <span className="font-extrabold text-zinc-900 dark:text-white text-sm">GitHub Org</span>
              <span className="text-zinc-600 dark:text-zinc-400 font-medium text-xs">github.com/opendev-labs</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. Shared Footer */}
      <Footer />
    </div>
  );
};
