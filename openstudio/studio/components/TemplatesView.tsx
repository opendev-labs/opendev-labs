import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ExternalLink, 
  Trash2, 
  ArrowRight, 
  Layers, 
  FolderPlus,
  Globe,
  Code
} from 'lucide-react';
import { 
  getPublishedTemplates, 
  deletePublishedTemplate, 
  PublishedTemplate 
} from '../services/templateStorageService';
import type { FileNode } from '../types';
import { toast } from 'sonner';

interface TemplatesViewProps {
  onLoadTemplate: (template: PublishedTemplate) => void;
  onNavigate: (view: any) => void;
}

export function TemplatesView({ onLoadTemplate, onNavigate }: TemplatesViewProps) {
  const [templates, setTemplates] = useState<PublishedTemplate[]>(() => getPublishedTemplates());

  useEffect(() => {
    const handleUpdate = () => {
      setTemplates(getPublishedTemplates());
    };
    window.addEventListener('openstudio-template-published', handleUpdate);
    window.addEventListener('openstudio-template-deleted', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('openstudio-template-published', handleUpdate);
      window.removeEventListener('openstudio-template-deleted', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deletePublishedTemplate(id);
    toast.success('Template removed');
  };

  return (
    <div className="min-h-full w-full bg-[#050505] text-zinc-100 p-6 md:p-10 select-none overflow-y-auto custom-scrollbar">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30">
                <Sparkles className="w-3 h-3 text-[#00f2fe]" />
                Showcase & Catalog
              </span>
              <span className="text-[11px] font-semibold text-zinc-400">OpenStudio Creations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              Templates & Saved Projects
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Projects materialized in OpenStudio and published to <span className="text-white font-semibold">opendev-labs.com/templates</span>.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/templates"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-[#00f2fe]" />
              <span>Browse opendev-labs.com/templates</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>

            <button
              onClick={() => onNavigate('new-chat')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f2fe] to-cyan-500 hover:from-cyan-400 hover:to-cyan-500 text-black text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>+ Create Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* TEMPLATES GRID */}
      <div className="max-w-6xl mx-auto">
        {templates.length === 0 ? (
          <div className="p-12 sm:p-16 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/60 max-w-lg mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-[#00f2fe]">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">No Saved Templates Yet</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              When you generate a project in OpenStudio, click <span className="text-[#00f2fe] font-semibold">PUBLISH</span> in the top header to save it here and showcase it on <span className="text-white">opendev-labs.com/templates</span>.
            </p>
            <button
              onClick={() => onNavigate('new-chat')}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs shadow-md hover:bg-zinc-200 transition-colors"
            >
              Start Generating Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.map((tpl) => (
              <motion.div
                key={tpl.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group relative rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-[#00f2fe]/50 overflow-hidden flex flex-col justify-between shadow-xl transition-all backdrop-blur-sm"
              >
                {/* TOP HEADER */}
                <div className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20">
                      {tpl.category}
                    </span>
                    <button
                      onClick={(e) => handleDelete(tpl.id, e)}
                      title="Delete template"
                      className="p-1 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#00f2fe] transition-colors line-clamp-1">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1 min-h-[32px] leading-relaxed">
                    {tpl.tagline || tpl.description}
                  </p>
                </div>

                {/* MIDDLE METRICS */}
                <div className="px-5 py-3 bg-zinc-950/40 border-y border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Code className="w-3.5 h-3.5 text-zinc-500" />
                    {tpl.fileTree?.length || 0} files
                  </span>
                  <span className="text-zinc-500">
                    {new Date(tpl.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* BOTTOM ACTIONS */}
                <div className="p-4 pt-3 flex items-center gap-2">
                  <button
                    onClick={() => onLoadTemplate(tpl)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>Open in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href="/templates"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="View on opendev-labs.com/templates"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
