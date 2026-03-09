"use client";

import { Download } from "lucide-react";

export default function ReportDownloader() {
    const handleDownload = () => {
        window.print();
    };

    return (
        <button
            onClick={handleDownload}
            className="btn-accent px-10 py-4 font-bold border-none shadow-2xl shadow-amber-900/40 flex items-center gap-2 group hover:scale-105 transition-all"
        >
            <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
            Generate PDF Report
        </button>
    );
}
