import type { ProductType, ProductCategory } from "./products.types";
import { pipeProducts } from "./products.pipes";
import { forgedProducts } from "./products.forged";
import { longFlatProducts } from "./products.longflat";
import { pvcProducts } from "./products.pvc";

export * from "./products.types";

const coreProducts: ProductType[] = [

  {
    slug: "weld-neck-flanges",
    name: "Weld Neck Flanges",
    category: "flanges",
    tagline: "Butt-welded flange with a tapered hub for high-integrity pressure service",
    summary:
      "The preferred flange for high pressure, cyclic loading, high temperature and low temperature service, joined to the pipe by a full-penetration butt weld.",
    overview: [
      "A weld neck flange has a long tapered hub that transfers stress gradually from the flange ring into the pipe wall, eliminating the stress concentration found in slip-on and socket-weld joints. Because the joint is a full-penetration butt weld it can be fully radiographed, which is why weld neck flanges dominate critical piping in refineries, offshore facilities and high-pressure process plant.",
      "The bore of a weld neck flange must be specified to match the pipe schedule. A Class 300 NPS 6 flange with a Schedule 40 bore is a different item from the same flange with a Schedule 80 bore, and mismatched bores create a step at the root of the weld that inspectors will reject.",
      "Long weld neck (LWN) variants extend the hub to act as a nozzle or vessel connection, and are frequently machined from a single forging with the bore matching the vessel or heavy-wall pipe.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ – 24 (B16.5), NPS 26 – 60 (B16.47)" },
      { label: "Pressure classes", value: "150, 300, 400, 600, 900, 1500, 2500" },
      { label: "Facings", value: "RF, FF, RTJ, tongue & groove, male & female" },
      { label: "Bore", value: "Matched to specified pipe schedule (SCH 10S – XXS)" },
      { label: "Surface finish", value: "125 – 250 µin AARH serrated, or as specified" },
    ],
    features: [
      "Full-penetration butt weld — fully radiographable",
      "Best fatigue and thermal cycling performance",
      "Suitable for all pressure classes to 2500",
      "Bore-matched to pipe schedule on order",
    ],
    applications: [
      "High-pressure process and utility piping",
      "Offshore topside and subsea systems",
      "Steam, thermal cycling and cryogenic service",
      "Sour service piping under NACE MR0175",
    ],
    standards: [
      "ASME B16.5 / B16.47",
      "ASTM A182 (stainless / duplex)",
      "ASTM B564 (nickel alloy)",
      "MSS SP-44",
      "MSS SP-25 marking",
    ],
    faqs: [
      {
        q: "What information is required to quote a weld neck flange?",
        a: "Material grade and specification, NPS, pressure class, facing type, surface finish, bore or matching pipe schedule, applicable dimensional standard, quantity, and any testing or certification requirements.",
      },
      {
        q: "Why does the bore matter?",
        a: "The flange bore must match the connecting pipe inside diameter so the butt weld has no internal step. Specify the pipe schedule — for example SCH 40, SCH 80 or a wall thickness in mm — on every enquiry.",
      },
    ],
  },
  {
    slug: "slip-on-flanges",
    name: "Slip-On Flanges",
    category: "flanges",
    tagline: "Economical flange slipped over the pipe and fillet welded inside and out",
    summary:
      "Lower-cost flange for moderate pressure service where alignment tolerance matters more than fatigue strength.",
    overview: [
      "A slip-on flange slides over the pipe outside diameter and is secured by two fillet welds, one inside the bore and one on the hub face. Fabrication tolerance is generous and cut length is less critical than for weld neck joints, which reduces installation cost.",
      "The trade-off is strength: the fillet-welded joint has roughly one third the fatigue life of a butt-welded weld neck connection, and it cannot be fully radiographed. Most specifications restrict slip-on flanges to Class 150 and 300 non-cyclic, non-critical service and prohibit them in sour, cyclic or high-temperature systems.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ – 24 typical" },
      { label: "Pressure classes", value: "150, 300, 600 (limited)" },
      { label: "Facings", value: "RF, FF" },
      { label: "Bore", value: "Matched to pipe OD" },
    ],
    features: [
      "Lower cost than weld neck",
      "Generous alignment tolerance",
      "Two fillet welds, no root radiography",
      "Restricted in cyclic and sour service",
    ],
    applications: [
      "Utility water and air lines",
      "Low-pressure process piping",
      "Storage tank and vessel connections",
      "Non-critical plant services",
    ],
    standards: ["ASME B16.5", "ASTM A182", "ASTM B564", "MSS SP-44"],
    faqs: [
      {
        q: "Are slip-on flanges allowed in sour service?",
        a: "Most oil and gas specifications prohibit them in sour or cyclic service because the fillet weld cannot be volumetrically examined. Check the project piping class before enquiring.",
      },
    ],
  },
  {
    slug: "blind-flanges",
    name: "Blind Flanges",
    category: "flanges",
    tagline: "Solid flange used to terminate, isolate or provide access to a piping system",
    summary:
      "Unbored flange used to close the end of a piping system, vessel nozzle or valve, and to allow future tie-in or inspection access.",
    overview: [
      "Blind flanges carry the highest bending stress of any flange type at the same pressure class because the whole disc must resist the internal pressure. They are used to blank off pipe ends, nozzles and equipment openings, and are frequently installed at future tie-in points.",
      "Where regular access is needed, blind flanges may be supplied with a tapped centre connection, and where positive isolation is required for maintenance, spectacle blinds or line blinds are used instead.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ – 60" },
      { label: "Pressure classes", value: "150 – 2500" },
      { label: "Facings", value: "RF, FF, RTJ" },
      { label: "Options", value: "Tapped centre hole, lifting lugs, test connections" },
    ],
    features: [
      "Highest bending stress of all flange types",
      "Available with tapped or reducing centre connections",
      "Used for hydrotest and future tie-in points",
    ],
    applications: [
      "Pipeline and vessel terminations",
      "Future tie-in and expansion points",
      "Hydrotest blanking",
      "Pig launcher and receiver closures",
    ],
    standards: ["ASME B16.5", "ASME B16.47", "ASTM A182", "ASTM B564"],
    faqs: [
      {
        q: "Can a blind flange be drilled and tapped?",
        a: "Yes. State the tapping size, thread standard and location on the enquiry so it is machined during manufacture rather than in the field.",
      },
    ],
  },
  {
    slug: "socket-weld-flanges",
    name: "Socket Weld Flanges",
    category: "flanges",
    tagline: "Small-bore high-pressure flange with a socket bore and single fillet weld",
    summary:
      "Used on small-bore high-pressure piping where the pipe is inserted into a counterbore and secured with an external fillet weld.",
    overview: [
      "Socket weld flanges have a counterbore that receives the pipe end, which is then fillet welded externally. A 1.5 mm expansion gap must be maintained at the bottom of the socket to prevent weld cracking from thermal expansion during welding.",
      "They are common on instrument, chemical injection and small-bore process lines up to approximately NPS 2 in classes up to 1500, but the internal crevice makes them unsuitable for corrosive or hygienic service.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ – 2 typical, up to NPS 4" },
      { label: "Pressure classes", value: "150 – 1500" },
      { label: "Facings", value: "RF, FF" },
      { label: "Bore", value: "Socket counterbore to pipe OD and schedule" },
    ],
    features: [
      "Single external fillet weld",
      "No internal weld projection into the bore",
      "1.5 mm expansion gap required",
      "Crevice at socket root — avoid in corrosive media",
    ],
    applications: [
      "Small-bore hydraulic and instrument lines",
      "Chemical injection systems",
      "Steam tracing and utility connections",
    ],
    standards: ["ASME B16.5", "ASME B16.11 (dimensional reference)", "ASTM A182", "ASTM B564"],
    faqs: [
      {
        q: "Why is the 1.5 mm gap required in a socket weld joint?",
        a: "It allows the pipe to expand during welding. Without the gap, thermal expansion places the fillet weld root in tension and can cause cracking.",
      },
    ],
  },
  {
    slug: "threaded-flanges",
    name: "Threaded Flanges",
    category: "flanges",
    tagline: "Screwed flange for low-pressure and non-weldable applications",
    summary:
      "Flange with an internal NPT or BSP thread, used where welding is impractical or prohibited such as in flammable-atmosphere retrofit work.",
    overview: [
      "Threaded flanges are attached by screwing onto matching male pipe thread, eliminating welding entirely. They are used for utility service, galvanised piping and hazardous locations where hot work permits are difficult to obtain.",
      "Because thread engagement carries the load and the thread root forms a leak path, they are restricted to low pressure, non-cyclic and non-hazardous fluid service in most piping specifications.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ – 4 typical" },
      { label: "Pressure classes", value: "150 – 600" },
      { label: "Threads", value: "NPT per ASME B1.20.1, BSPT / BSPP on request" },
      { label: "Facings", value: "RF, FF" },
    ],
    features: [
      "No welding required",
      "Suitable for galvanised and lined piping",
      "Restricted to low-pressure non-cyclic service",
    ],
    applications: [
      "Utility air and water lines",
      "Retrofit work in hazardous areas",
      "Galvanised pipework",
    ],
    standards: ["ASME B16.5", "ASME B1.20.1", "ASTM A182", "ASTM B564"],
    faqs: [
      {
        q: "Can threaded flanges be seal welded?",
        a: "Some specifications permit seal welding of the thread for additional leak security, but this must be approved by the piping design authority and is not permitted on all materials.",
      },
    ],
  },
  {
    slug: "lap-joint-flanges",
    name: "Lap Joint Flanges",
    category: "flanges",
    tagline: "Two-piece flange with a loose backing ring and stub end",
    summary:
      "Used with stub ends so that only the stub end contacts the process fluid, allowing an economical carbon steel backing flange on alloy piping.",
    overview: [
      "A lap joint assembly consists of a stub end butt welded to the pipe and a loose backing flange that rotates freely for bolt hole alignment. Because the backing flange never contacts the process fluid, it can be a lower-cost material while the stub end matches the pipe alloy.",
      "This produces significant savings on nickel alloy and super duplex systems, and the free rotation makes alignment easy on large-diameter or frequently dismantled piping.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ – 24" },
      { label: "Pressure classes", value: "150 – 1500" },
      { label: "Assembly", value: "Backing flange + ASME B16.9 stub end" },
      { label: "Materials", value: "Alloy stub end with carbon or stainless backing flange" },
    ],
    features: [
      "Free-rotating backing flange for easy bolt alignment",
      "Cost saving on high-alloy systems",
      "Ideal for frequently dismantled joints",
      "Lower fatigue resistance than weld neck",
    ],
    applications: [
      "Alloy piping with cost-optimised backing flanges",
      "Systems requiring frequent dismantling",
      "Large-diameter low-pressure lines",
    ],
    standards: ["ASME B16.5", "ASME B16.9 (stub ends)", "ASTM A182", "ASTM B564", "MSS SP-43"],
    faqs: [
      {
        q: "Which stub end type should be used?",
        a: "Type A (short, ASME B16.9) is standard for lap joint flanges; Type B is used with slip-on flanges. Confirm the type and radius requirement on the enquiry.",
      },
    ],
  },
  {
    slug: "long-weld-neck-flanges",
    name: "Long Weld Neck Flanges",
    category: "flanges",
    tagline: "Extended-hub flange used as a vessel nozzle or heavy-wall connection",
    summary:
      "Weld neck flange with an extended straight hub, machined from a single forging and used as a nozzle, barrel connection or heavy-wall transition.",
    overview: [
      "Long weld neck (LWN) flanges replace the short tapered hub with a long straight section that functions as a nozzle neck. They are commonly used on pressure vessels, separators, pig traps and high-pressure manifolds, where the extended hub can be bored to any required inside diameter.",
      "Because the hub is machined from solid forging, wall thickness can exceed standard pipe schedules and the entire component remains a single piece with no intermediate weld.",
    ],
    specs: [
      { label: "Size range", value: "NPS 1 – 24, larger to drawing" },
      { label: "Pressure classes", value: "150 – 2500, API 6A on request" },
      { label: "Hub length", value: "Standard or to customer drawing" },
      { label: "Bore", value: "Standard bore, heavy barrel or as specified" },
    ],
    features: [
      "Single-piece forging, no intermediate weld",
      "Bore machined to any specified thickness",
      "Used as vessel nozzle and pig trap closure",
      "Available to customer drawing",
    ],
    applications: [
      "Pressure vessel and separator nozzles",
      "Pig launcher and receiver barrels",
      "High-pressure manifolds",
      "Heavy-wall transition connections",
    ],
    standards: ["ASME B16.5 (facing / drilling)", "ASME VIII (design reference)", "ASTM A182", "ASTM B564"],
    faqs: [
      {
        q: "Do LWN flanges follow B16.5 dimensions?",
        a: "The facing, bolt circle and thickness follow ASME B16.5 for the class, but the hub length and bore are usually specified by the purchaser on a drawing.",
      },
    ],
  },
  {
    slug: "orifice-flanges",
    name: "Orifice Flanges",
    category: "flanges",
    tagline: "Flange pair with pressure tappings for differential-pressure flow measurement",
    summary:
      "Supplied in pairs with jack screws, tappings and an orifice plate assembly to ASME B16.36 for flow metering runs.",
    overview: [
      "Orifice flanges carry radial pressure tappings — normally two per flange at 1/2 inch NPT — allowing differential pressure across an orifice plate to be measured. They are supplied as complete assemblies with jack screws, bolting, gaskets and the orifice plate where required.",
      "Dimensions follow ASME B16.36 for classes 300 and above; class 150 orifice flanges follow B16.5 with the tapping arrangement of B16.36. Accurate flow measurement depends on tapping location and internal finish, so machining requirements should be stated on the enquiry.",
    ],
    specs: [
      { label: "Size range", value: "NPS 1 – 24" },
      { label: "Pressure classes", value: "300, 400, 600, 900, 1500, 2500 (150 to B16.5)" },
      { label: "Tappings", value: "½ in NPT standard, ¾ in on request" },
      { label: "Supply", value: "Pairs with jack screws, plate, bolting and gaskets" },
    ],
    features: [
      "Manufactured to ASME B16.36",
      "Supplied as a metering assembly",
      "Weld neck, slip-on or threaded configurations",
      "Plate material and bore calculated to customer data",
    ],
    applications: [
      "Custody transfer and process flow metering",
      "Utility and steam flow measurement",
      "Gas processing metering runs",
    ],
    standards: ["ASME B16.36", "ASME B16.5", "ASTM A182", "ASTM B564", "ISO 5167 (metering reference)"],
    faqs: [
      {
        q: "Do you supply the orifice plate as well?",
        a: "Yes. Provide flow data or the required bore, plate material, thickness and bevel details so the plate can be manufactured with the flange pair.",
      },
    ],
  },
  {
    slug: "spectacle-blinds",
    name: "Spectacle Blinds & Line Blinds",
    category: "flanges",
    tagline: "Positive isolation components for maintenance and safe entry",
    summary:
      "Spectacle blinds, spacers and blank paddles machined to ASME B16.48 for positive mechanical isolation of piping systems.",
    overview: [
      "A spectacle blind is a single component with a solid disc and an open ring joined by a web; rotating it changes the line between blanked and open. Spacers and paddle blanks perform the same function as separate items and are lighter to handle in large sizes.",
      "Thickness is calculated from the pressure class and line size according to ASME B16.48, and marking must clearly identify the material, class, size and orientation so operators can verify isolation status visually.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ – 48" },
      { label: "Pressure classes", value: "150 – 2500" },
      { label: "Types", value: "Spectacle blind, spacer, paddle blank" },
      { label: "Standard", value: "ASME B16.48 thickness calculation" },
    ],
    features: [
      "Positive mechanical isolation for maintenance",
      "Handle and tag marking for visual status",
      "Thickness per ASME B16.48",
      "Supplied in matching alloy to the piping system",
    ],
    applications: [
      "Maintenance isolation and safe entry",
      "Commissioning and hydrotest isolation",
      "Batch process line switching",
    ],
    standards: ["ASME B16.48", "ASME B16.5 (facing reference)", "ASTM A182", "ASTM B564"],
    faqs: [
      {
        q: "How is spectacle blind thickness determined?",
        a: "From ASME B16.48 tables based on nominal size, pressure class and material allowable stress. Non-standard design pressures require a calculation, which can be supplied with the order.",
      },
    ],
  },
  {
    slug: "90-degree-elbows",
    name: "90° Elbows",
    category: "pipe-fittings",
    tagline: "Long and short radius buttweld elbows to ASME B16.9 and B16.28",
    summary:
      "The most common direction-change fitting, supplied in long radius (1.5D) and short radius (1.0D) forms in all alloy grades.",
    overview: [
      "Long radius 90° elbows have a centreline radius of 1.5 times the nominal diameter and are the default choice because the gentler bend reduces pressure drop and erosion. Short radius elbows (1.0D) are used where space is restricted, at the cost of higher turbulence and wall thinning at the extrados.",
      "Wall thickness must be specified by schedule and, for critical service, minimum wall after forming should be stated. Buttweld elbows are supplied with bevelled ends to ASME B16.25 for site welding.",
      "3D and 5D bends, mitre bends and induction bends are available where the piping layout or pigging requirement demands a larger radius.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ – 48" },
      { label: "Radius", value: "LR 1.5D standard, SR 1.0D, 3D / 5D on request" },
      { label: "Schedules", value: "SCH 10S – XXS and to specified wall" },
      { label: "Ends", value: "Bevelled per ASME B16.25" },
    ],
    features: [
      "Seamless or welded construction",
      "Minimum wall thickness verification available",
      "Full material traceability with heat number marking",
      "Available in all supplied alloy grades",
    ],
    applications: [
      "Process and utility piping direction changes",
      "Offshore topside and subsea spools",
      "Heat exchanger and manifold connections",
    ],
    standards: ["ASME B16.9", "ASME B16.28 (SR)", "ASTM A403", "ASTM A815", "ASTM B366", "MSS SP-43"],
    faqs: [
      {
        q: "Should I specify seamless or welded elbows?",
        a: "Seamless is normally required for sour service and high-pressure classes; welded (WP-W / WP-WX) is acceptable and more economical in many utility applications. The piping class governs.",
      },
    ],
  },
  {
    slug: "45-degree-elbows",
    name: "45° Elbows",
    category: "pipe-fittings",
    tagline: "Long radius 45° buttweld elbows for shallow direction changes",
    summary:
      "Used where a 90° turn is unnecessary, reducing pressure drop and simplifying spool geometry in pipe racks and manifolds.",
    overview: [
      "45° elbows are supplied in long radius form with a centreline radius of 1.5D. They are widely used to offset piping around obstructions, in pump suction geometry where flow disturbance must be minimised, and in slurry service where erosion at sharp turns is a concern.",
      "As with 90° elbows, wall thickness, end preparation and material specification must be stated. Minimum wall verification is available for critical piping classes.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ – 48" },
      { label: "Radius", value: "LR 1.5D standard" },
      { label: "Schedules", value: "SCH 10S – XXS" },
      { label: "Ends", value: "Bevelled per ASME B16.25" },
    ],
    features: [
      "Lower pressure drop than 90° turns",
      "Reduced erosion in slurry service",
      "Seamless and welded construction",
    ],
    applications: [
      "Pipe rack offsets and jog connections",
      "Pump suction and discharge geometry",
      "Slurry and abrasive service piping",
    ],
    standards: ["ASME B16.9", "ASTM A403", "ASTM A815", "ASTM B366", "MSS SP-43"],
    faqs: [
      {
        q: "Are short radius 45° elbows available?",
        a: "They are non-standard under B16.9. Where space is restricted, a mitred or custom-radius bend to drawing is the usual solution.",
      },
    ],
  },
  {
    slug: "180-degree-return-bends",
    name: "180° Return Bends",
    category: "pipe-fittings",
    tagline: "U-bends for heat exchangers, heater coils and hairpin loops",
    summary:
      "Long and short radius 180° returns to ASME B16.9 and B16.28, used to reverse flow direction in coils and exchanger bundles.",
    overview: [
      "Return bends reverse flow through 180°, and are the standard fitting for fired heater coils, hairpin exchangers and jacketed coils. Long radius returns have a centre-to-centre dimension of 3D while short radius returns are 2D.",
      "For fired heater service the extrados wall thinning during forming is critical, so minimum wall thickness and dimensional verification are commonly specified.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ – 24" },
      { label: "Radius", value: "LR (3D C-to-C) and SR (2D C-to-C)" },
      { label: "Schedules", value: "SCH 10S – XXS" },
      { label: "Ends", value: "Bevelled per ASME B16.25" },
    ],
    features: [
      "Long and short radius configurations",
      "Minimum wall verification for heater service",
      "Available in high-temperature alloy grades",
    ],
    applications: [
      "Fired heater and boiler coils",
      "Hairpin heat exchangers",
      "Jacketed and traced piping loops",
    ],
    standards: ["ASME B16.9", "ASME B16.28", "ASTM A403", "ASTM B366"],
    faqs: [
      {
        q: "Can return bends be supplied in Incoloy 800H?",
        a: "Yes — high-temperature grades including 800H / 800HT and alloy 625 are regularly supplied for heater and reformer service with the required grain size and creep-relevant certification.",
      },
    ],
  },
  {
    slug: "equal-tees",
    name: "Equal Tees",
    category: "pipe-fittings",
    tagline: "Straight buttweld tees for full-bore branch connections",
    summary:
      "Full-bore 90° branch fitting to ASME B16.9 with all three ends the same nominal size.",
    overview: [
      "Equal tees provide a full-size branch at 90° to the run. They are formed by hot or cold extrusion from pipe or forged from billet, and the crotch area is thickened during forming to compensate for the branch opening.",
      "For high-pressure and cyclic duty the reinforcement at the crotch and the internal contour are important, and dimensional plus wall thickness verification is commonly specified on critical lines.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ – 48" },
      { label: "Schedules", value: "SCH 10S – XXS" },
      { label: "Ends", value: "Bevelled per ASME B16.25" },
      { label: "Construction", value: "Seamless (WP-S) or welded (WP-W / WP-WX)" },
    ],
    features: [
      "Integral crotch reinforcement",
      "Seamless and welded construction",
      "Heat-number traceable marking",
    ],
    applications: [
      "Process headers and manifolds",
      "Utility distribution systems",
      "Offshore and subsea spool fabrication",
    ],
    standards: ["ASME B16.9", "ASTM A403", "ASTM A815", "ASTM B366", "MSS SP-43"],
    faqs: [
      {
        q: "What is the difference between a tee and a stub-in connection?",
        a: "A tee is a pre-formed fitting with integral reinforcement and is preferred for pressure-critical service. A stub-in is a site-welded branch which may require a reinforcing pad and additional NDE.",
      },
    ],
  },
  {
    slug: "reducing-tees",
    name: "Reducing Tees",
    category: "pipe-fittings",
    tagline: "Buttweld tee with a smaller branch outlet",
    summary:
      "Tee with a branch smaller than the run, eliminating a separate reducer and shortening the spool.",
    overview: [
      "Reducing tees combine a branch connection and a size change into one fitting, which reduces the number of welds and the overall spool length. The branch reduction is limited by ASME B16.9 tables — generally the branch should not be less than half the run size for standard fittings.",
      "Always state all three sizes in the order run × run × branch, for example 8 × 8 × 4, to avoid ambiguity.",
    ],
    specs: [
      { label: "Size range", value: "NPS ¾ – 48 run" },
      { label: "Designation", value: "Run × Run × Branch (e.g. 8 × 8 × 4)" },
      { label: "Schedules", value: "Independent schedule per end on request" },
      { label: "Ends", value: "Bevelled per ASME B16.25" },
    ],
    features: [
      "Eliminates a separate reducer and weld",
      "Independent branch schedule available",
      "Seamless and welded construction",
    ],
    applications: [
      "Process headers with smaller take-offs",
      "Instrument and injection connections",
      "Distribution manifolds",
    ],
    standards: ["ASME B16.9", "ASTM A403", "ASTM A815", "ASTM B366"],
    faqs: [
      {
        q: "How small can the branch be on a reducing tee?",
        a: "ASME B16.9 tabulates standard reductions; below roughly half the run size a forged branch outlet fitting or a full-size tee with a reducer is normally used instead.",
      },
    ],
  },
  {
    slug: "concentric-reducers",
    name: "Concentric Reducers",
    category: "pipe-fittings",
    tagline: "Symmetrical cone reducer keeping the pipe centrelines aligned",
    summary:
      "Buttweld reducer with a common centreline, used for vertical lines and wherever centreline alignment must be maintained.",
    overview: [
      "A concentric reducer has a symmetrical conical body so both ends share a centreline. It is the standard choice for vertical piping, pump discharge and any run where centreline alignment governs the layout.",
      "In horizontal liquid lines the concentric geometry creates a high point where vapour can collect, so eccentric reducers are usually specified instead on pump suction lines.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ × ⅜ – 48 × 42" },
      { label: "Schedules", value: "Independent schedule per end" },
      { label: "Length", value: "Per ASME B16.9 table" },
      { label: "Ends", value: "Bevelled per ASME B16.25" },
    ],
    features: [
      "Maintains centreline alignment",
      "Standard length per ASME B16.9",
      "Seamless and welded construction",
    ],
    applications: [
      "Vertical process and utility risers",
      "Pump discharge transitions",
      "Header size changes",
    ],
    standards: ["ASME B16.9", "ASTM A403", "ASTM A815", "ASTM B366", "MSS SP-43"],
    faqs: [
      {
        q: "When should a concentric reducer not be used?",
        a: "On horizontal pump suction lines, where the high point traps vapour and can cause cavitation. Use an eccentric reducer flat-side-up in that position.",
      },
    ],
  },
  {
    slug: "eccentric-reducers",
    name: "Eccentric Reducers",
    category: "pipe-fittings",
    tagline: "Offset reducer maintaining a flat top or bottom invert",
    summary:
      "Buttweld reducer with offset centrelines, used on horizontal lines to avoid vapour pockets or to keep a flat bottom for drainage.",
    overview: [
      "An eccentric reducer keeps one side of the pipe flat while the other tapers. Installed flat-side-up (FOT), it prevents vapour accumulation at pump suction; installed flat-side-down (FOB), it allows complete drainage of liquid lines.",
      "The orientation must be stated on the isometric — incorrect orientation of a single reducer on a pump suction line is a classic cause of cavitation and seal failure.",
    ],
    specs: [
      { label: "Size range", value: "NPS ¾ × ½ – 48 × 42" },
      { label: "Orientation", value: "Flat on top (FOT) or flat on bottom (FOB)" },
      { label: "Length", value: "Per ASME B16.9 table" },
      { label: "Ends", value: "Bevelled per ASME B16.25" },
    ],
    features: [
      "Prevents vapour pocket formation at pump suction",
      "Enables full drainage when installed FOB",
      "Same standard length as concentric reducers",
    ],
    applications: [
      "Pump suction lines",
      "Horizontal liquid headers requiring drainage",
      "Slurry and two-phase flow systems",
    ],
    standards: ["ASME B16.9", "ASTM A403", "ASTM A815", "ASTM B366"],
    faqs: [
      {
        q: "Which orientation is used on pump suction?",
        a: "Flat on top, so that no vapour pocket can form immediately upstream of the pump.",
      },
    ],
  },
  {
    slug: "pipe-caps",
    name: "Pipe Caps",
    category: "pipe-fittings",
    tagline: "Domed buttweld cap for permanent pipe end closure",
    summary:
      "Elliptical or hemispherical cap welded onto a pipe end to close the system permanently.",
    overview: [
      "Buttweld caps close pipe ends permanently, and are used at the ends of headers, on pig trap barrels and on vessel drain and vent stubs. The domed geometry carries pressure more efficiently than a flat closure and eliminates the bolted joint of a blind flange.",
      "Caps are supplied bevelled to ASME B16.25 in matching schedule and alloy. Where later access is required, a blind flange should be used instead.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ – 48" },
      { label: "Schedules", value: "SCH 10S – XXS" },
      { label: "Shape", value: "Elliptical dome per ASME B16.9" },
      { label: "Ends", value: "Bevelled per ASME B16.25" },
    ],
    features: [
      "Permanent leak-free closure",
      "No bolting or gasket required",
      "Seamless and welded construction",
    ],
    applications: [
      "Header and manifold terminations",
      "Pig trap closures",
      "Vent and drain stub closure",
    ],
    standards: ["ASME B16.9", "ASTM A403", "ASTM A815", "ASTM B366"],
    faqs: [
      {
        q: "Cap or blind flange?",
        a: "Use a cap where the closure is permanent and a blind flange where future access, tie-in or inspection is anticipated.",
      },
    ],
  },
  {
    slug: "stub-ends",
    name: "Stub Ends",
    category: "pipe-fittings",
    tagline: "Buttweld stub with a lapped face for use with lap joint flanges",
    summary:
      "Type A and Type B stub ends to ASME B16.9 and MSS SP-43, used with loose backing flanges to reduce alloy content in a flanged joint.",
    overview: [
      "A stub end is butt welded to the pipe and provides the sealing face for a lap joint assembly. Only the stub end is exposed to the process fluid, so the backing flange can be a cheaper material — an important saving on nickel alloy and super duplex systems.",
      "Type A (ASME B16.9) has a short barrel with a machined radius for lap joint flanges; Type B (MSS SP-43) has a longer barrel and is used with slip-on flanges. State the type, lap face finish and required length on the enquiry.",
    ],
    specs: [
      { label: "Size range", value: "NPS ½ – 24" },
      { label: "Types", value: "Type A (B16.9), Type B (MSS SP-43), long and short barrel" },
      { label: "Face finish", value: "Serrated or smooth, 125 – 250 µin AARH" },
      { label: "Ends", value: "Bevelled per ASME B16.25" },
    ],
    features: [
      "Only the stub end contacts the process fluid",
      "Backing flange free to rotate for bolt alignment",
      "Significant cost saving on high-alloy systems",
    ],
    applications: [
      "Alloy piping with economical backing flanges",
      "Frequently dismantled joints",
      "Chemical and pharmaceutical process lines",
    ],
    standards: ["ASME B16.9", "MSS SP-43", "ASTM A403", "ASTM A815", "ASTM B366"],
    faqs: [
      {
        q: "What face finish should be specified for stub ends?",
        a: "A serrated finish of 125–250 µin AARH is standard with spiral wound gaskets. Smooth finishes are specified for soft full-face gaskets and hygienic applications.",
      },
    ],
  },
];

export const productTypes: ProductType[] = [
  ...coreProducts,
  ...forgedProducts,
  ...pipeProducts,
  ...longFlatProducts,
  ...pvcProducts,
];

export const productsByCategory = (category: ProductCategory) =>
  productTypes.filter((p) => p.category === category);

export const productBySlug = (slug: string) => productTypes.find((p) => p.slug === slug);
