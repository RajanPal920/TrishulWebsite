import type { ProductType } from "./products.types";

export const pipeProducts: ProductType[] = [
  {
    slug: "seamless-pipes",
    name: "Seamless Pipes",
    category: "pipes-tubes",
    tagline: "Hot-finished and cold-drawn seamless pipe for pressure service",
    summary:
      "Seamless pipe with no longitudinal weld, for high-pressure, high-temperature and corrosive process piping in stainless, duplex, nickel alloy and carbon steel.",
    overview: [
      "Seamless pipe is produced by piercing and elongating a solid billet, so there is no weld line to inspect, no HAZ and no risk of preferential weld corrosion. It is the default choice for high-pressure hydrocarbon service, sour duty, thick-wall lines and small-bore piping.",
      "Stainless and duplex seamless pipe is supplied to ASTM A312 and A790 in the solution-annealed and pickled condition. Nickel alloy pipe follows the B-series specifications with ASTM B829 general requirements. Carbon steel pressure pipe follows ASTM A106.",
      "Pipe is ordered by NPS and schedule to ASME B36.19M (stainless) or B36.10M (carbon and alloy). Wall thickness, end preparation, length and testing must all be defined at enquiry stage.",
    ],
    specs: [
      { label: "Size range", value: "NPS ⅛ – 24 standard, to NPS 48 on project supply" },
      { label: "Schedules", value: "SCH 5S – 160, STD, XS, XXS or wall in mm" },
      { label: "Condition", value: "Solution annealed and pickled / normalised" },
      { label: "Ends", value: "Plain end, bevelled end or threaded" },
      { label: "Length", value: "Single random 4 – 7 m, double random 7 – 13 m, or cut" },
    ],
    features: [
      "No weld seam — no HAZ or weld corrosion path",
      "Full pressure rating at heavy wall thickness",
      "Hydro, UT / ET, PMI and IGC testing available",
      "Heat-number marking and EN 10204 3.1 / 3.2 certification",
    ],
    applications: [
      "Refinery and petrochemical process piping",
      "Offshore topside and subsea systems",
      "Boiler, steam and high-temperature lines",
      "Sour and chloride-bearing service",
    ],
    standards: [
      "ASTM A312 (austenitic stainless)",
      "ASTM A790 (duplex and super duplex)",
      "ASTM B161 / B165 / B167 / B407 / B423 / B444 / B622 with B829 (nickel alloy)",
      "ASTM A106 Gr B / C (carbon steel)",
      "ASME B36.10M / B36.19M dimensions",
    ],
    faqs: [
      {
        q: "How is seamless pipe ordered?",
        a: "By grade and specification, NPS, schedule or wall thickness, length, end preparation and testing. State the code edition and any supplementary requirements such as PMI, IGC or impact testing.",
      },
      {
        q: "Is seamless always better than welded?",
        a: "Not always. Welded pipe from a qualified mill is fully acceptable for many services and is more economical in large diameters. Seamless is specified where the piping class requires it or where wall thickness and pressure demand it.",
      },
    ],
  },
  {
    slug: "welded-pipes",
    name: "Welded (EFW / ERW) Pipes",
    category: "pipes-tubes",
    tagline: "Economical welded pipe for large-diameter and general pressure service",
    summary:
      "Longitudinally welded pipe in stainless, duplex and carbon steel for large-diameter process, utility and structural lines, with radiography and hydro testing to specification.",
    overview: [
      "Welded pipe is formed from plate or coil and joined by an automatic longitudinal weld, with or without filler. It is the practical route above NPS 24 where seamless is unavailable or uneconomical, and is widely used for utility, water, tank farm and low-pressure process lines.",
      "Stainless welded pipe to ASTM A312 is supplied with the weld radiographed or ultrasonically examined as required and solution annealed after welding to restore corrosion resistance. Carbon steel EFW pipe follows ASTM A671 / A672 for pressure duty.",
      "Large-diameter fabricated pipe up to 3000 mm is supplied to IS 3589, EN 10217 or DIN 2458 for water, structural and low-pressure applications.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ – 72; fabricated to 3000 mm NB" },
      { label: "Wall thickness", value: "SCH 5S – 80 or 3 – 50 mm" },
      { label: "Weld examination", value: "RT, UT or ET per specification" },
      { label: "Condition", value: "Solution annealed and pickled after welding" },
      { label: "Ends", value: "Plain, bevelled or with backing strip removed" },
    ],
    features: [
      "Economical in large diameters",
      "Tight dimensional and ovality control",
      "100 % weld NDE available",
      "Available in stainless, duplex and carbon steel",
    ],
    applications: [
      "Utility, cooling water and firewater mains",
      "Tank farm and terminal piping",
      "Ducting, stacks and structural pipe",
      "Low- and medium-pressure process lines",
    ],
    standards: [
      "ASTM A312 / A358 (welded stainless)",
      "ASTM A790 / A928 (welded duplex)",
      "ASTM A671 / A672 (EFW carbon steel)",
      "IS 3589 / EN 10217-1 / DIN 2458 (large diameter)",
      "ASME B36.10M / B36.19M dimensions",
    ],
    faqs: [
      {
        q: "Is the weld tested?",
        a: "Yes. Depending on the specification and class the longitudinal weld is radiographed or ultrasonically examined, and the whole pipe is hydro tested or given an equivalent NDE substitution.",
      },
      {
        q: "Can welded pipe be used in hydrocarbon service?",
        a: "Many piping classes permit it, but sour, high-pressure and offshore specifications frequently require seamless. Check the class before ordering.",
      },
    ],
  },
  {
    slug: "heat-exchanger-tubes",
    name: "Heat Exchanger & Boiler Tubes",
    category: "pipes-tubes",
    tagline: "Seamless and welded tube for exchangers, boilers and condensers",
    summary:
      "Straight-length and U-bent heat exchanger tube to ASTM A213, A249, A789 and the nickel B-series, supplied by OD and wall thickness with eddy current and hydro testing.",
    overview: [
      "Heat exchanger and boiler tube is ordered by actual outside diameter and wall thickness, not by NPS and schedule. Tolerances on OD, wall and straightness are far tighter than pipe because the tube must pass through drilled tubesheet holes and be expanded or seal welded into them.",
      "ASTM A213 covers seamless ferritic and austenitic boiler, superheater and exchanger tube; A249 covers the welded equivalent; A789 covers duplex tube for chloride and seawater service; nickel alloy exchanger tube follows B163, B407, B423, B444 and B622.",
      "U-tubes are supplied with the bend region stress relieved or solution annealed and with the bend ovality and thinning controlled per TEMA.",
    ],
    specs: [
      { label: "OD range", value: "¼ in – 5 in (6 mm – 127 mm)" },
      { label: "Wall thickness", value: "BWG 22 – BWG 8, or 0.5 – 5.0 mm" },
      { label: "Form", value: "Straight length or U-bend to TEMA" },
      { label: "Condition", value: "Bright annealed or annealed and pickled" },
      { label: "Testing", value: "Hydro, ET, UT, flare, flattening, hardness, IGC" },
    ],
    features: [
      "Tight OD, wall and straightness tolerances",
      "U-bending with controlled ovality and thinning",
      "Eddy current testing on every tube",
      "Bright annealed internal surface for heat transfer",
    ],
    applications: [
      "Shell and tube heat exchangers",
      "Boilers, superheaters and economisers",
      "Condensers and feedwater heaters",
      "Desalination and seawater cooling",
    ],
    standards: [
      "ASTM A213 (seamless boiler / exchanger tube)",
      "ASTM A249 (welded exchanger tube)",
      "ASTM A789 / A790 (duplex tube)",
      "ASTM B163 / B407 / B423 / B444 / B622 (nickel alloy tube)",
      "TEMA / API 660 for exchanger design",
    ],
    faqs: [
      {
        q: "How should exchanger tube be specified?",
        a: "Give the grade, OD, average or minimum wall, length, straight or U-bend, tolerance class and the test package — eddy current, hydro, flare, flattening and IGC as applicable.",
      },
      {
        q: "Average wall or minimum wall?",
        a: "Average wall permits a plus and minus tolerance; minimum wall permits only a plus tolerance and costs more. The exchanger designer must state which applies.",
      },
    ],
  },
  {
    slug: "instrumentation-tubing",
    name: "Instrumentation & Hydraulic Tubing",
    category: "pipes-tubes",
    tagline: "Small-bore precision tube for instrument and hydraulic lines",
    summary:
      "Cold-drawn seamless instrumentation tube to ASTM A269 and A213 in ¼ to 1 in OD, supplied bright annealed for compression-fitting service in impulse and hydraulic lines.",
    overview: [
      "Instrumentation tubing carries impulse lines, hydraulic control lines and analyser sample lines. Because it is joined with compression fittings, the tube surface must be smooth, the OD tolerance tight and the hardness controlled so the ferrule bites correctly without cracking the tube.",
      "Standard supply is ASTM A269 TP316/316L in the bright annealed condition with a maximum hardness of 80 HRB, in coils or straight lengths. Offshore and sour applications frequently upgrade to 6Mo, Alloy 825 or Alloy 625 tube.",
      "Duplex and super duplex tube is used where chloride stress corrosion cracking in insulated or splash-zone service has caused failures with 316L.",
    ],
    specs: [
      { label: "OD range", value: "⅛ in – 1 in (3 mm – 25 mm)" },
      { label: "Wall thickness", value: "0.028 in – 0.109 in (0.7 – 2.8 mm)" },
      { label: "Hardness", value: "≤ 80 HRB for compression fittings" },
      { label: "Form", value: "Straight lengths 6 m or coils" },
      { label: "Condition", value: "Bright annealed, seamless" },
    ],
    features: [
      "Tight OD tolerance for ferrule sealing",
      "Bright annealed, scale-free surface",
      "Hardness controlled for fitting compatibility",
      "6Mo, 825 and 625 upgrades for offshore duty",
    ],
    applications: [
      "Instrument impulse and sample lines",
      "Hydraulic and pneumatic control tubing",
      "Chemical injection lines",
      "Offshore and subsea control systems",
    ],
    standards: [
      "ASTM A269 (general service tubing)",
      "ASTM A213 (higher-temperature tubing)",
      "ASTM A632 (small-diameter tubing)",
      "ASTM B444 / B704 (nickel alloy tubing)",
      "NORSOK M-001 material selection",
    ],
    faqs: [
      {
        q: "Why does hardness matter?",
        a: "Compression fittings rely on the ferrule being harder than the tube. Tube above about 80 HRB will not swage correctly and the joint can leak or the ferrule can crack.",
      },
      {
        q: "When should 316L be upgraded?",
        a: "In splash zones, insulated hot lines and chloride-rich atmospheres — 6Mo, Alloy 825 or Alloy 625 tube is standard offshore practice.",
      },
    ],
  },
  {
    slug: "line-pipe",
    name: "API 5L Line Pipe",
    category: "pipes-tubes",
    tagline: "Transmission pipeline supply in PSL1 and PSL2",
    summary:
      "Seamless, ERW, LSAW and SSAW line pipe from Grade B to X80, with pipeline coatings, bevelling and sour-service testing for oil, gas and water transmission.",
    overview: [
      "Line pipe is supplied to API 5L in Product Specification Level 1 or 2. PSL2 adds mandatory chemistry, carbon-equivalent, toughness and NDT requirements and is required for sour, offshore and high-consequence pipelines.",
      "The manufacturing route is chosen by diameter and wall: seamless for small bore and heavy wall, ERW for medium diameters, LSAW for heavy-wall large diameter and SSAW for large-diameter, lower-pressure water and slurry duty.",
      "External coating (3LPE, 3LPP, FBE), internal flow coating or cement lining, and field-joint provisions are specified with the pipe so the coated length and cutback are correct at site.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ – 120" },
      { label: "Wall thickness", value: "3 – 100 mm by route" },
      { label: "Grades", value: "Gr B, X42, X46, X52, X56, X60, X65, X70, X80" },
      { label: "Coating", value: "3LPE, 3LPP, FBE, coal tar, cement lining" },
      { label: "Testing", value: "Hydro, UT / RT, Charpy, HIC / SSC for sour" },
    ],
    features: [
      "PSL1 and PSL2 supply with full traceability",
      "Sour-service HIC and SSC tested options",
      "Pipeline coatings applied with controlled cutback",
      "Bevelling and end sizing to pipeline welding procedure",
    ],
    applications: [
      "Oil and gas transmission pipelines",
      "Gathering systems and flowlines",
      "Water and slurry transmission",
      "Station piping and tie-in spools",
    ],
    standards: [
      "API 5L PSL1 / PSL2",
      "ISO 3183",
      "NACE MR0175 / TM0284 for sour service",
      "DNV-ST-F101 for offshore pipelines",
      "MSS SP-75 for matching WPHY fittings",
    ],
    faqs: [
      {
        q: "Which grade should be selected?",
        a: "The pipeline design pressure, diameter and allowable stress determine the grade and wall. Higher grades reduce wall thickness and tonnage but tighten welding and preheat requirements.",
      },
      {
        q: "Is sour-service testing included?",
        a: "HIC to NACE TM0284 and SSC to TM0177 are supplementary requirements and must be stated in the enquiry, along with hardness limits.",
      },
    ],
  },
  {
    slug: "low-temperature-pipes",
    name: "Low-Temperature Pipes",
    category: "pipes-tubes",
    tagline: "Impact-tested pipe for cryogenic and cold service",
    summary:
      "ASTM A333 Grade 6 and Grade 3 seamless and welded pipe, Charpy tested at −45 °C and −101 °C, for LPG, ethylene, ammonia and cryogenic systems.",
    overview: [
      "Low-temperature piping must be proven against brittle fracture at the minimum design metal temperature. ASTM A333 Grade 6 is normalised and Charpy impact tested at −45 °C; Grade 3, with 3.5 % nickel, extends this to −101 °C.",
      "Every component in the line must match: A350 LF2 flanges, A420 WPL6 buttweld fittings and impact-tested valves. Mixing ordinary A105 or A234 WPB into the class defeats the design.",
      "Austenitic stainless pipe to A312 is used below −101 °C where nickel steels are no longer economic or where corrosion also governs.",
    ],
    specs: [
      { label: "Size range", value: "NPS ⅛ – 36" },
      { label: "Schedules", value: "SCH 10 – 160, STD, XS, XXS" },
      { label: "Impact testing", value: "Charpy at −45 °C (Gr 6) / −101 °C (Gr 3)" },
      { label: "Condition", value: "Normalised or normalised and tempered" },
      { label: "Manufacture", value: "Seamless or welded" },
    ],
    features: [
      "Impact testing on every heat-treatment lot",
      "Matched LF2 and WPL6 component supply",
      "Normalised condition certified on the MTC",
      "Cold-service coating and insulation support",
    ],
    applications: [
      "LPG, LNG and ethylene plants",
      "Ammonia and industrial refrigeration",
      "Cryogenic storage and transfer lines",
      "Offshore cold-service piping",
    ],
    standards: [
      "ASTM A333 Grade 6 / Grade 3",
      "ASTM A350 LF2 (flanges)",
      "ASTM A420 WPL6 (fittings)",
      "ASME B31.3 impact testing rules",
      "ASME B36.10M dimensions",
    ],
    faqs: [
      {
        q: "What is the minimum design metal temperature?",
        a: "State the MDMT in the enquiry. Grade 6 covers −45 °C, Grade 3 covers −101 °C, and austenitic stainless is used below that.",
      },
      {
        q: "Are impact results shown on the certificate?",
        a: "Yes — individual and average Charpy values at the specified temperature appear on the EN 10204 3.1 or 3.2 certificate.",
      },
    ],
  },
  {
    slug: "large-diameter-pipes",
    name: "Large Diameter & Fabricated Pipes",
    category: "pipes-tubes",
    tagline: "LSAW, SSAW and fabricated pipe above NPS 24",
    summary:
      "Large-diameter welded and fabricated pipe to NPS 120 or 3000 mm for water transmission, penstocks, structural piling, ducting and low-pressure process lines.",
    overview: [
      "Above NPS 24 most pipe is longitudinally (LSAW) or spirally (SSAW) submerged-arc welded, or rolled and welded from plate to a drawing. Diameter, wall, roundness and weld NDE are agreed with the fabricator against the design code.",
      "Water and infrastructure supply follows IS 3589, EN 10217 or AWWA C200, with cement mortar lining and external coating applied as specified. Process ducting and stacks are fabricated from plate to project drawings.",
      "Fabricated spools, mitred bends, reducers and tees are produced where standard B16.9 fittings are unavailable in the required size.",
    ],
    specs: [
      { label: "Diameter", value: "NPS 26 – 120 / up to 3000 mm NB" },
      { label: "Wall thickness", value: "5 – 50 mm" },
      { label: "Manufacture", value: "LSAW, SSAW or rolled and welded plate" },
      { label: "Linings / coatings", value: "Cement mortar, epoxy, FBE, 3LPE, galvanized" },
      { label: "Weld NDE", value: "RT, UT and MT as specified" },
    ],
    features: [
      "Diameters beyond standard mill pipe",
      "Fabricated bends, tees and reducers to drawing",
      "Lining and coating applied in-house by partners",
      "Dimensional and roundness reports issued",
    ],
    applications: [
      "Water transmission and intake lines",
      "Penstocks and hydro conduits",
      "Structural piling and casing",
      "Ducting, stacks and low-pressure process",
    ],
    standards: [
      "IS 3589 / EN 10217-1 / DIN 2458",
      "AWWA C200 (steel water pipe)",
      "ASTM A671 / A672 (EFW pressure pipe)",
      "API 5L for large-diameter line pipe",
      "ASME B31.3 / B31.4 fabrication rules",
    ],
    faqs: [
      {
        q: "Can non-standard sizes be produced?",
        a: "Yes. Rolled-and-welded pipe is made to any diameter and wall within plate availability, with dimensional and NDE reports.",
      },
      {
        q: "What lining is used for water service?",
        a: "Cement mortar lining to AWWA C205 or liquid epoxy, with external coating chosen for the soil or exposure condition.",
      },
    ],
  },
];
