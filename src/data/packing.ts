/**
 * Export packing, preservation and marking standards, plus a redacted
 * specimen packing list used in the Quality & Documentation Dossier.
 */

export interface PackingSpec {
  label: string;
  detail: string;
}

export const packingSpecs: PackingSpec[] = [
  {
    label: "Case construction",
    detail:
      "Seaworthy plywood cases on skids, internally battened and cleated, sized so no single case exceeds the agreed handling weight. Heavy flange lots ship on strapped steel or hardwood pallets.",
  },
  {
    label: "ISPM-15 compliance",
    detail:
      "All solid wood packing material is heat treated and stamped with the IPPC mark, treatment code and registered debarking identifier, so consignments clear phytosanitary inspection without fumigation delays.",
  },
  {
    label: "Preservation",
    detail:
      "VCI film or oil-free anti-corrosion wrap for machined faces, plastic end caps on pipe and tube ends, and silica gel desiccant inside sealed cases for long ocean transit.",
  },
  {
    label: "Bundling & separation",
    detail:
      "Pipes and tubes bundled in hexagonal packs with steel strapping over edge protectors; carbon and stainless items are never packed together, and separators prevent iron contamination.",
  },
  {
    label: "Marking format",
    detail:
      "Each case is stencilled with order number, case number of total, grade and specification, heat number, NPS and schedule or class, net and gross weight, dimensions and destination port.",
  },
  {
    label: "Container stuffing",
    detail:
      "Lashed and dunnaged to CTU code, photographed before doors close. Stuffing photographs, packing list and weight certificate are shared with the buyer on the day of despatch.",
  },
];

export interface SpecimenLine {
  case_: string;
  description: string;
  heat: string;
  qty: string;
  net: string;
  gross: string;
}

export const packingSpecimen = {
  docNo: "TMA/PL/24-0311",
  incoterm: "CFR Jebel Ali (Incoterms 2020)",
  summary: [
    { label: "Consignee", value: null, redactWidth: 7 },
    { label: "Purchase order", value: null, redactWidth: 5 },
    { label: "Invoice reference", value: null, redactWidth: 5 },
    { label: "Port of loading", value: "Nhava Sheva (INNSA)" },
    { label: "Port of discharge", value: "Jebel Ali (AEJEA)" },
    { label: "Marks", value: "Stencilled: PO no. / case no. / grade / heat / NPS / net & gross kg" },
    { label: "Wood treatment", value: "ISPM-15 heat treated, IPPC stamped" },
  ] as { label: string; value: string | null; redactWidth?: number }[],
  lines: [
    {
      case_: "1 of 4",
      description: 'Duplex 2205 seamless pipe, 6" SCH 40S',
      heat: "H-22053P",
      qty: "36 lengths",
      net: "1,842 kg",
      gross: "1,996 kg",
    },
    {
      case_: "2 of 4",
      description: 'Duplex 2205 weld neck flange, 6" Class 300 RF',
      heat: "H-22053P",
      qty: "48 pcs",
      net: "1,104 kg",
      gross: "1,231 kg",
    },
    {
      case_: "3 of 4",
      description: 'Duplex 2205 butt weld elbow 90°, 6" SCH 40S',
      heat: "H-22071F",
      qty: "24 pcs",
      net: "386 kg",
      gross: "452 kg",
    },
    {
      case_: "4 of 4",
      description: "Gaskets, bolting and loose documentation pack",
      heat: "—",
      qty: "1 set",
      net: "78 kg",
      gross: "112 kg",
    },
  ] as SpecimenLine[],
  declaration:
    "Packed, marked and preserved in accordance with the buyer's packing specification and ISPM-15. Wood packaging is heat treated and IPPC stamped. Net and gross weights are verified on a calibrated platform scale before container stuffing.",
};
