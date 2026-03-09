import prisma from "@/lib/prisma";
import EmailComposer from "@/components/EmailComposer";
import { Mail, Settings, ShieldCheck } from "lucide-react";

export default async function EmailHubPage() {
    const supporters = await prisma.supporter.findMany({
        where: {
            email: { not: null }
        },
        orderBy: { name: "asc" }
    });

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-main">
                        Email Hub
                    </h1>
                    <p className="text-dim text-lg mt-2 font-medium italic">Professional outreach and newsletter dispatch</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                        <ShieldCheck size={16} />
                        Resend Connected
                    </div>
                </div>
            </header>

            <EmailComposer supporters={supporters as any} />
        </div>
    );
}
