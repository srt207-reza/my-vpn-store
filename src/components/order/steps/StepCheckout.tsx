"use client";

import { motion } from "framer-motion";
import { Loader2, Tag, BadgePercent, Wallet, X } from "lucide-react";
import { useEffect } from "react";

type ReceiptLike = {
    volume: number;
    fullName: string;
    contactInfo: string;
};

type Props = {
    formData: ReceiptLike;
    totalPrice: number;
    payablePrice: number;
    couponCode: string;
    couponDiscount: number;
    couponApplying: boolean;
    onCouponChange: (value: string) => void;
    onApplyCoupon: () => void;
    setStep: (step: number) => void;
    handleSubmit: () => void;
    loading: boolean;
    themeBg: string;
    themeColor: string;
};

export default function StepCheckout({
    formData,
    totalPrice,
    payablePrice,
    couponCode,
    couponDiscount,
    couponApplying,
    onCouponChange,
    onApplyCoupon,
    setStep,
    handleSubmit,
    loading,
    themeBg,
    themeColor,
}: Props) {
    const BASE_PRICE_PER_GB = 25_000;
    const calculatedBasePrice = formData.volume * BASE_PRICE_PER_GB;
    const planDiscountAmount = Math.max(0, calculatedBasePrice - totalPrice);
    const hasPlanDiscount = planDiscountAmount > 0;
    const hasCouponDiscount = couponDiscount > 0;

    const finalPayable = payablePrice || totalPrice;

    useEffect(() => {
        window.scrollTo(0,0)
    },[])

    return (
        <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-slate-800/40 md:p-8 p-4 rounded-3xl border border-slate-700 space-y-6"
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

                <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-sky-400">
                        <Tag className="w-4 h-4" />
                        کد تخفیف
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            value={couponCode}
                            onChange={(e) => onCouponChange(e.target.value)}
                            placeholder="مثلاً: NEW20"
                            dir="rtl"
                            className="flex-1 text-left rounded-xl border border-sky-500/20 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10"
                        />

                        <button
                            type="button"
                            onClick={onApplyCoupon}
                            disabled={couponApplying}
                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-sky-500/25 bg-sky-500/10 px-4 py-3 text-sm font-bold text-sky-400 transition-colors hover:bg-sky-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {couponApplying ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    بررسی
                                </>
                            ) : (
                                <>
                                    <Wallet className="h-4 w-4" />
                                    ثبت کد تخفیف
                                </>
                            )}
                        </button>
                    </div>

                    {hasCouponDiscount && (
                        <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-sky-400 text-sm font-medium">
                                <BadgePercent className="w-4 h-4" />
                                مبلغ تخفیف
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sky-300 text-sm font-bold">
                                    {couponDiscount.toLocaleString("fa-IR")} تومان
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onCouponChange("");
                                    }}
                                    className="rounded-lg cursor-pointer p-1.5 text-sky-300 hover:bg-sky-500/10 transition-colors"
                                    aria-label="حذف کد تخفیف"
                                    title="حذف کد تخفیف"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    <p className="text-xs leading-6 text-slate-400">
                       در صورت داشتن کد تخفیف، لطفاً آن را وارد نمایید و سپس بر روی گزینه ثبت کد تخفیف کلیک بفرمایید.
                    </p>
                </div>

                {hasPlanDiscount && (
                    <>
                        <div className="flex justify-between items-center text-sm pt-2">
                            <span className="text-slate-400">ارزش واقعی سرویس:</span>
                            <span className="text-slate-500 line-through">
                                {calculatedBasePrice.toLocaleString("fa-IR")} تومان
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-sm bg-sky-500/10 px-3 py-2.5 rounded-lg border border-sky-500/20 -mx-1">
                            <span className="text-sky-400 font-medium">سود شما از این خرید:</span>
                            <span className="text-sky-400 font-bold">
                                {planDiscountAmount.toLocaleString("fa-IR")} تومان
                            </span>
                        </div>
                    </>
                )}

                <div className="pt-5 mt-2 border-t border-slate-700 border-dashed flex justify-between items-center">
                    <span className="text-slate-300 font-bold">مبلغ قابل پرداخت:</span>
                    <div className="text-left">
                        <span className={`text-2xl font-black ${themeColor}`}>
                            {finalPayable.toLocaleString("fa-IR")}
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