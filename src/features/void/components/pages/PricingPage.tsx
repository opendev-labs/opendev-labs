import React from 'react';
import { RunwayPricing } from '../../../../components/pricing/RunwayPricing';

export const PricingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-zinc-900 py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto text-center mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-bold tracking-widest uppercase text-zinc-600 mb-4">
                    Protocol & Software Economics
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 mb-3">
                  Mesh & Service Scalability.
                </h1>
                <p className="text-zinc-600 max-w-xl mx-auto text-sm font-medium">
                  Initialize your node for free, then scale your intelligence across the edge mesh.
                </p>
            </div>

            <RunwayPricing />
        </div>
    );
};