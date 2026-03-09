import prisma from "@/lib/prisma";
import { Settings } from "lucide-react";
import BroadcastHub from "@/components/BroadcastHub";

export default async function RemindersPage() {
    const supporters = await prisma.supporter.findMany({
        orderBy: { name: "asc" },
    });

    const templates = [
        { title: "Weekly Intercession", text: "Hola {name}, te escribo para recordarte tu compromiso de oración para esta semana. ¡Agradecemos mucho tu intercesión!" },
        { title: "Gratitude Protocol", text: "Estimado/a {name}, hemos recibido tu generoso donativo. ¡Muchas gracias por tu compromiso con el proyecto!" },
        { title: "Mission Update", text: "Hola {name}, tenemos noticias importantes sobre los avances del proyecto que queremos compartir contigo..." }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-main">
                        WhatsApp Hub
                    </h1>
                    <p className="text-dim text-lg mt-2 font-medium italic">Manage community outreach and reminders</p>
                </div>
                <div className="flex gap-3">
                    <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-dim hover:text-main transition-all">
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            <BroadcastHub supporters={supporters} templates={templates} />
        </div>
    );
}
