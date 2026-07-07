import { Terminal, Code2, Rocket, ArrowRight, ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroBg from '../assets/bg.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function VoidLanding() {
    return (
        <div className="flex flex-col w-full min-h-screen bg-background text-foreground selection:bg-emerald-500/30 overflow-x-hidden">
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
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
                </div>

                <div className="relative z-10 text-center max-w-6xl px-6 flex flex-col items-center mt-[-10vh]">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-10"
                    >
                        <Badge variant="outline" className="px-5 py-2 bg-background/80 backdrop-blur-md text-xs font-semibold uppercase tracking-[0.2em] border-border gap-2">
                            <Terminal size={14} className="text-emerald-400" />
                            Premium Engineering Division
                        </Badge>
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
                        className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-14 leading-relaxed font-light"
                    >
                        Architecting the future of software. We deliver bespoke, high-performance <strong className="text-foreground font-medium">custom software services</strong> and <strong className="text-foreground font-medium">private engineering projects</strong> for forward-thinking enterprises.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto"
                    >
                        <Button asChild size="lg" className="w-full sm:w-auto h-14 px-10 rounded-full font-bold shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] hover:-translate-y-1 transition-all duration-300 text-sm uppercase tracking-widest">
                            <a href="#services">Explore Services</a>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 rounded-full bg-background/50 backdrop-blur-md border-border hover:bg-accent hover:border-accent transition-all duration-300 flex items-center justify-center gap-2 font-medium hover:-translate-y-1 text-sm uppercase tracking-widest">
                            <Link to="/open-studio">
                                Launch OpenStudio <ArrowRight size={18} />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Custom Services Section */}
            <section id="services" className="py-32 relative bg-zinc-950/50">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-20 text-center"
                    >
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-foreground">Custom Engineering.</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">From secure private infrastructure to highly scalable public applications, we build bespoke software solutions that dominate the market.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: Code2, color: 'text-blue-400', bg: 'bg-blue-500/5', title: 'Bespoke Software', desc: "End-to-end development of custom applications. Whether it's a complex SaaS platform or a specialized internal tool, our elite engineers deliver pixel-perfect execution." },
                            { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/5', title: 'Private & Public Projects', desc: "Strict confidentiality for private IP and enterprise architecture, alongside open-source excellence for public-facing deployments. Security is built-in from day one." },
                            { icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/5', title: 'AI Integration', desc: "Seamlessly integrate state-of-the-art LLMs, neural networks, and automation pipelines into your existing corporate infrastructure." }
                        ].map((card, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="h-full"
                            >
                                <Card className="h-full bg-card/50 backdrop-blur-sm border-border hover:border-accent transition-colors group relative overflow-hidden flex flex-col rounded-3xl p-4">
                                    <div className={`absolute inset-0 ${card.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    <CardHeader className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                            <card.icon className={card.color} size={28} strokeWidth={1.5} />
                                        </div>
                                        <CardTitle className="text-2xl font-bold">{card.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="relative z-10 flex-grow">
                                        <CardDescription className="text-muted-foreground leading-relaxed font-light text-base">
                                            {card.desc}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section (OpenStudio) */}
            <section className="py-40 bg-background relative border-t border-border overflow-hidden">
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
                        <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-accent/50 text-[10px] font-bold mb-8 uppercase tracking-[0.2em] backdrop-blur-md gap-2">
                            <Rocket size={12} />
                            Flagship IDE
                        </Badge>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.95]">OpenStudio IDE.</h2>
                        <p className="text-xl text-muted-foreground mb-10 leading-relaxed font-light">
                            Experience our cutting-edge capabilities firsthand. OpenStudio is our sovereign, AI-native development workspace. Featuring full-stack cloud devbox integration, sandpack rendering, and continuous neural assistance.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-6 mb-12">
                            <div className="flex items-center gap-3"><Globe className="text-emerald-400" size={20}/><span className="font-medium text-sm text-muted-foreground">Cloud Sandboxes</span></div>
                            <div className="flex items-center gap-3"><Cpu className="text-blue-400" size={20}/><span className="font-medium text-sm text-muted-foreground">Agentic Codegen</span></div>
                        </div>

                        <Button asChild size="lg" className="h-16 px-10 rounded-full font-bold shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm">
                            <Link to="/open-studio" className="flex items-center gap-3">
                                Open Workspace <ArrowRight size={18} />
                            </Link>
                        </Button>
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
                        <div className="aspect-[4/3] w-full rounded-2xl bg-card border border-border shadow-[0_20px_80px_rgba(0,0,0,0.8)] p-3 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                            </div>
                            <div className="mt-8 flex gap-4 h-[calc(100%-2rem)]">
                                <div className="w-1/3 bg-background rounded-xl border border-border/50 p-5 space-y-4">
                                    <div className="h-2.5 w-1/2 bg-muted rounded-full" />
                                    <div className="h-2.5 w-3/4 bg-muted rounded-full" />
                                    <div className="h-2.5 w-2/3 bg-muted rounded-full" />
                                    <div className="h-2.5 w-4/5 bg-muted rounded-full mt-8" />
                                    <div className="h-2.5 w-1/2 bg-muted rounded-full" />
                                </div>
                                <div className="w-2/3 bg-black rounded-xl border border-border/50 p-5 relative overflow-hidden">
                                    <div className="h-4 w-1/3 bg-muted rounded-full mb-8" />
                                    <div className="h-2.5 w-full bg-emerald-500/20 rounded-full mb-4" />
                                    <div className="h-2.5 w-5/6 bg-emerald-500/20 rounded-full mb-4" />
                                    <div className="h-2.5 w-4/6 bg-emerald-500/20 rounded-full mb-8" />
                                    <div className="h-2.5 w-full bg-muted rounded-full mb-4" />
                                    <div className="h-2.5 w-3/4 bg-muted rounded-full" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background py-16">
                <Separator className="mb-16" />
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center gap-2 mb-6 md:mb-0">
                        <Terminal className="text-emerald-400" size={20} />
                        <span className="font-bold text-foreground text-lg tracking-tight">OpenDev Labs.</span>
                    </div>
                    <div className="flex items-center gap-8 text-muted-foreground text-sm font-medium">
                        <a href="#" className="hover:text-foreground transition-colors">Services</a>
                        <a href="#" className="hover:text-foreground transition-colors">Projects</a>
                        <a href="#" className="hover:text-foreground transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
