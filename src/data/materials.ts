import { nickelMaterials } from "./materials.nickel";
import { duplexMaterials } from "./materials.duplex";
import { stainlessMaterials } from "./materials.stainless";
import { stainlessExtraMaterials } from "./materials.stainless2";
import { carbonMaterials } from "./materials.carbon";
import { polymerMaterials } from "./materials.polymer";
import type { Family, Material } from "./types";

export const materials: Material[] = [
  ...nickelMaterials,
  ...duplexMaterials,
  ...stainlessMaterials,
  ...stainlessExtraMaterials,
  ...carbonMaterials,
  ...polymerMaterials,
];

export const materialBySlug = (slug: string): Material | undefined =>
  materials.find((m) => m.slug === slug);

export const materialsByFamily = (family: Family): Material[] =>
  materials.filter((m) => m.family === family);

export const families: Family[] = [
  "nickel",
  "duplex",
  "super-duplex",
  "stainless",
  "carbon",
  "polymer",
];

export * from "./types";
