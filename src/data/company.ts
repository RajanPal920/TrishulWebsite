const mapsSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const company = {
  name: "Trishul Metals & Alloys",
  legalName: "Trishul Metals & Alloys",
  shortName: "Trishul",
  tagline: "Engineered for Critical Industries. Trusted for Global Supply.",
  secondaryTagline: "Globally Certified. Internationally Trusted.",
  description:
    "Trishul Metals & Alloys is a Mumbai-based specialist supplier and exporter of critical Corrosion-Resistant Alloy (CRA) piping components — nickel alloy, duplex, super duplex and stainless steel flanges, pipe fittings, pipes and tubes — for oil & gas, refinery, petrochemical, desalination, marine and power projects worldwide.",
  email: "contactustrishul@gmail.com",
  exportEmail: "export@trishulmetal.com",
  phone: "+91 79772 81567",
  phoneHref: "tel:+917977281567",
  whatsapp: "https://wa.me/917977281567",
  address: {
    street: "Suite 206, 89/91 Durgadevi Street",
    city: "Mumbai",
    region: "Maharashtra",
    postalCode: "400004",
    country: "India",
  },
  addressLine: "Suite 206, 89/91 Durgadevi Street, Mumbai, India",
  warehouseLine:
    "Plot No. 1818, Road No. 23, Kalamboli Warehouse Complex (KWC), Kalamboli, Navi Mumbai, Maharashtra 410218, India",
  social: {
    linkedin: "https://www.linkedin.com/company/trishul-metals-alloys",
    instagram: "https://www.instagram.com/trishulmetals",
    facebook: "https://www.facebook.com/trishulmetals",
  },
  hours: "Mon–Sat, 09:30–19:00 IST",
  siteUrl: "https://www.trishulmetal.com",
} as const;

export interface Office {
  id: string;
  kind: "office" | "warehouse";
  role: string;
  city: string;
  country: string;
  flag: string;
  lines: string[];
  email: string;
  phone: string;
  phoneHref: string;
  hours: string;
  covers: string;
  mapsUrl: string;
  visitNote?: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode?: string;
    countryCode: string;
  };
}

export const offices: Office[] = [
  {
    id: "mumbai",
    kind: "office",
    role: "Operational headquarters & despatch",
    city: "Mumbai",
    country: "India",
    flag: "IN",
    lines: ["Suite 206, 89/91 Durgadevi Street", "Mumbai, Maharashtra 400004", "India"],
    email: "contactustrishul@gmail.com",
    phone: "+91 79772 81567",
    phoneHref: "tel:+917977281567",
    hours: "Mon–Sat, 09:30–19:00 IST",
    covers: "Stock, inspection, packing and shipment out of Nhava Sheva and Mundra.",
    mapsUrl: mapsSearch("Suite 206, 89/91 Durgadevi Street, Mumbai, Maharashtra 400004, India"),
    address: {
      street: "Suite 206, 89/91 Durgadevi Street",
      city: "Mumbai",
      region: "Maharashtra",
      postalCode: "400004",
      countryCode: "IN",
    },
  },
  {
    id: "kalamboli",
    kind: "warehouse",
    role: "Warehouse & despatch",
    city: "Kalamboli",
    country: "India",
    flag: "IN",
    lines: [
      "Plot No. 1818, Road No. 23",
      "Kalamboli Warehouse Complex (KWC)",
      "Kalamboli, Navi Mumbai",
      "Maharashtra 410218",
      "India",
    ],
    email: "contactustrishul@gmail.com",
    phone: "+91 79772 81567",
    phoneHref: "tel:+917977281567",
    hours: "Mon–Sat, 09:30–19:00 IST",
    covers:
      "Ready CRA stock, cut-to-size and pre-machining handover, inspection and export packing, despatched via Nhava Sheva.",
    visitNote: "Warehouse and inspection visits are arranged by appointment — tell us the date and any TPI details.",
    mapsUrl: mapsSearch(
      "Plot No. 1818, Road No. 23, Kalamboli Warehouse Complex (KWC), Kalamboli, Navi Mumbai, Maharashtra 410218, India",
    ),
    address: {
      street: "Plot No. 1818, Road No. 23, Kalamboli Warehouse Complex (KWC)",
      city: "Kalamboli",
      region: "Maharashtra",
      postalCode: "410218",
      countryCode: "IN",
    },
  },
];

