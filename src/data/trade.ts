/**
 * International Trade Desk Data
 * Covers HS code mappings, tariff structures, 2026 trade measures, and destination documentation requirements.
 * Reviewed monthly by Trishul Metals & Alloys Export Desk.
 */

export const TRADE_REVIEWED_ON = "17 November 2026";

export interface KeyTradeDate {
  date: string;
  measure: string;
  impact: string;
}

export const upcomingTradeDates: KeyTradeDate[] = [
  {
    date: "1 January 2027",
    measure: "UK CBAM Entry into Force",
    impact: "Carbon import levy on steel and aluminium products imported into the United Kingdom.",
  },
  {
    date: "1 February 2027",
    measure: "EU CBAM Certificate Sales",
    impact: "First mandatory purchase of EU CBAM certificates by authorized declarants for embedded emissions.",
  },
  {
    date: "Q1 2027 (Expected)",
    measure: "Suez Canal Commercial Return",
    impact: "Projected reopening of full-capacity Red Sea commercial transit, reducing Europe/East Coast transit by 12–15 days.",
  },
];

export interface HsCodeMapping {
  product: string;
  materialFamily: string;
  hsCode: string;
  description: string;
  sampleSpecs: string;
}

export const hsCodeDirectory: HsCodeMapping[] = [
  {
    product: "Flanges",
    materialFamily: "Stainless Steel (Austenitic & Duplex)",
    hsCode: "7307.21",
    description: "Flanges of stainless steel (weld neck, slip-on, blind, socket weld)",
    sampleSpecs: "ASTM A182 F304L, F316L, F51 (2205), F53 (2507)",
  },
  {
    product: "Flanges",
    materialFamily: "Nickel & High Nickel Alloys",
    hsCode: "7507.20",
    description: "Flanges and pipe fittings of nickel and nickel alloys",
    sampleSpecs: "ASTM B564 Inconel 625, Incoloy 825, Hastelloy C276, Monel 400",
  },
  {
    product: "Flanges",
    materialFamily: "Carbon & Low Temperature Steel",
    hsCode: "7307.91",
    description: "Flanges of iron or non-alloy steel / low-temperature alloy",
    sampleSpecs: "ASTM A105N, A350 LF2 Class 1",
  },
  {
    product: "Buttweld Fittings",
    materialFamily: "Stainless Steel (Austenitic & Duplex)",
    hsCode: "7307.22",
    description: "Threaded and buttweld elbows, bends, tees and sleeves of stainless steel",
    sampleSpecs: "ASTM A403 WP304L, WP316L; ASTM A815 WPS31803, WPS32750",
  },
  {
    product: "Buttweld Fittings",
    materialFamily: "Nickel & High Nickel Alloys",
    hsCode: "7508.90",
    description: "Other articles of nickel (fittings, reducers, stubs, tees)",
    sampleSpecs: "ASTM B366 WP625, WP825, WPC276",
  },
  {
    product: "Buttweld Fittings",
    materialFamily: "Carbon & Low Temperature Steel",
    hsCode: "7307.93",
    description: "Buttwelding fittings of iron or non-alloy steel",
    sampleSpecs: "ASTM A234 WPB, WPC; ASTM A420 WPL6",
  },
  {
    product: "Forged Fittings (Socket Weld & Threaded)",
    materialFamily: "Stainless Steel",
    hsCode: "7307.29",
    description: "Other tube or pipe fittings of stainless steel (Class 2000–9000)",
    sampleSpecs: "ASME B16.11 / ASTM A182 F316L, F304L, F51",
  },
  {
    product: "Seamless Pipes & Tubes",
    materialFamily: "Stainless Steel & Duplex",
    hsCode: "7304.41",
    description: "Tubes, pipes and hollow profiles, seamless, cold-drawn or cold-rolled of stainless steel",
    sampleSpecs: "ASTM A312 TP304L, TP316L; ASTM A790 UNS S31803 / S32750",
  },
  {
    product: "Seamless Pipes & Tubes",
    materialFamily: "Nickel Alloys",
    hsCode: "7507.11",
    description: "Tubes, pipes and hollow profiles of nickel not alloyed or nickel alloys",
    sampleSpecs: "ASTM B622 UNS N06625, N08825, N10276",
  },
  {
    product: "Welded Pipes",
    materialFamily: "Stainless Steel",
    hsCode: "7306.40",
    description: "Other tubes, pipes and hollow profiles, welded, of circular cross-section, of stainless steel",
    sampleSpecs: "ASTM A312, A358 Class 1/2, A928 (duplex)",
  },
  {
    product: "Structural Steel Sections",
    materialFamily: "Carbon & High-Strength Structural",
    hsCode: "7216.31",
    description: "U, I or H sections, of iron or non-alloy steel, not further worked than hot-rolled",
    sampleSpecs: "IS 2062 E250/E350, EN 10025 S275/S355, ASTM A36, A572 Gr 50",
  },
  {
    product: "Structural Hollow Sections",
    materialFamily: "Structural Carbon Steel",
    hsCode: "7306.61",
    description: "Tubes and hollow profiles of square or rectangular cross-section",
    sampleSpecs: "ASTM A500 Grade B/C, EN 10210 S355NH, EN 10219 S355J2H",
  },
];

