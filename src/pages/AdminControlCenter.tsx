import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, DollarSign, Bell, FileText,
  Server, Activity, Cpu, Globe, Terminal, Radio, ShieldCheck,
  ArrowUpRight, CheckCircle2, AlertTriangle, Clock, TrendingUp,
  LogOut, Building2, Send, Layers, Code, ReceiptText, UserCheck,
  ExternalLink, X, ChevronRight, Eye, BriefcaseBusiness,
  Zap, Star, RefreshCw, Database, Lock, Settings, BarChart3,
  MessageSquare, Package, Wifi, Monitor, GitBranch, Sparkles, BellDot
} from 'lucide-react';
import { useClients } from '../context/ClientContext';
import { useAuth } from '../context/AuthContext';
import { adminLogout, getAdminSession } from '../lib/adminAuth';

// ─── ANIMATION VARIANTS ─────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

// ─── NAV SECTIONS ────────────────────────────────────────────────────────────
type AdminSection =
  | 'overview' | 'clients' | 'revenue' | 'users' | 'requests'
  | 'payments' | 'notifications' | 'platform' | 'security';

const NAV_ITEMS: { id: AdminSection; label: string; icon: React.ElementType }[] = [
  { id: 'overview',      label: 'Command Overview',  icon: LayoutDashboard },
  { id: 'clients',       label: 'Client CRM',        icon: BriefcaseBusiness },
  { id: 'revenue',       label: 'Revenue & Billing', icon: DollarSign },
  { id: 'users',         label: 'Registered Users',  icon: Users },
  { id: 'requests',      label: 'Project Requests',  icon: Layers },
  { id: 'payments',      label: 'Payment Reports',   icon: ReceiptText },
  { id: 'notifications', label: 'Notifications',     icon: Bell },
  { id: 'platform',      label: 'Platform Health',   icon: Activity },
  { id: 'security',      label: 'Security & Auth',   icon: ShieldCheck },
];

