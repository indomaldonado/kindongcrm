"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

export default function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [value, setValue] = useState(searchParams.get("search") || "");

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (value) {
                params.set("search", value);
            } else {
                params.delete("search");
            }

            startTransition(() => {
                router.push(`/supporters?${params.toString()}`);
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [value, router, searchParams]);

    return (
        <div className="relative group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isPending ? 'text-primary animate-pulse' : 'text-dim group-focus-within:text-primary'}`} size={18} />
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search community..."
                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all w-64 text-sm"
            />
        </div>
    );
}
