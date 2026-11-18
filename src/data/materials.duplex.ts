import type { Material } from "./types";

export const duplexMaterials: Material[] = [
  {
    slug: "duplex-s31803",
    name: "Duplex UNS S31803",
    uns: "UNS S31803",
    werkstoff: "1.4462",
    family: "duplex",
    tagline: "Original 22 % chromium duplex stainless steel",
    summary:
      "Ferritic-austenitic stainless steel with roughly double the yield strength of 316L and strong resistance to chloride pitting and stress corrosion cracking.",
    overview: [
      "UNS S31803 is the original 22 % chromium duplex grade. Its balanced ferrite-austenite microstructure — typically 40–60 % ferrite — delivers a minimum yield strength of 450 MPa, about twice that of austenitic 316L, allowing thinner wall sections and lower installed weight.",
      "The combination of 22 % chromium, 3 % molybdenum and nitrogen gives a PREN of approximately 34, providing good resistance to chloride pitting, crevice corrosion and chloride stress corrosion cracking in environments where 316L would fail.",
      "S31803 has a wider chemistry window than the newer S32205; where the specification allows either, most mills now supply dual-certified S31803 / S32205 material meeting the tighter nitrogen and chromium ranges of 2205.",
    ],
    composition: [
      { element: "Cr", percent: "21.0 – 23.0" },
      { element: "Ni", percent: "4.5 – 6.5" },
      { element: "Mo", percent: "2.5 – 3.5" },
      { element: "N", percent: "0.08 – 0.20" },
      { element: "C", percent: "0.030 max" },
      { element: "Mn", percent: "2.00 max" },
      { element: "Fe", percent: "Balance" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "620 MPa / 90 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "450 MPa / 65 ksi" },
      { label: "Elongation (min)", value: "25 %" },
      { label: "Hardness (max)", value: "290 HB / 30 HRC" },
    ],
    physical: [
      { label: "Density", value: "7.80 g/cm³" },
      { label: "PREN", value: "≈ 34" },
      { label: "Ferrite content", value: "35 – 65 %" },
      { label: "Modulus of elasticity", value: "200 GPa" },
    ],
    corrosion: [
      "High resistance to chloride stress corrosion cracking compared with austenitic grades.",
      "Good pitting and crevice resistance at PREN ≈ 34.",
      "Resists organic acids and many process chemicals.",
      "Service limited to approximately 300 °C to avoid 475 °C embrittlement.",
    ],
    features: [
      "Yield strength roughly double 316L",
      "Lower nickel content than austenitics — more stable pricing",
      "Ferrite content control required during welding",
      "Impact tested to −46 °C on request",
    ],
    applications: [
      "Oil and gas process piping",
      "Chemical tankers and cargo piping",
      "Desalination and brine handling",
      "Pulp and paper digesters",
    ],
    standards: {
      flanges: ["ASTM A182 F51 / ASME SA182", "ASME B16.5", "ASME B16.47", "MSS SP-44"],
      fittings: ["ASTM A815 WP-S31803", "ASME B16.9", "ASME B16.11", "ASME B16.28"],
      other: ["ASTM A240 (plate)", "ASTM A276 (bar)", "NACE MR0175 / ISO 15156-3", "NORSOK M-630 (project specific, subject to applicable MDS)"],
    },
    comparison: [
      { vs: "Duplex 2205 (S32205)", note: "S32205 has tighter nitrogen and chromium minimums; most modern supply is dual certified." },
      { vs: "SS 316L", note: "Duplex offers double the strength and far better chloride SCC resistance at comparable cost." },
    ],
    faqs: [
      {
        q: "What ferrite content is required in duplex welds?",
        a: "Typically 35–65 % ferrite measured by ASTM E562 point count or by ferritescope calibrated per AWS A4.2. Project specifications frequently narrow this to 35–55 %.",
      },
      {
        q: "Is S31803 the same as 2205?",
        a: "They are closely related. 2205 (S32205) is a refined version with higher minimum nitrogen and chromium. Dual-certified material satisfying both is standard in modern supply.",
      },
    ],
    maxTemp: "300 °C",
  },
  {
    slug: "duplex-2205",
    name: "Duplex 2205 (UNS S32205)",
    uns: "UNS S32205",
    werkstoff: "1.4462",
    family: "duplex",
    tagline: "The industry-standard 22 % Cr duplex stainless steel",
    summary:
      "Refined 22 % chromium duplex grade with higher minimum nitrogen for improved weld-zone corrosion performance and consistent phase balance.",
    overview: [
      "Duplex 2205 is the most widely used duplex stainless steel in the world. Compared with the original S31803 chemistry, S32205 raises the minimum nitrogen to 0.14 % and tightens the chromium and molybdenum ranges, which improves corrosion resistance in the weld heat-affected zone and stabilises austenite reformation after welding.",
      "With a PREN of approximately 35 and a minimum yield strength of 450 MPa, 2205 handles chloride-bearing process fluids, seawater cooling at moderate temperature, and sour service within NACE MR0175 / ISO 15156 limits.",
      "Trishul supplies 2205 forged flanges to ASTM A182 F60 and buttweld fittings to ASTM A815 WP-S32205, with ferrite count, impact and corrosion (ASTM A923 / G48) testing available on request.",
    ],
    composition: [
      { element: "Cr", percent: "22.0 – 23.0" },
      { element: "Ni", percent: "4.5 – 6.5" },
      { element: "Mo", percent: "3.0 – 3.5" },
      { element: "N", percent: "0.14 – 0.20" },
      { element: "C", percent: "0.030 max" },
      { element: "P", percent: "0.030 max" },
      { element: "Fe", percent: "Balance" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "620 MPa / 90 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "450 MPa / 65 ksi" },
      { label: "Elongation (min)", value: "25 %" },
      { label: "Impact (typical requirement)", value: "45 J at −46 °C" },
    ],
    physical: [
      { label: "Density", value: "7.80 g/cm³" },
      { label: "PREN", value: "≈ 35" },
      { label: "CPT (ASTM G48 A)", value: "≈ 25 – 35 °C" },
      { label: "Thermal expansion", value: "13.7 µm/m·K" },
    ],
    corrosion: [
      "Excellent chloride stress corrosion cracking resistance.",
      "Critical pitting temperature typically 25–35 °C in ferric chloride testing.",
      "Accepted for sour service within NACE MR0175 / ISO 15156 partial-pressure limits.",
      "Avoid prolonged exposure between 300 °C and 1000 °C due to sigma phase and 475 °C embrittlement.",
    ],
    features: [
      "Global reference duplex grade with wide availability",
      "ASTM A923 and G48 testing available",
      "Weight saving through higher allowable stress",
      "Good machinability compared with super duplex",
    ],
    applications: [
      "Offshore topside and utility piping",
      "Seawater and produced water systems",
      "Chemical tanker cargo lines",
      "Desalination evaporators and RO plant",
    ],
    standards: {
      flanges: ["ASTM A182 F60 / ASME SA182", "ASME B16.5", "ASME B16.47", "MSS SP-44"],
      fittings: ["ASTM A815 WP-S32205", "ASME B16.9", "ASME B16.11", "ASME B16.28"],
      other: ["ASTM A240", "ASTM A923 (intermetallic testing)", "NORSOK M-630 (project specific, subject to applicable MDS)"],
    },
    comparison: [
      { vs: "Super Duplex 2507", note: "2507 has PREN ≈ 42 and higher strength for seawater and higher chloride duty." },
      { vs: "SS 904L", note: "904L is austenitic with better acid resistance; 2205 is stronger and more SCC resistant." },
      { vs: "Inconel 625", note: "625 extends the temperature and H2S envelope far beyond 2205 at several times the cost." },
    ],
    faqs: [
      {
        q: "What testing should be specified for duplex 2205 flanges?",
        a: "Typically chemical analysis, tensile, hardness, ferrite count, Charpy impact at −46 °C, and ASTM A923 Method C or ASTM G48 Method A corrosion testing where the project specification requires it.",
      },
      {
        q: "Can duplex 2205 be used in seawater?",
        a: "It is used for seawater at moderate temperature and with chlorination control, but super duplex or 6Mo grades are normally specified for continuous, warm or stagnant seawater duty.",
      },
      {
        q: "What is the maximum design temperature?",
        a: "Most codes limit duplex to approximately 300 °C because of 475 °C embrittlement risk on long exposure.",
      },
    ],
    maxTemp: "300 °C",
  },
  {
    slug: "super-duplex-2507",
    name: "Super Duplex 2507 (UNS S32750)",
    uns: "UNS S32750",
    werkstoff: "1.4410",
    family: "super-duplex",
    tagline: "25 % Cr super duplex with PREN above 40 for seawater service",
    summary:
      "High-alloy duplex stainless steel with 25 % chromium, 4 % molybdenum and 0.27 % nitrogen, giving PREN above 40 and 550 MPa minimum yield strength.",
    overview: [
      "Super Duplex 2507 is the reference super duplex grade for seawater and high-chloride service. Its PREN above 40 places it in the super duplex class, which project specifications typically define as PREN ≥ 40, and the critical pitting temperature commonly exceeds 50 °C in ASTM G48 Method A testing.",
      "With a minimum yield strength of 550 MPa it enables significant weight savings against austenitic alternatives, an important advantage on offshore topsides. It is used extensively for seawater lift, firewater ring mains, produced water, and subsea manifolds.",
      "Because intermetallic phase precipitation is more rapid than in 2205, forging, heat treatment and welding procedures must be tightly controlled. ASTM A923 and G48 acceptance testing is normal for critical service, and Trishul can supply flanges and fittings with these tests witnessed by third-party inspection.",
    ],
    composition: [
      { element: "Cr", percent: "24.0 – 26.0" },
      { element: "Ni", percent: "6.0 – 8.0" },
      { element: "Mo", percent: "3.0 – 5.0" },
      { element: "N", percent: "0.24 – 0.32" },
      { element: "C", percent: "0.030 max" },
      { element: "Cu", percent: "0.50 max" },
      { element: "Fe", percent: "Balance" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "800 MPa / 116 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "550 MPa / 80 ksi" },
      { label: "Elongation (min)", value: "15 %" },
      { label: "Hardness (max)", value: "310 HB / 32 HRC" },
    ],
    physical: [
      { label: "Density", value: "7.80 g/cm³" },
      { label: "PREN", value: "≥ 40 (typically 42)" },
      { label: "CPT (ASTM G48 A)", value: "> 50 °C typical" },
      { label: "Ferrite content", value: "35 – 55 %" },
    ],
    corrosion: [
      "Excellent resistance to pitting and crevice corrosion in warm seawater.",
      "Very high resistance to chloride stress corrosion cracking.",
      "Suitable for sour service within NACE MR0175 / ISO 15156-3 limits.",
      "Not suitable above ~300 °C due to sigma phase and 475 °C embrittlement.",
    ],
    features: [
      "PREN ≥ 40 super duplex classification",
      "550 MPa minimum yield strength",
      "ASTM A923 / G48 corrosion testing available",
      "Supply against applicable NORSOK M-630 MDS on project requirement",
    ],
    applications: [
      "Seawater lift and firewater systems",
      "Subsea manifolds and jumpers",
      "Desalination high-pressure piping",
      "Chemical process and produced-water systems",
    ],
    standards: {
      flanges: ["ASTM A182 F53 / ASME SA182", "ASME B16.5", "ASME B16.47", "MSS SP-44"],
      fittings: ["ASTM A815 WP-S32750", "ASME B16.9", "ASME B16.11", "ASME B16.28"],
      other: ["ASTM A923", "ASTM G48 Method A", "NORSOK M-630 (subject to applicable MDS)", "NACE MR0175"],
    },
    comparison: [
      { vs: "Super Duplex S32760", note: "S32760 (F55) adds tungsten and copper; both are PREN ≥ 40, but project specifications rarely allow substitution." },
      { vs: "Duplex 2205", note: "2507 has ~7 °C higher CPT and 100 MPa higher yield strength for the most demanding seawater duty." },
      { vs: "6Mo / 254 SMO", note: "254 SMO is austenitic with better formability; 2507 offers much higher strength." },
    ],
    faqs: [
      {
        q: "What is the difference between S32750 and S32760?",
        a: "S32750 (2507) relies on Cr-Mo-N; S32760 (Zeron 100 / F55) adds tungsten and copper and carries a defined PREN ≥ 40 formula including tungsten. Performance is broadly comparable but they are separate UNS numbers and cannot be substituted without approval.",
      },
      {
        q: "Which corrosion test is normally specified for super duplex flanges?",
        a: "ASTM G48 Method A at 50 °C for 24 hours with no pitting and a weight-loss limit, or ASTM A923 Method C. The test temperature is set by the project specification.",
      },
      {
        q: "Is super duplex suitable for sour service?",
        a: "Yes, within the partial pressure, chloride and temperature limits defined in NACE MR0175 / ISO 15156-3 for the relevant material group, with hardness capped at 32 HRC.",
      },
    ],
    maxTemp: "300 °C",
  },
  {
    slug: "super-duplex-s32760",
    name: "Super Duplex UNS S32760 (F55)",
    uns: "UNS S32760",
    werkstoff: "1.4501",
    family: "super-duplex",
    tagline: "Tungsten and copper enhanced super duplex for offshore service",
    summary:
      "Super duplex grade (commonly known as Zeron 100 / F55) with tungsten and copper additions and a specified PREN of 40 minimum.",
    overview: [
      "UNS S32760 is a super duplex stainless steel with deliberate tungsten (0.5–1.0 %) and copper (0.5–1.0 %) additions. The specification requires a calculated PREN of at least 40 using the tungsten-inclusive formula, making it a defined super duplex material rather than one that merely happens to meet the number.",
      "It is heavily used in North Sea and Middle East offshore projects for seawater systems, subsea equipment and process piping, frequently to NORSOK M-630 and client-specific requirements including 3.2 certification and full corrosion testing.",
      "Flanges are supplied to ASTM A182 F55 and fittings to ASTM A815 WP-S32760 with ferrite count, impact testing at −46 °C and ASTM G48 corrosion testing where specified.",
    ],
    composition: [
      { element: "Cr", percent: "24.0 – 26.0" },
      { element: "Ni", percent: "6.0 – 8.0" },
      { element: "Mo", percent: "3.0 – 4.0" },
      { element: "W", percent: "0.50 – 1.00" },
      { element: "Cu", percent: "0.50 – 1.00" },
      { element: "N", percent: "0.20 – 0.30" },
      { element: "C", percent: "0.030 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "750 MPa / 109 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "550 MPa / 80 ksi" },
      { label: "Elongation (min)", value: "25 %" },
      { label: "Hardness (max)", value: "270 HB typical spec limit" },
    ],
    physical: [
      { label: "Density", value: "7.84 g/cm³" },
      { label: "PREN (W formula)", value: "≥ 40" },
      { label: "CPT (ASTM G48 A)", value: "> 50 °C typical" },
      { label: "Ferrite content", value: "35 – 55 %" },
    ],
    corrosion: [
      "Excellent seawater pitting and crevice corrosion resistance.",
      "High resistance to chloride SCC and to sulphide stress cracking within MR0175 limits.",
      "Copper addition improves behaviour in some reducing acids.",
      "Sigma phase risk requires controlled solution annealing and rapid quench.",
    ],
    features: [
      "Specified PREN ≥ 40 including tungsten",
      "Supply against applicable NORSOK M-630 MDS with 3.2 certification available",
      "Widely approved on offshore project material lists",
      "Full impact and corrosion test packages available",
    ],
    applications: [
      "Offshore seawater and firewater systems",
      "Subsea hardware and connectors",
      "FPSO process and produced water piping",
      "Desalination high-pressure trains",
    ],
    standards: {
      flanges: ["ASTM A182 F55 / ASME SA182", "ASME B16.5", "ASME B16.47", "MSS SP-44"],
      fittings: ["ASTM A815 WP-S32760", "ASME B16.9", "ASME B16.11", "ASME B16.28"],
      other: ["NORSOK M-630 (subject to applicable MDS)", "ASTM A923", "ASTM G48 Method A", "NACE MR0175"],
    },
    comparison: [
      { vs: "Super Duplex 2507", note: "Similar corrosion performance; F55 is specified where the project material list calls for the tungsten-bearing grade." },
      { vs: "Duplex 2205", note: "F55 is required where chloride content, temperature or crevice risk exceeds 2205 limits." },
    ],
    faqs: [
      {
        q: "Is F55 the same as Zeron 100?",
        a: "Zeron 100 is a proprietary trade name for a material meeting UNS S32760 / ASTM A182 F55. Some project specifications require the proprietary licensed product specifically — check the material requisition wording.",
      },
      {
        q: "What certification is normally required?",
        a: "EN 10204 3.1 as standard; many offshore projects require 3.2 certification with third-party witness of mechanical, ferrite and corrosion testing.",
      },
    ],
    maxTemp: "300 °C",
  },
];
