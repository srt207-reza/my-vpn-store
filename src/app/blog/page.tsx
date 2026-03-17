"use client";

import Link from "next/link";
import { BookOpen, Clock, Calendar, ChevronLeft, Search, Sparkles } from "lucide-react";
import { useState } from "react";

// داده‌های فرضی برای نمایش در بلاگ (شما می‌توانید این بخش را با API جایگزین کنید)
const MOCK_POSTS = [
    {
        id: 1,
        title: "۱۰ راز طلایی برای داشتن پوستی شاداب در فصل پاییز",
        excerpt: "با تغییر فصل، نیازهای پوست شما نیز تغییر می‌کند. در این مقاله به بررسی روتین‌های مراقبتی ضروری برای جلوگیری از خشکی پوست می‌پردازیم...",
        category: "مراقبت از پوست",
        date: "۲۴ مهر ۱۴۰۴",
        readTime: "۵ دقیقه مطالعه",
        imageUrl: "https://placehold.co/600x400/fdf2f8/ec4899?text=Skin+Care",
        isFeatured: true,
    },
    {
        id: 2,
        title: "ترندهای آرایشی سال جدید: بازگشت به زیبایی طبیعی",
        excerpt: "امسال تمرکز دنیای میکاپ بر روی درخشش طبیعی پوست و استفاده از رنگ‌های نود و ملایم است.",
        category: "میکاپ",
        date: "۱۲ آبان ۱۴۰۴",
        readTime: "۳ دقیقه مطالعه",
        imageUrl: "https://placehold.co/600x400/fdf2f8/ec4899?text=Makeup+Trends",
        isFeatured: false,
    },
    {
        id: 3,
        title: "چگونه بهترین رنگ مو را بر اساس تناژ پوستمان انتخاب کنیم؟",
        excerpt: "انتخاب رنگ موی مناسب می‌تواند چهره شما را دگرگون کند. راهنمای جامع شناخت تناژ پوست و رنگ‌های سازگار با آن.",
        category: "مراقبت از مو",
        date: "۵ آذر ۱۴۰۴",
        readTime: "۷ دقیقه مطالعه",
        imageUrl: "https://placehold.co/600x400/fdf2f8/ec4899?text=Hair+Color",
        isFeatured: false,
    },
    {
        id: 4,
        title: "معرفی ۵ سرم آبرسان برتر سالونا برای انواع پوست",
        excerpt: "بررسی تخصصی و مقایسه پرفروش‌ترین سرم‌های آبرسان موجود در فروشگاه سالونا همراه با نظرات مشتریان.",
        category: "معرفی محصول",
        date: "۱ دی ۱۴۰۴",
        readTime: "۴ دقیقه مطالعه",
        imageUrl: "https://placehold.co/600x400/fdf2f8/ec4899?text=Top+Serums",
        isFeatured: false,
    }
];

const CATEGORIES = ["همه", "مراقبت از پوست", "مراقبت از مو", "میکاپ", "معرفی محصول"];

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState("همه");

    // فیلتر کردن مقالات بر اساس دسته‌بندی
    const filteredPosts = activeCategory === "همه" 
        ? MOCK_POSTS 
        : MOCK_POSTS.filter(post => post.category === activeCategory);

    const featuredPost = MOCK_POSTS.find(post => post.isFeatured);
    const regularPosts = filteredPosts.filter(post => !post.isFeatured || activeCategory !== "همه");

    return (
        <main className="min-h-screen bg-gray-50/50 font-vazir pb-20" dir="rtl">
            {/* هدر مجله */}
            <div className="bg-white border-b border-gray-100 py-12 mb-10">
                <div className="container flex flex-col items-center text-center">
                    <div className="p-4 bg-salona-50 text-salona-500 rounded-full mb-4 animate-fade-in">
                        <BookOpen className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-iransans mb-4">
                        مجله زیبایی <span className="text-salona-500">سالونا</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl">
                        جدیدترین مقالات آموزشی، ترفندهای زیبایی، و راهنمای جامع استفاده از محصولات آرایشی و بهداشتی را در اینجا بخوانید.
                    </p>
                    
                    {/* نوار جستجو */}
                    <div className="relative w-full max-w-md mt-8">
                        <input 
                            type="text" 
                            placeholder="جستجو در مقالات..." 
                            className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pr-12 pl-4 text-gray-700 focus:outline-none focus:border-salona-400 focus:ring-2 focus:ring-salona-100 transition-all"
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="container">
                {/* نوار فیلتر دسته‌بندی‌ها */}
                <div className="flex gap-3 overflow-x-auto pb-4 mb-10 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex-shrink-0 cursor-pointer px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                                activeCategory === cat 
                                    ? "bg-salona-500 text-white shadow-md shadow-salona-200" 
                                    : "bg-white text-gray-600 border border-gray-200 hover:border-salona-300 hover:text-salona-500"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* مقاله ویژه (Featured) - فقط در صورت انتخاب تب "همه" نمایش داده می‌شود */}
                {activeCategory === "همه" && featuredPost && (
                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 mb-12 flex flex-col md:flex-row animate-fade-in">
                        <div className="md:w-1/2">
                            {/* جایگزین با تگ Image در نکست‌جی‌اس برای بهینه‌سازی */}
                            <img 
                                src={featuredPost.imageUrl} 
                                alt={featuredPost.title}
                                className="w-full h-full object-cover min-h-[300px]"
                            />
                        </div>
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-salona-500" />
                                <span className="text-sm font-bold text-salona-500 tracking-wider">مقاله ویژه</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-iransans mb-4 leading-relaxed">
                                {featuredPost.title}
                            </h2>
                            <p className="text-gray-600 mb-6 leading-loose">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{featuredPost.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{featuredPost.readTime}</span>
                                </div>
                            </div>
                            <Link 
                                href={`/blog/${featuredPost.id}`}
                                className="inline-flex items-center justify-center gap-2 bg-salona-50 text-salona-600 px-6 py-3 rounded-xl font-medium hover:bg-salona-500 hover:text-white transition-colors w-max"
                            >
                                مطالعه کامل مقاله
                                <ChevronLeft className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* گرید سایر مقالات */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.id}`} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col animate-fade-in">
                            <div className="relative overflow-hidden aspect-video">
                                <img 
                                    src={post.imageUrl} 
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-salona-600 px-3 py-1 rounded-full text-xs font-bold">
                                    {post.category}
                                </div>
                            </div>
                            
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 font-iransans mb-3 group-hover:text-salona-500 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                                    {post.excerpt}
                                </p>
                                
                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* حالت خالی (وقتی دسته‌بندی مقاله‌ای ندارد) */}
                {regularPosts.length === 0 && (!featuredPost || activeCategory !== "همه") && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">مقاله‌ای یافت نشد</h3>
                        <p className="text-gray-500">در حال حاضر در این دسته‌بندی مقاله‌ای منتشر نشده است.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
