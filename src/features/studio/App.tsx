import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatSessionView } from './components/ChatSessionView';
import { SettingsView } from './components/SettingsView';
import { AllChatsView } from './components/AllChatsView';
import type { Message, FileNode, View, ChatSession, GenerationInfo, GenerationFile } from './types';
import { streamChatResponse, generateSuggestions } from './services/llmService';
import { SidebarIcon } from './components/icons/Icons';
import { SUPPORTED_MODELS } from './constants';
import { hubService } from '../../services/hubService';
import { useAuth } from '../void/hooks/useAuth';
import { ShareIcon } from './components/icons/Icons';
import { toast } from 'sonner';
import { LamaDB } from '../../lib/lamaDB';

// A simple ID generator
const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2);

type GeneratedFileObject = { path: string; content?: string; action: 'created' | 'modified' | 'deleted' };

// 4-Stage Fail-Safe AI Response Extractor for HeroChatUI / OpenStudio
function extractFilesFromAIResponse(text: string): { conversation: string; files: GeneratedFileObject[] } {
  let cleanText = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  let generatedFiles: GeneratedFileObject[] = [];
  let conversation = "Materialized requested web app components.";

  if (!cleanText) {
    return { conversation: "No content generated.", files: [] };
  }

  // STAGE 1: Standard JSON Parse
  let jsonString = '';
  const jsonBlockMatch = cleanText.match(/```json\n([\s\S]*?)\n```/i);
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    jsonString = jsonBlockMatch[1].trim();
  } else {
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      jsonString = cleanText.substring(firstBrace, lastBrace + 1).trim();
    }
  }

  if (jsonString) {
    try {
      const sanitized = jsonString.replace(/[\u0000-\u001F]+/g, (match) => {
        if (match === '\n') return '\\n';
        if (match === '\r') return '\\r';
        if (match === '\t') return '\\t';
        return '';
      });
      const parsed = JSON.parse(sanitized);
      if (parsed.conversation) conversation = parsed.conversation;
      if (parsed.files && Array.isArray(parsed.files)) {
        generatedFiles = parsed.files
          .filter((f: any) => f && f.path && (f.content !== undefined || f.action))
          .map((f: any) => ({
            path: f.path,
            content: f.content || '',
            action: f.action || 'created'
          }));
      }
    } catch (e) {
      console.warn("Stage 1 JSON parse failed, moving to Stage 2 regex extraction.", e);
    }
  }

  // STAGE 2: Loose Regex JSON Field Extractor (handles unescaped quotes/newlines in code strings)
  if (generatedFiles.length === 0 && jsonString) {
    try {
      const fileRegex = /"path"\s*:\s*"([^"]+)"[\s\S]*?"content"\s*:\s*"((?:\\.|[^"\\])*)"/g;
      let fileMatch;
      while ((fileMatch = fileRegex.exec(jsonString)) !== null) {
        const filePath = fileMatch[1];
        let fileContent = fileMatch[2]
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
        if (filePath && fileContent) {
          generatedFiles.push({
            path: filePath.trim(),
            content: fileContent,
            action: 'created'
          });
        }
      }
      const convMatch = jsonString.match(/"conversation"\s*:\s*"((?:\\.|[^"\\])*)"/);
      if (convMatch && convMatch[1]) {
        conversation = convMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
      }
    } catch (e) {
      console.warn("Stage 2 Regex extraction failed, moving to Stage 3.", e);
    }
  }

  // STAGE 3: Markdown Code Block Extractor
  if (generatedFiles.length === 0) {
    const fileBlockRegex = /(?:###?\s+`?([a-zA-Z0-9_./\-]+)`?[\s\S]*?)?```([a-zA-Z0-9_\-+.]+)?\n([\s\S]*?)```/g;
    let match;
    let fileIndex = 1;

    while ((match = fileBlockRegex.exec(cleanText)) !== null) {
      const headerPath = match[1];
      const lang = (match[2] || '').toLowerCase();
      const code = match[3];

      let path = headerPath;
      if (!path) {
        if (lang === 'tsx' || lang === 'jsx') path = fileIndex === 1 ? 'src/App.tsx' : `src/components/Component${fileIndex}.tsx`;
        else if (lang === 'html') path = 'index.html';
        else if (lang === 'css') path = 'src/index.css';
        else if (lang === 'js' || lang === 'ts') path = `src/script${fileIndex}.js`;
        else path = `src/file${fileIndex}.txt`;
      }

      if (code && code.trim()) {
        generatedFiles.push({
          path: path.trim(),
          content: code.trim(),
          action: 'created'
        });
        fileIndex++;
      }
    }

    if (generatedFiles.length > 0) {
      const textNoCode = cleanText.replace(/```[\s\S]*?```/g, '').trim();
      if (textNoCode) conversation = textNoCode;
    }
  }

  // STAGE 4: Raw Code Catch-All Fallback (Wraps raw React code directly into src/App.tsx)
  if (generatedFiles.length === 0 && (cleanText.includes('import ') || cleanText.includes('export ') || cleanText.includes('<div') || cleanText.includes('function '))) {
    console.log("Stage 4: Raw React code detected, assigning directly to src/App.tsx");
    generatedFiles.push({
      path: 'src/App.tsx',
      content: cleanText,
      action: 'created'
    });
    conversation = "Materialized code directly into src/App.tsx";
  }

  return { conversation, files: generatedFiles };
}

