import React, { useState, useEffect } from 'react';
import { Terminal, Database, Cpu, Zap, Box, Code, Activity, Users, Shield, ShieldCheck, Github, MessageSquare, Heart, Share2, MoreHorizontal, User as UserIcon, Briefcase, Globe, TrendingUp, Sparkles, Plus, Award, Image as ImageIcon, MapPin, Calendar, Check, AlertCircle, Search, Filter, ArrowRight, Crown, Lock, Unlock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/shadcn/button';
import { useAuth } from '../features/void/hooks/useAuth';
import { LamaDB } from '../lib/lamaDB';
import { Textarea } from '../components/ui/shadcn/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/shadcn/dialog';

import { ProjectCard } from '../features/hub/components/ProjectCard';
import { MessagingLayer } from '../features/hub/components/MessagingLayer';
import { HubService, ProjectMetadata } from '../services/hubService';
import { AgentService } from '../services/agentService';
import { SampleDataService } from '../services/sampleData';
import { UserProfile } from '../features/void/types';

export default function OpenHub() {
    const { user, profile, isLoading, updateProfile } = useAuth();
    const navigate = useNavigate();
    
    // Core Navigation & Feed State
    const [activeFeed, setActiveFeed] = useState('all');
    const [posts, setPosts] = useState<any[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
    const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
    
    // AI Friends & DMs Workspace Lifted State
    const [customAgents, setCustomAgents] = useState<any[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [newAgentName, setNewAgentName] = useState('');
    const [newAgentRole, setNewAgentRole] = useState('');
    const [newAgentPersonality, setNewAgentPersonality] = useState('');
    const [newAgentAvatarSeed, setNewAgentAvatarSeed] = useState('');
    const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
    const [isCreatingAgent, setIsCreatingAgent] = useState(false);

    // Sandbox Layout Viewport Preview
    const [previewProject, setPreviewProject] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Freemium Rate Limiting
    const FREE_PROMPT_LIMIT = 6;
    const promptCount = profile?.promptCount ?? 0;
    const isPremium = profile?.subscriptionStatus === 'premium';
    const isAtLimit = !isPremium && promptCount >= FREE_PROMPT_LIMIT;
    const remainingPrompts = Math.max(0, FREE_PROMPT_LIMIT - promptCount);

    const mockAgents = [
        {
            id: 'tars-01',
            name: 'TARS_MOD_01',
            status: 'awake',
            personality: 'You are TARS_MOD_01, a highly efficient, direct and slightly sarcastic AI companion. Keep answers helpful but dry.'
        },
        {
            id: 'lama-70b',
            name: 'Lama_Oracle',
            status: 'awake',
            personality: 'You are Lama_Oracle, a wise, philosophical, and extremely supportive AI companion. Speak with developer warmth.'
        }
    ];

    // Onboarding redirection check
    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
        }
    }, [user, isLoading, navigate]);

    // DB Subscriptions
    useEffect(() => {
        if (!user) return;
        const userContext = { uid: 'global', email: 'global' };
        
        // Subscription to Feed posts
        const unsubscribeFeed = LamaDB.store.collection('open_hub_posts', userContext).subscribe((fetchedPosts) => {
            if (Array.isArray(fetchedPosts)) {
                setPosts(fetchedPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            }
        });

        // Subscription to Profiles
        const unsubscribeProfiles = LamaDB.store.collection('global_mesh_profiles', { uid: 'global', email: 'global' }).subscribe((allProfiles) => {
            if (Array.isArray(allProfiles)) {
                const filtered = allProfiles.filter(p => p.uid !== user.uid).slice(0, 5);
                setSuggestedUsers(filtered);
                if (allProfiles.length < 2) {
                    SampleDataService.synthesize(user);
                }
            }
        });

        // Subscription to DM messages
        const unsubscribeDMs = LamaDB.store.collection('mesh_messages_global_mesh', userContext).subscribe((data) => {
            if (Array.isArray(data)) {
                setMessages(data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
            }
        });

        // Subscription to custom agents
        const unsubscribeCustomAgents = LamaDB.store.collection('custom_agents', userContext).subscribe((data) => {
            if (Array.isArray(data)) {
                setCustomAgents(data.map(agent => ({
                    id: agent.id || agent.id_db || Math.random().toString(),
                    name: agent.name || 'AI Friend',
                    avatarUrl: agent.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.name}`,
                    status: agent.status || 'awake',
                    personality: agent.personality || '',
                    isCustom: true
                })));
            }
        });

        if (profile) {
            setFollowedUsers(new Set(profile.following || []));
        }

        return () => {
            unsubscribeFeed();
            unsubscribeProfiles();
            unsubscribeDMs();
            unsubscribeCustomAgents();
        };
    }, [user, profile?.id]);

    const handleCreatePost = async () => {
        if (!newPostContent.trim() || !user) return;
        setIsPosting(true);
        try {
            const userContext = { uid: 'global', email: 'global' };
            const tags = newPostContent.match(/#[a-z0-9]+/gi)?.map(t => t.slice(1)) || [];
            
            const postObj = {
                id: Math.random().toString(36).substr(2, 9),
                uid: user.uid,
                author: {
                    name: user.name,
                    handle: profile?.username || 'anonymous',
                    headline: profile?.headline || 'Developer',
                    avatarUrl: profile?.avatarUrl || null,
                    isAgent: profile?.isAgent || false
                },
                content: newPostContent,
                likes: 0,
                likedBy: [],
                comments: 0,
                shares: 0,
                timestamp: new Date().toISOString(),
                tags: tags
            };
            await LamaDB.store.collection('open_hub_posts', userContext).add(postObj);

            if (newPostContent.trim().startsWith('/ask')) {
                AgentService.handleAsk(newPostContent, user.name, postObj.id);
            }

            setPosts(prev => [postObj, ...prev]);
            setNewPostContent('');
        } catch (e) {
            console.error("Failed to create post:", e);
        } finally {
            setIsPosting(false);
        }
    };

    const handleCreateAgent = async () => {
        if (!newAgentName.trim() || !newAgentPersonality.trim() || !user) return;
        setIsCreatingAgent(true);
        try {
            const userContext = { uid: 'global', email: 'global' };
            const seed = newAgentAvatarSeed.trim() || newAgentName.trim();
            const newAgentObj = {
                id: 'custom_agent_' + Math.random().toString(36).substr(2, 9),
                uid: user.uid,
                name: newAgentName,
                avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`,
                status: 'awake',
                lastHeartbeat: new Date().toISOString(),
                wakeTime: '00:00',
                sleepTime: '23:59',
                timezone: 'Local',
                personality: `You are ${newAgentName}, a developer AI friend specializing as a ${newAgentRole || 'Software assistant'}. Custom instructions: ${newAgentPersonality}. Answer direct questions concisely, be friendly, and output code formatting.`,
                isCustom: true
            };
            
            await LamaDB.store.collection('custom_agents', userContext).add(newAgentObj);
            
            const postObj = {
                id: 'agent_announce_' + Math.random().toString(36).substr(2, 9),
                uid: user.uid,
                author: {
                    name: user.name,
                    handle: profile?.username || 'user',
                    headline: profile?.headline || 'Developer',
                    avatarUrl: profile?.avatarUrl || null,
                    isAgent: false
                },
                content: `I just created my new AI Developer Friend, **${newAgentName}** (${newAgentRole || 'AI assistant'})! Say hello to them in DMs! 🚀`,
                likes: 1,
                comments: 0,
                shares: 0,
                timestamp: new Date().toISOString(),
                tags: ["AI", "NewAgent"]
            };
            await LamaDB.store.collection('open_hub_posts', userContext).add(postObj);

            setNewAgentName('');
            setNewAgentRole('');
            setNewAgentPersonality('');
            setNewAgentAvatarSeed('');
            setIsAddAgentOpen(false);
        } catch (e) {
            console.error("Failed to create custom agent:", e);
        } finally {
            setIsCreatingAgent(false);
        }
    };

    const handleSendDM = async () => {
        if (!chatInput.trim() || !selectedAgent || !user) return;
        // Check freemium rate limit
        if (isAtLimit) return;
        const text = chatInput.trim();
        setChatInput('');

        const userContext = { uid: 'global', email: 'global' };
        const msgObj = {
            id: Math.random().toString(),
            senderId: user.uid,
            senderName: user.name,
            senderAvatar: profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`,
            isAgent: false,
            receiverId: selectedAgent.id,
            content: text,
            timestamp: new Date().toISOString(),
            status: 'sent'
        };
        await LamaDB.store.collection(`mesh_messages_global_mesh`, userContext).add(msgObj);

        // Increment prompt count (only for AI messages)
        const newCount = promptCount + 1;
        await updateProfile({ promptCount: newCount });
        
        const prevMessages = messages.filter(m => m.receiverId === selectedAgent.id || m.senderId === selectedAgent.id);
        AgentService.respondToDM(selectedAgent, text, 'global_mesh', user, prevMessages);
    };

    const handleUpgradeToPremium = async () => {
        await updateProfile({ subscriptionStatus: 'premium' });
    };

    if (isLoading) return null;

    return (
        <div className="h-screen w-screen bg-[#09090b] text-[#fafafa] flex flex-col overflow-hidden font-sans select-none pt-14">
            <div className="flex-1 flex flex-row min-h-0 w-full overflow-hidden">
                
                {/* 1. Left Sidebar Panel */}
                <div className="w-[260px] h-full flex flex-col shrink-0 bg-[#09090b] border-r border-[#1f1f23] select-none">
                    <div className="p-4 border-b border-[#1f1f23] flex items-center justify-between">
                        <div className="flex items-center gap-2.5 truncate">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-800 shrink-0">
                                <img src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="truncate">
                                <h4 className="text-xs font-bold text-white leading-tight truncate">{user?.name}</h4>
                                <p className="text-[10px] text-zinc-500 font-mono truncate">{profile?.username ? `@${profile.username}` : 'user'}</p>
                            </div>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-2" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-6">
                        <div>
                            <h5 className="px-3 mb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Console</h5>
                            <div className="space-y-1">
                                <button
                                    onClick={() => { setSelectedAgent(null); setActiveFeed('all'); }}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                        !selectedAgent && activeFeed === 'all' 
                                        ? 'bg-zinc-800/80 text-white font-semibold' 
                                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                                    }`}
                                >
                                    <Globe size={14} className={!selectedAgent && activeFeed === 'all' ? 'text-red-500' : 'text-zinc-500'} />
                                    <span>Global Feed</span>
                                </button>
                                <button
                                    onClick={() => { setSelectedAgent(null); setActiveFeed('trending'); }}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                        !selectedAgent && activeFeed === 'trending' 
                                        ? 'bg-zinc-800/80 text-white font-semibold' 
                                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                                    }`}
                                >
                                    <TrendingUp size={14} className={!selectedAgent && activeFeed === 'trending' ? 'text-red-500' : 'text-zinc-500'} />
                                    <span>Trending Posts</span>
                                </button>
                                <button
                                    onClick={() => { setSelectedAgent(null); setActiveFeed('projects'); }}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                        !selectedAgent && activeFeed === 'projects' 
                                        ? 'bg-zinc-800/80 text-white font-semibold' 
                                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                                    }`}
                                >
                                    <Box size={14} className={!selectedAgent && activeFeed === 'projects' ? 'text-red-500' : 'text-zinc-500'} />
                                    <span>Layout Blueprints</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between px-3 mb-2">
                                <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">AI Friends</h5>
                                <Dialog open={isAddAgentOpen} onOpenChange={setIsAddAgentOpen}>
                                    <DialogTrigger asChild>
                                        <button className="p-0.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-all cursor-pointer">
                                            <Plus size={12} />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-zinc-950 border-[#1f1f23] rounded-2xl max-w-sm p-6 shadow-2xl text-white">
                                        <DialogHeader className="border-b border-[#1f1f23] pb-3 mb-4">
                                            <DialogTitle className="text-sm font-bold uppercase tracking-widest text-white">Create AI Friend</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Name</label>
                                                <input 
                                                    value={newAgentName}
                                                    onChange={e => setNewAgentName(e.target.value)}
                                                    className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-500/50"
                                                    placeholder="e.g. Ada, DevMate"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Role / Specialty</label>
                                                <input 
                                                    value={newAgentRole}
                                                    onChange={e => setNewAgentRole(e.target.value)}
                                                    className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-500/50"
                                                    placeholder="e.g. UI Architect"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Personality Instructions</label>
                                                <textarea 
                                                    value={newAgentPersonality}
                                                    onChange={e => setNewAgentPersonality(e.target.value)}
                                                    className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-500/50 min-h-[80px]"
                                                    placeholder="e.g. Speak logically, help with Three.js..."
                                                />
                                            </div>
                                            <div className="pt-2 flex justify-end">
                                                <Button 
                                                    onClick={handleCreateAgent}
                                                    disabled={isCreatingAgent || !newAgentName || !newAgentPersonality}
                                                    className="bg-white text-black font-bold uppercase tracking-widest text-[9px] rounded-xl px-8 hover:bg-red-500 hover:text-white transition-all h-9 disabled:opacity-50"
                                                >
                                                    {isCreatingAgent ? 'Creating...' : 'Create Agent'}
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="space-y-1">
                                {[...mockAgents, ...customAgents].map(agent => (
                                    <button
                                        key={agent.id}
                                        onClick={() => { setSelectedAgent(agent); setPreviewProject(null); }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                            selectedAgent?.id === agent.id 
                                            ? 'bg-zinc-800/80 text-white font-semibold' 
                                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 truncate">
                                            <div className="relative shrink-0">
                                                <div className="w-6 h-6 rounded-md overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[8px] font-bold">
                                                    {agent.avatarUrl ? (
                                                        <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full object-cover shrink-0" />
                                                    ) : (
                                                        'AI'
                                                    )}
                                                </div>
                                                <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-[#09090b] ${
                                                    agent.status === 'thinking' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                                                }`} />
                                            </div>
                                            <span className="truncate">{agent.name}</span>
                                        </div>
                                        {agent.isCustom && (
                                            <span className="text-[7px] bg-red-500/10 border border-red-500/20 text-red-400 font-extrabold px-1.5 rounded-sm uppercase tracking-tighter shrink-0 ml-1">Friend</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Usage Quota & Upgrade Panel */}
                    <div className="p-3 border-t border-[#1f1f23] shrink-0">
                        {isPremium ? (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                                <Crown size={12} className="text-amber-400 shrink-0" />
                                <div>
                                    <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest leading-none">Premium</p>
                                    <p className="text-[8px] text-zinc-500 font-mono mt-0.5">Unlimited AI prompts</p>
                                </div>
                            </div>
                        ) : (
                            <div className="px-3 py-2.5 rounded-lg bg-zinc-950 border border-[#1f1f23] space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Zap size={10} className="text-red-500 shrink-0" />
                                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                                            AI Prompts
                                        </p>
                                    </div>
                                    <span className={`text-[9px] font-bold font-mono ${isAtLimit ? 'text-red-400' : 'text-zinc-500'}`}>
                                        {promptCount}/{FREE_PROMPT_LIMIT}
                                    </span>
                                </div>
                                {/* Progress bar */}
                                <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${isAtLimit ? 'bg-red-500' : 'bg-red-500'}`}
                                        style={{ width: `${Math.min(100, (promptCount / FREE_PROMPT_LIMIT) * 100)}%` }}
                                    />
                                </div>
                                <button
                                    onClick={handleUpgradeToPremium}
                                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-400 hover:bg-amber-500/15 hover:border-amber-500/30 transition-all uppercase tracking-wider cursor-pointer"
                                >
                                    <Crown size={10} />
                                    {isAtLimit ? 'Limit Reached — Upgrade' : 'Upgrade to Premium'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Middle Feed / DM Panel */}
                <div className="flex-1 h-full flex flex-col min-w-0 bg-[#09090b]">
                    <div className="h-14 border-b border-[#1f1f23] px-6 flex items-center justify-between shrink-0 bg-[#09090b]/40">
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-500 font-mono text-[10px] uppercase font-bold">&gt;&gt;&gt;</span>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                                {selectedAgent ? `direct messages // ${selectedAgent.name}` : `mesh console // ${activeFeed} feed`}
                            </span>
                        </div>
                        
                        {!selectedAgent && (
                            <div className="relative w-48">
                                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input 
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Filter feed..."
                                    className="w-full bg-zinc-950 border border-zinc-900 rounded-md py-1 pl-7 pr-3 text-[10px] text-white focus:outline-none focus:border-red-500/50 placeholder:text-zinc-600"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 min-h-0 relative bg-zinc-950/20">
                        {!selectedAgent ? (
                            <div className="max-w-2xl mx-auto space-y-6">
                                <Card className="bg-zinc-950 border border-[#1f1f23] p-4 rounded-xl relative shadow-md">
                                    <textarea 
                                        value={newPostContent}
                                        onChange={e => setNewPostContent(e.target.value)}
                                        className="w-full bg-transparent text-xs text-white placeholder:text-zinc-600 focus:outline-none min-h-[60px] resize-none font-medium"
                                        placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}? Use #tags or type /ask to prompt Aries agent...`}
                                    />
                                    <div className="flex justify-between items-center pt-3 border-t border-[#1f1f23] mt-2">
                                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Handshake Ready</span>
                                        <Button 
                                            onClick={handleCreatePost}
                                            disabled={isPosting || !newPostContent.trim()}
                                            className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider h-8 rounded px-5 disabled:opacity-50"
                                        >
                                            {isPosting ? 'Posting...' : 'Broadcast'}
                                        </Button>
                                    </div>
                                </Card>

                                <div className="space-y-4">
                                    {posts.filter(p => {
                                        const matchesSearch = p.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                            p.author.name.toLowerCase().includes(searchQuery.toLowerCase());
                                        if (activeFeed === 'all') return matchesSearch;
                                        if (activeFeed === 'trending') return (p.likes || 0) >= 1 && matchesSearch;
                                        if (activeFeed === 'projects') return p.attachedProject && matchesSearch;
                                        return p.tags?.some((t: string) => t.toLowerCase() === activeFeed.toLowerCase()) && matchesSearch;
                                    }).length === 0 ? (
                                        <div className="py-20 text-center opacity-30 italic text-xs font-bold uppercase tracking-widest">
                                            Silence on the feed. Start broadcasting.
                                        </div>
                                    ) : (
                                        posts.filter(p => {
                                            const matchesSearch = p.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                p.author.name.toLowerCase().includes(searchQuery.toLowerCase());
                                            if (activeFeed === 'all') return matchesSearch;
                                            if (activeFeed === 'trending') return (p.likes || 0) >= 1 && matchesSearch;
                                            if (activeFeed === 'projects') return p.attachedProject && matchesSearch;
                                            return p.tags?.some((t: string) => t.toLowerCase() === activeFeed.toLowerCase()) && matchesSearch;
                                        }).map(post => (
                                            <Card key={post.id || post.id_db} className="bg-zinc-950/40 border border-[#1f1f23] p-5 rounded-xl space-y-4 hover:border-zinc-800 transition-colors shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-850">
                                                            <img src={post.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.name}`} alt="Author" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-1">
                                                                <h5 className="font-bold text-xs text-white leading-tight">{post.author.name}</h5>
                                                                {post.author.isAgent && (
                                                                    <span className="text-[6px] bg-purple-500/10 border border-purple-500/20 text-purple-400 font-extrabold px-1 rounded-sm uppercase tracking-tighter">AI</span>
                                                                )}
                                                            </div>
                                                            <p className="text-[9px] text-zinc-500 font-mono">@{post.author.handle || 'user'}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[8px] text-zinc-600 font-mono">{new Date(post.timestamp).toLocaleDateString()}</span>
                                                </div>

                                                <p className="text-xs text-zinc-300 leading-relaxed font-medium whitespace-pre-wrap">{post.content}</p>

                                                {post.attachedProject && (
                                                    <div 
                                                        onClick={() => {
                                                            if (post.attachedProject.code) {
                                                                setPreviewProject(post.attachedProject);
                                                            }
                                                        }}
                                                        className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 group cursor-pointer hover:border-red-500/20 hover:bg-red-500/[0.01] transition-all flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-red-500/20 transition-colors">
                                                                <Code size={18} className="text-zinc-500 group-hover:text-red-500 transition-colors" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h6 className="font-bold text-xs text-white truncate">{post.attachedProject.title}</h6>
                                                                <p className="text-[9px] text-zinc-500 truncate max-w-xs">{post.attachedProject.description}</p>
                                                                {post.attachedProject.code && (
                                                                    <span className="text-[7px] text-red-500 font-bold uppercase tracking-widest block mt-1 animate-pulse">▶ Play Live Sandbox</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <ArrowRight size={14} className="text-zinc-700 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                                                    </div>
                                                )}
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col justify-between absolute inset-0 p-6 min-h-0 bg-dot-pattern bg-[#09090b]">
                                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                                    {messages.filter(m => m.receiverId === selectedAgent.id || m.senderId === selectedAgent.id).length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center opacity-30 italic text-center">
                                            <MessageSquare size={24} className="mb-2 text-zinc-500" />
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em]">handshake started. say hello to {selectedAgent.name}.</p>
                                        </div>
                                    ) : (
                                        messages.filter(m => m.receiverId === selectedAgent.id || m.senderId === selectedAgent.id).map((msg, i) => (
                                            <div key={msg.id || i} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[75%] space-y-1 flex flex-col ${msg.senderId === user?.uid ? 'items-end' : 'items-start'}`}>
                                                    <span className="text-[8px] text-zinc-600 font-mono uppercase tracking-widest px-1">{msg.senderName}</span>
                                                    <div className={`px-4 py-2 rounded-xl text-xs leading-relaxed ${
                                                        msg.senderId === user?.uid 
                                                        ? 'bg-zinc-800 text-white rounded-tr-none' 
                                                        : 'bg-zinc-900 border border-zinc-850 text-zinc-300 rounded-tl-none'
                                                    }`}>
                                                        {msg.content}
                                                    </div>
                                                    <span className="text-[7px] text-zinc-550 font-mono px-1">
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="pt-3 border-t border-[#1f1f23] shrink-0">
                                    {isAtLimit ? (
                                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center space-y-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <Lock size={14} className="text-amber-400" />
                                                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Free Tier Limit Reached</span>
                                            </div>
                                            <p className="text-[10px] text-zinc-400 leading-relaxed">
                                                You've used all <strong className="text-white">{FREE_PROMPT_LIMIT}</strong> free AI prompts. Upgrade to Premium for unlimited conversations with your AI friends.
                                            </p>
                                            <button
                                                onClick={handleUpgradeToPremium}
                                                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                                            >
                                                <Crown size={12} />
                                                Upgrade to Premium — Free for Now
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 bg-zinc-950 border border-zinc-900 rounded-xl p-1.5 focus-within:border-zinc-850">
                                            <input 
                                                value={chatInput}
                                                onChange={e => setChatInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleSendDM()}
                                                placeholder={`Send DM to ${selectedAgent.name}...`}
                                                className="grow bg-transparent text-xs text-white px-3 focus:outline-none placeholder:text-zinc-700 font-medium"
                                            />
                                            <Button 
                                                onClick={handleSendDM}
                                                disabled={!chatInput.trim()}
                                                className="h-8 rounded bg-white text-black hover:bg-zinc-200 font-bold text-[10px] uppercase tracking-wider px-4 shrink-0"
                                            >
                                                Send
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Right Dashboard Panel */}
                <div className="w-[420px] h-full flex flex-col shrink-0 bg-[#09090b] border-l border-[#1f1f23] select-none">
                    <div className="h-14 border-b border-[#1f1f23] px-6 flex items-center justify-between shrink-0 bg-[#09090b]/40">
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-500 font-mono text-[10px] uppercase font-bold">&gt;&gt;&gt;</span>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                                {previewProject ? 'live playground' : 'workspace info'}
                            </span>
                        </div>
                        {previewProject && (
                            <button 
                                onClick={() => setPreviewProject(null)}
                                className="text-[9px] bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 transition-colors uppercase font-bold tracking-widest cursor-pointer"
                            >
                                Close
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-zinc-950/10">
                        {previewProject ? (
                            <div className="h-full flex flex-col space-y-4">
                                <div className="grow bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden relative shadow-inner">
                                    <iframe 
                                        srcDoc={`
                                            <!DOCTYPE html>
                                            <html lang="en">
                                            <head>
                                                <meta charset="utf-8">
                                                <meta name="viewport" content="width=device-width, initial-scale=1.5">
                                                <script src="https://cdn.tailwindcss.com"></script>
                                                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
                                                <style>
                                                    body { font-family: 'Inter', sans-serif; background-color: #09090b; color: #fafafa; padding: 16px; }
                                                    ::-webkit-scrollbar { width: 6px; height: 6px; }
                                                    ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
                                                </style>
                                            </head>
                                            <body>
                                                ${previewProject.code}
                                            </body>
                                            </html>
                                        `}
                                        className="w-full h-full border-none bg-black"
                                        title="Project Live Preview"
                                        sandbox="allow-scripts"
                                    />
                                </div>
                                <div className="p-4 bg-zinc-950 border border-[#1f1f23] rounded-xl shadow-sm">
                                    <h6 className="text-xs font-bold text-white mb-1.5 uppercase tracking-wide">{previewProject.title}</h6>
                                    <p className="text-[10px] text-zinc-500 leading-normal font-medium">{previewProject.description}</p>
                                </div>
                            </div>
                        ) : (
                            selectedAgent ? (
                                <div className="space-y-6">
                                    <div className="text-center p-6 bg-zinc-950 border border-zinc-900 rounded-2xl shadow-sm">
                                        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                                            {selectedAgent.avatarUrl ? (
                                                <img src={selectedAgent.avatarUrl} alt={selectedAgent.name} className="w-full h-full object-cover" />
                                            ) : (
                                                'AI'
                                            )}
                                        </div>
                                        <h4 className="font-bold text-sm text-white uppercase">{selectedAgent.name}</h4>
                                        <span className="inline-block text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Sovereign AI Node</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="border border-zinc-900 p-4 rounded-xl bg-zinc-950/20">
                                            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Status</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                                selectedAgent.status === 'thinking' ? 'text-amber-500 animate-pulse' : 'text-emerald-500'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${selectedAgent.status === 'thinking' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                                {selectedAgent.status}
                                            </span>
                                        </div>
                                        <div className="border border-zinc-900 p-4 rounded-xl bg-zinc-950/20">
                                            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">System instructions</span>
                                            <p className="text-[10px] text-zinc-400 font-mono leading-relaxed max-h-[220px] overflow-y-auto custom-scrollbar">{selectedAgent.personality}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {suggestedUsers.length > 0 && (
                                        <div>
                                            <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Suggested Connections</h5>
                                            <div className="space-y-2">
                                                {suggestedUsers.map(u => (
                                                    <div key={u.id} className="flex items-center justify-between p-2.5 bg-zinc-950/40 border border-[#1f1f23] rounded-xl hover:border-zinc-800 transition-colors">
                                                        <div className="flex items-center gap-2 truncate min-w-0">
                                                            <div className="w-7 h-7 rounded-full overflow-hidden border border-zinc-850 shrink-0">
                                                                <img src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt={u.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="truncate min-w-0">
                                                                <h6 className="text-[11px] font-bold text-white leading-tight truncate">{u.name}</h6>
                                                                <p className="text-[8px] text-zinc-500 font-mono truncate">@{u.username || 'user'}</p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                const updated = new Set(followedUsers);
                                                                if (updated.has(u.uid)) updated.delete(u.uid);
                                                                else updated.add(u.uid);
                                                                setFollowedUsers(updated);
                                                                updateProfile({ following: Array.from(updated) });
                                                            }}
                                                            className="h-6 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-[8px] uppercase tracking-wider font-extrabold px-2.5 shrink-0"
                                                        >
                                                            {followedUsers.has(u.uid) ? 'Connected' : 'Connect'}
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Trending Blueprints</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {['react', 'threejs', 'tailwind', 'nextjs', 'dashboard', 'canvas'].map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => { setSelectedAgent(null); setActiveFeed(tag); }}
                                                    className={`px-3 py-1 rounded bg-zinc-950 border text-[9px] font-bold uppercase tracking-wider transition-colors ${
                                                        activeFeed === tag 
                                                        ? 'border-red-500/30 text-red-400' 
                                                        : 'border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800'
                                                    }`}
                                                >
                                                    #{tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
