import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Globe,
  Send,
  X,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface EnterpriseAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const EnterpriseAppointmentModal: React.FC<EnterpriseAppointmentModalProps> = ({
  isOpen,
  onClose,
  defaultService = 'Enterprise Architecture & Retainer'
}) => {
  const [domain, setDomain] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const automatedWhatsAppText = encodeURIComponent(
    `Hi @opendev.labs! I want to book an Enterprise consultation appointment for ${defaultService}.\n\nDomain: ${domain || 'Not specified yet'}\nMessage: ${message || 'We would like to discuss custom enterprise architecture and SLA pricing.'}`
  );

  const whatsappUrl = `https://wa.me/918169568582?text=${automatedWhatsAppText}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl relative my-auto p-6 sm:p-7 text-zinc-900 dark:text-zinc-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider mb-2 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="size-3 text-emerald-600 dark:text-emerald-400" />
            WhatsApp & Direct Call Only
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Book Enterprise Appointment
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Enterprise solutions are custom and variable. Connect directly with Lead Architect Yash Ramteke via WhatsApp (<span className="font-bold text-emerald-600 dark:text-emerald-400">@opendev.labs</span>) or direct phone call.
          </p>
        </div>

        {/* Minimal Inputs: Domain + Message */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Your Company / Target Domain
            </label>
            <div className="relative">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. acme-corp.com or client-domain.com"
                className="w-full text-xs font-semibold p-3 pl-9 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Globe className="size-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Message / Architecture Needs
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Need dedicated high-scale database clusters, custom AI agent integration, and 99.99% uptime SLA..."
              className="w-full text-xs font-medium p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Automated Message Preview Pill */}
          <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-[11px] text-zinc-600 dark:text-zinc-400">
            <span className="font-bold text-zinc-900 dark:text-white block mb-0.5">Automated WhatsApp Dispatch (@opendev.labs):</span>
            <span className="italic block truncate">
              "Hi @opendev.labs! I want to book an Enterprise consultation... Domain: {domain || 'acme-corp.com'}"
            </span>
          </div>

          {/* Action Buttons: WhatsApp & Call ONLY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <MessageSquare className="size-4" />
              <span>WhatsApp @opendev.labs</span>
              <ExternalLink className="size-3 opacity-80" />
            </a>

            <a
              href="tel:+918169568582"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Phone className="size-4" />
              <span>Direct Call (+91 81695 68582)</span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 pt-1">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            <span>Direct contact with Yash Ramteke • Instant response</span>
          </div>
        </div>

      </div>
    </div>
  );
};
