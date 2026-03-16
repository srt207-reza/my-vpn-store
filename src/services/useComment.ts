import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

// ==========================================
// 1. تعریف تایپ‌ها (Types & Interfaces)
// ==========================================

export interface ProductSummary {
    id: number;
    name: string;
    slug: string;
}

export interface Comment {
    id: number;
    product_id: number;
    user_id: number;
    author: string;
    parent_id: number | null;
    title: string | null;
    comment: string;
    is_verified_purchase: boolean;
    helpful_count: number;
    created_at: string;
    replies: Comment[]; // پشتیبانی از کامنت‌های تودرتو (Threaded)
}

export interface CommentsResponse {
    product: ProductSummary;
    comments: Comment[];
    total: number;
    pages: number;
    current_page: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
}

export interface CommentFilters {
    page?: number;
    per_page?: number;
}

export interface CreateCommentPayload {
    comment: string;
    title?: string;
    parent_id?: number;
    is_verified_purchase?: boolean;
}

export interface UpdateCommentPayload {
    title?: string;
    comment?: string;
    is_verified_purchase?: boolean;
}

// ==========================================
// 2. هوک‌های دریافت داده (Queries)
// ==========================================

// دریافت کامنت‌های یک محصول همراه با صفحه‌بندی
export const useProductComments = (productId: string | number, page:number = 1) => {
    return useQuery({
        queryKey: ["product-comments", productId, page],
        queryFn: async () => {
            const { data } = await axiosInstance.get<CommentsResponse>(`/get_product_comments/${productId}/${page}`);
            return data;
        },
        enabled: !!productId,
        retry: false,
    });
};

// ==========================================
// 3. هوک‌های تغییر داده (Mutations)
// ==========================================

// ثبت کامنت جدید برای محصول
export const useAddProductComment = (productId: string | number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateCommentPayload) => {
            const { data } = await axiosInstance.post<{ message: string; comment: Comment }>(
                `/add_product_comment/${productId}`,
                payload,
            );
            return data;
        },
        onSuccess: () => {
            // پس از ثبت موفق، لیست کامنت‌های این محصول را بروزرسانی می‌کنیم
            queryClient.invalidateQueries({ queryKey: ["product-comments", productId] });
        },
    });
};

// ویرایش کامنت موجود
export const useEditProductComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ commentId, payload }: { commentId: string | number; payload: UpdateCommentPayload }) => {
            const { data } = await axiosInstance.put<{ message: string; comment: Comment }>(
                `/edit_product_comment/${commentId}`,
                payload,
            );
            return data;
        },
        onSuccess: (data) => {
            // برای سادگی، کل کامنت‌های مربوط به محصولِ این کامنت بروزرسانی می‌شود
            if (data.comment?.product_id) {
                queryClient.invalidateQueries({ queryKey: ["product-comments", data.comment.product_id] });
            }
        },
    });
};

// حذف کامنت
export const useDeleteProductComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (commentId: string | number) => {
            const { data } = await axiosInstance.delete<{ message: string; id_deleted: number }>(
                `/delete_product_comment/${commentId}`,
            );
            return data;
        },
        onSuccess: () => {
            // از آنجایی که ID محصول را به صورت مستقیم در پاسخ حذف نداریم،
            // می‌توانیم تمام کش‌های مربوط به کامنت‌ها را منقضی کنیم
            // یا آن را از کامپوننت فراخوانی کننده مدیریت کنیم.
            queryClient.invalidateQueries({ queryKey: ["product-comments"] });
        },
    });
};
