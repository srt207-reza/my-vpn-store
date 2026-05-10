// لیست حجم‌های مجاز از ۲ تا ۲۰ گیگابایت به صورت پیوسته
export const ALLOWED_VOLUMES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
// مپینگ دقیق قیمت‌ها بر اساس تصاویر ارسالی (تمامی اعداد ضرب در ۱۰۰۰ شده‌اند تا به تومان تبدیل شوند)

export const PRICING_DATA: Record<number, { original?: number; price: number }> = {
    2: { price: 598000 },
    3: { price: 897000 },
    4: { price: 1196000 },
    5: { original: 1500000, price: 1245000 },
    6: { original: 1800000, price: 1494000 },
    7: { original: 2100000, price: 1743000 },
    8: { original: 2400000, price: 1992000 },
    9: { original: 2700000, price: 2241000 },
    10: { original: 3000000, price: 1990000 },
    11: { original: 3300000, price: 2189000 },
    12: { original: 3600000, price: 2388000 },
    13: { original: 3900000, price: 2587000 },
    14: { original: 4200000, price: 2786000 },
    15: { original: 4500000, price: 2985000 },
    16: { original: 4800000, price: 3184000 },
    17: { original: 5100000, price: 3383000 },
    18: { original: 5400000, price: 3582000 },
    19: { original: 5700000, price: 3781000 },
    20: { original: 6000000, price: 3980000 },
};