"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

const publicPaths = ["/login", "/signup"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && !publicPaths.includes(pathname)) {
            router.push("/login");
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#fff8f0]">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent"></div>
            </div>
        );
    }

    // If user is not logged in and trying to access a protected route, don't render anything while redirecting
    if (!user && !publicPaths.includes(pathname)) {
        return null;
    }

    return <>{children}</>;
}
