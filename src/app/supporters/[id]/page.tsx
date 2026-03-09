import { getSupporterDetails, addDonation, addPrayerCommitment, updateSupporter } from "@/lib/actions";
import { DollarSign, MessageSquare, Calendar, Heart, Plus, ArrowLeft, MoreHorizontal, User, Check, Mail, Phone, Trash2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteSupporterForm from "@/components/DeleteSupporterForm";

export default async function SupporterDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supporter = await getSupporterDetails(id);

    if (!supporter) notFound();

    const sendWhatsApp = (message: string) => {
        const phone = supporter.phone?.replace(/\D/g, "");
        if (!phone) return undefined;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    const defaultReminder = `Hola ${supporter.name}, te escribo del proyecto. Queríamos agradecerte por tu apoyo y recordarte tu compromiso de oración. ¡Dios te bendiga!`;
    const whatsappUrl = sendWhatsApp(defaultReminder);

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            <Link href="/supporters" className="inline-flex items-center gap-2 text-dim hover:text-main transition-colors group">
                <div className="p-2 rounded-lg border border-white/10 group-hover:bg-white/5">
                    <ArrowLeft size={16} />
                </div>
                <span className="font-medium">Back to Community</span>
            </Link>

            <header className="flex justify-between items-start">
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-highlight/20 rounded-[2.5rem] flex items-center justify-center text-4xl font-bold shadow-2xl shadow-blue-500/20 text-highlight">
                        {supporter.name[0]}
                    </div>
                    <div>
                        <div className="flex items-center gap-6">
                            <h1 className="text-5xl font-extrabold tracking-tight text-main">{supporter.name}</h1>
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-dim uppercase tracking-widest">
                                {supporter.category}
                            </div>
                        </div>
                        <p className="text-dim text-lg mt-2 font-medium">
                            {supporter.email || "No email"} • {supporter.phone || "No phone"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    {whatsappUrl ? (
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            className="btn-accent"
                        >
                            <MessageSquare size={18} /> Send WhatsApp
                        </a>
                    ) : (
                        <div className="px-6 py-2.5 rounded-xl border border-white/5 text-dim text-sm font-medium flex items-center gap-2 bg-white/[0.02]">
                            <MessageSquare size={18} /> No Phone
                        </div>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Profile Editing Form */}
                    <div className="glass-card p-10">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <User className="text-primary" size={24} />
                            Profile Settings
                        </h2>
                        <form action={updateSupporter} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="hidden" name="id" value={supporter.id} />
                            <div className="space-y-2">
                                <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" size={16} />
                                    <input name="name" defaultValue={supporter.name} className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-primary/50 transition-all text-main" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" size={16} />
                                    <input name="email" type="email" defaultValue={supporter.email || ""} className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-primary/50 transition-all text-main" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">WhatsApp / Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" size={16} />
                                    <input name="phone" defaultValue={supporter.phone || ""} className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-primary/50 transition-all text-main" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">Category</label>
                                <select
                                    name="category"
                                    defaultValue={supporter.category}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary/50 transition-all text-main appearance-none"
                                >
                                    <option value="DONOR">Donor</option>
                                    <option value="INTERCESSOR">Intercessor</option>
                                    <option value="BOTH">Both</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 pt-4">
                                <button type="submit" className="w-full btn-primary justify-center py-4 shadow-xl shadow-blue-900/20 flex items-center gap-3">
                                    <Check size={20} /> Save Profile Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Donations Section */}
                    <div className="glass-card p-10">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-400/10 text-red-500"><Heart size={20} /></div>
                            Contribution History
                        </h2>
                        <form action={addDonation} className="mb-10 p-8 bg-white/[0.03] rounded-3xl border border-white/5 space-y-6">
                            <input type="hidden" name="supporterId" value={supporter.id} />
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">Amount ($)</label>
                                    <input name="amount" type="number" step="0.01" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary/50 transition-all text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">Date</label>
                                    <input name="date" type="date" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary/50 transition-all text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">Transaction Notes</label>
                                <input name="notes" placeholder="Optional notes about this gift..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary/50 transition-all text-sm" />
                            </div>
                            <button type="submit" className="w-full btn-primary justify-center py-4 transition-all">
                                <Plus size={18} /> Record New Contribution
                            </button>
                        </form>

                        <div className="space-y-4">
                            {supporter.donations.map((donation) => (
                                <div key={donation.id} className="flex justify-between items-center p-5 rounded-2xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-highlight/20 text-highlight flex items-center justify-center font-bold italic">$</div>
                                        <div>
                                            <div className="font-bold text-main text-lg">${donation.amount.toFixed(2)}</div>
                                            <div className="text-xs text-dim font-medium">{new Date(donation.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-dim max-w-[200px] text-right truncate italic">
                                        {donation.notes}
                                    </div>
                                </div>
                            ))}
                            {supporter.donations.length === 0 && (
                                <div className="py-10 text-center text-dim text-sm uppercase tracking-widest font-bold opacity-30">No recorded contributions</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Commitments Section */}
                    <div className="glass-card p-10">
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-400/10 text-emerald-500"><Calendar size={18} /></div>
                            Prayer Mandates
                        </h2>

                        <form action={addPrayerCommitment} className="mb-10 p-6 bg-white/[0.03] rounded-2xl border border-white/5 space-y-4">
                            <input type="hidden" name="supporterId" value={supporter.id} />
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-dim font-bold uppercase pl-1">Frequency</label>
                                    <select name="frequency" defaultValue="WEEKLY" required className="w-full bg-transparent border border-white/10 p-3 rounded-xl outline-none focus:border-primary/50 transition-all text-sm appearance-none">
                                        <option value="DAILY">Daily</option>
                                        <option value="WEEKLY">Weekly</option>
                                        <option value="MONTHLY">Monthly</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-dim font-bold uppercase pl-1">Preferred Day</label>
                                    <input name="dayOfWeek" placeholder="e.g. Monday" className="w-full bg-transparent border border-white/10 p-3 rounded-xl outline-none focus:border-primary/50 transition-all text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-dim font-bold uppercase pl-1">Prayer Requests</label>
                                    <textarea name="notes" placeholder="..." className="w-full bg-transparent border border-white/10 p-3 rounded-xl outline-none focus:border-primary/50 transition-all text-sm resize-none" rows={3} />
                                </div>
                            </div>
                            <button type="submit" className="w-full btn-primary justify-center py-3 bg-emerald-600/20 text-emerald-600 hover:bg-emerald-600/30 border border-emerald-500/20 font-bold">
                                <Plus size={16} /> Add Commitment
                            </button>
                        </form>

                        <div className="space-y-4">
                            {supporter.prayerCommitments.map((commitment) => (
                                <div key={commitment.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                                            {commitment.frequency}
                                        </div>
                                        <span className="text-[10px] text-dim font-bold uppercase tracking-widest">{commitment.dayOfWeek}</span>
                                    </div>
                                    <p className="text-xs text-dim leading-relaxed italic">"{commitment.notes}"</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <DeleteSupporterForm supporterId={supporter.id} />
                </div>
            </div>
        </div>
    );
}
