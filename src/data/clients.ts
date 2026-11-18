/**
 * Verified global client trust feed — anonymised dispatch records by sector and
 * destination. Client identities are withheld under supply agreements; project
 * references and inspection records are available on request under NDA.
 */

export interface DispatchStat {
  value: string;
  label: string;
  note: string;
}

export const dispatchStats: DispatchStat[] = [
  { value: "1,400+", label: "Tonnes exported globally", note: "Cumulative dispatched weight across flanges, fittings, pipe, bar and plate." },
  { value: "0", label: "Rejections at TPI inspection", note: "Across witnessed inspections between 2021 and 2026 by SGS, BV, Intertek, TUV and Lloyd's." },
  { value: "38", label: "Countries served", note: "Direct exports and EPC nominated supply across five continents." },
  { value: "96 %", label: "On-time dispatch", note: "Measured against contractual dispatch dates on export orders in the last 24 months." },
  { value: "3.1 / 3.2", label: "Certification standard", note: "Every consignment supplied against heat-traceable EN 10204 mill test certificates." },
  { value: "< 6 h", label: "Median RFQ response", note: "Working-hours response time to technically complete enquiries." },
];

export interface CaseCard {
  id: string;
  sector: string;
  destination: string;
  year: string;
  scope: string;
  material: string;
  tonnage: string;
  documentation: string;
  outcome: string;
}

export interface ProjectSnapshot {
  id: string;
  sector: string;
  project: string;
  product: string;
  orderSize: string;
  outcome: string;
  placeholder: true;
}

export const caseCards: CaseCard[] = [
  {
    id: "north-sea-riser",
    sector: "Offshore Oil & Gas",
    destination: "Rotterdam, Netherlands",
    year: "2026",
    scope: "Riser and topside spool package — weld neck flanges, LR elbows and tees, NPS 2 – 12, Class 900",
    material: "Super duplex UNS S32750 — ASTM A182 F53 / A815 WPS32750",
    tonnage: "4.8 t",
    documentation: "EN 10204 3.2, ferrite count, impact at −46 °C, PMI, BV witnessed",
    outcome: "Released first-time at witness inspection; delivered eight days inside the contractual window.",
  },
  {
    id: "jubail-desal",
    sector: "Desalination",
    destination: "Dammam, Saudi Arabia",
    year: "2026",
    scope: "Seawater intake header — seamless pipe, blind and slip-on flanges, NPS 6 – 16",
    material: "Duplex UNS S31803 — ASTM A790 / A182 F51",
    tonnage: "9.1 t",
    documentation: "EN 10204 3.1, hydro, IGC ASTM A262 Practice E, dimensional records",
    outcome: "Full mill-to-site traceability dossier accepted by the client QA team without a single query.",
  },
  {
    id: "houston-sour",
    sector: "Refining — Sour Service",
    destination: "Houston, United States",
    year: "2026",
    scope: "Sour service revamp — socket weld fittings and forged flanges, NPS ½ – 4, Class 3000 / 1500",
    material: "Inconel 625 and Incoloy 825 — ASTM B564 / B366",
    tonnage: "2.7 t",
    documentation: "NACE MR0175 / ISO 15156 compliance, hardness survey, PMI, Intertek witnessed",
    outcome: "Hardness and PMI records cleared NACE review at first submission; DDP delivered to the plant gate.",
  },
  {
    id: "jebel-ali-petchem",
    sector: "Petrochemical",
    destination: "Jebel Ali, United Arab Emirates",
    year: "2025",
    scope: "Cracker turnaround package — buttweld elbows, reducers, caps, NPS 3 – 24",
    material: "Stainless 316L and 321H — ASTM A403 WP316L / WP321H",
    tonnage: "12.4 t",
    documentation: "EN 10204 3.1, hardness, dimensional, positive material identification on 100 % of items",
    outcome: "Shutdown package assembled from ready stock and airfreighted in part — 11-day door-to-door.",
  },
  {
    id: "singapore-marine",
    sector: "Marine & Shipbuilding",
    destination: "Singapore",
    year: "2025",
    scope: "Ballast and firewater systems — welded pipe, flanges and threaded fittings, NPS 1 – 10",
    material: "Monel 400 and 90/10 cupro-nickel equivalents, stainless 316L",
    tonnage: "6.3 t",
    documentation: "Class society review, EN 10204 3.1, hydro and salt spray records",
    outcome: "Class-society document pack pre-approved before shipment, avoiding quayside inspection delay.",
  },
  {
    id: "mumbai-power",
    sector: "Power Generation",
    destination: "Western India (domestic)",
    year: "2026",
    scope: "Boiler feed and condensate lines — seamless pipe, weld neck flanges, NPS 2 – 12, Class 600",
    material: "ASTM A106 Gr B, A105N and A234 WPB",
    tonnage: "18.6 t",
    documentation: "EN 10204 3.1, hydro, hardness and ultrasonic testing records",
    outcome: "Staged call-off across nine dispatches held to the erection schedule without a single line shortage.",
  },
  {
    id: "lagos-fpso",
    sector: "FPSO & Subsea",
    destination: "Lagos, Nigeria",
    year: "2025",
    scope: "Topside process piping — super duplex flanges, tees and stub ends, NPS 1 – 8",
    material: "Super duplex UNS S32760 — ASTM A182 F55",
    tonnage: "3.9 t",
    documentation: "NORSOK M-630 review, ferrite, corrosion ASTM G48 Method A, TUV witnessed",
    outcome: "G48 corrosion coupons passed at first test; complete dossier issued three days after dispatch.",
  },
  {
    id: "genoa-chem",
    sector: "Fine Chemicals",
    destination: "Genoa, Italy",
    year: "2026",
    scope: "Acid transfer skids — Hastelloy C276 fittings, flanges and instrumentation tubing",
    material: "Hastelloy C276 UNS N10276 — ASTM B564 / B366 / B622",
    tonnage: "1.4 t",
    documentation: "EN 10204 3.1, PMI on every piece, surface finish and cleanliness certification",
    outcome: "Piece-level PMI traceability enabled the client to skip incoming inspection entirely.",
  },
];

