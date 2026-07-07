import { Terminal, Code2, Rocket, ArrowRight, ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroBg from '../assets/bg.png';

export default function VoidLanding() {
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#020202] text-white selection:bg-emerald-500/30 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/djp3rpxm8/image/upload/v1721153164/grid_lq93k1.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
                    <img src={HeroBg} alt="Background" className="w-full h-full object-cover opacity-[0.15] mix-blend-screen" />
                    
                    {/* Animated glowing orbs */}
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" 
                    />
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020202]/80 to-[#020202]" />
                </div>

                <div className="relative z-10 text-center max-w-6xl px-6 flex flex-col items-center mt-[-10vh]">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-semibold text-zinc-300 mb-10 uppercase tracking-[0.2em] backdrop-blur-md"
                    >
                        <Terminal size={14} className="text-emerald-400" />
                        <span>Premium Engineering Division</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-6xl md:text-8xl lg:text-[110px] font-black tracking-tighter mb-8 leading-[0.9]"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-zinc-500">OpenDev </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-500 to-zinc-800">Labs.</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-14 leading-relaxed font-light"
                    >
                        Architecting the future of software. We deliver bespoke, high-performance <strong className="text-white font-medium">custom software services</strong> and <strong className="text-white font-medium">private engineering projects</strong> for forward-thinking enterprises.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto"
                    >
                        <a href="#services" className="w-full sm:w-auto h-16 px-10 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] hover:-translate-y-1 duration-300 text-sm uppercase tracking-widest">
                            Explore Services
                        </a>
                        <Link to="/open-studio" className="w-full sm:w-auto h-16 px-10 rounded-full bg-zinc-900/50 backdrop-blur-md border border-zinc-800 text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 font-medium hover:-translate-y-1 duration-300 text-sm uppercase tracking-widest">
                            Launch OpenStudio <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Custom Services Section */}
            <section id="services" className="py-32 relative">
                <div className="absolute inset-0 bg-zinc-950/50" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-20 text-center"
                    >
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-white">Custom Engineering.</h2>
                        <p className="text-xl text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed">From secure private infrastructure to highly scalable public applications, we build bespoke software solutions that dominate the market.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Code2, color: 'blue', title: 'Bespoke Software', desc: "End-to-end development of custom applications. Whether it's a complex SaaS platform or a specialized internal tool, our elite engineers deliver pixel-perfect execution." },
                            { icon: ShieldCheck, color: 'emerald', title: 'Private & Public Projects', desc: "Strict confidentiality for private IP and enterprise architecture, alongside open-source excellence for public-facing deployments. Security is built-in from day one." },
                            { icon: Zap, color: 'purple', title: 'AI Integration', desc: "Seamlessly integrate state-of-the-art LLMs, neural networks, and automation pipelines into your existing corporate infrastructure." }
                        ].map((card, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="p-10 rounded-3xl bg-[#080808] border border-zinc-900 hover:border-zinc-700 transition-colors group relative overflow-hidden flex flex-col h-full"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br from-${card.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className={`w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    <card.icon className={`text-${card.color}-400`} size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                                <p className="text-zinc-400 leading-relaxed font-light flex-grow">
                                    {card.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section (OpenStudio) */}
            <section className="py-40 bg-[#020202] relative border-t border-zinc-900 overflow-hidden">
                {/* Background glow for product */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-20">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex-1"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold text-white mb-8 uppercase tracking-[0.2em] backdrop-blur-md">
                            <Rocket size={12} />
                            <span>Flagship IDE</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.95]">OpenStudio IDE.</h2>
                        <p className="text-xl text-zinc-400 mb-10 leading-relaxed font-light">
                            Experience our cutting-edge capabilities firsthand. OpenStudio is our sovereign, AI-native development workspace. Featuring full-stack cloud devbox integration, sandpack rendering, and continuous neural assistance.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-6 mb-12">
                            <div className="flex items-center gap-3"><Globe className="text-emerald-400" size={20}/><span className="font-medium text-sm text-zinc-300">Cloud Sandboxes</span></div>
                            <div className="flex items-center gap-3"><Cpu className="text-blue-400" size={20}/><span className="font-medium text-sm text-zinc-300">Agentic Codegen</span></div>
                        </div>

                        <Link to="/open-studio" className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:-translate-y-1 duration-300 uppercase tracking-widest text-sm">
                            Open Workspace <ArrowRight size={18} />
                        </Link>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, type: "spring" }}
                        style={{ perspective: 1000 }}
                        className="flex-1 w-full"
                    >
                        {/* Abstract Representation of the IDE */}
                        <div className="aspect-[4/3] w-full rounded-2xl bg-[#08080a] border border-zinc-800 shadow-[0_20px_80px_rgba(0,0,0,0.8)] p-3 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                            </div>
                            <div className="mt-8 flex gap-4 h-[calc(100%-2rem)]">
                                <div className="w-1/3 bg-[#0a0a0c] rounded-xl border border-zinc-800/50 p-5 space-y-4">
                                    <div className="h-2.5 w-1/2 bg-zinc-800 rounded-full" />
                                    <div className="h-2.5 w-3/4 bg-zinc-800 rounded-full" />
                                    <div className="h-2.5 w-2/3 bg-zinc-800 rounded-full" />
                                    <div className="h-2.5 w-4/5 bg-zinc-800 rounded-full mt-8" />
                                    <div className="h-2.5 w-1/2 bg-zinc-800 rounded-full" />
                                </div>
                                <div className="w-2/3 bg-black rounded-xl border border-zinc-800/50 p-5 relative overflow-hidden">
                                    <div className="h-4 w-1/3 bg-zinc-700 rounded-full mb-8" />
                                    <div className="h-2.5 w-full bg-emerald-500/20 rounded-full mb-4" />
                                    <div className="h-2.5 w-5/6 bg-emerald-500/20 rounded-full mb-4" />
                                    <div className="h-2.5 w-4/6 bg-emerald-500/20 rounded-full mb-8" />
                                    <div className="h-2.5 w-full bg-zinc-800 rounded-full mb-4" />
                                    <div className="h-2.5 w-3/4 bg-zinc-800 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-900 bg-[#020202] py-16">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center gap-2 mb-6 md:mb-0">
                        <Terminal className="text-emerald-400" size={20} />
                        <span className="font-bold text-white text-lg tracking-tight">OpenDev Labs.</span>
                    </div>
                    <div className="flex items-center gap-8 text-zinc-500 text-sm font-medium">
                        <a href="#" className="hover:text-white transition-colors">Services</a>
                        <a href="#" className="hover:text-white transition-colors">Projects</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
