import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  numeric,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export interface ProductAddon {
  id: string;
  name: string;
  price: number; // in BDT
}

export interface OrderItemCustomization {
  spiceLevel?: string;
  addons?: ProductAddon[];
  notes?: string;
}

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  category: text("category").notNull(),
  collection: text("collection").notNull(),
  spiceLevel: integer("spice_level").notNull().default(1), // 0 to 3
  dietaryTags: jsonb("dietary_tags").$type<string[]>().notNull().default([]),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  badge: text("badge"),
  prepTimeMinutes: integer("prep_time_minutes").notNull().default(15),
  calories: integer("calories").notNull().default(650),
  servingSize: text("serving_size").notNull().default("১ প্লেট"),
  availableAddons: jsonb("available_addons")
    .$type<ProductAddon[]>()
    .notNull()
    .default([]),
  inStock: boolean("in_stock").notNull().default(true),
  ratingAvg: numeric("rating_avg", { precision: 3, scale: 2 })
    .notNull()
    .default("4.90"),
  reviewCount: integer("review_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  customerName: text("customer_name").notNull(),
  customerTag: text("customer_tag").notNull().default("নিয়মিত গ্রাহক"),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  spiceFeedback: text("spice_feedback").notNull().default("একদম পারফেক্ট"),
  verifiedPurchase: boolean("verified_purchase").notNull().default(true),
  helpfulCount: integer("helpful_count").notNull().default(3),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  fulfillmentType: text("fulfillment_type")
    .notNull()
    .default("হোম ডেলিভারি"),
  spicePreference: text("spice_preference")
    .notNull()
    .default("ক্যাফে স্পেশাল ঝাল"),
  orderNotes: text("order_notes"),
  paymentMethod: text("payment_method").notNull().default("ক্যাশ অন ডেলিভারি"),
  promoCode: text("promo_code"),
  discountAmount: integer("discount_amount").notNull().default(0),
  deliveryFee: integer("delivery_fee").notNull().default(0),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("অর্ডার কনফার্মড ও রান্নাঘরে প্রস্তুত হচ্ছে"),
  estimatedMinutes: integer("estimated_minutes").notNull().default(25),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  productName: text("product_name").notNull(),
  productImage: text("product_image").notNull(),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: integer("price_at_purchase").notNull(),
  customizations: jsonb("customizations")
    .$type<OrderItemCustomization>()
    .notNull()
    .default({}),
});

export const chatConversations = pgTable("chat_conversations", {
  id: serial("id").primaryKey(),
  sessionKey: text("session_key").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  lastMessageText: text("last_message_text").notNull(),
  unreadBySeller: integer("unread_by_seller").notNull().default(0),
  unreadByCustomer: integer("unread_by_customer").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id")
    .notNull()
    .references(() => chatConversations.id, { onDelete: "cascade" }),
  senderRole: text("sender_role").notNull(), // "customer" | "seller"
  senderName: text("sender_name").notNull(),
  messageText: text("message_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type ChatConversation = typeof chatConversations.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
