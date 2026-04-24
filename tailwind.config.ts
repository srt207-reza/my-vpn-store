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
                // پالت رنگی اصلی GetPremium (فیروزه‌ای سایبری)
                primary: {
                    DEFAULT: "#06B6D4", // فیروزه‌ای اصلی (cyan-500 - نماد سرعت)
                    light: "#22D3EE", // فیروزه‌ای روشن‌تر (cyan-400 - برای هاور)
                    dark: "#0891B2", // فیروزه‌ای تیره‌تر (cyan-600)
                    press: "#0E7490", // زمان کلیک روی دکمه‌ها
                },
                accent: {
                    DEFAULT: "#F59E0B", // طلایی/کهربایی (amber-500 - برای نشان‌های VIP و پریمیوم)
                    light: "#FBBF24",
                },
                // رنگ‌های پایه و ساختاری (Dark Cyber)
                store: {
                    base: "#0F172A", // پس‌زمینه اصلی (slate-900 - سورمه‌ای بسیار تیره)
                    panel: "#0F172A", // پس‌زمینه سایدبارها و بخش‌های اصلی
                    card: "#1E293B", // پس‌زمینه کارت‌های محصول (slate-800)
                    hover: "#334155", // رنگ کارت‌ها و ردیف‌ها هنگام هاور (slate-700)
                    border: "#334155", // خطوط جداکننده ملایم
                    text: "#F8FAFC", // رنگ متن اصلی (سفید شفاف)
                    muted: "#94A3B8", // رنگ متن فرعی (خاکستری سایبری)
                    success: "#10B981", // پیام‌های موفقیت
                    warning: "#F59E0B", // اخطارها
                    danger: "#EF4444", // خطاها
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
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-8px)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
                float: "float 3s ease-in-out infinite",
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
                // افکت درخشش ملایم برای متمایز کردن عناصر (آپدیت شده با رنگ فیروزه‌ای)
                ".box-glow-primary": {
                    boxShadow: "0 0 20px rgba(6, 182, 212, 0.15), inset 0 0 10px rgba(6, 182, 212, 0.05)",
                },
            });
        },
    ],
};

export default config;
