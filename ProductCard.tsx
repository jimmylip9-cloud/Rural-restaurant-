"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Flame, Star, Plus, Check, Clock } from "lucide-react";
import { Product } from "@/db/schema";
import { useCart, formatPrice, toBengaliDigits } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/images/fuchka-plate.jpg";

  const isVeg =
    (product.dietaryTags || []).includes("ভেজিটেরিয়ান") ||
    (product.dietaryTags || []).includes("ভেজিটেরিয়ান অপশন");

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, { quantity: 1 });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1100);
  };

  return (
    <div className="group bg-[#F5ECE0] rounded-2xl border border-[#E5D8C8] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_34px_-10px_rgba(28,19,17,0.14)] hover:border-[#D9381E]/40">
      {/* 1. Product Image Container with Badges */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#1F1614] block"
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1311]/65 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top-left Signature Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-full bg-[#1C1311]/90 backdrop-blur-xs text-[#F59E0B] text-[11px] font-bold tracking-wide shadow-sm">
              {product.badge}
            </span>
          )}
          {isVeg && (
            <span className="px-2 py-0.5 rounded-full bg-[#15803D] text-[#FFFBF5] text-[10px] font-bold">
              ভেজ
            </span>
          )}
        </div>

        {/* Top-right Chili Spice Indicator */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#FFFBF5]/95 backdrop-blur-xs border border-[#E5D8C8] flex items-center gap-0.5 shadow-sm"
          title={`ঝালের মাত্রা: ৩-এর মধ্যে ${toBengaliDigits(product.spiceLevel)}`}
        >
          {product.spiceLevel === 0 ? (
            <span className="text-[10px] font-bold text-[#15803D]">
              ঝাল ছাড়া / মিষ্টি
            </span>
          ) : (
            Array.from({ length: 3 }).map((_, idx) => (
              <Flame
                key={idx}
                className={`w-3.5 h-3.5 ${
                  idx < product.spiceLevel
                    ? "text-[#D9381E] fill-[#D9381E]"
                    : "text-[#D6C7B5]"
                }`}
              />
            ))
          )}
        </div>

        {/* Bottom-left Category & Prep Time Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[#FFFBF5] text-xs">
          <span className="text-[11px] bg-[#1C1311]/80 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-[#E5D8C8]">
            {product.category}
          </span>
          <span className="text-[11px] bg-[#1C1311]/80 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#F59E0B]" />
            {toBengaliDigits(product.prepTimeMinutes)} মি.
          </span>
        </div>
      </Link>

      {/* 2 & 3. Title, Rating & Short Flavor Teaser */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1 text-xs font-bold text-[#1C1311]">
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <span>{toBengaliDigits(product.ratingAvg)}</span>
              <span className="text-[#6B5750] font-normal">
                ({toBengaliDigits(product.reviewCount)}টি রিভিউ)
              </span>
            </div>
            <span className="text-[11px] text-[#6B5750]">
              {product.servingSize}
            </span>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="block group-hover:text-[#D9381E] transition-colors"
          >
            <h3 className="font-serif text-xl font-bold text-[#1C1311] group-hover:text-[#D9381E] transition-colors leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-[#6B5750] mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* 4. Price + Quick Add to Bag CTA */}
        <div className="mt-5 pt-3.5 border-t border-[#E5D8C8] flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-[#1C1311]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#6B5750] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <Link
              href={`/products/${product.slug}`}
              className="text-[11px] font-bold text-[#D9381E] hover:underline block"
            >
              কাস্টমাইজ ও রিভিউ →
            </Link>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all duration-200 cursor-pointer ${
              justAdded
                ? "bg-[#15803D] text-[#FFFBF5] scale-95"
                : "bg-[#D9381E] hover:bg-[#B82D16] text-[#FFFBF5] hover:shadow-md"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>যোগ হয়েছে!</span>
              </>
            ) : (
              <>
                <span>ব্যাগে নিন</span>
                <Plus className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
