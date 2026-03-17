"use client";

import {
    Truck,
    Bike,
    Package,
    ShoppingCart,
    Archive,
    Ticket,
    Home,
    MapPin,
    Clock,
    DollarSign,
    Gift,
} from "lucide-react";

const SHIPPING_METHODS = [
    {
        title: "پست پیشتاز سراسری",
        icon: <Package className="w-8 h-8 text-blue-500" />,
        description:
            "استانداردترین و فراگیرترین روش ارسال برای تمام شهرها و روستاهای ایران. بسته‌ها از طریق شرکت ملی پست جمهوری اسلامی ایران ارسال می‌شوند.",
        features: [
            { icon: <MapPin className="w-4 h-4 text-gray-500" />, text: "محدوده: تمام نقاط ایران" },
            { icon: <Clock className="w-4 h-4 text-gray-500" />, text: "زمان تحویل: ۲ تا ۵ روز کاری" },
            { icon: <DollarSign className="w-4 h-4 text-gray-500" />, text: "هزینه: بر اساس وزن طبق تعرفه پست" },
        ],
    },
    {
        title: "ارسال با پیک موتوری (ویژه تهران)",
        icon: <Bike className="w-8 h-8 text-green-500" />,
        description:
            "سریع‌ترین روش برای دریافت سفارشات در شهر تهران. سفارش شما در همان روز یا نهایتاً روز کاری بعد به دستتان خواهد رسید.",
        features: [
            { icon: <MapPin className="w-4 h-4 text-gray-500" />, text: "محدوده: مناطق ۲۲ گانه شهر تهران" },
            { icon: <Clock className="w-4 h-4 text-gray-500" />, text: "زمان تحویل: ۱ تا ۴ ساعت (پس از پردازش)" },
            { icon: <DollarSign className="w-4 h-4 text-gray-500" />, text: "هزینه: ثابت بر اساس تعرفه پیک" },
        ],
    },
];

const PROCESS_STEPS = [
    {
        icon: <ShoppingCart className="w-6 h-6 text-white" />,
        title: "ثبت سفارش",
        description: "شما سفارش خود را نهایی و پرداخت می‌کنید.",
    },
    {
        icon: <Archive className="w-6 h-6 text-white" />,
        title: "پردازش و بسته‌بندی",
        description: "سفارش شما در انبار سالونا با دقت بسته‌بندی می‌شود.",
    },
    {
        icon: <Truck className="w-6 h-6 text-white" />,
        title: "تحویل به واحد ارسال",
        description: "بسته شما به پست یا واحد پیک تحویل داده می‌شود.",
    },
    {
        icon: <Ticket className="w-6 h-6 text-white" />,
        title: "ارسال کد رهگیری",
        description: "کد پیگیری از طریق پیامک برای شما ارسال می‌گردد.",
    },
    {
        icon: <Home className="w-6 h-6 text-white" />,
        title: "تحویل به مشتری",
        description: "بسته توسط مامور پست/پیک به شما تحویل داده می‌شود.",
    },
];

export default function ShippingPage() {
    return (
        <main className="min-h-screen bg-gray-50/50 font-vazir pb-24" dir="rtl">
            {/* هدر صفحه */}
            <div className="bg-white border-b border-gray-100 py-16 mb-12">
                <div className="container flex flex-col items-center text-center">
                    <div className="p-4 bg-salona-50 text-salona-500 rounded-2xl mb-6 animate-fade-in">
                        <Truck className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 font-iransans mb-4">
                        روش‌های ارسال و پیگیری سفارشات
                    </h1>
                    <p className="text-gray-500 text-lg mb-6 max-w-2xl mx-auto">
                        سفارش شما در سریع‌ترین و امن‌ترین حالت ممکن به دستتان می‌رسد. با روش‌های ارسال سالونا آشنا شوید.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium">
                        <Gift className="w-4 h-4" />
                        <span>ارسال رایگان برای خریدهای بالای ۱ میلیون تومان</span>
                    </div>
                </div>
            </div>

            <div className="container max-w-6xl">
                {/* بخش روش های ارسال */}
                <div className="mb-16 animate-fade-in">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-8 font-iransans">
                        انتخاب روش ارسال مناسب شما
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {SHIPPING_METHODS.map((method, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all hover:shadow-lg hover:border-salona-200 hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-gray-100 rounded-xl">{method.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-800">{method.title}</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-6">{method.description}</p>
                                <div className="space-y-3 pt-6 border-t border-gray-100">
                                    {method.features.map((feature, fIndex) => (
                                        <div key={fIndex} className="flex items-center gap-3 text-sm">
                                            {feature.icon}
                                            <span className="text-gray-700 font-medium">{feature.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* بخش مراحل پردازش سفارش */}
                <div className="mb-12 animate-fade-in">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-10 font-iransans">
                        مراحل پردازش تا تحویل سفارش
                    </h2>
                    <div className="relative">
                        {/* خط عمودی */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-salona-200 hidden md:block" />

                        <div className="space-y-12 md:space-y-6">
                            {PROCESS_STEPS.map((step, index) => (
                                <div key={index} className="flex flex-col md:flex-row items-center gap-4 md:gap-0">
                                    {/* سمت راست در دسکتاپ */}
                                    <div className="md:w-1/2 md:pr-10 text-center md:text-right">
                                        {index % 2 === 0 && (
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
                                                <p className="text-gray-500">{step.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* آیکون وسط */}
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-salona-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                            {step.icon}
                                        </div>
                                    </div>

                                    {/* سمت چپ در دسکتاپ */}
                                    <div className="md:w-1/2 md:pl-10 text-center md:text-left">
                                        {index % 2 !== 0 && (
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
                                                <p className="text-gray-500">{step.description}</p>
                                            </div>
                                        )}
                                        {/* نمایش محتوا در زیر آیکون برای حالت موبایل */}
                                        <div className="md:hidden mt-2">
                                            <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
                                            <p className="text-gray-500">{step.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* بخش CTA */}
                <div className="mt-16 bg-gradient-to-r from-salona-500 to-pink-500 rounded-3xl p-10 text-center text-white shadow-xl shadow-salona-200">
                    <h3 className="text-2xl font-bold font-iransans mb-3">آماده شروع خرید هستید؟</h3>
                    <p className="text-salona-100 mb-8 max-w-lg mx-auto">
                        از میان هزاران محصول آرایشی و بهداشتی، کالای مورد نظر خود را انتخاب کرده و ما آن را به سرعت برای
                        شما ارسال خواهیم کرد.
                    </p>
                    <a
                        href="/products"
                        className="inline-flex items-center gap-2 bg-white text-salona-500 px-8 py-3 rounded-xl font-bold hover:bg-salona-50 transition-colors"
                    >
                        مشاهده همه محصولات
                    </a>
                </div>
            </div>
        </main>
    );
}
