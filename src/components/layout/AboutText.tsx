"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function AboutText() {
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldReduceMotion = useReducedMotion();
    const transition = shouldReduceMotion
        ? { duration: 0 }
        : { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const };

    return (
        <div className="max-w-3xl">
            <motion.div
                id="about-get-premium-text"
                initial={false}
                animate={{ height: isExpanded ? "auto" : "2.875rem" }}
                transition={transition}
                className="relative overflow-hidden"
            >
                <p className="text-slate-400 leading-relaxed text-justify">
                    در سال‌های اخیر، محدودیت‌ها، تحریم‌ها و افت کیفیت زیرساخت اینترنت ، دسترسی کاربران ایرانی به
                    اینترنت بین‌الملل را با چالش های متعددی مواجه کرده است. در چنین شرایطی، دسترسی پایدار، آزاد و امن
                    به سرویس های جهانی، به یک ضرورت تبدیل شده است. فروشگاه Get Premium با درک این نیاز شکل گرفته است
                    تا راهکاری قابل اعتماد، جهت اتصال به اینترنت آزاد فراهم کند. ما تلاش کرده‌ایم با ارائه اتصالی با
                    کیفیت و بهینه، امکان استفاده از اینترنت بین‌الملل را بدون نگرانی از محدودیت‌ها و اختلالات، برای
                    کاربران فراهم کنیم.
                </p>
                <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{ opacity: isExpanded ? 0 : 1 }}
                    transition={transition}
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent via-slate-900/55 to-slate-900"
                />
            </motion.div>
            <button
                type="button"
                onClick={() => setIsExpanded((expanded) => !expanded)}
                aria-expanded={isExpanded}
                aria-controls="about-get-premium-text"
                className="mt-2 inline-flex min-h-11 cursor-pointer items-center text-sm font-medium text-primary transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
                {isExpanded ? "مشاهده کمتر" : "مشاهده بیشتر"}
            </button>
        </div>
    );
}
