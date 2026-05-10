"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Mail, User } from "lucide-react";

export default function StepContactInfo({ formData, setFormData, handleNameChange, setStep, themeBg }: any) {
    return (
        <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700 space-y-6"
        >
            <h2 className="text-lg font-medium text-slate-200 mb-6">مشخصات خود را جهت پیگیری وارد کنید:</h2>
            <div className="space-y-5">
                <div>
                    <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                        <Mail className="w-4 h-4" /> آدرس ایمیل <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={formData.contactInfo}
                        onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="example@domain.com"
                        dir="ltr"
                    />
                    <p className="text-xs text-slate-500 mt-2 text-justify">
                        ارسال کانفیگ و اطلاعات سفارش به این آدرس ایمیل انجام خواهد شد.
                    </p>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                        <User className="w-4 h-4" /> نام و نام خانوادگی <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.fullName}
                        onChange={handleNameChange}
                        maxLength={50}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="Only English Letters (e.g. Ali Hosseini)"
                        dir="ltr"
                    />
                </div>
            </div>
            <div className="flex gap-3 pt-6">
                <button
                    onClick={() => setStep(1)}
                    className="px-6 cursor-pointer py-4 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                    بازگشت
                </button>
                <button
                    onClick={() => setStep(3)}
                    disabled={!formData.fullName.trim() || !formData.contactInfo.trim()}
                    className={`flex-1 cursor-pointer py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${themeBg}`}
                >
                    تایید اطلاعات <ChevronLeft className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}
