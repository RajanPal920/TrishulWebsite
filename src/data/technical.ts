export interface Article {
  slug: string;
  title: string;
  category:
    | "Standards"
    | "Flange Engineering"
    | "Pipe Fitting Engineering"
    | "Corrosion"
    | "Quality & Testing"
    | "Material Comparisons"
    | "Material Selection";
  summary: string;
  sections: { heading: string; body: string[]; bullets?: string[] }[];
  faqs?: { q: string; a: string }[];
}

export const articles: Article[] = [
  {
    slug: "asme-b16-5-flange-guide",
    title: "ASME B16.5 Flange Guide",
    category: "Standards",
    summary:
      "How ASME B16.5 defines pipe flange dimensions, ratings, facings and materials for NPS ½ through 24, and what a buyer must state on an enquiry.",
    sections: [
      {
        heading: "Scope of ASME B16.5",
        body: [
          "ASME B16.5 covers pipe flanges and flanged fittings from NPS ½ to NPS 24 in pressure classes 150, 300, 400, 600, 900, 1500 and 2500. It defines dimensions, tolerances, facing types and finishes, marking, materials and pressure-temperature ratings. Above NPS 24, ASME B16.47 Series A or B applies instead.",
          "The standard groups materials into material groups (for example Group 2.2 for 316, Group 3.8 for many nickel alloys), and each group has its own pressure-temperature rating table. Two flanges of the same class and size can therefore have very different allowable pressures depending on material.",
        ],
      },
      {
        heading: "Flange types covered",
        body: [
          "Weld neck, slip-on, socket weld, threaded, lap joint and blind flanges are all dimensioned in B16.5, along with integral flanged fittings. Long weld neck flanges are not a B16.5 type — their facing and drilling follow B16.5 but the hub is purchaser-specified.",
        ],
        bullets: [
          "Weld neck — butt welded, full radiography possible, best for cyclic and high-pressure service",
          "Slip-on — fillet welded, limited to lower classes and non-cyclic duty",
          "Socket weld — small bore, requires 1.5 mm expansion gap",
          "Threaded — no welding, restricted to low pressure",
          "Lap joint — loose backing flange with a stub end",
          "Blind — solid closure, highest bending stress",
        ],
      },
      {
        heading: "Facings and surface finish",
        body: [
          "Raised face (RF) is the default for most industrial service. Flat face (FF) is used with cast iron equipment and full-face gaskets. Ring type joint (RTJ) is used for high pressure and high temperature, generally class 900 and above, and for many wellhead applications.",
          "The standard serrated finish is 125–250 µin AARH, which suits spiral wound gaskets. Smoother finishes are specified for certain soft gaskets, and a smooth finish with a spiral wound gasket can leak because the gasket needs the serrations to grip.",
        ],
      },
      {
        heading: "What to state on the enquiry",
        body: [
          "A complete flange line item leaves no ambiguity for the manufacturer or the inspector.",
        ],
        bullets: [
          "Material specification and grade (e.g. ASTM A182 F316L, ASTM B564 UNS N06625)",
          "Nominal size and pressure class",
          "Flange type and facing (WN RF, BL RTJ, SO FF)",
          "Bore or matching pipe schedule for weld neck flanges",
          "Dimensional standard (ASME B16.5)",
          "Surface finish requirement",
          "Certification level and any testing requirements",
        ],
      },
    ],
    faqs: [
      {
        q: "Does class 150 mean 150 psi?",
        a: "No. The class is a rating designator, not a pressure. A class 150 flange in ASTM A182 F316 is rated approximately 275 psi at ambient temperature and less as temperature rises. Always read the pressure-temperature table for the specific material group.",
      },
      {
        q: "Where does B16.5 stop and B16.47 begin?",
        a: "B16.5 covers up to NPS 24. From NPS 26 to NPS 60, ASME B16.47 Series A (formerly MSS SP-44) or Series B (formerly API 605) applies. The two series are not interchangeable.",
      },
    ],
  },
  {
    slug: "asme-b16-9-fittings-guide",
    title: "ASME B16.9 Fittings Guide",
    category: "Standards",
    summary:
      "Dimensional requirements, tolerances and marking for factory-made wrought buttweld fittings, and how to specify them correctly.",
    sections: [
      {
        heading: "What B16.9 covers",
        body: [
          "ASME B16.9 specifies overall dimensions, tolerances, ratings, testing and marking for factory-made wrought buttwelding fittings in sizes NPS ½ through NPS 48. It covers elbows, tees, reducers, caps, lap joint stub ends and returns.",
          "The standard does not specify material — that comes from ASTM A403 for stainless, A815 for duplex, B366 for nickel alloys, or A234 for carbon and low alloy steel. It also does not specify wall thickness; the purchaser states the schedule or wall.",
        ],
      },
      {
        heading: "Pressure rating philosophy",
        body: [
          "Buttweld fittings are rated to the same pressure as seamless pipe of equivalent material and wall thickness. There is no separate class system as there is for flanges. This is why specifying the schedule correctly matters so much — the schedule is the rating.",
        ],
      },
      {
        heading: "Minimum wall thickness",
        body: [
          "B16.9 requires that the wall thickness at any point be not less than 87.5 % of the nominal wall of the matching pipe, allowing for thinning during forming. On critical service, purchasers frequently specify verification of minimum wall by ultrasonic measurement at the extrados of bends.",
        ],
      },
      {
        heading: "Marking requirements",
        body: [
          "Fittings must be marked with the manufacturer's name or trademark, material identification, size, schedule and heat number. Heat number marking is the link back to the mill test certificate and is the first thing a receiving inspector checks.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is a B16.9 fitting seamless or welded?",
        a: "Both are permitted. The material specification designation states which: WP-S is seamless, WP-W is welded with the weld radiographed, WP-WX is welded with additional requirements. Sour and high-pressure service usually requires seamless.",
      },
    ],
  },
  {
    slug: "asme-b16-11-forged-fittings-guide",
    title: "ASME B16.11 Forged Fittings Guide",
    category: "Standards",
    summary:
      "Socket weld and threaded forged fittings: classes 2000 to 9000, dimensional requirements and where each is appropriate.",
    sections: [
      {
        heading: "Scope and classes",
        body: [
          "ASME B16.11 covers forged fittings in socket weld and threaded configurations for small-bore piping, normally NPS ⅛ through NPS 4. Socket weld fittings are rated class 3000, 6000 and 9000; threaded fittings are class 2000, 3000 and 6000.",
          "Unlike flanges, the class here relates directly to the wall thickness of the fitting relative to matching pipe schedule — class 3000 socket weld corresponds broadly to SCH 80 pipe, class 6000 to SCH 160.",
        ],
      },
      {
        heading: "Socket weld versus threaded",
        body: [
          "Socket weld joints are stronger and more leak-tight than threaded joints and are preferred for hydrocarbon and high-pressure service. Threaded joints avoid welding entirely, which is valuable in hazardous areas or on galvanised piping, but they leak more readily and are prohibited in many process specifications.",
          "Both create internal crevices, so neither is suitable for hygienic service or for highly corrosive fluids where crevice corrosion is a risk.",
        ],
      },
      {
        heading: "The 1.5 mm gap",
        body: [
          "When installing a socket weld fitting, the pipe must be withdrawn approximately 1.5 mm (1/16 in) from the bottom of the socket before welding. This gap allows for thermal expansion of the pipe during welding; without it the fillet weld root is placed in tension and cracking can result.",
        ],
      },
    ],
  },
  {
    slug: "asme-b16-36-orifice-flange-guide",
    title: "ASME B16.36 Orifice Flange Guide",
    category: "Standards",
    summary:
      "Orifice flange dimensions, tapping arrangements and what to supply when ordering a complete metering assembly.",
    sections: [
      {
        heading: "Scope",
        body: [
          "ASME B16.36 covers orifice flanges in classes 300, 400, 600, 900, 1500 and 2500 for sizes NPS 1 through NPS 24. Class 150 orifice flanges are dimensioned per B16.5 with B16.36 tapping arrangements.",
          "Flanges are supplied in pairs with radial pressure tappings, normally two per flange at ½ in NPT, plus jack screws to separate the flanges for plate changes.",
        ],
      },
      {
        heading: "Ordering a metering assembly",
        body: [
          "A complete assembly comprises the flange pair, orifice plate, jack screws, bolting and gaskets. To manufacture the plate, the supplier needs the flow data — fluid, flow rate, operating pressure and temperature, line size and schedule — or the calculated bore diameter.",
        ],
        bullets: [
          "Flange material, class and size",
          "Tapping size and number",
          "Plate material, thickness and bevel",
          "Bore diameter or full flow data for calculation",
          "Whether jack screws, bolting and gaskets are included",
        ],
      },
    ],
  },
  {
    slug: "astm-b564-nickel-alloy-forgings",
    title: "ASTM B564 Nickel Alloy Forgings & Flanges",
    category: "Standards",
    summary:
      "The governing material specification for nickel alloy forged flanges and forgings, and how it interacts with dimensional standards.",
    sections: [
      {
        heading: "What B564 specifies",
        body: [
          "ASTM B564 (ASME SB564) covers nickel and nickel-alloy forgings including flanges, fittings, valve bodies and other pressure components. It defines chemical composition, mechanical properties, heat treatment condition, testing and certification for each UNS number covered.",
          "It does not define dimensions. A complete flange specification therefore reads, for example, 'ASTM B564 UNS N06625, ASME B16.5, class 300, NPS 6, WN RF, SCH 40 bore'.",
        ],
      },
      {
        heading: "Grades commonly supplied",
        body: [
          "The specification covers the widely used corrosion-resistant nickel alloys and their high-temperature counterparts.",
        ],
        bullets: [
          "N06625 — Inconel 625",
          "N08825 — Incoloy 825",
          "N10276 — Hastelloy C-276",
          "N06022 — Hastelloy C-22",
          "N04400 — Monel 400",
          "N08800 / N08810 / N08811 — Incoloy 800 / 800H / 800HT",
          "N02200 / N02201 — Nickel 200 / 201",
        ],
      },
      {
        heading: "Heat treatment and condition",
        body: [
          "The delivery condition matters as much as the chemistry. Alloy 625 has separate Grade 1 (annealed) and Grade 2 (solution annealed) requirements with different mechanical minimums and intended service temperatures. Alloy 800H requires a coarse grain size achieved by high-temperature solution annealing. The MTC should record the actual heat-treatment temperature and cooling method.",
        ],
      },
    ],
  },
  {
    slug: "astm-b366-nickel-alloy-fittings",
    title: "ASTM B366 Nickel Alloy Fittings",
    category: "Standards",
    summary:
      "Material specification for factory-made wrought nickel alloy buttweld and forged fittings.",
    sections: [
      {
        heading: "Scope",
        body: [
          "ASTM B366 covers factory-made wrought nickel and nickel-alloy fittings — elbows, tees, reducers, caps, stub ends and forged fittings — in the same UNS grades as B564. Dimensions come from ASME B16.9, B16.11 or B16.28 as applicable.",
          "The designation includes a class prefix indicating manufacturing route: WP-S for seamless, WP-W for welded, and WP-WX where the weld is radiographed to a higher standard.",
        ],
      },
      {
        heading: "Specifying correctly",
        body: [
          "A typical complete line item reads 'ASTM B366 WP-S UNS N06625, ASME B16.9, 6 in SCH 40 LR 90° elbow, bevelled ends per B16.25'. Omitting the WP-S / WP-W designation leaves the manufacturing route to the supplier, which can be rejected at inspection if the piping class requires seamless.",
        ],
      },
    ],
  },
  {
    slug: "astm-a182-stainless-duplex-forgings",
    title: "ASTM A182 Stainless & Duplex Forgings",
    category: "Standards",
    summary:
      "The governing forging specification for stainless and duplex flanges: F-grade designations, heat treatment and testing.",
    sections: [
      {
        heading: "F-grade designations",
        body: [
          "ASTM A182 covers forged or rolled alloy and stainless steel pipe flanges, forged fittings and valves for high-temperature service. Grades are identified by an F prefix.",
        ],
        bullets: [
          "F304 / F304L — Stainless Steel 304 / 304L",
          "F316 / F316L — Stainless Steel 316 / 316L",
          "F321 / F321H, F347 / F347H — stabilised grades",
          "F51 — Duplex UNS S31803",
          "F60 — Duplex UNS S32205 (2205)",
          "F53 — Super Duplex UNS S32750",
          "F55 — Super Duplex UNS S32760",
          "F44 — 254 SMO (UNS S31254)",
          "F904L — Stainless Steel 904L",
        ],
      },
      {
        heading: "Heat treatment requirements",
        body: [
          "Duplex and super duplex grades require solution annealing followed by rapid quenching to dissolve intermetallic phases. The specification states minimum annealing temperatures, and for heavy sections the quench rate is critical — slow cooling produces sigma phase that destroys toughness and corrosion resistance.",
        ],
      },
      {
        heading: "Supplementary requirements",
        body: [
          "A182 includes optional supplementary requirements frequently invoked by project specifications: impact testing, intergranular corrosion testing per ASTM A262, ferrite determination, and additional NDE. These must be called out on the purchase order — they are not supplied by default.",
        ],
      },
    ],
  },
  {
    slug: "astm-a403-stainless-fittings",
    title: "ASTM A403 Stainless Steel Fittings",
    category: "Standards",
    summary:
      "Material specification for wrought austenitic stainless steel buttweld fittings, including WP grade classes.",
    sections: [
      {
        heading: "Grade classes",
        body: [
          "ASTM A403 covers wrought austenitic stainless fittings. The grade designation combines the alloy and the manufacturing class, for example WP316L-S for seamless 316L or WP304-W for welded 304.",
        ],
        bullets: [
          "WP-S — seamless, no welds in the fitting",
          "WP-W — welded, with the weld radiographically examined",
          "WP-WX — welded, all welds including the starting material radiographed",
          "WP-WU — welded, ultrasonically examined",
          "Class CR — lower-cost class with reduced testing, generally not accepted in process piping",
        ],
      },
      {
        heading: "Solution annealing",
        body: [
          "Standard grades must be solution annealed after forming. The low-carbon L grades resist sensitisation, but forming operations still leave residual stress that annealing removes. Where the piping class requires intergranular corrosion testing, ASTM A262 Practice E is the usual method.",
        ],
      },
    ],
  },
  {
    slug: "astm-a815-duplex-fittings",
    title: "ASTM A815 Duplex Fittings",
    category: "Standards",
    summary:
      "Specification for ferritic-austenitic (duplex) wrought fittings including S31803, S32205, S32750 and S32760.",
    sections: [
      {
        heading: "Scope and grades",
        body: [
          "ASTM A815 covers wrought ferritic-austenitic stainless steel piping fittings for pressure service. Grades are designated by UNS number with the WP class prefix, for example WP-S S32750.",
          "The specification mandates solution annealing and rapid quenching, and requires the phase balance to be maintained. Because duplex fittings are formed hot and then annealed, control of the post-forming heat treatment determines whether the corrosion resistance survives manufacture.",
        ],
      },
      {
        heading: "Supplementary testing",
        body: [
          "Project specifications for duplex and super duplex fittings routinely invoke supplementary requirements.",
        ],
        bullets: [
          "Charpy impact testing, usually at −46 °C",
          "Ferrite content determination (typically 35–65 %, often narrowed)",
          "ASTM A923 Method A / B / C for intermetallic phase detection",
          "ASTM G48 Method A pitting corrosion testing",
          "Hardness limits for sour service",
        ],
      },
    ],
  },
  {
    slug: "en-10204-3-1-mtc-guide",
    title: "EN 10204 3.1 Material Test Certificate Guide",
    category: "Quality & Testing",
    summary:
      "What each EN 10204 certificate type means, what a valid 3.1 certificate must contain, and how 3.2 differs.",
    sections: [
      {
        heading: "The certificate types",
        body: [
          "EN 10204 defines four inspection document types. Only 3.1 and 3.2 involve specific testing on the delivered material.",
        ],
        bullets: [
          "2.1 — declaration of compliance, no test results",
          "2.2 — test report with non-specific test results",
          "3.1 — certificate with specific test results on the delivered material, validated by the manufacturer's independent inspection department",
          "3.2 — as 3.1, but countersigned by a purchaser's representative or an authorised third-party inspector",
        ],
      },
      {
        heading: "What a valid 3.1 certificate contains",
        body: [
          "A complete 3.1 certificate allows the receiving inspector to trace the item back to the melt and verify every specified property.",
        ],
        bullets: [
          "Manufacturer identity and certificate number",
          "Purchase order and item reference",
          "Product description: size, class, type, dimensional standard",
          "Material specification and grade with UNS number",
          "Heat / cast number matching the marking on the item",
          "Full chemical analysis against specification limits",
          "Mechanical test results: tensile, yield, elongation, hardness",
          "Heat-treatment condition and temperature",
          "Any supplementary test results — impact, ferrite, corrosion, NDE",
          "Signature of the manufacturer's independent inspection representative",
        ],
      },
      {
        heading: "Common problems",
        body: [
          "The most frequent MTC defects found at receipt are a heat number on the certificate that does not match the item marking, missing supplementary test results that were specified on the purchase order, and a certificate issued by the sales department rather than an independent inspection function. Each of these is grounds for rejection.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is 3.2 certification always better?",
        a: "It is more expensive and adds lead time because it requires third-party or purchaser witness. Specify it where the project or client requires it — typically offshore, subsea and nuclear scope — not as a default.",
      },
    ],
  },
  {
    slug: "pmi-testing-guide",
    title: "PMI Testing Guide",
    category: "Quality & Testing",
    summary:
      "How positive material identification works, what it can and cannot detect, and when to specify it.",
    sections: [
      {
        heading: "Why PMI exists",
        body: [
          "Alloy mix-up is one of the most common causes of premature failure in process plant. A 316L elbow installed in an alloy 625 line looks identical once installed but will fail in service. PMI verifies the actual alloy of each item non-destructively before installation.",
        ],
      },
      {
        heading: "Methods",
        body: [
          "X-ray fluorescence (XRF) is the standard field method. It reads the elemental composition of the surface and is fast, portable and non-destructive, but it cannot measure carbon, so it cannot distinguish 316 from 316L. Optical emission spectroscopy (OES) can measure carbon but leaves a small burn mark and needs a cleaner surface.",
        ],
        bullets: [
          "XRF — fast, no surface damage, cannot read carbon, nitrogen or boron",
          "OES — reads carbon, minor surface mark, slower",
          "Both require a clean, oxide-free surface for accuracy",
        ],
      },
      {
        heading: "Specifying PMI",
        body: [
          "State the coverage (100 % of items, or a percentage sample), the method, the acceptance criteria and whether the results must be reported per item with the heat number. For duplex and super duplex, PMI alone does not confirm phase balance — ferrite measurement is a separate test.",
        ],
      },
    ],
  },
  {
    slug: "nace-mr0175-iso-15156-guide",
    title: "NACE MR0175 / ISO 15156 Guide",
    category: "Standards",
    summary:
      "How sour service is defined, how the three parts of the standard are structured, and what data a buyer must supply.",
    sections: [
      {
        heading: "What the standard covers",
        body: [
          "NACE MR0175 / ISO 15156 specifies materials requirements for equipment used in oil and gas production where H2S is present. Compliance is conditional: a material is qualified for defined environmental limits, not universally.",
          "The standard is in three parts: Part 1 gives general principles for material selection; Part 2 covers carbon and low-alloy steels; Part 3 covers corrosion-resistant alloys and other alloys.",
        ],
      },
      {
        heading: "When service is sour",
        body: [
          "Service is defined as sour when the H2S partial pressure in the gas phase equals or exceeds 0.05 psi (0.0003 MPa) with free water present. Severity then depends on H2S partial pressure, in-situ pH, chloride concentration, temperature and the presence of elemental sulphur.",
        ],
      },
      {
        heading: "Data required for material verification",
        body: [
          "A supplier cannot confirm MR0175 compliance without the environmental data. Every sour-service enquiry should state:",
        ],
        bullets: [
          "H2S partial pressure",
          "Total system pressure and temperature",
          "Chloride concentration",
          "In-situ pH",
          "Presence of elemental sulphur",
          "Required material group from Part 3, if already determined",
        ],
      },
      {
        heading: "Documentation",
        body: [
          "Compliance must appear on the MTC: material group, heat-treatment condition, and measured hardness against the applicable limit. A statement of 'NACE compliant' without hardness values and condition is not acceptable evidence.",
        ],
      },
    ],
  },
  {
    slug: "norsok-m-630-materials-guide",
    title: "NORSOK M-630 Materials Guide",
    category: "Standards",
    summary:
      "What NORSOK M-630 material data sheets require, how they relate to M-650 manufacturer qualification, and what documentation a NORSOK M-630 supplier must provide.",
    sections: [
      {
        heading: "What NORSOK M-630 is",
        body: [
          "NORSOK M-630 is a Norwegian offshore material specification issued as a set of Material Data Sheets (MDS). Each MDS supplements a base standard such as ASTM A182, A790 or B564 with additional requirements on manufacturing route, heat treatment, testing, corrosion resistance, ferrite content and marking for a defined material and product form.",
          "It is a specification, not a certification a stockist can hold. NORSOK M-630 materials are supplied by sourcing against the applicable MDS — the requirements flow from the purchase order to the manufacturer, and the evidence flows back as documentation.",
        ],
      },
      {
        heading: "The MDS depends on grade and product form",
        body: [
          "There is no single NORSOK M-630 stainless steel or NORSOK M-630 alloy materials requirement. The applicable MDS is selected by material and product form — for example separate sheets cover 22Cr and 25Cr duplex forgings, plate, seamless pipe and fittings, and separate sheets again cover austenitic stainless and nickel-based alloys.",
          "An enquiry that names the MDS number, the base standard, the product form and the size range can be quoted accurately. An enquiry that says only 'NORSOK compliant materials' cannot, because the test scope and acceptance criteria differ from sheet to sheet.",
        ],
        bullets: [
          "MDS number as stated in the project specification",
          "Base material standard and grade / UNS number",
          "Product form: forging, fitting, pipe, plate or bar",
          "Required certification level: EN 10204 3.1 or 3.2",
          "Whether a NORSOK M-650 qualified manufacturer is mandated",
        ],
      },
      {
        heading: "How M-650 relates to M-630",
        body: [
          "NORSOK M-650 covers qualification of the manufacturer's manufacturing process — the qualification test record (QTR) demonstrates that a specific works, using a specific route and heat-treatment practice, can consistently produce material meeting the relevant MDS in a defined thickness and product range.",
          "Qualification therefore belongs to the manufacturing source, not to a distributor. M-650 qualification should only be claimed where the actual manufacturing source holds a valid QTR applicable to the required MDS, product form and thickness, and where that record can be produced for review.",
        ],
      },
      {
        heading: "What ASTM, ASME and NACE documentation does not cover",
        body: [
          "Material supplied to ASTM A182 or A790 with a NACE MR0175 hardness statement is not automatically NORSOK M-630 compliant. The MDS commonly adds requirements the base standard does not impose — tighter chemistry or PREN limits, ferrite ranges measured at defined locations, corrosion testing to ASTM G48 with specific temperature and acceptance criteria, impact testing at low temperature, extended NDT, and restrictions on manufacturing route.",
          "Compliance is demonstrated by the documentation set for the specific heat and item, read against the specific MDS invoked by the purchase order.",
        ],
      },
      {
        heading: "Documentation available for NORSOK enquiries",
        body: [
          "A NORSOK M-630 supplier is judged on the evidence package. The documents that may be provided, where required by the applicable MDS and project specification, are:",
        ],
        bullets: [
          "Applicable NORSOK M-630 Material Data Sheet (MDS)",
          "Manufacturer's NORSOK M-650 qualification documentation, where applicable",
          "EN 10204 3.1 / 3.2 Material Test Certificate, as required",
          "Chemical composition report",
          "Mechanical test report",
          "Heat-treatment records",
          "NDT reports such as UT, MPI, DPI or RT where applicable",
          "Corrosion-testing documentation where required",
          "Manufacturer ISO 9001 certificate",
          "Third-party inspection documentation where specified",
          "Full heat / batch / product traceability documentation",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Trishul Metals & Alloys NORSOK certified?",
        a: "No. NORSOK M-630 is a material specification rather than a supplier certification, and we do not claim NORSOK certification or M-650 qualification in our own name. Materials are available against applicable NORSOK M-630 requirements, subject to grade, product form, applicable MDS and manufacturer qualification.",
      },
      {
        q: "Which NORSOK M-630 material data sheet applies to my item?",
        a: "It depends on the material, grade and product form. Send the MDS number from your project specification, or the grade, product form and service conditions, and the applicable sheet is confirmed at RFQ stage before pricing.",
      },
      {
        q: "Can you supply from a NORSOK M-650 qualified manufacturer?",
        a: "Where the project mandates it, the requirement is placed on the nominated manufacturing source and the qualification test record is verified against the required MDS, product form and thickness range before the order is confirmed. Any gap is raised as a written deviation rather than discovered at inspection.",
      },
    ],
  },
  {
    slug: "igc-testing-guide",
    title: "IGC Testing Guide",
    category: "Quality & Testing",
    summary:
      "Intergranular corrosion testing methods under ASTM A262 and G28, and which practice applies to which alloy.",
    sections: [
      {
        heading: "What IGC testing detects",
        body: [
          "Intergranular corrosion occurs when chromium carbides precipitate at grain boundaries, depleting the adjacent metal of chromium and leaving a corrosion path. IGC testing exposes the material to an aggressive medium that preferentially attacks depleted boundaries, revealing sensitisation.",
        ],
      },
      {
        heading: "ASTM A262 practices for stainless steel",
        body: [
          "Several practices exist, each using a different medium and detecting a different susceptibility.",
        ],
        bullets: [
          "Practice A — oxalic acid etch, a rapid screening test",
          "Practice B — ferric sulphate / sulphuric acid, weight loss",
          "Practice C — Huey test, nitric acid, severe and used for nitric service",
          "Practice E — copper / copper sulphate / sulphuric acid, the most commonly specified acceptance test",
          "Practice F — copper / copper sulphate / sulphuric acid for molybdenum-bearing grades",
        ],
      },
      {
        heading: "ASTM G28 for nickel alloys",
        body: [
          "For nickel-base alloys, ASTM G28 Method A (ferric sulphate / sulphuric acid) and Method B (mixed acid with ferric chloride) are used. Method B is more aggressive and detects intermetallic phases in the high-molybdenum alloys such as C-276 and C-22.",
        ],
      },
    ],
  },
  {
    slug: "rf-vs-rtj-flanges",
    title: "RF vs RTJ Flanges",
    category: "Flange Engineering",
    summary:
      "How raised face and ring type joint flanges seal differently, and where each should be specified.",
    sections: [
      {
        heading: "How each seals",
        body: [
          "A raised face flange compresses a flat gasket — usually spiral wound — between two serrated faces. Sealing depends on bolt load compressing the gasket against the serrations. It is simple, tolerant and by far the most common arrangement.",
          "A ring type joint flange has a machined groove that receives a solid metal ring, either oval or octagonal. Bolt load deforms the softer ring into the groove, producing a metal-to-metal seal that is far more resistant to high pressure, high temperature and fire.",
        ],
      },
      {
        heading: "Where each is used",
        body: [
          "RF is standard for classes 150 to 600 and for most process service. RTJ becomes normal at class 900 and above, in high-temperature service, in wellhead and API 6A equipment, and wherever fire-safe integrity is required.",
        ],
      },
      {
        heading: "Practical considerations",
        body: [
          "RTJ joints require accurate alignment and the ring groove surface finish is critical — damage to the groove means the flange must be re-machined or replaced. The ring material must be softer than the flange to deform correctly, and its hardness should be specified. RTJ assemblies also cannot be separated axially without spreading the flanges, which affects maintenance planning.",
        ],
      },
    ],
  },
  {
    slug: "flange-pressure-classes-compared",
    title: "Flange Class 150 vs 300 vs 600 vs 900 vs 1500",
    category: "Flange Engineering",
    summary:
      "What pressure classes actually mean, how ratings fall with temperature, and how to select the right class.",
    sections: [
      {
        heading: "Class is a rating, not a pressure",
        body: [
          "A pressure class is a designator that maps to a pressure-temperature rating table for the specific material group. The class number never equals the allowable pressure. A class 300 flange in ASTM A182 F316 is rated approximately 720 psi at 38 °C, dropping to about 570 psi at 200 °C and less again at higher temperature.",
        ],
      },
      {
        heading: "Selection process",
        body: [
          "Determine the design pressure and design temperature, identify the material group from ASME B16.5 Table 1A, then read across the pressure-temperature table for that group and select the lowest class whose rating exceeds the design pressure at the design temperature.",
          "Then check secondary requirements: sour service may mandate a higher class through the piping specification, hydrotest pressure must be within the class limit, and standardisation across a project may make a higher class economical.",
        ],
      },
      {
        heading: "Physical differences",
        body: [
          "Higher classes have thicker flange rings, larger bolt circles, more or larger bolts and higher hub thickness. A class 1500 NPS 6 flange weighs several times a class 150 flange of the same size, which affects supports, installation cost and freight.",
        ],
      },
    ],
  },
  {
    slug: "flange-pressure-class-explained",
    title: "Flange Pressure Class Explained",
    category: "Flange Engineering",
    summary:
      "The basis of ASME pressure-temperature ratings and why the same class means different pressures for different alloys.",
    sections: [
      {
        heading: "Material groups",
        body: [
          "ASME B16.5 assigns every listed material to a group — for example Group 2.2 covers 316 and 316L, Group 2.8 covers many duplex grades, Group 3.8 covers a set of nickel alloys. Each group has a rating table derived from the allowable stresses of the materials in it.",
          "This is why a class 300 flange in F316 and a class 300 flange in alloy 625 have different allowable pressures at the same temperature: their allowable stresses differ.",
        ],
      },
      {
        heading: "Temperature derating",
        body: [
          "Allowable stress falls with temperature, so the rating falls with it. For austenitic stainless steels the reduction is gradual up to about 400 °C and then steepens. For duplex grades the rating is truncated at about 300 °C because of embrittlement risk rather than strength. Nickel alloys such as 625 hold their rating far higher.",
        ],
      },
      {
        heading: "Common errors",
        body: [
          "Assuming class 150 means 150 psi; using a carbon steel rating table for a stainless flange; ignoring the drop in rating at the design temperature; and specifying a class based on operating rather than design conditions are the four errors that appear most often at design review.",
        ],
      },
    ],
  },
  {
    slug: "pipe-schedule-explained",
    title: "Pipe Schedule Explained",
    category: "Pipe Fitting Engineering",
    summary:
      "How schedule numbers relate to wall thickness, why the S suffix exists, and why schedule must appear on every enquiry.",
    sections: [
      {
        heading: "What a schedule is",
        body: [
          "The schedule number is a dimensionless designator for wall thickness. For a given nominal pipe size, each schedule corresponds to a specific wall thickness in ASME B36.10M (carbon and alloy steel) or B36.19M (stainless steel).",
          "Because outside diameter is fixed by the NPS, increasing the schedule reduces the bore. A 6 in SCH 40 pipe has a 154.1 mm bore; SCH 80 reduces it to 146.3 mm.",
        ],
      },
      {
        heading: "The S suffix",
        body: [
          "Stainless schedules carry an S suffix — 5S, 10S, 40S, 80S — from ASME B36.19M. For most sizes SCH 40S and SCH 40 are the same thickness, but from NPS 12 upward they diverge. Specifying '40' when '40S' is meant on a large-diameter stainless line produces a heavier and more expensive item, and a mismatch at the weld.",
        ],
      },
      {
        heading: "Why fittings need the schedule",
        body: [
          "Buttweld fittings are supplied to match a specified pipe schedule. Ordering '6 in 90° LR elbow, 316L' without the schedule leaves the most important dimension undefined. The same applies to weld neck flange bores.",
        ],
      },
    ],
  },
  {
    slug: "nps-vs-outside-diameter",
    title: "Nominal Pipe Size vs Outside Diameter",
    category: "Pipe Fitting Engineering",
    summary:
      "Why NPS is not a measurement, where the numbers come from, and how DN sizes map across.",
    sections: [
      {
        heading: "NPS is a designator",
        body: [
          "Nominal pipe size is a dimensionless designator inherited from an era when pipe was described by its approximate bore. From NPS ⅛ to NPS 12 the outside diameter is larger than the NPS number: NPS 2 pipe has an outside diameter of 60.3 mm, not 50.8 mm.",
          "From NPS 14 and above, the NPS equals the outside diameter in inches exactly — NPS 14 pipe is 355.6 mm (14 in) outside diameter.",
        ],
      },
      {
        heading: "DN equivalents",
        body: [
          "The metric DN designator maps to NPS but is also nominal. DN 50 corresponds to NPS 2, DN 100 to NPS 4, DN 150 to NPS 6, DN 300 to NPS 12. The DN number is not the bore or the outside diameter.",
        ],
      },
      {
        heading: "Practical consequence",
        body: [
          "Because outside diameter is constant for a given NPS regardless of schedule, flanges and fittings fit any schedule of the same NPS externally — but the bores differ, which is exactly why weld neck flange bores must be specified.",
        ],
      },
    ],
  },
  {
    slug: "how-to-select-flange-bore",
    title: "How to Select Flange Bore",
    category: "Flange Engineering",
    summary:
      "Why the weld neck flange bore must match the pipe, and what happens when it does not.",
    sections: [
      {
        heading: "The bore is a separate parameter",
        body: [
          "For weld neck and long weld neck flanges the bore is not determined by the class or size — it is set by the schedule of the connecting pipe. A class 300 NPS 8 weld neck flange exists in SCH 20, 40, 80, 120 and XXS bores, each a different item with a different weight and price.",
        ],
      },
      {
        heading: "Consequences of a mismatch",
        body: [
          "If the flange bore is larger than the pipe bore, a step forms inside the joint that creates turbulence, erosion and a stress riser, and root radiography will show the mismatch. If it is smaller, the flow area is restricted and the weld preparation does not align. Most piping specifications limit internal misalignment to 1.5 mm and require it to be blended.",
        ],
      },
      {
        heading: "What to state on the enquiry",
        body: [
          "Either the pipe schedule ('bore to suit 8 in SCH 40') or the required inside diameter in millimetres. For lines with a corrosion allowance or non-standard wall, state the wall thickness explicitly rather than a schedule.",
        ],
      },
    ],
  },
  {
    slug: "flange-facing-types",
    title: "Flange Facing Types",
    category: "Flange Engineering",
    summary:
      "Raised face, flat face, RTJ, tongue and groove and male and female facings compared.",
    sections: [
      {
        heading: "The five facings",
        body: [
          "ASME B16.5 recognises several facing types, each suited to a different gasket and service.",
        ],
        bullets: [
          "Raised face (RF) — the default; gasket sits on a raised area inside the bolt circle",
          "Flat face (FF) — full-face gasket; used with cast iron and GRP equipment to avoid bending the mating flange",
          "Ring type joint (RTJ) — machined groove with a metal ring; high pressure and temperature",
          "Tongue and groove (T&G) — mating male and female profiles that trap the gasket precisely",
          "Male and female (M&F) — similar concept with a shallower profile",
        ],
      },
      {
        heading: "Surface finish",
        body: [
          "The standard serrated spiral or concentric finish of 125–250 µin AARH grips spiral wound and compressed fibre gaskets. Smooth finishes (63 µin or better) are used with metal-to-metal and certain PTFE gaskets. Using a spiral wound gasket on a smooth face is a common cause of joint leakage.",
        ],
      },
      {
        heading: "Matching faces",
        body: [
          "Both flanges in a joint must have compatible facings. An RF flange bolted to an FF flange with a raised-face gasket will bend the flat-face component, which is why cast iron equipment connections specify FF throughout.",
        ],
      },
    ],
  },
  {
    slug: "raised-face-flanges",
    title: "Raised Face Flanges",
    category: "Flange Engineering",
    summary:
      "The most common facing type: geometry, height by class, gasket selection and bolt-up practice.",
    sections: [
      {
        heading: "Geometry",
        body: [
          "The raised face concentrates gasket compression on a smaller area than the full flange face, so a given bolt load produces higher seating stress. Raised face height is 1.6 mm (1/16 in) for classes 150 and 300, and 6.4 mm (1/4 in) for class 400 and above.",
          "The larger raised face height in higher classes must be accounted for in spool dimensions — substituting a class 600 flange for a class 300 flange changes the face-to-face length of the assembly.",
        ],
      },
      {
        heading: "Gaskets",
        body: [
          "Spiral wound gaskets with an outer centring ring are standard for RF joints in process service. The winding material must be compatible with the process fluid, and for high-alloy piping the winding is usually the same alloy as the flange to avoid galvanic and corrosion mismatch at the seating surface.",
        ],
      },
      {
        heading: "Bolt-up",
        body: [
          "Uniform bolt load matters more than maximum load. Cross-pattern tightening in stages, correct lubrication and, on critical joints, controlled torque or tensioning with recorded values are standard practice. Over-tightening crushes the gasket winding and produces the leak it was meant to prevent.",
        ],
      },
    ],
  },
  {
    slug: "ring-type-joint-flanges",
    title: "Ring Type Joint Flanges",
    category: "Flange Engineering",
    summary:
      "Metal-to-metal sealing for high pressure and high temperature: ring styles, materials and groove care.",
    sections: [
      {
        heading: "Ring styles",
        body: [
          "R-style rings are oval or octagonal and fit standard B16.20 grooves. RX rings are pressure-energised and interchangeable with R grooves; BX rings are used with API 6BX flanges for the highest pressures and require their own groove geometry.",
        ],
      },
      {
        heading: "Ring material and hardness",
        body: [
          "The ring must be softer than the flange groove so it deforms rather than damaging the groove. Soft iron, low carbon steel, 304, 316, duplex and alloy 625 rings are all available, and the hardness should be specified — typically at least 30 HB below the flange material.",
          "In corrosive service the ring must also be corrosion compatible; a 316 ring in a super duplex seawater flange is a common and avoidable failure point.",
        ],
      },
      {
        heading: "Groove protection",
        body: [
          "The groove surface finish is a sealing surface. It must be protected during transport and storage, inspected before assembly, and never struck or used as a lifting point. Damaged grooves require re-machining, which changes the flange dimensions and may render the item unusable.",
        ],
      },
    ],
  },
  {
    slug: "socket-weld-vs-threaded-fittings",
    title: "Socket Weld vs Threaded Fittings",
    category: "Pipe Fitting Engineering",
    summary:
      "How the two small-bore joint types compare on strength, leak-tightness, inspection and cost.",
    sections: [
      {
        heading: "Joint integrity",
        body: [
          "Socket weld joints are considerably stronger and more leak resistant than threaded joints. The fillet weld carries load in shear and is far less likely to loosen under vibration. Threaded joints rely on thread engagement and sealant, and are the most common source of small-bore leaks in process plant.",
        ],
      },
      {
        heading: "Where threaded is still used",
        body: [
          "Threaded fittings avoid hot work, which is decisive in operating hazardous areas, on galvanised piping where welding destroys the coating, and in temporary or utility installations. Many specifications permit threaded connections only for instrument air, water and non-hazardous service.",
        ],
      },
      {
        heading: "Shared limitation",
        body: [
          "Both create an internal crevice at the joint. In chloride-bearing or corrosive service this crevice becomes an initiation site, which is why butt-welded connections are preferred on corrosive small-bore lines despite the higher fabrication cost.",
        ],
      },
    ],
  },
  {
    slug: "seamless-vs-welded-fittings",
    title: "Seamless vs Welded Fittings",
    category: "Pipe Fitting Engineering",
    summary:
      "WP-S, WP-W and WP-WX explained: manufacturing routes, testing and where each is acceptable.",
    sections: [
      {
        heading: "Manufacturing routes",
        body: [
          "Seamless fittings are formed from seamless pipe or forged billet and contain no weld. Welded fittings are formed from plate or welded pipe, so a longitudinal weld runs through the fitting. Both are made to identical dimensional standards and both meet the same pressure rating when the wall thickness is equal.",
        ],
      },
      {
        heading: "Designations",
        body: [
          "The class suffix in the material specification identifies the route and the testing applied.",
        ],
        bullets: [
          "WP-S — seamless",
          "WP-W — welded, weld radiographed after forming",
          "WP-WX — welded, all welds including those in the starting material radiographed",
          "WP-WU — welded with ultrasonic examination",
        ],
      },
      {
        heading: "Where seamless is required",
        body: [
          "Sour service, high-pressure classes, cyclic duty and many client specifications mandate seamless. Welded fittings are widely used in utility, water and lower-severity process service, where they are more economical, especially in large diameters where seamless material may not be available at all.",
        ],
      },
    ],
  },
  {
    slug: "concentric-vs-eccentric-reducer",
    title: "Concentric vs Eccentric Reducer",
    category: "Pipe Fitting Engineering",
    summary:
      "Which reducer geometry to use where, and why orientation matters on pump suction lines.",
    sections: [
      {
        heading: "The geometric difference",
        body: [
          "A concentric reducer is a symmetrical cone: both ends share a centreline. An eccentric reducer is offset so that one side of the pipe stays flat while the other tapers. Both have the same standard length under ASME B16.9.",
        ],
      },
      {
        heading: "Selection rules",
        body: [
          "Use concentric reducers in vertical lines and wherever centreline alignment governs. Use eccentric reducers in horizontal lines: flat side up on pump suction so no vapour pocket can form, flat side down on liquid lines that must drain completely.",
        ],
      },
      {
        heading: "The classic failure",
        body: [
          "A concentric reducer installed on a horizontal pump suction line creates a high point where vapour accumulates. The pump then cavitates intermittently, damaging the impeller and mechanical seal. It is a design error that costs far more to diagnose than the reducer costs to replace.",
        ],
      },
    ],
  },
  {
    slug: "duplex-vs-super-duplex",
    title: "Duplex vs Super Duplex",
    category: "Material Comparisons",
    summary:
      "PREN, strength, corrosion performance and cost compared across 2205, 2507 and S32760.",
    sections: [
      {
        heading: "The classification",
        body: [
          "Duplex stainless steels are classified by pitting resistance equivalent number. Standard duplex such as 2205 has a PREN of roughly 34–35. Super duplex is defined as PREN 40 or above, which includes S32750 (2507) and S32760 (F55). Hyper duplex grades exceed PREN 48.",
        ],
      },
      {
        heading: "Property comparison",
        body: [
          "Super duplex offers about 100 MPa more yield strength and roughly 15–25 °C higher critical pitting temperature than 2205, at a material cost premium of approximately 40–60 % depending on market conditions.",
        ],
        bullets: [
          "2205 — PREN ≈ 35, yield 450 MPa min, CPT ≈ 25–35 °C",
          "2507 (S32750) — PREN ≈ 42, yield 550 MPa min, CPT > 50 °C",
          "F55 (S32760) — PREN ≥ 40 with W, yield 550 MPa min, CPT > 50 °C",
        ],
      },
      {
        heading: "How to choose",
        body: [
          "Use 2205 for chloride-bearing process fluids, produced water and topside utility service at moderate temperature. Move to super duplex for natural or chlorinated seawater, high-chloride brines, higher operating temperature or where the extra strength saves weight. Both share the same 300 °C upper temperature limit and the same requirement for controlled welding and ferrite balance.",
        ],
      },
    ],
  },
  {
    slug: "inconel-625-vs-incoloy-825",
    title: "Inconel 625 vs Incoloy 825",
    category: "Material Comparisons",
    summary:
      "Two of the most commonly specified nickel alloys compared on chemistry, corrosion performance, strength and cost.",
    sections: [
      {
        heading: "Chemistry",
        body: [
          "Alloy 625 is nickel-base with 58 % minimum nickel, 20–23 % chromium, 8–10 % molybdenum and 3.15–4.15 % niobium. Alloy 825 is nickel-iron-chromium with 38–46 % nickel, 19.5–23.5 % chromium, only 2.5–3.5 % molybdenum, plus copper and titanium.",
          "The molybdenum difference is the key: 625 has roughly three times the molybdenum of 825, which is the dominant element for pitting and crevice resistance.",
        ],
      },
      {
        heading: "Performance",
        body: [
          "Alloy 625 has substantially better resistance to chloride pitting and crevice corrosion, and much higher strength — 414 MPa minimum yield against 241 MPa. Alloy 825 performs very well in sulphuric and phosphoric acid thanks to its copper content, and is fully adequate for many sour gas applications.",
        ],
      },
      {
        heading: "Selection and cost",
        body: [
          "Alloy 825 typically costs significantly less than 625 and is the sensible choice for sour service with moderate chloride content and for acid service. Alloy 625 is specified where warm chlorides, seawater, high strength or higher temperature govern. Both are accepted under NACE MR0175 / ISO 15156 within defined limits.",
        ],
      },
    ],
  },
  {
    slug: "hastelloy-c276-vs-inconel-625",
    title: "Hastelloy C276 vs Inconel 625",
    category: "Material Comparisons",
    summary:
      "Reducing versus oxidising performance, strength and cost — how to choose between the two premium CRAs.",
    sections: [
      {
        heading: "Chemistry and mechanism",
        body: [
          "C-276 has 15–17 % molybdenum with 14.5–16.5 % chromium; alloy 625 inverts that balance with 8–10 % molybdenum and 20–23 % chromium plus niobium. Molybdenum drives resistance in reducing conditions, chromium in oxidising conditions.",
        ],
      },
      {
        heading: "Where each wins",
        body: [
          "C-276 is superior in hot hydrochloric and sulphuric acid, wet chlorine and reducing chloride environments. Alloy 625 is superior in oxidising media, has higher strength (414 MPa versus 283 MPa minimum yield), and is more widely stocked in flange and fitting form.",
        ],
      },
      {
        heading: "Practical selection",
        body: [
          "For seawater, produced water and general offshore service, alloy 625 is the usual choice. For chemical process streams containing hydrochloric acid, chlorinated organics or mixed reducing acids, C-276 is the reference material. Where the stream is genuinely mixed or variable, C-22 or C-2000 may outperform both.",
        ],
      },
    ],
  },
  {
    slug: "316l-vs-duplex-2205",
    title: "316L vs Duplex 2205",
    category: "Material Comparisons",
    summary:
      "Why duplex often costs less per installed metre than 316L despite a higher price per kilogram.",
    sections: [
      {
        heading: "Strength and wall thickness",
        body: [
          "Duplex 2205 has a minimum yield strength of 450 MPa against 170 MPa for 316L. Under ASME B31.3, the allowable stress governs the required wall thickness, so a duplex line can frequently use a lighter schedule than the 316L equivalent. On large-diameter lines the resulting weight saving often offsets the higher price per kilogram.",
        ],
      },
      {
        heading: "Corrosion",
        body: [
          "2205 has a PREN of about 35 against 25 for 316L, and far greater resistance to chloride stress corrosion cracking — the mechanism that causes most 316L failures above 60 °C in chloride service. In cooling water, produced water and coastal installations this difference is decisive.",
        ],
      },
      {
        heading: "Where 316L remains correct",
        body: [
          "316L is more formable, easier to weld without procedure qualification complexity, usable above 300 °C where duplex is not, tougher at cryogenic temperature, and available from stock everywhere. For clean, low-chloride, high-temperature or cryogenic service it remains the right answer.",
        ],
      },
    ],
  },
  {
    slug: "material-traceability",
    title: "Material Traceability from Raw Material to Dispatch",
    category: "Quality & Testing",
    summary:
      "How heat numbers, marking and documentation link a delivered flange back to the melt, and where the chain typically breaks.",
    sections: [
      {
        heading: "The chain",
        body: [
          "Traceability begins at the melt shop, where a heat (cast) number identifies a specific batch of molten metal with a recorded chemical analysis. That heat number follows the material through forging, heat treatment, machining, testing and dispatch, appearing on the item marking and on every certificate.",
        ],
      },
      {
        heading: "Marking requirements",
        body: [
          "MSS SP-25 governs marking of valves, fittings, flanges and unions. A compliant marking includes the manufacturer's identification, material grade, size, pressure class or schedule, and the heat number. On small items the marking may be on a tag; on flanges it is stamped on the outside diameter.",
        ],
      },
      {
        heading: "Where the chain breaks",
        body: [
          "Traceability is most often lost through re-marking during machining, transfer of loose items between packages without tags, certificates that reference a heat number not present on the item, and consolidated shipments where documentation is not segregated by heat. Receiving inspection should reject any item whose marking cannot be matched to a certificate.",
        ],
      },
      {
        heading: "What Trishul supplies",
        body: [
          "Every consignment is dispatched with heat-number traceable EN 10204 3.1 certificates matched item by item to the marking, plus any supplementary test reports specified on the purchase order, compiled into a single documentation dossier.",
        ],
      },
    ],
  },
];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);

export const articleCategories = Array.from(new Set(articles.map((a) => a.category)));
