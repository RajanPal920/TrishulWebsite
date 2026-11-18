import type { ProductType } from "./products.types";

/**
 * Rigid polymer piping line — UPVC pressure pipe, borewell column pipe, CPVC
 * hot-water pipe, SWR drainage and the moulded fitting range. Manufactured
 * in-house by our sister concern Apex Polymer & Engineering.
 */
const APEX =
  "This line is manufactured in-house by our sister concern Apex Polymer & Engineering, which gives us direct control of compound selection, moulds, batch records and production scheduling rather than buying through a trading channel.";

export const pvcProducts: ProductType[] = [
  {
    slug: "upvc-pressure-pipes",
    name: "UPVC Pressure Pipes",
    category: "pvc-piping",
    tagline: "Unplasticised PVC pressure pipe for water supply, irrigation and plumbing mains",
    summary:
      "Rigid PVC-U pressure pipe to IS 4985 in working pressure classes 2.5 to 12.5 kgf/cm², supplied plain-ended or with integral solvent-weld or elastomeric sealing ring sockets.",
    overview: [
      "UPVC pressure pipe is the standard choice for cold potable water distribution, agricultural irrigation, plumbing risers and buried service mains. It is corrosion-free, does not scale or tuberculate, and its smooth bore gives a Hazen-Williams C value that stays close to 150 over the service life, so friction losses do not climb the way they do in galvanised steel.",
      "Pipe is classified by working pressure at 27 °C — Class 1 (2.5 kgf/cm²) through Class 6 (12.5 kgf/cm²) under IS 4985 — or by schedule under ASTM D1785 for SCH 40 and SCH 80 supply. The pressure rating derates with temperature and UPVC is not suitable for hot water; CPVC is used above 45 °C.",
      APEX,
    ],
    specs: [
      { label: "Size range", value: "20 mm – 315 mm OD (½\" – 12\")" },
      { label: "Pressure classes", value: "Class 1 – 6 (2.5 – 12.5 kgf/cm² at 27 °C)" },
      { label: "Standard lengths", value: "3 m and 6 m, plain end or socketed" },
      { label: "Jointing", value: "Solvent cement, elastomeric sealing ring or threaded adaptor" },
      { label: "Material", value: "PVC-U compound, lead-free, potable water grade" },
    ],
    features: [
      "Corrosion-free — no scaling, tuberculation or galvanic attack",
      "Light handling weight, roughly one fifth of steel pipe",
      "Smooth bore holds low friction loss over the service life",
      "Solvent-welded joints are leak-tight and need no gaskets",
    ],
    applications: [
      "Potable cold water distribution and plumbing mains",
      "Agricultural and landscape irrigation networks",
      "Buried service connections and rising mains",
      "Industrial water, effluent and chemical dosing lines",
    ],
    standards: [
      "IS 4985 (UPVC pipes for potable water supplies)",
      "ASTM D1785 (SCH 40 / 80 rigid PVC pipe)",
      "IS 10124 / IS 12235 methods of test",
      "EN 1452 PVC-U on request",
    ],
    faqs: [
      {
        q: "Can UPVC pipe be used for hot water?",
        a: "No. UPVC is rated for cold water at up to about 45 °C and derates sharply with temperature. Use CPVC for hot-water distribution.",
      },
      {
        q: "How is the pressure class selected?",
        a: "From the design working pressure at operating temperature, plus surge allowance. State the design pressure, temperature and burial condition on the enquiry and we will confirm the class.",
      },
    ],
  },
  {
    slug: "borewell-column-pipes",
    name: "Borewell Column Pipes",
    category: "pvc-piping",
    tagline: "Threaded UPVC riser pipe for submersible pump installations",
    summary:
      "High-strength UPVC column pipe to IS 12818 with square or trapezoidal machined threads and a moulded coupler, rated by pull load for submersible pump risers.",
    overview: [
      "Column pipe carries the full hanging weight of the pump, the motor and the water column, so it is selected by safe pull load rather than pressure class alone. The machined square thread and coupler transfer that load without relying on the solvent joint, and the pipe is supplied with a rubber sealing ring at each joint.",
      "UPVC column pipe replaces galvanised iron riser in most borewell installations because it will not corrode, does not add iron to the water, and its lighter weight means shallower rigs and faster pump retrieval for maintenance.",
      APEX,
    ],
    specs: [
      { label: "Size range", value: "25 mm – 113 mm (1\" – 4\")" },
      { label: "Standard lengths", value: "3 m nominal per piece with coupler" },
      { label: "Thread", value: "Machined square / trapezoidal with sealing ring" },
      { label: "Safe pull load", value: "Rated per size and series to IS 12818" },
      { label: "Series", value: "Medium, heavy and extra-heavy duty" },
    ],
    features: [
      "Load-bearing machined threads, not solvent-dependent",
      "No corrosion, scaling or iron pick-up in the water",
      "Light enough for manual installation and retrieval",
      "Rubber sealing ring at every joint for leak-tight service",
    ],
    applications: [
      "Submersible pump risers in borewells and tubewells",
      "Agricultural and drinking-water bore installations",
      "Industrial and municipal water abstraction",
    ],
    standards: [
      "IS 12818 (UPVC screwed pipes and fittings for bore wells)",
      "IS 4985 base material requirements",
      "IS 12235 methods of test",
    ],
    faqs: [
      {
        q: "How is column pipe sized?",
        a: "By pump discharge, bore depth and the total hanging load. Give us the pump rating, setting depth and delivery size and we will confirm the size and duty series.",
      },
      {
        q: "Is column pipe the same as UPVC pressure pipe?",
        a: "No. Column pipe is a heavier-walled threaded product designed to carry axial pull load; pressure pipe is not rated for hanging duty.",
      },
    ],
  },
  {
    slug: "cpvc-pipes",
    name: "CPVC Pipes & Fittings",
    category: "pvc-piping",
    tagline: "Chlorinated PVC pipe for hot and cold potable water distribution",
    summary:
      "CPVC pipe and moulded fittings in SDR 11 and SDR 13.5 to ASTM D2846 and ASTM F441, rated for continuous service at 82 °C with the matching solvent cement system.",
    overview: [
      "CPVC is post-chlorinated PVC, which raises the glass transition temperature and allows continuous hot-water service at 82 °C — the reason it has displaced copper and galvanised iron in plumbing risers, hot-water distribution and solar water heating loops.",
      "Two dimensional systems are supplied. CTS SDR 11 to ASTM D2846 is sized to copper tube size for plumbing, while SCH 40 and SCH 80 CPVC to ASTM F441 is used for industrial and chemical service. The two are not interchangeable and each needs its own cement and fittings.",
      APEX,
    ],
    specs: [
      { label: "Size range", value: "15 mm – 50 mm CTS; ½\" – 8\" SCH 40 / 80" },
      { label: "Temperature rating", value: "82 °C continuous, 93 °C intermittent" },
      { label: "Pressure rating", value: "SDR 11 — 400 psi at 23 °C, 100 psi at 82 °C" },
      { label: "Jointing", value: "One-step CPVC solvent cement or threaded brass insert" },
      { label: "Material", value: "CPVC compound, lead-free, potable water grade" },
    ],
    features: [
      "Rated for continuous hot water at 82 °C",
      "Low thermal conductivity — less heat loss than metal riser",
      "Immune to chlorine attack, pitting and scaling",
      "Full moulded fitting and brass-insert transition range",
    ],
    applications: [
      "Hot and cold potable water plumbing in buildings",
      "Solar water heating and geyser distribution loops",
      "Industrial chemical and dosing lines within temperature limits",
      "Fire sprinkler branch lines where listed product is specified",
    ],
    standards: [
      "ASTM D2846 (CTS CPVC hot and cold water distribution)",
      "ASTM F441 (SCH 40 / 80 CPVC pipe)",
      "ASTM F438 / F439 (CPVC fittings)",
      "IS 15778 on request",
      "EN ISO 15877 PVC-C on request",
    ],
    faqs: [
      {
        q: "Can PVC cement be used on CPVC pipe?",
        a: "No. CPVC requires a CPVC-specific solvent cement. Using PVC cement produces a joint that fails at temperature.",
      },
      {
        q: "Is CPVC suitable for a fire sprinkler system?",
        a: "Only where a listed sprinkler product and the governing approval are specified. State the approval required on the enquiry.",
      },
    ],
  },
  {
    slug: "swr-drainage-pipes",
    name: "SWR Drainage Pipes",
    category: "pvc-piping",
    tagline: "Soil, waste and rainwater PVC-U pipe and fittings to IS 13592",
    summary:
      "Non-pressure PVC-U drainage pipe in Type A (ventilation and rainwater) and Type B (soil and waste) wall thicknesses, with the full moulded SWR fitting range.",
    overview: [
      "SWR piping handles gravity drainage inside and around buildings — soil stacks, waste branches, vent pipes and rainwater downtakes. It is a non-pressure system, so wall thickness is set by stiffness and impact resistance rather than a pressure class.",
      "IS 13592 distinguishes Type A for ventilation and rainwater from the heavier Type B for soil and waste duty. Joints are made with solvent cement or ring-seal sockets, with ring-seal preferred on long vertical stacks where thermal movement must be accommodated.",
      APEX,
    ],
    specs: [
      { label: "Size range", value: "40 mm – 160 mm OD" },
      { label: "Types", value: "Type A (vent / rainwater), Type B (soil / waste)" },
      { label: "Standard lengths", value: "3 m and 6 m, plain or single socket" },
      { label: "Jointing", value: "Solvent cement or elastomeric ring seal" },
      { label: "Fittings", value: "Bends, tees, junctions, traps, cowls, clamps and door bends" },
    ],
    features: [
      "Smooth bore resists deposition and blockage",
      "Rot, rust and effluent resistant",
      "Ring-seal option absorbs thermal movement in tall stacks",
      "Complete fitting and bracket range from one source",
    ],
    applications: [
      "Soil and waste stacks in residential and commercial buildings",
      "Ventilation and anti-siphonage pipework",
      "Rainwater downtakes and terrace drainage",
      "External drainage and plumbing renovation work",
    ],
    standards: [
      "IS 13592 Type A / Type B (PVC-U soil and waste discharge)",
      "IS 14735 (PVC-U injection moulded SWR fittings)",
      "IS 12235 methods of test",
      "EN 1329 PVC-U on request",
    ],
    faqs: [
      {
        q: "What is the difference between Type A and Type B?",
        a: "Type A is the lighter wall used for ventilation and rainwater; Type B is heavier and is used for soil and waste discharge. Specify the type per line on the enquiry.",
      },
      {
        q: "Can SWR pipe be used under pressure?",
        a: "No. SWR is a gravity drainage system with no pressure rating. Use UPVC pressure pipe to IS 4985 for pressurised duty.",
      },
    ],
  },
  {
    slug: "pvc-fittings",
    name: "PVC & UPVC Fittings",
    category: "pvc-piping",
    tagline: "Moulded and fabricated fittings across the UPVC, CPVC and SWR ranges",
    summary:
      "Injection-moulded elbows, tees, couplers, reducers, unions, valves, tank connectors and brass-insert transitions matched to the UPVC pressure, CPVC and SWR systems.",
    overview: [
      "Fittings are supplied as a matched system with the pipe they serve, because dimensional systems are not interchangeable — an IS 4985 socket, a CTS CPVC socket and an ASTM D2466 SCH 40 socket are three different bores. Ordering pipe and fittings from one manufacturing source removes the fit-up problems that arise when they are mixed.",
      "The range covers solvent-weld and threaded patterns, brass-insert female and male thread adaptors for metal transitions, tank nipples, ball valves, flanged connections and fabricated large-bore items where a moulded part does not exist.",
      APEX,
    ],
    specs: [
      { label: "Systems covered", value: "UPVC pressure, CPVC CTS / SCH 80, SWR drainage" },
      { label: "Size range", value: "15 mm – 315 mm depending on system" },
      { label: "Patterns", value: "Elbow, tee, coupler, reducer, union, cap, cross, bend, trap" },
      { label: "Transitions", value: "Brass-insert FTA / MTA, tank connector, flange adaptor" },
      { label: "Manufacture", value: "Injection moulded; fabricated for large bore" },
    ],
    features: [
      "Dimensionally matched to the pipe system supplied",
      "Brass-insert transitions for metal pipework and fixtures",
      "Moulded from the same compound batch as the pipe",
      "Fabricated specials available where no mould exists",
    ],
    applications: [
      "Plumbing and water distribution assemblies",
      "Irrigation manifolds and header assemblies",
      "Soil, waste and rainwater stack connections",
      "Tank, pump and fixture transitions",
    ],
    standards: [
      "ASTM D2466 / D2467 (SCH 40 / 80 PVC fittings)",
      "ASTM F438 / F439 (CPVC fittings)",
      "IS 7834 (UPVC injection moulded fittings)",
      "IS 14735 (SWR fittings)",
    ],
    faqs: [
      {
        q: "Can PVC and CPVC fittings be mixed?",
        a: "No. The materials, dimensional systems and cements differ. Keep each system to its own pipe, fittings and cement.",
      },
      {
        q: "Are large-bore specials available?",
        a: "Yes. Where no moulded part exists we fabricate from pipe and sheet at Apex Polymer & Engineering to the drawing supplied.",
      },
    ],
  },
];
