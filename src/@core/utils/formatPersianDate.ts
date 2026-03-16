const formatPersianDate = (dateString: string) => {
    if (!dateString) return "";

    // جدا کردن بخش تاریخ از ساعت: "1404-12-25"
    const [datePart] = dateString.split(" ");
    if (!datePart) return dateString;

    // جدا کردن سال، ماه و روز
    const [year, month, day] = datePart.split("-");

    const persianMonths = [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند",
    ];

    // پیدا کردن نام ماه (ایندکس آرایه از 0 شروع می‌شود پس یکی کم می‌کنیم)
    const monthName = persianMonths[parseInt(month, 10) - 1];

    // حذف صفر پشت روز (مثلا 05 بشود 5)
    const cleanDay = parseInt(day, 10);

    return `${cleanDay} ${monthName} ${year}`;
};

export default formatPersianDate;
