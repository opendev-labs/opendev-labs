import React from 'react';
import type { GenerationInfo } from '../types';
import { TaskStatusIcon, SpinnerIcon, CheckCircleIcon, NewChatIcon, PencilIcon, TrashIcon } from './icons/Icons';

interface GenerationStatusViewProps {
  info: GenerationInfo;
}

export function GenerationStatusView({ info }: GenerationStatusViewProps) {
  const fileCount = info.files.length;
  const title = info.status === 'generating' 
    ? `Materializing ${fileCount} asset${fileCount !== 1 ? 's' : ''}...`
    : `Materialized ${fileCount} asset${fileCount !== 1 ? 's' : ''} in workspace`;

  return (
    <div className="w-full mt-2">
      <ul className="space-y-1.5 w-full">
        {info.files.map((file, index) => (
          <li key={index} className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700/80 transition-all shadow-md">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <span className="text-emerald-400 text-xs font-extrabold leading-none">+</span>
              </div>
              <span className="font-mono text-zinc-100 text-[11px] font-semibold tracking-tight break-all">{file.path}</span>
            </div>

            <div className="flex items-center shrink-0 pl-2">
              {file.status === 'generating' ? (
                <div className="flex items-center gap-1.5 text-[10px] text-[#00f2fe] font-semibold bg-[#00f2fe]/10 border border-[#00f2fe]/30 px-2.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(0,242,254,0.15)]">
                  <svg className="w-3 h-3 animate-spin text-[#00f2fe]" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-[10px] font-bold">Creating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  <CheckCircleIcon className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span className="text-[10px] font-bold">Ready</span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

