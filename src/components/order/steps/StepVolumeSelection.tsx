"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Tags } from "lucide-react"; // اضافه شدن آیکون Tags
import RubberVolumeSlider from "@/components/RubberVolumeSlider";
import { ALLOWED_VOLUMES } from "@/constants/order";

export default function StepVolumeSelection({
    formData,
    setFormData,
    setStep,
    router,
    // currentPricing,
    totalPrice,
    themeBg,
    themeColor,
}: any) {
    // محاسبه قیمت پایه و تخفیف
    const BASE_PRICE_PER_GB = 299000;
    const calculatedBasePrice = formData.volume * BASE_PRICE_PER_GB;
    const discountAmount = calculatedBasePrice - totalPrice;
    const hasDiscount = discountAmount > 0;

    return (
        <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700"
        >
            <div className="mb-8 p-4 bg-slate-900/60 border border-slate-700/50 rounded-xl text-center">
                <p className="text-slate-300 text-sm leading-relaxed mb-2">
                    اشتراک راهکار اتصال بدون محدودیت زمانی ارائه می‌شود و میزان استفاده از آن صرفاً بر اساس حجم ترافیک
                    مصرفی محاسبه می‌گردد.
                </p>
                <div className="flex justify-center mt-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs border border-slate-700/60">
                        <Tags className="w-3.5 h-3.5 text-primary" />
                        تعرفه پایه: هر گیگابایت ۲۹۹,۰۰۰ تومان
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-10">
                <div className="w-full max-w-sm">
                    <p className="text-primary font-medium text-sm text-center mb-6">
                        لطفاً مقدار حجم ترافیک مورد نیاز را انتخاب بفرمایید:
                    </p>
                    <RubberVolumeSlider
                        allowedValues={ALLOWED_VOLUMES}
                        value={formData.volume}
                        onChange={(val: any) => setFormData({ ...formData, volume: val })}
                    />
                </div>

                {/* باکس فاکتور محاسبه قیمت */}
                <div className="bg-slate-900/80 p-5 rounded-2xl border border-primary/30 w-full max-w-sm flex flex-col gap-3 shadow-inner">
                    
                    {/* ردیف قیمت پایه */}
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">مبلغ پایه ({formData.volume} گیگابایت):</span>
                        <span className={`font-medium ${hasDiscount ? "text-slate-500 line-through" : "text-slate-300"}`}>
                            {calculatedBasePrice.toLocaleString("fa-IR")} تومان
                        </span>
                    </div>

                    {/* ردیف تخفیف (فقط در صورت وجود تخفیف نمایش داده می‌شود) */}
                    {hasDiscount && (
                        <div className="flex justify-between items-center text-sm bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20 -mx-1">
                            <span className="text-emerald-400 font-medium">سود شما از این خرید:</span>
                            <span className="text-emerald-400 font-bold">
                                {discountAmount.toLocaleString("fa-IR")} تومان
                            </span>
                        </div>
                    )}

                    <div className="border-t border-slate-700/50 my-1" />

                    {/* ردیف مبلغ نهایی */}
                    <div className="flex justify-between items-end mt-1">
                        <span className="text-slate-300 font-medium mb-1">مبلغ نهایی:</span>
                        <div className="flex flex-col items-end">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-bold text-white">
                                    {totalPrice.toLocaleString("fa-IR")}
                                </span>
                                <span className={`text-sm font-bold ${themeColor}`}>تومان</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mt-10">
                <button
                    onClick={() => router.push("/")}
                    className="px-6 cursor-pointer py-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                    بازگشت به خانه
                </button>
                <button
                    onClick={() => setStep(2)}
                    className={`flex-1 cursor-pointer py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${themeBg}`}
                >
                    ادامه و ثبت <ChevronLeft className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}
