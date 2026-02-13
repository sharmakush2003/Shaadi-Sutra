"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export default function LoginPage() {
    const { signInWithGoogle, sendAuthAlert } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await sendAuthAlert(userCredential.user, 'login');
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 rounded-lg border border-[#e5d5c5] bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="font-heading text-3xl font-bold text-[#8b4513]">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your account
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#d4af37] focus:outline-none focus:ring-[#d4af37]"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#d4af37] focus:outline-none focus:ring-[#d4af37]"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md border border-transparent bg-[#d4af37] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#c5a028] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <div className="relative mt-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleGoogleLogin}
                        className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2"
                    >
                        Sign in with Google
                    </button>
                </div>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-medium text-[#d4af37] hover:text-[#b08d1a]">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
