import { getLeads, createLead } from "@/lib/actions";
import { Plus, User, Mail, Phone, Filter, ChevronRight, Search } from "lucide-react";
import Link from "next/link";

export default async function LeadsPage() {
    const leads: any[] = await getLeads();

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-main">
                        Leads
                    </h1>
                    <p className="text-dim text-lg mt-2">Potential supporters and intercessors</p>
                </div>
            </header>

            {/* Quick Add Form Section */}
            <section className="glass-card p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Plus className="text-primary" size={20} /> Add Potential Member
                </h2>
                <form action={createLead} className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                    <select
                        name="possibleCategory"
                        defaultValue="DONOR"
                        className="bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-primary/50 transition-all text-sm text-dim appearance-none"
                    >
                        <option value="DONOR">Possible Donor</option>
                        <option value="INTERCESSOR">Possible Intercessor</option>
                        <option value="BOTH">Possible Both</option>
                    </select>
                    <div className="flex gap-2">
                        <input
                            name="notes"
                            placeholder="Notes"
                            className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-primary/50 transition-all text-sm"
                        />
                        <button type="submit" className="btn-primary">
                            Save
                        </button>
                    </div>
                </form>
            </section>

            {/* Leads Table Section */}
            <section className="glass-card overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex gap-2 items-center text-sm font-medium text-dim">
                        <Filter size={16} className="text-primary" />
                        <span>Showing all {leads.length} potential members</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-dim text-xs font-bold uppercase tracking-widest bg-white/[0.01]">
                                <th className="px-8 py-5">Name & Profile</th>
                                <th className="px-8 py-5">Contact Details</th>
                                <th className="px-8 py-5">Possible Category</th>
                                <th className="px-8 py-5">Notes</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leads.map((lead) => (
                                <tr key={lead.id} className="group hover:bg-white/[0.03] transition-colors cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-highlight/20 rounded-full flex items-center justify-center text-highlight font-bold text-lg">
                                                {lead.name[0]}
                                            </div>
                                            <Link href={`/leads/${lead.id}`} className="font-bold text-main hover:text-primary transition-colors">
                                                {lead.name}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col text-sm space-y-1 text-dim">
                                            <div className="flex items-center gap-2 group-hover:text-main transition-colors">
                                                <Mail size={14} className="opacity-50" /> {lead.email || "—"}
                                            </div>
                                            <div className="flex items-center gap-2 group-hover:text-main transition-colors">
                                                <Phone size={14} className="opacity-50" /> {lead.phone || "—"}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${lead.possibleCategory === 'BOTH' ? 'border-amber-500/20 bg-amber-500/10 text-amber-500' :
                                            lead.possibleCategory === 'DONOR' ? 'border-blue-500/20 bg-blue-500/10 text-blue-500' :
                                                'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                                            }`}>
                                            {lead.possibleCategory}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm text-dim">{lead.notes || "—"}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link href={`/leads/${lead.id}`} className="inline-flex items-center justify-center p-3 rounded-xl border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all text-dim hover:text-main">
                                            <ChevronRight size={20} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-dim uppercase tracking-widest font-bold opacity-50">
                                        No leads yet
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