import { db, pool } from "./index";
import {
  products,
  reviews,
  orders,
  orderItems,
  chatConversations,
  chatMessages,
  Product,
  Review,
} from "./schema";
import { SEED_PRODUCTS } from "./seed-data";
import { eq, desc } from "drizzle-orm";

let isInitialized = false;
let initPromise: Promise<void> | null = null;

export async function ensureDbSeeded(): Promise<void> {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT NOT NULL,
          price INTEGER NOT NULL,
          original_price INTEGER,
          category TEXT NOT NULL,
          collection TEXT NOT NULL,
          spice_level INTEGER NOT NULL DEFAULT 1,
          dietary_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
          images JSONB NOT NULL DEFAULT '[]'::jsonb,
          badge TEXT,
          prep_time_minutes INTEGER NOT NULL DEFAULT 15,
          calories INTEGER NOT NULL DEFAULT 650,
          serving_size TEXT NOT NULL DEFAULT '১ প্লেট',
          available_addons JSONB NOT NULL DEFAULT '[]'::jsonb,
          in_stock BOOLEAN NOT NULL DEFAULT true,
          rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 4.90,
          review_count INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          customer_name TEXT NOT NULL,
          customer_tag TEXT NOT NULL DEFAULT 'নিয়মিত গ্রাহক',
          rating INTEGER NOT NULL,
          comment TEXT NOT NULL,
          spice_feedback TEXT NOT NULL DEFAULT 'একদম পারফেক্ট',
          verified_purchase BOOLEAN NOT NULL DEFAULT true,
          helpful_count INTEGER NOT NULL DEFAULT 3,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          order_number TEXT NOT NULL UNIQUE,
          customer_name TEXT NOT NULL,
          customer_email TEXT NOT NULL,
          customer_phone TEXT NOT NULL,
          delivery_address TEXT NOT NULL,
          fulfillment_type TEXT NOT NULL DEFAULT 'হোম ডেলিভারি',
          spice_preference TEXT NOT NULL DEFAULT 'ক্যাফে স্পেশাল ঝাল',
          order_notes TEXT,
          payment_method TEXT NOT NULL DEFAULT 'ক্যাশ অন ডেলিভারি',
          promo_code TEXT,
          discount_amount INTEGER NOT NULL DEFAULT 0,
          delivery_fee INTEGER NOT NULL DEFAULT 0,
          total_amount INTEGER NOT NULL,
          status TEXT NOT NULL DEFAULT 'অর্ডার কনফার্মড ও রান্নাঘরে প্রস্তুত হচ্ছে',
          estimated_minutes INTEGER NOT NULL DEFAULT 25,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          product_name TEXT NOT NULL,
          product_image TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          price_at_purchase INTEGER NOT NULL,
          customizations JSONB NOT NULL DEFAULT '{}'::jsonb
        );

        CREATE TABLE IF NOT EXISTS chat_conversations (
          id SERIAL PRIMARY KEY,
          session_key TEXT NOT NULL UNIQUE,
          customer_name TEXT NOT NULL,
          customer_phone TEXT NOT NULL,
          last_message_text TEXT NOT NULL,
          unread_by_seller INTEGER NOT NULL DEFAULT 0,
          unread_by_customer INTEGER NOT NULL DEFAULT 0,
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS chat_messages (
          id SERIAL PRIMARY KEY,
          conversation_id INTEGER NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
          sender_role TEXT NOT NULL,
          sender_name TEXT NOT NULL,
          message_text TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      // Check if the Bengali menu ('fuchka-1-plate') is already seeded
      const checkBengaliItem = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.slug, "fuchka-1-plate"))
        .limit(1);

      if (checkBengaliItem.length === 0) {
        await pool.query(`TRUNCATE TABLE order_items, reviews, products RESTART IDENTITY CASCADE;`);

        for (const item of SEED_PRODUCTS) {
          const { reviews: prodReviews, ...productData } = item;
          const [inserted] = await db
            .insert(products)
            .values(productData)
            .onConflictDoNothing()
            .returning();

          if (inserted && prodReviews.length > 0) {
            await db.insert(reviews).values(
              prodReviews.map((r) => ({
                productId: inserted.id,
                customerName: r.customerName,
                customerTag: r.customerTag,
                rating: r.rating,
                comment: r.comment,
                spiceFeedback: r.spiceFeedback,
                verifiedPurchase: true,
                helpfulCount: r.helpfulCount,
              }))
            );
          }
        }
      }

      // Seed realistic demo orders if orders table is empty so Seller Panel shows orders right away
      const existingOrders = await db.select({ id: orders.id }).from(orders).limit(1);
      if (existingOrders.length === 0) {
        const allProds = await db.select().from(products).orderBy(products.id);
        const fuchka = allProds.find((p) => p.slug === "fuchka-1-plate") || allProds[0];
        const chickenFry = allProds.find((p) => p.slug === "crispy-chicken-fry") || allProds[0];
        const malaiTea = allProds.find((p) => p.slug === "special-malai-tea") || allProds[0];
        const coffee = allProds.find((p) => p.slug === "cafe-special-coffee") || allProds[0];
        const normalTea = allProds.find((p) => p.slug === "normal-tea") || allProds[0];

        if (fuchka && chickenFry && malaiTea) {
          const [order1] = await db
            .insert(orders)
            .values({
              orderNumber: "ADDA-4821",
              customerName: "মাহমুদুল হাসান",
              customerEmail: "mahmudul@example.com",
              customerPhone: "01712345678",
              deliveryAddress: "নয়াচর বাজার (দক্ষিণ পাড়া), মোহনগঞ্জ, কুড়িগ্রাম",
              fulfillmentType: "হোম ডেলিভারি",
              spicePreference: "অতিরিক্ত নাগা মরিচ ও তেঁতুল টক প্যাক",
              orderNotes: "ফুচকার টক একটু বেশি দেবেন ভাইয়া, আর মালাই চা যেন গরম থাকে।",
              paymentMethod: "ক্যাশ অন ডেলিভারি",
              promoCode: null,
              discountAmount: 0,
              deliveryFee: 40,
              totalAmount: 380,
              status: "অর্ডার কনফার্মড ও রান্নাঘরে প্রস্তুত হচ্ছে",
              estimatedMinutes: 25,
            })
            .returning();

          if (order1) {
            await db.insert(orderItems).values([
              {
                orderId: order1.id,
                productId: fuchka.id,
                productName: fuchka.name,
                productImage: fuchka.images[0] || "/images/fuchka-plate.jpg",
                quantity: 2,
                priceAtPurchase: 70,
                customizations: { spiceLevel: "২-মরিচ (আড্ডা স্পেশাল ঝাল)" },
              },
              {
                orderId: order1.id,
                productId: chickenFry.id,
                productName: chickenFry.name,
                productImage: chickenFry.images[0] || "/images/chicken-fry.jpg",
                quantity: 1,
                priceAtPurchase: 150,
                customizations: { spiceLevel: "২-মরিচ (আড্ডা স্পেশাল ঝাল)" },
              },
              {
                orderId: order1.id,
                productId: malaiTea.id,
                productName: malaiTea.name,
                productImage: malaiTea.images[0] || "/images/malai-tea.jpg",
                quantity: 1,
                priceAtPurchase: 50,
                customizations: { spiceLevel: "০-মরিচ (ঝাল ছাড়া / মিষ্টি)" },
              },
            ]);
          }

          const [order2] = await db
            .insert(orders)
            .values({
              orderNumber: "ADDA-4822",
              customerName: "সুমাইয়া আক্তার",
              customerEmail: "sumaiya@example.com",
              customerPhone: "01819876543",
              deliveryAddress: "নয়াচর বাজার মেইন রোড (স্কুল গেটের সামনে), মোহনগঞ্জ, কুড়িগ্রাম",
              fulfillmentType: "ক্যাফে কাউন্টার পিকআপ",
              spicePreference: "পরিবার ও বাচ্চাদের মোড (সব ঝাল সস আলাদা)",
              orderNotes: "আমরা ১৫ মিনিটের মধ্যে ক্যাফেতে এসে নিয়ে যাব।",
              paymentMethod: "বিকাশ / নগদ ওয়ালেট",
              promoCode: null,
              discountAmount: 0,
              deliveryFee: 0,
              totalAmount: 210,
              status: "খাবার প্রস্তুত • ডেলিভারির পথে",
              estimatedMinutes: 15,
            })
            .returning();

          if (order2 && coffee && normalTea) {
            await db.insert(orderItems).values([
              {
                orderId: order2.id,
                productId: fuchka.id,
                productName: fuchka.name,
                productImage: fuchka.images[0] || "/images/fuchka-plate.jpg",
                quantity: 1,
                priceAtPurchase: 70,
                customizations: { spiceLevel: "১-মরিচ (হালকা চটপটা)" },
              },
              {
                orderId: order2.id,
                productId: coffee.id,
                productName: coffee.name,
                productImage: coffee.images[0] || "/images/hot-coffee.jpg",
                quantity: 1,
                priceAtPurchase: 100,
                customizations: { spiceLevel: "০-মরিচ (ঝাল ছাড়া / মিষ্টি)" },
              },
              {
                orderId: order2.id,
                productId: normalTea.id,
                productName: normalTea.name,
                productImage: normalTea.images[0] || "/images/normal-tea.jpg",
                quantity: 2,
                priceAtPurchase: 20,
                customizations: { spiceLevel: "০-মরিচ (ঝাল ছাড়া / মিষ্টি)" },
              },
            ]);
          }
        }
      }

      // Seed demo customer chat threads if chat_conversations is empty
      const existingChats = await db
        .select({ id: chatConversations.id })
        .from(chatConversations)
        .limit(1);

      if (existingChats.length === 0) {
        const [conv1] = await db
          .insert(chatConversations)
          .values({
            sessionKey: "demo-customer-rakib",
            customerName: "রাকিবুল ইসলাম",
            customerPhone: "01755112233",
            lastMessageText: "ভাইয়া, এখন ৩ প্লেট ফুচকা আর ২টা চিকেন ফ্রাই অর্ডার করলে নয়াচর বাজারে কতক্ষণে ডেলিভারি পাবো?",
            unreadBySeller: 1,
            unreadByCustomer: 0,
          })
          .returning();

        if (conv1) {
          await db.insert(chatMessages).values([
            {
              conversationId: conv1.id,
              senderRole: "customer",
              senderName: "রাকিবুল ইসলাম",
              messageText: "আসসালামু আলাইকুম ভাইয়া, ক্যাফে কি এখন খোলা আছে?",
            },
            {
              conversationId: conv1.id,
              senderRole: "seller",
              senderName: "শেষ বিকেলের আড্ডা (সেলার)",
              messageText: "ওয়ালাইকুম আসসালাম! জি ভাইয়া, আমাদের ক্যাফে খোলা আছে। গরম গরম ফুচকা, চিকেন ফ্রাই ও মালাই চা প্রস্তুত হচ্ছে।",
            },
            {
              conversationId: conv1.id,
              senderRole: "customer",
              senderName: "রাকিবুল ইসলাম",
              messageText: "ভাইয়া, এখন ৩ প্লেট ফুচকা আর ২টা চিকেন ফ্রাই অর্ডার করলে নয়াচর বাজারে কতক্ষণে ডেলিভারি পাবো?",
            },
          ]);
        }

        const [conv2] = await db
          .insert(chatConversations)
          .values({
            sessionKey: "demo-customer-nusrat",
            customerName: "নুসরাত জাহান",
            customerPhone: "01922334455",
            lastMessageText: "মালাই চায়ের সাথে চিনিটা একটু কম দেবেন প্লিজ।",
            unreadBySeller: 1,
            unreadByCustomer: 0,
          })
          .returning();

        if (conv2) {
          await db.insert(chatMessages).values([
            {
              conversationId: conv2.id,
              senderRole: "customer",
              senderName: "নুসরাত জাহান",
              messageText: "মালাই চায়ের সাথে চিনিটা একটু কম দেবেন প্লিজ।",
            },
          ]);
        }
      }

      isInitialized = true;
    } catch (err) {
      console.error("Database initialization warning:", err);
      initPromise = null;
    }
  })();

  return initPromise;
}

