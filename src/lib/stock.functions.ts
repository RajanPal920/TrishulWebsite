import { createServerFn } from "@tanstack/react-start";

export interface StockRow {
  id: string;
  grade: string;
  grade_slug: string | null;
  product: string;
  product_slug: string | null;
  category: string;
  size: string;
  rating: string | null;
  spec: string;
  quantity: number;
  unit: string;
  location: string;
  status: string;
  heat_ref: string | null;
  verified_on: string;
  created_at?: string;
}

export const getStockItems = createServerFn({ method: "GET" }).handler(
  async (): Promise<StockRow[]> => {
    try {
      const { all } = await import("../../server/db/connection.js");
      const rows = await all(
        "SELECT * FROM stock_items ORDER BY category ASC, grade ASC, size ASC"
      );
      return (rows ?? []) as StockRow[];
    } catch (err) {
      console.warn("[Stock Functions Warning]:", err);
      return [];
    }
  }
);

