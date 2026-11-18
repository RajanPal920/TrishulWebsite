/**
 * Redacted specimen documents shown in the Quality & Documentation Dossier.
 * Commercial identifiers are withheld; technical results mirror a real release.
 */

export interface SpecimenRow {
  label: string;
  value: string | null;
  redactWidth?: number;
}

export const pmiSpecimen = {
  reportNo: "TMA/PMI/24-0118",
  heat: "H-22053P",
  method: "Portable XRF (alloy analyser), calibrated against certified reference standards",
  coverage: "100 % of items, one reading per piece on a cleaned surface",
  summary: [
    { label: "Client", value: null, redactWidth: 7 },
    { label: "Purchase order", value: null, redactWidth: 5 },
    { label: "Item", value: 'Seamless pipe, 6" SCH 40S, 36 lengths' },
    { label: "Declared grade", value: "UNS S31803 (Duplex 2205)" },
    { label: "Heat number", value: "H-22053P" },
    { label: "Instrument", value: "Handheld XRF, S/N withheld, calibration valid" },
    { label: "Inspected on", value: "Mumbai stockyard, ambient 31 °C" },
  ] as SpecimenRow[],
  readings: [
    ["Cr", "22.3", "21.0 – 23.0", "Pass"],
    ["Ni", "5.6", "4.5 – 6.5", "Pass"],
    ["Mo", "3.1", "2.5 – 3.5", "Pass"],
    ["Mn", "1.4", "≤ 2.00", "Pass"],
    ["Cu", "0.14", "≤ 0.50", "Pass"],
    ["Fe", "Balance", "Balance", "Pass"],
  ],
  declaration:
    "All items listed were analysed by positive material identification and the measured alloying content conforms to the declared UNS designation. No mixed or unidentified material was found in the lot.",
};

export const tpiSpecimen = {
  reportNo: "TMA/TPI/24-0092",
  agency: "Independent inspection agency (name withheld on specimen)",
  standard: "EN 10204:2004 Type 3.2 witness scope",
  summary: [
    { label: "Client", value: null, redactWidth: 7 },
    { label: "Purchase order", value: null, redactWidth: 5 },
    { label: "Inspection agency", value: null, redactWidth: 6 },
    { label: "Scope", value: 'Duplex 2205 seamless pipe, 6" SCH 40S' },
    { label: "Heat number", value: "H-22053P" },
    { label: "Inspection date", value: "Witnessed at works, Mumbai" },
    { label: "Release status", value: "Released for despatch" },
  ] as SpecimenRow[],
  activities: [
    ["Review of mill test certificate", "EN 10204 3.1 traceability", "Accepted"],
    ["Witness — tensile & impact", "ASTM A370 / A790", "Accepted"],
    ["Witness — pitting corrosion", "ASTM G48 Method A", "Accepted"],
    ["Ferrite measurement", "Ferritoscope, 6 locations", "48 % — Accepted"],
    ["Dimensional survey", "ASME B36.19M", "Accepted"],
    ["Marking & packing verification", "Client specification", "Accepted"],
  ],
  declaration:
    "The above activities were witnessed or reviewed by the undersigned inspector. The consignment is released for despatch subject to the documentation set accompanying the shipment.",
};

/** Seeded heat records for the batch verification utility. */
export interface HeatRecord {
  heat: string;
  grade: string;
  uns: string;
  form: string;
  spec: string;
  heatTreatment: string;
  issued: string;
  certNo: string;
  tpi: string;
  status: "released" | "reserved";
}

export const heatRecords: HeatRecord[] = [
  {
    heat: "H-22053P",
    grade: "Duplex 2205",
    uns: "S31803",
    form: '6" SCH 40S seamless pipe',
    spec: "ASTM A790 / ASME SA790",
    heatTreatment: "Solution annealed 1050 °C, water quenched",
    issued: "2024-11-14",
    certNo: "TMA/MTC/24-0533",
    tpi: "Type 3.2 witnessed",
    status: "released",
  },
  {
    heat: "H-62518N",
    grade: "Inconel 625",
    uns: "N06625",
    form: '4" Class 300 weld neck flange, RF',
    spec: "ASTM B564 / ASME B16.5",
    heatTreatment: "Solution annealed 1093 °C",
    issued: "2024-12-02",
    certNo: "TMA/MTC/24-0611",
    tpi: "Type 3.1",
    status: "released",
  },
  {
    heat: "H-31600L",
    grade: "Stainless 316L",
    uns: "S31603",
    form: '2" SCH 10S butt weld elbow 90°',
    spec: "ASTM A403 WP316L / ASME B16.9",
    heatTreatment: "Solution annealed 1040 °C",
    issued: "2025-01-21",
    certNo: "TMA/MTC/25-0044",
    tpi: "Type 3.1",
    status: "released",
  },
  {
    heat: "H-25074S",
    grade: "Super Duplex 2507",
    uns: "S32750",
    form: '3" Class 600 blind flange, RTJ',
    spec: "ASTM A182 F53 / ASME B16.5",
    heatTreatment: "Solution annealed 1080 °C, water quenched",
    issued: "2025-02-08",
    certNo: "TMA/MTC/25-0117",
    tpi: "Type 3.2 witnessed",
    status: "reserved",
  },
  {
    heat: "H-10504C",
    grade: "Carbon Steel A105",
    uns: "K03504",
    form: '8" Class 150 slip-on flange, RF',
    spec: "ASTM A105 / ASME B16.5",
    heatTreatment: "As forged, normalised",
    issued: "2025-03-19",
    certNo: "TMA/MTC/25-0208",
    tpi: "Type 3.1",
    status: "released",
  },
];

export const findHeat = (q: string): HeatRecord | undefined => {
  const term = q.trim().toUpperCase();
  if (!term) return undefined;
  return heatRecords.find((r) => r.heat.toUpperCase() === term || r.certNo.toUpperCase() === term);
};
