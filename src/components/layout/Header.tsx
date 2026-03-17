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
    Home
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useUserProfile } from "@/services/useUser";
import { removeAuthCookie } from "@/app/actions";
import Image from "next/image";
import LOGO from "@/../public/assets/images/logo/logo.png"

// تعریف اینترفیس برای آدرس کاربر
interface UserAddress {
    id: number;
    address: string;
    is_default: boolean;
    latitude: number;
    longitude: number;
    postal_code: string;
}

// تعریف اینترفیس برای ساختار دیتای کاربر بر اساس API
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
}

export const Header = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // استیت برای دراپ‌دون پروفایل
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // استیت برای حل مشکل Hydration سبد خرید
    const [isMounted, setIsMounted] = useState(false);

    // دریافت اطلاعات کاربر از لوکال استوریج به صورت امن
    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
        return null;
    };
    
    const user = getUserFromStorage();

    // دریافت اطلاعات کاربر از هوک اختصاصی
    const { data, isLoading: isUserLoading } = useUserProfile(!!user);

    //@ts-ignore
    const userData: UserProfile | null = data?.user || null;

    // دریافت لیست محصولات سبد خرید از Redux
    const cartItems = useSelector((state: any) => state.cart.items);
    const uniqueProductCount = cartItems?.length || 0;

    useEffect(() => {
        setIsMounted(true);

        // منطق اسکرول هدر
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // مدیریت کلیک خارج از دراپ‌دون پروفایل
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

    // متد خروج از حساب کاربری
    const handleLogout = async () => {
        // بستن منوها
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);

        // نمایش پاپ‌آپ تاییدیه
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
                // ۱. پاک کردن توکن از کوکی (فراخوانی Server Action)
                await removeAuthCookie();

                // ۲. پاک کردن کش اطلاعات کاربر از React Query و لوکال استوریج
                queryClient.removeQueries({ queryKey: ["userProfile"] });
                localStorage.removeItem("user");

                // ۳. رفرش کردن دیتای Next.js و انتقال به صفحه اصلی
                router.refresh();
                router.push("/");
                
                // نمایش پیام موفقیت
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

    // تعیین عبارتی که باید به کاربر نمایش داده شود
    const displayName = userData?.name || userData?.phone_number;

    // متغیری برای بررسی وضعیت کلی بارگذاری بخش کاربری
    const isProfileSectionLoading = !isMounted || isUserLoading;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? "bg-white shadow-md py-3" : "bg-white/90 backdrop-blur-md py-4 border-b border-gray-100"
            }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    
                    {/* بخش راست: لوگو و منوی دسکتاپ */}
                    <div className="flex items-center gap-8 lg:gap-12">
                        {/* منوی موبایل و لوگو */}
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden text-gray-700 hover:text-primary transition"
                                onClick={() => setIsMobileMenuOpen(true)}
                                aria-label="باز کردن منو"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            {/* <Link href="/">
                                <Image src={LOGO} className="w-50" alt="logo" />
                            </Link> */}
                            <Link href="/" className="text-2xl font-black text-primary tracking-tighter">
                                SALONA<span className="text-gray-900">.</span>
                            </Link>
                        </div>

                        {/* ناوبری دسکتاپ */}
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

                    {/* بخش چپ: آیکون‌های اکشن */}
                    <div className="flex items-center gap-3 sm:gap-5">
                        <Link
                            href="/profile/favorites"
                            className="text-gray-600 hover:text-primary transition hidden sm:block"
                            aria-label="علاقه‌مندی‌ها"
                        >
                            <Heart className="w-6 h-6" />
                        </Link>

                        <Link href="/cart" className="relative text-gray-600 hover:text-primary transition" aria-label="سبد خرید">
                            <ShoppingCart className="w-6 h-6" />
                            {isMounted && uniqueProductCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {uniqueProductCount}
                                </span>
                            )}
                        </Link>

                        {/* بخش پروفایل کاربر */}
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
                                        <div className="bg-primary/10 py-1.5 rounded-full text-primary">
                                            <User className="w-4 h-4" />
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
                                        className="sm:hidden flex items-center justify-center bg-primary/10 text-primary p-2 rounded-full"
                                    >
                                        <User className="w-5 h-5" />
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
                className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300 ${
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
                                <div className="bg-white p-2.5 rounded-full shadow-sm text-primary">
                                    <User className="w-6 h-6" />
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
                                <Link
                                    href="/checkout"
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    ثبت آدرس
                                </Link>
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
                    
                    {/* دکمه خروج در پایین منوی موبایل (چسبیده به پایین) */}
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
    );
};
