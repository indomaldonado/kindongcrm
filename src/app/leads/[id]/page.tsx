import { getLeadDetails, updateLead, convertLeadToSupporter } from "@/lib/actions";
import { MessageSquare, ArrowLeft, MoreHorizontal, User, Check, Mail, Phone, Trash2, ShieldAlert, UserCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
// @ts-ignore
import DeleteLeadForm from "@/components/DeleteLeadForm";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const lead = await getLeadDetails(id);

    if (!lead) notFound();

    const sendWhatsApp = (message: string) => {
        const phone = lead.phone?.replace(/\D/g, "");
        if (!phone) return undefined;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    const defaultMessage = `Hola ${lead.name}, te escribo del proyecto. Nos gustaría conocerte mejor y ver cómo puedes contribuir. ¡Dios te bendiga!`;
    const whatsappUrl = sendWhatsApp(defaultMessage);

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            <Link href="/leads" className="inline-flex items-center gap-2 text-dim hover:text-main transition-colors group">
                <div className="p-2 rounded-lg border border-white/10 group-hover:bg-white/5">
                    <ArrowLeft size={16} />
                </div>
                <span className="font-medium">Back to Leads</span>
            </Link>

            <header className="flex justify-between items-start">
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-highlight/20 rounded-[2.5rem] flex items-center justify-center text-4xl font-bold shadow-2xl shadow-blue-500/20 text-highlight">
                        {lead.name[0]}
                    </div>
                    <div>
                        <div className="flex items-center gap-6">
                            <h1 className="text-5xl font-extrabold tracking-tight text-main">{lead.name}</h1>
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-dim uppercase tracking-widest">
                                {lead.possibleCategory}
                            </div>
                        </div>
                        <p className="text-dim text-lg mt-2 font-medium">
                            {lead.email || "No email"} • {lead.phone || "No phone"}
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
                            Lead Information
                        </h2>
                        <form action={updateLead} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="hidden" name="id" value={lead.id} />
                            <div className="space-y-2">
                                <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" size={16} />
                                    <input name="name" defaultValue={lead.name} className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-primary/50 transition-all text-main" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" size={16} />
                                    <input name="email" type="email" defaultValue={lead.email || ""} className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-primary/50 transition-all text-main" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">WhatsApp / Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" size={16} />
                                    <input name="phone" defaultValue={lead.phone || ""} className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-primary/50 transition-all text-main" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">Possible Category</label>
                                <select
                                    name="possibleCategory"
                                    defaultValue={lead.possibleCategory}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary/50 transition-all text-main appearance-none"
                                >
                                    <option value="DONOR">Possible Donor</option>
                                    <option value="INTERCESSOR">Possible Intercessor</option>
                                    <option value="BOTH">Possible Both</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">Notes</label>
                                <textarea
                                    name="notes"
                                    defaultValue={lead.notes || ""}
                                    placeholder="Additional notes about this lead..."
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary/50 transition-all text-main resize-none"
                                    rows={3}
                                />
                            </div>
                            <div className="md:col-span-2 pt-4">
                                <button type="submit" className="w-full btn-primary justify-center py-4 shadow-xl shadow-blue-900/20 flex items-center gap-3">
                                    <Check size={20} /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Convert to Supporter Section */}
                    <div className="glass-card p-10">
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-400/10 text-green-500"><UserCheck size={18} /></div>
                            Convert to Supporter
                        </h2>
                        <p className="text-sm text-dim mb-6">
                            When this lead commits to supporting the project, convert them to an active supporter.
                        </p>
                        <form action={convertLeadToSupporter} className="space-y-4">
                            <input type="hidden" name="leadId" value={lead.id} />
                            <div className="space-y-2">
                                <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">Confirmed Category</label>
                                <select
                                    name="category"
                                    defaultValue={lead.possibleCategory}
                                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-primary/50 transition-all text-sm appearance-none"
                                >
                                    <option value="DONOR">Donor</option>
                                    <option value="INTERCESSOR">Intercessor</option>
                                    <option value="BOTH">Both</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full btn-primary justify-center py-3 bg-green-600/20 text-green-600 hover:bg-green-600/30 border border-green-500/20 font-bold">
                                <UserCheck size={16} /> Convert to Supporter
                            </button>
                        </form>
                    </div>

                    {/* Danger Zone */}
                    <DeleteLeadForm leadId={lead.id} />
                </div>
            </div>
        </div>
    );
}