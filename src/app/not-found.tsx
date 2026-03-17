import Link from "next/link";
import { FileSearch2, Home, ShoppingBag, BookOpen } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center font-vazir" dir="rtl">
            <div className="container text-center px-4">
                <div className="inline-block p-6 bg-salona-100 text-salona-500 rounded-3xl mb-8 animate-bounce">
                    <FileSearch2 className="w-16 h-16" strokeWidth={1.5} />
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-gray-800 font-iransans mb-4">۴۰۴</h1>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
                    صفحه‌ای که به دنبال آن بودید، پیدا نشد!
                </h2>
                <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">
                    ممکن است آدرس را اشتباه وارد کرده باشید یا این صفحه برای همیشه حذف شده باشد. پیشنهاد می‌کنیم به یکی
                    از بخش‌های اصلی سایت بروید.
                </p>

                <div className="flex flex-wrap justify-center items-center gap-4">
                    <Link href="/" passHref>
                        <button className="flex cursor-pointer items-center gap-2 bg-salona-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-salona-600 transition-all shadow-lg shadow-salona-200 hover:-translate-y-1">
                            <Home className="w-5 h-5" />
                            <span>بازگشت به صفحه اصلی</span>
                        </button>
                    </Link>
                    <Link href="/products" passHref>
                        <button className="flex cursor-pointer items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-100 hover:text-salona-500 transition-all">
                            <ShoppingBag className="w-5 h-5" />
                            <span>مشاهده فروشگاه</span>
                        </button>
                    </Link>
                    <Link href="/blog" passHref>
                        <button className="flex cursor-pointer items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-100 hover:text-salona-500 transition-all">
                            <BookOpen className="w-5 h-5" />
                            <span>مجله زیبایی</span>
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
