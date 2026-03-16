import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { ReplyTicketPayload } from "@/types/api";

// 1. دریافت لیست تیکت‌ها (همراه با صفحه‌بندی)
export const useTickets = (page: number = 1) => {
    return useQuery({
        queryKey: ["tickets", page],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/tickets/${page}`);
            return data;
        },
        retry:false
    });
};

// 2. دریافت جزئیات و تاریخچه پیام‌های یک تیکت
export const useTicketDetail = (ticketId: number) => {
    return useQuery({
        queryKey: ["ticket", ticketId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/tickets/${ticketId}`);
            return data;
        },
        enabled: !!ticketId,
        retry:false
    });
};

// 3. ایجاد تیکت جدید
export const useCreateTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { subject: string; content: string }) => {
            const { data } = await axiosInstance.post("/api/tickets", payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
        },
        retry:false
    });
};

// 4. ارسال پاسخ برای یک تیکت
export const useReplyTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: ReplyTicketPayload) => {
            const { data } = await axiosInstance.post("/api/tickets/reply", payload);
            return data;
        },
        onSuccess: (_, variables) => {
            // آپدیت کردن دیتای همان تیکت خاص برای نمایش لحظه‌ای پاسخ جدید
            queryClient.invalidateQueries({ queryKey: ["ticket", variables.ticket_id] });
        },
        retry:false
    });
};
