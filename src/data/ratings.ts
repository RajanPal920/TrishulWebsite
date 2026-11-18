/**
 * ASME B16.5 material grouping and indicative pressure–temperature ratings.
 *
 * Values are working pressures in bar gauge, rounded, for flanged joints of the
 * stated material group. They are published here as an engineering aid only —
 * the governing figures are ASME B16.5 Table 2 (and ASME B16.47 above NPS 24)
 * for the exact edition invoked by the project specification.
 */

export type PressureClass = "150" | "300" | "600" | "900" | "1500" | "2500";

export const pressureClasses: PressureClass[] = ["150", "300", "600", "900", "1500", "2500"];

/** Temperature points in °C used across every rating table. */
export const ratingTemps = [38, 100, 200, 300, 400, 450, 500];

export interface MaterialGroup {
  id: string;
  label: string;
  /** Representative forging/plate specifications covered by the group. */
  examples: string;
  /** Class 150 … 2500 working pressure at 38 °C, bar. */
  base: Record<PressureClass, number>;
  /** Derating factor applied to the base value at each temperature point. */
  factors: number[];
  /** Practical upper temperature note for flanged service. */
  note: string;
}

const groups: MaterialGroup[] = [
  {
    id: "1.1",
    label: "Group 1.1 — Carbon steel",
    examples: "ASTM A105, A350 LF2, A216 WCB",
    base: { "150": 19.6, "300": 51.1, "600": 102.1, "900": 153.2, "1500": 255.3, "2500": 425.5 },
    factors: [1.0, 0.94, 0.86, 0.79, 0.7, 0.61, 0.45],
    note: "Carbon steel flanges are normally limited to 425 °C for continuous service; A350 LF2 is used down to −46 °C.",
  },
  {
    id: "2.1",
    label: "Group 2.1 — 304 / 304H austenitic",
    examples: "ASTM A182 F304, F304H, A240 304",
    base: { "150": 19.0, "300": 49.6, "600": 99.3, "900": 148.9, "1500": 248.2, "2500": 413.7 },
    factors: [1.0, 0.86, 0.75, 0.68, 0.63, 0.61, 0.6],
    note: "F304H retains creep allowance above 525 °C where the carbon range is met.",
  },
  {
    id: "2.2",
    label: "Group 2.2 — 316 / 316L / 317L austenitic",
    examples: "ASTM A182 F316, F316L, F317L, A240 316L",
    base: { "150": 19.0, "300": 49.6, "600": 99.3, "900": 148.9, "1500": 248.2, "2500": 413.7 },
    factors: [1.0, 0.87, 0.76, 0.69, 0.64, 0.62, 0.61],
    note: "Low-carbon L grades are derated above 425 °C; use the H grade where sustained high-temperature service is required.",
  },
  {
    id: "2.3",
    label: "Group 2.3 — 321 / 347 stabilised austenitic",
    examples: "ASTM A182 F321, F347, F321H, F347H",
    base: { "150": 19.0, "300": 49.6, "600": 99.3, "900": 148.9, "1500": 248.2, "2500": 413.7 },
    factors: [1.0, 0.88, 0.78, 0.72, 0.68, 0.66, 0.65],
    note: "Stabilised grades are the default choice for 500–800 °C service where sensitisation must be avoided.",
  },
  {
    id: "2.8",
    label: "Group 2.8 — High-alloy austenitic and duplex",
    examples: "ASTM A182 F904L, F44 (254 SMO), F51/F60 (2205), F53/F55 (2507 / S32760)",
    base: { "150": 20.0, "300": 51.7, "600": 103.4, "900": 155.1, "1500": 258.6, "2500": 430.9 },
    factors: [1.0, 0.93, 0.86, 0.81, 0.77, 0.75, 0.73],
    note: "Duplex and super duplex flanges are limited to 300 °C (and typically 250 °C by project specification) because of 475 °C embrittlement and sigma phase.",
  },
  {
    id: "3.4",
    label: "Group 3.4 — Alloy 20 and related Ni-Fe-Cr",
    examples: "ASTM B462 UNS N08020, B564 N08800 / N08810",
    base: { "150": 19.0, "300": 49.6, "600": 99.3, "900": 148.9, "1500": 248.2, "2500": 413.7 },
    factors: [1.0, 0.9, 0.81, 0.75, 0.71, 0.69, 0.67],
    note: "Alloy 20 flanges are rated for sulphuric acid service rather than high temperature.",
  },
  {
    id: "3.7",
    label: "Group 3.7 — Nickel-copper and commercially pure nickel",
    examples: "ASTM B564 UNS N04400, N02200, N02201",
    base: { "150": 15.9, "300": 41.4, "600": 82.7, "900": 124.1, "1500": 206.8, "2500": 344.7 },
    factors: [1.0, 0.92, 0.85, 0.8, 0.76, 0.74, 0.7],
    note: "Nickel 200 is limited to 315 °C because of graphitisation; Nickel 201 is used above that.",
  },
  {
    id: "3.8",
    label: "Group 3.8 — Nickel-chromium-molybdenum alloys",
    examples: "ASTM B564 UNS N06600, N06625, N10276, N06022, N08825",
    base: { "150": 20.0, "300": 51.7, "600": 103.4, "900": 155.1, "1500": 258.6, "2500": 430.9 },
    factors: [1.0, 0.96, 0.91, 0.87, 0.84, 0.82, 0.8],
    note: "Solution-annealed nickel alloy flanges hold rating well into the 600 °C range; verify the exact UNS row before final selection.",
  },
];

