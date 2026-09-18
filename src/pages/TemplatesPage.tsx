import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Maximize2,
  Smartphone,
  Tablet,
  Monitor,
  X,
  ArrowRight,
  ShieldCheck,
  Tag,
  Search,
  Github,
  Zap,
  Globe,
  Database,
  Wrench,
  Percent,
  Info,
  Check,
  Sliders,
  Layers,
  Sparkle
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { MiniDesktopPreview } from '../components/ui/MiniDesktopPreview';
import { Live2DWavesCanvas } from '../components/ui/Live2DWavesCanvas';
import { TypewriterHeading } from '../components/ui/TypewriterHeading';
import { cn } from '../lib/utils';
import catalogData from '../data/catalog.json';
import { showcaseProjects } from '../data/showcaseProjects';

const templatePhrases = [
  "Curated Web Starters & Vercel Systems",
  "Production-Ready Full-Stack Architectures",
  "Handcrafted E-Commerce & Portfolio Starters",
  "100% White-Labeled & Custom-Tailored Sites"
];

export interface WebsiteTemplate {
  id: string;
  name: string;
  tagline: string;
  category: 'Vercel & Next.js' | 'Beauty & Lifestyle' | 'Food & Hospitality' | 'E-Commerce' | 'Agency & Business' | 'Portfolio & Creative';
  oneTimePrice: string;
  monthlyRetainer: string;
  previewUrl: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
  badge?: string;
  repository?: string;
}

export const websiteTemplates: WebsiteTemplate[] = catalogData as WebsiteTemplate[];

// Helper functions for dynamic pricing calculation
export function parsePrice(priceStr: string): number {
  const clean = priceStr.replace(/[^0-9]/g, '');
  return parseInt(clean, 10) || 0;
}

export function formatPrice(val: number): string {
  return `₹${val.toLocaleString('en-IN')}`;
}

export interface PricingCalculation {
  baseOneTime: number;
  baseRetainer: number;
  finalOneTime: number;
  finalRetainer: number;
  finalOneTimeFormatted: string;
  finalRetainerFormatted: string;
  baseOneTimeFormatted: string;
  baseRetainerFormatted: string;
  discountPercentage: number;
  retainerDiscountPercentage: number;
  isDiscounted: boolean;
  label: string;
}

