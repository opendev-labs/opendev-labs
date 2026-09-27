import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Info,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  QrCode,
  Copy,
  Check,
  X,
  Globe,
  ChevronDown,
  ExternalLink,
  Laptop,
  CheckCircle2,
  Cpu,
  Terminal,
  HelpCircle
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Live2DWavesCanvas } from '../components/ui/Live2DWavesCanvas';
import { useAuth } from '../context/AuthContext';
import { createHandoffUrl, getOpenStudioUrl } from '../lib/authSession';
import { openRazorpayCheckout } from '../lib/payment/razorpay';
import { SupportedCurrency, SUPPORTED_CURRENCIES, convertFromUSD, formatCurrencyPrice } from '../lib/payment/currencies';
import { EnterpriseAppointmentSection } from '../components/pricing/EnterpriseAppointmentSection';
import { EnterpriseAppointmentModal } from '../components/pricing/EnterpriseAppointmentModal';
import { TypewriterHeading } from '../components/ui/TypewriterHeading';

const openstudioPricingPhrases = [
  "Start Free with 6 Prompts Everyday",
  "Standard Plan at Just ₹222 / month",
  "Enterprise AI Custom Solutions & WhatsApp Consultation",
  "Autonomous Full-Stack React & Next.js Generation",
  "100% Code Ownership & Instant GitHub Repository Sync",
  "Zero Hidden Fees or Surprise Quota Lockouts"
];

interface OpenStudioPlan {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  description: string;
  inrMonthly: number;
  originalInrMonthly?: number;
  inrAnnual: number;
  originalInrAnnual?: number;
  isCustomPrice?: boolean;
  credits: string;
  creditsTooltip: string;
  buttonVariant: 'outline' | 'black' | 'blue';
  badge?: string;
  pillTag?: string;
  highlightBorder?: boolean;
  features: string[];
}

