import type { ProductType } from "./products.types";

export const structuralProducts: ProductType[] = [
  {
    slug: "structural-beams",
    name: "Structural Beams (ISMB, ISHB, UB, UC, HEA, HEB)",
    category: "structural",
    tagline: "Universal beams, universal columns, HEA, HEB and wide-flange shapes for load-bearing frameworks",
    summary:
      "Hot-rolled structural steel beams supplied to IS 2062, EN 10025 (S275, S355) and ASTM A36 / A572 Grade 50 for refinery pipe racks, platform deck modules, equipment skids and heavy industrial framing.",
    overview: [
      "Trishul Metals supplies certified hot-rolled structural steel beams in wide-flange, universal beam (UB), universal column (UC), and standard European HEA/HEB/IPE profiles. Produced from clean fully-killed steel with controlled carbon equivalents, our structural sections deliver high load capacity, excellent weldability, and verified toughness at sub-zero temperatures.",
      "Structural beams for offshore platforms and modular processing skids frequently mandate through-thickness ductility testing (Z-quality per EN 10164 / ASTM A770) to prevent lamellar tearing during heavy multi-pass welding.",
      "Available cut to length, shot-blasted, and primed with inorganic zinc silicate or certified export coating systems ready for immediate site erection.",
    ],
    specs: [
      { label: "Designations", value: "ISMB / ISMC (IS 2062), UB / UC (BS 4-1), HEA / HEB / IPE (EN 10034), W-Shapes (ASTM A6)" },
      { label: "Depth range", value: "100 mm to 900 mm (W4×13 to W36×300)" },
      { label: "Material grades", value: "IS 2062 E250 / E350, EN 10025 S275JR / S355JR / S355J2, ASTM A36, ASTM A572 Gr 50" },
      { label: "Length options", value: "Standard 6 m / 12 m stock lengths, or precision cut-to-size up to 18 m" },
      { label: "Surface finishes", value: "Black as-rolled, shot blasted SA 2.5, pre-construction zinc primer" },
    ],
    features: [
      "Verified yield strength and impact toughness (Charpy V-notch tested down to −20 °C or −40 °C)",
      "Strict dimensional tolerance compliance per EN 10034 and ASTM A6",
      "Low carbon equivalent (CEV) for ease of manual and submerged-arc welding without preheat cracking",
      "Supplied with 100% heat traceability and EN 10204 3.1 / 3.2 mill certification",
    ],
    applications: [
      "Process plant pipe racks, cable tray bridges and piperacks",
      "Offshore oil & gas topside deck frames and module structures",
      "Heavy equipment skids, compressor bases and crane girders",
      "Desalination and power station structural infrastructure",
    ],
    standards: [
      "IS 2062:2011 (Hot Rolled Medium and High Tensile Structural Steel)",
      "EN 10025-2 (Technical delivery conditions for non-alloy structural steels)",
      "ASTM A36 / A36M (Standard Specification for Carbon Structural Steel)",
      "ASTM A572 / A572M (High-Strength Low-Alloy Columbium-Vanadium Structural Steel)",
      "EN 10034 / ASTM A6 (Dimensional tolerances)",
    ],
    faqs: [
      {
        q: "What documentation is supplied with structural steel beams?",
        a: "Every consignment is accompanied by an EN 10204 Type 3.1 mill test certificate detailing heat number, ladle chemical analysis, CEV, tensile/yield strengths, elongation, and Charpy impact values where specified.",
      },
      {
        q: "Can Trishul supply beams with Z-testing for lamellar tearing resistance?",
        a: "Yes. For offshore jacket and cantilever module connections, we supply beams tested to EN 10164 (Z15, Z25, Z35) or ASTM A770 through-thickness reduction of area.",
      },
    ],
  },
  {
    slug: "structural-channels",
    name: "Structural Channels (C-Channels & PFC)",
    category: "structural",
    tagline: "Parallel flange and tapered flange channels for bracing, purlins and skid framing",
    summary:
      "Parallel Flange Channels (PFC) and standard C-channels hot-rolled to IS 2062, EN 10025 and ASTM A36 for structural cross-bracing, secondary support framing, equipment bases and trailer chassis.",
    overview: [
      "Structural channels provide superior bending resistance along their primary axis with a flat outer web that makes bolting and welding to flat plates straightforward. Trishul Metals supplies both parallel flange channels (PFC) which eliminate the need for tapered washers, and traditional tapered channels to Indian (ISMC), European (UPN), and American (C / MC) standards.",
      "All sections are sourced from prime blast-furnace and electric-arc-furnace steel mills, tested for mechanical properties, straightness, and cross-sectional squareness.",
    ],
    specs: [
      { label: "Profile types", value: "PFC (Parallel Flange), ISMC (Tapered), UPN (European Standard), C / MC (American)" },
      { label: "Web depth range", value: "75 mm to 430 mm (C3×4.1 to C15×50)" },
      { label: "Grades", value: "IS 2062 E250 / E350, EN 10025-2 S275 / S355, ASTM A36" },
      { label: "Standard lengths", value: "6.0 m, 9.0 m, 12.0 m, custom saw-cut lengths" },
    ],
    features: [
      "Parallel flanges ensure uniform flange thickness for easy bolting without tapered washers",
      "High torsional stability when paired or boxed for heavy support columns",
      "Tight dimensional control to EN 10279 and ASTM A6",
    ],
    applications: [
      "Modular process skid baseframes and perimeter channels",
      "Secondary framing, purlins, girts and cross-bracing",
      "Stair stringers, handrail kickplates and access walkway supports",
      "Pipe hanger headers and utility tray brackets",
    ],
    standards: [
      "IS 2062:2011",
      "EN 10025-2:2019",
      "ASTM A36 / A36M",
      "EN 10279 (Hot rolled steel channels — Tolerances on shape, dimension and mass)",
    ],
    faqs: [
      {
        q: "What is the advantage of Parallel Flange Channels (PFC) over tapered channels?",
        a: "Parallel Flange Channels have uniform flange thickness, which allows standard high-strength bolts and washers to seat flush against the flange inside without requiring bevelled or tapered washers.",
      },
    ],
  },
  {
    slug: "structural-angles",
    name: "Structural Angles (Equal & Unequal)",
    category: "structural",
    tagline: "Hot-rolled equal and unequal structural angles for truss framing, transmission towers and bracing",
    summary:
      "Equal and unequal structural angles to IS 2062, EN 10025, ASTM A36 and ASTM A572 for electrical transmission towers, solar mounting structures, conveyor trusses and secondary steelwork.",
    overview: [
      "Structural steel angles (L-shapes) are the fundamental building blocks of lattice towers, trusses, and bracing assemblies. Trishul Metals supplies equal leg angles from 20×20 mm to 250×250 mm and unequal angles up to 200×150 mm in standard structural and high-strength grades.",
      "Available with hot-dip galvanizing to ASTM A123 / ISO 1461 for long-term corrosion resistance in outdoor marine and industrial atmospheric environments.",
    ],
    specs: [
      { label: "Configurations", value: "Equal Leg (EA) and Unequal Leg (UA) angles" },
      { label: "Size range", value: "20×20×3 mm to 250×250×35 mm" },
      { label: "Grades", value: "IS 2062 E250 / E350, EN 10025 S275 / S355, ASTM A36, A572 Gr 50" },
      { label: "Corrosion protection", value: "Self-colour black, hot-dip galvanized to ASTM A123 / ISO 1461" },
    ],
    features: [
      "High stiffness-to-weight ratio for compression struts and cross-bracing",
      "Consistent 90° leg angle and root radius ensuring uniform weld prep",
      "Fully documented mill test certificates with complete ladle analysis",
    ],
    applications: [
      "Transmission and telecommunication lattice towers",
      "Industrial roofing trusses and solar power mounting structures",
      "Vessel internal support rings, ladders and platform gratings",
      "Shipbuilding stiffeners and maritime dock framing",
    ],
    standards: [
      "IS 2062:2011 / IS 808",
      "EN 10025-2",
      "ASTM A36 / A36M",
      "EN 10056-1 / EN 10056-2 (Structural steel equal and unequal leg angles)",
    ],
    faqs: [
      {
        q: "Can Trishul provide galvanized structural angles?",
        a: "Yes. We supply angles hot-dip galvanized per ASTM A123 or ISO 1461 with minimum coating thickness up to 85–100 µm for marine and industrial splash resistance.",
      },
    ],
  },
  {
    slug: "structural-hollow-sections",
    name: "Structural Hollow Sections (SHS, RHS & CHS)",
    category: "structural",
    tagline: "Cold-formed and hot-finished square, rectangular and circular hollow structural sections",
    summary:
      "Square Hollow Sections (SHS), Rectangular Hollow Sections (RHS) and Circular Hollow Sections (CHS) to ASTM A500 Grade B/C, EN 10210 and EN 10219 for architecturally exposed structural steel and offshore tubular frames.",
    overview: [
      "Hollow structural sections offer exceptional torsional rigidity and clean architectural lines with up to 30% weight savings compared to open structural sections under multi-axis loading. Trishul Metals supplies hot-finished (EN 10210) hollow sections free of internal residual stress for critical dynamic and low-temperature service, as well as cold-formed (EN 10219 / ASTM A500) sections for standard industrial construction.",
      "Every tube is high-frequency induction (HFI) or submerged arc welded (SAW), non-destructively tested online, and verified for weld seam integrity.",
    ],
    specs: [
      { label: "Forms", value: "Square (SHS), Rectangular (RHS), Circular (CHS)" },
      { label: "Size range", value: "SHS: 20×20 mm to 500×500 mm; RHS: 40×20 mm to 600×400 mm; CHS: 21.3 mm to 610 mm OD" },
      { label: "Wall thickness", value: "2.0 mm to 25.0 mm" },
      { label: "Grades", value: "ASTM A500 Grade B / C, EN 10210 S355J2H / S355NH (hot finished), EN 10219 S275J2H / S355J2H (cold formed)" },
    ],
    features: [
      "High torsional rigidity and efficient multi-directional buckling resistance",
      "Smooth closed profile minimizes exposed surface area, reducing blast and paint maintenance costs",
      "Hot-finished sections possess uniform grain structure and low internal stress for tight radius bending",
    ],
    applications: [
      "Offshore wind substation primary trusses and boat landings",
      "Airport terminals, sports arenas and architecturally exposed structural steel (AESS)",
      "Crane booms, agricultural machinery and earthmoving equipment chassis",
      "Industrial piperack support portals and column bents",
    ],
    standards: [
      "ASTM A500 / A500M Grade B / C (Cold-Formed Welded and Seamless Carbon Steel Structural Tubing)",
      "EN 10210-1 / EN 10210-2 (Hot finished steel structural hollow sections)",
      "EN 10219-1 / EN 10219-2 (Cold formed welded structural hollow sections)",
      "IS 4923 (Hollow steel sections for structural use)",
    ],
    faqs: [
      {
        q: "What is the difference between hot-finished (EN 10210) and cold-formed (EN 10219) hollow sections?",
        a: "Hot-finished sections (EN 10210) undergo final heat treatment above the normalizing temperature, eliminating residual stresses in the corner regions and providing superior ductility and low-temperature impact properties suitable for cyclic, dynamic, and offshore loading.",
      },
    ],
  },
];
