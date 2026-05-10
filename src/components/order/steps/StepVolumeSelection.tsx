"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import RubberVolumeSlider from "@/components/RubberVolumeSlider";
import { ALLOWED_VOLUMES } from "@/constants/order";

export default function StepVolumeSelection({
    formData,
    setFormData,
    setStep,
    router,
    currentPricing,
    totalPrice,
    themeBg,
    themeColor,
}: any) {
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
                <p className="text-primary font-medium text-sm">لطفاً مقدار حجم ترافیک مورد نیاز را انتخاب بفرمایید:</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-10">
                <div className="w-full max-w-sm">
                    <RubberVolumeSlider
                        allowedValues={ALLOWED_VOLUMES}
                        value={formData.volume}
                        onChange={(val: any) => setFormData({ ...formData, volume: val })}
                    />
                </div>

                <div className="bg-slate-900/80 px-6 py-5 rounded-2xl border border-primary/30 w-full max-w-sm flex justify-between items-center shadow-inner">
                    <span className="text-slate-400 font-medium">مبلغ کل:</span>

                    <div className="flex flex-col items-end">
                        {currentPricing.original && (
                            <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
                                <span className="text-sm line-through decoration-red-500/70">
                                    {currentPricing.original.toLocaleString("fa-IR")}
                                </span>
                            </div>
                        )}
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-bold text-white">{totalPrice.toLocaleString("fa-IR")}</span>
                            <span className={`text-sm font-bold ${themeColor}`}>تومان</span>
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
