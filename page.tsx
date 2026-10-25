import React from "react";
import { getAllProducts } from "@/db/queries";
import { StorefrontClient } from "@/components/StorefrontClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getAllProducts();

  return <StorefrontClient initialProducts={products} />;
}
