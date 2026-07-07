import React, { useState, useEffect } from "react";
import { UserProfile } from "../features/void/types";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, Github, Linkedin, Twitter, Image as ImageIcon, MapPin, Loader2, Save } from "lucide-react";
import { useAuth } from "../features/void/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProfileSettings() {
    const { user, profile, updateProfile, isLoading } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        headline: "",
        bio: "",
        location: "",
        website: "",
        github: "",
        linkedin: "",
        twitter: "",
        avatarUrl: "",
        bannerUrl: ""
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
        } else if (profile) {
            setFormData({
                username: profile.username || "",
                headline: profile.headline || "",
                bio: profile.bio || "",
                location: profile.location || "",
                website: profile.website || "",
                github: profile.github || "",
                linkedin: profile.linkedin || "",
                twitter: profile.twitter || "",
                avatarUrl: profile.avatarUrl || "",
                bannerUrl: profile.bannerUrl || ""
            });
        }
    }, [user, profile, isLoading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateProfile(formData);
            navigate(`/user/${profile?.username}`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return null;

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div className="space-y-1">
                    <Button variant="ghost" className="pl-0 -ml-4 mb-2 text-muted-foreground hover:text-foreground" asChild>
                        <Link to={`/user/${profile?.username}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Profile
                        </Link>
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your profile identity and public information.
                    </p>
                </div>
            </div>

            <Separator className="my-6" />

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-8">
                    {/* Visual Identity Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Visual Identity</CardTitle>
                            <CardDescription>
                                Update your avatar and profile banner.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Profile Image URL</Label>
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-muted shrink-0">
                                        <img src={formData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="Avatar" className="h-full w-full object-cover" />
                                    </div>
                                    <Input
                                        placeholder="https://..."
                                        value={formData.avatarUrl}
                                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                                        className="max-w-md"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Banner Image URL</Label>
                                <div className="h-32 w-full overflow-hidden rounded-md border border-border bg-muted relative mb-3">
                                    {formData.bannerUrl ? (
                                        <img src={formData.bannerUrl} alt="Banner" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                            <ImageIcon className="h-8 w-8 opacity-50" />
                                        </div>
                                    )}
                                </div>
                                <Input
                                    placeholder="https://..."
                                    value={formData.bannerUrl}
                                    onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                                    className="max-w-md"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Professional Details Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Professional Details</CardTitle>
                            <CardDescription>
                                Information about your role and location.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2 max-w-md">
                                <Label>Username</Label>
                                <Input
                                    value={formData.username}
                                    disabled
                                    className="bg-muted text-muted-foreground"
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    This is your public display name. It can be your real name or a pseudonym.
                                </p>
                            </div>

                            <div className="space-y-2 max-w-md">
                                <Label>Headline</Label>
                                <Input
                                    placeholder="Full Stack Engineer"
                                    value={formData.headline}
                                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Bio</Label>
                                <Textarea
                                    placeholder="Tell us a little bit about yourself"
                                    className="min-h-[100px] resize-none"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    You can <span>@mention</span> other users and organizations.
                                </p>
                            </div>

                            <div className="space-y-2 max-w-md">
                                <Label className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Location
                                </Label>
                                <Input
                                    placeholder="San Francisco, CA"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Digital Presence Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Links</CardTitle>
                            <CardDescription>
                                Add links to your website, blog, or social media profiles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Globe className="h-4 w-4" /> Website</Label>
                                    <Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</Label>
                                    <Input value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Linkedin className="h-4 w-4" /> LinkedIn</Label>
                                    <Input value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Twitter className="h-4 w-4" /> Twitter / X</Label>
                                    <Input value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="w-full lg:w-80">
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle>Save Changes</CardTitle>
                            <CardDescription>
                                Your updates will be visible immediately.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="w-full"
                            >
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Profile
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(`/user/${profile?.username}`)}
                                className="w-full"
                            >
                                Cancel
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}
