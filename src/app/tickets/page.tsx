"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import {
    MessageSquare,
    Plus,
    ChevronLeft,
    Send,
    Clock,
    CheckCircle2,
    AlertCircle,
    X,
    Search,
    User,
    Headset,
    Loader2,
} from "lucide-react";
import { useCreateTicket, useReplyTicket, useTicketDetail, useTickets } from "@/services/useTickets";

// فرض بر این است که هوک‌های شما در این مسیر قرار دارند

// --- Types (جهت جلوگیری از خطای تایپ‌اسکریپت - با بک‌اند خود تطبیق دهید) ---
interface Ticket {
    id: number;
    subject: string;
    status: "pending" | "answered" | "closed";
    created_at: string;
    updated_at: string;
}

interface TicketMessage {
    id: number;
    content: string;
    is_admin: boolean; // یا sender_type
    created_at: string;
}

interface TicketDetailType extends Ticket {
    messages: TicketMessage[];
}
// --------------------------------------------------------------------------

export default function TicketsPage() {
    // === States ===
    const [page, setPage] = useState(1);
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // فرم تیکت جدید
    const [newTicket, setNewTicket] = useState({ subject: "", content: "" });
    // فرم پاسخ
    const [replyContent, setReplyContent] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // === Hooks ===
    const { data: ticketsData, isLoading: isTicketsLoading } = useTickets(page);
    const { data: ticketDetail, isLoading: isDetailLoading } = useTicketDetail(selectedTicketId!);

    const { mutate: createTicket, isPending: isCreating } = useCreateTicket();
    const { mutate: replyTicket, isPending: isReplying } = useReplyTicket();

    // اسکرول خودکار به انتهای چت هنگام باز کردن تیکت یا دریافت پیام جدید
    useEffect(() => {
        if (ticketDetail?.messages) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [ticketDetail]);

    // === Handlers ===
    const handleCreateTicket = (e: FormEvent) => {
        e.preventDefault();
        if (!newTicket.subject.trim() || !newTicket.content.trim()) return;

        createTicket(newTicket, {
            onSuccess: () => {
                setIsModalOpen(false);
                setNewTicket({ subject: "", content: "" });
                setPage(1); // برگشت به صفحه اول برای دیدن تیکت جدید
            },
        });
    };

    const handleReply = (e: FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim() || !selectedTicketId) return;

        replyTicket(
            { ticket_id: selectedTicketId, content: replyContent },
            {
                onSuccess: () => {
                    setReplyContent("");
                },
            },
        );
    };

    // === Helper Functions ===
    // تابع کمکی برای استایل دادن به وضعیت تیکت
    const getStatusStyle = (status: string) => {
        switch (status) {
            case "answered":
                return {
                    label: "پاسخ داده شده",
                    colors: "bg-emerald-50 text-emerald-600 border-emerald-200",
                    icon: CheckCircle2,
                };
            case "closed":
                return { label: "بسته شده", colors: "bg-gray-100 text-gray-500 border-gray-200", icon: AlertCircle };
            case "pending":
            default:
                return { label: "در انتظار پاسخ", colors: "bg-amber-50 text-amber-600 border-amber-200", icon: Clock };
        }
    };

    // فرض می‌کنیم دیتا در data.results قرار دارد (مخصوص صفحه‌بندی)
    const ticketsList: Ticket[] = ticketsData?.tickets || ticketsData || [];

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] min-h-150 flex flex-col pt-4 pb-8 px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                        <MessageSquare className="w-7 h-7 text-salona-500" />
                        پشتیبانی و تیکت‌ها
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">پیگیری مشکلات و ارتباط با تیم پشتیبانی سالونا</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full cursor-pointer sm:w-auto bg-salona-500 hover:bg-salona-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-salona-500/30 flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    تیکت جدید
                </button>
            </div>

            {/* Main Layout Container */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex overflow-hidden relative">
                {/* ----------------------------------------- */}
                {/* 1. بخش لیست تیکت‌ها (Sidebar) */}
                {/* در موبایل اگر تیکتی انتخاب شده باشد، این بخش مخفی می‌شود */}
                <div
                    className={`${selectedTicketId ? "hidden lg:flex" : "flex"} w-full lg:w-95 flex-col border-l border-gray-200 bg-gray-50/30`}
                >
                    {/* سرچ باکس لیست تیکت */}
                    <div className="p-4 border-b border-gray-100 bg-white">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="جستجو در تیکت‌ها..."
                                className="w-full bg-gray-50 border border-gray-100 text-sm rounded-xl py-2.5 px-4 pr-10 focus:outline-none focus:border-salona-300 transition-colors"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    {/* لیست تیکت‌ها */}
                    <div className="flex-1 scrollbar-hide overflow-y-auto p-3 space-y-2">
                        {isTicketsLoading ? (
                            // لودینگ لیست
                            Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse bg-white p-4 rounded-2xl border border-gray-100 h-24"
                                ></div>
                            ))
                        ) : ticketsList.length === 0 ? (
                            // حالت خالی
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                                <MessageSquare className="w-12 h-12 opacity-20" />
                                <span className="text-sm">هیچ تیکتی ثبت نشده است</span>
                            </div>
                        ) : (
                            ticketsList?.map((ticket) => {
                                const statusInfo = getStatusStyle(ticket.status);
                                const StatusIcon = statusInfo.icon;
                                const isSelected = selectedTicketId === ticket.id;

                                return (
                                    <div
                                        key={ticket.id}
                                        onClick={() => setSelectedTicketId(ticket.id)}
                                        className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                                            isSelected
                                                ? "bg-salona-50 border-salona-200 shadow-sm"
                                                : "bg-white border-gray-100 hover:border-salona-200 hover:shadow-sm"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h3
                                                className={`font-bold text-sm line-clamp-1 flex-1 ml-3 ${isSelected ? "text-salona-700" : "text-gray-800"}`}
                                            >
                                                {ticket.subject}
                                            </h3>
                                            <span className="text-[10px] text-gray-400 shrink-0 font-medium dir-ltr">
                                                {new Date(ticket.created_at).toLocaleDateString("fa-IR")}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500 font-medium tracking-wide">
                                                #TK-{ticket.id}
                                            </span>
                                            <div
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${statusInfo.colors}`}
                                            >
                                                <StatusIcon className="w-3 h-3" />
                                                {statusInfo.label}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ----------------------------------------- */}
                {/* 2. بخش چت و جزئیات تیکت (Main View) */}
                <div
                    className={`${!selectedTicketId ? "hidden lg:flex lg:flex-col lg:items-center lg:justify-center" : "flex"} flex-1 flex-col bg-white h-full relative`}
                >
                    {!selectedTicketId ? (
                        // حالت انتخاب نشدن تیکت در دسکتاپ
                        <div className="text-center">
                            <div className="w-24 h-24 bg-salona-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MessageSquare className="w-10 h-10 text-salona-200" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-400">یک تیکت را برای مشاهده انتخاب کنید</h3>
                        </div>
                    ) : (
                        <>
                            {/* هدر چت */}
                            <div className="h-[76px] px-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedTicketId(null)}
                                        className="lg:hidden p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-xl"
                                    >
                                        <ChevronLeft className="w-6 h-6 rotate-180" />
                                    </button>
                                    <div>
                                        <h2 className="font-bold text-gray-800 line-clamp-1">
                                            {ticketDetail?.subject || "در حال بارگذاری..."}
                                        </h2>
                                        <span className="text-xs text-gray-500 font-medium">
                                            شماره پیگیری: #{selectedTicketId}
                                        </span>
                                    </div>
                                </div>

                                {ticketDetail && (
                                    <div
                                        className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${getStatusStyle(ticketDetail.status).colors}`}
                                    >
                                        {getStatusStyle(ticketDetail.status).label}
                                    </div>
                                )}
                            </div>

                            {/* بدنه چت (محل نمایش پیام‌ها) */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f8f9fa] space-y-6 relative">
                                {isDetailLoading ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                                        <Loader2 className="w-10 h-10 animate-spin text-salona-500" />
                                    </div>
                                ) : (
                                    ticketDetail?.messages?.map((msg: TicketMessage) => {
                                        const isAdmin = msg.is_admin;

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex w-full ${isAdmin ? "justify-start" : "justify-end"}`}
                                            >
                                                <div
                                                    className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${isAdmin ? "flex-row" : "flex-row-reverse"}`}
                                                >
                                                    {/* آواتار فرستنده */}
                                                    <div className="shrink-0 mt-auto">
                                                        <div
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${isAdmin ? "bg-gray-800 text-white" : "bg-salona-100 text-salona-600"}`}
                                                        >
                                                            {isAdmin ? (
                                                                <Headset className="w-4 h-4" />
                                                            ) : (
                                                                <User className="w-4 h-4" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* حباب پیام */}
                                                    <div
                                                        className={`p-4 shadow-sm relative ${
                                                            isAdmin
                                                                ? "bg-white text-gray-700 rounded-2xl rounded-bl-none border border-gray-100"
                                                                : "bg-salona-500 text-white rounded-2xl rounded-br-none"
                                                        }`}
                                                    >
                                                        <p className="text-sm leading-loose whitespace-pre-wrap">
                                                            {msg.content}
                                                        </p>
                                                        <span
                                                            className={`block text-[10px] mt-2 text-left font-medium dir-ltr ${isAdmin ? "text-gray-400" : "text-salona-100"}`}
                                                        >
                                                            {new Date(msg.created_at).toLocaleTimeString("fa-IR", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* بخش ارسال پیام */}
                            {ticketDetail?.status !== "closed" ? (
                                <div className="p-4 bg-white border-t border-gray-100">
                                    <form onSubmit={handleReply} className="flex gap-3 max-w-4xl mx-auto">
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="پاسخ خود را بنویسید..."
                                            className="flex-1 bg-gray-50 border border-gray-200 text-sm rounded-2xl py-3 px-4 resize-none h-[52px] min-h-[52px] max-h-[120px] focus:outline-none focus:border-salona-400 focus:bg-white transition-all custom-scrollbar"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!replyContent.trim() || isReplying}
                                            className="w-[52px] h-[52px] shrink-0 bg-salona-500 hover:bg-salona-600 text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:bg-gray-300"
                                        >
                                            {isReplying ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Send className="w-5 h-5 rotate-180" />
                                            )}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                                    <span className="text-gray-500 text-sm font-medium">
                                        این تیکت بسته شده است و امکان ارسال پیام جدید وجود ندارد.
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ----------------------------------------- */}
            {/* Modal: ثبت تیکت جدید */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 text-lg">ثبت تیکت جدید</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTicket} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">موضوع تیکت</label>
                                <input
                                    type="text"
                                    value={newTicket.subject}
                                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                    placeholder="مثال: پیگیری وضعیت سفارش من"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-salona-500 focus:ring-1 focus:ring-salona-500 transition-all text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">متن پیام</label>
                                <textarea
                                    value={newTicket.content}
                                    onChange={(e) => setNewTicket({ ...newTicket, content: e.target.value })}
                                    placeholder="توضیحات خود را کامل بنویسید..."
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 min-h-[140px] focus:outline-none focus:border-salona-500 focus:ring-1 focus:ring-salona-500 transition-all text-sm resize-none"
                                    required
                                />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-1 cursor-pointer bg-salona-500 hover:bg-salona-600 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 flex justify-center items-center shadow-lg shadow-salona-500/20"
                                >
                                    {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : "ثبت و ارسال پیام"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 cursor-pointer bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    انصراف
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
