import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Users, Heart, MessageSquare, TrendingUp, Mail, UserPlus } from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import NavLink from "@/components/NavLink";

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
                                <NavLink href="/leads" icon={<UserPlus size={20} />} label="Leads" />
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
