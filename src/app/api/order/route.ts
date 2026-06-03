import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "orders.json");

type OrderStatus = "pending_payment" | "awaiting_receipt" | "processing" | "completed";
type ImportAction = "import";

interface ReceiptInfo {
    payerName: string;
    trackingCode: string;
    sourceBank: string;
    submittedAt: string;
}

interface VpnOrder {
    id: string;
    type: string;
    volume: number;
    fullName: string;
    contactInfo: string;
    price: number;
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
        value === "pending_payment" ||
        value === "awaiting_receipt" ||
        value === "processing" ||
        value === "completed"
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

function buildOrderId() {
    return `CN-${Date.now().toString().slice(-6)}`;
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

                const order: VpnOrder = {
                    id,
                    type: normalizeText(item.type) || "vpn",
                    volume: normalizeNumber(item.volume),
                    fullName: normalizeText(item.fullName),
                    contactInfo: normalizeText(item.contactInfo),
                    price: normalizeNumber(item.price),
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

        // ثبت سفارش عادی همراه با رسید
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
        const now = new Date().toISOString();

        const newOrder: VpnOrder = {
            id: buildOrderId(),
            type: isNonEmptyString(data.type) ? data.type : "vpn",
            volume: data.volume,
            fullName: data.fullName.trim(),
            contactInfo: data.contactInfo.trim(),
            price: data.price,
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
                message: "سفارش با موفقیت ثبت شد.",
                supportLink: "https://t.me/GetPremium_support",
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error saving order:", error);
        return NextResponse.json(
            { success: false, message: "خطا در ثبت سفارش در سرور" },
            { status: 500 },
        );
    }
}

export async function PATCH(req: Request) {
    try {
        const data = await req.json();
        const id = normalizeText(data.id);
        const status = data.status;

        if (!id || !isOrderStatus(status)) {
            return NextResponse.json(
                { success: false, message: "شناسه سفارش یا وضعیت نامعتبر است." },
                { status: 400 },
            );
        }

        const orders = await readOrders();
        const index = orders.findIndex((order) => order.id === id);

        if (index === -1) {
            return NextResponse.json(
                { success: false, message: "سفارشی با این شناسه یافت نشد." },
                { status: 404 },
            );
        }

        orders[index] = {
            ...orders[index],
            status,
            updatedAt: new Date().toISOString(),
        };

        await writeOrders(orders);

        return NextResponse.json(
            { success: true, message: "وضعیت سفارش با موفقیت بروزرسانی شد." },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json(
            { success: false, message: "خطا در بروزرسانی سفارش" },
            { status: 500 },
        );
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
            return NextResponse.json(
                { success: false, message: "سفارشی با این شناسه یافت نشد." },
                { status: 404 },
            );
        }

        await writeOrders(filtered);

        return NextResponse.json(
            { success: true, message: "سفارش با موفقیت حذف شد." },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error deleting order:", error);
        return NextResponse.json(
            { success: false, message: "خطا در حذف سفارش از سرور" },
            { status: 500 },
        );
    }
}