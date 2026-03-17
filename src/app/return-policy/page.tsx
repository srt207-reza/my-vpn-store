"use client";

import { RefreshCcw, PackageOpen, AlertTriangle, Clock, CreditCard, CheckCircle2, ListOrdered } from "lucide-react";

const RETURN_SECTIONS = [
    {
        id: "conditions",
        title: "۱. شرایط پذیرش کالای مرجوعی",
        icon: <PackageOpen className="w-6 h-6" />,
        content: [
            "با توجه به رعایت پروتکل‌های بهداشتی، محصولات آرایشی و بهداشتی تنها در صورت «باز نشدن پلمپ اصلی» و «عدم مخدوش شدن بسته‌بندی» تا ۷ روز پس از تحویل قابل بازگشت هستند.",
            "در صورتی که کالای دریافتی از نظر فیزیکی آسیب دیده باشد (مثلاً شکستگی شیشه عطر یا نشتی محصول)، باید حداکثر تا ۲۴ ساعت پس از دریافت کالا، موضوع را به پشتیبانی اطلاع دهید.",
            "اگر کالای ارسال شده با سفارش شما (از نظر رنگ، مدل، حجم یا برند) مغایرت دارد، لطفاً پیش از باز کردن پلمپ کالا، با پشتیبانی تماس بگیرید.",
            "کالاهایی که دارای تاریخ انقضای کمتر از ۳ ماه باشند (مگر آنکه در زمان خرید در سایت قید شده باشد)، بدون قید و شرط قابل مرجوع کردن هستند.",
        ],
    },
    {
        id: "exceptions",
        title: "۲. کالا در چه شرایطی قابل بازگشت نیست؟",
        icon: <AlertTriangle className="w-6 h-6" />,
        content: [
            "باز شدن پلمپ، سلفون یا وکیوم محصولات آرایشی، پوستی و عطریات (حتی اگر از محصول استفاده نشده باشد).",
            "کالاهایی که به عنوان هدیه یا اشانتیون همراه سفارش ارسال شده‌اند.",
            "بروز حساسیت پوستی پس از استفاده از محصول (سالونا مسئولیتی در قبال ناسازگاری ترکیبات محصول با پوست شما ندارد، لطفاً پیش از خرید ترکیبات را مطالعه فرمایید).",
            "آسیب‌دیدگی کالا به دلیل استفاده نادرست یا نگهداری در شرایط نامناسب توسط مشتری.",
        ],
    },
    {
        id: "steps",
        title: "۳. مراحل ثبت درخواست مرجوعی",
        icon: <ListOrdered className="w-6 h-6" />,
        content: [
            "ثبت درخواست: وارد پروفایل کاربری خود شوید، به بخش «سفارش‌های من» بروید و روی گزینه «درخواست مرجوعی» کلیک کنید، یا با پشتیبانی تماس بگیرید.",
            "ارسال مستندات: در صورت وجود مغایرت یا آسیب فیزیکی، عکس واضح از کالا و کارتن پستی آن را برای کارشناسان ما در واتس‌اپ یا تلگرام ارسال کنید.",
            "تایید اولیه: کارشناسان ما درخواست شما را بررسی کرده و در صورت تایید، هماهنگی‌های لازم برای بازگرداندن کالا را انجام می‌دهند.",
            "ارسال کالا: کالا را به همراه فاکتور و با بسته‌بندی ایمن، به آدرس پستی سالونا ارسال نمایید (هزینه پست در صورت تایید اشتباه از سوی سالونا، به شما عودت داده می‌شود).",
        ],
    },
    {
        id: "refund",
        title: "۴. روند رسیدگی و استرداد وجه",
        icon: <CreditCard className="w-6 h-6" />,
        content: [
            "پس از رسیدن کالای مرجوعی به انبار سالونا، کارشناسان کنترل کیفیت وضعیت کالا را بررسی می‌کنند (این فرآیند ۱ تا ۲ روز کاری زمان می‌برد).",
            "در صورت تایید سلامت و پلمپ بودن کالا (یا تایید نقص اولیه)، مبلغ کالا به کیف پول شما در سایت یا شماره شبا بانکی اعلام شده عودت داده می‌شود.",
            "واریز وجه به حساب بانکی مشتریان، بین ۲۴ تا ۴۸ ساعت کاری (پس از تایید نهایی انبار) انجام خواهد شد.",
        ],
    },
];

