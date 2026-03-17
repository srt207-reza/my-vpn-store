"use client";

import { ShieldCheck, Database, Lock, Cookie, UserCog, Eye, CheckCircle2 } from "lucide-react";

const PRIVACY_SECTIONS = [
    {
        id: "collection",
        title: "۱. چه اطلاعاتی را جمع‌آوری می‌کنیم؟",
        icon: <Database className="w-6 h-6" />,
        content: [
            "هنگام ثبت‌نام، ثبت سفارش یا رزرو نوبت در سالونا، اطلاعاتی نظیر نام و نام خانوادگی، شماره تماس، آدرس پستی و ایمیل شما دریافت می‌شود.",
            "به منظور بهبود تجربه کاربری، اطلاعاتی درباره نحوه استفاده شما از سایت (مانند صفحات بازدید شده، مدت زمان حضور و نوع دستگاه) به صورت ناشناس جمع‌آوری می‌گردد.",
            "در زمان پرداخت آنلاین، هیچ‌گونه اطلاعات بانکی (مانند رمز دوم یا شماره کارت کامل) در سرورهای سالونا ذخیره نمی‌شود و تمامی تراکنش‌ها از طریق درگاه‌های امن بانکی انجام می‌پذیرد.",
        ],
    },
    {
        id: "usage",
        title: "۲. چگونه از اطلاعات شما استفاده می‌کنیم؟",
        icon: <Eye className="w-6 h-6" />,
        content: [
            "پردازش و ارسال سفارشات فروشگاه و همچنین ثبت دقیق و یادآوری نوبت‌های آرایشگاه.",
            "ارتباط با شما جهت پشتیبانی، اطلاع‌رسانی درباره وضعیت سفارش‌ها، تغییرات نوبت‌ها و همچنین ارسال پیشنهادات ویژه (در صورت رضایت شما).",
            "تحلیل داده‌ها برای بهبود عملکرد سایت، رفع باگ‌ها و ارائه خدمات شخصی‌سازی شده.",
        ],
    },
    {
        id: "security",
        title: "۳. امنیت داده‌ها و اطلاعات",
        icon: <Lock className="w-6 h-6" />,
        content: [
            "سالونا از پروتکل‌های امنیتی استاندارد (مانند SSL) برای رمزنگاری اطلاعات در زمان تبادل داده‌ها بین مرورگر شما و سرورهای سایت استفاده می‌کند.",
            "دسترسی به اطلاعات شخصی شما تنها برای پرسنل مجاز سالونا و صرفاً جهت ارائه خدمات (مانند ارسال کالا) امکان‌پذیر است.",
            "ما متعهد می‌شویم که اطلاعات شخصی شما را به هیچ شخص ثالث، شرکت یا نهاد تبلیغاتی نفروشیم یا اجاره ندهیم، مگر با حکم مراجع قضایی ذی‌صلاح.",
        ],
    },
    {
        id: "rights",
        title: "۴. حقوق شما در قبال داده‌هایتان",
        icon: <UserCog className="w-6 h-6" />,
        content: [
            "شما در هر زمان حق دارید با مراجعه به پنل کاربری خود، اطلاعات شخصی‌تان را مشاهده، ویرایش و یا تکمیل کنید.",
            "در صورت تمایل به حذف کامل حساب کاربری و اطلاعات مرتبط، می‌توانید درخواست خود را از طریق تیکت یا تماس با پشتیبانی ثبت نمایید.",
            "شما می‌توانید در هر زمان از دریافت پیامک‌ها و ایمیل‌های تبلیغاتی انصراف دهید (لغو اشتراک).",
        ],
    },
    {
        id: "cookies",
        title: "۵. سیاست استفاده از کوکی‌ها (Cookies)",
        icon: <Cookie className="w-6 h-6" />,
        content: [
            "سالونا برای لاگین نگه داشتن کاربران، حفظ آیتم‌های سبد خرید و ارائه تجربه کاربری روان‌تر، از کوکی‌ها استفاده می‌کند.",
            "کوکی‌ها فایل‌های متنی کوچکی هستند که در مرورگر شما ذخیره می‌شوند و هیچ‌گونه خطری برای دستگاه شما ندارند.",
            "شما می‌توانید از طریق تنظیمات مرورگر خود، دریافت کوکی‌ها را مسدود کنید؛ اما این کار ممکن است باعث اختلال در برخی عملکردهای سایت (مانند سبد خرید) شود.",
        ],
    },
];

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-gray-50/50 font-vazir pb-24" dir="rtl">
            {/* هدر صفحه */}
            <div className="bg-white border-b border-gray-100 py-16 mb-12">
                <div className="container flex flex-col items-center text-center">
                    <div className="p-4 bg-salona-50 text-salona-500 rounded-2xl mb-6 animate-fade-in">
                        <ShieldCheck className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 font-iransans mb-4">
                        حریم خصوصی کاربران
                    </h1>
                    <p className="text-gray-500 text-lg mb-4 max-w-2xl mx-auto">
                        حفاظت از اطلاعات شخصی شما برای سالونا در بالاترین اولویت قرار دارد. در این صفحه، نحوه مدیریت
                        داده‌های شما را شفاف‌سازی کرده‌اییم.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-salona-50 text-salona-600 px-4 py-2 rounded-full text-sm font-medium">
                        <Lock className="w-4 h-4" />
                        <span>آخرین به‌روزرسانی: ۲۶ اسفند ۱۴۰۴</span>
                    </div>
                </div>
            </div>

            <div className="container max-w-4xl">
                {/* محتوای حریم خصوصی */}
                <div className="space-y-8 animate-fade-in">
                    {PRIVACY_SECTIONS.map((section) => (
                        <section
                            key={section.id}
                            className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 transition-shadow hover:shadow-md"
                        >
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                                <div className="p-3 bg-salona-50 text-salona-500 rounded-xl">{section.icon}</div>
                                <h2 className="text-2xl font-bold text-gray-800 font-iransans">{section.title}</h2>
                            </div>

                            <ul className="space-y-4">
                                {section.content.map((paragraph, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-salona-300 shrink-0 mt-1" />
                                        <p className="text-gray-600 leading-loose text-justify">{paragraph}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>

                {/* تماس با پشتیبانی حریم خصوصی */}
                <div className="mt-12 bg-gradient-to-l from-gray-900 to-gray-800 rounded-3xl p-8 md:p-10 text-center text-white shadow-xl shadow-gray-200">
                    <ShieldCheck className="w-10 h-10 mx-auto mb-4 text-salona-400" />
                    <h3 className="text-2xl font-bold font-iransans mb-3">سوالات بیشتری درباره حریم خصوصی دارید؟</h3>
                    <p className="text-gray-300 mb-8 max-w-lg mx-auto">
                        اگر نگرانی یا سوالی در خصوص نحوه مدیریت داده‌های خود دارید، تیم امنیت و پشتیبانی سالونا آماده
                        پاسخگویی به شماست.
                    </p>
                    <a
                        href="tel:08691009185"
                        className="inline-flex items-center gap-2 bg-salona-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-salona-600 transition-colors"
                    >
                        تماس با ما
                    </a>
                </div>
            </div>
        </main>
    );
}
