import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "var(--primary)",
                accent: "var(--accent)",
                highlight: "var(--primary-glow)",
                main: "var(--text-main)",
                dim: "var(--text-dim)",
            },
        },
    },
    plugins: [],
};
export default config;
