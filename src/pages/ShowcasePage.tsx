import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Search,
  ExternalLink,
  Code2,
  Cpu,
  Workflow,
  Server,
  Zap,
  Activity,
  ShieldCheck,
  CreditCard,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { projectsData, ProjectItem } from '../data/projectsData';
import { Button } from '../components/ui/Button';
import { Live2DWavesCanvas } from '../components/ui/Live2DWavesCanvas';

export const ShowcasePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const categories = [
    'All',
    'Bash Automation',
    'Developer Tools',
    'AI Infrastructure',
    'Fullstack Web Apps',
    'FinTech & Trading'
  ];

  const filteredProjects = projectsData.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopySnippet = (id: string, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Terminal': return <Terminal className="size-6 text-amber-500" />;
      case 'Cpu': return <Cpu className="size-6 text-blue-500" />;
      case 'Workflow': return <Workflow className="size-6 text-indigo-500" />;
      case 'Server': return <Server className="size-6 text-emerald-500" />;
      case 'RefreshCw': return <RefreshCw className="size-6 text-pink-500" />;
      case 'Activity': return <Activity className="size-6 text-yellow-500" />;
      case 'ShieldCheck': return <ShieldCheck className="size-6 text-green-500" />;
      case 'Zap': return <Zap className="size-6 text-purple-500" />;
      case 'Code2': return <Code2 className="size-6 text-cyan-500" />;
      case 'CreditCard': return <CreditCard className="size-6 text-orange-500" />;
      case 'Sparkles': return <Sparkles className="size-6 text-fuchsia-500" />;
      default: return <Terminal className="size-6 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <Live2DWavesCanvas className="absolute inset-0 pointer-events-none opacity-80 z-0" waveCount={5} verticalBaseStart={0.35} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-6">
              <Sparkles className="size-3.5" /> Engineering Portfolio & Case Studies
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-zinc-900 dark:text-white"
          >
            Finished Engineering & Bash Automation Projects
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed"
          >
            Explore our complete suite of autonomous shell scripts, dev tools, and production applications built by <span className="font-extrabold text-zinc-900 dark:text-white">Yash Ramteke</span> and the OpenDev-Labs team.
          </motion.p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="py-8 px-4 sm:px-6 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="size-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or tech stack..."
              className="w-full h-10 pl-9 pr-4 text-xs rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full flex-1">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-sm">No projects found matching your search query.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-4 text-xs font-bold text-blue-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 flex flex-col justify-between hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  {/* Top Bar: Icon & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                      {getIcon(project.iconName)}
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold border border-blue-500/20">
                      {project.category}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                    {project.title}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">
                    {project.tagline}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Architecture Highlights */}
                  <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
                    {project.architectureHighlights.slice(0, 2).map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-zinc-600 dark:text-zinc-300">
                        <CheckCircle2 className="size-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Terminal Snippet Preview if present */}
                  {project.terminalSnippet && (
                    <div className="mt-4 rounded-xl bg-zinc-950 text-zinc-200 p-3 font-mono text-[10px] leading-relaxed relative border border-zinc-800 overflow-x-auto">
                      <div className="flex items-center justify-between text-zinc-500 mb-1 pb-1 border-b border-zinc-800">
                        <span>bash script preview</span>
                        <button
                          onClick={() => handleCopySnippet(project.id, project.terminalSnippet!)}
                          className="hover:text-white transition-colors"
                          title="Copy snippet"
                        >
                          {copiedSnippetId === project.id ? (
                            <Check className="size-3 text-emerald-400" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      </div>
                      <pre className="text-amber-400 font-mono overflow-x-auto whitespace-pre-wrap">{project.terminalSnippet}</pre>
                    </div>
                  )}

                  {/* Tech Badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar: Action Links */}
                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <a
                    href={project.caseStudyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    View Case Study <ExternalLink className="size-3" />
                  </a>

                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      className="text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white flex items-center gap-1"
                    >
                      Live Demo →
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};
