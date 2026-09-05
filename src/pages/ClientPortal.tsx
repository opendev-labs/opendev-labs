import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Plus,
  HelpCircle,
  FileText,
  Clock,
  Phone,
  Mail,
  ReceiptText,
  Sparkles,
  Zap,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClients } from '../context/ClientContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';

export const ClientPortal: React.FC = () => {
  const { user } = useAuth();
  const { clients, tickets, addTicket, getRazorpayLink, invoices } = useClients();

  // Find client record for current logged in client (or default to client-1 Khawar)
  const client = clients.find(c => c.id === user?.clientId) || clients[0];

  const clientInvoices = invoices.filter(i => i.clientId === client.id);
  const clientTickets = tickets.filter(t => t.clientId === client.id);

  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim()) return;

    addTicket({
      clientId: client.id,
      clientName: client.name,
      title: ticketTitle,
      description: ticketDesc,
      priority: ticketPriority,
    });

    setTicketTitle('');
    setTicketDesc('');
    setTicketSuccess(true);
    setTimeout(() => setTicketSuccess(false), 4000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto text-zinc-900 font-sans"
    >
      {/* Executive Hero Banner */}
      <motion.div
        variants={itemVariants}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-black text-white relative overflow-hidden shadow-xl"
      >
        <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-30 z-0" particleCount={30} />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md">
                Verified Client Partner Portal
              </span>
              <span className="text-xs text-zinc-400 font-mono">ID: {client.id}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Welcome back, {client.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
              Official status for <span className="text-white font-bold">{client.company}</span>. Monitor live WebApp deployment, manage monthly retainer invoices, and trigger priority support.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href={getRazorpayLink(client)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-white hover:bg-zinc-100 text-black font-extrabold text-xs inline-flex items-center gap-2 shadow-lg transition-all"
            >
              <CreditCard className="size-4" /> Pay Monthly Retainer ({client.currency === 'INR' ? '₹' : '$'}{client.monthlyFee.toLocaleString()})
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Live Website Deployment & Billing Overview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Live WebApp Status */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-5 shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative flex size-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-3 bg-emerald-500" />
                </div>
                <span className="font-extrabold text-sm text-zinc-900 tracking-tight">Live WebApp Operational Status</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold text-[10px] uppercase tracking-wider">
                99.9% Monitored Uptime
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-extrabold block">
                  Hosted Live WebApp Domain
                </span>
                <a
                  href={client.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-extrabold text-zinc-900 hover:text-black inline-flex items-center gap-2 transition-colors truncate"
                >
                  {client.websiteUrl} <ExternalLink className="size-4 text-zinc-400" />
                </a>
                <p className="text-xs text-zinc-600 font-medium">
                  {client.notes || 'Full Support, Daily Cloud Backups & SSL Security Active.'}
                </p>
              </div>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={client.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full border border-zinc-300 bg-white hover:bg-zinc-100 text-xs font-extrabold text-zinc-900 shrink-0 text-center shadow-xs inline-flex items-center justify-center gap-1.5"
              >
                Launch WebApp <ArrowUpRight className="size-3.5" />
              </motion.a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                <span className="text-[9px] font-extrabold uppercase text-zinc-400 block">Response Time</span>
                <span className="text-xs font-mono font-extrabold text-zinc-900 mt-0.5 block">42ms</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                <span className="text-[9px] font-extrabold uppercase text-zinc-400 block">SSL Encryption</span>
                <span className="text-xs font-mono font-extrabold text-emerald-700 mt-0.5 block">TLS 1.3 Active</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                <span className="text-[9px] font-extrabold uppercase text-zinc-400 block">Backup Frequency</span>
                <span className="text-xs font-mono font-extrabold text-zinc-900 mt-0.5 block">Daily Automated</span>
              </div>
            </div>
          </motion.div>

          {/* Card: Monthly Retainer & Billing Overview */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-5 shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-zinc-900 flex items-center gap-2">
                <ReceiptText className="size-4 text-black" /> Monthly Retainer & Billing Overview
              </h3>
              <span className="text-xs font-extrabold text-zinc-500 font-mono">
                {client.billingType === 'monthly_retainer' ? 'Option 1: Monthly Retainer' : 'Option 2: Handover'}
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-400 uppercase font-mono font-extrabold block">Current Retainer Status</span>
                <div className="mt-1.5">
                  {client.status === 'paid' && (
                    <span className="text-emerald-700 font-extrabold text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                      <CheckCircle2 className="size-3.5" /> Retainer Paid
                    </span>
                  )}
                  {client.status === 'pending' && (
                    <span className="text-amber-700 font-extrabold text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
                      <Clock className="size-3.5" /> Payment Due Soon
                    </span>
                  )}
                  {client.status === 'overdue' && (
                    <span className="text-red-700 font-extrabold text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200">
                      <AlertTriangle className="size-3.5" /> Invoice Overdue
                    </span>
                  )}
                  {client.status === 'offboarded' && (
                    <span className="text-zinc-600 font-extrabold text-xs">One-Time Build</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-400 uppercase font-mono font-extrabold block">Monthly Maintenance Fee</span>
                <span className="text-base font-extrabold text-zinc-900 font-mono mt-1 block">
                  {client.currency === 'INR' ? '₹' : '$'}{client.monthlyFee.toLocaleString()}/mo
                </span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-400 uppercase font-mono font-extrabold block">Next Billing Date</span>
                <span className="text-sm font-extrabold text-zinc-900 font-mono mt-1 block">
                  {client.nextPaymentDue}
                </span>
              </div>
            </div>

            {/* Direct Razorpay Gateway Link */}
            <div className="p-4 rounded-2xl bg-zinc-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="space-y-1 text-center sm:text-left">
                <span className="font-extrabold text-xs block text-white flex items-center justify-center sm:justify-start gap-1.5">
                  <CreditCard className="size-4 text-emerald-400" /> Instant Online Razorpay Gateway
                </span>
                <p className="text-zinc-400 text-[11px] font-medium">
                  Instant receipt generation. Supports UPI, NetBanking, Credit Cards, & Debit Cards.
                </p>
              </div>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={getRazorpayLink(client)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-black hover:bg-zinc-100 font-extrabold text-xs inline-flex items-center justify-center gap-2 shrink-0 shadow-sm"
              >
                Pay {client.currency === 'INR' ? '₹' : '$'}{client.monthlyFee.toLocaleString()} Online
              </motion.a>
            </div>
          </motion.div>

          {/* Card: Support Tickets */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-4 shadow-sm transition-all"
          >
            <h3 className="text-sm font-extrabold text-zinc-900 flex items-center gap-2">
              <HelpCircle className="size-4 text-black" /> Maintenance & Feature Requests
            </h3>

            {clientTickets.length > 0 ? (
              <div className="space-y-3">
                {clientTickets.map(ticket => (
                  <div key={ticket.id} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="font-extrabold text-xs text-zinc-900 block">{ticket.title}</span>
                      <p className="text-xs text-zinc-600 font-medium">{ticket.description}</p>
                      <span className="text-[10px] text-zinc-400 block font-mono">Submitted: {ticket.createdAt}</span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-800 text-[10px] font-extrabold uppercase shrink-0">
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl border border-zinc-200 font-medium">
                No active maintenance tickets. Your application is operating smoothly.
              </div>
            )}
          </motion.div>

        </div>

        {/* Right 1 Col: Submit Ticket & Lead Developer Contact */}
        <div className="space-y-6">
          
          {/* Form Card: Submit Maintenance Ticket */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-4 shadow-sm"
          >
            <h3 className="text-sm font-extrabold text-zinc-900 flex items-center gap-2">
              <Plus className="size-4 text-black" /> Submit Maintenance Request
            </h3>

            {ticketSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2"
              >
                <CheckCircle2 className="size-4 text-emerald-600" /> Maintenance ticket submitted to Yash Ramteke!
              </motion.div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700">Request Title</label>
                <Input
                  placeholder="e.g., Update promotional banner, API update"
                  value={ticketTitle}
                  onChange={e => setTicketTitle(e.target.value)}
                  className="h-10 bg-zinc-50 border-zinc-200 text-zinc-900 text-xs rounded-xl focus:border-black"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700">Details / Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your update request..."
                  value={ticketDesc}
                  onChange={e => setTicketDesc(e.target.value)}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs rounded-xl focus:outline-none focus:border-black font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700">Priority Level</label>
                <select
                  value={ticketPriority}
                  onChange={e => setTicketPriority(e.target.value as any)}
                  className="w-full h-10 bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs rounded-xl px-3 font-medium"
                >
                  <option value="low">Low - Standard cosmetic edit</option>
                  <option value="medium">Medium - Normal feature update</option>
                  <option value="high">High - Critical urgent issue</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-black hover:bg-zinc-800 text-white font-extrabold text-xs rounded-full shadow-xs transition-all"
              >
                Submit Ticket to Developer
              </Button>
            </form>
          </motion.div>

          {/* Lead Developer Direct Contact Card */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-4 shadow-sm"
          >
            <h3 className="text-sm font-extrabold text-zinc-900 flex items-center gap-2">
              <Mail className="size-4 text-black" /> Lead Developer Contact
            </h3>
            
            <div className="space-y-2.5 text-xs font-mono text-zinc-700">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                <Mail className="size-4 text-zinc-500 shrink-0" />
                <span className="truncate">opendev.office@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                <Phone className="size-4 text-zinc-500 shrink-0" />
                <span>+91 81695 68582</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed font-medium pt-1">
              Direct engineering support maintained by Lead Architect Yash Shirish Ramteke under OpenDev-Labs.
            </p>
          </motion.div>

        </div>

      </div>
    </motion.div>
  );
};
