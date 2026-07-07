import { Terminal, Database, Cpu, Globe, ArrowRight, ShieldCheck, Zap, Box, Layout as LayoutIcon, Code, Command } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function Product() {
    return (
        <div className="flex flex-col w-full bg-background text-foreground">
            {/* Minimalist Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 overflow-hidden border-b">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1000px] bg-primary/5 blur-[180px] rounded-full" />
                </div>

                <div className="relative z-10 text-center max-w-5xl px-6">
                    <Badge variant="outline" className="mb-10 text-primary py-1.5 px-4 font-mono">
                        <Box size={14} className="mr-2" />
                        Product Engine v1.0 Live
                    </Badge>

                    <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-10 leading-[0.85] uppercase">
                        PRODUCT<span className="text-muted-foreground">.</span>ENGINE
                    </h1>
                    <p className="text-xl md:text-3xl text-muted-foreground max-w-3xl mx-auto mb-16 font-light leading-snug tracking-tight">
                        The definitive foundation for high-fidelity SaaS architecture.
                        Scalable by design, secure by instinct.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" asChild className="h-16 px-12 text-sm uppercase tracking-widest font-bold">
                            <Link to="/auth">
                                Launch Engine <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild className="h-16 px-12 text-sm uppercase tracking-widest font-bold">
                            <a href="https://github.com/opendev-labs/spoon">
                                Read Specs
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Sub-hero details */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-16 text-xs uppercase tracking-widest font-bold text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-foreground text-xl tracking-normal">0.1ms</span>
                        <span>State Sync</span>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-foreground text-xl tracking-normal">∞</span>
                        <span>Scalability</span>
                    </div>
                </div>
            </section>

            {/* Core Stack Section */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight uppercase mb-6">The Sovereign Stack</h2>
                        <div className="h-1 w-20 bg-primary mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* feature 1 */}
                        <Card className="group overflow-hidden transition-all hover:border-primary/50">
                            <CardContent className="p-10">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                                    <Database className="text-primary" size={28} />
                                </div>
                                <h3 className="text-lg font-bold tracking-tight mb-4 text-primary">LamaDB Protocol</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Native intelligence synchronization. Your state is distributed across the matrix with sub-atomic latency.
                                </p>
                            </CardContent>
                        </Card>
                        {/* feature 2 */}
                        <Card className="group overflow-hidden transition-all hover:border-primary/50">
                            <CardContent className="p-10">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                                    <Zap className="text-primary" size={28} />
                                </div>
                                <h3 className="text-lg font-bold tracking-tight mb-4 text-primary">SyncStack Flux</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Dynamic cluster management. Automatically rebalances infrastructure load across the global Q-Cloud.
                                </p>
                            </CardContent>
                        </Card>
                        {/* feature 3 */}
                        <Card className="group overflow-hidden transition-all hover:border-primary/50">
                            <CardContent className="p-10">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                                    <Globe className="text-primary" size={28} />
                                </div>
                                <h3 className="text-lg font-bold tracking-tight mb-4 text-primary">Q-Cloud Edge</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Global deployment without boundaries. Your engine lives everywhere simultaneously.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Terminal Demonstration */}
            <section className="py-32 border-y bg-muted/30">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <h2 className="text-5xl font-bold tracking-tight mb-10 leading-tight uppercase">
                            Engineered for <br /><span className="text-muted-foreground">Pure Performance.</span>
                        </h2>
                        <ul className="space-y-8">
                            <li className="flex items-start gap-6">
                                <ShieldCheck className="text-primary mt-1" size={24} />
                                <div className="space-y-1.5">
                                    <h4 className="font-semibold text-foreground">Quantum Security</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">End-to-end encryption woven into the fabric of every deployment.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-6">
                                <LayoutIcon className="text-primary mt-1" size={24} />
                                <div className="space-y-1.5">
                                    <h4 className="font-semibold text-foreground">High-Fidelity GUI</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">A seamless transition from CLI control to visual orchestration.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-all duration-1000" />
                        <Card className="relative overflow-hidden font-mono text-sm border shadow-lg">
                            <div className="flex items-center gap-2 mb-6 border-b p-4 bg-muted/50">
                                <div className="w-3 h-3 rounded-full bg-destructive" />
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <div className="w-3 h-3 rounded-full bg-secondary-foreground" />
                                <span className="ml-4 text-muted-foreground text-xs font-semibold">engine-controller</span>
                            </div>
                            <div className="p-6 pt-0 space-y-6">
                                <div className="flex gap-4">
                                    <span className="text-muted-foreground">$</span>
                                    <span className="text-foreground font-semibold">spoon deploy --prod</span>
                                </div>
                                <div className="text-primary ml-6 leading-relaxed space-y-1">
                                    ▸ ANALYZING CLUSTER...<br />
                                    ▸ OPTIMIZING BUNDLES...<br />
                                    ▸ UPLOADING TO EDGE...<br />
                                </div>
                                <div className="mt-8 p-4 bg-muted rounded-md border">
                                    <div className="text-muted-foreground font-semibold mb-1 text-xs uppercase tracking-wider">Success! Engine is live at:</div>
                                    <div className="text-foreground text-base underline decoration-primary underline-offset-4">https://product.opendev-labs.io</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-40 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)] opacity-5" />
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight uppercase mb-12 relative z-10">
                    Master the <br /><span className="text-muted-foreground">Production Engine.</span>
                </h2>
                <Button size="lg" asChild className="h-16 px-16 text-sm uppercase tracking-widest font-bold shadow-lg">
                    <Link to="/auth">
                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </section>
        </div>
    );
}
