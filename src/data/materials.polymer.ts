import type { Material } from "./types";

/**
 * Rigid polymer piping grades supplied alongside the metal catalogue and
 * manufactured in-house by our sister concern Apex Polymer & Engineering.
 */
export const polymerMaterials: Material[] = [
  {
    slug: "upvc",
    name: "UPVC (PVC-U) Piping",
    uns: "—",
    family: "polymer",
    tagline: "Unplasticised PVC for cold water pressure, irrigation and borewell duty",
    summary:
      "Rigid unplasticised polyvinyl chloride compound used for pressure pipe to IS 4985, borewell column pipe to IS 12818 and the matching moulded fitting range.",
    overview: [
      "UPVC contains no plasticiser, which is what gives it the stiffness and pressure capability that flexible PVC lacks. The compound is lead-free and potable-water grade, stabilised for long-term hydrostatic strength with a design stress derived from the 50-year regression curve.",
      "It is the default material for buried and exposed cold-water mains, irrigation networks and plumbing distribution up to about 45 °C. Above that the pressure rating derates quickly and CPVC is the correct selection.",
      "Pipe, column pipe and fittings are manufactured in-house by our sister concern Apex Polymer & Engineering, so compound, batch records and moulds sit under one quality system.",
    ],
    composition: [
      { element: "PVC resin", percent: "Base polymer, suspension grade" },
      { element: "Stabiliser", percent: "Lead-free Ca/Zn system" },
      { element: "Processing aid", percent: "As per compound formulation" },
      { element: "Lubricant / filler", percent: "As per compound formulation" },
      { element: "Plasticiser", percent: "None (unplasticised)" },
    ],
    mechanical: [
      { label: "Tensile strength", value: "≥ 45 MPa at 27 °C" },
      { label: "Design hoop stress", value: "10 MPa (50-year basis)" },
      { label: "Modulus of elasticity", value: "≈ 3000 MPa" },
      { label: "Vicat softening point", value: "≥ 80 °C" },
    ],
    physical: [
      { label: "Density", value: "1.42 g/cm³" },
      { label: "Thermal expansion", value: "80 µm/m·K" },
      { label: "Thermal conductivity", value: "0.16 W/m·K" },
      { label: "Hazen-Williams C", value: "150 (retained over service life)" },
    ],
    corrosion: [
      "Immune to galvanic corrosion, rusting, scaling and tuberculation.",
      "Resistant to most dilute acids, alkalis and salt solutions at ambient temperature.",
      "Attacked by ketones, esters, aromatic and chlorinated hydrocarbons — check the chemical resistance table.",
      "Requires UV protection (paint, lagging or burial) for permanent outdoor exposure.",
    ],
    features: [
      "Pressure classes 2.5 to 12.5 kgf/cm² to IS 4985",
      "Roughly one fifth the handling weight of steel pipe",
      "Solvent-welded joints need no gaskets or hot work",
      "Load-bearing threaded column pipe variant to IS 12818",
    ],
    applications: [
      "Potable cold water mains and plumbing distribution",
      "Agricultural and landscape irrigation",
      "Submersible pump risers in borewells",
      "Industrial water, effluent and dosing lines",
    ],
    standards: {
      flanges: ["Flange adaptors and tank connectors to the pipe system supplied"],
      fittings: ["IS 7834 (injection moulded UPVC fittings)", "ASTM D2466 / D2467 (SCH 40 / 80)"],
      other: ["IS 4985 (pressure pipe)", "IS 12818 (borewell column pipe)", "ASTM D1785", "EN 1452 PVC-U"],
    },
    comparison: [
      { vs: "CPVC", note: "CPVC handles 82 °C continuous hot water; UPVC is limited to cold service to about 45 °C." },
      { vs: "Galvanised iron", note: "UPVC does not corrode, scale or add iron to the water, and holds its flow capacity over the service life." },
      { vs: "SWR PVC-U", note: "SWR is a non-pressure gravity drainage system; UPVC pressure pipe carries a working pressure class." },
    ],
    faqs: [
      {
        q: "Is UPVC pipe safe for drinking water?",
        a: "Yes, when supplied in lead-free potable-water grade compound to IS 4985. State potable duty on the enquiry so the correct compound and certification are supplied.",
      },
      {
        q: "How long does UPVC pressure pipe last?",
        a: "The pressure class is derived from a 50-year hydrostatic design basis at 27 °C, provided the pipe is protected from UV and operated within its rated pressure and temperature.",
      },
    ],
    maxTemp: "45 °C (pressure rating derates with temperature)",
  },
  {
    slug: "cpvc",
    name: "CPVC (PVC-C) Piping",
    uns: "—",
    family: "polymer",
    tagline: "Chlorinated PVC for hot and cold potable water at 82 °C continuous",
    summary:
      "Post-chlorinated PVC compound used for CTS SDR 11 plumbing pipe to ASTM D2846 and SCH 40 / 80 industrial pipe to ASTM F441, with matched moulded fittings.",
    overview: [
      "Chlorinating the PVC backbone raises the chlorine content to around 63 – 69 % and lifts the glass transition temperature, giving continuous service at 82 °C where UPVC would soften. That single property is why CPVC has replaced copper and galvanised iron in hot-water plumbing risers.",
      "Two dimensional systems are in use — CTS SDR 11 sized to copper tube size for plumbing, and SCH 40 / 80 to ASTM F441 for industrial and chemical duty. They share the material but not the dimensions, cements or fittings.",
      "Pipe and fittings are manufactured in-house by our sister concern Apex Polymer & Engineering.",
    ],
    composition: [
      { element: "Chlorinated PVC resin", percent: "63 – 69 % chlorine content" },
      { element: "Stabiliser", percent: "Heat stabiliser system" },
      { element: "Impact modifier", percent: "As per compound formulation" },
      { element: "Pigment", percent: "Light beige / grey to system" },
      { element: "Plasticiser", percent: "None" },
    ],
    mechanical: [
      { label: "Tensile strength", value: "≥ 50 MPa at 23 °C" },
      { label: "Pressure rating", value: "400 psi at 23 °C, 100 psi at 82 °C (SDR 11)" },
      { label: "Modulus of elasticity", value: "≈ 2900 MPa" },
      { label: "Vicat softening point", value: "≥ 110 °C" },
    ],
    physical: [
      { label: "Density", value: "1.55 g/cm³" },
      { label: "Thermal expansion", value: "62 µm/m·K" },
      { label: "Thermal conductivity", value: "0.14 W/m·K" },
      { label: "Limiting oxygen index", value: "≈ 60 (self-extinguishing)" },
    ],
    corrosion: [
      "Unaffected by chlorinated potable water, chloramine or free chlorine residual.",
      "Resistant to acids, alkalis and salt solutions across a wide concentration range.",
      "Not compatible with ketones, esters and aromatic solvents, or with some thread sealants and insulation adhesives.",
      "Requires UV protection for permanent outdoor exposure.",
    ],
    features: [
      "82 °C continuous, 93 °C intermittent service",
      "Low thermal conductivity reduces hot-water heat loss",
      "Self-extinguishing with a high limiting oxygen index",
      "Complete brass-insert transition range to metal fixtures",
    ],
    applications: [
      "Hot and cold potable water plumbing",
      "Solar water heating and geyser distribution loops",
      "Industrial chemical and dosing lines within temperature limits",
      "Listed fire sprinkler branch lines where specified",
    ],
    standards: {
      flanges: ["CPVC flange adaptors and brass-insert transitions to the system supplied"],
      fittings: ["ASTM F438 / F439 (CPVC fittings)", "ASTM D2846 (CTS system)"],
      other: ["ASTM F441 (SCH 40 / 80 pipe)", "IS 15778", "EN ISO 15877 PVC-C"],
    },
    comparison: [
      { vs: "UPVC", note: "UPVC is cold-water only; CPVC is rated for continuous hot water at 82 °C." },
      { vs: "Copper tube", note: "CPVC will not pit, scale or suffer erosion-corrosion in chlorinated water, and needs no hot work to install." },
      { vs: "PPR", note: "PPR is fusion welded and needs a heating tool; CPVC is solvent cemented with no power on site." },
    ],
    faqs: [
      {
        q: "Can CPVC be joined with ordinary PVC cement?",
        a: "No. CPVC needs a CPVC-specific one-step solvent cement. A PVC cement joint will fail once the line runs hot.",
      },
      {
        q: "Are CTS and SCH 80 CPVC interchangeable?",
        a: "No. They are different dimensional systems with different fittings. Specify which system the project uses on the enquiry.",
      },
    ],
    maxTemp: "82 °C continuous, 93 °C intermittent",
  },
  {
    slug: "swr-pvc",
    name: "SWR PVC-U Drainage",
    uns: "—",
    family: "polymer",
    tagline: "Non-pressure PVC-U for soil, waste and rainwater gravity drainage",
    summary:
      "PVC-U drainage grade to IS 13592, supplied in Type A ventilation and rainwater wall and Type B soil and waste wall with the full moulded SWR fitting range.",
    overview: [
      "SWR pipe is a gravity drainage material, so its wall thickness is governed by ring stiffness and impact resistance rather than a pressure class. Type A serves ventilation and rainwater duty, Type B the heavier soil and waste discharge duty.",
      "The bore stays smooth in service, which keeps solids moving and prevents the deposition that builds up in cast iron stacks. Ring-seal sockets are used on tall stacks so thermal movement is absorbed at the joint rather than loading the brackets.",
      "Pipe and fittings are manufactured in-house by our sister concern Apex Polymer & Engineering.",
    ],
    composition: [
      { element: "PVC resin", percent: "Base polymer, drainage grade" },
      { element: "Stabiliser", percent: "Lead-free Ca/Zn system" },
      { element: "Filler", percent: "As per compound formulation" },
      { element: "Pigment", percent: "Grey / white to system" },
      { element: "Plasticiser", percent: "None (unplasticised)" },
    ],
    mechanical: [
      { label: "Tensile strength", value: "≥ 40 MPa at 27 °C" },
      { label: "Impact resistance", value: "Per IS 13592 falling-weight test" },
      { label: "Ring stiffness", value: "Per type and wall thickness" },
      { label: "Vicat softening point", value: "≥ 78 °C" },
    ],
    physical: [
      { label: "Density", value: "1.42 g/cm³" },
      { label: "Thermal expansion", value: "80 µm/m·K" },
      { label: "Thermal conductivity", value: "0.16 W/m·K" },
      { label: "Service", value: "Gravity flow, non-pressure" },
    ],
    corrosion: [
      "Unaffected by domestic effluent, detergents and household chemicals.",
      "No rusting, rotting or scaling in continuously wet service.",
      "Attacked by aromatic and chlorinated solvents in concentrated discharge.",
      "UV protection required where stacks are permanently exposed.",
    ],
    features: [
      "Type A and Type B walls to IS 13592",
      "Solvent cement or ring-seal jointing",
      "Complete range of bends, junctions, traps and cowls",
      "Quiet, light and quick to install compared with cast iron",
    ],
    applications: [
      "Soil and waste stacks in buildings",
      "Ventilation and anti-siphonage pipework",
      "Rainwater downtakes and terrace drainage",
      "External drainage and plumbing renovation",
    ],
    standards: {
      flanges: ["Not applicable — gravity drainage system"],
      fittings: ["IS 14735 (PVC-U injection moulded SWR fittings)"],
      other: ["IS 13592 Type A / Type B", "IS 12235 methods of test", "EN 1329 PVC-U"],
    },
    comparison: [
      { vs: "UPVC pressure pipe", note: "SWR has no pressure rating; pressure duty must use IS 4985 pipe." },
      { vs: "Cast iron drainage", note: "SWR is far lighter and will not rust, though cast iron is chosen where acoustic performance or fire rating governs." },
      { vs: "Type A vs Type B", note: "Type A is the lighter ventilation and rainwater wall; Type B is the heavier soil and waste wall." },
    ],
    faqs: [
      {
        q: "Which type should be used for a soil stack?",
        a: "Type B. Type A is limited to ventilation and rainwater duty.",
      },
      {
        q: "Should stacks be solvent welded or ring sealed?",
        a: "Ring-seal sockets are preferred on tall vertical stacks so thermal movement is taken at the joint; branches are usually solvent welded.",
      },
    ],
    maxTemp: "60 °C intermittent discharge (non-pressure)",
  },
];
