import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Section, SectionHead, Breadcrumbs, CtaBand, SpecTable } from "@/components/site/parts";
import { GradeFinder } from "@/components/site/GradeFinder";
import { GradeEquivalency } from "@/components/site/GradeEquivalency";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Pipe Weight, Pressure & Flange Calculators | Trishul Metals & Alloys" },
      {
        name: "description",
        content:
          "Free engineering calculators and lookups: grade equivalency across UNS, ASTM/ASME, EN and Werkstoff, pipe and tube weight per metre by alloy density, Barlow allowable pressure, NPS to OD and schedule wall thickness lookup, and unit conversion.",
      },
      { property: "og:title", content: "Engineering Calculators | Trishul Metals" },
      {
        property: "og:description",
        content: "Pipe weight, Barlow pressure, NPS/schedule and unit conversion tools for piping engineers.",
      },
      { property: "og:url", content: "/tools" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: ToolsPage,
});

const densities: { name: string; value: number }[] = [
  { name: "Carbon steel", value: 7.85 },
  { name: "Stainless 304 / 316", value: 8.0 },
  { name: "Stainless 904L", value: 7.95 },
  { name: "Duplex 2205", value: 7.8 },
  { name: "Super duplex 2507", value: 7.8 },
  { name: "Inconel 625", value: 8.44 },
  { name: "Inconel 600", value: 8.47 },
  { name: "Incoloy 825", value: 8.14 },
  { name: "Hastelloy C276", value: 8.89 },
  { name: "Monel 400", value: 8.8 },
  { name: "Nickel 200", value: 8.89 },
  { name: "Alloy 20", value: 8.08 },
  { name: "UPVC / PVC-U", value: 1.42 },
  { name: "CPVC / PVC-C", value: 1.55 },
];

const npsTable: { nps: string; od: number; s10: number; s40: number; s80: number }[] = [
  { nps: '1/2"', od: 21.3, s10: 2.11, s40: 2.77, s80: 3.73 },
  { nps: '3/4"', od: 26.7, s10: 2.11, s40: 2.87, s80: 3.91 },
  { nps: '1"', od: 33.4, s10: 2.77, s40: 3.38, s80: 4.55 },
  { nps: '1.1/2"', od: 48.3, s10: 2.77, s40: 3.68, s80: 5.08 },
  { nps: '2"', od: 60.3, s10: 2.77, s40: 3.91, s80: 5.54 },
  { nps: '3"', od: 88.9, s10: 3.05, s40: 5.49, s80: 7.62 },
  { nps: '4"', od: 114.3, s10: 3.05, s40: 6.02, s80: 8.56 },
  { nps: '6"', od: 168.3, s10: 3.4, s40: 7.11, s80: 10.97 },
  { nps: '8"', od: 219.1, s10: 3.76, s40: 8.18, s80: 12.7 },
  { nps: '10"', od: 273.0, s10: 4.19, s40: 9.27, s80: 15.09 },
  { nps: '12"', od: 323.9, s10: 4.57, s40: 10.31, s80: 17.48 },
  { nps: '16"', od: 406.4, s10: 4.78, s40: 12.7, s80: 21.44 },
  { nps: '24"', od: 610.0, s10: 6.35, s40: 17.48, s80: 30.96 },
];

