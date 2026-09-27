import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatSession, FileNode, GenerationInfo } from '../types';
import { ChatView } from './ChatView';
import { CodeView } from './CodeView';
import { DeployDialog } from './DeployDialog';
import { DeployIcon, PanelLeftCloseIcon, PanelRightCloseIcon, CodeIcon, PlayIcon, ShareIcon, ChevronsRightIcon } from './icons/Icons';
import { hubService } from '../../../services/hubService';
import { useAuth } from '../../void/hooks/useAuth';
import { toast } from 'sonner';
import { LocalSyncService } from '../services/localSyncService';
import { PublishTemplateModal } from './PublishTemplateModal';
import { isUserPro, openPricingPage } from '../services/promptQuotaService';

interface ChatSessionViewProps {
  session: ChatSession;
  isThinking: boolean;
  onSendMessage: (prompt: string) => void;
  setActiveFile: (file: FileNode | null) => void;
  onFileContentChange: (path: string, content: string) => void;
  onAddFileOrFolder: (path: string, type: 'file' | 'folder') => void;
  onDeleteFileOrFolder: (path: string, isFile: boolean) => void;
  onRenameFileOrFolder: (oldPath: string, newPath: string, isFile: boolean) => void;
  // Model props
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  onReplaceFileTree: (fileTree: FileNode[]) => void;
}

