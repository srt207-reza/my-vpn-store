"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function StepCheckout({
    formData,
    totalPrice,
    setStep,
    handleSubmit,
    loading,
    themeBg,
    themeColor,
}: any) {
    return (
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
                    <span className="text-slate-400">آدرس ایمیل:</span>
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
                        "ثبت سفارش و پرداخت"
                    )}
                </button>
            </div>
        </motion.div>
    );
}
