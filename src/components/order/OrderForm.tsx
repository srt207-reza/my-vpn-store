"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import StepVolumeSelection from "./steps/StepVolumeSelection";
import StepContactInfo from "./steps/StepContactInfo";
import StepCheckout from "./steps/StepCheckout";
import StepPayment from "./steps/StepPayment";
import { ALLOWED_VOLUMES, PRICING_DATA } from "@/constants/order";

type ReceiptPayload = {
    payerName: string;
    trackingCode: string;
    sourceBank: string;
};

type DiscountType = "percent" | "fixed";

type DiscountCode = {
    code: string;
    type: DiscountType;
    value: number;
    active: boolean;
    maxUses?: number;
    usedCount: number;
    minOrderAmount?: number;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
};

function normalizeCouponCode(value: string) {
    return value.trim().replace(/\s+/g, "").toUpperCase();
}

function isExpired(expiresAt?: string): boolean {
    if (!expiresAt) return false;
    const date = new Date(expiresAt);
    return Number.isNaN(date.getTime()) ? false : date.getTime() < Date.now();
}

function calculateDiscount(price: number, code: DiscountCode) {
    let discountAmount = 0;

    if (code.type === "percent") {
        discountAmount = Math.floor((price * code.value) / 100);
    } else {
        discountAmount = Math.floor(code.value);
    }

    discountAmount = Math.max(0, Math.min(discountAmount, price));

    return {
        discountAmount,
        finalPrice: Math.max(0, price - discountAmount),
    };
}

export default function OrderForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const productType = searchParams.get("product") || "vpn";

    const urlVolumeParam = parseInt(searchParams.get("volume") || "0", 10);
    const initialVolume = ALLOWED_VOLUMES.includes(urlVolumeParam) ? urlVolumeParam : ALLOWED_VOLUMES[0];

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [supportLink] = useState("https://t.me/GetPremium_support");

    const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCouponCode, setAppliedCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [payablePrice, setPayablePrice] = useState(0);
    const [couponApplying, setCouponApplying] = useState(false);

    const [formData, setFormData] = useState({
        volume: initialVolume,
        fullName: "",
        contactInfo: "",
    });

    const currentPricing = PRICING_DATA[formData.volume];
    const totalPrice = currentPricing.price;

    const themeBg = "bg-primary hover:bg-cyan-400 text-slate-900";
    const themeColor = "text-primary";

    useEffect(() => {
        const loadDiscountCodes = async () => {
            try {
                const res = await fetch("/api/discount-code");
                const data = await res.json();

                if (data.success) {
                    setDiscountCodes(Array.isArray(data.codes) ? data.codes : []);
                }
            } catch {
                // بی‌صدا رد می‌شود؛ کد تخفیف فقط یک قابلیت افزوده است
            }
        };

        loadDiscountCodes();
    }, []);

    useEffect(() => {
        setCouponCode("");
        setAppliedCouponCode("");
        setCouponDiscount(0);
        setPayablePrice(currentPricing?.price || 0);
    }, [currentPricing?.price]);

    const isValidEmail = (email: string) => {
        const value = email.trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    };

    const isValidFullName = (name: string) => {
        const value = name.trim().replace(/\s+/g, " ");
        return /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/.test(value);
    };

    const canProceedToNextStep =
        isValidEmail(formData.contactInfo) && isValidFullName(formData.fullName);

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const cleanedValue = rawValue.replace(/[^a-zA-Z\s]/g, "");

        setFormData((prev) => ({
            ...prev,
            fullName: cleanedValue,
        }));
    };

    const handleContactInfoNext = () => {
        const email = formData.contactInfo.trim();
        const fullName = formData.fullName.trim().replace(/\s+/g, " ");

        if (!isValidEmail(email)) {
            toast.error("لطفاً یک ایمیل معتبر وارد کنید.");
            return;
        }

        if (!isValidFullName(fullName)) {
            toast.error("نام و نام خانوادگی را کامل وارد کنید. مثال: Ali Hosseini");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            contactInfo: email,
            fullName,
        }));

        setStep(3);
    };

