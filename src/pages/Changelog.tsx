import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, Shield, Terminal, ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ChangeEntry {
    version: string;
    date: string;
    type: 'CORE' | 'AI' | 'NEXUS' | 'SYSTEM';
    title: string;
    description: string;
    updates: string[];
    icon: any;
}

const changelogData: ChangeEntry[] = [
    {
        version: "v2.4.0",
        date: "FEB 02, 2026",
        type: "AI",
        title: "open-studio Superagent & Core",
        description: "A major overhaul of the AI orchestrator and workspace management.",
        icon: Sparkles,
        updates: [
            "Evolved Nexus to open-studio with 'Neural Handshake' chat interface.",
            "Implemented buttery smooth 'Infrastructure Slide-in' for builds.",
            "Created Agents Registry for managing specialized AI personas.",
            "Fixed Pulse V2 Preview with robust Babel-powered runtime.",
            "Integrated SyncStack connection UI for GitHub, Vercel, and Firebase."
        ]
    },
    {
        version: "v2.3.5",
        date: "JAN 30, 2026",
        type: "NEXUS",
        title: "Official Identity & Branding",
        description: "Establishing a unified visual language and secure authentication flow.",
        icon: Shield,
        updates: [
            "Deployed the official OpenDev-Labs high-fidelity logo.",
            "Refined Preloader experience with SVG path animations.",
            "Upgraded Digital Pact (Terms) and Privacy Protocol.",
            "Established Hardline Protocol for cross-node authentication."
        ]
    },
    {
        version: "v2.3.0",
        date: "JAN 28, 2026",
        type: "CORE",
        title: "LamaDB & Void Integration",
        description: "The primary database layer is now fully connected to the engine.",
        icon: Cpu,
        updates: [
            "LamaDB integrated as the primary persistence engine for Void.",
            "Implemented Delta Reconciliation for 90% faster state sync.",
            "Added Universal CLI Harness via Spoon CLI.",
            "Optimized state propagation across sovereign nodes."
        ]
    }
];

const CategoryBadge = ({ type }: { type: ChangeEntry['type'] }) => {
    const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        CORE: "default",
        AI: "destructive",
        NEXUS: "secondary",
        SYSTEM: "outline"
    };

    return (
        <Badge variant={variantMap[type]}>
            {type}
        </Badge>
    );
};

export const Changelog: React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <Header />

            <main className="container mx-auto max-w-4xl px-6 pt-24 pb-32">
                {/* Hero Section */}
                <header className="mb-20 space-y-4 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-muted-foreground text-sm font-medium justify-center md:justify-start"
                    >
                        <Terminal size={16} className="text-primary" /> Registry Updates
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight"
                    >
                        Changelog
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl"
                    >
                        Tracking the evolution of the sovereign intelligence ecosystem. Every node modification, every neural shift, registered in perpetuity.
                    </motion.p>
                </header>

                {/* Timeline */}
                <div className="relative space-y-16">
                    {/* Vertical Line */}
                    <div className="absolute left-0 md:left-1/2 top-4 bottom-0 w-[1px] bg-border -translate-x-1/2 hidden md:block" />

                    {changelogData.map((entry, index) => (
                        <motion.section
                            key={entry.version}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative flex flex-col md:flex-row gap-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Marker */}
                            <div className="absolute left-0 md:left-1/2 top-6 -translate-x-1/2 z-10 hidden md:block">
                                <div className="w-4 h-4 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="md:w-1/2 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="font-mono bg-muted/50">
                                        {entry.version}
                                    </Badge>
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {entry.date}
                                    </span>
                                    <CategoryBadge type={entry.type} />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        {entry.title}
                                    </h2>
                                    <p className="text-muted-foreground">
                                        {entry.description}
                                    </p>
                                </div>

                                <ul className="space-y-3 pt-2">
                                    {entry.updates.map((update, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                            <span className="text-sm text-foreground/90 leading-relaxed">
                                                {update}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Decorative Side (Icon/Visual) */}
                            <div className="md:w-1/2 flex items-center justify-center md:px-12">
                                <Card className="w-full aspect-video flex flex-col items-center justify-center bg-muted/30 border-dashed hover:bg-muted/50 transition-colors group">
                                    <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
                                        <div className="p-4 rounded-full bg-background border shadow-sm text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300">
                                            <entry.icon size={32} strokeWidth={1.5} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.section>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-32 pt-16 border-t flex flex-col items-center text-center space-y-6"
                >
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold tracking-tight">Stay synchronized.</h3>
                        <p className="text-muted-foreground">Follow our GitHub for real-time node updates and commit logs.</p>
                    </div>
                    <Button size="lg" asChild className="group">
                        <a href="https://github.com/opendev-labs" target="_blank" rel="noopener noreferrer">
                            Explore Repository <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </Button>
                </motion.footer>
            </main>

            <Footer />
        </div>
    );
};

export default Changelog;
