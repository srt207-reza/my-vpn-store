"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
    MapPin,
    User,
    Plus,
    CheckCircle2,
    ChevronRight,
    AlertCircle,
    Loader2,
    ShieldCheck,
    CreditCard,
    Edit2,
    Trash2,
    Star
} from "lucide-react";
import { useUpdateUserProfile, useUserProfile } from "@/services/useUser";
import { 
    useAddAddress, 
    useAddresses, 
    useUpdateAddress, 
    useDeleteAddress 
} from "@/services/useAddresses";

// === Types ===
interface UserProfile {
    name: string;
}

interface Address {
    id: number;
    address: string;
    postal_code: string;
    is_default: boolean;
    latitude?: number;
    longitude?: number;
}

// ==========================================
// کامپوننت کارت آدرس (برای مدیریت مستقل هوک هر آدرس)
// ==========================================
const AddressCard = ({
    addr,
    selectedAddressId,
    setSelectedAddressId,
    handleOpenEditForm,
    handleDeleteAddress,
    isDeletingAddress,
    deletingId
}: {
    addr: Address;
    selectedAddressId: number | null;
    setSelectedAddressId: (id: number) => void;
    handleOpenEditForm: (id: number, address: string, postalCode: string) => void;
    handleDeleteAddress: (id: number) => void;
    isDeletingAddress: boolean;
    deletingId: number | null;
}) => {
    // هوک آپدیت اختصاصی برای همین آدرس جهت تنظیم به عنوان پیش‌فرض
    const { mutate: setAsDefault, isPending: isSettingDefault } = useUpdateAddress(addr.id);

    const handleMakeDefault = (e: React.MouseEvent) => {
        e.stopPropagation(); // جلوگیری از انتخاب شدن آدرس هنگام کلیک روی دکمه
        setAsDefault(
            {
                address: addr.address,
                postal_code: addr.postal_code,
                is_default: true,
            },
            {
                onSuccess: () => toast.success("آدرس پیش‌فرض با موفقیت تغییر کرد"),
                onError: () => toast.error("خطا در تغییر آدرس پیش‌فرض"),
            }
        );
    };

    return (
        <div
            onClick={() => setSelectedAddressId(addr.id)}
            className={`relative flex flex-col sm:flex-row justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedAddressId === addr.id
                    ? "border-salona-500 bg-salona-50/30"
                    : "border-gray-100 hover:border-salona-200"
            }`}
        >
            <div className="flex-1 pr-10">
                {selectedAddressId === addr.id && (
                    <CheckCircle2 className="absolute top-5 right-4 w-6 h-6 text-salona-500" />
                )}
                
                {/* نشانگر آدرس پیش‌فرض */}
                <div className="mb-2">
                    {addr.is_default ? (
                        <span className="inline-flex items-center gap-1 bg-salona-100 text-salona-600 px-2.5 py-1 rounded-lg text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            آدرس پیش‌فرض
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleMakeDefault}
                            disabled={isSettingDefault}
                            className="inline-flex cursor-pointer items-center gap-1 text-xs text-gray-500 hover:text-salona-600 hover:bg-salona-50 px-2.5 py-1 rounded-lg transition-colors border border-gray-200 hover:border-salona-300 disabled:opacity-50"
                        >
                            {isSettingDefault ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                "تنظیم به عنوان پیش‌فرض"
                            )}
                        </button>
                    )}
                </div>

                <p className="text-gray-800 leading-loose font-medium">{addr.address}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-lg">
                        کد پستی: {addr.postal_code}
                    </span>
                </div>
            </div>
            
            {/* اکشن‌های ویرایش و حذف */}
            <div className="flex sm:flex-col justify-end gap-2 mt-4 sm:mt-0 sm:mr-4 border-t sm:border-t-0 sm:border-r border-gray-100 pt-4 sm:pt-0 sm:pr-4">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditForm(addr.id, addr.address, addr.postal_code);
                    }}
                    className="p-2 cursor-pointer text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
                    title="ویرایش آدرس"
                >
                    <Edit2 className="w-5 h-5" />
                </button>
                <button
                    type="button"
                    disabled={isDeletingAddress && deletingId === addr.id}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(addr.id);
                    }}
                    className="p-2 cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                    title="حذف آدرس"
                >
                    {isDeletingAddress && deletingId === addr.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                    ) : (
                        <Trash2 className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
};