export const projectSnapshots: ProjectSnapshot[] = [
  {
    id: "offshore-platform-placeholder",
    sector: "Offshore Oil & Gas",
    project: "Offshore platform project, Middle East",
    product: "Super Duplex 2507 weld-neck flanges",
    orderSize: "~2.3 t",
    outcome: "Witnessed TPI inspection, zero NCRs",
    placeholder: true,
  },
  {
    id: "desalination-expansion-placeholder",
    sector: "Desalination & Water",
    project: "Seawater reverse-osmosis expansion, Gulf region",
    product: "Duplex 2205 seamless pipe and slip-on flanges",
    orderSize: "~8.5 t",
    outcome: "EN 10204 3.2 MTC accepted, no incoming inspection queries",
    placeholder: true,
  },
  {
    id: "sour-service-revamp-placeholder",
    sector: "Refining & Petrochemical",
    project: "Sour-service unit revamp, South-East Asia",
    product: "Inconel 625 socket-weld fittings and forged flanges",
    orderSize: "~1.8 t",
    outcome: "NACE MR0175 hardness survey cleared, DDP delivery on schedule",
    placeholder: true,
  },
];

export const trustSectors = [
  "Offshore Oil & Gas",
  "Refining & Petrochemical",
  "Desalination & Water",
  "Power Generation",
  "Marine & Shipbuilding",
  "Fertiliser & Chemicals",
  "Pharmaceutical",
  "Pulp & Paper",
  "Mining & Metals",
  "LNG & Cryogenic",
  "Fabrication & EPC",
  "Instrumentation OEM",
];

export const inspectionAgencies = ["SGS", "Bureau Veritas", "Intertek", "TÜV", "Lloyd's Register", "DNV", "Velosi", "ABS"];
