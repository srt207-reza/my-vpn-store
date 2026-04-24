"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    User,
    CheckCircle2,
    AlertTriangle,
    ShieldCheck,
    Music,
    Smartphone,
    Zap,
    Sparkles,
    ChevronLeft,
} from "lucide-react";

export default function SpotifyIndividual() {
    const plans = [
        { id: "1month", duration: "1 ماهه", price: "555,000", popular: false },
        { id: "3month", duration: "3 ماهه", price: "1,555,000", popular: false },
        { id: "6month", duration: "6 ماهه", price: "2,999,000", popular: true },
        { id: "12month", duration: "12 ماهه", price: "4,999,000", popular: false },
    ];

    const benefits = [
        {
            icon: Smartphone,
            title: "فعال‌سازی جامع",
            desc: "قابل فعالسازی بر روی کلیه حساب‌های کاربری اسپاتیفای بدون محدودیت ریجن.",
        },
        {
            icon: ShieldCheck,
            title: "حفظ 100% اطلاعات",
            desc: "حفظ کامل اطلاعات ذخیره‌شده (پلی‌لیست‌ها، لایک‌ها) در حساب کاربری شما بدون هیچ‌گونه افت.",
        },
        { icon: Zap, title: "پایداری قطعی", desc: "بدون ریسک‌های مربوط به محدودیت آدرس یا خارج شدن از فمیلی." },
    ];

    return (
        <div className="min-h-screen bg-store-base text-white font-sans overflow-hidden" dir="rtl">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-spotify/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-16 relative z-10 space-y-24">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 max-w-3xl mx-auto mt-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-spotify/10 border border-spotify/20 text-spotify-light text-sm font-bold mb-4">
                        <Sparkles className="w-4 h-4" />
                        بالاترین سطح دسترسی اسپاتیفای
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-l from-white via-white to-spotify/70">
                        طرح شخصی اسپاتیفای <br className="hidden md:block" /> (Individual Plan)
                    </h1>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        بدون هیچ‌گونه محدودیت فمیلی، از موسیقی با بالاترین کیفیت لذت ببرید. این طرح امن‌ترین و
                        پایدارترین روش برای پریمیوم‌سازی اکانت شخصی شماست. پیش از انتخاب، ویژگی‌ها و قوانین را مطالعه
                        نمایید.
                    </p>
                </motion.div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {benefits.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-store-panel backdrop-blur-sm border border-store-border p-8 rounded-3xl hover:bg-store-hover transition-colors"
                            >
                                <div className="bg-spotify/10 gap-4 rounded-2xl flex items-center justify-start flex-row mb-6">
                                    <Icon className="w-7 h-7 text-spotify-light" />
                                    <h3 className="text-xl font-bold">{item.title}</h3>
                                </div>
                                <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Pricing Section */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-2">تعرفه‌های طرح شخصی</h2>
                        <p className="text-slate-400">
                            پلن مورد نظر خود را انتخاب کرده و مراحل ثبت سفارش را تکمیل کنید
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative bg-store-panel backdrop-blur-md border ${plan.popular ? 'border-[#1ED760] shadow-lg shadow-[#1ED760]/20' : "border-store-border"} rounded-3xl p-6 hover:-translate-y-2 transition-all flex flex-col`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1ED760] text-black text-xs font-bold px-4 py-1 rounded-full">
                                        پیشنهاد ویژه
                                    </div>
                                )}
                                <div className="mb-6 flex-grow">
                                    <h3 className="text-xl font-bold text-white mb-2">طرح {plan.duration}</h3>
                                    <div className="text-3xl font-black text-[#1ED760] my-4">
                                        {plan.price} <span className="text-sm text-slate-400 font-normal">تومان</span>
                                    </div>
                                    <ul className="space-y-3 mt-6">
                                        <li className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle2 className="w-4 h-4 text-[#1ED760]" /> فعال‌سازی روی اکانت شما
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle2 className="w-4 h-4 text-[#1ED760]" /> بدون قطعی و پریدن
                                        </li>
                                    </ul>
                                </div>
                                <Link 
                                    href={`/order?product=individual&plan=${plan.id}`}
                                    className={`w-full py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors ${
                                        plan.popular ? 'bg-[#1ED760] text-white hover:bg-[#1db954]' : 'bg-slate-800 text-white hover:bg-slate-700'
                                    }`}
                                >
                                    ثبت سفارش
                                    <ChevronLeft className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Important Rules Banner */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="bg-gradient-to-r from-red-500/10 to-store-panel border border-red-500/20 p-8 md:p-10 rounded-3xl flex flex-col md:flex-row gap-8 items-center"
                >
                    <div className="p-4 bg-red-500/10 rounded-full shrink-0">
                        <AlertTriangle className="w-12 h-12 text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-3 text-white">قوانین لغو و بازگشت وجه</h3>
                        <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                            مشتری گرامی، با توجه به قوانین سخت‌گیرانه اسپاتیفای برای طرح‌های انفرادی،{" "}
                            <strong className="text-white">
                                پس از انجام پرداخت و شروع فرآیند فعالسازی طرح شخصی، امکان لغو سفارش یا بازگشت مبلغ تحت
                                هیچ شرایطی وجود نخواهد داشت.
                            </strong>{" "}
                            لطفاً پیش از هدایت به صفحه سفارش، از انتخاب خود اطمینان کامل حاصل فرمایید. این طرح تنها
                            راهکار جایگزین در صورتی است که محدودیت‌های طرح فمیلی اجازه فعال‌سازی ندهد.
                        </p>
                    </div>
                </motion.div>

                {/* Bottom CTA */}
                <div className="text-center pb-10">
                    <h3 className="text-2xl font-bold mb-6">آماده ورود به دنیای موسیقی بدون مرز هستید؟</h3>
                    <Link
                        href="/order?product=individual&plan=1month"
                        className="inline-flex items-center gap-2 bg-spotify text-white hover:bg-spotify-light px-8 py-4 rounded-full font-bold transition-colors"
                    >
                        <Music className="w-5 h-5" />
                        شروع سفارش سریع
                    </Link>
                </div>
            </div>
        </div>
    );
}
