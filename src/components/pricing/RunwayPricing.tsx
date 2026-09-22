import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ShieldCheck, Zap, Layers, QrCode, Copy, Check, X } from 'lucide-react';
import { openRazorpayCheckout } from '../../lib/payment/razorpay';
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
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [showQRModal, setShowQRModal] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);


  // Maintenance & Retainer Plan Data
  const maintenancePlans = [
    {
      id: 'essential_maintenance',
      name: 'Essential Maintenance',
      subtitle: 'Basic Uptime & Maintenance',
      description: 'Daily database backups, 24/7 uptime monitoring, security patches & standard bug fixes.',
      numINR_Monthly: 4000,
      numINR_Annual: 40000,
      numUSD_Monthly: 50,
      numUSD_Annual: 500,
      priceINR_Monthly: '₹4,000',
      priceINR_Annual: '₹40,000',
      priceUSD_Monthly: '$50',
      priceUSD_Annual: '$500',
      retainerINR_Monthly: 'Billed ₹4,000 / month',
      retainerINR_Annual: 'Billed ₹40,000 / year • Save ₹8,000',
      retainerUSD_Monthly: 'Billed $50 / month',
      retainerUSD_Annual: 'Billed $500 / year • Save $100',
      credits: 'Daily Backups • 24/7 Monitoring',
      buttonTextINR_Monthly: 'Select Essential (₹4,000/mo)',
      buttonTextINR_Annual: 'Select Essential (₹40,000/yr)',
      buttonTextUSD_Monthly: 'Select Essential ($50/mo)',
      buttonTextUSD_Annual: 'Select Essential ($500/yr)',
      buttonVariant: 'outline',
      badge: 'Essential',
      highlightBorder: false,
      featuresINR: [
        'Daily automated database backups & snapshots',
        '24/7 uptime monitoring & server response alerts',
        'Security patch updates & SSL maintenance',
        'Standard email & ticket support response',
        'Annual billing discount: Save ₹8,000 / year',
      ],
      featuresUSD: [
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
      subtitle: 'Full-Stack DB & Uptime Support',
      description: 'Firebase DB monitoring, Google Cloud Console auth updates, weekly backups & priority dev support.',
      numINR_Monthly: 6000,
      numINR_Annual: 64000,
      numUSD_Monthly: 75,
      numUSD_Annual: 800,
      priceINR_Monthly: '₹6,000',
      priceINR_Annual: '₹64,000',
      priceUSD_Monthly: '$75',
      priceUSD_Annual: '$800',
      retainerINR_Monthly: 'Billed ₹6,000 / month',
      retainerINR_Annual: 'Billed ₹64,000 / year • Save ₹8,000',
      retainerUSD_Monthly: 'Billed $75 / month',
      retainerUSD_Annual: 'Billed $800 / year • Save $100',
      credits: 'Firebase DB + Cloud Console Auth',
      buttonTextINR_Monthly: 'Select Advanced (₹6,000/mo)',
      buttonTextINR_Annual: 'Select Advanced (₹64,000/yr)',
      buttonTextUSD_Monthly: 'Select Advanced ($75/mo)',
      buttonTextUSD_Annual: 'Select Advanced ($800/yr)',
      buttonVariant: 'black',
      badge: 'Popular',
      highlightBorder: false,
      featuresINR: [
        'Everything in Essential + Priority Dev Availability',
        'Firebase DB & Google Cloud Auth maintenance',
        'Weekly code optimization & cache tuning',
        'Priority support response within 2 hours',
        'Annual billing discount: Save ₹8,000 / year',
      ],
      featuresUSD: [
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
      subtitle: 'GenAI Models & Autonomous Uptime',
      description: '24/7 Gemini AI model tuning, agent workflow monitoring, sub-second latency checks & database scaling.',
      numINR_Monthly: 8000,
      numINR_Annual: 88000,
      numUSD_Monthly: 100,
      numUSD_Annual: 1100,
      priceINR_Monthly: '₹8,000',
      priceINR_Annual: '₹88,000',
      priceUSD_Monthly: '$100',
      priceUSD_Annual: '$1,100',
      retainerINR_Monthly: 'Billed ₹8,000 / month',
      retainerINR_Annual: 'Billed ₹88,000 / year • Save ₹8,000',
      retainerUSD_Monthly: 'Billed $100 / month',
      retainerUSD_Annual: 'Billed $1,100 / year • Save $100',
      credits: 'Firebase + Gemini AI Agent Pipelines',
      buttonTextINR_Monthly: 'Select Pro AI (₹8,000/mo)',
      buttonTextINR_Annual: 'Select Pro AI (₹88,000/yr)',
      buttonTextUSD_Monthly: 'Select Pro AI ($100/mo)',
      buttonTextUSD_Annual: 'Select Pro AI ($1,100/yr)',
      buttonVariant: 'black',
      badge: 'Recommended',
      highlightBorder: true,
      featuresINR: [
        'Everything in Advanced + Gemini AI Agent Support',
        '24/7 AI model prompt tuning & vector store updates',
        'Sub-second latency checks & DB auto-scaling',
        '1-on-1 direct developer support hotline',
        'Annual billing discount: Save ₹8,000 / year',
      ],
      featuresUSD: [
        'Everything in Advanced + Gemini AI Agent Support',
        '24/7 AI model prompt tuning & vector store updates',
        'Sub-second latency checks & DB auto-scaling',
        '1-on-1 direct developer support hotline',
        'Annual billing discount: Save $100 / year',
      ],
    },
    {
      id: 'enterprise_maintenance',
      name: 'Enterprise Maintenance',
      subtitle: 'Custom Architecture & SLA Retainer',
      description: 'Dedicated cloud infrastructure, custom API integrations, 99.99% SLA & immediate emergency response.',
      numINR_Monthly: 10000,
      numINR_Annual: 110000,
      numUSD_Monthly: 125,
      numUSD_Annual: 1350,
      priceINR_Monthly: '₹10,000',
      priceINR_Annual: '₹1,10,000',
      priceUSD_Monthly: '$125',
      priceUSD_Annual: '$1,350',
      retainerINR_Monthly: 'Billed ₹10,000 / month',
      retainerINR_Annual: 'Billed ₹1,10,000 / year • Save ₹10,000',
      retainerUSD_Monthly: 'Billed $125 / month',
      retainerUSD_Annual: 'Billed $1,350 / year • Save $150',
      credits: 'Dedicated Architecture + 99.99% SLA',
      buttonTextINR_Monthly: 'Select Enterprise (₹10,000/mo)',
      buttonTextINR_Annual: 'Select Enterprise (₹1,10,000/yr)',
      buttonTextUSD_Monthly: 'Select Enterprise ($125/mo)',
      buttonTextUSD_Annual: 'Select Enterprise ($1,350/yr)',
      buttonVariant: 'blue',
      badge: 'Best value',
      pillTag: 'Enterprise Retainer',
      highlightBorder: true,
      featuresINR: [
        'Tailored full-stack SLA & dedicated cloud runner',
        'Custom database schema & API webhook maintenance',
        '99.99% Uptime Guarantee with SLA compliance',
        'Dedicated Lead Architect (Yash Ramteke)',
        'Annual billing discount: Save ₹10,000 / year',
      ],
      featuresUSD: [
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

    const isINR = currency === 'INR';
    const isMonthly = billingCycle === 'monthly';

    const baseAmount = isMonthly
      ? (isINR ? plan.numINR_Monthly : plan.numUSD_Monthly)
      : (isINR ? plan.numINR_Annual : plan.numUSD_Annual);

    const amountWithFee = Math.round(baseAmount * 1.10);

    const formattedFeeAmount = isINR
      ? `₹${amountWithFee.toLocaleString('en-IN')}`
      : `$${amountWithFee.toLocaleString('en-US')}`;

    if (onSelectPlan) {
      onSelectPlan(plan.name);
    }

    openRazorpayCheckout({
      amount: amountWithFee,
      currency: currency,
      name: user?.name || 'Client Partner',
      email: user?.email || 'opendev.office@gmail.com',
      description: `OpenDev-Labs ${plan.name} (${billingCycle.toUpperCase()}) - ${formattedFeeAmount} (Includes 10% Gateway Fee)`,
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

  return (
    <div className="w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      
      {/* Top Billing Cycle & Currency Controls */}
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
              {currency === 'USD' ? 'Save up to $150/yr' : 'Save up to ₹10k/yr'}
            </span>
          </button>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-bold">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                currency === 'USD' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs' : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                currency === 'INR' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs' : 'text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              INR (₹)
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout - Cards & Buttons Aligned horizontally on exact same level */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {maintenancePlans.map((plan) => {
          const isINR = currency === 'INR';
          const isMonthly = billingCycle === 'monthly';

          const priceDisplay = isMonthly
            ? (isINR ? plan.priceINR_Monthly : plan.priceUSD_Monthly)
            : (isINR ? plan.priceINR_Annual : plan.priceUSD_Annual);

          const periodSuffix = isMonthly ? '/month' : '/year';

          const retainerDisplay = isMonthly
            ? (isINR ? plan.retainerINR_Monthly : plan.retainerUSD_Monthly)
            : (isINR ? plan.retainerINR_Annual : plan.retainerUSD_Annual);

          const buttonText = isMonthly
            ? (isINR ? plan.buttonTextINR_Monthly : plan.buttonTextUSD_Monthly)
            : (isINR ? plan.buttonTextINR_Annual : plan.buttonTextUSD_Annual);

          const activeFeatures = isINR ? plan.featuresINR : plan.featuresUSD;

          return (
            <div
              key={plan.id}
              className={`hero-glass-card rounded-2xl flex flex-col justify-between text-zinc-900 dark:text-zinc-100 transition-all duration-300 relative overflow-hidden h-full ${
                plan.highlightBorder
                  ? 'border-2 border-blue-600 dark:border-blue-500 shadow-xl ring-4 ring-blue-500/10'
                  : 'hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm'
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

                  {/* Credits / Tech Info Slot - Fixed Height */}
                  <div className="h-10 flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="truncate">{plan.credits}</span>
                    <div className="group relative inline-block cursor-pointer shrink-0">
                      <Info className="size-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" />
                      <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover:block w-52 p-2 rounded-lg bg-zinc-900 text-white text-[10px] leading-tight shadow-xl z-50 pointer-events-none">
                        Active maintenance retainer includes automated backups, daily health checks & security updates.
                      </div>
                    </div>
                  </div>

                  {/* Features List Slot - Min Height for Aligned Bullet Points */}
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

                {/* Equal Level Action Button at Bottom */}
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

      {/* Single-Liner Zero-Fee UPI Payment Banner (Below Pricing Cards, Above Annual Savings / Tech Stack Cards) */}
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
            <Layers className="size-4 text-blue-600 dark:text-blue-400" /> Annual Savings Benefit
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {currency === 'USD' ? (
              <>
                Essential ($50/mo): <span className="font-bold text-zinc-900 dark:text-white">$500/yr (Save $100)</span><br />
                Advanced ($75/mo): <span className="font-bold text-zinc-900 dark:text-white">$800/yr (Save $100)</span><br />
                Pro AI ($100/mo): <span className="font-bold text-zinc-900 dark:text-white">$1,100/yr (Save $100)</span><br />
                Enterprise ($125/mo): <span className="font-bold text-zinc-900 dark:text-white">$1,350/yr (Save $150)</span>
              </>
            ) : (
              <>
                Essential (₹4k/mo): <span className="font-bold text-zinc-900 dark:text-white">₹40,000/yr (Save ₹8,000)</span><br />
                Advanced (₹6k/mo): <span className="font-bold text-zinc-900 dark:text-white">₹64,000/yr (Save ₹8,000)</span><br />
                Pro AI (₹8k/mo): <span className="font-bold text-zinc-900 dark:text-white">₹88,000/yr (Save ₹8,000)</span><br />
                Enterprise (₹10k/mo): <span className="font-bold text-zinc-900 dark:text-white">₹1,10,000/yr (Save ₹10,000)</span>
              </>
            )}
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
            Database: <span className="font-bold text-zinc-900 dark:text-white">Firebase (Firestore/Realtime DB)</span><br />
            Auth: <span className="font-bold text-zinc-900 dark:text-white">Google Cloud Console / Firebase Auth</span><br />
            Hosting & Code: <span className="font-bold text-zinc-900 dark:text-white">Hostinger, Vercel, GitHub</span>
          </p>
        </div>

      </div>

      {/* UPI QR Code Modal Popup (Image itself is the right window, details on left) */}
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

            {/* RIGHT SIDE: The QR Code Image itself as the Window */}
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
