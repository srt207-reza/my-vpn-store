"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShieldCheck, Zap, FileText } from "lucide-react";
import LOGO from "@/../public/assets/images/Logo.png"
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
        { name: "صفحه اصلی", href: "/", icon: null },
        { name: "خرید ترافیک", href: "/plans", icon: <Zap className="w-4 h-4" /> },
        { name: "قوانین و مقررات", href: "/terms", icon: <FileText className="w-4 h-4" /> },
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
                            GetPremium
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

                    {/* Desktop Button */}
                    <div className="hidden md:flex items-center">
                        <a
                            href="https://t.me/GetPremium_support"
                            target="_blank"
                            rel="noreferrer"
                            className="px-6 py-2.5 rounded-full bg-transparent border border-slate-500 text-white text-sm font-bold hover:border-primary hover:text-primary hover:scale-105 transition-all duration-300"
                        >
                            پشتیبانی تلگرام
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
                            <motion.a
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                href="https://t.me/GetPremium_support"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 text-center px-4 py-3.5 rounded-full bg-primary text-slate-900 hover:bg-cyan-400 hover:scale-105 active:bg-cyan-500 font-bold shadow-lg shadow-primary/20 transition-all duration-300"
                            >
                                ارتباط با پشتیبانی
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
