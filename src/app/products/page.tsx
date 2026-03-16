"use client";

import { useState, useEffect } from "react";
import { 
    Search, 
    Filter, 
    SlidersHorizontal, 
    ChevronRight, 
    ChevronLeft, 
    PackageSearch, 
    X, 
    Check, 
    Banknote 
} from "lucide-react";
import { useCategories } from "@/services/useCategories";
import { useFavorites } from "@/services/useFavorites";
import { ProductCard } from "@/components/shared/ProductsCard";
import { Category, Product } from "@/types/api";
import { useSearchProducts } from "@/services/useProducts";

export default function ProductsPage() {
    // --- States ---
    const [user, setUser] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState("new"); 

    // استیت‌های مربوط به فیلتر قیمت
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [debouncedMinPrice, setDebouncedMinPrice] = useState("");
    const [debouncedMaxPrice, setDebouncedMaxPrice] = useState("");

    // مدیریت دریافت اطلاعات کاربر در کلاینت‌ساید
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    // دی‌باونس برای جستجو و قیمت‌ها
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            // حذف کاماها قبل از ارسال به API
            setDebouncedMinPrice(minPrice.replace(/,/g, ""));
            setDebouncedMaxPrice(maxPrice.replace(/,/g, ""));
            setPage(1); 
        }, 600);
        return () => clearTimeout(timer);
    }, [searchQuery, minPrice, maxPrice]);

    // --- Queries ---
    const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories();

    // پارامترهای ارسالی به API
    const { data: searchData, isLoading: isSearchLoading } = useSearchProducts({
        page,
        page_per: 12,
        q: debouncedSearch,
        category_id: selectedCategory || undefined,
        sort_by: sortBy as any,
        min_price: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
        max_price: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
    });

    const { data: favoritesData } = useFavorites(!!user);

    // --- Handlers ---
    const handleCategoryChange = (categoryId: number | null) => {
        setSelectedCategory(categoryId);
        setPage(1);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
        setPage(1);
    };

    // تابع فرمت‌دهی اعداد با کاما برای نمایش زیباتر
    const handlePriceChange = (value: string, setter: (val: string) => void) => {
        // حذف تمام کاراکترهای غیر عددی
        const numericValue = value.replace(/\D/g, "");
        if (!numericValue) {
            setter("");
            return;
        }
        // اضافه کردن کاما به عنوان جداکننده هزارگان
        const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setter(formattedValue);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setDebouncedSearch("");
        setSelectedCategory(null);
        setSortBy("new");
        setMinPrice("");
        setMaxPrice("");
        setDebouncedMinPrice("");
        setDebouncedMaxPrice("");
        setPage(1);
    };

    // بررسی اینکه آیا فیلتری فعال است یا خیر
    const hasActiveFilters = selectedCategory !== null || searchQuery !== "" || minPrice !== "" || maxPrice !== "";

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* 1. Header & Breadcrumb */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <PackageSearch className="w-7 h-7 text-salona-500" />
                        فروشگاه محصولات
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        {searchData?.total ? `${searchData?.total} محصول پیدا شد` : "در حال جستجو..."}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-96 flex-shrink-0">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="جستجوی نام محصول..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:border-salona-500 focus:ring-1 focus:ring-salona-500 transition-all"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 2. Sidebar Filters */}
                <aside className="lg:col-span-3 space-y-6">
                    
                    {/* دکمه حذف کل فیلترها (در صورت فعال بودن فیلترها) */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                            حذف تمامی فیلترها
                        </button>
                    )}

                    {/* بخش مرتب‌سازی */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
                            <SlidersHorizontal className="w-5 h-5 text-salona-500" />
                            مرتب‌سازی
                        </h3>

                        <div className="flex flex-col gap-2">
                            {[
                                { id: "new", label: "جدیدترین‌ها" },
                                { id: "price_asc", label: "ارزان‌ترین" },
                                { id: "price_desc", label: "گران‌ترین" },
                            ].map((option) => {
                                const isActive = sortBy === option.id;

                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            setSortBy(option.id);
                                            setPage(1);
                                        }}
                                        className={`flex cursor-pointer items-center justify-between w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 border ${
                                            isActive
                                                ? "bg-salona-50 border-salona-200 text-salona-700 font-semibold"
                                                : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
                                        }`}
                                    >
                                        <span>{option.label}</span>
                                        {isActive && <Check className="w-4 h-4 text-salona-500" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* بخش فیلتر قیمت */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-5">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Banknote className="w-5 h-5 text-salona-500" />
                                محدوده قیمت <span className="text-xs font-normal text-gray-400">(تومان)</span>
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {/* حداقل قیمت */}
                            <div className="relative group">
                                <label className="block text-xs text-gray-500 mb-1 pr-1">از قیمت</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        dir="ltr"
                                        value={minPrice}
                                        onChange={(e) => handlePriceChange(e.target.value, setMinPrice)}
                                        placeholder="0"
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-4 pr-4 py-3 text-left text-sm font-medium focus:outline-none focus:border-salona-400 focus:bg-white focus:ring-2 focus:ring-salona-50 transition-all"
                                    />
                                    {minPrice && (
                                        <button
                                            onClick={() => setMinPrice("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* حداکثر قیمت */}
                            <div className="relative group">
                                <label className="block text-xs text-gray-500 mb-1 pr-1">تا قیمت</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        dir="ltr"
                                        value={maxPrice}
                                        onChange={(e) => handlePriceChange(e.target.value, setMaxPrice)}
                                        placeholder="بدون محدودیت"
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-4 pr-4 py-3 text-left text-sm font-medium focus:outline-none focus:border-salona-400 focus:bg-white focus:ring-2 focus:ring-salona-50 transition-all"
                                    />
                                    {maxPrice && (
                                        <button
                                            onClick={() => setMaxPrice("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* بخش دسته‌بندی‌ها */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Filter className="w-5 h-5 text-salona-500" />
                                دسته‌بندی‌ها
                            </h3>
                        </div>

                        {isCategoriesLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse w-full"></div>
                                ))}
                            </div>
                        ) : (
                            <ul className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                                <li>
                                    <button
                                        onClick={() => handleCategoryChange(null)}
                                        className={`w-full cursor-pointer text-right px-3 py-2.5 rounded-xl text-sm transition-colors ${
                                            selectedCategory === null
                                                ? "bg-salona-50 text-salona-600 font-bold"
                                                : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        همه محصولات
                                    </button>
                                </li>
                                {categoriesData?.categories?.map((category: Category) => (
                                    <li key={category.id}>
                                        <button
                                            onClick={() => handleCategoryChange(category.id)}
                                            className={`w-full cursor-pointer text-right px-3 py-2.5 rounded-xl text-sm transition-colors ${
                                                selectedCategory === category.id
                                                    ? "bg-salona-50 text-salona-600 font-bold"
                                                    : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </aside>

                {/* 3. Products Main Content */}
                <main className="lg:col-span-9 flex flex-col">
                    {/* گرید محصولات */}
                    {isSearchLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 12 }).map((_, i) => (
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
                    ) : searchData?.products?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchData.products.map((product: Product) => {
                                const favoriteRecord = favoritesData?.favorites?.find(
                                    (fav: any) => fav.product_id === product.id,
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
                    ) : (
                        /* استیت خالی */
                        <div className="flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 py-20 text-center">
                            <PackageSearch className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-700 mb-2">محصولی یافت نشد!</h3>
                            <p className="text-gray-500 text-sm max-w-sm">
                                با فیلترها و کلمات کلیدی فعلی هیچ محصولی پیدا نکردیم. لطفاً فیلترها را تغییر دهید یا
                                عبارت دیگری جستجو کنید.
                            </p>
                            <button
                                onClick={clearFilters}
                                className="mt-6 cursor-pointer bg-salona-500 hover:bg-salona-600 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-sm shadow-salona-200"
                            >
                                حذف فیلترها و مشاهده همه
                            </button>
                        </div>
                    )}

                    {/* 4. صفحه‌بندی (Pagination) */}
                    {searchData && searchData?.pages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-12 bg-white border border-gray-100 py-4 px-6 rounded-2xl shadow-sm w-fit mx-auto">
                            <button
                                onClick={() => {
                                    setPage(page - 1);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                disabled={!searchData.has_prev}
                                className="flex cursor-pointer items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-salona-50 hover:text-salona-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" /> قبلی
                            </button>

                            <span className="text-sm text-gray-500 font-medium px-4">
                                صفحه {searchData.current_page} از {searchData.pages}
                            </span>

                            <button
                                onClick={() => {
                                    setPage(page + 1);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                disabled={!searchData.has_next}
                                className="flex cursor-pointer items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-salona-50 hover:text-salona-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                بعدی <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
