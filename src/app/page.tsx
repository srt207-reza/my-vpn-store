"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, TrendingUp } from "lucide-react";
import { useCategories } from "@/services/useCategories";
import { useProducts } from "@/services/useProducts";
import { useFavorites } from "@/services/useFavorites"; // اضافه شدن هوک علاقه‌مندی‌ها
import { ProductCard } from "@/components/shared/ProductsCard";
import { Category, Product } from "@/types/api";

export default function HomePage() {
    const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories();
    
    const { data: latestProductsData, isLoading: isProductsLoading } = useProducts({
        per_page: 8,
    });

    const user = JSON.parse(localStorage.getItem('user'))

    // دریافت لیست علاقه‌مندی‌ها برای تطبیق با محصولات صفحه اصلی
    const { data: favoritesData } = useFavorites(!!user);

    return (
        <div className="space-y-16 pb-16">
            {/* 1. Hero Section */}
            <section className="container mt-6">
                <div className="bg-salona-100 rounded-3xl overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-100 relative">
                    <div className="p-8 md:p-16 flex-1 z-10">
                        <span className="inline-block py-1 px-3 rounded-full bg-salona-100 text-salona-600 text-sm font-bold mb-4 animate-fade-in">
                            جشنواره بهاره سالونا
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                            زیبایی خود را <br />
                            <span className="text-salona-500">کشف کنید</span>
                        </h1>
                        <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
                            جدیدترین کالکشن محصولات آرایشی و مراقبت از پوست با ضمانت اصالت کالا و ارسال فوری به سراسر
                            کشور.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 bg-salona-500 hover:bg-salona-600 text-white font-medium py-3 px-8 rounded-full transition-all hover:shadow-lg hover:shadow-salona-500/30"
                        >
                            مشاهده محصولات
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* bg-linear-to-tr from-salona-200 to-salona-100 */}
                    <div className="flex-1 w-full h-full min-h-75 relative">
                        <div className="absolute inset-0 flex items-center justify-center text-salona-500/20">
                            <Sparkles className="w-32 h-32" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. بخش دسته‌بندی‌ها */}
            <section className="container">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-salona-500" />
                        دسته‌بندی‌های محبوب
                    </h2>
                </div>

                {isCategoriesLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-2xl h-32 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {categoriesData?.categories?.slice(0, 6).map((category: Category) => (
                            <Link
                                key={category.id}
                                href={`/categories/${category.id}`}
                                className="group flex flex-col items-center justify-center gap-3 p-6 bg-white border border-gray-100 rounded-2xl hover:border-salona-200 hover:shadow-lg hover:shadow-salona-50/50 transition-all cursor-pointer"
                            >
                                <div className="relative w-16 h-16 rounded-full bg-salona-50 group-hover:bg-salona-100 flex items-center justify-center transition-colors overflow-hidden">
                                    {/* استفاده از کامپوننت Image Next.js */}
                                    <Image
                                        src={category.image_url || "/cat-placeholder.png"}
                                        alt={category.name}
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-salona-600 text-center">
                                    {category.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* 3. بخش جدیدترین محصولات */}
            <section className="container">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-salona-500" />
                        جدیدترین‌های سالونا
                    </h2>
                    <Link
                        href="/products?sort=newest"
                        className="text-sm font-medium text-salona-500 hover:text-salona-600 flex items-center gap-1"
                    >
                        مشاهده همه
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </div>

                {isProductsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl border border-gray-100 h-80 animate-pulse flex flex-col p-4"
                            >
                                <div className="bg-gray-100 w-full h-48 rounded-xl mb-4"></div>
                                <div className="bg-gray-100 h-4 w-3/4 rounded mb-2"></div>
                                <div className="bg-gray-100 h-4 w-1/2 rounded mt-auto"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {latestProductsData?.products?.map((product: Product) => {
                            // بررسی اینکه آیا این محصول در لیست علاقه‌مندی‌ها وجود دارد یا خیر
                            // فرض بر این است که API علاقه‌مندی‌ها دارای فیلد product_id است
                            const favoriteRecord = favoritesData?.favorites?.find(
                                (fav) => fav.product_id === product.id
                            );

                            return (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    isFavorited={!!favoriteRecord}
                                    favoriteId={favoriteRecord?.id}
                                />
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