export function calculateTemplatePricing(
  oneTimePriceStr: string,
  monthlyRetainerStr: string,
  hasDomain: boolean,
  hasDatabase: boolean
): PricingCalculation {
  const baseOneTime = parsePrice(oneTimePriceStr);
  const baseRetainer = parsePrice(monthlyRetainerStr);

  let finalOneTime = baseOneTime;
  let finalRetainer = baseRetainer;
  let discountPercentage = 0;
  let retainerDiscountPercentage = 0;
  let label = 'Full Package (Custom Domain + Managed Database)';

  if (hasDomain && hasDatabase) {
    finalOneTime = baseOneTime;
    finalRetainer = baseRetainer;
    label = 'Standard (Custom Domain + Managed Database)';
  } else if (hasDomain && !hasDatabase) {
    // Without Database: 30% off one-time build
    finalOneTime = Math.round(baseOneTime * 0.70);
    discountPercentage = 30;
    label = '-30% Off (No Managed Database)';
  } else if (!hasDomain && hasDatabase) {
    // Without Domain: 40% off one-time build
    finalOneTime = Math.round(baseOneTime * 0.60);
    discountPercentage = 40;
    label = '-40% Off (No Custom Domain)';
  } else {
    // Without Domain & Without Database: 50% off one-time build, 20% off monthly retainer
    finalOneTime = Math.round(baseOneTime * 0.50);
    discountPercentage = 50;
    finalRetainer = Math.round(baseRetainer * 0.80);
    retainerDiscountPercentage = 20;
    label = '-50% Off Build & -20% Off Retainer (GitHub/Vercel Free Subdomain)';
  }

  return {
    baseOneTime,
    baseRetainer,
    finalOneTime,
    finalRetainer,
    finalOneTimeFormatted: formatPrice(finalOneTime),
    finalRetainerFormatted: `${formatPrice(finalRetainer)}/mo`,
    baseOneTimeFormatted: formatPrice(baseOneTime),
    baseRetainerFormatted: `${formatPrice(baseRetainer)}/mo`,
    discountPercentage,
    retainerDiscountPercentage,
    isDiscounted: discountPercentage > 0 || retainerDiscountPercentage > 0,
    label
  };
}

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewingTemplate, setPreviewingTemplate] = useState<WebsiteTemplate | null>(null);
  const [deviceFrame, setDeviceFrame] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [bookingTemplate, setBookingTemplate] = useState<WebsiteTemplate | null>(null);
  const [projectCategory, setProjectCategory] = useState<'all' | 'production' | 'experimental'>('all');

  // Configurator Toggles (Global Defaults)
  const [globalHasDomain, setGlobalHasDomain] = useState<boolean>(true);
  const [globalHasDatabase, setGlobalHasDatabase] = useState<boolean>(true);

  // Modal Specific Configurator State
  const [modalHasDomain, setModalHasDomain] = useState<boolean>(true);
  const [modalHasDatabase, setModalHasDatabase] = useState<boolean>(true);

  const filteredShowcaseProjects = projectCategory === 'all'
    ? showcaseProjects
    : showcaseProjects.filter(p => p.category === projectCategory);

  const categories = [
    'All',
    'Vercel & Next.js',
    'Beauty & Lifestyle',
    'Food & Hospitality',
    'E-Commerce',
    'Agency & Business',
    'Portfolio & Creative'
  ];

  const filteredTemplates = websiteTemplates.filter((template) => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openBookingModal = (template: WebsiteTemplate) => {
    setModalHasDomain(globalHasDomain);
    setModalHasDatabase(globalHasDatabase);
    setBookingTemplate(template);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
      {/* 1. Shared Top Header Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col justify-center items-center pt-20 pb-12 sm:pt-24 sm:pb-16 overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <Live2DWavesCanvas className="absolute inset-0 pointer-events-none opacity-80 z-0" waveCount={5} verticalBaseStart={0.35} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center my-auto w-full">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="hero-pill-badge mb-4 sm:mb-6">
              <Sparkles className="size-3.5 text-blue-500" /> Production-Ready Web Starters & Vercel Architectures
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.06] text-zinc-900 dark:text-white h-[210px] sm:h-[250px] lg:h-[270px] flex items-center justify-center text-center overflow-hidden"
          >
            <TypewriterHeading phrases={templatePhrases} pauseDuration={3500} typingSpeed={40} deletingSpeed={20} />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 sm:mt-8 text-base sm:text-xl lg:text-2xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            All systems listed are baseline architectural starters. OpenDev-Labs fully <span className="font-extrabold text-blue-600 dark:text-blue-400">revamps, white-labels, and custom tailors</span> every design, logo, content, and integration for your brand.
          </motion.p>

          {/* Value Props Pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>Full Custom White-Labeling</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>Full Source Code Ownership</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>Zero-Downtime Hostinger / Vercel Cloud</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2.5 Prominent White-Label & Tailoring Notice Banner */}
      <section className="bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20 border-b border-blue-500/20 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Wrench className="size-5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center justify-center sm:justify-start gap-2">
                <span>100% White-Labeled & Custom Tailored</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] font-bold">REVAMP INCLUDED</span>
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-0.5">
                These are foundational starters. We revamp the layout, color palette, logo, images, database, and content to fit your exact business goals.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900 px-3.5 py-1.5 rounded-full border border-blue-500/30 shadow-xs inline-flex items-center gap-1.5">
              <Zap className="size-3.5" /> Rapid 48-Hour Turnaround
            </span>
          </div>
        </div>
      </section>

      {/* 3. Global Dynamic Pricing Configurator Bar */}
      <section className="py-6 px-4 sm:px-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          
          {/* Configurator Toggles */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex-1">
            <div className="flex items-center gap-2 font-extrabold text-xs text-zinc-900 dark:text-white uppercase tracking-wider shrink-0 pr-2 border-r border-zinc-200 dark:border-zinc-800">
              <Sliders className="size-4 text-blue-500" />
              <span>Pricing Options:</span>
            </div>

            {/* Domain Toggle */}
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Globe className="size-3.5 text-blue-400" /> Custom Domain:
              </span>
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={() => setGlobalHasDomain(true)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    globalHasDomain
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  Included
                </button>
                <button
                  onClick={() => setGlobalHasDomain(false)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1",
                    !globalHasDomain
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  No Domain <span className="text-[10px] opacity-90">(-40%)</span>
                </button>
              </div>
            </div>

            {/* Database Toggle */}
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto sm:ml-4">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Database className="size-3.5 text-emerald-400" /> Managed Database:
              </span>
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={() => setGlobalHasDatabase(true)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    globalHasDatabase
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  Included
                </button>
                <button
                  onClick={() => setGlobalHasDatabase(false)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1",
                    !globalHasDatabase
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  No Database <span className="text-[10px] opacity-90">(-30%)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Configuration Discount Badge */}
          <div className="flex items-center gap-3 bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl shrink-0">
            <Percent className="size-5 text-blue-500 shrink-0" />
            <div className="text-xs font-medium">
              {!globalHasDomain && !globalHasDatabase ? (
                <div>
                  <span className="font-extrabold text-amber-500 dark:amber-400 block text-sm">50% OFF One-Time & 20% OFF Retainer</span>
                  <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">Free Hosting on GitHub Pages / Vercel Subdomain</span>
                </div>
              ) : !globalHasDomain ? (
                <div>
                  <span className="font-extrabold text-amber-500 dark:amber-400 block text-sm">40% OFF One-Time Build</span>
                  <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">Client uses own domain or Vercel subdomain</span>
                </div>
              ) : !globalHasDatabase ? (
                <div>
                  <span className="font-extrabold text-amber-500 dark:amber-400 block text-sm">30% OFF One-Time Build</span>
                  <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">Static site without custom database setup</span>
                </div>
              ) : (
                <div>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block text-sm">Full Premium Turnkey Package</span>
                  <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">Includes Custom Domain + Managed Database</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 3.5 Search & Category Filter Bar */}
      <section className="py-4 px-4 sm:px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer",
                  selectedCategory === cat
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-md"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="size-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search website starters..."
              className="w-full h-10 pl-9 pr-4 text-xs rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>
      </section>

      {/* 4. Templates Cards Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTemplates.map((template) => {
            const pricing = calculateTemplatePricing(
              template.oneTimePrice,
              template.monthlyRetainer,
              globalHasDomain,
              globalHasDatabase
            );

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="hero-glass-card hover:border-zinc-300 dark:hover:border-zinc-700/80 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* Live Scaled Desktop Miniature Preview */}
                  <div className="relative border-b border-zinc-200 dark:border-zinc-800">
                    <MiniDesktopPreview
                      url={template.previewUrl}
                      title={`${template.name} Live Preview`}
                    />

                    {/* Overlay Badge */}
                    <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-amber-400 text-[11px] font-bold border border-amber-500/30 flex items-center gap-1.5 shadow-lg">
                        <Tag className="size-3" /> {template.badge || template.category}
                      </span>

                      {pricing.isDiscounted && (
                        <span className="px-3 py-1 rounded-full bg-emerald-950/90 backdrop-blur-md text-emerald-400 text-[11px] font-extrabold border border-emerald-500/40 flex items-center gap-1 shadow-lg">
                          <Percent className="size-3" /> {pricing.discountPercentage}% OFF
                        </span>
                      )}
                    </div>

                    {/* Live Hover Overlay Button */}
                    <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-30 backdrop-blur-[2px]">
                      <button
                        onClick={() => setPreviewingTemplate(template)}
                        className="px-5 py-2.5 rounded-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-extrabold text-xs flex items-center gap-2 border border-zinc-300 dark:border-zinc-700 shadow-xl hover:scale-105 transition-all cursor-pointer"
                      >
                        <Maximize2 className="size-4 text-blue-600" /> Interactive Full Preview
                      </button>
                      <a
                        href={template.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs flex items-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer"
                      >
                        <ExternalLink className="size-4" /> Open Direct Page
                      </a>
                    </div>
                  </div>

                  {/* Card Content & Features */}
                  <div className="p-6">
                    {/* Pricing Banner */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-zinc-100 dark:border-zinc-800">
                      <div>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                          {template.name}
                        </h3>
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                          {template.tagline}
                        </p>
                      </div>

                      <div className="text-right">
                        {pricing.isDiscounted ? (
                          <div>
                            <div className="text-xs text-zinc-400 line-through font-mono">
                              {pricing.baseOneTimeFormatted}
                            </div>
                            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                              {pricing.finalOneTimeFormatted}
                            </div>
                            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                              + {pricing.finalRetainerFormatted} retainer
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-xl font-extrabold text-zinc-900 dark:text-white font-mono">
                              {pricing.finalOneTimeFormatted}
                            </div>
                            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                              + {pricing.finalRetainerFormatted} retainer
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {template.description}
                    </p>

                    {/* Configuration Active Summary Badge */}
                    <div className="mt-4 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                        <Sliders className="size-3 text-blue-500" /> Active Config:
                      </span>
                      <span className={cn(
                        "font-mono px-2 py-0.5 rounded-md",
                        pricing.isDiscounted ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                      )}>
                        {pricing.label}
                      </span>
                    </div>

                    {/* Highlights Bullet Points */}
                    <div className="mt-5 space-y-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 font-mono">
                        Key Interactive Features
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {template.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                            <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Footer */}
                <div className="p-6 pt-0 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => setPreviewingTemplate(template)}
                    className="w-full sm:flex-1 py-3 px-5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Maximize2 className="size-4 text-blue-500" /> Full Screen Preview
                  </button>
                  <button
                    onClick={() => openBookingModal(template)}
                    className="w-full sm:flex-1 py-3 px-5 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    Get This Website ({pricing.finalOneTimeFormatted}) <ArrowRight className="size-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4.5 Deployed Systems & Experimental Labs Showcase Section */}
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
                className="hero-glass-card hover:border-blue-500/50 group flex flex-col justify-between transition-all duration-300 hover:shadow-2xl overflow-hidden"
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

      {/* 5. Interactive Full Screen Preview Modal */}
      <AnimatePresence>
        {previewingTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col"
          >
            {/* Modal Top Control Bar */}
            <div className="h-16 border-b border-zinc-800 px-4 sm:px-6 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                  {previewingTemplate.category}
                </span>
                <h3 className="text-base font-extrabold text-white hidden sm:block">
                  {previewingTemplate.name}
                </h3>
              </div>

              {/* Viewport Device Frame Switcher */}
              <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-full border border-zinc-800">
                <button
                  onClick={() => setDeviceFrame('desktop')}
                  className={cn(
                    "p-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                    deviceFrame === 'desktop' ? "bg-black dark:bg-white text-white dark:text-black shadow-xs" : "text-zinc-400 hover:text-white"
                  )}
                  title="Desktop View"
                >
                  <Monitor className="size-4" />
                  <span className="hidden md:inline">Desktop</span>
                </button>
                <button
                  onClick={() => setDeviceFrame('tablet')}
                  className={cn(
                    "p-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                    deviceFrame === 'tablet' ? "bg-black dark:bg-white text-white dark:text-black shadow-xs" : "text-zinc-400 hover:text-white"
                  )}
                  title="Tablet View"
                >
                  <Tablet className="size-4" />
                  <span className="hidden md:inline">Tablet</span>
                </button>
                <button
                  onClick={() => setDeviceFrame('mobile')}
                  className={cn(
                    "p-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                    deviceFrame === 'mobile' ? "bg-black dark:bg-white text-white dark:text-black shadow-xs" : "text-zinc-400 hover:text-white"
                  )}
                  title="Mobile View"
                >
                  <Smartphone className="size-4" />
                  <span className="hidden md:inline">Mobile</span>
                </button>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-3">
                <a
                  href={previewingTemplate.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-300 border border-zinc-700"
                >
                  Open Direct Tab <ExternalLink className="size-3.5" />
                </a>
                <button
                  onClick={() => setPreviewingTemplate(null)}
                  className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
                  aria-label="Close Preview"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Iframe Viewport Container */}
            <div className="flex-1 bg-zinc-900/80 p-4 flex items-center justify-center overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-300 overflow-hidden bg-white shadow-2xl relative border border-zinc-800",
                  deviceFrame === 'desktop' && "w-full rounded-none",
                  deviceFrame === 'tablet' && "w-[768px] max-w-full rounded-2xl border-8 border-zinc-800",
                  deviceFrame === 'mobile' && "w-[395px] max-w-full rounded-3xl border-8 border-zinc-800"
                )}
              >
                <iframe
                  src={previewingTemplate.previewUrl}
                  title={`${previewingTemplate.name} Live View`}
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Order / Request Website Booking Modal */}
      <AnimatePresence>
        {bookingTemplate && (() => {
          const modalPricing = calculateTemplatePricing(
            bookingTemplate.oneTimePrice,
            bookingTemplate.monthlyRetainer,
            modalHasDomain,
            modalHasDatabase
          );

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-zinc-900 max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative my-8"
              >
                <button
                  onClick={() => setBookingTemplate(null)}
                  className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  <X className="size-6" />
                </button>

                <div className="mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                    Website Setup Request
                  </span>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-2">
                    {bookingTemplate.name}
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                    100% Custom White-Labeled & Revamped to Your Brand
                  </p>
                </div>

                {/* Modal Configurator Toggles */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 mb-6 space-y-3">
                  <span className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider block font-mono">
                    Select Packaging Options:
                  </span>

                  {/* Domain Toggle */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Globe className="size-4 text-blue-400" /> Custom Domain Name:
                    </span>
                    <div className="flex items-center bg-zinc-200 dark:bg-zinc-900 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setModalHasDomain(true)}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer",
                          modalHasDomain ? "bg-blue-600 text-white" : "text-zinc-500"
                        )}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalHasDomain(false)}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer",
                          !modalHasDomain ? "bg-amber-600 text-white" : "text-zinc-500"
                        )}
                      >
                        No (-40%)
                      </button>
                    </div>
                  </div>

                  {/* Database Toggle */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Database className="size-4 text-emerald-400" /> Managed Database:
                    </span>
                    <div className="flex items-center bg-zinc-200 dark:bg-zinc-900 p-1 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setModalHasDatabase(true)}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer",
                          modalHasDatabase ? "bg-emerald-600 text-white" : "text-zinc-500"
                        )}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalHasDatabase(false)}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer",
                          !modalHasDatabase ? "bg-amber-600 text-white" : "text-zinc-500"
                        )}
                      >
                        No (-30%)
                      </button>
                    </div>
                  </div>

                  {/* Pricing Breakdown inside Modal */}
                  <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">Estimated Build Price</span>
                      {modalPricing.isDiscounted && (
                        <span className="text-xs text-zinc-400 line-through font-mono mr-2">
                          {modalPricing.baseOneTimeFormatted}
                        </span>
                      )}
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {modalPricing.finalOneTimeFormatted}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">Monthly Maintenance</span>
                      <span className="text-xs font-bold text-zinc-900 dark:text-white font-mono">
                        {modalPricing.finalRetainerFormatted}
                      </span>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert(`Thank you! Your website setup request for ${bookingTemplate.name} (${modalPricing.finalOneTimeFormatted} build + ${modalPricing.finalRetainerFormatted} retainer) has been received. Our team will contact you within 4 hours.`);
                    setBookingTemplate(null);
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">Your Name / Business Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Studio / Business"
                      className="w-full h-11 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">Email Address or Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. contact@example.com / +91 81695 68582"
                      className="w-full h-11 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">Domain Name (If available)</label>
                    <input
                      type="text"
                      placeholder={modalHasDomain ? "e.g. mybusiness.com" : "Optional (GitHub/Vercel Subdomain provided)"}
                      className="w-full h-11 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">Customization & Branding Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Describe your logo, colors, services, or special requests..."
                      className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      Submit Setup Request ({modalPricing.finalOneTimeFormatted})
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* 7. Shared Footer */}
      <Footer />
    </div>
  );
};

export default TemplatesPage;
