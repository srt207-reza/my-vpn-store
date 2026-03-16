import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Product, SearchProductsParams, SearchProductsResponse } from "@/types/api";

interface ProductsResponse {
    products: Product[];
    // pagination: PaginationMeta;
    current_page: number;
    has_prev: Boolean;
    has_next: number;
    page: number;
    per_page: number;
    total: number;
}

interface ProductFilters {
    page?: number;
    per_page?: number;
    category_id?: number;
}

// 1. دریافت لیست محصولات با فیلتر و صفحه‌بندی
export const useProducts = (filters: ProductFilters) => {
    return useQuery({
        queryKey: ["products", filters],
        queryFn: async () => {
            const { data } = await axiosInstance.get<ProductsResponse>("/api/products", {
                params: filters,
            });
            return data;
        },
        retry: false,
    });
};

// 2. دریافت جزئیات یک محصول خاص
export const useProductDetail = (productId: string | number) => {
    return useQuery({
        queryKey: ["product", productId],
        queryFn: async () => {
            const { data } = await axiosInstance.get<Product>(`/api/products/${productId}`);
            return data;
        },
        enabled: !!productId, // کوئری فقط زمانی اجرا می‌شود که آیدی محصول وجود داشته باشد
        retry: false,
    });
};

const searchProducts = async (params: SearchProductsParams): Promise<SearchProductsResponse> => {
    // جدا کردن شماره صفحه از بقیه پارامترها برای قرار دادن در URL
    const { page = 1, ...bodyParams } = params;

    // فراخوانی API با متد POST
    const response = await axiosInstance.post<SearchProductsResponse>(`/api/products/search/${page}`, bodyParams);

    return response.data;
};

export const useSearchProducts = (params: SearchProductsParams) => {
    return useQuery({
        // کلید کوئری: هر تغییری در params باعث فچ شدن مجدد دیتا می‌شود
        queryKey: ["products", "search", params],
        queryFn: () => searchProducts(params),
        // در صورت نیاز به حفظ دیتای قبلی هنگام تغییر صفحه (برای جلوگیری از پرش UI)
        // keepPreviousData: true,
        // staleTime: 60000, // در صورت نیاز به تنظیم کش
    });
};
