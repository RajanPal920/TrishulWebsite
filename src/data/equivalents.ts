import { materials } from "./materials";
import type { Material } from "./types";

export interface Equivalent {
  uns?: string;
  werkstoff?: string;
  en?: string;
  din?: string;
  jis?: string;
  bs?: string;
  gost?: string;
  afnor?: string;
}

/**
 * Cross-standard designation map. Where a national standard has no direct
 * counterpart the field is left out rather than guessed.
 */
const table: Record<string, Equivalent> = {
  "stainless-steel-304": { en: "X5CrNi18-10 / X2CrNi18-9", din: "1.4301 / 1.4307", jis: "SUS 304 / 304L", bs: "304S31", gost: "08Ch18N10", afnor: "Z7CN18-09" },
  "stainless-steel-316": { en: "X5CrNiMo17-12-2 / X2CrNiMo17-12-2", din: "1.4401 / 1.4404", jis: "SUS 316 / 316L", bs: "316S31", gost: "10Ch17N13M2", afnor: "Z7CND17-11-02" },
  "stainless-steel-317l": { en: "X2CrNiMo18-15-4", din: "1.4438", jis: "SUS 317L", bs: "317S12" },
  "stainless-steel-321": { en: "X6CrNiTi18-10", din: "1.4541", jis: "SUS 321", bs: "321S31", gost: "08Ch18N10T" },
  "stainless-steel-347": { en: "X6CrNiNb18-10", din: "1.4550", jis: "SUS 347", bs: "347S31" },
  "stainless-steel-310s": { en: "X8CrNi25-21 / X12CrNi25-21", din: "1.4845 / 1.4841", jis: "SUS 310S", bs: "310S31" },
  "stainless-steel-904l": { en: "X1NiCrMoCu25-20-5", din: "1.4539", jis: "SUS 890L", bs: "904S13" },
  "254-smo": { en: "X1CrNiMoCuN20-18-7", din: "1.4547", jis: "SUS 312L" },
  "duplex-2205": { en: "X2CrNiMoN22-5-3", din: "1.4462", jis: "SUS 329J3L", bs: "318S13" },
  "duplex-s31803": { en: "X2CrNiMoN22-5-3", din: "1.4462", jis: "SUS 329J3L" },
  "super-duplex-2507": { en: "X2CrNiMoN25-7-4", din: "1.4410", jis: "SUS 327L1" },
  "super-duplex-s32760": { en: "X2CrNiMoCuWN25-7-4", din: "1.4501" },
  "alloy-20": { en: "NiCr20CuMo", din: "2.4660", jis: "NCF 20" },
  "nickel-200": { en: "Ni99.2", din: "2.4066", jis: "NW 2200" },
  "nickel-201": { en: "LC-Ni99", din: "2.4068", jis: "NW 2201" },
  "monel-400": { en: "NiCu30Fe", din: "2.4360", jis: "NW 4400" },
  "monel-k500": { en: "NiCu30Al", din: "2.4375", jis: "NW 5500" },
  "inconel-600": { en: "NiCr15Fe", din: "2.4816", jis: "NCF 600" },
  "inconel-601": { en: "NiCr23Fe", din: "2.4851", jis: "NCF 601" },
  "inconel-617": { en: "NiCr23Co12Mo", din: "2.4663" },
  "inconel-625": { en: "NiCr22Mo9Nb", din: "2.4856", jis: "NCF 625" },
  "inconel-686": { en: "NiCr21Mo16W4", din: "2.4606" },
  "inconel-690": { en: "NiCr29Fe", din: "2.4642" },
  "inconel-718": { en: "NiCr19Fe19Nb5Mo3", din: "2.4668", jis: "NCF 718" },
  "inconel-725": { en: "NiCr21Mo8Nb3Ti", din: "2.4669" },
  "inconel-x-750": { en: "NiCr15Fe7TiAl", din: "2.4669", jis: "NCF 750" },
  "incoloy-800": { en: "X10NiCrAlTi32-21", din: "1.4876", jis: "NCF 800" },
  "incoloy-800h": { en: "X8NiCrAlTi32-21", din: "1.4958", jis: "NCF 800H" },
  "incoloy-800ht": { en: "X8NiCrAlTi32-21", din: "1.4959", jis: "NCF 800HT" },
  "incoloy-825": { en: "NiCr21Mo", din: "2.4858", jis: "NCF 825" },
  "incoloy-925": { en: "NiCr21Mo3Ti", din: "2.4852" },
  "hastelloy-b2": { en: "NiMo28", din: "2.4617" },
  "hastelloy-b3": { en: "NiMo28Fe", din: "2.4600" },
  "hastelloy-c22": { en: "NiCr21Mo14W", din: "2.4602" },
  "hastelloy-c276": { en: "NiMo16Cr15W", din: "2.4819", jis: "NW 0276" },
  "hastelloy-c2000": { en: "NiCr23Mo16Cu", din: "2.4675" },
  "carbon-steel-a105": { en: "P250GH / C22.8", din: "1.0460", jis: "SFVC 2A", bs: "BS 1503-221" },
  "carbon-steel-a350-lf2": { en: "P285QH / 16Mo3 equivalent low-temp forging", din: "1.0570", jis: "SFL 2" },
  "carbon-steel-a106": { en: "P235GH / P265GH seamless", din: "1.0345 / 1.0425", jis: "STPG 370" },
  "carbon-steel-a53": { en: "P235TR2", din: "1.0255", jis: "STPG 370" },
  "carbon-steel-a333-gr6": { en: "P275NL1", din: "1.0488", jis: "STPL 380" },
  "carbon-steel-a234-wpb": { en: "P235GH fitting", din: "1.0345", jis: "SFVC 2A" },
  "carbon-steel-a420-wpl6": { en: "P275NL1 fitting", din: "1.0488" },
  "carbon-steel-a516-gr70": { en: "P355GH", din: "1.0473", jis: "SGV 480" },
  "carbon-steel-a36-a572": { en: "S235JR / S355JR", din: "1.0038 / 1.0045", jis: "SS400 / SM490" },
  upvc: { en: "EN 1452 PVC-U", bs: "BS 3505", jis: "JIS K 6741" },
  cpvc: { en: "EN ISO 15877 PVC-C", bs: "BS 7291", jis: "ASTM F441 equivalent" },
  "swr-pvc": { en: "EN 1329 PVC-U", bs: "IS 13592 (Indian standard)" },
};