export function ChatSessionView({
  session,
  isThinking,
  onSendMessage,
  setActiveFile,
  onFileContentChange,
  onAddFileOrFolder,
  onDeleteFileOrFolder,
  onRenameFileOrFolder,
  selectedModelId,
  onModelChange,
  onReplaceFileTree,
}: ChatSessionViewProps) {
  const { user, profile } = useAuth();
  const lastMessage = session.messages[session.messages.length - 1];
  const generationInfo: GenerationInfo | null = (lastMessage?.role === 'open-studio' && lastMessage.generationInfo)
    ? lastMessage.generationInfo
    : null;

  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const [isCodeViewVisible, setIsCodeViewVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [chatPanelWidth, setChatPanelWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Math.min(390, Math.floor(window.innerWidth * 0.32));
    }
    return 390;
  });
  const chatViewRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const prevIsThinking = useRef(isThinking);
  const [isLinked, setIsLinked] = useState(LocalSyncService.isLinked());

  useEffect(() => {
    if (isLinked) {
      LocalSyncService.syncToLocal(session.fileTree);
    }
  }, [session.fileTree, isLinked]);

  useEffect(() => {
    // When generation starts, force the 'code' tab to be active.
    if (isThinking) {
      setActiveTab('code');
    }
    // When generation finishes (isThinking was true, now false), switch to 'preview'.
    else if (prevIsThinking.current && !isThinking) {
      // Only switch if files were actually generated or modified.
      if (generationInfo?.files && generationInfo.files.length > 0) {
        setActiveTab('preview');
      }
    }

    // Update the ref to store the current thinking state for the next render cycle.
    prevIsThinking.current = isThinking;
  }, [isThinking, generationInfo]);

  // Restore cursor if the component unmounts mid-drag
  useEffect(() => {
    return () => {
      if (isResizingRef.current) {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        isResizingRef.current = false;
      }
    };
  }, []);

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startWidth = chatViewRef.current?.offsetWidth ?? chatPanelWidth;
    const startPosition = mouseDownEvent.clientX;

    // Lock cursor globally so it doesn't flicker during fast drags
    isResizingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    function onMouseMove(mouseMoveEvent: MouseEvent) {
      if (!isResizingRef.current) return;
      const newWidth = startWidth - (mouseMoveEvent.clientX - startPosition);
      const minWidth = 300;
      const maxWidth = 700;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setChatPanelWidth(newWidth);
      }
    }
    function onMouseUp() {
      // Always restore cursor & state on release
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [chatPanelWidth]);

  return (
    <div className="flex flex-col h-full bg-[#050505] text-zinc-100 selection:bg-[#00f2fe]/30 selection:text-white overflow-hidden">
      {/* 🏗️ OPENSTUDIO $1M MINIMAL WORKSPACE HEADER */}
      <header className="h-11 border-b border-zinc-900 bg-[#050505] flex items-center justify-between px-3 z-40 shrink-0 select-none">
        {/* LEFT: LOGO BADGE, SESSION TITLE & LIVE VM STATUS */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
            <CodeIcon className="w-3.5 h-3.5 text-[#00f2fe]" />
          </div>
          <h1 className="text-xs font-semibold text-white tracking-tight truncate max-w-[160px] sm:max-w-[280px]">
            {session.title || 'Create a login page'}
          </h1>
          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>CodeDevBox VM</span>
          </div>
        </div>

        {/* RIGHT: CODE | PREVIEW TOGGLE, EXPORT, SPLIT ICON, PUBLISH BUTTON */}
        <div className="flex items-center gap-2 shrink-0">
          {/* CODE / PREVIEW TAB PILL */}
          <div className="flex items-center bg-zinc-900/90 border border-zinc-800/80 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-0.5 text-[11px] font-bold rounded transition-all cursor-pointer ${
                activeTab === 'code' 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              CODE
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-0.5 text-[11px] font-bold rounded transition-all cursor-pointer ${
                activeTab === 'preview' 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              PREVIEW
            </button>
          </div>

          {/* EXPORT PROJECT BUTTON (OPENSTUDIO PRO) */}
          <button
            onClick={() => {
              if (!isUserPro()) {
                openPricingPage();
                return;
              }
              try {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(session.fileTree, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `${(session.title || 'openstudio-project').toLowerCase().replace(/[^a-z0-9]/g, '-')}-files.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                toast.success('Workspace files exported successfully!');
              } catch (e) {
                toast.error('Export failed.');
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[10px] font-bold text-zinc-300 hover:text-white transition-all cursor-pointer group"
            title="Export Project Files (OpenStudio Pro)"
          >
            <span>⬇ Export</span>
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[8px] font-black px-1.5 py-0.2 rounded tracking-wider shadow-sm group-hover:scale-105 transition-transform">
              PRO
            </span>
          </button>

          {/* SPLIT TOGGLE ICON */}
          <button
            onClick={() => setIsCodeViewVisible(!isCodeViewVisible)}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Toggle Split View"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m6 10V7M3 5h18v14H3V5z" />
            </svg>
          </button>

          {/* PUBLISH TO TEMPLATES BUTTON */}
          <button
            onClick={() => {
              setIsPublishModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#00f2fe] to-cyan-500 hover:from-cyan-400 hover:to-cyan-500 text-black font-extrabold rounded-lg text-[11px] shadow-[0_0_12px_rgba(0,242,254,0.3)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Save to opendev-labs.com/templates & OpenStudio Showcase"
          >
            <span>☆</span>
            <span>PUBLISH</span>
          </button>
        </div>
      </header>

      {/* 🏗️ MAIN WORKSPACE AREA */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* CODE / PREVIEW PANEL (CENTER / MAIN) */}
        <AnimatePresence>
          {isCodeViewVisible && (
            <motion.div
              className="flex-1 h-full bg-[#09090b] relative overflow-hidden min-w-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-full">
                <CodeView
                  session={session}
                  setActiveFile={setActiveFile}
                  onFileContentChange={onFileContentChange}
                  generationInfo={generationInfo}
                  onAddFileOrFolder={onAddFileOrFolder}
                  onDeleteFileOrFolder={onDeleteFileOrFolder}
                  onRenameFileOrFolder={onRenameFileOrFolder}
                  activeTab={activeTab}
                  onFixError={(prompt: string) => onSendMessage(prompt)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SUBTLE RESIZER */}
        {isCodeViewVisible && (
          <div
            onMouseDown={startResizing}
            className="relative w-[6px] h-full cursor-col-resize bg-zinc-900 hover:bg-[#f02050] transition-colors flex-shrink-0 z-30 select-none"
          >
            <div className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize z-10" />
          </div>
        )}

        {/* CHAT PANEL (RIGHT SIDE) */}
        <motion.div
          ref={chatViewRef}
          className="h-full bg-[#09090b] overflow-hidden relative border-l border-zinc-800/60 shrink-0"
          initial={false}
          animate={{ width: isCodeViewVisible ? `${chatPanelWidth}px` : '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="h-full">
            <ChatView
              messages={session.messages}
              isThinking={isThinking}
              onSendMessage={onSendMessage}
              suggestions={session.suggestions}
              selectedModelId={selectedModelId}
              onModelChange={onModelChange}
            />
          </div>
        </motion.div>
      </div>

      {/* Deploy Dialog */}
      <DeployDialog
        open={showDeployDialog}
        onClose={() => setShowDeployDialog(false)}
        files={session.fileTree}
        sessionTitle={session.title}
      />



      {/* Publish to Templates Modal */}
      <PublishTemplateModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        sessionTitle={session.title}
        fileTree={session.fileTree}
        authorName={user?.name || profile?.username || 'OpenStudio Creator'}
      />
    </div>
  );
}