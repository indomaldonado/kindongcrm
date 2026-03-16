"use client";

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
}

export default function NavLink({ href, icon, label }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 border ${isActive
                ? "bg-amber-500/15 border-amber-500/30 text-accent shadow-lg shadow-amber-900/10"
                : "border-transparent text-dim hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-accent"
                } group`}
        >
            <span className={`${isActive ? "text-accent" : "text-zinc-500 group-hover:text-accent"} transition-colors`}>
                {icon}
            </span>
            <span className="font-medium">{label}</span>
        </Link>
    );
}