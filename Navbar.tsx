"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  Clock,
  UtensilsCrossed,
  MapPin,
  Phone,
  MessageCircle,
  Store,
} from "lucide-react";
import { useCart, formatPrice, toBengaliDigits } from "@/context/CartContext";

export function Navbar() {
  const { openCart, itemCount, subtotal } = useCart();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadSellerMessages, setUnreadSellerMessages] = useState(0);

  useEffect(() => {
    let mounted = true;
    const loadSellerBadge = async () => {
      try {
        const res = await fetch("/api/messages");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && typeof data.totalUnreadForSeller === "number") {
          setUnreadSellerMessages(data.totalUnreadForSeller);
        }
      } catch {
        // ignore network poll errors
      }
    };
    loadSellerBadge();
    const interval = setInterval(loadSellerBadge, 6000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const triggerCustomerChat = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-customer-chat"));
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Midnight Charcoal Announcement Bar */}
      <div className="bg-[#1F1614] text-[#FFFBF5] text-xs border-b border-[#332521]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#15803D]/25 text-[#4ADE80] text-[11px] font-bold tracking-wide border border-[#15803D]/40 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
              ক্যাফে খোলা
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[#E5D8C8] font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-[#D9381E] flex-shrink-0" />
              নয়াচর বাজার, মোহনগঞ্জ, কুড়িগ্রাম
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] flex-shrink-0">
            <a
              href="tel:01407983465"
              className="text-[#4ADE80] hover:text-[#FFFBF5] font-bold flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>হটলাইন: 01407983465</span>
            </a>
            <span className="hidden sm:inline text-[#A38F85]">|</span>
            <Link
              href="/seller"
              className="text-[#F59E0B] hover:underline font-bold flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" />
              <span>সেলার ইনবক্স ও অর্ডার ড্যাশবোর্ড</span>
              {unreadSellerMessages > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#D9381E] text-[#FFFBF5] text-[10px]">
                  {toBengaliDigits(unreadSellerMessages)}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <div className="bg-[#FFFBF5]/95 backdrop-blur-md border-b border-[#E5D8C8] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#D9381E] text-[#FFFBF5] flex items-center justify-center shadow-md shadow-[#D9381E]/25 group-hover:scale-105 group-hover:rotate-[-3deg] transition-transform">
              <Flame className="w-6 h-6 fill-[#F59E0B] text-[#FFFBF5]" />
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-[26px] font-black tracking-tight text-[#1C1311] block leading-none">
                শেষ বিকেলের <span className="text-[#D9381E]">আড্ডা</span>
              </span>
              <span className="text-[11px] font-semibold text-[#6B5750] block mt-1">
                নয়াচর বাজার, মোহনগঞ্জ, কুড়িগ্রাম • 01407983465
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/#menu-grid"
              className="text-sm font-bold text-[#1C1311] hover:text-[#D9381E] transition-colors py-2"
            >
              সম্পূর্ণ মেনু
            </Link>
            <Link
              href="/#collections"
              className="text-sm font-bold text-[#1C1311] hover:text-[#D9381E] transition-colors py-2"
            >
              জনপ্রিয় কালেকশন
            </Link>
            <button
              type="button"
              onClick={triggerCustomerChat}
              className="text-sm font-bold text-[#15803D] hover:text-[#D9381E] transition-colors py-2 flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>লাইভ চ্যাট (মেসেজ দিন)</span>
            </button>
            <Link
              href="/seller"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                pathname === "/seller"
                  ? "bg-[#D9381E] text-[#FFFBF5] border-[#D9381E]"
                  : "bg-[#F5ECE0] text-[#1C1311] border-[#D6C7B5] hover:border-[#D9381E]"
              }`}
            >
              <Store className="w-3.5 h-3.5 text-[#D9381E]" />
              <span>সেলার ইনবক্স ও অর্ডার</span>
              {unreadSellerMessages > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#15803D] text-[#FFFBF5] text-[10px] font-extrabold">
                  {toBengaliDigits(unreadSellerMessages)}
                </span>
              )}
            </Link>
          </nav>

          {/* Right Action Area: Adda Bag Trigger + Mobile Menu Button */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={openCart}
              aria-label="আড্ডা ব্যাগ খুলুন"
              className="relative inline-flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-full bg-[#1C1311] hover:bg-[#D9381E] text-[#FFFBF5] font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div className="relative flex items-center">
                <ShoppingBag className="w-4 h-4 text-[#F59E0B] group-hover:text-[#FFFBF5] transition-colors" />
                {itemCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-[#D9381E] group-hover:bg-[#1C1311] text-[#FFFBF5]">
                    {toBengaliDigits(itemCount)}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">আড্ডা ব্যাগ</span>
              {subtotal > 0 && (
                <span className="text-xs font-bold text-[#F59E0B] group-hover:text-[#FFFBF5] border-l border-[#FFFBF5]/20 pl-2.5">
                  {formatPrice(subtotal)}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="মেনু টগল করুন"
              className="lg:hidden p-2.5 rounded-xl border border-[#E5D8C8] bg-[#F5ECE0] text-[#1C1311] hover:bg-[#E5D8C8] transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFFBF5] border-b border-[#E5D8C8] px-4 pt-3 pb-5 space-y-2">
            <div className="px-4 py-2.5 rounded-xl bg-[#1F1614] text-[#FFFBF5] text-xs space-y-1 mb-2">
              <p className="flex items-center gap-1.5 font-bold text-[#F59E0B]">
                <MapPin className="w-3.5 h-3.5 text-[#D9381E]" />
                নয়াচর বাজার, মোহনগঞ্জ, কুড়িগ্রাম
              </p>
              <a
                href="tel:01407983465"
                className="flex items-center gap-1.5 font-bold text-[#4ADE80]"
              >
                <Phone className="w-3.5 h-3.5" />
                ফোন: 01407983465
              </a>
            </div>
            <Link
              href="/#menu-grid"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#F5ECE0]/70 text-[#1C1311] font-bold text-sm"
            >
              <span className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-[#D9381E]" />
                সম্পূর্ণ মেনু দেখুন
              </span>
              <span className="text-xs text-[#6B5750]">১২টি খাবার</span>
            </Link>
            <button
              type="button"
              onClick={triggerCustomerChat}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#15803D]/10 text-[#15803D] font-bold text-sm"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                সেলারকে মেসেজ দিন (লাইভ চ্যাট)
              </span>
              <span className="text-xs font-bold">চ্যাট করুন →</span>
            </button>
            <Link
              href="/seller"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#1C1311] text-[#FFFBF5] font-bold text-sm"
            >
              <span className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#F59E0B]" />
                সেলার ইনবক্স ও অর্ডার তালিকা
              </span>
              <span className="text-xs font-bold text-[#F59E0B]">
                ড্যাশবোর্ড →
              </span>
            </Link>
            <Link
              href="/checkout"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#D9381E]/10 text-[#D9381E] font-bold text-sm"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                দ্রুত চেকআউট
              </span>
              <span className="text-xs font-bold">অর্ডার করুন →</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
