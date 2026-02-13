import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                maroon: {
                    50: "#fdf2f2",
                    100: "#fbe6e6",
                    200: "#f6ced0",
                    300: "#eea6aa",
                    400: "#e47379",
                    500: "#d6454d",
                    600: "#bf2b34",
                    700: "#a01f27",
                    800: "#800000",
                    900: "#5A0005", // Deep Royal Velvet
                    950: "#3d0a0d",
                },
                gold: {
                    50: "#fffaeb",
                    100: "#fff3c6",
                    200: "#ffe688",
                    300: "#ffd54a",
                    400: "#D4AF37", // Metallic Gold
                    500: "#C5A028",
                    600: "#AA8C2C", // Antique Gold
                    700: "#8E7525",
                    800: "#75601E",
                    900: "#5E4D18",
                    950: "#441a04",
                },
                cream: "#FFFFF0", // Ivory
                charcoal: "#2D2D2D",
            },
            fontFamily: {
                serif: ["var(--font-cormorant)", "serif"],
                sans: ["var(--font-lato)", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 0 15px rgba(212, 175, 55, 0.3)',
            },
            keyframes: {
                "fade-in-up": {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "scale-in": {
                    "0%": { opacity: "0", transform: "scale(0.95)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
            },
            animation: {
                "fade-in-up": "fade-in-up 0.5s ease-out forwards",
                "scale-in": "scale-in 0.3s ease-out forwards",
            },
        },
    },
    plugins: [],
};
export default config;
