import {
    Terminal,
    Zap,
    Activity,
    Code2,
    Cpu,
    Globe
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FeatureCard = ({ title, desc, icon: Icon, large = false }: any) => (
    <Card className={`
        group overflow-hidden transition-all hover:border-primary/50
        ${large ? 'col-span-12 md:col-span-8' : 'col-span-12 md:col-span-4'}
    `}>
        <CardContent className="p-8 h-full flex flex-col">
            <div className="mb-6 p-3 bg-muted rounded-lg w-fit border border-border group-hover:scale-110 transition-transform">
                <Icon size={24} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight mb-3 text-foreground">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
        </CardContent>
    </Card>
);

export default function Products() {
    return (
        <section className="max-w-[1400px] mx-auto px-6 grid grid-cols-12 min-h-screen gap-6 py-24">
            <div className="col-span-12 py-12 text-center border-b mb-12">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Our Ecosystem</h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-lg">Develop with your favorite tools. Launch globally, instantly. Keep pushing.</p>
            </div>

            <FeatureCard
                title="QBET Engine"
                desc="A custom-built language for sovereign data verification and reality simulation."
                icon={Terminal}
                large={true}
            />
            <FeatureCard
                title="AgentBash"
                desc="Expert AI Bash Agents for high-level automation."
                icon={Zap}
            />
            <FeatureCard
                title="ScanTrade Pro"
                desc="Real-time deterministic multi-asset intelligence."
                icon={Activity}
            />
            <FeatureCard
                title="Void Environment"
                desc="Local AI capability with seamless SyncStack integration."
                icon={Cpu}
                large={true}
            />
            <FeatureCard
                title="Spoon CLI"
                desc="Advanced trading analysis and agent creation."
                icon={Code2}
            />
            <FeatureCard
                title="Open-URLs"
                desc="Global link redirection service."
                icon={Globe}
            />
        </section>
    );
}
