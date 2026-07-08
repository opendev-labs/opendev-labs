import { ArrowRight, Code2, Bot, Layers, Globe, Zap, ShieldCheck, Star, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const services = [
  { icon: Code2,       title: 'Custom Web & App Development', desc: 'End-to-end design and development of world-class websites and web apps tailored precisely to your brand, users, and vision.', tag: 'Core Service' },
  { icon: Bot,         title: 'AI Integration & Automation',  desc: 'We embed state-of-the-art AI — LLMs, intelligent assistants, and automation pipelines — directly into your product.', tag: 'AI-First' },
  { icon: ShieldCheck, title: 'Private & Confidential Projects', desc: 'Full confidentiality for enterprise clients. Your IP, your data, your product — secured and protected from day one.', tag: 'Enterprise' },
  { icon: Layers,      title: 'SaaS Platform Development',    desc: 'We build complex, scalable SaaS platforms from zero — auth, billing, dashboards, APIs, and everything in between.', tag: 'Scalable' },
  { icon: Globe,       title: 'Full-Stack Engineering',       desc: 'Pixel-perfect frontends to robust backend infrastructure — full-stack solutions built with modern, battle-tested tech.', tag: 'Full Stack' },
  { icon: Zap,         title: 'Rapid Prototyping & MVPs',     desc: "Got a bold idea? We move fast. From concept to a production-ready MVP in weeks, not months.", tag: 'Fast Delivery' },
];

const products = [
  { name: 'NanoPi',   desc: 'Your hyper-intelligent local AI assistant. Fast, private, and runs entirely on your own hardware. No cloud dependency.', tag: 'AI Assistant', href: '/nanopi',   icon: '🧠' },
  { name: 'OpenHub',  desc: 'The central command hub for managing all your OpenDev Labs products, services, and deployments in one unified interface.', tag: 'Platform',     href: '/open-hub', icon: '🌐' },
];

const stats = [
  { value: '100%',    label: 'Client Satisfaction' },
  { value: 'AI-First', label: 'Every Product' },
  { value: '24/7',    label: 'Support Available' },
  { value: '∞',       label: 'Scalability' },
];

export default function VoidLanding() {
  return (
    <div className="flex-1 w-full flex flex-col bg-background text-foreground overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative container max-w-screen-2xl mx-auto flex flex-col items-start gap-6 pb-28 pt-24 md:pt-40 px-4 md:px-8">
        {/* subtle grid backdrop */}
        <div className="bg-dot-pattern pointer-events-none absolute inset-0 opacity-50" />

        {/* Badge */}
        <Badge variant="outline" className="gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium">
          <Sparkles className="h-3 w-3 text-primary" />
          AI-first software studio · 2026
          <ChevronRight className="h-3 w-3" />
        </Badge>

        {/* Logo mark + wordmark */}
        <div className="flex items-center gap-4">
          <img
            src="/logo-icon.webp"
            alt="OpenDev Labs"
            className="w-14 h-14 md:w-16 md:h-16 rounded-2xl object-contain select-none"
          />
          <span className="text-base font-black uppercase tracking-widest text-foreground/70">
            opendev-labs
          </span>
        </div>

        {/* Headline */}
        <h1 className="relative max-w-5xl font-black tracking-tighter text-5xl sm:text-7xl md:text-8xl leading-[1.0] text-balance text-foreground">
          We Build<br />
          <span className="text-foreground/90">Software</span>{' '}
          <span className="text-muted-foreground">That Thinks.</span>
        </h1>

        <p className="max-w-[38rem] text-base sm:text-xl leading-relaxed text-muted-foreground">
          OpenDev Labs is an AI-first software company. We design and build premium custom websites, intelligent web apps, and AI-powered tools — for businesses and individuals who demand the absolute best.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-start gap-3 mt-2">
          <Button size="lg" className="font-bold px-8" asChild>
            <a href="mailto:opendev.office@gmail.com">
              Start a Project <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="font-bold px-8" asChild>
            <a href="https://github.com/opendev-labs" target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              View on GitHub
            </a>
          </Button>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 pt-10 w-full">
          <Separator className="absolute top-0 left-0 right-0" />
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-2xl sm:text-3xl font-black text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────── */}
      <section id="services" className="container max-w-screen-2xl mx-auto py-28 px-4 md:px-8">
        <Separator className="mb-16" />
        <div className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[4px] text-muted-foreground mb-4">What We Do</p>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-balance leading-tight text-foreground">
              Every service<br />your product needs.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
            From a landing page to a full AI-powered SaaS platform — we handle every layer of the stack.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <Card key={i} className="group flex flex-col h-full hover:bg-accent/50 transition-colors duration-200 cursor-default">
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-3 text-[10px] tracking-widest uppercase">
                  {s.tag}
                </Badge>
                <s.icon className="h-6 w-6 mb-3 text-foreground" />
                <CardTitle className="text-base font-bold">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-sm leading-relaxed">{s.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ─────────────────────────────────────────────── */}
      <section className="container max-w-screen-2xl mx-auto py-28 px-4 md:px-8">
        <Separator className="mb-16" />
        <div className="mb-14">
          <p className="text-xs font-bold uppercase tracking-[4px] text-muted-foreground mb-4">Our Products</p>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground">
            Built by us.<br />Available for you.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {products.map((p, i) => (
            <Card key={i} className="group flex flex-col h-full hover:bg-accent/50 transition-colors duration-200">
              <CardHeader>
                <div className="text-4xl mb-4">{p.icon}</div>
                <Badge variant="outline" className="w-fit mb-2 text-[10px] tracking-widest uppercase">{p.tag}</Badge>
                <CardTitle className="text-2xl font-black">{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between gap-6">
                <CardDescription className="text-sm leading-relaxed">{p.desc}</CardDescription>
                <Button variant="ghost" className="w-fit px-0 font-bold group-hover:text-foreground" asChild>
                  <Link to={p.href}>
                    Open {p.name} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="container max-w-screen-2xl mx-auto py-28 px-4 md:px-8">
        <Separator className="mb-16" />
        <Card className="relative overflow-hidden p-4 md:p-8">
          <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12 p-4 md:p-8">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Star className="h-4 w-4 fill-foreground text-foreground" />
                <span className="text-sm font-semibold text-muted-foreground">Ready to build something great?</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-foreground text-balance">
                Let's build your<br />next big thing.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                Whether it's a website, a web app, or an AI-powered platform — we deliver products that perform, convert, and scale.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-start gap-3">
              <Button size="lg" className="font-bold px-10 py-6 text-base" asChild>
                <a href="mailto:opendev.office@gmail.com">
                  Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">📧 opendev.office@gmail.com</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer>
        <Separator />
        <div className="container max-w-screen-2xl mx-auto py-10 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.webp" alt="OpenDev Labs" className="w-7 h-7 rounded-lg object-contain" />
            <span className="font-black tracking-tight text-sm text-foreground">opendev-labs</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#services" className="hover:text-foreground transition-colors">Services</a>
            <Link to="/nanopi" className="hover:text-foreground transition-colors">NanoPi</Link>
            <Link to="/open-hub" className="hover:text-foreground transition-colors">OpenHub</Link>
            <a href="https://github.com/opendev-labs" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
              GitHub <ExternalLink className="h-3 w-3" />
            </a>
          </nav>
          <p className="text-xs text-muted-foreground">© 2026 OpenDev Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
