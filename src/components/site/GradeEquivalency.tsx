import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { materials, type Family } from "@/data/materials";
import { SpecTable } from "@/components/site/parts";
import { ResultTransition } from "@/components/site/InteractionMotion";

const lookupFamilies: Family[] = ["nickel", "duplex", "super-duplex", "stainless"];

const familyShort: Record<Family, string> = {
  nickel: "Nickel Alloy",
  duplex: "Duplex",
  "super-duplex": "Super Duplex",
  stainless: "Stainless",
  carbon: "Carbon Steel",
  polymer: "Polymer",
};

interface Row {
  slug: string;
  name: string;
  uns: string;
  astm: string;
  werkstoff: string;
  family: Family;
}

const rows: Row[] = materials
  .filter((m) => lookupFamilies.includes(m.family))
  .map((m) => ({
    slug: m.slug,
    name: m.name,
    uns: m.uns,
    astm: [...m.standards.flanges, ...m.standards.fittings].slice(0, 2).join(" / "),
    werkstoff: m.werkstoff ?? "—",
    family: m.family,
  }));

const inputCls =
  "rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

export function GradeEquivalency() {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<Family | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (family !== "all" && r.family !== family) return false;
      if (!q) return true;
      return [r.name, r.uns, r.astm, r.werkstoff].some((v) => v.toLowerCase().includes(q));
    });
  }, [query, family]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <label className="flex w-full max-w-sm flex-col gap-2">
          <span className="eyebrow">Search designation</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 2205, S31803, 1.4462, A182…"
            className={inputCls}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {(["all", ...lookupFamilies] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFamily(f)}
              className={`rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                family === f
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : familyShort[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <ResultTransition transitionKey={`${query}-${family}`}>
          <SpecTable
            caption={`${filtered.length} of ${rows.length} grades — UNS / ASTM / ASME / EN / Werkstoff cross-reference`}
            head={["Common name", "UNS", "ASTM / ASME", "EN / Werkstoff", "Family"]}
            rows={filtered.map((r) => [
            <Link
              key="n"
              to="/materials/$slug"
              params={{ slug: r.slug }}
              className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              {r.name}
            </Link>,
            <span key="u" className="font-mono text-xs">
              {r.uns}
            </span>,
            <span key="a" className="font-mono text-xs">
              {r.astm}
            </span>,
            <span key="w" className="font-mono text-xs">
              {r.werkstoff}
            </span>,
            <span
              key="f"
              className="inline-block rounded-sm border border-primary/40 bg-primary/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-primary"
            >
              {familyShort[r.family]}
            </span>,
            ])}
          />
        </ResultTransition>
      </div>
      {filtered.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No grade matches — try the UNS number or the Werkstoff digit string.
        </p>
      ) : null}
    </div>
  );
}
