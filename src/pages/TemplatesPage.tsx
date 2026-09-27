import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Sparkle,
  ChevronDown,
  ChevronUp,
  Mail
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { MiniDesktopPreview } from '../components/ui/MiniDesktopPreview';
import { Live2DWavesCanvas } from '../components/ui/Live2DWavesCanvas';
import { TypewriterHeading } from '../components/ui/TypewriterHeading';
import { cn } from '../lib/utils';
import catalogData from '../data/catalog.json';
import {
  SupportedCurrency,
  SUPPORTED_CURRENCIES,
  convertFromINR,
  formatCurrencyPrice
} from '../lib/payment/currencies';
import { getPublishedTemplates, PublishedTemplate } from '../lib/templateStorageService';

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

export function formatPrice(val: number, currency: SupportedCurrency = 'USD'): string {
  const converted = convertFromINR(val, currency);
  return formatCurrencyPrice(converted, currency);
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
  hasDatabase: boolean,
  currency: SupportedCurrency = 'USD'
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
    finalOneTimeFormatted: formatPrice(finalOneTime, currency),
    finalRetainerFormatted: `${formatPrice(finalRetainer, currency)}/mo`,
    baseOneTimeFormatted: formatPrice(baseOneTime, currency),
    baseRetainerFormatted: `${formatPrice(baseRetainer, currency)}/mo`,
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
  // Configurator Toggles & Currency (Global Defaults)
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [globalHasDomain, setGlobalHasDomain] = useState<boolean>(true);
  const [globalHasDatabase, setGlobalHasDatabase] = useState<boolean>(true);

  // Modal Specific Configurator State
  const [modalHasDomain, setModalHasDomain] = useState<boolean>(true);
  const [modalHasDatabase, setModalHasDatabase] = useState<boolean>(true);
  const [isUseCaseOpen, setIsUseCaseOpen] = useState<boolean>(true);
  const [isPricingOptionsOpen, setIsPricingOptionsOpen] = useState<boolean>(true);

  const [openstudioTemplates, setOpenstudioTemplates] = useState<PublishedTemplate[]>(() => getPublishedTemplates());

  React.useEffect(() => {
    const handleUpdate = () => {
      setOpenstudioTemplates(getPublishedTemplates());
    };
    window.addEventListener('openstudio-template-published', handleUpdate);
    window.addEventListener('openstudio-template-deleted', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('openstudio-template-published', handleUpdate);
      window.removeEventListener('openstudio-template-deleted', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const combinedTemplates: WebsiteTemplate[] = React.useMemo(() => {
    const osFormatted = openstudioTemplates.map(t => ({
      id: t.id,
      name: t.name,
      tagline: t.tagline,
      category: t.category,
      oneTimePrice: '₹0 (Free / Open)',
      monthlyRetainer: '₹0 / mo',
      previewUrl: t.previewUrl,
      description: t.description,
      features: t.features,
      isFeatured: true,
      badge: 'OpenStudio AI',
      platform: 'openstudio',
    } as unknown as WebsiteTemplate));

    return [...osFormatted, ...websiteTemplates];
  }, [openstudioTemplates]);

  const useCases = [
    { id: 'All', label: 'All Templates' },
    { id: 'OpenStudio AI', label: '✨ Built in OpenStudio' },
    { id: 'AI & Machine Learning', label: 'AI' },
    { id: 'Vercel & Next.js', label: 'Vercel & Next.js' },
    { id: 'E-Commerce', label: 'E-Commerce' },
    { id: 'Food & Hospitality', label: 'Food & Hospitality' },
    { id: 'Beauty & Lifestyle', label: 'Beauty & Lifestyle' },
    { id: 'Portfolio & Creative', label: 'Portfolio' },
    { id: 'Agency & Business', label: 'Agency & Business' }
  ];

  const filteredTemplates = combinedTemplates.filter((template) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'OpenStudio AI'
        ? template.badge === 'OpenStudio AI' || (template as any).platform === 'openstudio'
        : template.category === selectedCategory);
    const matchesSearch =
      searchQuery.trim() === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.features && template.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const sidebarRef = React.useRef<HTMLElement>(null);
  const [sidebarStickyTop, setSidebarStickyTop] = useState<number>(80);
  const [fullFooterOpen, setFullFooterOpen] = useState<boolean>(false);

  // Dynamic sticky calculation:
  // When scrolling down, the left sidebar moves with the page until the Turnkey Starter
  // packaging card reaches directly above the sticky bottom footer bar (height 56px + 16px padding).
  // At that exact position, the left sidebar stops itself, leaving the footer right below it,
  // while the right-hand template preview cards scroll continuously behind the footer.
  React.useEffect(() => {
    const updateStickyTop = () => {
      if (!sidebarRef.current) return;
      const sidebarHeight = sidebarRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const FOOTER_BAR_HEIGHT = 56;
      const targetTop = Math.min(80, windowHeight - sidebarHeight - FOOTER_BAR_HEIGHT - 16);
      setSidebarStickyTop(targetTop);
    };

    updateStickyTop();
    window.addEventListener('resize', updateStickyTop);

    const resizeObserver = new ResizeObserver(() => {
      updateStickyTop();
    });
    if (sidebarRef.current) {
      resizeObserver.observe(sidebarRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateStickyTop);
      resizeObserver.disconnect();
    };
  }, [isUseCaseOpen, isPricingOptionsOpen]);

  const openBookingModal = (template: WebsiteTemplate) => {
    setModalHasDomain(globalHasDomain);
    setModalHasDatabase(globalHasDatabase);
    setBookingTemplate(template);
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col transition-colors duration-200 relative">
      
      {/* 1. Shared Top Header Navbar */}
      <Navbar />

      {/* 2. Main Marketplace Split Layout: Left Fixed Sidebar + Right Independent Scrollable Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 lg:pt-20 pb-16 lg:pb-16 flex flex-col lg:flex-row items-start gap-8 lg:gap-10 lg:overflow-hidden relative z-10">
        
        {/* Left Sidebar: Filter Templates & Packaging (Locked in View, NEVER leaves the screen) */}
        <aside
          ref={sidebarRef}
          className="w-full lg:w-64 shrink-0 lg:h-[calc(100vh-9rem)] lg:overflow-y-auto no-scrollbar space-y-6 flex flex-col justify-between self-start"
        >
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
              Filter Templates
            </h2>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Collapsible Section: Use Case */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setIsUseCaseOpen(!isUseCaseOpen)}
              className="w-full flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <span>Use Case</span>
              {isUseCaseOpen ? (
                <ChevronUp className="size-3.5 text-zinc-400 dark:text-zinc-500" />
              ) : (
                <ChevronDown className="size-3.5 text-zinc-400 dark:text-zinc-500" />
              )}
            </button>

            {isUseCaseOpen && (
              <div className="space-y-1 pl-0.5">
                {useCases.map((uc) => {
                  const isSelected = selectedCategory === uc.id;
                  const count = uc.id === 'All'
                    ? combinedTemplates.length
                    : uc.id === 'OpenStudio AI'
                    ? combinedTemplates.filter(t => t.badge === 'OpenStudio AI' || (t as any).platform === 'openstudio').length
                    : combinedTemplates.filter(t => t.category === uc.id).length;

                  return (
                    <button
                      key={uc.id}
                      type="button"
                      onClick={() => setSelectedCategory(isSelected ? 'All' : uc.id)}
                      className={cn(
                        "w-full flex items-center justify-between py-2 px-2.5 rounded-lg text-xs font-medium transition-all group text-left cursor-pointer",
                        isSelected
                          ? "bg-blue-50 dark:bg-zinc-800/80 text-blue-700 dark:text-white font-semibold shadow-xs border border-blue-200/60 dark:border-zinc-700/60"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/50"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={cn(
                          "size-4 rounded-md border transition-colors flex items-center justify-center shrink-0",
                          isSelected
                            ? "bg-blue-600 dark:bg-white border-blue-600 dark:border-white text-white dark:text-black"
                            : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 group-hover:border-zinc-400"
                        )}>
                          {isSelected && <Check className="size-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{uc.label}</span>
                      </div>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono ml-2">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Collapsible Section: Architecture & Pricing */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <button
              type="button"
              onClick={() => setIsPricingOptionsOpen(!isPricingOptionsOpen)}
              className="w-full flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <span>Pricing & Packaging</span>
              {isPricingOptionsOpen ? (
                <ChevronUp className="size-3.5 text-zinc-400 dark:text-zinc-500" />
              ) : (
                <ChevronDown className="size-3.5 text-zinc-400 dark:text-zinc-500" />
              )}
            </button>

            {isPricingOptionsOpen && (
              <div className="space-y-4">
                {/* Domain Switch */}
                <div>
                  <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block mb-1.5 flex items-center gap-1.5">
                    <Globe className="size-3.5 text-blue-500" /> Custom Domain
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setGlobalHasDomain(true)}
                      className={cn(
                        "py-1.5 rounded-lg transition-all cursor-pointer text-center",
                        globalHasDomain ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-bold" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      )}
                    >
                      Included
                    </button>
                    <button
                      type="button"
                      onClick={() => setGlobalHasDomain(false)}
                      className={cn(
                        "py-1.5 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1",
                        !globalHasDomain ? "bg-amber-500 dark:bg-amber-600 text-white shadow-xs font-bold" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      )}
                    >
                      <span>No Domain</span>
                      <span className="text-[9px] opacity-90">(-40%)</span>
                    </button>
                  </div>
                </div>

                {/* Database Switch */}
                <div>
                  <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block mb-1.5 flex items-center gap-1.5">
                    <Database className="size-3.5 text-emerald-500" /> Managed Database
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setGlobalHasDatabase(true)}
                      className={cn(
                        "py-1.5 rounded-lg transition-all cursor-pointer text-center",
                        globalHasDatabase ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs font-bold" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      )}
                    >
                      Included
                    </button>
                    <button
                      type="button"
                      onClick={() => setGlobalHasDatabase(false)}
                      className={cn(
                        "py-1.5 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1",
                        !globalHasDatabase ? "bg-amber-500 dark:bg-amber-600 text-white shadow-xs font-bold" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      )}
                    >
                      <span>No DB</span>
                      <span className="text-[9px] opacity-90">(-30%)</span>
                    </button>
                  </div>
                </div>

                {/* Multi-Currency Selector */}
                <div>
                  <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block mb-1.5 flex items-center gap-1.5">
                    <Globe className="size-3.5 text-blue-500" /> Currency
                  </span>
                  <div className="grid grid-cols-4 gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold mb-2">
                    {(['USD', 'INR', 'EUR', 'GBP'] as SupportedCurrency[]).map((cCode) => (
                      <button
                        key={cCode}
                        type="button"
                        onClick={() => setCurrency(cCode)}
                        className={cn(
                          "py-1 rounded-lg transition-all cursor-pointer text-center text-xs font-bold",
                          currency === cCode ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        )}
                      >
                        {cCode}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                      aria-label="Select Payment Currency"
                      className="w-full appearance-none bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold text-xs pl-3 pr-8 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                    >
                      {SUPPORTED_CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium">
                          {c.flag} {c.code} ({c.symbol.trim()}) - {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="size-3.5 text-zinc-400 dark:text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Package Status Banner */}
                <div className={cn(
                  "p-3 rounded-xl border text-[11px] font-medium leading-relaxed transition-all",
                  globalHasDomain && globalHasDatabase
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                    : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300"
                )}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Percent className="size-3.5" />
                    <span>
                      {globalHasDomain && globalHasDatabase
                        ? "Full Turnkey Starter"
                        : !globalHasDomain && !globalHasDatabase
                        ? "50% OFF Build & 20% OFF Retainer"
                        : !globalHasDomain
                        ? "40% OFF Build (No Domain)"
                        : "30% OFF Build (No Database)"}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">
                    100% white-label revamp included. 48-hr deployment turnaround.
                  </span>
                </div>
              </div>
            )}
          </div>

        </aside>

        {/* Right Main Column: Templates Grid (Independent Scroll Container) */}
        <main className="flex-1 w-full min-w-0 lg:h-[calc(100vh-9rem)] lg:overflow-y-auto pr-1 pb-28 relative">
          
          {/* Header & Search Bar (inside the right scrolling column) */}
          <div className="relative pt-1 pb-6 overflow-hidden">
            <Live2DWavesCanvas className="absolute inset-0 pointer-events-none opacity-40 z-0" waveCount={3} verticalBaseStart={0.25} />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="relative z-10"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200/80 dark:border-blue-800/60 shadow-xs">
                  <Sparkles className="size-3.5" />
                  Verified Turnkey Solutions
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
                Find your Template
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl font-normal leading-relaxed">
                Jumpstart your app development process with pre-built solutions from OpenDev-Labs and our community.
              </p>

              {/* Full-width Search Bar */}
              <div className="mt-4 relative w-full">
                <Search className="size-4.5 text-zinc-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full h-11 pl-12 pr-12 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/90 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors cursor-pointer"
                    aria-label="Clear Search"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Subheader bar above grid */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                {filteredTemplates.length} {filteredTemplates.length === 1 ? 'Template' : 'Templates'}
              </span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                  {selectedCategory}
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('All')}
                    className="hover:text-red-500 ml-0.5 cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <Zap className="size-3.5 text-blue-500" />
              <span>Rapid 48-Hour Turnaround</span>
            </div>
          </div>

          {/* Cards Grid (HeroUI PRO Clean Aesthetic) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredTemplates.map((template) => {
              const pricing = calculateTemplatePricing(
                template.oneTimePrice,
                template.monthlyRetainer,
                globalHasDomain,
                globalHasDatabase,
                currency
              );

              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-0.5"
                >
                  {/* Top: Title & Description */}
                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {template.name}
                      </h3>
                      {template.badge && (
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold border border-zinc-200 dark:border-zinc-700 shrink-0">
                          {template.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed min-h-[34px]">
                      {template.description || template.tagline}
                    </p>
                  </div>

                  {/* Middle: Clean Preview Mockup Window */}
                  <div className="relative border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                    <MiniDesktopPreview
                      url={template.previewUrl}
                      title={`${template.name} Live Preview`}
                    />

                    {/* Live Hover Overlay */}
                    <div className="absolute inset-0 bg-zinc-900/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-30 backdrop-blur-xs">
                      <button
                        type="button"
                        onClick={() => setPreviewingTemplate(template)}
                        className="px-3.5 py-1.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold text-[11px] flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer"
                      >
                        <Maximize2 className="size-3.5" /> Preview
                      </button>
                      <a
                        href={template.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-extrabold text-[11px] flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-700 shadow-md hover:scale-105 transition-all cursor-pointer"
                      >
                        <ExternalLink className="size-3.5" /> Open
                      </a>
                    </div>
                  </div>

                  {/* Bottom: Pricing & CTA */}
                  <div className="p-5 pt-3.5">
                    <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-zinc-100 dark:border-zinc-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block">
                          One-Time Build
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          {pricing.isDiscounted && (
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 line-through font-mono">
                              {pricing.baseOneTimeFormatted}
                            </span>
                          )}
                          <span className="text-base font-black text-zinc-900 dark:text-white font-mono">
                            {pricing.finalOneTimeFormatted}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block">
                          Monthly Retainer
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          {pricing.finalRetainerFormatted}
                        </span>
                      </div>
                    </div>

                    {(template as any).platform === 'openstudio' ? (
                      <button
                        type="button"
                        onClick={() => navigate('/openstudio')}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00f2fe] to-cyan-500 hover:from-cyan-400 hover:to-cyan-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-98"
                      >
                        <span>🚀 Open in OpenStudio</span>
                        <ArrowRight className="size-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openBookingModal(template)}
                        className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-98"
                      >
                        <span>Deploy / Request Setup</span>
                        <ArrowRight className="size-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="p-16 text-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 my-8">
              <Search className="size-8 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No templates found</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                No templates matched your search for "{searchQuery}". Try searching for something else or reset your filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}

        </main>
      </div>

      {/* 5. Interactive Full Screen Preview Modal */}
      <AnimatePresence>
        {previewingTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xl flex flex-col"
          >
            {/* Modal Top Control Bar */}
            <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between bg-white dark:bg-zinc-950">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800/60">
                  {previewingTemplate.category}
                </span>
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-white hidden sm:block">
                  {previewingTemplate.name}
                </h3>
              </div>

              {/* Viewport Device Frame Switcher */}
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-full border border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={() => setDeviceFrame('desktop')}
                  className={cn(
                    "p-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                    deviceFrame === 'desktop' ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
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
                    deviceFrame === 'tablet' ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
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
                    deviceFrame === 'mobile' ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
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
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                >
                  Open Direct Tab <ExternalLink className="size-3.5" />
                </a>
                <button
                  onClick={() => setPreviewingTemplate(null)}
                  className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-white transition-colors cursor-pointer"
                  aria-label="Close Preview"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Iframe Viewport Container */}
            <div className="flex-1 bg-zinc-100 dark:bg-zinc-900/80 p-4 flex items-center justify-center overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-300 overflow-hidden bg-white shadow-2xl relative border border-zinc-200 dark:border-zinc-800",
                  deviceFrame === 'desktop' && "w-full rounded-none",
                  deviceFrame === 'tablet' && "w-[768px] max-w-full rounded-2xl border-8 border-zinc-300 dark:border-zinc-800",
                  deviceFrame === 'mobile' && "w-[395px] max-w-full rounded-3xl border-8 border-zinc-300 dark:border-zinc-800"
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
            modalHasDatabase,
            currency
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

      {/* 6.5 Faded Invisible Bottom Zone above Footer (strictly over the preview cards) */}
      <div className="fixed bottom-14 left-0 right-0 pointer-events-none z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex">
          {/* Spacer matching left sidebar width + gap so left sidebar is completely un-faded */}
          <div className="hidden lg:block w-64 shrink-0 lg:mr-10" />

          {/* Fade overlay strictly covering the right preview column */}
          <div className="flex-1 w-full h-28 bg-gradient-to-t from-white via-white/85 to-transparent dark:from-zinc-950 dark:via-zinc-950/85 dark:to-transparent" />
        </div>
      </div>

      {/* 7. Sticky Bottom Footer Bar with Frosted Glass Backdrop & Expandable Full Directory */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-200/90 dark:border-zinc-800/90 transition-all duration-300 shadow-[0_-8px_30px_-5px_rgba(0,0,0,0.08)]">
        {/* Expandable Full Directory Drawer */}
        <AnimatePresence>
          {fullFooterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-b border-zinc-200 dark:border-zinc-800 max-h-[60vh] overflow-y-auto bg-white/95 dark:bg-zinc-950/95"
            >
              <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
                <Footer />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Docked Footer Bar */}
        <div className="max-w-7xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between text-xs font-medium">
          {/* Left: Brand Identity, Status & Copyright */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/logo-icon.webp"
                alt="OpenDev-Labs"
                className="h-6 w-auto object-contain transition-transform group-hover:scale-105"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <span className="font-extrabold text-sm tracking-tight text-zinc-900 dark:text-white">
                opendev<span className="text-blue-600 dark:text-blue-400">-labs</span>
              </span>
            </Link>
            <span className="hidden md:inline text-zinc-300 dark:text-zinc-700">•</span>
            <span className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              100% Uptime
            </span>
            <span className="hidden lg:inline text-zinc-400 dark:text-zinc-500 text-[11px]">
              © 2026 OpenDev-Labs LLC
            </span>
          </div>

          {/* Right: Quick Links & Directory Drawer Toggle */}
          <div className="flex items-center gap-3 sm:gap-6 text-zinc-600 dark:text-zinc-400 text-[11px] font-semibold">
            <Link to="/solutions" className="hover:text-blue-600 dark:hover:text-white transition-colors hidden sm:inline">
              Solutions
            </Link>
            <Link to="/pricing" className="hover:text-blue-600 dark:hover:text-white transition-colors hidden sm:inline">
              Pricing
            </Link>
            <Link to="/ai" className="hover:text-blue-600 dark:hover:text-white transition-colors hidden md:inline">
              AI Studio
            </Link>
            <a
              href="mailto:opendev.office@gmail.com"
              className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <Mail className="size-3.5 text-blue-500" />
              <span className="hidden sm:inline">opendev.office@gmail.com</span>
              <span className="sm:hidden">Contact</span>
            </a>

            {/* Toggle Full Footer Directory */}
            <button
              type="button"
              onClick={() => setFullFooterOpen(!fullFooterOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-[11px] font-bold border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
            >
              <span>{fullFooterOpen ? "Hide Directory" : "Directory"}</span>
              {fullFooterOpen ? (
                <ChevronDown className="size-3" />
              ) : (
                <ChevronUp className="size-3" />
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplatesPage;
