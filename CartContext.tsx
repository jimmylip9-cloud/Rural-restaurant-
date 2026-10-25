"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Product, ProductAddon } from "@/db/schema";

export interface CartItem {
  cartItemId: string;
  productId: number;
  slug: string;
  name: string;
  image: string;
  basePrice: number; // in BDT (টাকা)
  unitPrice: number; // basePrice + addons in BDT (টাকা)
  quantity: number;
  category: string;
  spiceLevelLabel: string;
  selectedAddons: ProductAddon[];
  notes?: string;
}

interface ToastNotification {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (
    product: Product,
    options?: {
      quantity?: number;
      spiceLevelLabel?: string;
      selectedAddons?: ProductAddon[];
      notes?: string;
      openDrawer?: boolean;
    }
  ) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number; // in BDT
  freeDeliveryThreshold: number; // 400 BDT
  amountToFreeDelivery: number; // in BDT
  deliveryFee: number; // in BDT
  promoCode: string;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  discountAmount: number; // in BDT
  totalAmount: number; // in BDT
  toast: ToastNotification | null;
  dismissToast: () => void;
}

const STORAGE_KEY = "shesh_bikeler_adda_cart_bn_v2";
const PROMO_STORAGE_KEY = "shesh_bikeler_adda_promo_bn_v2";
const FREE_DELIVERY_THRESHOLD = 400; // ৪০০ টাকা
const STANDARD_DELIVERY_FEE = 40; // ৪০ টাকা

const SPICE_LABELS: Record<number, string> = {
  0: "০-মরিচ (ঝাল ছাড়া / মিষ্টি)",
  1: "১-মরিচ (হালকা চটপটা)",
  2: "২-মরিচ (আড্ডা স্পেশাল ঝাল)",
  3: "৩-মরিচ (নাগা ফায়ার ঝাল)",
};

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBengaliDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => BENGALI_DIGITS[Number(d)] ?? d);
}

export function formatPrice(taka: number): string {
  const rounded = Math.round(taka);
  return `৳${toBengaliDigits(rounded)}`;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string>("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
      const savedPromo = localStorage.getItem(PROMO_STORAGE_KEY);
      if (savedPromo) {
        setPromoCode(savedPromo);
      }
    } catch (e) {
      console.error("Failed to read cart from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  }, [items, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (promoCode) {
        localStorage.setItem(PROMO_STORAGE_KEY, promoCode);
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to save promo code:", e);
    }
  }, [promoCode, isHydrated]);

  const triggerToast = useCallback(
    (title: string, subtitle: string, image?: string) => {
      const id = Math.random().toString(36).slice(2);
      setToast({ id, title, subtitle, image });
      setTimeout(() => {
        setToast((prev) => (prev?.id === id ? null : prev));
      }, 3200);
    },
    []
  );

  const dismissToast = useCallback(() => setToast(null), []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addItem = useCallback(
    (
      product: Product,
      options?: {
        quantity?: number;
        spiceLevelLabel?: string;
        selectedAddons?: ProductAddon[];
        notes?: string;
        openDrawer?: boolean;
      }
    ) => {
      const quantity = options?.quantity ?? 1;
      const spiceLevelLabel =
        options?.spiceLevelLabel ||
        SPICE_LABELS[product.spiceLevel] ||
        "আড্ডা স্পেশাল ঝাল";
      const selectedAddons = options?.selectedAddons || [];
      const notes = options?.notes?.trim() || "";

      const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
      const unitPrice = product.price + addonsTotal;

      const addonKey = selectedAddons
        .map((a) => a.id)
        .sort()
        .join(",");
      const cartItemId = `${product.id}__${spiceLevelLabel}__${addonKey}__${notes}`;
      const primaryImage =
        product.images && product.images.length > 0
          ? product.images[0]
          : "/images/fuchka-plate.jpg";

      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (i) => i.cartItemId === cartItemId
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }
        return [
          ...prev,
          {
            cartItemId,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: primaryImage,
            basePrice: product.price,
            unitPrice,
            quantity,
            category: product.category,
            spiceLevelLabel,
            selectedAddons,
            notes: notes || undefined,
          },
        ];
      });

      triggerToast(
        `${toBengaliDigits(quantity)}টি ${product.name} যোগ করা হয়েছে`,
        selectedAddons.length > 0
          ? `+ ${selectedAddons.map((a) => a.name).join(", ")}`
          : spiceLevelLabel,
        primaryImage
      );

      if (options?.openDrawer) {
        setIsCartOpen(true);
      }
    },
    [triggerToast]
  );

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity } : i
      )
    );
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode("");
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );

  const amountToFreeDelivery = useMemo(
    () => Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal),
    [subtotal]
  );

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  }, [subtotal]);

  const discountAmount = useMemo(() => {
    if (!promoCode || subtotal === 0) return 0;
    const clean = promoCode.toUpperCase().trim();
    if (clean === "ADDA15") {
      return Math.round(subtotal * 0.15);
    }
    if (clean === "CHA20" || clean === "FIRSTBITE") {
      return Math.min(subtotal, 20);
    }
    if ((clean === "SQUAD50" || clean === "SQUAD5") && subtotal >= 350) {
      return 50;
    }
    return 0;
  }, [promoCode, subtotal]);

  const applyPromoCode = useCallback(
    (code: string): { success: boolean; message: string } => {
      const clean = code.toUpperCase().trim();
      if (!clean) {
        return { success: false, message: "অনুগ্রহ করে একটি প্রোমো কোড লিখুন।" };
      }
      if (clean === "ADDA15") {
        setPromoCode("ADDA15");
        return {
          success: true,
          message: "ADDA15 চালু হয়েছে! আপনার অর্ডারে ১৫% ছাড় যোগ হয়েছে।",
        };
      }
      if (clean === "CHA20" || clean === "FIRSTBITE") {
        setPromoCode("CHA20");
        return {
          success: true,
          message: "CHA20 চালু হয়েছে! ২০ টাকা (১ কাপ নরমাল চা সমমূল্য) ছাড় পেয়েছেন।",
        };
      }
      if (clean === "SQUAD50" || clean === "SQUAD5") {
        if (subtotal < 350) {
          return {
            success: false,
            message: "SQUAD50 কোডটি ব্যবহার করতে ন্যূনতম ৩৫০ টাকার অর্ডার প্রয়োজন।",
          };
        }
        setPromoCode("SQUAD50");
        return {
          success: true,
          message: "SQUAD50 চালু হয়েছে! আড্ডা অর্ডারে ৫০ টাকা ছাড় পেয়েছেন।",
        };
      }
      return {
        success: false,
        message: "সঠিক কোড নয়। ADDA15, CHA20 অথবা SQUAD50 ব্যবহার করে দেখুন!",
      };
    },
    [subtotal]
  );

  const removePromoCode = useCallback(() => {
    setPromoCode("");
  }, []);

  const totalAmount = useMemo(
    () => Math.max(0, subtotal - discountAmount + deliveryFee),
    [subtotal, discountAmount, deliveryFee]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        openCart,
        closeCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        amountToFreeDelivery,
        deliveryFee,
        promoCode,
        applyPromoCode,
        removePromoCode,
        discountAmount,
        totalAmount,
        toast,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
