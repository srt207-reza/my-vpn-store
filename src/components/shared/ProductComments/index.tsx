"use client";
import {
    Loader2,
    MessageSquare,
    User,
    CornerDownLeft,
    CheckCircle2,
    X,
    Trash2,
    Edit2,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";
import { useState, useRef } from "react";
import {
    useAddProductComment,
    useProductComments,
    useDeleteProductComment,
    useEditProductComment,
} from "@/services/useComment";
import Swal from "sweetalert2";
import formatPersianDate from "@/@core/utils/formatPersianDate";

// ==========================================
// 1. کامپوننت نمایش نظرات محصول
// ==========================================
const ProductComments = ({ productId, currentUser }: { productId: number; currentUser: any }) => {
    // --- States ---
    const [page, setPage] = useState(1);
    const [commentText, setCommentText] = useState("");
    const [commentTitle, setCommentTitle] = useState("");
    const [replyTo, setReplyTo] = useState<{ id: number; author: string } | null>(null);

    // States for Editing
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editText, setEditText] = useState("");

    const listRef = useRef<HTMLDivElement>(null);

    // --- Queries & Mutations ---
    const { data: response, isLoading } = useProductComments(productId, page);
    const { mutate: addComment, isPending: isAdding } = useAddProductComment(productId);
    const { mutate: deleteComment, isPending: isDeleting } = useDeleteProductComment();
    const { mutate: editComment, isPending: isEditing } = useEditProductComment();

    const comments = response?.comments || [];

    // --- Handlers ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        addComment(
            {
                comment: commentText,
                title: commentTitle || undefined,
                parent_id: replyTo?.id,
            },
            {
                onSuccess: () => {
                    setCommentText("");
                    setCommentTitle("");
                    setReplyTo(null);
                },
            },
        );
    };

    const handleDelete = async (commentId: number) => {
        const result = await Swal.fire({
            title: "آیا مطمئن هستید؟",
            text: "می‌خواهید نظر انتخوابی خود را حذف کنید؟",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444", // رنگ قرمز برای خروج
            cancelButtonColor: "#9ca3af", // رنگ خاکستری برای انصراف
            confirmButtonText: "بله",
            cancelButtonText: "خیر",
            reverseButtons: true, // برای راست‌چین بودن دکمه‌ها در فارسی
        });
        if (result.isConfirmed) {
            setReplyTo(null);
            deleteComment(commentId);
        }
    };

    const startEdit = (comment: any) => {
        setEditingId(comment.id);
        setEditTitle(comment.title || "");
        setEditText(comment.comment || "");
    };

    const handleEditSubmit = (commentId: number) => {
        if (!editText.trim()) return;
        editComment(
            { commentId, payload: { title: editTitle, comment: editText } },
            {
                onSuccess: () => {
                    setEditingId(null);
                    setEditTitle("");
                    setEditText("");
                },
            },
        );
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        if (listRef.current) {
            listRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // --- Inner Component for Comment Item ---
    const CommentItem = ({ comment, isReply = false }: { comment: any; isReply?: boolean }) => {
        const isMine = currentUser?.user?.id === comment.user_id;
        const isCurrentlyEditing = editingId === comment.id;

        return (
            <div
                className={`p-5 rounded-2xl border transition-all ${isReply ? "bg-gray-50/50 border-gray-100 mt-4 mr-6 md:mr-12" : "bg-white border-gray-100 mb-4 shadow-sm hover:shadow-md"}`}
            >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-gray-50 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">{comment.author || "کاربر ناشناس"}</h4>
                            <div className="text-xs text-gray-500 mt-1">
                                {formatPersianDate(comment.created_at)}
                            </div>
                        </div>
                    </div>
                    {comment.is_verified_purchase && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100/50">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>خریدار محصول</span>
                        </div>
                    )}
                </div>

                {/* Edit Mode OR View Mode */}
                {isCurrentlyEditing ? (
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="عنوان نظر..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-salona-500"
                        />
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-salona-500 resize-none"
                        ></textarea>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEditSubmit(comment.id)}
                                disabled={isEditing || !editText.trim()}
                                className="bg-salona-500 cursor-pointer text-white text-xs px-4 py-2 rounded-lg hover:bg-salona-600 transition-colors disabled:opacity-50"
                            >
                                {isEditing ? "در حال ثبت..." : "ذخیره تغییرات"}
                            </button>
                            <button
                                onClick={() => setEditingId(null)}
                                className="bg-gray-100 cursor-pointer text-gray-600 text-xs px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                انصراف
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {comment.title && <h4 className="font-bold text-gray-800 mb-2">{comment.title}</h4>}
                        <p className="text-gray-600 text-sm leading-loose whitespace-pre-line">{comment.comment}</p>
                    </>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex items-center justify-between">
                    {!isReply && currentUser && !isCurrentlyEditing && (
                        <button
                            onClick={() => setReplyTo({ id: comment.id, author: comment.author })}
                            className="cursor-pointer flex items-center gap-1.5 text-sm text-salona-500 font-medium hover:text-salona-600 transition-colors"
                        >
                            <CornerDownLeft className="w-4 h-4" /> پاسخ دادن
                        </button>
                    )}

                    {/* Edit & Delete Buttons for Comment Owner */}
                    {isMine && !isCurrentlyEditing && (
                        <div className="flex items-center gap-3 mr-auto">
                            <button
                                onClick={() => startEdit(comment)}
                                className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors flex items-center gap-1 text-xs"
                                title="ویرایش"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(comment.id)}
                                disabled={isDeleting}
                                className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors flex items-center gap-1 text-xs disabled:opacity-50"
                                title="حذف"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Replies Rendering */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2 space-y-4 border-t border-gray-100 pt-2">
                        {comment.replies.map((reply: any) => (
                            <CommentItem key={reply.id} comment={reply} isReply={true} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="mt-16 bg-white border border-gray-200 rounded-3xl p-6 lg:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="w-6 h-6 text-salona-500" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">نظرات کاربران</h2>
                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full font-medium">
                    {response?.total || 0} نظر
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* بخش فرم ثبت نظر */}
                <div className="lg:col-span-4 order-2 lg:order-1">
                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 sticky top-24">
                        <h3 className="font-bold text-gray-800 mb-4">ثبت دیدگاه جدید</h3>

                        {currentUser ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {replyTo && (
                                    <div className="flex items-center justify-between bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm mb-4">
                                        <span>
                                            در حال پاسخ به: <strong>{replyTo.author}</strong>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setReplyTo(null)}
                                            className="hover:bg-blue-100 cursor-pointer p-1 rounded-md transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">عنوان نظر (اختیاری)</label>
                                    <input
                                        type="text"
                                        value={commentTitle}
                                        onChange={(e) => setCommentTitle(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-salona-500 focus:ring-1 focus:ring-salona-500 transition-all"
                                        placeholder="مثلاً: کیفیت عالی"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">متن نظر</label>
                                    <textarea
                                        required
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        rows={4}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-salona-500 focus:ring-1 focus:ring-salona-500 transition-all resize-none"
                                        placeholder="نقاط قوت و ضعف محصول را بنویسید..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isAdding || !commentText.trim()}
                                    className="w-full cursor-pointer bg-salona-500 hover:bg-salona-600 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isAdding && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {isAdding ? "در حال ثبت..." : "ثبت دیدگاه"}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-500 mb-4">
                                    برای ثبت نظر، ابتدا وارد حساب کاربری خود شوید.
                                </p>
                                <a
                                    href="/login"
                                    className="inline-block bg-salona-50 text-salona-600 font-medium px-6 py-2 rounded-xl hover:bg-salona-100 transition-colors"
                                >
                                    ورود به حساب
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* بخش لیست نظرات */}
                <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col">
                    <div
                        ref={listRef}
                        className="max-h-150 overflow-y-auto pr-2 pb-4 space-y-6 scroll-smooth pl-4"
                        style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }} // استایل اسکرول‌بار برای فایرفاکس
                    >
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-gray-50 h-32 rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : comments.length > 0 ? (
                            comments.map((comment: any) => <CommentItem key={comment.id} comment={comment} />)
                        ) : (
                            <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-gray-700 mb-1">هنوز دیدگاهی ثبت نشده است</h3>
                                <p className="text-gray-500 text-sm">
                                    شما اولین نفری باشید که در مورد این محصول نظر می‌دهید.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* بخش صفحه‌بندی (Pagination) */}
                    {response && response.pages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8 border-t border-gray-100 pt-6">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={!response.has_prev}
                                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" /> قبلی
                            </button>
                            <span className="text-sm text-gray-500 font-medium">
                                صفحه {response.current_page} از {response.pages}
                            </span>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={!response.has_next}
                                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                بعدی <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductComments;
