"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ServerCrash, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        // در اینجا می‌توانید لاگ خطا را به سیستم‌هایی مثل Sentry ارسال کنید
        console.error("Application Error:", error);
    }, [error]);

    return (
        <main
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            dir="rtl"
        >
            {/* افکت‌های پس‌زمینه */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-600/10 rounded-full blur-[80px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="relative bg-slate-900/80 backdrop-blur-xl border border-orange-500/20 rounded-[2rem] p-8 md:p-10 shadow-2xl text-center">
                    {/* آیکون خطا */}
                    <div className="relative mx-auto w-24 h-24 mb-6">
                        <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-pulse blur-xl"></div>
                        <div className="relative flex items-center justify-center w-full h-full bg-slate-900 border border-orange-500/30 rounded-full shadow-inner">
                            <ServerCrash className="w-10 h-10 text-orange-400" />
                        </div>
                    </div>

                    {/* متن‌های خطا */}
                    <h1 className="text-2xl md:text-3xl font-black mb-3 text-white">اوه! خطایی رخ داد</h1>
                    <p className="text-slate-400 leading-relaxed text-sm md:text-base mb-8">
                        متاسفانه در برقراری ارتباط با سرور مشکلی پیش آمده است. ما در حال بررسی و رفع این مشکل هستیم.
                    </p>

                    {/* دکمه‌های عملیاتی */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => reset()} // تلاش مجدد برای رندر کردن صفحه
                            className="group cursor-pointer flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 rounded-xl border border-orange-500/20 transition-all duration-300 active:scale-95 font-medium"
                        >
                            <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
                            <span>تلاش مجدد</span>
                        </button>

                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all duration-300 active:scale-95 font-medium"
                        >
                            <Home className="w-5 h-5" />
                            <span>بازگشت به صفحه اصلی</span>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
