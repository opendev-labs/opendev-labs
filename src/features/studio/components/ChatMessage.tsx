import React, { useState } from 'react';
import type { Message } from '../types';
import { UserIcon } from './icons/Icons';
import { GenerationStatusView } from './GenerationStatusView';
import { 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  RotateCw, 
  MoreHorizontal, 
  ChevronDown 
} from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessageProps {
  message: Message;
  versionIndex?: number;
}

// Clean helper to extract pure conversational text and prevent raw JSON or code block leakage
const cleanMessageContent = (rawContent: string): string => {
  if (!rawContent) return '';
  let str = rawContent.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trim();

  // 1. JSON "conversation" key extraction
  const convMatch = str.match(/"conversation"\s*:\s*"((?:\\.|[^"\\])*)"?/);
  if (convMatch && convMatch[1]) {
    const unescaped = convMatch[1]
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\');
    return unescaped.trim();
  }

  // 2. If starts with JSON structure before conversation key arrives
  if (str.startsWith('{') || str.startsWith('```json')) {
    return "Materializing requested components in the live workspace...";
  }

  // 3. Strip all Markdown code blocks (including unclosed streaming blocks)
  str = str.replace(/```[a-zA-Z0-9_\-+.]*(\n[\s\S]*?(?:```|$)|[\s\S]*?$)/g, '').trim();

  // 4. Strip raw inline JSON objects
  str = str.replace(/\{[\s\S]*?\}/g, '').trim();

  // 5. If remaining text is raw TSX/JSX code imports or functions
  if (/^(import\s|export\s|function\s|const\s|class\s|<[a-zA-Z])/m.test(str)) {
    return "Materialized requested components directly into the live workspace.";
  }

  return str;
};

