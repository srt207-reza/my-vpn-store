"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image";

import StepVolumeSelection from "./steps/StepVolumeSelection";
import StepContactInfo from "./steps/StepContactInfo";
import StepCheckout from "./steps/StepCheckout";
import StepPayment from "./steps/StepPayment";
import { ALLOWED_VOLUMES, ALLOWED_DURATIONS, PRICING_DATA } from "@/constants/order";

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

    const [formData, setFormData] = useState({
        volume: initialVolume,
        duration: ALLOWED_DURATIONS[0],
        fullName: "",
        contactInfo: "",
    });

    // قیمت بر اساس هر دو پارامتر حجم و مدت
    const totalPrice = PRICING_DATA[formData.volume][formData.duration];

    const themeBg = "bg-primary hover:bg-cyan-400 text-slate-900";
    const themeColor = "text-primary";

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

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: totalPrice,
                    type: productType,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setOrderId(data.orderId);
                setStep(4);
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

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const cleanedValue = rawValue.replace(/[^a-zA-Z\s]/g, "");
        setFormData((prev) => ({ ...prev, fullName: cleanedValue }));
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

        setFormData((prev) => ({ ...prev, contactInfo: email, fullName }));
        setStep(3);
    };

    return (
        <div className="max-w-3xl mx-auto w-full">
            <div className="text-center mb-10">
                {step < 4 && (
                    <div className="flex items-center justify-center gap-2 mb-2">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="flex items-center">
                                <div
                                    onClick={() => (num === 1 && step > 1 ? setStep(1) : undefined)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                        ${step >= num ? "bg-primary text-slate-900" : "bg-slate-800 text-slate-400"}
                                        ${num === 1 && step > 1 ? "cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-offset-slate-900 hover:ring-primary" : ""}`}
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
                {step === 1 ? (
                    <>
                        <div className="inline-flex my-6 items-center justify-center p-4 rounded-full bg-slate-800/50 border border-slate-700 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                            <Image
                                src="/assets/images/clock.png"
                                alt="support"
                                width={50}
                                height={50}
                                className={`${themeColor}`}
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">انتخاب طرح راهکار اتصال</h1>
                    </>
                ) : step === 2 ? (
                    <>
                        <div className="inline-flex my-6 items-center justify-center p-4 rounded-full bg-slate-800/50 border border-slate-700 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                            <Image
                                src="/assets/images/information2.png"
                                alt="support"
                                width={50}
                                height={50}
                                className={`${themeColor}`}
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">وارد نمودن اطلاعات </h1>
                    </>
                ) : step === 2 && (
                   <>
                        <div className="inline-flex my-6 items-center justify-center p-4 rounded-full bg-slate-800/50 border border-slate-700 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                            <Image
                                src="/assets/images/approved.png"
                                alt="support"
                                width={50}
                                height={50}
                                className={`${themeColor}`}
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">تأیید اطلاعات</h1>
                    </>
                )}

                {/* {step !== 4 && (
                    <>
                        <div className="inline-flex my-6 items-center justify-center p-4 rounded-full bg-slate-800/50 border border-slate-700 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                            <Image
                                src="/assets/images/clock.png"
                                alt="support"
                                width={50}
                                height={50}
                                className={`${themeColor}`}
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">انتخاب طرح راهکار اتصال</h1>
                    </>
                )} */}
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
                        setStep={setStep}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        themeBg={themeBg}
                        themeColor={themeColor}
                    />
                )}
                {step === 4 && (
                    <StepPayment
                        orderId={orderId}
                        totalPrice={totalPrice}
                        supportLink={supportLink}
                        themeColor={themeColor}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}