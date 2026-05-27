"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Tags } from "lucide-react";
import RubberVolumeSlider from "@/components/RubberVolumeSlider";
import RubberDurationSlider from "@/components/RubberDurationSlider";
import { ALLOWED_VOLUMES, ALLOWED_DURATIONS, PRICING_DATA } from "@/constants/order";

export default function StepVolumeSelection({
    formData,
    setFormData,
    setStep,
    router,
    totalPrice,
    themeBg,
    themeColor,
}: any) {
    const durationLabel =
        formData.duration === 1
            ? "۱ ماه"
            : formData.duration === 2
              ? "۲ ماه"
              : formData.duration === 3
                ? "۳ ماه"
                : "۶ ماه";

    const handleCellClick = (gb: number, d: number) => {
        setFormData({ ...formData, volume: gb, duration: d });
    };

    return (
        <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-slate-800/40 p-4 md:p-8 rounded-3xl border border-slate-700"
        >
            {/* توضیحات بالا */}
            <div className="mb-6 p-4 bg-slate-900/60 border border-slate-700/50 rounded-xl text-center">
                <p className="text-slate-300 text-sm leading-relaxed mb-2">
                    اشتراک راهکار اتصال بدون محدودیت زمانی ارائه می‌شود و میزان استفاده از آن صرفاً بر اساس حجم ترافیک
                    مصرفی محاسبه می‌گردد.
                </p>
                <div className="flex justify-center mt-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs border border-slate-700/60">
                        <Tags className="w-3.5 h-3.5 text-primary" />
                        قیمت‌ها بر اساس حجم و مدت اشتراک انتخابی محاسبه می‌شوند
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6">
                {/* اسلایدرها */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="w-full">
                        <p className="text-primary font-medium text-sm text-center mb-4">حجم ترافیک مورد نیاز:</p>
                        <RubberVolumeSlider
                            allowedValues={ALLOWED_VOLUMES}
                            value={formData.volume}
                            onChange={(val: any) => setFormData({ ...formData, volume: val })}
                        />
                    </div>
                    <div className="w-full">
                        <p className="text-primary font-medium text-sm text-center mb-4">مدت زمان اشتراک:</p>
                        <RubberDurationSlider
                            allowedValues={ALLOWED_DURATIONS}
                            value={formData.duration}
                            onChange={(val: any) => setFormData({ ...formData, duration: val })}
                        />
                    </div>
                </div>

                {/* جدول قیمت‌ها */}
                <div className="w-full hidden md:block overflow-x-auto rounded-2xl border border-slate-700/60 scrollbar-hide">
                    <table className="w-full text-sm border-collapse scrollbar-hide" dir="ltr">
                        <thead>
                            <tr className="bg-slate-900/80">
                                <th className="text-center py-3 px-3 text-slate-400 font-semibold border-b border-slate-700/60 min-w-[52px]">
                                    GB
                                </th>
                                {ALLOWED_DURATIONS.map((d) => {
                                    const isActiveCol = formData.duration === d;
                                    return (
                                        <th
                                            key={d}
                                            onClick={() => setFormData({ ...formData, duration: d })}
                                            className={`text-center py-3 px-2 md:px-4 font-semibold border-b cursor-pointer select-none transition-all min-w-[80px] md:min-w-[110px] ${
                                                isActiveCol
                                                    ? "text-primary border-b-2 border-b-primary bg-primary/5"
                                                    : "text-slate-400 border-b-slate-700/60 hover:text-slate-200 hover:bg-slate-800/60"
                                            }`}
                                        >
                                            <span className="flex flex-col items-center gap-0.5">
                                                <span dir="rtl">{d} ماه</span>
                                                <motion.span
                                                    animate={{
                                                        width: isActiveCol ? 16 : 0,
                                                        opacity: isActiveCol ? 1 : 0,
                                                    }}
                                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                                    className="h-0.5 rounded-full bg-primary block overflow-hidden"
                                                />
                                            </span>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {ALLOWED_VOLUMES.map((gb, idx) => {
                                const isActiveRow = formData.volume === gb;
                                return (
                                    <motion.tr
                                        key={gb}
                                        animate={{
                                            backgroundColor: isActiveRow ? "rgba(6,182,212,0.08)" : "rgba(0,0,0,0)",
                                        }}
                                        transition={{ duration: 0.2 }}
                                        className={`cursor-pointer border-b border-slate-700/20 last:border-0 ${
                                            !isActiveRow
                                                ? idx % 2 === 0
                                                    ? "hover:bg-slate-700/25"
                                                    : "hover:bg-slate-700/25"
                                                : ""
                                        }`}
                                    >
                                        {/* ستون حجم */}
                                        <td
                                            className="py-2.5 px-3 text-center"
                                            onClick={() => setFormData({ ...formData, volume: gb })}
                                        >
                                            <span
                                                className={`inline-flex items-center gap-1.5 font-bold text-sm transition-colors ${
                                                    isActiveRow ? "text-primary" : "text-slate-400"
                                                }`}
                                            >
                                                <motion.span
                                                    animate={{
                                                        scale: isActiveRow ? 1 : 0,
                                                        opacity: isActiveRow ? 1 : 0,
                                                    }}
                                                    transition={{ duration: 0.2 }}
                                                    className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
                                                />
                                                {gb}
                                            </span>
                                        </td>

                                        {/* سلول‌های قیمت */}
                                        {ALLOWED_DURATIONS.map((d) => {
                                            const isActiveCell = isActiveRow && formData.duration === d;
                                            const isActiveCol = formData.duration === d;
                                            const price = PRICING_DATA[gb][d];

                                            return (
                                                <td
                                                    key={d}
                                                    onClick={() => handleCellClick(gb, d)}
                                                    className="py-2 px-2 md:px-4 text-center cursor-pointer"
                                                >
                                                    <motion.span
                                                        layout
                                                        className="inline-flex flex-col items-center relative"
                                                    >
                                                        {/* پس‌زمینه سلول فعال */}
                                                        <AnimatePresence>
                                                            {isActiveCell && (
                                                                <motion.span
                                                                    layoutId="active-cell-bg"
                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                                    transition={{
                                                                        duration: 0.25,
                                                                        ease: [0.34, 1.56, 0.64, 1],
                                                                    }}
                                                                    className="absolute inset-0 -mx-2 -my-1 rounded-xl bg-primary shadow-[0_0_16px_rgba(6,182,212,0.5)]"
                                                                    style={{ zIndex: 0 }}
                                                                />
                                                            )}
                                                        </AnimatePresence>

                                                        {/* عدد قیمت */}
                                                        <motion.span
                                                            animate={{
                                                                color: isActiveCell
                                                                    ? "#0f172a"
                                                                    : isActiveRow || isActiveCol
                                                                      ? "#e2e8f0"
                                                                      : "#64748b",
                                                                fontWeight: isActiveCell
                                                                    ? 900
                                                                    : isActiveRow || isActiveCol
                                                                      ? 500
                                                                      : 400,
                                                                fontSize: isActiveCell ? "0.875rem" : "0.75rem",
                                                            }}
                                                            transition={{ duration: 0.2 }}
                                                            className="relative leading-tight"
                                                            style={{ zIndex: 1 }}
                                                        >
                                                            {price.toLocaleString("fa-IR")}
                                                        </motion.span>

                                                        {/* تومان زیر سلول فعال */}
                                                        <AnimatePresence>
                                                            {isActiveCell && (
                                                                <motion.span
                                                                    initial={{ opacity: 0, y: -4, height: 0 }}
                                                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                                                    exit={{ opacity: 0, y: -4, height: 0 }}
                                                                    transition={{ duration: 0.2, delay: 0.05 }}
                                                                    className="text-[10px] font-bold text-slate-900/70 leading-none relative"
                                                                    style={{ zIndex: 1 }}
                                                                >
                                                                    تومان
                                                                </motion.span>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.span>
                                                </td>
                                            );
                                        })}
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <p className="text-slate-500 hidden md:block text-xs text-center -mt-2">
                    روی هر سلول کلیک کنید تا حجم و مدت همزمان انتخاب شود
                </p>

                {/* باکس قیمت نهایی */}
                <motion.div
                    key={`${formData.volume}-${formData.duration}`}
                    initial={{ opacity: 0.6, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="bg-slate-900/80 p-5 rounded-2xl border border-primary/30 w-full flex flex-col gap-3 shadow-inner"
                >
                    <div className="flex justify-between items-center text-sm mb-1.5">
                        <span className="text-slate-400">حجم انتخابی:</span>
                        <motion.span
                            key={formData.volume}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25 }}
                            className={`font-bold text-lg ${themeColor}`}
                        >
                            {formData.volume} گیگابایت
                        </motion.span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">مدت اشتراک:</span>
                        <motion.span
                            key={formData.duration}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25 }}
                            className={`font-bold text-lg ${themeColor}`}
                        >
                            {durationLabel}
                        </motion.span>
                    </div>

                    <div className="border-t border-slate-700/50 my-1" />

                    <div className="flex justify-between items-end mt-1">
                        <span className="text-slate-300 font-medium mb-1">مبلغ نهایی:</span>
                        <div className="flex items-baseline gap-1.5">
                            <motion.span
                                key={totalPrice}
                                initial={{ opacity: 0, scale: 0.85, y: 6 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                                className="text-2xl font-bold text-white"
                            >
                                {totalPrice.toLocaleString("fa-IR")}
                            </motion.span>
                            <span className={`text-sm font-bold ${themeColor}`}>تومان</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="flex gap-3 mt-8">
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
                    تأیید طرح اشتراک  <ChevronLeft className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}
