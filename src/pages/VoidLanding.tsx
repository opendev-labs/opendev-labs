import { ArrowRight, Code2, Bot, Layers, Globe, Zap, ShieldCheck, Star, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// ── Brand colors extracted from logo ──────────────────────────
// Navy Blue:   #1B3F6E  (left bracket / dark)
// Electric Orange: #F47A20  (right bracket / accent)
// Black bg:    #09090B

const services = [
  {
    icon: Code2,
    title: 'Custom Web & App Development',
    desc: 'End-to-end design and development of world-class websites and web apps tailored precisely to your brand, your users, and your vision.',
    tag: 'Core Service',
  },
  {
    icon: Bot,
    title: 'AI Integration & Automation',
    desc: 'We embed state-of-the-art AI — LLMs, intelligent assistants, and automation pipelines — directly into your product.',
    tag: 'AI-First',
  },
  {
    icon: ShieldCheck,
    title: 'Private & Confidential Projects',
    desc: 'Full confidentiality for enterprise clients. Your IP, your data, your product — secured and protected from day one.',
    tag: 'Enterprise',
  },
  {
    icon: Layers,
    title: 'SaaS Platform Development',
    desc: 'We build complex, scalable SaaS platforms from zero — auth, billing, dashboards, APIs, and everything in between.',
    tag: 'Scalable',
  },
  {
    icon: Globe,
    title: 'Full-Stack Engineering',
    desc: 'From pixel-perfect frontends to robust backend infrastructure — full-stack solutions built with modern, battle-tested tech.',
    tag: 'Full Stack',
  },
  {
    icon: Zap,
    title: 'Rapid Prototyping & MVPs',
    desc: 'Got a bold idea? We move fast. From concept to a fully functional, production-ready MVP in weeks, not months.',
    tag: 'Fast Delivery',
  },
];

const products = [
  {
    name: 'NanoPi',
    description: 'Your hyper-intelligent local AI assistant. Fast, private, and runs entirely on your own hardware. No cloud dependency.',
    tag: 'AI Assistant',
    href: '/nanopi',
    icon: '🧠',
  },
  {
    name: 'OpenHub',
    description: 'The central command hub for managing all your OpenDev Labs products, services, and deployments in one unified interface.',
    tag: 'Platform',
    href: '/open-hub',
    icon: '🌐',
  },
];

const stats = [
  { value: '100%', label: 'Client Satisfaction' },
  { value: 'AI-First', label: 'Every Product' },
  { value: '24/7', label: 'Support Available' },
  { value: '∞', label: 'Scalability' },
];

export default function VoidLanding() {
  return (
    <div
      className="flex-1 w-full flex flex-col overflow-x-hidden"
      style={{ background: '#09090B', color: '#FAFAFA' }}
    >

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative container max-w-screen-2xl mx-auto flex flex-col items-start gap-6 pb-28 pt-24 md:pt-40 px-4 md:px-8">

        {/* Glow blobs using brand colors */}
        <div
          className="pointer-events-none absolute -top-60 -left-60 w-[800px] h-[800px] rounded-full blur-[140px] opacity-20"
          style={{ background: 'radial-gradient(circle, #1B3F6E, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-15"
          style={{ background: 'radial-gradient(circle, #F47A20, transparent 70%)' }}
        />

        {/* Badge */}
        <a
          href="https://github.com/opendev-labs"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition-all"
          style={{ borderColor: 'rgba(244,122,32,0.4)', color: '#F47A20', background: 'rgba(244,122,32,0.08)' }}
        >
          <Sparkles className="h-3 w-3" />
          AI-first software studio · 2026
          <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </a>

        {/* Logo + Headline */}
        <div className="flex items-center gap-5 mb-2">
          <img
            src="/logo-icon.webp"
            alt="OpenDev Labs logo"
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-contain"
          />
          <span
            className="text-lg md:text-2xl font-black tracking-tight uppercase"
            style={{ color: '#F47A20', letterSpacing: '0.08em' }}
          >
            opendev-labs
          </span>
        </div>

        <h1 className="max-w-5xl font-black tracking-tight text-5xl sm:text-7xl md:text-8xl leading-[1.0] text-balance">
          We Build
          <br />
          <span
            style={{
              background: 'linear-gradient(90deg, #1B3F6E 0%, #F47A20 60%, #ffb347 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Software That Thinks.
          </span>
        </h1>

        <p className="max-w-[40rem] text-base sm:text-xl leading-relaxed" style={{ color: '#A1A1AA' }}>
          OpenDev Labs is an AI-first software company. We design and build premium custom websites, intelligent web apps, and AI-powered tools — for businesses and individuals who demand the absolute best.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-start gap-3 mt-2">
          <a
            href="mailto:opendev.office@gmail.com"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-bold text-sm transition-all hover:opacity-90"
            style={{ background: '#F47A20', color: '#09090B', boxShadow: '0 0 30px rgba(244,122,32,0.4)' }}
          >
            Start a Project <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/opendev-labs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-bold text-sm border transition-all"
            style={{ borderColor: '#1B3F6E', color: '#FAFAFA', background: 'rgba(27,63,110,0.15)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            GitHub
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 pt-10 w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-2xl sm:text-3xl font-black" style={{ color: i % 2 === 0 ? '#F47A20' : '#FAFAFA' }}>{s.value}</div>
              <div className="text-sm mt-1" style={{ color: '#71717A' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SERVICES ══════════════════════════════════════════════ */}
      <section id="services" className="container max-w-screen-2xl mx-auto py-28 px-4 md:px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[4px] mb-4" style={{ color: '#F47A20' }}>What We Do</p>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-balance leading-tight">
              Every service<br />your product needs.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed" style={{ color: '#71717A' }}>
            From a landing page to a full AI-powered SaaS platform — we handle every layer of the stack so you don't have to.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden' }}>
          {services.map((s, i) => (
            <div
              key={i}
              className="group flex flex-col p-8 transition-all duration-300 cursor-default"
              style={{ background: '#09090B' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#111113')}
              onMouseLeave={e => (e.currentTarget.style.background = '#09090B')}
            >
              <span
                className="inline-flex mb-6 w-fit items-center rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                style={{ background: 'rgba(244,122,32,0.12)', border: '1px solid rgba(244,122,32,0.3)', color: '#F47A20' }}
              >
                {s.tag}
              </span>
              <s.icon className="h-6 w-6 mb-4" style={{ color: '#F47A20' }} />
              <h3 className="text-base font-bold mb-2 text-white">{s.title}</h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: '#71717A' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ PRODUCTS ══════════════════════════════════════════════ */}
      <section className="container max-w-screen-2xl mx-auto py-28 px-4 md:px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="mb-16">
          <p className="text-xs font-bold uppercase tracking-[4px] mb-4" style={{ color: '#F47A20' }}>Our Products</p>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight">
            Built by us.<br />Available for you.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map((p, i) => (
            <Link
              key={i}
              to={p.href}
              className="group flex flex-col p-10 rounded-2xl transition-all duration-300 hover:scale-[1.015]"
              style={{
                background: 'linear-gradient(135deg, rgba(27,63,110,0.15) 0%, rgba(244,122,32,0.05) 100%)',
                border: '1px solid rgba(244,122,32,0.15)',
              }}
            >
              <div className="text-5xl mb-6">{p.icon}</div>
              <span
                className="inline-flex mb-3 w-fit items-center rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#A1A1AA' }}
              >
                {p.tag}
              </span>
              <h3 className="text-3xl font-black mb-3 text-white">{p.name}</h3>
              <p className="text-base leading-relaxed flex-1" style={{ color: '#71717A' }}>{p.description}</p>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all" style={{ color: '#F47A20' }}>
                Open {p.name} <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ CTA BANNER ════════════════════════════════════════════ */}
      <section className="container max-w-screen-2xl mx-auto py-28 px-4 md:px-8">
        <div
          className="relative rounded-3xl overflow-hidden p-12 md:p-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-12"
          style={{
            background: 'linear-gradient(135deg, rgba(27,63,110,0.3) 0%, rgba(244,122,32,0.1) 100%)',
            border: '1px solid rgba(244,122,32,0.2)',
          }}
        >
          {/* Glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
            style={{ background: '#F47A20' }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-5">
              <Star className="h-5 w-5 fill-current" style={{ color: '#F47A20' }} />
              <span className="text-sm font-semibold tracking-wide" style={{ color: '#F47A20' }}>Ready to build something great?</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-balance text-white">
              Let's build your<br />next big thing.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: '#71717A' }}>
              Whether it's a landing page, a complex web app, or an AI-powered platform — we deliver products that perform, convert, and scale.
            </p>
          </div>

          <div className="relative flex-shrink-0 flex flex-col items-start gap-4">
            <a
              href="mailto:opendev.office@gmail.com"
              className="inline-flex items-center gap-3 rounded-2xl px-10 py-5 font-black text-base transition-all hover:opacity-90 hover:scale-105"
              style={{ background: '#F47A20', color: '#09090B', boxShadow: '0 0 50px rgba(244,122,32,0.4)' }}
            >
              Get in Touch <ArrowRight className="h-5 w-5" />
            </a>
            <p className="text-xs" style={{ color: '#71717A' }}>📧 opendev.office@gmail.com</p>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container max-w-screen-2xl mx-auto py-10 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.webp" alt="OpenDev Labs" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-black tracking-tight text-sm" style={{ color: '#F47A20' }}>opendev-labs</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: '#71717A' }}>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <Link to="/nanopi" className="hover:text-white transition-colors">NanoPi</Link>
            <Link to="/open-hub" className="hover:text-white transition-colors">OpenHub</Link>
            <a href="https://github.com/opendev-labs" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
              GitHub <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-xs" style={{ color: '#3F3F46' }}>© 2026 OpenDev Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
