"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";

export default function DateFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentMonth = searchParams.get("month") || "";

    // Generate last 12 months for the dropdown
    const months = [];
    const date = new Date();
    for (let i = 0; i < 12; i++) {
        const value = date.toISOString().substring(0, 7); // YYYY-MM
        const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        months.push({ value, label });
        date.setMonth(date.getMonth() - 1);
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const params = new URLSearchParams(searchParams);
        if (val) {
            params.set("month", val);
        } else {
            params.delete("month");
        }
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 hover:bg-white/10 transition-all">
            <Calendar size={16} className="text-dim" />
            <select
                value={currentMonth}
                onChange={handleChange}
                className="bg-transparent text-sm font-bold text-main outline-none cursor-pointer appearance-none"
            >
                <option value="" className="bg-bg-primary text-text-main">Lifetime Stats</option>
                {months.map(m => (
                    <option key={m.value} value={m.value} className="bg-bg-primary text-text-main">{m.label}</option>
                ))}
            </select>
        </div>
    );
}
