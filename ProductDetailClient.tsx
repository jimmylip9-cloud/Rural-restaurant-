"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flame,
  Star,
  Clock,
  ShieldCheck,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Check,
  Sparkles,
  ThumbsUp,
  MessageSquarePlus,
  ChevronLeft,
  ChevronRight,
  Utensils,
} from "lucide-react";
import { Product, ProductAddon, Review } from "@/db/schema";
import { useCart, formatPrice, toBengaliDigits } from "@/context/CartContext";
import { ProductCard } from "./ProductCard";

interface ProductDetailClientProps {
  product: Product;
  initialReviews: Review[];
  relatedProducts: Product[];
}

const SPICE_OPTIONS = [
  {
    level: 0,
    label: "০-মরিচ (ঝাল ছাড়া / বাচ্চাদের উপযোগী)",
    desc: "একদমই মরিচের ঝাল থাকবে না—মিষ্টি বা নরমাল স্বাদ।",
  },
  {
    level: 1,
    label: "১-মরিচ (হালকা চটপটা)",
    desc: "মৃদু মসলার ঘ্রাণ ও হালকা ঝাল।",
  },
  {
    level: 2,
    label: "২-মরিচ (আড্ডা স্পেশাল ঝাল)",
    desc: "আমাদের ক্যাফের সিগনেচার পরিমিত ঝাল।",
  },
  {
    level: 3,
    label: "৩-মরিচ (সিলেটি নাগা ফায়ার ঝাল)",
    desc: "কড়া ঝালপ্রেমীদের জন্য অতিরিক্ত নাগা মরিচের ঝাল!",
  },
];

