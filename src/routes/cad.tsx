import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Section, SectionHead, Breadcrumbs, CtaBand, SpecTable } from "@/components/site/parts";
import {
  cadFamilies,
  cadMaterialOptions,
  flangeDims,
  fittingDims,
  pipeDims,
  type CadFamily,
  type FlangeClass,
  srElbow90,
  stubEndLength,
} from "@/data/cad";
import { CadDownloadGateProvider, useCadDownloadGate } from "@/components/cad/CadDownloadGate";
import { buildDxf, buildStl, conv, downloadText, elbowDimensions, stubOverallLength, type CadUnit } from "@/lib/cadgen";
import { productImages } from "@/data/productImages";
import { productBySlug } from "@/data/products";
import { cadPartAlt } from "@/lib/imageAlt";

export const Route = createFileRoute("/cad")({
  head: () => ({
    meta: [
      { title: "CAD & BIM Library — Free 3D STL and 2D DXF Flange & Fitting Models | Trishul Metals" },
      {
        name: "description",
        content:
          "Download free parametric 3D STL solids and 2D DXF blocks for ASME B16.5 flanges and ASME B16.9 buttweld fittings in every size and class, ready to drop into AutoCAD, SolidWorks, PDMS and E3D models.",
      },
      { property: "og:title", content: "CAD & BIM Component Library | Trishul Metals & Alloys" },
      {
        property: "og:description",
        content: "Parametric 3D STL and 2D DXF downloads for ASME B16.5 flanges and B16.9 fittings.",
      },
      { property: "og:url", content: "https://www.trishulmetal.com/cad" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.trishulmetal.com/cad" }],
  }),
  component: () => (
    <CadDownloadGateProvider>
      <CadPage />
    </CadDownloadGateProvider>
  ),
});

const schedules = [
  { key: "s10", label: "SCH 10S" },
  { key: "s40", label: "SCH 40 / STD" },
  { key: "s80", label: "SCH 80 / XS" },
] as const;

function CadPage() {
  const [familySlug, setFamilySlug] = useState(cadFamilies[0]!.slug);
  const [cls, setCls] = useState<FlangeClass>("150");
  const [nps, setNps] = useState(6);
  const [sched, setSched] = useState<(typeof schedules)[number]["key"]>("s40");
  const [unit, setUnit] = useState<CadUnit>("mm");
  const [material, setMaterial] = useState(cadMaterialOptions[0]!.code);

  const family = useMemo(
    () => cadFamilies.find((f) => f.slug === familySlug) as CadFamily,
    [familySlug],
  );

  const sizes = useMemo(() => {
    if (family.classed) return flangeDims[cls].map((d) => d.npsNum);
    return fittingDims.filter((f) => pipeDims.some((p) => p.npsNum === f.npsNum)).map((f) => f.npsNum);
  }, [family, cls]);

  const activeNps = sizes.includes(nps) ? nps : sizes[Math.min(4, sizes.length - 1)]!;
  const flange = flangeDims[cls].find((d) => d.npsNum === activeNps);
  const pipe = pipeDims.find((d) => d.npsNum === activeNps);
  const fitting = fittingDims.find((d) => d.npsNum === activeNps);
  const wall = pipe ? pipe[sched] : undefined;

  const partCode = [
    "TMA",
    family.slug.toUpperCase().replace(/-/g, ""),
    `${activeNps}`.replace(".", "-"),
    family.classed ? `CL${cls}` : schedules.find((s) => s.key === sched)!.label.replace(/[^A-Z0-9]/g, ""),
    material,
  ].join("-");

  const baseName = `${partCode}`;
  const title = `${family.name} — NPS ${activeNps} ${family.classed ? `Class ${cls}` : schedules.find((s) => s.key === sched)!.label} — ${material}`;

  const canBuild = family.classed ? Boolean(flange) : Boolean(pipe && fitting);

  const gate = useCadDownloadGate();
  const isSr = family.kind === "elbow90sr" || family.kind === "elbow45sr";
  const geo = {
    unit,
    flange,
    pipe,
    fitting,
    wall,
    bendRadius: isSr ? srElbow90(activeNps) : undefined,
    overallLength: family.kind === "stub-end" ? stubEndLength(activeNps) : undefined,
  };
  const download = (fmt: "dxf" | "stl") => {
    if (!canBuild) return;
    gate({
      partCode,
      family: family.name,
      standard: family.standard,
      size: `NPS ${activeNps}`,
      spec: family.classed ? `Class ${cls}` : schedules.find((s) => s.key === sched)!.label,
      material,
      format: fmt,
      run: () => {
        if (fmt === "dxf") {
          downloadText(`${baseName}.dxf`, buildDxf(family.kind, { ...geo, title }), "application/dxf");
        } else {
          downloadText(`${baseName}.stl`, buildStl(family.kind, { ...geo, name: baseName }), "model/stl");
        }
      },
    });
  };

  const elbow = elbowDimensions(family.kind, geo);
  const dimRows: (string | number)[][] = family.classed && flange
    ? [
        ["Flange outside diameter O", `${conv(flange.od, unit).toFixed(2)} ${unit}`],
        ["Flange thickness", `${conv(flange.tf, unit).toFixed(2)} ${unit}`],
        ["Bolt circle diameter", `${conv(flange.bc, unit).toFixed(2)} ${unit}`],
        ["Bolting", `${flange.bolts} × dia ${conv(flange.hole, unit).toFixed(2)} ${unit}`],
        ["Hub diameter at base X", `${conv(flange.hub, unit).toFixed(2)} ${unit}`],
        ["Length through hub Y", `${conv(flange.length, unit).toFixed(2)} ${unit}`],
        ["Bore B", `${conv(flange.bore, unit).toFixed(2)} ${unit}`],
      ]
    : pipe && fitting
      ? [
          ["Pipe outside diameter", `${conv(pipe.od, unit).toFixed(2)} ${unit}`],
          ["Wall thickness", `${conv(pipe[sched], unit).toFixed(2)} ${unit}`],
          elbow
            ? [family.kind === "elbow90" || family.kind === "elbow90sr" ? "Centre-to-end A" : "Centre-to-end B", `${conv(elbow.centreToEnd, unit).toFixed(2)} ${unit}`]
            : family.kind === "stub-end"
              ? ["Overall length H", `${conv(stubOverallLength(geo), unit).toFixed(2)} ${unit}`]
              : family.kind === "tee"
                ? ["Centre-to-end run / outlet C", `${conv(fitting.tee, unit).toFixed(2)} ${unit}`]
                : family.kind === "reducer"
                  ? ["Overall length H", `${conv(fitting.reducer, unit).toFixed(2)} ${unit}`]
                  : family.kind === "cap"
                    ? ["Cap length E", `${conv(fitting.cap, unit).toFixed(2)} ${unit}`]
                    : ["Reference length", `${conv(39.37, unit).toFixed(0)} ${unit}`],
          ...(elbow ? [[`Bend radius (${isSr ? "SR" : "LR"})`, `${conv(elbow.bendRadius, unit).toFixed(2)} ${unit}`]] : []),
        ]
      : [];

  const image = productImages[family.productSlug];

  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "CAD & BIM library" }]} />
        <div className="mt-6">
          <SectionHead as="h1"
            eyebrow="Engineering downloads"
            title="CAD & BIM component library"
            intro="Generate dimensionally accurate 3D solids and 2D blocks for our flange and fitting range, parametrically built from ASME B16.5 and B16.9 tables. Drop the model straight into AutoCAD, SolidWorks, Inventor, PDMS or E3D and carry our part code into your bill of materials."
          />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { k: "3D solid", v: "ASCII STL — watertight revolved and swept geometry" },
            { k: "2D block", v: "DXF R12 — outline, bolt circle and hole pattern" },
            { k: "Units", v: "Millimetre or inch, selectable before download" },
          ].map((i) => (
            <div key={i.k} className="surface-panel rounded-md p-5">
              <p className="eyebrow">{i.k}</p>
              <p className="mt-2 text-sm text-muted-foreground">{i.v}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-panel rounded-md p-6">
            <p className="eyebrow">Configure component</p>

            <label className="mt-5 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Component family
            </label>
            <select
              value={familySlug}
              onChange={(e) => setFamilySlug(e.target.value)}
              className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
            >
              {cadFamilies.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.name} — {f.standard}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{family.blurb}</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Nominal size
                </label>
                <select
                  value={activeNps}
                  onChange={(e) => setNps(Number(e.target.value))}
                  className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
                >
                  {sizes.map((s) => (
                    <option key={s} value={s}>
                      NPS {s}
                    </option>
                  ))}
                </select>
              </div>
              {family.classed ? (
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Pressure class
                  </label>
                  <select
                    value={cls}
                    onChange={(e) => setCls(e.target.value as FlangeClass)}
                    className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
                  >
                    {(["150", "300", "600"] as FlangeClass[]).map((c) => (
                      <option key={c} value={c}>
                        Class {c}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Schedule
                  </label>
                  <select
                    value={sched}
                    onChange={(e) => setSched(e.target.value as typeof sched)}
                    className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
                  >
                    {schedules.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Material / spec
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
                >
                  {cadMaterialOptions.map((m) => (
                    <option key={m.code} value={m.code}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Model units
                </label>
                <div className="mt-2 flex gap-2">
                  {(["mm", "in"] as CadUnit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`flex-1 rounded-sm border px-3 py-2 text-sm font-medium transition-colors ${
                        unit === u
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {u === "mm" ? "Millimetre" : "Inch"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-sm border border-primary/40 bg-primary/5 p-4">
              <p className="eyebrow">Part code for your BOM</p>
              <p className="mt-2 break-all font-mono text-sm text-primary">{partCode}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!canBuild}
                onClick={() => download("stl")}
                className="rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                Download 3D model (.stl)
              </button>
              <button
                type="button"
                disabled={!canBuild}
                onClick={() => download("dxf")}
                className="rounded-sm border border-primary/50 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 disabled:opacity-40"
              >
                Download 2D block (.dxf)
              </button>
              <Link
                to="/rfq"
                className="rounded-sm border border-border px-5 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Quote this part
              </Link>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              STEP (AP214), IGES and native Revit / PDMS catalogue files for the selected part code are issued on
              request within one working day — raise an enquiry with the part code above and we will email the pack.
            </p>
          </div>

          <div className="space-y-6">
            {image ? (
              <div className="overflow-hidden rounded-md border border-border">
                <img
                  src={image}
                  alt={cadPartAlt(family.name, family.standard, productBySlug(family.productSlug))}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
            <SpecTable
              caption={`${family.name} — nominal dimensions, ${family.standard}`}
              head={["Parameter", "Value"]}
              rows={dimRows}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Generated geometry is a dimensionally representative reference model for layout, clash detection and
              take-off. Weld preparation, raised-face serration, bolt-hole tolerance and radii follow the governing
              standard and the approved manufacturing drawing. Verify against the current edition of ASME B16.5 /
              B16.9 before construction release.
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHead
          eyebrow="Library index"
          title="Every family in the generator"
          intro="Each family generates across the full size and class range shown on its product page."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cadFamilies.map((f) => (
            <button
              key={f.slug}
              type="button"
              onClick={() => setFamilySlug(f.slug)}
              className={`surface-panel rounded-md p-5 text-left transition-colors hover:border-primary/60 ${
                f.slug === familySlug ? "border-primary/70" : ""
              }`}
            >
              <p className="eyebrow">{f.standard}</p>
              <h3 className="mt-2 text-base font-semibold">{f.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.blurb}</p>
            </button>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Need the STEP, IGES or Revit family for a specific tag number?"
        body="Send the part code generated above with your line list and we will issue the native model pack alongside the commercial quotation."
      />
    </>
  );
}
