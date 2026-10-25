import { NextRequest, NextResponse } from "next/server";
import { addProductReview } from "@/db/queries";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productId,
      customerName,
      customerTag,
      rating,
      comment,
      spiceFeedback,
    } = body;

    if (!productId || !customerName || !comment || !rating) {
      return NextResponse.json(
        { error: "অনুগ্রহ করে আপনার নাম, রেটিং এবং মতামত লিখুন।" },
        { status: 400 }
      );
    }

    const result = await addProductReview({
      productId: Number(productId),
      customerName: String(customerName),
      customerTag: customerTag ? String(customerTag) : "নিয়মিত গ্রাহক",
      rating: Number(rating),
      comment: String(comment),
      spiceFeedback: spiceFeedback ? String(spiceFeedback) : "একদম পারফেক্ট",
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "রিভিউ জমা দিতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
