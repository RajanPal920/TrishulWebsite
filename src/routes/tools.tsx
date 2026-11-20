import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calculator, Table, Search, RotateCcw, Check, ArrowUpRight } from "lucide-react";
import { Section, SectionHead, Breadcrumbs, CtaBand } from "@/components/site/parts";
import { GradeFinder } from "@/components/site/GradeFinder";
import { GradeEquivalency } from "@/components/site/GradeEquivalency";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Pipe Weight, Pressure & Flange Calculators | Trishul Metals & Alloys" },
      {
        name: "description",
        content:
          "Engineering tools: pipe and tube weight calculator by alloy density, ASME B36.10M / B36.19M dimensional schedule reference table, Barlow allowable pressure, flange class rating, and grade equivalency cross-reference across UNS, ASTM, EN and Werkstoff.",
      },
      { property: "og:title", content: "Pipe Weight & Engineering Calculators | Trishul Metals" },
      {
        property: "og:description",
        content:
          "Interactive pipe weight per metre calculator, ASME schedule wall thickness reference table, Barlow internal pressure, and international material cross-reference.",
      },
      { property: "og:url", content: "https://www.trishulmetal.com/tools" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.trishulmetal.com/tools" }],
  }),
  component: ToolsPage,
});

/* ------------------------------------------------------------------ */
/* 1. Alloy Densities (g/cm³)                                         */
/* ------------------------------------------------------------------ */
const densities: { name: string; value: number }[] = [
  { name: "Carbon steel (A106 / A53)", value: 7.85 },
  { name: "Stainless 304 / 304L", value: 8.0 },
  { name: "Stainless 316 / 316L", value: 8.0 },
  { name: "Stainless 904L (UNS N08904)", value: 7.95 },
  { name: "Duplex 2205 (UNS S31803 / S32205)", value: 7.8 },
  { name: "Super duplex 2507 (UNS S32750)", value: 7.8 },
  { name: "Inconel 625 (UNS N06625)", value: 8.44 },
  { name: "Inconel 600 (UNS N06600)", value: 8.47 },
  { name: "Incoloy 825 (UNS N08825)", value: 8.14 },
  { name: "Hastelloy C276 (UNS N10276)", value: 8.89 },
  { name: "Monel 400 (UNS N04400)", value: 8.8 },
  { name: "Nickel 200 (UNS N02200)", value: 8.89 },
  { name: "Alloy 20 (UNS N08020)", value: 8.08 },
  { name: "Titanium Grade 2", value: 4.51 },
  { name: "UPVC / PVC-U Industrial Pipe", value: 1.42 },
  { name: "CPVC / PVC-C Schedule 80", value: 1.55 },
];

/* ------------------------------------------------------------------ */
/* 2. ASME B36.10M / B36.19M Dimensional Reference Table               */
/* ------------------------------------------------------------------ */
interface NpsRow {
  nps: string;
  dn: string;
  odMm: number;
  odIn: number;
  s10?: number;
  s40?: number;
  s80?: number;
  s160?: number;
  xxs?: number;
}

