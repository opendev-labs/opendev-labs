import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { GoogleIcon } from '../common/Icons';
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export const AuthPage: React.FC = () => {
    const { loginWithGoogle, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [authMethod, setAuthMethod] = useState<'none' | 'google' | 'email'>('none');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showEmailFields, setShowEmailFields] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isSignUp = location.pathname.includes('signup') || location.search.includes('mode=signup');

    useEffect(() => {
        if (isAuthenticated) {
            const destination = location.state?.from?.pathname || '/open-hub';
            navigate(destination, { replace: true });
        }
    }, [isAuthenticated, navigate, location.state]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setAuthMethod('google');
        setError('');
        try {
            await loginWithGoogle();
        } catch (err: any) {
            console.error("Google Auth Error:", err);
            if (err.code === 'auth/account-exists-with-different-credential') {
                setError("This email is already associated with a different provider. Please try signing in with GitHub or your original method.");
            } else {
                setError(err.message || "Authentication failed. Please try again.");
            }
            setAuthMethod('none');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailProtocol = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        // Simulated email flow
        setTimeout(() => {
            setIsLoading(false);
            setError("Email login is not yet available. Please use Google.");
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
            <div className="w-full max-w-md space-y-6">
                <Button variant="ghost" className="mb-4 pl-0 text-muted-foreground hover:text-foreground" asChild>
                    <Link to="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>

                <Card className="border-border">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            {isSignUp ? 'Create an account' : 'Welcome back'}
                        </CardTitle>
                        <CardDescription>
                            {isSignUp 
                                ? 'Enter your email below to create your account' 
                                : 'Choose a method to sign in to your account'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Button 
                                variant="outline" 
                                onClick={handleGoogleLogin} 
                                disabled={isLoading}
                                className="w-full h-11"
                            >
                                {isLoading && authMethod === 'google' ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <GoogleIcon className="mr-2 h-4 w-4" />
                                )}
                                Google
                            </Button>
                            
                            <Button
                                variant="outline"
                                className="w-full h-11"
                                onClick={() => setShowEmailFields(!showEmailFields)}
                                disabled={isLoading}
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Email
                            </Button>
                        </div>

                        {showEmailFields && (
                            <>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>
                                
                                <form onSubmit={handleEmailProtocol} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input 
                                            id="password" 
                                            type="password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading && authMethod === 'email' && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        {isSignUp ? 'Create Account' : 'Sign In'}
                                    </Button>
                                </form>
                            </>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <div className="text-center text-sm text-muted-foreground">
                            {isSignUp ? "Already have an account? " : "Don't have an account? "}
                            <Link 
                                to={isSignUp ? "/auth" : "/auth?mode=signup"} 
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                {isSignUp ? 'Sign in' : 'Sign up'}
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
