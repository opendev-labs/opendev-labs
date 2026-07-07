import { Terminal, Code2, Rocket, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroBg from '../assets/bg.png';

export default function VoidLanding() {
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#030303] text-white selection:bg-emerald-500/30">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img src={HeroBg} alt="Background" className="w-full h-full object-cover opacity-20 invert-[.02] mix-blend-screen" />
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
                    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/80 to-[#030303]" />
                </div>

                <div className="relative z-10 text-center max-w-5xl px-6 flex flex-col items-center mt-[-5vh]">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-8 uppercase tracking-[0.25em] shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                        <Terminal size={14} />
                        <span>Premium Engineering Division</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                        OpenDev Labs.
                    </h1>
                    
                    <p className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        Architecting the future of software. We deliver bespoke, high-performance <strong className="text-white font-medium">custom software services</strong> and <strong className="text-white font-medium">private engineering projects</strong> for forward-thinking enterprises.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
                        <Link to="/open-studio" className="w-full sm:w-auto h-14 px-8 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:-translate-y-0.5">
                            Launch OpenStudio <ArrowRight size={18} />
                        </Link>
                        <a href="#services" className="w-full sm:w-auto h-14 px-8 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center font-medium">
                            Explore Services
                        </a>
                    </div>
                </div>
            </section>

            {/* Custom Services Section */}
            <section id="services" className="py-32 bg-[#030303] relative border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Custom Engineering.</h2>
                        <p className="text-xl text-zinc-400 max-w-2xl">From secure private infrastructure to highly scalable public applications, we build tailored software solutions.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-10 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Code2 className="mb-8 text-blue-400" size={36} strokeWidth={1.5} />
                            <h3 className="text-2xl font-bold mb-4">Bespoke Software</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                End-to-end development of custom applications. Whether it's a complex SaaS platform or a specialized internal tool, our elite engineers deliver pixel-perfect execution.
                            </p>
                        </div>
                        <div className="p-10 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <ShieldCheck className="mb-8 text-emerald-400" size={36} strokeWidth={1.5} />
                            <h3 className="text-2xl font-bold mb-4">Private & Public Projects</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Strict confidentiality for private IP and enterprise architecture, alongside open-source excellence for public-facing deployments. Security is built-in from day one.
                            </p>
                        </div>
                        <div className="p-10 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Zap className="mb-8 text-purple-400" size={36} strokeWidth={1.5} />
                            <h3 className="text-2xl font-bold mb-4">AI Integration</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Seamlessly integrate state-of-the-art LLMs, neural networks, and automation pipelines into your existing corporate infrastructure.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section (OpenStudio) */}
            <section className="py-32 bg-black relative border-t border-zinc-900 overflow-hidden">
                {/* Background glow for product */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-white mb-6 uppercase tracking-widest">
                            <Rocket size={14} />
                            <span>Flagship Product</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">OpenStudio IDE</h2>
                        <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
                            Experience our cutting-edge capabilities firsthand. OpenStudio is our sovereign, AI-native development workspace. Featuring full-stack cloud devbox integration, sandpack rendering, and continuous neural assistance.
                        </p>
                        <Link to="/open-studio" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform">
                            Open Workspace <ArrowRight size={20} />
                        </Link>
                    </div>
                    <div className="flex-1 w-full relative">
                        {/* Abstract Representation of the IDE */}
                        <div className="aspect-[4/3] w-full rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-2 relative">
                            <div className="absolute top-4 left-4 flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                            </div>
                            <div className="mt-8 flex gap-4 h-[calc(100%-2rem)]">
                                <div className="w-1/3 bg-[#050505] rounded-xl border border-zinc-800 p-4 space-y-3">
                                    <div className="h-2 w-1/2 bg-zinc-800 rounded-full" />
                                    <div className="h-2 w-3/4 bg-zinc-800 rounded-full" />
                                    <div className="h-2 w-2/3 bg-zinc-800 rounded-full" />
                                </div>
                                <div className="w-2/3 bg-black rounded-xl border border-zinc-800 p-4 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
                                    <div className="h-3 w-1/3 bg-zinc-700 rounded-full mb-6" />
                                    <div className="h-2 w-full bg-zinc-800 rounded-full mb-3" />
                                    <div className="h-2 w-5/6 bg-zinc-800 rounded-full mb-3" />
                                    <div className="h-2 w-4/6 bg-zinc-800 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-900 bg-[#030303] py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-zinc-500 text-sm font-medium">
                    <p>© 2026 OpenDev Labs. All rights reserved.</p>
                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Services</a>
                        <a href="#" className="hover:text-white transition-colors">Projects</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
