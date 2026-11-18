export interface Incoterm {
  code: string;
  name: string;
  transfer: string;
  sellerScope: string[];
  buyerScope: string[];
  bestFor: string;
}

export const incoterms: Incoterm[] = [
  {
    code: "EXW",
    name: "Ex Works — Mumbai warehouse",
    transfer: "Risk passes when goods are placed at the buyer's disposal at our Mumbai stockyard.",
    sellerScope: ["Packing and marking", "Mill test certificates", "Loading assistance on request"],
    buyerScope: ["Export clearance", "Inland haulage", "Ocean or air freight", "Insurance and import duty"],
    bestFor: "Buyers with an appointed India freight forwarder and consolidation programme.",
  },
  {
    code: "FOB",
    name: "Free On Board — Nhava Sheva / Mundra",
    transfer: "Risk passes when goods are loaded on board the nominated vessel at the Indian port.",
    sellerScope: ["Export packing", "Inland transport to port", "Export customs clearance", "Terminal handling and loading"],
    buyerScope: ["Ocean freight", "Marine insurance", "Destination handling and duty"],
    bestFor: "The most common term for our export orders where the buyer has a freight contract.",
  },
  {
    code: "CFR",
    name: "Cost and Freight — named destination port",
    transfer: "Risk passes on board at the load port; we pay ocean freight to the destination port.",
    sellerScope: ["All FOB scope", "Ocean freight to named port", "Bill of lading and shipping documents"],
    buyerScope: ["Marine insurance", "Destination handling, duty and delivery"],
    bestFor: "Buyers who insure their own cargo under an open marine policy.",
  },
  {
    code: "CIF",
    name: "Cost, Insurance and Freight — named destination port",
    transfer: "Risk passes on board at the load port; we arrange freight and minimum cover insurance.",
    sellerScope: ["All CFR scope", "Marine insurance (110 % invoice value)", "Full export document set"],
    buyerScope: ["Import clearance, duty and inland delivery"],
    bestFor: "First-time buyers and letter-of-credit shipments requiring a complete document set.",
  },
  {
    code: "CIP",
    name: "Carriage and Insurance Paid To — named place",
    transfer: "Risk passes to the first carrier; we pay carriage and insurance to the named inland place.",
    sellerScope: ["Carriage to named place", "All-risk insurance cover", "Air or multimodal documentation"],
    buyerScope: ["Import clearance and duty at destination"],
    bestFor: "Air freight of urgent flange and fitting parcels to inland project sites.",
  },
  {
    code: "DAP",
    name: "Delivered At Place — project site",
    transfer: "Risk passes when goods are ready for unloading at the named site.",
    sellerScope: ["Door-to-door transport", "Freight, insurance and destination handling", "Delivery to site"],
    buyerScope: ["Import duty and taxes", "Unloading at site"],
    bestFor: "EPC packages where a single landed price per line item is required.",
  },
  {
    code: "DDP",
    name: "Delivered Duty Paid — consignee door",
    transfer: "Risk passes at the consignee door with all duties cleared by us.",
    sellerScope: ["Everything to the door", "Import clearance", "Duties and taxes"],
    buyerScope: ["Unloading only"],
    bestFor: "Buyers in markets where we hold a nominated import agent; quoted case by case.",
  },
];

export interface LeadTime {
  scope: string;
  exStock: string;
  made: string;
  notes: string;
}

export const leadTimes: LeadTime[] = [
  {
    scope: "Stainless & duplex flanges, NPS ½ – 24, Class 150 – 900",
    exStock: "3 – 7 working days",
    made: "3 – 5 weeks",
    notes: "Ex-stock covers common sizes in 304/L, 316/L, F51, F53 and F55.",
  },
  {
    scope: "Nickel alloy flanges (Monel, Inconel, Hastelloy, Alloy 20)",
    exStock: "5 – 10 working days",
    made: "5 – 9 weeks",
    notes: "Made-to-order lead time is governed by billet or forging stock availability.",
  },
  {
    scope: "Buttweld fittings ASME B16.9",
    exStock: "3 – 10 working days",
    made: "4 – 8 weeks",
    notes: "Large-bore heavy-wall fittings and hot-formed items run at the longer end.",
  },
  {
    scope: "Forged socket weld / threaded fittings B16.11",
    exStock: "2 – 5 working days",
    made: "3 – 5 weeks",
    notes: "Held in ready stock across most grades up to NPS 4 in 3000# and 6000#.",
  },
  {
    scope: "Seamless & welded pipes / tubes",
    exStock: "5 – 12 working days",
    made: "6 – 12 weeks",
    notes: "Mill-run schedules apply for full-heat quantities and non-standard lengths.",
  },
  {
    scope: "Plates, sheets, coils and bars",
    exStock: "3 – 8 working days",
    made: "5 – 10 weeks",
    notes: "Cut-to-size and edge preparation add 2 – 4 working days.",
  },
  {
    scope: "Fabricated spools and cut-to-length piping components",
    exStock: "2 – 6 working days",
    made: "2 – 4 weeks",
    notes: "Bulk container loads are scheduled directly from the production line.",
  },
  {
    scope: "UPVC / CPVC / SWR piping systems",
    exStock: "2 – 5 working days",
    made: "2 – 4 weeks",
    notes: "Manufactured in-house at our sister concern Apex Polymer & Engineering; bulk loads scheduled to the production run.",
  },
  {
    scope: "Third-party inspection (TPI) and special NDT",
    exStock: "—",
    made: "+ 5 – 10 working days",
    notes: "Applies to Lloyds, BV, DNV, SGS, TUV witnessed release and PMI / IGC packages.",
  },
];

