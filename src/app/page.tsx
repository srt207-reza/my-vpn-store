"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
    ShieldCheck,
    ArrowLeft,
    Globe2,
} from "lucide-react";

const World = dynamic(() => import("@/components/ui/globe").then((mod) => mod.World), {
    ssr: false,
    loading: () => <GlobeFallback />,
});

const BrandIcons = {
    Instagram: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    ),
    X: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    Facebook: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    TikTok: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
    ),
    Telegram: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
    ),
    WhatsApp: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
    ),
    Discord: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
            <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.445.865-.608 1.25-1.845-.276-3.68-.276-5.487 0-.164-.393-.406-.874-.618-1.25a.077.077 0 00-.078-.037 19.736 19.736 0 00-4.885 1.515.07.07 0 00-.032.028C.533 9.046-.319 13.58.099 18.058a.082.082 0 00.031.056 19.9 19.9 0 005.993 3.029.078.078 0 00.084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.042-.106c-.653-.247-1.274-.549-1.872-.892a.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.078-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.079.01c.12.099.246.198.373.292a.077.077 0 01-.007.128 12.3 12.3 0 01-1.873.891.077.077 0 00-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 00.084.029 19.866 19.866 0 006.002-3.03.077.077 0 00.031-.055c.5-5.177-.838-9.674-3.548-13.66a.061.061 0 00-.031-.029zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.419-2.157 2.419z" />
        </svg>
    ),
    Youtube: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    ),
    Spotify: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.56 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.539-1.56.299z" />
        </svg>
    ),
    Netflix: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
            <path d="M5.398 0v24h4.811V7.93l6.046 16.07h5.347V0h-4.811v16.071L10.745 0H5.398z" />
        </svg>
    ),
    Twitch: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden="true">
            <path d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.806-6.806v-14.149h-21.851zm19.164 13.074l-4.298 4.298h-5.373l-3.045 3.045v-3.045h-4.836v-15.045h17.552v10.746zm-3.224-6.806v5.731h-2.149v-5.731h2.149zm-5.731 0v5.731h-2.149v-5.731h2.149z" />
        </svg>
    ),
    ChatGPT: () => (
  <svg
    viewBox="0 0 512 509.639"
    fill="currentColor"
    className="h-12 w-12"
    aria-hidden="true"
  >
    <path d="M412.037 221.764a90.834 90.834 0 004.648-28.67 90.79 90.79 0 00-12.443-45.87c-16.37-28.496-46.738-46.089-79.605-46.089-6.466 0-12.943.683-19.264 2.04a90.765 90.765 0 00-67.881-30.515h-.576c-.059.002-.149.002-.216.002-39.807 0-75.108 25.686-87.346 63.554-25.626 5.239-47.748 21.31-60.682 44.03a91.873 91.873 0 00-12.407 46.077 91.833 91.833 0 0023.694 61.553 90.802 90.802 0 00-4.649 28.67 90.804 90.804 0 0012.442 45.87c16.369 28.504 46.74 46.087 79.61 46.087a91.81 91.81 0 0019.253-2.04 90.783 90.783 0 0067.887 30.516h.576l.234-.001c39.829 0 75.119-25.686 87.357-63.588 25.626-5.242 47.748-21.312 60.682-44.033a91.718 91.718 0 0012.383-46.035 91.83 91.83 0 00-23.693-61.553l-.004-.005zM275.102 413.161h-.094a68.146 68.146 0 01-43.611-15.8 56.936 56.936 0 002.155-1.221l72.54-41.901a11.799 11.799 0 005.962-10.251V241.651l30.661 17.704c.326.163.55.479.596.84v84.693c-.042 37.653-30.554 68.198-68.21 68.273h.001zm-146.689-62.649a68.128 68.128 0 01-9.152-34.085c0-3.904.341-7.817 1.005-11.663.539.323 1.48.897 2.155 1.285l72.54 41.901a11.832 11.832 0 0011.918-.002l88.563-51.137v35.408a1.1 1.1 0 01-.438.94l-73.33 42.339a68.43 68.43 0 01-34.11 9.12 68.359 68.359 0 01-59.15-34.11l-.001.004zm-19.083-158.36a68.044 68.044 0 0135.538-29.934c0 .625-.036 1.731-.036 2.5v83.801l-.001.07a11.79 11.79 0 005.954 10.242l88.564 51.13-30.661 17.704a1.096 1.096 0 01-1.034.093l-73.337-42.375a68.36 68.36 0 01-34.095-59.143 68.412 68.412 0 019.112-34.085l-.004-.003zm251.907 58.621l-88.563-51.137 30.661-17.697a1.097 1.097 0 011.034-.094l73.337 42.339c21.109 12.195 34.132 34.746 34.132 59.132 0 28.604-17.849 54.199-44.686 64.078v-86.308c.004-.032.004-.065.004-.096 0-4.219-2.261-8.119-5.919-10.217zm30.518-45.93c-.539-.331-1.48-.898-2.155-1.286l-72.54-41.901a11.842 11.842 0 00-5.958-1.611c-2.092 0-4.15.558-5.957 1.611l-88.564 51.137v-35.408l-.001-.061a1.1 1.1 0 01.44-.88l73.33-42.303a68.301 68.301 0 0134.108-9.129c37.704 0 68.281 30.577 68.281 68.281a68.69 68.69 0 01-.984 11.545v.005zm-191.843 63.109l-30.668-17.704a1.09 1.09 0 01-.596-.84v-84.692c.016-37.685 30.593-68.236 68.281-68.236a68.332 68.332 0 0143.689 15.804 63.09 63.09 0 00-2.155 1.222l-72.54 41.9a11.794 11.794 0 00-5.961 10.248v.068l-.05 102.23zm16.655-35.91l39.445-22.782 39.444 22.767v45.55l-39.444 22.767-39.445-22.767v-45.535z" />
  </svg>
)

};

