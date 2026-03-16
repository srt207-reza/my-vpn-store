"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { OTPInput } from "input-otp";
import toast from "react-hot-toast";
import { Smartphone, ShieldCheck, Loader2, UserPlus, LogIn, ArrowLeft } from "lucide-react";
import { AxiosError, isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { setAuthCookie } from "@/app/actions";
import { useLoginOtp, useRegister, useVerifyLogin } from "@/services/useAuth";

type Step = "PHONE" | "OTP";
type AuthMode = "LOGIN" | "REGISTER";

interface PhoneFormValues {
    phoneNumber: string;
}

const getErrorMessage = (error: unknown): string => {
    if (isAxiosError(error)) {
        return (
            error.response?.data?.message ||
            error.response?.data?.detail ||
            error.response?.data?.error ||
            "خطایی در ارتباط با سرور رخ داد"
        );
    }
    return "خطای ناشناخته‌ای رخ داده است";
};

export default function AuthForm() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("PHONE");
    const [mode, setMode] = useState<AuthMode>("LOGIN");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [countdown, setCountdown] = useState(120);

    const { mutate: loginOtp, isPending: isLoginPending } = useLoginOtp();
    const { mutate: registerUser, isPending: isRegisterPending } = useRegister();
    const { mutate: verifyOtp, isPending: isVerifyPending } = useVerifyLogin();

    const {
        register,
        handleSubmit,
    } = useForm<PhoneFormValues>();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === "OTP" && countdown > 0) {
            timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [step, countdown]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const onPhoneSubmit = (data: PhoneFormValues) => {
        const phone = data.phoneNumber;

        if (!/^09\d{9}$/.test(phone)) {
            toast.error("شماره موبایل معتبر نیست. مثال: 09123456789");
            return;
        }

        setPhoneNumber(phone);

        if (mode === "LOGIN") {
            loginOtp(phone, {
                onSuccess: () => {
                    toast.success("کد تایید برای شما ارسال شد");
                    setStep("OTP");
                    setCountdown(120);
                },
                onError: (error: AxiosError) => {
                    toast.error(getErrorMessage(error));
                },
            });
        } else {
            registerUser(phone, {
                onSuccess: () => {
                    toast.success("کد تایید ثبت‌نام ارسال شد");
                    setStep("OTP");
                    setCountdown(120);
                },
                onError: (error: AxiosError) => {
                    toast.error(getErrorMessage(error));
                },
            });
        }
    };

    const onOtpSubmit = () => {
        // تغییر طول اعتبارسنجی از ۵ به ۶
        if (otpCode.length !== 6) {
            toast.error("لطفا کد تایید ۶ رقمی را به صورت کامل وارد کنید");
            return;
        }

        verifyOtp(
            { phone_number: phoneNumber, otp_code: otpCode },
            {
                onSuccess: async (data) => {
                    try {
                        const token = data.token;

                        if (!token) throw new Error("توکنی از سمت سرور دریافت نشد");

                        await setAuthCookie(token);
                        localStorage.setItem('user',JSON.stringify(data))

                        toast.success(
                            mode === "REGISTER"
                                ? "ثبت‌نام شما با موفقیت انجام شد!"
                                : "خوش آمدید! ورود موفقیت‌آمیز بود.",
                        );

                        router.push("/");
                        router.refresh(); 
                    } catch (err) {
                        toast.error("خطا در ذخیره‌سازی اطلاعات ورود");
                        console.error(err);
                    }
                },
                onError: (error) => {
                    toast.error(getErrorMessage(error));
                    setOtpCode("");
                },
            },
        );
    };

    const isLoading = isLoginPending || isRegisterPending || isVerifyPending;

    return (
        <div className="w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-salona-100">
            <div className="text-center mb-8">
                <motion.div
                    key={mode}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-inner transition-colors duration-300
                        ${mode === "REGISTER" ? "bg-emerald-50 text-emerald-500" : "bg-salona-50 text-salona-500"}`}
                >
                    {step === "OTP" ? (
                        <ShieldCheck className="w-8 h-8" />
                    ) : mode === "REGISTER" ? (
                        <UserPlus className="w-8 h-8" />
                    ) : (
                        <LogIn className="w-8 h-8" />
                    )}
                </motion.div>

                <h2 className="text-2xl font-bold text-gray-800 font-vazir">
                    {step === "OTP"
                        ? "تایید شماره موبایل"
                        : mode === "REGISTER"
                          ? "عضویت در سالونا"
                          : "ورود به حساب کاربری"}
                </h2>
                <p className="text-sm text-gray-500 mt-2 font-vazir">
                    {step === "PHONE"
                        ? mode === "LOGIN"
                            ? "برای ورود، شماره موبایل خود را وارد کنید"
                            : "برای ایجاد حساب جدید، شماره خود را وارد کنید"
                        : "کد تایید پیامک شده را وارد کنید"}
                </p>
            </div>

            <AnimatePresence mode="wait">
                {step === "PHONE" && (
                    <motion.div
                        key="phone-step"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex p-1 mb-8 bg-gray-100/80 rounded-2xl">
                            <button
                                type="button"
                                onClick={() => setMode("LOGIN")}
                                className={`flex-1 cursor-pointer py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                                    mode === "LOGIN"
                                        ? "bg-white text-salona-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                ورود
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode("REGISTER")}
                                className={`flex-1 cursor-pointer py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                                    mode === "REGISTER"
                                        ? "bg-white text-emerald-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                ثبت‌نام
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onPhoneSubmit)} className="space-y-6">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2 font-vazir">
                                    شماره موبایل
                                </label>
                                <div className="relative flex items-center">
                                    <Smartphone className="absolute right-4 text-gray-400 w-5 h-5" />
                                    <input
                                        type="tel"
                                        dir="ltr"
                                        placeholder="0912 345 6789"
                                        className={`w-full bg-gray-50 border border-gray-200 text-gray-800 text-left rounded-2xl py-3.5 pl-4 pr-12 focus:ring-2 transition-all font-sans text-lg outline-none
                                            ${mode === "REGISTER" ? "focus:ring-emerald-500 focus:border-emerald-500" : "focus:ring-salona-500 focus:border-salona-500"}
                                        `}
                                        {...register("phoneNumber", { required: true })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full cursor-pointer flex items-center justify-center gap-2 text-white py-3.5 rounded-2xl font-medium transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed
                                    ${
                                        mode === "REGISTER"
                                            ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
                                            : "bg-salona-500 hover:bg-salona-600 shadow-salona-500/30"
                                    }
                                `}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : mode === "REGISTER" ? (
                                    "دریافت کد ثبت‌نام"
                                ) : (
                                    "دریافت کد ورود"
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === "OTP" && (
                    <motion.div
                        key="otp-step"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-full flex justify-between items-center mb-6">
                            <span className="text-sm font-medium text-gray-600 dir-ltr">{phoneNumber}</span>
                            <button
                                onClick={() => setStep("PHONE")}
                                className="text-xs text-salona-500 hover:text-salona-700 flex items-center gap-1"
                            >
                                ویرایش شماره <ArrowLeft className="w-3 h-3" />
                            </button>
                        </div>

                        <div className="mb-8" dir="ltr">
                            <OTPInput
                                maxLength={6} // تغییر طول ورودی از ۵ به ۶
                                value={otpCode}
                                onChange={setOtpCode}
                                render={({ slots }) => (
                                    <div className="flex gap-2 sm:gap-3 justify-center"> {/* اصلاح فاصله برای جاگیری بهتر ۶ رقم */}
                                        {slots.map((slot, idx) => (
                                            <div
                                                key={idx}
                                                className={`relative w-10 h-12 sm:w-12 sm:h-14 text-xl sm:text-2xl font-bold flex items-center justify-center rounded-xl border-2 transition-all duration-300
                                                    ${
                                                        slot.isActive
                                                            ? mode === "REGISTER"
                                                                ? "border-emerald-500 ring-4 ring-emerald-100 shadow-md"
                                                                : "border-salona-500 ring-4 ring-salona-100 shadow-md"
                                                            : "border-gray-200 bg-gray-50"
                                                    }
                                                    ${
                                                        slot.char
                                                            ? mode === "REGISTER"
                                                                ? "text-emerald-600 bg-emerald-50 border-emerald-300"
                                                                : "text-salona-600 bg-salona-50 border-salona-300"
                                                            : "text-gray-400"
                                                    }
                                                `}
                                            >
                                                {slot.char}
                                                {slot.isActive && (
                                                    <div
                                                        className={`absolute bottom-2 w-4 h-0.5 animate-pulse rounded-full ${mode === "REGISTER" ? "bg-emerald-500" : "bg-salona-500"}`}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />
                        </div>

                        <button
                            onClick={onOtpSubmit}
                            disabled={isLoading || otpCode.length !== 6} // تغییر غیرفعال شدن از ۵ به ۶
                            className={`w-full cursor-pointer flex items-center justify-center gap-2 text-white py-3.5 rounded-2xl font-medium transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed
                                ${
                                    mode === "REGISTER"
                                        ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
                                        : "bg-salona-500 hover:bg-salona-600 shadow-salona-500/30"
                                }
                            `}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {mode === "REGISTER" ? "تایید و تکمیل ثبت‌نام" : "تایید و ورود"}{" "}
                                    <ShieldCheck className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <div className="mt-6 text-center w-full">
                            {countdown > 0 ? (
                                <p className="text-sm text-gray-500 font-medium flex items-center justify-center gap-2">
                                    ارسال مجدد کد تا{" "}
                                    <span
                                        className={`font-bold tracking-widest ${mode === "REGISTER" ? "text-emerald-600" : "text-salona-600"}`}
                                    >
                                        {formatTime(countdown)}
                                    </span>
                                </p>
                            ) : (
                                <button
                                    onClick={() => onPhoneSubmit({ phoneNumber })}
                                    className={`text-sm font-bold transition-colors ${mode === "REGISTER" ? "text-emerald-500 hover:text-emerald-600" : "text-salona-500 hover:text-salona-600"}`}
                                    disabled={isLoading}
                                >
                                    ارسال مجدد کد تایید
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
