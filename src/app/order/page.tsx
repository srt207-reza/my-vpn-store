// src/app/order/page.tsx

"use client";

import { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronLeft, CreditCard, Copy, Send, Loader2, User, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import RubberVolumeSlider from "@/components/RubberVolumeSlider";

// لیست حجم‌های مجاز بر اساس درخواست
export const ALLOWED_VOLUMES = [2, 3, 4, 5, 10, 15, 20];

// مپینگ دقیق قیمت‌ها (قیمت‌ها به تومان و دقیقاً معادل "هزار تومان" درخواستی تنظیم شده‌اند)
const PRICING_DATA: Record<number, { original?: number; price: number }> = {
    2: { price: 1200000 },
    3: { price: 1800000 },
    4: { price: 2400000 },
    5: { original: 3000000, price: 2900000 },
    10: { original: 6000000, price: 5500000 },
    15: { original: 9000000, price: 7500000 },
    20: { original: 12000000, price: 10000000 },
};

function OrderForm() {
    const searchParams = useSearchParams();
    const productType = searchParams.get("product") || "vpn";

    // بررسی حجم از URL، در صورتی که در لیست مجاز نبود مقدار پیش‌فرض 2 گیگ قرار گیرد
    const urlVolumeParam = parseInt(searchParams.get("volume") || "0", 10);
    const initialVolume = ALLOWED_VOLUMES.includes(urlVolumeParam) ? urlVolumeParam : ALLOWED_VOLUMES[0];

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [supportLink] = useState("https://t.me/GetPremium_support");

    const [formData, setFormData] = useState({
        volume: initialVolume,
        fullName: "",
        contactInfo: "",
    });

    // استخراج قیمت نهایی و قیمت خط‌خورده (در صورت وجود) بر اساس حجم فعلی
    const currentPricing = PRICING_DATA[formData.volume];
    const totalPrice = currentPricing.price;

    const themeBg = "bg-primary hover:bg-cyan-400 text-slate-900";
    const themeColor = "text-primary";

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: totalPrice,
                    type: productType,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setOrderId(data.orderId);
                setStep(4);
                toast.success("سفارش شما با موفقیت ثبت شد.");
            } else {
                throw new Error(data.message || "خطا در ثبت اطلاعات");
            }
        } catch (error: any) {
            toast.error(error.message || "ارتباط با سرور برقرار نشد.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("شماره کارت کپی شد!");
    };

    // هندل کردن ورودی نام (فقط حروف انگلیسی و اسپیس)
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Regex برای بررسی حروف انگلیسی و فاصله
        if (/^[a-zA-Z\s]*$/.test(val)) {
            setFormData({ ...formData, fullName: val });
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full">
            <div className="text-center mb-10">
                {step !== 4 && (
                    <>
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-800/50 border border-slate-700 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                            <ShieldCheck className={`w-10 h-10 ${themeColor}`} />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">خرید ترافیک و اتصال پرسرعت</h1>
                    </>
                )}
                {step < 4 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="flex items-center">
                                {/* کلیک فقط برای عدد ۱ فعال است */}
                                <div
                                    onClick={() => (num === 1 && step > 1 ? setStep(1) : undefined)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all 
                                        ${step >= num ? "bg-primary text-slate-900" : "bg-slate-800 text-slate-400"} 
                                        ${num === 1 && step > 1 ? "cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-offset-slate-900 hover:ring-primary" : ""}`}
                                >
                                    {num}
                                </div>
                                {num < 3 && (
                                    <div
                                        className={`w-12 h-1 transition-colors ${step > num ? "bg-primary" : "bg-slate-800"}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700"
                    >
                        {/* متن راهنمای درخواستی اضافه شد */}
                        <div className="mb-8 p-4 bg-slate-900/60 border border-slate-700/50 rounded-xl text-center">
                            <p className="text-slate-300 text-sm leading-relaxed mb-2">
                                اشتراک راهکار اتصال بدون محدودیت زمانی ارائه می‌شود و میزان استفاده از آن صرفاً بر اساس
                                حجم ترافیک مصرفی محاسبه می‌گردد.
                            </p>
                            <p className="text-primary font-medium text-sm">
                                لطفاً مقدار حجم ترافیک مورد نیاز را انتخاب بفرمایید:
                            </p>
                        </div>

                        <div className="flex flex-col items-center justify-center space-y-10">
                            <div className="w-full max-w-sm">
                                <RubberVolumeSlider
                                    allowedValues={ALLOWED_VOLUMES}
                                    value={formData.volume}
                                    onChange={(val) => setFormData({ ...formData, volume: val })}
                                />
                            </div>

                            <div className="bg-slate-900/80 px-6 py-5 rounded-2xl border border-primary/30 w-full max-w-sm flex justify-between items-center shadow-inner">
                                <span className="text-slate-400 font-medium">مبلغ کل:</span>

                                {/* نمایش قیمت‌ها با در نظر گرفتن تخفیف */}
                                <div className="flex flex-col items-end">
                                    {currentPricing.original && (
                                        <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
                                            <span className="text-sm line-through decoration-red-500/70">
                                                {currentPricing.original.toLocaleString("fa-IR")}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl font-bold text-white">
                                            {totalPrice.toLocaleString("fa-IR")}
                                        </span>
                                        <span className={`text-sm font-bold ${themeColor}`}>تومان</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            className={`w-full cursor-pointer mt-10 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${themeBg}`}
                        >
                            ادامه و ثبت مشخصات <ChevronLeft className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700 space-y-6"
                    >
                        <h2 className="text-lg font-medium text-slate-200 mb-6">مشخصات خود را جهت پیگیری وارد کنید:</h2>
                        <div className="space-y-5">
                            {/* ایمیل به بالای نام منتقل شد */}
                            <div>
                                <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                    <Mail className="w-4 h-4" /> آدرس ایمیل <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.contactInfo}
                                    onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="example@domain.com"
                                    dir="ltr"
                                />
                                <p className="text-xs text-slate-500 mt-2 text-justify">
                                    ارسال کانفیگ و اطلاعات سفارش به این آدرس ایمیل انجام خواهد شد.
                                </p>
                            </div>

                            {/* نام به پایین ایمیل منتقل شد و فقط حروف انگلیسی می‌گیرد */}
                            <div>
                                <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                    <User className="w-4 h-4" /> نام و نام خانوادگی{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleNameChange}
                                    maxLength={50}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Only English Letters (e.g. Ali Hosseini)"
                                    dir="ltr"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-6">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 cursor-pointer py-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                            >
                                بازگشت
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!formData.fullName.trim() || !formData.contactInfo.trim()}
                                className={`flex-1 cursor-pointer py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${themeBg}`}
                            >
                                تایید اطلاعات <ChevronLeft className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700 space-y-6"
                    >
                        <h2 className="text-lg font-medium text-slate-200">پیش‌فاکتور نهایی شما:</h2>

                        <div className="bg-slate-900/60 rounded-2xl p-6 space-y-5 border border-slate-700/50">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">سرویس انتخابی:</span>
                                <span className="text-white font-bold bg-slate-800 px-3 py-1 rounded-lg">
                                    ترافیک اتصال بین‌الملل
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">حجم درخواستی:</span>
                                <span className={`font-bold text-lg ${themeColor}`}>{formData.volume} گیگابایت</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">راه ارتباطی (ایمیل):</span>
                                <span className="text-white font-medium" dir="ltr">
                                    {formData.contactInfo}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">نام خریدار:</span>
                                <span className="text-white font-medium">{formData.fullName}</span>
                            </div>

                            <div className="pt-5 mt-2 border-t border-slate-700 border-dashed flex justify-between items-center">
                                <span className="text-slate-300 font-bold">مبلغ قابل پرداخت:</span>
                                <div className="text-left">
                                    <span className={`text-2xl font-black ${themeColor}`}>
                                        {totalPrice.toLocaleString("fa-IR")}
                                    </span>
                                    <span className="text-slate-400 text-sm mr-1">تومان</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setStep(2)}
                                className="px-6 cursor-pointer py-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                            >
                                اصلاح
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`flex-1 cursor-pointer py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] ${themeBg}`}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
                                ) : (
                                    "ثبت سفارش و دریافت شماره کارت"
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">درخواست شما ثبت شد!</h2>
                        <p className="text-slate-400">
                            کد پیگیری سفارش:{" "}
                            <span className="font-mono text-primary bg-primary/10 px-3 py-1 rounded-lg ml-1 border border-primary/20">
                                {orderId}
                            </span>
                        </p>

                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 md:p-8 rounded-3xl border border-slate-700 relative overflow-hidden mt-8 shadow-2xl">
                            <CreditCard className="absolute -right-4 -top-4 w-32 h-32 text-primary/5 rotate-12" />
                            <div className="relative z-10 space-y-5">
                                <p className="text-slate-300 text-sm text-right leading-relaxed">
                                    جهت دریافت ترافیک، لطفاً مبلغ{" "}
                                    <strong className={`text-lg ${themeColor}`}>
                                        {totalPrice.toLocaleString("fa-IR")} تومان
                                    </strong>{" "}
                                    را به کارت زیر واریز نمایید:
                                </p>

                                {/* کادر شماره کارت: محتوا وسط‌چین شد */}
                                <div className="flex items-center bg-black/40 p-4 md:p-5 rounded-2xl backdrop-blur-sm border border-slate-700/50 shadow-inner">
                                    {/* Wrapper برای وسط‌چین کردن شماره کارت */}
                                    <div className="flex-grow text-center">
                                        <span className="text-xl md:text-2xl font-mono text-white tracking-widest drop-shadow-md">
                                            5022-2915-8438-9710
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard("5022291584389710")}
                                        className="p-3 cursor-pointer text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-colors bg-slate-800"
                                        title="کپی شماره کارت"
                                    >
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* کادر نام صاحب حساب: نام بانک تغییر کرد */}
                                <div className="flex justify-start gap-2 items-center text-sm">
                                    <span className="text-slate-400">به نام:</span>
                                    <span className="text-white font-medium bg-slate-800 px-3 py-1 rounded-lg">
                                        مائده شعاعی (بانک پاسارگاد)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 space-y-5 mt-6">
                            <p className="text-slate-300 text-sm leading-relaxed text-justify">
                                پس از واریز وجه، روی دکمه زیر کلیک کنید و{" "}
                                <strong className="text-primary">تصویر رسید پرداختی</strong> را به همراه{" "}
                                <strong className="text-white">کد پیگیری</strong> در تلگرام برای ما ارسال کنید تا{" "}
                                <strong className="text-red-500">لینک اتصال</strong> شما در سریع‌ترین زمان ممکن صادر
                                شود.
                            </p>
                            <a
                                href={supportLink}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-4 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 bg-[#2AABEE] hover:bg-[#2298D6]"
                            >
                                <Send className="w-5 h-5" /> ارسال رسید به پشتیبانی تلگرام
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function OrderPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
            <Suspense
                fallback={
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                }
            >
                <OrderForm />
            </Suspense>
        </div>
    );
}
