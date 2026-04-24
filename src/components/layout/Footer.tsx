import Link from "next/link";
import { Zap, Send, ShieldCheck } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-store-border bg-slate-900/50 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                    {/* بخش درباره ما */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            درباره GetPremium
                        </h3>
                        <p className="text-slate-400 leading-relaxed text-justify">
                            ما در GetPremium با ارائه راهکارهای اتصال امن، سریع و پایدار، دغدغه‌ی شما را برای دسترسی به
                            اینترنت جهانی و آزاد برطرف می‌کنیم. با پرداخت بر اساس حجم مصرفی، بدون محدودیت زمانی در دنیای
                            وب کاوش کنید.
                        </p>
                    </div>

                    {/* بخش لینک‌های سریع */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">دسترسی سریع</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/plans"
                                    className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
                                >
                                    <Zap className="w-4 h-4" /> خرید ترافیک
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
                                >
                                    <ShieldCheck className="w-4 h-4" /> قوانین و مقررات
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* بخش پشتیبانی */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">پشتیبانی و شبکه‌های اجتماعی</h3>
                        <div className="flex flex-col gap-3">
                            <a
                                href="https://t.me/GetPremium_support"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                            >
                                <Send className="w-4 h-4 text-primary" /> ارتباط با پشتیبانی
                            </a>
                            <a
                                href="https://t.me/GetPremium_ir"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                            >
                                <Send className="w-4 h-4 text-primary" /> کانال اطلاع‌رسانی
                            </a>
                        </div>
                    </div>
                </div>

                {/* کپی رایت */}
                <div className="mt-8 pt-6 border-t border-store-border text-center text-slate-500 text-xs">
                    © {new Date().getFullYear()} تمامی حقوق محفوظ است. GetPremium - ارائه دهنده خدمات اتصال امن و
                    پایدار.
                </div>
            </div>
        </footer>
    );
}
