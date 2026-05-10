"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import StepVolumeSelection from "./steps/StepVolumeSelection";
import StepContactInfo from "./steps/StepContactInfo";
import StepCheckout from "./steps/StepCheckout";
import StepPayment from "./steps/StepPayment";
import { ALLOWED_VOLUMES, PRICING_DATA } from "@/constants/order";

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
        fullName: "",
        contactInfo: "",
    });

    const currentPricing = PRICING_DATA[formData.volume];
    const totalPrice = currentPricing.price;

    const themeBg = "bg-primary hover:bg-cyan-400 text-slate-900";
    const themeColor = "text-primary";

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
        const val = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(val)) {
            setFormData({ ...formData, fullName: val });
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
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <StepVolumeSelection
                        formData={formData}
                        setFormData={setFormData}
                        setStep={setStep}
                        router={router}
                        currentPricing={currentPricing}
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
                        setStep={setStep}
                        themeBg={themeBg}
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
