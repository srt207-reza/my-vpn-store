"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function PageLoader() {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-0 z-[9999] overflow-hidden bg-store-base"
        >
            {/* Ambient Background */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="pointer-events-none absolute inset-0"
            >
                <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
            </motion.div>

            <div className="relative flex h-full items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                        delay: 0.12,
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex flex-col items-center gap-8"
                >
                    <div className="relative flex items-center justify-center">
                        <motion.div
                            animate={reduceMotion ? {} : { rotate: 360 }}
                            transition={{
                                repeat: Infinity,
                                duration: 10,
                                ease: "linear",
                            }}
                            className="absolute h-36 w-36 rounded-full border border-white/10"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                rotate: reduceMotion ? 0 : -360,
                            }}
                            transition={{
                                opacity: {
                                    delay: 0.2,
                                    duration: 0.4,
                                },
                                scale: {
                                    delay: 0.2,
                                    duration: 0.6,
                                    ease: [0.22, 1, 0.36, 1],
                                },
                                rotate: {
                                    repeat: Infinity,
                                    duration: 2.8,
                                    ease: "linear",
                                },
                            }}
                            className="absolute h-28 w-28 rounded-full border-2 border-transparent border-t-primary border-r-cyan-400"
                        />

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={
                                reduceMotion
                                    ? { opacity: 0.2 }
                                    : {
                                          scale: [1, 1.12, 1],
                                          opacity: [0.15, 0.35, 0.15],
                                      }
                            }
                            transition={{
                                delay: 0.25,
                                repeat: Infinity,
                                duration: 2.2,
                                ease: "easeInOut",
                            }}
                            className="absolute h-24 w-24 rounded-full bg-primary/20 blur-xl"
                        />

                        <motion.div
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={
                                reduceMotion
                                    ? { scale: 1, opacity: 1 }
                                    : {
                                          scale: [1, 1.05, 1],
                                          opacity: 1,
                                      }
                            }
                            transition={{
                                opacity: {
                                    delay: 0.18,
                                    duration: 0.35,
                                },
                                scale: reduceMotion
                                    ? {
                                          delay: 0.18,
                                          duration: 0.4,
                                      }
                                    : {
                                          delay: 0.18,
                                          repeat: Infinity,
                                          duration: 1.8,
                                          ease: "easeInOut",
                                      },
                            }}
                            className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-slate-950/90 shadow-[0_0_35px_rgba(6,182,212,0.14)]"
                        >
                            <div className="h-3.5 w-3.5 rounded-full bg-gradient-to-br from-primary to-cyan-400" />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.22,
                            duration: 0.55,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="flex flex-col items-center gap-3 text-center"
                    >
                        <h2 className="mt-8 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                            Get Premium
                        </h2>

                        <p className="max-w-xs text-sm leading-6 text-slate-400">
                            در حال آماده‌سازی تجربه‌ای سریع، امن و روان...
                        </p>

                        <div className="mt-2 h-1.5 w-56 overflow-hidden rounded-full bg-white/5 sm:w-64">
                            <motion.div
                                initial={{ x: "-200%", opacity: 0 }}
                                animate={{
                                    x: "200%",
                                    opacity: [0, 1, 1, 0],
                                }}
                                transition={{
                                    duration: 2.2,
                                    repeat: Infinity,
                                    ease: [0.42, 0, 0.58, 1],
                                }}
                                className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-primary to-cyan-400 will-change-transform"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}