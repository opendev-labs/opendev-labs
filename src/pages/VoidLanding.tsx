import { Terminal, Code2, ArrowRight, ShieldCheck, Zap, Globe, Cpu, Sparkles, ExternalLink, ChevronRight, Star, Bot, Layers, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Code2,
    title: 'Custom Web & App Development',
    desc: 'End-to-end design and development of world-class websites and web applications — tailored precisely to your brand, your users, and your vision.',
    tag: 'Core Service',
  },
  {
    icon: Bot,
    title: 'AI Integration & Automation',
    desc: 'We embed state-of-the-art AI — LLMs, intelligent assistants, and automation pipelines — directly into your product, making it smarter by default.',
    tag: 'AI-First',
  },
  {
    icon: Lock,
    title: 'Private & Confidential Projects',
    desc: 'Full confidentiality and ironclad NDA agreements for enterprise clients. Your IP, your data, your product — secured from day one.',
    tag: 'Enterprise',
  },
  {
    icon: Layers,
    title: 'SaaS Platform Development',
    desc: 'We build complex, scalable SaaS platforms from zero — auth, billing, dashboards, APIs, and everything else your business needs to launch and grow.',
    tag: 'Scalable',
  },
  {
    icon: Globe,
    title: 'Full-Stack Engineering',
    desc: 'From pixel-perfect frontends to robust backend infrastructure, we deliver full-stack solutions built with modern frameworks and battle-tested architecture.',
    tag: 'Full Stack',
  },
  {
    icon: Zap,
    title: 'Rapid Prototyping & MVPs',
    desc: 'Got a bold idea? We move fast. We\'ll take your concept from idea to a fully functional, production-ready MVP in weeks, not months.',
    tag: 'Fast Delivery',
  },
];

const stats = [
  { value: '100%', label: 'Client Satisfaction' },
  { value: 'AI-First', label: 'Every Product' },
  { value: '24/7', label: 'Support Available' },
  { value: '∞', label: 'Scalability' },
];

const products = [
  {
    name: 'NanoPi',
    description: 'Your hyper-intelligent local AI assistant. Fast, private, and runs entirely on your own hardware. No cloud dependency, no slowdowns.',
    tag: 'AI Assistant',
    href: '/nanopi',
    icon: '🧠',
    color: 'from-violet-500/10 to-purple-500/10 border-violet-500/20',
  },
  {
    name: 'OpenHub',
    description: 'The central command hub for managing all your OpenDev Labs products, services, and cloud deployments in one unified interface.',
    tag: 'Platform',
    href: '/open-hub',
    icon: '🌐',
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
  },
];

export default function VoidLanding() {
  return (
    <div className="flex-1 w-full flex flex-col bg-background overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative container max-w-screen-2xl mx-auto flex flex-col items-start gap-6 pb-24 pt-24 md:pt-36 px-4 md:px-8">

        {/* Glow blob */}
        <div className="pointer-events-none absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="pointer-events-none absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-[100px]" />

        {/* Badge */}
        <a
          href="https://github.com/opendev-labs"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all"
        >
          <Sparkles className="h-3 w-3 text-primary" />
          AI-first software studio
          <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </a>

        {/* Headline */}
        <h1 className="max-w-4xl font-bold tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] text-balance">
          We Build
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-400 to-primary">
            Software That Thinks.
          </span>
        </h1>

        <p className="max-w-[38rem] text-base sm:text-xl leading-relaxed text-muted-foreground">
          OpenDev Labs is an AI-first software company. We design and build premium custom websites, intelligent web apps, and AI-powered tools for businesses and individuals who demand the best.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-start gap-3 mt-2">
          <Button size="lg" className="font-semibold px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow" asChild>
            <a href="mailto:opendev.help@gmail.com">
              Start a Project <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="font-semibold px-8" asChild>
            <a href="https://github.com/opendev-labs" target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              View on GitHub
            </a>
          </Button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 pt-10 border-t border-border w-full">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="container max-w-screen-2xl mx-auto py-24 px-4 md:px-8">
        <div className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[3px] text-primary mb-3">What We Do</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
              Every service your<br />product needs.
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground leading-relaxed">
            From a landing page to a full AI-powered SaaS platform — we handle every layer of the stack.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <div
              key={i}
              className="group relative flex flex-col p-7 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-muted/40 transition-all duration-300 cursor-default"
            >
              {/* Tag */}
              <span className="inline-flex mb-5 w-fit items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-[11px] font-semibold text-primary uppercase tracking-wide">
                {s.tag}
              </span>
              <s.icon className="h-7 w-7 mb-4 text-foreground group-hover:text-primary transition-colors" />
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Products ── */}
      <section className="container max-w-screen-2xl mx-auto py-24 px-4 md:px-8 border-t border-border">
        <div className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[3px] text-primary mb-3">Our Products</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Built by us.<br />Available for you.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <Link
              key={i}
              to={p.href}
              className={`group relative flex flex-col p-8 rounded-2xl border bg-gradient-to-br ${p.color} hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
            >
              <div className="text-4xl mb-5">{p.icon}</div>
              <span className="inline-flex mb-3 w-fit items-center rounded-full bg-background/60 backdrop-blur border border-border px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {p.tag}
              </span>
              <h3 className="text-2xl font-bold mb-3">{p.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.description}</p>
              <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                Open {p.name} <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="container max-w-screen-2xl mx-auto py-24 px-4 md:px-8">
        <div className="relative rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-violet-500/5 to-background overflow-hidden p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          {/* Glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[80px]" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Star className="h-5 w-5 fill-primary" />
              <span className="text-sm font-semibold tracking-wide">Ready to build something great?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Let's build your next<br />big thing together.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md leading-relaxed">
              Whether it's a website, a web app, or an AI-powered platform — we deliver products that perform, convert, and scale.
            </p>
          </div>

          <div className="relative flex-shrink-0">
            <Button size="lg" className="font-semibold px-10 py-6 text-base shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-shadow" asChild>
              <a href="mailto:opendev.help@gmail.com">
                Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground text-center">opendev.help@gmail.com</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="container max-w-screen-2xl mx-auto py-10 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight">opendev-labs</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#services" className="hover:text-foreground transition-colors">Services</a>
            <Link to="/nanopi" className="hover:text-foreground transition-colors">NanoPi</Link>
            <Link to="/open-hub" className="hover:text-foreground transition-colors">OpenHub</Link>
            <a href="https://github.com/opendev-labs" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
              GitHub <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 OpenDev Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
