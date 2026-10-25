"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Truck,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { useCart, formatPrice, toBengaliDigits } from "@/context/CartContext";
import { Product } from "@/db/schema";

const QUICK_UPSELL_ITEMS: Product[] = [
  {
    id: 3,
    name: "নরমাল চা",
    slug: "normal-tea",
    description: "তাজা আদা ও এলাচ দেওয়া গরম দুধ চা অথবা রং চা।",
    price: 20,
    originalPrice: 25,
    category: "চা ও কফি",
    collection: "ধোঁয়া ওঠা চা ও কফির চুমুক",
    spiceLevel: 0,
    dietaryTags: ["হালাল", "ভেজিটেরিয়ান"],
    images: ["/images/normal-tea.jpg"],
    badge: "মাত্র ২০ টাকা",
    prepTimeMinutes: 5,
    calories: 90,
    servingSize: "১ কাপ",
    availableAddons: [],
    inStock: true,
    ratingAvg: "4.96",
    reviewCount: 4,
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "মালাই চা",
    slug: "special-malai-tea",
    description: "ঘন দুধের সর ও বাদাম কুচি দেওয়া মাটির কাপের মালাই চা।",
    price: 50,
    originalPrice: 65,
    category: "চা ও কফি",
    collection: "ধোঁয়া ওঠা চা ও কফির চুমুক",
    spiceLevel: 0,
    dietaryTags: ["হালাল", "ভেজিটেরিয়ান"],
    images: ["/images/malai-tea.jpg"],
    badge: "সিগনেচার - ৫০ টাকা",
    prepTimeMinutes: 6,
    calories: 185,
    servingSize: "১ মাটির কাপ",
    availableAddons: [],
    inStock: true,
    ratingAvg: "4.99",
    reviewCount: 4,
    createdAt: new Date(),
  },
  {
    id: 5,
    name: "কফি (হট ক্যাপুচিনো / মিল্ক কফি)",
    slug: "cafe-special-coffee",
    description: "ফেনা তোলা গরম ক্যাপুচিনো ও মিল্ক কফি।",
    price: 100,
    originalPrice: 120,
    category: "চা ও কফি",
    collection: "ধোঁয়া ওঠা চা ও কফির চুমুক",
    spiceLevel: 0,
    dietaryTags: ["হালাল", "ভেজিটেরিয়ান"],
    images: ["/images/hot-coffee.jpg"],
    badge: "প্রিমিয়াম - ১০০ টাকা",
    prepTimeMinutes: 6,
    calories: 160,
    servingSize: "১ বড় মগ",
    availableAddons: [],
    inStock: true,
    ratingAvg: "4.94",
    reviewCount: 4,
    createdAt: new Date(),
  },
];

