import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

// shadcn UI Components
import { Button } from '../../../../components/ui/shadcn/button';

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
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    const userPrompt = prompt.trim();
    setPrompt('');
    setIsGenerating(true);
    setErrorState(false);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt
    };
    
    setChatHistory(prev => [...prev, userMsg]);
    setLogs([]);
    setActiveTab('preview');

    addLog('🚀 Initializing connection to open-studio gateway...');
    addLog('🔗 Handshaking with Vercel backend serverless function...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-2.0-flash',
          systemInstruction: 'You are opendev-labs AI page materialization engine. Return clean, high-fidelity responsive HTML templates utilizing Tailwind CSS. Do not use markdown blocks or backticks. Return only valid HTML content. Do not describe the code, return ONLY the raw HTML source code.',
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate: ${response.statusText}`);
      }

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
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  streamedContent += text;
                  setGeneratedCode(prev => prev + text);
                } catch (e) {
                  const cleaned = line.slice(6);
                  streamedContent += cleaned;
                  setGeneratedCode(prev => prev + cleaned);
                }
              } else if (line.trim()) {
                streamedContent += line;
                setGeneratedCode(prev => prev + line);
              }
            }
          }
        }
      }

      let cleanedCode = streamedContent.trim();
      if (cleanedCode.startsWith('```html')) {
        cleanedCode = cleanedCode.replace(/^```html\n/, '').replace(/\n```$/, '');
      } else if (cleanedCode.startsWith('```')) {
        cleanedCode = cleanedCode.replace(/^```\n/, '').replace(/\n```$/, '');
      }
      
      setGeneratedCode(cleanedCode);
      addLog('✅ Code generation complete. Compiling CSS styles...');

      // Save to Firestore matching Vishwa Leader patterns
      addLog('💾 Saving blueprint in Firestore database (default)...');
      try {
        await addDoc(collection(db, 'projects'), {
          prompt: userPrompt,
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
        content: `Sorry, there was an error processing your message. Please try again.`
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
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
          <span className="font-extrabold tracking-tighter text-sm uppercase tracking-[0.15em] text-white">opendev-labs</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white text-xs font-medium flex items-center gap-1.5 px-3 rounded-md"
          >
            <InfoIcon /> What's This?
          </Button>
          <a
            href="https://github.com/opendev-labs/opendev-labs"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white text-xs font-medium flex items-center gap-1.5 px-3 rounded-md transition-colors"
          >
            <GithubIcon /> vercel/v0-sdk
          </a>
          <a
            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fopendev-labs%2Fopendev-labs"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 border border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white text-xs font-semibold flex items-center gap-1.5 px-3 rounded-md transition-colors"
          >
            <VercelIcon /> Deploy with Vercel
          </a>
          <div className="h-8 w-8 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center overflow-hidden shrink-0 ml-1">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" />
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
              <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-4">
                <span className="text-sm font-bold tracking-[0.2em] text-[#a1a1aa] uppercase select-none">
                  Sovereign Chat Node
                </span>
                <p className="text-xs text-[#71717a] font-medium leading-relaxed max-w-[280px]">
                  Submit a prompt below to materialize dynamic web layouts using the open-studio matrix.
                </p>
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
    </div>
  );
};
