"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Users,
    Mail,
    Clock,
    CreditCard,
    AlertCircle,
    LayoutDashboard,
    Search,
    Filter,
    Trash2,
    CheckCircle2,
    Hourglass,
    Banknote,
    Hash,
    Building2,
    ChevronDown,
    ChevronUp,
    FileSpreadsheet,
    Upload,
    RotateCcw,
    ReceiptText,
    Tag,
    X,
    BadgePercent,
    Wallet,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

type Receipt = {
    payerName: string;
    trackingCode: string;
    sourceBank: string;
    submittedAt: string;
};

type OrderStatus = "pending_payment" | "awaiting_receipt" | "processing" | "completed";
type StatusFilter = "all" | "pending_payment" | "awaiting_receipt" | "processing" | "completed";

type DiscountType = "percent" | "fixed";

type DiscountCode = {
    code: string;
    type: DiscountType;
    value: number;
    active: boolean;
    maxUses?: number;
    usedCount: number;
    minOrderAmount?: number;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
};

type Order = {
    id: string;
    type: string;
    volume: number;
    fullName: string;
    contactInfo: string;
    price: number;

    originalPrice?: number;
    discountAmount?: number;
    couponCode?: string;
    finalPrice?: number;

    status: OrderStatus;
    receipt?: Receipt;
    createdAt: string;
    updatedAt?: string;
    importedFromExcel?: boolean;
};

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string; border: string; icon: LucideIcon }> =
    {
        pending_payment: {
            label: "در انتظار پرداخت",
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-500/25",
            icon: AlertCircle,
        },
        awaiting_receipt: {
            label: "در انتظار رسید",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/25",
            icon: Hourglass,
        },
        processing: {
            label: "در حال پردازش",
            color: "text-violet-400",
            bg: "bg-violet-500/10",
            border: "border-violet-500/25",
            icon: Clock,
        },
        completed: {
            label: "تکمیل شده",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/25",
            icon: CheckCircle2,
        },
    };

function getStatusMeta(status: string) {
    return STATUS_META[(status as OrderStatus) || "processing"] ?? STATUS_META.processing;
}

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

function parseStatus(value: unknown): OrderStatus {
    const v = normalizeText(value).toLowerCase();

    if (v.includes("تکمیل") || v === "completed") return "completed";
    if (v.includes("پردازش") || v === "processing") return "processing";
    if (v.includes("رسید") || v.includes("در انتظار رسید") || v === "awaiting_receipt") return "awaiting_receipt";
    if (v.includes("پرداخت") || v === "pending_payment") return "pending_payment";

    return "pending_payment";
}

