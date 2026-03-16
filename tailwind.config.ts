import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "1.5rem",
            screens: {
                "2xl": "1360px",
            },
        },
        extend: {
            colors: {
                // پالت رنگی اختصاصی سالونا 
                salona: {
                    50: "#fdf2f8",
                    100: "#fce7f3",
                    200: "#fbcfe8",
                    300: "#f9a8d4",
                    400: "#f472b6",
                    500: "#ec4899", // رنگ اصلی برند (Primary)
                    600: "#db2777",
                    700: "#be185d",
                    800: "#9d174d",
                    900: "#831843",
                },
                background: "var(--background)",
                foreground: "var(--foreground)",
                border: "var(--border)",
            },
            fontFamily: {
                vazir: ["var(--font-vazirmatn)", "sans-serif"],
                iransans: ["IRANSans", "sans-serif"], // اضافه شدن ایران‌سنس به کلاس‌های تیلویند
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
            },
        },
    },
    // plugins: [require("tailwindcss-animate")],

    plugins: [
        require("tailwindcss-animate"),
        function ({ addUtilities }) {
            addUtilities({
                ".scrollbar-hide": {
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                    "&::-webkit-scrollbar": { display: "none" },
                },
                ".text-shadow-white": {
                    textShadow: '4px -2px 4px #fff, 2px 2px 4px #fff',
                },
                ".text-shadow-gray": {
                    textShadow: '4px -2px 4px rgba(0,0,0,0.2), 2px 2px 4px rgba(0,0,0,0.2)',
                },
            });
        },
    ],
};

export default config;
