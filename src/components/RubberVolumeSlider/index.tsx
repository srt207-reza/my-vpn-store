// src/components/RubberVolumeSlider.tsx

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

interface RubberVolumeSliderProps {
    allowedValues: number[]; // جایگزینی min/max با آرایه‌ای از اعداد مجاز
    value: number;
    onChange: (value: number) => void;
}

export default function RubberVolumeSlider({ allowedValues, value, onChange }: RubberVolumeSliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [width, setWidth] = useState(0);

    const dragY = useSpring(0, { stiffness: 500, damping: 20, mass: 1 });
    const dragX = useMotionValue(0);

    const maxIndex = allowedValues.length - 1;
    
    // محاسبه درصد پیش‌فرض بر اساس ایندکس مقدار انتخابی درون آرایه
    const initialPercentage = Math.max(0, allowedValues.indexOf(value)) / maxIndex;

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
    }, [width, value, allowedValues, initialPercentage, isDragging, dragX]);

    const handlePointerMove = useCallback(
        (e: PointerEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();

            let newX = e.clientX - rect.left;
            newX = Math.max(0, Math.min(newX, rect.width));
            dragX.set(newX);

            // محاسبه ایندکس جدید بر اساس موقعیت ماوس
            const percentage = newX / rect.width;
            const mappedIndex = Math.round(percentage * maxIndex);
            const newValue = allowedValues[mappedIndex];
            
            if (newValue !== value) {
                onChange(newValue);
            }

            const centerY = rect.top + rect.height / 2;
            let deltaY = e.clientY - centerY;

            const maxStretch = 25;
            deltaY = Math.max(-maxStretch, Math.min(deltaY, maxStretch));
            dragY.set(deltaY);
        },
        [dragX, dragY, allowedValues, maxIndex, onChange, value]
    );

    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
        dragY.set(0); 

        // همگام‌سازی موقعیت هندل با مقدار دقیق انتخاب شده (Snapping)
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const snapIndex = allowedValues.indexOf(value);
            const snapX = (snapIndex / maxIndex) * rect.width;
            dragX.set(snapX);
        }

        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        document.body.style.cursor = "default";
    }, [dragY, dragX, handlePointerMove, allowedValues, value, maxIndex]);

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        setIsDragging(true);
        document.body.style.cursor = "grabbing";

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);

        handlePointerMove(e.nativeEvent);
    };

    const path = useTransform(() => {
        const x = dragX.get();
        const y = dragY.get();
        const centerY = 41.5;
        // میزان پدینگ کارت والد (p-6 معادل 24 پیکسل است) 
        // این مقدار باعث می‌شود خط از هر دو طرف به لبه‌های کارت بچسبد
        const pad = 0; 

        return `
            M ${-pad} ${centerY} 
            C ${(x - pad) / 2} ${centerY}, ${x - 15} ${centerY + y}, ${x} ${centerY + y} 
            C ${(x + width + pad) / 2} ${centerY}, ${width + pad} ${centerY}, ${width + pad} ${centerY}
        `;
    });

    return (
        <div
            className="w-full max-w-sm mx-auto bg-store-panel p-6 rounded-2xl border border-store-border shadow-lg select-none"
            dir="ltr"
        >
            <div className="flex justify-between items-center mb-6">
                <div className="text-3xl font-black text-white flex items-baseline gap-1">
                    {value.toLocaleString("fa-IR")} <span className="text-sm text-primary font-bold">GB</span>
                </div>
                <h3 className="text-lg font-semibold uppercase tracking-wider mb-1">حجم ترافیک</h3>
            </div>

            <div
                ref={containerRef}
                className="relative w-full h-[83px] touch-none cursor-grab active:cursor-grabbing"
                onPointerDown={handlePointerDown}
            >
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <motion.path
                        d={path}
                        fill="none"
                        stroke="#334155"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <clipPath id="active-line-clip">
                        <motion.rect x="0" y="-50" width={dragX} height="200" />
                    </clipPath>
                    <motion.path
                        d={path}
                        fill="none"
                        stroke="#06b6d4" 
                        strokeWidth="3"
                        strokeLinecap="round"
                        clipPath="url(#active-line-clip)"
                    />
                </svg>

                <motion.div
                    className="absolute top-[41.5px] w-6 h-6 -ml-3 -mt-3 bg-white rounded-full border-4 border-blue-500 shadow-md flex items-center justify-center pointer-events-none transition-colors"
                    style={{
                        x: dragX,
                        y: dragY,
                        backgroundColor: isDragging ? "#e0e7ff" : "#ffffff",
                    }}
                />
            </div>
        </div>
    );
}
