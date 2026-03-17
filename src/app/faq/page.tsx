"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion, ShoppingBag, CalendarDays, ShieldCheck, Headset } from "lucide-react";
import Link from "next/link";

// داده‌های فرضی برای سوالات متداول
const FAQ_CATEGORIES = [
    {
        id: "shop",
        title: "خرید و سفارش محصولات",
        icon: <ShoppingBag className="w-6 h-6" />,
        faqs: [
            {
                q: "چگونه می‌توانم سفارش خود را پیگیری کنم؟",
                a: "پس از ثبت سفارش، یک کد رهگیری پیامک می‌شود. همچنین می‌توانید با مراجعه به بخش «سفارش‌های من» در پنل کاربری، وضعیت لحظه‌ای مرسوله خود را مشاهده کنید.",
            },
            {
                q: "آیا امکان مرجوع کردن کالای آرایشی وجود دارد؟",
                a: "به دلیل رعایت مسائل بهداشتی، کالاهای آرایشی و بهداشتی تنها در صورت پلمپ بودن و وجود نقص فیزیکی در بسته‌بندی، تا ۷ روز قابل مرجوع کردن هستند.",
            },
            {
                q: "هزینه ارسال سفارشات چقدر است؟",
                a: "هزینه ارسال برای سفارش‌های بالای ۱ میلیون تومان کاملاً رایگان است. برای مبالغ کمتر، بر اساس تعرفه پست و آدرس شما محاسبه می‌شود.",
            },
        ],
    },
    {
        id: "booking",
        title: "رزرو نوبت آرایشگاه",
        icon: <CalendarDays className="w-6 h-6" />,
        faqs: [
            {
                q: "آیا می‌توانم نوبت رزرو شده را لغو یا جابجا کنم؟",
                a: "بله، تا ۲۴ ساعت قبل از زمان مقرر می‌توانید نوبت خود را از طریق پنل کاربری به صورت رایگان لغو کرده یا به زمان دیگری موکول کنید.",
            },
            {
                q: "مبلغ بیعانه نوبت‌دهی چگونه محاسبه می‌شود؟",
                a: "بسته به نوع خدمات آرایشگاه (مثلاً رنگ مو یا میکاپ عروس)، مبلغی بین ۲۰ تا ۳۰ درصد کل هزینه به عنوان بیعانه در زمان رزرو آنلاین دریافت می‌شود.",
            },
        ],
    },
    {
        id: "account",
        title: "حساب کاربری و امنیت",
        icon: <ShieldCheck className="w-6 h-6" />,
        faqs: [
            {
                q: "چگونه اطلاعات پروفایل خود را ویرایش کنم؟",
                a: "وارد حساب کاربری خود شوید، به بخش «تنظیمات پروفایل» بروید و اطلاعاتی مانند آدرس، شماره تماس و نام خود را ویرایش و ذخیره کنید.",
            },
        ],
    },
];

export default function FAQPage() {
    // وضعیت برای مدیریت تب‌های باز (آیدی سوال باز شده را ذخیره می‌کند)
    const [openItem, setOpenItem] = useState<string | null>(null);

    const toggleItem = (id: string) => {
        setOpenItem(openItem === id ? null : id);
    };

    return (
        <main className="min-h-screen bg-gray-50/30 font-vazir pb-24" dir="rtl">
            {/* بخش هدر صفحه */}
            <div className="bg-salona-50/50 border-b border-salona-100 py-16 mb-12">
                <div className="container flex flex-col items-center text-center">
                    <div className="p-4 bg-white text-salona-500 rounded-2xl shadow-sm mb-6 animate-fade-in">
                        <MessageCircleQuestion className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 font-iransans mb-4">سوالات متداول</h1>
                    <p className="text-gray-500 text-lg max-w-xl">
                        پاسخ پرتکرارترین سوالات درباره خرید محصولات آرایشی و رزرو نوبت آرایشگاه را در اینجا پیدا کنید.
                    </p>
                </div>
            </div>

            <div className="container max-w-4xl">
                {/* لیست دسته‌بندی‌ها و سوالات */}
                <div className="space-y-12 animate-fade-in">
                    {FAQ_CATEGORIES.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                                <div className="p-3 bg-salona-50 text-salona-500 rounded-xl">{category.icon}</div>
                                <h2 className="text-2xl font-bold text-gray-800 font-iransans">{category.title}</h2>
                            </div>

                            <div className="space-y-4">
                                {category.faqs.map((faq, index) => {
                                    const itemId = `${category.id}-${index}`;
                                    const isOpen = openItem === itemId;

                                    return (
                                        <div
                                            key={itemId}
                                            className={`border rounded-2xl transition-all duration-300 ${
                                                isOpen
                                                    ? "border-salona-300 bg-salona-50/30"
                                                    : "border-gray-100 bg-white hover:border-gray-200"
                                            }`}
                                        >
                                            <button
                                                onClick={() => toggleItem(itemId)}
                                                className="w-full cursor-pointer flex items-center justify-between p-5 text-right focus:outline-none"
                                            >
                                                <span
                                                    className={`font-medium ${isOpen ? "text-salona-600" : "text-gray-700"}`}
                                                >
                                                    {faq.q}
                                                </span>
                                                <ChevronDown
                                                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                                                        isOpen ? "rotate-180 text-salona-500" : ""
                                                    }`}
                                                />
                                            </button>

                                            {/* محتوای آکاردئون */}
                                            <div
                                                className={`overflow-hidden transition-all duration-300 px-5 ${
                                                    isOpen ? "max-h-48 pb-5 opacity-100" : "max-h-0 opacity-0"
                                                }`}
                                            >
                                                <p className="text-gray-600 text-sm leading-loose border-t border-salona-100/50 pt-4">
                                                    {faq.a}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* بخش تماس با پشتیبانی (CTA) */}
                <div className="mt-16 bg-gradient-to-r from-salona-600 to-salona-400 rounded-3xl p-8 md:p-10 text-center text-white shadow-lg shadow-salona-200">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                        <Headset className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold font-iransans mb-3">پاسخ سوال خود را پیدا نکردید؟</h3>
                    <p className="text-salona-50 mb-8 max-w-lg mx-auto">
                        تیم پشتیبانی سالونا در تمامی روزهای هفته آماده پاسخگویی و راهنمایی شما عزیزان می‌باشد.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="tel:08691009185"
                            className="bg-white text-salona-600 px-8 py-3 rounded-xl font-bold hover:bg-salona-50 transition-colors w-full sm:w-auto"
                        >
                            تماس با پشتیبانی
                        </a>
                        <Link
                            href={"/tickets"}
                            className="bg-salona-700/30 text-white px-8 py-3 rounded-xl font-medium hover:bg-salona-700/50 transition-colors w-full sm:w-auto"
                        >
                            ارسال تیکت
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
