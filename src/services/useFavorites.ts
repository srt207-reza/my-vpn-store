import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Favorite } from "@/types/api";

interface FavoritesResponse {
    favorites: Favorite[];
    count: number;
}

// 1. دریافت لیست علاقه‌مندی‌ها
export const useFavorites = (isAuthenticated: boolean = true) => {
    return useQuery({
        queryKey: ["favorites"],
        queryFn: async () => {
            const { data } = await axiosInstance.get<FavoritesResponse>("/api/users/me/favorites");
            return data;
        },
        enabled: isAuthenticated,
        retry:false
    });
};

// 2. افزودن محصول به علاقه‌مندی‌ها
export const useAddFavorite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (productId: number) => {
            const { data } = await axiosInstance.post("/api/users/me/favorites", { product_id: productId });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites"] });
        },
        retry:false
    });
};

// 3. حذف از علاقه‌مندی‌ها
export const useDeleteFavorite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (favoriteId: number) => {
            const { data } = await axiosInstance.delete(`/api/users/me/favorites/${favoriteId}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites"] });
        },
        retry:false
    });
};
