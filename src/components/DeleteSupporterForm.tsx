"use client";

import { Trash2, ShieldAlert } from "lucide-react";
import { deleteSupporter } from "@/lib/actions";

interface DeleteSupporterFormProps {
    supporterId: string;
}

export default function DeleteSupporterForm({ supporterId }: DeleteSupporterFormProps) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!confirm("Are you sure you want to terminate this partnership? This action is permanent.")) {
            e.preventDefault();
        }
    };

    return (
        <div className="glass-card p-10 border-red-500/20 bg-red-500/5">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-red-500">
                <ShieldAlert size={20} />
                Danger Zone
            </h2>
            <p className="text-xs text-zinc-500 mb-8 leading-relaxed">
                This action is permanent. All history, donations and prayer commitments will be deleted.
            </p>
            <form action={deleteSupporter} onSubmit={handleSubmit}>
                <input type="hidden" name="id" value={supporterId} />
                <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold text-sm transition-all">
                    <Trash2 size={18} />
                    Terminate Partnership
                </button>
            </form>
        </div>
    );
}
