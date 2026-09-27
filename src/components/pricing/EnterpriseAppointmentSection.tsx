import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Globe,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

interface EnterpriseAppointmentSectionProps {
  id?: string;
  defaultService?: string;
  title?: string;
  subtitle?: string;
}

export const EnterpriseAppointmentSection: React.FC<EnterpriseAppointmentSectionProps> = ({
  id = 'enterprise-appointment',
  defaultService = 'Enterprise Architecture & Custom Retainer',
  title = 'Enterprise Solutions Cannot Have a Fixed Rate Card',
  subtitle = 'Enterprise systems require dedicated cloud infrastructure, custom database tuning, private VPC sandboxes, or 99.99% SLA guarantees. Because requirements vary, we do not stay on fixed pricing. Connect directly with Lead Architect Yash Ramteke via WhatsApp (@opendev.labs) or direct phone call.'
}) => {
  const [domain, setDomain] = useState('');
  const [message, setMessage] = useState('');

  const automatedWhatsAppText = encodeURIComponent(
    `Hi @opendev.labs! I want to book an Enterprise consultation appointment for ${defaultService}.\n\nDomain: ${domain || 'Not specified yet'}\nMessage: ${message || 'We would like to discuss custom enterprise architecture and SLA pricing.'}`
  );

  const whatsappUrl = `https://wa.me/918169568582?text=${automatedWhatsAppText}`;

  return (
    <section id={id} className="w-full scroll-mt-24 mt-12 pt-8 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Container Box */}
        <div className="p-6 sm:p-10 rounded-3xl bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 size-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 size-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            
            {/* Header Badge & Title */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-wider mb-3 border border-emerald-300 dark:border-emerald-800">
                <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                WhatsApp & Direct Call Appointment Booking
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
                {title}
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                {subtitle}
              </p>
            </div>

            {/* Lightweight Form with Domain & Message */}
            <div className="max-w-xl mx-auto space-y-4 bg-white dark:bg-zinc-950/80 p-5 sm:p-7 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm">
              
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Your Company / Target Domain
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g. acme-enterprise.com or your-domain.com"
                    className="w-full text-xs font-semibold p-3 pl-9 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Globe className="size-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Architecture Message / Requirements
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you're building: e.g. High-scale AI pipeline, private sandbox execution, dedicated SLA, or custom cloud migration..."
                  className="w-full text-xs font-medium p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Automated WhatsApp Message Preview */}
              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-[11px] text-emerald-900 dark:text-emerald-300">
                <span className="font-bold block mb-0.5">Automated WhatsApp Message to @opendev.labs:</span>
                <span className="italic block truncate">
                  "Hi @opendev.labs! I want to book an Enterprise consultation... Domain: {domain || 'acme-enterprise.com'}"
                </span>
              </div>

              {/* Action Buttons: WhatsApp & Call ONLY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <MessageSquare className="size-4" />
                  <span>WhatsApp @opendev.labs</span>
                  <ExternalLink className="size-3 opacity-80" />
                </a>

                <a
                  href="tel:+918169568582"
                  className="py-3 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Phone className="size-4" />
                  <span>Direct Call (+91 81695 68582)</span>
                </a>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 pt-1">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                <span>Zero sales bureaucracy • Speak directly with Yash Shirish Ramteke</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
