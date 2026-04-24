import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css"; // مسیر globals.css خود را در صورت نیاز اصلاح کنید
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "GetPremium | خرید اشتراک VPN ایمن و پرسرعت",
    description: "خرید اشتراک VPN و فیلترشکن با بهترین قیمت، امنیت بالا، تحویل آنی و پشتیبانی تلگرامی GetPremium.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fa" dir="rtl" className="scroll-smooth">
            {/* تغییر سلکشن از spotify به primary */}
            <body
                cz-shortcut-listen="true"
                className="flex flex-col min-h-screen bg-store-base text-store-text antialiased selection:bg-primary/30 selection:text-primary-light"
            >
                {/* هدر سایت */}
                <Header />

                {/* محتوای اصلی صفحات (پایین‌تر از هدر فیکس شده قرار می‌گیرد) */}
                <main className="grow pt-24 pb-10 px-4 sm:px-6 lg:px-8 container mx-auto max-w-7xl">{children}</main>

                {/* فوتر سایت */}
                <Footer />

                {/* سیستم نمایش نوتیفیکیشن‌ها - رنگ‌ها با پالت Dark Cyber آپدیت شدند */}
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: "#1E293B", // رنگ پس‌زمینه کارت‌های GetPremium
                            color: "#F8FAFC", // رنگ متن اصلی
                            border: "1px solid #334155", // رنگ بوردرها
                            fontFamily: "inherit",
                        },
                    }}
                />
            </body>
        </html>
    );
}
