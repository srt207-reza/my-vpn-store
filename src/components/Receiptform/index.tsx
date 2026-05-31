"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown, Loader2, Receipt, User, Hash, Building2 } from "lucide-react";
import toast from "react-hot-toast";

const IRANIAN_BANKS = [
    "ملی ایران",
    "سپه",
    "تجارت",
    "ملت",
    "صادرات",
    "رسالت",
    "پارسیان",
    "پاسارگاد",
    "سامان",
    "سینا",
    "آینده",
    "شهر",
    "اقتصاد نوین",
    "کارآفرین",
    "دی",
    "ایران زمین",
    "خاورمیانه",
    "انصار",
    "مهر ایران",
    "توسعه صادرات",
    "صنعت و معدن",
    "کشاورزی",
    "مسکن",
    "پست بانک",
    "سایر",
];

type ReceiptPayload = {
    payerName: string;
    trackingCode: string;
    sourceBank: string;
};

type Props = {
    orderId?: string;
    loading?: boolean;
    onBack: () => void;
    onSubmit: (receiptData: ReceiptPayload) => Promise<string>;
};

export default function ReceiptForm({ orderId, loading = false, onSubmit, onBack }: Props) {
    const [payerName, setPayerName] = useState("");
    const [trackingCode, setTrackingCode] = useState("");
    const [sourceBank, setSourceBank] = useState("");
    const [localLoading, setLocalLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submittedOrderId, setSubmittedOrderId] = useState("");
    const [bankOpen, setBankOpen] = useState(false);
    const [touched, setTouched] = useState({
        payerName: false,
        trackingCode: false,
        sourceBank: false,
    });

    const payerNameValid = payerName.trim().length >= 3;
    const trackingCodeValid = trackingCode.trim().length >= 6;
    const sourceBankValid = sourceBank.trim().length > 0;
    const canSubmit = payerNameValid && trackingCodeValid && sourceBankValid;

    const handleSubmit = async () => {
        setTouched({ payerName: true, trackingCode: true, sourceBank: true });
        if (!canSubmit) return;

        setLocalLoading(true);
        try {
            const createdOrderId = await onSubmit({
                payerName: payerName.trim(),
                trackingCode: trackingCode.trim(),
                sourceBank,
            });

            setSubmittedOrderId(createdOrderId || "");
            setSubmitted(true);
            toast.success("رسید پرداخت با موفقیت ثبت شد.");
        } catch (err: any) {
            toast.error(err?.message || "خطایی رخ داد. دوباره تلاش کنید.");
        } finally {
            setLocalLoading(false);
        }
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-950/80 border border-primary/20 rounded-3xl p-6 sm:p-8 text-center space-y-5"
                dir="rtl"
            >
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16 }}
                    className="w-16 h-16 bg-primary/10 border-2 border-primary/25 rounded-full flex items-center justify-center mx-auto"
                >
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                </motion.div>

                <div className="space-y-1">
                    <p className="text-store-text font-bold text-lg sm:text-xl">رسید شما با موفقیت ثبت شد.</p>
                    <p className="text-store-muted text-sm">سفارش شما در صف بررسی قرار گرفت.</p>
                </div>

                <div className="space-y-2">
                    <p className="text-slate-500 text-xs">کد سفارش</p>
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-2xl px-5 py-3">
                        <span className="font-mono text-primary text-xl sm:text-2xl font-bold tracking-widest">
                            {submittedOrderId || orderId || "در حال ساخت..."}
                        </span>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-store-panel/80 border border-store-border rounded-3xl p-5 sm:p-6 space-y-5 text-right"
            dir="rtl"
        >
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Receipt className="w-4 h-4 text-primary" />
                </div>
                <div>
                    <p className="text-store-text font-semibold text-sm sm:text-base">اطلاعات رسید پرداخت</p>
                    <p className="text-store-muted text-xs mt-0.5">پس از واریز، اطلاعات زیر را تکمیل کنید</p>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-slate-300 text-sm font-medium flex items-center gap-1">
                    نام واریزکننده <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="نام و نام خانوادگی"
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                        onBlur={() => setTouched((p) => ({ ...p, payerName: true }))}
                        className={`w-full bg-store-base border rounded-xl pr-11 pl-4 py-3 text-store-text placeholder:text-slate-600 text-sm outline-none transition-all duration-200
                            ${
                                touched.payerName && !payerNameValid
                                    ? "border-red-500/60"
                                    : payerNameValid
                                      ? "border-primary/40 focus:border-primary"
                                      : "border-store-border focus:border-slate-500"
                            }`}
                    />
                </div>
                {touched.payerName && !payerNameValid && (
                    <p className="text-red-400 text-xs">نام واریزکننده الزامی است.</p>
                )}
            </div>

            <div className="space-y-1.5">
                <label className="text-slate-300 text-sm font-medium flex items-center gap-1">
                    کد رهگیری <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <Hash className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="کد رهگیری تراکنش"
                        value={trackingCode}
                        onChange={(e) => setTrackingCode(e.target.value.replace(/\D/g, ""))}
                        onBlur={() => setTouched((p) => ({ ...p, trackingCode: true }))}
                        dir="ltr"
                        className={`w-full bg-store-base border rounded-xl pr-11 pl-4 py-3 text-store-text placeholder:text-slate-600 text-sm outline-none transition-all duration-200 text-right
                            ${
                                touched.trackingCode && !trackingCodeValid
                                    ? "border-red-500/60"
                                    : trackingCodeValid
                                      ? "border-primary/40 focus:border-primary"
                                      : "border-store-border focus:border-slate-500"
                            }`}
                    />
                </div>
                {touched.trackingCode && !trackingCodeValid && (
                    <p className="text-red-400 text-xs">کد رهگیری باید حداقل ۶ رقم باشد.</p>
                )}
            </div>

            <div className="space-y-1.5 relative z-20">
                <label className="text-slate-300 text-sm font-medium flex items-center gap-1">
                    بانک مبدأ <span className="text-red-400">*</span>
                </label>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setBankOpen((o) => !o)}
                        className={`w-full bg-store-base border rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 flex items-center justify-between
                            ${touched.sourceBank && !sourceBankValid ? "border-red-500/60" : sourceBankValid ? "border-primary/40" : "border-store-border"}
                            ${bankOpen ? "border-slate-500" : ""}`}
                    >
                        <span className={sourceBank ? "text-store-text" : "text-slate-600"}>
                            {sourceBank ? `بانک ${sourceBank}` : "انتخاب کنید"}
                        </span>
                        <motion.span animate={{ rotate: bankOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                        </motion.span>
                    </button>

                    <AnimatePresence>
                        {bankOpen && (
                            <motion.ul
                                initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                                exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                                transition={{ duration: 0.2 }}
                                style={{ transformOrigin: "top" }}
                                className="absolute !scrollbar-hide top-full mt-1 w-full bg-[#1a1a1a] border border-slate-700 rounded-xl overflow-y-auto max-h-52 z-30 shadow-2xl"
                            >
                                {IRANIAN_BANKS.map((bank) => (
                                    <li key={bank}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSourceBank(bank);
                                                setBankOpen(false);
                                                setTouched((p) => ({ ...p, sourceBank: true }));
                                            }}
                                            className={`w-full text-right px-4 py-2.5 text-sm transition-colors
                                                ${
                                                    sourceBank === bank
                                                        ? "text-primary bg-primary/10"
                                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                                }`}
                                        >
                                            {bank === "سایر" ? bank : `بانک ${bank}`}
                                        </button>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>

                {touched.sourceBank && !sourceBankValid && (
                    <p className="text-red-400 text-xs">بانک مبدأ الزامی است.</p>
                )}
            </div>

            <div className="relative z-10 flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                    onClick={onBack}
                    className="px-6 cursor-pointer py-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                    بازگشت
                </button>

                <motion.button
                    whileHover={canSubmit && !loading && !localLoading ? { scale: 1.02, y: -2 } : {}}
                    whileTap={canSubmit && !loading && !localLoading ? { scale: 0.98 } : {}}
                    onClick={handleSubmit}
                    disabled={loading || !canSubmit || localLoading}
                    className={`relative w-full py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 overflow-hidden
                        ${
                            canSubmit && !loading && !localLoading
                                ? "bg-primary text-slate-900 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] cursor-pointer"
                                : "bg-primary hover:bg-cyan-400 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        }`}
                >
                    {loading || localLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <span className="relative z-10">تأیید و ثبت رسید پرداخت</span>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
}