const npsReferenceData: NpsRow[] = [
  { nps: '1/8"', dn: "DN 6", odMm: 10.3, odIn: 0.405, s10: 1.24, s40: 1.73, s80: 2.41 },
  { nps: '1/4"', dn: "DN 8", odMm: 13.7, odIn: 0.54, s10: 1.65, s40: 2.24, s80: 3.02 },
  { nps: '3/8"', dn: "DN 10", odMm: 17.1, odIn: 0.675, s10: 1.65, s40: 2.31, s80: 3.2 },
  { nps: '1/2"', dn: "DN 15", odMm: 21.3, odIn: 0.84, s10: 2.11, s40: 2.77, s80: 3.73, s160: 4.78, xxs: 7.47 },
  { nps: '3/4"', dn: "DN 20", odMm: 26.7, odIn: 1.05, s10: 2.11, s40: 2.87, s80: 3.91, s160: 5.56, xxs: 7.82 },
  { nps: '1"', dn: "DN 25", odMm: 33.4, odIn: 1.315, s10: 2.77, s40: 3.38, s80: 4.55, s160: 6.35, xxs: 9.09 },
  { nps: '1.1/4"', dn: "DN 32", odMm: 42.2, odIn: 1.66, s10: 2.77, s40: 3.56, s80: 4.85, s160: 6.35, xxs: 9.7 },
  { nps: '1.1/2"', dn: "DN 40", odMm: 48.3, odIn: 1.9, s10: 2.77, s40: 3.68, s80: 5.08, s160: 7.14, xxs: 10.15 },
  { nps: '2"', dn: "DN 50", odMm: 60.3, odIn: 2.375, s10: 2.77, s40: 3.91, s80: 5.54, s160: 8.74, xxs: 11.07 },
  { nps: '2.1/2"', dn: "DN 65", odMm: 73.0, odIn: 2.875, s10: 3.05, s40: 5.16, s80: 7.01, s160: 9.53, xxs: 14.02 },
  { nps: '3"', dn: "DN 80", odMm: 88.9, odIn: 3.5, s10: 3.05, s40: 5.49, s80: 7.62, s160: 11.13, xxs: 15.24 },
  { nps: '3.1/2"', dn: "DN 90", odMm: 101.6, odIn: 4.0, s10: 3.05, s40: 5.74, s80: 8.08 },
  { nps: '4"', dn: "DN 100", odMm: 114.3, odIn: 4.5, s10: 3.05, s40: 6.02, s80: 8.56, s160: 13.49, xxs: 17.12 },
  { nps: '5"', dn: "DN 125", odMm: 141.3, odIn: 5.563, s10: 3.4, s40: 6.55, s80: 9.53, s160: 15.88, xxs: 19.05 },
  { nps: '6"', dn: "DN 150", odMm: 168.3, odIn: 6.625, s10: 3.4, s40: 7.11, s80: 10.97, s160: 18.26, xxs: 21.95 },
  { nps: '8"', dn: "DN 200", odMm: 219.1, odIn: 8.625, s10: 3.76, s40: 8.18, s80: 12.7, s160: 23.01, xxs: 22.23 },
  { nps: '10"', dn: "DN 250", odMm: 273.0, odIn: 10.75, s10: 4.19, s40: 9.27, s80: 15.09, s160: 28.58, xxs: 25.4 },
  { nps: '12"', dn: "DN 300", odMm: 323.9, odIn: 12.75, s10: 4.57, s40: 10.31, s80: 17.48, s160: 33.32, xxs: 25.4 },
  { nps: '14"', dn: "DN 350", odMm: 355.6, odIn: 14.0, s10: 4.78, s40: 11.13, s80: 19.05, s160: 35.71 },
  { nps: '16"', dn: "DN 400", odMm: 406.4, odIn: 16.0, s10: 4.78, s40: 12.7, s80: 21.44, s160: 40.49 },
  { nps: '18"', dn: "DN 450", odMm: 457.0, odIn: 18.0, s10: 4.78, s40: 14.27, s80: 23.83, s160: 45.24 },
  { nps: '20"', dn: "DN 500", odMm: 508.0, odIn: 20.0, s10: 5.54, s40: 15.09, s80: 26.19, s160: 50.01 },
  { nps: '24"', dn: "DN 600", odMm: 610.0, odIn: 24.0, s10: 6.35, s40: 17.48, s80: 30.96, s160: 59.54 },
];

