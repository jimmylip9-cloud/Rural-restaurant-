import React from "react";
import Link from "next/link";
import { Flame, Clock, MapPin, Phone, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1F1614] text-[#FFFBF5] border-t border-[#332521]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D9381E] text-[#FFFBF5] flex items-center justify-center">
                <Flame className="w-5 h-5 fill-[#F59E0B]" />
              </div>
              <div>
                <span className="font-serif text-2xl font-black tracking-tight text-[#FFFBF5] block leading-none">
                  শেষ বিকেলের <span className="text-[#F59E0B]">আড্ডা</span>
                </span>
                <span className="text-[11px] text-[#A38F85] block mt-1">
                  নয়াচর বাজার, মোহনগঞ্জ, কুড়িগ্রাম
                </span>
              </div>
            </div>
            <p className="text-sm text-[#D6C7B5] leading-relaxed">
              বিকেলের মিষ্টি রোদে বন্ধুদের সাথে আড্ডা কিংবা পরিবারের সাথে সন্ধ্যা কাটানোর প্রিয় ঠিকানা। আমাদের মচমচে ফুচকা (৳৭০), চিকেন ফ্রাই (৳১৫০), নরমাল চা (৳২০), মালাই চা (৳৫০) এবং গরম কফি (৳১০০) তৈরি করা হয় <strong className="text-[#FFFBF5]">যেকোনো বয়সের ও যেকোনো রুচির গ্রাহকের</strong> কথা মাথায় রেখে।
            </p>
            <div className="flex items-center gap-2 text-xs text-[#4ADE80] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>১০০% হালাল ও স্বাস্থ্যসম্মত পরিবেশে প্রস্তুত</span>
            </div>
          </div>

          {/* Column 2: Curated Collections */}
          <div>
            <h3 className="font-serif text-lg font-bold text-[#F59E0B] mb-4">
              জনপ্রিয় কালেকশন
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D6C7B5]">
              <li>
                <Link
                  href="/#collections"
                  className="hover:text-[#FFFBF5] transition-colors"
                >
                  বিকেলের ফুচকা ও চটপটি (৳৭০ থেকে শুরু)
                </Link>
              </li>
              <li>
                <Link
                  href="/#collections"
                  className="hover:text-[#FFFBF5] transition-colors"
                >
                  ধোঁয়া ওঠা চা ও কফির চুমুক (৳২০ – ৳১০০)
                </Link>
              </li>
              <li>
                <Link
                  href="/#collections"
                  className="hover:text-[#FFFBF5] transition-colors"
                >
                  মচমচে ফ্রাই ও ক্যাফে স্ন্যাকস (চিকেন ফ্রাই ও বার্গার)
                </Link>
              </li>
              <li>
                <Link
                  href="/#collections"
                  className="hover:text-[#FFFBF5] transition-colors"
                >
                  বন্ধুদের আড্ডা কম্বো ও প্লাটার
                </Link>
              </li>
              <li>
                <Link
                  href="/checkout"
                  className="text-[#F59E0B] font-bold hover:underline"
                >
                  সরাসরি অর্ডার ও চেকআউট →
                </Link>
              </li>
              <li>
                <Link
                  href="/seller"
                  className="text-[#4ADE80] font-bold hover:underline"
                >
                  সেলার ইনবক্স ও অর্ডার তালিকা →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Built For Every Craver */}
          <div>
            <h3 className="font-serif text-lg font-bold text-[#F59E0B] mb-4">
              সব ধরনের গ্রাহকের জন্য
            </h3>
            <ul className="space-y-2.5 text-xs text-[#D6C7B5]">
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#332521] text-[#4ADE80] font-bold">
                  ০-মরিচ
                </span>
                <span>নরমাল চা, মালাই চা, কফি ও বাচ্চাদের খাবার</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#332521] text-[#F59E0B] font-bold">
                  ১-মরিচ
                </span>
                <span>দই ফুচকা, চাউমিন ও হালকা চটপটা ফ্রাইজ</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#332521] text-[#FB923C] font-bold">
                  ২-মরিচ
                </span>
                <span>ফুচকা, চটপটি, চিকেন ফ্রাই ও মোমো</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#D9381E]/30 text-[#F87171] font-bold">
                  ৩-মরিচ
                </span>
                <span>নাগা মরিচের স্পেশাল ঝাল কাস্টমাইজেশন</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Kitchen Hours & Contact */}
          <div className="space-y-3.5 text-sm text-[#D6C7B5]">
            <h3 className="font-serif text-lg font-bold text-[#F59E0B] mb-4">
              ক্যাফের সময়সূচি ও ঠিকানা
            </h3>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#D9381E] mt-1 flex-shrink-0" />
              <div>
                <p className="font-bold text-[#FFFBF5]">প্রতিদিন: দুপুর ৩:০০টা – রাত ১২:০০টা</p>
                <p className="text-xs text-[#A38F85]">
                  বিকেলের চায়ের আড্ডা থেকে রাতের খাবার পর্যন্ত
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D9381E] mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#FFFBF5]">
                  নয়াচর বাজার, মোহনগঞ্জ, কুড়িগ্রাম
                </p>
                <p className="text-xs text-[#A38F85]">
                  ক্যাফেতে বসে খাওয়া ও দ্রুত হোম ডেলিভারি সুবিধা
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D9381E] flex-shrink-0" />
              <div>
                <a
                  href="tel:01407983465"
                  className="text-sm font-bold text-[#4ADE80] hover:underline block"
                >
                  01407983465 (০১৪০৭-৯৮৩৪৬৫)
                </a>
                <span className="text-[11px] text-[#A38F85]">
                  সরাসরি কল বা অর্ডার হটলাইন
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#332521] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A38F85]">
          <p>
            © ২০২৬ শেষ বিকেলের আড্ডা (নয়াচর বাজার, মোহনগঞ্জ, কুড়িগ্রাম)। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="flex items-center gap-1.5">
            ভালোবাসার সাথে তৈরি <Heart className="w-3.5 h-3.5 text-[#D9381E] fill-[#D9381E]" /> প্রতিটি আড্ডাপ্রিয় মানুষের জন্য
          </p>
        </div>
      </div>
    </footer>
  );
}
