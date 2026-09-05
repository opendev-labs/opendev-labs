import React, { useState } from 'react';
import { Check, Info, ArrowRight, Sparkles, ShieldCheck, Zap, Layers, Globe, HelpCircle } from 'lucide-react';

interface RunwayPricingProps {
  onSelectPlan?: (planName: string) => void;
}

export const RunwayPricing: React.FC<RunwayPricingProps> = ({ onSelectPlan }) => {
  const [domainOption, setDomainOption] = useState<'no_domain' | 'with_domain'>('no_domain');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Client Custom Web Application Development Pricing Data
  const plansWithoutDomain = [
    {
      id: 'basic_static',
      name: 'Basic (Static)',
      subtitle: 'Single Page / Static WebApp',
      description: 'Clean, fast responsive web application deployed on Vercel or Hostinger with basic SEO.',
      priceINR: '₹6,000',
      priceUSD: '$75',
      retainerINR: 'Fixed ₹6,000 Advance • Retainer ₹1,000/mo',
      retainerUSD: 'Fixed $75 Advance • Retainer $15/mo',
      credits: 'Single Page / Home / Auth / Dash',
      buttonText: 'Select Basic (₹6,000)',
      buttonVariant: 'outline',
      badge: null,
      highlightBorder: false,
      features: [
        'One Home Page OR Home + Auth OR Home + Dashboard',
        'Fixed ₹6,000 Advance payment required to start',
        'Remaining balance paid on completion before launch',
        'Delivery Timeline: 2-3 Weeks',
        'No-maintenance option: ₹8,400 (+40% one-time)',
      ],
    },
    {
      id: 'advanced_dynamic',
      name: 'Advanced (Dynamic)',
      subtitle: 'Full-Stack Firebase & GCP Auth',
      description: 'Dynamic web application integrated with Firebase Firestore DB & Google Cloud Console Auth.',
      priceINR: '₹11,000',
      priceUSD: '$135',
      retainerINR: 'Fixed ₹6,000 Advance • Retainer ₹3,000/mo',
      retainerUSD: 'Fixed $75 Advance • Retainer $40/mo',
      credits: 'Firebase DB & Google Cloud Auth',
      buttonText: 'Select Advanced (₹11,000)',
      buttonVariant: 'black',
      badge: 'Popular',
      highlightBorder: false,
      features: [
        'Everything in Basic + Firebase DB & Auth System',
        'Fixed ₹6,000 Advance payment required to start',
        'Remaining balance paid on completion before launch',
        'Active ₹3,000/mo retainer for daily backups & updates',
        'No-maintenance option: ₹15,400 (+40% one-time)',
      ],
    },
    {
      id: 'ai_powered',
      name: 'AI-Powered System',
      subtitle: 'GenAI & Autonomous Agent Workflows',
      description: 'AI-driven web app with automated Gemini AI workflows, agent pipelines & smart dashboards.',
      priceINR: '₹16,000',
      priceUSD: '$200',
      retainerINR: 'Fixed ₹6,000 Advance • Retainer ₹4,000/mo',
      retainerUSD: 'Fixed $75 Advance • Retainer $50/mo',
      credits: 'Firebase + Gemini AI Workflows',
      buttonText: 'Select AI System (₹16,000)',
      buttonVariant: 'black',
      badge: 'Recommended',
      highlightBorder: true,
      features: [
        'Everything in Advanced + Gemini AI Agent Integration',
        'Fixed ₹6,000 Advance payment required to start',
        'Remaining balance paid on completion before launch',
        'Active ₹4,000/mo retainer for 24/7 uptime & model updates',
        'No-maintenance option: ₹22,400 (+40% one-time)',
      ],
    },
    {
      id: 'custom_enterprise',
      name: 'Custom Enterprise',
      subtitle: 'Custom Architecture & Workflows',
      description: 'Bespoke full-stack web application tailored for complex business logic, custom integrations & scalability.',
      priceINR: '₹35,000 - ₹85,000',
      priceUSD: '$420 - $1,000',
      retainerINR: 'Fixed ₹6,000 Advance • Retainer ₹5k–₹10k/mo',
      retainerUSD: 'Fixed $75 Advance • Retainer $60–$120/mo',
      credits: 'Custom Stack + Firebase + GCP',
      buttonText: 'Request Custom Build',
      buttonVariant: 'blue',
      badge: 'Best value',
      pillTag: 'Custom Enterprise',
      highlightBorder: true,
      features: [
        'Tailored full-stack solution built to custom client spec',
        'Fixed ₹6,000 Advance to start, milestone balance payments',
        'Complex database schema, API integrations & admin portals',
        'Firebase DB, Hostinger/Vercel deployment & GitHub repo',
        'Additional pages at ₹5,000 per page',
      ],
    },
  ];

  const plansWithDomain = [
    {
      id: 'basic_domain',
      name: 'Basic (Static) + Domain',
      subtitle: 'Single Page + Custom Domain Included',
      description: 'Clean responsive web application with Hostinger custom domain registration included.',
      priceINR: '₹14,000',
      priceUSD: '$175',
      retainerINR: 'Fixed ₹6,000 Advance • Retainer ₹4,000/mo',
      retainerUSD: 'Fixed $75 Advance • Retainer $50/mo',
      credits: 'Custom Domain + Hostinger/Vercel',
      buttonText: 'Select Basic + Domain (₹14,000)',
      buttonVariant: 'outline',
      badge: null,
      highlightBorder: false,
      features: [
        'One Home Page OR Home + Auth OR Home + Dashboard',
        'Hostinger custom domain setup included',
        'Fixed ₹6,000 Advance payment before starting',
        'Delivery timeline: 2-3 Weeks',
        'No-maintenance option: ₹19,600 (+40% one-time)',
      ],
    },
    {
      id: 'advanced_domain',
      name: 'Advanced + Domain',
      subtitle: 'Full-Stack Dynamic + Custom Domain',
      description: 'Full-stack dynamic web app with custom domain, Firebase DB & Google Cloud Auth.',
      priceINR: '₹29,000',
      priceUSD: '$350',
      retainerINR: 'Fixed ₹6,000 Advance • Retainer ₹5,000/mo',
      retainerUSD: 'Fixed $75 Advance • Retainer $60/mo',
      credits: 'Domain + Firebase DB + GCP Auth',
      buttonText: 'Select Advanced + Domain (₹29,000)',
      buttonVariant: 'black',
      badge: 'Popular',
      highlightBorder: false,
      features: [
        'Everything in Advanced + Custom Domain Setup',
        'Fixed ₹6,000 Advance payment, rest on completion',
        'Active ₹5,000/mo retainer for daily backups & updates',
        'Delivery timeline: 2-3 Weeks',
        'No-maintenance option: ₹40,600 (+40% one-time)',
      ],
    },
    {
      id: 'ai_domain',
      name: 'AI-Powered + Domain',
      subtitle: 'AI Agent Workflows + Custom Domain',
      description: 'AI-driven web application with custom domain, Gemini AI integration & full dashboard.',
      priceINR: '₹49,000',
      priceUSD: '$600',
      retainerINR: 'Fixed ₹6,000 Advance • Retainer ₹5,000/mo',
      retainerUSD: 'Fixed $75 Advance • Retainer $60/mo',
      credits: 'Domain + Firebase + Gemini AI',
      buttonText: 'Select AI + Domain (₹49,000)',
      buttonVariant: 'black',
      badge: 'Recommended',
      highlightBorder: true,
      features: [
        'Everything in AI-Powered + Custom Domain Setup',
        'Fixed ₹6,000 Advance payment, rest on completion',
        'Active ₹5,000/mo retainer for 24/7 uptime & model updates',
        'Delivery timeline: 2-3 Weeks',
        'No-maintenance option: ₹68,600 (+40% one-time)',
      ],
    },
    {
      id: 'custom_enterprise_domain',
      name: 'Custom Enterprise + Domain',
      subtitle: 'Custom WebApp + Domain Included',
      description: 'Bespoke full-stack web application suite with custom domain registration, SSL & infrastructure setup.',
      priceINR: '₹43,000 - ₹93,000',
      priceUSD: '$520 - $1,120',
      retainerINR: 'Fixed ₹6,000 Advance • Retainer ₹7k–₹12k/mo',
      retainerUSD: 'Fixed $75 Advance • Retainer $85–$145/mo',
      credits: 'Domain + Custom Enterprise Stack',
      buttonText: 'Request Custom + Domain',
      buttonVariant: 'blue',
      badge: 'Best value',
      pillTag: 'Enterprise Complete',
      highlightBorder: true,
      features: [
        'Custom web application + Hostinger domain setup included',
        'Fixed ₹6,000 Advance to start, milestone balance payments',
        'Custom domain setup, SSL & high availability setup',
        'Firebase DB, Hostinger/Vercel deployment & GitHub repo',
        'Additional pages at ₹5,000 per page',
      ],
    },
  ];

  const activePlans = domainOption === 'no_domain' ? plansWithoutDomain : plansWithDomain;

  return (
    <div className="w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      
      {/* Top Domain & Currency Controls */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        
        {/* Domain Switcher */}
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setDomainOption('no_domain')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              domainOption === 'no_domain'
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Without Domain (Client Owns Domain)
          </button>
          <button
            onClick={() => setDomainOption('with_domain')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              domainOption === 'with_domain'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            With Domain Included (Hostinger Domain Setup)
          </button>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-bold">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1 rounded-md transition-all ${
                currency === 'INR' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs' : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-md transition-all ${
                currency === 'USD' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs' : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout - Cards & Buttons Aligned horizontally on exact same level */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {activePlans.map((plan) => {
          const isINR = currency === 'INR';
          const priceDisplay = isINR ? plan.priceINR : plan.priceUSD;
          const retainerDisplay = isINR ? plan.retainerINR : plan.retainerUSD;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl border flex flex-col justify-between bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-all duration-300 relative overflow-hidden h-full ${
                plan.highlightBorder
                  ? 'border-2 border-blue-600 dark:border-blue-500 shadow-xl ring-4 ring-blue-500/10'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-sm'
              }`}
            >
              {/* Fixed Top Badge Bar for Equal Alignment */}
              <div className="h-7 w-full shrink-0">
                {plan.badge === 'Popular' || plan.badge === 'Recommended' ? (
                  <div className="bg-black dark:bg-zinc-800 text-white text-[11px] font-extrabold uppercase tracking-wider h-full flex items-center justify-center">
                    {plan.badge}
                  </div>
                ) : plan.badge === 'Best value' ? (
                  <div className="bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider h-full flex items-center justify-center">
                    Best value
                  </div>
                ) : (
                  <div className="h-full bg-transparent" />
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Title Slot - Fixed Height */}
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

                  {/* Subtitle Slot - Fixed Height */}
                  <div className="h-6 flex items-center mb-2">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                      {plan.subtitle}
                    </p>
                  </div>

                  {/* Description Slot - Fixed Height */}
                  <div className="h-12 flex items-start mb-5 overflow-hidden">
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Slot - Fixed Height */}
                  <div className="h-16 flex flex-col justify-center mb-4">
                    <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                      {priceDisplay}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mt-0.5 truncate">
                      {retainerDisplay}
                    </span>
                  </div>

                  {/* Credits / Tech Info Slot - Fixed Height */}
                  <div className="h-10 flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="truncate">{plan.credits}</span>
                    <div className="group relative inline-block cursor-pointer shrink-0">
                      <Info className="size-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" />
                      <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover:block w-48 p-2 rounded-lg bg-zinc-900 text-white text-[10px] leading-tight shadow-xl z-50 pointer-events-none">
                        Fixed ₹6,000 Advance required to start. Delivery in 2-3 weeks.
                      </div>
                    </div>
                  </div>

                  {/* Features List Slot - Min Height for Aligned Bullet Points */}
                  <ul className="space-y-3 text-xs text-zinc-700 dark:text-zinc-300 font-medium mb-6 min-h-[160px]">
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

                {/* Equal Level Action Button at Bottom */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 mt-auto">
                  <button
                    onClick={() => onSelectPlan?.(plan.name)}
                    className={`w-full py-3 px-4 rounded-full text-xs font-extrabold transition-all duration-200 shadow-xs active:scale-98 ${
                      plan.buttonVariant === 'blue'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                        : plan.buttonVariant === 'black'
                        ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-black/20'
                        : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Page & Terms Summary Banner */}
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-6">
          <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2 mb-2">
            <Layers className="size-4 text-blue-600 dark:text-blue-400" /> Additional Pages
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Standard Page: <span className="font-bold text-zinc-900 dark:text-white">₹5,000/page</span><br />
            Dynamic Content Page: <span className="font-bold text-zinc-900 dark:text-white">₹5,000 – ₹10,000/page</span><br />
            Complex Interactive Page: <span className="font-bold text-zinc-900 dark:text-white">₹10,000 – ₹15,000/page</span>
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-6">
          <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2 mb-2">
            <ShieldCheck className="size-4 text-emerald-500" /> Payment & Delivery Terms
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Fixed Advance: <span className="font-bold text-zinc-900 dark:text-white">₹6,000</span> before starting<br />
            Remaining Balance: <span className="font-bold text-zinc-900 dark:text-white">Paid on completion before launch</span><br />
            Timeline: <span className="font-bold text-zinc-900 dark:text-white">2–3 Weeks for all packages</span>
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-6">
          <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2 mb-2">
            <Zap className="size-4 text-amber-500" /> Technology Stack
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Database: <span className="font-bold text-zinc-900 dark:text-white">Firebase (Firestore/Realtime DB)</span><br />
            Auth: <span className="font-bold text-zinc-900 dark:text-white">Google Cloud Console / Firebase Auth</span><br />
            Hosting & Code: <span className="font-bold text-zinc-900 dark:text-white">Hostinger, Vercel, GitHub</span>
          </p>
        </div>

      </div>
    </div>
  );
};
