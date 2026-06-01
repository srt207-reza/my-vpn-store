// لیست حجم‌های مجاز از ۲ تا ۲۰ گیگابایت به صورت پیوسته
export const ALLOWED_VOLUMES = [10,20,30,40,50];
// مپینگ دقیق قیمت‌ها بر اساس تصاویر ارسالی (تمامی اعداد ضرب در ۱۰۰۰ شده‌اند تا به تومان تبدیل شوند)

export const PRICING_DATA: Record<number, { original?: number; price: number }> = {
    10: { price: 250_000 },
    20: { original: 500_000, price: 450_000 },
    30: { original: 750_000, price: 600_000 },
    40: { original: 1_000_000, price: 700_000 },
    50: { original: 1_250_000, price: 750_000 },
};