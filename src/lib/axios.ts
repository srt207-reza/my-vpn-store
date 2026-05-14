import axios from "axios";
import Swal from "sweetalert2";
// مسیر فایل سرور اکشن خود را به درستی در این قسمت جایگزین کنید

// پایه آدرس API های فروشگاه
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // اگر درخواست بیشتر از 10 ثانیه طول کشید قطع شود
    headers: {
        "Content-Type": "application/json",
    },
});

// جلوگیری از باز شدن چندین مودال به صورت همزمان در صورت خطای چند ریکوئست
let isAuthAlertShown = false;

// Interceptor برای اضافه کردن توکن به درخواست‌ها به صورت async
axiosInstance.interceptors.request.use(
    async (config) => {
        // فراخوانی سرور اکشن برای دریافت توکن 
        // از آنجایی که کوکی httpOnly است، فقط سرور می‌تواند آن را بخواند
        try {
            // const token = await getAuthCookie();

            // اگر توکن با موفقیت دریافت شد، به هدر اضافه می‌شود
            // if (token) {
            //     config.headers["x-access-tokens"] = token;
            // }
        } catch (error) {
            console.error("خطا در دریافت توکن از سرور اکشن:", error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Interceptor برای مدیریت خطاهای سراسری
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // ۱. مدیریت خطای ۴۰۱ (عدم دسترسی / توکن نامعتبر یا منقضی شده)
        if (error.response?.status === 401) {
            
            if (!isAuthAlertShown && typeof window !== "undefined" && !window.location.href.includes("login")) {
                isAuthAlertShown = true;

                Swal.fire({
                    title: "نیاز به ورود",
                    text: "برای دسترسی به این بخش لطفاً وارد حساب کاربری خود شوید.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "ورود / ثبت‌نام",
                    cancelButtonText: "انصراف",
                    confirmButtonColor: "#3b82f6",
                    cancelButtonColor: "#ef4444",
                    reverseButtons: true,
                    customClass: {
                        popup: "font-sans rounded-2xl", 
                    }
                }).then((result) => {
                    isAuthAlertShown = false;

                    if (result.isConfirmed) {
                        window.location.href = "/login"; 
                    }
                });
            }
        }

        // ۲. استخراج پیام خطای واقعی بک‌اند و جایگزینی با پیام عمومی Axios
        if (error.response && error.response.data) {
            const backendData = error.response.data;

            const backendMessage = backendData.message || backendData.detail || backendData.error || backendData.msg;

            if (backendMessage) {
                error.message = backendMessage;
            } else if (typeof backendData === "string") {
                error.message = backendData;
            }
        }

        // ۳. هدایت ارور به همراه پیام اصلاح‌شده به سمت کامپوننت یا هوک‌ها
        return Promise.reject(error);
    },
);
