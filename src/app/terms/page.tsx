"use client";

import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Shield, CreditCard, PlayCircle, Clock, Users, FileText } from "lucide-react";

export default function TermsPage() {
    const terms = [
        {
            id: 1,
            icon: <MapPin className="w-6 h-6 text-rose-400" />,
            title: "محدودیت‌های آدرس اینترنتی (IP Address)",
            desc: "طبق قوانین و شرایط استفاده (Terms of Use) اسپاتیفای، موقعیت مکانی ثبت‌شده در حساب کاربری باید با موقعیت مکانی اتصال اینترنتی (IP Address) دستگاه کاربر یکسان باشد. بنابراین، استفاده از سرویس تغییر IP متناسب با کشور ثبت‌شده در حساب کاربری هنگام استفاده از اسپاتیفای الزامی است.",
            warning:
                "⚠️ در صورت عدم رعایت این قانون، اسپاتیفای می‌تواند بدون اطلاع قبلی اشتراک را لغو کند و امکان جبران خسارت یا بازگشت وجه وجود ندارد. مسئولیت رعایت این شرط بر عهده کاربر است.",
        },
        {
            id: 2,
            icon: <Clock className="w-6 h-6 text-amber-400" />,
            title: "زمان فعال‌سازی اشتراک",
            desc: "اشتراک پرمیوم ظرف کمتر از ۲۴ ساعت پس از پرداخت و ارسال اطلاعات حساب کاربری به‌صورت خودکار فعال خواهد شد. پس از فعال‌سازی، پیام تأیید از طریق ایمیل یا تلگرام ارسال می‌گردد.",
        },
        {
            id: 3,
            icon: <Shield className="w-6 h-6 text-spotify-light" />,
            title: "حفظ اطلاعات حساب کاربری",
            desc: "در فعال‌سازی طرح‌های شخصی (Individual Plans)، کلیه اطلاعات حساب کاربری از جمله موزیک‌های ذخیره‌شده، پلی‌لیست‌ها، پادکست‌ها و تنظیمات شخصی بدون هیچ تغییری حفظ می‌گردد. اشتراک مستقیماً روی همان حساب فعلی شما فعال می‌شود و نیازی به ایجاد حساب جدید نیست.",
        },
        {
            id: 4,
            icon: <Users className="w-6 h-6 text-spotify-light" />,
            title: "طرح‌های خانوادگی (Family Plans)",
            desc: "در طرح‌های خانوادگی، تا ۶ نفر می‌توانند از اشتراک پرمیوم استفاده کنند. تمامی اعضا باید در یک آدرس مشترک ساکن باشند و موقعیت مکانی یکسانی داشته باشند. هر عضو حساب کاربری مستقل و پلی‌لیست‌های جداگانه خواهد داشت.",
        },
        {
            id: 5,
            icon: <PlayCircle className="w-6 h-6 text-spotify-light" />,
            title: "قوانین حق پخش و محدودیت‌های محتوا",
            desc: "در دسترس نبودن یا غیرفعال شدن موقت برخی قابلیت‌ها، آهنگ‌ها یا محتواها امری طبیعی بوده و طبق سیاست‌های داخلی اسپاتیفای، قوانین کپی‌رایت و تصمیم ناشران و هنرمندان صورت می‌گیرد. این موارد خارج از کنترل ما بوده و دلیل بازپس‌گیری وجه نمی‌باشد.",
        },
        {
            id: 6,
            icon: <CreditCard className="w-6 h-6 text-spotify-light" />,
            title: "پرداخت قانونی و امن",
            desc: "پرداخت‌های مربوط به فعال‌سازی اشتراک، به‌صورت کاملاً قانونی و با استفاده از کارت‌های بانکی ارزی معتبر در کشورهایی نظیر هند، ترکیه، نیجریه، فیلیپین و سایر کشورهای مجاز انجام می‌گردد. تمامی تراکنش‌ها از طریق درگاه‌های پرداخت رسمی اسپاتیفای صورت می‌پذیرد.",
        },
        {
            id: 7,
            icon: <FileText className="w-6 h-6 text-spotify-light" />,
            title: "عدم امکان استرداد وجه",
            desc: "با توجه به ماهیت دیجیتالی خدمات و فعال‌سازی فوری اشتراک، امکان استرداد وجه پس از فعال‌سازی وجود ندارد. لطفاً پیش از خرید، از صحت اطلاعات حساب کاربری و انتخاب طرح مناسب اطمینان حاصل فرمایید.",
        },
    ];

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-store-base text-white" dir="rtl">
            <div className="max-w-5xl mx-auto">
                {/* هدر صفحه */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-full px-4 py-2 mb-6">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span className="text-rose-300 text-sm font-medium">مطالعه الزامی</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        قوانین و مقررات استفاده
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
                        لطفاً پیش از خرید یا فعال‌سازی اشتراک، قوانین زیر را با دقت مطالعه نمایید. استفاده از خدمات
                        اسپاتیفای ما به منزله پذیرش کامل این شرایط و مقررات می‌باشد.
                    </p>
                </motion.div>

                {/* لیست قوانین */}
                <div className="space-y-6">
                    {terms.map((term, index) => (
                        <motion.div
                            key={term.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-store-panel border border-store-border rounded-2xl p-6 md:p-8 hover:bg-store-hover transition-colors group"
                        >
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="bg-store-card p-4 rounded-2xl shrink-0 group-hover:scale-110 transition-transform border border-store-border/50">
                                    {term.icon}
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {term.title}
                                    </h3>

                                    <p className="text-slate-400 leading-relaxed text-justify">
                                        {term.desc}
                                    </p>

                                    {term.warning && (
                                        <div className="mt-5 flex gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
                                            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                                            <p className="text-sm leading-relaxed">
                                                {term.warning}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* فوتر توضیحات */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 text-center border-t border-store-border pt-10"
                >
                    <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto">
                        در صورت وجود هرگونه سوال درباره قوانین، فعال‌سازی اشتراک یا مشکلات حساب کاربری،
                        می‌توانید با پشتیبانی ما در تلگرام در ارتباط باشید.
                    </p>

                    <a
                        href="https://t.me/getSpotify_Support"
                        target="_blank"
                        className="inline-block mt-4 text-spotify hover:text-spotify-light transition font-medium"
                    >
                        ارتباط با پشتیبانی
                    </a>
                </motion.div>
            </div>
        </main>
    );
}
