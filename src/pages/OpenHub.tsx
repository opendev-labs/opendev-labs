import React, { useState, useEffect } from 'react';
import { Terminal, Database, Cpu, Zap, Box, Code, Activity, Users, Shield, ShieldCheck, Github, MessageSquare, Heart, Share2, MoreHorizontal, User as UserIcon, Briefcase, Globe, TrendingUp, Sparkles, Plus, Award, Image as ImageIcon, MapPin, Calendar, Check, AlertCircle, Search, Filter, ArrowRight, Crown, Lock, Unlock, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../features/void/hooks/useAuth';
import { LamaDB } from '../lib/lamaDB';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { ProjectCard } from '../features/hub/components/ProjectCard';
import { HubService, ProjectMetadata } from '../services/hubService';
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
    
    // Sandbox Layout Viewport Preview
    const [previewProject, setPreviewProject] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

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

        if (profile) {
            setFollowedUsers(new Set(profile.following || []));
        }

        return () => {
            unsubscribeFeed();
            unsubscribeProfiles();
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

            setPosts(prev => [postObj, ...prev]);
            setNewPostContent('');
        } catch (e) {
            console.error("Failed to create post:", e);
        } finally {
            setIsPosting(false);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!user) return;
        try {
            const userContext = { uid: 'global', email: 'global' };
            await LamaDB.store.collection('open_hub_posts', userContext).delete(postId);
            setPosts(prev => prev.filter(p => p.id !== postId && p.id_db !== postId));
        } catch (e) {
            console.error("Failed to delete post:", e);
        }
    };

    if (isLoading) return null;

    return (
        <div className="h-[calc(100vh-3.5rem)] w-full bg-background text-foreground flex flex-col overflow-hidden font-sans select-none">
            <div className="flex-1 flex flex-row min-h-0 w-full overflow-hidden">
                
                {/* 1. Left Sidebar Panel */}
                <div className="w-[260px] h-full flex flex-col shrink-0 bg-card border-r border-border select-none">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-2.5 truncate">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-border shrink-0">
                                <img src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="truncate">
                                <h4 className="text-xs font-bold leading-tight truncate">{user?.name}</h4>
                                <p className="text-[10px] text-muted-foreground font-mono truncate">{profile?.username ? `@${profile.username}` : 'user'}</p>
                            </div>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-2" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-6">
                        <div>
                            <h5 className="px-3 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Console</h5>
                            <div className="space-y-1">
                                <Button
                                    variant={activeFeed === 'all' ? 'secondary' : 'ghost'}
                                    className="w-full justify-start gap-2.5 px-3 py-2 h-auto text-xs font-medium"
                                    onClick={() => setActiveFeed('all')}
                                >
                                    <Globe size={14} className={activeFeed === 'all' ? 'text-primary' : 'text-muted-foreground'} />
                                    Global Feed
                                </Button>
                                <Button
                                    variant={activeFeed === 'trending' ? 'secondary' : 'ghost'}
                                    className="w-full justify-start gap-2.5 px-3 py-2 h-auto text-xs font-medium"
                                    onClick={() => setActiveFeed('trending')}
                                >
                                    <TrendingUp size={14} className={activeFeed === 'trending' ? 'text-primary' : 'text-muted-foreground'} />
                                    Trending Posts
                                </Button>
                                <Button
                                    variant={activeFeed === 'projects' ? 'secondary' : 'ghost'}
                                    className="w-full justify-start gap-2.5 px-3 py-2 h-auto text-xs font-medium"
                                    onClick={() => setActiveFeed('projects')}
                                >
                                    <Box size={14} className={activeFeed === 'projects' ? 'text-primary' : 'text-muted-foreground'} />
                                    Layout Blueprints
                                </Button>
                                <Separator className="my-2" />
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2.5 px-3 py-2 h-auto text-xs font-medium text-muted-foreground hover:text-foreground"
                                    asChild
                                >
                                    <Link to="/void">
                                        <Activity size={14} />
                                        My Deployments (Void)
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Middle Feed Panel */}
                <div className="flex-1 h-full flex flex-col min-w-0 bg-background">
                    <div className="h-14 border-b border-border px-6 flex items-center justify-between shrink-0 bg-card/40">
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-mono text-[10px] uppercase font-bold">&gt;&gt;&gt;</span>
                            <span className="text-xs font-bold uppercase tracking-wider">
                                mesh console // {activeFeed} feed
                            </span>
                        </div>
                        
                        <div className="relative w-48">
                            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Filter feed..."
                                className="w-full h-8 pl-7 pr-3 text-xs bg-background"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 min-h-0 relative bg-muted/20">
                        <div className="max-w-2xl mx-auto space-y-6">
                            <Card className="p-4 shadow-sm">
                                <Textarea 
                                    value={newPostContent}
                                    onChange={e => setNewPostContent(e.target.value)}
                                    className="w-full bg-transparent border-none text-xs placeholder:text-muted-foreground focus-visible:ring-0 min-h-[60px] resize-none font-medium px-0"
                                    placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}? Use #tags...`}
                                />
                                <div className="flex justify-between items-center pt-3 border-t border-border mt-2">
                                    <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest">Handshake Ready</span>
                                    <Button 
                                        onClick={handleCreatePost}
                                        disabled={isPosting || !newPostContent.trim()}
                                        size="sm"
                                        className="h-8 text-[10px] font-bold uppercase tracking-wider"
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
                                    <div className="py-20 text-center opacity-50 italic text-xs font-bold uppercase tracking-widest">
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
                                        <Card key={post.id || post.id_db} className="p-5 space-y-4 shadow-sm hover:border-accent transition-colors">
                                            <div className="flex items-center justify-between">
                                                <Link to={`/user/${post.author.handle}`} className="flex items-center gap-3 group/author">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-border group-hover/author:border-accent transition-colors">
                                                        <img src={post.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.name}`} alt="Author" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1">
                                                            <h5 className="font-bold text-xs leading-tight group-hover/author:text-primary transition-colors">{post.author.name}</h5>
                                                            {post.author.isAgent && (
                                                                <Badge variant="secondary" className="text-[8px] h-4 px-1 py-0 font-extrabold uppercase tracking-tighter">AI</Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-[9px] text-muted-foreground font-mono">@{post.author.handle || 'user'}</p>
                                                    </div>
                                                </Link>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[8px] text-muted-foreground font-mono">{new Date(post.timestamp).toLocaleDateString()}</span>
                                                    {user?.uid === post.uid && (
                                                        <Button 
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeletePost(post.id || post.id_db)}
                                                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                            title="Delete post"
                                                        >
                                                            <Trash2 size={12} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-xs leading-relaxed font-medium whitespace-pre-wrap">{post.content}</p>

                                            {post.attachedProject && (
                                                <Card 
                                                    onClick={() => {
                                                        if (post.attachedProject.code) {
                                                            setPreviewProject(post.attachedProject);
                                                        }
                                                    }}
                                                    className="p-4 group cursor-pointer hover:border-primary/20 hover:bg-primary/5 transition-all flex items-center justify-between shadow-none"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 group-hover:border-primary/20 transition-colors">
                                                            <Code size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h6 className="font-bold text-xs truncate">{post.attachedProject.title}</h6>
                                                            <p className="text-[9px] text-muted-foreground truncate max-w-xs">{post.attachedProject.description}</p>
                                                            {post.attachedProject.code && (
                                                                <span className="text-[7px] text-primary font-bold uppercase tracking-widest block mt-1 animate-pulse">▶ Play Live Sandbox</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                                                </Card>
                                            )}
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Right Dashboard Panel */}
                <div className="w-[420px] h-full flex flex-col shrink-0 bg-card border-l border-border select-none">
                    <div className="h-14 border-b border-border px-6 flex items-center justify-between shrink-0 bg-card/40">
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-mono text-[10px] uppercase font-bold">&gt;&gt;&gt;</span>
                            <span className="text-xs font-bold uppercase tracking-wider">
                                {previewProject ? 'live playground' : 'workspace info'}
                            </span>
                        </div>
                        {previewProject && (
                            <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => setPreviewProject(null)}
                                className="h-6 text-[9px] uppercase font-bold tracking-widest cursor-pointer"
                            >
                                Close
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-muted/10">
                        {previewProject ? (
                            <div className="h-full flex flex-col space-y-4">
                                <div className="grow bg-background border border-border rounded-xl overflow-hidden relative shadow-inner">
                                    <iframe 
                                        srcDoc={`
                                            <!DOCTYPE html>
                                            <html lang="en" class="dark">
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
                                        className="w-full h-full border-none bg-background"
                                        title="Project Live Preview"
                                        sandbox="allow-scripts"
                                    />
                                </div>
                                <Card className="p-4 shadow-sm">
                                    <h6 className="text-xs font-bold mb-1.5 uppercase tracking-wide">{previewProject.title}</h6>
                                    <p className="text-[10px] text-muted-foreground leading-normal font-medium">{previewProject.description}</p>
                                </Card>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {suggestedUsers.length > 0 && (
                                    <div>
                                        <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Suggested Connections</h5>
                                        <div className="space-y-2">
                                            {suggestedUsers.map(u => (
                                                <Card key={u.id} className="flex items-center justify-between p-2.5 shadow-sm hover:border-accent transition-colors">
                                                    <div className="flex items-center gap-2 truncate min-w-0">
                                                        <div className="w-7 h-7 rounded-full overflow-hidden border border-border shrink-0">
                                                            <img src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt={u.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="truncate min-w-0">
                                                            <h6 className="text-[11px] font-bold leading-tight truncate">{u.name}</h6>
                                                            <p className="text-[8px] text-muted-foreground font-mono truncate">@{u.username || 'user'}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant={followedUsers.has(u.uid) ? "secondary" : "default"}
                                                        size="sm"
                                                        onClick={() => {
                                                            const updated = new Set(followedUsers);
                                                            if (updated.has(u.uid)) updated.delete(u.uid);
                                                            else updated.add(u.uid);
                                                            setFollowedUsers(updated);
                                                            updateProfile({ following: Array.from(updated) });
                                                        }}
                                                        className="h-6 text-[8px] uppercase tracking-wider font-extrabold px-2.5 shrink-0"
                                                    >
                                                        {followedUsers.has(u.uid) ? 'Connected' : 'Connect'}
                                                    </Button>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Trending Blueprints</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {['react', 'threejs', 'tailwind', 'nextjs', 'dashboard', 'canvas'].map(tag => (
                                            <Badge
                                                key={tag}
                                                variant={activeFeed === tag ? "default" : "outline"}
                                                onClick={() => { setActiveFeed(tag); }}
                                                className={`cursor-pointer px-3 py-1 text-[9px] font-bold uppercase tracking-wider transition-colors ${
                                                    activeFeed === tag 
                                                    ? 'bg-primary text-primary-foreground' 
                                                    : 'text-muted-foreground hover:text-foreground hover:border-accent'
                                                }`}
                                            >
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
