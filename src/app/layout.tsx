"use client";

import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Users, Heart, MessageSquare, TrendingUp, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased selection:bg-blue-500/30" suppressHydrationWarning>
                <ThemeProvider>
                    <div className="flex min-h-screen">
                        {/* Sidebar */}
                        <aside className="w-72 premium-sidebar fixed h-full p-8 flex flex-col gap-10 z-50">
                            <div className="flex items-center gap-3 py-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/20">
                                    <Heart size={22} className="text-white fill-white" />
                                </div>
                                <span className="font-bold text-xl tracking-tight text-main">
                                    Kingdom<span className="text-accent">CRM</span>
                                </span>
                            </div>

                            <nav className="flex flex-col gap-3">
                                <NavLink href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                                <NavLink href="/supporters" icon={<Users size={20} />} label="Supporters" />
                                <NavLink href="/donations" icon={<Heart size={20} />} label="Donations" />
                                <NavLink href="/whatsapp" icon={<MessageSquare size={20} />} label="WhatsApp" />
                                <NavLink href="/reports" icon={<TrendingUp size={20} />} label="Reports" />
                                <NavLink href="/email" icon={<Mail size={20} />} label="Email Hub" />
                            </nav>

                            <div className="mt-auto space-y-6">
                                <ThemeToggle />
                                <div className="glass-card p-4 bg-white/5 border-white/10">
                                    <p className="text-xs text-dim font-medium mb-2 uppercase tracking-tight">System Status</p>
                                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        Live & Connected
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 ml-72 p-10 min-h-screen bg-transparent">
                            {children}
                        </main>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 border ${isActive
                ? "bg-amber-500/15 border-amber-500/30 text-accent shadow-lg shadow-amber-900/10"
                : "border-transparent text-dim hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-accent"
                } group`}
        >
            <span className={`${isActive ? "text-accent" : "text-zinc-500 group-hover:text-accent"} transition-colors`}>
                {icon}
            </span>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
