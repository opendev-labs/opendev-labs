import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Database, Globe, ArrowRight, Code2, Rocket, Users, Zap, GitBranch, Layers, Cpu, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../features/void/hooks/useAuth';

/* ─────────────────────────────────────────────────────
   TECHNOLOGY ROW — Grayscale, static
   ─────────────────────────────────────────────────── */
const TechRow = () => {
    const techs = ['react', 'nextjs', 'typescript', 'nodejs', 'vite', 'tailwind'];
    return (
        <div className="border-y border-zinc-900/60 py-10 bg-zinc-950/20 backdrop-blur-sm relative z-10">
            <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap justify-center items-center gap-12 sm:gap-16 opacity-30">
                {techs.map((id) => (
                    <img
                        key={id}
                        src={`https://skillicons.dev/icons?i=${id}`}
                        alt={id}
                        className="h-6 w-auto grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                    />
                ))}
            </div>
        </div>
    );
};

const ScenarioCard = ({ icon: Icon, title, desc, onClick, actionLabel }: {
    icon: any; title: string; desc: string; onClick: () => void; actionLabel: string;
}) => (
    <div
        onClick={onClick}
        className="group cursor-pointer relative p-8 bg-zinc-950/40 border border-zinc-900 rounded-3xl hover:border-red-500/20 hover:bg-red-500/[0.01] transition-all duration-500 shadow-2xl flex flex-col justify-between h-[280px]"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
        <div>
            <div className="w-12 h-12 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mb-6 group-hover:border-red-500/20 group-hover:bg-red-500/5 transition-all duration-500">
                <Icon size={20} className="text-zinc-500 group-hover:text-red-500 transition-colors duration-500" />
            </div>
            <h3 className="text-[15px] font-extrabold text-white mb-2 tracking-tight group-hover:text-red-500 transition-colors duration-500 uppercase">{title}</h3>
            <p className="text-[13px] text-zinc-500 leading-relaxed font-medium">{desc}</p>
        </div>
        <span className="text-[10px] font-bold text-zinc-600 group-hover:text-red-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest pt-4">
            {actionLabel} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </span>
    </div>
);

const CodeBlock = () => (
    <div className="bg-[#08080a] border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl relative z-10 glow-red-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-900/60 bg-zinc-950/80">
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            </div>
            <span className="text-[10px] text-red-500/70 font-mono font-bold uppercase tracking-widest">open-studio terminal</span>
        </div>
        <div className="p-6 font-mono text-[12px] leading-relaxed space-y-3.5 text-zinc-400">
            <div>
                <span className="text-zinc-700 font-bold">&gt;&gt;&gt;</span>{' '}
                <span className="text-zinc-500">initialize</span>{' '}
                <span className="text-red-400">opendev-labs/open-studio</span>
            </div>
            <div>
                <span className="text-zinc-700 font-bold">&gt;&gt;&gt;</span>{' '}
                <span className="text-zinc-400">compile prompt:</span>{' '}
                <span className="text-white">"three.js interactive galaxy simulation"</span>
            </div>
            <div className="pl-4 border-l border-red-500/20 text-[11px] text-zinc-500 space-y-1">
                <div>[1] resolving three.js package via npm gateway...</div>
                <div>[2] installing dependency three@latest... done.</div>
                <div>[3] materializing sandbox rendering tree... done.</div>
            </div>
            <div className="pt-3 border-t border-zinc-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-extrabold">✓</span>{' '}
                    <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wide">Handshake Successful</span>
                </div>
                <span className="text-[9px] bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded text-red-400 font-bold tracking-widest uppercase">Live</span>
            </div>
        </div>
    </div>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
    <div className="text-center p-6 bg-zinc-950/20 border border-zinc-900/50 rounded-2xl relative overflow-hidden group hover:border-red-500/10 transition-colors">
        <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tighter group-hover:text-red-500 transition-colors">{value}</div>
        <div className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-widest">{label}</div>
    </div>
);