// ==========================================
// کامپوننت اصلی صفحه
// ==========================================
export default function CheckoutPage() {
    // === Redux State ===
    const { totalAmount, totalQuantity, items } = useSelector((state: RootState) => state.cart);

    // === React Query Hooks ===
    const { data: profileData, isLoading: isProfileLoading } = useUserProfile();
    const userProfile: UserProfile | null = (profileData as any)?.user || null;
    const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateUserProfile();

    // Hooks مربوط به آدرس
    const { data: addressesData, isLoading: isAddressesLoading } = useAddresses();
    const { mutate: addAddress, isPending: isAddingAddress } = useAddAddress();
    const { mutate: deleteAddress, isPending: isDeletingAddress } = useDeleteAddress();
    
    // === Local States ===
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // استیت‌های فرم نام گیرنده
    const [recipientName, setRecipientName] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);

    // استیت‌های یکپارچه برای فرم آدرس (افزودن و ویرایش)
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
    const [addressForm, setAddressForm] = useState({
        address: "",
        postal_code: "",
    });

    // Hook ویرایش آدرس برای فرم (استفاده مجزا از فرم)
    const { mutate: updateAddress, isPending: isUpdatingAddress } = useUpdateAddress(editingAddressId || 0);

    // === Effects ===
    useEffect(() => {
        if (userProfile?.name) {
            setRecipientName(userProfile.name);
        } else if (!isProfileLoading) {
            setIsEditingName(true);
        }
    }, [userProfile, isProfileLoading]);

    // انتخاب خودکار آدرس پیش‌فرض برای صورتحساب
    useEffect(() => {
        if (addressesData?.addresses && addressesData.addresses.length > 0) {
            const defaultAddress = addressesData.addresses.find((a: Address) => a.is_default);
            // اگر کاربر به صورت دستی آدرسی انتخاب نکرده بود، آدرس پیش‌فرض را انتخاب کن
            if (!selectedAddressId) {
                setSelectedAddressId(defaultAddress ? defaultAddress.id : addressesData.addresses[0].id);
            }
        }
    }, [addressesData, selectedAddressId]);

    // === Handlers ===
    const handleSaveName = () => {
        if (!recipientName.trim()) {
            toast.error("لطفاً نام خود را وارد کنید");
            return;
        }
        updateProfile(
            { name: recipientName },
            {
                onSuccess: () => {
                    setIsEditingName(false);
                    toast.success("نام گیرنده با موفقیت ثبت شد");
                },
                onError: () => toast.error("خطا در ثبت نام گیرنده"),
            }
        );
    };

    const handleOpenAddForm = () => {
        setEditingAddressId(null);
        setAddressForm({ address: "", postal_code: "" });
        setIsAddressFormOpen(true);
    };

    const handleOpenEditForm = (addressId: number, currentAddress: string, currentPostalCode: string) => {
        setEditingAddressId(addressId);
        setAddressForm({ address: currentAddress, postal_code: currentPostalCode });
        setIsAddressFormOpen(true);
    };

    const handleCloseAddressForm = () => {
        setIsAddressFormOpen(false);
        setEditingAddressId(null);
        setAddressForm({ address: "", postal_code: "" });
    };

    const handleAddressSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!addressForm.address || !addressForm.postal_code) {
            toast.error("لطفاً تمامی فیلدها را پر کنید");
            return;
        }

        if (editingAddressId) {
            updateAddress(
                {
                    address: addressForm.address,
                    postal_code: addressForm.postal_code,
                    // حفظ وضعیت پیش‌فرض قبلی هنگام ویرایش متن
                    is_default: addressesData?.addresses?.find((a: Address) => a.id === editingAddressId)?.is_default || false
                },
                {
                    onSuccess: () => {
                        toast.success("آدرس با موفقیت ویرایش شد");
                        handleCloseAddressForm();
                    },
                    onError: () => toast.error("خطا در ویرایش آدرس"),
                }
            );
        } else {
            addAddress(
                {
                    address: addressForm.address,
                    postal_code: addressForm.postal_code,
                    latitude: 0,
                    longitude: 0,
                    // اگر اولین آدرس است، خودکار پیش‌فرض شود
                    is_default: (addressesData?.addresses?.length || 0) === 0,
                },
                {
                    onSuccess: () => {
                        toast.success("آدرس جدید با موفقیت ثبت شد");
                        handleCloseAddressForm();
                    },
                    onError: () => toast.error("خطا در ثبت آدرس جدید"),
                }
            );
        }
    };

    const handleDeleteAddress = (addressId: number) => {
        setDeletingId(addressId);
        deleteAddress(addressId, {
            onSuccess: () => {
                toast.success("آدرس با موفقیت حذف شد");
                if (selectedAddressId === addressId) {
                    setSelectedAddressId(null);
                }
                setDeletingId(null);
            },
            onError: () => {
                toast.error("خطا در حذف آدرس");
                setDeletingId(null);
            },
        });
    };

    // === Constants ===
    const canAddNewAddress = (addressesData?.addresses?.length || 0) < 3;
    const isReadyToPay = selectedAddressId !== null && userProfile?.name;
    const isFormLoading = isAddingAddress || isUpdatingAddress;

    // === Render Blocks ===
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
                <h2 className="text-xl font-bold">سبد خرید شما خالی است</h2>
                <Link href="/" className="mt-4 text-salona-500 font-medium hover:underline">
                    بازگشت به فروشگاه
                </Link>
            </div>
        );
    }

    if (isProfileLoading || isAddressesLoading) {
        return (
            <div className="flex justify-center py-32">
                <Loader2 className="w-10 h-10 animate-spin text-salona-500" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* هدر صفحه */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">تکمیل اطلاعات سفارش</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* ستون راست: اطلاعات فرم‌ها */}
                <div className="lg:col-span-8 space-y-6">
                    {/* بخش ۱: نام گیرنده */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-salona-50 p-3 rounded-full text-salona-500">
                                <User className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">مشخصات تحویل‌گیرنده</h2>
                        </div>

                        {isEditingName ? (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                    placeholder="نام و نام‌خانوادگی خود را وارد کنید"
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-salona-500 focus:ring-1 focus:ring-salona-500"
                                />
                                <button
                                    onClick={handleSaveName}
                                    disabled={!recipientName.trim() || isUpdatingProfile}
                                    className="bg-salona-500 cursor-pointer hover:bg-salona-600 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex justify-center items-center min-w-[120px]"
                                >
                                    {isUpdatingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : "ثبت نام"}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 mb-1">نام گیرنده سفارش</span>
                                    <span className="font-bold text-gray-800 text-lg">{userProfile?.name}</span>
                                </div>
                                <button
                                    onClick={() => setIsEditingName(true)}
                                    className="text-salona-500 cursor-pointer font-medium text-sm px-4 py-2 hover:bg-salona-50 rounded-lg transition-colors"
                                >
                                    ویرایش
                                </button>
                            </div>
                        )}
                    </div>

                    {/* بخش ۲: آدرس‌ها */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-salona-50 p-3 rounded-full text-salona-500">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">آدرس تحویل سفارش</h2>
                            </div>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {addressesData?.addresses?.length || 0} از ۳ آدرس مجاز
                            </span>
                        </div>

                        {/* لیست آدرس‌های موجود */}
                        <div className="space-y-4 mb-6">
                            {addressesData?.addresses?.map((addr: Address) => (
                                <AddressCard
                                    key={addr.id}
                                    addr={addr}
                                    selectedAddressId={selectedAddressId}
                                    setSelectedAddressId={setSelectedAddressId}
                                    handleOpenEditForm={handleOpenEditForm}
                                    handleDeleteAddress={handleDeleteAddress}
                                    isDeletingAddress={isDeletingAddress}
                                    deletingId={deletingId}
                                />
                            ))}
                        </div>

                        {/* دکمه افزودن / فرم آدرس */}
                        {!isAddressFormOpen ? (
                            <button
                                onClick={handleOpenAddForm}
                                disabled={!canAddNewAddress}
                                className={`w-full cursor-pointer py-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 font-medium transition-colors ${
                                    canAddNewAddress
                                        ? "border-gray-300 text-gray-600 hover:border-salona-500 hover:text-salona-500"
                                        : "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                                }`}
                            >
                                {canAddNewAddress ? (
                                    <>
                                        <Plus className="w-5 h-5" /> ثبت آدرس جدید
                                    </>
                                ) : (
                                    "شما به سقف مجاز ثبت ۳ آدرس رسیده‌اید"
                                )}
                            </button>
                        ) : (
                            <form
                                onSubmit={handleAddressSubmit}
                                className="bg-gray-50 p-5 rounded-2xl border border-gray-200 animate-in fade-in slide-in-from-top-4"
                            >
                                <h3 className="font-bold text-gray-700 mb-4">
                                    {editingAddressId ? "ویرایش آدرس" : "ثبت آدرس جدید"}
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">متن آدرس کامل</label>
                                        <textarea
                                            value={addressForm.address}
                                            onChange={(e) =>
                                                setAddressForm({ ...addressForm, address: e.target.value })
                                            }
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 min-h-[100px] focus:outline-none focus:border-salona-500"
                                            placeholder="استان، شهر، خیابان، کوچه، پلاک..."
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">کد پستی (۱۰ رقمی)</label>
                                        <input
                                            type="text"
                                            value={addressForm.postal_code}
                                            onChange={(e) =>
                                                setAddressForm({ ...addressForm, postal_code: e.target.value })
                                            }
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-salona-500"
                                            placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰"
                                            required
                                            maxLength={10}
                                            pattern="\d{10}"
                                            title="کد پستی باید دقیقاً ۱۰ رقم باشد"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="submit"
                                            disabled={isFormLoading}
                                            className="bg-salona-500 cursor-pointer text-white px-6 py-2.5 rounded-xl font-medium hover:bg-salona-600 transition min-w-[120px] flex justify-center items-center"
                                        >
                                            {isFormLoading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : editingAddressId ? (
                                                "ثبت تغییرات"
                                            ) : (
                                                "ثبت آدرس"
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCloseAddressForm}
                                            disabled={isFormLoading}
                                            className="bg-gray-200 cursor-pointer text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-300 transition"
                                        >
                                            انصراف
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* ستون چپ: خلاصه سفارش و پرداخت */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] sticky top-24">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
                            صورت‌حساب
                        </h3>

                        <div className="space-y-4 mb-6 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>مبلغ کالاها ({totalQuantity})</span>
                                <span className="font-medium">{totalAmount.toLocaleString()} تومان</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>هزینه ارسال</span>
                                <span className="font-medium text-salona-500">رایگان</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end border-t border-gray-100 pt-6 mb-8">
                            <span className="text-gray-800 font-bold">قابل پرداخت</span>
                            <div className="text-left">
                                <div className="text-2xl font-black text-salona-500 tracking-tight">
                                    {totalAmount.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500">تومان</div>
                            </div>
                        </div>

                        {!userProfile?.name && (
                            <p className="text-xs text-red-500 mb-3 text-center bg-red-50 p-2 rounded-lg">
                                لطفاً ابتدا نام گیرنده را ثبت کنید
                            </p>
                        )}
                        {!selectedAddressId && userProfile?.name && (
                            <p className="text-xs text-red-500 mb-3 text-center bg-red-50 p-2 rounded-lg">
                                لطفاً یک آدرس برای تحویل انتخاب کنید
                            </p>
                        )}

                        <button
                            disabled={!isReadyToPay}
                            onClick={() => {
                                if (isReadyToPay) toast.success("در حال انتقال به درگاه پرداخت...");
                            }}
                            className="w-full cursor-pointer bg-salona-500 hover:bg-salona-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white h-14 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-salona-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <CreditCard className="w-6 h-6" />
                            پرداخت و ثبت نهایی
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            انتقال به درگاه امن بانکی
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