const globeData = [
    { order: 1, startLat: 35.68, startLng: 51.38, endLat: 52.52, endLng: 13.4, arcAlt: 0.3, color: "#06b6d4" },
    { order: 2, startLat: 35.68, startLng: 51.38, endLat: 51.5, endLng: -0.12, arcAlt: 0.4, color: "#3b82f6" },
    { order: 3, startLat: 35.68, startLng: 51.38, endLat: 40.71, endLng: -74, arcAlt: 0.5, color: "#8b5cf6" },
    { order: 4, startLat: 35.68, startLng: 51.38, endLat: 1.35, endLng: 103.81, arcAlt: 0.3, color: "#10b981" },
    { order: 5, startLat: 35.68, startLng: 51.38, endLat: 52.36, endLng: 4.9, arcAlt: 0.3, color: "#f43f5e" },
];

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
        desc: "دسترسی بی‌وقفه و سریع به تمام دنیا",
        color: "from-pink-500 via-purple-500 to-indigo-500",
        icons: [
            { id: "insta", icon: <BrandIcons.Instagram />, color: "text-pink-500" },
            { id: "x", icon: <BrandIcons.X />, color: "text-slate-100" },
            { id: "facebook", icon: <BrandIcons.Facebook />, color: "text-blue-500" },
            { id: "tiktok", icon: <BrandIcons.TikTok />, color: "text-slate-200" },
        ],
    },
    {
        id: "messengers",
        name: "پیام‌رسان‌های بین‌الملل",
        desc: "ارتباط پایدار و امن با دوستان و همکاران",
        color: "from-blue-400 via-cyan-400 to-teal-400",
        icons: [
            { id: "telegram", icon: <BrandIcons.Telegram />, color: "text-blue-400" },
            { id: "whatsapp", icon: <BrandIcons.WhatsApp />, color: "text-green-500" },
            { id: "discord", icon: <BrandIcons.Discord />, color: "text-indigo-400" },
        ],
    },
    {
        id: "entertainment",
        name: "فیلم و موسیقی",
        desc: "استریم با بالاترین کیفیت ممکن، بدون لگ",
        color: "from-red-500 via-rose-500 to-orange-500",
        icons: [
            { id: "youtube", icon: <BrandIcons.Youtube />, color: "text-red-500" },
            { id: "netflix", icon: <BrandIcons.Netflix />, color: "text-red-600" },
            { id: "spotify", icon: <BrandIcons.Spotify />, color: "text-green-400" },
            { id: "twitch", icon: <BrandIcons.Twitch />, color: "text-purple-400" },
        ],
    },
    {
        id: "ai",
        name: "دستیارهای هوش مصنوعی",
        desc: "عبور از تحریم‌های سرویس‌های هوش مصنوعی",
        color: "from-emerald-400 via-green-500 to-teal-500",
        icons: [{ id: "chatgpt", icon: <BrandIcons.ChatGPT />, color: "text-emerald-400" }],
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
                        <p className="text-sm font-medium text-slate-400">شبکه‌ای به وسعت تمام دنیا</p>
                        <p className="mt-2 text-sm text-slate-500">در حال آماده‌سازی نمایش سه‌بعدی…</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GlobeSection() {
    const scene = useMemo(() => {
        if (typeof window === "undefined") return undefined;
        return undefined;
    }, []);

    return (
        <section className="relative w-full px-2 sm:px-4">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-center rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200/10 bg-white/[0.015] p-3 sm:p-6 lg:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
                {/* تغییر اصلی اینجاست: ارتفاع در موبایل 300px، در تبلت 400px و در دسکتاپ 520px تنظیم شده است */}
                <div className="relative flex h-[300px] sm:h-[400px] lg:h-[520px] w-full items-center justify-center overflow-hidden rounded-[1.25rem] sm:rounded-[1.75rem]">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <World globeConfig={globeConfig} data={globeData} />
                    </div>
                    <div className="absolute bottom-4 sm:bottom-5 z-10 rounded-full border border-slate-200/10 bg-white/[0.04] px-4 py-1.5 sm:px-5 sm:py-2 backdrop-blur-md">
                        <span className="text-[10px] sm:text-xs md:text-sm font-medium text-slate-300">شبکه‌ای به وسعت تمام دنیا</span>
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
                    <span className="mb-3 text-xs font-medium text-slate-400 sm:text-sm">دسترسی آزاد و سریع به</span>
                    <h3
                        className={`mb-5 bg-gradient-to-r ${current.color} bg-clip-text text-4xl font-black text-transparent sm:text-5xl md:text-6xl`}
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
                                className={`group flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-slate-200/10 bg-white/[0.03] shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1 sm:h-24 sm:w-24 ${item.color}`}
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
        { title: "پایداری %99", emoji: "⚡" },
        { title: "اتصال ماهواره ای", emoji: "🛰️" },
        { title: "قیمت رقابتی", emoji: "💎" },
        { title: "پشتیبانی 24 ساعته", emoji: "🎧" },
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
        <div className="flex min-h-[calc(100vh-160px)] flex-col items-center overflow-x-hidden pb-20">
            <section className="mx-auto mt-16 w-full max-w-7xl px-4 sm:mt-20">
                {/* با قرار دادن dir="rtl" روی کانتینر اصلی بخش اول، در دسکتاپ به صورت خودکار متن سمت راست و کره سمت چپ قرار میگیرد */}
                <div dir="rtl" className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
                    {/* متن‌ها (سمت راست) */}
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

                        {/* تایپوگرافی اصلاح شده و بسیار تمیزتر */}
                        <h1 className="mt-8 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl lg:leading-[1.15]">
                            تنها یک اشتراک برای <br className="hidden lg:block" />
                            <span className="mt-1 inline-block bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent pb-2">
                                تمام نیاز های اینترنتی!
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-slate-300/90 sm:text-lg md:text-xl md:leading-9 lg:mx-0">
                            با استفاده از این راهکار، محدودیت‌های دسترسی به اینترنت بین‌الملل برطرف شده و اتصالی پایدار
                            با سرعت بی‌نظیر در اختیار شما قرار خواهد گرفت.
                        </p>

                        <div className="mt-10 flex justify-center lg:justify-start">
                            <Link
                                href="/order?product=vpn"
                                className="group inline-flex items-center justify-center gap-3 rounded-[1.5rem] border border-cyan-300/20 bg-gradient-to-r from-cyan-400 to-sky-300 px-6 py-3.5 text-base font-black text-slate-950 shadow-[0_16px_50px_rgba(6,182,212,0.18)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(6,182,212,0.25)] sm:px-8 sm:py-4 sm:text-lg"
                            >
                                <span>شروع خرید ترافیک</span>
                                <ArrowLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
                            </Link>
                        </div>
                    </motion.header>

                    {/* کره زمین (سمت چپ) */}
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
