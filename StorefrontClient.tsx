"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Flame,
  Sparkles,
  Search,
  SlidersHorizontal,
  ArrowRight,
  Star,
  Clock,
  ShieldCheck,
  Users,
  X,
  Plus,
  Utensils,
  MapPin,
  Phone,
} from "lucide-react";
import { Product } from "@/db/schema";
import { FEATURED_COLLECTIONS } from "@/db/seed-data";
import { ProductCard } from "./ProductCard";
import { useCart, formatPrice, toBengaliDigits } from "@/context/CartContext";

interface StorefrontClientProps {
  initialProducts: Product[];
}

const CATEGORIES = [
  "সব খাবার",
  "ফুচকা ও চটপটি",
  "চা ও কফি",
  "ফ্রাই ও ফাস্টফুড",
  "মোমো ও চাউমিন",
  "আড্ডা প্লাটার",
];

const SPICE_FILTERS = [
  { value: "all", label: "সব ধরনের স্বাদ", icon: "✨" },
  { value: "0", label: "০-মরিচ (চা/কফি/মিষ্টি)", icon: "☕" },
  { value: "1", label: "১-মরিচ (হালকা চটপটা)", icon: "🌶️" },
  { value: "2", label: "২-মরিচ (আড্ডা স্পেশাল ঝাল)", icon: "🌶️🌶️" },
  { value: "3", label: "৩-মরিচ (নাগা ঝাল)", icon: "🔥" },
];

const CUSTOMER_PERSONAS = [
  {
    id: "all",
    label: "সব গ্রাহকের জন্য",
    desc: "আমাদের সম্পূর্ণ ১২টি আইটেমের মেনু",
    filterFn: () => true,
  },
  {
    id: "fuchka-lovers",
    label: "ফুচকা ও চটপটি প্রেমী",
    desc: "টক-ঝাল ফুচকা (৳৭০), দই ফুচকা ও চটপটি",
    filterFn: (p: Product) => p.category === "ফুচকা ও চটপটি",
  },
  {
    id: "tea-coffee-adda",
    label: "চা ও কফির আড্ডা",
    desc: "নরমাল চা (৳২০), মালাই চা (৳৫০) ও কফি (৳১০০)",
    filterFn: (p: Product) => p.category === "চা ও কফি",
  },
  {
    id: "crispy-fry-lovers",
    label: "চিকেন ফ্রাই ও বার্গার ভক্ত",
    desc: "চিকেন ফ্রাই (৳১৫০), বার্গার ও ফ্রেঞ্চ ফ্রাইজ",
    filterFn: (p: Product) => p.category === "ফ্রাই ও ফাস্টফুড",
  },
  {
    id: "family-kids",
    label: "পরিবার ও বাচ্চাদের পছন্দ",
    desc: "কম ঝাল, সুস্বাদু ও সবার উপযোগী খাবার",
    filterFn: (p: Product) =>
      p.spiceLevel <= 1 ||
      (p.dietaryTags || []).includes("ছোট-বড় সবার প্রিয়"),
  },
  {
    id: "squad-combo",
    label: "বন্ধুদের আড্ডা ও গ্রুপ",
    desc: "মেগা কম্বো প্লাটার, মোমো ও চাউমিন",
    filterFn: (p: Product) =>
      p.category === "আড্ডা প্লাটার" || p.category === "মোমো ও চাউমিন",
  },
];

