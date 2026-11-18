import type { Material } from "./types";

export const stainlessExtraMaterials: Material[] = [
  {
    slug: "stainless-steel-310s",
    name: "Stainless Steel 310 / 310S",
    uns: "UNS S31000 / S31008",
    werkstoff: "1.4841 / 1.4845",
    family: "stainless",
    tagline: "High chromium-nickel heat-resistant austenitic stainless steel",
    summary:
      "25Cr-20Ni austenitic stainless steel for continuous high-temperature service to 1150 °C in furnace, heat-treatment and thermal-processing equipment.",
    overview: [
      "Type 310S is the low-carbon version of 310, a 25 % chromium, 20 % nickel austenitic grade developed for oxidation resistance at high temperature. The high chromium content forms a stable, adherent oxide scale that resists spalling under thermal cycling.",
      "310S is used for furnace parts, radiant tubes, muffles, burner components, heat-treatment fixtures and kiln linings. It retains useful creep strength to about 1035 °C in continuous service and 1150 °C intermittently.",
      "The grade should not be used in high-sulphur reducing atmospheres, where nickel sulphide eutectics attack the alloy, and prolonged exposure between 600 °C and 900 °C causes sigma-phase embrittlement that reduces room-temperature ductility.",
    ],
    composition: [
      { element: "Cr", percent: "24.0 – 26.0" },
      { element: "Ni", percent: "19.0 – 22.0" },
      { element: "C", percent: "0.08 max (0.08 for 310S)" },
      { element: "Mn", percent: "2.00 max" },
      { element: "Si", percent: "1.50 max" },
      { element: "Fe", percent: "Balance" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "515 MPa / 75 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "205 MPa / 30 ksi" },
      { label: "Elongation (min)", value: "40 %" },
      { label: "Hardness (max)", value: "217 HB / 95 HRB" },
    ],
    physical: [
      { label: "Density", value: "7.98 g/cm³" },
      { label: "PREN", value: "≈ 25" },
      { label: "Modulus of elasticity", value: "200 GPa" },
      { label: "Thermal expansion", value: "15.9 µm/m·K" },
    ],
    corrosion: [
      "Excellent oxidation resistance in air to 1150 °C intermittent, 1035 °C continuous.",
      "Resists carburising and nitriding atmospheres better than 304 and 316.",
      "Poor performance in high-sulphur reducing atmospheres.",
      "Sigma-phase embrittlement after long exposure at 600 – 900 °C.",
    ],
    features: [
      "Highest oxidation resistance of the standard austenitics",
      "Good creep strength at elevated temperature",
      "Low-carbon 310S for improved weldability",
      "Available as pipe, tube, plate, bar, flanges and fittings",
    ],
    applications: [
      "Furnace muffles, retorts and radiant tubes",
      "Heat-treatment baskets and fixtures",
      "Kiln linings and burner components",
      "Cryogenic service where toughness is required",
    ],
    standards: {
      flanges: ["ASTM A182 F310 / F310S", "ASME B16.5", "ASME B16.47"],
      fittings: ["ASTM A403 WP310 / WP310S", "ASME B16.9", "ASME B16.11"],
      other: ["ASTM A240 (plate)", "ASTM A312 (pipe)", "ASTM A213 (tube)", "ASTM A276 (bar)"],
    },
    comparison: [
      { vs: "SS 321 / 347", note: "Stabilised grades suit 500 – 800 °C pressure service; 310S is for higher-temperature furnace duty." },
      { vs: "Incoloy 800H", note: "800H offers better creep-rupture strength for pressure-retaining high-temperature components." },
    ],
    faqs: [
      {
        q: "What is the difference between 310 and 310S?",
        a: "310S has a controlled lower carbon level for better weldability and reduced carbide precipitation; 310 with higher carbon gives slightly better creep strength.",
      },
      {
        q: "Can 310S be used in sulphur-bearing atmospheres?",
        a: "Not in reducing sulphidising conditions — the high nickel content forms low-melting sulphides. A high-chromium, lower-nickel alloy should be evaluated instead.",
      },
    ],
    maxTemp: "1035 °C continuous, 1150 °C intermittent",
  },
  {
    slug: "stainless-steel-317l",
    name: "Stainless Steel 317L",
    uns: "UNS S31703",
    werkstoff: "1.4438",
    family: "stainless",
    tagline: "High-molybdenum austenitic stainless for aggressive chemical service",
    summary:
      "Low-carbon austenitic stainless with 3 – 4 % molybdenum giving markedly better pitting and crevice resistance than 316L in sulphurous and chloride-bearing process streams.",
    overview: [
      "317L raises the molybdenum content to 3 – 4 % and the nickel to 11 – 15 %, giving a PREN of about 29 to 32 against roughly 25 for 316L. It sits between 316L and 904L in the corrosion-resistance ladder and is the natural upgrade when 316L pits in a chemical process.",
      "The grade is widely used in flue gas desulphurisation, pulp and paper bleach plants, chemical process vessels and condenser tubing where sulphurous acid and chlorides are both present.",
      "The low carbon content prevents sensitisation during welding, so 317L is used as welded in most fabricated equipment without post-weld solution annealing.",
    ],
    composition: [
      { element: "Cr", percent: "18.0 – 20.0" },
      { element: "Ni", percent: "11.0 – 15.0" },
      { element: "Mo", percent: "3.0 – 4.0" },
      { element: "C", percent: "0.030 max" },
      { element: "Mn", percent: "2.00 max" },
      { element: "Fe", percent: "Balance" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "515 MPa / 75 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "205 MPa / 30 ksi" },
      { label: "Elongation (min)", value: "35 %" },
      { label: "Hardness (max)", value: "217 HB / 95 HRB" },
    ],
    physical: [
      { label: "Density", value: "8.00 g/cm³" },
      { label: "PREN", value: "≈ 29 – 32" },
      { label: "Modulus of elasticity", value: "193 GPa" },
      { label: "Thermal expansion", value: "16.5 µm/m·K" },
    ],
    corrosion: [
      "Better pitting and crevice resistance than 316L in chloride and sulphurous media.",
      "Good resistance to sulphuric, phosphoric and organic acids at moderate concentration.",
      "Still susceptible to chloride stress corrosion cracking above ~60 °C.",
      "Low carbon avoids sensitisation in the as-welded condition.",
    ],
    features: [
      "Molybdenum upgrade over 316L at moderate cost",
      "As-welded corrosion performance",
      "Available in plate, pipe, tube, bar and fittings",
      "Good formability and weldability",
    ],
    applications: [
      "Flue gas desulphurisation systems",
      "Pulp and paper bleach plant equipment",
      "Chemical and pharmaceutical process vessels",
      "Condenser and heat exchanger tubing",
    ],
    standards: {
      flanges: ["ASTM A182 F317L", "ASME B16.5", "ASME B16.47"],
      fittings: ["ASTM A403 WP317L", "ASME B16.9", "ASME B16.11"],
      other: ["ASTM A240 (plate)", "ASTM A312 (pipe)", "ASTM A276 / A479 (bar)"],
    },
    comparison: [
      { vs: "SS 316L", note: "317L adds 1 – 2 % more molybdenum, raising PREN from about 25 to 30." },
      { vs: "SS 904L", note: "904L adds copper and higher nickel for sulphuric acid and better SCC resistance." },
      { vs: "Duplex 2205", note: "2205 gives double the strength and far better chloride SCC resistance at similar cost." },
    ],
    faqs: [
      {
        q: "When should 316L be upgraded to 317L?",
        a: "When pitting or crevice attack is observed in service, or when the design chloride content and temperature put 316L close to its critical pitting temperature.",
      },
      {
        q: "Is 317L resistant to chloride SCC?",
        a: "No. Like all standard austenitics it remains susceptible above about 60 °C — duplex or a 6Mo grade should be considered where SCC governs.",
      },
    ],
    maxTemp: "870 °C oxidation; ~425 °C sustained pressure service",
  },
];
