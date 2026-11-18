/**
 * Indicative landed-cost model for the multi-currency Incoterm estimator.
 * Freight and handling figures are planning-grade indications refreshed with
 * our forwarders; the binding number is always the RFQ quotation.
 */

export interface Currency {
  code: string;
  symbol: string;
  perUsd: number; // units of currency per 1 USD
  label: string;
}

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", perUsd: 1, label: "US Dollar" },
  { code: "EUR", symbol: "€", perUsd: 0.92, label: "Euro" },
  { code: "GBP", symbol: "£", perUsd: 0.78, label: "Pound Sterling" },
  { code: "AED", symbol: "AED ", perUsd: 3.673, label: "UAE Dirham" },
  { code: "SAR", symbol: "SAR ", perUsd: 3.75, label: "Saudi Riyal" },
  { code: "SGD", symbol: "S$", perUsd: 1.34, label: "Singapore Dollar" },
  { code: "INR", symbol: "₹", perUsd: 87.4, label: "Indian Rupee" },
];

export interface DestPort {
  id: string;
  name: string;
  country: string;
  region: string;
  transitDays: string;
  /** Indicative ocean freight, USD per 1000 kg, LCL-equivalent basis, ex Nhava Sheva. */
  freightPerTonne: number;
  /** Destination terminal handling, customs and documentation, USD per shipment. */
  destHandling: number;
  /** Indicative import duty + local levies as a share of CIF value. */
  dutyPct: number;
  /** Indicative inland delivery to project door, USD per 1000 kg. */
  inlandPerTonne: number;
}

export const destPorts: DestPort[] = [
  { id: "jebel-ali", name: "Jebel Ali", country: "United Arab Emirates", region: "Middle East", transitDays: "5 – 8 days", freightPerTonne: 78, destHandling: 320, dutyPct: 0.05, inlandPerTonne: 42 },
  { id: "dammam", name: "Dammam", country: "Saudi Arabia", region: "Middle East", transitDays: "7 – 10 days", freightPerTonne: 92, destHandling: 420, dutyPct: 0.05, inlandPerTonne: 55 },
  { id: "hamad", name: "Hamad (Doha)", country: "Qatar", region: "Middle East", transitDays: "7 – 11 days", freightPerTonne: 96, destHandling: 400, dutyPct: 0.05, inlandPerTonne: 50 },
  { id: "sohar", name: "Sohar", country: "Oman", region: "Middle East", transitDays: "5 – 8 days", freightPerTonne: 82, destHandling: 340, dutyPct: 0.05, inlandPerTonne: 48 },
  { id: "rotterdam", name: "Rotterdam", country: "Netherlands", region: "Europe", transitDays: "22 – 28 days", freightPerTonne: 165, destHandling: 560, dutyPct: 0.027, inlandPerTonne: 65 },
  { id: "antwerp", name: "Antwerp", country: "Belgium", region: "Europe", transitDays: "23 – 29 days", freightPerTonne: 170, destHandling: 570, dutyPct: 0.027, inlandPerTonne: 68 },
  { id: "hamburg", name: "Hamburg", country: "Germany", region: "Europe", transitDays: "24 – 30 days", freightPerTonne: 178, destHandling: 590, dutyPct: 0.027, inlandPerTonne: 72 },
  { id: "genoa", name: "Genoa", country: "Italy", region: "Europe", transitDays: "18 – 24 days", freightPerTonne: 152, destHandling: 520, dutyPct: 0.027, inlandPerTonne: 62 },
  { id: "felixstowe", name: "Felixstowe", country: "United Kingdom", region: "Europe", transitDays: "24 – 30 days", freightPerTonne: 182, destHandling: 610, dutyPct: 0.02, inlandPerTonne: 74 },
  { id: "houston", name: "Houston", country: "United States", region: "Americas", transitDays: "30 – 38 days", freightPerTonne: 214, destHandling: 720, dutyPct: 0.0, inlandPerTonne: 85 },
  { id: "new-york", name: "New York / Newark", country: "United States", region: "Americas", transitDays: "28 – 35 days", freightPerTonne: 208, destHandling: 700, dutyPct: 0.0, inlandPerTonne: 88 },
  { id: "los-angeles", name: "Los Angeles", country: "United States", region: "Americas", transitDays: "32 – 40 days", freightPerTonne: 236, destHandling: 760, dutyPct: 0.0, inlandPerTonne: 92 },
  { id: "montreal", name: "Montreal", country: "Canada", region: "Americas", transitDays: "30 – 38 days", freightPerTonne: 228, destHandling: 740, dutyPct: 0.0, inlandPerTonne: 96 },
  { id: "singapore", name: "Singapore", country: "Singapore", region: "Asia Pacific", transitDays: "8 – 12 days", freightPerTonne: 88, destHandling: 360, dutyPct: 0.0, inlandPerTonne: 45 },
  { id: "port-klang", name: "Port Klang", country: "Malaysia", region: "Asia Pacific", transitDays: "9 – 13 days", freightPerTonne: 92, destHandling: 350, dutyPct: 0.0, inlandPerTonne: 46 },
  { id: "melbourne", name: "Melbourne", country: "Australia", region: "Asia Pacific", transitDays: "20 – 26 days", freightPerTonne: 196, destHandling: 640, dutyPct: 0.05, inlandPerTonne: 90 },
  { id: "lagos", name: "Lagos (Apapa)", country: "Nigeria", region: "Africa", transitDays: "24 – 32 days", freightPerTonne: 205, destHandling: 690, dutyPct: 0.1, inlandPerTonne: 105 },
  { id: "durban", name: "Durban", country: "South Africa", region: "Africa", transitDays: "18 – 24 days", freightPerTonne: 172, destHandling: 560, dutyPct: 0.05, inlandPerTonne: 78 },
  { id: "alexandria", name: "Alexandria", country: "Egypt", region: "Africa", transitDays: "16 – 22 days", freightPerTonne: 158, destHandling: 540, dutyPct: 0.1, inlandPerTonne: 70 },
];