export interface CountryTradeProfile {
  country: string;
  region: string;
  valuationBasis: "FOB" | "CIF";
  baseDutyRate: string;
  tradeMeasures: string[];
  ftaStatus: string;
  requiredDocuments: string[];
  notes: string;
}

export const countryTradeProfiles: Record<string, CountryTradeProfile> = {
  US: {
    country: "United States",
    region: "Americas",
    valuationBasis: "FOB",
    baseDutyRate: "0.0% – 3.2% MFN",
    tradeMeasures: [
      "Section 232 Tariff: 50% ad valorem on steel pipe, fittings and flanges (HTS 7304, 7306, 7307) originating in India.",
      "Section 301 Tariff: 10% on designated Indian industrial tariff subheadings where applicable.",
      "Country of Melt and Pour Declaration mandatory on all import entries.",
    ],
    ftaStatus: "No bilateral FTA; MFN tariffs and Section 232 / 301 measures apply.",
    requiredDocuments: [
      "Commercial Invoice stating Country of Origin and Melt/Pour source",
      "Packing List with Net/Gross weights and piece counts",
      "Bill of Lading (Clean on Board)",
      "Mill Test Certificate (EN 10204 3.1) with heat-traceable heat numbers",
      "US Customs Entry Summary (CBP Form 7501)",
      "Section 232 Steel Mill Statement",
    ],
    notes: "Duty is levied on transaction value ex-works / FOB Indian port. Marine freight and insurance are excluded from duty calculation.",
  },
  EU: {
    country: "European Union",
    region: "Europe",
    valuationBasis: "CIF",
    baseDutyRate: "2.7% (Flanges & Fittings), 0%–3.0% (Pipes)",
    tradeMeasures: [
      "EU CBAM (Carbon Border Adjustment Mechanism): Importers must report direct and indirect embedded emissions quarterly (transitional phase).",
      "Steel Safeguard Quotas: Autonomous tariff-rate quotas (TRQ) apply on certain product categories; out-of-quota duty is 25%.",
      "PED 2014/68/EU compliance mandatory for pressure equipment components.",
    ],
    ftaStatus: "Standard GSP/MFN basis. Ongoing EU-India FTA negotiations.",
    requiredDocuments: [
      "Commercial Invoice with REX number / Exporter Declaration",
      "Packing List (ISPM-15 compliant wood packaging certified)",
      "Sea Waybill / Bill of Lading",
      "EN 10204 3.1 or 3.2 Mill Test Certificate",
      "PED 2014/68/EU Annex I Section 4.3 Material Manufacturer Certificate",
      "CBAM Embedded Emissions Data Sheet (specific carbon intensity)",
    ],
    notes: "Duty is assessed on CIF European port value (cost + insurance + ocean freight).",
  },
  UK: {
    country: "United Kingdom",
    region: "Europe",
    valuationBasis: "CIF",
    baseDutyRate: "2.0% (Flanges & Fittings), 0%–2.5% (Tubes)",
    tradeMeasures: [
      "UK Steel Safeguard measures apply on specific categories.",
      "UK CBAM: Scheduled to take effect on 1 January 2027.",
      "UK PER (Pressure Equipment Regulations) compliance required for pressurized service.",
    ],
    ftaStatus: "Developing Countries Trading Scheme (DCTS) / UK Global Tariff.",
    requiredDocuments: [
      "Commercial Invoice",
      "Packing List",
      "Bill of Lading",
      "EN 10204 3.1 Inspection Certificate",
      "UK PER conformity declaration where required",
    ],
    notes: "Assessed on CIF UK port value.",
  },
  Canada: {
    country: "Canada",
    region: "Americas",
    valuationBasis: "FOB",
    baseDutyRate: "0.0% (Most CRA piping lines)",
    tradeMeasures: [
      "Special Import Measures Act (SIMA) review on specific structural carbon steel categories.",
      "CRN (Canadian Registration Number) compliance required for fittings/flanges in Canadian provincial pressure jurisdictions.",
    ],
    ftaStatus: "MFN rate applies (mostly duty-free for specialized alloy pipe and fittings).",
    requiredDocuments: [
      "Canada Customs Invoice (CCI) or commercial invoice with mandatory data fields",
      "Packing List",
      "Bill of Lading",
      "EN 10204 3.1 Mill Test Certificate",
      "CRN statutory declaration where provincial registration is specified",
    ],
    notes: "Duty evaluated on FOB port of export value.",
  },
  GCC: {
    country: "GCC (UAE, Saudi Arabia, Qatar, Oman, Kuwait, Bahrain)",
    region: "Middle East",
    valuationBasis: "CIF",
    baseDutyRate: "5.0% Unified GCC Tariff",
    tradeMeasures: [
      "Saudi Arabia SABER Platform: SASO conformity certificate mandatory for customs release.",
      "ARAMCO, ADNOC, and QatarEnergy approved vendor lists apply for project allocations.",
      "Chemical and mechanical test results must be verifiable against mill records.",
    ],
    ftaStatus: "Unified Customs Tariff of the GCC States.",
    requiredDocuments: [
      "Commercial Invoice (chamber of commerce legalized where required)",
      "Certificate of Origin attested by Chamber of Commerce",
      "Clean Bill of Lading",
      "Packing List with detailed case-wise breakdown",
      "EN 10204 3.1 / 3.2 Mill Test Certificates with TPI stamp",
      "SABER Certificate of Conformity (for Saudi Arabian consignments)",
    ],
    notes: "Standard 5% duty calculated on CIF destination port value.",
  },
  Singapore: {
    country: "Singapore",
    region: "Asia Pacific",
    valuationBasis: "CIF",
    baseDutyRate: "0.0% (Customs Duty)",
    tradeMeasures: [
      "Goods and Services Tax (GST) of 9% payable upon import.",
      "Strategic Goods Control applies to high-nickel dual-use corrosion resistant alloys.",
    ],
    ftaStatus: "India-Singapore CECA (Comprehensive Economic Cooperation Agreement): Duty-free.",
    requiredDocuments: [
      "Commercial Invoice with CECA Origin Statement",
      "Packing List",
      "Bill of Lading",
      "EN 10204 3.1 MTC",
      "TradeNet inward permit copy",
    ],
    notes: "Free port: no customs duty; 9% GST assessed on CIF value + inward transport.",
  },
  Malaysia: {
    country: "Malaysia",
    region: "Asia Pacific",
    valuationBasis: "CIF",
    baseDutyRate: "0.0% under AIFTA (otherwise 5%–15%)",
    tradeMeasures: [
      "Preferential 0% duty applies when accompanied by AIFTA Form AI (ASEAN-India Free Trade Area).",
      "SIRIM certification required on selected building and structural steel items.",
    ],
    ftaStatus: "ASEAN-India FTA (AIFTA) Form AI eligible.",
    requiredDocuments: [
      "Preferential Certificate of Origin Form AI",
      "Commercial Invoice",
      "Packing List",
      "Bill of Lading",
      "EN 10204 3.1 MTC",
    ],
    notes: "Form AI ensures zero customs duty at Port Klang / Pasir Gudang.",
  },
  Australia: {
    country: "Australia",
    region: "Asia Pacific",
    valuationBasis: "FOB",
    baseDutyRate: "0.0% under ECTA (otherwise 5%)",
    tradeMeasures: [
      "India-Australia ECTA (Economic Cooperation and Trade Agreement) provides 0% tariff on over 90% of steel and engineering goods.",
      "Biosecurity / DAFF timber packaging requirements: ISPM-15 treatment mandatory with treatment certificate.",
    ],
    ftaStatus: "India-Australia ECTA preferential origin status.",
    requiredDocuments: [
      "ECTA Certificate of Origin issued by authorized agency in India",
      "Commercial Invoice",
      "Packing List with case dimensions and weights",
      "Bill of Lading",
      "ISPM-15 Timber Packaging Treatment Certificate",
      "EN 10204 3.1 MTC",
    ],
    notes: "Valuation basis is FOB. Zero duty under ECTA; 10% Goods and Services Tax (GST) payable.",
  },
  Nigeria: {
    country: "Nigeria",
    region: "Africa",
    valuationBasis: "CIF",
    baseDutyRate: "10.0% (Base duty) + 7.5% VAT + port surcharges",
    tradeMeasures: [
      "SONCAP (Standards Organisation of Nigeria Conformity Assessment Programme) mandatory.",
      "Form M and pre-shipment Clean Report of Inspection (CRI) required.",
    ],
    ftaStatus: "ECOWAS Common External Tariff (CET).",
    requiredDocuments: [
      "Combined Certificate of Value and Origin (CCVO)",
      "SONCAP Certificate (Product Certificate + SONCAP Certificate)",
      "Form M approval number on shipping documents",
      "Commercial Invoice",
      "Bill of Lading",
      "EN 10204 3.1 MTC",
    ],
    notes: "Evaluated on CIF Lagos/Onne port value.",
  },
  SouthAfrica: {
    country: "South Africa",
    region: "Africa",
    valuationBasis: "CIF",
    baseDutyRate: "5.0% (General MFN)",
    tradeMeasures: [
      "South African Revenue Service (SARS) Customs compliance.",
      "National Regulator for Compulsory Specifications (NRCS) where applicable.",
    ],
    ftaStatus: "SACU (Southern African Customs Union) tariff schedule.",
    requiredDocuments: [
      "Customs Declaration (SAD 500)",
      "Commercial Invoice",
      "Packing List",
      "Bill of Lading",
      "EN 10204 3.1 MTC",
    ],
    notes: "Assessed on CIF Durban / Cape Town value.",
  },
  Egypt: {
    country: "Egypt",
    region: "Africa",
    valuationBasis: "CIF",
    baseDutyRate: "10.0% + 14% VAT",
    tradeMeasures: [
      "ACI (Advanced Cargo Information) System: Mandatory ACID number (19-digit number) issued via Nafeza portal must be stated on all shipping documents.",
      "Cargo without valid ACID number is turned back by Egyptian Customs without unloading.",
    ],
    ftaStatus: "Standard Egyptian Customs Tariff.",
    requiredDocuments: [
      "Commercial Invoice with ACID number clearly printed",
      "Bill of Lading with ACID number in cargo description",
      "Certificate of Origin attested by Chamber of Commerce and Egyptian Embassy",
      "Packing List",
      "EN 10204 3.1 MTC",
    ],
    notes: "Registration on CargoX and Nafeza is mandatory prior to vessel departure.",
  },
};
