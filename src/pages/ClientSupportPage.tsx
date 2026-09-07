import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  HelpCircle,
  Send,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClients } from '../context/ClientContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';

export const ClientSupportPage: React.FC = () => {
  const { user } = useAuth();
  const { clients, tickets, addTicket } = useClients();

  const client = clients.find(c => c.id === user?.clientId);
  const clientTickets = client ? tickets.filter(t => t.clientId === client.id) : [];

  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim()) return;

    addTicket({
      clientId: client?.id || `user-${user?.id || 'temp'}`,
      clientName: client?.name || user?.name || user?.email.split('@')[0] || 'User',
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
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans"
    >
      {/* Page Header */}
      <motion.div
        variants={itemVariants}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-black text-white relative overflow-hidden shadow-xl"
      >
        <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-30 z-0" particleCount={30} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md">
                Priority Technical Desk
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Support & Maintenance Tickets
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
              Submit issue reports, feature requests, or design tweaks directly to Lead Architect Yash Ramteke.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Create Ticket Form Card */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-sm"
          >
            <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Wrench className="size-5 text-black dark:text-white" /> Open New Support Ticket
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Specify your issue or requested software change below.
            </p>

            {ticketSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" /> Ticket submitted to Yash Ramteke!
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Ticket Subject / Title</label>
                  <Input
                    placeholder="e.g., Update banner logo and SSL error fix..."
                    value={ticketTitle}
                    onChange={e => setTicketTitle(e.target.value)}
                    className="h-11 bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs rounded-xl font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Priority Level</label>
                  <select
                    value={ticketPriority}
                    onChange={e => setTicketPriority(e.target.value as any)}
                    className="w-full h-11 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl font-medium"
                  >
                    <option value="low">Low (Standard Update)</option>
                    <option value="medium">Medium (Moderate Bug)</option>
                    <option value="high">High (Critical Urgent)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Detailed Description & Expected Outcome</label>
                <textarea
                  rows={4}
                  placeholder="Describe the issue, steps to reproduce, or requested changes..."
                  value={ticketDesc}
                  onChange={e => setTicketDesc(e.target.value)}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs rounded-xl focus:outline-none focus:border-black dark:focus:border-white font-medium"
                />
              </div>

              <Button
                type="submit"
                className="px-6 h-11 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Send className="size-3.5" /> Submit Support Ticket
              </Button>
            </form>
          </motion.div>

          {/* Ticket History */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-sm"
          >
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="size-4 text-black dark:text-white" /> Ticket History & Status
            </h3>

            {clientTickets.length === 0 ? (
              <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-center text-xs text-zinc-500 font-medium">
                No support tickets submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {clientTickets.map(tkt => (
                  <div
                    key={tkt.id}
                    className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-zinc-400 text-[11px]">{tkt.id}</span>
                        <h4 className="font-bold text-zinc-900 dark:text-white">{tkt.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            tkt.priority === 'high'
                              ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                              : tkt.priority === 'medium'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          }`}
                        >
                          {tkt.priority} Priority
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            tkt.status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : tkt.status === 'in_progress'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                              : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                          }`}
                        >
                          {tkt.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    {tkt.description && (
                      <p className="text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
                        {tkt.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right SLA Card */}
        <div className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-sm"
          >
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500" /> Maintenance & SLA Guarantees
            </h3>
            <ul className="space-y-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" /> Response within 4 to 12 hours for critical issues
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" /> Direct handling by Lead Architect Yash Ramteke
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" /> Includes daily backups & security patch management
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
