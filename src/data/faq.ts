export type FaqCategory = "compliance" | "quality" | "logistics" | "commercial";

export interface FaqEntry {
  q: string;
  a: string;
  category: FaqCategory;
}

export const faqCategoryMeta: Record<FaqCategory, { name: string; blurb: string }> = {
  compliance: {
    name: "Material compliance",
    blurb: "Grade equivalence, standards, traceability and specification conformity.",
  },
  quality: {
    name: "Quality & testing",
    blurb: "Certification types, destructive and non-destructive testing, and third-party inspection.",
  },
  logistics: {
    name: "Logistics & packaging",
    blurb: "Export packing, Incoterms, lead times, documentation and shipment tracking.",
  },
  commercial: {
    name: "Commercial & RFQ workflow",
    blurb: "How enquiries are priced, ordered, inspected and released.",
  },
};

export const faqMatrix: FaqEntry[] = [
  // Material compliance
  {
    category: "compliance",
    q: "How do I confirm the grade I specified is exactly what will be supplied?",
    a: "Every offer states the UNS number, the ASTM/ASME product specification and the dimensional standard together. At order stage the material is reserved against a specific heat, and the heat number is quoted on the order acknowledgement, on the mill test certificate and hard-stamped on the item, so the specified grade, the certified grade and the marked grade are one and the same.",
  },
  {
    category: "compliance",
    q: "Are ASTM, EN/DIN, JIS and UNS designations interchangeable?",
    a: "They are equivalent in chemistry but not identical in acceptance criteria. UNS S31803 and 1.4462 describe the same duplex chemistry, yet the EN specification applies a different impact and ferrite acceptance regime than ASTM A182. We supply against the standard named in your purchase order, and list the cross-reference on the certificate so both engineering and inspection can trace it.",
  },
  {
    category: "compliance",
    q: "Can you supply NACE MR0175 / ISO 15156 compliant material for sour service?",
    a: "Yes. Sour service items are ordered with the hardness cap, heat treatment condition and, where applicable, ferrite range required by MR0175. Hardness surveys are performed on each heat/heat-treat lot and reported on the MTC, together with the solution-annealing record.",
  },
  {
    category: "compliance",
    q: "What is the difference between dual-certified 316/316L and single-grade material?",
    a: "Dual-certified material meets the low carbon limit of 316L and the higher tensile and yield of 316 simultaneously. It is acceptable wherever either grade is called for, and is usually preferred for welded fabrication because sensitisation risk is reduced without losing the design allowable of the higher grade.",
  },
  {
    category: "compliance",
    q: "Do you supply against client and EPC project specifications, not just ASTM?",
    a: "Yes. Project specifications from Shell, Saudi Aramco, ADNOC, NORSOK M-630 and similar regimes are reviewed line by line at RFQ stage. Any clause we cannot meet is raised as a written deviation before the order is placed rather than discovered at inspection.",
  },
  // Quality and testing
  {
    category: "quality",
    q: "What certification is supplied as standard?",
    a: "EN 10204:2004 Type 3.1 mill test certificates are the default, issued by the manufacturer's authorised inspection representative and traceable to the melt. Type 3.2 certification counter-signed by an independent inspection body is available on request and is priced at RFQ stage.",
  },
  {
    category: "quality",
    q: "Can I verify a heat number before accepting the consignment?",
    a: "Yes. The heat number appears on the certificate, on the packing list and hard-stamped or paint-marked on the item. Our batch verification utility lets you check a heat reference against the issuing record, and the full certificate set is archived in the client portal for the life of the project.",
  },
  {
    category: "quality",
    q: "Is Positive Material Identification carried out, and at what coverage?",
    a: "PMI is performed by portable XRF or OES on 100 % of items for nickel alloy, duplex and super duplex supply, and on a sampling basis for austenitic stainless unless the order requires full coverage. The PMI report lists the item marking, the elements measured and the accept/reject result against the UNS limits.",
  },
  {
    category: "quality",
    q: "Which tests can be witnessed by a third-party inspector?",
    a: "Chemical analysis, tensile and impact testing, hardness, ferrite count, intergranular corrosion (ASTM A262), pitting corrosion (ASTM G48), hydrostatic testing, dimensional inspection and final visual/marking review can all be witnessed. SGS, Bureau Veritas, Intertek, TUV, DNV and Lloyd's are routinely coordinated.",
  },
  {
    category: "quality",
    q: "What non-destructive examination is available?",
    a: "Dye penetrant, ultrasonic thickness and flaw detection, radiography for welded items and eddy current for tubing. The NDE scope, acceptance standard and reporting format are agreed at order stage and issued as part of the dispatch dossier.",
  },
  {
    category: "quality",
    q: "How do you handle material that fails an acceptance criterion?",
    a: "The item is quarantined and either replaced from an alternative heat or re-offered with a documented concession that the client must approve in writing. Nothing is released against a failed result, and no substitution is made after certificate issue.",
  },
  // Logistics and packaging
  {
    category: "logistics",
    q: "How is export material packed?",
    a: "Items are packed in ISPM-15 compliant fumigated wooden cases or crates, with VCI wrapping, plastic end caps on machined faces and bores, moisture absorbers for sea freight, and strapping to prevent movement. Marking includes the purchase order, item number, heat number, net and gross weight and destination.",
  },
  {
    category: "logistics",
    q: "Which Incoterms do you trade on?",
    a: "EXW, FOB Nhava Sheva or Mundra, CFR, CIF and DDP. Our landed-cost estimator gives an indicative build-up including freight, insurance, duty and clearance for your destination port and currency before the formal quotation is issued.",
  },
  {
    category: "logistics",
    q: "What are typical lead times?",
    a: "Stock items dispatch within three to seven working days of order confirmation. Made-to-order forgings and fittings typically run four to eight weeks depending on grade, size and test scope; heavy super duplex and nickel alloy sections can run longer where melt availability governs.",
  },
  {
    category: "logistics",
    q: "Which shipping documents are provided?",
    a: "Commercial invoice, packing list with heat-wise breakdown, certificate of origin, the complete MTC set, TPI release note where applicable, fumigation certificate and the bill of lading or air waybill. Draft documents are sent for approval before originals are couriered.",
  },
  {
    category: "logistics",
    q: "Can I track the shipment after dispatch?",
    a: "Yes. Container number, vessel, bill of lading and ETA are posted to the client portal, and the dossier for that order — certificates, inspection reports and packing list — sits alongside the tracking record.",
  },
  // Commercial and RFQ workflow
  {
    category: "commercial",
    q: "What information makes an RFQ quotable on the first pass?",
    a: "Grade and UNS, product form, size range with schedule or thickness, pressure class and facing, the governing standards, quantity, test and certification scope, destination port and required delivery. A material take-off spreadsheet or drawing set uploaded with the enquiry removes almost all clarification cycles.",
  },
  {
    category: "commercial",
    q: "Which file formats can I attach to an enquiry?",
    a: "Excel and CSV material take-off sheets, PDF drawings and specifications, DWG and DXF CAD files, and STEP models. Multiple files can be dropped in one submission and each is acknowledged with a reference on the confirmation screen.",
  },
  {
    category: "commercial",
    q: "How quickly is a quotation issued?",
    a: "Stock-backed enquiries are answered the same working day. Made-to-order and multi-line project take-offs are answered within 24 to 48 hours, and complex packages requiring mill enquiries within three working days with an interim acknowledgement.",
  },
  {
    category: "commercial",
    q: "Do you supply non-standard and drawing-based components?",
    a: "Yes. Special bores, thickness transitions, non-standard facings, long weld necks, orifice sets and customer-drawing forgings are produced through approved forging and machining partners, with first-article dimensional reporting where the drawing requires it.",
  },
  {
    category: "commercial",
    q: "What are your payment and order terms?",
    a: "Export orders are typically on advance telegraphic transfer or an irrevocable letter of credit at sight against shipping documents. Terms, part-shipment and inspection release conditions are confirmed in the proforma invoice before production starts.",
  },
  {
    category: "commercial",
    q: "Does sourcing from Trishul help us diversify our supplier base beyond a single country?",
    a: "Many buyers are diversifying sourcing as part of standard supply-chain risk management. Trade-remedy measures and duty treatment vary by product, grade, and destination market, and change through periodic government review — we'd always recommend confirming current classification with your customs or trade compliance team for your specific specification. What we can offer directly: heat-traceable EN 10204 documentation, third-party witnessed inspection available for every consignment when specified, a sample MTC before you order, and sub-6-hour RFQ turnaround — across our full range of CRA and supporting grades.",
  },
];

export const faqsByCategory = (c: FaqCategory) => faqMatrix.filter((f) => f.category === c);

export const faqCategories: FaqCategory[] = ["compliance", "quality", "logistics", "commercial"];
