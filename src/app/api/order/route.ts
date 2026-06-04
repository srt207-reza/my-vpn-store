import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "orders.json");
const discountFilePath = path.join(process.cwd(), "discount-codes.json");

type OrderStatus = "pending_payment" | "awaiting_receipt" | "processing" | "completed";
type DiscountType = "percent" | "fixed";
type ImportAction = "import";

interface ReceiptInfo {
    payerName: string;
    trackingCode: string;
    sourceBank: string;
    submittedAt: string;
}

interface DiscountCode {
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
}

interface VpnOrder {
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
    receipt?: ReceiptInfo;
    createdAt: string;
    updatedAt: string;
    importedFromExcel?: boolean;
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function isPositiveNumber(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isOrderStatus(value: unknown): value is OrderStatus {
    return (
        value === "pending_payment" || value === "awaiting_receipt" || value === "processing" || value === "completed"
    );
}

function normalizeText(value: unknown): string {
    if (typeof value === "string") return value.trim();
    if (value === null || value === undefined) return "";
    return String(value).trim();
}

function normalizeNumber(value: unknown): number {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    const parsed = Number(normalizeText(value).replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeCouponCode(value: unknown): string {
    return normalizeText(value).replace(/\s+/g, "").toUpperCase();
}

function isExpired(expiresAt?: string): boolean {
    if (!expiresAt) return false;
    const date = new Date(expiresAt);
    return Number.isNaN(date.getTime()) ? false : date.getTime() < Date.now();
}

function parseReceipt(raw: any): ReceiptInfo | null {
    if (!raw || typeof raw !== "object") return null;

    const payerName = normalizeText(raw.payerName);
    const trackingCode = normalizeText(raw.trackingCode);
    const sourceBank = normalizeText(raw.sourceBank);
    const submittedAt = normalizeText(raw.submittedAt) || new Date().toISOString();

    if (!payerName || !trackingCode || !sourceBank) return null;

    return {
        payerName,
        trackingCode,
        sourceBank,
        submittedAt,
    };
}

async function readOrders(): Promise<VpnOrder[]> {
    try {
        const fileData = await fs.readFile(dataFilePath, "utf-8");
        const parsed = JSON.parse(fileData);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

async function writeOrders(orders: VpnOrder[]) {
    await fs.writeFile(dataFilePath, JSON.stringify(orders, null, 2), "utf-8");
}

async function readDiscountCodes(): Promise<DiscountCode[]> {
    try {
        const fileData = await fs.readFile(discountFilePath, "utf-8");
        const parsed = JSON.parse(fileData);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

async function writeDiscountCodes(codes: DiscountCode[]) {
    await fs.writeFile(discountFilePath, JSON.stringify(codes, null, 2), "utf-8");
}

function buildOrderId() {
    return `CN-${Date.now().toString().slice(-6)}`;
}

function applyDiscount(price: number, code: DiscountCode) {
    if (!code.active) {
        return { ok: false as const, message: "این کد تخفیف غیرفعال است." };
    }

    if (isExpired(code.expiresAt)) {
        return { ok: false as const, message: "این کد تخفیف منقضی شده است." };
    }

    if (typeof code.maxUses === "number" && code.usedCount >= code.maxUses) {
        return { ok: false as const, message: "این کد تخفیف دیگر قابل استفاده نیست." };
    }

    if (typeof code.minOrderAmount === "number" && price < code.minOrderAmount) {
        return { ok: false as const, message: "مبلغ سفارش برای این کد تخفیف کافی نیست." };
    }

    let discountAmount = 0;

    if (code.type === "percent") {
        discountAmount = Math.floor((price * code.value) / 100);
    } else {
        discountAmount = Math.floor(code.value);
    }

    discountAmount = Math.max(0, Math.min(discountAmount, price));

    return {
        ok: true as const,
        discountAmount,
        finalPrice: price - discountAmount,
    };
}

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // اکسل: ورود چند سفارش
        if (data?.action === "import") {
            const rawOrders = Array.isArray(data.orders) ? data.orders : [];

            if (rawOrders.length === 0) {
                return NextResponse.json(
                    { success: false, message: "هیچ سفارشی برای وارد کردن ارسال نشده است." },
                    { status: 400 },
                );
            }

            const orders = await readOrders();
            const existingIds = new Set(orders.map((o) => o.id));

            const normalizedOrders: VpnOrder[] = [];

            for (const item of rawOrders) {
                const id = normalizeText(item.id) || buildOrderId();
                const receipt = parseReceipt(item.receipt);

                const originalPrice = normalizeNumber(item.originalPrice) || normalizeNumber(item.price) || 0;

                const discountAmount = normalizeNumber(item.discountAmount) || 0;
                const finalPrice =
                    normalizeNumber(item.finalPrice) ||
                    (discountAmount > 0 ? Math.max(0, originalPrice - discountAmount) : normalizeNumber(item.price));

                const order: VpnOrder = {
                    id,
                    type: normalizeText(item.type) || "vpn",
                    volume: normalizeNumber(item.volume),
                    fullName: normalizeText(item.fullName),
                    contactInfo: normalizeText(item.contactInfo),
                    price: finalPrice || normalizeNumber(item.price),
                    originalPrice: originalPrice || finalPrice || normalizeNumber(item.price),
                    discountAmount,
                    couponCode: normalizeCouponCode(item.couponCode),
                    finalPrice: finalPrice || normalizeNumber(item.price),
                    status: isOrderStatus(item.status) ? item.status : "pending_payment",
                    receipt: receipt || undefined,
                    createdAt: normalizeText(item.createdAt) || new Date().toISOString(),
                    updatedAt: normalizeText(item.updatedAt) || new Date().toISOString(),
                    importedFromExcel: true,
                };

                if (!order.fullName || !order.contactInfo || !order.price) continue;
                normalizedOrders.push(order);
            }

            const merged = orders.filter((order) => !existingIds.has(order.id));
            merged.push(...normalizedOrders);

            await writeOrders(merged);

            return NextResponse.json(
                {
                    success: true,
                    importedCount: normalizedOrders.length,
                    message: "سفارش‌ها با موفقیت وارد شدند.",
                },
                { status: 201 },
            );
        }

        // ثبت سفارش عادی همراه با رسید و کد تخفیف
        const receipt = parseReceipt(data.receipt);

        if (
            !isPositiveNumber(data.volume) ||
            !isNonEmptyString(data.fullName) ||
            !isNonEmptyString(data.contactInfo) ||
            !isPositiveNumber(data.price)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "اطلاعات اصلی سفارش ناقص یا نامعتبر است.",
                },
                { status: 400 },
            );
        }

        if (!receipt) {
            return NextResponse.json(
                {
                    success: false,
                    message: "اطلاعات رسید پرداخت ناقص یا نامعتبر است.",
                },
                { status: 400 },
            );
        }

        const orders = await readOrders();
        const discountCodes = await readDiscountCodes();
        const now = new Date().toISOString();

        const rawCouponCode = normalizeCouponCode(data.couponCode);
        const originalPrice = normalizeNumber(data.price);
        let discountAmount = 0;
        let finalPrice = originalPrice;
        let appliedCouponCode: string | undefined;

        if (rawCouponCode) {
            const matched = discountCodes.find((item) => item.code.toUpperCase() === rawCouponCode);

            if (!matched) {
                return NextResponse.json({ success: false, message: "کد تخفیف معتبر نیست." }, { status: 400 });
            }

            const result = applyDiscount(originalPrice, matched);

            if (!result.ok) {
                return NextResponse.json({ success: false, message: result.message }, { status: 400 });
            }

            discountAmount = result.discountAmount;
            finalPrice = result.finalPrice;
            appliedCouponCode = matched.code;

            matched.usedCount += 1;
            matched.updatedAt = now;
            await writeDiscountCodes(discountCodes);
        }

        const newOrder: VpnOrder = {
            id: buildOrderId(),
            type: isNonEmptyString(data.type) ? data.type : "vpn",
            volume: data.volume,
            fullName: data.fullName.trim(),
            contactInfo: data.contactInfo.trim(),
            price: finalPrice,
            originalPrice,
            discountAmount,
            couponCode: appliedCouponCode,
            finalPrice,
            status: "awaiting_receipt",
            receipt: {
                payerName: receipt.payerName,
                trackingCode: receipt.trackingCode,
                sourceBank: receipt.sourceBank,
                submittedAt: receipt.submittedAt || now,
            },
            createdAt: now,
            updatedAt: now,
        };

        orders.push(newOrder);
        await writeOrders(orders);

        return NextResponse.json(
            {
                success: true,
                orderId: newOrder.id,
                message: rawCouponCode ? "سفارش با موفقیت ثبت شد و تخفیف اعمال شد." : "سفارش با موفقیت ثبت شد.",
                supportLink: "https://t.me/GetPremium_support",
                originalPrice,
                discountAmount,
                finalPrice,
                couponCode: appliedCouponCode,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error saving order:", error);
        return NextResponse.json({ success: false, message: "خطا در ثبت سفارش در سرور" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const data = await req.json();
        const id = normalizeText(data.id);
        const status = data.status;

        if (!id || !isOrderStatus(status)) {
            return NextResponse.json({ success: false, message: "شناسه سفارش یا وضعیت نامعتبر است." }, { status: 400 });
        }

        const orders = await readOrders();
        const index = orders.findIndex((order) => order.id === id);

        if (index === -1) {
            return NextResponse.json({ success: false, message: "سفارشی با این شناسه یافت نشد." }, { status: 404 });
        }

        orders[index] = {
            ...orders[index],
            status,
            updatedAt: new Date().toISOString(),
        };

        await writeOrders(orders);

        return NextResponse.json({ success: true, message: "وضعیت سفارش با موفقیت بروزرسانی شد." }, { status: 200 });
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ success: false, message: "خطا در بروزرسانی سفارش" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "شناسه سفارش برای حذف ارسال نشده است." },
                { status: 400 },
            );
        }

        const orders = await readOrders();
        const initialLength = orders.length;

        const filtered = orders.filter((order) => order.id !== id);

        if (filtered.length === initialLength) {
            return NextResponse.json({ success: false, message: "سفارشی با این شناسه یافت نشد." }, { status: 404 });
        }

        await writeOrders(filtered);

        return NextResponse.json({ success: true, message: "سفارش با موفقیت حذف شد." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting order:", error);
        return NextResponse.json({ success: false, message: "خطا در حذف سفارش از سرور" }, { status: 500 });
    }
}
