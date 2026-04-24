"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, CheckCircle2, AlertCircle, Clock, Zap, ShieldAlert, Globe, ChevronLeft, AlertTriangle } from "lucide-react";

export default function SpotifyFamily() {
    const plans = [
        { id: "6month", duration: "6 ماهه", price: "1,660,000", badge: "اقتصادی" },
        { id: "12month", duration: "12 ماهه", price: "2,660,000", badge: "بهترین انتخاب" },
    ];

    const features = [
        { icon: Zap, title: "مقرون‌به‌صرفه", desc: "هزینه پرداختی برای این طرح در مقایسه با طرح فردی بسیار اقتصادی‌تر و مناسب برای استفاده طولانی‌مدت است." },
        { icon: Clock, title: "فعال‌سازی سریع", desc: "در صورت صحت اطلاعات حساب و عدم فعال بودن پرمیوم، در کمتر از 24 ساعت انجام می‌شود." },
        { icon: ShieldAlert, title: "ضمانت زمان باقیمانده", desc: "در صورت بروز مشکل قطعی، زمان باقیمانده به عنوان کد تخفیف برای ارتقا به طرح شخصی ارائه می‌گردد." },
    ];

    return (
        <div className="min-h-screen bg-store-base text-white font-sans overflow-hidden" dir="rtl">
            {/* Background Effects */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-16 relative z-10 space-y-24">
                
                {/* Hero Section */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 max-w-3xl mx-auto mt-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-4">
                        <Users className="w-4 h-4" />
                        اقتصادی‌ترین روش پرمیوم‌سازی
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-l from-white via-white to-emerald-400/80">
                        طرح فمیلی اسپاتیفای <br className="hidden md:block"/> (Family Plan)
                    </h1>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        طرح‌های فمیلی در دو بسته زمانی ۶ و ۱۲ ماهه با قیمتی بسیار رقابتی ارائه می‌شوند. با توجه به قوانین خاص اسپاتیفای در این پلن، مطالعه دقیق محدودیت‌ها پیش از ورود به صفحه سفارش الزامی است.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} 
                                className="bg-store-panel backdrop-blur-sm border border-store-border p-8 rounded-3xl hover:bg-store-hover transition-colors">
                                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                                    <Icon className="w-7 h-7 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Pricing Section */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-2">بسته‌های بلندمدت فمیلی</h2>
                        <p className="text-slate-400">به دلیل محدودیت‌های تغییر آدرس در سال، این پلن تنها در بازه‌های طولانی ارائه می‌گردد</p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`w-full md:w-1/2 relative bg-store-panel backdrop-blur-md border ${index === 1 ? 'border-emerald-500 shadow-xl shadow-emerald-500/20' : 'border-store-border'} rounded-3xl p-8 hover:-translate-y-2 transition-all flex flex-col`}
                            >
                                <div className="absolute top-6 left-6 bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20">
                                    {plan.badge}
                                </div>
                                <div className="mb-8 flex-grow">
                                    <h3 className="text-xl font-bold text-white mb-2">اشتراک فمیلی {plan.duration}</h3>
                                    <div className="text-4xl font-black text-emerald-400 my-6">
                                        {plan.price} <span className="text-sm text-slate-400 font-normal">تومان</span>
                                    </div>
                                    <ul className="space-y-3 mt-6">
                                        <li className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> قیمت بسیار مقرون‌به‌صرفه
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> ضمانت بازگشت زمان باقیمانده (کد تخفیف)
                                        </li>
                                    </ul>
                                </div>
                                <Link 
                                    href={`/order?product=family&plan=${plan.id}`}
                                    className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors ${
                                        index === 1 ? 'bg-emerald-500 text-white hover:bg-emerald-400' : 'bg-store-card text-white hover:bg-store-hover'
                                    }`}
                                >
                                    انتقال به صفحه سفارش
                                    <ChevronLeft className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Limitations and Rules Section */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8 text-amber-400">
                        <AlertCircle className="w-8 h-8" />
                        <h3 className="text-2xl font-bold text-white">محدودیت‌ها و قوانین اختصاصی فمیلی</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="flex gap-4">
                            <div className="shrink-0 mt-1">
                                <Users className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-2 text-lg">محدودیت تغییر اعضای فمیلی</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">تغییر اعضای فمیلی در اسپاتیفای <strong className="text-amber-400">تنها دو مرتبه در هر سال</strong> امکان‌پذیر است. به همین جهت، این اشتراک‌ها فقط در دوره‌های 6 و 12 ماهه عرضه می‌شوند.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="shrink-0 mt-1">
                                <Globe className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-2 text-lg">محدودیت‌های محتوایی (موقعیت مکانی)</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">برخی قابلیت‌ها مانند پادکست، پلی‌لیست‌های اختصاصی و ویدیو موزیک‌ها ممکن است بر اساس ریجن (موقعیت مکانی) و قوانین اسپاتیفای در دسترس نباشند.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 md:col-span-2">
                            <div className="shrink-0 mt-1">
                                <AlertTriangle className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-2 text-lg">قوانین IP و قطعی‌های احتمالی</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">رعایت محدودیت‌های IP در حین استفاده الزامی است. در صورت بروز هرگونه مشکل و خروج کاربر از فمیلی، مدت زمان باقیمانده سوخت نمی‌شود بلکه به صورت کد تخفیف جهت ارتقا به طرح شخصی به کاربر عودت داده می‌شود.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center pb-10">
                    <h3 className="text-2xl font-bold mb-6 text-slate-200">با مطالعه قوانین بالا، آماده ثبت سفارش هستید؟</h3>
                    <Link href="/order?product=family&plan=6month" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                        انتقال به مرحله نهایی سفارش
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
