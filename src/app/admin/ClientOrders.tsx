"use client";

import { useMemo, useRef, useState } from "react";
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
    Upload,
    FileSpreadsheet,
    RotateCcw,
    Hourglass,
} from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

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
    status: "processing" | "completed";
    receipt?: Receipt;
    createdAt: string;
};

type StatusFilter = "all" | "processing" | "completed";

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

function toLatinDigits(input: string) {
    const map: Record<string, string> = {
        "۰": "0",
        "۱": "1",
        "۲": "2",
        "۳": "3",
        "۴": "4",
        "۵": "5",
        "۶": "6",
        "۷": "7",
        "۸": "8",
        "۹": "9",
        "٠": "0",
        "١": "1",
        "٢": "2",
        "٣": "3",
        "٤": "4",
        "٥": "5",
        "٦": "6",
        "٧": "7",
        "٨": "8",
        "٩": "9",
    };

    return input.replace(/[۰-۹٠-٩]/g, (d) => map[d] ?? d);
}

function normalizeText(value: unknown): string {
    if (typeof value === "string") return value.trim();
    if (value === null || value === undefined) return "";
    return String(value).trim();
}

function parseNumber(value: unknown): number {
    const cleaned = toLatinDigits(normalizeText(value)).replace(/[^\d.-]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
}

function parseStatus(value: unknown): VpnOrder["status"] {
    const v = normalizeText(value).toLowerCase();

    if (v === "completed" || v.includes("تکمیل")) return "completed";
    return "processing";
}

function getCell(row: Record<string, unknown>, keys: string[]) {
    for (const key of keys) {
        const value = row[key];
        if (value !== undefined && value !== null && normalizeText(value) !== "") {
            return value;
        }
    }
    return "";
}

function parseDateSafe(dateString?: string) {
    if (!dateString) return "نامشخص";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function parseDateForExcel(dateString?: string) {
    if (!dateString) return "نامشخص";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function normalizeImportedRow(row: Record<string, unknown>): VpnOrder | null {
    const id =
        normalizeText(getCell(row, ["شناسه سفارش", "ID", "id", "orderId"])) ||
        `CN-IMP-${Date.now().toString().slice(-6)}`;

    const type = normalizeText(getCell(row, ["نوع", "type"])) || "vpn";
    const volume = parseNumber(getCell(row, ["حجم (GB)", "حجم", "volume"]));
    const fullName = normalizeText(getCell(row, ["نام و نام خانوادگی", "fullName", "name"]));
    const contactInfo = normalizeText(getCell(row, ["راه ارتباطی", "contactInfo", "ایمیل", "email"]));
    const price = parseNumber(getCell(row, ["مبلغ (تومان)", "price", "مبلغ"]));
    const status = parseStatus(getCell(row, ["وضعیت", "status"]));
    const createdAt =
        normalizeText(getCell(row, ["زمان ایجاد سفارش", "createdAt"])) || new Date().toISOString();

    if (!volume || !fullName || !contactInfo || !price) {
        return null;
    }

    const payerName = normalizeText(getCell(row, ["نام واریزکننده", "payerName"]));
    const trackingCode = normalizeText(getCell(row, ["کد رهگیری", "trackingCode"]));
    const sourceBank = normalizeText(getCell(row, ["بانک مبدأ", "sourceBank"])).replace(/^بانک\s+/g, "");
    const submittedAt = normalizeText(getCell(row, ["زمان ثبت رسید", "submittedAt"]));

    const receipt =
        payerName && trackingCode && sourceBank
            ? {
                  payerName,
                  trackingCode,
                  sourceBank,
                  submittedAt: submittedAt || new Date().toISOString(),
              }
            : undefined;

    return {
        id,
        type,
        volume,
        fullName,
        contactInfo,
        price,
        status,
        receipt,
        createdAt,
    };
}

export default function ClientOrders({ orders }: { orders: VpnOrder[] }) {
    const [orderList, setOrderList] = useState<VpnOrder[]>(orders);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [expandedReceipt, setExpandedReceipt] = useState<string | null>(null);
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const totalOrders = orderList.length;
    const totalIncome = orderList.reduce((acc, order) => acc + (order.price || 0), 0);
    const processingCount = orderList.filter((o) => o.status === "processing").length;
    const completedCount = orderList.filter((o) => o.status === "completed").length;

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
            const response = await fetch(`/api/order?id=${encodeURIComponent(id)}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success) {
                setOrderList((prev) => prev.filter((order) => order.id !== id));
                toast.success("سفارش حذف شد.");
            } else {
                toast.error(data.message || "خطا در حذف سفارش");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("خطا در برقراری ارتباط با سرور");
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
                toast.success("وضعیت سفارش بروزرسانی شد.");
            } else {
                toast.error(data.message || "خطا در بروزرسانی وضعیت");
            }
        } catch {
            toast.error("خطا در برقراری ارتباط با سرور");
        } finally {
            setIsUpdating(null);
        }
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
            "زمان ثبت رسید": parseDateForExcel(order.receipt?.submittedAt),
            "زمان ایجاد سفارش": parseDateForExcel(order.createdAt),
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows);

        worksheet["!cols"] = [
            { wch: 12 },
            { wch: 14 },
            { wch: 12 },
            { wch: 20 },
            { wch: 24 },
            { wch: 16 },
            { wch: 16 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 18 },
            { wch: 22 },
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

        const fileName = `orders-${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        toast.success("خروجی اکسل ساخته شد.");
    };

    const handleImportExcel = async (file: File) => {
        setImporting(true);
        try {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: "array" });

            const firstSheetName = workbook.SheetNames[0];
            if (!firstSheetName) {
                toast.error("فایل اکسل معتبر نیست.");
                return;
            }

            const sheet = workbook.Sheets[firstSheetName];
            const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
                defval: "",
                blankrows: false,
            });

            if (rawRows.length === 0) {
                toast.error("هیچ ردیفی در فایل پیدا نشد.");
                return;
            }

            const normalizedOrders = rawRows
                .map(normalizeImportedRow)
                .filter((row): row is VpnOrder => Boolean(row));

            if (normalizedOrders.length === 0) {
                toast.error("هیچ ردیف معتبری برای وارد کردن پیدا نشد.");
                return;
            }

            const res = await fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "import",
                    orders: normalizedOrders,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "خطا در ورود فایل اکسل");
                return;
            }

            setOrderList((prev) => {
                const map = new Map<string, VpnOrder>();
                for (const order of prev) map.set(order.id, order);
                for (const order of normalizedOrders) map.set(order.id, order);
                return Array.from(map.values());
            });

            toast.success(`فایل وارد شد. ${data.importedCount || normalizedOrders.length} ردیف ذخیره شد.`);
        } catch (err) {
            console.error(err);
            toast.error("خطا در خواندن یا ارسال فایل اکسل");
        } finally {
            setImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
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
                            <p className="font-black text-xl text-primary">
                                {totalIncome.toLocaleString("fa-IR")}
                            </p>
                        </div>

                        <div className="bg-store-card px-6 py-4 rounded-2xl border border-store-border flex-1 min-w-[140px] text-center shadow-lg">
                            <p className="text-slate-400 text-xs mb-1.5 font-semibold uppercase tracking-wider">
                                کل سفارشات
                            </p>
                            <p className="font-black text-xl text-white">
                                {totalOrders.toLocaleString("fa-IR")}
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

                        <div className="bg-store-card px-6 py-4 rounded-2xl border border-store-border flex-1 min-w-[140px] text-center shadow-lg">
                            <p className="text-slate-400 text-xs mb-1.5 font-semibold uppercase tracking-wider">
                                تکمیل شده
                            </p>
                            <p className="font-black text-xl text-emerald-400">
                                {completedCount.toLocaleString("fa-IR")}
                            </p>
                        </div>

                        <button
                            onClick={handleExportExcel}
                            className="px-4 cursor-pointer py-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 transition-all font-bold text-sm whitespace-nowrap"
                        >
                            خروجی اکسل
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImportExcel(file);
                            }}
                        />

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={importing}
                            className="px-4 cursor-pointer py-3 rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/25 hover:bg-sky-500/25 transition-all font-bold text-sm whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                        >
                            {importing ? (
                                <>
                                    <RotateCcw className="w-4 h-4 animate-spin" />
                                    در حال ورود
                                </>
                            ) : (
                                <>
                                    <FileSpreadsheet className="w-4 h-4" />
                                    آپلود اکسل
                                </>
                            )}
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
                                placeholder="جستجو نام، تماس، کد رهگیری..."
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
                                {(["all", "processing", "completed"] as const).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setActiveFilter(type)}
                                        className={`px-4 cursor-pointer py-2 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                                            activeFilter === type
                                                ? type === "processing"
                                                    ? "bg-violet-500/20 text-violet-400 shadow-sm"
                                                    : type === "completed"
                                                      ? "bg-emerald-500/20 text-emerald-400 shadow-sm"
                                                      : "bg-primary/20 text-primary shadow-sm"
                                                : "text-slate-400 hover:text-white hover:bg-store-hover"
                                        }`}
                                    >
                                        {type === "all"
                                            ? "همه سفارش‌ها"
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
                        {(["all", "processing", "completed"] as const).map((key) => (
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
                        ))}
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
                                const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.processing;
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
                                                                                value: parseDateSafe(order.receipt.submittedAt),
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
                                                    <span>{parseDateSafe(order.createdAt)}</span>
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