/* ------------------------------------------------------------------ */
/* 3. Common Allowable Stress Values (MPa) for Barlow Formula          */
/* ------------------------------------------------------------------ */
const allowableStress: { name: string; value: number }[] = [
  { name: "A106 Gr B carbon steel", value: 138 },
  { name: "A312 TP304 / 304L stainless", value: 115 },
  { name: "A312 TP316 / 316L stainless", value: 115 },
  { name: "A790 duplex 2205", value: 179 },
  { name: "A790 super duplex 2507", value: 190 },
  { name: "B444 Inconel 625", value: 193 },
  { name: "B423 Incoloy 825", value: 152 },
  { name: "B622 Hastelloy C276", value: 189 },
  { name: "B165 Monel 400", value: 120 },
];

/* ------------------------------------------------------------------ */
/* UI Helper Components                                               */
/* ------------------------------------------------------------------ */
function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="eyebrow">{label}</span>
      {children}
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

const inputCls =
  "rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function Result({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="mt-6 rounded-sm border border-primary/40 bg-primary/5 p-5">
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((r) => (
          <div key={r.label} className="rounded-sm bg-card/60 p-3 border border-border/60">
            <dt className="eyebrow text-muted-foreground">{r.label}</dt>
            <dd className="mt-1 font-display text-lg font-bold text-primary">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PIPE & TUBE WEIGHT CALCULATOR COMPONENT                            */
/* ------------------------------------------------------------------ */
interface PipeWeightProps {
  od: string;
  setOd: (val: string) => void;
  wt: string;
  setWt: (val: string) => void;
  len: string;
  setLen: (val: string) => void;
  density: string;
  setDensity: (val: string) => void;
  selectedNote?: string | null;
}

function PipeWeight({
  od,
  setOd,
  wt,
  setWt,
  len,
  setLen,
  density,
  setDensity,
  selectedNote,
}: PipeWeightProps) {
  const out = useMemo(() => {
    const D = parseFloat(od) || 0;
    const T = parseFloat(wt) || 0;
    const L = parseFloat(len) || 0;
    const rho = parseFloat(density) || 0;
    if (T <= 0 || D <= T * 2) return null;
    const kgPerM = ((D - T) * T * Math.PI * rho) / 1000;
    const id = D - 2 * T;
    const totalKg = kgPerM * L;
    return {
      kgPerM,
      total: totalKg,
      totalTons: totalKg / 1000,
      id,
      lbPerFt: kgPerM * 0.671969,
    };
  }, [od, wt, len, density]);

  return (
    <div className="surface-panel rounded-md p-6 border border-border/80 shadow-md">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/15 text-primary border border-primary/30">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Pipe &amp; Tube Weight Calculator</h2>
            <p className="text-xs text-muted-foreground">
              Calculate weight per metre, foot and total consignment tonnage from outside diameter, wall thickness and alloy density.
            </p>
          </div>
        </div>
        <span className="font-mono text-xs font-semibold text-primary rounded-full bg-primary/10 border border-primary/20 px-3 py-1 self-start sm:self-auto">
          Theoretical Metric / Imperial
        </span>
      </div>

      {selectedNote && (
        <div className="mt-4 flex items-center justify-between rounded-sm border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0 text-primary" />
            <span className="font-medium">Active Dimension: <strong>{selectedNote}</strong></span>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">Loaded from Reference Table</span>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Outside diameter (mm)" hint="Outer nominal diameter">
          <input
            value={od}
            onChange={(e) => setOd(e.target.value)}
            className={inputCls}
            inputMode="decimal"
            placeholder="e.g. 168.3"
          />
        </Field>

        <Field label="Wall thickness (mm)" hint="Schedule wall thickness">
          <input
            value={wt}
            onChange={(e) => setWt(e.target.value)}
            className={inputCls}
            inputMode="decimal"
            placeholder="e.g. 7.11"
          />
        </Field>

        <Field label="Length (metres)" hint="Standard pipe length">
          <div className="space-y-1.5">
            <input
              value={len}
              onChange={(e) => setLen(e.target.value)}
              className={inputCls + " w-full"}
              inputMode="decimal"
              placeholder="e.g. 6"
            />
            <div className="flex gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => setLen("1")}
                className="rounded-xs border border-border bg-card px-2 py-0.5 text-muted-foreground hover:text-foreground"
              >
                1 m
              </button>
              <button
                type="button"
                onClick={() => setLen("6")}
                className="rounded-xs border border-border bg-card px-2 py-0.5 text-muted-foreground hover:text-foreground"
              >
                6 m (SRL)
              </button>
              <button
                type="button"
                onClick={() => setLen("12")}
                className="rounded-xs border border-border bg-card px-2 py-0.5 text-muted-foreground hover:text-foreground"
              >
                12 m (DRL)
              </button>
            </div>
          </div>
        </Field>

        <Field label="Alloy Material & Density (g/cm³)">
          <select
            value={density}
            onChange={(e) => setDensity(e.target.value)}
            className={inputCls}
          >
            {densities.map((d) => (
              <option key={d.name} value={d.value}>
                {d.name} — {d.value} g/cm³
              </option>
            ))}
          </select>
        </Field>
      </div>

      {out ? (
        <Result
          rows={[
            { label: "Weight per metre", value: `${out.kgPerM.toFixed(2)} kg/m` },
            { label: "Weight per foot", value: `${out.lbPerFt.toFixed(2)} lb/ft` },
            {
              label: "Consignment total",
              value: out.total >= 1000 ? `${(out.total / 1000).toFixed(3)} MT (${out.total.toFixed(1)} kg)` : `${out.total.toFixed(1)} kg`,
            },
            { label: "Inside diameter (ID)", value: `${out.id.toFixed(2)} mm` },
          ]}
        />
      ) : (
        <p className="mt-6 text-xs text-muted-foreground rounded-sm border border-border bg-card p-3">
          Please enter a valid outside diameter and a wall thickness smaller than half the outside diameter.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* INTERACTIVE ASME REFERENCE TABLE COMPONENT                         */
/* ------------------------------------------------------------------ */
interface InteractiveTableProps {
  onSelect: (od: number, wt: number, npsLabel: string, schedLabel: string) => void;
  activeNps?: string | null;
}

function InteractiveNpsTable({ onSelect, activeNps }: InteractiveTableProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return npsReferenceData;
    return npsReferenceData.filter(
      (r) =>
        r.nps.toLowerCase().includes(q) ||
        r.dn.toLowerCase().includes(q) ||
        String(r.odMm).includes(q) ||
        String(r.odIn).includes(q)
    );
  }, [query]);

  return (
    <div className="surface-panel rounded-md border border-border/80 shadow-md p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary/15 text-primary border border-primary/30">
            <Table className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              ASME B36.10M &amp; B36.19M Dimensional Reference Table
            </h3>
            <p className="text-xs text-muted-foreground">
              Standard nominal pipe sizes (NPS) against outside diameter and schedule wall thicknesses. Click any thickness to calculate instantly above.
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search size (e.g. 2, 6, 8, DN 150)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-sm border border-border bg-background pl-9 pr-8 py-1.5 text-xs text-foreground outline-none focus:border-primary"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-2 text-xs text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
            <tr>
              <th className="px-3.5 py-3">NPS Size</th>
              <th className="px-3 py-3">Metric (DN)</th>
              <th className="px-3 py-3">Outside Dia (OD)</th>
              <th className="px-2.5 py-3 text-center">SCH 10S</th>
              <th className="px-2.5 py-3 text-center">SCH 40 / STD</th>
              <th className="px-2.5 py-3 text-center">SCH 80 / XS</th>
              <th className="px-2.5 py-3 text-center">SCH 160</th>
              <th className="px-2.5 py-3 text-center">XXS</th>
              <th className="px-3 py-3 text-right">Quick Apply</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-xs text-muted-foreground">
                  No matching pipe sizes found. Clear search to view all standard sizes.
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const isSelected = activeNps && activeNps.includes(r.nps);
                return (
                  <tr
                    key={r.nps}
                    className={`transition-colors ${
                      isSelected ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-muted/30"
                    }`}
                  >
                    <td className="px-3.5 py-2.5 font-bold text-foreground font-mono">{r.nps}</td>
                    <td className="px-3 py-2.5 text-muted-foreground font-mono">{r.dn}</td>
                    <td className="px-3 py-2.5 font-mono text-primary font-semibold">
                      {r.odMm.toFixed(1)} mm <span className="text-[10px] text-muted-foreground font-normal">({r.odIn.toFixed(3)}")</span>
                    </td>

                    {/* SCH 10S */}
                    <td className="px-2.5 py-2.5 text-center">
                      {r.s10 ? (
                        <button
                          type="button"
                          onClick={() => onSelect(r.odMm, r.s10!, r.nps, "SCH 10S")}
                          className="rounded-xs border border-border bg-card/60 px-2 py-0.5 font-mono text-[11px] text-foreground hover:border-primary hover:bg-primary/10 transition-colors"
                          title={`Calculate ${r.nps} SCH 10S (${r.s10} mm)`}
                        >
                          {r.s10.toFixed(2)} mm
                        </button>
                      ) : (
                        <span className="text-[#EAEAEA]">—</span>
                      )}
                    </td>

                    {/* SCH 40 / STD */}
                    <td className="px-2.5 py-2.5 text-center">
                      {r.s40 ? (
                        <button
                          type="button"
                          onClick={() => onSelect(r.odMm, r.s40!, r.nps, "SCH 40")}
                          className="rounded-xs border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          title={`Calculate ${r.nps} SCH 40 (${r.s40} mm)`}
                        >
                          {r.s40.toFixed(2)} mm
                        </button>
                      ) : (
                        <span className="text-[#EAEAEA]">—</span>
                      )}
                    </td>

                    {/* SCH 80 / XS */}
                    <td className="px-2.5 py-2.5 text-center">
                      {r.s80 ? (
                        <button
                          type="button"
                          onClick={() => onSelect(r.odMm, r.s80!, r.nps, "SCH 80")}
                          className="rounded-xs border border-border bg-card/60 px-2 py-0.5 font-mono text-[11px] text-foreground hover:border-primary hover:bg-primary/10 transition-colors"
                          title={`Calculate ${r.nps} SCH 80 (${r.s80} mm)`}
                        >
                          {r.s80.toFixed(2)} mm
                        </button>
                      ) : (
                        <span className="text-[#EAEAEA]">—</span>
                      )}
                    </td>

                    {/* SCH 160 */}
                    <td className="px-2.5 py-2.5 text-center">
                      {r.s160 ? (
                        <button
                          type="button"
                          onClick={() => onSelect(r.odMm, r.s160!, r.nps, "SCH 160")}
                          className="rounded-xs border border-border bg-card/60 px-2 py-0.5 font-mono text-[11px] text-foreground hover:border-primary hover:bg-primary/10 transition-colors"
                          title={`Calculate ${r.nps} SCH 160 (${r.s160} mm)`}
                        >
                          {r.s160.toFixed(2)} mm
                        </button>
                      ) : (
                        <span className="text-[#EAEAEA]">—</span>
                      )}
                    </td>

                    {/* XXS */}
                    <td className="px-2.5 py-2.5 text-center">
                      {r.xxs ? (
                        <button
                          type="button"
                          onClick={() => onSelect(r.odMm, r.xxs!, r.nps, "XXS")}
                          className="rounded-xs border border-border bg-card/60 px-2 py-0.5 font-mono text-[11px] text-foreground hover:border-primary hover:bg-primary/10 transition-colors"
                          title={`Calculate ${r.nps} XXS (${r.xxs} mm)`}
                        >
                          {r.xxs.toFixed(2)} mm
                        </button>
                      ) : (
                        <span className="text-[#EAEAEA]">—</span>
                      )}
                    </td>

                    {/* Quick Apply Button */}
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => onSelect(r.odMm, r.s40 || r.s10 || 3.91, r.nps, r.s40 ? "SCH 40" : "SCH 10S")}
                        className="inline-flex items-center gap-1 rounded-sm bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                      >
                        <span>Calculate</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground border-t border-border pt-2 flex items-center justify-between">
        <span>ASME B36.10M (Carbon &amp; Alloy Steel) &amp; ASME B36.19M (Stainless Steel) standard nominal schedules.</span>
        <span className="text-primary font-mono">Click any thickness button to calculate weight above ↑</span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* COMPANION CALCULATORS: BARLOW, FLANGE CLASS, UNIT CONVERSION       */
/* ------------------------------------------------------------------ */
function BarlowCalc() {
  const [od, setOd] = useState("168.3");
  const [wt, setWt] = useState("7.11");
  const [stress, setStress] = useState("138");
  const [ca, setCa] = useState("1.5");
  const [eff, setEff] = useState("1");

  const out = useMemo(() => {
    const D = parseFloat(od) || 0;
    const T = (parseFloat(wt) || 0) - (parseFloat(ca) || 0);
    const S = parseFloat(stress) || 0;
    const E = parseFloat(eff) || 1;
    if (T <= 0 || D <= 0) return null;
    const p = (2 * S * E * T) / D; // MPa
    return { mpa: p, bar: p * 10, psi: p * 145.038 };
  }, [od, wt, stress, ca, eff]);

  return (
    <div className="surface-panel rounded-md p-6 border border-border/80 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="font-display text-lg font-bold text-foreground">Allowable Internal Pressure (Barlow)</h3>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Straight-pipe design pressure using Barlow's formula: P = 2·S·E·t / D with corrosion allowance deducted.
        </p>
        <div className="mt-4 space-y-3">
          <Field label="Outside diameter (mm)">
            <input value={od} onChange={(e) => setOd(e.target.value)} className={inputCls} inputMode="decimal" />
          </Field>
          <Field label="Wall thickness (mm)">
            <input value={wt} onChange={(e) => setWt(e.target.value)} className={inputCls} inputMode="decimal" />
          </Field>
          <Field label="Allowable stress S (MPa)">
            <select value={stress} onChange={(e) => setStress(e.target.value)} className={inputCls}>
              {allowableStress.map((s) => (
                <option key={s.name} value={s.value}>
                  {s.name} — {s.value} MPa
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Joint efficiency E">
              <select value={eff} onChange={(e) => setEff(e.target.value)} className={inputCls}>
                <option value="1">1.00 — seamless</option>
                <option value="0.85">0.85 — ERW / welded</option>
                <option value="0.8">0.80 — welded</option>
              </select>
            </Field>
            <Field label="Corrosion allowance (mm)">
              <input value={ca} onChange={(e) => setCa(e.target.value)} className={inputCls} inputMode="decimal" />
            </Field>
          </div>
        </div>
      </div>
      {out ? (
        <div className="mt-4 rounded-sm border border-primary/30 bg-primary/5 p-3 text-xs">
          <span className="eyebrow text-muted-foreground">Calculated Allowable Pressure</span>
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-xl font-bold text-primary">{out.bar.toFixed(1)} bar</span>
            <span className="text-muted-foreground">({out.psi.toFixed(0)} psi / {out.mpa.toFixed(2)} MPa)</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const flangeClasses = [
  { cls: "150", bar: 19.6, psi: 285 },
  { cls: "300", bar: 51.1, psi: 740 },
  { cls: "400", bar: 68.1, psi: 990 },
  { cls: "600", bar: 102.1, psi: 1480 },
  { cls: "900", bar: 153.2, psi: 2220 },
  { cls: "1500", bar: 255.3, psi: 3705 },
  { cls: "2500", bar: 425.5, psi: 6170 },
];

function FlangeClassCalc() {
  const [pressure, setPressure] = useState("40");
  const p = parseFloat(pressure) || 0;
  const match = flangeClasses.find((c) => c.bar >= p);

  return (
    <div className="surface-panel rounded-md p-6 border border-border/80 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="font-display text-lg font-bold text-foreground">Flange Class Selector (ASME B16.5)</h3>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Minimum pressure class for a Group 2.2 (316/316L) flange at ambient temperature (38 °C).
        </p>
        <div className="mt-4">
          <Field label="Design operating pressure (bar g)">
            <input
              value={pressure}
              onChange={(e) => setPressure(e.target.value)}
              className={inputCls}
              inputMode="decimal"
              placeholder="e.g. 40"
            />
          </Field>
        </div>
      </div>
      <div className="mt-4 rounded-sm border border-primary/30 bg-primary/5 p-3 text-xs">
        <span className="eyebrow text-muted-foreground">Recommended Flange Class</span>
        <div className="mt-1">
          <span className="font-mono text-xl font-bold text-primary">
            {match ? `Class ${match.cls}` : "Above Class 2500 — API 6A"}
          </span>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Rating at 38 °C: {match ? `${match.bar} bar / ${match.psi} psi` : "Requires specialized API rating"}
          </p>
        </div>
      </div>
    </div>
  );
}

function UnitConverter() {
  const [inch, setInch] = useState("6");
  const [bar, setBar] = useState("40");
  const [kg, setKg] = useState("1000");

  return (
    <div className="surface-panel rounded-md p-6 border border-border/80 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="font-display text-lg font-bold text-foreground">Quick Engineering Unit Conversion</h3>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Instant two-way conversion for piping dimensions, pressure ratings and weight.
        </p>
        <div className="mt-4 space-y-3">
          <Field label="Inches → Millimetres" hint={`${((parseFloat(inch) || 0) * 25.4).toFixed(2)} mm`}>
            <input value={inch} onChange={(e) => setInch(e.target.value)} className={inputCls} inputMode="decimal" />
          </Field>
          <Field
            label="Bar → PSI / MPa"
            hint={`${((parseFloat(bar) || 0) * 14.5038).toFixed(1)} psi · ${((parseFloat(bar) || 0) / 10).toFixed(2)} MPa`}
          >
            <input value={bar} onChange={(e) => setBar(e.target.value)} className={inputCls} inputMode="decimal" />
          </Field>
          <Field label="Kilograms → Pounds (lb)" hint={`${((parseFloat(kg) || 0) * 2.20462).toFixed(1)} lb`}>
            <input value={kg} onChange={(e) => setKg(e.target.value)} className={inputCls} inputMode="decimal" />
          </Field>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN TOOLS PAGE COMPONENT                                          */
/* ------------------------------------------------------------------ */
function ToolsPage() {
  const [od, setOd] = useState("168.3");
  const [wt, setWt] = useState("7.11");
  const [len, setLen] = useState("6");
  const [density, setDensity] = useState("7.85");
  const [selectedNote, setSelectedNote] = useState<string | null>(
    'NPS 6" SCH 40 (OD 168.3 mm, Wall 7.11 mm)'
  );

  const handleSelectPipe = (newOd: number, newWt: number, npsLabel: string, schedLabel: string) => {
    setOd(newOd.toFixed(1));
    setWt(newWt.toFixed(2));
    setSelectedNote(`${npsLabel} ${schedLabel} (OD ${newOd.toFixed(1)} mm, Wall ${newWt.toFixed(2)} mm)`);

    // Smooth scroll up to pipe weight calculator
    if (typeof document !== "undefined") {
      const el = document.getElementById("pipe-weight-calculator");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <>
      {/* 1. HERO HEADER */}
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Technical & Tools", to: "/technical" }, { label: "Calculation tools" }]} />
        <div className="mt-6">
          <SectionHead
            as="h1"
            eyebrow="Engineering calculation tools"
            title="Pipe & Tube Weight, Pressure & Dimensional Reference"
            intro="Interactive weight calculator and ASME dimensional reference table for piping engineers — calculate weight per metre and total tonnage, consult standard schedule wall thicknesses, and cross-reference international CRA grades below."
          />
        </div>

        {/* Quick Section Anchor Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-border/60">
          <a
            href="#pipe-weight-calculator"
            className="rounded-full bg-primary/15 border border-primary/30 px-3 py-1 font-mono text-xs font-semibold text-primary hover:bg-primary/25 transition-colors"
          >
            ↓ Pipe &amp; Tube Weight Calculator
          </a>
          <a
            href="#reference-table"
            className="rounded-full bg-card border border-border px-3 py-1 font-mono text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            ↓ NPS &amp; Schedule Reference Table
          </a>
          <a
            href="#pressure-calculators"
            className="rounded-full bg-card border border-border px-3 py-1 font-mono text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            ↓ Pressure &amp; Flange Calculators
          </a>
          <a
            href="#cross-reference"
            className="rounded-full bg-card border border-border px-3 py-1 font-mono text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            ↓ Grade Cross-Reference &amp; Finder
          </a>
          <a
            href="#equivalency"
            className="rounded-full bg-card border border-border px-3 py-1 font-mono text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            ↓ Grade Equivalency Table
          </a>
        </div>
      </Section>

      {/* 2. TOP (ONE PER / UPAR): PIPE & TUBE WEIGHT CALCULATOR */}
      <Section className="border-b border-border" id="pipe-weight-calculator">
        <PipeWeight
          od={od}
          setOd={setOd}
          wt={wt}
          setWt={setWt}
          len={len}
          setLen={setLen}
          density={density}
          setDensity={setDensity}
          selectedNote={selectedNote}
        />
      </Section>

      {/* 3. REFERENCE TABLE (DIRECTLY WITH/BELOW WEIGHT CALCULATOR AT TOP) */}
      <Section className="border-b border-border" id="reference-table">
        <InteractiveNpsTable onSelect={handleSelectPipe} activeNps={selectedNote} />
      </Section>

      {/* 4. COMPANION PRESSURE, FLANGE & UNIT CALCULATORS */}
      <Section className="border-b border-border" id="pressure-calculators">
        <SectionHead
          eyebrow="Auxiliary Calculations"
          title="Pressure, Flange Class Rating & Unit Conversions"
          intro="Barlow straight-pipe internal pressure with corrosion deduction, ASME B16.5 rating selector, and imperial-to-metric conversions."
        />
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <BarlowCalc />
          <FlangeClassCalc />
          <UnitConverter />
        </div>
      </Section>

      {/* 5. BELOW (USKE NICHE): CROSS-REFERENCE & CONTROLLED SIZE SELECTOR */}
      <Section className="border-b border-border" id="cross-reference">
        <SectionHead
          eyebrow="Cross-reference & Sizing"
          title="Controlled size selector & equivalent grade finder"
          intro="Map an ASTM, UNS, Werkstoff, EN, DIN, JIS or BS designation onto the grade we stock, then fix the NPS, schedule, pressure class and facing before you raise the enquiry."
        />
        <div className="mt-8">
          <GradeFinder />
        </div>
      </Section>

      {/* 6. BELOW: INTERNATIONAL GRADE EQUIVALENCY TABLE */}
      <Section className="border-b border-border" id="equivalency">
        <SectionHead
          eyebrow="Grade equivalency lookup"
          title="UNS, ASTM / ASME, EN, DIN and Werkstoff cross-reference table"
          intro="Every nickel alloy, duplex, super duplex and stainless grade we stock, mapped across the designation systems used on international enquiries — search by any designation."
        />
        <div className="mt-8">
          <GradeEquivalency />
        </div>
      </Section>

      {/* 7. CTA BAND */}
      <CtaBand title="Turn your calculation into a priced enquiry" />
    </>
  );
}