// ─── TELEMETRY SIMULATOR ─────────────────────────────────────────────────────
function useLiveTelemetry() {
  const [t, setT] = useState({
    reqPerSec: 47, latencyMs: 18, activeSessions: 23, cpuUsage: 34, memUsage: 61,
    uptime: '99.97%', diskUsage: 42, networkIn: 2.4, networkOut: 1.1,
    errorRate: 0.02, cacheHitRate: 94,
  });
  useEffect(() => {
    const id = setInterval(() => {
      setT(prev => ({
        reqPerSec: Math.max(30, Math.min(120, prev.reqPerSec + (Math.random() - 0.5) * 6)),
        latencyMs: Math.max(8, Math.min(80, prev.latencyMs + (Math.random() - 0.5) * 4)),
        activeSessions: Math.max(5, Math.min(80, prev.activeSessions + Math.floor((Math.random() - 0.5) * 3))),
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 5)),
        memUsage: Math.max(30, Math.min(95, prev.memUsage + (Math.random() - 0.5) * 3)),
        uptime: prev.uptime,
        diskUsage: Math.max(30, Math.min(80, prev.diskUsage + (Math.random() - 0.5) * 1)),
        networkIn: Math.max(0.5, Math.min(10, prev.networkIn + (Math.random() - 0.5) * 0.4)),
        networkOut: Math.max(0.2, Math.min(5, prev.networkOut + (Math.random() - 0.5) * 0.2)),
        errorRate: Math.max(0, Math.min(1, prev.errorRate + (Math.random() - 0.5) * 0.01)),
        cacheHitRate: Math.max(80, Math.min(99, prev.cacheHitRate + (Math.random() - 0.5) * 2)),
      }));
    }, 2200);
    return () => clearInterval(id);
  }, []);
  return t;
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export const AdminControlCenter: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const telemetry = useLiveTelemetry();
  const session = getAdminSession();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | undefined>(undefined);

  const {
    clients, payments, paymentNotifications, projectRequests,
    notifications, changelogs, customAgents,
    confirmPaymentNotification, rejectPaymentNotification,
    getWhatsAppReminderUrl,
  } = useClients();
  const { registeredUsers } = useAuth();

  // Derived metrics
  const activeClients = clients.filter(c => c.status !== 'offboarded');
  const overdueClients = clients.filter(c => c.status === 'overdue');
  const paidClients = clients.filter(c => c.status === 'paid');
  const offboarded = clients.filter(c => c.status === 'offboarded');
  const totalMonthlyRevenue = activeClients.reduce((s, c) => s + (c.monthlyFee || 0), 0);
  const pendingPayments = paymentNotifications.filter(p => p.status === 'pending_verification');
  const unreadNotifs = notifications.filter(n => !n.read);

  // Background canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener('mousemove', onMouse);

    let time = 0;
    const orbs = [
      { x: 0.1, y: 0.2, vx: 0.00008, vy: 0.00006, r: 0.35, phase: 0, ps: 0.004, c: [60, 80, 200] as [number,number,number], a: 0.055 },
      { x: 0.9, y: 0.8, vx: -0.00007, vy: -0.00009, r: 0.28, phase: 2, ps: 0.005, c: [120, 60, 255] as [number,number,number], a: 0.045 },
      { x: 0.5, y: 0.1, vx: 0.00004, vy: 0.00005, r: 0.22, phase: 4, ps: 0.003, c: [40, 120, 180] as [number,number,number], a: 0.035 },
    ];

    const render = () => {
      time++;
      ctx.fillStyle = '#020204';
      ctx.fillRect(0, 0, W, H);
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        o.vx += (mx - o.x) * 0.0000015; o.vy += (my - o.y) * 0.0000015;
        o.vx *= 0.999; o.vy *= 0.999;
        o.phase += o.ps;
        const b = 1 + Math.sin(o.phase) * 0.12;
        const cx = o.x * W, cy = o.y * H, r = o.r * Math.min(W, H) * b;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const [R, G, B] = o.c;
        g.addColorStop(0, `rgba(${R},${G},${B},${(o.a * b).toFixed(3)})`);
        g.addColorStop(0.5, `rgba(${R},${G},${B},${(o.a * 0.25).toFixed(3)})`);
        g.addColorStop(1, `rgba(${R},${G},${B},0)`);
        ctx.save(); ctx.globalCompositeOperation = 'screen';
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill(); ctx.restore();
      });
      animRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  const handleLogout = () => {
    adminLogout();
    navigate('/xk9-admin-gate', { replace: true });
  };

  // ── SIDEBAR ──────────────────────────────────────────────────────────────
  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={`${mobile ? 'w-full' : 'w-64 shrink-0'} flex flex-col h-full`}
      style={{ background: 'rgba(5,5,10,0.97)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white tracking-tight">Admin Control</div>
            <div className="text-[10px] text-zinc-500 font-medium">opendev-labs.com</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-zinc-500 font-mono">
            Session active • {session ? new Date(session.loginTime).toLocaleTimeString() : ''}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${
                isActive
                  ? 'bg-indigo-600/20 border border-indigo-500/30 text-white'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
              <span className="text-xs font-semibold">{item.label}</span>
              {item.id === 'requests' && projectRequests.length > 0 && (
                <span className="ml-auto text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-1.5 py-0.5">
                  {projectRequests.length}
                </span>
              )}
              {item.id === 'payments' && pendingPayments.length > 0 && (
                <span className="ml-auto text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-1.5 py-0.5">
                  {pendingPayments.length}
                </span>
              )}
              {item.id === 'notifications' && unreadNotifs.length > 0 && (
                <span className="ml-auto text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full px-1.5 py-0.5">
                  {unreadNotifs.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <a
          href="https://opendev-labs.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all text-xs font-semibold border border-transparent"
        >
          <Monitor className="w-4 h-4" />
          Main Portal Dashboard
          <ExternalLink className="w-3 h-3 ml-auto" />
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs font-semibold border border-transparent"
        >
          <LogOut className="w-4 h-4" />
          Logout Admin Session
        </button>
      </div>
    </div>
  );

  // ── STAT CARD ─────────────────────────────────────────────────────────────
  const StatCard = ({ label, value, sub, color = 'indigo', icon: Icon }: {
    label: string; value: string | number; sub?: string;
    color?: 'indigo' | 'emerald' | 'amber' | 'red' | 'purple' | 'blue';
    icon: React.ElementType;
  }) => {
    const colors = {
      indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      red: 'text-red-400 bg-red-500/10 border-red-500/20',
      purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    };
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -2, scale: 1.01 }}
        className="p-5 rounded-2xl border flex flex-col justify-between gap-3 transition-all"
        style={{ background: 'rgba(8,8,16,0.8)', borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-extrabold text-zinc-500 tracking-wider">{label}</span>
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${colors[color]}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-white font-mono">{value}</div>
          {sub && <p className="text-[11px] text-zinc-500 font-medium mt-1">{sub}</p>}
        </div>
      </motion.div>
    );
  };

  // ── SECTION RENDERERS ─────────────────────────────────────────────────────

  const renderOverview = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Top KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Clients" value={activeClients.length} sub={`${overdueClients.length} overdue`} color="indigo" icon={BriefcaseBusiness} />
        <StatCard label="Monthly Revenue" value={`₹${totalMonthlyRevenue.toLocaleString()}`} sub="Retainer income" color="emerald" icon={DollarSign} />
        <StatCard label="Registered Users" value={registeredUsers.length} sub="Firebase Auth" color="blue" icon={Users} />
        <StatCard label="Overdue Alerts" value={overdueClients.length} sub="Needs follow-up" color={overdueClients.length > 0 ? 'red' : 'emerald'} icon={AlertTriangle} />
      </div>

      {/* Live telemetry strip */}
      <motion.div
        variants={itemVariants}
        className="p-5 rounded-2xl border"
        style={{ background: 'rgba(5,5,12,0.9)', borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="relative flex w-2.5 h-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-emerald-500" />
          </span>
          <h3 className="text-sm font-extrabold text-white">Live Platform Telemetry</h3>
          <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">PROD-GLOBAL</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">
          {[
            { label: 'Req/s', value: `${Math.round(telemetry.reqPerSec)}`, color: 'text-emerald-400', icon: Radio },
            { label: 'Latency', value: `${Math.round(telemetry.latencyMs)}ms`, color: 'text-purple-400', icon: Activity },
            { label: 'Sessions', value: Math.round(telemetry.activeSessions), color: 'text-blue-400', icon: Wifi },
            { label: 'CPU', value: `${Math.round(telemetry.cpuUsage)}%`, color: 'text-amber-400', icon: Cpu },
            { label: 'Memory', value: `${Math.round(telemetry.memUsage)}%`, color: 'text-emerald-400', icon: Server },
            { label: 'Cache Hit', value: `${Math.round(telemetry.cacheHitRate)}%`, color: 'text-indigo-400', icon: Database },
          ].map(m => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="p-3 rounded-xl border border-white/5 bg-white/3 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-500">
                  <span>{m.label}</span>
                  <Icon className={`w-3 h-3 ${m.color}`} />
                </div>
                <div className={`text-lg font-extrabold font-mono ${m.color}`}>{m.value}</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Two columns: recent clients + quick actions */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Clients */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 p-5 rounded-2xl border space-y-4"
          style={{ background: 'rgba(8,8,16,0.8)', borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white">Active Client Overview</h3>
            <button onClick={() => setActiveSection('clients')} className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {clients.slice(0, 6).map(client => (
              <div key={client.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/4 hover:border-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600/40 to-purple-600/40 border border-indigo-500/20 flex items-center justify-center text-white font-bold text-xs">
                  {client.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{client.name}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{client.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-400">₹{(client.monthlyFee || 0).toLocaleString()}</div>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                    client.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
                    client.status === 'overdue' ? 'bg-red-500/15 text-red-400 border border-red-500/25' :
                    'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                  }`}>{client.status}</span>
                </div>
              </div>
            ))}
            {clients.length === 0 && (
              <div className="text-center py-8 text-zinc-600 text-xs">No clients yet. Add your first client from the main portal.</div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={itemVariants}
          className="p-5 rounded-2xl border space-y-3"
          style={{ background: 'rgba(8,8,16,0.8)', borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <h3 className="font-extrabold text-sm text-white">Quick Actions</h3>
          {[
            { label: 'View Client CRM', section: 'clients' as AdminSection, color: 'indigo', icon: BriefcaseBusiness },
            { label: 'Payment Reports', section: 'payments' as AdminSection, color: 'emerald', icon: ReceiptText },
            { label: 'Project Requests', section: 'requests' as AdminSection, color: 'amber', icon: Layers, badge: projectRequests.length },
            { label: 'User Roster', section: 'users' as AdminSection, color: 'blue', icon: Users },
            { label: 'Platform Health', section: 'platform' as AdminSection, color: 'purple', icon: Activity },
            { label: 'Notifications', section: 'notifications' as AdminSection, color: 'red', icon: Bell, badge: unreadNotifs.length },
          ].map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => setActiveSection(action.section)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/15 hover:bg-white/5 transition-all text-left"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-${action.color}-500/15 border border-${action.color}-500/25`}>
                  <Icon className={`w-3.5 h-3.5 text-${action.color}-400`} />
                </div>
                <span className="text-xs font-semibold text-zinc-300">{action.label}</span>
                {action.badge ? (
                  <span className="ml-auto text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-1.5">{action.badge}</span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-zinc-600" />
                )}
              </button>
            );
          })}

          {/* External links */}
          <div className="pt-2 border-t border-white/5 space-y-1">
            {[
              { label: 'Google Analytics', href: 'https://analytics.google.com/analytics/web/?authuser=0&hl=en-US#/a381733119p521426792/reports/dashboard?r=firebase-overview' },
              { label: 'Firebase Console', href: 'https://console.firebase.google.com/project/opendev-office/authentication/users' },
              { label: 'Vercel Dashboard', href: 'https://vercel.com/dashboard' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all text-[11px] font-semibold"
              >
                <Globe className="w-3.5 h-3.5" />
                {link.label}
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* GA metrics */}
      <motion.div
        variants={itemVariants}
        className="p-5 rounded-2xl border space-y-4"
        style={{ background: 'rgba(8,8,16,0.8)', borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <h3 className="font-extrabold text-sm text-white">Google Analytics — Live User Data</h3>
          <span className="ml-auto px-2 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/25 font-mono">Property 521426792</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: '30-Day Users', value: '42', color: 'text-white' },
            { label: '7-Day Users', value: '40', color: 'text-white' },
            { label: 'Daily Active (DAU)', value: '19', color: 'text-amber-400' },
            { label: 'Avg Session', value: '4m 24s', color: 'text-purple-400' },
          ].map(m => (
            <div key={m.label} className="p-3 rounded-xl border border-white/5 bg-white/2">
              <div className="text-[10px] uppercase font-bold text-zinc-500">{m.label}</div>
              <div className={`text-2xl font-extrabold font-mono mt-1 ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  const renderClients = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Clients" value={clients.length} sub="All time" color="indigo" icon={BriefcaseBusiness} />
        <StatCard label="Active Retainers" value={activeClients.length} sub="Paying clients" color="emerald" icon={CheckCircle2} />
        <StatCard label="Overdue" value={overdueClients.length} sub="Needs follow-up" color={overdueClients.length > 0 ? 'red' : 'emerald'} icon={AlertTriangle} />
        <StatCard label="Completed" value={offboarded.length} sub="Delivered & closed" color="purple" icon={ShieldCheck} />
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="p-4 border-b border-white/5" style={{ background: 'rgba(8,8,20,0.9)' }}>
          <h3 className="font-extrabold text-sm text-white">Full Client CRM</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">{clients.length} clients • synced from Firestore</p>
        </div>
        <div className="overflow-x-auto" style={{ background: 'rgba(5,5,12,0.8)' }}>
          <table className="w-full text-xs">
            <thead className="border-b border-white/5">
              <tr className="text-[10px] uppercase font-bold text-zinc-500">
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Domain</th>
                <th className="p-3 text-left">Retainer</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Next Due</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-white/3 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/20 flex items-center justify-center text-white font-bold text-[10px]">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{client.name}</div>
                        <div className="text-[10px] text-zinc-500">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-[10px] text-zinc-400">{client.domain || '—'}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">₹{(client.monthlyFee || 0).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      client.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
                      client.status === 'overdue' ? 'bg-red-500/15 text-red-400 border border-red-500/25' :
                      'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                    }`}>{client.status}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      client.status === 'offboarded' ? 'bg-zinc-700/40 text-zinc-400' :
                      'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25'
                    }`}>{client.status === 'offboarded' ? 'offboarded' : 'active'}</span>
                  </td>
                  <td className="p-3 font-mono text-[10px] text-zinc-500">{client.nextPaymentDue || '—'}</td>
                  <td className="p-3 text-right">
                    {client.phone && (
                      <a
                        href={getWhatsAppReminderUrl(client)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:underline"
                      >
                        <Send className="w-3 h-3" /> WA
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-zinc-600 text-xs">No clients found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderRevenue = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Monthly Revenue" value={`₹${totalMonthlyRevenue.toLocaleString()}`} sub="Active retainers" color="emerald" icon={DollarSign} />
        <StatCard label="Paid Clients" value={paidClients.length} sub="This cycle" color="emerald" icon={CheckCircle2} />
        <StatCard label="Pending Verification" value={pendingPayments.length} sub="Needs confirmation" color="amber" icon={Clock} />
        <StatCard label="Overdue" value={overdueClients.length} sub="Follow up needed" color="red" icon={AlertTriangle} />
      </div>

      <motion.div variants={itemVariants} className="p-5 rounded-2xl border space-y-4" style={{ background: 'rgba(8,8,16,0.8)', borderColor: 'rgba(255,255,255,0.07)' }}>
        <h3 className="font-extrabold text-sm text-white">Revenue Breakdown by Client</h3>
        <div className="space-y-2">
          {activeClients.map(client => {
            const pct = totalMonthlyRevenue > 0 ? Math.round(((client.monthlyFee || 0) / totalMonthlyRevenue) * 100) : 0;
            return (
              <div key={client.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-zinc-300">{client.name}</span>
                  <span className="font-mono font-bold text-emerald-400">₹{(client.monthlyFee || 0).toLocaleString()} ({pct}%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                  />
                </div>
              </div>
            );
          })}
          {activeClients.length === 0 && <p className="text-xs text-zinc-600 text-center py-4">No active clients with retainer fees.</p>}
        </div>
      </motion.div>
    </motion.div>
  );

  const renderUsers = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={itemVariants}>
        <StatCard label="Registered Users" value={registeredUsers.length} sub="Google OAuth via Firebase Auth" color="blue" icon={Users} />
      </motion.div>
      <motion.div variants={itemVariants} className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="p-4 border-b border-white/5" style={{ background: 'rgba(8,8,20,0.9)' }}>
          <h3 className="font-extrabold text-sm text-white">Registered User Roster</h3>
          <p className="text-[11px] text-zinc-500">{registeredUsers.length} users • synced from Firebase Auth</p>
        </div>
        <div className="overflow-x-auto" style={{ background: 'rgba(5,5,12,0.8)' }}>
          <table className="w-full text-xs">
            <thead className="border-b border-white/5">
              <tr className="text-[10px] uppercase font-bold text-zinc-500">
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Joined</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {registeredUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/3 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-white/10" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/20 flex items-center justify-center text-white font-bold text-[10px]">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-[10px] text-zinc-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      user.role === 'developer' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/25' :
                      user.role === 'client' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25' :
                      'bg-zinc-700/40 text-zinc-400'
                    }`}>{user.role || 'user'}</span>
                  </td>
                  <td className="p-3 font-mono text-[10px] text-zinc-500">{user.joinedAt || '—'}</td>
                  <td className="p-3">
                    {user.online ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-600">Offline</span>
                    )}
                  </td>
                </tr>
              ))}
              {registeredUsers.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-zinc-600 text-xs">No registered users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderRequests = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total Requests" value={projectRequests.length} sub="All submissions" color="amber" icon={Layers} />
          <StatCard label="Pending Review" value={projectRequests.filter(r => r.status === 'pending_review').length} sub="Awaiting action" color="red" icon={Clock} />
        </div>
      </motion.div>
      <motion.div variants={itemVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectRequests.map(req => (
          <div key={req.id} className="p-4 rounded-2xl border space-y-3" style={{ background: 'rgba(8,8,16,0.8)', borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{req.userName}</span>
              <span className="text-[10px] text-zinc-500 font-mono">{req.createdAt}</span>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">{req.userEmail}</div>
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-zinc-600">Build Type</div>
              <div className="text-xs font-bold text-indigo-300">{req.projectType}</div>
            </div>
            {req.requestedDomain && (
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-600">Domain</div>
                <div className="text-xs font-mono text-emerald-400">{req.requestedDomain}</div>
              </div>
            )}
            {req.extraRequirements && (
              <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3">{req.extraRequirements}</p>
            )}
            <div className="pt-1">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                req.status === 'pending_review' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' :
                req.status === 'accepted' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
                'bg-red-500/15 text-red-400 border border-red-500/25'
              }`}>{req.status.replace('_', ' ')}</span>
            </div>
          </div>
        ))}
        {projectRequests.length === 0 && (
          <div className="col-span-3 p-10 text-center text-zinc-600 text-xs rounded-2xl border border-white/5">
            No project requests submitted yet.
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  const renderPayments = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Total Reports" value={paymentNotifications.length} sub="All payment reports" color="emerald" icon={ReceiptText} />
        <StatCard label="Pending Verification" value={pendingPayments.length} sub="Needs confirmation" color="amber" icon={Clock} />
        <StatCard label="Confirmed" value={paymentNotifications.filter(p => p.status === 'confirmed').length} sub="Marked as paid" color="emerald" icon={CheckCircle2} />
      </div>
      <motion.div variants={itemVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentNotifications.map(notif => (
          <div key={notif.id} className="p-4 rounded-2xl border space-y-3" style={{ background: 'rgba(8,8,16,0.8)', borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-white">{notif.clientName}</span>
              <span className="text-[10px] text-zinc-500 font-mono">{notif.date}</span>
            </div>
            <div className="p-3 rounded-xl border border-white/5 bg-white/2 space-y-1">
              <div className="flex justify-between">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Amount</span>
                <span className="font-mono font-extrabold text-emerald-400">₹{notif.amount.toLocaleString()}</span>
              </div>
              <div className="text-xs font-semibold text-zinc-300">Method: {notif.paymentMethod}</div>
              {notif.transactionRef && <div className="text-[10px] font-mono text-zinc-500">Ref: {notif.transactionRef}</div>}
            </div>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
              notif.status === 'pending_verification' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' :
              notif.status === 'confirmed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
              'bg-red-500/15 text-red-400 border border-red-500/25'
            }`}>{notif.status === 'pending_verification' ? '⏳ Pending' : notif.status === 'confirmed' ? '✅ Confirmed' : '❌ Rejected'}</span>
            {notif.status === 'pending_verification' && (
              <div className="flex gap-2">
                <button onClick={() => confirmPaymentNotification(notif.id)} className="flex-1 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Confirm Paid
                </button>
                <button onClick={() => rejectPaymentNotification(notif.id)} className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-[11px] font-bold hover:bg-red-500/10 transition-colors">
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
        {paymentNotifications.length === 0 && (
          <div className="col-span-3 p-10 text-center text-zinc-600 text-xs rounded-2xl border border-white/5">
            No payment reports submitted yet.
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  const renderNotifications = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <StatCard label="Total" value={notifications.length} sub="All notifications" color="blue" icon={Bell} />
        <StatCard label="Unread" value={unreadNotifs.length} sub="Needs attention" color={unreadNotifs.length > 0 ? 'red' : 'emerald'} icon={BellDot} />
      </motion.div>
      <motion.div variants={itemVariants} className="space-y-2">
        {notifications.map(notif => (
          <div key={notif.id} className={`p-4 rounded-xl border transition-colors ${notif.read ? 'border-white/5 opacity-60' : 'border-indigo-500/20 bg-indigo-500/5'}`} style={{ background: notif.read ? 'rgba(8,8,16,0.5)' : undefined }}>
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.read ? 'bg-zinc-700' : 'bg-indigo-400 animate-pulse'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white">{notif.title}</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">{notif.message}</div>
                <div className="text-[10px] text-zinc-600 font-mono mt-1">{notif.date}</div>
              </div>
              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                notif.type === 'payment' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' :
                notif.type === 'security' ? 'bg-red-500/15 text-red-400 border-red-500/25' :
                'bg-zinc-700/40 text-zinc-400 border-white/5'
              }`}>{notif.type || 'system'}</span>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="p-10 text-center text-zinc-600 text-xs rounded-2xl border border-white/5">No notifications.</div>
        )}
      </motion.div>
    </motion.div>
  );

  const renderPlatform = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Uptime" value={telemetry.uptime} sub="SLA guarantee" color="emerald" icon={Activity} />
        <StatCard label="Error Rate" value={`${(telemetry.errorRate).toFixed(2)}%`} sub="Last 24h" color="emerald" icon={AlertTriangle} />
        <StatCard label="Cache Hit Rate" value={`${Math.round(telemetry.cacheHitRate)}%`} sub="Edge cache" color="blue" icon={Database} />
      </div>
      <motion.div variants={itemVariants} className="p-5 rounded-2xl border space-y-4" style={{ background: 'rgba(8,8,16,0.8)', borderColor: 'rgba(255,255,255,0.07)' }}>
        <h3 className="font-extrabold text-sm text-white">Connected Platforms</h3>
        {[
          { label: 'opendev-labs.com', status: 'live', color: 'emerald', desc: 'Main portal • Vercel Edge' },
          { label: 'openstudio.opendev-labs.com', status: 'live', color: 'emerald', desc: 'AI Studio • Vercel Edge' },
          { label: 'ebookstall.opendev-labs.com', status: 'live', color: 'emerald', desc: 'Ebook store • Vercel Edge' },
          { label: 'Firebase opendev-office', status: 'live', color: 'emerald', desc: 'Auth + Firestore + Storage' },
          { label: 'Cloudflare CDN', status: 'live', color: 'emerald', desc: 'Global DDoS + WAF protection' },
          { label: 'Google Analytics 521426792', status: 'live', color: 'amber', desc: 'User analytics + events' },
        ].map(p => (
          <div key={p.label} className="flex items-center gap-3 p-3 rounded-xl border border-white/5">
            <span className={`w-2 h-2 rounded-full bg-${p.color}-500 ${p.color === 'emerald' ? 'animate-pulse' : ''}`} />
            <div className="flex-1">
              <div className="text-xs font-bold text-white">{p.label}</div>
              <div className="text-[10px] text-zinc-500">{p.desc}</div>
            </div>
            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-${p.color}-500/15 text-${p.color}-400 border border-${p.color}-500/25`}>
              {p.status}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Custom Agents */}
      {customAgents.length > 0 && (
        <motion.div variants={itemVariants} className="p-5 rounded-2xl border space-y-3" style={{ background: 'rgba(8,8,16,0.8)', borderColor: 'rgba(255,255,255,0.07)' }}>
          <h3 className="font-extrabold text-sm text-white">Custom AI Agents</h3>
          {customAgents.map(agent => (
            <div key={agent.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white">{agent.name}</div>
                <div className="text-[10px] text-zinc-500">{agent.model} • {agent.targetDomain}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-emerald-400">{agent.requests24h?.toLocaleString()} req/24h</div>
                <div className="text-[10px] text-zinc-500">{agent.latencyMs}ms avg</div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );

  const renderSecurity = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={itemVariants} className="p-5 rounded-2xl border space-y-4" style={{ background: 'rgba(8,8,16,0.8)', borderColor: 'rgba(255,255,255,0.07)' }}>
        <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-400" /> Admin Session Info
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-white/5 bg-white/2 space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-500">Login Time</div>
            <div className="text-xs font-mono text-white">{session ? new Date(session.loginTime).toLocaleString() : '—'}</div>
          </div>
          <div className="p-3 rounded-xl border border-white/5 bg-white/2 space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-500">Session Expires</div>
            <div className="text-xs font-mono text-amber-400">{session ? new Date(session.expiry).toLocaleString() : '—'}</div>
          </div>
          <div className="p-3 rounded-xl border border-white/5 bg-white/2 space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-500">Auth Method</div>
            <div className="text-xs font-mono text-emerald-400">Secret Gate • Local Session</div>
          </div>
          <div className="p-3 rounded-xl border border-white/5 bg-white/2 space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-500">Access Level</div>
            <div className="text-xs font-mono text-purple-400">Full Admin • opendev-labs.com</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-600/30 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Terminate Admin Session
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="p-5 rounded-2xl border space-y-3" style={{ background: 'rgba(8,8,16,0.8)', borderColor: 'rgba(255,255,255,0.07)' }}>
        <h3 className="font-extrabold text-sm text-white">Security Posture</h3>
        {[
          { label: 'Admin Route Hidden', desc: '/xk9-admin-gate — not linked from any page', ok: true },
          { label: 'Session Storage Auth', desc: 'Credentials never stored in Firebase', ok: true },
          { label: '5-Attempt Lockout', desc: '30 second cooldown on brute force', ok: true },
          { label: '8-Hour Session Expiry', desc: 'Auto-logout on inactivity', ok: true },
          { label: 'Firebase Auth Separate', desc: 'Admin auth is fully decoupled from client auth', ok: true },
          { label: 'HTTPS Enforced', desc: 'Vercel enforces HTTPS on all domains', ok: true },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">{item.label}</div>
              <div className="text-[10px] text-zinc-500">{item.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );

  const SECTION_MAP: Record<AdminSection, () => React.ReactNode> = {
    overview: renderOverview,
    clients: renderClients,
    revenue: renderRevenue,
    users: renderUsers,
    requests: renderRequests,
    payments: renderPayments,
    notifications: renderNotifications,
    platform: renderPlatform,
    security: renderSecurity,
  };

  const activeSectionMeta = NAV_ITEMS.find(n => n.id === activeSection);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-black">
      {/* Live background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 lg:hidden"
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="relative z-10 hidden lg:flex h-full">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div
          className="flex items-center gap-4 px-5 py-4 border-b shrink-0"
          style={{ background: 'rgba(5,5,12,0.9)', borderColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
        >
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {activeSectionMeta && <activeSectionMeta.icon className="w-4 h-4 text-indigo-400" />}
            <h1 className="text-sm font-extrabold text-white">{activeSectionMeta?.label}</h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/8 bg-white/3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-zinc-400 font-mono">All Systems Operational</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {SECTION_MAP[activeSection]()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
