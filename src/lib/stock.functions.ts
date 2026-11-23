import { createServerFn } from "@tanstack/react-start";
import { SEED_STOCK_ITEMS } from "@/data/stock.seed";

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
    // 1. Direct database query in Node / Serverless context
    try {
      const { all } = await import("../../server/db/connection.js");
      const rows = await all(
        "SELECT * FROM stock_items ORDER BY category ASC, grade ASC, size ASC"
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return rows as StockRow[];
      }
    } catch {
      // Non-fatal if direct DB import is unavailable in bundling
    }

    // 2. Fetch from Express API endpoint if running with accessible local host
    try {
      const baseUrl = typeof process !== "undefined" && process.env?.VITE_APP_URL
        ? process.env.VITE_APP_URL
        : "http://127.0.0.1:5001";
      const res = await fetch(`${baseUrl}/api/stock`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.stock) && json.stock.length > 0) {
          return json.stock as StockRow[];
        }
      }
    } catch {}

    // 3. Fallback to production inventory seed
    return SEED_STOCK_ITEMS;
  }
);

