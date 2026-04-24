"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

interface RubberVolumeSliderProps {
    min?: number;
    max?: number;
    value: number;
    onChange: (value: number) => void;
}

export default function RubberVolumeSlider({ min = 2, max = 15, value, onChange }: RubberVolumeSliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [width, setWidth] = useState(0);

    // مقادیر حرکتی (Motion Values) برای هندل کردن فیزیک کشسانی
    const dragY = useSpring(0, { stiffness: 500, damping: 20, mass: 1 });
    const dragX = useMotionValue(0);

    // محاسبه درصد پیش‌فرض بر اساس مقدار ورودی
    const initialPercentage = (value - min) / (max - min);

    // به‌روزرسانی عرض کانتینر برای محاسبات SVG
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.getBoundingClientRect().width);
            }
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    // تنظیم موقعیت اولیه X هندل
    useEffect(() => {
        if (width > 0 && !isDragging) {
            dragX.set(initialPercentage * width);
        }
    }, [width, value, min, max, initialPercentage, isDragging, dragX]);

    const handlePointerMove = useCallback(
        (e: PointerEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();

            // محاسبه موقعیت X و محدود کردن آن بین 0 و عرض کانتینر
            let newX = e.clientX - rect.left;
            newX = Math.max(0, Math.min(newX, rect.width));
            dragX.set(newX);

            // محاسبه مقدار جدید (گیگابایت) بر اساس موقعیت X
            const percentage = newX / rect.width;
            const newValue = Math.round(percentage * (max - min) + min);
            if (newValue !== value) {
                onChange(newValue);
            }

            // محاسبه کشش Y (Rubber Effect)
            const centerY = rect.top + rect.height / 2;
            let deltaY = e.clientY - centerY;

            // محدود کردن میزان کشش (حداکثر 25 پیکسل به بالا یا پایین)
            const maxStretch = 25;
            deltaY = Math.max(-maxStretch, Math.min(deltaY, maxStretch));
            dragY.set(deltaY);
        },
        [dragX, dragY, max, min, onChange, value],
    );

    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
        dragY.set(0); // بازگشت فنری به حالت افقی با رها کردن موس

        // همگام‌سازی موقعیت هندل با مقدار دقیق انتخاب شده (Snap to step)
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const snapX = ((value - min) / (max - min)) * rect.width;
            dragX.set(snapX);
        }

        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        document.body.style.cursor = "default";
    }, [dragY, dragX, handlePointerMove, min, max, value]);

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        setIsDragging(true);
        document.body.style.cursor = "grabbing";

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);

        // اعمال افکت بلافاصله در نقطه کلیک
        handlePointerMove(e.nativeEvent);
    };

    // تولید مسیر SVG به صورت داینامیک بر اساس موقعیت X و Y
    const path = useTransform(() => {
        const x = dragX.get();
        const y = dragY.get();
        const centerY = 41.5; // وسط ارتفاع 83 پیکسلی

        // فرمول ریاضی (Bézier curve) برای ایجاد حالت کشسانی لاستیک
        // $$ M = Start, C = Cubic Bezier Control Points $$
        return `
            M 0 ${centerY} 
            C ${x / 2} ${centerY}, ${x - 15} ${centerY + y}, ${x} ${centerY + y} 
            C ${x + 15} ${centerY + y}, ${width - (width - x) / 2} ${centerY}, ${width} ${centerY}
        `;
    });

    return (
        <div
            className="w-full max-w-[312px] mx-auto bg-store-panel p-6 rounded-2xl border border-store-border shadow-lg select-none"
            dir="ltr"
        >
            <div className="flex justify-between items-center mb-6">
                    <div className="text-3xl font-black text-white flex items-baseline gap-1">
                        {value} <span className="text-sm text-primary font-bold">GB</span>
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider mb-1">حجم ترافیک</h3>
                {/* <div className="text-xs text-slate-500 font-medium">
                    {min}GB الی {max}GB
                </div> */}
            </div>

            <div
                ref={containerRef}
                className="relative w-full h-[83px] touch-none cursor-grab active:cursor-grabbing"
                onPointerDown={handlePointerDown}
            >
                {/* SVG خطوط کشسانی */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {/* خط پس‌زمینه کم‌رنگ (غیر فعال) */}
                    <motion.path
                        d={path}
                        fill="none"
                        stroke="#334155" // رنگ خط غیرفعال (slate-700)
                        strokeWidth="2"
                        strokeLinecap="round"
                    />

                    {/* ماسک برای رنگی کردن بخش سمت چپ (فعال) */}
                    <clipPath id="active-line-clip">
                        <motion.rect x="0" y="-50" width={dragX} height="200" />
                    </clipPath>

                    {/* خط رنگی (فعال) */}
                    <motion.path
                        d={path}
                        fill="none"
                        stroke="#06b6d4" // رنگ اصلی (primary/blue-500)
                        strokeWidth="3"
                        strokeLinecap="round"
                        clipPath="url(#active-line-clip)"
                    />
                </svg>

                {/* هندل (نقطه درگ) */}
                <motion.div
                    className="absolute top-[41.5px] w-6 h-6 -ml-3 -mt-3 bg-white rounded-full border-4 border-blue-500 shadow-md flex items-center justify-center pointer-events-none transition-colors"
                    style={{
                        x: dragX,
                        y: dragY,
                        backgroundColor: isDragging ? "#e0e7ff" : "#ffffff", // تغییر رنگ هنگام درگ
                    }}
                >
                    {/* <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> */}
                </motion.div>
            </div>
        </div>
    );
}
