"use client";

import Link from "next/link";
import { Heart, Star, AlertCircle, Loader2 } from "lucide-react";
import type { Product } from "@/types/api";
import { useAddFavorite, useDeleteFavorite } from "@/services/useFavorites";

interface ProductCardProps {
    product: Product;
    isFavorited?: boolean;
    favoriteId?: number;
}

export const ProductCard = ({ product, isFavorited = false, favoriteId }: ProductCardProps) => {
    const { mutate: addFavorite, isPending: isAdding } = useAddFavorite();
    const { mutate: removeFavorite, isPending: isRemoving } = useDeleteFavorite();

    const isFavoriteLoading = isAdding || isRemoving;
    const brandName = product.attributes?.["برند"];
    const mainImage = product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png";
    const isOutOfStock = product.stock === 0;

    // محاسبه وضعیت تخفیف
    // فرض بر این است که قیمت اصلی در product.price قرار دارد.
    // در صورت تفاوت نام فیلد در بک‌اند، این قسمت را ویرایش کنید.
    const originalPrice = (product as any).price || product.final_price;
    const hasDiscount = originalPrice && product.final_price ? originalPrice > product.final_price : false;
    const discountPercent = hasDiscount
        ? Math.round(((originalPrice - (product.final_price || 0)) / originalPrice) * 100)
        : 0;

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isFavoriteLoading) return;

        if (isFavorited && favoriteId) {
            removeFavorite(favoriteId);
        } else {
            addFavorite(product.id);
        }
    };

    return (
        <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-salona-100/40 transition-all duration-300 flex flex-col h-full relative">
            <div className="relative aspect-square overflow-hidden bg-gray-50/50 p-6 flex items-center justify-center">
                <Link href={`/products/${product.id}`} className="w-full h-full relative block">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className={`w-full h-full object-contain transition-transform duration-700 ${
                            !isOutOfStock ? "group-hover:scale-110" : "grayscale opacity-70"
                        }`}
                    />
                </Link>

                <button
                    onClick={handleToggleFavorite}
                    disabled={isFavoriteLoading}
                    className={`absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur rounded-full shadow-sm transition-all z-10 
                        ${isFavorited ? "opacity-100 text-red-500" : "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 text-gray-400 hover:text-red-500 hover:bg-white"} 
                        ${isFavoriteLoading ? "cursor-not-allowed opacity-100" : "cursor-pointer"}`}
                    aria-label={isFavorited ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                >
                    {isFavoriteLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    ) : (
                        <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                    )}
                </button>

                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {isOutOfStock ? (
                        <span className="bg-gray-800/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                            ناموجود
                        </span>
                    ) : product.is_low_stock ? (
                        <span className="bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            موجودی محدود
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="p-5 flex flex-col grow justify-between gap-4">
                <div className="space-y-2">
                    {brandName && <span className="text-xs font-medium text-gray-400 block mb-1">{brandName}</span>}

                    <h3 className="text-gray-800 font-semibold text-sm leading-relaxed line-clamp-2 hover:text-salona-500 transition-colors">
                        <Link href={`/products/${product.id}`}>{product.name}</Link>
                    </h3>

                    <div className="flex items-center gap-1.5 pt-1">
                        <Star
                            className={`w-4 h-4 ${
                                product.total_ratings > 0 ? "text-amber-400 fill-current" : "text-gray-300"
                            }`}
                        />
                        <span className="text-xs font-medium mt-0.5 text-gray-600">
                            {product.total_ratings > 0 ? product.average_rating : "بدون امتیاز"}
                        </span>
                        {product.total_ratings > 0 && (
                            <span className="text-xs text-gray-400 mt-0.5">({product.total_ratings})</span>
                        )}
                    </div>
                </div>

                <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-50 h-[60px]">
                    {isOutOfStock ? (
                        <span className="text-gray-400 font-medium text-sm w-full text-center pb-1">
                            در حال حاضر موجود نیست
                        </span>
                    ) : (
                        <>
                            {/* جایگزین سبد خرید: نمایش درصد تخفیف (در صورت وجود) */}
                            <div className="flex items-center justify-start h-full pb-1">
                                {hasDiscount ? (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center justify-center">
                                        {discountPercent}٪
                                    </span>
                                ) : (
                                    <div className="w-8"></div> // فضای خالی برای تراز ماندن المان‌ها
                                )}
                            </div>

                            {/* بخش قیمت اصلی خط‌خورده و قیمت نهایی */}
                            <div className="flex flex-col items-end justify-end">
                                {hasDiscount && (
                                    <span className="text-gray-400 text-xs font-medium line-through mb-0.5">
                                        {originalPrice?.toLocaleString()}
                                    </span>
                                )}
                                <div className="flex items-center gap-1">
                                    <span className="text-salona-600 font-black text-lg tracking-tight">
                                        {product.final_price?.toLocaleString()}
                                    </span>
                                    <span className="text-gray-500 text-xs font-medium mb-1">تومان</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
