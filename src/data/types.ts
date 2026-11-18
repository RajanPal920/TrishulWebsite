export type Family = "nickel" | "duplex" | "super-duplex" | "stainless" | "carbon" | "polymer";

export interface Elem {
  element: string;
  percent: string;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Material {
  slug: string;
  name: string;
  uns: string;
  werkstoff?: string;
  family: Family;
  tagline: string;
  summary: string;
  overview: string[];
  composition: Elem[];
  mechanical: SpecRow[];
  physical: SpecRow[];
  corrosion: string[];
  features: string[];
  applications: string[];
  standards: {
    flanges: string[];
    fittings: string[];
    other?: string[];
  };
  comparison: { vs: string; note: string }[];
  faqs: Faq[];
  maxTemp: string;
}

export const familyLabel: Record<Family, string> = {
  nickel: "Nickel Alloys",
  duplex: "Duplex Stainless Steel",
  "super-duplex": "Super Duplex Stainless Steel",
  stainless: "Stainless Steel",
  carbon: "Companion Carbon & Low-Temperature Steel",
  polymer: "PVC / UPVC / CPVC Piping",
};

export const familySlug: Record<Family, string> = {
  nickel: "nickel-alloys",
  duplex: "duplex",
  "super-duplex": "super-duplex",
  stainless: "stainless-steel",
  carbon: "carbon-steel",
  polymer: "pvc-piping",
};
