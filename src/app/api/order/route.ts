import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// مسیر فایل دیتابیس محلی (JSON)
const dataFilePath = path.join(process.cwd(), "orders.json");

// ساختار داده‌ای یک سفارش بر اساس فرم VPN
interface VpnOrder {
    id: string;
    type: string;
    volume: number; // حجم به گیگابایت
    fullName: string; // نام و نام خانوادگی
    contactInfo: string; // شماره موبایل یا آیدی تلگرام
    price: number; // مبلغ نهایی
    status: "pending_payment" | "awaiting_receipt" | "processing" | "completed";
    createdAt: string;
}

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // اعتبارسنجی اولیه: بررسی وجود فیلدهای ضروری برای VPN
        if (!data.volume || !data.fullName || !data.contactInfo || !data.price) {
            return NextResponse.json(
                { success: false, message: "اطلاعات ضروری (حجم، نام، راه ارتباطی و مبلغ) ناقص است." },
                { status: 400 },
            );
        }

        // بررسی وجود فایل، اگر نبود ایجادش می‌کنیم
        let orders: VpnOrder[] = [];
        try {
            const fileData = await fs.readFile(dataFilePath, "utf-8");
            orders = JSON.parse(fileData);
        } catch (error) {
            // فایل وجود ندارد، با آرایه خالی شروع می‌کنیم
            orders = [];
        }

        // ساخت آبجکت سفارش جدید (GP مخفف GetPremium)
        const newOrder: VpnOrder = {
            id: `GP-${Date.now().toString().slice(-6)}`,
            type: data.type || "vpn",
            volume: data.volume,
            fullName: data.fullName,
            contactInfo: data.contactInfo,
            price: data.price,
            status: "pending_payment",
            createdAt: new Date().toISOString(),
        };

        // اضافه کردن به لیست سفارشات و ذخیره در فایل
        orders.push(newOrder);
        await fs.writeFile(dataFilePath, JSON.stringify(orders, null, 2), "utf-8");

        return NextResponse.json(
            {
                success: true,
                orderId: newOrder.id,
                message: "سفارش با موفقیت ثبت شد. لطفاً رسید پرداخت را به پشتیبانی تلگرام ارسال کنید.",
                supportLink: "https://t.me/support_GetPremium", // هماهنگ شده با فرانت‌اند
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error saving VPN order:", error);
        return NextResponse.json({ success: false, message: "خطا در ثبت سفارش در سرور" }, { status: 500 });
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

        // خواندن داده‌های فعلی
        const fileData = await fs.readFile(dataFilePath, "utf-8");
        let orders: VpnOrder[] = JSON.parse(fileData);

        // بررسی وجود سفارش و حذف آن
        const initialLength = orders.length;
        orders = orders.filter((order) => order.id !== id);

        if (orders.length === initialLength) {
            return NextResponse.json({ success: false, message: "سفارشی با این شناسه یافت نشد." }, { status: 404 });
        }

        // ذخیره مجدد لیست به‌روزرسانی شده در فایل
        await fs.writeFile(dataFilePath, JSON.stringify(orders, null, 2), "utf-8");

        return NextResponse.json({ success: true, message: "سفارش با موفقیت حذف شد." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting order:", error);
        return NextResponse.json({ success: false, message: "خطا در حذف سفارش از سرور" }, { status: 500 });
    }
}
