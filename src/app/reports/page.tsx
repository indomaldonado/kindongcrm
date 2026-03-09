import prisma from "@/lib/prisma";
import { TrendingUp, Users, Heart, PieChart as PieIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { RevenueChart, CategoryDistributionChart, SupportGrowthChart } from "@/components/Charts";
import ReportDownloader from "@/components/ReportDownloader";

export default async function ReportsPage() {
    // 1. Fetch donation trends (last 12 months)
    const donations = await prisma.donation.findMany({
        orderBy: { date: "asc" },
    });

    const monthlyRevenue = donations.reduce((acc: any, donation) => {
        const month = donation.date.toISOString().substring(0, 7); // YYYY-MM
        if (!acc[month]) acc[month] = { date: month, amount: 0 };
        acc[month].amount += donation.amount;
        return acc;
    }, {});

    const revenueData = Object.values(monthlyRevenue);

    // 2. Category Distribution
    const categoryCounts = await prisma.supporter.groupBy({
        by: ["category"],
        _count: { id: true },
    });

    const distributionData = categoryCounts.map(c => ({
        name: c.category,
        value: c._count.id
    }));

    // 3. Support Growth (joined per month)
    const supporters = await prisma.supporter.findMany({
        orderBy: { createdAt: "asc" },
    });

    const monthlyGrowth = supporters.reduce((acc: any, supporter) => {
        const date = supporter.createdAt || new Date(0); // Epoch fallback
        const month = date.toISOString().substring(0, 7);
        if (!acc[month]) acc[month] = { date: month, amount: 0 };
        acc[month].amount += 1;
        return acc;
    }, {});

    const growthData = Object.values(monthlyGrowth);

    // Calculate metrics
    const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);
    const avgDonation = donations.length > 0 ? totalRaised / donations.length : 0;
    const totalSupporters = supporters.length;

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <header>
                <h1 className="text-5xl font-extrabold tracking-tight text-main">
                    Mission Analytics
                </h1>
                <p className="text-dim text-lg mt-2 font-medium italic">Strategic insight into your ministry's impact</p>
            </header>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    label="Lifetime Funding"
                    value={`$${totalRaised.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                    icon={<TrendingUp size={22} />}
                    trend="+12.5%"
                    trendUp={true}
                />
                <MetricCard
                    label="Reach Capacity"
                    value={totalSupporters.toString()}
                    icon={<Users size={22} />}
                    trend="+4 new"
                    trendUp={true}
                />
                <MetricCard
                    label="Avg. Contribution"
                    value={`$${avgDonation.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                    icon={<Heart size={22} />}
                    trend="-2.1%"
                    trendUp={false}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Revenue Chart */}
                <div className="lg:col-span-2 glass-card p-10">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold">Funding Velocity</h2>
                            <p className="text-dim text-sm">Monthly donation trends over time</p>
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                            Real-time Data
                        </div>
                    </div>
                    {revenueData.length > 0 ? (
                        <RevenueChart data={revenueData as any} />
                    ) : (
                        <div className="h-[350px] flex items-center justify-center text-dim italic">No historical data available</div>
                    )}
                </div>

                {/* Donors vs Intercessors */}
                <div className="glass-card p-10 flex flex-col">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold">Community Mix</h2>
                        <p className="text-dim text-sm">Category distribution</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <CategoryDistributionChart data={distributionData} />
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
                        {distributionData.map((d, i) => (
                            <div key={d.name} className="flex justify-between items-center">
                                <span className="text-dim text-xs font-medium uppercase tracking-wider">{d.name}</span>
                                <span className="text-main font-bold">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <div className="lg:col-span-1 glass-card p-10">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold">New Members</h2>
                        <p className="text-dim text-sm">Monthly acquisitions</p>
                    </div>
                    <SupportGrowthChart data={growthData as any} />
                </div>

                {/* Insight Card */}
                <div className="lg:col-span-2 glass-card p-10 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-accent mb-6">Divine Stewardship</h2>
                        <p className="text-dim leading-relaxed text-lg max-w-2xl">
                            Esta sección de analítica te permite visualizar el fruto de tu misión. Los datos reflejan no solo recursos financieros, sino la fidelidad de una comunidad comprometida con el reino.
                        </p>
                        <div className="mt-10 flex gap-4">
                            <ReportDownloader />
                        </div>
                    </div>
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, trend, trendUp }: { label: string, value: string, icon: React.ReactNode, trend: string, trendUp: boolean }) {
    return (
        <div className="glass-card p-8 flex flex-col gap-4 group hover:translate-y-[-4px] transition-all duration-300">
            <div className="flex justify-between items-start">
                <div className="p-3 rounded-2xl bg-highlight/20 text-highlight">
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {trend}
                </div>
            </div>
            <div>
                <p className="stat-label text-xs">{label}</p>
                <h3 className="text-3xl font-bold mt-1 text-main">{value}</h3>
            </div>
        </div>
    );
}
