import { materials, materialBySlug } from "./materials";
import { productTypes, productBySlug, categoryMeta } from "./products";
import type { Material, Family } from "./types";
import type { ProductType, ProductCategory } from "./products.types";

/**
 * Defines which product categories are genuinely supplied in each material
 * family, and the governing material specification for that pairing.
 */
const familyCategorySpec: Record<Family, Partial<Record<ProductCategory, string>>> = {
  stainless: {
    flanges: "ASTM A182",
    "pipe-fittings": "ASTM A403",
    "forged-fittings": "ASTM A182",
    "pipes-tubes": "ASTM A312 / A213 / A249 / A269",
    bars: "ASTM A276 / A479",
    "sheets-plates": "ASTM A240",
  },
  duplex: {
    flanges: "ASTM A182",
    "pipe-fittings": "ASTM A815",
    "forged-fittings": "ASTM A182",
    "pipes-tubes": "ASTM A790 / A789",
    bars: "ASTM A276 / A479",
    "sheets-plates": "ASTM A240",
  },
  "super-duplex": {
    flanges: "ASTM A182",
    "pipe-fittings": "ASTM A815",
    "forged-fittings": "ASTM A182",
    "pipes-tubes": "ASTM A790 / A789",
    bars: "ASTM A276 / A479",
    "sheets-plates": "ASTM A240",
  },
  nickel: {
    flanges: "ASTM B564",
    "pipe-fittings": "ASTM B366",
    "forged-fittings": "ASTM B564 / B462",
    "pipes-tubes": "ASTM B-series with B829",
    bars: "ASTM B-series bar specifications",
    "sheets-plates": "ASTM B-series plate specifications",
  },
  carbon: {
    flanges: "ASTM A105 / A350",
    "pipe-fittings": "ASTM A234 / A420",
    "forged-fittings": "ASTM A105 / A350",
    "pipes-tubes": "ASTM A106 / A53 / A333 / API 5L",
    bars: "ASTM A105 / A350",
    "sheets-plates": "ASTM A516 Gr 70",
  },
  polymer: {
    "pvc-piping": "IS 4985 / IS 13592 / ASTM D1785",
  },
};

/** Grade-level overrides where a grade only serves part of its family range. */
const gradeCategoryOverride: Record<string, ProductCategory[]> = {
  "carbon-steel-a106": ["pipes-tubes"],
  "api-5l-line-pipe": ["pipes-tubes"],
  "carbon-steel-a53": ["pipes-tubes"],
  "carbon-steel-a333-gr6": ["pipes-tubes"],
  "carbon-steel-a105": ["flanges", "forged-fittings", "bars"],
  "carbon-steel-a350-lf2": ["flanges", "forged-fittings", "bars"],
  "carbon-steel-a234-wpb": ["pipe-fittings"],
  "carbon-steel-a420-wpl6": ["pipe-fittings"],
  "carbon-steel-a516-gr70": ["sheets-plates"],
  upvc: ["pvc-piping"],
  cpvc: ["pvc-piping"],
  "swr-pvc": ["pvc-piping"],
};

export const categoriesForMaterial = (m: Material): ProductCategory[] => {
  const override = gradeCategoryOverride[m.slug];
  const familyCats = Object.keys(familyCategorySpec[m.family] ?? {}) as ProductCategory[];
  if (override) return familyCats.filter((c) => override.includes(c));
  return familyCats;
};

/** PVC product slugs restricted to the matching polymer grade. */
const polymerProductGrades: Record<string, string[]> = {
  "upvc-pressure-pipes": ["upvc"],
  "borewell-column-pipes": ["upvc"],
  "cpvc-pipes": ["cpvc"],
  "swr-drainage-pipes": ["swr-pvc"],
  "pvc-fittings": ["upvc", "cpvc", "swr-pvc"],
};

export const isValidPair = (m: Material, p: ProductType): boolean => {
  if (!categoriesForMaterial(m).includes(p.category)) return false;
  if (p.category === "pvc-piping") {
    return (polymerProductGrades[p.slug] ?? []).includes(m.slug);
  }
  if (m.family === "carbon") {
    if (p.slug === "line-pipe") return m.slug === "api-5l-line-pipe";
    if (p.slug === "low-temperature-pipes") return m.slug === "carbon-steel-a333-gr6";
    if (p.slug === "instrumentation-tubing") return false;
    if (p.slug === "heat-exchanger-tubes") return m.slug === "carbon-steel-a106";
    if (p.slug === "seamless-pipes") return ["carbon-steel-a106", "carbon-steel-a53"].includes(m.slug);
    if (p.slug === "welded-pipes" || p.slug === "large-diameter-pipes")
      return ["carbon-steel-a53", "api-5l-line-pipe"].includes(m.slug);
  } else {
    if (["line-pipe", "low-temperature-pipes", "large-diameter-pipes"].includes(p.slug)) return false;
    if (p.slug === "instrumentation-tubing")
      return ["stainless", "duplex", "super-duplex", "nickel"].includes(m.family);
  }
  return true;
};

export const productsForMaterial = (m: Material): ProductType[] =>
  productTypes.filter((p) => isValidPair(m, p));

export const materialsForProduct = (p: ProductType): Material[] =>
  materials.filter((m) => isValidPair(m, p));

export const specForPair = (m: Material, p: ProductType): string =>
  familyCategorySpec[m.family]?.[p.category] ?? "Project specification";

export interface MatrixPair {
  material: Material;
  product: ProductType;
}

export const matrixPair = (materialSlug: string, productSlug: string): MatrixPair | null => {
  const material = materialBySlug(materialSlug);
  const product = productBySlug(productSlug);
  if (!material || !product) return null;
  if (!isValidPair(material, product)) return null;
  return { material, product };
};

export const matrixTitle = (m: Material, p: ProductType) => `${m.name} ${p.name}`;

export const matrixPath = (m: Material, p: ProductType) => `/materials/${m.slug}/${p.slug}`;

export const allMatrixPairs = (): MatrixPair[] =>
  materials.flatMap((material) =>
    productTypes.filter((p) => isValidPair(material, p)).map((product) => ({ material, product })),
  );

export const matrixCount = () => allMatrixPairs().length;

export const categoryLabel = (c: ProductCategory) => categoryMeta[c].name;