export interface EquivalentRow extends Equivalent {
  slug: string;
  name: string;
  astm: string;
  family: Material["family"];
}

export const equivalentRows: EquivalentRow[] = materials.map((m) => {
  const e = table[m.slug] ?? {};
  const row: EquivalentRow = {
    slug: m.slug,
    name: m.name,
    family: m.family,
    astm: m.standards.flanges[0] ?? m.standards.fittings[0] ?? "Project specification",
    uns: m.uns,
  };
  if (m.werkstoff) row.werkstoff = m.werkstoff;
  if (e.en) row.en = e.en;
  if (e.din) row.din = e.din;
  if (e.jis) row.jis = e.jis;
  if (e.bs) row.bs = e.bs;
  if (e.gost) row.gost = e.gost;
  if (e.afnor) row.afnor = e.afnor;
  return row;
});

export const equivalentFor = (slug: string): EquivalentRow | undefined =>
  equivalentRows.find((r) => r.slug === slug);

const haystack = (r: EquivalentRow) =>
  [r.name, r.astm, r.uns, r.werkstoff, r.en, r.din, r.jis, r.bs, r.gost, r.afnor]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const searchEquivalents = (q: string): EquivalentRow[] => {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return equivalentRows.filter((r) => haystack(r).includes(term)).slice(0, 12);
};
