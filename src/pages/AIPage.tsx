import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';
import { TypewriterHeading } from '../components/ui/TypewriterHeading';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Cpu,
  Layers,
  Code2,
  Terminal,
  Zap,
  ShieldCheck,
  ExternalLink,
  Laptop,
  CheckCircle2,
  Check,
  Search,
  ChevronRight,
  Database,
  Eye,
  Radio,
  Clock,
  Play
} from 'lucide-react';

const aiPhrases = [
  "OpenStudio: Build Full-Stack Apps from Natural Language",
  "LamaDB: Edge-Optimized Stateless Vector & Session Store",
  "Autonomous AI Systems Engineered for Production",
  "6 Free Daily Prompts Everyday on OpenStudio",
  "Zero Lock-in: 100% Code Ownership & Clean Handover"
];

interface AIProduct {
  id: string;
  name: string;
  category: 'App Builder' | 'Infrastructure';
  headline: string;
  description: string;
  status: 'Live Now' | 'Beta Preview' | 'Coming Soon';
  badgeColor: string;
  icon: React.ReactNode;
  tags: string[];
  primaryLink: string;
  primaryActionLabel: string;
  secondaryLink?: string;
  secondaryActionLabel?: string;
  featured?: boolean;
  highlightText?: string;
}

const aiProducts: AIProduct[] = [
  {
    id: 'openstudio',
    name: 'OpenStudio 2.0',
    category: 'App Builder',
    headline: 'Autonomous Full-Stack Web & Next.js App Builder',
    description: 'Transform high-level prompts into fully functional, production-ready React and Next.js applications. Features live Sandpack browser execution, multi-file Monaco editor, and 1-click GitHub repository deployments. Includes 6 free daily prompts!',
    status: 'Live Now',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    icon: <Sparkles className="size-6 text-blue-500" />,
    tags: ['React 19', 'Next.js 15', 'Gemini 2.5', 'Claude 3.7', 'Sandpack', 'GitHub Sync'],
    primaryLink: '/openstudio',
    primaryActionLabel: 'Explore OpenStudio',
    secondaryLink: '/openstudio/pricing',
    secondaryActionLabel: 'View Pricing & Plans',
    featured: true,
    highlightText: '6 Free Daily Prompts • Starts at ₹222/mo'
  },
  {
    id: 'lamadb',
    name: 'LamaDB Neural Storage',
    category: 'Infrastructure',
    headline: 'Edge-Optimized Stateless Vector & Session Store',
    description: 'Serverless, low-overhead session database and vector embedding cache designed for AI applications. Provides cross-subdomain sovereign session isolation and zero-cold-start profile materialization.',
    status: 'Live Now',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    icon: <Database className="size-6 text-sky-500" />,
    tags: ['Stateless Storage', 'Subdomain Sync', 'Vector Embeddings', 'Zero Cold Start'],
    primaryLink: '/solutions',
    primaryActionLabel: 'Learn More',
    highlightText: 'Powers OpenStudio Auth'
  }
];

export const AIPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'App Builder', 'Infrastructure'];

  const filteredProducts = aiProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      {/* ── 1. Header Navigation ── */}
      <Navbar />

      {/* ── 2. Hero Section (True full-screen 100dvh viewport height with full-bleed background image) ── */}
      <section className="min-h-screen min-h-[100dvh] w-full flex flex-col justify-between items-center pt-24 pb-8 sm:pt-28 sm:pb-12 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 hero-spotlight relative overflow-hidden transition-colors">
        {/* Subtle Folded Paper Background (Full Screen) */}
        <div className="absolute inset-0 w-full h-full bg-[url('/folded-paper-bg.png')] bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-30 pointer-events-none z-0" />

        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-400/10 blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 blur-3xl pointer-events-none z-0" />

        <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20 z-0" particleCount={30} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10 w-full flex flex-col justify-between items-center flex-1 h-full">
          <div className="my-auto pt-4 sm:pt-6 w-full flex flex-col items-center">
            {/* Beacon Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-6"
            >
              <span className="hero-pill-badge">
                <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
                OpenDev AI Suite • Next-Generation Sovereign Intelligence
              </span>
            </motion.div>

            {/* Typewriter Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 dark:text-white max-w-5xl mx-auto leading-[1.06] h-[190px] sm:h-[230px] lg:h-[260px] flex items-center justify-center text-center overflow-hidden"
            >
              <TypewriterHeading phrases={aiPhrases} pauseDuration={3500} typingSpeed={40} deletingSpeed={20} />
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-base sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-8 font-medium"
            >
              Explore our lineup of autonomous AI builders, self-healing developer agents, and sovereign enterprise orchestration engines.
            </motion.p>


          </div>
        </div>
      </section>

      {/* ── 3. Products Catalog Section ── */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search AI products & models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Products Grid - 2 Flagship AI Products: OpenStudio & LamaDB */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                product.featured
                  ? 'bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-blue-950/20 border-2 border-blue-500/50 shadow-md'
                  : 'bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs'
              }`}
            >
              {product.featured && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-xs">
                  Flagship Builder
                </div>
              )}

              <div>
                {/* Header: Icon, Category & Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="size-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-center shadow-xs">
                    {product.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${product.badgeColor}`}>
                      {product.status}
                    </span>
                  </div>
                </div>

                {/* Title & Headline */}
                <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white mb-1.5">
                  {product.name}
                </h3>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2.5 line-clamp-1">
                  {product.headline}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 min-h-[48px] line-clamp-3">
                  {product.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {product.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60"
                    >
                      {tag}
                    </span>
                  ))}
                  {product.tags.length > 4 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
                      +{product.tags.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons & Highlight Footer */}
              <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
                {product.highlightText && (
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                    {product.highlightText}
                  </span>
                )}

                <div className="flex items-center gap-2 w-full">
                  {product.secondaryLink && (
                    <Link
                      to={product.secondaryLink}
                      className="flex-1 py-2 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-[11px] font-bold text-zinc-900 dark:text-white transition-all text-center"
                    >
                      {product.secondaryActionLabel}
                    </Link>
                  )}
                  <Link
                    to={product.primaryLink}
                    className="flex-1 py-2 px-3 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-[11px] font-extrabold transition-all flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>{product.primaryActionLabel}</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 4. OpenStudio Feature Spotlight Banner ── */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl p-8 sm:p-12 bg-black text-white relative overflow-hidden shadow-2xl border border-zinc-800">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />

          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-blue-800">
              OpenStudio 2.0 Pricing Update
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Start Free with 6 Daily Prompts. Scale as You Build.
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Every verified member gets 6 free prompt generations daily. Need unlimited generation or ultra reasoning models? Upgrade to Standard at just ₹222/mo or Pro at ₹12,222/mo.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3.5">
              <Link
                to="/openstudio"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-white text-black font-extrabold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                Go to OpenStudio Landing <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/openstudio/pricing"
                className="w-full sm:w-auto px-7 py-3 rounded-full border border-zinc-700 bg-zinc-900 text-white font-semibold text-sm hover:bg-zinc-800 transition-all text-center"
              >
                View OpenStudio Pricing Tiers (₹222/mo)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Footer ── */}
      <Footer />
    </div>
  );
};

export default AIPage;
