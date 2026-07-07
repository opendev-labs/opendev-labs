import { Terminal, Code2, Rocket, ArrowRight, ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function VoidLanding() {
    return (
        <div className="flex-1 w-full flex flex-col">
            {/* Hero Section */}
            <section className="container max-w-screen-2xl mx-auto flex flex-col items-start gap-4 pb-8 pt-24 md:pt-32 px-4 md:px-8">
                <a
                    href="https://github.com/opendev-labs"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
                >
                    🎉 <Separator className="mx-2 h-4" orientation="vertical" /> <span className="sm:hidden">New OpenStudio Release</span><span className="hidden sm:inline">Introducing OpenStudio IDE for agentic coding.</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                </a>
                
                <h1 className="max-w-4xl text-balance font-bold tracking-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                    Build sovereign AI solutions with OpenDev Labs.
                </h1>
                
                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    Beautifully designed bespoke software and premium engineering. Private cloud devboxes, neural assistance, and scalable infrastructure.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start gap-4 mt-4 w-full sm:w-auto">
                    <Button asChild size="lg" className="w-full sm:w-auto font-medium">
                        <Link to="/open-studio">Get Started</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-medium">
                        <a href="https://github.com/opendev-labs" target="_blank" rel="noreferrer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                            >
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                            GitHub
                        </a>
                    </Button>
                </div>
            </section>

            {/* Custom Services Section */}
            <section id="services" className="container max-w-screen-2xl mx-auto py-16 px-4 md:px-8 border-t border-border mt-16">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Custom Engineering.</h2>
                    <p className="text-lg text-muted-foreground">From secure private infrastructure to highly scalable public applications.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: Code2, title: 'Bespoke Software', desc: "End-to-end development of custom applications. Complex SaaS platforms and specialized internal tools delivered with pixel-perfect execution." },
                        { icon: ShieldCheck, title: 'Private & Public Projects', desc: "Strict confidentiality for private IP and enterprise architecture, alongside open-source excellence for public-facing deployments." },
                        { icon: Zap, title: 'AI Integration', desc: "Seamlessly integrate state-of-the-art LLMs, neural networks, and automation pipelines into your existing corporate infrastructure." }
                    ].map((card, i) => (
                        <Card key={i} className="shadow-none flex flex-col h-full bg-background transition-colors hover:bg-muted/50">
                            <CardHeader>
                                <card.icon className="h-8 w-8 mb-4 text-primary" />
                                <CardTitle className="text-xl font-bold">{card.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardDescription className="text-base text-muted-foreground">
                                    {card.desc}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Products Section (OpenStudio) */}
            <section className="container max-w-screen-2xl mx-auto py-16 px-4 md:px-8 border-t border-border">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">OpenStudio IDE.</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Experience our cutting-edge capabilities firsthand. OpenStudio is our sovereign, AI-native development workspace. Featuring full-stack cloud devbox integration, sandpack rendering, and continuous neural assistance.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-2">
                                <Globe className="text-muted-foreground h-4 w-4" />
                                <span className="font-medium text-sm">Cloud Sandboxes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Cpu className="text-muted-foreground h-4 w-4" />
                                <span className="font-medium text-sm">Agentic Codegen</span>
                            </div>
                        </div>

                        <Button asChild size="lg" variant="secondary" className="font-medium">
                            <Link to="/open-studio">
                                Open Workspace <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="flex-1 w-full">
                        {/* Minimalist Abstract IDE representation */}
                        <div className="aspect-[4/3] w-full rounded-xl bg-muted border border-border p-4 relative overflow-hidden flex flex-col shadow-sm">
                            <div className="flex gap-1.5 mb-4 border-b border-border pb-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                                <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                                <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                            </div>
                            <div className="flex gap-4 flex-1">
                                <div className="w-1/4 bg-background rounded-lg border border-border p-3 space-y-3">
                                    <div className="h-2 w-1/2 bg-muted rounded" />
                                    <div className="h-2 w-3/4 bg-muted rounded" />
                                    <div className="h-2 w-2/3 bg-muted rounded" />
                                </div>
                                <div className="w-3/4 bg-background rounded-lg border border-border p-4 space-y-3">
                                    <div className="h-3 w-1/3 bg-primary/20 rounded mb-6" />
                                    <div className="h-2 w-full bg-muted rounded" />
                                    <div className="h-2 w-5/6 bg-muted rounded" />
                                    <div className="h-2 w-4/6 bg-muted rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border mt-16">
                <div className="container max-w-screen-2xl mx-auto py-8 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <Terminal className="h-5 w-5" />
                        <span className="font-bold text-sm">opendev/labs</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <a href="#services" className="hover:text-foreground transition-colors font-medium">Services</a>
                        <Link to="/open-studio" className="hover:text-foreground transition-colors font-medium">IDE</Link>
                        <a href="https://github.com/opendev-labs" className="hover:text-foreground transition-colors font-medium">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
