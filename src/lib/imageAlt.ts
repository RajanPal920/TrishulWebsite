import type { ProductCategory, ProductType } from "@/data/products.types";

/**
 * Descriptive alternative text for photographs, written in the same style as the
 * stockyard, export-crate and dossier photos: what the picture actually shows —
 * the object, its markings and the setting — rather than the page heading.
 */

const categoryScene: Record<ProductCategory, string> = {
  flanges:
    "machined sealing faces and drilled bolt holes, hard-stamped with grade and heat number and stacked on a workshop bench",
  "pipe-fittings":
    "bevelled weld ends and stencilled grade markings, laid out on a bench before dimensional checking",
  "forged-fittings":
    "socket bores and hexagonal forged bodies grouped in a parts tray, each stamped with grade and class",
  "pipes-tubes":
    "bundled seamless lengths with capped ends and colour-coded heat-number tags on a stockyard rack",
  bars: "bright-finished bar lengths racked in a bundle, ends stamped with grade and heat identification",
  "sheets-plates":
    "stacked plate with mill edges and stencilled heat identification, laid flat on timber dunnage",
  "pvc-piping":
    "extruded polymer pipe lengths printed with size, class and standard markings, bundled for dispatch",
};

/** Alt text for the studio/stock photograph shown on a product type page or card. */
export function productPhotoAlt(
  product: Pick<ProductType, "name" | "category" | "standards">,
): string {
  const standard = product.standards[0];
  const scene = categoryScene[product.category];
  return standard
    ? `${product.name} to ${standard} — ${scene}`
    : `${product.name} — ${scene}`;
}

/** Alt text for a grade × product combination page. */
export function matrixPhotoAlt(
  materialName: string,
  product: Pick<ProductType, "name" | "category" | "standards">,
): string {
  return `${materialName} ${product.name.toLowerCase()} — ${categoryScene[product.category]}`;
}

/** Alt text for the reference photograph beside a CAD component family. */
export function cadPartAlt(
  familyName: string,
  standard: string,
  product?: Pick<ProductType, "name" | "category" | "standards">,
): string {
  const scene = product ? categoryScene[product.category] : "machined component shown for reference";
  return `${familyName} to ${standard} — ${scene}`;
}
