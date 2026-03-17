"use client";

import { Scale, ShoppingBag, CalendarCheck, ShieldAlert, CheckCircle2 } from "lucide-react";

const TERMS_SECTIONS = [
    {
        id: "general",
        title: "۱. شرایط و قوانین عمومی",
        icon: <Scale className="w-6 h-6" />,
        content: [
            "کاربر گرامی، لطفاً موارد زیر را جهت استفاده بهینه از خدمات و برنامه‌های کاربردی سالونا به دقت ملاحظه فرمایید.",
            "ورود کاربران به وب‌سایت سالونا هنگام استفاده از پروفایل شخصی، و سایر خدمات ارائه شده توسط سالونا به معنای آگاه بودن و پذیرفتن شرایط و قوانین و همچنین نحوه استفاده از سرویس‌ها و خدمات سالونا است.",
            "توجه داشته باشید که ثبت سفارش و یا رزرو نوبت نیز در هر زمان به معنی پذیرفتن کامل کلیه شرایط و قوانین سالونا از سوی کاربر است. قوانین مندرج، جایگزین کلیه توافق‌های قبلی محسوب می‌شود.",
        ],
    },
    {
        id: "shop",
        title: "۲. قوانین فروشگاه و ارسال محصولات",
        icon: <ShoppingBag className="w-6 h-6" />,
        content: [
            "روز کاری به معنی روز شنبه تا پنج‌شنبه هر هفته، به استثنای تعطیلات عمومی در ایران است و کلیه سفارش‌های ثبت شده در طول روزهای کاری و اولین روز پس از تعطیلات پردازش می‌شوند.",
            "سالونا همواره در ارسال و تحویل کلیه سفارش‌های ثبت شده، نهایت دقت و تلاش خود را انجام می‌دهد. با وجود این، در صورتی که موجودی محصولی در سالونا به پایان برسد، حتی پس از اقدام مشتری به سفارش‌گذاری، حق کنسل کردن آن سفارش و یا استرداد وجه سفارش برای سالونا محفوظ است.",
            "در صورت بروز مشکل در پردازش نهایی سبد خرید مانند اتمام موجودی کالا یا انصراف مشتری، مبلغ پرداخت شده طی ۲۴ الی ۴۸ ساعت کاری به حساب مشتری واریز خواهد شد.",
            "کالاهای آرایشی و بهداشتی به دلیل رعایت اصول بهداشتی، تنها در صورت باز نشدن پلمپ و تطابق با شرایط مرجوعی، تا ۷ روز قابل بازگشت هستند.",
        ],
    },
    {
        id: "booking",
        title: "۳. قوانین رزرو نوبت آرایشگاه",
        icon: <CalendarCheck className="w-6 h-6" />,
        content: [
            "رزرو نوبت تنها با پرداخت بیعانه (مبلغ مشخص شده در درگاه) قطعی می‌گردد و پیامک تایید برای شما ارسال خواهد شد.",
            "در صورت لغو نوبت تا ۲۴ ساعت پیش از زمان مقرر، کل مبلغ بیعانه به کیف پول کاربری یا حساب بانکی شما عودت داده می‌شود.",
            "لغو نوبت در کمتر از ۲۴ ساعت مانده به زمان رزرو، مشمول کسر هزینه لغو (برابر با مبلغ بیعانه) خواهد شد.",
            "لطفاً ۱۵ دقیقه پیش از زمان تعیین شده در آرایشگاه حضور داشته باشید. تأخیر بیش از ۲۰ دقیقه ممکن است منجر به لغو نوبت شما توسط سالن گردد.",
        ],
    },
    {
        id: "privacy",
        title: "۴. حریم خصوصی و امنیت داده‌ها",
        icon: <ShieldAlert className="w-6 h-6" />,
        content: [
            "سالونا به اطلاعات خصوصی اشخاصی که از خدمات سایت استفاده می‌کنند، احترام گذاشته و از آن محافظت می‌کند.",
            "ما متعهد می‌شویم در حد توان از حریم شخصی شما دفاع کنیم و در این راستا، تکنولوژی مورد نیاز برای هرچه مطمئن‌تر و امن‌تر شدن استفاده شما از سایت را توسعه دهیم.",
            "حفظ و نگهداری رمز عبور و نام کاربری بر عهده کاربران است و لذا برای جلوگیری از هرگونه سوء استفاده احتمالی، کاربران نباید آن اطلاعات را برای شخص دیگری فاش کنند.",
        ],
    },
];

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-gray-50/50 font-vazir pb-24" dir="rtl">
            {/* هدر صفحه */}
            <div className="bg-white border-b border-gray-100 py-16 mb-12">
                <div className="container flex flex-col items-center text-center">
                    <div className="p-4 bg-salona-50 text-salona-500 rounded-2xl mb-6 animate-fade-in">
                        <Scale className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 font-iransans mb-4">
                        قوانین و مقررات <span className="text-salona-500">سالونا</span>
                    </h1>
                    <p className="text-gray-500 text-lg mb-4">
                        لطفاً پیش از استفاده از خدمات سایت، موارد زیر را به دقت مطالعه فرمایید.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-gray-50 text-gray-500 px-4 py-2 rounded-full text-sm">
                        <CalendarCheck className="w-4 h-4" />
                        <span>آخرین به‌روزرسانی: ۲۶ اسفند ۱۴۰۴</span>
                    </div>
                </div>
            </div>

            <div className="container max-w-4xl">
                {/* محتوای قوانین */}
                <div className="space-y-10 animate-fade-in">
                    {TERMS_SECTIONS.map((section) => (
                        <div
                            key={section.id}
                            className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100"
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
                        </div>
                    ))}
                </div>

                {/* پیام پایانی */}
                <div className="mt-12 text-center bg-salona-50/50 rounded-2xl p-6 border border-salona-100">
                    <p className="text-gray-600 leading-relaxed">
                        عضویت در سایت سالونا و استفاده از خدمات آن به منزله مطالعه دقیق و پذیرش تمامی قوانین فوق
                        می‌باشد. در صورت داشتن هرگونه ابهام، با{" "}
                        <a href="tel:08691009185" className="text-salona-500 font-bold hover:underline">
                            پشتیبانی سالونا
                        </a>{" "}
                        تماس بگیرید.
                    </p>
                </div>
            </div>
        </main>
    );
}
