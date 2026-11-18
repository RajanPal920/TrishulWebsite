import type { Material } from "./types";

export const carbonMaterials: Material[] = [
  {
    slug: "carbon-steel-a106",
    name: "Carbon Steel ASTM A106 Grade B / C",
    uns: "K03006 / K03501",
    family: "carbon",
    tagline: "Seamless carbon steel pipe for high-temperature pressure service",
    summary:
      "Killed carbon steel seamless pipe for high-temperature refinery, boiler and process service, supplied to ASTM A106 Grade B or the higher-strength Grade C.",
    overview: [
      "ASTM A106 is the reference specification for seamless carbon steel pipe intended for high-temperature service. Grade B is the workhorse of refinery and power-plant piping; Grade C offers a higher tensile and yield for heavier duty or thinner-wall designs at the same pressure.",
      "Because A106 pipe is fully killed and manufactured seamless, it can be used in code piping under ASME B31.1 and B31.3 with the allowable stresses tabulated for elevated temperature. Grade A is available where cold bending or coiling is required and lower strength is acceptable.",
      "A106 is frequently dual certified with ASTM A53 Grade B and API 5L Grade B, but the three specifications are not interchangeable in code work — confirm which one governs the line class before ordering.",
    ],
    composition: [
      { element: "C", percent: "0.30 max (Gr B) / 0.35 max (Gr C)" },
      { element: "Mn", percent: "0.29 – 1.06" },
      { element: "P", percent: "0.035 max" },
      { element: "S", percent: "0.035 max" },
      { element: "Si", percent: "0.10 min" },
      { element: "Fe", percent: "Balance" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "415 MPa Gr B / 485 MPa Gr C" },
      { label: "Yield strength (min)", value: "240 MPa Gr B / 275 MPa Gr C" },
      { label: "Elongation", value: "Per ASTM A106 Table X" },
      { label: "Hardness", value: "Typically ≤ 197 HB" },
    ],
    physical: [
      { label: "Density", value: "7.85 g/cm³" },
      { label: "Modulus of elasticity", value: "200 GPa" },
      { label: "Thermal expansion", value: "12.0 µm/m·K" },
      { label: "Thermal conductivity", value: "51 W/m·K" },
    ],
    corrosion: [
      "No inherent corrosion resistance — protected by paint, galvanizing, FBE, 3LPE or lining.",
      "Suffers general and CO₂ (sweet) corrosion in wet service; corrosion allowance must be specified.",
      "Sour service requires NACE MR0175 / ISO 15156 hardness and heat-treatment control.",
      "Internal cement lining or epoxy used in water and firewater systems.",
    ],
    features: [
      "Seamless manufacture for pressure integrity",
      "Code-listed for ASME B31.1 / B31.3 service",
      "Hydro, UT and impact testing available",
      "Available bare, painted, galvanized or coated",
    ],
    applications: [
      "Refinery and petrochemical process piping",
      "Boiler and steam distribution systems",
      "Utility, firewater and plant air headers",
      "Oil and gas gathering and plant piping",
    ],
    standards: {
      flanges: ["ASTM A105 (forged flanges)", "ASME B16.5 / B16.47"],
      fittings: ["ASTM A234 WPB (buttweld)", "ASME B16.9 / B16.11 / B16.28"],
      other: ["ASTM A106 (seamless pipe)", "ASME B36.10M dimensions"],
    },
    comparison: [
      { vs: "ASTM A53 Gr B", note: "A53 permits welded manufacture and is a general-service pipe; A106 is seamless and code-rated for high temperature." },
      { vs: "API 5L Gr B", note: "API 5L is a line-pipe specification for transmission duty; A106 governs plant process piping." },
      { vs: "ASTM A333 Gr 6", note: "A333 Gr 6 is impact tested to −45 °C for low-temperature service; A106 is not." },
    ],
    faqs: [
      {
        q: "Is A106 Grade B the same as A53 Grade B?",
        a: "No. Chemistry and testing differ, though many mills dual certify. If the piping class calls out A106, the mill certificate must state A106.",
      },
      {
        q: "What sizes are available?",
        a: "NPS 1/8 to 48, schedules 10 through 160 plus STD, XS and XXS, in single random 4–7 m or double random 7–13 m lengths.",
      },
    ],
    maxTemp: "425 °C sustained; graphitisation limits apply above 427 °C",
  },
  {
    slug: "carbon-steel-a53",
    name: "Carbon Steel ASTM A53 Grade A / B",
    uns: "K02504 / K03005",
    family: "carbon",
    tagline: "Seamless and welded pipe for general, structural and pressure service",
    summary:
      "General-purpose carbon steel pipe available seamless, ERW or SAW, supplied black or hot-dip galvanized for utility, structural, firewater and mechanical service.",
    overview: [
      "ASTM A53 covers black and hot-dipped galvanized welded and seamless pipe for coiling, bending, flanging and general mechanical or pressure use. Type S is seamless, Type E is electric-resistance welded and Type F is furnace butt welded.",
      "Grade B is the common commercial supply and is widely used for firewater, compressed air, sprinkler mains and structural applications. Galvanized A53 is the standard for wet-pipe fire protection systems.",
      "A53 pipe is dimensionally identical to A106 (ASME B36.10M) so the same fittings, flanges and supports apply.",
    ],
    composition: [
      { element: "C", percent: "0.25 max (Gr A) / 0.30 max (Gr B)" },
      { element: "Mn", percent: "0.95 – 1.20 max" },
      { element: "P", percent: "0.05 max" },
      { element: "S", percent: "0.045 max" },
      { element: "Fe", percent: "Balance" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "330 MPa Gr A / 415 MPa Gr B" },
      { label: "Yield strength (min)", value: "205 MPa Gr A / 240 MPa Gr B" },
      { label: "Elongation", value: "Per ASTM A53 requirements" },
      { label: "Hydrostatic test", value: "Per specification or NDE substitution" },
    ],
    physical: [
      { label: "Density", value: "7.85 g/cm³" },
      { label: "Modulus of elasticity", value: "200 GPa" },
      { label: "Thermal expansion", value: "12.0 µm/m·K" },
      { label: "Galvanized coating", value: "Hot-dip zinc per specification" },
    ],
    corrosion: [
      "Black pipe requires coating or lining in wet service.",
      "Hot-dip galvanizing provides sacrificial protection for firewater and utility lines.",
      "Not suitable for sour or high-chloride process duty.",
      "Internal epoxy or cement lining available for water service.",
    ],
    features: [
      "Seamless, ERW or SAW manufacturing routes",
      "Black or hot-dip galvanized supply",
      "Threaded, plain or beveled ends",
      "Economical for utility and structural lines",
    ],
    applications: [
      "Firewater and sprinkler systems",
      "Compressed air, steam condensate and utilities",
      "Structural columns, piling and mechanical duty",
      "Water distribution and general plant piping",
    ],
    standards: {
      flanges: ["ASTM A105", "ASME B16.5"],
      fittings: ["ASTM A234 WPB", "ASME B16.9 / B16.11"],
      other: ["ASTM A53 (pipe)", "ASME B36.10M", "ASTM A123 galvanizing"],
    },
    comparison: [
      { vs: "ASTM A106 Gr B", note: "A106 is seamless only and rated for high-temperature code piping." },
      { vs: "API 5L Gr B", note: "API 5L targets pipeline transmission with tighter defect and toughness control." },
    ],
    faqs: [
      {
        q: "Can A53 be galvanized?",
        a: "Yes — hot-dip galvanized A53 is standard for firewater and utility service and is normally supplied with threaded and coupled or grooved ends.",
      },
      {
        q: "Is A53 suitable for pressure piping?",
        a: "Grade B is code listed for many B31.1 and B31.3 applications, but confirm the allowable stress and manufacturing type accepted by the piping class.",
      },
    ],
    maxTemp: "400 °C typical service limit",
  },
  {
    slug: "api-5l-line-pipe",
    name: "API 5L Line Pipe — Grade B, X42 to X80",
    uns: "API 5L PSL1 / PSL2",
    family: "carbon",
    tagline: "Transmission line pipe for oil, gas and water pipelines",
    summary:
      "Seamless, ERW, LSAW and SSAW line pipe from Grade B to X80 in PSL1 or PSL2, supplied with pipeline coatings and full traceability for transmission projects.",
    overview: [
      "API 5L is the governing specification for pipeline transmission of oil, gas and water. Product Specification Level 1 (PSL1) is a standard-quality pipe, while PSL2 adds mandatory chemistry limits, toughness, carbon-equivalent control and non-destructive testing — PSL2 is mandatory for sour and offshore projects.",
      "Higher grades X42 through X80 are micro-alloyed, thermomechanically processed steels that let designers use thinner walls at higher operating pressures, reducing tonnage and welding cost on long transmission lines.",
      "Manufacturing route matters: seamless for small bore and high wall, ERW for medium diameters, LSAW for heavy-wall large diameter and SSAW for large-diameter, lower-pressure water and slurry lines.",
    ],
    composition: [
      { element: "C", percent: "0.28 max PSL1; grade dependent PSL2" },
      { element: "Mn", percent: "1.20 – 1.70 by grade" },
      { element: "P", percent: "0.030 max (PSL2)" },
      { element: "S", percent: "0.030 max (PSL2)" },
      { element: "Nb + V + Ti", percent: "0.15 max total (micro-alloyed grades)" },
    ],
    mechanical: [
      { label: "Yield strength", value: "245 MPa (Gr B) to 555 MPa (X80)" },
      { label: "Tensile strength", value: "415 MPa (Gr B) to 625 MPa (X80)" },
      { label: "Charpy impact", value: "Per PSL2 at specified test temperature" },
      { label: "Hardness", value: "≤ 22 HRC for sour service" },
    ],
    physical: [
      { label: "Density", value: "7.85 g/cm³" },
      { label: "Wall thickness", value: "3 – 100 mm by manufacturing route" },
      { label: "Diameter", value: "1/2 in to 120 in NB" },
      { label: "Coatings", value: "3LPE, 3LPP, FBE, coal tar, cement lining" },
    ],
    corrosion: [
      "External protection by 3LPE / 3LPP / FBE coating plus cathodic protection.",
      "Sour service requires PSL2 with HIC and SSC testing to NACE TM0284 / TM0177.",
      "Internal flow coating or corrosion inhibition used for wet gas lines.",
      "CO₂ corrosion allowance defined by the pipeline design code.",
    ],
    features: [
      "PSL1 and PSL2 supply with full traceability",
      "Seamless, ERW, LSAW and SSAW routes",
      "Sour-service HIC / SSC tested options",
      "Pipeline coatings and bevelling applied to order",
    ],
    applications: [
      "Onshore and offshore oil and gas transmission",
      "Gathering networks and flowlines",
      "Water transmission and slurry pipelines",
      "Pipeline replacement and tie-in spools",
    ],
    standards: {
      flanges: ["MSS SP-44 line pipe flanges", "ASME B16.5 / B16.47"],
      fittings: ["ASTM A234 WPB / MSS SP-75 (WPHY)", "ASME B16.9"],
      other: ["API 5L PSL1 / PSL2", "ISO 3183", "NACE TM0284 (HIC)"],
    },
    comparison: [
      { vs: "ASTM A106 Gr B", note: "A106 is plant process pipe; API 5L is designed for pipeline transmission duty and defect control." },
      { vs: "X65 vs X42", note: "Higher grade allows a thinner wall at the same pressure, but weldability and preheat requirements tighten." },
    ],
    faqs: [
      {
        q: "PSL1 or PSL2?",
        a: "PSL2 imposes mandatory chemistry, toughness, carbon-equivalent and NDT requirements. Sour, offshore and high-consequence pipelines require PSL2.",
      },
      {
        q: "Which coating should be specified?",
        a: "3LPE is the general onshore standard, 3LPP suits higher operating temperatures, and FBE is used where field bending or concrete weight coating follows.",
      },
    ],
    maxTemp: "Design temperature per pipeline code; typically −29 °C to 120 °C",
  },
  {
    slug: "carbon-steel-a333-gr6",
    name: "Low-Temperature Steel ASTM A333 Grade 6",
    uns: "K03006",
    family: "carbon",
    tagline: "Impact-tested carbon steel pipe for cryogenic and low-temperature service",
    summary:
      "Seamless and welded low-temperature carbon steel pipe, Charpy impact tested at −45 °C, for LPG, ethylene, refrigeration and cold process piping.",
    overview: [
      "ASTM A333 Grade 6 is a normalised carbon-manganese steel with guaranteed Charpy V-notch toughness at −45 °C (−50 °F). It is the default low-temperature pipe for LPG, ammonia, ethylene and refrigeration circuits where ordinary A106 would fail a brittle-fracture assessment.",
      "The chemistry is close to A106 Grade B but with tighter control and mandatory impact testing on each heat and heat-treatment lot. Grade 1 and Grade 3 cover other temperature bands, with Grade 3 nickel-bearing for −101 °C.",
      "Matching components are A350 LF2 forgings for flanges and A420 WPL6 for buttweld fittings; mixing in ordinary A105 or A234 WPB defeats the low-temperature design.",
    ],
    composition: [
      { element: "C", percent: "0.30 max" },
      { element: "Mn", percent: "0.29 – 1.06" },
      { element: "P", percent: "0.025 max" },
      { element: "S", percent: "0.025 max" },
      { element: "Si", percent: "0.10 min" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "415 MPa" },
      { label: "Yield strength (min)", value: "240 MPa" },
      { label: "Charpy impact", value: "18 J average at −45 °C" },
      { label: "Condition", value: "Normalised or normalised and tempered" },
    ],
    physical: [
      { label: "Density", value: "7.85 g/cm³" },
      { label: "Modulus of elasticity", value: "200 GPa" },
      { label: "Size range", value: "NPS 1/8 to 36, SCH 10 to 160" },
      { label: "Manufacture", value: "Seamless or welded" },
    ],
    corrosion: [
      "No inherent corrosion resistance — coat or insulate as required.",
      "Cold insulation systems require corrosion-under-insulation control.",
      "Sour service requires additional NACE hardness verification.",
      "Painting systems specified for cold and cyclic service.",
    ],
    features: [
      "Guaranteed toughness at −45 °C",
      "Normalised condition on every lot",
      "Matches A350 LF2 and A420 WPL6 components",
      "Seamless and welded supply routes",
    ],
    applications: [
      "LPG, LNG boil-off and ethylene piping",
      "Ammonia and industrial refrigeration",
      "Cold process and cryogenic utility lines",
      "Offshore cold-service piping",
    ],
    standards: {
      flanges: ["ASTM A350 LF2", "ASME B16.5 / B16.47"],
      fittings: ["ASTM A420 WPL6", "ASME B16.9 / B16.11"],
      other: ["ASTM A333 Gr 6 (pipe)", "ASME B36.10M"],
    },
    comparison: [
      { vs: "ASTM A106 Gr B", note: "Same strength class, but only A333 Gr 6 carries mandatory low-temperature impact testing." },
      { vs: "A333 Gr 3", note: "Grade 3 is 3.5 % nickel for service down to −101 °C." },
    ],
    faqs: [
      {
        q: "Why can A106 not be used at −45 °C?",
        a: "A106 has no impact-testing requirement, so brittle fracture cannot be ruled out. Code minimum design metal temperature rules require impact-tested material such as A333 Grade 6.",
      },
      {
        q: "Are matching fittings required?",
        a: "Yes. Use A420 WPL6 fittings and A350 LF2 flanges so every component in the line is impact tested to the same temperature.",
      },
    ],
    maxTemp: "−45 °C minimum design metal temperature; 340 °C upper limit",
  },
  {
    slug: "carbon-steel-a105",
    name: "Forged Carbon Steel ASTM A105",
    uns: "K03504",
    family: "carbon",
    tagline: "Forged carbon steel flanges and fittings for ambient and elevated service",
    summary:
      "The standard forged carbon steel for flanges, forged fittings and valve bodies in ambient and elevated-temperature piping systems.",
    overview: [
      "ASTM A105 covers forged carbon steel piping components for ambient and higher-temperature service. It is the default material for Class 150 to 2500 flanges and Class 2000 to 9000 forged fittings in refinery, power and general process plants.",
      "Supply is normally in the as-forged, normalised or normalised and tempered condition, with hardness limited to 187 HB for NACE sour service. Where impact toughness is required, the low-temperature equivalent A350 LF2 must be substituted.",
      "A105 components are dimensionally interchangeable with stainless and alloy flanges to the same ASME standard, but galvanic pairing with stainless in wet service should be assessed.",
    ],
    composition: [
      { element: "C", percent: "0.35 max" },
      { element: "Mn", percent: "0.60 – 1.05" },
      { element: "P", percent: "0.035 max" },
      { element: "S", percent: "0.040 max" },
      { element: "Si", percent: "0.10 – 0.35" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "485 MPa / 70 ksi" },
      { label: "Yield strength (min)", value: "250 MPa / 36 ksi" },
      { label: "Elongation (min)", value: "22 %" },
      { label: "Hardness", value: "187 HB max (NACE)" },
    ],
    physical: [
      { label: "Density", value: "7.85 g/cm³" },
      { label: "Modulus of elasticity", value: "200 GPa" },
      { label: "Thermal expansion", value: "12.0 µm/m·K" },
      { label: "Condition", value: "As forged, normalised or N&T" },
    ],
    corrosion: [
      "No inherent corrosion resistance; painted or coated in service.",
      "Sour service requires hardness control per NACE MR0175.",
      "Galvanic coupling with stainless requires isolation kits in wet service.",
      "Flange facings protected during shipment and storage.",
    ],
    features: [
      "Forged for flange and fitting integrity",
      "Full range of ASME B16.5 classes and facings",
      "NACE hardness-controlled supply available",
      "Widely stocked, short lead time",
    ],
    applications: [
      "Refinery and process plant flanged joints",
      "Utility, steam and firewater systems",
      "Valve bodies and forged components",
      "Structural and skid piping",
    ],
    standards: {
      flanges: ["ASTM A105 / A105N", "ASME B16.5", "ASME B16.47", "MSS SP-44"],
      fittings: ["ASTM A105 forged fittings", "ASME B16.11"],
      other: ["ASTM A234 WPB buttweld counterparts"],
    },
    comparison: [
      { vs: "ASTM A350 LF2", note: "LF2 is the impact-tested low-temperature equivalent, mandatory below −29 °C." },
      { vs: "ASTM A182 F316L", note: "Stainless F316L is used where corrosion resistance rather than economy governs." },
    ],
    faqs: [
      {
        q: "A105 or A105N?",
        a: "A105N denotes the normalised condition, which is often specified for improved toughness and consistency and is required by many project specifications.",
      },
      {
        q: "Can A105 be used below −29 °C?",
        a: "No. ASME B31.3 requires impact-tested material below the curve limit — specify A350 LF2 instead.",
      },
    ],
    maxTemp: "425 °C sustained pressure service",
  },
  {
    slug: "carbon-steel-a350-lf2",
    name: "Forged Low-Temperature Steel ASTM A350 LF2",
    uns: "K03011",
    family: "carbon",
    tagline: "Impact-tested forged flanges and fittings for cold service",
    summary:
      "Normalised, Charpy impact-tested forged carbon steel for flanges, fittings and valve components in low-temperature and cryogenic piping.",
    overview: [
      "ASTM A350 Grade LF2 is the low-temperature counterpart of A105. It is normalised or quenched and tempered and Charpy impact tested at −46 °C for Class 1, providing the fracture toughness required by ASME B31.3 below the A105 curve limit.",
      "LF2 is supplied with the same ASME B16.5 and B16.47 dimensions as A105 flanges, so drop-in substitution is dimensionally straightforward when a piping class is upgraded to cold service.",
      "Pair LF2 flanges with A333 Grade 6 pipe and A420 WPL6 fittings for a fully impact-tested system.",
    ],
    composition: [
      { element: "C", percent: "0.30 max" },
      { element: "Mn", percent: "0.60 – 1.35" },
      { element: "P", percent: "0.035 max" },
      { element: "S", percent: "0.040 max" },
      { element: "Si", percent: "0.15 – 0.30" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "485 MPa / 70 ksi" },
      { label: "Yield strength (min)", value: "250 MPa / 36 ksi" },
      { label: "Charpy impact", value: "20 J average at −46 °C (Class 1)" },
      { label: "Hardness", value: "187 HB max for NACE service" },
    ],
    physical: [
      { label: "Density", value: "7.85 g/cm³" },
      { label: "Condition", value: "Normalised, or quenched and tempered" },
      { label: "Modulus of elasticity", value: "200 GPa" },
      { label: "Classes", value: "150 to 2500 (B16.5)" },
    ],
    corrosion: [
      "Coated and insulated for cold service; CUI control required.",
      "NACE MR0175 hardness limits apply in sour duty.",
      "Facings preserved with rust inhibitor and protectors.",
      "No inherent corrosion resistance.",
    ],
    features: [
      "Charpy tested at −46 °C on every lot",
      "Dimensionally interchangeable with A105",
      "Class 1 and Class 2 chemistry options",
      "NACE-compliant supply available",
    ],
    applications: [
      "LPG, LNG and ethylene plant piping",
      "Ammonia refrigeration systems",
      "Offshore cold-service flanged joints",
      "Cryogenic valve and instrument connections",
    ],
    standards: {
      flanges: ["ASTM A350 LF2 Class 1 / 2", "ASME B16.5", "ASME B16.47"],
      fittings: ["ASTM A350 LF2 forged fittings", "ASME B16.11"],
      other: ["ASTM A420 WPL6 buttweld counterparts", "ASTM A333 Gr 6 pipe"],
    },
    comparison: [
      { vs: "ASTM A105", note: "Same strength, but A105 has no impact requirement and cannot be used below the code curve limit." },
      { vs: "A350 LF3", note: "LF3 is 3.5 % nickel for service to −101 °C." },
    ],
    faqs: [
      {
        q: "What is the difference between LF2 Class 1 and Class 2?",
        a: "Class 2 has tighter chemistry and heat-treatment control giving improved toughness consistency; many project specifications call for Class 1 unless cold-work or PWHT considerations apply.",
      },
      {
        q: "Do impact test certificates come as standard?",
        a: "Yes — impact test results at the specified temperature are reported on the EN 10204 3.1 or 3.2 certificate for every heat and heat-treatment lot.",
      },
    ],
    maxTemp: "−46 °C minimum design metal temperature; 340 °C upper limit",
  },
  {
    slug: "carbon-steel-a234-wpb",
    name: "Buttweld Fitting Steel ASTM A234 WPB / WPC",
    uns: "K03006 / K03501",
    family: "carbon",
    tagline: "Wrought carbon steel buttweld fittings for pressure piping",
    summary:
      "Seamless and welded buttweld elbows, tees, reducers and caps in wrought carbon steel for moderate and elevated-temperature pressure piping.",
    overview: [
      "ASTM A234 covers wrought carbon and alloy steel fittings for moderate and elevated-temperature service. Grade WPB is the standard carbon steel grade matched to A106 Gr B and A53 Gr B pipe; WPC matches the higher-strength A106 Grade C.",
      "Fittings are formed by hot or cold forming from seamless or welded pipe or plate, then heat treated as required. Wall thickness must match the connecting pipe schedule, and the fitting is marked with the heat number, grade and manufacturing route.",
      "Dimensional standards are ASME B16.9 for factory-made buttweld fittings and B16.28 for short-radius elbows and returns; MSS SP-75 covers high-yield WPHY fittings for pipeline duty.",
    ],
    composition: [
      { element: "C", percent: "0.30 max (WPB) / 0.35 max (WPC)" },
      { element: "Mn", percent: "0.29 – 1.06" },
      { element: "P", percent: "0.050 max" },
      { element: "S", percent: "0.058 max" },
      { element: "Si", percent: "0.10 min" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "415 MPa WPB / 485 MPa WPC" },
      { label: "Yield strength (min)", value: "240 MPa WPB / 275 MPa WPC" },
      { label: "Hardness", value: "197 HB max typical" },
      { label: "Impact", value: "Only when supplementary requirement specified" },
    ],
    physical: [
      { label: "Size range", value: "NPS 1/2 to 48" },
      { label: "Schedules", value: "SCH 10 to 160, STD, XS, XXS" },
      { label: "Density", value: "7.85 g/cm³" },
      { label: "Radius", value: "Long radius 1.5D, short radius 1.0D" },
    ],
    corrosion: [
      "Coated to the same system as the connecting pipe.",
      "Sour service requires hardness verification per NACE MR0175.",
      "Bevel ends protected during transport.",
      "Internal lining applied where the line is lined.",
    ],
    features: [
      "Seamless and welded manufacturing routes",
      "Full B16.9 / B16.28 geometry range",
      "Heat-number marking and traceability",
      "Bevel to match connecting pipe wall",
    ],
    applications: [
      "Refinery and process buttweld piping",
      "Steam, condensate and utility headers",
      "Pipeline station and plant piping",
      "Firewater and structural systems",
    ],
    standards: {
      flanges: ["ASTM A105 counterpart flanges", "ASME B16.5"],
      fittings: ["ASTM A234 WPB / WPC", "ASME B16.9", "ASME B16.28", "MSS SP-75"],
      other: ["ASTM A420 WPL6 for low temperature"],
    },
    comparison: [
      { vs: "ASTM A420 WPL6", note: "WPL6 is impact tested for low-temperature service; WPB is not." },
      { vs: "ASTM A403 WP316L", note: "Stainless fittings are used where corrosion rather than temperature governs." },
    ],
    faqs: [
      {
        q: "Seamless or welded WPB fittings?",
        a: "Both are permitted by A234. Many project specifications require seamless below a given size or prohibit welded fittings in hydrocarbon service — check the piping class.",
      },
      {
        q: "How is the wall thickness specified?",
        a: "By the matching pipe schedule. State NPS and schedule (for example NPS 6 SCH 40) so the fitting bevel matches the pipe.",
      },
    ],
    maxTemp: "425 °C sustained pressure service",
  },
  {
    slug: "carbon-steel-a420-wpl6",
    name: "Low-Temperature Fitting Steel ASTM A420 WPL6",
    uns: "K03006",
    family: "carbon",
    tagline: "Impact-tested buttweld fittings for low-temperature piping",
    summary:
      "Wrought carbon steel buttweld fittings, Charpy impact tested at −46 °C, matched to A333 Grade 6 pipe and A350 LF2 flanges.",
    overview: [
      "ASTM A420 Grade WPL6 provides buttweld elbows, tees, reducers, caps and stub ends with guaranteed toughness at −46 °C. It completes the low-temperature system alongside A333 Gr 6 pipe and A350 LF2 forgings.",
      "Fittings are normalised after forming and impact tested per heat-treatment lot. Grade WPL3 covers 3.5 % nickel service to −101 °C.",
      "Where a project upgrades an existing carbon steel class for cold service, WPL6 is the direct replacement for A234 WPB with identical B16.9 dimensions.",
    ],
    composition: [
      { element: "C", percent: "0.30 max" },
      { element: "Mn", percent: "0.50 – 1.35" },
      { element: "P", percent: "0.035 max" },
      { element: "S", percent: "0.040 max" },
      { element: "Si", percent: "0.15 – 0.30" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "415 MPa" },
      { label: "Yield strength (min)", value: "240 MPa" },
      { label: "Charpy impact", value: "18 J average at −46 °C" },
      { label: "Condition", value: "Normalised or N&T" },
    ],
    physical: [
      { label: "Size range", value: "NPS 1/2 to 48" },
      { label: "Schedules", value: "SCH 10 to 160, STD, XS, XXS" },
      { label: "Density", value: "7.85 g/cm³" },
      { label: "Geometry", value: "ASME B16.9 / B16.28" },
    ],
    corrosion: [
      "Painted and insulated for cold service.",
      "Corrosion under insulation controlled by coating specification.",
      "NACE hardness limits apply in sour duty.",
      "Bevels protected in transit.",
    ],
    features: [
      "Impact tested at −46 °C per lot",
      "Dimensionally identical to A234 WPB",
      "Seamless and welded routes",
      "Full traceability and marking",
    ],
    applications: [
      "LPG and ethylene plant piping",
      "Ammonia refrigeration circuits",
      "Cryogenic utility systems",
      "Offshore cold-service lines",
    ],
    standards: {
      flanges: ["ASTM A350 LF2", "ASME B16.5"],
      fittings: ["ASTM A420 WPL6", "ASME B16.9", "ASME B16.28"],
      other: ["ASTM A333 Gr 6 pipe"],
    },
    comparison: [
      { vs: "ASTM A234 WPB", note: "Identical dimensions; WPL6 adds mandatory low-temperature impact testing." },
      { vs: "A420 WPL3", note: "WPL3 is 3.5 % nickel for −101 °C service." },
    ],
    faqs: [
      {
        q: "Do WPL6 fittings need PWHT?",
        a: "Post-weld heat treatment is governed by the welding procedure and thickness under the applicable code, not by the fitting grade itself.",
      },
      {
        q: "Can WPB and WPL6 be mixed in one line?",
        a: "No. Every pressure-containing component in a low-temperature line must meet the minimum design metal temperature requirement.",
      },
    ],
    maxTemp: "−46 °C minimum design metal temperature",
  },
  {
    slug: "carbon-steel-a516-gr70",
    name: "Pressure Vessel Plate ASTM A516 Grade 70",
    uns: "K02700",
    family: "carbon",
    tagline: "Notch-toughness carbon steel plate for pressure vessels",
    summary:
      "Fine-grain, normalised carbon steel plate for welded pressure vessels and boilers where improved notch toughness at moderate and lower temperatures is required.",
    overview: [
      "ASTM A516 Grade 70 is the standard pressure vessel quality plate for boiler drums, separators, storage vessels and heat exchanger shells. Fine-grain practice and optional normalising provide the notch toughness required by ASME Section VIII.",
      "Grades 55, 60, 65 and 70 differ in strength; Grade 70 is the most commonly specified. Impact testing at −46 °C is available with normalised plate for cold-service vessels.",
      "Plate is supplied with UT to SA-435 / SA-578 where laminations must be excluded, and with HIC testing for wet sour service.",
    ],
    composition: [
      { element: "C", percent: "0.27 max (thickness dependent)" },
      { element: "Mn", percent: "0.85 – 1.20" },
      { element: "P", percent: "0.035 max" },
      { element: "S", percent: "0.035 max" },
      { element: "Si", percent: "0.15 – 0.40" },
    ],
    mechanical: [
      { label: "Tensile strength", value: "485 – 620 MPa" },
      { label: "Yield strength (min)", value: "260 MPa" },
      { label: "Elongation (min)", value: "21 %" },
      { label: "Impact", value: "Optional Charpy to −46 °C (normalised)" },
    ],
    physical: [
      { label: "Thickness", value: "5 – 150 mm" },
      { label: "Width", value: "Up to 3000 mm" },
      { label: "Density", value: "7.85 g/cm³" },
      { label: "Condition", value: "As rolled, normalised or N&T" },
    ],
    corrosion: [
      "Painted, lined or clad depending on the vessel service.",
      "Wet sour service requires HIC testing per NACE TM0284.",
      "Stainless or nickel weld overlay used for corrosive contents.",
      "Corrosion allowance specified in the vessel design.",
    ],
    features: [
      "Fine-grain pressure vessel quality",
      "Normalised and impact-tested options",
      "UT to SA-435 / SA-578 on request",
      "Cut-to-size, bevelling and rolling available",
    ],
    applications: [
      "Pressure vessels and separators",
      "Boiler drums and steam equipment",
      "Storage tanks and heat exchanger shells",
      "Fabricated skids and structures",
    ],
    standards: {
      flanges: ["ASTM A105 nozzle flanges"],
      fittings: ["ASTM A234 WPB"],
      other: ["ASTM A516 / ASME SA-516", "SA-435 / SA-578 UT", "NACE TM0284 HIC"],
    },
    comparison: [
      { vs: "ASTM A36", note: "A36 is a structural plate with no pressure-vessel quality or toughness requirement." },
      { vs: "A537 Cl 1", note: "A537 is quenched and tempered for higher strength and better low-temperature toughness." },
    ],
    faqs: [
      {
        q: "Is normalising required?",
        a: "Normalising is required for thicker plate and where low-temperature impact values are specified; many vessel specifications call for it above 40 mm.",
      },
      {
        q: "Can plate be supplied cut to size?",
        a: "Yes — plasma, waterjet or saw cutting, bevelling, drilling and rolling are available with dimensional reports.",
      },
    ],
    maxTemp: "Vessel design temperature per ASME Section VIII",
  },
];