export const groupById = (id: string): MaterialGroup | undefined => groups.find((g) => g.id === id);

/** Grade slug → ASME B16.5 material group. Grades absent here are not flange-rated. */
const gradeGroup: Record<string, string> = {
  "stainless-steel-304": "2.1",
  "stainless-steel-310s": "2.1",
  "stainless-steel-316": "2.2",
  "stainless-steel-317l": "2.2",
  "stainless-steel-321": "2.3",
  "stainless-steel-347": "2.3",
  "stainless-steel-904l": "2.8",
  "254-smo": "2.8",
  "duplex-2205": "2.8",
  "duplex-s31803": "2.8",
  "super-duplex-2507": "2.8",
  "super-duplex-s32760": "2.8",
  "alloy-20": "3.4",
  "incoloy-800": "3.4",
  "incoloy-800h": "3.4",
  "incoloy-800ht": "3.4",
  "nickel-200": "3.7",
  "nickel-201": "3.7",
  "monel-400": "3.7",
  "monel-k500": "3.7",
  "inconel-600": "3.8",
  "inconel-601": "3.8",
  "inconel-617": "3.8",
  "inconel-625": "3.8",
  "inconel-686": "3.8",
  "inconel-690": "3.8",
  "inconel-718": "3.8",
  "inconel-725": "3.8",
  "inconel-x-750": "3.8",
  "incoloy-825": "3.8",
  "incoloy-925": "3.8",
  "hastelloy-b2": "3.8",
  "hastelloy-b3": "3.8",
  "hastelloy-c22": "3.8",
  "hastelloy-c276": "3.8",
  "hastelloy-c2000": "3.8",
  "carbon-steel-a105": "1.1",
  "carbon-steel-a350-lf2": "1.1",
  "carbon-steel-a234-wpb": "1.1",
  "carbon-steel-a420-wpl6": "1.1",
  "carbon-steel-a106": "1.1",
  "carbon-steel-a53": "1.1",
  "carbon-steel-a333-gr6": "1.1",
  "api-5l-line-pipe": "1.1",
  "carbon-steel-a516-gr70": "1.1",
  "carbon-steel-a36-a572": "1.1",
};

export const groupForGrade = (slug: string): MaterialGroup | undefined => {
  const id = gradeGroup[slug];
  return id ? groupById(id) : undefined;
};

export interface RatingRow {
  temp: number;
  values: Record<PressureClass, number>;
}

export const ratingRows = (group: MaterialGroup): RatingRow[] =>
  ratingTemps.map((temp, i) => {
    const f = group.factors[i] ?? 1;
    const values = Object.fromEntries(
      pressureClasses.map((c) => [c, Math.round(group.base[c] * f * 10) / 10]),
    ) as Record<PressureClass, number>;
    return { temp, values };
  });

/** Facing options offered against ASME B16.5 / B16.47 flanges. */
export const facings = [
  { code: "RF", label: "Raised face", finish: "125–250 µin AARH serrated spiral or concentric" },
  { code: "FF", label: "Flat face", finish: "125–250 µin AARH, used against cast iron and GRP flanges" },
  { code: "RTJ", label: "Ring type joint", finish: "ASME B16.20 octagonal/oval groove, 63 µin max" },
  { code: "T&G", label: "Tongue and groove", finish: "Large and small tongue per ASME B16.5 Table 6" },
  { code: "M&F", label: "Male and female", finish: "Large and small male/female per ASME B16.5" },
  { code: "LJ", label: "Lap joint", finish: "Used with stub ends to ASME B16.9 / MSS SP-43" },
];
