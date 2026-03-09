"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full p-4 rounded-2xl transition-all duration-300 group hover:bg-white/5"
            aria-label="Toggle Theme"
        >
            <div className={`p-2 rounded-xl transition-all duration-500 ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-500 nm-flat'}`}>
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <span className={`font-medium transition-colors ${theme === 'dark' ? 'text-zinc-400 group-hover:text-white' : 'text-zinc-600'}`}>
                {theme === 'dark' ? "Dark Mode" : "Light Mode"}
            </span>
        </button>
    );
}