export default function ReturnPolicyPage() {
    return (
        <main className="min-h-screen bg-gray-50/50 font-vazir pb-24" dir="rtl">
            {/* هدر صفحه */}
            <div className="bg-white border-b border-gray-100 py-16 mb-12">
                <div className="container flex flex-col items-center text-center">
                    <div className="p-4 bg-salona-50 text-salona-500 rounded-2xl mb-6 animate-fade-in">
                        <RefreshCcw className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 font-iransans mb-4">
                        رویه بازگرداندن کالا
                    </h1>
                    <p className="text-gray-500 text-lg mb-4 max-w-2xl mx-auto">
                        رضایت شما اولویت ماست. در این صفحه شرایط و مراحل بازگرداندن محصولات آرایشی و بهداشتی خریداری شده
                        از سالونا را مطالعه فرمایید.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-full text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        <span>مهلت مرجوعی: ۷ روز پس از تحویل کالا</span>
                    </div>
                </div>
            </div>

            <div className="container max-w-4xl">
                {/* بخش هشدار بهداشتی */}
                <div className="mb-10 bg-orange-50 border border-orange-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4 text-orange-800 animate-fade-in">
                    <AlertTriangle className="w-8 h-8 shrink-0 text-orange-500" />
                    <div>
                        <h3 className="font-bold font-iransans text-lg mb-1">توجه مهم در خصوص لوازم آرایشی</h3>
                        <p className="text-sm leading-relaxed opacity-90 text-justify">
                            بر اساس قوانین وزارت بهداشت، لوازم آرایشی و مراقبت پوستی دره‌بندی کالاهای حساس قرار دارند.
                            لذا مرجوع کردن این کالاها صرفاً در صورت <strong>عدم بازگشایی پلمپ کارخانه</strong> و
                            دست‌نخوردگی کامل محصول امکان‌پذیر است.
                        </p>
                    </div>
                </div>

                {/* محتوای قوانین مرجوعی */}
                <div className="space-y-8 animate-fade-in">
                    {RETURN_SECTIONS.map((section) => (
                        <section
                            key={section.id}
                            className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-salona-100"
                        >
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                                <div className="p-3 bg-salona-50 text-salona-500 rounded-xl">{section.icon}</div>
                                <h2 className="text-2xl font-bold text-gray-800 font-iransans">{section.title}</h2>
                            </div>

                            <ul className="space-y-4">
                                {section.content.map((paragraph, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2
                                            className={`w-5 h-5 shrink-0 mt-1 ${section.id === "exceptions" ? "text-red-400" : "text-salona-300"}`}
                                        />
                                        <p className="text-gray-600 leading-loose text-justify">{paragraph}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>

                {/* دکمه ثبت درخواست مرجوعی */}
                <div className="mt-12 text-center">
                    <button className="bg-salona-500 cursor-pointer text-white px-10 py-4 rounded-2xl font-bold font-iransans text-lg shadow-lg shadow-salona-200 hover:bg-salona-600 hover:-translate-y-1 transition-all">
                        ثبت درخواست مرجوعی در پنل کاربری
                    </button>
                    <p className="mt-4 text-gray-500 text-sm">
                        یا در صورت نیاز به راهنمایی بیشتر با{" "}
                        <a href="tel:08691009185" className="text-salona-500 font-bold hover:underline">
                            شماره پشتیبانی
                        </a>{" "}
                        تماس بگیرید.
                    </p>
                </div>
            </div>
        </main>
    );
}
