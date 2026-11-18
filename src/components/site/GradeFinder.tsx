import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { searchEquivalents, equivalentRows, type EquivalentRow } from "@/data/equivalents";
import {
  flangeDims,
  pipeDims,
  sheetThicknesses,
  sheetWidths,
  sheetLengths,
  ringOuterDiameters,
  ringThicknesses,
  circleDiameters,
  circleThicknesses,
  barDiameters,
  barLengths,
  densityOf,
  sheetWeightKg,
  ringWeightKg,
  circleWeightKg,
  barWeightPerMetreKg,
  pipeWeightPerMetreKg,
} from "@/data/cad";
import { facings, groupForGrade, ratingRows, pressureClasses, type PressureClass } from "@/data/ratings";
import { materialBySlug } from "@/data/materials";
import { productsForMaterial } from "@/data/matrix";
import type { ProductCategory } from "@/data/products.types";
import { MagneticAction, ResultTransition } from "@/components/site/InteractionMotion";

const classOptions: PressureClass[] = pressureClasses;

type ProductForm = "flange" | "pipe" | "sheet" | "ring" | "circle" | "bar" | "pvc";

const formLabels: Record<ProductForm, string> = {
  flange: "Flange",
  pipe: "Pipe / Tube",
  sheet: "Sheet / Plate",
  ring: "Ring (forged)",
  circle: "Circle / Disc",
  bar: "Round Bar",
  pvc: "PVC / UPVC Pipe",
};

const formCategories: Record<ProductForm, ProductCategory[]> = {
  flange: ["flanges"],
  pipe: ["pipes-tubes"],
  sheet: ["sheets-plates"],
  ring: ["forged-fittings"],
  circle: ["sheets-plates"],
  bar: ["bars"],
  pvc: ["pvc-piping"],
};

const formOrder: ProductForm[] = ["flange", "pipe", "sheet", "ring", "circle", "bar", "pvc"];

/** IS 4985 UPVC pressure pipe — nominal OD in mm and wall thickness by working pressure class. */
const pvcSizes: { od: number; c2: number; c3: number; c4: number; c5: number; c6: number }[] = [
  { od: 20, c2: 1.1, c3: 1.1, c4: 1.1, c5: 1.4, c6: 1.6 },
  { od: 25, c2: 1.1, c3: 1.1, c4: 1.4, c5: 1.7, c6: 2.0 },
  { od: 32, c2: 1.1, c3: 1.3, c4: 1.7, c5: 2.1, c6: 2.5 },
  { od: 40, c2: 1.2, c3: 1.6, c4: 2.1, c5: 2.6, c6: 3.1 },
  { od: 50, c2: 1.5, c3: 2.0, c4: 2.6, c5: 3.2, c6: 3.8 },
  { od: 63, c2: 1.9, c3: 2.5, c4: 3.2, c5: 4.0, c6: 4.8 },
  { od: 75, c2: 2.2, c3: 2.9, c4: 3.8, c5: 4.8, c6: 5.7 },
  { od: 90, c2: 2.7, c3: 3.5, c4: 4.6, c5: 5.7, c6: 6.8 },
  { od: 110, c2: 3.2, c3: 4.3, c4: 5.6, c5: 6.9, c6: 8.3 },
  { od: 140, c2: 4.1, c3: 5.4, c4: 7.1, c5: 8.8, c6: 10.5 },
  { od: 160, c2: 4.7, c3: 6.2, c4: 8.1, c5: 10.0, c6: 12.0 },
  { od: 200, c2: 5.9, c3: 7.7, c4: 10.1, c5: 12.5, c6: 15.0 },
  { od: 250, c2: 7.3, c3: 9.6, c4: 12.6, c5: 15.6, c6: 18.7 },
  { od: 315, c2: 9.2, c3: 12.1, c4: 15.9, c5: 19.6, c6: 23.6 },
];

type PvcClassKey = "c2" | "c3" | "c4" | "c5" | "c6";

