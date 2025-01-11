import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                realBackground: "#F8FAFD",
                loginText: "#5A70F7",
                button1: "#A0ABC5",
                button1Hover: "#919AB0",
            },
            fontSize: {
                "12px": "12px",
                "14px": "14px",
                "16px": "16px",
            },
            borderRadius: {
                round: "10px",
                round2: "20px",
            },
            fontFamily: {
                sans: ["Pretendard", "sans-serif"],
            },
        },
    },
    plugins: [],
} satisfies Config;
