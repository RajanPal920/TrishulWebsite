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
  {
    value: "EN 10204",
    label: "3.1 / 3.2 Mill Certification",
    note: "Every consignment supplied with complete heat traceability and certified chemical and mechanical test records.",
  },
  {
    value: "100%",
    label: "TPI Witness Inspection Ready",
    note: "Packages prepared for witness inspection by third-party inspection agencies including SGS, BV, Intertek, TÜV and Lloyd's.",
  },
  {
    value: "Worldwide",
    label: "Export Packaging & Logistics",
    note: "Seaworthy ISPM-15 export packing and multi-currency Incoterm logistics to project destinations across five continents.",
  },
  {
    value: "ISO 9001",
    label: "Certified Quality System",
    note: "Strict ISO 9001:2015 quality management with positive material identification (PMI) on all alloy items.",
  },
  {
    value: "Full Range",
    label: "CRA Piping & Flange Stock",
    note: "Extensive ready stock and mill-backed manufacturing across nickel alloys, duplex, super duplex, and stainless grades.",
  },
  {
    value: "Dedicated",
    label: "Technical Engineering Support",
    note: "Same-day technical review and itemized quotation for complex bill-of-materials and isometric drawings.",
  },
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
    id: "offshore-topside-package",
    sector: "Offshore Oil & Gas",
    destination: "European Port Delivery",
    year: "2026",
    scope: "Topside process spool package — weld neck flanges, LR elbows and tees, NPS 2 – 12, Class 900",
    material: "Super duplex UNS S32750 — ASTM A182 F53 / A815 WPS32750",
    tonnage: "Project lot",
    documentation: "EN 10204 3.2, ferrite count, impact at −46 °C, PMI, witnessed TPI dossier",
    outcome: "Verified and accepted at witness inspection; supplied against strict project offshore specifications.",
  },
  {
    id: "desalination-header-package",
    sector: "Desalination & Water",
    destination: "Middle East Project Site",
    year: "2026",
    scope: "Seawater intake header package — seamless pipe, blind and slip-on flanges, NPS 6 – 16",
    material: "Duplex UNS S31803 / S32205 — ASTM A790 / A182 F51",
    tonnage: "Project lot",
    documentation: "EN 10204 3.1, hydro, IGC ASTM A262 Practice E, dimensional records",
    outcome: "Full mill-to-site traceability dossier accepted by client inspection team without exception.",
  },
  {
    id: "sour-service-revamp",
    sector: "Refining — Sour Service",
    destination: "North American Plant Delivery",
    year: "2026",
    scope: "Sour service revamp package — socket weld fittings and forged flanges, NPS ½ – 4, Class 3000 / 1500",
    material: "Inconel 625 and Incoloy 825 — ASTM B564 / B366",
    tonnage: "Project lot",
    documentation: "NACE MR0175 / ISO 15156 compliance, hardness survey, 100% PMI",
    outcome: "Hardness and PMI records fully verified against NACE MR0175 criteria prior to dispatch.",
  },
  {
    id: "petrochem-shutdown",
    sector: "Petrochemical",
    destination: "Gulf Regional Facility",
    year: "2025",
    scope: "Turnaround package — buttweld elbows, reducers, pipe caps, NPS 3 – 24",
    material: "Stainless 316L and 321H — ASTM A403 WP316L / WP321H",
    tonnage: "Project lot",
    documentation: "EN 10204 3.1, hardness, dimensional, positive material identification on all items",
    outcome: "Turnaround consignment dispatched from certified stock with complete test reports.",
  },
  {
    id: "marine-piping-system",
    sector: "Marine & Shipbuilding",
    destination: "Southeast Asia Shipyard",
    year: "2025",
    scope: "Ballast and firewater systems — seamless pipe, flanges and threaded fittings, NPS 1 – 10",
    material: "Monel 400 and cupro-nickel equivalents, stainless 316L",
    tonnage: "Project lot",
    documentation: "Class society compliance, EN 10204 3.1, hydro and salt spray records",
    outcome: "Full document pack pre-approved against class society standards prior to container stuffing.",
  },
  {
    id: "power-feedwater-package",
    sector: "Power Generation",
    destination: "Power Plant Project",
    year: "2026",
    scope: "Boiler feed and high pressure lines — seamless pipe, weld neck flanges, NPS 2 – 12, Class 600",
    material: "ASTM A106 Gr B, A105N and A234 WPB",
    tonnage: "Project lot",
    documentation: "EN 10204 3.1, hydro, hardness and ultrasonic testing records",
    outcome: "Sequential dispatches coordinated with site erection milestones with zero documentation delays.",
  },
  {
    id: "fpso-topside-package",
    sector: "FPSO & Subsea",
    destination: "West Africa Offshore Project",
    year: "2025",
    scope: "Topside process piping — super duplex flanges, tees and stub ends, NPS 1 – 8",
    material: "Super duplex UNS S32760 — ASTM A182 F55",
    tonnage: "Project lot",
    documentation: "NORSOK M-630 review, ferrite count, corrosion test ASTM G48 Method A",
    outcome: "G48 corrosion coupons verified and released with full metallurgical dossier.",
  },
  {
    id: "speciality-chemicals-skid",
    sector: "Fine Chemicals",
    destination: "European Chemical Complex",
    year: "2026",
    scope: "Acid transfer skids — Hastelloy C276 fittings, flanges and instrumentation tubing",
    material: "Hastelloy C276 UNS N10276 — ASTM B564 / B366 / B622",
    tonnage: "Project lot",
    documentation: "EN 10204 3.1, 100% piece PMI, surface finish certification",
    outcome: "Piece-level PMI traceability confirmed against chemical plant technical specifications.",
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