type GradeGroup = "cra" | "carbon" | "polymer";

const groupOf = (family: EquivalentRow["family"]): GradeGroup =>
  family === "carbon" ? "carbon" : family === "polymer" ? "polymer" : "cra";

const gradeGroups: { key: GradeGroup; label: string }[] = [
  { key: "cra", label: "CRA Alloy & Stainless Grades" },
  { key: "carbon", label: "Supporting Product Line — Carbon Steel" },
  { key: "polymer", label: "Supporting Product Line — manufactured by Apex Polymer & Engineering" },
];

const groupRows = (rows: EquivalentRow[]) =>
  gradeGroups
    .map((g) => ({ ...g, rows: rows.filter((r) => groupOf(r.family) === g.key) }))
    .filter((g) => g.rows.length > 0);

const pvcClasses: { key: PvcClassKey; label: string }[] = [
  { key: "c2", label: "Class 2 — 4 kgf/cm²" },
  { key: "c3", label: "Class 3 — 6 kgf/cm²" },
  { key: "c4", label: "Class 4 — 8 kgf/cm²" },
  { key: "c5", label: "Class 5 — 10 kgf/cm²" },
  { key: "c6", label: "Class 6 — 12.5 kgf/cm²" },
];

/**
 * Controlled size selector and equivalent grade finder.
 * Cross-references ASTM / UNS / Werkstoff / EN / DIN / JIS / BS designations and
 * maps product form, size and schedule to dimensions, theoretical weights and a
 * deep link into the catalogue.
 */
