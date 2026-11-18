import type { ProductType } from "./products.types";

export const longFlatProducts: ProductType[] = [
  {
    slug: "round-bars",
    name: "Round Bars & Rods",
    category: "bars",
    tagline: "Bright, black, peeled and ground bar for machining and forging",
    summary:
      "Hot rolled and cold finished round bar from 3 mm to 300 mm in stainless, duplex, nickel alloy and carbon steel for machined components, fasteners, shafts and forging stock.",
    overview: [
      "Round bar is the feedstock for machined valve components, shafts, fasteners, pump parts and forged blanks. Condition and finish drive both price and machinability: hot rolled black bar is the cheapest, peeled and ground bar gives close tolerance and concentricity, and cold drawn bright bar gives a fine surface with higher strength from cold work.",
      "Stainless and duplex bar is supplied to ASTM A276 and A479 in the solution-annealed condition, with A484 covering general requirements and tolerances. Nickel alloy bar follows B160, B164, B166, B425, B446, B473, B574 and B637 by alloy.",
      "Where the bar is destined for pressure-retaining components, A479 (rather than A276) is normally specified because it carries the additional requirements needed for ASME Section VIII and B31.3 use.",
    ],
    specs: [
      { label: "Diameter", value: "3 mm – 300 mm (larger on enquiry)" },
      { label: "Condition", value: "Solution annealed, hot rolled, cold drawn, peeled or ground" },
      { label: "Finish", value: "Black, bright, peeled, centreless ground, polished" },
      { label: "Length", value: "3 – 6 m random, or cut to length" },
      { label: "Tolerance", value: "h9 / h11 / k12 per ASTM A484 or DIN" },
    ],
    features: [
      "Full grade range from 304L to Alloy 625",
      "Cut-to-length and centreless grinding available",
      "PMI, hardness and IGC testing on request",
      "Heat-number traceability on every bar",
    ],
    applications: [
      "Valve stems, bodies and machined components",
      "Pump shafts and rotating equipment parts",
      "Fasteners, studs and bolting stock",
      "Forging and flange machining blanks",
    ],
    standards: [
      "ASTM A276 / A479 (stainless and duplex)",
      "ASTM A484 (general requirements)",
      "ASTM B160 / B164 / B166 / B425 / B446 / B473 / B574 / B637 (nickel alloy)",
      "ASTM A105 / A350 LF2 (carbon and low temperature)",
      "EN 10088-3 on request",
    ],
    faqs: [
      {
        q: "A276 or A479?",
        a: "A479 adds the requirements needed for pressure-retaining components under ASME codes. Specify A479 where the machined part is pressure retaining.",
      },
      {
        q: "What tolerance can be held?",
        a: "Hot rolled black bar holds mill tolerance; peeled and ground bar typically holds h9 to h11, and centreless ground bar can be supplied to closer limits on request.",
      },
    ],
  },
  {
    slug: "hex-square-bars",
    name: "Hex, Square & Flat Bars",
    category: "bars",
    tagline: "Profiled bar for fasteners, frames and machined sections",
    summary:
      "Cold drawn and hot rolled hexagon, square and flat bar in stainless, duplex and companion carbon steel for fastener manufacture, machined fittings and piping components.",
    overview: [
      "Hexagon bar is the standard raw material for nuts, bolt heads and machined fittings, supplied cold drawn to close across-flats tolerance so that standard spanner sizes fit without machining.",
      "Square and flat sections are used for pipe supports, brackets, clamps and guides where a corrosion-resistant grade is required. Flats are also machined into keys, wear strips and gasket retainers.",
      "All profiles are supplied solution annealed in stainless and duplex grades, with a pickled, bright or polished finish as specified.",
    ],
    specs: [
      { label: "Hexagon", value: "6 mm – 75 mm across flats" },
      { label: "Square", value: "6 mm – 100 mm" },
      { label: "Flat", value: "10 × 3 mm to 300 × 50 mm" },
      { label: "Condition", value: "Cold drawn or hot rolled, annealed and pickled" },
    ],
    features: [
      "Close across-flats tolerance for fastener work",
      "Solution annealed corrosion-resistant grades",
      "Cut to length, drilled and deburred to order",
      "Bright, pickled or polished finishes",
    ],
    applications: [
      "Fastener and nut manufacture",
      "Machined fittings and adaptors",
      "Pipe supports, brackets and clamps",
      "Keys, wear strips and guides",
    ],
    standards: [
      "ASTM A276 (stainless profiles)",
      "ASTM A479 (pressure-retaining components)",
      "ASTM A484 general requirements",
      "EN 10088-3 / DIN 1013 dimensions",
    ],
    faqs: [
      {
        q: "Can non-standard flat sizes be supplied?",
        a: "Yes — flats can be slit or machined from plate to a required width and thickness where a rolled size is unavailable.",
      },
      {
        q: "Is polishing available?",
        a: "Yes, bright, satin and mirror polishing are available on hex, square and flat sections for architectural or hygienic applications.",
      },
    ],
  },
  {
    slug: "plates",
    name: "Plates",
    category: "sheets-plates",
    tagline: "Hot rolled plate for vessels, exchangers and fabricated piping components",
    summary:
      "Hot rolled plate from 3 mm to 150 mm in stainless, duplex, nickel alloy and companion pressure-vessel carbon steel, supplied No.1 / HRAP or as rolled, with UT, impact and HIC testing to order.",
    overview: [
      "Plate is the base material for pressure vessels, tanks, structures, flange blanks and fabricated components. Thickness, flatness, edge condition and internal soundness all matter, and heavy plate is normally ultrasonically examined to SA-435 or SA-578 where laminations would be unacceptable.",
      "Stainless and duplex plate follows ASTM A240 with A480 general requirements, supplied solution annealed and pickled. Nickel alloy plate follows B127, B168, B424, B443, B463, B575 and B670 by alloy. Companion carbon steel pressure vessel plate is A516 Grade 70.",
      "Cut-to-size services include plasma, waterjet and saw cutting, bevelling, drilling, rolling and forming, with dimensional reports issued against the drawing.",
    ],
    specs: [
      { label: "Thickness", value: "3 mm – 150 mm" },
      { label: "Width", value: "Up to 3000 mm" },
      { label: "Length", value: "Up to 12000 mm, or cut to size" },
      { label: "Finish", value: "No.1 / HRAP, as rolled, shot blasted" },
      { label: "Testing", value: "UT (SA-435 / SA-578), impact, HIC, IGC, PMI" },
    ],
    features: [
      "Pressure vessel quality corrosion-resistant grades",
      "Ultrasonic examination for lamination control",
      "Cut, bevelled, rolled and formed to drawing",
      "Full heat traceability and 3.1 / 3.2 certification",
    ],
    applications: [
      "Pressure vessels, separators and tanks",
      "Heat exchanger shells and tubesheets",
      "Fabricated spools and pressure parts",
      "Flange and machined blanks",
    ],
    standards: [
      "ASTM A240 / A480 (stainless and duplex)",
      "ASTM B127 / B168 / B424 / B443 / B463 / B575 / B670 (nickel alloy)",
      "ASTM A516 Gr 70 (companion carbon steel)",
      "SA-435 / SA-578 ultrasonic examination",
      "NACE TM0284 HIC testing on request",
    ],
    faqs: [
      {
        q: "Is ultrasonic testing standard?",
        a: "No — UT to SA-435 or SA-578 is a supplementary requirement. Specify it where laminations would be unacceptable, such as tubesheets and heavy nozzle reinforcement.",
      },
      {
        q: "Can plate be supplied cut to shape?",
        a: "Yes. Plasma, waterjet and saw profiling, bevelling, drilling and rolling are available with a dimensional report against the drawing.",
      },
    ],
  },
  {
    slug: "sheets-coils",
    name: "Sheets, Coils & Strip",
    category: "sheets-plates",
    tagline: "Cold rolled sheet and coil in 2B, BA, No.4 and No.8 finishes",
    summary:
      "Cold rolled sheet, coil and slit strip from 0.3 mm to 6 mm in stainless, duplex and nickel alloy, in 2B, BA, No.4 hairline and No.8 mirror finishes.",
    overview: [
      "Sheet and coil are used for fabricated equipment, cladding, linings, ducting, hygienic surfaces and pressed components. Finish selection is functional as well as visual: 2B is the general fabrication finish, BA is a bright reflective finish, No.4 is a directional brushed finish and No.8 is a mirror polish.",
      "Material is supplied in the solution-annealed condition to ASTM A240 with A480 tolerances, in coil, cut sheet or slit strip. PVC film protection is applied to polished surfaces for transport.",
      "Slitting, shearing, laser cutting, bending and rolling services are provided so components arrive ready for assembly.",
    ],
    specs: [
      { label: "Thickness", value: "0.3 mm – 6.0 mm" },
      { label: "Width", value: "Up to 2000 mm; slit to requirement" },
      { label: "Finishes", value: "2B, 2D, BA, No.4 / HL, No.8 mirror" },
      { label: "Form", value: "Coil, cut sheet, slit strip, blanks" },
      { label: "Protection", value: "PVC film on polished surfaces" },
    ],
    features: [
      "Full finish range including mirror polish",
      "Slitting and cut-to-length to requirement",
      "Laser cutting, bending and rolling available",
      "Solution annealed with 3.1 certification",
    ],
    applications: [
      "Process and hygienic equipment fabrication",
      "Tank, vessel and duct linings",
      "Architectural cladding and panels",
      "Pressed and formed components",
    ],
    standards: [
      "ASTM A240 (stainless and duplex sheet)",
      "ASTM A480 general requirements and tolerances",
      "ASTM B162 / B168 / B424 / B443 / B575 (nickel alloy sheet)",
      "EN 10088-2 on request",
      "ASTM A480 finish designations",
    ],
    faqs: [
      {
        q: "Which finish should be chosen?",
        a: "2B for general fabrication, BA where reflectivity matters, No.4 for architectural and equipment surfaces and No.8 where a mirror appearance is required.",
      },
      {
        q: "Can coils be slit to width?",
        a: "Yes — coil is slit and cut to length to the required width and sheet size, with edge condition specified as mill, slit or deburred.",
      },
    ],
  },
];