export const OpenStudioPricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [currency, setCurrency] = useState<SupportedCurrency>('INR');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const openStudioPlans: OpenStudioPlan[] = [
    {
      id: 'free',
      name: 'Free Starter',
      shortName: 'Free',
      subtitle: 'Essential Daily Prompt Quota',
      description: 'Get started with essential prompt generations at zero cost. Perfect for exploring capabilities and small tests.',
      inrMonthly: 0,
      inrAnnual: 0,
      credits: '6 Prompts Everyday • Resets Daily',
      creditsTooltip: 'Every verified user receives 6 free AI prompt generations every 24 hours. Resets at midnight UTC.',
      buttonVariant: 'outline',
      badge: 'Free Forever',
      highlightBorder: false,
      features: [
        'Strictly 6 free prompts everyday (24h reset)',
        'React 19 & Next.js 15 Sandpack live browser sandbox',
        'Multi-file Monaco code editor with live syntax checking',
        'Gemini 2.5 Flash & Claude 3.5 Haiku baseline models',
        '1-Click full source code export to ZIP archive',
        'Community Discord & standard documentation support'
      ]
    },
    {
      id: 'standard',
      name: 'Standard Builder',
      shortName: 'Standard',
      subtitle: 'For Creators & Indie Developers',
      description: 'Unlimited prompt generations, faster inference queues, and direct 1-click GitHub repository deployments.',
      inrMonthly: 222,
      originalInrMonthly: 1649,
      inrAnnual: 2222,
      originalInrAnnual: 19788,
      credits: 'Unlimited Prompts • Claude 3.7 & Gemini 2.5',
      creditsTooltip: 'Unlimited generations without daily quota limits. Powered by Claude 3.7 Sonnet & Gemini 2.5 Pro.',
      buttonVariant: 'black',
      badge: 'Popular',
      highlightBorder: false,
      features: [
        'Unlimited prompt generations with zero daily throttles',
        'Access to Claude 3.7 Sonnet & Gemini 2.5 Pro models',
        'Direct 1-Click GitHub Repository synchronization',
        'Multi-page component routing & Tailwind live preview',
        'Export to Vercel & Netlify automated build pipelines',
        'Save ₹442 / year on annual billing'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise AI Suite',
      shortName: 'Enterprise',
      subtitle: 'High-Scale Teams & Custom AI Infra',
      description: 'Dedicated cloud sandboxes, custom LLM fine-tuning, private VPC runners, zero-queue priority & tailored SLA.',
      inrMonthly: 0,
      inrAnnual: 0,
      isCustomPrice: true,
      credits: 'Custom AI Models + Private Sandboxes + 99.99% SLA',
      creditsTooltip: 'Dedicated compute cluster, isolated Sandpack runners, fine-tuned DeepSeek / Claude models, and custom enterprise SLA.',
      buttonVariant: 'blue',
      badge: 'Custom Scope',
      pillTag: 'Enterprise AI',
      highlightBorder: true,
      features: [
        'Dedicated isolated cloud sandboxes & custom VPC runner',
        'Custom fine-tuned reasoning models & DeepSeek R1',
        'LamaDB persistent stateless session vector cache',
        'Unlimited team seat licensing with Enterprise SSO/RBAC',
        '99.99% Uptime Guarantee with SLA compliance',
        'Direct Lead Architect access & WhatsApp @opendev.labs hotline'
      ]
    }
  ];

  const handleSelectPlan = (plan: OpenStudioPlan) => {
    if (plan.isCustomPrice) {
      setShowAppointmentModal(true);
      return;
    }

    if (plan.id === 'free') {
      const freeUrl = getOpenStudioUrl('', 'plan=free');
      if (!user) {
        navigate(`/auth?redirect=${encodeURIComponent(freeUrl)}&plan=free`);
      } else {
        const handoff = createHandoffUrl(freeUrl, user);
        window.location.href = handoff;
      }
      return;
    }

    const planUrl = getOpenStudioUrl('', `plan=${plan.id}`);
    if (!user) {
      navigate(`/auth?redirect=${encodeURIComponent(planUrl)}&plan=${plan.id}`);
      return;
    }

    const isMonthly = billingCycle === 'monthly';
    const amountINR = isMonthly ? plan.inrMonthly : plan.inrAnnual;

    if (currency === 'INR') {
      openRazorpayCheckout({
        amount: Math.round(amountINR * 1.10), // 10% gateway fee
        currency: 'INR',
        name: user?.name || 'OpenStudio Developer',
        email: user?.email || 'client@opendev-labs.com',
        description: `OpenStudio 2.0 ${plan.name} (${billingCycle.toUpperCase()})`,
        onSuccess: () => {
          const successUrl = getOpenStudioUrl('', `plan=${plan.id}&payment=success`);
          const handoff = createHandoffUrl(successUrl, user);
          window.location.href = handoff;
        }
      });
    } else {
      // Convert INR base to USD approx (1 USD = ~85 INR)
      const usdBase = Math.round(amountINR / 85);
      const converted = convertFromUSD(usdBase, currency);
      const withFee = Math.round(converted * 1.10);

      openRazorpayCheckout({
        amount: withFee,
        currency: currency,
        name: user?.name || 'OpenStudio Developer',
        email: user?.email || 'client@opendev-labs.com',
        description: `OpenStudio 2.0 ${plan.name} (${billingCycle.toUpperCase()})`,
        onSuccess: () => {
          const successUrl = getOpenStudioUrl('', `plan=${plan.id}&payment=success`);
          const handoff = createHandoffUrl(successUrl, user);
          window.location.href = handoff;
        }
      });
    }
  };

  // Helper to format plan price in selected currency
  const formatPlanPrice = (inrPrice: number) => {
    if (inrPrice === 0) return currency === 'INR' ? '₹0' : '$0';
    if (currency === 'INR') {
      return `₹${inrPrice.toLocaleString('en-IN')}`;
    }
    const usd = Math.max(1, Math.round(inrPrice / 85));
    const converted = convertFromUSD(usd, currency);
    return formatCurrencyPrice(converted, currency);
  };

  const getSavingsBadgeText = () => {
    if (currency === 'INR') {
      return 'Save up to ₹24,444/yr';
    }
    return 'Save up to $280/yr';
  };

  const faqs = [
    {
      q: 'How does the Free tier 6 prompt quota work?',
      a: 'Every verified user gets 6 free prompt generations every 24 hours. The quota resets automatically at midnight UTC. Free users can write prompts, inspect live React and Next.js applications in Sandpack, and export complete source code to ZIP files at any time.'
    },
    {
      q: 'What is included in the ₹222/month Standard Plan?',
      a: 'The Standard Plan removes all daily prompt limits, granting unlimited prompt generations with top-tier AI models including Claude 3.7 Sonnet and Gemini 2.5 Pro. It also enables 1-click GitHub repository synchronization.'
    },
    {
      q: 'Do I own the source code built with OpenStudio?',
      a: 'Yes, 100%. OpenDev-Labs adheres strictly to sovereign code ownership. You can export complete clean Git codebases, component libraries, and configuration files with zero vendor lock-in.'
    },
    {
      q: 'Can I pay directly via UPI without any gateway surcharge?',
      a: 'Yes! Click "Pay Direct via Zero-Fee UPI" to scan our official business QR code or send payment directly to opendev.office@gmail.com / 8169568582@upi. Your account will be activated instantly upon verification.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-900 relative transition-colors duration-200">
      
      {/* ── 1. Top Navbar ── */}
      <Navbar />

      {/* ── 2. Hero Header with Live2D Wave Animation ── */}
      <section className="relative min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col justify-center items-center pt-20 pb-12 sm:pt-24 sm:pb-16 overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <Live2DWavesCanvas className="absolute inset-0 pointer-events-none opacity-50 z-0" waveCount={4} verticalBaseStart={0.35} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center my-auto w-full">
          <span className="inline-block px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 sm:mb-6 shadow-xs">
            OpenStudio 2.0 • Autonomous App Builder & Subscriptions
          </span>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 dark:text-white max-w-5xl mx-auto leading-[1.06] h-[210px] sm:h-[250px] lg:h-[270px] flex items-center justify-center text-center overflow-hidden">
            <TypewriterHeading phrases={openstudioPricingPhrases} pauseDuration={3500} typingSpeed={40} deletingSpeed={20} />
          </h1>

          <p className="mt-6 sm:mt-8 text-base sm:text-xl lg:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto font-medium leading-relaxed">
            Start free with 6 prompt generations everyday. Upgrade to Standard at ₹222/mo for unlimited generation, or book an Enterprise appointment for custom cloud sandboxes, dedicated SLA, and private AI infrastructure.
          </p>
        </div>
      </section>

      {/* ── 3. Main Pricing Container ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12">
        
        {/* Top Billing Cycle & Multi-Currency Controls (Identical to RunwayPricing) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          
          {/* Monthly vs Annual Toggle Switcher */}
          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annually')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'annually'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase">
                {getSavingsBadgeText()}
              </span>
            </button>
          </div>

          {/* Currency Selector (INR default) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400">
              <Globe className="size-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Currency:</span>
            </div>

            {/* Quick Pill Toggles */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold">
              {(['INR', 'USD', 'EUR', 'GBP'] as SupportedCurrency[]).map((cCode) => (
                <button
                  key={cCode}
                  onClick={() => setCurrency(cCode)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    currency === cCode
                      ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs'
                      : 'text-zinc-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {cCode}
                </button>
              ))}
            </div>

            {/* Full Dropdown for all Supported Currencies */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                aria-label="Select Payment Currency"
                className="appearance-none bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-extrabold text-xs pl-3 pr-8 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium">
                    {c.flag} {c.code} ({c.symbol.trim()}) - {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="size-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* ── Cards Grid (3-Card Layout styled exactly like RunwayPricing) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch max-w-6xl mx-auto">
          {openStudioPlans.map((plan) => {
            const isMonthly = billingCycle === 'monthly';
            const price = isMonthly ? plan.inrMonthly : plan.inrAnnual;
            const originalPrice = isMonthly ? plan.originalInrMonthly : plan.originalInrAnnual;

            const priceDisplay = formatPlanPrice(price);
            const originalPriceDisplay = originalPrice ? formatPlanPrice(originalPrice) : null;
            const periodSuffix = isMonthly ? '/month' : '/year';

            const inrSavings = (plan.inrMonthly * 12) - plan.inrAnnual;
            const savingsDisplay = inrSavings > 0 ? formatPlanPrice(inrSavings) : null;

            const retainerDisplay = isMonthly
              ? (price === 0 ? 'Free forever • 6 prompts/day' : `Billed ${priceDisplay} / month`)
              : (price === 0 ? 'Free forever • 6 prompts/day' : `Billed ${priceDisplay} / year${savingsDisplay ? ` • Save ${savingsDisplay}` : ''}`);

            const buttonText = plan.isCustomPrice
              ? 'Book an Appointment →'
              : plan.id === 'free'
              ? 'Try OpenStudio Free'
              : `Select ${plan.shortName} (${priceDisplay}/${isMonthly ? 'mo' : 'yr'})`;

            return (
              <div
                key={plan.id}
                className={`hero-glass-card rounded-2xl flex flex-col justify-between text-zinc-900 dark:text-zinc-100 transition-all duration-300 relative h-full hover:z-30 ${
                  plan.highlightBorder
                    ? 'border-2 border-blue-600 dark:border-blue-500 shadow-xl ring-4 ring-blue-500/10'
                    : 'hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm'
                }`}
              >
                {/* Fixed Top Badge Bar */}
                <div className="h-7 w-full shrink-0 overflow-hidden rounded-t-2xl">
                  {plan.badge === 'Popular' || plan.badge === 'Recommended' ? (
                    <div className="bg-black dark:bg-zinc-800 text-white text-[11px] font-extrabold uppercase tracking-wider h-full flex items-center justify-center">
                      {plan.badge}
                    </div>
                  ) : plan.badge === 'Best value' ? (
                    <div className="bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider h-full flex items-center justify-center">
                      Best value
                    </div>
                  ) : plan.badge ? (
                    <div className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-[11px] font-extrabold uppercase tracking-wider h-full flex items-center justify-center border-b border-zinc-200 dark:border-zinc-700">
                      {plan.badge}
                    </div>
                  ) : (
                    <div className="h-full bg-transparent" />
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title Slot */}
                    <div className="h-12 flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                        {plan.name}
                      </h3>
                      {plan.pillTag && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-bold shrink-0">
                          {plan.pillTag}
                        </span>
                      )}
                    </div>

                    {/* Subtitle Slot */}
                    <div className="h-6 flex items-center mb-2">
                      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                        {plan.subtitle}
                      </p>
                    </div>

                    {/* Description Slot */}
                    <div className="h-12 flex items-start mb-5 overflow-hidden">
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price Slot with Strikethrough */}
                    {plan.isCustomPrice ? (
                      <div className="h-16 flex flex-col justify-center mb-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                            Custom
                          </span>
                          <span className="text-xs font-bold text-zinc-500">
                            / Scope-Based
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block mt-0.5 truncate">
                          Variable enterprise scale • WhatsApp / Call
                        </span>
                      </div>
                    ) : (
                      <div className="h-16 flex flex-col justify-center mb-4">
                        <div className="flex items-baseline gap-2">
                          {originalPriceDisplay && (
                            <span className="text-sm font-semibold text-zinc-400 line-through">
                              {originalPriceDisplay}
                            </span>
                          )}
                          <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                            {priceDisplay}
                          </span>
                          <span className="text-xs font-bold text-zinc-500">
                            {periodSuffix}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mt-0.5 truncate">
                          {retainerDisplay}
                        </span>
                      </div>
                    )}

                    {/* Credits / Tech Info Slot with Info Tooltip */}
                    <div className="h-10 flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-5 pb-3 border-b border-zinc-100 dark:border-zinc-800 relative z-20">
                      <span className="truncate">{plan.credits}</span>
                      <div className="group relative inline-block cursor-pointer shrink-0 z-30">
                        <Info className="size-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" />
                        <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover:block w-64 p-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white text-[11px] font-normal leading-snug shadow-2xl z-50 pointer-events-none border border-zinc-700/80 text-center">
                          {plan.creditsTooltip}
                        </div>
                      </div>
                    </div>

                    {/* Features List Slot */}
                    <ul className="space-y-3 text-xs text-zinc-700 dark:text-zinc-300 font-medium mb-6 min-h-[190px]">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="size-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 mt-auto">
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3 px-4 rounded-full text-xs font-extrabold transition-all duration-200 shadow-xs active:scale-98 cursor-pointer ${
                        plan.buttonVariant === 'blue'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                          : plan.buttonVariant === 'black'
                          ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-black/20'
                          : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {buttonText}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Single-Liner Zero-Fee UPI Payment Banner ── */}
        <div className="max-w-6xl mx-auto mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <span className="text-base sm:text-lg">💡</span>
            <span>
              Save the 10% gateway fee: pay directly via zero-fee{' '}
              <button
                onClick={() => setShowQRModal(true)}
                className="font-extrabold underline decoration-amber-500 hover:text-black dark:hover:text-white cursor-pointer ml-1"
              >
                Instant UPI / Business QR Code
              </button>
            </span>
          </div>
          <button
            onClick={() => setShowQRModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
          >
            <QrCode className="size-4" />
            <span>Open Direct UPI QR</span>
          </button>
        </div>

        {/* ── Flagship Model Highlight Box (Matching /pricing) ── */}
        <div className="max-w-6xl mx-auto mt-16 rounded-3xl border border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/20 p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold uppercase tracking-wider mb-4">
              OpenStudio 2.0 Advantage
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              Why Startups & Creators Build with OpenStudio 2.0
            </h3>
            <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
              Start prototyping with 6 free daily prompts everyday. When you're ready for fast deployment, upgrade to Standard at just ₹222/mo (replacing ₹249 emergent) for unlimited Claude 3.7 & Gemini 2.5 generations with 100% full source code ownership.
            </p>

            <div className="mt-8 grid sm:grid-cols-3 gap-6 pt-6 border-t border-blue-500/20">
              <div>
                <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">6 Prompts/day</div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white mt-1">Free Forever Quota</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Resets automatically every 24 hours</div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">₹222 / mo</div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white mt-1">Unlimited Standard Plan</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Replaces ₹249 with full Claude 3.7 access</div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">100% Ownership</div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white mt-1">Clean Git Repositories</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Direct push to GitHub with zero lock-in</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ Accordion Section ── */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-10">
            <span className="inline-block px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs font-bold border border-zinc-200 dark:border-zinc-800 mb-3">
              Frequently Asked Questions
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              Questions About OpenStudio Plans & Billing?
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-zinc-900 dark:text-white cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium border-t border-zinc-100 dark:border-zinc-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Enterprise Consultation & Appointment Booking Section ── */}
        <EnterpriseAppointmentSection defaultService="OpenStudio Enterprise AI Suite & Dedicated Infrastructure" />

      </main>

      {/* ── Direct UPI Modal (Same as in RunwayPricing) ── */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl text-center">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="size-5" />
            </button>

            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-2">
              Zero Transaction Fees
            </span>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">
              Scan & Pay with Any UPI App
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-6">
              Google Pay, PhonePe, Paytm, BHIM, or any banking app
            </p>

            <div className="mx-auto size-52 p-3 rounded-2xl bg-white border-2 border-zinc-200 shadow-md flex items-center justify-center mb-6">
              <img
                src="/qr-code.png"
                alt="Direct UPI QR Code"
                className="size-full object-contain"
                onError={(e) => {
                  // Fallback to QR icon if image not found
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <QrCode className="size-36 text-zinc-800 hidden only:block" />
            </div>

            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-between gap-2 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 mb-6">
              <span>8169568582@upi</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('8169568582@upi');
                  setCopiedUPI(true);
                  setTimeout(() => setCopiedUPI(false), 2000);
                }}
                className="p-1.5 rounded-lg bg-white dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
              >
                {copiedUPI ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                <span>{copiedUPI ? 'Copied!' : 'Copy UPI'}</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              After payment, your OpenStudio subscription is activated immediately. You can also share the UTR reference via WhatsApp to +91 81695 68582.
            </p>
          </div>
        </div>
      )}

      {/* ── Enterprise Appointment Booking Modal ── */}
      <EnterpriseAppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        defaultService="OpenStudio Enterprise AI Suite & Dedicated Infrastructure"
      />

      {/* ── 4. Shared Footer ── */}
      <Footer />
    </div>
  );
};

export default OpenStudioPricingPage;