export function StorefrontClient({ initialProducts }: StorefrontClientProps) {
  const { addItem } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string>("সব খাবার");
  const [selectedCollection, setSelectedCollection] =
    useState<string>("সব কালেকশন");
  const [selectedSpice, setSelectedSpice] = useState<string>("all");
  const [selectedPersona, setSelectedPersona] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  const heroSignatureProduct = useMemo(
    () =>
      initialProducts.find((p) => p.slug === "fuchka-1-plate") ||
      initialProducts[0],
    [initialProducts]
  );

  const squadBoxProduct = useMemo(
    () =>
      initialProducts.find((p) => p.slug === "shesh-bikeler-adda-mega-combo") ||
      initialProducts[0],
    [initialProducts]
  );

  // Top 5 core items specifically requested by the cafe owner
  const coreFiveItems = useMemo(() => {
    const coreSlugs = [
      "fuchka-1-plate",
      "crispy-chicken-fry",
      "normal-tea",
      "special-malai-tea",
      "cafe-special-coffee",
    ];
    return coreSlugs
      .map((slug) => initialProducts.find((p) => p.slug === slug))
      .filter((p): p is Product => Boolean(p));
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    if (selectedCategory !== "সব খাবার") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedCollection !== "সব কালেকশন") {
      list = list.filter((p) => p.collection === selectedCollection);
    }

    if (selectedSpice !== "all") {
      const level = parseInt(selectedSpice, 10);
      if (!isNaN(level)) {
        list = list.filter((p) => p.spiceLevel === level);
      }
    }

    if (selectedPersona !== "all") {
      const personaObj = CUSTOMER_PERSONAS.find(
        (c) => c.id === selectedPersona
      );
      if (personaObj) {
        list = list.filter(personaObj.filterFn);
      }
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          (p.dietaryTags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort(
        (a, b) => parseFloat(b.ratingAvg) - parseFloat(a.ratingAvg)
      );
    } else if (sortBy === "spice-desc") {
      list.sort((a, b) => b.spiceLevel - a.spiceLevel);
    }

    return list;
  }, [
    initialProducts,
    selectedCategory,
    selectedCollection,
    selectedSpice,
    selectedPersona,
    searchQuery,
    sortBy,
  ]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "সব খাবার") count++;
    if (selectedCollection !== "সব কালেকশন") count++;
    if (selectedSpice !== "all") count++;
    if (selectedPersona !== "all") count++;
    if (searchQuery.trim() !== "") count++;
    return count;
  }, [
    selectedCategory,
    selectedCollection,
    selectedSpice,
    selectedPersona,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory("সব খাবার");
    setSelectedCollection("সব কালেকশন");
    setSelectedSpice("all");
    setSelectedPersona("all");
    setSearchQuery("");
    setSortBy("featured");
  };

  const handleSelectCollection = (collectionId: string) => {
    setSelectedCollection(collectionId);
    setSelectedCategory("সব খাবার");
    setSelectedSpice("all");
    setSelectedPersona("all");
    const el = document.getElementById("menu-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectPersona = (personaId: string) => {
    setSelectedPersona(personaId);
    setSelectedCollection("সব কালেকশন");
    setSelectedCategory("সব খাবার");
    setSelectedSpice("all");
    const el = document.getElementById("menu-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* 1. HERO SECTION: 60/40 Asymmetric Split */}
      <section className="relative overflow-hidden pt-8 pb-14 lg:pt-12 lg:pb-20 border-b border-[#E5D8C8] bg-[radial-gradient(circle_at_top_right,#FDE68A_0%,#FFFBF5_58%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left 60% Column (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1311] text-[#FFFBF5] text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                  <span>শেষ বিকেলের আড্ডা • প্রিয় ক্যাফে ও স্ট্রিট ফুড</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5ECE0] border border-[#D6C7B5] text-[#1C1311] text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5 text-[#D9381E]" />
                  <span>নয়াচর বাজার, মোহনগঞ্জ, কুড়িগ্রাম</span>
                </div>
                <a
                  href="tel:01407983465"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#15803D]/15 border border-[#15803D]/30 text-[#15803D] text-xs font-bold hover:bg-[#15803D] hover:text-[#FFFBF5] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>01407983465</span>
                </a>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-black text-[#1C1311] tracking-tight leading-[1.15]">
                বিকেলের রোদ নামলেই শুরু হয়{" "}
                <span className="text-[#D9381E] underline decoration-[#F59E0B] decoration-wavy decoration-2 underline-offset-8">
                  শেষ বিকেলের আড্ডা।
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#6B5750] max-w-2xl leading-relaxed">
                টক-ঝাল তেঁতুল পানির মচমচে <strong className="text-[#1C1311]">ফুচকা (৳৭০)</strong>, গরম গরম <strong className="text-[#1C1311]">চিকেন ফ্রাই (৳১৫০)</strong>, আদা-এলাচের <strong className="text-[#1C1311]">নরমাল চা (৳২০)</strong>, মাটির কাপের ঘন <strong className="text-[#1C1311]">মালাই চা (৳৫০)</strong> এবং ফেনা তোলা <strong className="text-[#1C1311]">কফি (৳১০০)</strong>—ছোট-বড় ও সব ধরনের গ্রাহকের আড্ডার সেরা আয়োজন।
              </p>

              {/* Quick 5-Item Cafe Menu Strip */}
              <div className="p-4 rounded-2xl bg-[#FFFBF5] border-2 border-[#E5D8C8] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#D9381E] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                    ক্যাফের স্পেশাল মেনু (এক ক্লিকে ব্যাগে নিন):
                  </span>
                  <span className="text-[11px] text-[#6B5750] font-semibold">
                    তাজা ও গরম পরিবেশন
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {coreFiveItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => addItem(item, { quantity: 1 })}
                      className="p-2.5 rounded-xl bg-[#F5ECE0]/80 hover:bg-[#D9381E] text-[#1C1311] hover:text-[#FFFBF5] border border-[#E5D8C8] transition-all text-left group cursor-pointer"
                    >
                      <p className="text-xs font-bold truncate">{item.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-extrabold text-[#D9381E] group-hover:text-[#F59E0B]">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-[10px] font-bold bg-[#FFFBF5] text-[#1C1311] px-1.5 py-0.5 rounded">
                          + নিন
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive "Built for Any Customer" Quick-Matcher Bar */}
              <div className="p-4 rounded-2xl bg-[#F5ECE0]/90 border border-[#E5D8C8] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1C1311] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#D9381E]" />
                    আজ কার সাথে আড্ডা দিচ্ছেন? (পছন্দের খাবার বেছে নিন)
                  </span>
                  <span className="text-[11px] text-[#6B5750]">
                    সবার জন্য উন্মুক্ত
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CUSTOMER_PERSONAS.map((persona) => (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => handleSelectPersona(persona.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedPersona === persona.id
                          ? "bg-[#D9381E] text-[#FFFBF5] shadow-sm"
                          : "bg-[#FFFBF5] text-[#1C1311] border border-[#D6C7B5] hover:border-[#D9381E]"
                      }`}
                    >
                      {persona.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="#menu-grid"
                  className="px-7 py-4 rounded-2xl bg-[#D9381E] hover:bg-[#B82D16] text-[#FFFBF5] font-bold text-base shadow-lg shadow-[#D9381E]/30 flex items-center gap-2.5 transition-all hover:-translate-y-0.5"
                >
                  <span>সম্পূর্ণ মেনু দেখুন</span>
                  <ArrowRight className="w-5 h-5" />
                </a>

                {squadBoxProduct && (
                  <button
                    type="button"
                    onClick={() =>
                      addItem(squadBoxProduct, {
                        quantity: 1,
                        openDrawer: true,
                      })
                    }
                    className="px-6 py-4 rounded-2xl bg-[#FFFBF5] hover:bg-[#F5ECE0] text-[#1C1311] border-2 border-[#1C1311] font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                    <span>
                      আড্ডা মেগা কম্বো অর্ডার করুন ({formatPrice(squadBoxProduct.price)})
                    </span>
                  </button>
                )}
              </div>

              {/* Trust Metrics Bar */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-[#E5D8C8] max-w-xl">
                <div>
                  <div className="flex items-center gap-1 text-lg sm:text-xl font-bold text-[#1C1311]">
                    <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    <span>৪.৯৫ / ৫</span>
                  </div>
                  <p className="text-xs text-[#6B5750]">
                    গ্রাহকদের ভেরিফাইড রিভিউ
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-lg sm:text-xl font-bold text-[#1C1311]">
                    <Clock className="w-4 h-4 text-[#D9381E]" />
                    <span>২০ মিনিট</span>
                  </div>
                  <p className="text-xs text-[#6B5750]">
                    গরম ও মচমচে ডেলিভারি
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-lg sm:text-xl font-bold text-[#15803D]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>১০০%</span>
                  </div>
                  <p className="text-xs text-[#6B5750]">
                    হালাল ও মানসম্মত খাবার
                  </p>
                </div>
              </div>
            </div>

            {/* Right 40% Column (5 cols on lg): Hero Platter Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-4 border-[#1C1311] shadow-2xl bg-[#1F1614] aspect-[4/4.3]">
                <img
                  src="/images/fuchka-plate.jpg"
                  alt="শেষ বিকেলের আড্ডা ফুচকা ও ক্যাফে স্পেশাল"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1311]/85 via-transparent to-[#1C1311]/20" />

                {/* Top Floating Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#D9381E] text-[#FFFBF5] text-xs font-bold shadow-md">
                    🔥 ক্যাফে স্পেশাল ও তাজা পরিবেশন
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#1C1311]/90 text-[#F59E0B] text-xs font-bold">
                    ৳২০ থেকে শুরু
                  </span>
                </div>

                {/* Bottom Interactive Featured Dish Overlay Card */}
                {heroSignatureProduct && (
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#FFFBF5]/95 backdrop-blur-md border border-[#E5D8C8] shadow-xl flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-[#D9381E] block">
                        #১ গ্রাহক পছন্দের সেরা আইটেম
                      </span>
                      <Link
                        href={`/products/${heroSignatureProduct.slug}`}
                        className="font-serif text-lg font-black text-[#1C1311] hover:text-[#D9381E] truncate block"
                      >
                        {heroSignatureProduct.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-extrabold text-[#1C1311]">
                          {formatPrice(heroSignatureProduct.price)}
                        </span>
                        <span className="text-xs text-[#6B5750]">
                          • তেঁতুল টক ও ডিম কুচিসহ
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => addItem(heroSignatureProduct)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#D9381E] hover:bg-[#B82D16] text-[#FFFBF5] font-bold text-xs flex items-center gap-1 flex-shrink-0 shadow-md transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ব্যাগে নিন</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE TICKER MARQUEE */}
      <div className="bg-[#1F1614] text-[#FFFBF5] py-3.5 border-b border-[#332521] overflow-hidden">
        <div className="animate-marquee flex items-center gap-8 text-xs font-bold tracking-wider">
          {Array.from({ length: 2 }).map((_, loopIdx) => (
            <React.Fragment key={loopIdx}>
              <span className="flex items-center gap-2 text-[#F59E0B]">
                <Flame className="w-4 h-4 text-[#D9381E] fill-[#D9381E]" />
                ফুচকা (১ প্লেট - ৭০ টাকা)
              </span>
              <span className="text-[#A38F85]">•</span>
              <span>চিকেন ফ্রাই (১৫০ টাকা)</span>
              <span className="text-[#A38F85]">•</span>
              <span className="text-[#4ADE80]">
                নরমাল চা (২০ টাকা) • মালাই চা (৫০ টাকা) • কফি (১০০ টাকা)
              </span>
              <span className="text-[#A38F85]">•</span>
              <span>স্পেশাল দই ফুচকা (১২০ টাকা) ও চটপটি (৮০ টাকা)</span>
              <span className="text-[#A38F85]">•</span>
              <span className="text-[#F59E0B]">
                ক্রিস্পি চিকেন মোমো • চিকেন চাউমিন • বিফ চিজ বার্গার
              </span>
              <span className="text-[#A38F85]">•</span>
              <span>শেষ বিকেলের আড্ডা মেগা কম্বো প্লাটার (৪৫০ টাকা)</span>
              <span className="text-[#A38F85]">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. FEATURED COLLECTIONS SHOWCASE (#collections) */}
      <section
        id="collections"
        className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#D9381E] font-bold block mb-2">
              বিকেলের মুড ও আড্ডার আয়োজন
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#1C1311] tracking-tight">
              আমাদের জনপ্রিয় কালেকশনসমূহ
            </h2>
          </div>
          <p className="text-sm text-[#6B5750] max-w-md">
            যেকোনো কালেকশনে ক্লিক করে আপনার পছন্দের খাবারগুলো দেখে নিন—ফুচকা ও চটপটি থেকে শুরু করে মালাই চা, কফি ও ক্যাফে স্ন্যাকস।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_COLLECTIONS.map((col) => {
            const isSelected = selectedCollection === col.id;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() =>
                  handleSelectCollection(isSelected ? "সব কালেকশন" : col.id)
                }
                className={`group text-left relative rounded-2xl overflow-hidden border-2 transition-all duration-300 flex flex-col justify-end min-h-[310px] p-5 cursor-pointer ${
                  isSelected
                    ? "border-[#D9381E] ring-4 ring-[#D9381E]/25 -translate-y-1"
                    : "border-[#E5D8C8] hover:border-[#D9381E] hover:-translate-y-1.5"
                }`}
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1311] via-[#1C1311]/55 to-transparent" />

                <div className="relative z-10 w-full">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#D9381E] text-[#FFFBF5] text-[10px] font-bold">
                      {col.badge}
                    </span>
                    <span className="text-[11px] text-[#F59E0B] font-bold">
                      {col.itemCount}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-black text-[#FFFBF5] group-hover:text-[#F59E0B] transition-colors leading-tight">
                    {col.title}
                  </h3>
                  <p className="text-xs font-bold text-[#E5D8C8] mt-0.5">
                    {col.subtitle}
                  </p>
                  <p className="text-xs text-[#D6C7B5] mt-2 line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#FFFBF5]/15 flex items-center justify-between text-xs font-bold text-[#F59E0B]">
                    <span>
                      {isSelected ? "কালেকশন নির্বাচন করা হয়েছে ✓" : "খাবারগুলো দেখুন"}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. PRODUCT GRID WITH FILTERS, SEARCH & SORTING (#menu-grid) */}
      <section
        id="menu-grid"
        className="py-12 lg:py-16 bg-[#F5ECE0]/50 border-t border-b border-[#E5D8C8]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title + Search & Sort Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#D9381E] font-bold block mb-2">
                ১০০% তাজা ও স্বাস্থ্যসম্মত • অর্ডার পাওয়ার পর প্রস্তুতকৃত
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#1C1311] tracking-tight">
                শেষ বিকেলের আড্ডার মেনু তালিকা
              </h2>
            </div>

            {/* Search Input + Sort Select */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative min-w-[260px] sm:min-w-[300px]">
                <Search className="w-4 h-4 text-[#6B5750] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="খুঁজুন: ফুচকা, চিকেন ফ্রাই, মালাই চা, কফি..."
                  className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#FFFBF5] border border-[#D6C7B5] text-sm text-[#1C1311] placeholder:text-[#6B5750] focus:outline-none focus:border-[#D9381E]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="সার্চ মুছুন"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B5750] hover:text-[#1C1311]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#D9381E] hidden sm:block" />
                <select
                  aria-label="খাবার সাজান"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-11 px-4 rounded-xl bg-[#FFFBF5] border border-[#D6C7B5] text-sm font-bold text-[#1C1311] focus:outline-none focus:border-[#D9381E] cursor-pointer"
                >
                  <option value="featured">সাজান: জনপ্রিয় আইটেম</option>
                  <option value="rating">সাজান: সর্বোচ্চ রেটিং ★</option>
                  <option value="price-asc">সাজান: দাম (কম → বেশি)</option>
                  <option value="price-desc">সাজান: দাম (বেশি → কম)</option>
                  <option value="spice-desc">সাজান: ঝালের মাত্রা 🌶️</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Control Panel: Category Tabs + Spice Level Pills */}
          <div className="bg-[#FFFBF5] p-4 sm:p-5 rounded-2xl border border-[#E5D8C8] shadow-xs mb-8 space-y-4">
            {/* Row 1: Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#6B5750] mr-2 flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-[#D9381E]" />
                ক্যাটাগরি:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#1C1311] text-[#FFFBF5] shadow-xs"
                      : "bg-[#F5ECE0] text-[#1C1311] hover:bg-[#E5D8C8]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Row 2: Spice Level Filter Pills */}
            <div className="pt-3 border-t border-[#E5D8C8] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#6B5750] mr-2 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#D9381E]" />
                  ঝালের মাত্রা:
                </span>
                {SPICE_FILTERS.map((sp) => (
                  <button
                    key={sp.value}
                    type="button"
                    onClick={() => setSelectedSpice(sp.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedSpice === sp.value
                        ? "bg-[#D9381E] text-[#FFFBF5] shadow-xs"
                        : "bg-[#F5ECE0]/70 text-[#1C1311] border border-[#E5D8C8] hover:border-[#D9381E]"
                    }`}
                  >
                    {sp.icon} {sp.label}
                  </button>
                ))}
              </div>

              {/* Active Filters Summary & Reset */}
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-xs text-[#6B5750]">
                  দেখানো হচ্ছে{" "}
                  <strong className="text-[#1C1311]">
                    {toBengaliDigits(filteredProducts.length)}
                  </strong>
                  টি (মোট {toBengaliDigits(initialProducts.length)}টি খাবার)
                </span>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-3 py-1.5 rounded-lg bg-[#D9381E]/10 hover:bg-[#D9381E] text-[#D9381E] hover:text-[#FFFBF5] text-xs font-bold transition-colors cursor-pointer"
                  >
                    ফিল্টার রিসেট ({toBengaliDigits(activeFilterCount)})
                  </button>
                )}
              </div>
            </div>

            {/* Active Collection / Persona Banner if active */}
            {(selectedCollection !== "সব কালেকশন" ||
              selectedPersona !== "all") && (
              <div className="pt-3 border-t border-[#E5D8C8] flex flex-wrap items-center gap-2">
                {selectedCollection !== "সব কালেকশন" && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1311] text-[#F59E0B] text-xs font-bold">
                    কালেকশন: {selectedCollection}
                    <button
                      type="button"
                      onClick={() => setSelectedCollection("সব কালেকশন")}
                      className="hover:text-[#FFFBF5]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {selectedPersona !== "all" && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9381E] text-[#FFFBF5] text-xs font-bold">
                    পছন্দ:{" "}
                    {
                      CUSTOMER_PERSONAS.find((c) => c.id === selectedPersona)
                        ?.label
                    }
                    <button
                      type="button"
                      onClick={() => setSelectedPersona("all")}
                      className="hover:text-[#1C1311]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-[#FFFBF5] rounded-2xl border border-[#E5D8C8] p-12 text-center max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#F5ECE0] text-[#D9381E] flex items-center justify-center mx-auto mb-4">
                <Flame className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1311]">
                এই ফিল্টারে কোনো খাবার পাওয়া যায়নি
              </h3>
              <p className="text-sm text-[#6B5750] mt-2">
                অনুগ্রহ করে ফিল্টার বা সার্চ পরিবর্তন করে আমাদের সম্পূর্ণ মেনু তালিকা দেখুন।
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 px-6 py-3 rounded-xl bg-[#D9381E] text-[#FFFBF5] font-bold text-sm hover:bg-[#B82D16] transition-colors cursor-pointer"
              >
                সব ১২টি খাবার দেখুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. SPICE & CUSTOMER INCLUSIVITY GUIDE (#spice-guide) */}
      <section
        id="spice-guide"
        className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl bg-[#1F1614] text-[#FFFBF5] p-6 sm:p-10 lg:p-12 border border-[#332521] shadow-xl">
          <div className="max-w-3xl mb-10">
            <span className="text-xs uppercase tracking-wider text-[#F59E0B] font-bold block mb-2">
              সব ধরনের গ্রাহকের রুচির প্রতি সম্মান
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#FFFBF5] tracking-tight">
              শেষ বিকেলের আড্ডার ঝাল ও স্বাদ গাইড
            </h2>
            <p className="text-sm sm:text-base text-[#D6C7B5] mt-2 leading-relaxed">
              আমাদের ক্যাফেতে বাচ্চা থেকে শুরু করে বয়স্ক কিংবা ঝালপ্রেমী তরুণ—সবার জন্যই রয়েছে পছন্দসই কাস্টমাইজেশন সুবিধা। অর্ডার করার সময় আপনার ইচ্ছেমতো ঝালের মাত্রা বেছে নিতে পারবেন।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-[#2A1E1B] border border-[#3E2D29] flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-md bg-[#15803D]/25 text-[#4ADE80] text-xs font-bold mb-3">
                  ০-মরিচ • গরম পানীয় ও মিষ্টি
                </span>
                <h3 className="font-serif text-xl font-bold text-[#FFFBF5]">
                  চা, কফি ও বাচ্চাদের প্রিয়
                </h3>
                <p className="text-xs text-[#D6C7B5] mt-2 leading-relaxed">
                  নরমাল চা (৳২০), মাটির কাপের মালাই চা (৳৫০) এবং গরম ক্যাপুচিনো কফি (৳১০০)—একদমই ঝাল ছাড়া সতেজ স্বাদ।
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedSpice("0");
                  document
                    .getElementById("menu-grid")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-5 text-left text-xs font-bold text-[#4ADE80] hover:underline cursor-pointer"
              >
                ০-মরিচ আইটেম দেখুন →
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#2A1E1B] border border-[#3E2D29] flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-md bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-bold mb-3">
                  ১-মরিচ • হালকা চটপটা
                </span>
                <h3 className="font-serif text-xl font-bold text-[#FFFBF5]">
                  পরিবার ও হালকা স্ন্যাকস
                </h3>
                <p className="text-xs text-[#D6C7B5] mt-2 leading-relaxed">
                  স্পেশাল দই ফুচকা, চিকেন চাউমিন এবং পেরি-পেরি ফ্রেঞ্চ ফ্রাইজ—মৃদু মসলার চমৎকার স্বাদ যা ছোট-বড় সবাই উপভোগ করতে পারে।
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedSpice("1");
                  document
                    .getElementById("menu-grid")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-5 text-left text-xs font-bold text-[#F59E0B] hover:underline cursor-pointer"
              >
                ১-মরিচ স্ন্যাকস দেখুন →
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#2A1E1B] border border-[#3E2D29] flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-md bg-[#FB923C]/20 text-[#FB923C] text-xs font-bold mb-3">
                  ২-মরিচ • আড্ডা স্পেশাল ঝাল
                </span>
                <h3 className="font-serif text-xl font-bold text-[#FFFBF5]">
                  স্ট্রিট ফুড ও ক্যাফে ক্ল্যাসিক
                </h3>
                <p className="text-xs text-[#D6C7B5] mt-2 leading-relaxed">
                  আমাদের সিগনেচার ফুচকা (৳৭০), চিকেন ফ্রাই (৳১৫০), মসলাদার চটপটি, চিকেন মোমো এবং বিফ চিজ বার্গার।
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedSpice("2");
                  document
                    .getElementById("menu-grid")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-5 text-left text-xs font-bold text-[#FB923C] hover:underline cursor-pointer"
              >
                ২-মরিচ খাবার দেখুন →
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#2A1E1B] border border-[#D9381E]/50 flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-md bg-[#D9381E] text-[#FFFBF5] text-xs font-bold mb-3">
                  ৩-মরিচ • নাগা ফায়ার ঝাল
                </span>
                <h3 className="font-serif text-xl font-bold text-[#FFFBF5]">
                  কড়া ঝালপ্রেমীদের পছন্দ
                </h3>
                <p className="text-xs text-[#D6C7B5] mt-2 leading-relaxed">
                  যেকোনো ফুচকা, চটপটি বা চিকেন ফ্রাইয়ের প্রোডাক্ট পেজ থেকে ৩-মরিচ (সিলেটি নাগা মরিচের ঝাল) কাস্টমাইজ করে নিতে পারবেন!
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("সব খাবার");
                  setSelectedSpice("all");
                  document
                    .getElementById("menu-grid")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-5 text-left text-xs font-bold text-[#F87171] hover:underline cursor-pointer"
              >
                পছন্দের খাবারে নাগা ঝাল নিন →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
