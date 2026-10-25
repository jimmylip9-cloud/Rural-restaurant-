"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Flame,
  ShoppingBag,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  RefreshCw,
  Send,
  User,
  Receipt,
  Sparkles,
  ArrowLeft,
  Bell,
  Banknote,
  Utensils,
} from "lucide-react";
import { formatPrice, toBengaliDigits } from "@/context/CartContext";

interface OrderItemRecord {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  priceAtPurchase: number;
  customizations?: {
    spiceLevel?: string;
    addons?: { id: string; name: string; price: number }[];
    notes?: string;
  };
}

interface OrderRecord {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  fulfillmentType: string;
  spicePreference: string;
  orderNotes: string | null;
  paymentMethod: string;
  promoCode: string | null;
  discountAmount: number;
  deliveryFee: number;
  totalAmount: number;
  status: string;
  estimatedMinutes: number;
  createdAt: string;
  items: OrderItemRecord[];
}

interface ConversationRecord {
  id: number;
  sessionKey: string;
  customerName: string;
  customerPhone: string;
  lastMessageText: string;
  unreadBySeller: number;
  unreadByCustomer: number;
  updatedAt: string;
}

interface ChatMessageRecord {
  id: number;
  conversationId: number;
  senderRole: "customer" | "seller";
  senderName: string;
  messageText: string;
  createdAt: string;
}

const ORDER_STATUS_OPTIONS = [
  "অর্ডার কনফার্মড ও রান্নাঘরে প্রস্তুত হচ্ছে",
  "খাবার প্রস্তুত • ডেলিভারির পথে",
  "ডেলিভারি সম্পন্ন হয়েছে ✓",
  "বাতিল করা হয়েছে",
];

