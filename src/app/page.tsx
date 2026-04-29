"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Globe2 } from "lucide-react";
import BrandIcons from "@/data/brand-icons";

const World = dynamic(() => import("@/components/ui/globe").then((mod) => mod.World), {
    ssr: false,
    loading: () => <GlobeFallback />,
});

type ServerLocation = {
    name: string;
    lat: number;
    lng: number;
    color: string;
};

const serverLocations: ServerLocation[] = [
    { name: "آلمان", lat: 52.52, lng: 13.405, color: "#06b6d4" },
    { name: "هلند", lat: 52.3676, lng: 4.9041, color: "#3b82f6" },
    { name: "آمریکا", lat: 40.7128, lng: -74.006, color: "#8b5cf6" },
    { name: "کانادا", lat: 43.6532, lng: -79.3832, color: "#10b981" },
    { name: "انگلستان", lat: 51.5074, lng: -0.1278, color: "#f43f5e" },
    { name: "فنلاند", lat: 60.1699, lng: 24.9384, color: "#14b8a6" },
    { name: "ایتالیا", lat: 45.4642, lng: 9.19, color: "#22c55e" },
    { name: "امارات", lat: 25.2048, lng: 55.2708, color: "#f59e0b" },
    { name: "ارمنستان", lat: 40.1792, lng: 44.4991, color: "#ef4444" },
    { name: "ترکیه", lat: 41.0082, lng: 28.9784, color: "#ec4899" },
    { name: "هند", lat: 19.076, lng: 72.8777, color: "#a855f7" },
    { name: "مصر", lat: 30.0444, lng: 31.2357, color: "#06b6d4" },
    { name: "پاکستان", lat: 24.8607, lng: 67.0011, color: "#3b82f6" },
    { name: "نیجریه", lat: 6.5244, lng: 3.3792, color: "#10b981" },
];

const globeData = serverLocations.map((server, index) => ({
    order: index + 1,
    startLat: 35.68,
    startLng: 51.38,
    endLat: server.lat,
    endLng: server.lng,
    arcAlt: 0.22 + (index % 4) * 0.05,
    color: server.color,
}));

const globeConfig = {
    pointSize: 1,
    globeColor: "#1d072e",
    showAtmosphere: true,
    atmosphereColor: "#ffffff",
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
};

