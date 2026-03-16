"use client";

import Link from "next/link";
import { HeartCrack, Loader2 } from "lucide-react";
import { useFavorites } from "@/services/useFavorites";
import { ProductCard } from "@/components/shared/ProductsCard";
import { Favorite } from "@/types/api";

export default function FavoritesPage() {
    const { data, isLoading, isError } = useFavorites();

    if (isLoading) {
        return (
            <div className="min-h-100 flex flex-col items-center justify-center w-full">
                <Loader2 className="w-10 h-10 animate-spin text-salona-500 mb-4" />
                <p className="text-gray-500 font-medium">در حال دریافت علاقه‌مندی‌های شما...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-100 flex flex-col items-center justify-center w-full bg-red-50 rounded-2xl p-6">
                <p className="text-red-500 font-semibold mb-2">خطا در برقراری ارتباط با سرور!</p>
                <p className="text-red-400 text-sm">لطفا اتصال اینترنت خود را بررسی کرده و مجدداً تلاش کنید.</p>
            </div>
        );
    }

    const hasFavorites = data?.favorites && data.favorites.length > 0;

    if (!hasFavorites) {
        return (
            <div className="min-h-125 flex flex-col items-center justify-center w-full bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <HeartCrack className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">لیست علاقه‌مندی‌های شما خالی است</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    شما هنوز هیچ محصولی را به لیست علاقه‌مندی‌های خود اضافه نکرده‌اید. با گشت و گذار در فروشگاه، محصولات
                    محبوب خود را ذخیره کنید.
                </p>
                <Link
                    href="/products"
                    className="bg-salona-500 hover:bg-salona-600 text-white font-medium px-8 py-3 rounded-xl transition-colors shadow-lg shadow-salona-500/30"
                >
                    مشاهده محصولات فروشگاه
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">علاقه‌مندی‌های من</h1>
                    <p className="text-gray-500 text-sm">شما {data.count} محصول را در لیست علاقه‌مندی‌های خود دارید.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* حذف any و استفاده از تایپ استاندارد */}
                {data.favorites.map((favorite: Favorite) => {
                    // استخراج اطلاعات محصول با فرض اینکه در آبجکت product قرار دارد
                    //@ts-ignore
                    const productData = favorite.product;

                    // اگر بنا به هر دلیلی دیتای محصول ناقص بود رندر نشود
                    if (!productData) return null;

                    return (
                        <ProductCard
                            key={favorite.id}
                            product={productData}
                            isFavorited={true}
                            favoriteId={favorite.id}
                        />
                    );
                })}
            </div>
        </div>
    );
}
