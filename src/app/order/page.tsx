"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import OrderForm from "@/components/order/OrderForm";

export default function OrderPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center pb-10">
            <Suspense
                fallback={
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                }
            >
                <OrderForm />
            </Suspense>
        </div>
    );
}