const SELLER_QUICK_REPLIES = [
  "জি ধন্যবাদ! আপনার অর্ডারটি আমাদের রান্নাঘরে গরম গরম প্রস্তুত হচ্ছে, ইনশাআল্লাহ ২০ মিনিটের মধ্যে পৌঁছে যাবে।",
  "হ্যাঁ ভাইয়া/আপু, আমাদের মচমচে ফুচকা (৳৭০), চিকেন ফ্রাই (৳১৫০), নরমাল চা (৳২০), মালাই চা (৳৫০) এবং কফি (৳১০০) এখন পাওয়া যাচ্ছে!",
  "আমাদের ক্যাফের ঠিকানা: নয়াচর বাজার, মোহনগঞ্জ, কুড়িগ্রাম। সরাসরি কথা বলতে কল করুন: 01407983465",
  "আপনার বিশেষ নির্দেশনাটি আমরা নোট করে নিয়েছি, আপনার পছন্দমতোই খাবার প্রস্তুত করে পাঠানো হবে।",
];

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "inbox">("orders");

  // Orders State
  const [ordersList, setOrdersList] = useState<OrderRecord[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  // Inbox State
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState<number>(0);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [activeMessages, setActiveMessages] = useState<ChatMessageRecord[]>([]);
  const [replyText, setReplyText] = useState<string>("");
  const [isSendingReply, setIsSendingReply] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.orders)) {
        setOrdersList(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch seller orders:", err);
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.conversations)) {
        setConversations(data.conversations);
        setTotalUnreadMessages(data.totalUnreadForSeller || 0);
        if (
          selectedConversationId === null &&
          data.conversations.length > 0
        ) {
          setSelectedConversationId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch seller inbox:", err);
    }
  }, [selectedConversationId]);

  const fetchActiveConversationMessages = useCallback(
    async (convId: number) => {
      try {
        const res = await fetch(`/api/messages?conversationId=${convId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setActiveMessages(data.messages);
          // Also update unread badge locally for this conversation
          setConversations((prev) =>
            prev.map((c) =>
              c.id === convId ? { ...c, unreadBySeller: 0 } : c
            )
          );
        }
      } catch (err) {
        console.error("Failed to load conversation messages:", err);
      }
    },
    []
  );

  // Initial load and polling every 5 seconds
  useEffect(() => {
    fetchOrders();
    fetchConversations();
    const interval = setInterval(() => {
      fetchOrders();
      fetchConversations();
      if (selectedConversationId) {
        fetchActiveConversationMessages(selectedConversationId);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [
    fetchOrders,
    fetchConversations,
    fetchActiveConversationMessages,
    selectedConversationId,
  ]);

  useEffect(() => {
    if (selectedConversationId) {
      fetchActiveConversationMessages(selectedConversationId);
    }
  }, [selectedConversationId, fetchActiveConversationMessages]);

  useEffect(() => {
    if (activeTab === "inbox") {
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [activeTab, activeMessages.length, selectedConversationId]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchOrders(), fetchConversations()]);
    if (selectedConversationId) {
      await fetchActiveConversationMessages(selectedConversationId);
    }
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const handleUpdateOrderStatus = async (
    orderId: number,
    newStatus: string
  ) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrdersList((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          )
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleSendSellerReply = async (textOverride?: string) => {
    const textToSend = (textOverride ?? replyText).trim();
    if (!textToSend || !selectedConversationId || isSendingReply) return;

    setIsSendingReply(true);
    if (!textOverride) {
      setReplyText("");
    }

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderRole: "seller",
          conversationId: selectedConversationId,
          messageText: textToSend,
        }),
      });

      if (res.ok) {
        await fetchActiveConversationMessages(selectedConversationId);
        await fetchConversations();
        setTimeout(() => {
          chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (err) {
      console.error("Failed to send seller reply:", err);
    } finally {
      setIsSendingReply(false);
    }
  };

  const filteredOrders =
    orderStatusFilter === "all"
      ? ordersList
      : ordersList.filter((o) => o.status === orderStatusFilter);

  const activeOrderCount = ordersList.filter(
    (o) =>
      o.status !== "ডেলিভারি সম্পন্ন হয়েছে ✓" &&
      o.status !== "বাতিল করা হয়েছে"
  ).length;

  const totalRevenue = ordersList
    .filter((o) => o.status !== "বাতিল করা হয়েছে")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  return (
    <div className="py-8 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Seller Control Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1F1614] text-[#FFFBF5] border border-[#332521] shadow-xl mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9381E] text-[#FFFBF5] text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-[#F59E0B]" />
              <span>সেলার কন্ট্রোল প্যানেল ও ইনবক্স • শেষ বিকেলের আড্ডা</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-black text-[#FFFBF5] tracking-tight">
              অর্ডার ড্যাশবোর্ড ও গ্রাহক মেসেজ ইনবক্স
            </h1>
            <p className="text-xs sm:text-sm text-[#D6C7B5] flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                নয়াচর বাজার, মোহনগঞ্জ, কুড়িগ্রাম
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#4ADE80] font-bold">
                <Phone className="w-3.5 h-3.5" />
                হটলাইন: 01407983465
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleManualRefresh}
              className="px-4 py-2.5 rounded-xl bg-[#2A1E1B] hover:bg-[#3E2D29] border border-[#3E2D29] text-xs font-bold text-[#FFFBF5] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 text-[#F59E0B] ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              <span>রিফ্রেশ করুন</span>
            </button>

            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl bg-[#FFFBF5] hover:bg-[#F5ECE0] text-[#1C1311] text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#D9381E]" />
              <span>ক্যাফে ওয়েবসাইটে ফিরে যান</span>
            </Link>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#332521]">
          <div className="p-4 rounded-2xl bg-[#2A1E1B] border border-[#3E2D29]">
            <span className="text-xs text-[#A38F85] block">মোট অর্ডার সংখ্যা</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#FFFBF5] mt-1 block">
              {toBengaliDigits(ordersList.length)}টি অর্ডার
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#2A1E1B] border border-[#D9381E]/50">
            <span className="text-xs text-[#F59E0B] font-bold block">
              চলমান / প্রস্তুত হচ্ছে
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#F59E0B] mt-1 block">
              {toBengaliDigits(activeOrderCount)}টি অর্ডার
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#2A1E1B] border border-[#15803D]/50">
            <span className="text-xs text-[#4ADE80] font-bold block">
              ইনবক্সে অপঠিত মেসেজ
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#4ADE80] mt-1 block">
              {toBengaliDigits(totalUnreadMessages)}টি নতুন মেসেজ
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#2A1E1B] border border-[#3E2D29]">
            <span className="text-xs text-[#A38F85] block">মোট অর্ডার মূল্য</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#FFFBF5] mt-1 block">
              {formatPrice(totalRevenue)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Switcher Tabs: 1. গ্রাহকদের অর্ডার তালিকা | 2. সেলার ইনবক্স (চ্যাট) */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all cursor-pointer ${
            activeTab === "orders"
              ? "bg-[#D9381E] text-[#FFFBF5] shadow-lg shadow-[#D9381E]/25"
              : "bg-[#F5ECE0] text-[#1C1311] border border-[#E5D8C8] hover:border-[#D9381E]"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>গ্রাহকদের অর্ডার তালিকা ({toBengaliDigits(ordersList.length)})</span>
          {activeOrderCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#1C1311] text-[#F59E0B] text-xs font-extrabold">
              {toBengaliDigits(activeOrderCount)}টি চলমান
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("inbox")}
          className={`px-6 py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all cursor-pointer ${
            activeTab === "inbox"
              ? "bg-[#D9381E] text-[#FFFBF5] shadow-lg shadow-[#D9381E]/25"
              : "bg-[#F5ECE0] text-[#1C1311] border border-[#E5D8C8] hover:border-[#D9381E]"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>সেলার মেসেজ ইনবক্স ({toBengaliDigits(conversations.length)})</span>
          {totalUnreadMessages > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#15803D] text-[#FFFBF5] text-xs font-extrabold animate-pulse">
              {toBengaliDigits(totalUnreadMessages)}টি নতুন
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: CUSTOMER ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {/* Status Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#F5ECE0] border border-[#E5D8C8] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#6B5750] mr-1">
                অর্ডার ফিল্টার:
              </span>
              <button
                type="button"
                onClick={() => setOrderStatusFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  orderStatusFilter === "all"
                    ? "bg-[#1C1311] text-[#FFFBF5]"
                    : "bg-[#FFFBF5] text-[#1C1311] border border-[#D6C7B5]"
                }`}
              >
                সব অর্ডার ({toBengaliDigits(ordersList.length)})
              </button>
              {ORDER_STATUS_OPTIONS.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    orderStatusFilter === st
                      ? "bg-[#D9381E] text-[#FFFBF5]"
                      : "bg-[#FFFBF5] text-[#1C1311] border border-[#D6C7B5]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#F5ECE0] border border-[#E5D8C8] text-center">
              <ShoppingBag className="w-10 h-10 text-[#D9381E] mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-[#1C1311]">
                এই মুহূর্তে কোনো অর্ডার পাওয়া যায়নি
              </h3>
              <p className="text-xs text-[#6B5750] mt-1">
                গ্রাহকরা ওয়েবসাইট থেকে অর্ডার করলেই সাথে সাথে এখানে চলে আসবে।
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((ord) => {
                const isDelivered = ord.status === "ডেলিভারি সম্পন্ন হয়েছে ✓";
                const isCancelled = ord.status === "বাতিল করা হয়েছে";

                return (
                  <div
                    key={ord.id}
                    className="rounded-3xl bg-[#FFFBF5] border-2 border-[#E5D8C8] shadow-md overflow-hidden"
                  >
                    {/* Order Card Header */}
                    <div className="p-5 bg-[#F5ECE0] border-b border-[#E5D8C8] flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3.5 py-1.5 rounded-xl bg-[#1C1311] text-[#F59E0B] font-mono text-sm font-bold">
                          #{ord.orderNumber}
                        </span>
                        <div>
                          <h3 className="font-serif text-lg font-black text-[#1C1311]">
                            গ্রাহক: {ord.customerName}
                          </h3>
                          <p className="text-xs text-[#6B5750] flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#D9381E]" />
                            <span>
                              অর্ডারের সময়:{" "}
                              {new Date(ord.createdAt).toLocaleString("bn-BD", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                            isDelivered
                              ? "bg-[#15803D] text-[#FFFBF5]"
                              : isCancelled
                              ? "bg-[#DC2626] text-[#FFFBF5]"
                              : "bg-[#D9381E] text-[#FFFBF5]"
                          }`}
                        >
                          {ord.status}
                        </span>

                        <div className="text-right bg-[#FFFBF5] px-4 py-1.5 rounded-xl border border-[#D6C7B5]">
                          <span className="text-[10px] text-[#6B5750] block">
                            মোট বিল
                          </span>
                          <span className="text-base font-extrabold text-[#D9381E]">
                            {formatPrice(ord.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Card Body */}
                    <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Customer Info Column (5 cols) */}
                      <div className="lg:col-span-5 space-y-3 bg-[#F5ECE0]/60 p-4 rounded-2xl border border-[#E5D8C8] text-xs">
                        <span className="text-[11px] uppercase font-bold text-[#D9381E] block">
                          গ্রাহকের ঠিকানা ও যোগাযোগের তথ্য
                        </span>

                        <div className="flex items-center justify-between pt-1">
                          <span className="font-bold text-sm text-[#1C1311] flex items-center gap-1.5">
                            <User className="w-4 h-4 text-[#D9381E]" />
                            {ord.customerName}
                          </span>
                          <a
                            href={`tel:${ord.customerPhone}`}
                            className="px-3 py-1 rounded-lg bg-[#15803D] text-[#FFFBF5] font-bold flex items-center gap-1 hover:bg-[#166534] transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>কল করুন: {ord.customerPhone}</span>
                          </a>
                        </div>

                        <div className="pt-2 border-t border-[#E5D8C8] space-y-1.5">
                          <p className="text-[#1C1311]">
                            <strong>গ্রহণ পদ্ধতি:</strong>{" "}
                            <span className="px-2 py-0.5 rounded bg-[#FFFBF5] border border-[#D6C7B5] font-bold">
                              {ord.fulfillmentType}
                            </span>
                          </p>
                          <p className="text-[#1C1311] leading-relaxed">
                            <strong>ঠিকানা:</strong> {ord.deliveryAddress}
                          </p>
                          <p className="text-[#1C1311]">
                            <strong>পেমেন্ট মাধ্যম:</strong> {ord.paymentMethod}
                          </p>
                          <p className="text-[#1C1311]">
                            <strong>সস ও ঝাল পছন্দ:</strong>{" "}
                            {ord.spicePreference}
                          </p>
                          {ord.orderNotes && (
                            <p className="p-2.5 rounded-xl bg-[#FFFBF5] border border-[#F59E0B] text-[#1C1311] font-medium mt-2">
                              📝 <strong>গ্রাহকের নোট:</strong> &ldquo;
                              {ord.orderNotes}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Ordered Items & Status Control Column (7 cols) */}
                      <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                        <div>
                          <span className="text-xs font-bold text-[#1C1311] flex items-center gap-1.5 mb-3">
                            <Utensils className="w-4 h-4 text-[#D9381E]" />
                            অর্ডারকৃত খাবারের তালিকা (
                            {toBengaliDigits(
                              (ord.items || []).reduce(
                                (s, i) => s + i.quantity,
                                0
                              )
                            )}
                            টি আইটেম)
                          </span>

                          <div className="space-y-2">
                            {(ord.items || []).map((item) => (
                              <div
                                key={item.id}
                                className="p-3 rounded-xl bg-[#F5ECE0]/70 border border-[#E5D8C8] flex items-center justify-between gap-3"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={
                                      item.productImage ||
                                      "/images/fuchka-plate.jpg"
                                    }
                                    alt={item.productName}
                                    className="w-12 h-12 rounded-lg object-cover border border-[#E5D8C8]"
                                  />
                                  <div>
                                    <p className="font-bold text-sm text-[#1C1311]">
                                      {toBengaliDigits(item.quantity)}x{" "}
                                      {item.productName}
                                    </p>
                                    {item.customizations?.spiceLevel && (
                                      <p className="text-[11px] text-[#6B5750]">
                                        স্বাদ: {item.customizations.spiceLevel}
                                      </p>
                                    )}
                                    {item.customizations?.addons &&
                                      item.customizations.addons.length > 0 && (
                                        <p className="text-[11px] text-[#D9381E] font-medium">
                                          +{" "}
                                          {item.customizations.addons
                                            .map((a) => a.name)
                                            .join(", ")}
                                        </p>
                                      )}
                                  </div>
                                </div>

                                <span className="text-sm font-extrabold text-[#1C1311]">
                                  {formatPrice(
                                    item.priceAtPurchase * item.quantity
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Seller One-Click Status Update Bar */}
                        <div className="pt-4 border-t border-[#E5D8C8]">
                          <span className="text-xs font-bold text-[#6B5750] block mb-2">
                            অর্ডারের স্ট্যাটাস পরিবর্তন করুন (সেলার অ্যাকশন):
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {ORDER_STATUS_OPTIONS.map((statusOption) => {
                              const isCurrent = ord.status === statusOption;
                              return (
                                <button
                                  key={statusOption}
                                  type="button"
                                  disabled={
                                    isCurrent || updatingOrderId === ord.id
                                  }
                                  onClick={() =>
                                    handleUpdateOrderStatus(
                                      ord.id,
                                      statusOption
                                    )
                                  }
                                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    isCurrent
                                      ? "bg-[#1C1311] text-[#F59E0B] ring-2 ring-[#F59E0B]"
                                      : "bg-[#F5ECE0] hover:bg-[#D9381E] text-[#1C1311] hover:text-[#FFFBF5] border border-[#D6C7B5]"
                                  }`}
                                >
                                  {isCurrent
                                    ? `✓ ${statusOption}`
                                    : statusOption}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SELLER INBOX & LIVE CUSTOMER CHAT */}
      {activeTab === "inbox" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-3xl bg-[#FFFBF5] border-2 border-[#E5D8C8] shadow-xl overflow-hidden min-h-[580px]">
          {/* Left 4 Columns: Conversation List */}
          <div className="lg:col-span-4 bg-[#F5ECE0] border-b lg:border-b-0 lg:border-r border-[#E5D8C8] flex flex-col">
            <div className="p-4 bg-[#1F1614] text-[#FFFBF5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#F59E0B]" />
                <h2 className="font-serif text-base font-bold">
                  গ্রাহক মেসেজ তালিকা ({toBengaliDigits(conversations.length)})
                </h2>
              </div>
              {totalUnreadMessages > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#15803D] text-[#FFFBF5] text-xs font-bold">
                  {toBengaliDigits(totalUnreadMessages)}টি অপঠিত
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#E5D8C8]">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#6B5750]">
                  এখনো কোনো গ্রাহক মেসেজ পাঠাননি।
                </div>
              ) : (
                conversations.map((conv) => {
                  const isSelected = conv.id === selectedConversationId;
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => setSelectedConversationId(conv.id)}
                      className={`w-full p-4 text-left transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? "bg-[#FFFBF5] border-l-4 border-l-[#D9381E]"
                          : "hover:bg-[#FFFBF5]/60"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#1C1311] text-[#F59E0B] font-serif font-bold text-sm flex items-center justify-center flex-shrink-0">
                          {conv.customerName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-[#1C1311] truncate">
                              {conv.customerName}
                            </p>
                            {conv.unreadBySeller > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-[#D9381E] text-[#FFFBF5] text-[10px] font-bold">
                                নতুন ({toBengaliDigits(conv.unreadBySeller)})
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#6B5750] font-medium">
                            📞 {conv.customerPhone}
                          </p>
                          <p className="text-xs text-[#1C1311] line-clamp-1 mt-1">
                            {conv.lastMessageText}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right 8 Columns: Active Conversation Messages & Seller Reply Box */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-[#FFFBF5]">
            {!selectedConversation ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <MessageSquare className="w-12 h-12 text-[#D9381E] mb-3" />
                <h3 className="font-serif text-xl font-bold text-[#1C1311]">
                  বাম পাশ থেকে যেকোনো গ্রাহকের মেসেজ নির্বাচন করুন
                </h3>
                <p className="text-xs text-[#6B5750] mt-1">
                  গ্রাহকদের প্রশ্নের উত্তর সরাসরি এখান থেকেই পাঠাতে পারবেন।
                </p>
              </div>
            ) : (
              <>
                {/* Selected Customer Header */}
                <div className="p-4 bg-[#F5ECE0] border-b border-[#E5D8C8] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D9381E] text-[#FFFBF5] font-serif font-bold text-base flex items-center justify-center">
                      {selectedConversation.customerName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-black text-[#1C1311]">
                        {selectedConversation.customerName}
                      </h3>
                      <p className="text-xs text-[#6B5750]">
                        মোবাইল: {selectedConversation.customerPhone}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${selectedConversation.customerPhone}`}
                    className="px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-[#FFFBF5] text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>গ্রাহককে কল করুন ({selectedConversation.customerPhone})</span>
                  </a>
                </div>

                {/* Chat Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3.5 max-h-[380px]">
                  {activeMessages.map((msg) => {
                    const isSeller = msg.senderRole === "seller";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isSeller ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isSeller
                              ? "bg-[#1C1311] text-[#FFFBF5] rounded-br-xs"
                              : "bg-[#F5ECE0] text-[#1C1311] border border-[#E5D8C8] rounded-bl-xs"
                          }`}
                        >
                          <span
                            className={`text-[10px] font-bold block mb-1 ${
                              isSeller ? "text-[#F59E0B]" : "text-[#D9381E]"
                            }`}
                          >
                            {isSeller
                              ? "আপনি (শেষ বিকেলের আড্ডা - সেলার)"
                              : `${msg.senderName} (গ্রাহক)`}
                          </span>
                          <p>{msg.messageText}</p>
                        </div>
                        <span className="text-[10px] text-[#6B5750] mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleString("bn-BD", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={chatBottomRef} />
                </div>

                {/* Seller Quick Replies + Message Input */}
                <div className="p-4 bg-[#F5ECE0] border-t border-[#E5D8C8] space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#6B5750] flex items-center gap-1 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D9381E]" />
                      এক ক্লিকে দ্রুত উত্তর পাঠান (কুইক রিপ্লাই):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SELLER_QUICK_REPLIES.map((qr, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSendSellerReply(qr)}
                          className="text-left px-3 py-1.5 rounded-xl bg-[#FFFBF5] hover:bg-[#D9381E] text-[#1C1311] hover:text-[#FFFBF5] border border-[#D6C7B5] text-[11px] font-medium transition-colors line-clamp-1 cursor-pointer"
                        >
                          ⚡ {qr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendSellerReply();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`${selectedConversation.customerName}-কে আপনার উত্তর লিখুন...`}
                      className="flex-1 h-11 px-4 rounded-xl bg-[#FFFBF5] border border-[#D6C7B5] text-sm text-[#1C1311] focus:outline-none focus:border-[#D9381E]"
                    />
                    <button
                      type="submit"
                      disabled={isSendingReply || !replyText.trim()}
                      className="h-11 px-6 rounded-xl bg-[#D9381E] hover:bg-[#B82D16] disabled:opacity-50 text-[#FFFBF5] font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>উত্তর পাঠান</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
