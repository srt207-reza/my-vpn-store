"use client";

import { useEffect, useId, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

type MorphingTextProps = {
    value: string | number;
    className?: string;
    duration?: number;
};

export default function MorphingText({ value, className = "", duration = 0.75 }: MorphingTextProps) {
    const shouldReduceMotion = useReducedMotion();
    const filterId = `morph-threshold-${useId().replace(/:/g, "")}`;
    const text = String(value);
    const currentTextRef = useRef(text);
    const wrapperElementRef = useRef<HTMLSpanElement>(null);
    const previousElementRef = useRef<HTMLSpanElement>(null);
    const nextElementRef = useRef<HTMLSpanElement>(null);
    const [transition, setTransition] = useState({ from: text, to: text, version: 0 });

    useEffect(() => {
        if (text === currentTextRef.current) return;

        const previousText = currentTextRef.current;
        currentTextRef.current = text;
        setTransition(({ version }) => ({ from: previousText, to: text, version: version + 1 }));
    }, [text]);

    useEffect(() => {
        const previousElement = previousElementRef.current;
        const nextElement = nextElementRef.current;
        const wrapperElement = wrapperElementRef.current;

        if (!previousElement || !nextElement || !wrapperElement || transition.version === 0 || shouldReduceMotion)
            return;

        const fontSize = Number.parseFloat(window.getComputedStyle(nextElement).fontSize);
        const blurStrength = Math.min(4, Math.max(1.4, fontSize * 0.08));
        const maximumBlur = blurStrength * 12;

        const setMorph = (progress: number) => {
            const nextFraction = progress;
            const previousFraction = 1 - progress;
            const getBlur = (fraction: number) =>
                fraction === 0 ? maximumBlur : Math.min(blurStrength / fraction - blurStrength, maximumBlur);

            nextElement.style.filter = `blur(${getBlur(nextFraction)}px)`;
            nextElement.style.opacity = String(Math.pow(nextFraction, 0.4));

            previousElement.style.filter = `blur(${getBlur(previousFraction)}px)`;
            previousElement.style.opacity = String(Math.pow(previousFraction, 0.4));
        };

        wrapperElement.style.filter = `url(#${filterId}) blur(0.3px)`;
        setMorph(0);
        const controls = animate(0, 1, {
            duration,
            ease: "linear",
            onUpdate: setMorph,
            onComplete: () => {
                previousElement.style.filter = `blur(${maximumBlur}px)`;
                previousElement.style.opacity = "0";
                nextElement.style.filter = "blur(0px)";
                nextElement.style.opacity = "1";
                wrapperElement.style.filter = "none";
            },
        });

        return () => controls.stop();
    }, [duration, filterId, shouldReduceMotion, transition.version]);

    if (shouldReduceMotion) {
        return <span className={className}>{text}</span>;
    }

    return (
        <span
            ref={wrapperElementRef}
            className={`relative inline-grid ${className}`}
            aria-label={text}
        >
            <span aria-hidden className="invisible col-start-1 row-start-1">
                {text}
            </span>

            <span
                ref={previousElementRef}
                aria-hidden
                className="absolute inset-0 whitespace-nowrap"
                style={{ opacity: 0, filter: "blur(48px)" }}
            >
                {transition.from}
            </span>
            <span
                ref={nextElementRef}
                aria-hidden
                className="absolute inset-0 whitespace-nowrap"
                style={{ opacity: 1, filter: "blur(0px)" }}
            >
                {transition.to}
            </span>

            <svg aria-hidden className="absolute h-0 w-0" focusable="false">
                <defs>
                    <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                        <feColorMatrix
                            in="SourceGraphic"
                            type="matrix"
                            values="1 0 0 0 0
                                    0 1 0 0 0
                                    0 0 1 0 0
                                    0 0 0 255 -100"
                        />
                    </filter>
                </defs>
            </svg>
        </span>
    );
}
