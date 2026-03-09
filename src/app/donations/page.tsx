import prisma from "@/lib/prisma";
import { Heart, Search, User, ExternalLink, Calendar as CalIcon, Plus } from "lucide-react";
import Link from "next/link";
import { addDonation, getSupporters } from "@/lib/actions";

export default async function DonationsPage() {
    const donations = await prisma.donation.findMany({
        include: { supporter: true },
        orderBy: { date: "desc" },
    });

    const supporters = await getSupporters();

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                        Gift Registry
                    </h1>
                    <p className="text-zinc-500 text-lg mt-2">Historical log of all contributions</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="text-right mr-4">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Total Valuation</p>
                        <p className="text-2xl font-black text-emerald-400">
                            ${donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            </header>

            {/* Global Donation Form */}
            <section className="glass-card p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Plus className="text-emerald-400" size={20} /> Record Global Donation
                </h2>
                <form action={addDonation} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select
                        name="supporterId"
                        defaultValue=""
                        required
                        className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500/50 transition-all text-sm text-zinc-400 appearance-none"
                    >
                        <option value="" className="bg-zinc-900">Select Supporter</option>
                        {supporters.map(s => (
                            <option key={s.id} value={s.id} className="bg-zinc-900">{s.name}</option>
                        ))}
                    </select>
                    <input
                        name="amount"
                        type="number"
                        step="0.01"
                        placeholder="Amount"
                        required
                        className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500/50 transition-all text-sm"
                    />
                    <input
                        name="date"
                        type="date"
                        required
                        className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500/50 transition-all text-sm"
                        defaultValue={new Date().toISOString().split('T')[0]}
                    />
                    <div className="flex gap-2">
                        <input
                            name="notes"
                            placeholder="Notes"
                            className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500/50 transition-all text-sm"
                        />
                        <button type="submit" className="btn-accent border-none bg-emerald-600 hover:bg-emerald-500 px-8">
                            Save
                        </button>
                    </div>
                </form>
            </section>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-zinc-500 text-xs font-bold uppercase tracking-widest bg-white/[0.02]">
                                <th className="px-10 py-6 text-center w-32">Execution Date</th>
                                <th className="px-10 py-6">Benefactor</th>
                                <th className="px-10 py-6">Transaction</th>
                                <th className="px-10 py-6">Memorandum</th>
                                <th className="px-10 py-6 text-right">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {donations.map((donation) => (
                                <tr key={donation.id} className="group hover:bg-white/[0.03] transition-colors">
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col items-center">
                                            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">
                                                {new Date(donation.date).getFullYear()}
                                            </div>
                                            <div className="text-xl font-black text-white leading-none mt-1">
                                                {new Date(donation.date).toLocaleDateString('en-US', { day: '2-digit' })}
                                            </div>
                                            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">
                                                {new Date(donation.date).toLocaleDateString('en-US', { month: 'short' })}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <Link href={`/supporters/${donation.supporterId}`} className="flex items-center gap-4 group/link">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-400 group-hover/link:border-blue-500/50 transition-all">
                                                {donation.supporter.name[0]}
                                            </div>
                                            <div>
                                                <span className="font-bold text-white group-hover/link:text-blue-400 transition-colors block">
                                                    {donation.supporter.name}
                                                </span>
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                                    ID: {donation.supporterId.slice(-6)}
                                                </span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-emerald-400/5 border border-emerald-400/10 transition-transform group-hover:scale-105">
                                            <span className="text-2xl font-black text-emerald-400">
                                                ${donation.amount.toFixed(2)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <p className="text-sm text-zinc-400 italic font-medium leading-relaxed max-w-xs">
                                            {donation.notes ? `"${donation.notes}"` : "—"}
                                        </p>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button className="p-3 rounded-xl border border-white/10 text-zinc-600 hover:text-white hover:border-white/20 transition-all">
                                            <ExternalLink size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {donations.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-10 py-24 text-center text-zinc-600 uppercase tracking-widest font-black opacity-30">
                                        No registry entries found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
