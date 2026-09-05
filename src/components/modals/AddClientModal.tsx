import React, { useState } from 'react';
import { Plus, X, Globe, DollarSign, Calendar, Mail, Phone, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useClients } from '../../context/ClientContext';
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
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [billingType, setBillingType] = useState<'monthly_retainer' | 'one_time_build'>('monthly_retainer');
  const [tierPreset, setTierPreset] = useState<'basic' | 'advanced' | 'ai' | 'enterprise'>('basic');
  const [advancePaid, setAdvancePaid] = useState('6000');
  const [monthlyFee, setMonthlyFee] = useState('4000');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [billingCycleDay, setBillingCycleDay] = useState('5');
  const [hostingPlatform, setHostingPlatform] = useState('GitHub Pages / Vercel');
  const [notes, setNotes] = useState('');

  const handleTierChange = (tier: 'basic' | 'advanced' | 'ai' | 'enterprise') => {
    setTierPreset(tier);
    if (tier === 'basic') {
      setAdvancePaid('2500');
      setMonthlyFee('3000');
      setNotes('Basic WebApp (₹5,000 total: ₹2.5k advance). Hosted on GitHub/Vercel without domain.');
    } else if (tier === 'advanced') {
      setAdvancePaid('5000');
      setMonthlyFee('4000');
      setNotes('Advanced WebApp with DB (₹10,000 total: ₹5k advance). Hosted on Vercel/Render.');
    } else if (tier === 'ai') {
      setAdvancePaid('7500');
      setMonthlyFee('6000');
      setNotes('AI-Powered System (₹15,000 total: ₹7.5k advance). Flexible cloud deployment.');
    } else if (tier === 'enterprise') {
      setAdvancePaid('50000');
      setMonthlyFee('6000');
      setNotes('High-Value Enterprise Build (₹2,50,000 build + ₹6,000/mo retainer).');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const formattedNotes = `${notes || 'Custom Client WebApp'}. Advance Taken: ₹${advancePaid} to start work. Hosting: ${hostingPlatform}.`;

    addClient({
      name,
      company: company || name,
      email,
      phone: phone || '+91 81695 68582',
      websiteUrl: websiteUrl || 'https://opendev-labs.com',
      previewUrl: websiteUrl,
      billingType,
      monthlyFee: billingType === 'monthly_retainer' ? Number(monthlyFee) : 0,
      currency,
      billingCycleDay: Number(billingCycleDay),
      nextPaymentDue: `2026-09-${billingCycleDay.padStart(2, '0')}`,
      status: 'paid',
      notes: formattedNotes,
    });

    onOpenChange(false);
    // Reset form
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setWebsiteUrl('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6 bg-white border border-zinc-200 shadow-2xl rounded-3xl text-zinc-900 font-sans">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-200">
          <DialogTitle className="text-lg font-extrabold tracking-tight flex items-center gap-2 text-zinc-900">
            <Plus className="size-5 text-black" /> Add New Manual Client Partner
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3 text-xs">
          
          {/* Preset Tier Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-800">Quick Package Tier & Pricing Preset</label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleTierChange('basic')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  tierPreset === 'basic'
                    ? 'border-black bg-black text-white font-extrabold'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <span className="block text-[11px]">Basic</span>
                <span className="text-[9px] opacity-80 block">₹5,000</span>
              </button>

              <button
                type="button"
                onClick={() => handleTierChange('advanced')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  tierPreset === 'advanced'
                    ? 'border-black bg-black text-white font-extrabold'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <span className="block text-[11px]">Advanced</span>
                <span className="text-[9px] opacity-80 block">₹10,000</span>
              </button>

              <button
                type="button"
                onClick={() => handleTierChange('ai')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  tierPreset === 'ai'
                    ? 'border-black bg-black text-white font-extrabold'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <span className="block text-[11px]">AI System</span>
                <span className="text-[9px] opacity-80 block">₹15,000</span>
              </button>

              <button
                type="button"
                onClick={() => handleTierChange('enterprise')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  tierPreset === 'enterprise'
                    ? 'border-black bg-black text-white font-extrabold'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <span className="block text-[11px]">High Value</span>
                <span className="text-[9px] opacity-80 block">₹2,50,000</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-zinc-800">Client / Contact Person Name *</label>
            <Input
              required
              placeholder="e.g. Momhand Khawar"
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-10 bg-zinc-50 border-zinc-200 text-xs rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-800">Company Name</label>
              <Input
                placeholder="e.g. Elite-Trading Hub"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="h-10 bg-zinc-50 border-zinc-200 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-800">Client Email *</label>
              <Input
                required
                type="email"
                placeholder="client@elitetradinghub.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-10 bg-zinc-50 border-zinc-200 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-800">WhatsApp / Phone</label>
              <Input
                placeholder="+91 81695 68582"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="h-10 bg-zinc-50 border-zinc-200 text-xs rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-800">Website or Live Preview URL</label>
              <Input
                placeholder="https://elite-tradinghub.com"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                className="h-10 bg-zinc-50 border-zinc-200 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Flexible Hosting & Advance Payment Fields */}
          <div className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-extrabold text-zinc-800 text-[11px]">Advance Taken (₹ to Start Work)</label>
                <Input
                  type="number"
                  value={advancePaid}
                  onChange={e => setAdvancePaid(e.target.value)}
                  className="h-9 bg-white border-zinc-200 text-xs font-mono font-bold rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-zinc-800 text-[11px]">Hosting Environment</label>
                <select
                  value={hostingPlatform}
                  onChange={e => setHostingPlatform(e.target.value)}
                  className="w-full h-9 bg-white border border-zinc-200 text-xs rounded-xl px-2.5 font-medium"
                >
                  <option value="GitHub Pages / Vercel">GitHub / Vercel (No Domain)</option>
                  <option value="Render Cloud">Render Cloud Server</option>
                  <option value="Custom Domain (.com/.in)">Custom Hosted Domain</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-zinc-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-600">Monthly Retainer</label>
                <Input
                  type="number"
                  value={monthlyFee}
                  onChange={e => setMonthlyFee(e.target.value)}
                  className="h-8 bg-white border-zinc-200 text-xs font-mono font-bold rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-600">Currency</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value as any)}
                  className="w-full h-8 bg-white border border-zinc-200 text-xs rounded-lg px-2"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-600">Due Day (1-31)</label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={billingCycleDay}
                  onChange={e => setBillingCycleDay(e.target.value)}
                  className="h-8 bg-white border-zinc-200 text-xs font-mono font-bold rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-zinc-800">Project Notes & Details</label>
            <Input
              placeholder="e.g. ₹6k advance taken, remaining balance paid upon final delivery."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="h-10 bg-zinc-50 border-zinc-200 text-xs rounded-xl"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full text-xs">
              Cancel
            </Button>
            <Button type="submit" className="bg-black hover:bg-zinc-800 text-white font-extrabold rounded-full text-xs shadow-md">
              Save Manual Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