export const trustPoints = [
  {
    title: "Material Traceability",
    body: "Every consignment is supplied against heat-number traceable EN 10204 3.1 mill test certificates linked back to the melting source.",
  },
  {
    title: "Specification Review",
    body: "Enquiries are reviewed against the governing ASTM / ASME / NORSOK / client specification before pricing, so deviations are raised at RFQ stage rather than at inspection.",
  },
  {
    title: "Inspection Documentation",
    body: "Dimensional reports, hardness, impact, ferrite count, IGC and hydrostatic records compiled into a single dispatch dossier.",
  },
  {
    title: "PMI & Testing Coordination",
    body: "Positive material identification, ferrite measurement and third-party witness testing coordinated with TPI agencies on request.",
  },
  {
    title: "Drawing-Based Components",
    body: "Non-standard bores, special facings, thickness transitions and customer-drawing forgings handled through approved forging and machining partners.",
  },
  {
    title: "Export Documentation",
    body: "Commercial invoice, packing list, certificate of origin, MTC set, TPI release note and BL prepared for FOB, CFR, CIF and DDP shipments.",
  },
];

export const certifications = [
  "ASTM / ASME material standards",
  "EN 10204 3.1 mill test certificates",
  "NACE MR0175 / ISO 15156 compliant supply on request",
  "Materials sourced against applicable NORSOK M-630 Material Data Sheets (specification, not a held certification)",
  "Third-party inspection: SGS, BV, Intertek, TUV, Lloyd's",
  "GST registered · IEC holder · Export documentation in-house",
];

export interface Credential {
  name: string;
  issuer: string;
  number?: string;
  detail: string;
  validity?: string;
  verify?: string;
  documentKey?: string;
}

export const credentials: Credential[] = [
  {
    name: "ISO 9001:2015 — Quality Management System",
    issuer: "Magnitude Management Services Pvt. Ltd. (EGAC accredited, IAF MLA)",
    number: "26MEQXH09",
    detail:
      "Scope: supply & export of pipes, tubes, steels, plates, flats, strips & rods, pipe fittings & fasteners in stainless steel, carbon steel, alloy steel, nickel alloys, copper & brass.",
    validity: "Valid 13 Aug 2026 – 12 Aug 2029",
    documentKey: "iso-9001",
  },
  {
    name: "Importer-Exporter Code (IEC)",
    issuer: "DGFT, Ministry of Commerce & Industry, Government of India",
    number: "AAYFT9507B",
    detail: "Licensed to import and export — issued to Trishul Metals & Alloys.",
    verify: "https://www.dgft.gov.in",
    documentKey: "iec-code",
  },
  {
    name: "GST Registration",
    issuer: "Government of India — Goods & Services Tax",
    number: "27AAYFT9507B1ZP",
    detail: "Registered regular taxpayer (Maharashtra).",
    documentKey: "gst-certificate",
  },
  {
    name: "MSME / Udyam Registration",
    issuer: "Ministry of MSME, Government of India",
    number: "UDYAM-MH-19-0404041",
    detail: "Registered micro enterprise (wholesale of metals & metal ores).",
    documentKey: "udyam-registration",
  },
  {
    name: "Startup India — DPIIT Recognition",
    issuer: "Department for Promotion of Industry & Internal Trade (DPIIT)",
    number: "DIPP243391",
    detail: "DPIIT-recognised startup.",
    validity: "Recognised to 13 Jan 2036",
    documentKey: "dpiit-recognition",
  },
  {
    name: "CIFFA — Freight Forwarding Training (Govind Modi)",
    issuer: "Canadian International Freight Forwarders Association (CIFFA) / Centennial College",
    detail:
      "Govind Modi's personal freight-forwarding training qualification — supporting correct Incoterms, documentation and multimodal export handling.",
    documentKey: "ciffa-certificate",
  },
];
