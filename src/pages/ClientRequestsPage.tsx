import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KeyRound,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Globe,
  User,
  Mail,
  ShieldCheck,
  Send,
  Trash2,
  Copy,
  Check,
  Building,
  RefreshCw,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  DollarSign,
  Monitor,
  Layout,
  Layers,
  CheckSquare
} from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { ProjectRequest, Client } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';

export const ClientRequestsPage: React.FC = () => {
  const {
    projectRequests,
    clients,
    approveProjectRequest,
    rejectProjectRequest,
    deleteProjectRequest,
    generateClientCredentials,
    deleteClient
  } = useClients();

  // Generator Form State
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [clientCode, setClientCode] = useState('');
  const [password, setPassword] = useState('client123');
  const [monthlyFee, setMonthlyFee] = useState('45000');
  const [company, setCompany] = useState('');

  // Rich Status & Preview Fields
  const [workStatus, setWorkStatus] = useState<'waiting_for_approval' | 'work_started' | 'in_progress' | 'testing_preview' | 'completed'>('work_started');
  const [advancePaid, setAdvancePaid] = useState<boolean>(true);
  const [advanceAmount, setAdvanceAmount] = useState<string>('25000');
  const [totalBill, setTotalBill] = useState<string>('70000');
  const [livePreviewUrl, setLivePreviewUrl] = useState<string>('');
  const [devPreviewUrl, setDevPreviewUrl] = useState<string>('');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_review' | 'accepted' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle auto-populating generator form from a request
  const handleSelectRequestToApprove = (req: ProjectRequest) => {
    setSelectedRequestId(req.id);
    setClientName(req.userName);
    setClientEmail(req.userEmail);
    const cleanDomain = (req.requestedDomain || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    setDomain(cleanDomain);
    
    // Auto-generate code based on user name/domain
    const namePrefix = (req.userName || 'CLIENT').replace(/[^a-zA-Z]/g, '').substring(0, 5).toUpperCase();
    const randDigits = Math.floor(1000 + Math.random() * 9000);
    setClientCode(req.assignedCode || `${namePrefix}${randDigits}`);
    setPassword(req.assignedPassword || 'client123');
    setCompany(`${req.userName}'s Company`);
    setLivePreviewUrl(`https://${cleanDomain}`);
    setDevPreviewUrl(`https://${cleanDomain.split('.')[0]}-dev.vercel.app`);
  };

  const handleGenerateRandomCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let prefix = '';
    for (let i = 0; i < 4; i++) {
      prefix += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    const year = new Date().getFullYear();
    setClientCode(`${prefix}${year}`);
  };

  const handleApproveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientCode || !domain) {
      alert('Client Code and Domain are required!');
      return;
    }

    const cleanCode = clientCode.trim().toUpperCase();
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const cleanPass = password.trim() || 'client123';
    const liveUrl = livePreviewUrl.trim() || `https://${cleanDomain}`;
    const devUrl = devPreviewUrl.trim() || `https://${cleanDomain.split('.')[0]}-dev.vercel.app`;

    generateClientCredentials({
      name: clientName || cleanDomain.split('.')[0],
      email: clientEmail || `client@${cleanDomain}`,
      domain: cleanDomain,
      clientCode: cleanCode,
      password: cleanPass,
      monthlyFee: Number(monthlyFee) || 45000,
      company: company || `${clientName || cleanDomain}'s Organization`,
      workStatus,
      progressPercentage: workStatus === 'completed' ? 100 : workStatus === 'testing_preview' ? 85 : workStatus === 'work_started' ? 50 : 25,
      advancePaid,
      advanceAmount: Number(advanceAmount) || 0,
      totalBill: Number(totalBill) || 70000,
      livePreviewUrl: liveUrl,
      devPreviewUrl: devUrl,
      maintenanceStatus: 'paid',
      domainStatus: 'active',
    });

    if (selectedRequestId) {
      approveProjectRequest(selectedRequestId, cleanCode, cleanDomain, cleanPass);
    }

    setSuccessMessage(`Client credentials created for ${cleanDomain}! Access Code: ${cleanCode}`);
    setTimeout(() => setSuccessMessage(''), 6000);

    // Reset Form
    setSelectedRequestId('');
    setClientName('');
    setClientEmail('');
    setDomain('');
    setClientCode('');
    setPassword('client123');
    setCompany('');
    setLivePreviewUrl('');
    setDevPreviewUrl('');
  };

  const handleCopyCredentials = (c: Client) => {
    const snippet = `OPENDEV CLIENT CREDENTIALS:\nDomain: ${c.domain || c.websiteUrl}\nClient Code: ${c.clientCode || 'ELITE2026'}\nPassword: ${c.password || 'client123'}\nLive Production URL: ${c.livePreviewUrl || c.websiteUrl}\nDev Preview URL: ${c.devPreviewUrl || 'https://vercel.app'}\nPortal URL: https://opendev-labs.com/client/convert`;
    navigator.clipboard.writeText(snippet);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  // Filter requests
  const filteredRequests = projectRequests.filter(req => {
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesSearch =
      req.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requestedDomain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = projectRequests.filter(r => r.status === 'pending_review').length;

  return (
    <div className="p-3 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-8 text-zinc-900 dark:text-zinc-100 font-sans">
      
      {/* 1. Minimalist Google / Microsoft Level Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-wider border border-blue-200 dark:border-blue-900">
              Admin Gateway • Code & Credentials
            </span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px] font-bold animate-pulse">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <KeyRound className="size-6 text-blue-600 dark:text-blue-400 shrink-0" /> Client Requests & Credentials Generator
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Approve requests, set domain names, work status, advance payments, and preview URLs.
          </p>
        </div>

        {/* Inline Minimal Stats Pills */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs flex items-center gap-2">
            <span className="text-zinc-500 text-[11px]">Pending Requests:</span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400">{pendingCount}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs flex items-center gap-2">
            <span className="text-zinc-500 text-[11px]">Master Key:</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px]">ADMIN123</span>
          </div>
        </div>
      </motion.div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="p-1 text-emerald-600 hover:text-emerald-900">
            <XCircle className="size-4" />
          </button>
        </motion.div>
      )}

      {/* 2. MAIN GENERATOR & REQUESTS CONTENT SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: CLIENT-CODE GENERATOR FORM CARD (5 Cols) */}
        <div className="xl:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-wider border border-blue-200 dark:border-blue-900 inline-block mb-1">
                Admin Code Generator
              </span>
              <h2 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <Sparkles className="size-4 text-blue-500" /> Generate Client Credentials
              </h2>
            </div>

            {selectedRequestId && (
              <span className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                Approving Request
              </span>
            )}
          </div>

          <form onSubmit={handleApproveSubmit} className="space-y-4 text-xs">
            
            {/* Optional Request Auto-Fill Selector */}
            {projectRequests.length > 0 && (
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">
                  Select User Request to Approve
                </label>
                <select
                  value={selectedRequestId}
                  onChange={e => {
                    const req = projectRequests.find(r => r.id === e.target.value);
                    if (req) {
                      handleSelectRequestToApprove(req);
                    } else {
                      setSelectedRequestId('');
                    }
                  }}
                  className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">-- Create New / Select Pending Request --</option>
                  {projectRequests.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.userName} ({r.userEmail}) - {r.requestedDomain} [{r.status}]
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Client Name & Email */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Client Name *</label>
                <Input
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Client Email *</label>
                <Input
                  required
                  type="email"
                  placeholder="client@domain.com"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl"
                />
              </div>
            </div>

            {/* DOMAIN NAME INPUT (Explicitly Domain, Not Email) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-zinc-800 dark:text-zinc-200">
                  Client Domain Name <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Domain (Not Email)</span>
              </div>
              <Input
                required
                placeholder="e.g. elite-tradinghub.com"
                value={domain}
                onChange={e => {
                  setDomain(e.target.value);
                  if (!livePreviewUrl) setLivePreviewUrl(`https://${e.target.value.replace(/^https?:\/\//, '')}`);
                  if (!devPreviewUrl) setDevPreviewUrl(`https://${e.target.value.split('.')[0]}-dev.vercel.app`);
                }}
                className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 font-mono text-xs rounded-xl font-bold text-blue-600 dark:text-blue-400"
              />
            </div>

            {/* CLIENT CODE & PASSWORD */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-zinc-800 dark:text-zinc-200">
                    Client Code <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomCode}
                    className="text-[9px] font-bold text-indigo-600 hover:underline"
                  >
                    Auto
                  </button>
                </div>
                <Input
                  required
                  placeholder="ELITE2026"
                  value={clientCode}
                  onChange={e => setClientCode(e.target.value.toUpperCase())}
                  className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 font-mono text-xs font-black text-amber-600 dark:text-amber-400 tracking-wider rounded-xl uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-800 dark:text-zinc-200">Password</label>
                <Input
                  type="text"
                  placeholder="client123"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 font-mono text-xs font-bold rounded-xl"
                />
              </div>
            </div>

            {/* WORK STATUS & PROGRESS */}
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-800 dark:text-zinc-200">Website Project Work Status</label>
              <select
                value={workStatus}
                onChange={e => setWorkStatus(e.target.value as any)}
                className="w-full h-10 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-zinc-900 dark:text-white"
              >
                <option value="waiting_for_approval">⏳ Waiting for Approval (25% Progress)</option>
                <option value="work_started">🔨 Work Started / In Progress (50% Progress)</option>
                <option value="testing_preview">🧪 Testing & Vercel Staging (85% Progress)</option>
                <option value="completed">🟢 Completed & Live Production (100% Progress)</option>
              </select>
            </div>

            {/* ADVANCE PAYMENT CHECKBOX & RECEIVED AMOUNT */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={advancePaid}
                    onChange={e => setAdvancePaid(e.target.checked)}
                    className="size-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Tick Mark: Advance Payment Received</span>
                </label>
                {advancePaid && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px] uppercase">
                    Received
                  </span>
                )}
              </div>

              {advancePaid && (
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 text-[11px]">
                    Advance Received Money Amount (₹ INR)
                  </label>
                  <Input
                    type="number"
                    placeholder="25000"
                    value={advanceAmount}
                    onChange={e => setAdvanceAmount(e.target.value)}
                    className="h-9 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600 font-bold text-emerald-600 dark:text-emerald-400 text-xs rounded-xl"
                  />
                </div>
              )}
            </div>

            {/* TOTAL BILL & MONTHLY MAINTENANCE RETAINER */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Total Bill (₹ INR)</label>
                <Input
                  type="number"
                  placeholder="70000"
                  value={totalBill}
                  onChange={e => setTotalBill(e.target.value)}
                  className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Monthly Retainer (₹)</label>
                <Input
                  type="number"
                  placeholder="45000"
                  value={monthlyFee}
                  onChange={e => setMonthlyFee(e.target.value)}
                  className="h-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl font-bold"
                />
              </div>
            </div>

            {/* PREVIEW URLS: MINI SCREEN 1 (.com) & MINI SCREEN 2 (.vercel.app) */}
            <div className="space-y-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
              <span className="font-extrabold text-[11px] text-zinc-500 uppercase tracking-wider block">
                Two Mini Screen Preview Links
              </span>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <Globe className="size-3.5 text-blue-500" /> Live Production URL (.com)
                </label>
                <Input
                  placeholder="https://elite-tradinghub.com"
                  value={livePreviewUrl}
                  onChange={e => setLivePreviewUrl(e.target.value)}
                  className="h-9 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl font-mono text-blue-600 dark:text-blue-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <Monitor className="size-3.5 text-purple-500" /> Development Preview URL (.vercel.app)
                </label>
                <Input
                  placeholder="https://elite-trading-dev.vercel.app"
                  value={devPreviewUrl}
                  onChange={e => setDevPreviewUrl(e.target.value)}
                  className="h-9 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl font-mono text-purple-600 dark:text-purple-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="size-4" />
                <span>{selectedRequestId ? 'Approve Request & Issue Code' : 'Save Client Setup & Code'}</span>
              </Button>
            </div>

          </form>
        </div>

        {/* RIGHT COLUMN: PENDING REQUESTS & GENERATED CODES DIRECTORY (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* A. PENDING CLIENT ACCESS REQUESTS LIST */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-wider border border-amber-200 dark:border-amber-900 inline-block mb-1">
                  User Submissions
                </span>
                <h2 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Clock className="size-4 text-amber-500" /> Pending Client Access Requests ({projectRequests.length})
                </h2>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-bold self-start">
                {(['all', 'pending_review', 'accepted', 'rejected'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                      statusFilter === tab
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-black'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    {tab === 'pending_review' ? 'Pending' : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Requests Cards List */}
            {filteredRequests.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <KeyRound className="size-8 text-zinc-400 mx-auto" />
                <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">No client requests found in this view.</p>
                <p className="text-[11px] text-zinc-400">Requests submitted by users from their profile page will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map(req => {
                  const isPending = req.status === 'pending_review';
                  const isApproved = req.status === 'accepted' || req.status === 'client_converted';
                  return (
                    <div
                      key={req.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                        isPending
                          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                          : isApproved
                          ? 'bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-900/40'
                          : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      {/* Top Bar: Requester & Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold text-xs flex items-center justify-center shrink-0">
                            {req.userName ? req.userName.charAt(0) : 'U'}
                          </div>
                          <div>
                            <span className="text-sm font-extrabold text-zinc-900 dark:text-white block">
                              {req.userName}
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-medium">
                              {req.userEmail}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            isPending
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                              : isApproved
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      {/* Request Specifications */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div className="bg-white/80 dark:bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                          <span className="text-[10px] text-zinc-400 font-bold block uppercase">Requested Domain</span>
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400 truncate block">
                            {req.requestedDomain}
                          </span>
                        </div>

                        <div className="bg-white/80 dark:bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                          <span className="text-[10px] text-zinc-400 font-bold block uppercase">Assigned Access Code</span>
                          <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400 block">
                            {req.assignedCode || (isPending ? 'Not Issued Yet' : 'CLIENT2026')}
                          </span>
                        </div>
                      </div>

                      {req.extraRequirements && (
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium bg-white/60 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 italic">
                          "{req.extraRequirements}"
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                        <span className="text-[11px] text-zinc-400 font-medium">Requested: {req.createdAt}</span>

                        <div className="flex items-center gap-2">
                          {isPending && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleSelectRequestToApprove(req)}
                                className="h-8 text-[11px] font-bold rounded-full bg-blue-600 hover:bg-blue-700 text-white gap-1 px-3"
                              >
                                <Sparkles className="size-3" /> Pre-fill & Setup Client
                              </Button>

                              <Button
                                size="sm"
                                onClick={() => {
                                  const autoCode = `${req.userName.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase()}2026`;
                                  approveProjectRequest(req.id, autoCode, req.requestedDomain, 'client123');
                                  setSuccessMessage(`Instant Approved! Issued code ${autoCode} for ${req.requestedDomain}`);
                                }}
                                className="h-8 text-[11px] font-bold rounded-full bg-emerald-600 hover:bg-emerald-700 text-white gap-1 px-3"
                              >
                                <CheckCircle2 className="size-3" /> Quick Approve
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => rejectProjectRequest(req.id)}
                                className="h-8 text-[11px] font-bold rounded-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/40 px-3"
                              >
                                Reject
                              </Button>
                            </>
                          )}

                          <button
                            onClick={() => deleteProjectRequest(req.id)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Delete Request"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* B. ACTIVE GENERATED CLIENT CODES DIRECTORY TABLE */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-200 dark:border-emerald-900 inline-block mb-1">
                  Active Directory
                </span>
                <h2 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-500" /> Issued Client Setup Directory ({clients.length})
                </h2>
              </div>
            </div>

            {clients.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <Building className="size-8 text-zinc-400 mx-auto" />
                <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">No active clients created yet.</p>
                <p className="text-[11px] text-zinc-400">Use the generator form on the left or approve a pending request to create real client credentials.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-extrabold uppercase text-zinc-400 tracking-wider">
                      <th className="pb-3 pl-1">Client Partner</th>
                      <th className="pb-3">Domain</th>
                      <th className="pb-3">Client Code</th>
                      <th className="pb-3">Work Status</th>
                      <th className="pb-3">Advance Received</th>
                      <th className="pb-3 pr-1 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs">
                    {clients.map(c => (
                      <tr key={c.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3 pl-1">
                          <span className="font-extrabold text-zinc-900 dark:text-white block">{c.name}</span>
                          <span className="text-[11px] text-zinc-500 truncate block">{c.email}</span>
                        </td>

                        <td className="py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                          {c.domain || c.websiteUrl.replace(/^https?:\/\//, '')}
                        </td>

                        <td className="py-3">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-mono font-black text-xs border border-amber-200 dark:border-amber-800 inline-block">
                            {c.clientCode || 'ELITE2026'}
                          </span>
                        </td>

                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-[10px] capitalize">
                            {c.workStatus ? c.workStatus.replace(/_/g, ' ') : 'Work Started'}
                          </span>
                        </td>

                        <td className="py-3 font-bold">
                          {c.advancePaid ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="size-3.5" /> ₹{c.advanceAmount?.toLocaleString() || '25,000'}
                            </span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400">Pending</span>
                          )}
                        </td>

                        <td className="py-3 pr-1 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleCopyCredentials(c)}
                              className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-[11px] flex items-center gap-1 transition-colors"
                              title="Copy Credentials Snippet"
                            >
                              {copiedId === c.id ? (
                                <>
                                  <Check className="size-3 text-emerald-500" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="size-3" /> Copy
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => deleteClient(c.id)}
                              className="p-1 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                              title="Delete Client"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default ClientRequestsPage;
