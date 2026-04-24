"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, CheckCircle2, Globe, ArrowLeft, Server, Lock } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
    const [trafficVolume, setTrafficVolume] = useState<number>(2);
    const pricePerGB = 600000;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] py-12">
            {/* بخش Hero */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-3xl mb-16"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-store-panel border border-store-border text-sm text-slate-300 mb-6">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>دسترسی امن، سریع و پایدار</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                    اینترنت جهانی بدون مرز با <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-blue-500">
                        GetPremium
                    </span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
                    با راهکار اتصال GetPremium، از اینترنت پایدار و پرسرعت در تمام دنیا لذت ببرید. بدون نگرانی از اتمام
                    زمان اشتراک، فقط هزینه ترافیک مصرفی را پرداخت کنید.
                </p>
            </motion.div>

            {/* بخش محصولات */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4"
                id="plans"
            >
                {/* کارت فعال: خرید ترافیک */}
                <motion.div
                    variants={itemVariants}
                    className="group relative bg-store-panel rounded-3xl p-8 border border-store-border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 border-primary/30 flex flex-col h-full"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-500 opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                                <Zap className="w-12 h-12 text-primary drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-sm text-slate-400 font-medium">تعرفه ثابت</span>
                                <span className="text-lg font-bold text-white">حجمی</span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">راهکار اتصال پرسرعت</h2>
                        <h3 className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 mb-6">
                            اینترنت پایدار و بدون محدودیت زمانی
                        </h3>

                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            دسترسی به اینترنت آزاد جهانی با پرداخت بر اساس حجم. حداقل خرید ۲ گیگابایت (هر گیگابایت ۶۰۰
                            هزار تومان). انتخاب حجم در مرحله بعد انجام می‌شود.
                        </p>

                        <ul className="space-y-4 mb-8 flex-grow">
                            {[
                                "سرعت بالا و پایداری ۹۹٪",
                                "مناسب برای ترید و IP ثابت",
                                "بدون محدودیت در تعداد کاربر و زمان",
                                "قابل استفاده در تمامی سیستم‌عامل‌ها",
                                "پشتیبانی ۲۴ ساعته",
                            ].map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-primary" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/order?product=vpn"
                            className="flex items-center justify-center gap-2 w-full py-4 mt-auto rounded-xl text-slate-900 font-bold transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] bg-primary hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                        >
                            خرید ترافیک
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>

                {/* کارت قفل شده با تم طلایی: سرور اختصاصی */}
                <motion.div
                    variants={itemVariants}
                    className="group relative bg-store-panel/50 rounded-3xl p-8 border border-store-border/50 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-400 opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300" />

                    <div className="relative z-10 opacity-70">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30">
                                <Server className="w-12 h-12 text-amber-500" />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs rounded-full border border-amber-500/20 flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    بزودی
                                </span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">سرور اختصاصی VIP</h2>
                        <h3 className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4">
                            بالاترین سطح امنیت و منابع اختصاصی
                        </h3>

                        <p className="text-slate-400 text-sm leading-relaxed mb-8 h-16">
                            سرور مجازی اختصاصی با منابع تضمین شده، مناسب برای شرکت‌ها و کاربرانی که نیاز به بالاترین سطح
                            پایداری دارند.
                        </p>

                        <ul className="space-y-3 mb-8">
                            {[
                                "منابع کاملاً اختصاصی (RAM & CPU)",
                                "پهنای باند نامحدود",
                                "آپتایم ۹۹.۹۹٪ تضمینی",
                                "IP ثابت اختصاصی",
                                "پیکربندی رایگان",
                            ].map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-sm text-slate-400">
                                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-amber-500/50" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            disabled
                            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-slate-400 font-bold bg-slate-800/50 border border-slate-700/50 cursor-not-allowed"
                        >
                            در حال حاضر ناموجود
                        </button>
                    </div>
                </motion.div>
            </motion.div>

            {/* نوار ویژگی‌های کلی */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl text-center border-t border-store-border pt-10 px-4"
            >
                <div className="flex flex-col items-center gap-2">
                    <Globe className="w-8 h-8 text-primary mb-2" />
                    <h4 className="text-white font-medium">پشتیبانی از تمامی اپراتورها</h4>
                    <p className="text-xs text-slate-500">بدون محدودیت در اتصال اینترنت شما</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-8 h-8 text-primary mb-2" />
                    <h4 className="text-white font-medium">اتصال امن و ماهواره‌ای</h4>
                    <p className="text-xs text-slate-500">حفظ کامل امنیت اطلاعات و حریم خصوصی</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Zap className="w-8 h-8 text-primary mb-2" />
                    <h4 className="text-white font-medium">پشتیبانی ۲۴ ساعته</h4>
                    <p className="text-xs text-slate-500">پاسخگویی سریع در تلگرام برای رفع مشکلات</p>
                </div>
            </motion.div>
        </div>
    );
}
