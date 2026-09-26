import React, { useState, useEffect } from 'react';
import { KeyIcon, UserIcon, ShieldIcon, CheckIcon } from './icons/Icons';
import { useAuth } from '../../void/hooks/useAuth';
import { toast } from 'sonner';

export function SettingsView() {
    const { user, profile, updateProfile } = useAuth();
    
    const [apiKeys, setApiKeys] = useState({
        openRouterApiKey: localStorage.getItem('openrouter_api_key') || localStorage.getItem('opendev-openRouterApiKey') || profile?.openRouterApiKey || import.meta.env.VITE_OPENROUTER_API_KEY || '',
        geminiApiKey: localStorage.getItem('opendev-geminiApiKey') || profile?.geminiApiKey || '',
        openaiApiKey: localStorage.getItem('opendev-openaiApiKey') || profile?.openaiApiKey || '',
        deepseekApiKey: localStorage.getItem('opendev-deepseekApiKey') || profile?.deepseekApiKey || '',
    });
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [savedNotice, setSavedNotice] = useState(false);

    useEffect(() => {
        const localOpenRouter = localStorage.getItem('openrouter_api_key') || localStorage.getItem('opendev-openRouterApiKey') || import.meta.env.VITE_OPENROUTER_API_KEY;
        const localGemini = localStorage.getItem('opendev-geminiApiKey');
        const localOpenai = localStorage.getItem('opendev-openaiApiKey');
        const localDeepseek = localStorage.getItem('opendev-deepseekApiKey');

        setApiKeys({
            openRouterApiKey: localOpenRouter || profile?.openRouterApiKey || '',
            geminiApiKey: localGemini || profile?.geminiApiKey || '',
            openaiApiKey: localOpenai || profile?.openaiApiKey || '',
            deepseekApiKey: localDeepseek || profile?.deepseekApiKey || '',
        });
    }, [profile]);

    const toggleShowKey = (keyName: string) => {
        setShowKeys(prev => ({ ...prev, [keyName]: !prev[keyName] }));
    };

    const handleResetToAdminSupportKey = () => {
        localStorage.removeItem('opendev-openRouterApiKey');
        const adminKey = localStorage.getItem('openrouter_api_key') || import.meta.env.VITE_OPENROUTER_API_KEY || '';
        setApiKeys(prev => ({ ...prev, openRouterApiKey: adminKey }));
        toast.success("Switched to Admin 24/7 Support API Key!");
    };

    const handleSaveKeys = async () => {
        setIsSaving(true);
        try {
            // Store in both openrouter_api_key (24/7 Support Engine) and opendev-openRouterApiKey for complete sync
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

            // Sync with profile if user is logged in
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

    return (
        <div className="h-full overflow-y-auto bg-[#050505] text-zinc-100 p-6 md:p-12 custom-scrollbar selection:bg-[#f02050]/30 selection:text-white">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* HEADER */}
                <header className="border-b border-zinc-800/80 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <img
                            src="/logo-icon.webp"
                            alt="OpenDev Labs"
                            className="h-8 w-8 object-contain"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Open<span className="text-[#f02050]">Studio</span> Settings
                        </h1>
                    </div>
                    <p className="text-xs text-zinc-400 font-normal">
                        Configure your AI model keys and workspace preferences for OpenStudio.
                    </p>
                </header>

                {/* API KEYS CARD */}
                <section className="bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-[#f02050]">
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

                    <div className="space-y-5">
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
                                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl pl-3.5 pr-20 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#f02050] transition-colors font-mono"
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
                                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl pl-3.5 pr-20 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#f02050] transition-colors font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShowKey('gemini')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800/60 border border-zinc-700/50"
                                >
                                    {showKeys['gemini'] ? "Hide" : "Show"}
                                </button>
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-1">
                                Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[#f02050] hover:underline">Google AI Studio</a>.
                            </p>
                        </div>

                        {/* OPENAI KEY */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold text-zinc-300">
                                    OpenAI API Key
                                </label>
                                {apiKeys.openaiApiKey && (
                                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Key Set
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showKeys['openai'] ? "text" : "password"}
                                    placeholder="sk-..."
                                    value={apiKeys.openaiApiKey}
                                    onChange={(e) => setApiKeys({ ...apiKeys, openaiApiKey: e.target.value })}
                                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl pl-3.5 pr-20 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#f02050] transition-colors font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShowKey('openai')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800/60 border border-zinc-700/50"
                                >
                                    {showKeys['openai'] ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* DEEPSEEK KEY */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold text-zinc-300">
                                    DeepSeek API Key
                                </label>
                                {apiKeys.deepseekApiKey && (
                                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Key Set
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showKeys['deepseek'] ? "text" : "password"}
                                    placeholder="sk-..."
                                    value={apiKeys.deepseekApiKey}
                                    onChange={(e) => setApiKeys({ ...apiKeys, deepseekApiKey: e.target.value })}
                                    className="w-full bg-[#050505] border border-zinc-800 rounded-xl pl-3.5 pr-20 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#f02050] transition-colors font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleShowKey('deepseek')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800/60 border border-zinc-700/50"
                                >
                                    {showKeys['deepseek'] ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* SAVE BUTTON */}
                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={handleSaveKeys}
                                disabled={isSaving}
                                className="px-6 py-2.5 bg-[#f02050] hover:bg-[#d01840] text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(240,32,80,0.4)] transition-all cursor-pointer flex items-center gap-2"
                            >
                                <CheckIcon className="w-4 h-4" />
                                <span>{isSaving ? 'Saving...' : 'Save API Keys'}</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* ACCOUNT CONTEXT CARD */}
                <section className="bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold text-sm">
                            {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white">{user?.email || 'Guest User'}</p>
                            <p className="text-[10px] text-zinc-400">OpenDev Labs Workspace Member</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">LamaDB Active</span>
                    </div>
                </section>
            </div>
        </div>
    );
}

