import { Mail, Instagram } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Contact() {
    return (
        <section className="min-h-[80vh] flex items-center justify-center p-4 bg-background">
            <div className="max-w-2xl w-full">
                <h1 className="text-4xl font-bold mb-8 tracking-tight text-foreground text-center">Contact Us</h1>
                <div className="space-y-6">
                    <Card className="hover:border-primary/50 transition-colors">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Mail className="text-primary w-6 h-6" />
                            <CardTitle>Email Support</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">For general inquiries and enterprise support.</p>
                            <a href="mailto:opendev.help@gmail.com" className="text-foreground font-medium hover:text-primary transition-colors hover:underline underline-offset-4">opendev.help@gmail.com</a>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="hover:border-primary/50 transition-colors">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Instagram className="text-primary w-6 h-6" />
                                <CardTitle>Office</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <a href="https://instagram.com/opendev.labs" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors block">@opendev.labs</a>
                            </CardContent>
                        </Card>
                        <Card className="hover:border-primary/50 transition-colors">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Instagram className="text-primary w-6 h-6" />
                                <CardTitle>Founder</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <a href="https://instagram.com/iamyash.io" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors block">@iamyash.io</a>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
