"use client";

import { motion } from "framer-motion";
import { 
    Zap, Shield, Infinity, Check, ArrowLeft, Server, 
    Wifi, Globe, Lock, MonitorSmartphone, HelpCircle, Star, Sparkles
} from "lucide-react";
import Link from "next/link";

const BASE_PRICE_PER_GB = 600000;

// اطلاعات پلن‌ها با جزئیات بسیار بیشتر
const plans = [
    { 
        id: 1, 
        volume: 2, 
        isPopular: false, 
        badge: "اقتصادی",
        title: "شروع ملایم",
        desc: "مناسب برای وب‌گردی، پیام‌رسان‌ها و استفاده روزمره.", 
        features: ["دسترسی به تمام سرورها", "سرعت بدون لیمیت", "مناسب ۱ کاربر"]
    },
    { 
        id: 2, 
        volume: 5, 
        isPopular: true, 
        badge: "پیشنهاد ویژه",
        title: "مصرف متوسط",
        desc: "بهترین انتخاب برای شبکه‌های اجتماعی و تماس‌های تصویری.", 
        features: ["دسترسی به تمام سرورها", "سرعت بدون لیمیت", "مناسب ۲ کاربر", "پینگ پایین برای بازی"]
    },
    { 
        id: 3, 
        volume: 10, 
        isPopular: false, 
        badge: "حرفه‌ای",
        title: "دانلود و استریم",
        desc: "ایده‌آل برای تماشای ویدیو در یوتیوب و دانلود فایل‌های متوسط.", 
        features: ["دسترسی به تمام سرورها", "سرعت بدون لیمیت", "ترافیک نیم‌بها داخلی", "مناسب برای استریم HD"]
    },
    { 
        id: 4, 
        volume: 15, 
        isPopular: false, 
        badge: "نامحدودکار",
        title: "حجم بالا",
        desc: "طراحی شده برای استریم 4K، تریدرها و دانلودهای حجیم.", 
        features: ["بالاترین اولویت پورت", "سرعت بدون لیمیت", "آی‌پی کاملا ثابت", "مناسب برای تیم‌ها"]
    },
].map(plan => ({
    ...plan,
    price: plan.volume * BASE_PRICE_PER_GB
}));

