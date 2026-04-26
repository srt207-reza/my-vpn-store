"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail, // <<-- تغییر: استفاده از آیکون ایمیل به جای تلفن
    Clock,
    CreditCard,
    AlertCircle,
    LayoutDashboard,
    Search,
    Filter,
    Trash2,
    ShieldCheck,
    CheckCircle2,
    Activity,
} from "lucide-react";

// ساختار داده‌ای همگام با بک‌اند جدید
type VpnOrder = {
    id: string;
    type: string;
    volume: number;
    fullName: string;
    contactInfo: string;
    price: number;
    status: "pending_payment" | "awaiting_receipt" | "processing" | "completed";
    createdAt: string;
};

export default function ClientOrders({ orders }: { orders: VpnOrder[] }) {
    const [orderList, setOrderList] = useState<VpnOrder[]>(orders);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<"all" | "pending_payment" | "completed">("all");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const formatJalali = (dateString: string) => {
        if (!dateString) return "نامشخص";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const totalOrders = orderList.length;
    const totalIncome = orderList.reduce((acc, order) => acc + (order.price || 0), 0);

    const filteredOrders = useMemo(() => {
        return orderList.filter((order) => {
            // فیلتر بر اساس وضعیت سفارش
            let matchFilter = true;
            if (activeFilter === "pending_payment") {
                matchFilter = order.status === "pending_payment";
            } else if (activeFilter === "completed") {
                matchFilter = order.status === "completed";
            }

            if (!searchTerm.trim()) return matchFilter;

            const searchLower = searchTerm.toLowerCase().trim();
            const matchSearch =
                (order.id || "").toLowerCase().includes(searchLower) ||
                (order.fullName || "").toLowerCase().includes(searchLower) ||
                (order.contactInfo || "").toLowerCase().includes(searchLower);

            return matchFilter && matchSearch;
        });
    }, [orderList, searchTerm, activeFilter]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("آیا از حذف این سفارش اطمینان دارید؟ این عمل غیرقابل بازگشت است.")) {
            return;
        }

        setIsDeleting(id);
        try {
            const response = await fetch(`/api/order?id=${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success) {
                setOrderList((prev) => prev.filter((order) => order.id !== id));
            } else {
                alert(data.message || "خطا در حذف سفارش");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("خطا در برقراری ارتباط با سرور");
        } finally {
            setIsDeleting(null);
        }
    };

    // تابع کمکی برای رنگ‌بندی و متون وضعیت سفارشات
    const getStatusDisplay = (status: string) => {
        switch (status) {
            case "pending_payment":
                return {
                    text: "در انتظار پرداخت",
                    icon: AlertCircle,
                    color: "text-amber-500",
                    bg: "bg-amber-500/10",
                    border: "border-amber-500/20",
                };
            case "awaiting_receipt":
                return {
                    text: "بررسی رسید",
                    icon: Activity,
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                    border: "border-blue-500/20",
                };
            case "processing":
                return {
                    text: "در حال آماده‌سازی",
                    icon: Clock,
                    color: "text-purple-500",
                    bg: "bg-purple-500/10",
                    border: "border-purple-500/20",
                };
            case "completed":
                return {
                    text: "تکمیل شده",
                    icon: CheckCircle2,
                    color: "text-emerald-500",
                    bg: "bg-emerald-500/10",
                    border: "border-emerald-500/20",
                };
            default:
                return {
                    text: status,
                    icon: AlertCircle,
                    color: "text-slate-400",
                    bg: "bg-slate-400/10",
                    border: "border-slate-400/20",
                };
        }
    };

    return (
        <div className="min-h-screen bg-store-base text-white p-4 md:p-8 lg:p-12 font-sans" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* هدر و آمار */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-store-panel border border-store-border p-6 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="bg-gradient-to-br from-primary/20 to-blue-500/20 p-4 rounded-2xl text-primary border border-primary/20 shadow-inner">
                            <LayoutDashboard className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-l from-white to-slate-400">
                                داشبورد سفارشات
                            </h1>
                            <p className="text-slate-400 text-sm mt-1.5 font-medium">
                                مدیریت، پیگیری و گزارش‌گیری یکپارچه
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 w-full xl:w-auto relative z-10">
                        <div className="bg-store-card px-6 py-4 rounded-2xl border border-store-border flex-1 min-w-[140px] text-center shadow-lg">
                            <p className="text-slate-400 text-xs mb-1.5 font-semibold uppercase tracking-wider">
                                کل درآمد (تومان)
                            </p>
                            <p className="font-black text-xl text-primary">{totalIncome.toLocaleString("fa-IR")}</p>
                        </div>
                        <div className="bg-store-card px-6 py-4 rounded-2xl border border-store-border flex-1 min-w-[140px] text-center shadow-lg">
                            <p className="text-slate-400 text-xs mb-1.5 font-semibold uppercase tracking-wider">
                                کل سفارشات
                            </p>
                            <p className="font-black text-xl text-white">{totalOrders.toLocaleString("fa-IR")}</p>
                        </div>
                    </div>
                </motion.div>

                {/* فیلتر و جستجو */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col md:flex-row gap-4 items-center justify-between bg-store-panel p-3 rounded-2xl border border-store-border"
                >
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="جستجو نام، ایمیل یا شناسه..." // <<-- تغییر: اصلاح کلمه جستجو
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-store-card border border-store-border text-white text-sm rounded-xl py-3.5 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-slate-500 shadow-inner"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                        <div className="flex items-center gap-2 px-3 text-slate-400">
                            <Filter className="w-4 h-4" />
                            <span className="text-sm font-medium">فیلتر:</span>
                        </div>
                        <div className="flex gap-1 bg-store-card p-1.5 rounded-xl border border-store-border">
                            {(["all", "pending_payment", "completed"] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setActiveFilter(type)}
                                    className={`px-4 cursor-pointer py-2 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                                        activeFilter === type
                                            ? type === "pending_payment"
                                                ? "bg-amber-500/20 text-amber-500 shadow-sm"
                                                : type === "completed"
                                                  ? "bg-emerald-500/20 text-emerald-400 shadow-sm"
                                                  : "bg-primary/20 text-primary shadow-sm"
                                            : "text-slate-400 hover:text-white hover:bg-store-hover"
                                    }`}
                                >
                                    {type === "all"
                                        ? "همه سفارش‌ها"
                                        : type === "pending_payment"
                                          ? "در انتظار پرداخت"
                                          : "تکمیل شده"}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* لیست سفارشات */}
                {filteredOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 bg-store-panel border border-store-border rounded-3xl"
                    >
                        <div className="w-20 h-20 bg-store-card rounded-full flex items-center justify-center mx-auto mb-4 border border-store-border">
                            <Search className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-300 mb-2">نتیجه‌ای یافت نشد!</h3>
                        <p className="text-slate-500">سفارشی با این مشخصات در سیستم یافت نشد.</p>
                    </motion.div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.map((order) => {
                                const statusInfo = getStatusDisplay(order.status);
                                const StatusIcon = statusInfo.icon;

                                return (
                                    <motion.div
                                        key={order.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                        transition={{ duration: 0.3, layout: { duration: 0.3 } }}
                                        className="group flex flex-col h-full bg-store-panel border border-store-border rounded-[1.5rem] overflow-hidden hover:border-store-hover transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                                    >
                                        <div className="bg-gradient-to-b from-primary/10 to-transparent border-b border-primary/20 p-5 flex justify-between items-center relative overflow-hidden">
                                            <div className="flex items-center gap-3 relative z-10">
                                                <div className="p-2.5 rounded-xl bg-store-card shadow-sm border border-store-border text-primary">
                                                    <ShieldCheck className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="block text-[11px] font-bold tracking-wider text-slate-400 mb-0.5">
                                                        ID: {(order.id || "").toUpperCase()}
                                                    </span>
                                                    <span className="text-sm font-black tracking-wide text-primary">
                                                        ترافیک <span dir="ltr">({order.volume} GB)</span>
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                                className={`flex items-center gap-1.5 ${statusInfo.bg} ${statusInfo.color} px-3 py-1.5 rounded-xl text-xs font-bold border ${statusInfo.border} relative z-10 shadow-sm`}
                                            >
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {statusInfo.text}
                                            </div>
                                        </div>

                                        <div className="p-5 space-y-4 relative flex-1">
                                            <div className="bg-store-base p-4 rounded-2xl border border-store-border flex justify-between items-center shadow-inner group-hover:border-store-hover transition-colors">
                                                <div className="flex items-center gap-2.5 text-slate-300 font-medium text-sm">
                                                    <CreditCard className="w-4 h-4 text-slate-500" />
                                                    <span>مبلغ پرداختی</span>
                                                </div>
                                                <div className="font-black text-white bg-store-card px-3 py-1 rounded-lg border border-store-border">
                                                    {(order.price || 0).toLocaleString("fa-IR")}{" "}
                                                    <span className="text-[10px] text-slate-400 font-normal">
                                                        تومان
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-2 px-1">
                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="w-8 h-8 rounded-full bg-store-card flex items-center justify-center border border-store-border">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <span className="text-slate-200 font-medium">
                                                        {order.fullName || "ثبت نشده"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="w-8 h-8 rounded-full bg-store-card flex items-center justify-center border border-store-border">
                                                        <Mail className="w-4 h-4 text-slate-400" /> {/* <<-- تغییر: جایگزینی Phone با Mail */}
                                                    </div>
                                                    <span
                                                        className="text-slate-300 tracking-widest text-xs md:text-sm truncate w-full"
                                                        dir="ltr"
                                                    >
                                                        {order.contactInfo || "ثبت نشده"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* فوتر کارت و دکمه حذف */}
                                        <div className="px-5 py-3.5 bg-store-base border-t border-store-border flex items-center justify-between text-xs text-slate-500 transition-colors">
                                            <div className="flex text-white items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{formatJalali(order.createdAt)}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                disabled={isDeleting === order.id}
                                                className="flex cursor-pointer items-center justify-center p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="حذف سفارش"
                                            >
                                                {isDeleting === order.id ? (
                                                    <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></span>
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
