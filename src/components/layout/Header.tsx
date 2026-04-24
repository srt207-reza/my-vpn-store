"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Music, Users, FileText } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // افکت شیشه‌ای شدن هدر هنگام اسکرول
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "صفحه اصلی", href: "/" },
    { name: "اسپاتیفای شخصی", href: "/spotify/individual", icon: <Music className="w-4 h-4 text-green-400" /> },
    { name: "اسپاتیفای فمیلی", href: "/spotify/family", icon: <Users className="w-4 h-4 text-green-500" /> },
    { name: "قوانین و مقررات", href: "/terms", icon: <FileText className="w-4 h-4 text-purple-400" /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-store-panel backdrop-blur-lg border-b border-store-border shadow-2xl"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* لوگو */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-tr from-green-500 to-blue-500 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
              دیجیتال استور
            </span>
          </Link>

          {/* منوی دسکتاپ */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-all hover:-translate-y-0.5 duration-200 group"
              >
                <span className="group-hover:animate-bounce">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </nav>

          {/* دکمه دسکتاپ */}
          <div className="hidden md:flex items-center">
            <a 
              href="https://t.me/getSpotify_Support" 
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium hover:bg-slate-700 hover:border-slate-500 hover:shadow-lg hover:shadow-slate-700/50 transition-all duration-300"
            >
              پشتیبانی تلگرام
            </a>
          </div>

          {/* دکمه همبرگری موبایل */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* منوی موبایل */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-2xl"
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
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white active:bg-slate-700 transition-all"
                  >
                    {link.icon}
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.a 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                href="https://t.me/getSpotify_Support" 
                target="_blank"
                rel="noreferrer"
                className="mt-4 text-center px-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
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
