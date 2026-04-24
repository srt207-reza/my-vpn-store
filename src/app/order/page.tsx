"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Music,
    CheckCircle2,
    ChevronLeft,
    CreditCard,
    Copy,
    Send,
    Loader2,
    AlertCircle,
    Users,
    User,
    Lock,
    Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import BirthDatePicker from "@/components/BirthDatePicker";

// داده‌های قیمت‌گذاری استخراج شده از فایل PDF
const PRICING = {
    individual: [
        {
            id: "ind-1m",
            durationMonths: 1,
            title: "اشتراک ۱ ماهه",
            price: 555000,
            desc: "تجربه موسیقی بدون مرز (تحویل سریع)",
        },
        { id: "ind-3m", durationMonths: 3, title: "اشتراک ۳ ماهه", price: 1555000, desc: "پکیج سه ماهه شخصی" },
        { id: "ind-6m", durationMonths: 6, title: "اشتراک ۶ ماهه", price: 2999000, desc: "پکیج شش ماهه شخصی" },
        {
            id: "ind-12m",
            durationMonths: 12,
            title: "اشتراک ۱۲ ماهه",
            price: 4999000,
            desc: "بهترین انتخاب برای مصرف مداوم",
        },
    ],
    family: [
        {
            id: "fam-6m",
            durationMonths: 6,
            title: "اشتراک ۶ ماهه",
            price: 1660000,
            desc: "اقتصادی‌ترین انتخاب (عضویت در فمیلی)",
        },
        {
            id: "fam-12m",
            durationMonths: 12,
            title: "اشتراک ۱۲ ماهه",
            price: 2660000,
            desc: "اقتصادی‌ترین انتخاب (عضویت در فمیلی)",
        },
    ],
};