// Helper to extract clean conversational text during streaming without code or JSON leakage
function getCleanStreamConversation(text: string): string {
  if (!text) return '';

  // 1. Remove thinking blocks <think>...</think> or unclosed <think>...
  let clean = text.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, '').trim();
  if (!clean) return '';

  // 2. Check for JSON "conversation" key (handles standard JSON format)
  const convMatch = clean.match(/"conversation"\s*:\s*"((?:\\.|[^"\\])*)"?/);
  if (convMatch && convMatch[1]) {
    const unescaped = convMatch[1]
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\');
    return unescaped.trim();
  }

  // 3. If streaming starts with JSON '{' or '```json' before conversation key arrives
  if (clean.startsWith('{') || clean.startsWith('```json')) {
    return '';
  }

  // 4. Strip markdown code blocks including unclosed streaming code blocks
  clean = clean.replace(/```[a-zA-Z0-9_\-+.]*(\n[\s\S]*?(?:```|$)|[\s\S]*?$)/g, '').trim();

  // 5. Strip raw JSON blocks
  clean = clean.replace(/\{[\s\S]*?\}/g, '').trim();

  // 6. Check if text is raw code imports or functions
  if (/^(import\s|export\s|function\s|const\s|class\s|<[a-zA-Z])/m.test(clean)) {
    return "Materializing requested components into the live workspace...";
  }

  return clean;
}

// Helper to extract file paths from AI response during streaming
function extractStreamFilePaths(text: string): GenerationFile[] {
  const files: GenerationFile[] = [];
  const seenPaths = new Set<string>();

  // 1. JSON "path" fields
  const jsonPathRegex = /"path"\s*:\s*"([^"]+)"/g;
  let jsonMatch;
  while ((jsonMatch = jsonPathRegex.exec(text)) !== null) {
    const p = jsonMatch[1].trim();
    if (p && !seenPaths.has(p)) {
      seenPaths.add(p);
      files.push({ path: p, action: 'created', status: 'generating' });
    }
  }

  // 2. Markdown code block headers or filename hints
  if (files.length === 0) {
    const mdBlockRegex = /(?:###?\s+`?([a-zA-Z0-9_./\-]+)`?[\s\S]*?)?```([a-zA-Z0-9_\-+.]+)?/g;
    let mdMatch;
    let fileIdx = 1;
    while ((mdMatch = mdBlockRegex.exec(text)) !== null) {
      const headerPath = mdMatch[1];
      const lang = (mdMatch[2] || '').toLowerCase();
      let path = headerPath;
      if (!path && lang) {
        if (lang === 'tsx' || lang === 'jsx') path = fileIdx === 1 ? 'src/App.tsx' : `src/components/Component${fileIdx}.tsx`;
        else if (lang === 'html') path = 'index.html';
        else if (lang === 'css') path = 'src/index.css';
        else if (lang === 'js' || lang === 'ts') path = `src/script${fileIdx}.js`;
      }
      if (path && !seenPaths.has(path)) {
        seenPaths.add(path);
        files.push({ path, action: 'created', status: 'generating' });
        fileIdx++;
      }
    }
  }

  return files;
}

