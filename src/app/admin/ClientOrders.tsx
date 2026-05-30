"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Clock,
    CreditCard,
    AlertCircle,
    LayoutDashboard,
    Search,
    Filter,
    Trash2,
    CheckCircle2,
    Activity,
    Banknote,
    Hash,
    Building2,
    ChevronDown,
    ChevronUp,
    Hourglass,
} from "lucide-react";
import * as XLSX from "xlsx";

type Receipt = {
    payerName: string;
    trackingCode: string;
    sourceBank: string;
    submittedAt: string;
};

type VpnOrder = {
    id: string;
    type: string;
    volume: number;
    fullName: string;
    contactInfo: string;
    price: number;
    status: "pending_payment" | "awaiting_receipt" | "processing" | "completed";
    receipt?: Receipt;
    createdAt: string;
};

const STATUS_CONFIG: Record<
    VpnOrder["status"] | "all",
    {
        label: string;
        color: string;
        bg: string;
        border: string;
        icon: React.ReactNode;
    }
> = {
    all: {
        label: "همه",
        color: "text-white",
        bg: "bg-white/10",
        border: "border-white/20",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    pending_payment: {
        label: "در انتظار پرداخت",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/25",
        icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    awaiting_receipt: {
        label: "در انتظار تأیید رسید",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/25",
        icon: <Hourglass className="w-3.5 h-3.5" />,
    },
    processing: {
        label: "در حال پردازش",
        color: "text-violet-400",
        bg: "bg-violet-500/10",
        border: "border-violet-500/25",
        icon: <Clock className="w-3.5 h-3.5" />,
    },
    completed: {
        label: "تکمیل شده",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/25",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
};

export default function ClientOrders({ orders }: { orders: VpnOrder[] }) {
    const [orderList, setOrderList] = useState<VpnOrder[]>(orders);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<
        "all" | "pending_payment" | "awaiting_receipt" | "processing" | "completed"
    >("all");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [expandedReceipt, setExpandedReceipt] = useState<string | null>(null);

    const formatJalali = (dateString: string) => {
        if (!dateString) return "نامشخص";
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(dateString));
    };

    const totalOrders = orderList.length;
    const totalIncome = orderList.reduce((acc, order) => acc + (order.price || 0), 0);
    const pendingCount = orderList.filter((o) => o.status === "pending_payment").length;
    const awaitingReceiptCount = orderList.filter((o) => o.status === "awaiting_receipt").length;
    const processingCount = orderList.filter((o) => o.status === "processing").length;

    const filteredOrders = useMemo(() => {
        return orderList.filter((order) => {
            const matchFilter = activeFilter === "all" || order.status === activeFilter;
            if (!searchTerm.trim()) return matchFilter;

            const q = searchTerm.toLowerCase().trim();
            const matchSearch =
                (order.id || "").toLowerCase().includes(q) ||
                (order.fullName || "").toLowerCase().includes(q) ||
                (order.contactInfo || "").toLowerCase().includes(q) ||
                (order.receipt?.payerName || "").toLowerCase().includes(q) ||
                (order.receipt?.trackingCode || "").toLowerCase().includes(q) ||
                (order.receipt?.sourceBank || "").toLowerCase().includes(q);

            return matchFilter && matchSearch;
        });
    }, [orderList, searchTerm, activeFilter]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("آیا از حذف این سفارش اطمینان دارید؟ این عمل غیرقابل بازگشت است.")) return;

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

    const handleStatusUpdate = async (id: string, status: VpnOrder["status"]) => {
        setIsUpdating(id);
        try {
            const res = await fetch("/api/order", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });

            const data = await res.json();

            if (data.success) {
                setOrderList((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
            } else {
                alert(data.message || "خطا در بروزرسانی وضعیت");
            }
        } catch {
            alert("خطا در برقراری ارتباط با سرور");
        } finally {
            setIsUpdating(null);
        }
    };

    const formatExcelDate = (dateString?: string) => {
        if (!dateString) return "نامشخص";
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(dateString));
    };

    const handleExportExcel = () => {
        const rows = filteredOrders.map((order) => ({
            "شناسه سفارش": order.id,
            نوع: order.type,
            "حجم (GB)": order.volume,
            "نام و نام خانوادگی": order.fullName || "ثبت نشده",
            "راه ارتباطی": order.contactInfo || "ثبت نشده",
            "مبلغ (تومان)": order.price || 0,
            وضعیت: STATUS_CONFIG[order.status]?.label || order.status,
            "نام واریزکننده": order.receipt?.payerName || "ندارد",
            "کد رهگیری": order.receipt?.trackingCode || "ندارد",
            "بانک مبدأ": order.receipt?.sourceBank ? `بانک ${order.receipt.sourceBank}` : "ندارد",
            "زمان ثبت رسید": formatExcelDate(order.receipt?.submittedAt),
            "زمان ایجاد سفارش": formatExcelDate(order.createdAt),
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows);

        worksheet["!cols"] = [
            { wch: 12 },
            { wch: 14 },
            { wch: 12 },
            { wch: 10 },
            { wch: 24 },
            { wch: 24 },
            { wch: 16 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 18 },
            { wch: 22 },
            { wch: 22 },
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

        const fileName = `orders-${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <div className="min-h-screen bg-store-base text-white p-4 md:p-8 lg:p-12 font-sans" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-8">
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

                    <div className="flex flex-wrap gap-4 w-full xl:w-3/5 relative z-10">
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

                        <div className="bg-store-card px-6 py-4 rounded-2xl border border-store-border flex-1 min-w-[140px] text-center shadow-lg">
                            <p className="text-slate-400 text-xs mb-1.5 font-semibold uppercase tracking-wider">
                                در انتظار پرداخت
                            </p>
                            <p className="font-black text-xl text-amber-400">{pendingCount.toLocaleString("fa-IR")}</p>
                        </div>

                        <div className="bg-store-card px-6 py-4 rounded-2xl border border-store-border flex-1 min-w-[140px] text-center shadow-lg">
                            <p className="text-slate-400 text-xs mb-1.5 font-semibold uppercase tracking-wider">
                                در انتظار رسید
                            </p>
                            <p className="font-black text-xl text-blue-400">
                                {awaitingReceiptCount.toLocaleString("fa-IR")}
                            </p>
                        </div>

                        <div className="bg-store-card px-6 py-4 rounded-2xl border border-store-border flex-1 min-w-[140px] text-center shadow-lg">
                            <p className="text-slate-400 text-xs mb-1.5 font-semibold uppercase tracking-wider">
                                در حال پردازش
                            </p>
                            <p className="font-black text-xl text-violet-400">
                                {processingCount.toLocaleString("fa-IR")}
                            </p>
                        </div>
                            <button
                                onClick={handleExportExcel}
                                className="px-4 cursor-pointer py-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 transition-all font-bold text-sm whitespace-nowrap"
                            >
                                خروجی اکسل
                            </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-3 bg-store-panel p-3 rounded-2xl border border-store-border"
                >
                    <div className="flex flex-col md:flex-row gap-3 items-center">
                        <div className="relative w-full md:w-96 group">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="جستجو نام، ایمیل، کد رهگیری..."
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
                                {(
                                    ["all", "pending_payment", "awaiting_receipt", "processing", "completed"] as const
                                ).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setActiveFilter(type)}
                                        className={`px-4 cursor-pointer py-2 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                                            activeFilter === type
                                                ? type === "pending_payment"
                                                    ? "bg-amber-500/20 text-amber-400 shadow-sm"
                                                    : type === "awaiting_receipt"
                                                      ? "bg-blue-500/20 text-blue-400 shadow-sm"
                                                      : type === "processing"
                                                        ? "bg-violet-500/20 text-violet-400 shadow-sm"
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
                                              : type === "awaiting_receipt"
                                                ? "در انتظار رسید"
                                                : type === "processing"
                                                  ? "در حال پردازش"
                                                  : "تکمیل شده"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-slate-400 text-sm px-2">وضعیت:</span>
                        {(["all", "pending_payment", "awaiting_receipt", "processing", "completed"] as const).map(
                            (key) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveFilter(key)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border
                                        ${
                                            activeFilter === key
                                                ? key === "all"
                                                    ? "bg-white/10 text-white border-white/20"
                                                    : `${STATUS_CONFIG[key].bg} ${STATUS_CONFIG[key].color} ${STATUS_CONFIG[key].border}`
                                                : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-store-card"
                                        }`}
                                >
                                    {key === "all" ? "همه" : STATUS_CONFIG[key].label}
                                </button>
                            ),
                        )}
                    </div>
                </motion.div>

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
                                const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending_payment;
                                const receiptOpen = expandedReceipt === order.id;

                                return (
                                    <motion.div
                                        key={order.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                        transition={{ duration: 0.3 }}
                                        className="group flex flex-col h-full bg-store-panel border border-store-border rounded-[1.5rem] overflow-hidden hover:border-store-hover transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                                    >
                                        <div className="bg-gradient-to-b from-primary/10 to-transparent border-b border-primary/20 p-5 flex justify-between items-center relative overflow-hidden">
                                            <div className="flex items-center gap-3 relative z-10">
                                                <div className="p-2.5 rounded-xl bg-store-card shadow-sm border border-store-border text-primary">
                                                    <Activity className="w-5 h-5" />
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
                                                className={`flex items-center gap-1.5 ${status.bg} ${status.color} px-3 py-1.5 rounded-xl text-xs font-bold border ${status.border} relative z-10 shadow-sm`}
                                            >
                                                {status.icon}
                                                {status.label}
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
                                                        <Mail className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <span
                                                        className="text-slate-300 tracking-widest text-xs md:text-sm truncate w-full"
                                                        dir="ltr"
                                                    >
                                                        {order.contactInfo || "ثبت نشده"}
                                                    </span>
                                                </div>

                                                {order.receipt ? (
                                                    <div className="rounded-2xl border border-blue-500/20 overflow-hidden mt-3">
                                                        <button
                                                            onClick={() =>
                                                                setExpandedReceipt(receiptOpen ? null : order.id)
                                                            }
                                                            className="w-full flex items-center justify-between px-4 py-3 bg-blue-500/10 text-blue-400 text-xs font-bold cursor-pointer hover:bg-blue-500/15 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Banknote className="w-4 h-4" />
                                                                رسید پرداخت ثبت شده
                                                            </div>
                                                            {receiptOpen ? (
                                                                <ChevronUp className="w-4 h-4" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4" />
                                                            )}
                                                        </button>

                                                        <AnimatePresence>
                                                            {receiptOpen && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.25 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="px-4 py-3 space-y-2.5 bg-store-base border-t border-blue-500/10">
                                                                        {[
                                                                            {
                                                                                icon: (
                                                                                    <User className="w-3.5 h-3.5 text-blue-400" />
                                                                                ),
                                                                                label: "نام واریزکننده",
                                                                                value: order.receipt.payerName,
                                                                            },
                                                                            {
                                                                                icon: (
                                                                                    <Hash className="w-3.5 h-3.5 text-blue-400" />
                                                                                ),
                                                                                label: "کد رهگیری",
                                                                                value: order.receipt.trackingCode,
                                                                            },
                                                                            {
                                                                                icon: (
                                                                                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                                                                                ),
                                                                                label: "بانک مبدأ",
                                                                                value: `بانک ${order.receipt.sourceBank}`,
                                                                            },
                                                                            {
                                                                                icon: (
                                                                                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                                                ),
                                                                                label: "زمان ثبت",
                                                                                value: formatJalali(
                                                                                    order.receipt.submittedAt,
                                                                                ),
                                                                            },
                                                                        ].map(({ icon, label, value }) => (
                                                                            <div
                                                                                key={label}
                                                                                className="flex items-start gap-2.5 text-xs"
                                                                            >
                                                                                <div className="w-6 h-6 rounded-lg bg-store-card flex items-center justify-center border border-store-border shrink-0 mt-0.5">
                                                                                    {icon}
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-slate-500 text-[10px]">
                                                                                        {label}
                                                                                    </p>
                                                                                    <p className="text-slate-200 font-medium">
                                                                                        {value}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-store-border bg-store-base text-slate-500 text-xs">
                                                        <Banknote className="w-4 h-4" />
                                                        هنوز رسید پرداخت ثبت نشده
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="px-5 py-3.5 bg-store-base border-t border-store-border space-y-2">
                                            <div className="flex gap-1.5 flex-wrap">
                                                {order.status !== "processing" && order.status !== "completed" && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order.id, "processing")}
                                                        disabled={isUpdating === order.id}
                                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-colors disabled:opacity-50"
                                                    >
                                                        {isUpdating === order.id ? (
                                                            <span className="w-3.5 h-3.5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <Clock className="w-3.5 h-3.5" />
                                                        )}
                                                        در حال پردازش
                                                    </button>
                                                )}

                                                {order.status !== "completed" && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order.id, "completed")}
                                                        disabled={isUpdating === order.id}
                                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                                    >
                                                        {isUpdating === order.id ? (
                                                            <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                        )}
                                                        تأیید پرداخت
                                                    </button>
                                                )}

                                                {order.status === "completed" && (
                                                    <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/5 text-emerald-500/60 border border-emerald-500/10">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        پرداخت تأیید شده
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{formatJalali(order.createdAt)}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(order.id)}
                                                    disabled={isDeleting === order.id}
                                                    className="flex cursor-pointer items-center justify-center p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                                                    title="حذف سفارش"
                                                >
                                                    {isDeleting === order.id ? (
                                                        <span className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            </div>
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
