"use client";

import { useState } from "react";
import { Mail, Send, Users, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { sendBulkEmail } from "@/lib/actions";

type Supporter = {
    id: string;
    name: string;
    email: string | null;
    category: string;
};

export default function EmailComposer({ supporters }: { supporters: Supporter[] }) {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [recipientType, setRecipientType] = useState<"ALL" | "DONOR" | "INTERCESSOR" | "INDIVIDUAL">("ALL");
    const [selectedSupporterId, setSelectedSupporterId] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const filteredSupporters = supporters.filter(s => {
        if (!s.email) return false;
        if (recipientType === "ALL") return true;
        if (recipientType === "INDIVIDUAL") return s.id === selectedSupporterId;
        if (recipientType === "DONOR") return s.category === "DONOR" || s.category === "BOTH";
        return s.category === "INTERCESSOR" || s.category === "BOTH";
    });

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !body) return;
        if (recipientType === "INDIVIDUAL" && !selectedSupporterId) return;

        setIsSending(true);
        setStatus(null);

        try {
            const formData = new FormData();
            formData.append("subject", subject);
            formData.append("body", body);
            formData.append("recipientType", recipientType);
            if (selectedSupporterId) formData.append("supporterId", selectedSupporterId);

            const result = await sendBulkEmail(formData);

            if (result.success) {
                setStatus({ type: "success", message: `Successfully sent to ${result.count} recipient(s)!` });
                setSubject("");
                setBody("");
                if (recipientType === "INDIVIDUAL") setSelectedSupporterId("");
            } else {
                setStatus({ type: "error", message: result.error || "Failed to send emails." });
            }
        } catch (error) {
            setStatus({ type: "error", message: "An unexpected error occurred." });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
                <form onSubmit={handleSend} className="glass-card p-10 space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <Mail className="text-primary" size={24} />
                                New Message
                            </h2>
                            <div className="flex gap-2">
                                <RecipientTab
                                    active={recipientType === "ALL"}
                                    onClick={() => setRecipientType("ALL")}
                                    label="All"
                                />
                                <RecipientTab
                                    active={recipientType === "DONOR"}
                                    onClick={() => setRecipientType("DONOR")}
                                    label="Donors"
                                />
                                <RecipientTab
                                    active={recipientType === "INTERCESSOR"}
                                    onClick={() => setRecipientType("INTERCESSOR")}
                                    label="Intercessors"
                                />
                                <RecipientTab
                                    active={recipientType === "INDIVIDUAL"}
                                    onClick={() => setRecipientType("INDIVIDUAL")}
                                    label="Individual"
                                />
                            </div>
                        </div>

                        {recipientType === "INDIVIDUAL" && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">Select Recipient</label>
                                <select
                                    value={selectedSupporterId}
                                    onChange={(e) => setSelectedSupporterId(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary/50 transition-all text-main appearance-none select-none"
                                >
                                    <option value="">Choose a supporter...</option>
                                    {supporters.map(s => (
                                        <option key={s.id} value={s.id} className="text-zinc-900">
                                            {s.name} ({s.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">Subject Line</label>
                            <input
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g. Monthly Mission Update - February"
                                required
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary/50 transition-all text-main"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] text-dim font-bold uppercase tracking-widest ml-1">Message Content</label>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Write your hearts message here..."
                                required
                                rows={12}
                                className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl outline-none focus:border-primary/50 transition-all text-main resize-none leading-relaxed"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="text-sm text-dim">
                            Sending to <span className="text-main font-bold">{filteredSupporters.length}</span> verified emails
                        </div>
                        <button
                            type="submit"
                            disabled={isSending}
                            className={`btn-primary px-10 py-4 shadow-xl shadow-blue-900/20 flex items-center gap-3 ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSending ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Send size={20} />
                            )}
                            {isSending ? "Broadcasting..." : "Send Campaign"}
                        </button>
                    </div>

                    {status && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 ${status.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border border-red-500/20 text-red-500"
                            }`}>
                            {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="text-sm font-medium">{status.message}</span>
                        </div>
                    )}
                </form>
            </div>

            <div className="space-y-8">
                <div className="glass-card p-8 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
                    <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <FileText size={18} />
                        Newsletter Helper
                    </h3>
                    <p className="text-dim text-sm leading-relaxed mb-6">
                        Para enviar tu **Carta de Noticias PDF**, te recomendamos subirla primero a Google Drive o Dropbox y pegar el enlace de descarga al final de tu mensaje.
                    </p>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-dim italic leading-relaxed">
                        "Puedes descargar nuestra carta de noticias completa aquí: [TU ENLACE AQUÍ]"
                    </div>
                </div>

                <div className="glass-card p-8">
                    <h3 className="text-sm font-bold text-dim uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Users size={18} />
                        Recipients Overview
                    </h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredSupporters.map(s => (
                            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                <div className="w-8 h-8 rounded-lg bg-highlight/20 flex items-center justify-center text-[10px] font-bold text-highlight">
                                    {s.name[0]}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs font-bold text-main truncate">{s.name}</div>
                                    <div className="text-[10px] text-dim truncate">{s.email}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function RecipientTab({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${active
                ? "bg-primary/20 border border-primary/30 text-primary"
                : "text-dim hover:text-main border border-transparent"
                }`}
        >
            {label}
        </button>
    );
}
