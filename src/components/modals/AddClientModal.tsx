import React, { useState } from 'react';
import { Plus, X, Globe, DollarSign, Calendar, Mail, Phone, Building, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useClients } from '../../context/ClientContext';
import { WebsiteStatus } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ open, onOpenChange }) => {
  const { addClient } = useClients();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [domain, setDomain] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [websiteStatus, setWebsiteStatus] = useState<WebsiteStatus>('under-development');
  const [advancePaidStatus, setAdvancePaidStatus] = useState<'paid' | 'pending'>('paid');
  const [advanceAmount, setAdvanceAmount] = useState('5000');
  
  const [billingType, setBillingType] = useState<'monthly_retainer' | 'one_time_build'>('monthly_retainer');
  const [monthlyFee, setMonthlyFee] = useState('4000');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [billingCycleDay, setBillingCycleDay] = useState('5');
  const [razorpayPaymentLink, setRazorpayPaymentLink] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const finalWebsiteUrl = websiteUrl.trim() || (domain ? `https://${domain.replace(/^https?:\/\//, '')}` : 'https://opendev-labs.com');
    const finalDomain = domain.trim() || finalWebsiteUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

    addClient({
      name,
      company: company || name,
      email,
      phone: phone || '+91 81695 68582',
      websiteUrl: finalWebsiteUrl,
      domain: finalDomain,
      websiteStatus,
      advancePaid: advancePaidStatus === 'paid',
      advanceAmount: Number(advanceAmount) || 0,
      previewUrl: finalWebsiteUrl,
      billingType,
      monthlyFee: billingType === 'monthly_retainer' ? Number(monthlyFee) : 0,
      currency,
      billingCycleDay: Number(billingCycleDay),
      nextPaymentDue: `2026-09-${billingCycleDay.padStart(2, '0')}`,
      status: 'paid',
      razorpayPaymentLink: razorpayPaymentLink || `https://rzp.io/l/opendev-${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      notes: notes || `Website Status: ${websiteStatus}. Advance: ${advancePaidStatus === 'paid' ? 'Paid' : 'Pending'} (₹${advanceAmount}).`,
    });

    onOpenChange(false);
    // Reset form
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setDomain('');
    setWebsiteUrl('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl text-zinc-900 dark:text-zinc-100 font-sans">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
          <DialogTitle className="text-lg font-extrabold tracking-tight flex items-center gap-2 text-zinc-900 dark:text-white">
            <Plus className="size-5 text-black dark:text-white" /> Add New Manual Client Partner
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-800 dark:text-zinc-200">Client / Contact Person Name *</label>
            <Input
              required
              placeholder="e.g. Yash Sharma"
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-800 dark:text-zinc-200">Company Name</label>
              <Input
                placeholder="e.g. Apex Traders"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-800 dark:text-zinc-200">Client Email *</label>
              <Input
                required
                type="email"
                placeholder="client@apex.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-800 dark:text-zinc-200">WhatsApp / Phone</label>
              <Input
                placeholder="+91 81695 68582"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-800 dark:text-zinc-200">Client Domain Name</label>
              <Input
                placeholder="e.g. apextraders.com"
                value={domain}
                onChange={e => {
                  setDomain(e.target.value);
                  setWebsiteUrl(`https://${e.target.value.replace(/^https?:\/\//, '')}`);
                }}
                className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Website Project Status & Advance Payment Details */}
          <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-extrabold text-zinc-800 dark:text-zinc-200 text-[11px]">Website Status *</label>
                <select
                  value={websiteStatus}
                  onChange={e => setWebsiteStatus(e.target.value as WebsiteStatus)}
                  className="w-full h-9 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs rounded-xl px-2.5 font-bold"
                >
                  <option value="under-development">🔨 Under Development</option>
                  <option value="under-maintenance">🛠️ Under Maintenance</option>
                  <option value="completed">✅ Completed (No Retainer)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-zinc-800 dark:text-zinc-200 text-[11px]">Advance Payment</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={advancePaidStatus}
                    onChange={e => setAdvancePaidStatus(e.target.value as any)}
                    className="h-9 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs rounded-xl px-1.5 font-medium"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                  <Input
                    type="number"
                    placeholder="Advance ₹"
                    value={advanceAmount}
                    onChange={e => setAdvanceAmount(e.target.value)}
                    className="h-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Monthly Retainer Setup */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">Monthly Retainer</label>
                <Input
                  type="number"
                  value={monthlyFee}
                  onChange={e => setMonthlyFee(e.target.value)}
                  className="h-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">Currency</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value as any)}
                  className="w-full h-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs rounded-lg px-2"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">Billing Day (1-31)</label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={billingCycleDay}
                  onChange={e => setBillingCycleDay(e.target.value)}
                  className="h-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-zinc-800 dark:text-zinc-200">Project Notes & Specifications</label>
            <Input
              placeholder="e.g. Custom web application build with payment gateway integration."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full text-xs">
              Cancel
            </Button>
            <Button type="submit" className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold rounded-full text-xs shadow-md">
              Save Manual Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