export interface MaterialBand {
  id: string;
  label: string;
  /** Indicative ex-works price, USD per kg, based on recent enquiry ranges. */
  usdPerKg: number;
}

export const materialBands: MaterialBand[] = [
  { id: "cs", label: "Carbon steel — A105 / A234 WPB / A106 B", usdPerKg: 3.1 },
  { id: "ltcs", label: "Low temperature carbon — A350 LF2 / A420 WPL6", usdPerKg: 4.4 },
  { id: "ss304", label: "Stainless 304 / 304L", usdPerKg: 7.2 },
  { id: "ss316", label: "Stainless 316 / 316L", usdPerKg: 8.9 },
  { id: "ss904", label: "Stainless 904L / 317L", usdPerKg: 15.5 },
  { id: "duplex", label: "Duplex 2205 (S31803 / S32205)", usdPerKg: 13.8 },
  { id: "sduplex", label: "Super duplex 2507 (S32750 / S32760)", usdPerKg: 19.6 },
  { id: "n825", label: "Incoloy 825 / Alloy 20", usdPerKg: 32.0 },
  { id: "n625", label: "Inconel 625 / 601", usdPerKg: 48.5 },
  { id: "c276", label: "Hastelloy C276 / C22", usdPerKg: 62.0 },
  { id: "monel", label: "Monel 400 / K500", usdPerKg: 44.0 },
  { id: "pvc", label: "UPVC / CPVC / SWR piping (Apex Polymer & Engineering)", usdPerKg: 1.9 },
];

export const incotermCodes = ["EXW", "FOB", "CFR", "CIF", "DAP", "DDP"] as const;
export type IncotermCode = (typeof incotermCodes)[number];

