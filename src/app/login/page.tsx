
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/FirebaseContext";
import { useToast } from "@/hooks/use-toast";
import { Gem, Loader2, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signUp, signIn, user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    if (user) {
        router.push('/');
    }

    const handleAuth = async (event: FormEvent, action: 'signIn' | 'signUp') => {
        event.preventDefault();
        setIsLoading(true);
        try {
            if (action === 'signUp') {
                await signUp(email, password);
                toast({
                    title: "Account Created",
                    description: "You have successfully signed up. Welcome!",
                });
            } else {
                await signIn(email, password);
                 toast({
                    title: "Signed In",
                    description: "Welcome back!",
                });
            }
            router.push('/');
        } catch (error: any) {
             toast({
                title: "Authentication Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-purple-100 p-4">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
            <Card className="shadow-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Gem className="w-12 h-12 text-accent" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Welcome Back</CardTitle>
                    <CardDescription>Log in to access your Cosmic Insights.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => handleAuth(e, 'signIn')} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email-login">Email</Label>
                            <Input id="email-login" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password-login">Password</Label>
                            <Input id="password-login" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}/>
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />} Log In
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="signup">
             <Card className="shadow-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Gem className="w-12 h-12 text-accent" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Create an Account</CardTitle>
                    <CardDescription>Join Cosmic Insights to save your history and unlock features.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => handleAuth(e, 'signUp')} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email-signup">Email</Label>
                            <Input id="email-signup" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password-signup">Password</Label>
                            <Input id="password-signup" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}/>
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />} Sign Up
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
