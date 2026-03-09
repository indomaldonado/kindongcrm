import prisma from "@/lib/prisma";
import { Users, Heart, Calendar, TrendingUp, Handshake, ChevronRight } from "lucide-react";
import Link from "next/link";
import DateFilter from "@/components/DateFilter";

export default async function DashboardPage({
    searchParams
}: {
    searchParams: Promise<{ month?: string }>
}) {
    const { month } = await searchParams;

    // Filtering logic
    const whereClause: any = {};
    if (month) {
        const start = new Date(`${month}-01`);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

        whereClause.createdAt = {
            gte: start,
            lt: end
        };
    }

    const supporterCount = await prisma.supporter.count({ where: whereClause });
    const donorCount = await prisma.supporter.count({
        where: {
            ...whereClause,
            category: { in: ["DONOR", "BOTH"] }
        }
    });
    const intercessorCount = await prisma.supporter.count({
        where: {
            ...whereClause,
            category: { in: ["INTERCESSOR", "BOTH"] }
        }
    });

    // For donations, we use the 'date' field instead of 'createdAt' for better financial accuracy
    const donationWhere: any = {};
    if (month) {
        const start = new Date(`${month}-01`);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);
        donationWhere.date = {
            gte: start,
            lt: end
        };
    }

    const totalDonations = await prisma.donation.aggregate({
        where: donationWhere,
        _sum: { amount: true }
    });

    const stats = [
        { label: "Total Supporters", value: supporterCount, icon: Users, color: "text-blue-400", glow: "shadow-blue-500/10" },
        { label: "Active Donors", value: donorCount, icon: Handshake, color: "text-amber-400", glow: "shadow-amber-500/10" },
        { label: "Intercessors", value: intercessorCount, icon: Heart, color: "text-emerald-400", glow: "shadow-emerald-500/10" },
        { label: "Total Raised", value: `$${(totalDonations._sum.amount || 0).toLocaleString('en-US')}`, icon: TrendingUp, color: "text-white", glow: "shadow-white-500/10" },
    ];

    const recentActivity = await prisma.supporter.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: 5
    });

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-main">
                        Dashboard
                    </h1>
                    <p className="text-dim text-lg mt-2">Impact overview for your mission</p>
                </div>
                <div className="flex gap-4 items-center">
                    <DateFilter />
                    <Link href="/supporters" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-dim hover:bg-white/5 hover:text-main transition-all" title="View all supporters">
                        <ChevronRight size={18} />
                    </Link>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className={`glass-card p-8 flex flex-col gap-6 group hover:translate-y-[-4px] transition-all duration-300 ${stat.glow}`}>
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:bg-white/10 transition-colors`}>
                                <stat.icon size={24} />
                            </div>
                            <Users size={16} className="opacity-20" />
                        </div>
                        <div>
                            <p className="stat-label">{stat.label}</p>
                            <h3 className="stat-value mt-2">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-10">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-bold">Recent Activity</h2>
                        <button className="text-sm text-dim hover:text-main transition-colors">See all actions</button>
                    </div>
                    <div className="space-y-8">
                        {recentActivity.map(activity => (
                            <ActivityItem
                                key={activity.id}
                                name={activity.name}
                                role={activity.category}
                                action="Joined Community"
                                id={activity.id}
                            />
                        ))}
                        {recentActivity.length === 0 && (
                            <p className="text-dim text-center py-10 italic">No recent activity found.</p>
                        )}
                    </div>
                </div>

                <div className="glass-card p-10 bg-gradient-to-br from-blue-600 to-blue-800 border-none relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col">
                        <h2 className="text-5xl font-bold leading-tight mb-8 text-[#d4af37]">
                            Faith in Action. <br />
                            <span className="text-amber-200/80">Keep Going.</span>
                        </h2>
                        <div className="mt-auto">
                            <Link href="/reports" className="w-full bg-white text-blue-700 px-6 py-4 rounded-2xl font-bold hover:bg-zinc-100 transition-all duration-300 shadow-xl shadow-blue-950/40 text-center block">
                                View Reports
                            </Link>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                    <div className="absolute bottom-[-5%] left-[-5%] w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
                </div>
            </section>
        </div>
    );
}

function ActivityItem({ name, role, action, id }: { name: string, role: string, action: string, id: string }) {
    return (
        <Link href={`/supporters/${id}`} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-highlight/20 flex items-center justify-center overflow-hidden transition-all">
                    <div className="text-highlight"><Users size={20} /></div>
                </div>
                <div>
                    <h4 className="font-bold text-main group-hover:text-primary transition-colors">{name}</h4>
                    <p className="text-xs text-dim uppercase tracking-wider mt-0.5">{role}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-dim">{action}</span>
                <ChevronRight size={18} className="opacity-30 group-hover:text-main transition-colors" />
            </div>
        </Link>
    )
}
