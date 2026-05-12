"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import PageLoader from "../ui/page-loader/PageLoader";

const ShootingStars = dynamic(() => import("@/components/ui/shooting-stars").then((m) => m.ShootingStars), {
    ssr: false,
});

const StarsBackground = dynamic(() => import("@/components/ui/stars-background").then((m) => m.StarsBackground), {
    ssr: false,
});

export default function BackgroundProvider() {
    const [readyCount, setReadyCount] = useState(0);
    const [showLoader, setShowLoader] = useState(true);

    const handleReady = useCallback(() => {
        setReadyCount((prev) => prev + 1);
    }, []);

    useEffect(() => {
        if (readyCount >= 2) {
            setShowLoader(false);
        }
    }, [readyCount]);

    return (
        <>
            <AnimatePresence mode="wait">{showLoader && <PageLoader key="page-loader" />}</AnimatePresence>

            <ShootingStars onReady={handleReady} />
            <StarsBackground onReady={handleReady} />
        </>
    );
}