/* ═══════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════ */
export default function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex flex-col w-full bg-[#020202] min-h-screen overflow-hidden relative selection:bg-red-500/30 selection:text-white bg-dot-pattern-orange">
            {/* Ambient Radial Gradient Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1000px] h-[400px] bg-red-500/[0.04] blur-[150px] rounded-full pointer-events-none z-0" />
            <div className="absolute top-[40vh] right-[10vw] w-[300px] h-[300px] bg-red-500/[0.02] blur-[100px] rounded-full pointer-events-none z-0" />

            {/* ── HERO ─────────────────────────────── */}
            <section className="relative px-6 pt-36 pb-24 md:pt-52 md:pb-36 overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 mb-8 uppercase tracking-[0.2em] shadow-lg shadow-red-500/5"
                    >
                        <Terminal size={12} className="animate-pulse" />
                        <span>Genesis Protocol v1.0 // Sovereign AI environment</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.95] mb-8 lowercase"
                    >
                        build, deploy, and share<br />
                        <span className="text-zinc-600">with </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 font-mono">ai friends.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
                    >
                        opendev-labs is an AI-native social workspace. Generate frontends in open-studio with hot reload, publish templates to the feed, and direct message custom developer AI friends.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20"
                    >
                        <button
                            onClick={() => navigate(isAuthenticated ? '/open-studio' : '/auth')}
                            className="w-full sm:w-auto h-12 px-10 bg-red-500 text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-red-600 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-500/10"
                        >
                            Configure Handshake <ArrowRight size={16} />
                        </button>
                        <button
                            onClick={() => navigate('/docs')}
                            className="w-full sm:w-auto h-12 px-10 bg-zinc-950 text-zinc-300 text-xs font-bold uppercase tracking-widest rounded-full border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900 transition-all duration-300 backdrop-blur-md cursor-pointer"
                        >
                            Nexus Manifest
                        </button>
                    </motion.div>

                    <p className="mt-16 text-[9px] text-zinc-700 font-bold uppercase tracking-[0.5em] animate-pulse">
                        Protocol 2026 // Decentralized Materialization
                    </p>
                </div>
            </section>

            {/* ── TECHNOLOGY ROW ───────────────────── */}
            <TechRow />

            {/* ── SCENARIO CARDS ────────────────────── */}
            <section className="py-32 relative">
                <div className="max-w-[1100px] mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4 lowercase">
                            Everything you need to build
                        </h2>
                        <p className="text-sm md:text-base text-zinc-500 max-w-lg mx-auto leading-relaxed font-medium">
                            AI-powered tools that run code in real-time. Zero local setup required.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ScenarioCard
                            icon={Zap}
                            title="open-studio IDE"
                            desc="AI code generation with real npm execution. Install packages, write frameworks, view previews."
                            onClick={() => navigate('/open-studio')}
                            actionLabel="Launch Editor"
                        />
                        <ScenarioCard
                            icon={Users}
                            title="open-hub Social"
                            desc="Connect with developers, DM customizable AI friends, and publish live interactive sandboxes."
                            onClick={() => navigate(isAuthenticated ? '/open-hub' : '/auth')}
                            actionLabel="Connect Mesh"
                        />
                        <ScenarioCard
                            icon={Rocket}
                            title="One-Click Deploy"
                            desc="Materialize your layout directly onto GitHub Pages in seconds with secure auth integration."
                            onClick={() => navigate('/open-studio')}
                            actionLabel="Read Protocol"
                        />
                    </div>
                </div>
            </section>

            {/* ── TWO-COL: DESCRIPTION + CODE BLOCK ── */}
            <section className="py-24 md:py-32 border-t border-zinc-950/80 bg-zinc-950/20 relative">
                <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-[1.1] lowercase">
                            Get started in seconds
                        </h2>
                        <p className="text-[14px] font-medium text-zinc-400 leading-relaxed mb-10 max-w-md">
                            No local environments, configs, or package errors. Describe your vision, compile using Gemini, and see it materialize live.
                        </p>
                        <div className="space-y-5">
                            {[
                                { icon: Zap, text: 'Real npm packages loaded in-browser' },
                                { icon: Globe, text: 'Hot reloading visual sandboxes' },
                                { icon: Rocket, text: 'Instant deployments to GitHub Pages' },
                                { icon: Bot, text: 'Customizable Developer AI Friends' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                                        <item.icon size={12} className="text-red-400" />
                                    </div>
                                    <span className="text-[13px] font-medium text-zinc-300">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <CodeBlock />
                </div>
            </section>

            {/* ── STATS ──────────────────────────────── */}
            <section className="py-24 border-t border-zinc-950/80">
                <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <Stat value="15+" label="AI Models" />
                    <Stat value="6" label="Frameworks" />
                    <Stat value="∞" label="npm Packages" />
                    <Stat value="1-Click" label="Deploy" />
                </div>
            </section>

            {/* ── CTA ────────────────────────────────── */}
            <section className="py-32 border-t border-zinc-950/80 bg-zinc-950/10 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[200px] bg-red-500/[0.02] blur-[120px] rounded-full pointer-events-none z-0" />
                <div className="max-w-[600px] mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 lowercase">
                        Start building today
                    </h2>
                    <p className="text-sm font-medium text-zinc-500 mb-10">
                        Open-source gateway. Materialize templates instantly.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate(isAuthenticated ? '/open-studio' : '/auth')}
                            className="w-full sm:w-auto h-12 px-10 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        >
                            Open Studio
                        </button>
                        <a
                            href="https://github.com/opendev-labs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto h-12 px-10 text-xs font-bold text-zinc-400 border border-zinc-800 rounded-full hover:border-zinc-700 hover:text-white transition-all duration-300 flex items-center justify-center uppercase tracking-widest"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