export const incotermScope: Record<IncotermCode, string> = {
  EXW: "Ex works our Mumbai stockyard — buyer arranges export clearance and all transport.",
  FOB: "Free on board Nhava Sheva / Mundra — export packing, haulage, clearance and loading included.",
  CFR: "Cost and freight to the destination port — ocean freight included, insurance by buyer.",
  CIF: "Cost, insurance and freight to the destination port — 110 % invoice value marine cover included.",
  DAP: "Delivered at place — destination handling and inland delivery included, duty payable by buyer.",
  DDP: "Delivered duty paid — import duty and levies cleared by us to the consignee door.",
};

export interface CostLine {
  label: string;
  usd: number;
  note: string;
}

export interface LandedResult {
  lines: CostLine[];
  totalUsd: number;
  perKgUsd: number;
  transitDays: string;
}

/** Planning-grade landed-cost build-up. */
export function computeLanded(input: {
  weightKg: number;
  band: MaterialBand;
  port: DestPort;
  incoterm: IncotermCode;
  documentation: boolean; // TPI / 3.2 certification
  urgent: boolean; // expedited / part air freight handling
}): LandedResult {
  const t = input.weightKg / 1000;
  const goods = input.weightKg * input.band.usdPerKg;
  const lines: CostLine[] = [
    { label: "Ex-works material value", usd: goods, note: `${input.band.label} at indicative USD ${input.band.usdPerKg.toFixed(2)}/kg` },
  ];

  const certification = input.documentation ? Math.max(280, goods * 0.012) : Math.max(90, goods * 0.004);
  lines.push({
    label: input.documentation ? "Third-party inspection & 3.2 certification" : "EN 10204 3.1 documentation",
    usd: certification,
    note: input.documentation ? "TPI witness, NDT witness and dossier compilation" : "Mill test certificates and dispatch dossier",
  });

  const packing = Math.max(140, t * 95) * (input.urgent ? 1.15 : 1);
  lines.push({ label: "Export packing, marking & fumigated cases", usd: packing, note: "Seaworthy timber cases, ISPM-15 treated" });

  const order = ["EXW", "FOB", "CFR", "CIF", "DAP", "DDP"].indexOf(input.incoterm);

  if (order >= 1) {
    lines.push({ label: "Inland haulage to port & export clearance", usd: Math.max(210, t * 78), note: "Mumbai stockyard to Nhava Sheva / Mundra, customs and THC" });
  }
  if (order >= 2) {
    lines.push({
      label: `Ocean freight to ${input.port.name}`,
      usd: Math.max(420, t * input.port.freightPerTonne) * (input.urgent ? 1.35 : 1),
      note: `${input.port.transitDays} port-to-port${input.urgent ? ", expedited routing premium" : ""}`,
    });
  }
  if (order >= 3) {
    const cifBase = lines.reduce((s, l) => s + l.usd, 0);
    lines.push({ label: "Marine insurance (110 % invoice value)", usd: cifBase * 0.0055 * 1.1, note: "All-risk institute cargo clauses A" });
  }
  if (order >= 4) {
    lines.push({ label: "Destination handling, customs brokerage & documentation", usd: input.port.destHandling, note: `${input.port.country} terminal and broker charges` });
    lines.push({ label: "Inland delivery to project door", usd: Math.max(180, t * input.port.inlandPerTonne), note: "Road delivery within the destination metro area" });
  }
  if (order >= 5) {
    const dutiable = lines.reduce((s, l) => s + l.usd, 0);
    lines.push({ label: "Import duty & local levies", usd: dutiable * input.port.dutyPct, note: `Indicative ${(input.port.dutyPct * 100).toFixed(1)} % for ${input.port.country}` });
  }

  const totalUsd = lines.reduce((s, l) => s + l.usd, 0);
  return { lines, totalUsd, perKgUsd: totalUsd / Math.max(1, input.weightKg), transitDays: input.port.transitDays };
}

export function formatMoney(usd: number, currency: Currency) {
  const v = usd * currency.perUsd;
  return `${currency.symbol}${v.toLocaleString("en-US", { maximumFractionDigits: v > 1000 ? 0 : 2 })}`;
}
