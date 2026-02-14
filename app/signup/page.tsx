"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

import { useAuth } from "@/context/AuthContext";

type SignupStep = 'email-entry' | 'otp-verification';

export default function SignupPage() {
    const router = useRouter();
    const { signInAnonymously, sendAuthAlert } = useAuth();
    const [step, setStep] = useState<SignupStep>('email-entry');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Countdown timer for OTP expiry
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setStep('otp-verification');
                setCountdown(300); // 5 minutes
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err: any) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Verify OTP
            const verifyResponse = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyData.success) {
                setError(verifyData.message || 'Invalid OTP');
                setLoading(false);
                return;
            }

            // OTP verified - create account
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                createdAt: serverTimestamp(),
            });

            await sendAuthAlert(user, 'signup');
            router.push("/");
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        setError("");
        setOtp("");

        try {
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setCountdown(300); // Reset to 5 minutes
            } else {
                setError(data.message || 'Failed to resend OTP');
            }
        } catch (err: any) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 rounded-lg border border-[#e5d5c5] bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="font-heading text-3xl font-bold text-[#8b4513]">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {step === 'email-entry'
                            ? 'Start planning your perfect wedding'
                            : 'Enter the verification code sent to your email'}
                    </p>
                </div>

                {step === 'email-entry' ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
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
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#d4af37] focus:outline-none focus:ring-[#d4af37]"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                disabled={loading}
                                className="flex w-full justify-center rounded-md border border-transparent bg-[#d4af37] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#c5a028] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 disabled:opacity-50"
                            >
                                {loading ? 'Sending OTP...' : 'Send Verification Code'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                    Verification Code
                                </label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    placeholder="Enter 6-digit code"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-center text-2xl tracking-widest shadow-sm focus:border-[#d4af37] focus:outline-none focus:ring-[#d4af37]"
                                />
                            </div>
                            {countdown > 0 && (
                                <p className="text-center text-sm text-gray-600">
                                    Code expires in: <span className="font-semibold text-[#d4af37]">{formatTime(countdown)}</span>
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="flex w-full justify-center rounded-md border border-transparent bg-[#d4af37] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#c5a028] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Verify & Create Account'}
                            </button>

                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={loading || countdown > 240}
                                className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 disabled:opacity-50"
                            >
                                Resend Code
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStep('email-entry');
                                    setOtp('');
                                    setError('');
                                    setCountdown(0);
                                }}
                                className="flex w-full justify-center text-sm text-gray-600 hover:text-[#d4af37]"
                            >
                                ← Back to email entry
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-4">
                    <button
                        onClick={async () => {
                            try {
                                await signInAnonymously();
                                router.push("/");
                            } catch (err: any) {
                                setError(err.message);
                            }
                        }}
                        className="flex w-full justify-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2"
                    >
                        Continue as Guest
                    </button>
                </div>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-[#d4af37] hover:text-[#b08d1a]">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div >
    );
}
