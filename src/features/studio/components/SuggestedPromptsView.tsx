
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
    <div className="w-full max-w-3xl mx-auto pb-3">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1.5">
          <WandIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSendMessage(prompt)}
              className="bg-card border border-border text-muted-foreground text-sm px-3 py-1.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors duration-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}