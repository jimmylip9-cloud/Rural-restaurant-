import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Hind_Siliguri, Noto_Serif_Bengali, Space_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { SlideOutCart } from "@/components/SlideOutCart";
import { CustomerChatWidget } from "@/components/CustomerChatWidget";
import { Footer } from "@/components/Footer";

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-fraunces",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "শেষ বিকেলের আড্ডা | নয়াচর বাজার, মোহনগঞ্জ, কুড়িগ্রাম",
  description:
    "শেষ বিকেলের আড্ডায় আপনাকে স্বাগতম! মচমচে ফুচকা (৭০ টাকা), চিকেন ফ্রাই (১৫০ টাকা), নরমাল চা (২০ টাকা), মালাই চা (৫০ টাকা), গরম কফি (১০০ টাকা) ও জনপ্রিয় সব ক্যাফে স্ন্যাকস এখন এক ক্লিকেই।",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="bn"
      className={`${notoSerifBengali.variable} ${hindSiliguri.variable} ${spaceMono.variable}`}
    >
      <body className="bg-[#FFFBF5] text-[#1C1311] antialiased min-h-screen flex flex-col selection:bg-[#D9381E] selection:text-[#FFFBF5]">
        <CartProvider>
          <Navbar />
          <SlideOutCart />
          <main className="flex-1">{children}</main>
          <CustomerChatWidget />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
