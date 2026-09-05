import React, { useState } from 'react';
import {
  ReceiptText,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building,
  ExternalLink
} from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { Invoice } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

export const InvoicesPage: React.FC = () => {
  const { clients, invoices, generateInvoice } = useClients();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto text-zinc-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-2">
            <ReceiptText className="size-6 text-black" /> Invoices & Ledger
          </h1>
          <p className="text-xs text-zinc-600 mt-1 font-medium">
            Automated monthly invoices and payment receipts for client hosting & development services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {clients.length > 0 && (
            <Button
              onClick={() => generateInvoice(clients[0].id)}
              className="bg-black hover:bg-zinc-800 text-white font-extrabold text-xs gap-1.5 h-9 rounded-full px-5 shadow-xs"
            >
              <Plus className="size-4" /> Quick Generate Invoice
            </Button>
          )}
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase text-[10px]">
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
            <tbody className="divide-y divide-zinc-100 bg-white">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-zinc-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-zinc-900">{inv.clientName}</span>
                      <span className="text-[10px] text-zinc-500 font-medium">{inv.clientEmail}</span>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-600 font-mono">{inv.issueDate}</td>
                  <td className="p-4 text-zinc-600 font-mono">{inv.dueDate}</td>
                  <td className="p-4 font-mono font-bold text-zinc-900">
                    ₹{inv.amount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    {inv.status === 'paid' && (
                      <span className="px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold">
                        PAID
                      </span>
                    )}
                    {inv.status === 'unpaid' && (
                      <span className="px-2.5 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-extrabold">
                        UNPAID
                      </span>
                    )}
                    {inv.status === 'overdue' && (
                      <span className="px-2.5 py-0.5 rounded-full border border-red-200 bg-red-50 text-red-700 text-[10px] font-extrabold">
                        OVERDUE
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedInvoice(inv)}
                      className="h-8 text-xs font-bold border-zinc-200 text-zinc-900 hover:bg-zinc-100 rounded-lg"
                    >
                      View Invoice
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <Dialog open={!!selectedInvoice} onOpenChange={open => !open && setSelectedInvoice(null)}>
          <DialogContent className="max-w-2xl p-8 bg-white border border-zinc-200 text-zinc-900 shadow-2xl rounded-3xl">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 pb-6">
                <div className="flex items-center gap-3">
                  <img src="/logo-icon.webp" alt="OpenDev-Labs" className="h-9 w-auto object-contain shrink-0" />
                  <div>
                    <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">OpenDev-Labs</h2>
                    <p className="text-xs text-zinc-500 font-medium">Software Engineering & Managed Hosting by Yash Ramteke</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl font-mono font-extrabold text-zinc-900">{selectedInvoice.invoiceNumber}</span>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">Date: {selectedInvoice.issueDate}</p>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <span className="font-extrabold text-zinc-500 uppercase text-[10px] block mb-1">Billed To:</span>
                  <p className="font-extrabold text-zinc-900 text-sm">{selectedInvoice.clientName}</p>
                  <p className="text-zinc-600 font-medium">{selectedInvoice.clientEmail}</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-right">
                  <span className="font-extrabold text-zinc-500 uppercase text-[10px] block mb-1">Payment Status:</span>
                  <span className="font-extrabold text-sm uppercase text-emerald-700">{selectedInvoice.status}</span>
                  <p className="text-zinc-600 font-medium">Due Date: {selectedInvoice.dueDate}</p>
                </div>
              </div>

              {/* Items */}
              <div className="border border-zinc-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 font-bold uppercase text-[10px] text-zinc-500">
                    <tr>
                      <th className="p-3.5">Service Description</th>
                      <th className="p-3.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 bg-white">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3.5 font-bold text-zinc-900">{item.description}</td>
                        <td className="p-3.5 font-mono font-bold text-right text-zinc-900">
                          ₹{item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-zinc-50 border-t border-zinc-200 font-bold">
                    <tr>
                      <td className="p-3.5 text-right text-zinc-500 font-bold">Total Amount Due:</td>
                      <td className="p-3.5 text-right text-lg font-mono text-black font-extrabold">
                        ₹{selectedInvoice.amount.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
                <span className="text-[11px] text-zinc-500 font-medium">
                  Pay online via Razorpay or UPI link provided by Yash Ramteke.
                </span>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1 text-xs border-zinc-300 rounded-full">
                    <Printer className="size-3.5" /> Print / Save PDF
                  </Button>
                  <Button size="sm" onClick={() => setSelectedInvoice(null)} className="text-xs bg-black text-white hover:bg-zinc-800 rounded-full px-4">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
