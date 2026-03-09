import { getSupporters, createSupporter } from "@/lib/actions";
import { Plus, User, Mail, Phone, Filter, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";

export default async function SupportersPage({
    searchParams
}: {
    searchParams: Promise<{ search?: string }>
}) {
    const { search } = await searchParams;
    const supporters = await getSupporters(search);

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-main">
                        Supporters
                    </h1>
                    <p className="text-dim text-lg mt-2">Manage your core community</p>
                </div>
                <div className="flex gap-4">
                    <SearchInput />
                </div>
            </header>

            {/* Quick Add Form Section */}
            <section className="glass-card p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Plus className="text-primary" size={20} /> Register Member
                </h2>
                <form action={createSupporter} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        name="name"
                        placeholder="Full Name"
                        required
                        className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-primary/50 transition-all text-sm"
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-primary/50 transition-all text-sm"
                    />
                    <input
                        name="phone"
                        placeholder="WhatsApp Phone"
                        className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-primary/50 transition-all text-sm"
                    />
                    <div className="flex gap-2">
                        <select
                            name="category"
                            defaultValue="DONOR"
                            className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-primary/50 transition-all text-sm text-dim appearance-none"
                        >
                            <option value="DONOR">Donor</option>
                            <option value="INTERCESSOR">Intercessor</option>
                            <option value="BOTH">Both</option>
                        </select>
                        <button type="submit" className="btn-primary">
                            Save
                        </button>
                    </div>
                </form>
            </section>

            {/* Supporters Table Section */}
            <section className="glass-card overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex gap-2 items-center text-sm font-medium text-dim">
                        <Filter size={16} className="text-primary" />
                        <span>Showing all {supporters.length} active members</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-dim text-xs font-bold uppercase tracking-widest bg-white/[0.01]">
                                <th className="px-8 py-5">Name & Profile</th>
                                <th className="px-8 py-5">Contact Details</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5">Impact Level</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {supporters.map((supporter) => (
                                <tr key={supporter.id} className="group hover:bg-white/[0.03] transition-colors cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-highlight/20 rounded-full flex items-center justify-center text-highlight font-bold text-lg">
                                                {supporter.name[0]}
                                            </div>
                                            <Link href={`/supporters/${supporter.id}`} className="font-bold text-main hover:text-primary transition-colors">
                                                {supporter.name}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col text-sm space-y-1 text-dim">
                                            <div className="flex items-center gap-2 group-hover:text-main transition-colors">
                                                <Mail size={14} className="opacity-50" /> {supporter.email || "—"}
                                            </div>
                                            <div className="flex items-center gap-2 group-hover:text-main transition-colors">
                                                <Phone size={14} className="opacity-50" /> {supporter.phone || "—"}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${supporter.category === 'BOTH' ? 'border-amber-500/20 bg-amber-500/10 text-amber-500' :
                                            supporter.category === 'DONOR' ? 'border-blue-500/20 bg-blue-500/10 text-blue-500' :
                                                'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                                            }`}>
                                            {supporter.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-6">
                                            <div className="flex flex-col">
                                                <span className="text-xl font-bold text-main">{supporter._count.donations}</span>
                                                <span className="text-[10px] text-dim font-bold uppercase tracking-tighter">Gifts</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xl font-bold text-emerald-400">{supporter._count.prayerCommitments}</span>
                                                <span className="text-[10px] text-dim font-bold uppercase tracking-tighter">Prayers</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link href={`/supporters/${supporter.id}`} className="inline-flex items-center justify-center p-3 rounded-xl border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all text-dim hover:text-main">
                                            <ChevronRight size={20} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {supporters.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-dim uppercase tracking-widest font-bold opacity-50">
                                        Your community list is empty
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section >
        </div >
    );
}
