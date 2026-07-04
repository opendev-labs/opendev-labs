import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
const ArrowUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);

const TerminalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-terminal"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code-2"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
);

const LayoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout"><rect width="18" height="18" x="3" y="3" rx="2" md="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
);

export const IDEPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<'idle' | 'calling' | 'generating' | 'saving' | 'complete'>('idle');
  const [generatedCode, setGeneratedCode] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'logs'>('preview');
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const templates = [
    { label: 'Landing page', text: 'Create a ultra-premium dark theme developer landing page with glassmorphic cards, orange neon glow accents, smooth floating animations, a services section, and a custom contact form.' },
    { label: 'Todo app', text: 'Build a high-fidelity Todo application with dark styling, custom category tags, local storage persistence, completed item animations, and a sleek stats dashboard.' },
    { label: 'Dashboard', text: 'Generate an elite SaaS analytics dashboard with charts, sidebar navigation, custom metrics layout, recent activity logs, and beautiful micro-animations.' },
    { label: 'Blog', text: 'Design a clean developer blog UI with article grids, dynamic category filtering, a read-time indicator, search bar, and reader engagement stats.' },
    { label: 'E-commerce', text: 'Create a modern minimalist e-commerce product detail page with product zoom, customer reviews, checkout slider, cart sidebar, and color variant selector.' },
    { label: 'Portfolio', text: 'Build an immersive designer portfolio featuring an interactive project grid, experience timeline, floating visual assets, and dynamic typography.' },
    { label: 'Chat app', text: 'Design a dark-mode real-time chat interface with messaging bubbles, active status indicator, sidebar contact list, search bar, and clean slide-in animations.' },
    { label: 'Calculator', text: 'Create a beautiful glassmorphism scientific calculator with a slick operations log history, smooth button pop animations, and custom theme switcher.' }
  ];

  const handleTemplateClick = (text: string) => {
    setPrompt(text);
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    const promptText = prompt;
    setCurrentPrompt(promptText);
    setIsGenerating(true);
    setError(null);
    setGeneratedCode('');
    setLogs([]);
    setActiveTab('logs');
    setGenerationStep('calling');

    addLog('🚀 Initializing connection to open-studio gateway...');
    addLog('🔗 Handshaking with Vercel backend serverless function...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-2.0-flash',
          systemInstruction: 'You are opendev-labs AI page materialization engine. Return clean, high-fidelity responsive HTML templates utilizing Tailwind CSS. Do not use markdown blocks or backticks. Return only valid HTML content. Do not describe the code, return ONLY the raw HTML source code.',
          contents: [{ role: 'user', parts: [{ text: promptText }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate: ${response.statusText}`);
      }

      setGenerationStep('generating');
      addLog('📡 Connection established. Streaming quantum design tokens...');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let streamedContent = '';

      if (reader) {
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: !done });
            
            // Clean chunk if it has Server-Sent Events structure
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  streamedContent += text;
                  setGeneratedCode(prev => prev + text);
                } catch (e) {
                  // Fallback for raw text stream
                  const cleaned = line.slice(6);
                  streamedContent += cleaned;
                  setGeneratedCode(prev => prev + cleaned);
                }
              } else if (line.trim()) {
                // Direct chunk fallback
                streamedContent += line;
                setGeneratedCode(prev => prev + line);
              }
            }
          }
        }
      }

      // Final cleanup: remove potential markdown wraps
      let cleanedCode = streamedContent.trim();
      if (cleanedCode.startsWith('```html')) {
        cleanedCode = cleanedCode.replace(/^```html\n/, '').replace(/\n```$/, '');
      } else if (cleanedCode.startsWith('```')) {
        cleanedCode = cleanedCode.replace(/^```\n/, '').replace(/\n```$/, '');
      }
      setGeneratedCode(cleanedCode);

      addLog('✅ Code generation complete. Compiling CSS styles...');
      setGenerationStep('saving');

      // Save to Firestore matching Vishwa Leader patterns
      addLog('💾 Saving blueprint in Firestore database (default)...');
      try {
        await addDoc(collection(db, 'projects'), {
          prompt: promptText,
          code: cleanedCode,
          userId: user?.uid || 'anonymous',
          email: user?.email || 'anonymous',
          createdAt: new Date().toISOString(),
          type: 'v0-generation'
        });
        addLog('✨ Blueprint archived successfully in Firestore.');
      } catch (dbErr: any) {
        console.error('Firestore save failed:', dbErr);
        addLog(`⚠️ Local DB Sync warning: ${dbErr.message || 'Firestore offline'}`);
      }

      setGenerationStep('complete');
      addLog('🎉 Compilation successful. Virtual preview materialized.');
      setActiveTab('preview');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong during generation.');
      addLog(`❌ Compilation failed: ${err.message}`);
      setGenerationStep('idle');
    } finally {
      setIsGenerating(false);
    }
  };

  // Inject code into iframe
  useEffect(() => {
    if (activeTab === 'preview' && iframeRef.current && generatedCode) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.5">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
            <style>
              body { font-family: 'Inter', sans-serif; background-color: #020202; color: #e4e4e7; }
              ::-webkit-scrollbar { width: 8px; height: 8px; }
              ::-webkit-scrollbar-track { background: #000; }
              ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
              ::-webkit-scrollbar-thumb:hover { background: #333; }
            </style>
          </head>
          <body>
            ${generatedCode}
          </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [generatedCode, activeTab]);

  return (
    <div className="flex-grow flex flex-col h-full text-zinc-300 select-none">
      {/* Whitelabeled Header */}
      <header className="h-16 border-b border-zinc-900 bg-black flex items-center justify-between px-6 shrink-0 relative z-30">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 bg-orange-500 rounded-sm"></div>
          <span className="font-extrabold tracking-tighter text-sm uppercase tracking-[0.2em] text-white">opendev-labs</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowInfo(true)}
            className="flex items-center gap-2 text-xs font-semibold hover:text-white transition-colors bg-zinc-900 border border-zinc-800 rounded-md py-1.5 px-3"
          >
            <InfoIcon /> What's This?
          </button>
          <a
            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fopendev-labs%2Fopendev-labs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-all rounded-md py-1.5 px-3"
          >
            Deploy with Vercel
          </a>
          <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-zinc-500 font-bold uppercase">{user?.email?.[0] || 'U'}</span>
            )}
          </div>
        </div>
      </header>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0c0c0c] border border-zinc-800 max-w-md w-full rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-3">opendev-labs v0 Clone</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-medium">
                This is a whitelabeled, high-performance v0 clone template built using the open-studio gateway. It generates component pages dynamically with Google Gemini streaming and logs blueprint state directly to our Firestore database.
              </p>
              <button 
                onClick={() => setShowInfo(false)}
                className="w-full py-3 bg-white text-black rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex overflow-hidden bg-[#050505]">
        {/* State 1: Input Prompt Screen */}
        {generationStep === 'idle' && !generatedCode && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 overflow-y-auto">
            <div className="max-w-3xl w-full text-center space-y-12">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold tracking-[0.2em] uppercase text-orange-500 rounded-full select-none mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  Sovereign Code Handshake
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-4 lowercase">
                  What can we build together?
                </h1>
                <p className="text-zinc-500 text-sm font-medium">
                  Describe your component layout in plain English. Stream high-fidelity designs instantly.
                </p>
              </div>

              {/* Form Input */}
              <form onSubmit={handleGenerate} className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden focus-within:border-zinc-800 transition-colors shadow-2xl max-w-2xl mx-auto w-full relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to build..."
                  className="w-full bg-transparent border-none text-zinc-200 placeholder:text-zinc-700 text-sm focus:outline-none p-5 resize-none h-28"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate(e);
                    }
                  }}
                />
                <div className="flex items-center justify-between px-4 py-3 bg-[#080808] border-t border-zinc-900">
                  <button type="button" className="text-zinc-600 hover:text-zinc-400 transition-colors p-1.5">
                    <ImageIcon />
                  </button>
                  <button 
                    type="submit" 
                    disabled={!prompt.trim() || isGenerating}
                    className="h-8 w-8 rounded-lg bg-orange-500 text-black flex items-center justify-center hover:bg-orange-400 transition-all disabled:opacity-30 disabled:hover:bg-orange-500"
                  >
                    <ArrowUpIcon />
                  </button>
                </div>
              </form>

              {/* Quick Template Tags */}
              <div className="max-w-2xl mx-auto">
                <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest mb-4">Quick Materialization Blueprints</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {templates.map((tmpl, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTemplateClick(tmpl.text)}
                      className="px-3.5 py-1.5 rounded-full border border-zinc-900 bg-zinc-950 hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 text-xs font-semibold tracking-wide transition-all cursor-pointer"
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Splitted Workspace Screen */}
        {(generationStep !== 'idle' || generatedCode) && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Panel: Prompt status and log terminal */}
            <div className="w-full md:w-96 border-r border-zinc-900 flex flex-col bg-black shrink-0">
              <div className="p-6 border-b border-zinc-900 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Active Request</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                    generationStep === 'complete' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20 animate-pulse'
                  }`}>
                    {generationStep}
                  </span>
                </div>
                <div className="bg-[#070707] border border-zinc-900 p-4 rounded-xl">
                  <p className="text-xs text-zinc-400 font-medium italic">"{currentPrompt}"</p>
                </div>
                <button
                  onClick={() => {
                    setPrompt('');
                    setGeneratedCode('');
                    setGenerationStep('idle');
                  }}
                  className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  New Build Setup
                </button>
              </div>

              {/* Console Output logs */}
              <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-3">
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                  <TerminalIcon /> Compilation Terminal
                </span>
                <div className="flex-1 bg-[#030303] border border-zinc-900 rounded-xl p-4 font-mono text-[10px] text-zinc-500 overflow-y-auto space-y-1.5 custom-scrollbar">
                  {logs.map((log, i) => (
                    <div key={i} className="leading-relaxed whitespace-pre-wrap select-text">{log}</div>
                  ))}
                  {isGenerating && (
                    <div className="text-orange-500 animate-pulse">▋ Streaming design matrix...</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel: Workspace Tabs (Preview & Code) */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="h-14 border-b border-zinc-900 bg-black flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`h-9 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                      activeTab === 'preview' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <LayoutIcon /> Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`h-9 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                      activeTab === 'code' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <CodeIcon /> Code
                  </button>
                </div>
                {error && (
                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{error}</span>
                )}
              </div>

              <div className="flex-1 bg-[#050505] relative overflow-hidden">
                {activeTab === 'preview' && (
                  <div className="absolute inset-0 bg-zinc-950 flex flex-col">
                    {generationStep !== 'complete' && !generatedCode ? (
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mb-4" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Materializing Canvas...</span>
                      </div>
                    ) : (
                      <iframe
                        ref={iframeRef}
                        title="Materialized Component Sandbox"
                        className="w-full h-full bg-[#020202] border-none"
                      />
                    )}
                  </div>
                )}

                {activeTab === 'code' && (
                  <pre className="absolute inset-0 overflow-auto p-6 font-mono text-xs text-zinc-400 bg-zinc-950 select-text custom-scrollbar leading-relaxed">
                    <code>{generatedCode || '// Materializing code buffers...'}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
