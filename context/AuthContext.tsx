"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    User,
    GoogleAuthProvider,
    signInWithPopup,
    signInAnonymously as firebaseSignInAnonymously,
    signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInAnonymously: () => Promise<void>;
    signOut: () => Promise<void>;
    sendAuthAlert: (user: User, type: 'login' | 'signup') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const sendAuthAlert = async (user: User, type: 'login' | 'signup') => {
        try {
            await fetch('/api/send-login-alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: user.email,
                    displayName: user.displayName,
                    deviceInfo: navigator.userAgent,
                    loginTime: new Date().toLocaleString(),
                    type: type,
                }),
            });
        } catch (error) {
            console.error("Failed to send auth alert:", error);
        }
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        await handleUserAuth(user);
    };

    const signInAnonymously = async () => {
        const result = await firebaseSignInAnonymously(auth);
        const user = result.user;
        await handleUserAuth(user);
    };

    const handleUserAuth = async (user: User) => {
        // Check if user exists in Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email || null,
                displayName: user.displayName || 'Guest User',
                photoURL: user.photoURL || null,
                createdAt: serverTimestamp(),
                isAnonymous: user.isAnonymous,
            });
            // New user -> Signup alert (only if not anonymous or handle differently)
            if (!user.isAnonymous) {
                await sendAuthAlert(user, 'signup');
            }
        } else {
            // Existing user -> Login alert
            if (!user.isAnonymous) {
                await sendAuthAlert(user, 'login');
            }
        }
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInAnonymously, signOut, sendAuthAlert }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