function cleanSourceBank(value: unknown): string {
    return normalizeText(value)
        .replace(/^بانک\s+/g, "")
        .trim();
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

function getCell(row: Record<string, unknown>, keys: string[]) {
    for (const key of keys) {
        const value = row[key];
        if (value !== undefined && value !== null && normalizeText(value) !== "") {
            return value;
        }
    }
    return "";
}

function normalizeImportedRow(row: Record<string, unknown>): Order | null {
    const id = normalizeText(getCell(row, ["شناسه سفارش", "ID", "id", "orderId", "کد سفارش"]));
    const type = normalizeText(getCell(row, ["نوع", "type", "productType"])).toLowerCase() || "vpn";
    const volume = parseNumber(getCell(row, ["حجم", "volume", "gb", "ترافیک"]));
    const fullName = normalizeText(getCell(row, ["نام و نام خانوادگی", "fullName", "name"]));
    const contactInfo = normalizeText(getCell(row, ["ایمیل", "contactInfo", "email", "راه ارتباطی"]));

    const priceCell = getCell(row, ["مبلغ (تومان)", "price", "مبلغ", "finalPrice"]);
    const originalPriceCell = getCell(row, ["مبلغ اصلی", "originalPrice"]);
    const discountAmountCell = getCell(row, ["مبلغ تخفیف", "discountAmount"]);
    const couponCodeCell = getCell(row, ["کد تخفیف", "couponCode"]);
    const finalPriceCell = getCell(row, ["مبلغ نهایی", "finalPrice"]);

    const importedPrice = parseNumber(priceCell);
    const originalPrice = normalizeText(originalPriceCell) ? parseNumber(originalPriceCell) : importedPrice;
    const discountAmount = normalizeText(discountAmountCell) ? parseNumber(discountAmountCell) : 0;
    const finalPrice = normalizeText(finalPriceCell)
        ? parseNumber(finalPriceCell)
        : discountAmount > 0
          ? Math.max(0, originalPrice - discountAmount)
          : importedPrice;

    if (!fullName || !contactInfo || !finalPrice) {
        return null;
    }

    const receiptPayerName = normalizeText(getCell(row, ["نام واریزکننده", "payerName"]));
    const receiptTrackingCode = normalizeText(getCell(row, ["کد رهگیری", "trackingCode"]));
    const receiptSourceBank = cleanSourceBank(getCell(row, ["بانک مبدأ", "sourceBank"]));
    const receiptSubmittedAt = normalizeText(getCell(row, ["زمان ثبت رسید", "submittedAt"]));

    const hasReceipt = receiptPayerName.length > 0 && receiptTrackingCode.length > 0 && receiptSourceBank.length > 0;

    return {
        id: id || `CN-IMP-${Date.now().toString(36).slice(-5).toUpperCase()}`,
        type,
        volume,
        fullName,
        contactInfo,
        price: finalPrice,
        originalPrice: originalPrice || finalPrice,
        discountAmount,
        couponCode: normalizeText(couponCodeCell) || undefined,
        finalPrice,
        status: parseStatus(getCell(row, ["وضعیت", "status"])),
        receipt: hasReceipt
            ? {
                  payerName: receiptPayerName,
                  trackingCode: receiptTrackingCode,
                  sourceBank: receiptSourceBank,
                  submittedAt: receiptSubmittedAt || new Date().toISOString(),
              }
            : undefined,
        createdAt: normalizeText(getCell(row, ["زمان ایجاد سفارش", "createdAt"])) || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        importedFromExcel: true,
    };
}

function normalizeCouponCode(value: unknown): string {
    return normalizeText(value).replace(/\s+/g, "").toUpperCase();
}

function isExpired(expiresAt?: string): boolean {
    if (!expiresAt) return false;
    const date = new Date(expiresAt);
    return Number.isNaN(date.getTime()) ? false : date.getTime() < Date.now();
}

function calculateDiscount(price: number, code: DiscountCode) {
    let discountAmount = 0;

    if (code.type === "percent") {
        discountAmount = Math.floor((price * code.value) / 100);
    } else {
        discountAmount = Math.floor(code.value);
    }

    discountAmount = Math.max(0, Math.min(discountAmount, price));

    return {
        discountAmount,
        finalPrice: Math.max(0, price - discountAmount),
    };
}

export default function ClientOrders({ orders }: { orders: Order[] }) {
    const [orderList, setOrderList] = useState<Order[]>(orders || []);
    const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
    const [discountForm, setDiscountForm] = useState({
        code: "",
        type: "percent" as DiscountType,
        value: "",
        maxUses: "",
        minOrderAmount: "",
        expiresAt: "",
    });
    const [creatingDiscount, setCreatingDiscount] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [expandedReceipt, setExpandedReceipt] = useState<string | null>(null);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setOrderList(orders || []);
    }, [orders]);

    useEffect(() => {
        const loadDiscountCodes = async () => {
            try {
                const res = await fetch("/api/discount-code");
                const data = await res.json();

                if (data.success) {
                    setDiscountCodes(Array.isArray(data.codes) ? data.codes : []);
                } else {
                    toast.error(data.message || "خطا در دریافت کدهای تخفیف");
                }
            } catch {
                toast.error("خطا در دریافت کدهای تخفیف");
            }
        };

        loadDiscountCodes();
    }, []);

    const totalOrders = orderList.length;
    const totalIncome = orderList.reduce((acc, order) => acc + ((order.finalPrice ?? order.price) || 0), 0);
    const totalDiscount = orderList.reduce((acc, order) => acc + (order.discountAmount || 0), 0);
    const processingCount = orderList.filter((o) => o.status === "processing").length;
    const completedCount = orderList.filter((o) => o.status === "completed").length;
    const receiptCount = orderList.filter((o) => Boolean(o.receipt)).length;
    const activeDiscountCount = discountCodes.filter((d) => d.active).length;

    const filteredOrders = useMemo(() => {
        return orderList.filter((order) => {
            const matchFilter = activeFilter === "all" || order.status === activeFilter;

            if (!searchTerm.trim()) return matchFilter;

            const q = searchTerm.toLowerCase().trim();

            const matchSearch =
                (order.id || "").toLowerCase().includes(q) ||
                (order.fullName || "").toLowerCase().includes(q) ||
                (order.contactInfo || "").toLowerCase().includes(q) ||
                (order.couponCode || "").toLowerCase().includes(q) ||
                (order.receipt?.payerName || "").toLowerCase().includes(q) ||
                (order.receipt?.trackingCode || "").toLowerCase().includes(q) ||
                (order.receipt?.sourceBank || "").toLowerCase().includes(q);

            return matchFilter && matchSearch;
        });
    }, [orderList, searchTerm, activeFilter]);

    const handleCreateDiscountCode = async () => {
        const code = normalizeCouponCode(discountForm.code);
        const value = Number(discountForm.value);

        if (!code || !discountForm.value.trim()) {
            toast.error("کد و مقدار تخفیف الزامی است.");
            return;
        }

        if (!Number.isFinite(value) || value <= 0) {
            toast.error("مقدار تخفیف معتبر نیست.");
            return;
        }

        if (discountForm.type === "percent" && (value < 1 || value > 100)) {
            toast.error("درصد تخفیف باید بین ۱ تا ۱۰۰ باشد.");
            return;
        }

        setCreatingDiscount(true);
        try {
            const res = await fetch("/api/discount-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code,
                    type: discountForm.type,
                    value,
                    maxUses: discountForm.maxUses ? Number(discountForm.maxUses) : undefined,
                    minOrderAmount: discountForm.minOrderAmount ? Number(discountForm.minOrderAmount) : undefined,
                    expiresAt: discountForm.expiresAt || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "خطا در ثبت کد");
                return;
            }

            setDiscountCodes((prev) => [data.code, ...prev]);
            setDiscountForm({
                code: "",
                type: "percent",
                value: "",
                maxUses: "",
                minOrderAmount: "",
                expiresAt: "",
            });
            toast.success("کد تخفیف ثبت شد.");
        } catch {
            toast.error("خطا در ارتباط با سرور");
        } finally {
            setCreatingDiscount(false);
        }
    };

    const handleToggleDiscount = async (code: string, active: boolean) => {
        try {
            const res = await fetch("/api/discount-code", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, active }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "خطا در بروزرسانی کد");
                return;
            }

            setDiscountCodes((prev) => prev.map((item) => (item.code === code ? { ...item, active } : item)));
            toast.success("وضعیت کد بروزرسانی شد.");
        } catch {
            toast.error("خطا در ارتباط با سرور");
        }
    };

    const handleDeleteDiscount = async (code: string) => {
        if (!window.confirm("کد تخفیف حذف شود؟")) return;

        try {
            const res = await fetch(`/api/discount-code?code=${encodeURIComponent(code)}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "خطا در حذف کد");
                return;
            }

            setDiscountCodes((prev) => prev.filter((item) => item.code !== code));
            toast.success("کد تخفیف حذف شد.");
        } catch {
            toast.error("خطا در ارتباط با سرور");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("آیا از حذف این سفارش اطمینان دارید؟ این عمل غیرقابل بازگشت است.")) {
            return;
        }

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
        } catch {
            toast.error("خطا در برقراری ارتباط با سرور");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleStatusUpdate = async (id: string, status: OrderStatus) => {
        setIsUpdating(id);
        try {
            const response = await fetch("/api/order", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });

            const data = await response.json();

            if (data.success) {
                setOrderList((prev) =>
                    prev.map((order) =>
                        order.id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order,
                    ),
                );
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
        try {
            setExporting(true);

            const rows = orderList.map((order) => ({
                "شناسه سفارش": order.id,
                "نوع سرویس": order.type || "vpn",
                حجم: order.volume || 0,
                "نام و نام خانوادگی": order.fullName || "ثبت نشده",
                ایمیل: order.contactInfo || "ثبت نشده",
                "کد تخفیف": order.couponCode || "ندارد",
                "مبلغ اصلی": order.originalPrice ?? order.price ?? 0,
                "مبلغ تخفیف": order.discountAmount ?? 0,
                "مبلغ نهایی": order.finalPrice ?? order.price ?? 0,
                "مبلغ (تومان)": order.finalPrice ?? order.price ?? 0,
                وضعیت: getStatusMeta(order.status).label,
                "نام واریزکننده": order.receipt?.payerName || "ندارد",
                "کد رهگیری": order.receipt?.trackingCode || "ندارد",
                "بانک مبدأ": order.receipt?.sourceBank ? `بانک ${order.receipt.sourceBank}` : "ندارد",
                "زمان ثبت رسید": parseDateForExcel(order.receipt?.submittedAt),
                "زمان ایجاد سفارش": parseDateForExcel(order.createdAt),
                "زمان بروزرسانی": parseDateForExcel(order.updatedAt),
            }));

            const worksheet = XLSX.utils.json_to_sheet(rows);
            worksheet["!cols"] = [
                { wch: 16 },
                { wch: 12 },
                { wch: 10 },
                { wch: 22 },
                { wch: 28 },
                { wch: 16 },
                { wch: 14 },
                { wch: 14 },
                { wch: 14 },
                { wch: 14 },
                { wch: 18 },
                { wch: 18 },
                { wch: 18 },
                { wch: 18 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

            const fileName = `orders-${new Date().toISOString().slice(0, 10)}.xlsx`;
            XLSX.writeFile(workbook, fileName);

            toast.success("فایل اکسل خروجی گرفته شد.");
        } catch {
            toast.error("خطا در ساخت فایل اکسل");
        } finally {
            setExporting(false);
        }
    };

    const handleImportExcel = async (file: File) => {
        setImporting(true);
        try {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            if (!sheetName) {
                toast.error("فایل اکسل معتبر نیست.");
                return;
            }

            const sheet = workbook.Sheets[sheetName];
            const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
                defval: "",
                blankrows: false,
            });

            if (rawRows.length === 0) {
                toast.error("هیچ ردیفی در فایل پیدا نشد.");
                return;
            }

            const normalizedOrders = rawRows.map(normalizeImportedRow).filter((row): row is Order => Boolean(row));

            if (normalizedOrders.length === 0) {
                toast.error("هیچ ردیف معتبری برای وارد کردن پیدا نشد.");
                return;
            }

            const response = await fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "import",
                    orders: normalizedOrders,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                toast.error(data.message || "خطا در ورود فایل اکسل");
                return;
            }

            setOrderList((prev) => {
                const map = new Map<string, Order>();
                for (const order of prev) map.set(order.id, order);
                for (const order of normalizedOrders) map.set(order.id, order);
                return Array.from(map.values());
            });

            toast.success(`فایل وارد شد. ${data.importedCount || normalizedOrders.length} ردیف ذخیره شد.`);
        } catch (error) {
            console.error(error);
            toast.error("خطا در خواندن یا ارسال فایل اکسل");
        } finally {
            setImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="min-h-screen bg-store-base text-white p-4 md:p-8 lg:p-12 font-sans" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-store-panel border border-store-border p-6 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="bg-gradient-to-br from-primary/20 to-cyan-500/20 p-4 rounded-2xl text-primary border border-primary/20 shadow-inner">
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

                        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
                            {[
                                {
                                    label: "کل درآمد",
                                    value: totalIncome.toLocaleString("fa-IR"),
                                    color: "text-primary",
                                },
                                {
                                    label: "کل تخفیف",
                                    value: totalDiscount.toLocaleString("fa-IR"),
                                    color: "text-emerald-400",
                                },
                                {
                                    label: "کل سفارشات",
                                    value: totalOrders.toLocaleString("fa-IR"),
                                    color: "text-white",
                                },
                                {
                                    label: "در حال پردازش",
                                    value: processingCount.toLocaleString("fa-IR"),
                                    color: "text-violet-400",
                                },
                                {
                                    label: "تکمیل شده",
                                    value: completedCount.toLocaleString("fa-IR"),
                                    color: "text-emerald-400",
                                },
                                {
                                    label: "دارای رسید",
                                    value: receiptCount.toLocaleString("fa-IR"),
                                    color: "text-blue-400",
                                },
                            ].map(({ label, value, color }) => (
                                <div
                                    key={label}
                                    className="bg-store-card px-5 py-3.5 rounded-2xl border border-store-border flex-1 min-w-[130px] text-center shadow-lg"
                                >
                                    <p className="text-slate-400 text-[11px] mb-1.5 font-semibold uppercase tracking-wider">
                                        {label}
                                    </p>
                                    <p className={`font-black text-xl ${color}`}>{value}</p>
                                </div>
                            ))}

                            <button
                                onClick={handleExportExcel}
                                disabled={exporting}
                                className="px-4 cursor-pointer py-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 transition-all font-bold text-sm whitespace-nowrap disabled:opacity-60 inline-flex items-center justify-center gap-2"
                            >
                                {exporting ? (
                                    <RotateCcw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <FileSpreadsheet className="w-4 h-4" />
                                )}
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
                                className="px-4 cursor-pointer py-3 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/25 hover:bg-sky-500/25 transition-all font-bold text-sm whitespace-nowrap disabled:opacity-60 inline-flex items-center justify-center gap-2"
                            >
                                {importing ? (
                                    <RotateCcw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Upload className="w-4 h-4" />
                                )}
                                آپلود اکسل
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-store-panel p-4 rounded-2xl border border-store-border space-y-4"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                                <Tag className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white">مدیریت کدهای تخفیف</h3>
                                <p className="text-xs text-slate-400 mt-1">ثبت، فعال/غیرفعال‌سازی و حذف کدها</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <BadgePercent className="w-4 h-4" />
                            <span>{activeDiscountCount.toLocaleString("fa-IR")} کد فعال</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <input
                            value={discountForm.code}
                            onChange={(e) => setDiscountForm((p) => ({ ...p, code: e.target.value }))}
                            placeholder="کد مثلا NEW20"
                            dir="ltr"
                            className="md:col-span-1 bg-store-card border border-store-border rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                        />

                        <select
                            value={discountForm.type}
                            onChange={(e) =>
                                setDiscountForm((p) => ({
                                    ...p,
                                    type: e.target.value as DiscountType,
                                }))
                            }
                            className="bg-store-card border border-store-border rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                        >
                            <option value="percent">درصدی</option>
                            <option value="fixed">مبلغی</option>
                        </select>

                        <input
                            value={discountForm.value}
                            onChange={(e) => setDiscountForm((p) => ({ ...p, value: e.target.value }))}
                            placeholder="مقدار"
                            type="number"
                            className="bg-store-card border border-store-border rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                        />

                        <input
                            value={discountForm.maxUses}
                            onChange={(e) => setDiscountForm((p) => ({ ...p, maxUses: e.target.value }))}
                            placeholder="حداکثر استفاده"
                            type="number"
                            className="bg-store-card border border-store-border rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                        />

                        <input
                            value={discountForm.minOrderAmount}
                            onChange={(e) => setDiscountForm((p) => ({ ...p, minOrderAmount: e.target.value }))}
                            placeholder="حداقل سفارش"
                            type="number"
                            className="bg-store-card border border-store-border rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            value={discountForm.expiresAt}
                            onChange={(e) => setDiscountForm((p) => ({ ...p, expiresAt: e.target.value }))}
                            type="datetime-local"
                            className="bg-store-card border border-store-border rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                        />

                        <button
                            onClick={handleCreateDiscountCode}
                            disabled={creatingDiscount}
                            className="px-4 cursor-pointer py-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-bold text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2"
                        >
                            {creatingDiscount ? (
                                <>
                                    <RotateCcw className="w-4 h-4 animate-spin" />
                                    در حال ثبت...
                                </>
                            ) : (
                                <>
                                    <Wallet className="w-4 h-4" />
                                    ثبت کد تخفیف
                                </>
                            )}
                        </button>
                    </div>

                    <div className="space-y-2">
                        {discountCodes.length === 0 ? (
                            <p className="text-sm text-slate-500">هنوز کد تخفیفی ثبت نشده است.</p>
                        ) : (
                            discountCodes.map((item) => {
                                const expired = isExpired(item.expiresAt);

                                return (
                                    <div
                                        key={item.code}
                                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-store-card border border-store-border rounded-xl px-4 py-3"
                                    >
                                        <div className="space-y-1">
                                            <div className="font-black text-white flex items-center gap-2">
                                                <span>{item.code}</span>
                                                {item.active ? (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        فعال
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                                        غیرفعال
                                                    </span>
                                                )}
                                                {expired && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                        منقضی
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-xs text-slate-400 mt-1 leading-6">
                                                {item.type === "percent"
                                                    ? `${item.value}% تخفیف`
                                                    : `${item.value.toLocaleString("fa-IR")} تومان تخفیف`}
                                                {" • "}
                                                استفاده: {item.usedCount.toLocaleString("fa-IR")}
                                                {typeof item.maxUses === "number"
                                                    ? ` / ${item.maxUses.toLocaleString("fa-IR")}`
                                                    : ""}
                                                {typeof item.minOrderAmount === "number"
                                                    ? ` • حداقل سفارش ${item.minOrderAmount.toLocaleString("fa-IR")} تومان`
                                                    : ""}
                                                {item.expiresAt ? ` • انقضا: ${parseDateSafe(item.expiresAt)}` : ""}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 flex-wrap">
                                            <button
                                                onClick={() => handleToggleDiscount(item.code, !item.active)}
                                                className="px-3 cursor-pointer py-2 rounded-lg text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                            >
                                                {item.active ? "غیرفعال کن" : "فعال کن"}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDiscount(item.code)}
                                                className="px-3 cursor-pointer py-2 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                            >
                                                حذف
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>

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
                            placeholder="جستجو نام، ایمیل، کد تخفیف، کد رهگیری..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-store-card border border-store-border text-white text-sm rounded-xl py-3.5 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-slate-500 shadow-inner"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                        <div className="flex items-center gap-2 px-3 text-slate-400">
                            <Filter className="w-4 h-4" />
                            <span className="text-sm font-medium">فیلتر وضعیت:</span>
                        </div>
                        <div className="flex gap-1 bg-store-card p-1.5 rounded-xl border border-store-border">
                            {(["all", "pending_payment", "awaiting_receipt", "processing", "completed"] as const).map(
                                (type) => (
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
                                                        : "bg-emerald-500/20 text-emerald-400 shadow-sm"
                                                : "text-slate-400 hover:text-white hover:bg-store-hover"
                                        }`}
                                    >
                                        {type === "all"
                                            ? "همه"
                                            : type === "pending_payment"
                                              ? "در انتظار پرداخت"
                                              : type === "awaiting_receipt"
                                                ? "در انتظار رسید"
                                                : type === "processing"
                                                  ? "در حال پردازش"
                                                  : "تکمیل شده"}
                                    </button>
                                ),
                            )}
                        </div>
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
                                const statusInfo = getStatusMeta(order.status);
                                const StatusIcon: any = statusInfo.icon;
                                const receiptOpen = expandedReceipt === order.id;
                                const hasDiscount = (order.discountAmount || 0) > 0;

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
                                                    <ReceiptText className="w-5 h-5" />
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
                                                {statusInfo.label}
                                            </div>
                                        </div>

                                        <div className="p-5 space-y-4 relative flex-1">
                                            <div className="bg-store-base p-4 rounded-2xl border border-store-border flex justify-between items-center shadow-inner group-hover:border-store-hover transition-colors">
                                                <div className="flex items-center gap-2.5 text-slate-300 font-medium text-sm">
                                                    <CreditCard className="w-4 h-4 text-slate-500" />
                                                    <span>مبلغ پرداختی</span>
                                                </div>

                                                <div className="flex flex-col items-end gap-1">
                                                    {hasDiscount ? (
                                                        <>
                                                            <div className="text-[11px] text-slate-400 line-through">
                                                                {(
                                                                    (order.originalPrice ?? order.price) ||
                                                                    0
                                                                ).toLocaleString("fa-IR")}{" "}
                                                                تومان
                                                            </div>
                                                            <div className="font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-sm">
                                                                {(
                                                                    (order.finalPrice ?? order.price) ||
                                                                    0
                                                                ).toLocaleString("fa-IR")}
                                                                <span className="text-[10px] text-slate-400 font-normal">
                                                                    {" "}
                                                                    تومان
                                                                </span>
                                                            </div>
                                                            <div className="text-[10px] text-emerald-400">
                                                                تخفیف {order.discountAmount?.toLocaleString("fa-IR")}{" "}
                                                                تومان
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="font-black text-white bg-store-card px-3 py-1 rounded-lg border border-store-border text-sm">
                                                            {(order.price || 0).toLocaleString("fa-IR")}
                                                            <span className="text-[10px] text-slate-400 font-normal">
                                                                {" "}
                                                                تومان
                                                            </span>
                                                        </div>
                                                    )}
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
                                                    <span className="text-slate-300 tracking-widest text-xs md:text-sm truncate w-full">
                                                        {order.contactInfo || "ثبت نشده"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="w-8 h-8 rounded-full bg-store-card flex items-center justify-center border border-store-border">
                                                        <Hash className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <span className="text-slate-300 text-xs md:text-sm">
                                                        {order.type || "vpn"} / {order.volume || 0}GB
                                                    </span>
                                                </div>

                                                {order.couponCode ? (
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                            <Tag className="w-4 h-4 text-emerald-400" />
                                                        </div>
                                                        <span className="text-emerald-300 text-xs md:text-sm font-medium">
                                                            کد تخفیف: {order.couponCode}
                                                        </span>
                                                    </div>
                                                ) : null}
                                            </div>

                                            {order.receipt ? (
                                                <div className="rounded-2xl border border-blue-500/20 overflow-hidden">
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
                                                                            value: parseDateSafe(
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

                                        <div className="px-5 py-3.5 bg-store-base border-t border-store-border space-y-2">
                                            <div className="flex flex-wrap gap-2">
                                                {order.status !== "processing" && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order.id, "processing")}
                                                        disabled={isUpdating === order.id}
                                                        className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-colors disabled:opacity-50"
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
                                                        className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
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
                                                    className="flex cursor-pointer items-center justify-center p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors disabled:opacity-50"
                                                    title="حذف سفارش"
                                                >
                                                    {isDeleting === order.id ? (
                                                        <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></span>
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
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
