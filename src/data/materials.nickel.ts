import type { Material } from "./types";

export const nickelMaterials: Material[] = [
  {
    slug: "inconel-600",
    name: "Inconel 600",
    uns: "UNS N06600",
    werkstoff: "2.4816",
    family: "nickel",
    tagline: "Nickel-chromium alloy for high-temperature and chloride stress-corrosion service",
    summary:
      "Solid-solution nickel-chromium-iron alloy with useful strength from cryogenic temperatures to approximately 1093 °C and immunity to chloride-ion stress corrosion cracking.",
    overview: [
      "Inconel 600 is a solid-solution strengthened nickel-chromium-iron alloy that combines high-temperature oxidation resistance with practical resistance to chloride-ion stress corrosion cracking. The high nickel content gives it good behaviour in reducing conditions, while the chromium content provides resistance to oxidising media and hot sulphur-free atmospheres.",
      "The alloy is not age-hardenable and is supplied in the annealed condition for forged flanges and fittings. Because it retains ductility and toughness after long exposure at elevated temperature, it is widely specified for furnace components, heat treating fixtures, retorts and nuclear steam generator hardware.",
      "Trishul Metals & Alloys supplies Inconel 600 forged flanges to ASTM B564 / ASME SB564 and buttweld fittings to ASTM B366 / ASME SB366, each against heat-traceable EN 10204 3.1 certification.",
    ],
    composition: [
      { element: "Ni (plus Co)", percent: "72.0 min" },
      { element: "Cr", percent: "14.0 – 17.0" },
      { element: "Fe", percent: "6.0 – 10.0" },
      { element: "C", percent: "0.15 max" },
      { element: "Mn", percent: "1.00 max" },
      { element: "S", percent: "0.015 max" },
      { element: "Si", percent: "0.50 max" },
      { element: "Cu", percent: "0.50 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "550 MPa / 80 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "240 MPa / 35 ksi" },
      { label: "Elongation in 4D (min)", value: "30 %" },
      { label: "Typical hardness", value: "≤ 195 HB (annealed)" },
    ],
    physical: [
      { label: "Density", value: "8.47 g/cm³" },
      { label: "Melting range", value: "1354 – 1413 °C" },
      { label: "Modulus of elasticity", value: "207 GPa" },
      { label: "Thermal conductivity (20 °C)", value: "14.9 W/m·K" },
    ],
    corrosion: [
      "Effectively immune to chloride-ion stress corrosion cracking.",
      "Resists dry chlorine and hydrogen chloride to approximately 550 °C.",
      "Good resistance to caustic alkalis and to high-purity water.",
      "Not recommended for sulphur-bearing atmospheres above ~315 °C or for strongly oxidising acid mixtures.",
    ],
    features: [
      "Service temperature from cryogenic up to ~1093 °C",
      "Non age-hardenable, supplied solution annealed",
      "Excellent resistance to chloride SCC",
      "Good weldability with ERNiCr-3 filler",
    ],
    applications: [
      "Furnace muffles, retorts and heat treating fixtures",
      "Nuclear steam generator and reactor core hardware",
      "Chemical and food processing vessels",
      "Titanium dioxide and caustic evaporation plant",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5", "ASME B16.47", "MSS SP-44"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9", "ASME B16.11", "ASME B16.28"],
      other: ["ASTM B168 (plate/sheet)", "ASTM B166 (rod/bar)"],
    },
    comparison: [
      { vs: "Inconel 601", note: "601 adds aluminium for superior cyclic oxidation resistance above 1000 °C." },
      { vs: "Incoloy 800H", note: "800H is iron-based and lower cost, but 600 offers better chloride SCC resistance." },
    ],
    faqs: [
      {
        q: "Is Inconel 600 suitable for sour service?",
        a: "Inconel 600 is not the usual choice for NACE MR0175 / ISO 15156 sour service. Alloy 625, 825 or C-276 are normally specified where H2S is present; confirm the requirement with the project specification.",
      },
      {
        q: "Which welding consumable is used for Inconel 600?",
        a: "ERNiCr-3 (Alloy 82) filler wire or ENiCrFe-3 (Alloy 182) electrodes are typically used for both similar and dissimilar joints.",
      },
    ],
    maxTemp: "1093 °C intermittent",
  },
  {
    slug: "inconel-601",
    name: "Inconel 601",
    uns: "UNS N06601",
    werkstoff: "2.4851",
    family: "nickel",
    tagline: "Aluminium-bearing nickel-chromium alloy for cyclic high-temperature oxidation",
    summary:
      "Nickel-chromium alloy with an aluminium addition that forms a tightly adherent oxide, giving outstanding resistance to cyclic oxidation up to 1200 °C.",
    overview: [
      "Inconel 601 develops a tenacious alumina-rich surface oxide that resists spalling during thermal cycling. This makes it a preferred material for radiant tubes, muffles, thermocouple protection and combustion hardware where alloy 600 would suffer oxide loss.",
      "The alloy also has useful resistance to carburisation and to oxidising nitrogen atmospheres, and it retains creep-rupture strength well above 1000 °C.",
      "Forged flanges and buttweld fittings are supplied solution annealed with full chemical and mechanical certification.",
    ],
    composition: [
      { element: "Ni (plus Co)", percent: "58.0 – 63.0" },
      { element: "Cr", percent: "21.0 – 25.0" },
      { element: "Al", percent: "1.0 – 1.7" },
      { element: "Fe", percent: "Balance" },
      { element: "C", percent: "0.10 max" },
      { element: "Cu", percent: "1.0 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "550 MPa / 80 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "205 MPa / 30 ksi" },
      { label: "Elongation (min)", value: "30 %" },
      { label: "Typical hardness", value: "≤ 200 HB" },
    ],
    physical: [
      { label: "Density", value: "8.11 g/cm³" },
      { label: "Melting range", value: "1360 – 1411 °C" },
      { label: "Modulus of elasticity", value: "206 GPa" },
      { label: "Thermal conductivity (20 °C)", value: "11.2 W/m·K" },
    ],
    corrosion: [
      "Outstanding resistance to cyclic oxidation to 1200 °C.",
      "Good carburisation resistance in furnace atmospheres.",
      "Resists nitriding better than most austenitic stainless steels.",
      "Limited resistance in strongly sulphidising atmospheres.",
    ],
    features: [
      "Alumina-forming surface oxide resists spalling",
      "High creep-rupture strength above 1000 °C",
      "Good room-temperature formability",
      "Weldable with ERNiCrFe-11 / ENiCrFe-3",
    ],
    applications: [
      "Radiant tubes and furnace retorts",
      "Thermal processing baskets and fixtures",
      "Petrochemical flare and incinerator components",
      "Gas turbine combustion hardware",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5", "ASME B16.47"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9", "ASME B16.11"],
      other: ["ASTM B168 (plate)", "ASTM B166 (bar)"],
    },
    comparison: [
      { vs: "Inconel 600", note: "601 is the correct choice where thermal cycling causes oxide spalling on 600." },
      { vs: "Incoloy 800HT", note: "800HT is more economical for steady-state creep service; 601 wins on cyclic oxidation." },
    ],
    faqs: [
      {
        q: "What is the maximum continuous service temperature for Inconel 601?",
        a: "Approximately 1150 °C continuous and 1200 °C intermittent in oxidising atmospheres, subject to the design code and stress level.",
      },
    ],
    maxTemp: "1200 °C intermittent",
  },
  {
    slug: "inconel-617",
    name: "Inconel 617",
    uns: "UNS N06617",
    werkstoff: "2.4663",
    family: "nickel",
    tagline: "Ni-Cr-Co-Mo alloy for extreme creep-rupture strength",
    summary:
      "Solid-solution strengthened nickel-chromium-cobalt-molybdenum alloy combining exceptional creep-rupture strength with oxidation resistance above 980 °C.",
    overview: [
      "Inconel 617 uses cobalt and molybdenum for solid-solution strengthening and chromium plus aluminium for oxidation resistance, producing one of the strongest solid-solution nickel alloys available for very high temperature structural service.",
      "It is used for gas turbine ducting, combustion cans, catalytic reactor internals and high-temperature piping systems, including advanced high-temperature reactor programmes.",
      "Forgings and fittings are supplied solution annealed; grain size and rupture testing can be witnessed by third-party inspection where the specification requires it.",
    ],
    composition: [
      { element: "Ni", percent: "44.5 min" },
      { element: "Cr", percent: "20.0 – 24.0" },
      { element: "Co", percent: "10.0 – 15.0" },
      { element: "Mo", percent: "8.0 – 10.0" },
      { element: "Al", percent: "0.8 – 1.5" },
      { element: "Fe", percent: "3.0 max" },
      { element: "C", percent: "0.05 – 0.15" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "655 MPa / 95 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "240 MPa / 35 ksi" },
      { label: "Elongation (min)", value: "35 %" },
      { label: "Typical hardness", value: "≤ 210 HB" },
    ],
    physical: [
      { label: "Density", value: "8.36 g/cm³" },
      { label: "Melting range", value: "1332 – 1380 °C" },
      { label: "Modulus of elasticity", value: "211 GPa" },
      { label: "Thermal conductivity (20 °C)", value: "13.6 W/m·K" },
    ],
    corrosion: [
      "Excellent oxidation resistance to approximately 1100 °C.",
      "Resists carburising and nitriding atmospheres.",
      "Good resistance to a wide range of corrosive aqueous media at ambient temperature.",
    ],
    features: [
      "Highest creep-rupture strength of the solid-solution Ni-Cr grades",
      "ASME Section VIII and Section I code accepted",
      "Retains ductility after long thermal exposure",
      "Weldable with ERNiCrCoMo-1 filler",
    ],
    applications: [
      "Gas turbine combustors and transition ducts",
      "High-temperature process piping and headers",
      "Petrochemical catalyst regenerator internals",
      "Advanced power plant components",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5", "ASME B16.47"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9", "ASME B16.11"],
    },
    comparison: [
      { vs: "Inconel 625", note: "625 is stronger at intermediate temperature; 617 is far superior above 900 °C." },
      { vs: "Haynes 230", note: "230 offers comparable strength with better long-term thermal stability in some atmospheres." },
    ],
    faqs: [
      {
        q: "Is Inconel 617 ASME code approved?",
        a: "Yes. Alloy 617 is listed in ASME Section VIII Division 1 and has allowable stresses published for high-temperature service; confirm the required code case with your design authority.",
      },
    ],
    maxTemp: "1100 °C continuous",
  },
  {
    slug: "inconel-625",
    name: "Inconel 625",
    uns: "UNS N06625",
    werkstoff: "2.4856",
    family: "nickel",
    tagline: "Ni-Cr-Mo-Nb alloy for severe corrosive and seawater service",
    summary:
      "The workhorse nickel-chromium-molybdenum-niobium alloy: outstanding pitting, crevice and chloride SCC resistance combined with high strength without heat treatment.",
    overview: [
      "Inconel 625 derives its strength from the solid-solution effect of molybdenum and niobium in a nickel-chromium matrix, so it is fully strong in the annealed condition and needs no precipitation hardening. That property, combined with excellent fabricability, has made it the default alloy for offshore risers, subsea hardware, flare systems, seawater piping and chemical process lines.",
      "Its resistance to pitting and crevice corrosion in warm chloride environments is far superior to austenitic stainless steel, and it is effectively immune to chloride stress corrosion cracking. It also performs well in oxidising and reducing acids and in sour service under NACE MR0175 / ISO 15156 within the specified hardness limits.",
      "Two grades are commonly specified: Grade 1 (annealed) for corrosion service and Grade 2 (solution annealed) for high-temperature service above 600 °C. Confirm which grade the project specification requires — the two carry different mechanical minimums.",
    ],
    composition: [
      { element: "Ni", percent: "58.0 min" },
      { element: "Cr", percent: "20.0 – 23.0" },
      { element: "Mo", percent: "8.0 – 10.0" },
      { element: "Nb + Ta", percent: "3.15 – 4.15" },
      { element: "Fe", percent: "5.0 max" },
      { element: "C", percent: "0.10 max" },
      { element: "Ti", percent: "0.40 max" },
      { element: "Al", percent: "0.40 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min, Gr 1)", value: "827 MPa / 120 ksi" },
      { label: "Yield strength 0.2 % (min, Gr 1)", value: "414 MPa / 60 ksi" },
      { label: "Elongation (min)", value: "30 %" },
      { label: "Hardness (NACE limit)", value: "≤ 35 HRC" },
    ],
    physical: [
      { label: "Density", value: "8.44 g/cm³" },
      { label: "Melting range", value: "1290 – 1350 °C" },
      { label: "Modulus of elasticity", value: "207.5 GPa" },
      { label: "PREN (typical)", value: "> 50" },
    ],
    corrosion: [
      "Outstanding pitting and crevice corrosion resistance in warm seawater.",
      "Immune to chloride-ion stress corrosion cracking in practical service.",
      "Resists both oxidising and reducing acids, including phosphoric and sulphuric mixtures.",
      "Accepted for sour service to NACE MR0175 / ISO 15156 within hardness and condition limits.",
    ],
    features: [
      "High strength in the annealed condition",
      "Service from cryogenic to 980 °C",
      "Excellent weldability with ERNiCrMo-3",
      "Widely used as a weld overlay and cladding alloy",
    ],
    applications: [
      "Subsea and topside oil & gas piping",
      "Flare stacks, bellows and expansion joints",
      "Seawater lift and firewater systems",
      "Flue gas desulphurisation and scrubber internals",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5", "ASME B16.47", "MSS SP-44"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9", "ASME B16.11", "ASME B16.28"],
      other: ["ASTM B443 (plate)", "ASTM B446 (bar)", "NACE MR0175 / ISO 15156"],
    },
    comparison: [
      { vs: "Incoloy 825", note: "825 is more economical but has lower molybdenum, so 625 is superior for warm chloride and seawater service." },
      { vs: "Hastelloy C-276", note: "C-276 is better in strongly reducing acids; 625 is better in oxidising conditions and has higher strength." },
      { vs: "Super Duplex S32750", note: "Super duplex is far more economical for seawater under ~50 °C; 625 extends the temperature and H2S envelope." },
    ],
    faqs: [
      {
        q: "What is the difference between Inconel 625 Grade 1 and Grade 2?",
        a: "Grade 1 is annealed and intended for service below approximately 600 °C, with higher strength minimums. Grade 2 is solution annealed with coarser grain size for creep service above 600 °C and lower yield minimums.",
      },
      {
        q: "Can Inconel 625 flanges be used in sour service?",
        a: "Yes, alloy N06625 is accepted under NACE MR0175 / ISO 15156 Part 3 in the annealed condition subject to hardness limits. The heat number, condition and hardness must be recorded on the MTC.",
      },
      {
        q: "Which flange standard applies to Inconel 625?",
        a: "Dimensions follow ASME B16.5 up to NPS 24 and ASME B16.47 Series A or B above that; the material specification is ASTM B564 UNS N06625.",
      },
    ],
    maxTemp: "980 °C",
  },
  {
    slug: "inconel-686",
    name: "Inconel 686",
    uns: "UNS N06686",
    werkstoff: "2.4606",
    family: "nickel",
    tagline: "High-molybdenum Ni-Cr-Mo-W alloy for the most aggressive mixed acids",
    summary:
      "Nickel-chromium-molybdenum-tungsten alloy with very high PREN, developed for severe mixed-acid and high-chloride environments beyond the limits of C-276 and 625.",
    overview: [
      "Alloy 686 combines high chromium for oxidising resistance with high molybdenum and tungsten for reducing resistance, producing exceptional performance in mixed and contaminated acid environments where a single mechanism cannot be assumed.",
      "It is specified for flue gas desulphurisation, waste incineration scrubbers, pulp bleaching and severe hydrometallurgical duty, and is available as forged flanges and buttweld fittings.",
    ],
    composition: [
      { element: "Ni", percent: "Balance" },
      { element: "Cr", percent: "19.0 – 23.0" },
      { element: "Mo", percent: "15.0 – 17.0" },
      { element: "W", percent: "3.0 – 4.4" },
      { element: "Fe", percent: "5.0 max" },
      { element: "C", percent: "0.010 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "690 MPa / 100 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "310 MPa / 45 ksi" },
      { label: "Elongation (min)", value: "45 %" },
    ],
    physical: [
      { label: "Density", value: "8.73 g/cm³" },
      { label: "Melting range", value: "1338 – 1380 °C" },
      { label: "PREN (typical)", value: "> 70" },
    ],
    corrosion: [
      "Exceptional resistance to localised corrosion in high-chloride oxidising media.",
      "Resists mixed sulphuric / hydrochloric contaminated acids.",
      "Very high critical crevice temperature in ferric chloride testing.",
    ],
    features: [
      "One of the highest PREN commercial nickel alloys",
      "Low carbon for as-welded corrosion resistance",
      "Excellent thermal stability",
    ],
    applications: [
      "Flue gas desulphurisation absorbers",
      "Waste and hazardous waste incineration scrubbers",
      "Pulp and paper bleach plants",
      "Acid gas and geothermal service",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9", "ASME B16.11"],
    },
    comparison: [
      { vs: "Hastelloy C-276", note: "686 has higher chromium, so it performs better in oxidising chloride media." },
      { vs: "Hastelloy C-22", note: "Similar performance envelope; 686 adds tungsten for reducing conditions." },
    ],
    faqs: [
      {
        q: "Is alloy 686 available in small quantities?",
        a: "Alloy 686 is normally a make-to-order forging. Lead time and minimum order quantity depend on billet availability — share the size and class list for a firm delivery commitment.",
      },
    ],
    maxTemp: "600 °C",
  },
  {
    slug: "inconel-690",
    name: "Inconel 690",
    uns: "UNS N06690",
    werkstoff: "2.4642",
    family: "nickel",
    tagline: "High-chromium nickel alloy for nuclear and oxidising acid service",
    summary:
      "Nickel alloy with approximately 30 % chromium giving exceptional resistance to oxidising acids, caustic and primary water stress corrosion cracking.",
    overview: [
      "The high chromium content of alloy 690 provides excellent resistance to oxidising chemicals such as nitric acid and to hot caustic, and it is the standard replacement for alloy 600 in nuclear steam generator tubing because of its resistance to primary water stress corrosion cracking.",
      "It is also used for nitric-acid plants, sulphuric-acid regeneration and glass-melting components.",
    ],
    composition: [
      { element: "Ni", percent: "58.0 min" },
      { element: "Cr", percent: "27.0 – 31.0" },
      { element: "Fe", percent: "7.0 – 11.0" },
      { element: "C", percent: "0.05 max" },
      { element: "Cu", percent: "0.50 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "586 MPa / 85 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "241 MPa / 35 ksi" },
      { label: "Elongation (min)", value: "30 %" },
    ],
    physical: [
      { label: "Density", value: "8.19 g/cm³" },
      { label: "Melting range", value: "1343 – 1377 °C" },
      { label: "Modulus of elasticity", value: "211 GPa" },
    ],
    corrosion: [
      "Outstanding resistance to nitric and mixed oxidising acids.",
      "Resistant to caustic and to primary water stress corrosion cracking.",
      "Good resistance to sulphidation at elevated temperature.",
    ],
    features: [
      "~30 % chromium content",
      "Nuclear-grade supply available with additional testing",
      "Good high-temperature oxidation resistance",
    ],
    applications: [
      "Nuclear steam generator components",
      "Nitric acid and mixed-acid plants",
      "Coal gasification and glass melting hardware",
      "Sulphuric acid regeneration",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9"],
    },
    comparison: [
      { vs: "Inconel 600", note: "690 has roughly double the chromium and much better SCC and oxidising acid resistance." },
      { vs: "Alloy 800H", note: "800H is used for creep service; 690 is used where corrosion governs." },
    ],
    faqs: [
      {
        q: "Why is alloy 690 used instead of 600 in nuclear plant?",
        a: "The higher chromium content substantially improves resistance to primary water stress corrosion cracking, which was the principal degradation mechanism observed in alloy 600 steam generator tubing.",
      },
    ],
    maxTemp: "1000 °C",
  },
  {
    slug: "inconel-718",
    name: "Inconel 718",
    uns: "UNS N07718",
    werkstoff: "2.4668",
    family: "nickel",
    tagline: "Precipitation-hardened Ni-Fe-Cr alloy with very high strength to 700 °C",
    summary:
      "Age-hardenable nickel-iron-chromium alloy strengthened by gamma double prime, delivering yield strengths above 1030 MPa with good weldability.",
    overview: [
      "Inconel 718 is the most widely used precipitation-hardened superalloy. Its niobium-bearing gamma double prime strengthening mechanism responds sluggishly to ageing, which allows welding and post-weld heat treatment without strain-age cracking — the reason it dominates aerospace and high-integrity oilfield hardware.",
      "In oil and gas it is used for downhole components, valve stems, high-pressure fasteners and completion hardware, frequently to API 6ACRA and NACE MR0175 requirements which impose specific solution and ageing cycles and hardness limits.",
      "Because properties depend entirely on heat treatment, always state the required condition (solution treated and aged, and the specific cycle) on the enquiry.",
    ],
    composition: [
      { element: "Ni + Co", percent: "50.0 – 55.0" },
      { element: "Cr", percent: "17.0 – 21.0" },
      { element: "Fe", percent: "Balance" },
      { element: "Nb + Ta", percent: "4.75 – 5.50" },
      { element: "Mo", percent: "2.80 – 3.30" },
      { element: "Ti", percent: "0.65 – 1.15" },
      { element: "Al", percent: "0.20 – 0.80" },
    ],
    mechanical: [
      { label: "Tensile strength (aged, min)", value: "1275 MPa / 185 ksi" },
      { label: "Yield strength 0.2 % (aged, min)", value: "1034 MPa / 150 ksi" },
      { label: "Elongation (min)", value: "12 %" },
      { label: "Hardness (API 6ACRA)", value: "32 – 40 HRC" },
    ],
    physical: [
      { label: "Density", value: "8.19 g/cm³" },
      { label: "Melting range", value: "1260 – 1336 °C" },
      { label: "Modulus of elasticity", value: "200 GPa" },
    ],
    corrosion: [
      "Good general corrosion resistance in oxidising and reducing media.",
      "Accepted for specific sour-service applications under NACE MR0175 / ISO 15156 Part 3 with defined heat treatment and hardness.",
      "Resistant to chloride SCC in most oilfield conditions.",
    ],
    features: [
      "Age-hardenable to very high strength",
      "Weldable without strain-age cracking",
      "Useful strength to approximately 700 °C",
      "API 6ACRA supply available",
    ],
    applications: [
      "Downhole tools and completion hardware",
      "High-pressure valve and wellhead components",
      "Aerospace turbine discs and fasteners",
      "Cryogenic tankage and pump parts",
    ],
    standards: {
      flanges: ["ASTM B637 / ASME SB637", "ASME B16.5", "API 6A / 6ACRA"],
      fittings: ["ASTM B637", "ASME B16.11 (forged)"],
      other: ["AMS 5662 / 5663", "NACE MR0175 / ISO 15156-3"],
    },
    comparison: [
      { vs: "Inconel 625", note: "625 is annealed and lower strength; 718 is aged for roughly twice the yield strength." },
      { vs: "Inconel 725", note: "725 offers similar strength with better corrosion resistance in sour brines." },
    ],
    faqs: [
      {
        q: "Do you supply Inconel 718 in the aged condition?",
        a: "Yes. State the required heat-treatment cycle (for example API 6ACRA or AMS 5663) on the enquiry; the certified hardness and mechanical results are reported on the MTC.",
      },
    ],
    maxTemp: "700 °C",
  },
  {
    slug: "inconel-725",
    name: "Inconel 725",
    uns: "UNS N07725",
    family: "nickel",
    tagline: "Age-hardenable corrosion-resistant alloy for sour oilfield hardware",
    summary:
      "Precipitation-hardenable nickel alloy with 625-level corrosion resistance and yield strengths above 827 MPa, developed for sour-service downhole components.",
    overview: [
      "Alloy 725 has essentially the chemistry of alloy 625 with titanium and aluminium additions that allow gamma prime / gamma double prime age hardening. The result is corrosion resistance comparable to 625 combined with strength approaching 718.",
      "It is specified for hangers, packers, landing nipples and tubing hardware in sour wells where both high strength and H2S resistance are required.",
    ],
    composition: [
      { element: "Ni", percent: "55.0 – 59.0" },
      { element: "Cr", percent: "19.0 – 22.5" },
      { element: "Mo", percent: "7.0 – 9.5" },
      { element: "Nb", percent: "2.75 – 4.0" },
      { element: "Ti", percent: "1.0 – 1.7" },
      { element: "Fe", percent: "Balance" },
    ],
    mechanical: [
      { label: "Tensile strength (aged, min)", value: "1035 MPa / 150 ksi" },
      { label: "Yield strength 0.2 % (aged, min)", value: "827 MPa / 120 ksi" },
      { label: "Elongation (min)", value: "20 %" },
      { label: "Hardness", value: "≤ 43 HRC per MR0175" },
    ],
    physical: [
      { label: "Density", value: "8.31 g/cm³" },
      { label: "Melting range", value: "1271 – 1343 °C" },
    ],
    corrosion: [
      "Corrosion resistance comparable to alloy 625 in chloride and sour brines.",
      "Qualified under NACE MR0175 / ISO 15156-3 for defined conditions.",
      "Resistant to sulphide stress cracking at high strength levels.",
    ],
    features: [
      "Age-hardened high strength with CRA-level corrosion resistance",
      "Preferred for sour downhole completion hardware",
      "Supplied to API 6ACRA where required",
    ],
    applications: [
      "Downhole completion and packer hardware",
      "Wellhead and subsea components",
      "High-strength fasteners for sour service",
    ],
    standards: {
      flanges: ["ASTM B805", "API 6A / 6ACRA"],
      fittings: ["ASTM B805", "Customer drawing forgings"],
      other: ["NACE MR0175 / ISO 15156-3"],
    },
    comparison: [
      { vs: "Inconel 718", note: "725 has markedly better sour-service corrosion resistance at similar strength." },
      { vs: "Inconel 625", note: "625 cannot be age hardened; 725 delivers roughly double the yield strength." },
    ],
    faqs: [
      {
        q: "Is alloy 725 stocked?",
        a: "Alloy 725 is normally supplied against order from qualified forging sources. Provide drawings, quantity and heat-treatment requirements for a delivery schedule.",
      },
    ],
    maxTemp: "540 °C",
  },
  {
    slug: "inconel-x-750",
    name: "Inconel X-750",
    uns: "UNS N07750",
    werkstoff: "2.4669",
    family: "nickel",
    tagline: "Gamma-prime hardened alloy for springs and high-temperature bolting",
    summary:
      "Precipitation-hardenable nickel-chromium alloy based on alloy 600, giving high strength and relaxation resistance to approximately 700 °C.",
    overview: [
      "Inconel X-750 is age hardened by titanium and aluminium additions to alloy 600. It combines the corrosion and oxidation resistance of the base alloy with high strength and excellent relaxation resistance, making it a standard for springs, bolting and gas turbine rotating hardware.",
      "Several heat-treatment conditions exist for different service temperatures; specify the condition (for example No. 1 spring temper or HTH) on the enquiry.",
    ],
    composition: [
      { element: "Ni + Co", percent: "70.0 min" },
      { element: "Cr", percent: "14.0 – 17.0" },
      { element: "Fe", percent: "5.0 – 9.0" },
      { element: "Ti", percent: "2.25 – 2.75" },
      { element: "Nb + Ta", percent: "0.70 – 1.20" },
      { element: "Al", percent: "0.40 – 1.00" },
    ],
    mechanical: [
      { label: "Tensile strength (aged, min)", value: "1100 MPa / 160 ksi" },
      { label: "Yield strength 0.2 % (aged, min)", value: "690 MPa / 100 ksi" },
      { label: "Elongation (min)", value: "20 %" },
    ],
    physical: [
      { label: "Density", value: "8.28 g/cm³" },
      { label: "Melting range", value: "1393 – 1427 °C" },
    ],
    corrosion: [
      "Good oxidation resistance to 870 °C.",
      "Resists chloride stress corrosion cracking.",
      "Suitable for high-purity water service in the correct condition.",
    ],
    features: [
      "Excellent relaxation resistance for springs and bolting",
      "Multiple heat-treatment conditions available",
      "Retains strength to ~700 °C",
    ],
    applications: [
      "Gas turbine bolting and springs",
      "Nuclear reactor internals hardware",
      "Heat treating fixtures under load",
      "Aerospace fasteners",
    ],
    standards: {
      flanges: ["ASTM B637 (bar / forgings)"],
      fittings: ["Machined components to drawing"],
      other: ["AMS 5667 / AMS 5698"],
    },
    comparison: [
      { vs: "Inconel 718", note: "718 is generally preferred for weldable structural parts; X-750 excels in springs." },
    ],
    faqs: [
      {
        q: "Which condition should I specify for X-750 springs?",
        a: "Cold-drawn spring temper followed by precipitation ageing is normal for springs; for bolting the HTH (high-temperature heat-treated) condition is typical.",
      },
    ],
    maxTemp: "700 °C structural",
  },
  {
    slug: "incoloy-800",
    name: "Incoloy 800",
    uns: "UNS N08800",
    werkstoff: "1.4876",
    family: "nickel",
    tagline: "Iron-nickel-chromium alloy for elevated-temperature process service",
    summary:
      "Fe-Ni-Cr alloy with stabilised structure and good oxidation and carburisation resistance for service to approximately 815 °C.",
    overview: [
      "Incoloy 800 provides a cost-effective alternative to fully austenitic nickel alloys where moderate elevated-temperature strength and resistance to oxidation, carburisation and chloride stress corrosion cracking are required.",
      "It is widely used in heat exchangers, process piping, heating element sheathing and ethylene furnace hardware. The 800H and 800HT variants add controlled carbon and grain size for creep service.",
    ],
    composition: [
      { element: "Ni", percent: "30.0 – 35.0" },
      { element: "Cr", percent: "19.0 – 23.0" },
      { element: "Fe", percent: "39.5 min" },
      { element: "C", percent: "0.10 max" },
      { element: "Al", percent: "0.15 – 0.60" },
      { element: "Ti", percent: "0.15 – 0.60" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "520 MPa / 75 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "205 MPa / 30 ksi" },
      { label: "Elongation (min)", value: "30 %" },
    ],
    physical: [
      { label: "Density", value: "7.94 g/cm³" },
      { label: "Melting range", value: "1357 – 1385 °C" },
      { label: "Modulus of elasticity", value: "196 GPa" },
    ],
    corrosion: [
      "Resists oxidation and carburisation to ~815 °C.",
      "Good resistance to chloride stress corrosion cracking compared with 300-series stainless.",
      "Not suitable for strongly reducing acid service.",
    ],
    features: [
      "Economical Fe-Ni-Cr alternative to nickel-base alloys",
      "Stabilised with Al and Ti",
      "Code accepted for pressure equipment",
    ],
    applications: [
      "Process heaters and heat exchangers",
      "Ethylene and steam reformer piping",
      "Electric heating element sheathing",
      "Petrochemical convection sections",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9"],
      other: ["ASTM B409 (plate)", "ASTM B408 (bar)"],
    },
    comparison: [
      { vs: "Incoloy 800H", note: "800H has controlled carbon and coarse grain for creep-rupture service above 600 °C." },
      { vs: "SS 321", note: "800 offers much better carburisation and high-temperature strength than 321." },
    ],
    faqs: [
      {
        q: "When must 800H or 800HT be used instead of 800?",
        a: "Above approximately 600 °C where the design relies on creep-rupture allowables. ASME lists separate allowable stresses for 800H / 800HT because of the controlled carbon and grain size.",
      },
    ],
    maxTemp: "815 °C",
  },
  {
    slug: "incoloy-800h",
    name: "Incoloy 800H",
    uns: "UNS N08810",
    werkstoff: "1.4958",
    family: "nickel",
    tagline: "Controlled-carbon 800 variant for creep-rupture service",
    summary:
      "Incoloy 800 with carbon restricted to 0.05–0.10 % and a minimum grain size of ASTM 5 or coarser, giving significantly higher creep-rupture strength.",
    overview: [
      "Incoloy 800H is metallurgically identical to alloy 800 apart from a controlled carbon range and a mandated coarse grain size, both of which raise creep-rupture strength above 600 °C. ASME publishes separate allowable stresses for it.",
      "It is used for reformer pigtails and outlet headers, high-temperature process piping and furnace components where long-term creep governs the design.",
    ],
    composition: [
      { element: "Ni", percent: "30.0 – 35.0" },
      { element: "Cr", percent: "19.0 – 23.0" },
      { element: "Fe", percent: "39.5 min" },
      { element: "C", percent: "0.05 – 0.10" },
      { element: "Al + Ti", percent: "0.30 – 1.20" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "450 MPa / 65 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "170 MPa / 25 ksi" },
      { label: "Elongation (min)", value: "30 %" },
      { label: "Grain size", value: "ASTM 5 or coarser" },
    ],
    physical: [
      { label: "Density", value: "7.94 g/cm³" },
      { label: "Melting range", value: "1357 – 1385 °C" },
    ],
    corrosion: [
      "Oxidation and carburisation resistance to ~1100 °C in short exposure.",
      "Resists chloride stress corrosion cracking.",
      "Susceptible to sulphidation in high-sulphur atmospheres.",
    ],
    features: [
      "Controlled carbon 0.05–0.10 %",
      "Coarse-grain solution annealed",
      "Higher ASME allowables above 600 °C",
    ],
    applications: [
      "Steam reformer outlet headers and pigtails",
      "Ethylene cracking furnace hardware",
      "High-temperature process piping",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5", "ASME B16.47"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9"],
      other: ["ASTM B409", "ASME Code Case coverage for creep service"],
    },
    comparison: [
      { vs: "Incoloy 800", note: "800 is for general service; 800H is required where creep allowables govern." },
      { vs: "Incoloy 800HT", note: "800HT further restricts Al+Ti and carbon for the most demanding creep service." },
    ],
    faqs: [
      {
        q: "Can one heat be dual certified 800H / 800HT?",
        a: "Yes, dual certification is common when the chemistry, carbon range and grain size satisfy both specifications. The MTC states both UNS numbers.",
      },
    ],
    maxTemp: "1100 °C short-term",
  },
  {
    slug: "incoloy-800ht",
    name: "Incoloy 800HT",
    uns: "UNS N08811",
    werkstoff: "1.4959",
    family: "nickel",
    tagline: "Tightest-controlled 800 variant for maximum creep-rupture performance",
    summary:
      "Alloy 800 with narrowed carbon and combined aluminium plus titanium limits and coarse grain size for optimum long-term creep-rupture strength.",
    overview: [
      "Alloy 800HT adds a combined Al + Ti limit of 0.85–1.20 % to the 800H requirements, producing the most consistent long-term creep behaviour of the 800 family.",
      "It is the standard choice for steam reformer and pyrolysis service where design life extends over decades at temperature.",
    ],
    composition: [
      { element: "Ni", percent: "30.0 – 35.0" },
      { element: "Cr", percent: "19.0 – 23.0" },
      { element: "Fe", percent: "39.5 min" },
      { element: "C", percent: "0.06 – 0.10" },
      { element: "Al + Ti", percent: "0.85 – 1.20" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "450 MPa / 65 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "170 MPa / 25 ksi" },
      { label: "Elongation (min)", value: "30 %" },
      { label: "Grain size", value: "ASTM 5 or coarser" },
    ],
    physical: [
      { label: "Density", value: "7.94 g/cm³" },
      { label: "Melting range", value: "1357 – 1385 °C" },
    ],
    corrosion: [
      "Excellent oxidation and carburisation resistance at reforming temperatures.",
      "Stable structure after prolonged high-temperature exposure.",
    ],
    features: [
      "Combined Al + Ti control",
      "Best-in-family creep-rupture consistency",
      "Frequently dual certified with 800H",
    ],
    applications: [
      "Hydrogen and ammonia reformer piping",
      "Pyrolysis furnace components",
      "High-temperature headers and manifolds",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9"],
    },
    comparison: [
      { vs: "Incoloy 800H", note: "800HT adds the Al + Ti window; otherwise the two are supplied interchangeably where dual certified." },
    ],
    faqs: [
      {
        q: "Does 800HT need a specific solution anneal?",
        a: "Yes — solution annealing above approximately 1150 °C is required to achieve the coarse grain size the creep allowables depend on. The MTC should record the annealing temperature.",
      },
    ],
    maxTemp: "1100 °C short-term",
  },
  {
    slug: "incoloy-825",
    name: "Incoloy 825",
    uns: "UNS N08825",
    werkstoff: "2.4858",
    family: "nickel",
    tagline: "Ni-Fe-Cr-Mo-Cu alloy for sulphuric and phosphoric acid service",
    summary:
      "Titanium-stabilised nickel-iron-chromium alloy with molybdenum and copper, giving strong resistance to both reducing and oxidising acids and to chloride SCC.",
    overview: [
      "Incoloy 825 is one of the most widely specified corrosion-resistant alloys in oil, gas and chemical processing. Molybdenum and copper give resistance to reducing acids such as sulphuric and phosphoric, chromium handles oxidising conditions, and the high nickel content confers resistance to chloride stress corrosion cracking.",
      "Titanium stabilisation prevents sensitisation during welding, so the alloy can be used in the as-welded condition. It is commonly used as tubing, piping, flanges and fittings in sour gas service, acid plants and pickling systems.",
      "Alloy 825 is accepted for sour service under NACE MR0175 / ISO 15156 within stated hardness and condition limits, making it a cost-effective alternative to alloy 625 in many wellhead and flowline applications.",
    ],
    composition: [
      { element: "Ni", percent: "38.0 – 46.0" },
      { element: "Cr", percent: "19.5 – 23.5" },
      { element: "Mo", percent: "2.5 – 3.5" },
      { element: "Cu", percent: "1.5 – 3.0" },
      { element: "Ti", percent: "0.6 – 1.2" },
      { element: "Fe", percent: "22.0 min" },
      { element: "C", percent: "0.05 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "586 MPa / 85 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "241 MPa / 35 ksi" },
      { label: "Elongation (min)", value: "30 %" },
      { label: "Hardness (NACE)", value: "≤ 35 HRC" },
    ],
    physical: [
      { label: "Density", value: "8.14 g/cm³" },
      { label: "Melting range", value: "1370 – 1400 °C" },
      { label: "Modulus of elasticity", value: "196 GPa" },
    ],
    corrosion: [
      "Excellent resistance to sulphuric and phosphoric acids.",
      "Resistant to chloride stress corrosion cracking.",
      "Titanium stabilised — resistant to intergranular attack after welding.",
      "Accepted for sour service to NACE MR0175 / ISO 15156.",
    ],
    features: [
      "Cost-effective CRA for sour and acid service",
      "Stabilised for as-welded use",
      "Available as clad and overlay material",
    ],
    applications: [
      "Sour gas wellhead and flowline components",
      "Sulphuric and phosphoric acid plants",
      "Pickling tanks and acid regeneration",
      "Nuclear fuel reprocessing hardware",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5", "ASME B16.47"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9", "ASME B16.11"],
      other: ["ASTM B424 (plate)", "ASTM B425 (bar)", "NACE MR0175 / ISO 15156"],
    },
    comparison: [
      { vs: "Inconel 625", note: "625 has far higher molybdenum and strength; 825 is more economical where chloride pitting risk is moderate." },
      { vs: "SS 904L", note: "904L is a stainless steel with lower nickel; 825 is preferred where chloride SCC is a concern." },
    ],
    faqs: [
      {
        q: "Is Incoloy 825 suitable for seawater?",
        a: "Alloy 825 can suffer crevice corrosion in stagnant warm seawater. Super duplex, alloy 625 or C-276 are usually preferred for continuous seawater duty.",
      },
      {
        q: "Which flange specification covers Incoloy 825?",
        a: "ASTM B564 UNS N08825 covers forgings; dimensions follow ASME B16.5 or B16.47 depending on size.",
      },
    ],
    maxTemp: "540 °C",
  },
  {
    slug: "incoloy-925",
    name: "Incoloy 925",
    uns: "UNS N09925",
    family: "nickel",
    tagline: "Age-hardenable version of alloy 825 for high-strength sour service",
    summary:
      "Precipitation-hardenable Ni-Fe-Cr alloy with the corrosion resistance of alloy 825 and yield strengths above 690 MPa.",
    overview: [
      "Alloy 925 adds titanium, aluminium and copper to an 825-type matrix so it can be age hardened, giving high strength while retaining resistance to sour, acidic and chloride environments.",
      "It is used for hangers, valve parts, shafts and fasteners in oilfield service where alloy 825 lacks the required strength.",
    ],
    composition: [
      { element: "Ni", percent: "42.0 – 46.0" },
      { element: "Cr", percent: "19.5 – 22.5" },
      { element: "Mo", percent: "2.5 – 3.5" },
      { element: "Cu", percent: "1.5 – 3.0" },
      { element: "Ti", percent: "1.9 – 2.4" },
      { element: "Fe", percent: "22.0 min" },
    ],
    mechanical: [
      { label: "Tensile strength (aged, min)", value: "965 MPa / 140 ksi" },
      { label: "Yield strength 0.2 % (aged, min)", value: "690 MPa / 100 ksi" },
      { label: "Elongation (min)", value: "18 %" },
      { label: "Hardness", value: "≤ 38 HRC typical limit" },
    ],
    physical: [
      { label: "Density", value: "8.08 g/cm³" },
      { label: "Melting range", value: "1311 – 1366 °C" },
    ],
    corrosion: [
      "Corrosion resistance comparable to alloy 825.",
      "Resistant to sulphide stress cracking within MR0175 limits.",
      "Good resistance to chloride pitting and SCC.",
    ],
    features: [
      "Age hardened for high strength",
      "Oilfield qualified corrosion-resistant alloy",
      "Machinable in the solution-treated condition",
    ],
    applications: [
      "Tubing hangers and valve components",
      "Downhole shafts and fasteners",
      "Sour gas production hardware",
    ],
    standards: {
      flanges: ["ASTM B805", "API 6A / 6ACRA"],
      fittings: ["Machined to customer drawing"],
      other: ["NACE MR0175 / ISO 15156-3"],
    },
    comparison: [
      { vs: "Incoloy 825", note: "925 delivers roughly triple the yield strength with equivalent corrosion behaviour." },
      { vs: "Inconel 725", note: "725 has higher molybdenum and greater resistance in severe sour brines." },
    ],
    faqs: [
      {
        q: "What heat treatment does alloy 925 require?",
        a: "Solution treatment followed by a single or double ageing cycle. Specify the cycle from the applicable API or client specification so hardness and mechanical results can be certified.",
      },
    ],
    maxTemp: "540 °C",
  },
  {
    slug: "hastelloy-c22",
    name: "Hastelloy C-22",
    uns: "UNS N06022",
    werkstoff: "2.4602",
    family: "nickel",
    tagline: "Versatile Ni-Cr-Mo-W alloy for oxidising and reducing media",
    summary:
      "Nickel-chromium-molybdenum-tungsten alloy with outstanding resistance to pitting, crevice corrosion and stress corrosion cracking in mixed chemical environments.",
    overview: [
      "Hastelloy C-22 was developed to be more universally corrosion resistant than earlier C-type alloys, with higher chromium than C-276 giving significantly better performance in oxidising media while retaining molybdenum and tungsten for reducing conditions.",
      "It resists the formation of grain-boundary precipitates in the weld heat-affected zone, so it can be used as welded in most process applications.",
    ],
    composition: [
      { element: "Ni", percent: "Balance" },
      { element: "Cr", percent: "20.0 – 22.5" },
      { element: "Mo", percent: "12.5 – 14.5" },
      { element: "W", percent: "2.5 – 3.5" },
      { element: "Fe", percent: "2.0 – 6.0" },
      { element: "C", percent: "0.015 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "690 MPa / 100 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "310 MPa / 45 ksi" },
      { label: "Elongation (min)", value: "45 %" },
    ],
    physical: [
      { label: "Density", value: "8.69 g/cm³" },
      { label: "Melting range", value: "1357 – 1399 °C" },
      { label: "PREN (typical)", value: "> 65" },
    ],
    corrosion: [
      "Excellent resistance to oxidising and reducing acids alike.",
      "Very high resistance to pitting, crevice corrosion and chloride SCC.",
      "Resists wet chlorine, hypochlorite and ferric / cupric chlorides.",
    ],
    features: [
      "As-welded corrosion resistance",
      "Broadest chemical resistance envelope of the C family",
      "Suited to mixed and unpredictable process streams",
    ],
    applications: [
      "Flue gas desulphurisation systems",
      "Chemical and pharmaceutical reactors",
      "Pickling and acid regeneration plant",
      "Waste treatment and incineration scrubbers",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5", "ASME B16.47"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9", "ASME B16.11"],
      other: ["ASTM B575 (plate)", "ASTM B574 (bar)"],
    },
    comparison: [
      { vs: "Hastelloy C-276", note: "C-22 has higher chromium and performs better in oxidising conditions; C-276 is better in hot reducing acids." },
      { vs: "Inconel 625", note: "C-22 has substantially higher molybdenum and localised corrosion resistance." },
    ],
    faqs: [
      {
        q: "Can C-22 be used as welded?",
        a: "Yes. The low carbon content and stability of the alloy allow as-welded service in most media without post-weld solution annealing.",
      },
    ],
    maxTemp: "650 °C",
  },
  {
    slug: "hastelloy-c276",
    name: "Hastelloy C-276",
    uns: "UNS N10276",
    werkstoff: "2.4819",
    family: "nickel",
    tagline: "Benchmark Ni-Mo-Cr alloy for severe reducing acid environments",
    summary:
      "The reference corrosion-resistant alloy for hot hydrochloric and sulphuric acid, wet chlorine and severely reducing chloride environments.",
    overview: [
      "Hastelloy C-276 is a low-carbon, low-silicon nickel-molybdenum-chromium alloy with tungsten. Its high molybdenum content gives outstanding resistance to reducing acids and to localised corrosion in chloride environments, while chromium contributes resistance in oxidising conditions.",
      "The low carbon and silicon content allow the alloy to be used as welded without the sensitisation problems of earlier C-type alloys, which is one reason it is the default choice for fabricated chemical process equipment.",
      "Trishul supplies C-276 forged flanges to ASTM B564 and buttweld fittings to ASTM B366 with PMI and third-party inspection available on request.",
    ],
    composition: [
      { element: "Ni", percent: "Balance" },
      { element: "Mo", percent: "15.0 – 17.0" },
      { element: "Cr", percent: "14.5 – 16.5" },
      { element: "W", percent: "3.0 – 4.5" },
      { element: "Fe", percent: "4.0 – 7.0" },
      { element: "C", percent: "0.010 max" },
      { element: "Co", percent: "2.5 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "690 MPa / 100 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "283 MPa / 41 ksi" },
      { label: "Elongation (min)", value: "40 %" },
      { label: "Hardness (NACE)", value: "≤ 100 HRB (annealed)" },
    ],
    physical: [
      { label: "Density", value: "8.89 g/cm³" },
      { label: "Melting range", value: "1325 – 1370 °C" },
      { label: "Modulus of elasticity", value: "205 GPa" },
      { label: "PREN (typical)", value: "> 65" },
    ],
    corrosion: [
      "Outstanding resistance to hot hydrochloric and sulphuric acids.",
      "Resists wet chlorine gas, hypochlorite and chlorine dioxide.",
      "Immune to chloride stress corrosion cracking in practical service.",
      "Accepted for sour service under NACE MR0175 / ISO 15156.",
    ],
    features: [
      "Very low carbon and silicon for as-welded use",
      "Highest general acid resistance of the common CRAs",
      "Extensive corrosion data available for process design",
    ],
    applications: [
      "Sour gas gathering and separation equipment",
      "Chlorinated hydrocarbon and pesticide plants",
      "Pulp bleaching and paper mill equipment",
      "Flue gas desulphurisation and scrubbers",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5", "ASME B16.47", "MSS SP-44"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9", "ASME B16.11", "ASME B16.28"],
      other: ["ASTM B575 (plate)", "ASTM B574 (bar)", "NACE MR0175"],
    },
    comparison: [
      { vs: "Inconel 625", note: "C-276 has higher molybdenum and better reducing-acid performance; 625 has higher strength and better oxidising resistance." },
      { vs: "Hastelloy C-22", note: "C-22 handles oxidising media better; C-276 remains the reference for hot HCl." },
      { vs: "Alloy 20", note: "Alloy 20 is far more economical for pure sulphuric acid but cannot match C-276 in chlorides." },
    ],
    faqs: [
      {
        q: "Is Hastelloy C-276 suitable for sour service?",
        a: "Yes. UNS N10276 in the solution-annealed condition is listed in NACE MR0175 / ISO 15156-3 for sour environments within the specified hardness limits.",
      },
      {
        q: "What is the standard delivery condition for C-276 flanges?",
        a: "Solution annealed and rapidly quenched. The annealing temperature and cooling method should be recorded on the EN 10204 3.1 certificate.",
      },
    ],
    maxTemp: "677 °C",
  },
  {
    slug: "hastelloy-c2000",
    name: "Hastelloy C-2000",
    uns: "UNS N06200",
    family: "nickel",
    tagline: "Copper-bearing Ni-Cr-Mo alloy for both oxidising and reducing acids",
    summary:
      "Ni-Cr-Mo alloy with a copper addition giving uniquely broad resistance across sulphuric acid concentrations and mixed acid streams.",
    overview: [
      "Hastelloy C-2000 combines 23 % chromium and 16 % molybdenum with 1.6 % copper. The copper markedly improves performance in sulphuric acid, so the alloy resists both oxidising and reducing acid conditions with a single material.",
      "It is used where process streams vary in oxidising potential and where alloy substitution risk must be minimised.",
    ],
    composition: [
      { element: "Ni", percent: "Balance" },
      { element: "Cr", percent: "22.0 – 24.0" },
      { element: "Mo", percent: "15.0 – 17.0" },
      { element: "Cu", percent: "1.3 – 1.9" },
      { element: "Fe", percent: "3.0 max" },
      { element: "C", percent: "0.010 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "690 MPa / 100 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "310 MPa / 45 ksi" },
      { label: "Elongation (min)", value: "45 %" },
    ],
    physical: [
      { label: "Density", value: "8.5 g/cm³" },
      { label: "Melting range", value: "1328 – 1358 °C" },
    ],
    corrosion: [
      "Resists sulphuric acid across the full concentration range.",
      "Excellent resistance to hydrochloric acid and mixed acids.",
      "High resistance to localised chloride attack.",
    ],
    features: [
      "Copper-enhanced sulphuric acid resistance",
      "Very low carbon for as-welded service",
      "Single-alloy solution for variable streams",
    ],
    applications: [
      "Sulphuric acid production and handling",
      "Mixed-acid chemical processing",
      "Pharmaceutical and agrochemical reactors",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9", "ASME B16.11"],
    },
    comparison: [
      { vs: "Hastelloy C-276", note: "C-2000 is generally better in oxidising acids and sulphuric acid; C-276 remains stronger in hot HCl." },
      { vs: "Alloy 20", note: "Alloy 20 is cheaper for clean sulphuric acid; C-2000 tolerates chloride contamination." },
    ],
    faqs: [
      {
        q: "Is C-2000 a direct substitute for C-276?",
        a: "Not automatically. The two have different chemistries and code listings — substitution must be approved by the process design authority.",
      },
    ],
    maxTemp: "650 °C",
  },
  {
    slug: "hastelloy-b2",
    name: "Hastelloy B-2",
    uns: "UNS N10665",
    werkstoff: "2.4617",
    family: "nickel",
    tagline: "Nickel-molybdenum alloy for hydrochloric acid at all concentrations",
    summary:
      "Chromium-free nickel-molybdenum alloy delivering unmatched resistance to hydrochloric acid and other strongly reducing media.",
    overview: [
      "Hastelloy B-2 contains approximately 28 % molybdenum with essentially no chromium, giving exceptional resistance to hydrochloric acid at all concentrations and temperatures including the boiling point.",
      "Because it lacks chromium, the alloy is not suitable for oxidising environments or for streams containing ferric or cupric ions. Careful process control is required to prevent oxidising contamination.",
    ],
    composition: [
      { element: "Ni", percent: "Balance" },
      { element: "Mo", percent: "26.0 – 30.0" },
      { element: "Fe", percent: "2.0 max" },
      { element: "Cr", percent: "1.0 max" },
      { element: "C", percent: "0.02 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "760 MPa / 110 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "350 MPa / 51 ksi" },
      { label: "Elongation (min)", value: "40 %" },
    ],
    physical: [
      { label: "Density", value: "9.22 g/cm³" },
      { label: "Melting range", value: "1330 – 1380 °C" },
    ],
    corrosion: [
      "Outstanding resistance to hydrochloric acid at all concentrations.",
      "Resists sulphuric, acetic, formic and phosphoric acids.",
      "Not suitable for oxidising media or ferric / cupric contamination.",
    ],
    features: [
      "~28 % molybdenum, chromium-free",
      "Resists HCl to boiling point",
      "Requires strict exclusion of oxidisers",
    ],
    applications: [
      "Hydrochloric acid plants and storage",
      "Acetic and formic acid production",
      "Aluminium chloride and organic chloride processes",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9", "ASME B16.11"],
    },
    comparison: [
      { vs: "Hastelloy B-3", note: "B-3 has better thermal stability and resistance to knife-line attack; B-2 remains widely specified." },
      { vs: "Hastelloy C-276", note: "C-276 tolerates oxidising contamination that would rapidly attack B-2." },
    ],
    faqs: [
      {
        q: "Why must oxidising species be excluded with B-2?",
        a: "Without chromium the alloy cannot form a passive film in oxidising conditions, so ferric or cupric ions, aeration or nitric contamination cause rapid corrosion.",
      },
    ],
    maxTemp: "425 °C in acid service",
  },
  {
    slug: "hastelloy-b3",
    name: "Hastelloy B-3",
    uns: "UNS N10675",
    family: "nickel",
    tagline: "Thermally stable nickel-molybdenum alloy for HCl service",
    summary:
      "Improved Ni-Mo alloy offering B-2 level hydrochloric acid resistance with far better thermal stability and fabricability.",
    overview: [
      "Hastelloy B-3 was developed to overcome the thermal instability of B-2, which could precipitate intermetallic phases during welding and thermal exposure and lead to knife-line or heat-affected zone attack.",
      "It provides the same outstanding hydrochloric acid performance while tolerating fabrication and intermediate-temperature exposure much better.",
    ],
    composition: [
      { element: "Ni", percent: "Balance" },
      { element: "Mo", percent: "27.0 – 32.0" },
      { element: "Fe", percent: "1.0 – 3.0" },
      { element: "Cr", percent: "1.0 – 3.0" },
      { element: "C", percent: "0.01 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "760 MPa / 110 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "350 MPa / 51 ksi" },
      { label: "Elongation (min)", value: "40 %" },
    ],
    physical: [
      { label: "Density", value: "9.22 g/cm³" },
      { label: "Melting range", value: "1370 – 1418 °C" },
    ],
    corrosion: [
      "Equivalent HCl resistance to B-2 with improved weld-zone behaviour.",
      "Resistant to sulphuric, acetic and phosphoric acids.",
      "Still unsuitable for oxidising contamination.",
    ],
    features: [
      "Superior thermal stability to B-2",
      "Reduced risk of knife-line attack",
      "Better formability and weldability",
    ],
    applications: [
      "Hydrochloric acid reactors and piping",
      "Chemical processing with reducing acids",
      "Acid recovery systems",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9"],
    },
    comparison: [
      { vs: "Hastelloy B-2", note: "B-3 is the modern replacement where fabrication or thermal exposure is significant." },
    ],
    faqs: [
      {
        q: "Can B-3 replace B-2 directly?",
        a: "Technically it is the intended successor, but code listings and client specifications differ. Obtain written approval before substituting.",
      },
    ],
    maxTemp: "425 °C in acid service",
  },
  {
    slug: "monel-400",
    name: "Monel 400",
    uns: "UNS N04400",
    werkstoff: "2.4360",
    family: "nickel",
    tagline: "Nickel-copper alloy for seawater, hydrofluoric acid and marine service",
    summary:
      "Solid-solution nickel-copper alloy with excellent resistance to flowing seawater, hydrofluoric acid and alkalis, retaining strength to 480 °C.",
    overview: [
      "Monel 400 is approximately 67 % nickel and 31 % copper. It resists flowing seawater, brackish water, neutral salts, alkalis and hydrofluoric acid, and it is one of the few materials suitable for anhydrous HF service.",
      "Unlike stainless steels it is not susceptible to chloride stress corrosion cracking, but it can suffer pitting in stagnant seawater, so flow conditions should be considered at design stage.",
      "Forged flanges are supplied to ASTM B564 and buttweld fittings to ASTM B366, with the annealed condition normal for corrosion service.",
    ],
    composition: [
      { element: "Ni", percent: "63.0 min" },
      { element: "Cu", percent: "28.0 – 34.0" },
      { element: "Fe", percent: "2.5 max" },
      { element: "Mn", percent: "2.0 max" },
      { element: "C", percent: "0.30 max" },
      { element: "S", percent: "0.024 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "480 MPa / 70 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "195 MPa / 28 ksi" },
      { label: "Elongation (min)", value: "35 %" },
      { label: "Typical hardness", value: "≤ 75 HRB annealed" },
    ],
    physical: [
      { label: "Density", value: "8.80 g/cm³" },
      { label: "Melting range", value: "1300 – 1350 °C" },
      { label: "Modulus of elasticity", value: "179 GPa" },
    ],
    corrosion: [
      "Excellent in flowing seawater and brackish water.",
      "One of the few alloys suitable for hydrofluoric acid.",
      "Resistant to alkalis and neutral salt solutions.",
      "Can pit under stagnant or fouled seawater conditions.",
    ],
    features: [
      "Non-magnetic in the annealed condition (near ambient)",
      "Retains strength to 480 °C",
      "Good weldability with ERNiCu-7",
    ],
    applications: [
      "Marine and offshore seawater piping",
      "Hydrofluoric acid alkylation units",
      "Heat exchangers and condensers",
      "Crude oil distillation overhead systems",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5", "ASME B16.47"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9", "ASME B16.11"],
      other: ["ASTM B127 (plate)", "ASTM B164 (bar)"],
    },
    comparison: [
      { vs: "Monel K-500", note: "K-500 is age hardened for roughly three times the yield strength with similar corrosion behaviour." },
      { vs: "Super Duplex S32750", note: "Super duplex is stronger and better in stagnant seawater; Monel wins in hydrofluoric acid." },
    ],
    faqs: [
      {
        q: "Is Monel 400 suitable for stagnant seawater?",
        a: "It performs best in flowing seawater. In stagnant or fouled conditions pitting and crevice attack can occur — super duplex or alloy 625 are usually specified instead.",
      },
    ],
    maxTemp: "480 °C",
  },
  {
    slug: "monel-k500",
    name: "Monel K-500",
    uns: "UNS N05500",
    werkstoff: "2.4375",
    family: "nickel",
    tagline: "Age-hardened nickel-copper alloy for high-strength marine hardware",
    summary:
      "Precipitation-hardenable Monel with aluminium and titanium additions, giving roughly triple the yield strength of alloy 400 with similar corrosion resistance.",
    overview: [
      "Monel K-500 adds aluminium and titanium to the nickel-copper base so that gamma prime precipitation strengthening can be applied. The alloy retains the seawater and HF resistance of Monel 400 while offering much higher strength and better galling resistance.",
      "It is used for pump shafts, impellers, valve stems, fasteners and downhole hardware. Hydrogen embrittlement susceptibility increases with hardness, so cathodic protection potentials and hardness limits must be respected.",
    ],
    composition: [
      { element: "Ni", percent: "63.0 min" },
      { element: "Cu", percent: "27.0 – 33.0" },
      { element: "Al", percent: "2.30 – 3.15" },
      { element: "Ti", percent: "0.35 – 0.85" },
      { element: "Fe", percent: "2.0 max" },
    ],
    mechanical: [
      { label: "Tensile strength (aged, min)", value: "965 MPa / 140 ksi" },
      { label: "Yield strength 0.2 % (aged, min)", value: "690 MPa / 100 ksi" },
      { label: "Elongation (min)", value: "20 %" },
      { label: "Hardness (NACE limit)", value: "≤ 35 HRC" },
    ],
    physical: [
      { label: "Density", value: "8.44 g/cm³" },
      { label: "Melting range", value: "1315 – 1350 °C" },
    ],
    corrosion: [
      "Seawater and brine resistance comparable to Monel 400.",
      "Resistant to hydrofluoric acid and alkalis.",
      "Susceptible to hydrogen embrittlement at high hardness under cathodic protection.",
    ],
    features: [
      "Age hardened for high strength",
      "Low magnetic permeability",
      "Excellent galling resistance",
    ],
    applications: [
      "Pump shafts and impellers",
      "Marine fasteners and valve stems",
      "Oil well drill collars and instruments",
      "Doctor blades and scrapers",
    ],
    standards: {
      flanges: ["ASTM B564 (limited)", "ASTM B865 (bar / forgings)"],
      fittings: ["Machined components to drawing"],
      other: ["NACE MR0175 / ISO 15156 hardness limits"],
    },
    comparison: [
      { vs: "Monel 400", note: "K-500 offers about three times the yield strength; 400 is preferred where maximum ductility is needed." },
    ],
    faqs: [
      {
        q: "Why is hardness limited on Monel K-500?",
        a: "Higher hardness increases susceptibility to hydrogen embrittlement, particularly under cathodic protection in seawater. NACE MR0175 caps hardness at 35 HRC for sour service.",
      },
    ],
    maxTemp: "480 °C",
  },
  {
    slug: "nickel-200",
    name: "Nickel 200",
    uns: "UNS N02200",
    werkstoff: "2.4066",
    family: "nickel",
    tagline: "Commercially pure nickel for caustic and food processing service",
    summary:
      "99.6 % commercially pure wrought nickel with excellent resistance to caustic alkalis, neutral salts and high-purity process streams.",
    overview: [
      "Nickel 200 is used where product purity or caustic resistance governs. It is outstanding in sodium and potassium hydroxide at all concentrations up to the boiling point and resists dry chlorine and hydrogen chloride to about 550 °C.",
      "Above roughly 315 °C graphitisation of the carbon content can embrittle the alloy, which is why Nickel 201 (low carbon) is specified for elevated-temperature service.",
    ],
    composition: [
      { element: "Ni", percent: "99.0 min" },
      { element: "C", percent: "0.15 max" },
      { element: "Fe", percent: "0.40 max" },
      { element: "Cu", percent: "0.25 max" },
      { element: "Mn", percent: "0.35 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "380 MPa / 55 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "105 MPa / 15 ksi" },
      { label: "Elongation (min)", value: "40 %" },
    ],
    physical: [
      { label: "Density", value: "8.89 g/cm³" },
      { label: "Melting point", value: "1435 – 1446 °C" },
      { label: "Thermal conductivity", value: "70 W/m·K" },
    ],
    corrosion: [
      "Outstanding in caustic soda at all concentrations.",
      "Resists dry chlorine and hydrogen chloride to ~550 °C.",
      "Excellent for high-purity and food-grade processing.",
      "Poor in oxidising acids and ammonia solutions.",
    ],
    features: [
      "High thermal and electrical conductivity",
      "Magnetostrictive and magnetic at room temperature",
      "Excellent formability",
    ],
    applications: [
      "Caustic evaporators and concentrators",
      "Food, pharmaceutical and synthetic fibre plant",
      "Chlorination equipment",
      "Electrical and electronic components",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9", "ASME B16.11"],
      other: ["ASTM B162 (plate)", "ASTM B160 (bar)"],
    },
    comparison: [
      { vs: "Nickel 201", note: "201 has carbon below 0.02 % and is required above ~315 °C to avoid graphitisation embrittlement." },
    ],
    faqs: [
      {
        q: "Why choose nickel over stainless for caustic service?",
        a: "Stainless steels suffer caustic stress corrosion cracking at elevated temperature and concentration; commercially pure nickel does not, which is why it is the reference material for caustic evaporators.",
      },
    ],
    maxTemp: "315 °C (structural)",
  },
  {
    slug: "nickel-201",
    name: "Nickel 201",
    uns: "UNS N02201",
    werkstoff: "2.4068",
    family: "nickel",
    tagline: "Low-carbon commercially pure nickel for elevated-temperature caustic",
    summary:
      "Low-carbon version of Nickel 200 with carbon restricted to 0.02 % max, preventing graphitisation embrittlement above 315 °C.",
    overview: [
      "Nickel 201 is metallurgically identical to Nickel 200 except that carbon is held to 0.02 % maximum. This eliminates intergranular graphite precipitation, so the alloy can be used continuously above 315 °C.",
      "It has lower work-hardening rate than Nickel 200, which also makes it preferable for severe cold forming and spinning.",
    ],
    composition: [
      { element: "Ni", percent: "99.0 min" },
      { element: "C", percent: "0.02 max" },
      { element: "Fe", percent: "0.40 max" },
      { element: "Cu", percent: "0.25 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "345 MPa / 50 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "80 MPa / 12 ksi" },
      { label: "Elongation (min)", value: "40 %" },
    ],
    physical: [
      { label: "Density", value: "8.89 g/cm³" },
      { label: "Melting point", value: "1435 – 1446 °C" },
    ],
    corrosion: [
      "Excellent caustic resistance at high temperature and concentration.",
      "Resists dry halogens to elevated temperature.",
      "Same limitations as Nickel 200 in oxidising acids.",
    ],
    features: [
      "Carbon ≤ 0.02 % prevents graphitisation",
      "Lower work-hardening rate for deep forming",
      "Suitable for continuous service above 315 °C",
    ],
    applications: [
      "High-temperature caustic evaporators",
      "Chlorination and hydrogen chloride plant",
      "Combustion boats and furnace parts",
      "Deep-drawn and spun components",
    ],
    standards: {
      flanges: ["ASTM B564 / ASME SB564", "ASME B16.5"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9"],
      other: ["ASTM B162", "ASTM B160"],
    },
    comparison: [
      { vs: "Nickel 200", note: "Choose 201 whenever the service temperature exceeds approximately 315 °C." },
    ],
    faqs: [
      {
        q: "Can heats be dual certified Nickel 200 / 201?",
        a: "Yes, when carbon is below 0.02 % and mechanical properties satisfy both grades, dual certification is common and is stated on the MTC.",
      },
    ],
    maxTemp: "650 °C in caustic service",
  },
  {
    slug: "alloy-20",
    name: "Alloy 20",
    uns: "UNS N08020",
    werkstoff: "2.4660",
    family: "nickel",
    tagline: "Niobium-stabilised Fe-Ni-Cr-Mo-Cu alloy for sulphuric acid",
    summary:
      "Carpenter 20Cb-3 type alloy engineered specifically for sulphuric acid service, with copper and molybdenum for reducing resistance and niobium stabilisation.",
    overview: [
      "Alloy 20 sits between stainless steels and nickel alloys. It was developed for sulphuric acid handling, where its copper and molybdenum content gives excellent resistance across a wide concentration range at moderate cost.",
      "Niobium stabilisation prevents sensitisation during welding, and the alloy also resists chloride stress corrosion cracking better than 300-series stainless steel.",
    ],
    composition: [
      { element: "Ni", percent: "32.0 – 38.0" },
      { element: "Cr", percent: "19.0 – 21.0" },
      { element: "Mo", percent: "2.0 – 3.0" },
      { element: "Cu", percent: "3.0 – 4.0" },
      { element: "Nb", percent: "8 × C min – 1.00 max" },
      { element: "Fe", percent: "Balance" },
      { element: "C", percent: "0.07 max" },
    ],
    mechanical: [
      { label: "Tensile strength (min)", value: "551 MPa / 80 ksi" },
      { label: "Yield strength 0.2 % (min)", value: "241 MPa / 35 ksi" },
      { label: "Elongation (min)", value: "30 %" },
    ],
    physical: [
      { label: "Density", value: "8.08 g/cm³" },
      { label: "Melting range", value: "1370 – 1425 °C" },
      { label: "Modulus of elasticity", value: "193 GPa" },
    ],
    corrosion: [
      "Excellent resistance to sulphuric acid at many concentrations and temperatures.",
      "Resists phosphoric acid, nitric acid and many salt solutions.",
      "Niobium stabilised against intergranular attack after welding.",
      "Better chloride SCC resistance than 316L but inferior to nickel-base CRAs.",
    ],
    features: [
      "Cost-effective acid-service alloy",
      "Stabilised for as-welded fabrication",
      "Widely available as flanges, fittings, plate and bar",
    ],
    applications: [
      "Sulphuric acid production and handling",
      "Pickling and plating plant",
      "Pharmaceutical and food processing",
      "Synthetic rubber and plastics manufacturing",
    ],
    standards: {
      flanges: ["ASTM B462 / ASME SB462", "ASME B16.5", "ASME B16.47"],
      fittings: ["ASTM B366 / ASME SB366", "ASME B16.9", "ASME B16.11"],
      other: ["ASTM B463 (plate)", "ASTM B473 (bar)"],
    },
    comparison: [
      { vs: "SS 904L", note: "904L is broadly similar; alloy 20 has niobium stabilisation and slightly higher copper for sulphuric acid." },
      { vs: "Hastelloy C-276", note: "C-276 far outperforms alloy 20 in chlorides and HCl at several times the cost." },
    ],
    faqs: [
      {
        q: "Which flange specification covers Alloy 20?",
        a: "ASTM B462 UNS N08020 covers forged flanges and fittings; dimensions follow ASME B16.5 or B16.47.",
      },
    ],
    maxTemp: "500 °C",
  },
];
