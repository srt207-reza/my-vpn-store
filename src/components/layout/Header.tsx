"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText, ShieldCheck } from "lucide-react";
import LOGO from "@/../public/assets/images/logo.png"
import Image from "next/image";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "خرید اشتراک", href: "/", icon: <ShieldCheck className="w-5 h-5" /> },
        // { name: "خرید ترافیک", href: "/plans", icon: <Zap className="w-5 h-5" /> },
        { name: "قوانین و مقررات", href: "/terms", icon: <FileText className="w-5 h-5" /> },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-store-panel/95 backdrop-blur-md border-b border-store-border shadow-2xl"
                    : "bg-transparent border-b border-transparent"
            }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="rounded-full transition-all duration-300 shadow-lg shadow-primary/20">
                            {/* <ShieldCheck className="w-5 h-5 text-slate-900" /> */}
                            <Image src={LOGO} alt="Logo" className="w-14 h-14" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight transition-colors">
                            Get Premium
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-all hover:-translate-y-0.5 duration-200 group"
                            >
                                {link.icon && (
                                    <span className="text-slate-400 group-hover:text-primary transition-colors">
                                        {link.icon}
                                    </span>
                                )}
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Button with Animated Border */}
                    <div className="hidden md:flex items-center">
                        <a
                            href="https://t.me/GetPremium_support"
                            target="_blank"
                            rel="noreferrer"
                            className="relative inline-flex overflow-hidden rounded-full p-[2px] group hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#06b6d4]/20"
                        >
                            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#06b6d4_0%,transparent_50%,#06b6d4_100%)]" />
                            <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-6 py-2.5 text-sm font-bold text-white backdrop-blur-3xl z-10 group-hover:bg-slate-900 transition-colors">
                                ارتباط با پشتیبانی
                            </span>
                        </a>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute top-full left-0 right-0 border-b border-store-border bg-store-panel shadow-2xl"
                    >
                        <div className="px-4 py-6 flex flex-col gap-2">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white active:bg-slate-700 transition-all font-bold group"
                                    >
                                        {link.icon && (
                                            <span className="group-hover:text-primary transition-colors">
                                                {link.icon}
                                            </span>
                                        )}
                                        <span>{link.name}</span>
                                    </Link>
                                </motion.div>
                            ))}
                            
                            {/* Mobile Button with Animated Border */}
                            <motion.a
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                href="https://t.me/GetPremium_support"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 relative flex overflow-hidden rounded-full p-[2px] group hover:scale-105 active:scale-95 transition-transform duration-300 shadow-lg shadow-[#06b6d4]/20"
                            >
                                <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#06b6d4_0%,transparent_50%,#06b6d4_100%)]" />
                                <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-4 py-3.5 text-sm font-bold text-white backdrop-blur-3xl z-10 group-hover:bg-slate-900 transition-colors">
                                    ارتباط با پشتیبانی
                                </span>
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
