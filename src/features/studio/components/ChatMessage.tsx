import React from 'react';
import type { Message } from '../types';
import { UserIcon, NexusIcon, SpinnerIcon, GridIcon } from './icons/Icons';
import { GenerationStatusView } from './GenerationStatusView';

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

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, versionIndex }) => {
  const { role, content, generationInfo } = message;
  const isUser = role === 'user';

  const isStudioGenerating = role === 'open-studio' && generationInfo?.status === 'generating';
  const hasFiles = !!(generationInfo && generationInfo.files.length > 0);
  const isThinkingPhase = isStudioGenerating && !hasFiles && !content;

  const displayContent = cleanMessageContent(content);

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
      <div className={`flex gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* AVATAR/ICON */}
        <div className="flex-shrink-0 pt-1">
          {isUser ? (
            <div className="h-8 w-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-black font-bold text-xs shadow-md">
              <UserIcon className="h-4 w-4 text-black" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center text-[#00f2fe] shadow-[0_0_12px_rgba(0,242,254,0.3)] relative">
              <NexusIcon className="h-4 w-4 text-[#00f2fe]" />
            </div>
          )}
        </div>

        {/* CONTENT AREA */}
        <div className={`flex-1 min-w-0 flex flex-col gap-2 ${isUser ? 'items-end ml-6' : 'items-start mr-6'}`}>
          {!isUser && versionIndex !== undefined && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-400 mb-0.5">
              <span>v{versionIndex + 1}</span>
            </div>
          )}

          <div className={`max-w-full px-3.5 py-2 transition-all duration-300 ${
            isUser 
              ? 'bg-white text-black font-semibold rounded-2xl rounded-tr-sm shadow-md text-[11px] sm:text-[12px]' 
              : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200 rounded-2xl rounded-tl-sm backdrop-blur-xl shadow-xl text-[11px] sm:text-[12px]'
          }`}>
            {isThinkingPhase ? (
              <div className="flex items-center gap-2.5 py-0.5">
                <SpinnerIcon className="h-3.5 w-3.5 animate-spin text-[#00f2fe]" />
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">OpenStudio Intelligence is materializing code...</p>
              </div>
            ) : (
              <div className="text-[11px] sm:text-[12px] leading-relaxed font-normal selection:bg-[#00f2fe]/30 whitespace-pre-wrap">
                {displayContent || (isStudioGenerating ? "Materializing requested components..." : "")}
              </div>
            )}
          </div>

          {/* CLEAN FILE ACTION LIST (SINGLE FLAT CARD) */}
          {hasFiles && generationInfo && (
            <div className="w-full mt-1.5 max-w-md">
              <GenerationStatusView info={generationInfo} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};