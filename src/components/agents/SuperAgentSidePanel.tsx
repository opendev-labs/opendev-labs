import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreeLoadingAnimation } from '../ui/ThreeLoadingAnimation';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Key,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Building,
  RefreshCw,
  SlidersHorizontal,
  Settings,
  ShieldCheck,
  FileText,
  CreditCard,
  Globe,
  DollarSign,
  Plus,
  Paperclip,
  MoreHorizontal,
  Mic,
  ArrowUp,
  Square
} from 'lucide-react';
import { useClients } from '../../context/ClientContext';
import {
  callOpenRouterAgent,
  getOpenRouterKey,
  setOpenRouterKey,
  ChatMessage
} from '../../services/openrouterService';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';

export function stripMarkdownSymbols(text: string): string {
  if (!text) return '';
  return text
    .replace(/```json_action[\s\S]*?```/g, '') // remove json action blocks from visible text
    .replace(/\*\*(.*?)\*\*/g, '$1')            // strip **bold**
    .replace(/\*(.*?)\*/g, '$1')                // strip *italic*
    .replace(/^#{1,6}\s+/gm, '')                // strip # headers
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')        // strip `inline code`
    .trim();
}

interface SuperAgentSidePanelProps {
  open: boolean;
  onClose: () => void;
}

export const SuperAgentSidePanel: React.FC<SuperAgentSidePanelProps> = ({ open, onClose }) => {
  const location = useLocation();
  const {
    clients,
    projectRequests,
    invoices,
    updateClient,
    deleteClient,
    clearAllClients,
    markPaymentStatus,
    generateClientCredentials,
    approveProjectRequest,
    rejectProjectRequest,
    generateInvoice
  } = useClients();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 Welcome to OpenDev-Labs 24/7 AI Support Chat!

I am your AI Copilot. Ask me about our engineering services, client portal, or website features!`,
      timestamp: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('google/gemini-2.0-flash-exp:free');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  const handleStopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const executeParsedAction = (replyText: string) => {
    const jsonMatch = replyText.match(/```json_action\s*([\s\S]*?)\s*```/);
    if (!jsonMatch || !jsonMatch[1]) return undefined;

    try {
      const actionObj = JSON.parse(jsonMatch[1].trim());
      const { action, data } = actionObj;

      if (action === 'CREATE_CLIENT' || action === 'UPDATE_CLIENT') {
        const clientData = {
          name: data.name || data.company || 'New Client',
          company: data.company || data.name || 'Company Ltd',
          email: data.email || 'client@opendev-labs.com',
          domain: data.domain || 'client-domain.com',
          clientCode: data.clientCode || `OD-${Math.floor(1000 + Math.random() * 9000)}`,
          password: data.password || 'client123',
          monthlyFee: Number(data.monthlyFee || 35000),
          workStatus: data.workStatus || 'in_progress',
          progressPercentage: Number(data.progressPercentage || 50),
          advancePaid: Boolean(data.advancePaid),
          advanceAmount: Number(data.advanceAmount || 15000),
          totalBill: Number(data.totalBill || 50000),
          livePreviewUrl: data.livePreviewUrl || (data.domain ? `https://${data.domain}` : undefined),
          devPreviewUrl: data.devPreviewUrl || undefined,
          status: data.status || 'pending'
        };

        const existing = clients.find(c =>
          (data.target && (c.name.toLowerCase().includes(data.target.toLowerCase()) || c.domain?.toLowerCase().includes(data.target.toLowerCase()))) ||
          c.name.toLowerCase() === clientData.name.toLowerCase() ||
          (c.domain && clientData.domain && c.domain.toLowerCase() === clientData.domain.toLowerCase())
        );

        if (existing) {
          updateClient({ ...existing, ...clientData });
          return `✅ Successfully updated client record for "${existing.name}" (${clientData.domain || 'N/A'}).`;
        } else {
          updateClient({ ...clientData, id: `client-${Date.now()}` } as any);
          return `✅ Successfully created client record for "${clientData.name}" (${clientData.domain || 'N/A'}).`;
        }
      } else if (action === 'DELETE_CLIENT') {
        if (data?.clearAll) {
          clearAllClients();
          return `⚠️ Cleared all client records from the database.`;
        }
        const target = data?.target || data?.clientId || data?.name || data?.domain;
        if (target) {
          const clientToDelete = clients.find(c =>
            c.id === target ||
            c.name.toLowerCase().includes(target.toLowerCase()) ||
            c.domain?.toLowerCase().includes(target.toLowerCase())
          );
          if (clientToDelete) {
            deleteClient(clientToDelete.id);
            return `🗑️ Deleted client record for "${clientToDelete.name}".`;
          }
        }
        return `⚠️ Could not locate client target to delete.`;
      } else if (action === 'MARK_PAYMENT') {
        const target = data?.target || data?.clientId || data?.name;
        const client = clients.find(c =>
          c.id === target ||
          c.name.toLowerCase().includes(target.toLowerCase()) ||
          c.domain?.toLowerCase().includes(target.toLowerCase())
        );
        if (client) {
          markPaymentStatus(client.id, data.month || '2026-09', data.status || 'paid');
          return `💰 Payment status for "${client.name}" marked as ${data.status || 'paid'}.`;
        }
      }
      return undefined;
    } catch (e) {
      console.error("Failed to parse or execute JSON action:", e);
      return undefined;
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    if (isLoading) {
      handleStopResponse();
      return;
    }

    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const historyForApi = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));
      historyForApi.push({ role: 'user', content: query });

      const reply = await callOpenRouterAgent(
        historyForApi,
        { clients, projectRequests, invoices },
        selectedModel,
        controller.signal,
        location.pathname
      );

      const executedText = executeParsedAction(reply);

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionExecuted: executedText
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        console.log('OpenRouter Agent response stopped by user.');
      } else {
        console.error('OpenRouter Agent Error:', err);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handlePasteSampleNote = () => {
    const sample = `Rahul Sharma from Elite Trading Systems Ltd (rahul.sharma@elite-trading.com) paid ₹25,000 advance for elite-tradinghub.com. Total bill ₹70,000, retainer ₹45,000/mo. Please set access code ELITE2026 and password client123.`;
    handleSendMessage(sample);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop Overlay for closing when clicking outside on any page */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed top-16 inset-x-0 bottom-0 bg-black/30 backdrop-blur-xs z-40 cursor-pointer"
          />

          {/* Floating Rectangle Chat Panel (Below Header till Bottom of Screen) */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-16 bottom-0 right-0 z-50 w-full sm:w-[420px] md:w-[450px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between font-sans text-zinc-900 dark:text-zinc-100 overflow-hidden"
          >
            <div className="w-full h-full flex flex-col justify-between overflow-hidden shrink-0">
              
              {/* Sleek Floating Chat Window Header */}
              <div className="h-14 px-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 backdrop-blur-md flex items-center justify-between shrink-0">
                
                {/* Clean Logo & Title */}
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo-icon.webp"
                    alt="OpenDev"
                    className="h-10 sm:h-11 w-auto object-contain"
                  />
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-white">
                    24/7 Support
                  </span>
                </div>

                {/* Model Selector & Actions */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-bold">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <select
                      value={selectedModel}
                      onChange={e => setSelectedModel(e.target.value)}
                      className="bg-transparent text-[10px] font-extrabold text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none"
                    >
                      <option value="google/gemini-2.0-flash-exp:free">Gemini 2.0</option>
                      <option value="google/gemini-flash-1.5">Gemini 1.5</option>
                      <option value="anthropic/claude-3.5-sonnet">Claude 3.5</option>
                      <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setMessages([{
                        id: 'welcome',
                        role: 'assistant',
                        content: `👋 Welcome to OpenDev-Labs 24/7 AI Support Chat!

I am your AI Copilot. Ask me about our engineering services, client portal, or website features!`,
                        timestamp: 'Just now'
                      }]);
                    }}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                    title="Reset Chat Stream"
                  >
                    <RefreshCw className="size-3.5" />
                  </button>

                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    title="Close Support Window"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* 2. Message History Stream (Vercel AI SDK Style) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs font-sans">
                
                {/* Executive Welcome Grid Card if 1 message */}
                {/* Welcome Message Card & Intelligent Quick Suggestions (Only when welcome message is active) */}
                {messages.length <= 1 && (
                  <div className="space-y-3 my-2">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/10 via-indigo-900/5 to-cyan-900/10 border border-purple-500/20 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <img src="/logo-icon.webp" alt="OpenDev" className="h-8 w-auto object-contain" />
                        <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                          Autonomous AI Assistant
                        </h4>
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                        Ask about our software engineering services, webapp templates, instant project estimates, or client access features!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <button
                        onClick={() => handleSendMessage('Can you give me a project estimate, timeline & tech stack recommendation for my web application idea?')}
                        className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-cyan-500/50 text-left space-y-1 transition-all group shadow-xs cursor-pointer"
                      >
                        <span className="font-extrabold text-zinc-900 dark:text-white flex items-center gap-1.5 group-hover:text-cyan-500">
                          ⚡ Instant Project Estimate
                        </span>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          Get timeline, tech stack, and retainer cost estimates for your web app idea.
                        </p>
                      </button>

                      <button
                        onClick={() => handleSendMessage('What production engineering templates are available and how can I launch them?')}
                        className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-purple-500/50 text-left space-y-1 transition-all group shadow-xs cursor-pointer"
                      >
                        <span className="font-extrabold text-zinc-900 dark:text-white flex items-center gap-1.5 group-hover:text-purple-500">
                          🚀 Explore Templates
                        </span>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          Discover production-ready full-stack templates & instant launch options.
                        </p>
                      </button>

                      <button
                        onClick={() => handleSendMessage('How does the Client Portal work for managing access codes, invoices, and payment reminders?')}
                        className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-500/50 text-left space-y-1 transition-all group shadow-xs cursor-pointer"
                      >
                        <span className="font-extrabold text-zinc-900 dark:text-white flex items-center gap-1.5 group-hover:text-indigo-500">
                          🔑 Client Portal & Access
                        </span>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          Learn how clients access dedicated portals, retainers, and access codes.
                        </p>
                      </button>

                      <button
                        onClick={() => handleSendMessage('What custom autonomous AI agents and automated workflows can OpenDev build for my business?')}
                        className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-emerald-500/50 text-left space-y-1 transition-all group shadow-xs cursor-pointer"
                      >
                        <span className="font-extrabold text-zinc-900 dark:text-white flex items-center gap-1.5 group-hover:text-emerald-500">
                          ⚙️ Custom AI Automation
                        </span>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          Build custom AI agents for trading risk, lead scoring & infrastructure.
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {messages.map((m) => {
                  const isAI = m.role === 'assistant';
                  return (
                    <div
                      key={m.id}
                      className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
                    >
                      {isAI && (
                        <img src="/logo-icon.webp" alt="OpenDev Agent" className="h-9 sm:h-10 w-auto object-contain shrink-0 mt-0.5" />
                      )}

                      <div className={`max-w-[88%] space-y-2 ${isAI ? '' : 'items-end'}`}>
                        <div
                          className={`p-4 px-4 text-xs leading-relaxed font-sans ${
                            isAI
                              ? 'bg-zinc-950 dark:bg-black text-zinc-100 border border-zinc-800/80 rounded-2xl rounded-tl-xs shadow-md whitespace-pre-wrap'
                              : 'bg-white text-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 border border-zinc-200/90 dark:border-zinc-300 font-medium rounded-2xl rounded-tr-xs shadow-sm whitespace-pre-wrap ml-auto'
                          }`}
                        >
                          {isAI ? stripMarkdownSymbols(m.content) : m.content}
                        </div>

                        {/* Structured Action Execution Badge */}
                        {m.actionExecuted && (
                          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 font-bold text-[11px] flex items-center gap-2 shadow-xs">
                            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                            <span>⚡ Executed: {m.actionExecuted}</span>
                          </div>
                        )}

                        <span className="text-[9px] text-zinc-500 block px-1 font-mono">
                          {m.timestamp}
                        </span>
                      </div>

                      {!isAI && (
                        <div className="size-7 rounded-xl bg-zinc-900 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-zinc-700">
                          Y
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-3 justify-start my-2 pl-1">
                    <img src="/logo-icon.webp" alt="OpenDev Agent" className="h-9 sm:h-10 w-auto object-contain shrink-0" />
                    <ThreeLoadingAnimation size={54} className="text-zinc-900 dark:text-white shrink-0" />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* 3. Compact Floating Input Section */}
              <div className="p-2 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-zinc-950 dark:via-zinc-950/95 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-2 sm:p-2.5 shadow-lg shadow-blue-500/5 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500/60 transition-all space-y-1.5"
                >
                  {/* Top Row: Attachment Plus & Context Tag Pill */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      className="size-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
                      title="Add Context"
                    >
                      <Plus className="size-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100/90 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold shadow-xs">
                      <div className="size-3.5 rounded-full bg-blue-600 text-white text-[8px] flex items-center justify-center font-black">
                        ⚡
                      </div>
                      <span>Onboarding & Agency Automation</span>
                    </div>
                  </div>

                  {/* Middle Row: Textarea Input */}
                  <textarea
                    rows={1}
                    value={inputQuery}
                    onChange={e => setInputQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Get a detailed report or paste raw client notes..."
                    className="w-full px-2 py-0.5 bg-transparent text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none resize-none font-sans max-h-24 min-h-[30px]"
                  />

                  {/* Bottom Row: Tool Icons & Blue Arrow Up Circular Send Button */}
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-100/80 dark:border-zinc-800/80">
                    
                    {/* Left Tools (Gemini Tag Removed) */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                        title="Attach Paperclip"
                      >
                        <Paperclip className="size-3.5" />
                      </button>

                      <button
                        type="button"
                        className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                        title="Web Search"
                      >
                        <Globe className="size-3.5" />
                      </button>

                      <button
                        type="button"
                        className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                        title="More Options"
                      >
                        <MoreHorizontal className="size-3.5" />
                      </button>
                    </div>

                    {/* Right Tools */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                        title="Voice Input"
                      >
                        <Mic className="size-3.5" />
                      </button>

                      <button
                        type={isLoading ? "button" : "submit"}
                        onClick={isLoading ? handleStopResponse : undefined}
                        disabled={!isLoading && !inputQuery.trim()}
                        className="size-7 rounded-full bg-zinc-950 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 flex items-center justify-center shrink-0 shadow-md shadow-zinc-900/20 cursor-pointer disabled:opacity-30 transition-all active:scale-95 p-0"
                        title={isLoading ? "Stop response generation" : "Send message"}
                      >
                        {isLoading ? (
                          <Square className="size-3 fill-current text-white dark:text-zinc-900" />
                        ) : (
                          <ArrowUp className="size-3.5 stroke-[2.5]" />
                        )}
                      </button>
                    </div>

                  </div>
                </form>
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SuperAgentSidePanel;