export function ProductDetailClient({
  product,
  initialReviews,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const galleryImages = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return ["/images/fuchka-plate.jpg"];
  }, [product.images]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSpiceIndex, setSelectedSpiceIndex] = useState<number>(
    product.spiceLevel ?? 2
  );
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [kitchenNotes, setKitchenNotes] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Reviews State
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);
  const [ratingAvg, setRatingAvg] = useState<string>(product.ratingAvg);
  const [reviewCount, setReviewCount] = useState<number>(
    initialReviews.length || product.reviewCount
  );
  const [helpfulClickedIds, setHelpfulClickedIds] = useState<number[]>([]);

  // New Review Form State
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerTag, setReviewerTag] = useState("নিয়মিত গ্রাহক");
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerSpiceFeedback, setReviewerSpiceFeedback] =
    useState("একদম পারফেক্ট");
  const [reviewerComment, setReviewerComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState<
    string | null
  >(null);
  const [reviewErrorMessage, setReviewErrorMessage] = useState<string | null>(
    null
  );

  const toggleAddon = (addon: ProductAddon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  const addonsTotal = useMemo(
    () => selectedAddons.reduce((sum, a) => sum + a.price, 0),
    [selectedAddons]
  );

  const unitPrice = product.price + addonsTotal;
  const totalSelectionPrice = unitPrice * quantity;

  const handleAddToCart = (openDrawerAfter = false) => {
    const spiceOption =
      SPICE_OPTIONS[selectedSpiceIndex] || SPICE_OPTIONS[product.spiceLevel];
    addItem(product, {
      quantity,
      spiceLevelLabel: spiceOption.label,
      selectedAddons,
      notes: kitchenNotes,
      openDrawer: openDrawerAfter,
    });
  };

  const handleBuyNow = () => {
    const spiceOption =
      SPICE_OPTIONS[selectedSpiceIndex] || SPICE_OPTIONS[product.spiceLevel];
    addItem(product, {
      quantity,
      spiceLevelLabel: spiceOption.label,
      selectedAddons,
      notes: kitchenNotes,
      openDrawer: false,
    });
    router.push("/checkout");
  };

  const handleHelpfulClick = (reviewId: number) => {
    if (helpfulClickedIds.includes(reviewId)) return;
    setHelpfulClickedIds((prev) => [...prev, reviewId]);
    setReviewsList((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      )
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewErrorMessage(null);
    setReviewSuccessMessage(null);

    if (!reviewerName.trim() || !reviewerComment.trim()) {
      setReviewErrorMessage("অনুগ্রহ করে আপনার নাম এবং মতামত লিখুন।");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerName: reviewerName,
          customerTag: reviewerTag,
          rating: reviewerRating,
          comment: reviewerComment,
          spiceFeedback: reviewerSpiceFeedback,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "রিভিউ জমা দিতে সমস্যা হয়েছে।");
      }

      setReviewsList((prev) => [data.review, ...prev]);
      setRatingAvg(data.updatedRatingAvg);
      setReviewCount(data.updatedReviewCount);
      setReviewerName("");
      setReviewerComment("");
      setReviewSuccessMessage(
        "ধন্যবাদ! আপনার মূল্যবান রিভিউটি শেষ বিকেলের আড্ডার দেয়ালে যুক্ত হয়েছে।"
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "রিভিউ জমা দেওয়া সম্ভব হয়নি।";
      setReviewErrorMessage(message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const ratingBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsList.forEach((r) => {
      const star = Math.min(5, Math.max(1, r.rating)) as 1 | 2 | 3 | 4 | 5;
      counts[star]++;
    });
    return counts;
  }, [reviewsList]);

  return (
    <div className="py-8 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb Navigation */}
      <nav className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E5D8C8]">
        <div className="flex items-center gap-2 text-xs text-[#6B5750]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-bold text-[#1C1311] hover:text-[#D9381E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            মেনুতে ফিরে যান
          </Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-[#D9381E] font-bold truncate max-w-[200px]">
            {product.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#F5ECE0] border border-[#E5D8C8] text-xs font-bold text-[#1C1311]">
            কালেকশন: {product.collection}
          </span>
        </div>
      </nav>

      {/* Main Two-Column Product Showcase: Gallery (Left) + Customizer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left 6 Columns: Multi-Angle Interactive Image Gallery */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-28">
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-[#1F1614] border-2 border-[#E5D8C8] shadow-xl group">
            <img
              src={galleryImages[activeImageIndex]}
              alt={`${product.name} - ছবি ${toBengaliDigits(activeImageIndex + 1)}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {product.badge && (
                <span className="px-3 py-1 rounded-full bg-[#1C1311]/90 text-[#F59E0B] text-xs font-bold shadow-md">
                  {product.badge}
                </span>
              )}
              {(product.dietaryTags || []).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-[#FFFBF5]/95 text-[#1C1311] text-[11px] font-bold shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Prev / Next Gallery Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === 0 ? galleryImages.length - 1 : prev - 1
                    )
                  }
                  aria-label="আগের ছবি"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FFFBF5]/90 hover:bg-[#D9381E] text-[#1C1311] hover:text-[#FFFBF5] flex items-center justify-center shadow-md transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === galleryImages.length - 1 ? 0 : prev + 1
                    )
                  }
                  aria-label="পরের ছবি"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FFFBF5]/90 hover:bg-[#D9381E] text-[#1C1311] hover:text-[#FFFBF5] flex items-center justify-center shadow-md transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Counter Pill */}
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#1C1311]/80 text-[#FFFBF5] text-xs">
              ছবি {toBengaliDigits(activeImageIndex + 1)} /{" "}
              {toBengaliDigits(galleryImages.length)}
            </div>
          </div>

          {/* Thumbnail Selector Strip */}
          <div className="grid grid-cols-4 gap-3">
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? "border-[#D9381E] ring-2 ring-[#D9381E]/30 scale-[1.02]"
                    : "border-[#E5D8C8] opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${product.name} থাম্বনেইল ${toBengaliDigits(idx + 1)}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Kitchen Freshness & Packaging Guarantee Card */}
          <div className="p-4 rounded-2xl bg-[#F5ECE0] border border-[#E5D8C8] grid grid-cols-3 gap-3 text-center">
            <div>
              <span className="text-xs font-bold text-[#1C1311] block">
                🔥 {toBengaliDigits(product.prepTimeMinutes)} মিনিট
              </span>
              <span className="text-[11px] text-[#6B5750]">
                অর্ডারের পর প্রস্তুতকৃত
              </span>
            </div>
            <div className="border-x border-[#E5D8C8]">
              <span className="text-xs font-bold text-[#1C1311] block">
                ⚡ {toBengaliDigits(product.calories)} ক্যালরি
              </span>
              <span className="text-[11px] text-[#6B5750]">
                {product.servingSize}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-[#15803D] block">
                ✓ ফুড-গ্রেড বক্স
              </span>
              <span className="text-[11px] text-[#6B5750]">
                তাজা ও মচমচে থাকে
              </span>
            </div>
          </div>
        </div>

        {/* Right 6 Columns: Details, Spice Customizer, Add-Ons & Add to Bag */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5ECE0] border border-[#E5D8C8] text-xs font-bold text-[#1C1311]">
                <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                <span>{toBengaliDigits(ratingAvg)}</span>
                <a
                  href="#reviews-section"
                  className="text-[#D9381E] underline ml-1"
                >
                  ({toBengaliDigits(reviewCount)}টি গ্রাহক রিভিউ)
                </a>
              </div>

              <span className="inline-flex items-center gap-1 text-xs text-[#15803D] font-bold">
                <ShieldCheck className="w-4 h-4" />
                এখন অর্ডারের জন্য প্রস্তুত
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#1C1311] tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#D9381E]">
                {formatPrice(unitPrice)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-[#6B5750] line-through">
                  {formatPrice(product.originalPrice + addonsTotal)}
                </span>
              )}
              {addonsTotal > 0 && (
                <span className="text-xs text-[#15803D] font-bold">
                  (অতিরিক্ত +{formatPrice(addonsTotal)} যুক্ত)
                </span>
              )}
            </div>

            <p className="mt-4 text-base text-[#6B5750] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Step 1: Customize Spice Level (For Any Customer!) */}
          <div className="p-5 rounded-2xl bg-[#F5ECE0]/80 border border-[#E5D8C8] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-[#1C1311] flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#D9381E]" />
                ১. আপনার পছন্দের স্বাদ / ঝালের মাত্রা বেছে নিন
              </h2>
              <span className="text-[11px] text-[#6B5750]">
                সবার রুচির জন্য
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SPICE_OPTIONS.map((option) => {
                const isSelected = selectedSpiceIndex === option.level;
                return (
                  <button
                    key={option.level}
                    type="button"
                    onClick={() => setSelectedSpiceIndex(option.level)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1C1311] text-[#FFFBF5] border-[#1C1311] shadow-sm"
                        : "bg-[#FFFBF5] text-[#1C1311] border-[#D6C7B5] hover:border-[#D9381E]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold">
                        {option.label}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
                      )}
                    </div>
                    <p
                      className={`text-[11px] mt-1 ${
                        isSelected ? "text-[#E5D8C8]" : "text-[#6B5750]"
                      }`}
                    >
                      {option.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Indulgent Add-Ons & Upgrades */}
          {product.availableAddons && product.availableAddons.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#F5ECE0]/80 border border-[#E5D8C8] space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-[#1C1311] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#F59E0B]" />
                  ২. অতিরিক্ত সংযোজন / অ্যাড-অনস (ঐচ্ছিক)
                </h2>
                <span className="text-[11px] text-[#6B5750]">
                  ইচ্ছেমতো বেছে নিন
                </span>
              </div>

              <div className="space-y-2">
                {product.availableAddons.map((addon) => {
                  const isChecked = selectedAddons.some(
                    (a) => a.id === addon.id
                  );
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        isChecked
                          ? "bg-[#D9381E]/10 border-[#D9381E] text-[#1C1311]"
                          : "bg-[#FFFBF5] border-[#D6C7B5] text-[#1C1311] hover:border-[#D9381E]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isChecked
                              ? "bg-[#D9381E] border-[#D9381E] text-[#FFFBF5]"
                              : "border-[#6B5750] bg-[#FFFBF5]"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-sm font-bold">{addon.name}</span>
                      </div>

                      <span className="text-xs font-bold text-[#D9381E]">
                        {addon.price === 0
                          ? "ফ্রি"
                          : `+${formatPrice(addon.price)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Special Kitchen Note */}
          <div>
            <label
              htmlFor="kitchen-note"
              className="block text-xs font-bold text-[#6B5750] mb-1.5"
            >
              রান্নাঘরের জন্য বিশেষ নির্দেশনা (ঐচ্ছিক — যেমন: চিনি কম, সস আলাদা, বাচ্চাদের জন্য)
            </label>
            <input
              id="kitchen-note"
              type="text"
              value={kitchenNotes}
              onChange={(e) => setKitchenNotes(e.target.value)}
              placeholder="যেমন: তেঁতুলের টক আলাদা বক্সে দেবেন, চিনি কম দেবেন..."
              className="w-full h-11 px-4 rounded-xl bg-[#FFFBF5] border border-[#D6C7B5] text-sm text-[#1C1311] focus:outline-none focus:border-[#D9381E]"
            />
          </div>

          {/* Quantity Stepper + Primary Add to Bag & Express Checkout Buttons */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity Stepper */}
              <div className="inline-flex items-center justify-between rounded-2xl bg-[#F5ECE0] border border-[#D6C7B5] p-1.5 sm:w-36">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="পরিমাণ কমান"
                  className="w-10 h-10 rounded-xl bg-[#FFFBF5] text-[#1C1311] hover:bg-[#D9381E] hover:text-[#FFFBF5] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-base font-bold text-[#1C1311] px-3">
                  {toBengaliDigits(quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="পরিমাণ বাড়ান"
                  className="w-10 h-10 rounded-xl bg-[#FFFBF5] text-[#1C1311] hover:bg-[#D9381E] hover:text-[#FFFBF5] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Adda Bag Button */}
              <button
                type="button"
                onClick={() => handleAddToCart(true)}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#D9381E] hover:bg-[#B82D16] text-[#FFFBF5] font-bold text-base shadow-lg shadow-[#D9381E]/25 flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>আড্ডা ব্যাগে যোগ করুন</span>
                <span className="text-sm bg-[#1C1311]/25 px-2.5 py-0.5 rounded-lg">
                  {formatPrice(totalSelectionPrice)}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#1C1311] hover:bg-[#332521] text-[#FFFBF5] font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Clock className="w-4 h-4 text-[#F59E0B]" />
              <span>এখনই সরাসরি অর্ডার করুন ({formatPrice(totalSelectionPrice)}) →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Interactive Review Wall (#reviews-section) */}
      <section
        id="reviews-section"
        className="mt-20 pt-14 border-t border-[#E5D8C8]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 5 Columns: Rating Breakdown + Submit a Review Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#F5ECE0] border border-[#E5D8C8]">
              <span className="text-xs uppercase tracking-wider text-[#D9381E] font-bold block mb-1">
                গ্রাহকদের মতামত ও রেটিং
              </span>
              <h2 className="font-serif text-2xl font-black text-[#1C1311]">
                স্বাদ ও মানের রিভিউ
              </h2>

              <div className="mt-4 flex items-center gap-4">
                <div className="text-center p-4 rounded-2xl bg-[#FFFBF5] border border-[#E5D8C8] min-w-[105px]">
                  <span className="text-4xl font-extrabold text-[#1C1311] block">
                    {toBengaliDigits(ratingAvg)}
                  </span>
                  <div className="flex items-center justify-center gap-0.5 my-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#6B5750]">
                    {toBengaliDigits(reviewCount)}টি রিভিউ
                  </span>
                </div>

                {/* Star Distribution Bars */}
                <div className="flex-1 space-y-1.5 text-xs">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count =
                      ratingBreakdown[star as 1 | 2 | 3 | 4 | 5] || 0;
                    const pct =
                      reviewsList.length > 0
                        ? Math.round((count / reviewsList.length) * 100)
                        : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-7 text-[#1C1311] font-bold">
                          {toBengaliDigits(star)}★
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-[#E5D8C8] overflow-hidden">
                          <div
                            className="h-full bg-[#F59E0B] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-[#6B5750]">
                          {toBengaliDigits(count)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Interactive "Drop Your Adda Review" Form */}
            <form
              onSubmit={handleSubmitReview}
              className="p-6 rounded-3xl bg-[#FFFBF5] border-2 border-[#E5D8C8] space-y-4 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-[#D9381E]" />
                <h3 className="font-serif text-xl font-bold text-[#1C1311]">
                  আপনার অভিজ্ঞতা ও রিভিউ লিখুন
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1311] mb-1">
                  আপনার রেটিং দিন
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewerRating(star)}
                      className="p-1.5 rounded-lg hover:bg-[#F5ECE0] transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewerRating
                            ? "fill-[#F59E0B] text-[#F59E0B]"
                            : "text-[#D6C7B5]"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-[#D9381E]">
                    {toBengaliDigits(reviewerRating)}.০ / ৫.০
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="reviewer-name"
                    className="block text-xs font-bold text-[#1C1311] mb-1"
                  >
                    আপনার নাম *
                  </label>
                  <input
                    id="reviewer-name"
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="যেমন: তানভীর হাসান"
                    className="w-full h-10 px-3 rounded-xl bg-[#FFFBF5] border border-[#D6C7B5] text-sm text-[#1C1311] focus:outline-none focus:border-[#D9381E]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reviewer-tag"
                    className="block text-xs font-bold text-[#1C1311] mb-1"
                  >
                    আপনার পরিচয়
                  </label>
                  <select
                    id="reviewer-tag"
                    value={reviewerTag}
                    onChange={(e) => setReviewerTag(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#FFFBF5] border border-[#D6C7B5] text-xs font-bold text-[#1C1311] focus:outline-none focus:border-[#D9381E]"
                  >
                    <option value="নিয়মিত গ্রাহক">নিয়মিত গ্রাহক</option>
                    <option value="ফুচকা প্রেমী">ফুচকা প্রেমী</option>
                    <option value="চা ও কফি ভক্ত">চা ও কফি ভক্ত</option>
                    <option value="পারিবারিক গ্রাহক">পারিবারিক গ্রাহক</option>
                    <option value="কলেজ ও বিশ্ববিদ্যালয় দল">
                      কলেজ ও বিশ্ববিদ্যালয় দল
                    </option>
                    <option value="ফুড ব্লগার">ফুড ব্লগার</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1311] mb-1">
                  খাবারের স্বাদ কেমন লেগেছে?
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "একদম পারফেক্ট",
                    "দারুণ মচমচে!",
                    "সবার উপযোগী",
                    "ঝাল ও সুস্বাদু",
                    "সেরা ভ্যালু",
                  ].map((fb) => (
                    <button
                      key={fb}
                      type="button"
                      onClick={() => setReviewerSpiceFeedback(fb)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                        reviewerSpiceFeedback === fb
                          ? "bg-[#1C1311] text-[#FFFBF5] border-[#1C1311]"
                          : "bg-[#F5ECE0] text-[#1C1311] border-[#E5D8C8]"
                      }`}
                    >
                      {fb}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="reviewer-comment"
                  className="block text-xs font-bold text-[#1C1311] mb-1"
                >
                  আপনার মতামত *
                </label>
                <textarea
                  id="reviewer-comment"
                  rows={3}
                  required
                  value={reviewerComment}
                  onChange={(e) => setReviewerComment(e.target.value)}
                  placeholder="খাবারের মান, স্বাদ বা পরিবেশন কেমন লেগেছে লিখুন..."
                  className="w-full p-3 rounded-xl bg-[#FFFBF5] border border-[#D6C7B5] text-sm text-[#1C1311] focus:outline-none focus:border-[#D9381E]"
                />
              </div>

              {reviewErrorMessage && (
                <p className="text-xs font-bold text-[#DC2626]">
                  {reviewErrorMessage}
                </p>
              )}
              {reviewSuccessMessage && (
                <p className="text-xs font-bold text-[#15803D]">
                  {reviewSuccessMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full py-3 px-5 rounded-xl bg-[#D9381E] hover:bg-[#B82D16] disabled:opacity-50 text-[#FFFBF5] font-bold text-sm transition-colors cursor-pointer"
              >
                {isSubmittingReview
                  ? "জমা হচ্ছে..."
                  : "রিভিউ পোস্ট করুন"}
              </button>
            </form>
          </div>

          {/* Right 7 Columns: Customer Review Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-[#1C1311]">
                আড্ডাপ্রিয় গ্রাহকদের মতামত ({toBengaliDigits(reviewsList.length)})
              </h3>
              <span className="text-xs text-[#15803D] font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                ১০০% ভেরিফাইড অর্ডার
              </span>
            </div>

            <div className="space-y-4">
              {reviewsList.map((rev) => {
                const hasVoted = helpfulClickedIds.includes(rev.id);
                return (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-[#F5ECE0]/60 border border-[#E5D8C8] space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1C1311] text-[#F59E0B] font-serif font-bold text-base flex items-center justify-center">
                          {rev.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#1C1311]">
                              {rev.customerName}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-[#FFFBF5] border border-[#E5D8C8] text-[10px] font-bold text-[#D9381E]">
                              {rev.customerTag}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < rev.rating
                                      ? "fill-[#F59E0B] text-[#F59E0B]"
                                      : "text-[#D6C7B5]"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-[#15803D] font-bold">
                              ✓ ভেরিফাইড গ্রাহক
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-lg bg-[#FFFBF5] border border-[#E5D8C8] text-[11px] font-bold text-[#1C1311] flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#D9381E]" />
                        {rev.spiceFeedback}
                      </span>
                    </div>

                    <p className="text-sm text-[#1C1311] leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-[#6B5750]">
                      <span className="text-[11px]">
                        শেষ বিকেলের আড্ডা ক্যাফে থেকে অর্ডারকৃত
                      </span>
                      <button
                        type="button"
                        onClick={() => handleHelpfulClick(rev.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                          hasVoted
                            ? "bg-[#15803D]/15 text-[#15803D] font-bold"
                            : "bg-[#FFFBF5] hover:bg-[#E5D8C8] text-[#6B5750]"
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>সহায়ক ({toBengaliDigits(rev.helpfulCount)})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-14 border-t border-[#E5D8C8]">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#D9381E] font-bold block mb-1">
                আড্ডা আরও জমিয়ে তুলুন
              </span>
              <h2 className="font-serif text-3xl font-black text-[#1C1311]">
                এর সাথে আরও যা অর্ডার করতে পারেন
              </h2>
            </div>
            <Link
              href="/#menu-grid"
              className="text-xs font-bold text-[#D9381E] hover:underline flex items-center gap-1"
            >
              <Utensils className="w-3.5 h-3.5" />
              সব ১২টি খাবার দেখুন →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
