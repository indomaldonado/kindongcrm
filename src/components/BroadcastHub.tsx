"use client";

import { useState } from "react";
import { MessageSquare, Users, CheckSquare, Square, ChevronRight, Filter, PlayCircle, Loader2 } from "lucide-react";

type Supporter = {
    id: string;
    name: string;
    phone: string | null;
    category: string;
};

type Template = {
    title: string;
    text: string;
};

export default function BroadcastHub({
    supporters,
    templates
}: {
    supporters: Supporter[],
    templates: Template[]
}) {
    const [filter, setFilter] = useState<"ALL" | "DONOR" | "INTERCESSOR">("ALL");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [activeTemplate, setActiveTemplate] = useState(templates[0]);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const filteredSupporters = supporters.filter(s => {
        if (filter === "ALL") return true;
        if (filter === "DONOR") return s.category === "DONOR" || s.category === "BOTH";
        return s.category === "INTERCESSOR" || s.category === "BOTH";
    });

    const toggleSelect = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const toggleAll = () => {
        if (selectedIds.size === filteredSupporters.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredSupporters.map(s => s.id)));
        }
    };

    const selectedSupporters = supporters.filter(s => selectedIds.has(s.id));

    const startBroadcast = () => {
        if (selectedIds.size === 0) return;
        setIsBroadcasting(true);
        setCurrentIndex(0);
    };

    const sendCurrent = () => {
        const supporter = selectedSupporters[currentIndex];
        if (!supporter || !supporter.phone) return;

        const message = activeTemplate.text.replace("{name}", supporter.name);
        const url = `https://wa.me/${supporter.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");

        if (currentIndex < selectedSupporters.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsBroadcasting(false);
            setCurrentIndex(0);
            setSelectedIds(new Set());
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
                {/* Filters & Actions */}
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10">
                    <div className="flex gap-2">
                        <FilterButton active={filter === "ALL"} onClick={() => setFilter("ALL")} label="All" />
                        <FilterButton active={filter === "DONOR"} onClick={() => setFilter("DONOR")} label="Donors" />
                        <FilterButton active={filter === "INTERCESSOR"} onClick={() => setFilter("INTERCESSOR")} label="Intercessors" />
                    </div>

                    <button
                        onClick={startBroadcast}
                        disabled={selectedIds.size === 0 || isBroadcasting}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${selectedIds.size > 0 && !isBroadcasting
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-900/40 hover:scale-105"
                            : "bg-white/5 text-dim cursor-not-allowed"
                            }`}
                    >
                        <PlayCircle size={18} />
                        Broadcast to {selectedIds.size}
                    </button>
                </div>

                {isBroadcasting && (
                    <div className="glass-card p-6 border-amber-500/30 bg-amber-500/5 animate-in fade-in slide-in-from-top-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-amber-500 text-lg flex items-center gap-2">
                                    <Loader2 className="animate-spin" size={20} />
                                    Smart Broadcast Active
                                </h3>
                                <p className="text-dim text-sm mt-1">
                                    Next up: <span className="text-main font-bold">{selectedSupporters[currentIndex]?.name}</span> ({currentIndex + 1} of {selectedSupporters.length})
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsBroadcasting(false)}
                                    className="px-4 py-2 text-dim hover:text-main transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={sendCurrent}
                                    className="bg-amber-500 text-white px-8 py-2 rounded-xl font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-900/40"
                                >
                                    Open & Next
                                </button>
                            </div>
                        </div>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-6 overflow-hidden">
                            <div
                                className="bg-amber-500 h-full transition-all duration-500"
                                style={{ width: `${((currentIndex) / selectedSupporters.length) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <button
                            onClick={toggleAll}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dim hover:text-main transition-colors"
                        >
                            {selectedIds.size === filteredSupporters.length ? <CheckSquare size={16} /> : <Square size={16} />}
                            Select All {filteredSupporters.length}
                        </button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {filteredSupporters.map((supporter) => (
                            <div
                                key={supporter.id}
                                onClick={() => toggleSelect(supporter.id)}
                                className={`p-6 flex justify-between items-center cursor-pointer transition-all ${selectedIds.has(supporter.id) ? "bg-amber-500/5 text-amber-500" : "hover:bg-white/[0.02]"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`transition-colors ${selectedIds.has(supporter.id) ? "text-amber-500" : "text-dim"}`}>
                                        {selectedIds.has(supporter.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-highlight/20 flex items-center justify-center font-bold text-highlight">
                                        {supporter.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-main">{supporter.name}</h4>
                                        <p className="text-[10px] text-dim font-bold uppercase tracking-widest">{supporter.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-dim text-xs">{supporter.phone || "No phone"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="glass-card p-8 bg-white/[0.02]">
                    <h3 className="text-sm font-bold text-accent uppercase tracking-[0.2em] mb-8">Active Template</h3>
                    <div className="space-y-4">
                        {templates.map((t) => (
                            <div
                                key={t.title}
                                onClick={() => setActiveTemplate(t)}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all ${activeTemplate.title === t.title
                                    ? "border-amber-500/50 bg-amber-500/10"
                                    : "border-white/5 bg-white/5 hover:border-white/20"
                                    }`}
                            >
                                <div className="font-bold text-main text-sm mb-1">{t.title}</div>
                                <p className="text-xs text-dim italic line-clamp-2">"{t.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-8 border-blue-500/20">
                    <p className="text-xs text-dim leading-relaxed">
                        <strong className="text-primary font-bold">Broadcast Tip:</strong> Selecciona varios contactos y usa el botón "Broadcast" para enviar mensajes rápidos de forma secuencial. ¡Dios bendiga tu labor!
                    </p>
                </div>
            </div>
        </div>
    );
}

function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${active ? "bg-white/10 text-main" : "text-dim hover:text-main"
                }`}
        >
            {label}
        </button>
    );
}
