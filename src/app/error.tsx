"use client";

import { useEffect } from "react";
import { ServerCrash, RefreshCw, Home } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center font-vazir" dir="rtl">
            <div className="container text-center px-4 max-w-xl mx-auto">
                <div className="inline-block p-6 bg-red-100 text-red-500 rounded-3xl mb-8">
                    <ServerCrash className="w-16 h-16" strokeWidth={1.5} />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-iransans mb-4">
                    یک خطای غیرمنتظره رخ داد!
                </h1>
                <p className="text-gray-500 text-lg mb-10">
                    تیم فنی ما از این مشکل مطلع شده است. لطفاً کمی صبر کرده و دوباره تلاش کنید یا به صفحه اصلی بازگردید.
                </p>

                <div className="flex flex-wrap justify-center items-center gap-4">
                    <button
                        onClick={() => reset()}
                        className="flex items-center gap-2 bg-salona-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-salona-600 transition-all shadow-lg shadow-salona-200 hover:-translate-y-1"
                    >
                        <RefreshCw className="w-5 h-5" />
                        <span>تلاش مجدد</span>
                    </button>
                    <a
                        href="/"
                        className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-100 hover:text-salona-500 transition-all"
                    >
                        <Home className="w-5 h-5" />
                        <span>بازگشت به صفحه اصلی</span>
                    </a>
                </div>
            </div>
        </main>
    );
}
