import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// مسیر فایل دیتابیس محلی (JSON)
const dataFilePath = path.join(process.cwd(), "orders.json");

// ساختار داده‌ای یک سفارش با توجه به فیلدهای فرانت‌اند
interface SpotifyOrder {
    id: string;
    spotifyEmail: string; // ۱. آدرس ایمیل
    password?: string; // ۲. کلمه عبور (اختیاری)
    fullNameEn: string; // ۳. نام و نام خانوادگی (به انگلیسی)
    dateOfBirth: string; // ۴. تاریخ تولد
    planType: "individual" | "family";
    durationMonths: number;
    price: number;
    status: "pending_payment" | "awaiting_receipt" | "processing" | "completed";
    createdAt: string;
}

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // اعتبارسنجی اولیه: بررسی وجود فیلدهای ضروری (شماره تماس/تلگرام حذف شد)
        if (!data.planType || !data.spotifyEmail || !data.fullNameEn || !data.dateOfBirth) {
            return NextResponse.json(
                { success: false, message: "اطلاعات ضروری (نوع پلن، ایمیل، نام و تاریخ تولد) ناقص است." },
                { status: 400 },
            );
        }

        // بررسی وجود فایل، اگر نبود ایجادش می‌کنیم
        let orders: SpotifyOrder[] = [];
        try {
            const fileData = await fs.readFile(dataFilePath, "utf-8");
            orders = JSON.parse(fileData);
        } catch (error) {
            // فایل وجود ندارد، با آرایه خالی شروع می‌کنیم
            orders = [];
        }

        console.log(data);

        // ساخت آبجکت سفارش جدید
        const newOrder: SpotifyOrder = {
            id: `SPT-${Date.now().toString().slice(-6)}`,
            spotifyEmail: data.spotifyEmail,
            password: data.password || "", // درصورتی که ارسال نشده باشد خالی می‌ماند
            fullNameEn: data.fullNameEn,
            dateOfBirth: data.dateOfBirth,
            planType: data.planType,
            durationMonths: data.durationMonths || 1,
            price: data.price || 0,
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
                supportLink: "https://t.me/getSpotify_Support", // همگام شده با فرانت‌اند
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error saving spotify order:", error);
        return NextResponse.json({ success: false, message: "خطا در ثبت سفارش اسپاتیفای در سرور" }, { status: 500 });
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
        let orders: SpotifyOrder[] = JSON.parse(fileData);

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
        console.error("Error deleting spotify order:", error);
        return NextResponse.json({ success: false, message: "خطا در حذف سفارش از سرور" }, { status: 500 });
    }
}
