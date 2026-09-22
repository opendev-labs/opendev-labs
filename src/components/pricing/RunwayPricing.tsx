import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ShieldCheck, Zap, Layers, QrCode, Copy, Check, X, Globe, ChevronDown } from 'lucide-react';
import { openRazorpayCheckout } from '../../lib/payment/razorpay';
import { SupportedCurrency, SUPPORTED_CURRENCIES, convertFromUSD, formatCurrencyPrice } from '../../lib/payment/currencies';
import { useClients } from '../../context/ClientContext';
import { useAuth } from '../../context/AuthContext';

interface RunwayPricingProps {
  onSelectPlan?: (planName: string) => void;
}

export const RunwayPricing: React.FC<RunwayPricingProps> = ({ onSelectPlan }) => {
  const { user } = useAuth();
  const { notifyPayment } = useClients();
  const navigate = useNavigate();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [showQRModal, setShowQRModal] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);

  // Base Maintenance & Retainer Plans (Normalized to USD base)
  const maintenancePlans = [
    {
      id: 'essential_maintenance',
      name: 'Essential Maintenance',
      shortName: 'Essential',
      subtitle: 'Basic Uptime & Maintenance',
      description: 'Daily database backups, 24/7 uptime monitoring, security patches & standard bug fixes.',
      usdMonthly: 50,
      usdAnnual: 500,
      credits: 'Daily Backups • 24/7 Monitoring',
      buttonVariant: 'outline',
      badge: 'Essential',
      highlightBorder: false,
      features: [
        'Daily automated database backups & snapshots',
        '24/7 uptime monitoring & server response alerts',
        'Security patch updates & SSL maintenance',
        'Standard email & ticket support response',
        'Annual billing discount: Save $100 / year',
      ],
    },
    {
      id: 'advanced_maintenance',
      name: 'Advanced Maintenance',
      shortName: 'Advanced',
      subtitle: 'Full-Stack DB & Uptime Support',
      description: 'Firebase DB monitoring, Google Cloud Console auth updates, weekly backups & priority dev support.',
      usdMonthly: 75,
      usdAnnual: 800,
      credits: 'Firebase DB + Cloud Console Auth',
      buttonVariant: 'black',
      badge: 'Popular',
      highlightBorder: false,
      features: [
        'Everything in Essential + Priority Dev Availability',
        'Firebase DB & Google Cloud Auth maintenance',
        'Weekly code optimization & cache tuning',
        'Priority support response within 2 hours',
        'Annual billing discount: Save $100 / year',
      ],
    },
    {
      id: 'pro_ai_maintenance',
      name: 'Pro AI Maintenance',
      shortName: 'Pro AI',
      subtitle: 'GenAI Models & Autonomous Uptime',
      description: '24/7 Multi-AI model tuning (OpenRouter, Gemini, OpenAI, Claude), agent workflow monitoring & database scaling.',
      usdMonthly: 100,
      usdAnnual: 1100,
      credits: 'OpenRouter, Gemini, OpenAI & Any LLM',
      buttonVariant: 'black',
      badge: 'Recommended',
      highlightBorder: true,
      features: [
        'Everything in Advanced + Any AI Model Support',
        'OpenRouter, Gemini, OpenAI, Claude & DeepSeek support',
        '24/7 AI model prompt tuning & vector store updates',
        'Sub-second latency checks & DB auto-scaling',
        'Annual billing discount: Save $100 / year',
      ],
    },
    {
      id: 'enterprise_maintenance',
      name: 'Enterprise Maintenance',
      shortName: 'Enterprise',
      subtitle: 'Custom Architecture & SLA Retainer',
      description: 'Dedicated cloud infrastructure, custom API integrations, 99.99% SLA & immediate emergency response.',
      usdMonthly: 125,
      usdAnnual: 1350,
      credits: 'Dedicated Architecture + 99.99% SLA',
      buttonVariant: 'blue',
      badge: 'Best value',
      pillTag: 'Enterprise Retainer',
      highlightBorder: true,
      features: [
        'Tailored full-stack SLA & dedicated cloud runner',
        'Custom database schema & API webhook maintenance',
        '99.99% Uptime Guarantee with SLA compliance',
        'Dedicated Lead Architect (Yash Ramteke)',
        'Annual billing discount: Save $150 / year',
      ],
    },
  ];

  const handleSelectCard = (plan: typeof maintenancePlans[0]) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const isMonthly = billingCycle === 'monthly';
    const baseUsd = isMonthly ? plan.usdMonthly : plan.usdAnnual;
    const baseAmount = convertFromUSD(baseUsd, currency);

    // 10% extra fee for Razorpay live gateway handling
    const amountWithFee = Math.round(baseAmount * 1.10);
    const formattedFeeAmount = formatCurrencyPrice(amountWithFee, currency);

    if (onSelectPlan) {
      onSelectPlan(plan.name);
    }

    openRazorpayCheckout({
      amount: amountWithFee,
      currency: currency,
      name: user?.name || 'Client Partner',
      email: user?.email || 'opendev.office@gmail.com',
      description: `OpenDev-Labs ${plan.name} (${billingCycle.toUpperCase()}) - ${formattedFeeAmount} ${currency} (Includes 10% Gateway Fee)`,
      onSuccess: (response) => {
        notifyPayment({
          clientId: user?.id || 'client-temp',
          clientName: user?.name || user?.email?.split('@')[0] || 'Client',
          clientEmail: user?.email || 'client@opendev-labs.com',
          amount: amountWithFee,
          paymentMethod: 'Razorpay',
          transactionRef: `Razorpay Live Payment ID: ${response.razorpay_payment_id}`,
        });
      },
    });
  };

  const getSavingsText = () => {
    const maxSavingsUsd = 150;
    const converted = convertFromUSD(maxSavingsUsd, currency);
    return `Save up to ${formatCurrencyPrice(converted, currency)}/yr`;
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      
      {/* Top Billing Cycle & Multi-Currency Controls */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        
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
              {getSavingsText()}
            </span>
          </button>
        </div>

        {/* 10-Currency International Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <Globe className="size-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Currency:</span>
          </div>

          {/* Quick Pill Toggles for Common Currencies */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold">
            {(['USD', 'INR', 'EUR', 'GBP'] as SupportedCurrency[]).map((cCode) => (
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

          {/* Full Dropdown for all 10 Supported Currencies */}
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

      {/* Grid Layout - Cards & Buttons Aligned horizontally */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {maintenancePlans.map((plan) => {
          const isMonthly = billingCycle === 'monthly';
          const usdBase = isMonthly ? plan.usdMonthly : plan.usdAnnual;
          const convertedPrice = convertFromUSD(usdBase, currency);
          const priceDisplay = formatCurrencyPrice(convertedPrice, currency);

          const periodSuffix = isMonthly ? '/month' : '/year';

          const usdSavings = (plan.usdMonthly * 12) - plan.usdAnnual;
          const convertedSavings = convertFromUSD(usdSavings, currency);
          const savingsDisplay = formatCurrencyPrice(convertedSavings, currency);

          const retainerDisplay = isMonthly
            ? `Billed ${priceDisplay} / month`
            : `Billed ${priceDisplay} / year • Save ${savingsDisplay}`;

          const buttonText = `Select ${plan.shortName} (${priceDisplay}/${isMonthly ? 'mo' : 'yr'})`;

          const activeFeatures = plan.features.map((feature) => {
            if (feature.includes('Save')) {
              return `Annual billing discount: Save ${savingsDisplay} / year`;
            }
            return feature;
          });

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
              <div className="p-6 flex-1 flex flex-col justify-between">
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

                  {/* Price Slot */}
                  <div className="h-16 flex flex-col justify-center mb-4">
                    <div className="flex items-baseline gap-1">
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

                  {/* Credits / Tech Info Slot */}
                  <div className="h-10 flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-5 pb-3 border-b border-zinc-100 dark:border-zinc-800 relative z-20">
                    <span className="truncate">{plan.credits}</span>
                    <div className="group relative inline-block cursor-pointer shrink-0 z-30">
                      <Info className="size-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" />
                      <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover:block w-60 p-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white text-[11px] font-normal leading-snug shadow-2xl z-50 pointer-events-none border border-zinc-700/80 text-center">
                        Active maintenance retainer includes automated backups, daily health checks & security updates.
                      </div>
                    </div>
                  </div>

                  {/* Features List Slot */}
                  <ul className="space-y-3 text-xs text-zinc-700 dark:text-zinc-300 font-medium mb-6 min-h-[160px]">
                    {activeFeatures.map((feature, idx) => (
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
                    onClick={() => handleSelectCard(plan)}
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

      {/* Single-Liner Zero-Fee UPI Payment Banner */}
      <div className="max-w-7xl mx-auto mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <span className="text-base sm:text-lg">💡</span>
          <span>
            Don't want to pay extra 10% Razorpay fees? Use direct zero-fee{' '}
            <button
              onClick={() => setShowQRModal(true)}
              className="font-extrabold underline hover:text-amber-600 dark:hover:text-amber-100 transition-colors cursor-pointer"
            >
              UPI (8169568582@kotakbank)
            </button>
          </span>
        </div>
        <button
          onClick={() => setShowQRModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
        >
          <QrCode className="size-4" /> View UPI QR Code →
        </button>
      </div>

      {/* Additional Retainer Terms & Stack Banner */}
      <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-6">
          <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2 mb-2">
            <Layers className="size-4 text-blue-600 dark:text-blue-400" /> Annual Savings Benefit ({currency})
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Essential ({formatCurrencyPrice(convertFromUSD(50, currency), currency)}/mo):{' '}
            <span className="font-bold text-zinc-900 dark:text-white">
              {formatCurrencyPrice(convertFromUSD(500, currency), currency)}/yr (Save {formatCurrencyPrice(convertFromUSD(100, currency), currency)})
            </span>
            <br />
            Advanced ({formatCurrencyPrice(convertFromUSD(75, currency), currency)}/mo):{' '}
            <span className="font-bold text-zinc-900 dark:text-white">
              {formatCurrencyPrice(convertFromUSD(800, currency), currency)}/yr (Save {formatCurrencyPrice(convertFromUSD(100, currency), currency)})
            </span>
            <br />
            Pro AI ({formatCurrencyPrice(convertFromUSD(100, currency), currency)}/mo):{' '}
            <span className="font-bold text-zinc-900 dark:text-white">
              {formatCurrencyPrice(convertFromUSD(1100, currency), currency)}/yr (Save {formatCurrencyPrice(convertFromUSD(100, currency), currency)})
            </span>
            <br />
            Enterprise ({formatCurrencyPrice(convertFromUSD(125, currency), currency)}/mo):{' '}
            <span className="font-bold text-zinc-900 dark:text-white">
              {formatCurrencyPrice(convertFromUSD(1350, currency), currency)}/yr (Save {formatCurrencyPrice(convertFromUSD(150, currency), currency)})
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-6">
          <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2 mb-2">
            <ShieldCheck className="size-4 text-emerald-500" /> Included Maintenance Services
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Database Snapshots: <span className="font-bold text-zinc-900 dark:text-white">Daily automated backups</span><br />
            Uptime SLA: <span className="font-bold text-zinc-900 dark:text-white">99.99% Server Uptime Guarantee</span><br />
            Support Hotline: <span className="font-bold text-zinc-900 dark:text-white">Priority Developer Access</span>
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-6">
          <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2 mb-2">
            <Zap className="size-4 text-amber-500" /> Technology Stack
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            AI Models: <span className="font-bold text-zinc-900 dark:text-white">OpenRouter, Gemini, OpenAI, Claude & Any LLM</span><br />
            Database: <span className="font-bold text-zinc-900 dark:text-white">Firebase (Firestore/Realtime DB)</span><br />
            Auth: <span className="font-bold text-zinc-900 dark:text-white">Google Cloud Console / Firebase Auth</span><br />
            Hosting & Code: <span className="font-bold text-zinc-900 dark:text-white">Hostinger, Vercel, GitHub</span>
          </p>
        </div>

      </div>

      {/* UPI QR Code Modal Popup */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-3xl w-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl relative my-auto flex flex-col md:flex-row items-stretch min-h-[480px]">
            
            {/* Top Right Close Button */}
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black text-white/80 hover:text-white backdrop-blur-md transition-colors cursor-pointer border border-white/10"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>

            {/* LEFT SIDE: All Payment Details */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 text-left bg-white dark:bg-zinc-900">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold mb-3 border border-emerald-200 dark:border-emerald-800">
                  Zero Gateway Fee • Direct Payment
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
                  Direct Zero-Fee UPI Payment
                </h3>
                
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Avoid paying the 10% Razorpay gateway charges. Pay directly via UPI and send reference for instant activation.
                </p>

                {/* UPI ID Copy Box */}
                <div className="bg-zinc-100 dark:bg-zinc-800/80 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-2 my-5">
                  <div className="text-left overflow-hidden">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block leading-tight">UPI VPA ID</span>
                    <span className="text-sm font-extrabold text-zinc-900 dark:text-white font-mono truncate block mt-0.5">
                      8169568582@kotakbank
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('8169568582@kotakbank');
                      setCopiedUPI(true);
                      setTimeout(() => setCopiedUPI(false), 2000);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-extrabold hover:opacity-90 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs active:scale-95"
                  >
                    {copiedUPI ? (
                      <>
                        <Check className="size-3.5 text-emerald-400 dark:text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" /> Copy ID
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Account Holder Info Box */}
              <div className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-950/80 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800/80">
                <p className="font-extrabold text-zinc-900 dark:text-white text-xs mb-1">Account Holder Info:</p>
                <p>Beneficiary: <span className="font-bold text-zinc-900 dark:text-white">Yash Shirish Ramteke</span></p>
                <p>Bank: <span className="font-semibold text-zinc-800 dark:text-zinc-200">Kotak Mahindra Bank</span></p>
                <p className="mt-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80 text-[10px] text-zinc-400">
                  After payment, send screenshot/UTR to <span className="font-bold text-zinc-700 dark:text-zinc-300">opendev.office@gmail.com</span> or WhatsApp <span className="font-bold text-zinc-700 dark:text-zinc-300">+91 81695 68582</span>.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE: The QR Code Image */}
            <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative overflow-hidden p-2 sm:p-4">
              <img
                src="/QR-code-for-Yash-Ramteke.png"
                alt="UPI Payment QR Code - Yash Shirish Ramteke"
                className="w-full h-full max-h-[460px] object-contain"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default RunwayPricing;