function App() {
  const [view, setView] = useState<View>('new-chat');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Model State
  const [selectedModelId, setSelectedModelId] = useState<string>(SUPPORTED_MODELS[0].id);

  useEffect(() => {
    try {
      const savedModel = localStorage.getItem('opendev-selectedModelId');
      if (savedModel && savedModel !== 'gemini-1.5-pro') {
        setSelectedModelId(savedModel);
      } else {
        setSelectedModelId(SUPPORTED_MODELS[0].id);
        localStorage.setItem('opendev-selectedModelId', SUPPORTED_MODELS[0].id);
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
    }
  }, []);

  const handleModelChange = useCallback((modelId: string) => {
    setSelectedModelId(modelId);
    localStorage.setItem('opendev-selectedModelId', modelId);
  }, []);


  const { user, profile } = useAuth();

  // ----- SESSION PERSISTENCE: Load from LamaDB on mount -----
  useEffect(() => {
    if (!user) return;
    const loadSessions = async () => {
      try {
        const userContext = { uid: user.uid, email: user.email };
        const saved = await (LamaDB as any).store.collection('openstudio_sessions', userContext).get();
        if (saved && Array.isArray(saved) && saved.length > 0) {
          const restored: ChatSession[] = saved.map((s: any) => ({
            id: s.sessionId || s.id,
            title: s.title || 'Untitled',
            messages: s.messages ? (typeof s.messages === 'string' ? JSON.parse(s.messages) : s.messages) : [],
            fileTree: s.files ? (typeof s.files === 'string' ? JSON.parse(s.files) : s.files) : [],
            activeFile: null,
            suggestions: [],
            lastUpdated: s.updatedAt ? new Date(s.updatedAt).getTime() : Date.now(),
          }));
          setSessions(prev => {
            // Merge: keep in-memory sessions that aren't in DB yet
            const dbIds = new Set(restored.map(r => r.id));
            const keepExisting = prev.filter(p => !dbIds.has(p.id));
            return [...restored.sort((a, b) => b.lastUpdated - a.lastUpdated), ...keepExisting];
          });
          console.log(`✅ OpenStudio: Restored ${restored.length} sessions from LamaDB.`);
        }
      } catch (e) {
        console.error('Failed to load sessions from LamaDB:', e);
      }
    };
    loadSessions();
  }, [user?.uid]);

  // ----- SESSION PERSISTENCE: Auto-save active session (debounced 3s) -----
  useEffect(() => {
    if (!user || !activeSessionId || isThinking) return;
    const session = sessions.find(s => s.id === activeSessionId);
    if (!session || session.messages.length === 0) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        const userContext = { uid: user.uid, email: user.email };
        const payload = {
          sessionId: session.id,
          userId: user.uid,
          title: session.title,
          messages: JSON.stringify(session.messages),
          files: JSON.stringify(session.fileTree),
          createdAt: new Date(session.lastUpdated).toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Try to update existing, or create new
        const existing = await (LamaDB as any).store.collection('openstudio_sessions', userContext).get();
        const match = existing?.find((s: any) => s.sessionId === session.id);

        if (match) {
          await (LamaDB as any).store.collection('openstudio_sessions', userContext).update(match.id, payload);
        } else {
          await (LamaDB as any).store.collection('openstudio_sessions', userContext).add(payload);
        }
        console.log('💾 OpenStudio: Session saved.');
      } catch (e) {
        console.error('Failed to save session:', e);
      } finally {
        setIsSaving(false);
      }
    }, 3000);

    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [sessions, activeSessionId, user?.uid, isThinking]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, ''); // Normalize hash
      const [path, id] = hash.split('/');

      if (path === 'chat' && id) {
        setActiveSessionId(id);
        setView('chat-session');
      } else if (path === 'chats') {
        setActiveSessionId(null);
        setView('all-chats');
      } else if (path === 'settings') {
        setActiveSessionId(null);
        setView('settings');
      } else if (path === 'storage') {
        setActiveSessionId(null);
        setView('storage');
      } else if (path === 'deploy') {
        setActiveSessionId(null);
        setView('deploy');
      } else {
        setActiveSessionId(null);
        setView('new-chat');
      }

      setIsInitialLoad(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleNavigate = (targetView: View) => {
    switch (targetView) {
      case 'new-chat':
        window.location.hash = '/';
        break;
      case 'all-chats':
        window.location.hash = '/chats';
        break;
      case 'settings':
        window.location.hash = '/settings';
        break;
      case 'storage':
        window.location.hash = '/storage';
        break;
      case 'deploy':
        window.location.hash = '/deploy';
        break;
    }
  };

  const handleShareToHub = async () => {
    if (!activeSession || !user) return;
    
    try {
      const content = `Node Project: ${activeSession.title}\n\nBuilt with OpenStudio. Contains ${activeSession.fileTree.length} materialized assets.`;
      const title = activeSession.title;
      
      await hubService.shareToHub(user, profile, content, title);
      toast.success("Build shared to OpenHub feed!");
    } catch (error) {
      toast.error("Failed to share build.");
    }
  };

  const handleSelectChat = (chatId: string) => {
    window.location.hash = `/chat/${chatId}`;
  };

  const setActiveFileForSession = (file: FileNode | null) => {
    if (!activeSessionId) return;
    setSessions(currentSessions =>
      currentSessions.map(s =>
        s.id === activeSessionId ? { ...s, activeFile: file } : s
      )
    );
  };

  const handleFileContentChange = (filePath: string, newContent: string) => {
    if (!activeSessionId) return;
    setSessions(currentSessions =>
      currentSessions.map(s => {
        if (s.id === activeSessionId) {
          const updatedFileTree = s.fileTree.map(f =>
            f.path === filePath ? { ...f, content: newContent } : f
          );

          const newActiveFile = s.activeFile?.path === filePath
            ? { ...s.activeFile, content: newContent }
            : s.activeFile;

          return { ...s, fileTree: updatedFileTree, activeFile: newActiveFile };
        }
        return s;
      })
    );
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(currentSessions => currentSessions.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      handleNavigate('new-chat');
    }
  };

  const handleAddFileOrFolder = (path: string, type: 'file' | 'folder') => {
    if (!activeSessionId) return;

    if (!path.trim() || /[\\?%*:|"<>]/g.test(path)) {
      alert("Invalid file or folder name.");
      return;
    }

    setSessions(currentSessions => currentSessions.map(s => {
      if (s.id === activeSessionId) {
        if (type === 'file') {
          if (s.fileTree.some(f => f.path === path)) {
            alert(`File "${path}" already exists.`);
            return s;
          }
          const newFile: FileNode = { path, content: '' };
          const newFileTree = [...s.fileTree, newFile];
          return { ...s, fileTree: newFileTree, activeFile: newFile };
        } else { // folder
          const folderPath = path.endsWith('/') ? path : path + '/';
          if (s.fileTree.some(f => f.path.startsWith(folderPath) || f.path === path)) {
            alert(`A folder or file with the name "${path}" already exists.`);
            return s;
          }
          // Use a placeholder file to represent an empty folder
          const placeholderFile: FileNode = { path: `${folderPath}.keep`, content: '' };
          const newFileTree = [...s.fileTree, placeholderFile];
          return { ...s, fileTree: newFileTree };
        }
      }
      return s;
    }));
  };

  const handleDeleteFileOrFolder = (path: string, isFile: boolean) => {
    if (!activeSessionId) return;
    if (!window.confirm(`Are you sure you want to delete "${path}"? This cannot be undone.`)) return;

    setSessions(currentSessions => currentSessions.map(s => {
      if (s.id === activeSessionId) {
        const folderPrefix = path.endsWith('/') ? path : path + '/';
        const newFileTree = s.fileTree.filter(f => isFile ? f.path !== path : !f.path.startsWith(folderPrefix));

        let newActiveFile = s.activeFile;
        if (newActiveFile && (isFile ? newActiveFile.path === path : newActiveFile.path.startsWith(folderPrefix))) {
          newActiveFile = null;
        }

        return { ...s, fileTree: newFileTree, activeFile: newActiveFile };
      }
      return s;
    }));
  };

  const handleRenameFileOrFolder = (oldPath: string, newPath: string, isFile: boolean) => {
    if (!activeSessionId || oldPath === newPath) return;

    if (!newPath.trim() || /[\\?%*:|"<>]/g.test(newPath)) {
      alert("Invalid new name.");
      return;
    }

    setSessions(currentSessions => currentSessions.map(s => {
      if (s.id === activeSessionId) {
        const newFileTree = s.fileTree.map(f => {
          if (isFile) {
            return f.path === oldPath ? { ...f, path: newPath } : f;
          } else {
            const folderPrefix = oldPath.endsWith('/') ? oldPath : oldPath + '/';
            if (f.path.startsWith(folderPrefix)) {
              return { ...f, path: f.path.replace(folderPrefix, newPath + '/') };
            }
            return f;
          }
        });

        let newActiveFile = s.activeFile;
        if (newActiveFile) {
          if (isFile && newActiveFile.path === oldPath) {
            newActiveFile = { ...newActiveFile, path: newPath };
          } else if (!isFile && newActiveFile.path.startsWith(oldPath + '/')) {
            const folderPrefix = oldPath.endsWith('/') ? oldPath : oldPath + '/';
            newActiveFile = { ...newActiveFile, path: newActiveFile.path.replace(folderPrefix, newPath + '/') };
          }
        }

        return { ...s, fileTree: newFileTree, activeFile: newActiveFile };
      }
      return s;
    }));
  };

  const handleReplaceFileTree = (fileTree: FileNode[]) => {
    setSessions(currentSessions => currentSessions.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, fileTree, activeFile: fileTree[0] || null };
      }
      return s;
    }));
  };

  const isThinkingRef = useRef(false);

  const handleSendMessage = async (prompt: string) => {
    if (isThinkingRef.current) return;
    isThinkingRef.current = true;
    setIsThinking(true);

    let currentSessionId = activeSessionId;
    let newSessionCreated = false;

    if (currentSessionId) {
      setSessions(prevSessions => prevSessions.map(s =>
        s.id === currentSessionId ? { ...s, suggestions: [] } : s
      ));
    }

    let history: Message[] = [];
    let currentFileTree: FileNode[] = [];
    const userMessage: Message = { id: Date.now(), role: 'user', content: prompt };
    const openStudioMessageId = Date.now() + 1;
    const openStudioPlaceholder: Message = {
      id: openStudioMessageId,
      role: 'open-studio',
      content: '', // Initially empty, will show "Thinking..." via component logic
      generationInfo: {
        status: 'generating',
        files: [],
      },
    };

    if (!currentSessionId) {
      newSessionCreated = true;
      const newId = generateId();
      const newSession: ChatSession = {
        id: newId,
        title: prompt.length > 25 ? prompt.substring(0, 22) + '...' : prompt,
        messages: [userMessage, openStudioPlaceholder],
        fileTree: [],
        activeFile: null,
        lastUpdated: Date.now(),
      };
      setSessions(currentSessions => [newSession, ...currentSessions]);
      setActiveSessionId(newId);
      currentSessionId = newId; // Important: set currentSessionId for this scope
      history = [];
      currentFileTree = [];
    } else {
      const session = sessions.find(s => s.id === currentSessionId);
      if (session) {
        history = session.messages;
        currentFileTree = session.fileTree;
      }
      setSessions(prevSessions => prevSessions.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, userMessage, openStudioPlaceholder], lastUpdated: Date.now() };
        }
        return s;
      }));
    }

    // Must navigate after state has been updated to ensure the view can find the session
    if (newSessionCreated) {
      setView('chat-session');
      window.location.hash = `#/chat/${currentSessionId}`;
    }

    try {
      let fullResponse = '';
      let conversationText = '';

      const stream = streamChatResponse(prompt, history, currentFileTree, selectedModelId, profile, (progressMsg) => {
        // Direct UI update for progress messages from WebGPU without accumulating into fullResponse
        setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: s.messages.map(m => m.id === openStudioMessageId ? { ...m, content: progressMsg } : m) } : s));
      });

      for await (const chunk of stream) {
        fullResponse += chunk.text;

        const cleanText = getCleanStreamConversation(fullResponse);
        const streamFiles = extractStreamFilePaths(fullResponse);

        if (cleanText && cleanText !== conversationText) {
          conversationText = cleanText;
        }

        setSessions(prev => prev.map(s => {
          if (s.id !== currentSessionId) return s;
          return {
            ...s,
            messages: s.messages.map(m => {
              if (m.id !== openStudioMessageId) return m;
              return {
                ...m,
                content: conversationText || m.content,
                generationInfo: {
                  status: 'generating' as const,
                  files: streamFiles.length > 0 ? streamFiles : (m.generationInfo?.files || [])
                }
              };
            })
          };
        }));
      }

      // Process the complete response using our 4-stage robust file extraction engine
      let { conversation: finalConversationalPart, files: generatedFileObjects } = extractFilesFromAIResponse(fullResponse);

      // Perform a single atomic state update to apply all file changes and update the message state without re-render flicker
      setSessions(prev => prev.map(s => {
        if (s.id !== currentSessionId) return s;

        let updatedFileTree = [...s.fileTree];
        let newActiveFile = s.activeFile;

        for (const file of generatedFileObjects) {
          if (file.action === 'created' || file.action === 'modified') {
            const updatedFile: FileNode = { path: file.path, content: file.content || '' };
            const fileIndex = updatedFileTree.findIndex(f => f.path === file.path);
            if (fileIndex !== -1) {
              updatedFileTree[fileIndex] = updatedFile;
            } else {
              updatedFileTree.push(updatedFile);
            }
            if (!newActiveFile || file.path === 'src/App.tsx' || file.path.endsWith('App.tsx')) {
              newActiveFile = updatedFile;
            }
          } else if (file.action === 'deleted') {
            updatedFileTree = updatedFileTree.filter(f => f.path !== file.path);
            if (newActiveFile?.path === file.path) {
              newActiveFile = null;
            }
          }
        }

        if (!newActiveFile && updatedFileTree.length > 0) {
          newActiveFile = updatedFileTree.find(f => /App\.(tsx|jsx)$/.test(f.path)) || updatedFileTree[0];
        }

        const completedGenerationFiles: GenerationFile[] = generatedFileObjects.map(f => ({
          path: f.path,
          action: f.action,
          status: 'complete' as const,
        }));

        const updatedMessages = s.messages.map(msg => {
          if (msg.id === openStudioMessageId) {
            return {
              ...msg,
              content: finalConversationalPart,
              generationInfo: {
                status: 'complete' as const,
                files: completedGenerationFiles,
              },
            };
          }
          return msg;
        });

        return {
          ...s,
          fileTree: updatedFileTree,
          activeFile: newActiveFile,
          messages: updatedMessages,
          lastUpdated: Date.now(),
        };
      }));

      if (generatedFileObjects.length > 0) {
        const lastUserPrompt = prompt;
        const generatedFilePaths = generatedFileObjects.map(f => f.path);
        const suggestionContext = `Based on the user's request to "${lastUserPrompt}", I have generated or modified the following files: ${generatedFilePaths.join(', ')}.`;
        const newSuggestions = await generateSuggestions(suggestionContext);

        setSessions(prevSessions => prevSessions.map(s => {
          if (s.id === currentSessionId) {
            return { ...s, suggestions: newSuggestions };
          }
          return s;
        }));
      }

    } catch (error) {
      console.error("Error streaming chat response:", error);
      setSessions(prevSessions => prevSessions.map(s => {
        if (s.id === currentSessionId) {
          const messages = s.messages.map(m => m.id === openStudioMessageId ? { ...m, content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}` } : m);
          return { ...s, messages };
        }
        return s;
      }));
    } finally {
      isThinkingRef.current = false;
      setIsThinking(false);
    }
  };

  if (isInitialLoad) {
    return null;
  }

  const commonProps = {
    isThinking,
    onSendMessage: handleSendMessage,
    selectedModelId,
    onModelChange: handleModelChange,
  };

  return (
    <div className="flex h-screen w-screen bg-background text-muted-foreground selection:bg-primary/20 selection:text-foreground overflow-hidden">
      {/* 🛸 LEFT SIDBAR */}
      <Sidebar
        onNavigate={handleNavigate}
        recentChats={sessions}
        onSelectChat={handleSelectChat}
        onDeleteSession={handleDeleteSession}
        activeView={view}
        activeChatId={activeSessionId}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      {/* 🏗️ MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden shadow-2xl">
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
            {view === 'chat-session' && activeSession && (
              <ChatSessionView
                session={activeSession}
                {...commonProps}
                setActiveFile={setActiveFileForSession}
                onFileContentChange={handleFileContentChange}
                onAddFileOrFolder={handleAddFileOrFolder}
                onDeleteFileOrFolder={handleDeleteFileOrFolder}
                onRenameFileOrFolder={handleRenameFileOrFolder}
                selectedModelId={selectedModelId}
                onModelChange={handleModelChange}
                onReplaceFileTree={handleReplaceFileTree}
              />
            )}
            {view === 'new-chat' && !activeSessionId && (
              <div className="h-full">
                <WelcomeScreen {...commonProps} />
              </div>
            )}
            {view === 'storage' && (
              <div className="h-full pt-10 px-8 text-foreground">
                <h2 className="text-xl font-bold mb-2">LamaDB Console</h2>
                <p className="text-muted-foreground">Storage and database management panel.</p>
              </div>
            )}
            {view === 'deploy' && (
              <div className="h-full pt-10 px-8 text-foreground">
                <h2 className="text-xl font-bold mb-2">Deployment Cockpit</h2>
                <p className="text-muted-foreground">Deployment and hosting control panel.</p>
              </div>
            )}
            {view === 'chat-session' && !activeSession && !isInitialLoad && (
              <div className="p-8 text-foreground flex flex-col items-center justify-center h-full text-center">
                <h1 className="text-xl font-semibold mb-2 tracking-tight">Session not found</h1>
                <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed">The project session you are attempting to load does not exist or has been deleted.</p>
                <button
                  onClick={() => handleNavigate('new-chat')}
                  className="px-6 py-2.5 text-sm font-medium bg-white text-black hover:bg-zinc-200 transition-colors rounded-lg"
                >
                  Start New Session
                </button>
              </div>
            )}
            {view === 'all-chats' && <div className="h-full"><AllChatsView sessions={sessions} onSelectChat={handleSelectChat} onDeleteSession={handleDeleteSession} onNavigate={handleNavigate} /></div>}
            {view === 'settings' && <div className="h-full"><SettingsView /></div>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;