"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, CheckSquare, Hotel, Building2, PieChart, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Guests", href: "/guests", icon: Users },
    { name: "Rooms", href: "/rooms", icon: Hotel },
    { name: "Vendors", href: "/vendors", icon: Building2 },
    { name: "Budget", href: "/budget", icon: PieChart },
];

export function Navbar() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gold-400/30 md:static md:w-64 md:border-r md:border-t-0 md:min-h-screen md:flex-col shadow-soft">
            <div className="hidden md:flex flex-col items-center justify-center h-28 border-b border-gold-400/20">
                <h1 className="text-4xl font-serif text-maroon-900 font-bold tracking-tight">Shaadi Sutra</h1>
                <div className="w-16 h-0.5 bg-gold-400 mt-2 rounded-full"></div>
            </div>

            <div className="flex flex-row justify-around md:flex-col md:justify-start md:space-y-2 md:p-4 md:mt-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col md:flex-row items-center md:space-x-4 px-3 py-2 md:px-6 md:py-3.5 rounded-lg transition-all duration-300 group overflow-hidden",
                                isActive
                                    ? "text-maroon-900 bg-maroon-50/80 font-semibold shadow-sm"
                                    : "text-gray-500 hover:text-maroon-800 hover:bg-white/50"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-400 rounded-l-lg hidden md:block animate-fade-in-up" />
                            )}
                            <item.icon className={cn("w-6 h-6 md:w-5 md:h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "stroke-[2.5]" : "stroke-2")} />
                            <span className="text-[10px] md:text-base mt-1 md:mt-0 tracking-wide">{item.name}</span>
                        </Link>
                    );
                })}

                <div className="hidden md:flex flex-col mt-auto w-full px-4 mb-4">
                    <div className="border-t border-gold-400/20 my-2"></div>
                    {user ? (
                        <button
                            onClick={signOut}
                            className="flex items-center space-x-4 px-3 py-3.5 rounded-lg transition-all duration-300 group text-gray-500 hover:text-red-800 hover:bg-red-50"
                        >
                            <LogOut className="w-5 h-5 stroke-2 group-hover:scale-110 transition-transform" />
                            <span className="text-base tracking-wide">Sign Out</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center space-x-4 px-3 py-3.5 rounded-lg transition-all duration-300 group text-gray-500 hover:text-maroon-800 hover:bg-maroon-50"
                        >
                            <LogIn className="w-5 h-5 stroke-2 group-hover:scale-110 transition-transform" />
                            <span className="text-base tracking-wide">Sign In</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