export async function getAllProducts(): Promise<Product[]> {
  await ensureDbSeeded();
  return db.select().from(products).orderBy(products.id);
}

export async function getProductBySlug(slug: string): Promise<{
  product: Product;
  reviews: Review[];
  relatedProducts: Product[];
} | null> {
  await ensureDbSeeded();
  const found = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (found.length === 0) return null;
  const product = found[0];

  const productReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, product.id))
    .orderBy(desc(reviews.createdAt), desc(reviews.id));

  const all = await db.select().from(products).orderBy(products.id);
  const relatedProducts = all
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.collection === product.collection || p.category === product.category)
    )
    .slice(0, 4);

  return {
    product,
    reviews: productReviews,
    relatedProducts,
  };
}

export async function addProductReview(input: {
  productId: number;
  customerName: string;
  customerTag?: string;
  rating: number;
  comment: string;
  spiceFeedback?: string;
}): Promise<{ review: Review; updatedRatingAvg: string; updatedReviewCount: number }> {
  await ensureDbSeeded();

  const cleanRating = Math.min(5, Math.max(1, Math.round(input.rating)));
  const [inserted] = await db
    .insert(reviews)
    .values({
      productId: input.productId,
      customerName: input.customerName.trim(),
      customerTag: input.customerTag?.trim() || "নিয়মিত গ্রাহক",
      rating: cleanRating,
      comment: input.comment.trim(),
      spiceFeedback: input.spiceFeedback?.trim() || "একদম পারফেক্ট",
      verifiedPurchase: true,
      helpfulCount: 1,
    })
    .returning();

  const allProductReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, input.productId));

  const count = allProductReviews.length;
  const sum = allProductReviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = count > 0 ? (sum / count).toFixed(2) : "5.00";

  await db
    .update(products)
    .set({
      ratingAvg: avg,
      reviewCount: count,
    })
    .where(eq(products.id, input.productId));

  return {
    review: inserted,
    updatedRatingAvg: avg,
    updatedReviewCount: count,
  };
}
