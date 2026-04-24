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
                // پالت رنگی اصلی اسپاتیفای
                spotify: {
                    DEFAULT: "#1DB954", // سبز کلاسیک اسپاتیفای
                    light: "#1ED760",   // سبز روشن‌تر (استفاده برای هاور دکمه‌ها و برندینگ جدید)
                    dark: "#1AA34A",
                    press: "#169C46",   // زمان کلیک روی دکمه‌ها
                },
                // رنگ‌های پایه و ساختاری (کاملا منطبق بر UI اسپاتیفای)
                store: {
                    base: "#000000",    // پس‌زمینه اصلی (مشکی مطلق در اسپاتیفای)
                    panel: "#121212",   // پس‌زمینه سایدبارها و بخش‌های اصلی
                    card: "#181818",    // پس‌زمینه کارت‌های محصول/پلی‌لیست
                    hover: "#282828",   // رنگ کارت‌ها و ردیف‌ها هنگام هاور (Hover)
                    border: "#2A2A2A",  // خطوط جداکننده ملایم
                    text: "#FFFFFF",    // رنگ متن اصلی
                    muted: "#B3B3B3",   // رنگ متن فرعی (توضیحات کارت‌ها)
                    success: "#1ED760", // پیام‌های موفقیت
                    warning: "#FFA42B", // اخطارها
                    danger: "#E22134",  // خطاها
                },
                background: "var(--background)",
                foreground: "var(--foreground)",
                border: "var(--border)",
            },
            fontFamily: {
                vazir: ["var(--font-vazirmatn)", "sans-serif"],
                iransans: ["IRANSans", "sans-serif"],
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
                "float": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-8px)" },
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
                "float": "float 3s ease-in-out infinite",
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        function ({ addUtilities }: any) {
            addUtilities({
                // مخفی کردن اسکرول‌بار
                ".scrollbar-hide": {
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                    "&::-webkit-scrollbar": { display: "none" },
                },
                // افکت درخشش ملایم برای متمایز کردن عناصر (آپدیت شده با رنگ اسپاتیفای)
                ".box-glow-spotify": {
                    boxShadow: '0 0 20px rgba(29, 185, 84, 0.15), inset 0 0 10px rgba(29, 185, 84, 0.05)',
                }
            });
        },
    ],
};

export default config;
