import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Section, SectionHead, Breadcrumbs, CtaBand } from "@/components/site/parts";
import { getStockItems, type StockRow } from "@/lib/stock.functions";

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
      { property: "og:url", content: "/stock" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/stock" }],
  }),
  component: StockPage,
});

const statusStyle: Record<string, string> = {
  ready: "border-primary/60 text-primary",
  limited: "border-amber-500/50 text-amber-400",
  indent: "border-border text-muted-foreground",
};

function StockPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["stock-items"],
    queryFn: () => getStockItems(),
  });

  const rows = data ?? [];
  const categories = useMemo(
    () => Array.from(new Set(rows.map((r) => r.category))).sort(),
    [rows],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (status !== "all" && r.status !== status) return false;
      if (!term) return true;
      return [r.grade, r.product, r.spec, r.size, r.rating ?? "", r.category]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [rows, q, category, status]);

  const lastVerified = rows.length
    ? rows.map((r) => r.verified_on).sort().slice(-1)[0]
    : null;

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
        {lastVerified ? (
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Stock verified {lastVerified} · {rows.length} live lines
          </p>
        ) : null}
      </Section>

      <Section>
        <div className="surface-panel grid gap-4 rounded-md p-5 md:grid-cols-[2fr_1fr_1fr]">
          <label className="flex flex-col gap-2">
            <span className="eyebrow">Search</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. 2205 weld neck, B564, 6&quot;"
              className="rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="eyebrow">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="eyebrow">Availability</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="all">All</option>
              <option value="ready">Ready stock</option>
              <option value="limited">Limited quantity</option>
            </select>
          </label>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading stock list…</p>
          ) : error ? (
            <p className="text-sm text-muted-foreground">
              Stock list is temporarily unavailable — please send your enquiry and we will confirm availability by return.
            </p>
          ) : (
            <div className="surface-panel overflow-x-auto rounded-md">
              <table className="spec-table">
                <thead>
                  <tr>
                    <th>Grade</th>
                    <th>Product</th>
                    <th>Size</th>
                    <th>Class / schedule</th>
                    <th>Specification</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Heat ref</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td>
                        {r.grade_slug ? (
                          <Link
                            to="/materials/$slug"
                            params={{ slug: r.grade_slug }}
                            className="text-primary hover:underline"
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
                      <td>{r.size}</td>
                      <td>{r.rating ?? "—"}</td>
                      <td>{r.spec}</td>
                      <td>
                        {Number(r.quantity).toLocaleString()} {r.unit}
                      </td>
                      <td>
                        <span
                          className={`rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
                            statusStyle[r.status] ?? statusStyle["indent"]
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="font-mono text-[11px] text-muted-foreground">{r.heat_ref ?? "—"}</td>
                      <td>
                        <Link
                          to="/rfq"
                          search={{ grade: r.grade, product: r.product, size: r.size, rating: r.rating ?? "" }}
                          className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-primary hover:underline"
                        >
                          Reserve / quote
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-muted-foreground">
                        No stock line matches that search — send an enquiry and we will quote a production slot.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
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
