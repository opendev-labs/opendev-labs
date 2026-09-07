import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ReceiptText,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building,
  ExternalLink,
  Send
} from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { Invoice } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Live2DCanvas } from '../components/ui/Live2DCanvas';

export const InvoicesPage: React.FC = () => {
  const { clients, invoices, generateInvoice, getWhatsAppReminderUrl } = useClients();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateForSelected = () => {
    if (!selectedClientId) return;
    generateInvoice(selectedClientId);
  };

  const getInvoiceWhatsAppUrl = (inv: Invoice) => {
    const matchedClient = clients.find(c => c.id === inv.clientId);
    const clientPhone = matchedClient?.phone?.replace(/[^0-9]/g, '') || '918169568582';
    const msg = `Hello ${inv.clientName} 👋, here is your invoice statement ${inv.invoiceNumber} from OpenDev-Labs (www.opendev-labs.com).\n\nTotal Amount: ${inv.currency === 'INR' ? '₹' : '$'}${inv.amount.toLocaleString()}\nDue Date: ${inv.dueDate}\nStatus: ${inv.status.toUpperCase()}\n\nPay online via Razorpay: ${matchedClient?.razorpayPaymentLink || 'https://opendev-labs.com/client/portal'}\n\nWork Mail: opendev.office@gmail.com | Phone: +91 81695 68582`;
    return `https://wa.me/${clientPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans">
      
      {/* Executive Hero Banner Card (Black Rectangle Welcome Card Style) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-black text-white relative overflow-hidden shadow-xl"
      >
        <Live2DCanvas className="absolute inset-0 pointer-events-none opacity-30 z-0" particleCount={30} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-extrabold tracking-wider uppercase backdrop-blur-md">
                Official Billing Ledger
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Invoices & Financial Receipts
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">
              Automated monthly invoices and official payment receipts for client hosting & development retainers.
            </p>
          </div>

          {clients.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <select
                value={selectedClientId}
                onChange={e => setSelectedClientId(e.target.value)}
                className="h-10 bg-zinc-800 border border-zinc-700 text-white text-xs font-bold rounded-full px-4 focus:outline-none"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company})
                  </option>
                ))}
              </select>

              <Button
                onClick={handleGenerateForSelected}
                className="bg-white text-black hover:bg-zinc-100 font-extrabold text-xs gap-1.5 h-10 rounded-full px-5 shadow-lg shrink-0"
              >
                <Plus className="size-4" /> Generate Invoice
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Invoices List Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Issue Date</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Invoice Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-zinc-900 dark:text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="p-4 font-extrabold text-zinc-900 dark:text-white">
                    {inv.clientName}
                  </td>
                  <td className="p-4 text-zinc-500 font-mono">
                    {inv.issueDate}
                  </td>
                  <td className="p-4 text-zinc-500 font-mono">
                    {inv.dueDate}
                  </td>
                  <td className="p-4 font-mono font-extrabold text-zinc-900 dark:text-white">
                    {inv.currency === 'INR' ? '₹' : '$'}{inv.amount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : inv.status === 'overdue'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedInvoice(inv)}
                        className="h-8 px-3 text-[11px] font-extrabold rounded-full border-zinc-300 dark:border-zinc-700"
                      >
                        View Receipt
                      </Button>
                      <a
                        href={getInvoiceWhatsAppUrl(inv)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                        title="Send Invoice PDF Link via WhatsApp"
                      >
                        <Send className="size-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Dialog Modal */}
      {selectedInvoice && (
        <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
          <DialogContent className="max-w-2xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white p-6 sm:p-8 rounded-3xl">
            <DialogHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ReceiptText className="size-6 text-black dark:text-white" />
                  <DialogTitle className="text-xl font-extrabold font-mono">
                    {selectedInvoice.invoiceNumber}
                  </DialogTitle>
                </div>
                <div className="flex items-center gap-2 print:hidden">
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="h-8 px-3 text-xs font-bold rounded-full gap-1"
                  >
                    <Printer className="size-3.5" /> Print / Save PDF
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="py-6 space-y-6 text-xs">
              {/* Invoice Top Header Info */}
              <div className="grid sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">Billed From:</span>
                  <span className="font-extrabold text-sm text-zinc-900 dark:text-white block mt-0.5">OpenDev-Labs</span>
                  <span className="text-zinc-500 font-mono text-[11px] block">Lead Architect: Yash Shirish Ramteke</span>
                  <span className="text-zinc-500 font-mono text-[11px] block">opendev.office@gmail.com</span>
                  <span className="text-zinc-500 font-mono text-[11px] block">+91 81695 68582</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block">Billed To:</span>
                  <span className="font-extrabold text-sm text-zinc-900 dark:text-white block mt-0.5">{selectedInvoice.clientName}</span>
                  <span className="text-zinc-500 font-mono text-[11px] block">{selectedInvoice.clientEmail}</span>
                  <span className="text-zinc-500 font-mono text-[11px] block">Issue Date: {selectedInvoice.issueDate}</span>
                  <span className="text-zinc-500 font-mono text-[11px] block">Due Date: {selectedInvoice.dueDate}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 font-bold uppercase text-[10px] text-zinc-500">
                    <tr>
                      <th className="p-3">Service Description</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-medium text-zinc-800 dark:text-zinc-200">
                          {item.description}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-zinc-900 dark:text-white">
                          {selectedInvoice.currency === 'INR' ? '₹' : '$'}{item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Footer */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black">
                <span className="font-extrabold text-xs uppercase tracking-wider">Total Amount Due</span>
                <span className="font-mono text-xl font-extrabold">
                  {selectedInvoice.currency === 'INR' ? '₹' : '$'}{selectedInvoice.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
