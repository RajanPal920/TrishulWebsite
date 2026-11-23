import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X, RotateCcw, AlertCircle, ArrowRight } from "lucide-react";
import { Section, SectionHead, Breadcrumbs, CtaBand } from "@/components/site/parts";
import { getStockItems, type StockRow } from "@/lib/stock.functions";
import { SEED_STOCK_ITEMS } from "@/data/stock.seed";
import { api } from "@/lib/api";
import { company } from "@/data/company";

export const Route = createFileRoute("/stock")({
  head: () => ({
    meta: [
      { title: "Live Stock Availability — Flanges, Fittings & Pipe | Trishul Metals" },
      {
        name: "description",
        content:
          "Search ready stock of nickel alloy, duplex, super duplex and stainless CRA flanges, fittings, pipes, bars and plates held at our Kalamboli warehouse with size, class and spec.",
      },
      { property: "og:title", content: "Live Stock Availability | Trishul Metals & Alloys" },
      { property: "og:description", content: "Search what is physically ready in our Kalamboli warehouse." },
      { property: "og:url", content: `${company.siteUrl}/stock` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${company.siteUrl}/stock` }],
  }),
  component: StockPage,
});

const statusStyle: Record<string, string> = {
  ready: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  limited: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  indent: "border-border bg-muted/20 text-muted-foreground",
};

function StockPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["stock-items"],
    initialData: SEED_STOCK_ITEMS,
    staleTime: 15 * 1000,
    refetchOnMount: "always",
    queryFn: async (): Promise<StockRow[]> => {
      const isClient = typeof window !== "undefined";
      if (!isClient) {
        return SEED_STOCK_ITEMS;
      }

      // Priority 1: Fetch via live REST endpoint /api/stock (works directly on Vercel and local)
      try {
        const res = await fetch("/api/stock");
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.stock) && json.stock.length > 0) {
            return json.stock as StockRow[];
          }
        }
      } catch (clientErr) {
        console.warn("[Stock Client Fetch Notice]:", clientErr);
      }

      // Priority 2: Fallback to unified api client
      try {
        const res = await api.stock.getList();
        if (res && Array.isArray(res.stock) && res.stock.length > 0) {
          return res.stock as StockRow[];
        }
      } catch (apiErr) {
        console.warn("[Stock Api Client Notice]:", apiErr);
      }

      return SEED_STOCK_ITEMS;
    },
    retry: 2,
  });

  const rows = data && data.length > 0 ? data : SEED_STOCK_ITEMS;
  const categories = useMemo(
    () => Array.from(new Set(rows.map((r) => r.category).filter(Boolean))).sort(),
    [rows],
  );

  const filtered = useMemo(() => {
    const cleanQ = q.trim().toLowerCase();
    const words = cleanQ ? cleanQ.replace(/[,;]/g, " ").split(/\s+/).filter(Boolean) : [];

    return rows.filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (status !== "all" && r.status !== status) return false;
      if (words.length === 0) return true;

      const searchableText = [
        r.grade,
        r.grade_slug ?? "",
        r.product,
        r.product_slug ?? "",
        r.spec,
        r.size,
        r.rating ?? "",
        r.category,
        r.heat_ref ?? "",
        r.location ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return words.every((word) => searchableText.includes(word));
    });
  }, [rows, q, category, status]);

  const lastVerified = rows.length
    ? rows.map((r) => r.verified_on).sort().slice(-1)[0]
    : null;

  const hasActiveFilters = q.trim() !== "" || category !== "all" || status !== "all";

  const handleResetFilters = () => {
    setQ("");
    setCategory("all");
    setStatus("all");
  };

  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Live stock" }]} />
        <div className="mt-6">
          <SectionHead as="h1"
            eyebrow="Stock lookup"
            title="What is ready in the warehouse right now"
            intro="Search our Kalamboli ready-stock list by grade, product, size or specification. Ready lines ship against a released order; limited lines are part-quantity and balance is produced to order."
          />
        </div>

        <div className="mt-4 rounded-sm border border-primary/25 bg-primary/5 p-4 text-xs leading-relaxed text-muted-foreground">
          <p className="font-semibold text-primary">Indicative Warehouse Inventory Notice</p>
          <p className="mt-1">
            Listed inventory quantities, dimensional specifications and demonstration heat numbers illustrate active material stock held at our Kalamboli facility. Current real-time allocations and certified mill heat numbers are assigned and confirmed upon formal RFQ quotation.
          </p>
        </div>

        {lastVerified ? (
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Stock verified {lastVerified} · {rows.length} live lines
          </p>
        ) : null}
      </Section>

      <Section className="pb-28 sm:pb-16">
        <div className="surface-panel grid gap-4 rounded-md p-4 sm:p-5 md:grid-cols-[2fr_1fr_1fr]">
          <label className="flex flex-col gap-1.5">
            <span className="eyebrow text-xs">Search</span>
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g. 2205 weld neck, B564, 6&quot;"
                className="w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              />
              {q ? (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search query"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="eyebrow text-xs">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">All categories ({rows.length})</option>
              {categories.map((c) => {
                const count = rows.filter((r) => r.category === c).length;
                return (
                  <option key={c} value={c}>
                    {c} ({count})
                  </option>
                );
              })}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="eyebrow text-xs">Availability</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">All availability</option>
              <option value="ready">Ready stock</option>
              <option value="limited">Limited quantity</option>
            </select>
          </label>
        </div>

        {hasActiveFilters ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-sm border border-border/60 bg-card/60 px-3.5 py-2 text-xs">
            <span className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
              <span className="font-semibold text-foreground">{rows.length}</span> lines
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-primary hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              Reset all filters
            </button>
          </div>
        ) : null}

        <div className="mt-6">
          {isLoading ? (
            <div className="surface-panel flex flex-col items-center justify-center rounded-md p-12 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Loading warehouse inventory from Kalamboli facility…
              </p>
            </div>
          ) : error ? (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                <AlertCircle className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-red-400">Unable to load stock inventory</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Could not retrieve live stock data. Please check your network connection or send a direct inquiry.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="rounded-sm bg-primary px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-90"
                >
                  Retry Stock Lookup
                </button>
                <Link
                  to="/rfq"
                  className="rounded-sm border border-border px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground hover:border-primary"
                >
                  Send RFQ Directly
                </Link>
              </div>
            </div>
          ) : (
            <div className="surface-panel overflow-hidden rounded-md border border-border">
              {/* Mobile Swipe Guidance Bar */}
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-2 text-xs text-muted-foreground md:hidden">
                <span className="font-mono text-[11px] font-medium text-foreground">
                  {filtered.length} item{filtered.length === 1 ? "" : "s"} listed
                </span>
                <span className="font-mono text-[11px] font-semibold text-primary">
                  ← Swipe table horizontally for specs →
                </span>
              </div>

              <div className="overflow-x-auto scrollbar-thin overscroll-x-contain touch-pan-x">
                <table className="spec-table w-full min-w-[780px]">
                  <thead>
                    <tr>
                      <th className="min-w-[130px]">Grade</th>
                      <th className="min-w-[150px]">Product</th>
                      <th className="min-w-[100px]">Size</th>
                      <th className="min-w-[120px]">Class / schedule</th>
                      <th className="min-w-[170px]">Specification</th>
                      <th className="min-w-[90px]">Qty</th>
                      <th className="min-w-[90px]">Status</th>
                      <th className="min-w-[90px]">Heat ref</th>
                      <th className="min-w-[140px] text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id}>
                        <td className="font-medium text-foreground">
                          {r.grade_slug ? (
                            <Link
                              to="/materials/$slug"
                              params={{ slug: r.grade_slug }}
                              className="text-primary hover:underline font-semibold"
                            >
                              {r.grade}
                            </Link>
                          ) : (
                            r.grade
                          )}
                        </td>
                        <td>
                          {r.product_slug ? (
                            <Link
                              to="/products/$slug"
                              params={{ slug: r.product_slug }}
                              className="hover:text-primary"
                            >
                              {r.product}
                            </Link>
                          ) : (
                            r.product
                          )}
                        </td>
                        <td className="font-mono text-xs text-foreground">{r.size}</td>
                        <td className="font-mono text-xs text-muted-foreground">{r.rating ?? "—"}</td>
                        <td className="text-xs text-muted-foreground">{r.spec}</td>
                        <td className="font-mono text-xs font-semibold text-foreground">
                          {Number(r.quantity).toLocaleString()} {r.unit}
                        </td>
                        <td>
                          <span
                            className={`inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                              statusStyle[r.status] ?? statusStyle["indent"]
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="font-mono text-[11px] text-muted-foreground">{r.heat_ref ?? "—"}</td>
                        <td className="text-right">
                          <Link
                            to="/rfq"
                            search={{ grade: r.grade, product: r.product, size: r.size, rating: r.rating ?? "" }}
                            className="inline-flex items-center gap-1 whitespace-nowrap rounded-sm border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            Reserve / quote
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-10 text-center text-muted-foreground">
                          <p className="text-sm font-medium text-foreground">
                            {hasActiveFilters
                              ? "No stock line matches that search or category filter."
                              : "No stock lines currently available in the warehouse database."}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Send an enquiry to our technical sales desk and we will confirm rolling slot or mill allocation.
                          </p>
                          {hasActiveFilters ? (
                            <button
                              type="button"
                              onClick={handleResetFilters}
                              className="mt-3 inline-flex items-center gap-1.5 rounded-sm border border-primary/40 bg-primary/10 px-3.5 py-1.5 font-mono text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              Reset All Filters
                            </button>
                          ) : (
                            <div className="mt-4 flex justify-center">
                              <Link
                                to="/rfq"
                                className="rounded-sm bg-primary px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-90"
                              >
                                Request Custom Quote
                              </Link>
                            </div>
                          )}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Quantities are indicative and move against live orders. Availability is confirmed in writing at quotation
          stage along with heat numbers and the certification package.
        </p>
      </Section>
      <CtaBand title="Need a line reserved against your project?" />
    </>
  );
}
