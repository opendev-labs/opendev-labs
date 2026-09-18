import React from 'react';
import { PromptInput } from './PromptInput';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
    onSendMessage: (prompt: string) => void;
    isThinking: boolean;
    // Model props
    selectedModelId: string;
    onModelChange: (modelId: string) => void;
}

export function WelcomeScreen({ onSendMessage, isThinking, selectedModelId, onModelChange }: WelcomeScreenProps) {
    const [selectedCategory, setSelectedCategory] = React.useState<string>('All');

    const categories = ['All', 'SaaS', 'Dashboards', 'Forms', 'Portfolios', 'Apps'];

    const starterPills = [
        { category: 'SaaS', label: 'Create a landing page', prompt: 'Generate a high-converting SaaS landing page with animated hero section, feature showcase grid, social proof logo wall, pricing tiers, and FAQ accordion.' },
        { category: 'SaaS', label: 'Create a pricing page', prompt: 'Create a sleek pricing table with monthly/annual billing toggle switch, recommended popular tier highlight badge, feature checklist, and CTA buttons.' },
        { category: 'Forms', label: 'Create a login page', prompt: 'Build a modern, responsive user login page with email/password input fields, remember me checkbox, social OAuth buttons, glassmorphic card styling, and subtle hover animations.' },
        { category: 'Forms', label: 'Create a multi-step form', prompt: 'Create a multi-step wizard form with step indicator progress bar, form validation, animated tab transitions, and summary submission view.' },
        { category: 'Dashboards', label: 'Create a dashboard', prompt: 'Build an executive analytics dashboard with dark theme cards, key metric KPI counters, interactive bar/line charts, and responsive sidebar menu.' },
        { category: 'Portfolios', label: 'Create a blog', prompt: 'Build a modern tech blog landing page with featured articles grid, tag filtering, reading time indicators, newsletter subscription box, and dark mode aesthetic.' },
        { category: 'Forms', label: 'Create a contact page', prompt: 'Build a modern contact page with interactive contact form, embedded location map preview, social links, office working hours, and toast notification on submit.' },
        { category: 'Apps', label: 'Create a product page', prompt: 'Create an e-commerce product detail page with multi-angle image gallery preview, size/color variant selector, quantity counter, add-to-cart drawer, and customer reviews.' },
        { category: 'Portfolios', label: 'Create a portfolio website', prompt: 'Build an interactive developer portfolio website with dynamic typing header, filterable projects grid, skills badge cloud, timeline experience, and dark aesthetic.' }
    ];

    const filteredPills = selectedCategory === 'All' 
        ? starterPills 
        : starterPills.filter(p => p.category === selectedCategory);

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#050505] text-zinc-100 selection:bg-[#00f2fe]/30 selection:text-white relative overflow-x-hidden overflow-y-auto custom-scrollbar">
            {/* AMBIENT BACKGROUND GRADIENT */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div 
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: `radial-gradient(#00f2fe 1px, transparent 1px), radial-gradient(#27272a 1px, transparent 1px)`,
                        backgroundSize: `40px 40px`,
                        backgroundPosition: `0 0, 20px 20px`
                    }}
                />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#00f2fe]/10 via-cyan-500/5 to-rose-500/10 blur-[150px] rounded-full pointer-events-none" />
            </div>

            {/* MAIN CONTENT AREA */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 md:p-12 my-auto">
                <div className="w-full max-w-4xl flex flex-col items-center text-center">
                    
                    {/* OPENSTUDIO MAIN HEADLINE (1:1 V0 CLONE MATCH) */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center gap-2 mb-4"
                    >
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#f4f4f5] leading-tight font-sans">
                            What do you want to create?
                        </h1>
                        <p className="text-zinc-400 text-xs sm:text-sm font-normal">
                            Powered by <span className="text-white font-semibold">OpenStudio Intelligence</span> & <span className="text-[#00f2fe] font-semibold">CodeDevBox Cloud VM</span>
                        </p>
                    </motion.div>

                    {/* FLOATING PROMPT INPUT */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="w-full max-w-3xl mb-8"
                    >
                        <PromptInput
                            onSendMessage={onSendMessage}
                            disabled={isThinking}
                            selectedModelId={selectedModelId}
                            onModelChange={onModelChange}
                        />
                    </motion.div>

                    {/* CATEGORY TABS */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 }}
                        className="flex items-center justify-center gap-1.5 mb-4 bg-zinc-900/80 border border-zinc-800/80 p-1 rounded-full backdrop-blur-xl"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1 rounded-full text-[11px] font-bold transition-all duration-300 cursor-pointer ${
                                    selectedCategory === cat
                                        ? 'bg-white text-black shadow-md scale-105'
                                        : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>

                    {/* STARTER PROMPT PILLS */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap items-center justify-center gap-2.5 w-full max-w-3xl"
                    >
                        {filteredPills.map((pill) => (
                            <button
                                key={pill.label}
                                onClick={() => onSendMessage(pill.prompt)}
                                className="px-4 py-2 rounded-full bg-zinc-900/70 border border-zinc-800/80 text-zinc-300 text-xs font-medium hover:border-[#00f2fe]/60 hover:text-white hover:bg-zinc-900 hover:shadow-[0_0_15px_rgba(0,242,254,0.15)] transition-all duration-300 cursor-pointer backdrop-blur-md"
                            >
                                {pill.label}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}