export interface RegionDesk {
  region: string;
  countries: string[];
  ports: string[];
  transit: string;
  desk: string;
  email: string;
  notes: string;
}

export const regionDesks: RegionDesk[] = [
  {
    region: "Middle East & GCC",
    countries: ["UAE", "Saudi Arabia", "Qatar", "Oman", "Kuwait", "Bahrain", "Iraq"],
    ports: ["Jebel Ali", "Dammam", "Hamad", "Sohar", "Shuwaikh", "Umm Qasr"],
    transit: "5 – 12 days by sea from Nhava Sheva; 1 – 2 days by air",
    desk: "Gulf projects desk",
    email: "export@trishulmetal.com",
    notes: "ARAMCO, ADNOC and QatarEnergy vendor documentation formats supported.",
  },
  {
    region: "Europe & UK",
    countries: ["Germany", "Netherlands", "Italy", "Spain", "United Kingdom", "Poland", "Norway"],
    ports: ["Rotterdam", "Antwerp", "Hamburg", "Genoa", "Felixstowe"],
    transit: "22 – 32 days by sea; 3 – 5 days by air",
    desk: "Europe desk",
    email: "export@trishulmetal.com",
    notes: "EN 10204 3.1 / 3.2 certificates, CE / PED 2014/68/EU compliance and EUR.1 where applicable.",
  },
  {
    region: "North America",
    countries: ["United States", "Canada", "Mexico"],
    ports: ["Houston", "New York", "Los Angeles", "Montreal", "Altamira"],
    transit: "28 – 40 days by sea; 4 – 6 days by air",
    desk: "Americas desk",
    email: "export@trishulmetal.com",
    notes: "ASTM / ASME marking, NACE MR0175 compliance and Section 232 documentation support.",
  },
  {
    region: "Africa",
    countries: ["Nigeria", "Egypt", "South Africa", "Algeria", "Kenya", "Tanzania"],
    ports: ["Lagos (Apapa)", "Alexandria", "Durban", "Mombasa", "Dar es Salaam"],
    transit: "18 – 30 days by sea",
    desk: "Africa desk",
    email: "export@trishulmetal.com",
    notes: "SONCAP, PVoC and pre-shipment inspection handled with our nominated agencies.",
  },
  {
    region: "South East Asia & Oceania",
    countries: ["Singapore", "Malaysia", "Indonesia", "Thailand", "Vietnam", "Australia", "New Zealand"],
    ports: ["Singapore", "Port Klang", "Tanjung Priok", "Laem Chabang", "Melbourne"],
    transit: "8 – 20 days by sea",
    desk: "APAC desk",
    email: "export@trishulmetal.com",
    notes: "AS/NZS and JIS equivalents quoted alongside ASME classes on request.",
  },
  {
    region: "India & SAARC",
    countries: ["India", "Sri Lanka", "Bangladesh", "Nepal"],
    ports: ["Road / rail dispatch", "Colombo", "Chattogram"],
    transit: "1 – 5 days domestic; 4 – 8 days regional",
    desk: "Domestic sales desk",
    email: "export@trishulmetal.com",
    notes: "GST-compliant invoicing, e-way bills and site delivery across all Indian states.",
  },
];

export const procurementSteps: { step: string; title: string; body: string }[] = [
  {
    step: "01",
    title: "Enquiry and technical review",
    body: "Your RFQ is screened against the governing standard — grade, class, facing, schedule, NACE, impact testing and heat treatment are confirmed before pricing so deviations surface at RFQ stage, not at inspection.",
  },
  {
    step: "02",
    title: "Offer with landed cost",
    body: "You receive item-wise pricing, weight, HS code, packing details, the proposed Incoterm and a firm delivery window, together with the documentation and testing scope covered by the price.",
  },
  {
    step: "03",
    title: "Order confirmation and MPS",
    body: "On PO release we issue an order acknowledgement and, where required, a Manufacturing and Inspection Test Plan for approval before material is drawn or forging begins.",
  },
  {
    step: "04",
    title: "Manufacture and inspection",
    body: "Material is traced by heat number through forming, machining, heat treatment and testing. Third-party inspection is coordinated at agreed hold and witness points.",
  },
  {
    step: "05",
    title: "Documentation and release",
    body: "EN 10204 3.1 or 3.2 mill test certificates, PMI, hardness, IGC, hydro and NDT reports plus dimensional records are compiled into a single release dossier.",
  },
  {
    step: "06",
    title: "Packing, export and delivery",
    body: "Seaworthy plywood cases or pallets with corrosion protection, heat-treated ISPM-15 wood, bar-coded marking, then dispatch under the agreed Incoterm with full shipping document set.",
  },
];

export const paymentTerms: string[] = [
  "Telegraphic transfer — advance or against scanned shipping documents",
  "Irrevocable Letter of Credit at sight, confirmed through a first-class bank",
  "Documents against Payment (D/P) for established buyers",
  "Open credit for approved EPC and repeat accounts, subject to review",
];

export const packingScope: string[] = [
  "Seaworthy plywood cases with ISPM-15 heat treatment stamp",
  "VCI wrapping and rust preventive on carbon steel items",
  "Face protectors on flanges, end caps and bevel guards on pipe",
  "Bar-coded, heat-number-wise marking and packing list per case",
  "Container stuffing photographs shared before sealing",
];
