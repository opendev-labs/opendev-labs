
import React from 'react';
import { WandIcon } from './icons/Icons';

interface SuggestedPromptsViewProps {
  suggestions: string[];
  onSendMessage: (prompt: string) => void;
}

export function SuggestedPromptsView({ suggestions, onSendMessage }: SuggestedPromptsViewProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-2 px-1">
      <div className="flex items-center gap-2 mb-1.5">
        <WandIcon className="h-3.5 w-3.5 text-[#00f2fe]" />
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Suggested Next Iterations:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSendMessage(prompt)}
            className="bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-[11px] font-medium px-3 py-1 rounded-full hover:border-[#00f2fe]/60 hover:text-white hover:bg-zinc-900 hover:shadow-[0_0_12px_rgba(0,242,254,0.15)] transition-all duration-300 cursor-pointer backdrop-blur-md"
          >
            + {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}