function OrderForm() {
    const searchParams = useSearchParams();

    // تشخیص نوع محصول و پلن از URL
    const productType = searchParams.get("product") === "family" ? "family" : "individual";
    const planParam = searchParams.get("plan");

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [supportLink, setSupportLink] = useState("https://t.me/getSpotify_Support");

    // ساختار داده منطبق با نیازهای جدید
    const [formData, setFormData] = useState({
        planType: productType,
        durationMonths: 1,
        planId: "",
        planTitle: "",
        price: 0,
        fullNameEn: "",
        spotifyEmail: "",
        dateOfBirth: "",
        password: "",
    });

    // بررسی URL و پیش‌انتخاب پلن در صورت وجود
    useEffect(() => {
        let matchedPlan = null;

        if (planParam) {
            const requestedMonths = parseInt(planParam.replace(/[^0-9]/g, ""));
            if (!isNaN(requestedMonths)) {
                matchedPlan = PRICING[productType].find((p) => p.durationMonths === requestedMonths);
            }
        }

        if (matchedPlan) {
            setFormData((prev) => ({
                ...prev,
                planType: productType,
                planId: matchedPlan.id,
                durationMonths: matchedPlan.durationMonths,
                planTitle: matchedPlan.title,
                price: matchedPlan.price,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                planType: productType,
                planId: "",
                price: 0,
                durationMonths: 1,
                planTitle: "",
            }));
        }

        setStep(1);
    }, [productType, planParam]);

    const isFamily = productType === "family";
    const themeBg = "bg-[#1ED760] hover:bg-[#1fdf64]";
    const themeColor = "text-[#1ED760]";

    const handlePlanSelect = (plan: any) => {
        setFormData({
            ...formData,
            planId: plan.id,
            durationMonths: plan.durationMonths,
            planTitle: plan.title,
            price: plan.price,
        });
    };

    // ارسال اطلاعات به API با داده‌های جدید
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planType: formData.planType,
                    durationMonths: formData.durationMonths,
                    spotifyEmail: formData.spotifyEmail,
                    fullNameEn: formData.fullNameEn,
                    dateOfBirth: formData.dateOfBirth,
                    password: formData.password || "", // ارسال رشته خالی در صورت عدم ورود پسورد
                    price: formData.price,
                }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setOrderId(data.orderId);
                if (data.supportLink) setSupportLink(data.supportLink);
                setStep(4);
                toast.success("سفارش شما با موفقیت ثبت شد!");
            } else {
                toast.error(data.message || "خطایی در ثبت سفارش رخ داد.");
            }
        } catch (error) {
            toast.error("ارتباط با سرور برقرار نشد.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("شماره کارت کپی شد!");
    };

    return (
        <div className="max-w-2xl mx-auto w-full">
            {/* هدر فرم */}
            <div className="text-center mb-8">
                {step !== 4 && (
                    <>
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-800/50 border border-slate-700 mb-4">
                            {isFamily ? (
                                <Users className={`w-8 h-8 ${themeColor}`} />
                            ) : (
                                <User className={`w-8 h-8 ${themeColor}`} />
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {isFamily ? "خرید اشتراک اسپاتیفای فمیلی" : "خرید اشتراک اسپاتیفای شخصی (Individual)"}
                        </h1>
                    </>
                )}

                {step < 4 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= num ? "bg-[#1ED760] text-black" : "bg-slate-800 text-slate-400"}`}
                                >
                                    {num}
                                </div>
                                {num < 3 && (
                                    <div
                                        className={`w-12 h-1 transition-colors ${step > num ? "bg-[#1ED760]" : "bg-slate-800"}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {/* مرحله 1: انتخاب پلن */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                    >
                        <h2 className="text-lg font-medium text-slate-200 mb-4">
                            لطفاً بسته مورد نظر خود را انتخاب کنید:
                        </h2>

                        {isFamily && (
                            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl flex gap-3 text-sm mb-6 leading-relaxed">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>
                                    طبق قوانین اسپاتیفای، هر اکانت در سال تنها <strong>دو بار</strong> می‌تواند عضو
                                    فمیلی شود. لطفاً پیش از خرید این مورد را در نظر داشته باشید.
                                </p>
                            </div>
                        )}

                        <div className="grid gap-4">
                            <div className="space-y-4">
                                {PRICING[productType].map((plan, index) => {
                                    const isSelected = formData.planId === plan.id;
                                    const activeBorder = "border-[#1ED760] shadow-[0_0_20px_rgba(30,215,96,0.15)]";
                                    const activeBg = "bg-[#1ED760]/10";

                                    return (
                                        <motion.div
                                            key={plan.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handlePlanSelect(plan)}
                                            className={`relative p-5 pl-16 rounded-2xl border-2 cursor-pointer transition-colors duration-300 overflow-hidden ${isSelected ? `${activeBorder} ${activeBg}` : "border-slate-700 bg-slate-800/40 hover:bg-slate-800/60 hover:border-slate-500"}`}
                                        >
                                            <div className="flex justify-between items-center relative z-10">
                                                <div>
                                                    <h3 className="text-white font-bold text-lg">{plan.title}</h3>
                                                    <p className="text-slate-400 text-sm mt-1">{plan.desc}</p>
                                                </div>
                                                <div className="text-left flex flex-col items-end justify-center min-w-[120px]">
                                                    <div className="flex items-baseline gap-1.5">
                                                        <span
                                                            className={`text-2xl font-black transition-colors duration-300 ${isSelected ? themeColor : "text-white"}`}
                                                        >
                                                            {plan.price.toLocaleString("fa-IR")}
                                                        </span>
                                                        <span
                                                            className={`text-xs font-medium ${isSelected ? "text-[#1ED760]/80" : "text-slate-500"}`}
                                                        >
                                                            تومان
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ scale: 0, opacity: 0, rotate: -45 }}
                                                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                        exit={{ scale: 0, opacity: 0, rotate: 45 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                        className="absolute top-1/2 -translate-y-1/2 left-5 z-20"
                                                    >
                                                        <div className="bg-slate-900/50 rounded-full p-1 backdrop-blur-sm">
                                                            <CheckCircle2
                                                                className={`w-7 h-7 ${themeColor} drop-shadow-lg`}
                                                                strokeWidth={2.5}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            disabled={!formData.planId}
                            className={`w-full cursor-pointer mt-6 py-4 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${themeBg}`}
                        >
                            مرحله بعدی <ChevronLeft className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* مرحله 2: اطلاعات کاربر (بازنویسی شده با ساختار جدید) */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 space-y-5"
                    >
                        <h2 className="text-lg font-medium text-slate-200 mb-4">اطلاعات اکانت خود را وارد کنید:</h2>

                        {/* فیلد نام انگلیسی */}
                        <div>
                            <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                <User className="w-4 h-4" /> نام و نام خانوادگی (انگلیسی){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.fullNameEn}
                                maxLength={50}
                                onChange={(e) => setFormData({ ...formData, fullNameEn: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1ED760]"
                                placeholder="e.g. John Doe"
                                dir="ltr"
                            />
                        </div>

                        {/* ایمیل اسپاتیفای */}
                        <div>
                            <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                <Mail className="w-4 h-4" /> ایمیل متصل به اکانت اسپاتیفای{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.spotifyEmail}
                                onChange={(e) => setFormData({ ...formData, spotifyEmail: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1ED760]"
                                placeholder="example@gmail.com"
                                dir="ltr"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                توجه: اشتراک دقیقاً روی همین ایمیل فعال خواهد شد.
                            </p>
                        </div>

                        {/* فیلد تاریخ تولد */}
                        <div>
                            <BirthDatePicker
                                value={formData.dateOfBirth}
                                onChange={(val) => setFormData({ ...formData, dateOfBirth: val })}
                            />
                        </div>

                        {/* فیلد رمز عبور */}
                        <div>
                            <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                <Lock className="w-4 h-4" /> کلمه عبور اسپاتیفای (اختیاری)
                            </label>
                            <input
                                type="text"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1ED760]"
                                placeholder="در صورت نداشتن اکانت خالی بگذارید"
                                dir="ltr"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 cursor-pointer py-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                            >
                                بازگشت
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                // ولیدیشن جدید: نام انگلیسی، ایمیل و تاریخ تولد اجباری هستند
                                disabled={
                                    !formData.fullNameEn.trim() ||
                                    !formData.spotifyEmail.trim() ||
                                    !formData.dateOfBirth.trim()
                                }
                                className={`flex-1 cursor-pointer py-4 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${themeBg}`}
                            >
                                تایید اطلاعات <ChevronLeft className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* مرحله 3: بررسی و ثبت (همگام با اطلاعات جدید) */}
                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 space-y-6"
                    >
                        <h2 className="text-lg font-medium text-slate-200">پیش‌فاکتور نهایی شما:</h2>
                        <div className="bg-slate-900/50 rounded-2xl p-5 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">نوع اشتراک:</span>
                                <span className="text-white font-medium">
                                    {isFamily ? "اسپاتیفای فمیلی" : "اسپاتیفای شخصی (Individual)"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">پلن انتخابی:</span>
                                <span className="text-white font-medium">{formData.planTitle}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">نام (انگلیسی):</span>
                                <span className="text-white font-medium" dir="ltr">
                                    {formData.fullNameEn}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">ایمیل اکانت:</span>
                                <span className="text-white font-medium" dir="ltr">
                                    {formData.spotifyEmail}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">تاریخ تولد:</span>
                                <span className="text-white font-medium" dir="ltr">
                                    {formData.dateOfBirth}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">کلمه عبور:</span>
                                <span className="text-white font-medium" dir="ltr">
                                    {formData.password ? "وارد شده *" : "خالی (ساخت اکانت جدید)"}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
                                <span className="text-slate-300 font-medium">مبلغ قابل پرداخت:</span>
                                <div className="text-left">
                                    <span className={`text-2xl font-bold ${themeColor}`}>
                                        {formData.price.toLocaleString("fa-IR")}
                                    </span>
                                    <span className="text-slate-400 text-sm mr-1">تومان</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(2)}
                                className="px-6 cursor-pointer py-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                            >
                                اصلاح
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`flex-1 cursor-pointer py-4 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 ${themeBg}`}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                                ) : (
                                    "ثبت سفارش و پرداخت"
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* مرحله 4: پرداخت و موفقیت */}
                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-20 h-20 bg-[#1ED760]/10 text-[#1ED760] rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">سفارش با موفقیت ثبت شد!</h2>
                        <p className="text-slate-400">
                            کد پیگیری شما:{" "}
                            <span className="font-mono text-white bg-slate-800 px-2 py-1 rounded">{orderId}</span>
                        </p>

                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl border border-slate-700 relative overflow-hidden mt-8 text-left">
                            <CreditCard className="absolute -right-4 -top-4 w-32 h-32 text-slate-700/30 rotate-12" />
                            <div className="relative z-10 space-y-4">
                                <p className="text-slate-400 text-sm text-right">
                                    لطفا مبلغ{" "}
                                    <strong className="text-white">
                                        {formData.price.toLocaleString("fa-IR")} تومان
                                    </strong>{" "}
                                    را به کارت زیر واریز نمایید:
                                </p>
                                <div className="flex items-center justify-between bg-black/30 p-4 rounded-xl backdrop-blur-sm border border-slate-700/50">
                                    <span className="text-xl md:text-2xl font-mono text-white tracking-widest">
                                        6037-9981-4892-7014
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard("6037998148927014")}
                                        className="p-2 cursor-pointer text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-slate-400 text-sm text-right">به نام: مائده شعاعی - بانک ملی</p>
                            </div>
                        </div>

                        <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 space-y-4 mt-6">
                            <p className="text-slate-300 text-sm leading-relaxed">
                                پس از پرداخت، لطفاً{" "}
                                <span className="text-red-500">
                                    <strong>تصویر رسید واریز</strong> را به همراه کد پیگیری به پشتیبانی تلگرام ما ارسال
                                    کنید
                                </span>{" "}
                                تا اکانت شما در کمتر از ۲۴ ساعت پریمیوم شود.
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
        <div className="min-h-[70vh] flex items-center justify-center py-10">
            <Suspense
                fallback={
                    <div className="flex justify-center items-center">
                        <Loader2 className="w-10 h-10 animate-spin text-[#1ED760]" />
                    </div>
                }
            >
                <OrderForm />
            </Suspense>
        </div>
    );
}
