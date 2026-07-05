import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Puter.js is loaded via CDN in index.html — gives free AI access (GPT-4o, Claude, etc.)
// Usage is billed to the user's own Puter account. Zero cost to developer.
declare const puter: any;

const waitForPuter = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (typeof puter !== 'undefined') { resolve(); return; }
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (typeof puter !== 'undefined') { clearInterval(interval); resolve(); }
      else if (attempts > 50) { clearInterval(interval); reject(new Error('Puter.js failed to load. Please refresh.')); }
    }, 100);
  });

// shadcn UI Components
import { Button } from '../../../../components/ui/shadcn/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../../components/ui/shadcn/dialog';

// SVGs and Icons
const ArrowUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);

const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="lucide lucide-github"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);

const VercelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 19.777h20L12 2z"/></svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
);

const MaximizeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-maximize-2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>
);

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
}

export const IDEPage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [publishName, setPublishName] = useState('');
  const [publishDescription, setPublishDescription] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'logs'>('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Enforce dark mode globally for this page
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  // Scroll to bottom of chat when new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      addLog('🔄 Sandbox iframe preview refreshed.');
    }
  };

  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/razorpay', { method: 'POST' });
      const order = await res.json();
      
      if (order.error) {
        alert("Failed to initialize payment: " + order.error);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_key', 
        amount: order.amount,
        currency: order.currency,
        name: "OpenDev Labs",
        description: "Unlimited AI Generations",
        order_id: order.id,
        handler: async function (response: any) {
          addLog("Payment successful! Upgrading to premium...");
          if (updateProfile) {
            await updateProfile({ subscriptionStatus: 'premium' });
          }
          setShowPaywall(false);
          alert("Success! You now have unlimited generations.");
        },
        prefill: {
          name: user?.name || "Developer",
          email: user?.email || "",
        },
        theme: {
          color: "#f97316"
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e: any) {
      console.error(e);
      alert("Error starting checkout: " + e.message);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    if (profile?.subscriptionStatus !== 'premium' && (profile?.promptCount || 0) >= 6) {
      setShowPaywall(true);
      return;
    }

    const userPrompt = prompt.trim();
    setPrompt('');
    setIsGenerating(true);
    setErrorState(false);
    setGeneratedCode('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt
    };

    setChatHistory(prev => [...prev, userMsg]);
    setLogs([]);
    setActiveTab('preview');

    addLog('🚀 Initializing Puter AI gateway...');
    addLog('⚡ Using free AI via Puter.js (GPT-4o) — no API key required.');

    try {
      await waitForPuter();
      addLog('✅ Puter.js ready. Streaming design tokens...');

      const systemPrompt = 'You are opendev-labs AI page materialization engine. Return clean, high-fidelity responsive HTML templates utilizing Tailwind CSS. Do not use markdown blocks or backticks. Return only valid HTML content. Do not describe the code, return ONLY the raw HTML source code.';

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

      // Stream from Puter AI (GPT-4o by default, free via user Puter account)
      const response = await puter.ai.chat(messages, {
        model: 'gpt-4o',
        stream: true,
      });

      let streamedContent = '';

      if (response && response[Symbol.asyncIterator]) {
        // Streaming path
        for await (const chunk of response) {
          const text = chunk?.text ?? chunk?.delta?.text ?? chunk?.choices?.[0]?.delta?.content ?? '';
          if (text) {
            streamedContent += text;
            setGeneratedCode(streamedContent);
          }
        }
      } else {
        // Non-streaming fallback
        streamedContent = typeof response === 'string'
          ? response
          : response?.message?.content?.[0]?.text ?? response?.text ?? '';
        setGeneratedCode(streamedContent);
      }

      // Strip markdown fences if the model added them
      if (cleanedCode.startsWith('```html')) {
        cleanedCode = cleanedCode.replace(/^```html\n/, '').replace(/\n```$/, '');
      } else if (cleanedCode.startsWith('```')) {
        cleanedCode = cleanedCode.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      setGeneratedCode(cleanedCode);
      addLog('✅ Code generation complete. Compiling CSS styles...');
      
      if (profile?.subscriptionStatus !== 'premium' && updateProfile) {
        await updateProfile({ promptCount: (profile?.promptCount || 0) + 1 });
      }

      // Save to Firestore
      addLog('💾 Saving blueprint in Firestore database...');
      try {
        await addDoc(collection(db, 'projects'), {
          prompt: userPrompt,
          code: cleanedCode,
          userId: user?.uid || 'anonymous',
          email: user?.email || 'anonymous',
          createdAt: new Date().toISOString(),
          type: 'studio-generation'
        });
        addLog('✨ Blueprint archived successfully in Firestore.');
      } catch (dbErr: any) {
        console.error('Firestore save failed:', dbErr);
        addLog(`⚠️ Local DB Sync warning: ${dbErr.message || 'Firestore offline'}`);
      }

      addLog('🎉 Compilation successful. Virtual preview materialized.');

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Design successfully materialized. Click the Preview or Code tabs to view the layout.`
      };
      setChatHistory(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      addLog(`❌ Compilation failed: ${err.message}`);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'error',
        content: `AI error: ${err.message || 'Unknown error'}. Please try again.`
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishToCommunity = async () => {
    if (!generatedCode || !user) return;
    setIsPublishing(true);
    addLog('🚀 Publishing sandbox to opendev-labs community...');
    try {
      const projName = publishName.trim() || 'Untitled Blueprint';
      const projDesc = publishDescription.trim() || `Materialized layout using open-studio: "${chatHistory[0]?.content || 'Prompt'}"`;
      
      const projObj = {
        title: projName,
        description: projDesc,
        code: generatedCode,
        platform: 'open-studio',
        createdAt: new Date().toISOString()
      };

      const postObj = {
        id: 'post_project_' + Math.random().toString(36).substr(2, 9),
        uid: user.uid,
        author: {
          name: user.name,
          handle: user.email.split('@')[0],
          headline: 'Developer',
          avatarUrl: user.avatar || null,
          isAgent: false
        },
        content: `I just published a new project layout, **${projName}**, built in **open-studio**! Click **Play Sandbox** to run it live! 🚀🎨\n\n_${projDesc}_`,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: new Date().toISOString(),
        tags: ["Project", "open-studio"],
        attachedProject: projObj
      };

      await addDoc(collection(db, 'open_hub_posts'), postObj);
      addLog('✨ Sandbox published successfully to community feed!');
      setIsPublishDialogOpen(false);
      setPublishName('');
      setPublishDescription('');
      alert("Project published successfully to opendev-labs.com!");
    } catch (e: any) {
      console.error("Failed to publish project:", e);
      addLog(`❌ Failed to publish sandbox: ${e.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const [hasError, setErrorState] = useState(false);

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
              body { font-family: 'Inter', sans-serif; background-color: #030303; color: #f3f4f6; }
              ::-webkit-scrollbar { width: 8px; height: 8px; }
              ::-webkit-scrollbar-track { background: transparent; }
              ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
              ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
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
    <div className="flex flex-col h-screen w-screen bg-[#09090b] text-[#e4e4e7] overflow-hidden font-sans select-none">
      {/* 1. Header Bar */}
      <header className="h-14 border-b border-[#1f1f23] bg-[#09090b] flex items-center justify-between px-4 shrink-0 relative z-30">
        <div className="flex items-center gap-3">
          <span className="font-extrabold tracking-tighter text-sm tracking-[0.15em] text-white lowercase">opendev-labs</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white text-xs font-medium flex items-center gap-1.5 px-3 rounded-md focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <InfoIcon /> What's This?
          </Button>
          <a
            href="https://github.com/opendev-labs/opendev-labs"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white text-xs font-medium flex items-center gap-1.5 px-3 rounded-md transition-colors focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <GithubIcon /> opendev-labs/open-studio
          </a>
          <a
            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fopendev-labs%2Fopendev-labs"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white text-xs font-semibold flex items-center gap-1.5 px-3 rounded-md transition-colors focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <VercelIcon /> Deploy with Vercel
          </a>
          <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                disabled={!generatedCode}
                className="h-8 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 px-3 rounded-md shadow-md shadow-orange-500/10 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Publish to opendev-labs
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-[#1f1f23] rounded-2xl max-w-sm p-6 shadow-2xl text-white">
              <DialogHeader className="border-b border-[#1f1f23] pb-3 mb-4">
                <DialogTitle className="text-sm font-bold uppercase tracking-widest text-white">Publish Project Sandbox</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Project Name</label>
                  <input 
                    value={publishName}
                    onChange={e => setPublishName(e.target.value)}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50"
                    placeholder="e.g. My Portfolio, Particle Field"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Short Description</label>
                  <textarea 
                    value={publishDescription}
                    onChange={e => setPublishDescription(e.target.value)}
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50 min-h-[80px]"
                    placeholder="e.g. A gorgeous Three.js particle field with physics simulation..."
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <Button 
                    onClick={handlePublishToCommunity}
                    disabled={isPublishing || !publishName}
                    className="bg-white text-black font-bold uppercase tracking-widest text-[9px] rounded-xl px-8 hover:bg-orange-500 hover:text-white transition-all h-9 disabled:opacity-50"
                  >
                    {isPublishing ? 'Publishing...' : 'Broadcast'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <div className="h-8 w-8 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center overflow-hidden shrink-0 ml-1">
            {user?.avatar ? (
              <img src={user.avatar} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-zinc-500 font-bold uppercase">{user?.email?.[0] || 'U'}</span>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Two-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Chat sidebar */}
        <div className="w-[420px] border-r border-[#1f1f23] bg-[#09090b] flex flex-col justify-between shrink-0 h-full p-4">
          
          {/* Scrollable messages container */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-violet-400">Free AI via Puter ✦</span>
                  </div>
                  <span className="block text-sm font-bold tracking-[0.2em] text-[#a1a1aa] uppercase select-none">
                    Open Studio
                  </span>
                  <p className="text-xs text-[#71717a] font-medium leading-relaxed max-w-[280px] mt-2">
                    Describe a UI and I'll generate it instantly. Powered by GPT-4o for free.
                  </p>
                </div>
                <div className="w-full space-y-2">
                  {[
                    'Create a beautiful login page',
                    'Build a glassmorphic dashboard',
                    'Design a dark landing page with animations',
                    'Make a portfolio with Three.js effects',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => { setPrompt(suggestion); }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition-all flex items-center gap-2"
                    >
                      <span className="text-violet-500 opacity-60">✦</span> {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chatHistory.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  {msg.role === 'user' ? (
                    <div className="text-right">
                      <div className="inline-block bg-[#18181b] border border-[#27272a] rounded-lg px-4 py-2 text-sm text-white font-medium text-left break-words max-w-[90%] select-text">
                        {msg.content}
                      </div>
                    </div>
                  ) : msg.role === 'error' ? (
                    <div className="text-left space-y-1">
                      <div className="text-xs text-[#a1a1aa] font-bold uppercase tracking-wider ml-1">Assistant</div>
                      <div className="text-sm text-[#ef4444] font-medium leading-relaxed select-text">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div className="text-left space-y-1">
                      <div className="text-xs text-[#a1a1aa] font-bold uppercase tracking-wider ml-1">Assistant</div>
                      <div className="inline-block bg-[#121214] border border-[#27272a] rounded-lg px-4 py-2.5 text-sm text-[#d4d4d8] font-medium leading-relaxed break-words max-w-[95%] select-text">
                        {msg.content}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Prompt card input container */}
          <div className="pt-3 border-t border-[#1f1f23]/60 bg-[#09090b]">
            <form onSubmit={handleGenerate} className="bg-[#121214] border border-[#27272a] rounded-xl p-3 flex flex-col space-y-2 relative focus-within:border-zinc-700 transition-colors shadow-lg">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Continue the conversation..."
                className="w-full bg-transparent border-none text-white placeholder-[#71717a] text-sm focus:outline-none resize-none h-16 caret-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate(e);
                  }
                }}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <button type="button" className="text-zinc-600 hover:text-white transition-colors p-1 rounded">
                    <ImageIcon />
                  </button>
                  <button type="button" className="text-zinc-600 hover:text-white transition-colors p-1 rounded">
                    <MicIcon />
                  </button>
                </div>
                <button 
                  type="submit" 
                  disabled={!prompt.trim() || isGenerating}
                  className="h-7 w-7 rounded-full bg-[#18181b] border border-[#27272a] text-white flex items-center justify-center hover:bg-[#27272a] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-[#18181b]"
                >
                  <ArrowUpIcon />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Canvas Output Area */}
        <div className={`flex-1 bg-[#121214] flex flex-col h-full overflow-hidden relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
          
          {/* Canvas header URL-bar */}
          <div className="h-12 border-b border-[#1f1f23] bg-[#09090b] flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <button 
                onClick={handleRefresh}
                className="text-zinc-400 hover:text-white p-1 rounded transition-colors shrink-0"
                title="Refresh preview"
              >
                <RefreshIcon />
              </button>
              <div className="flex-grow bg-[#121214] border border-[#27272a] rounded-lg h-8 flex items-center px-3 text-xs text-zinc-500 font-mono select-all overflow-hidden whitespace-nowrap">
                {generatedCode ? 'https://opendev-labs.sandbox.local' : 'Your app will appear here...'}
              </div>
            </div>

            {/* View Switching Tabs */}
            <div className="flex items-center gap-1.5 ml-4">
              <button
                onClick={() => setActiveTab('preview')}
                className={`h-8 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === 'preview' ? 'bg-[#18181b] text-white border border-[#27272a]' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`h-8 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === 'code' ? 'bg-[#18181b] text-white border border-[#27272a]' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Code
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`h-8 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === 'logs' ? 'bg-[#18181b] text-white border border-[#27272a]' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Logs
              </button>
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-zinc-400 hover:text-white p-1 rounded transition-colors ml-1 shrink-0"
                title="Toggle fullscreen"
              >
                <MaximizeIcon />
              </button>
            </div>
          </div>

          {/* Canvas body / output */}
          <div className="flex-1 bg-[#121214] relative overflow-hidden">
            {generatedCode ? (
              <div className="absolute inset-0 bg-[#0c0c0e]">
                {activeTab === 'preview' && (
                  <iframe
                    ref={iframeRef}
                    title="Sandbox preview rendering canvas"
                    className="w-full h-full bg-[#020202] border-none"
                  />
                )}
                {activeTab === 'code' && (
                  <pre className="w-full h-full overflow-auto p-6 font-mono text-xs text-zinc-400 bg-[#020202] select-text custom-scrollbar leading-relaxed">
                    <code>{generatedCode}</code>
                  </pre>
                )}
                {activeTab === 'logs' && (
                  <div className="w-full h-full overflow-auto p-6 font-mono text-[10px] text-zinc-500 bg-[#020202] space-y-1.5 custom-scrollbar select-text">
                    {logs.map((log, i) => (
                      <div key={i} className="leading-relaxed whitespace-pre-wrap">{log}</div>
                    ))}
                    {isGenerating && (
                      <div className="text-orange-500 animate-pulse">▋ Streaming design matrix...</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Center Placeholder */
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 select-none bg-[#0d0d0f]">
                <h2 className="text-lg font-bold text-white mb-1.5">No preview available</h2>
                <p className="text-zinc-600 text-xs font-medium">Start a conversation to see your app here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Paywall Dialog */}
      <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
        <DialogContent className="bg-zinc-950 border-[#1f1f23] rounded-2xl max-w-sm p-6 shadow-2xl text-center text-white">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20 mb-4">
            <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white mb-2">Upgrade to Premium</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-zinc-400 space-y-4">
            <p>
              You've used your 6 free generations! Upgrade to OpenDev Labs Premium to unlock unlimited AI generations.
            </p>
            <div className="text-2xl font-bold text-white py-2">
              $9 <span className="text-sm font-normal text-zinc-500">/ month</span>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Button
              onClick={handleUpgrade}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold h-11 rounded-xl"
            >
              Pay with Razorpay
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowPaywall(false)}
              className="text-zinc-500 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