const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
        toast.error("کد تخفیف را وارد کنید.");
        return;
    }

    if (!totalPrice || totalPrice <= 0) {
        toast.error("ابتدا حجم مورد نظر را انتخاب کنید.");
        return;
    }

    setCouponApplying(true);
    try {
        const normalizedCode = normalizeCouponCode(couponCode);

        const res = await fetch("/api/discount-code", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            toast.error(data.message || "خطا در دریافت کدهای تخفیف");
            return;
        }

        const codes: DiscountCode[] = Array.isArray(data.codes) ? data.codes : [];
        const matched = codes.find((item) => normalizeCouponCode(item.code) === normalizedCode);

        if (!matched) {
            setAppliedCouponCode("");
            setCouponDiscount(0);
            setPayablePrice(totalPrice);
            toast.error("کد تخفیف معتبر نیست.");
            return;
        }

        if (!matched.active) {
            setAppliedCouponCode("");
            setCouponDiscount(0);
            setPayablePrice(totalPrice);
            toast.error("این کد تخفیف غیرفعال است.");
            return;
        }

        if (isExpired(matched.expiresAt)) {
            setAppliedCouponCode("");
            setCouponDiscount(0);
            setPayablePrice(totalPrice);
            toast.error("این کد تخفیف منقضی شده است.");
            return;
        }

        if (typeof matched.maxUses === "number" && matched.usedCount >= matched.maxUses) {
            setAppliedCouponCode("");
            setCouponDiscount(0);
            setPayablePrice(totalPrice);
            toast.error("این کد تخفیف دیگر قابل استفاده نیست.");
            return;
        }

        if (typeof matched.minOrderAmount === "number" && totalPrice < matched.minOrderAmount) {
            setAppliedCouponCode("");
            setCouponDiscount(0);
            setPayablePrice(totalPrice);
            toast.error("مبلغ سفارش برای این کد تخفیف کافی نیست.");
            return;
        }

        const result = calculateDiscount(totalPrice, matched);

        setAppliedCouponCode(normalizedCode);
        setCouponDiscount(result.discountAmount);
        setPayablePrice(result.finalPrice);

        toast.success("کد تخفیف اعمال شد.");
    } catch {
        toast.error("ارتباط با سرور برقرار نشد.");
    } finally {
        setCouponApplying(false);
    }
};

    const handleContinueToPayment = () => {
        setStep(4);
    };

    const handleCreateOrder = async (receiptData: ReceiptPayload) => {
        setLoading(true);

        try {
            const res = await fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: totalPrice,
                    couponCode: appliedCouponCode,
                    type: productType,
                    receipt: receiptData,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setOrderId(data.orderId);
                toast.success("سفارش شما با موفقیت ثبت شد.");
            } else {
                throw new Error(data.message || "خطا در ثبت اطلاعات");
            }
        } catch (error: any) {
            toast.error(error.message || "ارتباط با سرور برقرار نشد.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full">
            <div className="text-center mb-10">
                {step !== 4 && (
                    <>
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-800/50 border border-slate-700 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                            <ShieldCheck className={`w-10 h-10 ${themeColor}`} />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">خرید ترافیک و اتصال پرسرعت</h1>
                    </>
                )}

                {step < 4 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="flex items-center">
                                <div
                                    onClick={() => (num === 1 && step > 1 ? setStep(1) : undefined)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all 
                                        ${step >= num ? "bg-primary text-slate-900" : "bg-slate-800 text-slate-400"} 
                                        ${
                                            num === 1 && step > 1
                                                ? "cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-offset-slate-900 hover:ring-primary"
                                                : ""
                                        }`}
                                >
                                    {num}
                                </div>

                                {num < 3 && (
                                    <div
                                        className={`w-12 h-1 transition-colors ${step > num ? "bg-primary" : "bg-slate-800"}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <StepVolumeSelection
                        formData={formData}
                        setFormData={setFormData}
                        setStep={setStep}
                        router={router}
                        totalPrice={totalPrice}
                        themeBg={themeBg}
                        themeColor={themeColor}
                    />
                )}

                {step === 2 && (
                    <StepContactInfo
                        formData={formData}
                        setFormData={setFormData}
                        handleNameChange={handleNameChange}
                        onNext={handleContactInfoNext}
                        setStep={setStep}
                        themeBg={themeBg}
                        isValidEmail={isValidEmail}
                        isValidFullName={isValidFullName}
                        canProceedToNextStep={canProceedToNextStep}
                    />
                )}

                {step === 3 && (
                    <StepCheckout
                        formData={formData}
                        totalPrice={totalPrice}
                        payablePrice={payablePrice || totalPrice}
                        couponCode={couponCode}
                        couponDiscount={couponDiscount}
                        couponApplying={couponApplying}
                        onCouponChange={(value: string) => {
                            setCouponCode(value);

                            const normalized = normalizeCouponCode(value);
                            if (appliedCouponCode && normalized !== appliedCouponCode) {
                                setAppliedCouponCode("");
                                setCouponDiscount(0);
                                setPayablePrice(totalPrice);
                            }
                        }}
                        onApplyCoupon={handleApplyCoupon}
                        setStep={setStep}
                        handleSubmit={handleContinueToPayment}
                        loading={false}
                        themeBg={themeBg}
                        themeColor={themeColor}
                    />
                )}

                {step === 4 && (
                    <StepPayment
                        orderId={orderId}
                        totalPrice={payablePrice || totalPrice}
                        supportLink={supportLink}
                        themeColor={themeColor}
                        loading={loading}
                        onBack={() => setStep(3)}
                        onConfirmReceipt={handleCreateOrder}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}