export function SlideOutCart() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    addItem,
    itemCount,
    subtotal,
    freeDeliveryThreshold,
    amountToFreeDelivery,
    deliveryFee,
    promoCode,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    totalAmount,
    toast,
    dismissToast,
  } = useCart();

  const router = useRouter();
  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeDeliveryThreshold) * 100)
  );

  const handleApplyPromo = (codeToApply?: string) => {
    const target = codeToApply ?? promoInput;
    const res = applyPromoCode(target);
    setPromoFeedback({
      type: res.success ? "success" : "error",
      text: res.message,
    });
    if (res.success) {
      setPromoInput("");
    }
  };

  const handleProceedToCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      {/* Global Toast Notification when an item is added */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-[#1F1614] text-[#FFFBF5] border border-[#D9381E]/50 rounded-2xl p-4 shadow-2xl flex items-center gap-3.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {toast.image && (
            <img
              src={toast.image}
              alt={toast.title}
              className="w-12 h-12 rounded-xl object-cover border border-[#FFFBF5]/20 flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-[#4ADE80] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              আড্ডা ব্যাগে যোগ হয়েছে
            </div>
            <p className="text-sm font-bold text-[#FFFBF5] truncate mt-0.5">
              {toast.title}
            </p>
            <p className="text-xs text-[#E5D8C8] truncate">{toast.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={dismissToast}
            className="p-1.5 text-[#A38F85] hover:text-[#FFFBF5] transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Slide-out Drawer Backdrop & Panel */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={closeCart}
            className="fixed inset-0 bg-[#1C1311]/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FFFBF5] border-l border-[#E5D8C8] shadow-2xl flex flex-col justify-between">
              {/* Top Drawer Header */}
              <div className="p-5 bg-[#F5ECE0] border-b border-[#E5D8C8]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#D9381E] text-[#FFFBF5] flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-black text-[#1C1311] leading-none">
                        আপনার আড্ডা ব্যাগ
                      </h2>
                      <p className="text-xs text-[#6B5750] mt-1">
                        {toBengaliDigits(itemCount)}টি আইটেম • গরম ও তাজা পরিবেশন
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={closeCart}
                    aria-label="আড্ডা ব্যাগ বন্ধ করুন"
                    className="p-2 rounded-xl bg-[#FFFBF5] border border-[#E5D8C8] text-[#1C1311] hover:bg-[#D9381E] hover:text-[#FFFBF5] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Free Express Delivery Progress Meter */}
                <div className="mt-4 bg-[#FFFBF5] rounded-xl p-3 border border-[#E5D8C8]">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="flex items-center gap-1.5 text-[#1C1311]">
                      <Truck className="w-4 h-4 text-[#D9381E]" />
                      {amountToFreeDelivery === 0 ? (
                        <span className="text-[#15803D]">
                          অভিনন্দন! আপনি ফ্রি হোম ডেলিভারি পেয়েছেন!
                        </span>
                      ) : (
                        <span>
                          ফ্রি ডেলিভারি পেতে আরও{" "}
                          <span className="text-[#D9381E] font-bold">
                            {formatPrice(amountToFreeDelivery)}
                          </span>{" "}
                          যোগ করুন
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-[#6B5750]">
                      {toBengaliDigits(progressPercent)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E5D8C8] overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        amountToFreeDelivery === 0
                          ? "bg-[#15803D]"
                          : "bg-gradient-to-r from-[#D9381E] to-[#F59E0B]"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Middle Scrollable Cart Items + Upsell Strip */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#F5ECE0] text-[#D9381E] flex items-center justify-center mx-auto mb-4">
                      <Flame className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#1C1311]">
                      আপনার আড্ডা ব্যাগ এখন খালি!
                    </h3>
                    <p className="text-sm text-[#6B5750] mt-2 max-w-xs mx-auto">
                      মচমচে ফুচকা (৳৭০), চিকেন ফ্রাই (৳১৫০), নরমাল চা (৳২০), মালাই চা (৳৫০) এবং গরম কফি (৳১০০) দিয়ে আপনার বিকেলের আড্ডা শুরু করুন।
                    </p>
                    <Link
                      href="/#menu-grid"
                      onClick={closeCart}
                      className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D9381E] hover:bg-[#B82D16] text-[#FFFBF5] font-bold text-sm shadow-md transition-all"
                    >
                      মেনু দেখুন
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.cartItemId}
                          className="p-3.5 rounded-2xl bg-[#F5ECE0]/65 border border-[#E5D8C8] flex gap-3.5 items-start"
                        >
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeCart}
                            className="flex-shrink-0"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 rounded-xl object-cover border border-[#E5D8C8]"
                            />
                          </Link>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/products/${item.slug}`}
                                onClick={closeCart}
                                className="font-serif font-bold text-sm text-[#1C1311] hover:text-[#D9381E] transition-colors line-clamp-1"
                              >
                                {item.name}
                              </Link>
                              <button
                                type="button"
                                onClick={() => removeItem(item.cartItemId)}
                                aria-label={`${item.name} সরান`}
                                className="text-[#6B5750] hover:text-[#DC2626] p-1 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="mt-1 flex flex-wrap gap-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFFBF5] border border-[#E5D8C8] text-[10px] text-[#6B5750]">
                                <Flame className="w-3 h-3 text-[#D9381E]" />
                                {item.spiceLevelLabel}
                              </span>
                            </div>

                            {item.selectedAddons &&
                              item.selectedAddons.length > 0 && (
                                <p className="text-[11px] text-[#6B5750] mt-1">
                                  +{" "}
                                  {item.selectedAddons
                                    .map((a) => a.name)
                                    .join(", ")}
                                </p>
                              )}

                            {item.notes && (
                              <p className="text-[11px] italic text-[#6B5750] mt-0.5">
                                নোট: &ldquo;{item.notes}&rdquo;
                              </p>
                            )}

                            <div className="mt-2.5 flex items-center justify-between">
                              <div className="inline-flex items-center rounded-xl bg-[#FFFBF5] border border-[#E5D8C8] p-0.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.cartItemId,
                                      item.quantity - 1
                                    )
                                  }
                                  aria-label="পরিমাণ কমান"
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#1C1311] hover:bg-[#F5ECE0] transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-7 text-center text-xs font-bold text-[#1C1311]">
                                  {toBengaliDigits(item.quantity)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.cartItemId,
                                      item.quantity + 1
                                    )
                                  }
                                  aria-label="পরিমাণ বাড়ান"
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#1C1311] hover:bg-[#F5ECE0] transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <span className="text-sm font-bold text-[#1C1311]">
                                {formatPrice(item.unitPrice * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* One-Tap Tea & Coffee Pairing Strip */}
                    <div className="pt-3 border-t border-[#E5D8C8]">
                      <p className="text-[11px] uppercase tracking-wider font-bold text-[#6B5750] mb-2.5 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                        আড্ডার সাথে গরম চা বা কফি যোগ করুন
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {QUICK_UPSELL_ITEMS.map((upsell) => (
                          <div
                            key={upsell.id}
                            className="p-2.5 rounded-xl bg-[#FFFBF5] border border-[#E5D8C8] flex items-center justify-between gap-2.5"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={upsell.images[0]}
                                alt={upsell.name}
                                className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#1C1311] truncate">
                                  {upsell.name}
                                </p>
                                <p className="text-[11px] text-[#D9381E] font-bold">
                                  {formatPrice(upsell.price)} ({upsell.servingSize})
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => addItem(upsell)}
                              className="px-3 py-1.5 rounded-lg bg-[#F5ECE0] hover:bg-[#D9381E] text-[#1C1311] hover:text-[#FFFBF5] text-xs font-bold transition-colors flex-shrink-0 cursor-pointer"
                            >
                              + যোগ করুন
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Promo Code Box */}
                    <div className="pt-3 border-t border-[#E5D8C8]">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-[#6B5750] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={promoInput}
                            onChange={(e) =>
                              setPromoInput(e.target.value.toUpperCase())
                            }
                            placeholder="প্রোমো কোড (যেমন: ADDA15)"
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#FFFBF5] border border-[#D6C7B5] text-xs font-mono uppercase text-[#1C1311] focus:outline-none focus:border-[#D9381E]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyPromo()}
                          className="px-3.5 py-2 rounded-xl bg-[#1C1311] hover:bg-[#D9381E] text-[#FFFBF5] text-xs font-bold transition-colors cursor-pointer"
                        >
                          প্রয়োগ করুন
                        </button>
                      </div>

                      {/* Quick 1-click promo pills */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[11px] text-[#6B5750]">
                          ক্লিক করে ছাড় নিন:
                        </span>
                        {["ADDA15", "CHA20", "SQUAD50"].map((code) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => handleApplyPromo(code)}
                            className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border transition-colors cursor-pointer ${
                              promoCode === code
                                ? "bg-[#15803D] text-[#FFFBF5] border-[#15803D]"
                                : "bg-[#F5ECE0] text-[#1C1311] border-[#D6C7B5] hover:border-[#D9381E]"
                            }`}
                          >
                            {code}
                          </button>
                        ))}
                        {promoCode && (
                          <button
                            type="button"
                            onClick={() => {
                              removePromoCode();
                              setPromoFeedback(null);
                            }}
                            className="text-[10px] text-[#DC2626] underline ml-auto cursor-pointer"
                          >
                            মুছে ফেলুন
                          </button>
                        )}
                      </div>

                      {promoFeedback && (
                        <p
                          className={`text-[11px] mt-1.5 font-medium ${
                            promoFeedback.type === "success"
                              ? "text-[#15803D]"
                              : "text-[#DC2626]"
                          }`}
                        >
                          {promoFeedback.text}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Bottom Receipt Summary & Checkout CTA */}
              {items.length > 0 && (
                <div className="p-5 bg-[#F5ECE0] border-t border-[#E5D8C8] space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#6B5750]">
                      <span>উপমোট ({toBengaliDigits(itemCount)}টি আইটেম)</span>
                      <span className="text-[#1C1311] font-bold">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#15803D] font-bold">
                        <span>প্রোমো ছাড় ({promoCode})</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#6B5750]">
                      <span>ডেলিভারি চার্জ</span>
                      <span className="text-[#1C1311] font-bold">
                        {deliveryFee === 0 ? (
                          <span className="text-[#15803D]">ফ্রি</span>
                        ) : (
                          formatPrice(deliveryFee)
                        )}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#D6C7B5] flex justify-between text-base font-bold text-[#1C1311]">
                      <span>সর্বমোট বিল</span>
                      <span className="text-[#D9381E]">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#D9381E] hover:bg-[#B82D16] text-[#FFFBF5] font-bold text-sm shadow-lg shadow-[#D9381E]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>চেকআউট পেজে যান</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
