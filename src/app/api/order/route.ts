import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "orders.json");

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
    status: "pending_payment" | "awaiting_receipt" | "processing" | "completed";
    receipt?: Receipt;
    createdAt: string;
}

async function readOrders(): Promise<VpnOrder[]> {
    try {
        const fileData = await fs.readFile(dataFilePath, "utf-8");
        return JSON.parse(fileData);
    } catch {
        return [];
    }
}

async function writeOrders(orders: VpnOrder[]): Promise<void> {
    await fs.writeFile(dataFilePath, JSON.stringify(orders, null, 2), "utf-8");
}

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const isReceiptSubmission =
            data.orderId && data.payerName && data.trackingCode && data.sourceBank;

        if (isReceiptSubmission) {
            const orders = await readOrders();
            const idx = orders.findIndex((o) => o.id === data.orderId);

            if (idx === -1) {
                return NextResponse.json(
                    { success: false, message: "سفارشی با این شناسه یافت نشد." },
                    { status: 404 }
                );
            }

            orders[idx].receipt = {
                payerName: String(data.payerName).trim(),
                trackingCode: String(data.trackingCode).trim(),
                sourceBank: String(data.sourceBank).trim(),
                submittedAt: new Date().toISOString(),
            };
            orders[idx].status = "awaiting_receipt";

            await writeOrders(orders);

            return NextResponse.json(
                { success: true, message: "رسید پرداخت با موفقیت ثبت شد." },
                { status: 200 }
            );
        }

        if (!data.volume || !data.fullName || !data.contactInfo || !data.price) {
            return NextResponse.json(
                { success: false, message: "اطلاعات ضروری (حجم، نام، راه ارتباطی و مبلغ) ناقص است." },
                { status: 400 }
            );
        }

        const orders = await readOrders();

        const newOrder: VpnOrder = {
            id: `GP-${Date.now().toString().slice(-6)}`,
            type: data.type || "vpn",
            volume: Number(data.volume),
            fullName: String(data.fullName).trim(),
            contactInfo: String(data.contactInfo).trim(),
            price: Number(data.price),
            status: "pending_payment",
            createdAt: new Date().toISOString(),
        };

        orders.push(newOrder);
        await writeOrders(orders);

        return NextResponse.json(
            {
                success: true,
                orderId: newOrder.id,
                message: "سفارش با موفقیت ثبت شد. لطفاً رسید پرداخت را ارسال کنید.",
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

        const fileData = await fs.readFile(dataFilePath, "utf-8");
        let orders: VpnOrder[] = JSON.parse(fileData);

        const initialLength = orders.length;
        orders = orders.filter((order) => order.id !== id);

        if (orders.length === initialLength) {
            return NextResponse.json(
                { success: false, message: "سفارشی با این شناسه یافت نشد." },
                { status: 404 }
            );
        }

        await writeOrders(orders);

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

        const validStatuses = ["pending_payment", "awaiting_receipt", "processing", "completed"];
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