import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Globe, Layers, Check, X, ArrowRight, ExternalLink } from 'lucide-react';
import { savePublishedTemplate, PublishedTemplate } from '../services/templateStorageService';
import type { FileNode } from '../types';
import { toast } from 'sonner';

interface PublishTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionTitle: string;
  fileTree: FileNode[];
  authorName?: string;
  onViewTemplates?: () => void;
}

export function PublishTemplateModal({
  isOpen,
  onClose,
  sessionTitle,
  fileTree,
  authorName = 'OpenStudio Creator',
  onViewTemplates,
}: PublishTemplateModalProps) {
  const [title, setTitle] = useState(sessionTitle || 'New Web Application');
  const [tagline, setTagline] = useState('Production-grade web application generated with OpenStudio AI');
  const [description, setDescription] = useState('Full-stack responsive web application with interactive components, Tailwind styling, and modular architecture.');
  const [category, setCategory] = useState<PublishedTemplate['category']>('Agency & Business');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedTemplate, setPublishedTemplate] = useState<PublishedTemplate | null>(null);

  if (!isOpen) return null;

  const categories: PublishedTemplate['category'][] = [
    'Agency & Business',
    'Vercel & Next.js',
    'E-Commerce',
    'Portfolio & Creative',
    'Food & Hospitality',
    'Beauty & Lifestyle',
  ];

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Template title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const template = savePublishedTemplate(
        title.trim(),
        tagline.trim(),
        description.trim(),
        category,
        fileTree,
        authorName
      );

      setPublishedTemplate(template);
      toast.success('🎉 Template published to opendev-labs.com/templates and OpenStudio showcase!');
    } catch (err) {
      toast.error('Failed to publish template');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-2xl bg-[#09090b] border border-zinc-800 shadow-[0_0_50px_rgba(0,242,254,0.12)] overflow-hidden text-zinc-100"
        >
          {/* TOP ACCENT LINE */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00f2fe] via-cyan-500 to-indigo-500" />

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8">
            {!publishedTemplate ? (
              <form onSubmit={handlePublish}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30">
                    <Sparkles className="w-3 h-3 text-[#00f2fe]" />
                    Publish to Templates
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-400">opendev-labs.com/templates</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5 font-sans">
                  Publish Your Creation
                </h2>
                <p className="text-xs text-zinc-400 mb-6">
                  Save this project to <span className="text-white font-semibold">opendev-labs.com/templates</span> so the community can preview and fork it, and keep it in your OpenStudio portfolio.
                </p>

                <div className="space-y-4 mb-6">
                  {/* TITLE */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Template Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Nexus Crypto Terminal"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00f2fe]/80 transition-colors"
                      required
                    />
                  </div>

                  {/* TAGLINE */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Short Tagline
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Modern Web3 Trading & Asset Management Dashboard"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00f2fe]/80 transition-colors"
                    />
                  </div>

                  {/* CATEGORY */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#00f2fe]/80 transition-colors"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c} className="bg-zinc-950 text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what features and design system this template includes..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00f2fe]/80 transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800/80">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00f2fe] to-cyan-500 hover:from-cyan-400 hover:to-cyan-500 text-black font-extrabold text-xs tracking-wide shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                  >
                    <span>{isSubmitting ? 'Publishing...' : '🚀 Publish Template'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Template Successfully Published!
                </h3>
                <p className="text-xs text-zinc-400 mb-6 max-w-sm mx-auto">
                  "{publishedTemplate.name}" is now live on <span className="text-white font-semibold">opendev-labs.com/templates</span> and saved in your OpenStudio projects collection.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="/templates"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
                  >
                    <span>View on opendev-labs.com/templates</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      onClose();
                      if (onViewTemplates) onViewTemplates();
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