export function GradeFinder({ initialSlug, compact }: { initialSlug?: string; compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [slug, setSlug] = useState(initialSlug ?? "duplex-2205");
  const [form, setForm] = useState<ProductForm>("flange");
  const [nps, setNps] = useState('4"');
  const [cls, setCls] = useState<PressureClass>("300");
  const [facing, setFacing] = useState("RF");
  const [schedule, setSchedule] = useState<"s10" | "s40" | "s80">("s40");
  const [sheetT, setSheetT] = useState(3);
  const [sheetW, setSheetW] = useState(1250);
  const [sheetL, setSheetL] = useState(2500);
  const [ringOd, setRingOd] = useState(200);
  const [ringId, setRingId] = useState(100);
  const [ringT, setRingT] = useState(25);
  const [circleD, setCircleD] = useState(300);
  const [circleT, setCircleT] = useState(10);
  const [barD, setBarD] = useState(50);
  const [barL, setBarL] = useState(6000);
  const [pvcOd, setPvcOd] = useState(110);
  const [pvcClass, setPvcClass] = useState<PvcClassKey>("c4");

  const results = useMemo(() => searchEquivalents(query), [query]);
  const selected: EquivalentRow | undefined = useMemo(
    () => equivalentRows.find((r) => r.slug === slug),
    [slug],
  );
  const material = materialBySlug(slug);
  const density = densityOf(material);
  const group = groupForGrade(slug);
  const flangeKey = cls === "150" || cls === "300" || cls === "600" ? cls : "600";
  const flange = flangeDims[flangeKey].find((f) => f.nps === nps);
  const pipe = pipeDims.find((p) => p.nps === nps);
  const products = material ? productsForMaterial(material) : [];
  const rating = group ? ratingRows(group)[0]?.values[cls] : undefined;

  const availableForms = formOrder.filter((f) =>
    products.some((p) => formCategories[f].includes(p.category)),
  );
  const activeForm: ProductForm = availableForms.includes(form)
    ? form
    : (availableForms[0] ?? "flange");

  const formProducts = products.filter((p) => formCategories[activeForm].includes(p.category));
  const safeRingId = ringId >= ringOd ? Math.max(10, ringOd - 50) : ringId;
  const resultKey = [
    slug,
    activeForm,
    nps,
    cls,
    facing,
    schedule,
    sheetT,
    sheetW,
    sheetL,
    ringOd,
    safeRingId,
    ringT,
    circleD,
    circleT,
    barD,
    barL,
    pvcOd,
    pvcClass,
  ].join("|");

  const ringIdOptions = ringOuterDiameters.filter((d) => d < ringOd);

  const quoteLabel = (() => {
    const name = selected?.name ?? "";
    switch (activeForm) {
      case "flange":
        return `Quote ${name} ${nps} Class ${cls} ${facing}`;
      case "pipe":
        return `Quote ${name} Pipe ${nps} SCH ${schedule === "s10" ? "10S" : schedule === "s40" ? "40" : "80"}`;
      case "sheet":
        return `Quote ${name} Sheet ${sheetT} mm × ${sheetW} × ${sheetL}`;
      case "ring":
        return `Quote ${name} Ring ${ringOd} OD × ${safeRingId} ID × ${ringT} mm`;
      case "circle":
        return `Quote ${name} Circle Ø${circleD} × ${circleT} mm`;
      case "bar":
        return `Quote ${name} Bar Ø${barD} mm × ${barL / 1000} m`;
      case "pvc":
        return `Quote ${name} Pipe ${pvcOd} mm OD · ${pvcClasses.find((c) => c.key === pvcClass)?.label}`;
    }
  })();

  const cell = "border border-border px-3 py-2 text-sm";
  const label = "font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground";
  const field =
    "motion-field mt-2 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none";

  const rows = (entries: [string, string][]) => (
    <table className="mt-5 w-full border-collapse">
      <tbody>
        {entries.map(([k, v]) => (
          <tr key={k}>
            <th scope="row" className={`${cell} bg-secondary/40 text-left font-medium`}>
              {k}
            </th>
            <td className={`${cell} font-mono text-[12px] text-muted-foreground`}>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={`rounded-md border border-border bg-card/40 ${compact ? "p-4" : "p-5 md:p-7"}`}>
      <div className={`grid gap-5 ${compact ? "" : "lg:grid-cols-[1.1fr_1fr]"}`}>

        <div>
          <label className={label} htmlFor="gf-search">
            Equivalent grade finder
          </label>
          <input
            id="gf-search"
            className={field}
            placeholder="Search 1.4462, S31803, SUS 316, NiCr22Mo9Nb, F51…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {results.length ? (
            <ul className="mt-3 max-h-52 divide-y divide-border overflow-y-auto rounded-sm border border-border">
              {groupRows(results).map((g) => (
                <li key={g.key}>
                  <p className="bg-secondary/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {g.label}
                  </p>
                  <ul className="divide-y divide-border">
                    {g.rows.map((r) => (
                      <li key={r.slug}>
                        <button
                          type="button"
                          onClick={() => {
                            setSlug(r.slug);
                            setQuery("");
                          }}
                          className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-secondary"
                        >
                          <span className="text-foreground">{r.name}</span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {[r.uns, r.werkstoff ?? r.din].filter(Boolean).join(" · ")}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-5">
            <label className={label} htmlFor="gf-grade">
              Grade
            </label>
            <select id="gf-grade" className={field} value={slug} onChange={(e) => setSlug(e.target.value)}>
              {groupRows(equivalentRows).map((g) => (
                <optgroup key={g.key} label={g.label}>
                  {g.rows.map((r) => (
                    <option key={r.slug} value={r.slug}>
                      {r.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {selected ? (
            <ResultTransition transitionKey={slug}>
              <table className="mt-5 w-full border-collapse">
                <tbody>
                  {(
                    [
                      ["ASTM / ASME", selected.astm],
                      ["UNS", selected.uns],
                      ["Werkstoff", selected.werkstoff],
                      ["EN designation", selected.en],
                      ["DIN", selected.din],
                      ["JIS", selected.jis],
                      ["BS", selected.bs],
                      ["GOST", selected.gost],
                      ["AFNOR", selected.afnor],
                    ] as [string, string | undefined][]
                  )
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <tr key={k}>
                        <th scope="row" className={`${cell} bg-secondary/40 text-left font-medium`}>
                          {k}
                        </th>
                        <td className={`${cell} font-mono text-[12px] text-muted-foreground`}>{v}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </ResultTransition>
          ) : null}
        </div>

        <div>
          <p className={label}>Controlled size selector</p>
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Product form">
            {availableForms.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setForm(f)}
                aria-pressed={activeForm === f}
                className={`selector-chip rounded-sm border px-3 py-1.5 text-xs transition-[color,border-color,background-color,transform,box-shadow] duration-300 ${
                  activeForm === f
                    ? "border-primary bg-primary/10 font-semibold text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {formLabels[f]}
              </button>
            ))}
          </div>

          <ResultTransition transitionKey={resultKey}>
          {activeForm === "flange" ? (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className={label} htmlFor="gf-nps">
                    NPS
                  </label>
                  <select id="gf-nps" className={field} value={nps} onChange={(e) => setNps(e.target.value)}>
                    {pipeDims.map((p) => (
                      <option key={p.nps} value={p.nps}>
                        {p.nps}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="gf-class">
                    Pressure class
                  </label>
                  <select
                    id="gf-class"
                    className={field}
                    value={cls}
                    onChange={(e) => setCls(e.target.value as PressureClass)}
                  >
                    {classOptions.map((c) => (
                      <option key={c} value={c}>
                        Class {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="gf-sch">
                    Schedule
                  </label>
                  <select
                    id="gf-sch"
                    className={field}
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value as "s10" | "s40" | "s80")}
                  >
                    <option value="s10">SCH 10S</option>
                    <option value="s40">SCH 40 / 40S</option>
                    <option value="s80">SCH 80 / 80S</option>
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="gf-facing">
                    Facing
                  </label>
                  <select id="gf-facing" className={field} value={facing} onChange={(e) => setFacing(e.target.value)}>
                    {facings.map((f) => (
                      <option key={f.code} value={f.code}>
                        {f.code} — {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {rows([
                [
                  "Pipe OD × wall",
                  pipe ? `${pipe.od}" OD × ${pipe[schedule]}" wall (${(pipe.od * 25.4).toFixed(1)} mm OD)` : "—",
                ],
                [
                  "Flange OD × thickness",
                  flange
                    ? `${flange.od}" × ${flange.tf}" · BC ${flange.bc}" · ${flange.bolts} × ${flange.hole}" holes`
                    : "Refer ASME B16.5 table for this class",
                ],
                ["Facing finish", facings.find((f) => f.code === facing)?.finish ?? "—"],
                ["Rating at 38 °C", rating ? `${rating} bar (${group?.label})` : "Not a flange-rated grade"],
              ])}
            </>
          ) : null}

          {activeForm === "pipe" ? (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className={label} htmlFor="gf-pipe-nps">
                    NPS
                  </label>
                  <select id="gf-pipe-nps" className={field} value={nps} onChange={(e) => setNps(e.target.value)}>
                    {pipeDims.map((p) => (
                      <option key={p.nps} value={p.nps}>
                        {p.nps}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="gf-pipe-sch">
                    Schedule
                  </label>
                  <select
                    id="gf-pipe-sch"
                    className={field}
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value as "s10" | "s40" | "s80")}
                  >
                    <option value="s10">SCH 10S</option>
                    <option value="s40">SCH 40 / 40S</option>
                    <option value="s80">SCH 80 / 80S</option>
                  </select>
                </div>
              </div>
              {rows([
                [
                  "OD × wall",
                  pipe
                    ? `${(pipe.od * 25.4).toFixed(1)} mm OD × ${(pipe[schedule] * 25.4).toFixed(2)} mm wall (${pipe.od}" × ${pipe[schedule]}")`
                    : "—",
                ],
                [
                  "Nominal bore (ID)",
                  pipe ? `${((pipe.od - 2 * pipe[schedule]) * 25.4).toFixed(1)} mm` : "—",
                ],
                [
                  "Theoretical weight",
                  pipe ? `${pipeWeightPerMetreKg(pipe.od, pipe[schedule], density).toFixed(2)} kg/m` : "—",
                ],
              ])}
            </>
          ) : null}

          {activeForm === "sheet" ? (
            <>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div>
                  <label className={label} htmlFor="gf-sheet-t">
                    Thickness
                  </label>
                  <select id="gf-sheet-t" className={field} value={sheetT} onChange={(e) => setSheetT(Number(e.target.value))}>
                    {sheetThicknesses.map((t) => (
                      <option key={t} value={t}>
                        {t} mm
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="gf-sheet-w">
                    Width
                  </label>
                  <select id="gf-sheet-w" className={field} value={sheetW} onChange={(e) => setSheetW(Number(e.target.value))}>
                    {sheetWidths.map((w) => (
                      <option key={w} value={w}>
                        {w} mm
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="gf-sheet-l">
                    Length
                  </label>
                  <select id="gf-sheet-l" className={field} value={sheetL} onChange={(e) => setSheetL(Number(e.target.value))}>
                    {sheetLengths.map((l) => (
                      <option key={l} value={l}>
                        {l} mm
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {rows([
                ["Size", `${sheetT} mm × ${sheetW} mm × ${sheetL} mm (${(sheetT / 25.4).toFixed(3)}" thick)`],
                ["Area", `${((sheetW * sheetL) / 1_000_000).toFixed(2)} m²`],
                ["Theoretical weight", `${sheetWeightKg(sheetT, sheetW, sheetL, density).toFixed(1)} kg per sheet`],
              ])}
            </>
          ) : null}

          {activeForm === "ring" ? (
            <>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div>
                  <label className={label} htmlFor="gf-ring-od">
                    Outer Ø
                  </label>
                  <select id="gf-ring-od" className={field} value={ringOd} onChange={(e) => setRingOd(Number(e.target.value))}>
                    {ringOuterDiameters.map((d) => (
                      <option key={d} value={d}>
                        {d} mm
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="gf-ring-id">
                    Inner Ø
                  </label>
                  <select id="gf-ring-id" className={field} value={safeRingId} onChange={(e) => setRingId(Number(e.target.value))}>
                    {(ringIdOptions.length ? ringIdOptions : [Math.max(10, ringOd - 50)]).map((d) => (
                      <option key={d} value={d}>
                        {d} mm
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="gf-ring-t">
                    Thickness
                  </label>
                  <select id="gf-ring-t" className={field} value={ringT} onChange={(e) => setRingT(Number(e.target.value))}>
                    {ringThicknesses.map((t) => (
                      <option key={t} value={t}>
                        {t} mm
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {rows([
                ["Dimensions", `Ø${ringOd} mm OD × Ø${safeRingId} mm ID × ${ringT} mm`],
                ["Annular area", `${(((Math.PI / 4) * (ringOd * ringOd - safeRingId * safeRingId)) / 100).toFixed(0)} cm²`],
                ["Theoretical weight", `${ringWeightKg(ringOd, safeRingId, ringT, density).toFixed(2)} kg per ring`],
              ])}
            </>
          ) : null}

          {activeForm === "circle" ? (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className={label} htmlFor="gf-circle-d">
                    Diameter
                  </label>
                  <select id="gf-circle-d" className={field} value={circleD} onChange={(e) => setCircleD(Number(e.target.value))}>
                    {circleDiameters.map((d) => (
                      <option key={d} value={d}>
                        Ø{d} mm
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="gf-circle-t">
                    Thickness
                  </label>
                  <select id="gf-circle-t" className={field} value={circleT} onChange={(e) => setCircleT(Number(e.target.value))}>
                    {circleThicknesses.map((t) => (
                      <option key={t} value={t}>
                        {t} mm
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {rows([
                ["Dimensions", `Ø${circleD} mm × ${circleT} mm`],
                ["Area", `${(((Math.PI / 4) * circleD * circleD) / 100).toFixed(0)} cm²`],
                ["Theoretical weight", `${circleWeightKg(circleD, circleT, density).toFixed(2)} kg per piece`],
              ])}
            </>
          ) : null}

          {activeForm === "bar" ? (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className={label} htmlFor="gf-bar-d">
                    Diameter
                  </label>
                  <select id="gf-bar-d" className={field} value={barD} onChange={(e) => setBarD(Number(e.target.value))}>
                    {barDiameters.map((d) => (
                      <option key={d} value={d}>
                        Ø{d} mm
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="gf-bar-l">
                    Length
                  </label>
                  <select id="gf-bar-l" className={field} value={barL} onChange={(e) => setBarL(Number(e.target.value))}>
                    {barLengths.map((l) => (
                      <option key={l} value={l}>
                        {l / 1000} m
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {rows([
                ["Dimensions", `Ø${barD} mm × ${barL / 1000} m bar`],
                ["Theoretical weight", `${barWeightPerMetreKg(barD, density).toFixed(2)} kg/m`],
                ["Weight per bar", `${(barWeightPerMetreKg(barD, density) * (barL / 1000)).toFixed(1)} kg`],
              ])}
            </>
          ) : null}

          {activeForm === "pvc" ? (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className={label} htmlFor="gf-pvc-od">
                    Nominal OD
                  </label>
                  <select id="gf-pvc-od" className={field} value={pvcOd} onChange={(e) => setPvcOd(Number(e.target.value))}>
                    {pvcSizes.map((p) => (
                      <option key={p.od} value={p.od}>
                        {p.od} mm
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="gf-pvc-class">
                    Pressure class
                  </label>
                  <select
                    id="gf-pvc-class"
                    className={field}
                    value={pvcClass}
                    onChange={(e) => setPvcClass(e.target.value as PvcClassKey)}
                  >
                    {pvcClasses.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {(() => {
                const row = pvcSizes.find((p) => p.od === pvcOd);
                const wall = row ? row[pvcClass] : 0;
                const id = row ? pvcOd - 2 * wall : 0;
                const kgPerM = row
                  ? ((Math.PI / 4) * (pvcOd * pvcOd - id * id) * density) / 1000
                  : 0;
                return rows([
                  ["OD × wall", row ? `${pvcOd} mm OD × ${wall.toFixed(1)} mm wall (IS 4985)` : "—"],
                  ["Bore (ID)", row ? `${id.toFixed(1)} mm` : "—"],
                  ["Theoretical weight", row ? `${kgPerM.toFixed(2)} kg/m at ${density.toFixed(2)} g/cm³` : "—"],
                  ["Manufacture", "In-house at Apex Polymer & Engineering"],
                ]);
              })()}
            </>
          ) : null}
          </ResultTransition>

          {formProducts.length ? (
            <ResultTransition transitionKey={`${slug}-${activeForm}`}>
              <div className="mt-5">
                <p className={label}>Matching product pages</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {formProducts.slice(0, 6).map((p) => (
                    <Link
                      key={p.slug}
                      to="/materials/$slug/$product"
                      params={{ slug, product: p.slug }}
                       className="selector-chip rounded-sm border border-border px-3 py-1.5 text-xs text-muted-foreground transition-[color,border-color,background-color,transform,box-shadow] duration-300 hover:border-primary hover:text-primary"
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              </div>
            </ResultTransition>
          ) : null}

          <MagneticAction className="mt-5">
            <Link
              to="/rfq"
              className="inline-block rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {quoteLabel}
            </Link>
          </MagneticAction>
        </div>
      </div>
      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        Dimensions per ASME B16.5 / B36.10M / B36.19M · theoretical weights at {density.toFixed(2)} g/cm³ — confirm
        against the governing standard and mill certificate before fabrication
      </p>
    </div>
  );
}
