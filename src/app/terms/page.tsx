"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Shield, CreditCard, Clock, Users, FileText, Globe, CheckCircle } from "lucide-react";

export default function TermsPage() {
    const terms = [
        {
            id: 1,
            icon: <Globe className="w-6 h-6 text-rose-400" />,
            title: "استفاده صحیح و قانونی از سرویس",
            desc: "کاربران موظف به استفاده صحیح از سرویس‌های ارائه‌شده می‌باشند. استفاده از سرویس جهت مقاصد غیرقانونی، نقض قوانین سایبری و ایجاد اختلال در شبکه‌ها ممنوع بوده و مسئولیت آن کاملاً بر عهده کاربر است.",
        },
        {
            id: 2,
            icon: <Clock className="w-6 h-6 text-amber-400" />,
            title: "زمان تحویل و فعال‌سازی اشتراک",
            desc: "پس از تکمیل فرایند پرداخت و تأییدیه بخش فروش، اطلاعات اشتراک و لینک اتصال، در کوتاه ترین زمان ممکن در اختیار شما قرار می‌گیرد. پیام تأیید از طریق تلگرام ارسال می‌گردد.",
        },
        {
            id: 3,
            icon: <Shield className="w-6 h-6 text-primary-light" />,
            title: "حفظ حریم خصوصی و امنیت اطلاعات",
            desc: "ما به حفظ حریم خصوصی شما متعهد هستیم. هیچ‌گونه اطلاعاتی از ترافیک مصرفی یا وب‌سایت‌های بازدیدشده توسط شما ذخیره نمی‌گردد و اطلاعات حساب کاربری شما نزد ما کاملاً محفوظ خواهد بود.",
        },
        {
            id: 4,
            icon: <Users className="w-6 h-6 text-primary-light" />,
            title: "استفاده همزمان و محدودیت دستگاه‌ها",
            desc: "کلیه طرح های اشتراک راهکار اتصال، بدون محدودیت کاربر ارائه می‌گردد و در استفاده هم‌زمان و تعداد دستگاه های متصل به یک لینک اتصال، هیج محدودیتی وجود ندارد.",
        },
        {
            id: 5,
            icon: <CheckCircle className="w-6 h-6 text-primary-light" />,
            title: "کیفیت و پایداری سرویس",
            desc: "ما همواره در تلاشیم تا بالاترین کیفیت و پایداری را ارائه دهیم. با این حال، بروز اختلالات مقطعی ناشی از زیرساخت‌های اینترنتی یا محدودیت‌های شبکه کشور امری طبیعی بوده و در اسرع وقت توسط تیم فنی برطرف می‌گردد.",
        },
        {
            id: 6,
            icon: <CreditCard className="w-6 h-6 text-primary-light" />,
            title: "پرداخت امن",
            desc: "تمامی تراکنش‌های مالی از طریق درگاه‌های پرداخت امن و معتبر انجام می‌پذیرد. اطلاعات بانکی شما مستقیماً در درگاه بانک وارد شده و در سیستم‌های ما ذخیره نخواهد شد.",
        },
        {
            id: 7,
            icon: <FileText className="w-6 h-6 text-primary-light" />,
            title: "شرایط استرداد وجه",
            desc: "با توجه به ماهیت دیجیتالی خدمات، امکان استرداد وجه پس از تحویل سرویس وجود ندارد. لطفاً پیش از خرید، از انتخاب طرح مناسب با نیاز خود اطمینان حاصل فرمایید. در صورت بروز مشکل فنی از سمت سرورهای ما، پشتیبانی راهنمایی‌های لازم را ارائه خواهد داد.",
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
                    {/* <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-full px-4 py-2 mb-6">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span className="text-rose-300 text-sm font-medium">مطالعه الزامی</span>
                    </div> */}
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">قوانین و مقررات استفاده</h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
                        لطفاً پیش از خرید یا فعال‌سازی اشتراک، قوانین زیر را با دقت مطالعه نمایید. استفاده از خدمات Get
                        Premium به منزله پذیرش کامل این شرایط و مقررات می‌باشد.
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
                                    <h3 className="text-xl font-bold text-white mb-3">{term.title}</h3>

                                    <p className="text-slate-400 leading-relaxed text-justify">{term.desc}</p>

                                    {/* {term.warning && (
                                        <div className="mt-5 flex gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200">
                                            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                                            <p className="text-sm leading-relaxed">
                                                {term.warning}
                                            </p>
                                        </div>
                                    )} */}
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
                        در صورت وجود هرگونه سوال درباره قوانین، فعال‌سازی اشتراک یا مشکلات فنی، می‌توانید با پشتیبانی ما
                        در تلگرام در ارتباط باشید.
                    </p>

                    <a
                        href="https://t.me/GetPremium_support"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 text-primary hover:text-primary-light transition font-medium"
                    >
                        ارتباط با پشتیبانی
                    </a>
                </motion.div>
            </div>
        </main>
    );
}
