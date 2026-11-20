export type ProductCategory =
  | "flanges"
  | "pipe-fittings"
  | "forged-fittings"
  | "pipes-tubes"
  | "bars"
  | "sheets-plates"
  | "structural"
  | "pvc-piping";

export interface ProductType {
  slug: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  summary: string;
  overview: string[];
  specs: { label: string; value: string }[];
  features: string[];
  applications: string[];
  standards: string[];
  faqs: { q: string; a: string }[];
}

export const categoryMeta: Record<
  ProductCategory,
  { name: string; singular: string; blurb: string; standards: string[] }
> = {
  flanges: {
    name: "Flanges",
    singular: "Flanges",
    blurb:
      "Forged flanges in nickel alloy, duplex, super duplex and stainless — with companion carbon and low-temperature steel where a project requires it — to ASME B16.5, B16.47 Series A/B, B16.36, MSS SP-44 and customer drawings, in classes 150 to 2500 and API 6A ratings.",
    standards: [
      "ASME B16.5 (NPS ½ – 24)",
      "ASME B16.47 Series A / B (NPS 26 – 60)",
      "ASME B16.36 (orifice flanges)",
      "MSS SP-44 (line pipe flanges)",
      "EN 1092-1 / DIN / JIS on request",
    ],
  },
  "pipe-fittings": {
    name: "Buttweld Fittings",
    singular: "Buttweld Fittings",
    blurb:
      "Buttweld elbows, tees, reducers, caps and stub ends in nickel alloy, duplex, super duplex and stainless, with companion carbon and low-temperature steel, to ASME B16.9, B16.28, ASTM A403, A234, A420, A815 and B366.",
    standards: [
      "ASME B16.9 (buttweld fittings)",
      "ASME B16.28 (short radius elbows and returns)",
      "MSS SP-43 / SP-75 / SP-83",
      "ASTM A403 / A234 / A420 / B366",
      "EN 10253 on request",
    ],
  },
  "forged-fittings": {
    name: "Forged Fittings",
    singular: "Forged Fittings",
    blurb:
      "Socket-weld and threaded forged fittings to ASME B16.11 in Class 2000 to 9000 — elbows, tees, couplings, unions, plugs, bushings and outlets in nickel alloy, duplex, stainless and companion carbon steel.",
    standards: [
      "ASME B16.11 (socket weld and threaded)",
      "ASME B1.20.1 (NPT threads)",
      "ASTM A182 / A105 / A350 / B564 / B462",
      "MSS SP-79 / SP-83 / SP-97 (branch outlets)",
      "BS 3799 on request",
    ],
  },
  "pipes-tubes": {
    name: "Pipes & Tubes",
    singular: "Pipes & Tubes",
    blurb:
      "Seamless and welded pipe, heat-exchanger and instrumentation tube and line pipe in stainless, duplex, nickel alloy and companion carbon steel to ASTM A312, A213, A249, A269, A789, B161–B622, A106, A53, A333 and API 5L.",
    standards: [
      "ASME B36.10M / B36.19M dimensions",
      "ASTM A312 / A213 / A249 / A269 / A554 / A789",
      "ASTM B161 / B165 / B167 / B407 / B423 / B444 / B622 with B829",
      "ASTM A106 / A53 / A333 / A671 / A672",
      "API 5L PSL1 / PSL2",
    ],
  },
  bars: {
    name: "Bars & Rods",
    singular: "Bars & Rods",
    blurb:
      "Round, hex, square and flat bar in stainless, duplex, nickel alloy and companion carbon steel — bright, black, peeled, ground or polished, cut to length with full traceability.",
    standards: [
      "ASTM A276 / A479 (stainless and duplex bar)",
      "ASTM B160 / B164 / B166 / B425 / B446 / B473 / B574 / B637 (nickel alloy)",
      "ASTM A105 / A350 (carbon and low-temperature forged bar)",
      "EN 10088-3 on request",
      "ASTM A484 general requirements",
    ],
  },
  "sheets-plates": {
    name: "Sheets, Plates & Coils",
    singular: "Sheets, Plates & Coils",
    blurb:
      "Hot and cold rolled sheet, plate, coil and strip in stainless, duplex, nickel alloy and companion pressure-vessel carbon steel with No.1, 2B, BA, No.4 and No.8 finishes, cut to size with UT and testing to order.",
    standards: [
      "ASTM A240 (stainless and duplex plate, sheet, strip)",
      "ASTM B127 / B162 / B168 / B424 / B443 / B463 / B575 / B670 (nickel alloy)",
      "ASTM A516 Gr 70 (pressure vessel plate)",
      "ASTM A480 general requirements",
      "SA-435 / SA-578 ultrasonic examination",
    ],
  },
  "pvc-piping": {
    name: "PVC, UPVC, CPVC & SWR Piping",
    singular: "PVC & UPVC Piping",
    blurb:
      "Rigid plastic piping systems — UPVC pressure pipe, CPVC hot-water pipe, SWR soil and waste drainage and the full moulded fitting range to IS 4985, IS 13592, IS 12818, ASTM D1785 and ASTM F441, manufactured in-house by our sister concern Apex Polymer & Engineering.",
    standards: [
      "IS 4985 (UPVC pressure pipe)",
      "IS 13592 Type A / B (SWR drainage)",
      "IS 12818 (borewell column pipe)",
      "ASTM D1785 / D2466 / D2467 (SCH 40 / 80 PVC)",
      "ASTM F441 / D2846 / F438 / F439 (CPVC)",
    ],
  },
  structural: {
    name: "Structural Steel",
    singular: "Structural Steel",
    blurb:
      "Hot-rolled structural steel beams, parallel flange channels, equal & unequal angles and hollow sections (SHS, RHS, CHS) in IS 2062, EN 10025 (S275, S355), ASTM A36 and ASTM A572 Grade 50 for offshore topsides, pipe racks, platform skids and industrial plant framing.",
    standards: [
      "IS 2062 (E250, E350, E450)",
      "EN 10025-2 (S275JR/J0/J2, S355JR/J0/J2/K2)",
      "ASTM A36 / A36M (Carbon Structural Steel)",
      "ASTM A572 / A572M (High-Strength Low-Alloy Grade 50)",
      "ASTM A500 / EN 10210 / EN 10219 (Hollow Sections)",
    ],
  },
};

export const categoryOrder: ProductCategory[] = [
  "flanges",
  "pipe-fittings",
  "forged-fittings",
  "pipes-tubes",
  "bars",
  "sheets-plates",
  "structural",
  "pvc-piping",
];
