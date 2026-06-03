"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, CreditCard, Wifi } from "lucide-react";
import toast from "react-hot-toast";

import ReceiptForm from "@/components/Receiptform";

type ReceiptPayload = {
    payerName: string;
    trackingCode: string;
    sourceBank: string;
};

type Props = {
    orderId: string;
    totalPrice: number;
    supportLink?: string;
    themeColor?: string;
    loading?: boolean;
    onBack: () => void;
    onConfirmReceipt: (receiptData: ReceiptPayload) => Promise<void>;
};

export default function StepPayment({
    orderId,
    totalPrice,
    supportLink,
    loading = false,
    onBack,
    onConfirmReceipt,
}: Props) {
    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${type} کپی شد!`);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.14,
                delayChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 22, scale: 0.98 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
    };

    const cardVariants = {
        rest: {
            scale: 1,
            y: 0,
            boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
        },
        hover: {
            scale: 1.02,
            y: -4,
            boxShadow: "0 28px 70px rgba(6,182,212,0.12)",
            transition: {
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const glowVariants = {
        rest: { opacity: 0.35, scale: 1 },
        hover: {
            opacity: 0.65,
            scale: 1.08,
            transition: { duration: 0.45, ease: "easeOut" },
        },
    };

    const shimmerVariants = {
        rest: { x: "-120%" },
        hover: {
            x: "120%",
            transition: { duration: 1.2, ease: "easeInOut" },
        },
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            key="step4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-8 w-full"
        >
            {!orderId ? (
                <>
                    <motion.div
                        //@ts-ignore
                        variants={itemVariants}
                        className="space-y-4"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -18 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 220, damping: 16 }}
                            className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto border-2 border-primary/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.7, 0.35] }}
                                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                            />
                            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 relative z-10" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12, duration: 0.5 }}
                            className="text-2xl sm:text-3xl font-bold text-white"
                        >
                            اطلاعات رسید پرداخت و کارت بانکی
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        //@ts-ignore
                        variants={itemVariants}
                        className="flex flex-col items-center w-full"
                    >
                        <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.45 }}
                            className="text-slate-300 text-sm leading-relaxed mb-6 px-2"
                        >
                            جهت پرداخت وجه، لطفاً مبلغ{" "}
                            <strong className="text-lg sm:text-xl text-primary">
                                {totalPrice.toLocaleString("fa-IR")} تومان
                            </strong>{" "}
                            را به شماره کارت یا شماره شبا زیر واریز بفرمایید.
                        </motion.p>

                        <motion.div
                            //@ts-ignore
                            variants={cardVariants}
                            initial="rest"
                            whileHover="hover"
                            className="group relative w-full max-w-[500px] mx-auto rounded-3xl overflow-hidden border border-primary/30 bg-slate-900 text-left transform-gpu [transform-style:preserve-3d]"
                            style={{ perspective: 1200 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 via-slate-900 to-black z-0" />

                            <motion.div
                                //@ts-ignore
                                variants={glowVariants}
                                className="absolute top-0 right-0 w-36 h-36 bg-primary/15 rounded-full blur-3xl z-0 pointer-events-none"
                            />
                            <motion.div
                                //@ts-ignore
                                variants={glowVariants}
                                className="absolute bottom-0 left-0 w-44 h-44 bg-primary/10 rounded-full blur-3xl z-0 pointer-events-none"
                            />

                            <motion.div
                                //@ts-ignore
                                variants={shimmerVariants}
                                className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-xl pointer-events-none"
                            />

                            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:22px_22px]" />

                            <div
                                className="relative z-10 h-full p-5 sm:p-6 flex flex-col gap-5"
                                style={{
                                    transform: "translateZ(0)",
                                    backfaceVisibility: "hidden",
                                    WebkitBackfaceVisibility: "hidden",
                                }}
                            >
                                <div className="flex justify-between w-full">
                                    <div className="flex justify-between items-start w-full" dir="rtl">
                                        <div className="flex flex-col items-start w-full">
                                            <motion.span
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.18, duration: 0.45 }}
                                                className="text-primary font-bold text-base sm:text-xl tracking-wider drop-shadow-md"
                                            >
                                                بانک پاسارگاد
                                            </motion.span>
                                            <motion.span
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.24, duration: 0.45 }}
                                                className="text-[9px] sm:text-[10px] text-slate-400 tracking-widest uppercase mt-0.5"
                                            >
                                                Bank Pasargad
                                            </motion.span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 sm:gap-4 w-full mt-2 sm:mt-2">
                                        <motion.div
                                            animate={{ y: [0, -1.5, 0] }}
                                            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                                            className="relative w-10 h-8 sm:w-12 sm:h-9 bg-gradient-to-br from-yellow-300 to-primary rounded-md flex items-center justify-center border border-primary/50 shadow-inner overflow-hidden shrink-0"
                                        >
                                            <div className="w-full h-[1px] bg-yellow-700/40 absolute" />
                                            <div className="w-[1px] h-full bg-yellow-700/40 absolute" />
                                        </motion.div>

                                        <motion.div
                                            animate={{ rotate: [90, 92, 90] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                            className="shrink-0"
                                        >
                                            <Wifi className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400/70" />
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="w-full flex flex-col gap-2">
                                    <div className="flex flex-col w-full">
                                        <span className="text-[12px] text-right sm:text-sm text-slate-400/80 mb-1 pr-1 font-medium">
                                            شماره کارت
                                        </span>
                                        <div className="flex items-center justify-between w-full gap-2">
                                            <motion.span
                                                dir="ltr"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.28, duration: 0.45 }}
                                                className="text-[0.9rem] sm:text-[1.15rem] font-mono text-white tracking-[0.12em] sm:tracking-[0.16em] whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                                            >
                                                5022 2915 8438 9710
                                            </motion.span>

                                            <motion.button
                                                whileHover={{ scale: 1.08, rotate: -3 }}
                                                whileTap={{ scale: 0.94 }}
                                                onClick={() => copyToClipboard("5022291584389710", "شماره کارت")}
                                                className="p-1.5 sm:p-2 shrink-0 cursor-pointer text-primary hover:text-white hover:bg-primary/20 rounded-lg transition-colors bg-slate-950/50 backdrop-blur-sm border border-primary/30 flex items-center justify-center"
                                                title="کپی شماره کارت"
                                                type="button"
                                            >
                                                <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </motion.button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-full">
                                        <span className="text-[12px] text-right sm:text-sm text-slate-400/80 mb-1 pr-1 font-medium">
                                            شماره شبا
                                        </span>
                                        <div className="flex items-center justify-between w-full gap-2">
                                            <motion.span
                                                dir="ltr"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.32, duration: 0.45 }}
                                                className="text-[0.9rem] sm:text-[1.15rem] font-mono text-white tracking-[0.06em] sm:tracking-[0.08em] whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                                            >
                                                IR87 0570 0777 0001 0024 0880 01
                                            </motion.span>

                                            <motion.button
                                                whileHover={{ scale: 1.08, rotate: -3 }}
                                                whileTap={{ scale: 0.94 }}
                                                onClick={() => copyToClipboard("IR870570077700010024088001", "شماره شبا")}
                                                className="p-1.5 sm:p-2 shrink-0 cursor-pointer text-primary hover:text-white hover:bg-primary/20 rounded-lg transition-colors bg-slate-950/50 backdrop-blur-sm border border-primary/30 flex items-center justify-center"
                                                title="کپی شماره شبا"
                                                type="button"
                                            >
                                                <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full mt-0 flex justify-between items-end">
                                    <div className="flex flex-row items-center gap-2 text-right" dir="rtl">
                                        <span className="text-xs text-start text-slate-400 tracking-widest mb-1">
                                            دارنده کارت :
                                        </span>
                                        <motion.span
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.38, duration: 0.45 }}
                                            className="text-white mb-1 text-sm sm:text-base font-semibold tracking-wide whitespace-nowrap"
                                            style={{
                                                transform: "translateZ(0)",
                                                backfaceVisibility: "hidden",
                                            }}
                                        >
                                            مائده شعاعی
                                        </motion.span>
                                    </div>

                                    <motion.div
                                        animate={{ y: [0, -2, 0], rotate: [0, 1, 0] }}
                                        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-primary/30 shrink-0" />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            ) : null}

            <motion.div
                //@ts-ignore
                variants={itemVariants}
                className="mt-8 w-full"
            >
                <ReceiptForm
                    orderId={orderId}
                    loading={loading}
                    onSubmit={onConfirmReceipt}
                    onBack={onBack}
                    supportLink={supportLink}
                />
            </motion.div>
        </motion.div>
    );
}