const platformsData = [
    {
        id: "social",
        name: "شبکه‌های اجتماعی",
        desc: "اتصال سریع و بدون محدودیت به شبکه های اجتماعی",
        color: "from-pink-500 via-purple-500 to-indigo-500",
        icons: [
            { id: "insta", icon: <BrandIcons.Instagram className="w-8 h-8" />, color: "text-pink-500" },
            { id: "x", icon: <BrandIcons.X className="w-8 h-8" />, color: "text-slate-100" },
            { id: "facebook", icon: <BrandIcons.Facebook className="w-8 h-8" />, color: "text-blue-500" },
            { id: "tiktok", icon: <BrandIcons.TikTok className="w-8 h-8" />, color: "text-slate-200" },
        ],
    },
    {
        id: "messengers",
        name: "پیام‌رسان‌های بین‌الملل",
        desc: "ارتباط امن و بدون محدودیت با سایر کاربران در سراسر دنیا",
        color: "from-blue-400 via-cyan-400 to-teal-400",
        icons: [
            { id: "telegram", icon: <BrandIcons.Telegram className="w-8 h-8" />, color: "text-blue-400" },
            { id: "whatsapp", icon: <BrandIcons.WhatsApp className="w-8 h-8" />, color: "text-green-500" },
            { id: "signal", icon: <BrandIcons.Signal className="w-8 h-8" />, color: "text-blue-500" },
            { id: "Threads", icon: <BrandIcons.Threads className="w-8 h-8" />, color: "" },
        ],
    },
    {
        id: "entertainment",
        name: "سرویس های پخش فیلم و موسیقی",
        desc: "دسترسی بدون وقفه به کلیه اشتراک های پرمیوم فیلم و موسیقی",
        color: "from-red-500 via-rose-500 to-orange-500",
        icons: [
            { id: "spotify", icon: <BrandIcons.Spotify className="w-8 h-8" />, color: "text-green-400" },
            { id: "apple", icon: <BrandIcons.AppleMusic className="w-8 h-8" />, color: "text-slate-200" },
            { id: "youtube", icon: <BrandIcons.YouTube className="w-8 h-8" />, color: "text-red-500" },
            { id: "netflix", icon: <BrandIcons.Netflix className="w-8 h-8" />, color: "text-red-600" },
        ],
    },
    {
        id: "ai",
        name: "دستیارهای هوش مصنوعی",
        desc: "دسترسی کامل به تمام امکانات و قابلیت های پیشرفته ابزار های هوش مصنوعی",
        color: "from-emerald-400 via-green-500 to-teal-500",
        icons: [
            { id: "chatgpt", icon: <BrandIcons.ChatGPT className="w-8 h-8" />, color: "text-emerald-400" },
            { id: "grok", icon: <BrandIcons.Grok className="w-8 h-8" />, color: "text-slate-200" },
            { id: "gemini", icon: <BrandIcons.Gemini className="w-8 h-8" />, color: "text-blue-400" },
            { id: "copilot", icon: <BrandIcons.Copilot className="w-8 h-8" />, color: "text-cyan-400" },
        ],
    },
    {
        id: "crypto",
        name: "کیف پول و ارز دیجیتال",
        desc: "مدیریت امن دارایی های دیجیتال با آیپی ثابت و بدون نگرانی از مسدودیت حساب",
        color: "from-amber-400 via-orange-500 to-red-500",
        icons: [
            { id: "binance", icon: <BrandIcons.Binance className="w-8 h-8" />, color: "text-yellow-400" },
            { id: "builtbybit", icon: <BrandIcons.Builtbybit className="w-8 h-8" />, color: "text-blue-500" },
            { id: "coinbase", icon: <BrandIcons.Coinbase className="w-8 h-8" />, color: "text-sky-500" },
            { id: "kucoin", icon: <BrandIcons.Kucoin className="w-8 h-8" />, color: "text-green-500" },
        ],
    },
];
function GlobeFallback() {
    return (
        <div className="flex h-full w-full items-center justify-center px-4" aria-label="در حال بارگذاری کره زمین">
            <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200/10 bg-white/[0.02] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-sm sm:p-10">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative flex h-44 w-44 items-center justify-center sm:h-56 sm:w-56">
                        <div className="absolute inset-0 animate-pulse rounded-full border border-slate-200/10" />
                        <div className="absolute inset-6 rounded-full border border-slate-200/10" />
                        <div className="absolute inset-12 rounded-full border border-slate-200/10" />
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-200/10 bg-white/[0.03]">
                            <Globe2 className="h-10 w-10 text-slate-300/80" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-slate-400">سرور فعال</p>
                        <p className="mt-2 text-sm text-slate-500">در حال آماده‌سازی نمایش سه‌بعدی…</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GlobeSection() {
    const [currentServerIndex, setCurrentServerIndex] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setCurrentServerIndex((prev) => (prev + 1) % serverLocations.length);
        }, 2200);

        return () => window.clearInterval(timer);
    }, []);

    const activeServer = serverLocations[currentServerIndex];

    return (
        <section className="relative w-full px-2 sm:px-4">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-center rounded-[1.5rem] border border-slate-200/10 bg-white/[0.015] p-3 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:rounded-[2rem] sm:p-6 pb-6 lg:p-8">
                <div className="relative flex h-[300px] w-full items-center justify-center rounded-[1.25rem] sm:h-[400px] sm:rounded-[1.75rem] lg:h-[520px]">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <World globeConfig={globeConfig} data={globeData} />
                    </div>

                    <div className="absolute -bottom-3 z-10 rounded-full border border-slate-200/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md sm:bottom-0 sm:px-5 sm:py-2">
                        <span className="text-[10px] font-medium text-slate-300 sm:text-xs md:text-sm">
                            سرور فعال: <strong className="text-cyan-400">{activeServer.name}</strong>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

function PlatformCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % platformsData.length);
        }, 4500);
        return () => window.clearInterval(timer);
    }, []);

    const current = platformsData[currentIndex];

    return (
        <div className="relative mx-auto flex h-[350px] w-full max-w-5xl items-center justify-center px-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="flex w-full flex-col items-center text-center"
                >
                    <span className="mb-3 text-xs font-medium text-slate-400 sm:text-sm">دسترسی آزاد و امن به</span>
                    <h3
                        className={`bg-gradient-to-r ${current.color} bg-clip-text py-5 text-4xl font-black text-transparent sm:text-5xl md:text-6xl`}
                    >
                        {current.name}
                    </h3>
                    <p className="mb-10 max-w-xl text-base text-slate-300 sm:text-lg md:text-xl">{current.desc}</p>

                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
                        {current.icons.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ delay: 0.05 + idx * 0.08, type: "spring", stiffness: 220, damping: 18 }}
                                className={`group flex h-20 w-20 items-center justify-center rounded-[1.5rem]  transition-transform duration-300 hover:-translate-y-1 sm:h-24 sm:w-24 ${item.color}`}
                            >
                                <div className="scale-100 transition-transform duration-300 group-hover:scale-105">
                                    {item.icon}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default function HomePage() {
    const features = [
        { title: "سرعت بالا", emoji: "🚀" },
        { title: "پایداری اتصال ٪۹۹", emoji: "⛵️" },
        { title: "اتصال ماهواره ای", emoji: "🛰️" },
        { title: "قیمت رقابتی", emoji: "💵" },
        { title: "پشتیبانی ۲۴ ساعته", emoji: "👨‍💻" },
        { title: "بدون محدودیت کاربر", emoji: "👥" },
        { title: "بدون محدودیت زمان", emoji: "⏳" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    return (
        <div className="flex min-h-[calc(100vh-160px)] flex-col items-center pb-20">
            <section className="mx-auto mt-16 w-full max-w-7xl px-4 sm:mt-20">
                <div dir="rtl" className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
                    <motion.header
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className="text-center lg:text-right"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/10 bg-white/[0.03] px-5 py-2 text-xs font-medium text-slate-300 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:text-sm">
                            <ShieldCheck className="h-4 w-4 text-cyan-400" />
                            <span>دسترسی امن، سریع و پایدار در سراسر کشور</span>
                        </div>

                        <h1 className="mt-8 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl lg:leading-[1.15]">
                            تنها یک اشتراک برای <br className="hidden lg:block" />
                            <span className="mt-1 inline-block bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text pb-2 text-transparent">
                                تمام نیاز های اینترنتی!
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 w-full px-6 text-base leading-relaxed text-slate-300/90 sm:text-lg md:text-xl md:leading-9 lg:mx-0">
                            با استفاده از این راهکار، محدودیت‌های دسترسی به اینترنت بین‌الملل برطرف شده و اتصال پایدار
                            با سرعت بالا در اختیار شما قرار خواهد گرفت.
                        </p>

                        <div className="mt-10 flex justify-center lg:justify-start">
                            <Link
                                href="/order?product=vpn"
                                className="group inline-flex items-center justify-center gap-3 rounded-[1.5rem] border border-cyan-300/20 bg-gradient-to-r from-cyan-400 to-sky-300 px-6 py-3.5 text-base font-black text-slate-950 shadow-[0_16px_50px_rgba(6,182,212,0.18)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(6,182,212,0.25)] sm:px-8 sm:py-4 sm:text-lg"
                            >
                                <span>خرید اشتراک</span>
                                <ArrowLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
                            </Link>
                        </div>
                    </motion.header>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        className="flex justify-center lg:justify-end"
                    >
                        <div className="w-full max-w-[620px]">
                            <GlobeSection />
                        </div>
                    </motion.div>
                </div>
            </section>

            <motion.section
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="mt-20 w-full px-4 sm:mt-24"
            >
                <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
                    <h2 className="text-3xl font-bold text-white md:text-5xl">راهکار اتصال پرسرعت</h2>
                    <p className="mx-auto mb-16 mt-5 max-w-2xl text-lg text-slate-400 md:text-xl">
                        اینترنت پایدار، بدون مرز و بدون محدودیت زمانی. تجربه‌ای متفاوت از وب‌گردی.
                    </p>

                    <div className="mb-20 flex w-full flex-wrap justify-center gap-5 sm:gap-7 md:gap-9">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="group flex flex-col items-center gap-4"
                            >
                                <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-slate-200/10 bg-white/[0.03] text-white shadow-[0_12px_35px_rgba(15,23,42,0.08)] transition-transform duration-300 group-hover:-translate-y-1 sm:h-24 sm:w-24">
                                    <span className="text-4xl">{feature.emoji}</span>
                                </div>
                                <span className="text-center text-sm font-medium text-slate-300 sm:text-base md:text-lg">
                                    {feature.title}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="w-full"
            >
                <PlatformCarousel />
            </motion.section>
        </div>
    );
}