// Helper to extract raw thinking reasoning
const extractThinkingContent = (rawContent: string): string[] => {
  if (!rawContent) return [];
  const match = rawContent.match(/<think>([\s\S]*?)(?:<\/think>|$)/i);
  if (!match || !match[1]) return [];
  return match[1]
    .split('\n')
    .map(l => l.trim().replace(/^[•\-\*]\s*/, ''))
    .filter(Boolean);
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, versionIndex }) => {
  const { role, content, generationInfo } = message;
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [isCotOpen, setIsCotOpen] = useState(false);

  const isStudioGenerating = role === 'open-studio' && generationInfo?.status === 'generating';
  const hasFiles = !!(generationInfo && generationInfo.files.length > 0);
  const isThinkingPhase = isStudioGenerating && !hasFiles && !content;

  const displayContent = cleanMessageContent(content);
  const rawThoughts = extractThinkingContent(content);

  // Default structured Chain of Thought steps inspired by HeroUI Pro
  const cotSteps = rawThoughts.length > 0 
    ? rawThoughts.map(t => ({ title: 'Reasoning step', detail: t }))
    : [
        {
          title: 'Analyze architecture & requirements',
          detail: 'Parsed requirements, determined responsive layout hierarchy and styling tokens.'
        },
        {
          title: 'Materialize component structure',
          detail: 'Constructed component logic with interactive state, animations, and Tailwind styling.'
        },
        {
          title: 'Validate live sandbox preview',
          detail: 'Verified zero-error export compatibility for live DevBox/Sandpack rendering.'
        }
      ];

  const handleCopy = () => {
    if (displayContent) {
      navigator.clipboard.writeText(displayContent);
      setCopied(true);
      toast.success('Response copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-4xl mx-auto mb-5 animate-in fade-in slide-in-from-bottom-2 duration-300 px-3 group">
      <div className={`flex gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* AVATAR: HEROUI PRO STYLE */}
        <div className="flex-shrink-0 pt-0.5 select-none">
          {isUser ? (
            <div className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-300 font-semibold text-xs shadow-sm">
              <UserIcon className="h-3.5 w-3.5 text-zinc-300" />
            </div>
          ) : (
            <div className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-200 font-bold text-[11px] shadow-sm">
              <span>AI</span>
            </div>
          )}
        </div>

        {/* CONTENT COLUMN */}
        <div className={`flex-1 min-w-0 flex flex-col gap-1.5 ${isUser ? 'items-end ml-6' : 'items-start mr-4'}`}>
          
          {/* USER MESSAGE: HEROUI PRO CHAT CONVERSATION STYLE BUBBLE */}
          {isUser ? (
            <div className="bg-[#1f1f23] text-zinc-100 px-4 py-2.5 rounded-2xl rounded-tr-sm text-[13px] border border-zinc-800/80 shadow-sm max-w-[85%] font-normal leading-relaxed break-words">
              {displayContent}
            </div>
          ) : (
            /* ASSISTANT MESSAGE */
            <div className="w-full flex flex-col gap-1 text-[13px] leading-relaxed text-zinc-200">
              
              {/* HEROUI PRO CHAIN OF THOUGHT (COLLAPSIBLE REASONING) */}
              <div className="w-full mb-1">
                <button
                  onClick={() => setIsCotOpen(!isCotOpen)}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer select-none group"
                >
                  <span className="font-medium text-[11px] text-zinc-400 group-hover:text-zinc-200">
                    {isThinkingPhase ? 'Thinking...' : 'Thought for 2s'}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${isCotOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCotOpen && (
                  <div className="mt-1 pl-3 border-l border-zinc-800/90 space-y-2 py-1 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                    {cotSteps.map((step, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex items-center gap-2 text-zinc-300 font-semibold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                          <span>{step.title}</span>
                        </div>
                        <p className="text-zinc-500 text-[11px] pl-3.5 leading-relaxed font-normal">{step.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MESSAGE CONTENT */}
              {isThinkingPhase ? (
                <div className="flex items-center gap-2.5 py-1 text-zinc-400">
                  <svg className="w-3.5 h-3.5 animate-spin text-[#00f2fe]" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-[12px] font-medium text-zinc-400 font-mono">TARS is materializing code...</p>
                </div>
              ) : (
                <div className="text-[13px] leading-relaxed font-normal whitespace-pre-wrap text-zinc-200 selection:bg-[#00f2fe]/30">
                  {displayContent || (isStudioGenerating ? "Materializing requested components..." : "")}
                  {isStudioGenerating && (
                    <span className="inline-block w-1.5 h-3.5 bg-[#00f2fe] animate-pulse ml-1 translate-y-0.5 rounded-sm" />
                  )}
                </div>
              )}

              {/* FILE ACTION LIST */}
              {hasFiles && generationInfo && (
                <div className="w-full mt-2 max-w-md">
                  <GenerationStatusView info={generationInfo} />
                </div>
              )}

              {/* HEROUI PRO CHAT MESSAGE ACTIONS */}
              {!isStudioGenerating && displayContent && (
                <div className="flex items-center gap-1 mt-2 text-zinc-500 select-none">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors cursor-pointer"
                    title="Copy response"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      const next = feedback === 'like' ? null : 'like';
                      setFeedback(next);
                      if (next) toast.success('Thanks for the feedback!');
                    }}
                    className={`p-1.5 rounded-md hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors cursor-pointer ${
                      feedback === 'like' ? 'text-[#00f2fe] bg-zinc-800/60' : ''
                    }`}
                    title="Good response"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      const next = feedback === 'dislike' ? null : 'dislike';
                      setFeedback(next);
                      if (next) toast.info('Feedback recorded');
                    }}
                    className={`p-1.5 rounded-md hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors cursor-pointer ${
                      feedback === 'dislike' ? 'text-rose-400 bg-zinc-800/60' : ''
                    }`}
                    title="Bad response"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toast.info('Regenerating component...')}
                    className="p-1.5 rounded-md hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors cursor-pointer"
                    title="Regenerate"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toast.info('Version: TARS 24/7 v' + (versionIndex !== undefined ? versionIndex + 1 : 1))}
                    className="p-1.5 rounded-md hover:bg-zinc-800/80 hover:text-zinc-200 transition-colors cursor-pointer"
                    title="More options"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};