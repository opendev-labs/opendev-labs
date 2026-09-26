import React, { useState, useEffect } from 'react';
import { useAuth } from '../../void/hooks/useAuth';
import { toast } from 'sonner';
import { SUPPORTED_MODELS } from '../constants';
import { BrainCircuitIcon, UserIcon } from './icons/Icons';

interface SettingsViewProps {
  selectedModelId?: string;
  onModelChange?: (modelId: string) => void;
}

export function SettingsView({ selectedModelId, onModelChange }: SettingsViewProps) {
  const { user, profile } = useAuth();

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