// انیمیشن‌ها
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function PlansPage() {
    return (
        <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-store-base text-white relative overflow-hidden" dir="rtl">
            
            {/* هاله‌های نوری پس‌زمینه */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* هدر صفحه */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-full px-5 py-2 mb-6 text-primary backdrop-blur-md"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-semibold tracking-wide">تعرفه سرویس‌های GetPremium</span>
                    </motion.div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-6 pb-2">
                        بدون محدودیت زمانی، <br className="hidden md:block"/> فقط برای حجم پول بدهید
                    </h1>
                    
                    <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                        ترافیک مورد نیاز خود را انتخاب کنید و از اینترنت آزاد، امن و پرسرعت لذت ببرید. 
                        هیچکدام از سرویس‌های ما <strong className="text-white border-b border-primary/50 pb-0.5">تاریخ انقضا ندارند</strong>.
                    </p>
                </motion.div>

                {/* کارت‌های پلن */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-32"
                >
                    {plans.map((plan) => (
                        <motion.div
                            key={plan.id}
                            //@ts-ignore
                            variants={itemVariants}
                            className={`relative rounded-[2rem] p-px transition-all duration-300 hover:-translate-y-2 ${
                                plan.isPopular 
                                    ? "bg-gradient-to-b from-primary via-primary/50 to-transparent shadow-[0_0_40px_rgba(var(--color-primary),0.2)]" 
                                    : "bg-gradient-to-b from-store-border to-transparent hover:from-primary/30"
                            }`}
                        >
                            {plan.isPopular && (
                                <div className="absolute text-nowrap -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 z-10">
                                    <Star className="w-3 h-3 fill-white" />
                                    محبوب‌ترین انتخاب
                                </div>
                            )}

                            <div className="h-full bg-store-panel/90 backdrop-blur-xl rounded-[calc(2rem-1px)] p-6 lg:p-8 flex flex-col relative overflow-hidden">
                                {/* پس‌زمینه کارت محبوب */}
                                {plan.isPopular && (
                                    <div className="absolute top-0 right-0 w-full h-full bg-primary/5 pointer-events-none" />
                                )}

                                <div className="mb-6 relative z-10">
                                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold mb-4 ${plan.isPopular ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-300'}`}>
                                        {plan.badge}
                                    </span>
                                    <div className="flex items-end gap-2 mb-2">
                                        <h3 className="text-4xl font-black text-white">{plan.volume}</h3>
                                        <span className="text-xl text-slate-400 font-medium mb-1">گیگابایت</span>
                                    </div>
                                    <p className="text-sm text-slate-400 h-10">{plan.desc}</p>
                                </div>

                                <div className="mb-8 relative z-10 pb-8 border-b border-store-border/50">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-white">
                                            {plan.price.toLocaleString()}
                                        </span>
                                        <span className="text-slate-400 text-sm">تومان</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8 flex-1 relative z-10">
                                    {/* ویژگی‌های ثابت همه پلن‌ها */}
                                    <div className="flex items-start gap-3 text-sm text-slate-200">
                                        <Infinity className="w-5 h-5 text-primary shrink-0" />
                                        <span>بدون محدودیت زمانی (مادام‌العمر تا اتمام حجم)</span>
                                    </div>
                                    
                                    {/* ویژگی‌های اختصاصی */}
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href={`/order?product=vpn&volume=${plan.volume}`}
                                    className={`relative z-10 w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                                        plan.isPopular
                                            ? "bg-gradient-to-r from-primary to-blue-500 hover:from-primary-light hover:to-blue-400 text-white shadow-lg shadow-primary/25"
                                            : "bg-store-base hover:bg-store-card border border-store-border text-white"
                                    }`}
                                >
                                    سفارش و تحویل آنی
                                    <ArrowLeft className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* بخش ویژگی‌های سرویس (پر کردن صفحه) */}
                <div className="mb-32">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">چرا GetPremium؟</h2>
                        <p className="text-slate-400">تفاوت ما در کیفیت زیرساخت و تعهد به پشتیبانی است.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, title: "سرعت رعد و برق", desc: "استفاده از سرورهای اختصاصی با پورت ۱۰ گیگابیتی برای تجربه‌ای بدون افت سرعت." },
                            { icon: Shield, title: "امنیت نظامی", desc: "رمزنگاری پیشرفته داده‌ها برای حفظ حریم خصوصی شما در شبکه‌های عمومی." },
                            { icon: MonitorSmartphone, title: "سازگار با همه چیز", desc: "قابل استفاده در ویندوز، مک، آیفون، اندروید و حتی روترهای خانگی." },
                        ].map((feature, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-store-panel border border-store-border p-6 rounded-3xl text-center hover:border-primary/50 transition-colors"
                            >
                                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* بخش سوالات متداول ساده */}
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <HelpCircle className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold text-white">سوالات متداول</h2>
                    </div>
                    
                    <div className="space-y-4">
                        {[
                            { q: "آیا در صورت عدم استفاده، حجم من می‌سوزد؟", a: "خیر، سرویس‌های ما هیچگونه محدودیت زمانی ندارند. حجم شما تا آخرین مگابایت قابل استفاده است." },
                            { q: "آیا می‌توانم روی چند دستگاه استفاده کنم؟", a: "بله، لینک‌های اتصال ما بر روی تمامی دستگاه‌ها قابل تنظیم هستند. فقط توجه داشته باشید که مصرف به صورت همزمان از حجم کل کسر می‌شود." },
                            { q: "زمان تحویل سرویس چقدر است؟", a: "بلافاصله پس از پرداخت و تایید سفارش، لینک اتصال و آموزش‌های لازم از طریق پنل کاربری و تلگرام در اختیار شما قرار می‌گیرد." }
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-store-panel/50 border border-store-border p-5 rounded-2xl">
                                <h4 className="text-white font-medium mb-2">{faq.q}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
}