const allowableStress: { name: string; value: number }[] = [
  { name: "A106 Gr B carbon steel", value: 138 },
  { name: "A312 TP304 / 304L", value: 115 },
  { name: "A312 TP316 / 316L", value: 115 },
  { name: "A790 duplex 2205", value: 179 },
  { name: "A790 super duplex 2507", value: 190 },
  { name: "B444 Inconel 625", value: 193 },
  { name: "B423 Incoloy 825", value: 152 },
  { name: "B622 Hastelloy C276", value: 189 },
];

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
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="eyebrow">{r.label}</dt>
            <dd className="mt-1 font-display text-xl font-semibold text-primary">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function PipeWeight() {
  const [od, setOd] = useState("168.3");
  const [wt, setWt] = useState("7.11");
  const [len, setLen] = useState("6");
  const [density, setDensity] = useState("7.85");

  const out = useMemo(() => {
    const D = parseFloat(od) || 0;
    const T = parseFloat(wt) || 0;
    const L = parseFloat(len) || 0;
    const rho = parseFloat(density) || 0;
    if (T <= 0 || D <= T * 2) return null;
    const kgPerM = ((D - T) * T * Math.PI * rho) / 1000;
    const id = D - 2 * T;
    return {
      kgPerM,
      total: kgPerM * L,
      id,
      lbPerFt: kgPerM * 0.671969,
    };
  }, [od, wt, len, density]);

  return (
    <div className="surface-panel rounded-md p-6">
      <h3 className="font-display text-xl font-semibold">Pipe &amp; tube weight</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Weight per metre from outside diameter, wall thickness and alloy density — the figure used for freight and
        packing estimates.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Outside diameter (mm)">
          <input value={od} onChange={(e) => setOd(e.target.value)} className={inputCls} inputMode="decimal" />
        </Field>
        <Field label="Wall thickness (mm)">
          <input value={wt} onChange={(e) => setWt(e.target.value)} className={inputCls} inputMode="decimal" />
        </Field>
        <Field label="Length (m)">
          <input value={len} onChange={(e) => setLen(e.target.value)} className={inputCls} inputMode="decimal" />
        </Field>
        <Field label="Material density (g/cm³)">
          <select value={density} onChange={(e) => setDensity(e.target.value)} className={inputCls}>
            {densities.map((d) => (
              <option key={d.name} value={d.value}>
                {d.name} — {d.value}
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
            { label: "Total weight", value: `${out.total.toFixed(1)} kg` },
            { label: "Inside diameter", value: `${out.id.toFixed(1)} mm` },
          ]}
        />
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">Enter a wall thickness smaller than half the diameter.</p>
      )}
    </div>
  );
}

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
    <div className="surface-panel rounded-md p-6">
      <h3 className="font-display text-xl font-semibold">Allowable internal pressure (Barlow)</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Indicative straight-pipe pressure using P = 2·S·E·t / D with corrosion allowance deducted. Confirm against
        ASME B31.3 / B31.4 for the design case.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
        <Field label="Weld joint efficiency E">
          <select value={eff} onChange={(e) => setEff(e.target.value)} className={inputCls}>
            <option value="1">1.00 — seamless</option>
            <option value="0.85">0.85 — ERW / welded</option>
            <option value="0.8">0.80 — welded, spot examined</option>
          </select>
        </Field>
        <Field label="Corrosion allowance (mm)">
          <input value={ca} onChange={(e) => setCa(e.target.value)} className={inputCls} inputMode="decimal" />
        </Field>
      </div>
      {out ? (
        <Result
          rows={[
            { label: "Allowable pressure", value: `${out.bar.toFixed(1)} bar` },
            { label: "Equivalent", value: `${out.psi.toFixed(0)} psi` },
            { label: "In MPa", value: `${out.mpa.toFixed(2)} MPa` },
          ]}
        />
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
    <div className="surface-panel rounded-md p-6">
      <h3 className="font-display text-xl font-semibold">Flange class selector</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Minimum ASME B16.5 class for a Group 2.2 (316/316L) flange at ambient temperature. De-rate for higher design
        temperature and for other material groups.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Design pressure (bar g)">
          <input
            value={pressure}
            onChange={(e) => setPressure(e.target.value)}
            className={inputCls}
            inputMode="decimal"
          />
        </Field>
      </div>
      <Result
        rows={[
          { label: "Minimum class", value: match ? `Class ${match.cls}` : "Above Class 2500 — API 6A" },
          {
            label: "Class rating at 38 °C",
            value: match ? `${match.bar} bar / ${match.psi} psi` : "—",
          },
        ]}
      />
    </div>
  );
}

function UnitConverter() {
  const [inch, setInch] = useState("6");
  const [bar, setBar] = useState("40");
  const [kg, setKg] = useState("1000");

  return (
    <div className="surface-panel rounded-md p-6">
      <h3 className="font-display text-xl font-semibold">Quick unit conversion</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Field label="Inches" hint={`${((parseFloat(inch) || 0) * 25.4).toFixed(2)} mm`}>
          <input value={inch} onChange={(e) => setInch(e.target.value)} className={inputCls} inputMode="decimal" />
        </Field>
        <Field
          label="Bar"
          hint={`${((parseFloat(bar) || 0) * 14.5038).toFixed(1)} psi · ${((parseFloat(bar) || 0) / 10).toFixed(2)} MPa`}
        >
          <input value={bar} onChange={(e) => setBar(e.target.value)} className={inputCls} inputMode="decimal" />
        </Field>
        <Field label="Kilograms" hint={`${((parseFloat(kg) || 0) * 2.20462).toFixed(1)} lb`}>
          <input value={kg} onChange={(e) => setKg(e.target.value)} className={inputCls} inputMode="decimal" />
        </Field>
      </div>
    </div>
  );
}

function ToolsPage() {
  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Engineering tools" }]} />
        <div className="mt-6">
          <SectionHead as="h1"
            eyebrow="Engineering tools"
            title="Pipe, pressure and flange calculators"
            intro="Sizing and estimating tools used daily by piping and project engineers — everything runs in your browser, nothing is stored."
          />
        </div>
      </Section>

      <Section className="border-b border-border" id="finder">
        <SectionHead
          eyebrow="Cross-reference"
          title="Controlled size selector & equivalent grade finder"
          intro="Map an ASTM, UNS, Werkstoff, EN, DIN, JIS or BS designation onto the grade we stock, then fix the NPS, schedule, pressure class and facing before you raise the enquiry."
        />
        <div className="mt-8">
          <GradeFinder />
        </div>
      </Section>

      <Section className="border-b border-border" id="equivalency">
        <SectionHead
          eyebrow="Grade equivalency lookup"
          title="UNS, ASTM / ASME, EN and Werkstoff cross-reference"
          intro="Every nickel alloy, duplex, super duplex and stainless grade we stock, mapped across the designation systems used on international enquiries — search by any designation."
        />
        <div className="mt-8">
          <GradeEquivalency />
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <PipeWeight />
          <BarlowCalc />
          <FlangeClassCalc />
          <UnitConverter />
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHead
          eyebrow="Reference"
          title="NPS, outside diameter and schedule wall thickness"
          intro="Nominal pipe size against outside diameter and common schedule wall thicknesses to ASME B36.10M / B36.19M."
        />
        <div className="mt-8">
          <SpecTable
            head={["NPS", "OD (mm)", "SCH 10S (mm)", "SCH 40 (mm)", "SCH 80 (mm)"]}
            rows={npsTable.map((r) => [r.nps, r.od.toFixed(1), r.s10.toFixed(2), r.s40.toFixed(2), r.s80.toFixed(2)])}
          />
        </div>
      </Section>
      <CtaBand title="Turn your calculation into a priced enquiry" />
    </>
  );
}
