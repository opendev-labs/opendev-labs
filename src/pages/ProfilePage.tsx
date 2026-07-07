import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { User as UserIcon, Briefcase, Globe, Github, Twitter, Linkedin, Mail, Shield, Zap, Database, Terminal, Code, BookOpen, Plus, ExternalLink, Settings, Award, MapPin, Calendar, Link as LinkIcon, Users, Box, Heart, Sparkles } from "lucide-react";
import { useAuth } from "../features/void/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ProjectCard } from "../features/hub/components/ProjectCard";
import { LamaDB } from "../lib/lamaDB";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
    const { username } = useParams();
    const { user: currentUser, profile: currentProfile } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isOwnProfile = currentUser && (
        !username ||
        username === 'profile' ||
        username === currentProfile?.username
    );

    useEffect(() => {
        const fetchProfile = async () => {
            if (isOwnProfile && currentProfile) {
                setProfile(currentProfile);
                setIsLoading(false);
                return;
            }

            if (!username || username === 'profile') {
                if (!currentUser) {
                    setIsLoading(false);
                    return;
                }
                if (currentProfile) {
                    setProfile(currentProfile);
                    setIsLoading(false);
                    return;
                }
            }

            try {
                const userContext = { uid: 'global', email: 'global' };
                const profiles = await LamaDB.store.collection('profiles', userContext).get() as any[];
                const found = profiles.find(p => p.username === username);
                setProfile(found || null);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [username, currentProfile, isOwnProfile, currentUser]);

    if (isLoading) return null;

    if (!profile) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center h-full">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-8">
                    <Shield className="h-10 w-10 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-4">Profile Not Found.</h1>
                <p className="text-muted-foreground mb-8">The requested person has not joined the network yet.</p>
                <Link to="/open-hub">
                    <Button variant="outline">
                        Return to Hub
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full flex flex-col">
            {/* Header / Banner Section */}
            <div className="relative h-[25vh] md:h-[30vh] w-full bg-muted overflow-hidden">
                {profile.bannerUrl ? (
                    <img src={profile.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-muted-foreground/10" />
                )}
            </div>

            <main className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 relative -mt-16 sm:-mt-24 mb-16">
                {/* Profile Header Block */}
                <div className="flex flex-col sm:flex-row gap-6 items-end mb-8">
                    <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-background bg-muted overflow-hidden shrink-0 relative z-10">
                        <img src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} alt="Profile" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 pb-2 space-y-4 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{profile.username}</h1>
                                </div>
                                <p className="text-muted-foreground font-medium">@{profile.username}</p>
                            </div>

                            <div className="flex gap-2">
                                {isOwnProfile ? (
                                    <Link to="/settings/profile">
                                        <Button>
                                            <Settings className="mr-2 h-4 w-4" />
                                            Edit Profile
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Button>Connect</Button>
                                        <Button variant="outline" size="icon"><Mail className="h-4 w-4" /></Button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> <span>{profile.location || 'Remote / Earth'}</span></div>
                            <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> <span>Joined {profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : "Recently"}</span></div>
                            <div className="flex items-center gap-1.5"><LinkIcon className="h-4 w-4" /> <span>{profile.website || `opendev.io/${profile.username}`}</span></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Bio / About */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {profile.bio || "No biography provided yet."}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Professional Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Connections', val: '128', icon: Users },
                                { label: 'Projects', val: '12', icon: Code },
                                { label: 'Reputation', val: '4.2k', icon: Award },
                                { label: 'Pulse', val: '86', icon: Zap }
                            ].map((stat, i) => (
                                <Card key={i} className="flex flex-col items-center justify-center text-center p-6">
                                    <stat.icon className="h-6 w-6 text-muted-foreground mb-4" />
                                    <div className="text-2xl font-bold tracking-tight">{stat.val}</div>
                                    <div className="text-xs text-muted-foreground font-medium uppercase mt-1">{stat.label}</div>
                                </Card>
                            ))}
                        </div>

                        {/* Recent Projects */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold tracking-tight">Recent Projects</h2>
                                <Button variant="ghost" size="sm">View All</Button>
                            </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profile.projects && profile.projects.length > 0 ? (
                                    profile.projects.map((p: any, i: number) => (
                                        <ProjectCard key={i} metadata={p} isAgent={profile.isAgent} />
                                    ))
                                ) : (
                                    <Card className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-12 text-center shadow-none border-dashed bg-muted/50">
                                        <Box className="h-8 w-8 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground text-sm">No projects found.</p>
                                    </Card>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Skills & Expertise */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Expertise</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {['Software Architecture', 'Product Management', 'React', 'Node.js', 'PostgreSQL'].map(skill => (
                                        <div key={skill} className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Links</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { icon: Github, label: 'GitHub', val: `@${profile.github || profile.username}` },
                                    { icon: Twitter, label: 'Twitter', val: `@${profile.twitter || profile.username}` },
                                    { icon: Linkedin, label: 'LinkedIn', val: profile.linkedin || profile.username }
                                ].map((social, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <social.icon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">{social.label}</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">{social.val}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Suggestions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>People you may know</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { name: 'Morpheus', handle: 'morpheus', head: 'Lead Architect' },
                                    { name: 'Trinity', handle: 'trinity', head: 'Security Researcher' }
                                ].map((person, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`} alt="user" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium leading-none">{person.name}</div>
                                            <div className="text-xs text-muted-foreground mt-1">{person.head}</div>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
