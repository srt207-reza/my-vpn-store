import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "orders.json");

type OrderStatus = "processing" | "completed";

type Receipt = {
    payerName: string;
    trackingCode: string;
    sourceBank: string;
    submittedAt: string;
};

interface VpnOrder {
    id: string;
    type: string;
    volume: number;
    fullName: string;
    contactInfo: string;
    price: number;
    status: OrderStatus;
    receipt?: Receipt;
    createdAt: string;
}

type ImportRow = Record<string, unknown> & {
    receipt?: Partial<Receipt>;
};

async function readOrders(): Promise<VpnOrder[]> {
    try {
        const fileData = await fs.readFile(dataFilePath, "utf-8");
        const parsed = JSON.parse(fileData);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

async function writeOrders(orders: VpnOrder[]): Promise<void> {
    await fs.writeFile(dataFilePath, JSON.stringify(orders, null, 2), "utf-8");
}

function normalizeText(value: unknown): string {
    if (typeof value === "string") return value.trim();
    if (value === null || value === undefined) return "";
    return String(value).trim();
}

function toLatinDigits(input: string): string {
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

function parseNumber(value: unknown): number {
    const text = toLatinDigits(normalizeText(value));
    const cleaned = text.replace(/[^\d.-]/g, "");
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
}

function normalizeStatus(value: unknown): OrderStatus {
    const v = normalizeText(value).toLowerCase();

    if (v === "completed" || v.includes("تکمیل")) return "completed";
    return "processing";
}

function getCell(row: Record<string, unknown>, keys: string[]): unknown {
    for (const key of keys) {
        const value = row[key];
        if (value !== undefined && value !== null && normalizeText(value) !== "") {
            return value;
        }
    }
    return "";
}

function normalizeReceipt(receipt: Partial<Receipt> | undefined): Receipt | undefined {
    if (!receipt) return undefined;

    const payerName = normalizeText(receipt.payerName);
    const trackingCode = normalizeText(receipt.trackingCode);
    const sourceBank = normalizeText(receipt.sourceBank).replace(/^بانک\s+/g, "").trim();

    if (!payerName || !trackingCode || !sourceBank) return undefined;

    return {
        payerName,
        trackingCode,
        sourceBank,
        submittedAt: normalizeText(receipt.submittedAt) || new Date().toISOString(),
    };
}

function normalizeImportedOrder(row: ImportRow): VpnOrder | null {
    const id = normalizeText(getCell(row, ["شناسه سفارش", "ID", "id", "orderId"])) || `CN-IMP-${Date.now()}`;
    const type = normalizeText(getCell(row, ["نوع", "type"])) || "vpn";
    const volume = parseNumber(getCell(row, ["حجم (GB)", "حجم", "volume"]));
    const fullName = normalizeText(getCell(row, ["نام و نام خانوادگی", "fullName", "fullNameEn", "name"]));
    const contactInfo = normalizeText(getCell(row, ["راه ارتباطی", "contactInfo", "ایمیل", "email", "spotifyEmail"]));
    const price = parseNumber(getCell(row, ["مبلغ (تومان)", "price", "مبلغ"]));
    const status = normalizeStatus(getCell(row, ["وضعیت", "status"]));
    const createdAt = normalizeText(getCell(row, ["زمان ایجاد سفارش", "createdAt"])) || new Date().toISOString();

    if (!volume || !fullName || !contactInfo || !price) {
        return null;
    }

    const receiptFromRow = normalizeReceipt({
        payerName: normalizeText(getCell(row, ["نام واریزکننده", "payerName"])),
        trackingCode: normalizeText(getCell(row, ["کد رهگیری", "trackingCode"])),
        sourceBank: normalizeText(getCell(row, ["بانک مبدأ", "sourceBank"])),
        submittedAt: normalizeText(getCell(row, ["زمان ثبت رسید", "submittedAt"])),
    });

    return {
        id,
        type,
        volume,
        fullName,
        contactInfo,
        price,
        status,
        receipt: receiptFromRow,
        createdAt,
    };
}

function upsertOrder(orders: VpnOrder[], nextOrder: VpnOrder): VpnOrder[] {
    const idx = orders.findIndex((o) => o.id === nextOrder.id);
    if (idx === -1) return [...orders, nextOrder];

    const cloned = [...orders];
    cloned[idx] = nextOrder;
    return cloned;
}

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const orders = await readOrders();

        // ── Import Excel ──
        if (data?.action === "import") {
            const rows: ImportRow[] = Array.isArray(data.orders) ? data.orders : [];

            if (rows.length === 0) {
                return NextResponse.json(
                    { success: false, message: "هیچ ردیفی برای وارد کردن ارسال نشده است." },
                    { status: 400 }
                );
            }

            const imported: VpnOrder[] = [];
            let skippedCount = 0;

            for (const row of rows) {
                const normalized = normalizeImportedOrder(row);
                if (!normalized) {
                    skippedCount += 1;
                    continue;
                }
                imported.push(normalized);
            }

            if (imported.length === 0) {
                return NextResponse.json(
                    { success: false, message: "هیچ ردیف معتبری برای وارد کردن پیدا نشد." },
                    { status: 400 }
                );
            }

            let nextOrders = [...orders];
            for (const item of imported) {
                nextOrders = upsertOrder(nextOrders, item);
            }

            await writeOrders(nextOrders);

            return NextResponse.json(
                {
                    success: true,
                    message: "فایل اکسل با موفقیت وارد شد.",
                    importedCount: imported.length,
                    skippedCount,
                },
                { status: 200 }
            );
        }

        // ── Create Order ──
        const required =
            data.volume !== undefined &&
            data.fullName &&
            data.contactInfo &&
            data.price !== undefined;

        if (!required) {
            return NextResponse.json(
                { success: false, message: "اطلاعات ضروری (حجم، نام، راه ارتباطی و مبلغ) ناقص است." },
                { status: 400 }
            );
        }

        const receipt = normalizeReceipt(data.receipt);

        const newOrder: VpnOrder = {
            id: `CN-${Date.now().toString().slice(-6)}`,
            type: String(data.type || "vpn").trim(),
            volume: Number(data.volume),
            fullName: String(data.fullName).trim(),
            contactInfo: String(data.contactInfo).trim(),
            price: Number(data.price),
            status: receipt ? "processing" : "processing",
            receipt,
            createdAt: new Date().toISOString(),
        };

        orders.push(newOrder);
        await writeOrders(orders);

        return NextResponse.json(
            {
                success: true,
                orderId: newOrder.id,
                message: "سفارش با موفقیت ثبت شد.",
                supportLink: "https://t.me/support_GetPremium",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error saving VPN order:", error);
        return NextResponse.json(
            { success: false, message: "خطا در ثبت سفارش در سرور" },
            { status: 500 }
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
                { status: 400 }
            );
        }

        const orders = await readOrders();
        const filtered = orders.filter((order) => order.id !== id);

        if (filtered.length === orders.length) {
            return NextResponse.json(
                { success: false, message: "سفارشی با این شناسه یافت نشد." },
                { status: 404 }
            );
        }

        await writeOrders(filtered);

        return NextResponse.json(
            { success: true, message: "سفارش با موفقیت حذف شد." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting order:", error);
        return NextResponse.json(
            { success: false, message: "خطا در حذف سفارش از سرور" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, status } = await req.json();

        const validStatuses: OrderStatus[] = ["processing", "completed"];
        if (!id || !status || !validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, message: "اطلاعات نامعتبر است." },
                { status: 400 }
            );
        }

        const orders = await readOrders();
        const idx = orders.findIndex((o) => o.id === id);

        if (idx === -1) {
            return NextResponse.json(
                { success: false, message: "سفارشی با این شناسه یافت نشد." },
                { status: 404 }
            );
        }

        orders[idx].status = status;
        await writeOrders(orders);

        return NextResponse.json(
            { success: true, message: "وضعیت سفارش بروزرسانی شد." },
            { status: 200 }
        );
    } catch (error) {
        console.error("PATCH error:", error);
        return NextResponse.json(
            { success: false, message: "خطا در سرور" },
            { status: 500 }
        );
    }
}