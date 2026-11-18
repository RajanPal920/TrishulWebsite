import type { ProductType } from "./products.types";

export const forgedProducts: ProductType[] = [
  {
    slug: "socket-weld-fittings",
    name: "Socket Weld Fittings",
    category: "forged-fittings",
    tagline: "Forged small-bore fittings to ASME B16.11, Class 3000 to 9000",
    summary:
      "Forged elbows, tees, crosses, couplings, half couplings, unions and caps with socket bores for small-bore high-pressure piping in alloy, stainless and carbon steel.",
    overview: [
      "Socket weld fittings receive the pipe into a machined socket and are joined with a single fillet weld. They dominate small-bore piping up to NPS 2 where butt welding is impractical and threaded joints are not acceptable for the pressure or the fluid.",
      "Pressure class is designated 3000, 6000 and 9000, matched to the pipe schedule: Class 3000 to SCH 80, Class 6000 to SCH 160 and Class 9000 to XXS. A 1.5 mm bottoming gap is left in the socket before welding to prevent root cracking from weld shrinkage.",
      "Socket welds are not used in cyclic, slurry or highly corrosive service because of the crevice at the socket root — butt-welded or extruded-outlet designs are preferred there.",
    ],
    specs: [
      { label: "Size range", value: "NPS ⅛ – 4" },
      { label: "Pressure classes", value: "3000, 6000, 9000" },
      { label: "Bore match", value: "SCH 80 / 160 / XXS by class" },
      { label: "Types", value: "90° and 45° elbow, tee, cross, coupling, half coupling, union, cap, plug" },
      { label: "Marking", value: "Grade, class, heat number, manufacturer per MSS SP-25" },
    ],
    features: [
      "Single fillet weld — fast small-bore fabrication",
      "No thread leak path at high pressure",
      "Class-matched to the connecting pipe schedule",
      "Available in nickel alloy, duplex, stainless and carbon steel",
    ],
    applications: [
      "Small-bore process and utility piping",
      "Instrument, vent and drain connections",
      "Steam and hydraulic systems",
      "Offshore and skid-mounted assemblies",
    ],
    standards: [
      "ASME B16.11 (dimensions)",
      "ASTM A182 (stainless / duplex)",
      "ASTM B564 / B462 (nickel alloy)",
      "ASTM A105 / A350 LF2 (carbon and low temperature)",
      "MSS SP-79 / SP-83 / SP-97 for related items",
    ],
    faqs: [
      {
        q: "Why is a gap left in the socket?",
        a: "The pipe is inserted to the shoulder and then withdrawn about 1.5 mm before welding. Without the gap, weld shrinkage puts the fillet root in tension and cracks it.",
      },
      {
        q: "Which class should be used?",
        a: "Match the class to the pipe schedule: Class 3000 with SCH 80, Class 6000 with SCH 160 and Class 9000 with XXS.",
      },
    ],
  },
  {
    slug: "threaded-fittings",
    name: "Threaded (NPT) Fittings",
    category: "forged-fittings",
    tagline: "Forged screwed fittings to ASME B16.11, Class 2000 to 6000",
    summary:
      "Forged threaded elbows, tees, couplings, unions, plugs, bushings and nipples with NPT or BSP threads for small-bore utility, instrument and low-hazard piping.",
    overview: [
      "Threaded forged fittings are joined by tapered pipe thread to ASME B1.20.1 (NPT) or BS 21 / ISO 7 (BSPT). They allow assembly and dismantling without welding, which suits instrument hook-ups, utility air, water services and temporary or maintenance-heavy systems.",
      "Classes are 2000, 3000 and 6000. Threaded joints are generally not permitted in flammable, toxic or cyclic service above the limits stated in the piping code, and seal welding is often required where they are allowed.",
      "Thread quality and sealant selection govern leak-tightness — PTFE tape or anaerobic sealant is used, never on the first two threads to avoid contamination of the process.",
    ],
    specs: [
      { label: "Size range", value: "NPS ⅛ – 4" },
      { label: "Pressure classes", value: "2000, 3000, 6000" },
      { label: "Threads", value: "NPT to ASME B1.20.1; BSPT / BSPP on request" },
      { label: "Types", value: "Elbow, tee, cross, coupling, union, plug, bushing, nipple, cap" },
      { label: "Options", value: "Seal weld preparation, hexagonal bodies" },
    ],
    features: [
      "No welding required for assembly",
      "Dismantlable for maintenance and instrument work",
      "Class 2000 to 6000 for a wide pressure envelope",
      "Full range of adaptors, unions and bushings",
    ],
    applications: [
      "Instrument hook-ups and impulse lines",
      "Utility air, water and nitrogen services",
      "Sample and drain points",
      "Workshop, plant and maintenance piping",
    ],
    standards: [
      "ASME B16.11 (dimensions)",
      "ASME B1.20.1 (NPT threads)",
      "ASTM A182 / A105 / A350 / B564",
      "BS 3799 on request",
      "MSS SP-25 marking",
    ],
    faqs: [
      {
        q: "Are threaded joints allowed in hydrocarbon service?",
        a: "Only within the limits of the piping code and project specification, usually with seal welding and a size restriction. Many offshore and refinery classes prohibit them altogether.",
      },
      {
        q: "NPT or BSP?",
        a: "NPT is the ASME standard and most common in project supply. BSPT and BSPP are used on European and Asian equipment — always confirm which thread form the mating equipment uses.",
      },
    ],
  },
  {
    slug: "branch-outlet-fittings",
    name: "Branch Outlet Fittings (Olets)",
    category: "forged-fittings",
    tagline: "Weldolet, sockolet, threadolet, elbolet and nipolet connections",
    summary:
      "Forged branch outlet fittings for reinforced pipe-to-pipe branch connections, welded directly to the run pipe in buttweld, socket weld or threaded configurations.",
    overview: [
      "Branch outlet fittings — commonly known by the '-olet' trade names — provide a self-reinforced branch connection where a full-size tee is unnecessary. The fitting is contour-machined to fit the run pipe outside diameter and welded on with a full-penetration weld.",
      "Weldolets provide a buttweld branch, sockolets a socket weld branch, threadolets a threaded branch, elbolets branch from an elbow and nipolets combine an outlet with an integral nipple for vent and drain points.",
      "Selection depends on branch-to-run ratio, pressure class and the run pipe schedule; the fitting must be ordered against both the run pipe size and schedule and the branch size and schedule.",
    ],
    specs: [
      { label: "Run pipe size", value: "NPS ½ – 48" },
      { label: "Branch size", value: "NPS ⅛ – 24" },
      { label: "Classes", value: "Standard, XS, XXS; Class 3000 / 6000 / 9000 socket and threaded" },
      { label: "Types", value: "Weldolet, sockolet, threadolet, elbolet, nipolet, latrolet, flangeolet" },
      { label: "Design", value: "MSS SP-97 integrally reinforced" },
    ],
    features: [
      "Integral reinforcement — no pad required",
      "Reduces branch fabrication time",
      "Contour machined to the run pipe OD",
      "Available in all alloy, stainless and carbon grades",
    ],
    applications: [
      "Branch connections on process headers",
      "Vent, drain and instrument take-offs",
      "Flare, relief and utility branches",
      "Pipeline station and skid piping",
    ],
    standards: [
      "MSS SP-97 (integrally reinforced outlets)",
      "ASME B31.1 / B31.3 branch reinforcement rules",
      "ASTM A182 / A105 / A350 / B564 material",
      "ASME B16.25 weld end preparation",
      "MSS SP-25 marking",
    ],
    faqs: [
      {
        q: "What information is needed to order an olet?",
        a: "Run pipe size and schedule, branch size and schedule, outlet type, material grade and pressure class. Both the run and branch data are required because the fitting is contour machined.",
      },
      {
        q: "Do olets need a reinforcing pad?",
        a: "No. MSS SP-97 outlets are integrally reinforced and the area replacement calculation is satisfied by the fitting itself.",
      },
    ],
  },
  {
    slug: "large-diameter-flanges",
    name: "Large Diameter Flanges (ASME B16.47)",
    category: "flanges",
    tagline: "Series A and Series B flanges from NPS 26 to 60",
    summary:
      "Weld neck and blind flanges above NPS 24 to ASME B16.47 Series A (MSS SP-44) and Series B (API 605) in Class 150 to 900 for large-bore headers and vessel nozzles.",
    overview: [
      "Above NPS 24 the ASME B16.5 tables stop and ASME B16.47 takes over. Series A, derived from MSS SP-44, is heavier with a larger bolt circle; Series B, derived from API 605, is lighter with more, smaller bolts. The two series are not interchangeable — mating a Series A flange to a Series B flange is a common and costly project error.",
      "Large flanges are supplied as forgings or as plate-cut and machined rings depending on class and material. Facing finish, bore matching to the pipe wall and flatness tolerance are critical because gasket seating on a large diameter is unforgiving.",
      "Weld neck and blind types dominate; slip-on and lap joint are available where the class permits.",
    ],
    specs: [
      { label: "Size range", value: "NPS 26 – 60 (larger to drawing)" },
      { label: "Series", value: "Series A (MSS SP-44) and Series B (API 605)" },
      { label: "Pressure classes", value: "150, 300, 400, 600, 900" },
      { label: "Types", value: "Weld neck, blind, slip-on, lap joint" },
      { label: "Facings", value: "RF, FF, RTJ; 125 – 250 µin AARH" },
    ],
    features: [
      "Series A and B supplied to project requirement",
      "Bore matched to the connecting pipe wall",
      "Flatness and facing finish reported",
      "Forged or plate-cut routes to suit class",
    ],
    applications: [
      "Large-bore process and utility headers",
      "Vessel and tank nozzle connections",
      "Cooling and seawater intake lines",
      "Pipeline station and manifold piping",
    ],
    standards: [
      "ASME B16.47 Series A / Series B",
      "MSS SP-44 / API 605",
      "ASTM A182 / A105 / B564 material",
      "ASME B16.20 / B16.21 gaskets",
      "MSS SP-25 marking",
    ],
    faqs: [
      {
        q: "How do I know whether Series A or B applies?",
        a: "The piping class or datasheet states it. If it does not, check the bolt circle and bolt count against the standard — the two series differ and cannot be bolted together.",
      },
      {
        q: "Are large flanges forged or cut from plate?",
        a: "Both routes are used. Higher classes and alloy grades are normally forged; lower-class large diameters are frequently plate-cut and machined where the specification permits it.",
      },
    ],
  },
];
