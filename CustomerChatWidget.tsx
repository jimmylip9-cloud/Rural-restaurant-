"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Phone,
  Sparkles,
  User,
  Flame,
  CheckCheck,
} from "lucide-react";
import { toBengaliDigits } from "@/context/CartContext";

interface ChatMessageItem {
  id: number;
  conversationId: number;
  senderRole: "customer" | "seller";
  senderName: string;
  messageText: string;
  createdAt: string;
}

const SESSION_STORAGE_KEY = "shesh_bikeler_adda_chat_session_v1";
const PROFILE_STORAGE_KEY = "shesh_bikeler_adda_chat_profile_v1";

const QUICK_CUSTOMER_QUESTIONS = [
  "ফুচকা (৳৭০) ও মালাই চা (৳৫০) কি এখন গরম পাওয়া যাবে?",
  "নয়াচর বাজারে হোম ডেলিভারি পেতে কতক্ষণ সময় লাগবে?",
  "চিকেন ফ্রাই (৳১৫০) ও কফির সাথে কি স্পেশাল সস থাকবে?",
  "আমার অর্ডারের বর্তমান অবস্থা জানতে চাই।",
];

export function CustomerChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionKey, setSessionKey] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [isProfileSaved, setIsProfileSaved] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize sessionKey & saved customer profile
  useEffect(() => {
    try {
      let savedKey = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!savedKey) {
        savedKey = `cust-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        localStorage.setItem(SESSION_STORAGE_KEY, savedKey);
      }
      setSessionKey(savedKey);

      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name && parsed.phone) {
          setCustomerName(parsed.name);
          setCustomerPhone(parsed.phone);
          setIsProfileSaved(true);
        }
      }
    } catch (e) {
      console.error("Chat storage init error:", e);
    }

    // Listen for custom event so any button on the site can open the chat widget
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener("open-customer-chat", handleOpenEvent);
    return () =>
      window.removeEventListener("open-customer-chat", handleOpenEvent);
  }, []);

  const fetchConversation = useCallback(async () => {
    if (!sessionKey) return;
    try {
      const res = await fetch(
        `/api/messages?sessionKey=${encodeURIComponent(sessionKey)}`
      );
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.messages)) {
        setMessages((prev) => {
          if (
            !isOpen &&
            data.messages.length > prev.length &&
            data.messages[data.messages.length - 1]?.senderRole === "seller"
          ) {
            setUnreadCount((c) => c + 1);
          }
          return data.messages;
        });
      }
    } catch (err) {
      console.error("Failed to poll messages:", err);
    }
  }, [sessionKey, isOpen]);

  useEffect(() => {
    if (!sessionKey) return;
    fetchConversation();
    const interval = setInterval(fetchConversation, 4000);
    return () => clearInterval(interval);
  }, [sessionKey, fetchConversation]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, messages.length]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;
    try {
      localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify({
          name: customerName.trim(),
          phone: customerPhone.trim(),
        })
      );
    } catch (err) {
      console.error("Could not save chat profile:", err);
    }
    setIsProfileSaved(true);
  };

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = (textOverride ?? inputText).trim();
    if (!textToSend || isSending) return;

    const finalName = customerName.trim() || "আড্ডাপ্রিয় গ্রাহক";
    const finalPhone = customerPhone.trim() || "উল্লেখ নেই";

    setIsSending(true);
    if (!textOverride) {
      setInputText("");
    }

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderRole: "customer",
          sessionKey,
          customerName: finalName,
          customerPhone: finalPhone,
          messageText: textToSend,
        }),
      });

      if (res.ok) {
        await fetchConversation();
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (err) {
      console.error("Failed to send customer message:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button (Bottom Left so it never overlaps with Add-to-Cart Toast) */}
      <div className="fixed bottom-5 left-5 z-40">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-4 py-3.5 rounded-full bg-[#1C1311] hover:bg-[#D9381E] text-[#FFFBF5] shadow-2xl border-2 border-[#F59E0B] transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#D9381E] group-hover:bg-[#1C1311] text-[#FFFBF5] flex items-center justify-center relative">
              <MessageCircle className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#4ADE80] ring-2 ring-[#1C1311]" />
            </div>
            <div className="text-left pr-1">
              <span className="text-[10px] text-[#F59E0B] group-hover:text-[#FFFBF5] font-bold block leading-none">
                সেলারের সাথে সরাসরি কথা বলুন
              </span>
              <span className="text-sm font-bold block mt-0.5">
                লাইভ চ্যাট ও মেসেজ 💬
              </span>
            </div>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#4ADE80] text-[#1C1311] text-xs font-extrabold">
                {toBengaliDigits(unreadCount)}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Chat Popup Window */}
      {isOpen && (
        <div className="fixed bottom-5 left-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[390px] max-h-[82vh] bg-[#FFFBF5] rounded-3xl border-2 border-[#1C1311] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#1F1614] text-[#FFFBF5] flex items-center justify-between gap-3 border-b border-[#332521]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#D9381E] text-[#FFFBF5] flex items-center justify-center relative">
                <Flame className="w-5 h-5 fill-[#F59E0B]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#4ADE80] border-2 border-[#1F1614]" />
              </div>
              <div>
                <h3 className="font-serif text-base font-black text-[#FFFBF5] leading-tight">
                  শেষ বিকেলের আড্ডা • লাইভ চ্যাট
                </h3>
                <p className="text-[11px] text-[#4ADE80] font-semibold flex items-center gap-1">
                  <span>সেলার অনলাইনে আছেন • নয়াচর বাজার</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href="tel:01407983465"
                title="সরাসরি কল করুন: 01407983465"
                className="p-2 rounded-xl bg-[#15803D]/25 text-[#4ADE80] hover:bg-[#15803D] hover:text-[#FFFBF5] transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="চ্যাট বন্ধ করুন"
                className="p-2 rounded-xl bg-[#2A1E1B] text-[#E5D8C8] hover:bg-[#D9381E] hover:text-[#FFFBF5] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Customer Name & Phone Setup Banner (or compact bar if already saved) */}
          {!isProfileSaved ? (
            <form
              onSubmit={handleSaveProfile}
              className="p-4 bg-[#F5ECE0] border-b border-[#E5D8C8] space-y-2.5"
            >
              <p className="text-xs font-bold text-[#1C1311] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#D9381E]" />
                চ্যাট শুরু করতে আপনার নাম ও মোবাইল নম্বর দিন:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="আপনার নাম *"
                  className="h-9 px-3 rounded-xl bg-[#FFFBF5] border border-[#D6C7B5] text-xs text-[#1C1311] focus:outline-none focus:border-[#D9381E]"
                />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="মোবাইল নম্বর *"
                  className="h-9 px-3 rounded-xl bg-[#FFFBF5] border border-[#D6C7B5] text-xs text-[#1C1311] focus:outline-none focus:border-[#D9381E]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-[#D9381E] hover:bg-[#B82D16] text-[#FFFBF5] text-xs font-bold transition-colors cursor-pointer"
              >
                চ্যাট শুরু করুন →
              </button>
            </form>
          ) : (
            <div className="px-4 py-2 bg-[#F5ECE0] border-b border-[#E5D8C8] flex items-center justify-between text-[11px]">
              <span className="text-[#1C1311] font-bold truncate">
                চ্যাট করছেন: {customerName} ({customerPhone})
              </span>
              <button
                type="button"
                onClick={() => setIsProfileSaved(false)}
                className="text-[#D9381E] font-bold hover:underline cursor-pointer flex-shrink-0 ml-2"
              >
                পরিবর্তন
              </button>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[260px] max-h-[340px] bg-[#FFFBF5]">
            {/* Welcome Card from Seller */}
            <div className="p-3 rounded-2xl bg-[#F5ECE0] border border-[#E5D8C8] text-xs text-[#1C1311] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#D9381E]">
                  শেষ বিকেলের আড্ডা (সেলার)
                </span>
                <span className="text-[10px] text-[#6B5750]">স্বাগতম বার্তা</span>
              </div>
              <p className="leading-relaxed">
                আসসালামু আলাইকুম! আমাদের ক্যাফেতে আপনাকে স্বাগতম। ফুচকা (৳৭০), চিকেন ফ্রাই (৳১৫০), নরমাল চা (৳২০), মালাই চা (৳৫০) বা কফি (৳১০০) সম্পর্কে যেকোনো প্রশ্ন বা অর্ডারের বিশেষ নির্দেশনা এখানে মেসেজ করে জানান!
              </p>
            </div>

            {/* Quick Tap Questions if no messages yet */}
            {messages.length === 0 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-bold text-[#6B5750] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                  দ্রুত মেসেজ পাঠাতে নিচের যেকোনো প্রশ্নে ক্লিক করুন:
                </p>
                <div className="flex flex-col gap-1.5">
                  {QUICK_CUSTOMER_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      className="text-left p-2.5 rounded-xl bg-[#FFFBF5] hover:bg-[#D9381E]/10 border border-[#D6C7B5] hover:border-[#D9381E] text-xs font-medium text-[#1C1311] transition-colors cursor-pointer"
                    >
                      💬 {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Thread */}
            {messages.map((msg) => {
              const isCustomer = msg.senderRole === "customer";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isCustomer ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                      isCustomer
                        ? "bg-[#D9381E] text-[#FFFBF5] rounded-br-xs"
                        : "bg-[#1F1614] text-[#FFFBF5] border border-[#332521] rounded-bl-xs"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-bold block mb-0.5 ${
                        isCustomer ? "text-[#FDE68A]" : "text-[#F59E0B]"
                      }`}
                    >
                      {isCustomer ? "আপনি" : msg.senderName}
                    </span>
                    <p>{msg.messageText}</p>
                  </div>
                  <span className="text-[10px] text-[#6B5750] mt-0.5 px-1 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString("bn-BD", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {isCustomer && (
                      <CheckCheck className="w-3 h-3 text-[#15803D]" />
                    )}
                  </span>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#F5ECE0] border-t border-[#E5D8C8] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="আপনার মেসেজ লিখুন..."
              className="flex-1 h-10 px-3.5 rounded-xl bg-[#FFFBF5] border border-[#D6C7B5] text-xs text-[#1C1311] focus:outline-none focus:border-[#D9381E]"
            />
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              aria-label="মেসেজ পাঠান"
              className="h-10 px-4 rounded-xl bg-[#D9381E] hover:bg-[#B82D16] disabled:opacity-50 text-[#FFFBF5] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>পাঠান</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
