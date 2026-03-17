"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
    ShoppingCart,
    Heart,
    User,
    Menu,
    X,
    ChevronDown,
    MapPin,
    LogOut,
    MessageSquare,
    Package,
    LayoutGrid,
    Info,
    Home,
    Camera,
    Trash2,
    UploadCloud,
    Loader2,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useUserProfile } from "@/services/useUser";
import { removeAuthCookie } from "@/app/actions";
import Image from "next/image";
import LOGO from "@/../public/assets/images/logo/logo.png";

// توابع آپلود و حذف عکس که ایجاد کرده‌اید را از مسیر صحیح ایمپورت کنید
import { useUploadProfilePicture, useDeleteProfilePicture } from "@/services/useUser";

interface UserAddress {
    id: number;
    address: string;
    is_default: boolean;
    latitude: number;
    longitude: number;
    postal_code: string;
}

interface UserProfile {
    id: number;
    user_id: string;
    name: string | null;
    phone_number: string;
    active: boolean;
    confirmed: boolean;
    default_address: UserAddress | null;
    favorites_count: number;
    orders_count: number;
    wallet_balance: number;
    profile_picture?: string | null; // اضافه کردن فیلد عکس پروفایل
}

export const Header = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // استیت برای دراپ‌دون پروفایل
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // استیت و رفرنس برای مودال عکس پروفایل
    const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // استیت برای حل مشکل Hydration سبد خرید
    const [isMounted, setIsMounted] = useState(false);

    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
        return null;
    };

    const user = getUserFromStorage();

    const { data, isLoading: isUserLoading } = useUserProfile(!!user);

    //@ts-ignore
    const userData: UserProfile | null = data?.user || null;

    const cartItems = useSelector((state: any) => state.cart.items);
    const uniqueProductCount = cartItems?.length || 0;

    // فراخوانی هوک‌های عکس پروفایل (خطاهای احتمالی مسیر ایمپورت را برطرف کنید)
    // در صورتی که ایمپورت بالا را انجام داده‌اید، کامنت این دو خط را بردارید:
    const { mutate: uploadPicture, isPending: isUploading } = useUploadProfilePicture();
    const { mutate: deletePicture, isPending: isDeleting } = useDeleteProfilePicture();

    // مقادیر فرضی موقت در صورت عدم وجود ایمپورت برای جلوگیری از ارور (بعد از ایمپورت، این 4 خط را پاک کنید)
    // const uploadPicture = (file: File, options: any) => options?.onSuccess();
    // const deletePicture = (data: any, options: any) => options?.onSuccess();
    // const isUploading = false;
    // const isDeleting = false;
    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        if (isProfileDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isProfileDropdownOpen]);

    const handleLogout = async () => {
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);

        const result = await Swal.fire({
            title: "آیا مطمئن هستید؟",
            text: "می‌خواهید از حساب کاربری خود خارج شوید؟",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#9ca3af",
            confirmButtonText: "بله، خارج میشوم",
            cancelButtonText: "انصراف",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                await removeAuthCookie();
                queryClient.removeQueries({ queryKey: ["userProfile"] });
                localStorage.removeItem("user");
                router.refresh();
                router.push("/");
                Swal.fire({
                    title: "موفق",
                    text: "با موفقیت از حساب کاربری خارج شدید.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } catch (error) {
                Swal.fire({
                    title: "خطا",
                    text: "مشکلی در خروج از حساب پیش آمد. لطفا دوباره تلاش کنید.",
                    icon: "error",
                    confirmButtonText: "متوجه شدم",
                });
            }
        }
    };

    // هندلر تغییر فایل و آپلود
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadPicture(file, {
                onSuccess: () => {
                    setIsProfilePicModalOpen(false);
                    // رفرش کردن دیتای کاربر برای دریافت عکس جدید
                    queryClient.invalidateQueries({ queryKey: ["userProfile"] });
                },
            });
            // پاک کردن مقدار اینپوت برای اینکه انتخاب مجدد همان فایل ممکن باشد
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // هندلر حذف عکس
    const handleDeletePicture = () => {
        deletePicture(undefined, {
            onSuccess: () => {
                setIsProfilePicModalOpen(false);
                // رفرش کردن دیتای کاربر
                queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            },
        });
    };

    const displayName = userData?.name || userData?.phone_number;
    const isProfileSectionLoading = !isMounted || isUserLoading;

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md py-3`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        {/* بخش راست */}
                        <div className="flex items-center gap-8 lg:gap-12">
                            <div className="flex items-center gap-4">
                                <button
                                    className="lg:hidden text-gray-700 hover:text-primary transition"
                                    onClick={() => setIsMobileMenuOpen(true)}
                                    aria-label="باز کردن منو"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>
                                <Link href="/">
                                    <Image src={LOGO} className="w-30" alt="logo" />
                                </Link>
                            </div>

                            <nav className="hidden lg:flex items-center gap-6">
                                <Link
                                    href="/products"
                                    className="text-gray-600 hover:text-primary font-medium text-sm transition-colors relative group"
                                >
                                    محصولات
                                    <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                                <Link
                                    href="/categories"
                                    className="text-gray-600 hover:text-primary font-medium text-sm transition-colors relative group"
                                >
                                    دسته‌بندی‌ها
                                    <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                                <Link
                                    href="/about"
                                    className="text-gray-600 hover:text-primary font-medium text-sm transition-colors relative group"
                                >
                                    درباره ما
                                    <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            </nav>
                        </div>

                        {/* بخش چپ */}
                        <div className="flex items-center gap-3 sm:gap-5">
                            <Link
                                href="/profile/favorites"
                                className="text-gray-600 hover:text-primary transition hidden sm:block"
                            >
                                <Heart className="w-6 h-6" />
                            </Link>

                            <Link href="/cart" className="relative text-gray-600 hover:text-primary transition">
                                <ShoppingCart className="w-6 h-6" />
                                {isMounted && uniqueProductCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {uniqueProductCount}
                                    </span>
                                )}
                            </Link>

                            {/* پروفایل کاربر */}
                            <div className="relative" ref={dropdownRef}>
                                {isProfileSectionLoading ? (
                                    <div className="hidden sm:flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                        <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                    </div>
                                ) : userData ? (
                                    <div>
                                        <button
                                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                            className="hidden cursor-pointer sm:flex items-center gap-2 py-1.5 pl-2 pr-3 border border-gray-200 rounded-full hover:border-primary hover:bg-primary/5 transition-all focus:outline-none"
                                        >
                                            <div className="bg-primary/10 py-1.5 rounded-full text-primary overflow-hidden w-7 h-7 flex items-center justify-center">
                                                {userData.profile_picture ? (
                                                    <Image
                                                        src={userData.profile_picture}
                                                        alt="profile"
                                                        width={28}
                                                        height={28}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-4 h-4" />
                                                )}
                                            </div>
                                            <span className="font-medium text-sm text-gray-700 dir-ltr tracking-wide">
                                                {displayName}
                                            </span>
                                            <ChevronDown
                                                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180 text-primary" : ""}`}
                                            />
                                        </button>

                                        <button
                                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                            className="sm:hidden flex items-center justify-center bg-primary/10 text-primary p-2 rounded-full overflow-hidden w-9 h-9"
                                        >
                                            {userData.profile_picture ? (
                                                <Image
                                                    src={userData.profile_picture}
                                                    alt="profile"
                                                    width={36}
                                                    height={36}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-5 h-5" />
                                            )}
                                        </button>

                                        {/* دراپ‌دون حساب کاربری */}
                                        <div
                                            className={`absolute top-full left-0 mt-3 w-56 rounded-xl bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden transition-all duration-200 origin-top-left ${
                                                isProfileDropdownOpen
                                                    ? "opacity-100 scale-100 visible"
                                                    : "opacity-0 scale-95 invisible"
                                            }`}
                                        >
                                            <div className="sm:hidden px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                                <span className="block text-xs text-gray-500 mb-1">کاربر سالونا</span>
                                                <span className="block font-semibold text-gray-800 text-sm dir-ltr text-left">
                                                    {displayName}
                                                </span>
                                            </div>

                                            <div className="py-2">
                                                <Link
                                                    href="/checkout"
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors"
                                                    onClick={() => setIsProfileDropdownOpen(false)}
                                                >
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="font-medium">ثبت آدرس</span>
                                                </Link>

                                                <div className="h-px bg-gray-100 my-1"></div>

                                                <button
                                                    onClick={() => {
                                                        setIsProfileDropdownOpen(false);
                                                        setIsProfilePicModalOpen(true);
                                                    }}
                                                    className="w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                                                >
                                                    <Camera className="w-4 h-4" />
                                                    <span className="font-medium">عکس پروفایل</span>
                                                </button>

                                                <div className="h-px bg-gray-100 my-1"></div>

                                                <Link
                                                    href="/tickets"
                                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors group hover:bg-gray-50 hover:text-blue-600"
                                                    onClick={() => setIsProfileDropdownOpen(false)}
                                                >
                                                    <MessageSquare className="w-4 h-4 text-gray-700 transition-colors group-hover:text-blue-500" />
                                                    پشتیبانی و تیکت‌ها
                                                </Link>

                                                <div className="h-px bg-gray-100 my-1"></div>

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full cursor-pointer flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span className="font-medium">خروج از حساب</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-2 text-gray-600 hover:text-primary transition"
                                    >
                                        <User className="w-6 h-6" />
                                        <span className="hidden sm:block text-sm font-medium">ورود | ثبت‌نام</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* منوی موبایل */}
                <div
                    className={`fixed inset-0 bg-black/50 z-[60] lg:hidden transition-opacity duration-300 ${
                        isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <div
                        className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${
                            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <span className="text-xl font-black text-primary">SALONA</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-gray-500 hover:text-red-500 bg-gray-50 rounded-full transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 flex-1 overflow-y-auto">
                            {isProfileSectionLoading ? (
                                <div className="flex items-center gap-3 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-pulse">
                                    <div className="w-11 h-11 bg-gray-200 rounded-full"></div>
                                    <div className="flex flex-col gap-2">
                                        <div className="w-16 h-3 bg-gray-200 rounded"></div>
                                        <div className="w-24 h-4 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ) : userData ? (
                                <div className="flex items-center gap-3 mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                    <div className="bg-white p-2 rounded-full shadow-sm text-primary overflow-hidden w-11 h-11 flex items-center justify-center">
                                        {userData.profile_picture ? (
                                            <Image
                                                src={userData.profile_picture}
                                                alt="profile"
                                                width={44}
                                                height={44}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 mb-1">خوش آمدید،</span>
                                        <span className="font-bold text-gray-800 dir-ltr text-left tracking-wider">
                                            {displayName}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center justify-center gap-2 mb-8 p-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <User className="w-5 h-5" />
                                    ورود به حساب کاربری
                                </Link>
                            )}

                            <nav className="flex flex-col gap-2">
                                <span className="text-xs font-bold text-gray-400 mb-2 px-2">دسترسی سریع</span>

                                <Link
                                    href="/"
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Home className="w-5 h-5 text-gray-400" />
                                    صفحه اصلی
                                </Link>
                                <Link
                                    href="/products"
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Package className="w-5 h-5 text-gray-400" />
                                    محصولات
                                </Link>
                                <Link
                                    href="/categories"
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <LayoutGrid className="w-5 h-5 text-gray-400" />
                                    دسته‌بندی‌ها
                                </Link>
                                <Link
                                    href="/about"
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Info className="w-5 h-5 text-gray-400" />
                                    درباره ما
                                </Link>

                                <div className="h-px bg-gray-100 my-4"></div>

                                <span className="text-xs font-bold text-gray-400 mb-2 px-2">حساب کاربری</span>

                                {userData && (
                                    <>
                                        <Link
                                            href="/checkout"
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-primary transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <MapPin className="w-5 h-5 text-gray-400" />
                                            ثبت آدرس
                                        </Link>

                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                setIsProfilePicModalOpen(true);
                                            }}
                                            className="flex cursor-pointer w-full items-center gap-3 px-3 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-primary transition-colors"
                                        >
                                            <Camera className="w-5 h-5 text-gray-400" />
                                            عکس پروفایل
                                        </button>
                                    </>
                                )}

                                <Link
                                    href="/profile/favorites"
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Heart className="w-5 h-5 text-gray-400" />
                                    علاقه‌مندی‌ها
                                </Link>
                                <Link
                                    href="/tickets"
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <MessageSquare className="w-5 h-5 text-gray-400" />
                                    پشتیبانی و تیکت‌ها
                                </Link>
                            </nav>
                        </div>

                        {userData && (
                            <div className="p-5 border-t border-gray-100 mt-auto bg-gray-50/50">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center justify-center gap-3 p-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    خروج از حساب کاربری
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* مودال آپلود / حذف عکس پروفایل */}
            {isProfilePicModalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setIsProfilePicModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsProfilePicModalOpen(false)}
                            className="absolute cursor-pointer top-4 left-4 text-gray-400 hover:text-gray-700 transition-colors bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center mb-6 mt-2">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-4 border-gray-400 overflow-hidden relative">
                                {userData?.profile_picture ? (
                                    <Image src={userData.profile_picture} alt="profile" fill className="object-cover" />
                                ) : (
                                    <Camera className="w-10 h-10 text-gray-400" />
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">تصویر پروفایل</h3>
                            <p className="text-sm text-gray-500 mt-1">تصویر کاربری خود را مدیریت کنید</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {/* Input مخفی برای دریافت فایل */}
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                disabled={isUploading}
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading || isDeleting}
                                className="w-full cursor-pointer flex justify-center items-center gap-2 py-3 bg-primary rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
                            >
                                {isUploading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <UploadCloud className="w-5 h-5" />
                                )}
                                {isUploading ? "در حال آپلود..." : "انتخاب و آپلود عکس جدید"}
                            </button>

                            <button
                                onClick={handleDeletePicture}
                                disabled={isUploading || isDeleting || !userData?.profile_picture}
                                className={`w-full flex justify-center items-center gap-2 py-3 rounded-xl font-medium transition-colors border 
                                    ${
                                        !userData?.profile_picture
                                            ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                                            : "bg-white text-red-500 border-red-200 hover:bg-red-50 disabled:opacity-70"
                                    }`}
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Trash2 className="w-5 h-5" />
                                )}
                                {isDeleting ? "در حال حذف..." : "حذف عکس فعلی"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
