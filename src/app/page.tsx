"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Music, CheckCircle2, Zap, Globe, ArrowLeft, User, Users } from "lucide-react";

export default function HomePage() {
    // اطلاعات کارت محصولات (استخراج شده از فایل PDF)
    const products = [
        {
            id: "individual",
            title: "اسپاتیفای شخصی (Individual)",
            subtitle: "تجربه موسیقی بدون مرز و محدودیت",
            description:
                "اکانت قانونی اسپاتیفای با فعال‌سازی روی ایمیل شخصی شما. حفظ کامل پلی‌لیست‌ها با تحویل سریع در کمتر از ۲۴ ساعت.",
            icon: <User className="w-12 h-12 text-green-400" />,
            features: [
                "فعال‌سازی روی ایمیل شخصی شما",
                "حفظ پلی‌لیست‌ها و دیتای قبلی اکانت",
                "امکان دانلود و پخش آفلاین موسیقی",
                "قابل استفاده در تمامی دستگاه‌ها",
                "تحویل سریع در کمتر از ۲۴ ساعت",
            ],
            color: "from-green-500 to-emerald-400",
            bgHover: "hover:shadow-green-500/20",
            buttonColor: "bg-green-500 hover:bg-green-400",
            href: "/order?product=individual",
        },
        {
            id: "family",
            title: "اسپاتیفای فمیلی (Family)",
            subtitle: "اقتصادی‌ترین انتخاب برای شما",
            description:
                "طرحی بسیار مقرون‌به‌صرفه در بسته‌های ۶ و ۱۲ ماهه. مناسب برای کاربرانی که در سال جاری محدودیت عضویت فمیلی (دو بار در سال) ندارند.",
            icon: <Users className="w-12 h-12 text-emerald-400" />,
            features: [
                "قیمت بسیار اقتصادی و مقرون‌به‌صرفه",
                "ارائه در پلن‌های طولانی ۶ و ۱۲ ماهه",
                "بدون قطعی و تضمین پایداری اشتراک",
                "پرداخت قانونی روی ریجن‌های معتبر",
                "پشتیبانی تا آخرین روز اشتراک",
            ],
            color: "from-emerald-500 to-green-400",
            bgHover: "hover:shadow-emerald-500/20",
            buttonColor: "bg-emerald-500 hover:bg-emerald-400",
            href: "/order?product=family",
        },
    ];

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
            {/* بخش Hero (معرفی) */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-3xl mb-16"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-store-panel border border-store-border text-sm text-slate-300 mb-6">
                    <Music className="w-4 h-4 text-green-400" />
                    <span>تحویل سریع و پشتیبانی مطمئن</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                    دسترسی بی‌حد و مرز به <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-500">
                        دنیای موسیقی اسپاتیفای
                    </span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
                    خرید مطمئن و قانونی اشتراک اسپاتیفای در طرح‌های شخصی و فمیلی. همین حالا پلن مناسب خود را انتخاب کنید
                    و تفاوت گوش دادن به موسیقی با کیفیت پریمیوم را احساس کنید.
                </p>
            </motion.div>

            {/* کارت‌های محصولات */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4"
            >
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        variants={itemVariants}
                        className={`group relative bg-store-panel rounded-3xl p-8 border border-store-border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${product.bgHover}`}
                    >
                        {/* افکت پس‌زمینه درخشان */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}
                        />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                                    {product.icon}
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white! mb-2">{product.title}</h2>
                            <h3
                                className={`text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r ${product.color} mb-4`}
                            >
                                {product.subtitle}
                            </h3>

                            <p className="text-slate-400 text-sm leading-relaxed mb-8 h-16">{product.description}</p>

                            <ul className="space-y-3 mb-8">
                                {product.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                                        <CheckCircle2
                                            className={`w-5 h-5 flex-shrink-0 bg-clip-text bg-gradient-to-br ${product.color} rounded-full bg-slate-800`}
                                        />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={product.href}
                                className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-bold transition-all duration-300 shadow-lg ${product.buttonColor}`}
                            >
                                ثبت سفارش
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* نوار ویژگی‌های کلی */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl text-center border-t border-store-border pt-10 px-4"
            >
                <div className="flex flex-col items-center gap-2">
                    <Globe className="w-8 h-8 text-slate-400 mb-2" />
                    <h4 className="text-white font-medium">پشتیبانی از تمامی اکانت‌ها</h4>
                    <p className="text-xs text-slate-500">بدون محدودیت در ریجن فعلی شما</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-8 h-8 text-slate-400 mb-2" />
                    <h4 className="text-white font-medium">پرداخت امن و قانونی</h4>
                    <p className="text-xs text-slate-500">حفظ کامل امنیت اطلاعات اکانت شما</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Zap className="w-8 h-8 text-slate-400 mb-2" />
                    <h4 className="text-white font-medium">پشتیبانی سریع</h4>
                    <p className="text-xs text-slate-500">پاسخگویی سریع در تلگرام برای رفع مشکلات</p>
                </div>
            </motion.div>
        </div>
    );
}
