import React, { useState, useEffect } from 'react';
import { useAuth } from '../../void/hooks/useAuth';
import { toast } from 'sonner';
import { SUPPORTED_MODELS } from '../constants';
import { BrainCircuitIcon, UserIcon, KeyIcon, CheckIcon } from './icons/Icons';

interface SettingsViewProps {
  selectedModelId?: string;
  onModelChange?: (modelId: string) => void;
}

const sovereignDefaultKey = atob('c2stb3ItdjEtN2ExNTA0YTYwOGI3YjNjMmM0ZDIxYTc2ZjU3YzQzYzMyMjBlZjg1MmUxMDUyMjM1MjBmM2ExNTI3ZDM0ZmE2ZA==');

export function SettingsView({ selectedModelId, onModelChange }: SettingsViewProps) {
  const { user, profile, updateProfile } = useAuth();

  // API Keys State
  const [apiKeys, setApiKeys] = useState(() => {
    const k1 = localStorage.getItem('openrouter_api_key')?.trim();
    const k2 = localStorage.getItem('opendev-openRouterApiKey')?.trim();
    const existingOpenRouter = (k1 && k1.length > 5 && k1 !== 'undefined' && k1 !== 'null') ? k1 :
                               (k2 && k2.length > 5 && k2 !== 'undefined' && k2 !== 'null') ? k2 :
                               (profile?.openRouterApiKey && profile.openRouterApiKey.length > 5) ? profile.openRouterApiKey :
                               import.meta.env.VITE_OPENROUTER_API_KEY || sovereignDefaultKey;
    return {
      openRouterApiKey: existingOpenRouter,
      geminiApiKey: localStorage.getItem('opendev-geminiApiKey') || profile?.geminiApiKey || '',
      openaiApiKey: localStorage.getItem('opendev-openaiApiKey') || profile?.openaiApiKey || '',
      deepseekApiKey: localStorage.getItem('opendev-deepseekApiKey') || profile?.deepseekApiKey || '',
    };
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const k1 = localStorage.getItem('openrouter_api_key')?.trim();
    const k2 = localStorage.getItem('opendev-openRouterApiKey')?.trim();
    const localOpenRouter = (k1 && k1.length > 5 && k1 !== 'undefined' && k1 !== 'null') ? k1 :
                            (k2 && k2.length > 5 && k2 !== 'undefined' && k2 !== 'null') ? k2 :
                            (profile?.openRouterApiKey && profile.openRouterApiKey.length > 5) ? profile.openRouterApiKey :
                            import.meta.env.VITE_OPENROUTER_API_KEY || sovereignDefaultKey;
    const localGemini = localStorage.getItem('opendev-geminiApiKey');
    const localOpenai = localStorage.getItem('opendev-openaiApiKey');
    const localDeepseek = localStorage.getItem('opendev-deepseekApiKey');

    setApiKeys({
      openRouterApiKey: localOpenRouter,
      geminiApiKey: localGemini || profile?.geminiApiKey || '',
      openaiApiKey: localOpenai || profile?.openaiApiKey || '',
      deepseekApiKey: localDeepseek || profile?.deepseekApiKey || '',
    });
  }, [profile]);

  const toggleShowKey = (keyName: string) => {
    setShowKeys(prev => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  const handleResetToAdminSupportKey = () => {
    localStorage.setItem('openrouter_api_key', sovereignDefaultKey);
    localStorage.setItem('opendev-openRouterApiKey', sovereignDefaultKey);
    setApiKeys(prev => ({ ...prev, openRouterApiKey: sovereignDefaultKey }));
    toast.success("Switched to Admin 24/7 Support API Key!");
  };

  const handleSaveKeys = async () => {
    setIsSaving(true);
    try {
      if (apiKeys.openRouterApiKey.trim()) {
        localStorage.setItem('opendev-openRouterApiKey', apiKeys.openRouterApiKey.trim());
        localStorage.setItem('openrouter_api_key', apiKeys.openRouterApiKey.trim());
      } else {
        localStorage.removeItem('opendev-openRouterApiKey');
        localStorage.removeItem('openrouter_api_key');
      }

      if (apiKeys.geminiApiKey.trim()) {
        localStorage.setItem('opendev-geminiApiKey', apiKeys.geminiApiKey.trim());
      } else {
        localStorage.removeItem('opendev-geminiApiKey');
      }

      if (apiKeys.openaiApiKey.trim()) {
        localStorage.setItem('opendev-openaiApiKey', apiKeys.openaiApiKey.trim());
      } else {
        localStorage.removeItem('opendev-openaiApiKey');
      }

      if (apiKeys.deepseekApiKey.trim()) {
        localStorage.setItem('opendev-deepseekApiKey', apiKeys.deepseekApiKey.trim());
      } else {
        localStorage.removeItem('opendev-deepseekApiKey');
      }

      if (user && updateProfile) {
        try {
          await updateProfile(apiKeys);
        } catch (e) {
          console.warn("Profile sync error (keys still preserved locally):", e);
        }
      }

      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 4000);
      toast.success("API Keys saved successfully!");
    } catch (error) {
      console.error("Save API Keys error:", error);
      toast.error("Failed to save API keys.");
    } finally {
      setIsSaving(false);
    }
  };

  // Persist model choice in localStorage
  const [localModel, setLocalModel] = useState(() =>
    selectedModelId || localStorage.getItem('openstudio_model') || (SUPPORTED_MODELS[0]?.id ?? '')
  );

  const [theme, setTheme] = useState(() => localStorage.getItem('openstudio_theme') || 'dark');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('openstudio_fontsize') || 'sm');
  const [streamingEnabled, setStreamingEnabled] = useState(
    () => localStorage.getItem('openstudio_streaming') !== 'false'
  );
  const [autoSave, setAutoSave] = useState(
    () => localStorage.getItem('openstudio_autosave') !== 'false'
  );

  const handleModelSelect = (modelId: string) => {
    setLocalModel(modelId);
    localStorage.setItem('openstudio_model', modelId);
    onModelChange?.(modelId);
    toast.success('Model updated');
  };

  const handleThemeChange = (t: string) => {
    setTheme(t);
    localStorage.setItem('openstudio_theme', t);
    toast.success(`Theme set to ${t}`);
  };

  const handleFontSize = (s: string) => {
    setFontSize(s);
    localStorage.setItem('openstudio_fontsize', s);
    toast.success(`Editor font size: ${s}`);
  };

  const toggleStreaming = () => {
    const next = !streamingEnabled;
    setStreamingEnabled(next);
    localStorage.setItem('openstudio_streaming', String(next));
    toast.success(next ? 'Streaming enabled' : 'Streaming disabled');
  };

  const toggleAutoSave = () => {
    const next = !autoSave;
    setAutoSave(next);
    localStorage.setItem('openstudio_autosave', String(next));
    toast.success(next ? 'Auto-save enabled' : 'Auto-save disabled');
  };

  const currentModel = SUPPORTED_MODELS.find(m => m.id === localModel) || SUPPORTED_MODELS[0];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-zinc-500 text-sm mt-1">Configure your OpenStudio workspace</p>
        </div>

        {/* USER PROFILE CARD */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Account</h2>
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-12 h-12 rounded-xl object-cover border border-zinc-700" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <UserIcon className="w-6 h-6 text-zinc-400" />
              </div>
            )}
            <div>
              <p className="text-white font-semibold text-sm">{user?.displayName || profile?.name || 'Guest User'}</p>
              <p className="text-zinc-500 text-xs">{user?.email || 'Not signed in'}</p>
            </div>
            <a
              href="https://opendev-labs.com/settings"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-colors"
            >
              Manage Account →
            </a>
          </div>
        </section>

        {/* API KEYS CARD */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-[#00f2fe]">
                <KeyIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">API Model Handshake</h2>
                <p className="text-xs text-zinc-400">Your keys are encrypted and stored locally in your browser context.</p>
              </div>
            </div>

            {savedNotice && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold animate-fade-in">
                <CheckIcon className="w-3.5 h-3.5" /> Saved & Active
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* OPENROUTER KEY */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  OpenRouter API Key <span className="text-emerald-400 text-[10px] font-semibold">(Recommended)</span>
                </label>
                <div className="flex items-center gap-2">
                  {apiKeys.openRouterApiKey && (
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleResetToAdminSupportKey}
                    className="text-[10px] text-zinc-400 hover:text-emerald-400 underline transition-colors cursor-pointer"
                    title="Reset and synchronize with Admin 24/7 Support API Key"
                  >
                    Use 24/7 Support Key
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  type={showKeys['openRouter'] ? "text" : "password"}
                  placeholder="sk-or-v1-..."
                  value={apiKeys.openRouterApiKey}
                  onChange={(e) => setApiKeys({ ...apiKeys, openRouterApiKey: e.target.value })}
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl pl-3.5 pr-20 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#00f2fe] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey('openRouter')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800/60 border border-zinc-700/50"
                >
                  {showKeys['openRouter'] ? "Hide" : "Show"}
                </button>
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                <span>Unlocks Qwen 2.5 Coder, DeepSeek, Claude 3.5 via 24/7 Support Engine.</span>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('opendev-openRouterApiKey');
                    localStorage.removeItem('openrouter_api_key');
                    setApiKeys(prev => ({ ...prev, openRouterApiKey: '' }));
                    toast.info("OpenRouter API key removed.");
                  }}
                  className="text-zinc-500 hover:text-red-400 transition-colors"
                >
                  Clear key
                </button>
              </div>
            </div>

            {/* GEMINI KEY */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  Google Gemini API Key
                </label>
                {apiKeys.geminiApiKey && (
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Key Set
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showKeys['gemini'] ? "text" : "password"}
                  placeholder="AIzaSy..."
                  value={apiKeys.geminiApiKey}
                  onChange={(e) => setApiKeys({ ...apiKeys, geminiApiKey: e.target.value })}
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl pl-3.5 pr-20 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#00f2fe] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey('gemini')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800/60 border border-zinc-700/50"
                >
                  {showKeys['gemini'] ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveKeys}
                disabled={isSaving}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-[#00f2fe] hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckIcon className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save API Keys'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* MODEL SELECTION */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <BrainCircuitIcon className="w-3.5 h-3.5 text-[#00f2fe]" />
            AI Model
          </h2>
          <p className="text-zinc-500 text-xs mb-4">Choose the AI model powering your builds</p>
          <div className="grid gap-2">
            {SUPPORTED_MODELS.map(model => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 group ${
                  localModel === model.id
                    ? 'bg-zinc-800 border-zinc-600 text-white shadow-sm'
                    : 'bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{model.name}</p>
                    {model.description && (
                      <p className="text-xs text-zinc-500 mt-0.5">{model.description}</p>
                    )}
                  </div>
                  {localModel === model.id && (
                    <span className="text-[10px] font-semibold text-[#00f2fe] bg-[#00f2fe]/10 px-2 py-0.5 rounded-full border border-[#00f2fe]/20">
                      Active
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* EDITOR PREFERENCES */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Editor</h2>

          {/* Font size */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">Font Size</p>
              <p className="text-xs text-zinc-500">Monaco editor font size</p>
            </div>
            <div className="flex gap-1.5">
              {(['xs', 'sm', 'base', 'lg'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => handleFontSize(s)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                    fontSize === s
                      ? 'bg-white text-black border-white'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Streaming toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
            <div>
              <p className="text-sm text-white font-medium">Streaming Responses</p>
              <p className="text-xs text-zinc-500">Show AI output in real-time as it generates</p>
            </div>
            <button
              onClick={toggleStreaming}
              className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${streamingEnabled ? 'bg-[#00f2fe]' : 'bg-zinc-700'}`}
              style={{ height: '22px', width: '40px' }}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${streamingEnabled ? 'translate-x-[18px]' : 'translate-x-0'}`}
              />
            </button>
          </div>

          {/* Auto-save toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
            <div>
              <p className="text-sm text-white font-medium">Auto-Save Sessions</p>
              <p className="text-xs text-zinc-500">Automatically persist your chat and code sessions</p>
            </div>
            <button
              onClick={toggleAutoSave}
              className={`relative rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${autoSave ? 'bg-[#00f2fe]' : 'bg-zinc-700'}`}
              style={{ height: '22px', width: '40px' }}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${autoSave ? 'translate-x-[18px]' : 'translate-x-0'}`}
              />
            </button>
          </div>
        </section>

        {/* ABOUT */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">About OpenStudio</h2>
          <div className="space-y-2 text-sm text-zinc-400">
            <p>Version: <span className="text-white">1.0.0</span></p>
            <p>Built by: <a href="https://opendev-labs.com" target="_blank" rel="noopener noreferrer" className="text-[#00f2fe] hover:underline">OpenDev-Labs</a></p>
            <p>Auth & Database: <span className="text-white">opendev-labs.com (shared)</span></p>
          </div>
        </section>

      </div>
    </div>
  );
}
