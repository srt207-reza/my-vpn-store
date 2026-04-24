"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SearchX, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-store-base" dir="rtl">
            {/* هاله‌های نورانی پس‌زمینه - جایگزین رنگ اسپاتیفای با رنگ‌های پرایمری */}
            <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg text-center">
                {/* انیمیشن عدد 404 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative inline-block mb-8"
                >
                    <div className="text-[150px] md:text-[200px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-700 select-none">
                        404
                    </div>
                    {/* آیکون روی عدد صفر */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="bg-store-card p-4 rounded-full border-4 border-store-base shadow-[0_0_50px_rgba(59,130,246,0.3)] mt-4 text-primary">
                            <SearchX className="w-16 h-16" />
                        </div>
                    </motion.div>
                </motion.div>

                {/* متن‌ها */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <h1 className="text-3xl font-bold text-white mb-4">مسیر را گم کرده‌اید!</h1>
                    <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-md mx-auto">
                        صفحه‌ای که به دنبال آن هستید وجود ندارد، نام آن تغییر کرده و یا به صورت موقت از دسترس خارج شده
                        است.
                    </p>
                </motion.div>

                {/* دکمه‌ها */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/"
                        className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-light text-white rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 active:scale-95 font-medium"
                    >
                        <Home className="w-5 h-5" />
                        <span>بازگشت به خانه</span>
                    </Link>

                    <Link
                        href="https://t.me/GetPremium_support"
                        target="_blank"
                        className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-store-panel hover:bg-store-hover border border-store-border text-slate-300 hover:text-white rounded-xl transition-all duration-300 active:scale-95 font-medium"
                    >
                        <span>پشتیبانی</span>
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
