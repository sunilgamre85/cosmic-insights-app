
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    type Auth, 
    type User 
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

interface FirebaseContextType {
    app: FirebaseApp | null;
    auth: Auth | null;
    user: User | null;
    isLoading: boolean;
    signUp: (email: string, pass: string) => Promise<User>;
    signIn: (email: string, pass: string) => Promise<User>;
    signOutUser: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
    const [app, setApp] = useState<FirebaseApp | null>(null);
    const [auth, setAuth] = useState<Auth | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        try {
            const appInstance = initializeApp(firebaseConfig);
            const authInstance = getAuth(appInstance);
            setApp(appInstance);
            setAuth(authInstance);

            const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
                setUser(currentUser);
                setIsLoading(false);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Firebase initialization failed:", error);
            toast({
                title: "Firebase Error",
                description: "Could not connect to Firebase. Some features may not work.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    }, [toast]);

    const signUp = async (email: string, pass: string) => {
        if (!auth) throw new Error("Firebase Auth not initialized");
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        return userCredential.user;
    };

    const signIn = async (email: string, pass: string) => {
        if (!auth) throw new Error("Firebase Auth not initialized");
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        return userCredential.user;
    };
    
    const signOutUser = async () => {
        if (!auth) throw new Error("Firebase Auth not initialized");
        await signOut(auth);
    }

    const value = { app, auth, user, isLoading, signUp, signIn, signOutUser };

    return (
        <FirebaseContext.Provider value={value}>
            {!isLoading && children}
        </FirebaseContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a FirebaseProvider');
    }
    return context;
}
