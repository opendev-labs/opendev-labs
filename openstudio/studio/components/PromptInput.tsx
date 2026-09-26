import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpIcon, ImageIcon, GridIcon, BrainCircuitIcon, PlusIcon, StarIcon } from './icons/Icons';
import { ModelDropdown } from './ModelDropdown';
import { SUPPORTED_MODELS } from '../constants';

interface PromptInputProps {
  onSendMessage: (prompt: string) => void;
  disabled: boolean;
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
}

export function PromptInput({ onSendMessage, disabled, selectedModelId, onModelChange }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const modelSelectorButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
    }
  }, [prompt]);

  const isSubmittingRef = useRef(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmittingRef.current || disabled) return;
    const trimmed = prompt.trim();
    if (!trimmed) return;

    isSubmittingRef.current = true;
    setPrompt('');
    onSendMessage(trimmed);

    // Keep locked for 600ms to guarantee no double-dispatch from Enter + form submit
    setTimeout(() => {
      isSubmittingRef.current = false;
    }, 600);
  };

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsModelDropdownOpen(false);
  };

  const hasContent = prompt.trim().length > 0;
  const currentModel = SUPPORTED_MODELS.find(m => m.id === selectedModelId);

  return (
    <div className="w-full px-2 pb-2 pt-1">
      <form onSubmit={handleSubmit} className="w-full relative group">
        <input ref={fileInputRef} type="file" className="hidden" multiple accept="image/*,.js,.ts,.tsx,.json,.css,.html" />

        {/* VERCEL AI ELEMENTS INPUT CONTAINER */}
        <div className="bg-[#0e0e11] border border-zinc-800 rounded-2xl flex flex-col p-2.5 transition-all duration-300 focus-within:border-zinc-700 shadow-xl">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }
            }}
            placeholder="Describe what you want to build..."
            className="w-full bg-transparent text-white text-xs sm:text-sm placeholder-zinc-500 resize-none focus:outline-none font-normal px-2 py-1.5 min-h-[52px] max-h-[160px] scrollbar-hide selection:bg-[#00f2fe]/30 selection:text-white"
            rows={1}
            disabled={disabled}
            autoFocus
          />

          {/* BOTTOM AI ELEMENTS TOOLBAR */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-900/80 px-1">
            {/* LEFT: (+) ATTACHMENT & MODEL SELECTOR */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Attach files or images"
              >
                <PlusIcon className="h-3.5 w-3.5" />
              </button>

              <div className="relative">
                <button
                  ref={modelSelectorButtonRef}
                  type="button"
                  className="flex items-center gap-1.5 text-zinc-200 hover:text-white transition-all text-[11px] font-semibold px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 rounded-lg shadow-sm cursor-pointer"
                  aria-label="Select model"
                  onClick={() => setIsModelDropdownOpen(prev => !prev)}
                >
                  <BrainCircuitIcon className="h-3 w-3 text-[#00f2fe]" />
                  <span>{currentModel?.name || 'v0 Max (Gemini 2.0)'}</span>
                  <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <ModelDropdown
                  isOpen={isModelDropdownOpen}
                  onClose={() => setIsModelDropdownOpen(false)}
                  anchorRef={modelSelectorButtonRef}
                  selectedModelId={selectedModelId}
                  onModelSelect={handleModelSelect}
                />
              </div>
            </div>

            {/* RIGHT: SUBMIT ↑ ICON BUTTON */}
            <button
              type="submit"
              disabled={disabled || !hasContent}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer ${
                hasContent 
                  ? 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_12px_rgba(255,255,255,0.2)] scale-105 active:scale-95' 
                  : 'bg-zinc-900 text-zinc-600 border border-zinc-800/60 cursor-not-allowed'
              }`}
              aria-label="Send message"
            >
              <ArrowUpIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}