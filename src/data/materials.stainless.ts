import type { Material } from "./types";

export const stainlessMaterials: Material[] = [
  {
    slug: "stainless-steel-304",
    name: "Stainless Steel 304 / 304L",
    uns: "UNS S30400 / S30403",
    werkstoff: "1.4301 / 1.4307",
    family: "stainless",
    tagline: "The general-purpose austenitic stainless steel",
    summary:
      "18Cr-8Ni austenitic stainless steel offering good corrosion resistance, excellent formability and weldability for general process and utility service.",
    overview: [
      "Type 304 is the most widely produced stainless steel in the world. Its 18 % chromium and 8 % nickel austenitic structure provides good resistance to atmospheric corrosion, fresh water, organic acids and many process chemicals, together with excellent formability, toughness at cryogenic temperature and straightforward weldability.",
      "The low-carbon variant 304L limits carbon to 0.030 % maximum to prevent chromium carbide precipitation during welding, so it is used as welded without post-weld solution annealing. Most modern supply is dual certified 304 / 304L, meeting the carbon limit of 304L and the strength minimums of 304.",
      "304 is not suitable where chlorides are present in any significant concentration — pitting and chloride stress corrosion cracking are the usual failure mechanisms. For chloride service, 316L, duplex or a higher alloy should be specified.",
    ],
    composition: [
      { element: "Cr", percent: "18.0 – 20.0" },
      { element: "Ni", percent: "8.0 – 10.5" },
      { element: "C", percent: "0.08 max (0.030 max for 304L)" },
      { element: "Mn", percent: "2.00 max" },
      { element: "Si", percent: "0.75 max" },
      { element: "Fe", percent: "Balance" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "515 MPa / 75 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "205 MPa / 30 ksi (170 MPa for 304L)" },
      { label: "Elongation (min)", value: "35 %" },
      { label: "Hardness (max)", value: "201 HB / 92 HRB" },
    ],
    physical: [
      { label: "Density", value: "8.00 g/cm³" },
      { label: "PREN", value: "≈ 19" },
      { label: "Modulus of elasticity", value: "193 GPa" },
      { label: "Thermal expansion", value: "17.2 µm/m·K" },
    ],
    corrosion: [
      "Good resistance to atmospheric, fresh water and mild chemical environments.",
      "Susceptible to chloride pitting and stress corrosion cracking above ~60 °C.",
      "304L resists sensitisation in the as-welded condition.",
      "Not suitable for seawater or de-icing salt exposure.",
    ],
    features: [
      "Most economical austenitic grade",
      "Excellent formability and weldability",
      "Good cryogenic toughness",
      "Widely stocked in all flange and fitting configurations",
    ],
    applications: [
      "General process and utility piping",
      "Food, dairy and beverage equipment",
      "Architectural and structural components",
      "Water treatment and storage",
    ],
    standards: {
      flanges: ["ASTM A182 F304 / F304L", "ASME B16.5", "ASME B16.47", "MSS SP-44"],
      fittings: ["ASTM A403 WP304 / WP304L", "ASME B16.9", "ASME B16.11", "ASME B16.28"],
      other: ["ASTM A240 (plate)", "ASTM A276 (bar)", "ASTM A312 (pipe)"],
    },
    comparison: [
      { vs: "SS 316L", note: "316L adds 2 % molybdenum for markedly better chloride pitting resistance." },
      { vs: "Duplex 2205", note: "Duplex has double the strength and far better chloride SCC resistance." },
    ],
    faqs: [
      {
        q: "What does dual certified 304/304L mean?",
        a: "The heat meets the 0.030 % maximum carbon of 304L and the higher strength minimums of 304, so a single item can be certified to both. This is standard for most flanges and fittings.",
      },
      {
        q: "Can 304 be used with chlorinated water?",
        a: "Only at low chloride content and temperature. Chloride pitting and stress corrosion cracking risk rises sharply above ~60 °C and 200 ppm chloride; 316L or duplex should be considered.",
      },
    ],
    maxTemp: "870 °C (oxidation), ~425 °C for sustained pressure service",
  },
  {
    slug: "stainless-steel-316",
    name: "Stainless Steel 316 / 316L",
    uns: "UNS S31600 / S31603",
    werkstoff: "1.4401 / 1.4404",
    family: "stainless",
    tagline: "Molybdenum-bearing austenitic stainless steel for chloride service",
    summary:
      "The standard corrosion-resistant austenitic grade: 2–3 % molybdenum lifts pitting resistance well above 304 for marine and chemical process service.",
    overview: [
      "Type 316 adds 2–3 % molybdenum to the 18Cr-8Ni base, raising the pitting resistance equivalent number to about 25 and substantially improving resistance to chlorides, sulphurous compounds and many organic and inorganic acids.",
      "316L holds carbon to 0.030 % maximum, avoiding sensitisation in the heat-affected zone so that welded assemblies retain corrosion resistance without post-weld heat treatment. Dual certification as 316 / 316L is normal supply practice.",
      "316L is the default material for chemical, pharmaceutical, marine atmosphere and general offshore utility applications, but it remains vulnerable to chloride stress corrosion cracking above roughly 60 °C, which is where duplex grades take over.",
    ],
    composition: [
      { element: "Cr", percent: "16.0 – 18.0" },
      { element: "Ni", percent: "10.0 – 14.0" },
      { element: "Mo", percent: "2.00 – 3.00" },
      { element: "C", percent: "0.08 max (0.030 max for 316L)" },
      { element: "Mn", percent: "2.00 max" },
      { element: "Fe", percent: "Balance" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "515 MPa / 75 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "205 MPa / 30 ksi (170 MPa for 316L)" },
      { label: "Elongation (min)", value: "30 %" },
      { label: "Hardness (max)", value: "217 HB / 96 HRB" },
    ],
    physical: [
      { label: "Density", value: "8.00 g/cm³" },
      { label: "PREN", value: "≈ 25" },
      { label: "Modulus of elasticity", value: "193 GPa" },
      { label: "Thermal conductivity", value: "16.3 W/m·K" },
    ],
    corrosion: [
      "Good pitting resistance in moderate chloride environments.",
      "Resists sulphuric, phosphoric and organic acids at moderate concentration.",
      "Chloride stress corrosion cracking risk above ~60 °C.",
      "316L usable as welded without solution annealing.",
    ],
    features: [
      "Widest global availability of any CRA-grade stainless",
      "Excellent weldability and formability",
      "Cryogenic toughness to −196 °C",
      "Accepted in NACE MR0175 within defined limits",
    ],
    applications: [
      "Chemical and petrochemical process piping",
      "Pharmaceutical and food-grade systems",
      "Marine atmosphere and coastal installations",
      "Offshore utility and instrument piping",
    ],
    standards: {
      flanges: ["ASTM A182 F316 / F316L", "ASME B16.5", "ASME B16.47", "MSS SP-44"],
      fittings: ["ASTM A403 WP316 / WP316L", "ASME B16.9", "ASME B16.11", "ASME B16.28"],
      other: ["ASTM A240", "ASTM A276", "ASTM A312 / A358 (pipe)"],
    },
    comparison: [
      { vs: "SS 304L", note: "316L is markedly better in chlorides thanks to molybdenum; 304L is cheaper for clean service." },
      { vs: "Duplex 2205", note: "2205 has double the yield strength and far higher chloride SCC resistance for similar cost per tonne." },
      { vs: "SS 904L", note: "904L adds nickel, molybdenum and copper for sulphuric acid and higher chloride duty." },
    ],
    faqs: [
      {
        q: "Is 316L suitable for seawater?",
        a: "Not for continuous seawater service. Crevice corrosion under gaskets and deposits is the normal failure mode; super duplex, 6Mo or nickel alloys should be specified.",
      },
      {
        q: "What is the difference between 316 and 316Ti?",
        a: "316Ti is titanium stabilised for elevated-temperature service where carbide precipitation is a concern; 316L achieves the same objective at lower temperature by restricting carbon.",
      },
    ],
    maxTemp: "870 °C (oxidation), ~425 °C sustained pressure service",
  },
  {
    slug: "stainless-steel-321",
    name: "Stainless Steel 321",
    uns: "UNS S32100",
    werkstoff: "1.4541",
    family: "stainless",
    tagline: "Titanium-stabilised austenitic grade for 425–900 °C service",
    summary:
      "Titanium-stabilised 18-8 stainless steel that resists chromium carbide precipitation during prolonged exposure in the sensitisation range.",
    overview: [
      "Type 321 stabilises the 18Cr-8Ni composition with titanium at five times the carbon content, which preferentially forms titanium carbides and prevents chromium depletion at grain boundaries during service between 425 °C and 900 °C.",
      "It is the standard grade for expansion joints, exhaust systems, refinery heater tubes and any welded assembly that will operate in the sensitisation range where 304L would eventually sensitise.",
    ],
    composition: [
      { element: "Cr", percent: "17.0 – 19.0" },
      { element: "Ni", percent: "9.0 – 12.0" },
      { element: "Ti", percent: "5 × C min, 0.70 max" },
      { element: "C", percent: "0.08 max" },
      { element: "Mn", percent: "2.00 max" },
      { element: "Fe", percent: "Balance" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "515 MPa / 75 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "205 MPa / 30 ksi" },
      { label: "Elongation (min)", value: "35 %" },
      { label: "Hardness (max)", value: "217 HB" },
    ],
    physical: [
      { label: "Density", value: "8.00 g/cm³" },
      { label: "PREN", value: "≈ 18" },
      { label: "Modulus of elasticity", value: "193 GPa" },
    ],
    corrosion: [
      "Resists intergranular attack after long exposure at 425–900 °C.",
      "Corrosion resistance in aqueous media broadly similar to 304.",
      "Not resistant to significant chloride pitting.",
    ],
    features: [
      "Titanium stabilised against sensitisation",
      "Good creep strength to 900 °C",
      "Preferred for welded high-temperature assemblies",
    ],
    applications: [
      "Refinery and boiler heater components",
      "Expansion joints and bellows",
      "Aircraft and industrial exhaust systems",
      "High-temperature chemical process piping",
    ],
    standards: {
      flanges: ["ASTM A182 F321 / F321H", "ASME B16.5", "ASME B16.47"],
      fittings: ["ASTM A403 WP321 / WP321H", "ASME B16.9", "ASME B16.11"],
      other: ["ASTM A240", "ASTM A312"],
    },
    comparison: [
      { vs: "SS 347", note: "347 uses niobium stabilisation and is preferred where titanium loss during welding is a concern." },
      { vs: "SS 304L", note: "304L resists sensitisation during welding only; 321 resists it during service at temperature." },
    ],
    faqs: [
      {
        q: "When should 321H be specified instead of 321?",
        a: "321H carries a controlled higher carbon range (0.04–0.10 %) for improved creep-rupture strength and is required where ASME allowable stresses for high-temperature service are used.",
      },
    ],
    maxTemp: "900 °C",
  },
  {
    slug: "stainless-steel-347",
    name: "Stainless Steel 347",
    uns: "UNS S34700",
    werkstoff: "1.4550",
    family: "stainless",
    tagline: "Niobium-stabilised austenitic grade for high-temperature welded service",
    summary:
      "Niobium/columbium stabilised 18-8 stainless steel with superior weld-zone stability at elevated temperature compared with titanium-stabilised grades.",
    overview: [
      "Type 347 uses niobium (columbium) rather than titanium for carbide stabilisation. Niobium is not lost across the arc during welding, so 347 delivers more reliable stabilisation in weld metal and is preferred where the weld itself operates in the sensitisation range.",
      "It is widely specified for refinery, boiler and aerospace exhaust applications, with 347H used where creep allowables are required.",
    ],
    composition: [
      { element: "Cr", percent: "17.0 – 19.0" },
      { element: "Ni", percent: "9.0 – 13.0" },
      { element: "Nb + Ta", percent: "10 × C min, 1.00 max" },
      { element: "C", percent: "0.08 max" },
      { element: "Fe", percent: "Balance" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "515 MPa / 75 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "205 MPa / 30 ksi" },
      { label: "Elongation (min)", value: "35 %" },
      { label: "Hardness (max)", value: "201 HB" },
    ],
    physical: [
      { label: "Density", value: "8.00 g/cm³" },
      { label: "PREN", value: "≈ 18" },
      { label: "Modulus of elasticity", value: "193 GPa" },
    ],
    corrosion: [
      "Resists intergranular corrosion after service exposure at 425–900 °C.",
      "Aqueous corrosion resistance similar to 304.",
      "Limited chloride pitting resistance.",
    ],
    features: [
      "Niobium stabilisation survives welding",
      "347H available for creep service",
      "Good high-temperature strength",
    ],
    applications: [
      "Refinery heater and boiler piping",
      "Aircraft exhaust manifolds and collector rings",
      "High-temperature chemical plant",
      "Nuclear and power plant components",
    ],
    standards: {
      flanges: ["ASTM A182 F347 / F347H", "ASME B16.5", "ASME B16.47"],
      fittings: ["ASTM A403 WP347 / WP347H", "ASME B16.9", "ASME B16.11"],
      other: ["ASTM A240", "ASTM A312"],
    },
    comparison: [
      { vs: "SS 321", note: "347 stabilisation is more reliable in weld metal; 321 is often more economical and widely stocked." },
    ],
    faqs: [
      {
        q: "Can 321 and 347 be substituted for each other?",
        a: "They are functionally similar but are separate ASTM grades with different chemistry. Substitution requires written approval from the design authority.",
      },
    ],
    maxTemp: "900 °C",
  },
  {
    slug: "stainless-steel-904l",
    name: "Stainless Steel 904L",
    uns: "UNS N08904",
    werkstoff: "1.4539",
    family: "stainless",
    tagline: "High-alloy austenitic stainless steel for sulphuric acid service",
    summary:
      "Low-carbon, high-nickel austenitic stainless with molybdenum and copper for resistance to sulphuric and phosphoric acid and to chloride pitting.",
    overview: [
      "904L is a fully austenitic high-alloy stainless steel with approximately 25 % nickel, 4.5 % molybdenum and 1.5 % copper. The copper addition specifically improves resistance to sulphuric and phosphoric acids, while the high molybdenum content lifts PREN to about 35.",
      "It offers markedly better chloride stress corrosion cracking resistance than 316L thanks to the high nickel content, and it is fully austenitic so it retains formability and low-temperature toughness.",
      "904L is used for acid plant equipment, flue gas cleaning, seawater heat exchangers at moderate temperature and pickling lines.",
    ],
    composition: [
      { element: "Ni", percent: "23.0 – 28.0" },
      { element: "Cr", percent: "19.0 – 23.0" },
      { element: "Mo", percent: "4.0 – 5.0" },
      { element: "Cu", percent: "1.0 – 2.0" },
      { element: "C", percent: "0.020 max" },
      { element: "Fe", percent: "Balance" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "490 MPa / 71 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "220 MPa / 31 ksi" },
      { label: "Elongation (min)", value: "35 %" },
      { label: "Hardness (max)", value: "70 – 90 HRB typical" },
    ],
    physical: [
      { label: "Density", value: "8.00 g/cm³" },
      { label: "PREN", value: "≈ 35" },
      { label: "Modulus of elasticity", value: "190 GPa" },
    ],
    corrosion: [
      "Excellent resistance to sulphuric and phosphoric acids.",
      "High resistance to chloride stress corrosion cracking versus 316L.",
      "Good pitting resistance at PREN ≈ 35.",
      "Low carbon — resistant to intergranular attack as welded.",
    ],
    features: [
      "Fully austenitic, non-magnetic",
      "Copper-enhanced acid resistance",
      "Good formability and weldability",
    ],
    applications: [
      "Sulphuric acid plant and storage",
      "Flue gas cleaning and scrubbers",
      "Pickling lines and acid recovery",
      "Seawater heat exchangers at moderate temperature",
    ],
    standards: {
      flanges: ["ASTM A182 F904L / ASTM B462", "ASME B16.5", "ASME B16.47"],
      fittings: ["ASTM A403 WP904L / ASTM B366", "ASME B16.9", "ASME B16.11"],
      other: ["ASTM A240", "ASTM B625 (plate)"],
    },
    comparison: [
      { vs: "Alloy 20", note: "Very similar duty; alloy 20 is niobium stabilised with higher copper for sulphuric acid." },
      { vs: "254 SMO", note: "254 SMO has higher nitrogen and PREN ≈ 43 for seawater; 904L is better in sulphuric acid." },
      { vs: "Duplex 2205", note: "2205 has double the strength; 904L is superior in reducing acids." },
    ],
    faqs: [
      {
        q: "Is 904L a stainless steel or a nickel alloy?",
        a: "It is classified as a high-alloy austenitic stainless steel, but its UNS number N08904 sits in the nickel-alloy series because of its 25 % nickel content. Both ASTM A182 and ASTM B462 routes exist for forgings.",
      },
    ],
    maxTemp: "400 °C",
  },
  {
    slug: "254-smo",
    name: "254 SMO (6Mo Austenitic)",
    uns: "UNS S31254",
    werkstoff: "1.4547",
    family: "stainless",
    tagline: "6 % molybdenum super austenitic stainless for seawater",
    summary:
      "High-nitrogen 6Mo super austenitic stainless steel with PREN above 42, developed as an economical alternative to nickel alloys in seawater and bleach service.",
    overview: [
      "254 SMO contains approximately 20 % chromium, 18 % nickel, 6 % molybdenum and 0.20 % nitrogen. The nitrogen addition raises both strength and pitting resistance, giving a PREN above 42 and a critical crevice temperature well beyond that of 316L.",
      "As a fully austenitic material it retains excellent toughness, formability and weldability, which makes it easier to fabricate than duplex for complex geometries. It is widely used for seawater cooling, bleach plants, desalination and flue gas cleaning.",
      "Welding requires a nickel-base over-alloyed consumable such as ERNiCrMo-3 to avoid molybdenum segregation reducing weld corrosion resistance.",
    ],
    composition: [
      { element: "Cr", percent: "19.5 – 20.5" },
      { element: "Ni", percent: "17.5 – 18.5" },
      { element: "Mo", percent: "6.0 – 6.5" },
      { element: "N", percent: "0.18 – 0.25" },
      { element: "Cu", percent: "0.50 – 1.00" },
      { element: "C", percent: "0.020 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "650 MPa / 94 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "300 MPa / 44 ksi" },
      { label: "Elongation (min)", value: "35 %" },
      { label: "Hardness (max)", value: "223 HB" },
    ],
    physical: [
      { label: "Density", value: "8.00 g/cm³" },
      { label: "PREN", value: "≈ 43" },
      { label: "CPT (ASTM G48)", value: "> 50 °C typical" },
      { label: "Modulus of elasticity", value: "195 GPa" },
    ],
    corrosion: [
      "Excellent resistance to seawater pitting and crevice corrosion.",
      "Very high resistance to chloride stress corrosion cracking.",
      "Resists chlorinated and bleach-bearing process waters.",
      "Weld metal must be over-alloyed to maintain corrosion resistance.",
    ],
    features: [
      "Fully austenitic — easier fabrication than duplex",
      "PREN ≈ 43",
      "Good cryogenic toughness",
      "Cost-effective alternative to nickel alloys in seawater",
    ],
    applications: [
      "Seawater cooling and desalination piping",
      "Pulp bleaching plant",
      "Flue gas desulphurisation ducting",
      "Chemical tankers and offshore utility systems",
    ],
    standards: {
      flanges: ["ASTM A182 F44 / ASME SA182", "ASME B16.5", "ASME B16.47"],
      fittings: ["ASTM A403 WP-S31254", "ASME B16.9", "ASME B16.11"],
      other: ["ASTM A240", "ASTM A312", "NACE MR0175 (defined conditions)"],
    },
    comparison: [
      { vs: "Super Duplex 2507", note: "Comparable corrosion resistance; 2507 has much higher strength, 254 SMO has better formability." },
      { vs: "SS 316L", note: "254 SMO has roughly triple the molybdenum content and is suited to seawater where 316L fails." },
    ],
    faqs: [
      {
        q: "Which welding consumable is used for 254 SMO?",
        a: "An over-alloyed nickel-base filler such as ERNiCrMo-3 (alloy 625) or ERNiCrMo-13 is used so weld metal corrosion resistance matches the parent material.",
      },
      {
        q: "Is 254 SMO the same as F44?",
        a: "F44 is the ASTM A182 forging designation for UNS S31254; 254 SMO is the original trade name. Confirm whether your specification requires the proprietary licensed product.",
      },
    ],
    maxTemp: "400 °C",
  },
];
