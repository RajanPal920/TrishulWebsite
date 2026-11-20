import chemicalProcessingImg from "@/assets/industries/chemicalProcessing.jpg";
import desalinationPlantsImg from "@/assets/industries/desalinationPlants.jpg";
import fertilizerPlantImg from "@/assets/industries/fertilizerPlant.jpg";
import fpsoProjectImg from "@/assets/industries/fpsoProject.jpg";
import gasProcessingImg from "@/assets/industries/gasProcesssing.jpg";
import heatExchangersImg from "@/assets/industries/heatExchangers.jpg";
import highTemperatureImg from "@/assets/industries/highTemperature.jpg";
import industrialProcessPlantsImg from "@/assets/industries/industrialProcessPlants.jpg";
import lngPlantsImg from "@/assets/industries/lngPlants.jpg";
import marineShipImg from "@/assets/industries/marine-Ship.jpg";
import miningMineralImg from "@/assets/industries/mining-mineral.jpg";
import offshoreOilGasImg from "@/assets/industries/oil_gas.jpeg.png";
import onshoreOilImg from "@/assets/industries/onshore-oil.jpg";
import petrochemicalPlantImg from "@/assets/industries/petrochemicalPlant.jpg";
import powerGenerationImg from "@/assets/industries/powerGeneration.jpg";
import pulpPaperImg from "@/assets/industries/pulp-paper.jpg";
import refineriesImg from "@/assets/industries/refineries.jpg";
import seawaterImg from "@/assets/industries/seawater.jpg";
import sourServiceImg from "@/assets/industries/sourService.jpg";
import subseaEngineeringImg from "@/assets/industries/subseaEnginerring.jpg";

export interface Industry {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  image: string;
  imageAlt: string;
  environment: string[];
  alloys: string[];
  products: string[];
  standards: string[];
  procurement: string[];
  testing: string[];
}

export const industries: Industry[] = [
  {
    slug: "offshore-oil-and-gas",
    image: offshoreOilGasImg,
    imageAlt: "Offshore platform topside and process piping in harsh marine environment",
    name: "Offshore Oil & Gas",
    tagline: "Topside and platform piping for chloride, sour and firewater duty",
    summary:
      "Offshore platforms combine warm seawater, chlorides, salt-laden atmosphere, hydrocarbon service and strict weight limits, which pushes material selection toward super duplex, 6Mo and nickel alloys rather than austenitic stainless steel.",
    environment: [
      "Marine atmosphere with continuous chloride deposition and salt spray",
      "Seawater cooling and firewater systems at 5–35 °C, often chlorinated",
      "Produced fluids containing CO2, H2S, chlorides and elemental sulphur",
      "Weight and space limits favour high-strength thin-wall materials",
    ],
    alloys: [
      "Super Duplex UNS S32750 and S32760 for seawater and produced water",
      "Duplex 2205 for topside process and utility service",
      "Inconel 625 and Incoloy 825 for sour and high-chloride duty",
      "254 SMO where austenitic formability is preferred",
    ],
    products: [
      "Weld neck and blind flanges, classes 150–2500",
      "Buttweld elbows, tees and reducers for spool fabrication",
      "Stub ends and lap joint assemblies for weight-optimised systems",
      "Spectacle blinds for maintenance isolation",
    ],
    standards: [
      "ASME B16.5 / B16.47 / B16.9 / B16.11",
      "ASTM A182, A403, A815, B564, B366",
      "NORSOK M-630 material requirements where the project specifies, with manufacturer M-650 qualification verified per enquiry",
      "NACE MR0175 / ISO 15156 for sour service",
    ],
    procurement: [
      "Confirm whether 3.1 or 3.2 certification with TPI witness is required",
      "Check whether the project mandates a qualified manufacturer list (M-650 QTR)",
      "State ferrite and impact test temperature requirements at RFQ stage",
      "Allow lead time for G48 corrosion testing on super duplex items",
    ],
    testing: [
      "Charpy impact at −46 °C",
      "Ferrite count per ASTM E562 or ferritescope",
      "ASTM G48 Method A pitting test at 50 °C",
      "PMI on 100 % of items where specified",
    ],
  },
  {
    slug: "onshore-oil-and-gas",
    image: onshoreOilImg,
    imageAlt: "Onshore oil and gas gathering lines, manifold piping and separator systems",
    name: "Onshore Oil & Gas",
    tagline: "Wellhead, gathering and processing piping for sour and CO2 service",
    summary:
      "Onshore production covers wellheads, gathering lines, separation and gas treatment, with corrosion driven by CO2, H2S, chlorides in produced water and, in desert regions, high ambient temperature and sand erosion.",
    environment: [
      "Wet CO2 causing sweet corrosion in carbon steel systems",
      "H2S partial pressures requiring sour-service qualified materials",
      "Produced water with high chloride and bicarbonate content",
      "Sand erosion at chokes, bends and separator inlets",
    ],
    alloys: [
      "Incoloy 825 and Inconel 625 for wellhead and flowline CRA components",
      "Duplex 2205 for produced water and separation service",
      "Inconel 718 and 725 for high-strength downhole and wellhead hardware",
      "316L for low-severity utility service",
    ],
    products: [
      "Weld neck and long weld neck flanges for manifolds",
      "Forged socket weld and threaded fittings for small-bore lines",
      "Buttweld fittings for gathering and process piping",
      "Orifice flange assemblies for metering",
    ],
    standards: [
      "API 6A / 6ACRA for wellhead components",
      "ASME B16.5 / B16.47 / B16.9",
      "NACE MR0175 / ISO 15156 Parts 2 and 3",
      "ASTM B564, B366, A182, A403",
    ],
    procurement: [
      "Provide H2S partial pressure, chloride content, pH and temperature so material group can be verified",
      "Specify hardness limits and record them on the MTC",
      "Confirm whether API monogrammed items are required",
      "Allow for PMI at receipt inspection on CRA components",
    ],
    testing: [
      "Hardness testing per NACE MR0175",
      "PMI of every CRA item",
      "Hydrostatic testing where the piping class requires",
      "Third-party witness on critical wellhead components",
    ],
  },
  {
    slug: "subsea-engineering",
    image: subseaEngineeringImg,
    imageAlt: "Subsea manifolds, flowlines and seabed high-pressure CRA piping connections",
    name: "Subsea Engineering",
    tagline: "Manifolds, jumpers and connection systems for deepwater service",
    summary:
      "Subsea hardware must survive external seawater with cathodic protection, internal produced fluids, hydrostatic pressure and design lives of 25 years or more without intervention, so material and documentation requirements are the most demanding in the industry.",
    environment: [
      "Continuous seawater immersion with cathodic protection",
      "Hydrogen-induced stress cracking risk on high-strength materials under CP",
      "Internal sour and high-chloride produced fluids",
      "Low seabed temperature and thermal cycling during shut-in",
    ],
    alloys: [
      "Super Duplex S32760 / S32750 for manifolds and structural piping",
      "Inconel 625 for clad surfaces, hubs and severe-service components",
      "Inconel 718 and 725 for high-strength connectors and fasteners",
      "Alloy 825 for flowline internals",
    ],
    products: [
      "Heavy-wall forged flanges and hubs",
      "Long weld neck flanges and forged blocks to drawing",
      "Buttweld fittings for jumper and spool fabrication",
      "Stub ends for weight-optimised connections",
    ],
    standards: [
      "NORSOK M-630 material requirements and DNV specifications, with manufacturer M-650 qualification verified per enquiry",
      "ISO 13628 for subsea production systems",
      "ASTM A182 F55 / F53, ASTM B564",
      "NACE MR0175 / ISO 15156",
    ],
    procurement: [
      "3.2 certification with third-party witness is normal",
      "Manufacturing procedure specifications and QTRs may need approval before production",
      "Full traceability from melt to dispatch is mandatory",
      "Long lead times — engage at FEED stage where possible",
    ],
    testing: [
      "ASTM G48 corrosion testing and A923 intermetallic screening",
      "Charpy impact at −46 °C or lower",
      "Ultrasonic and magnetic particle / dye penetrant examination",
      "Ferrite measurement across the section thickness",
    ],
  },
  {
    slug: "refineries",
    image: refineriesImg,
    imageAlt: "Crude distillation units, hydrocrackers and heavy-wall refinery piping systems",
    name: "Refineries",
    tagline: "Crude, hydroprocessing and overhead systems across a wide corrosion map",
    summary:
      "A refinery contains dozens of distinct corrosion environments — naphthenic acid, high-temperature sulphidation, wet H2S, hydrogen service, amine circuits and chloride-bearing overheads — so material selection is unit-specific rather than plant-wide.",
    environment: [
      "High-temperature sulphidation in crude and vacuum units",
      "Naphthenic acid corrosion in high-TAN crude service",
      "Wet H2S cracking in overhead and sour water systems",
      "Chloride and ammonium chloride deposition in overhead condensers",
    ],
    alloys: [
      "SS 321 / 347 for high-temperature stabilised service",
      "SS 316L for general process piping",
      "Incoloy 825 and Inconel 625 for severe corrosion points",
      "Monel 400 for HF alkylation and overhead systems",
    ],
    products: [
      "Weld neck and blind flanges to ASME B16.5 / B16.47",
      "Buttweld elbows, tees and reducers",
      "180° return bends for heater coils",
      "Orifice flange assemblies",
    ],
    standards: [
      "ASME B31.3 process piping",
      "API 570 / 571 damage mechanisms",
      "ASTM A182, A403, B564, B366",
      "NACE SP0472 for wet H2S service",
    ],
    procurement: [
      "Match grade and H-variant (321H, 347H) to the design temperature",
      "State PWHT and impact requirements where applicable",
      "Turnaround supply requires firm, date-certain delivery commitments",
      "Confirm positive material identification requirements for alloy tracking",
    ],
    testing: [
      "PMI to prevent alloy mix-up in high-temperature service",
      "Intergranular corrosion testing per ASTM A262 where specified",
      "Hardness testing in wet H2S service",
      "Dimensional and NDE inspection to piping class",
    ],
  },
  {
    slug: "petrochemical-plants",
    image: petrochemicalPlantImg,
    imageAlt: "Petrochemical olefin synthesis, cracking furnaces and polymer piping networks",
    name: "Petrochemical Plants",
    tagline: "Cracking, polymerisation and derivative units with mixed chemical exposure",
    summary:
      "Petrochemical complexes combine high-temperature cracking service with aggressive chemical intermediates, catalyst systems and chloride-bearing utilities, requiring both heat-resistant and corrosion-resistant alloys within the same facility.",
    environment: [
      "Carburising and coking conditions in cracking furnaces",
      "Chlorinated organic intermediates causing localised corrosion",
      "Caustic and amine circuits with SCC risk",
      "Steam and condensate systems with cyclic thermal loading",
    ],
    alloys: [
      "Incoloy 800H / 800HT for furnace and reformer service",
      "Hastelloy C-276 and C-22 for chlorinated intermediates",
      "Duplex 2205 for chloride-bearing water systems",
      "SS 316L / 321 for general and high-temperature process lines",
    ],
    products: [
      "Buttweld fittings and return bends for furnace coils",
      "Heavy-class flanges for reactor connections",
      "Forged fittings for small-bore chemical injection",
      "Spectacle blinds for maintenance isolation",
    ],
    standards: [
      "ASME B31.3, ASME Section VIII",
      "ASTM B366 / B564 for nickel alloys",
      "ASTM A403 / A182 for stainless",
      "ASTM A923 for duplex intermetallic testing",
    ],
    procurement: [
      "Specify creep-relevant grades (800H / 800HT) explicitly, not just alloy 800",
      "Confirm grain size and solution annealing requirements",
      "Plan long lead times for high-nickel forgings",
      "Bundle turnaround requirements into a single traceable package",
    ],
    testing: [
      "Grain size verification for creep grades",
      "PMI and chemical verification",
      "IGC testing per ASTM A262 / G28 as applicable",
      "Radiographic examination of critical welds",
    ],
  },
  {
    slug: "lng-plants",
    image: lngPlantsImg,
    imageAlt: "Liquefied natural gas liquefaction trains and cryogenic storage piping",
    name: "LNG Plants",
    tagline: "Cryogenic liquefaction and regasification piping systems",
    summary:
      "LNG facilities require materials that retain toughness at −162 °C, combined with warm seawater or air cooling systems and amine or molecular sieve pretreatment units that impose their own corrosion requirements.",
    environment: [
      "Cryogenic service to −162 °C requiring austenitic toughness",
      "Amine and acid gas removal units",
      "Seawater or air cooling systems with chloride exposure",
      "Thermal cycling during start-up and shutdown",
    ],
    alloys: [
      "SS 304L / 316L for cryogenic piping",
      "Duplex 2205 for utility and cooling water service",
      "Super duplex for seawater intake systems",
      "Inconel 625 for severe acid gas conditions",
    ],
    products: [
      "Weld neck flanges with cryogenic impact testing",
      "Buttweld fittings in austenitic grades",
      "Blind flanges and spectacle blinds",
      "Small-bore forged fittings for instrumentation",
    ],
    standards: [
      "ASME B31.3 Chapter VIII (low temperature)",
      "ASTM A182 / A403 with impact testing",
      "EN 10204 3.1 / 3.2 certification",
      "ISO 21009 / EN 1160 references",
    ],
    procurement: [
      "State the design minimum temperature and impact test requirement clearly",
      "Confirm whether cryogenic testing must be witnessed",
      "Ensure austenitic material is supplied solution annealed",
      "Verify low ferrite requirements for cryogenic weldments",
    ],
    testing: [
      "Charpy impact at −196 °C for cryogenic duty",
      "Ferrite control in austenitic welds",
      "Liquid penetrant examination",
      "Hydrostatic and helium leak testing at system level",
    ],
  },
  {
    slug: "gas-processing",
    image: gasProcessingImg,
    imageAlt: "Natural gas sweetening, dehydration and acid gas removal piping installations",
    name: "Gas Processing",
    tagline: "Dehydration, sweetening and NGL recovery systems",
    summary:
      "Gas processing plants handle wet sour gas, glycol and amine circuits and low-temperature NGL fractionation, requiring both sour-service qualified alloys and low-temperature toughness in the same facility.",
    environment: [
      "Wet sour gas with H2S and CO2 partial pressures",
      "Rich amine circuits with cracking and erosion risk",
      "Glycol dehydration with thermal degradation products",
      "Low-temperature NGL fractionation service",
    ],
    alloys: [
      "Incoloy 825 and Inconel 625 for sour and chloride duty",
      "Duplex 2205 for produced water and utility systems",
      "SS 316L for amine and glycol circuits within limits",
      "Hastelloy C-276 for severe acid gas conditions",
    ],
    products: [
      "Weld neck and blind flanges for separator connections",
      "Buttweld fittings for process piping",
      "Forged fittings for chemical injection points",
      "Orifice flanges for custody metering",
    ],
    standards: [
      "NACE MR0175 / ISO 15156",
      "ASME B31.3 and B16 series",
      "ASTM B564 / B366 / A182 / A403",
      "API 12 series for equipment interfaces",
    ],
    procurement: [
      "Supply full fluid composition so material group can be verified against MR0175",
      "Confirm hardness limits and heat-treatment condition",
      "State low-temperature impact requirements for NGL service",
      "Plan CRA lead times against turnaround dates",
    ],
    testing: [
      "Hardness testing and reporting per MR0175",
      "PMI on all CRA items",
      "Impact testing for cold sections",
      "Third-party inspection where the client requires",
    ],
  },
  {
    slug: "chemical-processing",
    image: chemicalProcessingImg,
    imageAlt: "Acid reaction vessels, aggressive media transfer and corrosive chemical processing spools",
    name: "Chemical Processing",
    tagline: "Acid, alkali and halogenated process environments",
    summary:
      "Chemical plants present the widest range of corrosion environments of any sector, from boiling sulphuric acid to chlorinated organics and caustic evaporation, and alloy selection must be made per stream rather than per plant.",
    environment: [
      "Reducing acids: hydrochloric, sulphuric, phosphoric",
      "Oxidising acids: nitric and mixed acid streams",
      "Halogenated organic intermediates",
      "Hot caustic and alkaline evaporation",
    ],
    alloys: [
      "Hastelloy C-276, C-22 and C-2000 for mixed and reducing acids",
      "Hastelloy B-2 / B-3 for hydrochloric acid",
      "Alloy 20 and 904L for sulphuric acid",
      "Nickel 200 / 201 for caustic service",
    ],
    products: [
      "Forged flanges in nickel alloy grades",
      "Buttweld and socket weld fittings",
      "Lap joint assemblies for lined and glass-lined systems",
      "Blind flanges and blanking components",
    ],
    standards: [
      "ASTM B564 / B366 / B462",
      "ASME B16.5 / B16.9 / B16.11",
      "ASTM G28 corrosion testing",
      "ASME B31.3 Category M fluid service where applicable",
    ],
    procurement: [
      "Provide the exact chemical stream, concentration and temperature",
      "Do not substitute alloy grades without process engineering approval",
      "Specify as-welded corrosion testing where required",
      "Confirm surface finish and cleanliness requirements",
    ],
    testing: [
      "ASTM G28 Method A / B intergranular corrosion testing",
      "PMI on every item",
      "Ferric chloride pitting tests where specified",
      "Dye penetrant examination of welds",
    ],
  },
  {
    slug: "desalination-plants",
    image: desalinationPlantsImg,
    imageAlt: "Reverse osmosis high-pressure membrane headers and thermal desalination plant piping",
    name: "Desalination Plants",
    tagline: "Seawater intake, RO trains and MSF evaporator piping",
    summary:
      "Desalination combines raw seawater, deaerated brine, high-pressure RO service and elevated temperature in MSF plants, making crevice corrosion resistance and pressure rating the dominant selection criteria.",
    environment: [
      "Raw seawater intake with biofouling and chlorination",
      "High-pressure reverse osmosis feed at 60–80 bar",
      "Concentrated brine reject with elevated chloride",
      "MSF evaporator service to 110 °C in deaerated brine",
    ],
    alloys: [
      "Super Duplex S32750 / S32760 for high-pressure RO piping",
      "254 SMO for seawater and brine service",
      "Duplex 2205 for deaerated and lower-chloride sections",
      "Inconel 625 for severe crevice-risk components",
    ],
    products: [
      "High-class weld neck flanges for RO headers",
      "Buttweld fittings for large-diameter intake lines",
      "Blind flanges for train isolation",
      "Stub ends and lap joints for maintainable sections",
    ],
    standards: [
      "ASTM A182 F53 / F55 / F44",
      "ASTM A815 for duplex fittings",
      "ASME B16.5 / B16.47 / B16.9",
      "ASTM G48 Method A corrosion testing",
    ],
    procurement: [
      "State chloride content, temperature and chlorination regime",
      "Specify the G48 test temperature required by the client",
      "Confirm whether crevice (Method B/D) testing is required in addition to pitting",
      "Verify PREN calculation basis for super duplex items",
    ],
    testing: [
      "ASTM G48 pitting and crevice testing",
      "Ferrite count and A923 screening",
      "Hydrostatic testing on high-pressure items",
      "PMI and hardness verification",
    ],
  },
  {
    slug: "marine-and-shipbuilding",
    image: marineShipImg,
    imageAlt: "Commercial shipbuilding, seawater ballast manifolds and vessel exhaust scrubber piping",
    name: "Marine & Shipbuilding",
    tagline: "Ballast, cargo, firewater and seawater cooling systems",
    summary:
      "Marine systems face continuous seawater and salt-laden atmosphere with limited maintenance access, and chemical tankers add the additional demand of carrying aggressive cargoes in the same piping.",
    environment: [
      "Continuous seawater exposure in ballast and cooling systems",
      "Salt-laden atmosphere on exposed deck piping",
      "Chemical cargo compatibility on tankers",
      "Vibration and fatigue loading from machinery and sea state",
    ],
    alloys: [
      "Super duplex and 254 SMO for seawater systems",
      "Duplex 2205 for chemical cargo lines",
      "Monel 400 for seawater pumps and fittings",
      "SS 316L for accommodation and utility service",
    ],
    products: [
      "Weld neck and slip-on flanges",
      "Buttweld elbows, tees and reducers",
      "Lap joint assemblies for maintainable spools",
      "Blind flanges and caps",
    ],
    standards: [
      "Class society rules (DNV, LR, ABS, BV)",
      "ASME B16.5 / B16.9 and EN 1092-1",
      "ASTM A182 / A403 / A815",
      "IMO chemical cargo compatibility requirements",
    ],
    procurement: [
      "Confirm whether class society certification is required",
      "State whether EN or ASME dimensional standards apply",
      "Provide the cargo list for chemical tanker piping",
      "Plan supply against dry-dock windows",
    ],
    testing: [
      "Class-witnessed mechanical testing where required",
      "Ferrite count on duplex items",
      "Hydrostatic and dimensional inspection",
      "PMI verification",
    ],
  },
  {
    slug: "fpso-projects",
    image: fpsoProjectImg,
    imageAlt: "Floating Production Storage and Offloading hull topsides, turret swivel and process modules",
    name: "FPSO Projects",
    tagline: "Topside process modules and marine systems on floating production units",
    summary:
      "An FPSO combines an offshore process plant with a marine vessel, so the material scope spans sour process service, seawater systems, cargo handling and utilities, all under strict weight and fabrication schedule constraints.",
    environment: [
      "Sour and CO2-bearing produced fluids",
      "Seawater lift, cooling and firewater systems",
      "Marine atmosphere with continuous chloride deposition",
      "Hull motion inducing fatigue loading on piping",
    ],
    alloys: [
      "Super duplex S32760 for seawater and produced water",
      "Duplex 2205 for topside process piping",
      "Inconel 625 for severe sour and cladding applications",
      "254 SMO for complex-geometry seawater fabrication",
    ],
    products: [
      "Weld neck flanges in classes 150–2500",
      "Buttweld fittings for module spool fabrication",
      "Stub ends for weight-critical systems",
      "Spectacle blinds for isolation during commissioning",
    ],
    standards: [
      "NORSOK M-630 material requirements where specified, with manufacturer M-650 qualification verified per enquiry",
      "ASME B16 series and ASTM A182 / A815 / B564",
      "Class society rules for marine systems",
      "NACE MR0175 / ISO 15156",
    ],
    procurement: [
      "Align delivery with module fabrication sequence, not overall project date",
      "Confirm packaging and preservation requirements for yard storage",
      "Specify marking and colour coding for material segregation on site",
      "Consolidate documentation into module-based dossiers",
    ],
    testing: [
      "Impact testing at −46 °C",
      "G48 corrosion testing on super duplex",
      "Ferrite measurement",
      "TPI witness at manufacturer works",
    ],
  },
  {
    slug: "heat-exchangers",
    image: heatExchangersImg,
    imageAlt: "Shell and tube heat exchangers, high-temperature tubesheets and cooling bundles",
    name: "Heat Exchangers",
    tagline: "Shell and tube, hairpin and air-cooled exchanger connections",
    summary:
      "Exchangers see two fluids and a thermal gradient across a single component, so material selection must satisfy both process streams while accommodating thermal cycling and differential expansion.",
    environment: [
      "Dual-fluid exposure with different corrosion mechanisms",
      "Thermal cycling and differential expansion stress",
      "Cooling water fouling, chlorination and under-deposit corrosion",
      "Elevated tube-side temperature accelerating attack",
    ],
    alloys: [
      "SS 316L and 321 for general exchanger service",
      "Duplex 2205 and super duplex for cooling water",
      "Incoloy 825 and Inconel 625 for aggressive process side",
      "Monel 400 for seawater-cooled condensers",
    ],
    products: [
      "Weld neck and long weld neck flanges for nozzles",
      "180° return bends for hairpin exchangers",
      "Blind flanges for channel covers and access",
      "Buttweld fittings for connecting spools",
    ],
    standards: [
      "TEMA and ASME Section VIII Division 1",
      "ASME B16.5 / B16.47 for nozzle flanges",
      "ASTM A182 / B564 for forgings",
      "ASTM A403 / B366 for fittings",
    ],
    procurement: [
      "Provide both shell-side and tube-side fluid data",
      "Specify nozzle flange bore to match the nozzle neck",
      "Confirm gasket and facing requirements for the exchanger design",
      "State thermal cycling expectations for fatigue-sensitive joints",
    ],
    testing: [
      "PMI and chemical verification",
      "Hydrostatic testing at component level where required",
      "Dimensional inspection of nozzle interfaces",
      "IGC testing for stabilised grades",
    ],
  },
  {
    slug: "power-generation",
    image: powerGenerationImg,
    imageAlt: "Supercritical steam piping, combined cycle turbine headers and cooling loops",
    name: "Power Generation",
    tagline: "Boiler, steam, feedwater and cooling systems",
    summary:
      "Power plants need creep-resistant materials for high-temperature steam and corrosion-resistant materials for condenser and cooling circuits, with flue gas cleaning systems adding a highly aggressive acidic environment.",
    environment: [
      "Superheated steam at high temperature and pressure",
      "Feedwater chemistry control and oxygen scavenging",
      "Condenser cooling water, often seawater or brackish",
      "Acidic flue gas condensate in FGD systems",
    ],
    alloys: [
      "SS 321H / 347H for high-temperature steam service",
      "Incoloy 800H / 800HT for the hottest sections",
      "Duplex and super duplex for cooling water",
      "Hastelloy C-276 / C-22 and alloy 686 for FGD",
    ],
    products: [
      "High-class weld neck flanges for steam headers",
      "Buttweld fittings and return bends",
      "Large-diameter fittings for cooling water",
      "Blind flanges and access closures",
    ],
    standards: [
      "ASME B31.1 power piping",
      "ASME Section I and Section VIII",
      "ASTM A182 / A403 H grades",
      "ASTM B564 / B366 for nickel alloys",
    ],
    procurement: [
      "Specify H grades explicitly where creep allowables are used",
      "Confirm PWHT and hardness requirements",
      "Align supply with outage windows",
      "Provide design temperature and pressure for material verification",
    ],
    testing: [
      "Grain size verification for H grades",
      "PMI to prevent alloy mix-up",
      "Hardness testing after heat treatment",
      "Radiographic and ultrasonic examination",
    ],
  },
  {
    slug: "fertilizer-plants",
    image: fertilizerPlantImg,
    imageAlt: "Ammonia synthesis loops, urea reactor headers and nitric acid processing piping",
    name: "Fertilizer Plants",
    tagline: "Ammonia, urea and phosphoric acid production systems",
    summary:
      "Fertilizer production combines high-pressure ammonia and urea synthesis with strongly corrosive carbamate and phosphoric acid streams, requiring specialised high-alloy materials in defined plant sections.",
    environment: [
      "Ammonium carbamate in urea synthesis — extremely corrosive",
      "High-pressure hydrogen and nitrogen in ammonia synthesis",
      "Phosphoric acid with fluoride and chloride contamination",
      "High-temperature reformer service",
    ],
    alloys: [
      "Incoloy 800H / 800HT for reformer piping",
      "904L and alloy 20 for phosphoric acid",
      "Duplex and super duplex for urea plant sections",
      "Inconel 625 for severe carbamate service",
    ],
    products: [
      "High-pressure forged flanges",
      "Buttweld fittings and return bends",
      "Forged small-bore fittings",
      "Blind flanges and blanking components",
    ],
    standards: [
      "ASME B31.3 and Section VIII",
      "ASTM B564 / B366 / A182 / A403",
      "Urea-grade material requirements per licensor",
      "ASTM A262 / G28 corrosion testing",
    ],
    procurement: [
      "Follow the process licensor's approved material list precisely",
      "Confirm whether urea-grade testing is required",
      "Allow lead time for specialised high-alloy forgings",
      "State any restriction on residual elements",
    ],
    testing: [
      "Huey / Streicher corrosion testing where specified",
      "PMI on every item",
      "Hardness and mechanical testing",
      "Third-party inspection per licensor requirements",
    ],
  },
  {
    slug: "pulp-and-paper",
    image: pulpPaperImg,
    imageAlt: "Continuous digesters, bleach plant chlorine dioxide headers and chemical recovery piping",
    name: "Pulp & Paper",
    tagline: "Digester, bleach plant and recovery boiler systems",
    summary:
      "Pulp and paper mills combine hot caustic digestion with chlorine dioxide bleaching and chloride-rich white water, an unusual combination that drives specification of duplex, 6Mo and nickel alloys.",
    environment: [
      "Hot alkaline digester liquor",
      "Chlorine dioxide and peroxide bleaching stages",
      "Chloride accumulation in closed white-water loops",
      "Sulphurous compounds in recovery systems",
    ],
    alloys: [
      "Duplex 2205 for digesters and liquor systems",
      "254 SMO and super duplex for bleach plant service",
      "Hastelloy C-276 and alloy 686 for the most severe bleaching stages",
      "SS 316L for lower-severity utility service",
    ],
    products: [
      "Large-diameter flanges and fittings",
      "Buttweld elbows and tees for liquor piping",
      "Blind flanges and spectacle blinds",
      "Lap joint assemblies for maintainable sections",
    ],
    standards: [
      "ASME B16.5 / B16.47 / B16.9",
      "ASTM A182 / A403 / A815 / B366",
      "ASTM G48 for pitting resistance",
      "TAPPI guidance on material selection",
    ],
    procurement: [
      "State bleaching chemistry and residual chloride level",
      "Confirm whether as-welded corrosion performance is required",
      "Match alloy selection to the specific bleaching stage",
      "Plan supply around annual mill shutdowns",
    ],
    testing: [
      "G48 pitting testing",
      "PMI verification",
      "Ferrite measurement on duplex items",
      "Dimensional inspection of large-diameter fittings",
    ],
  },
  {
    slug: "mining-and-mineral-processing",
    image: miningMineralImg,
    imageAlt: "Acid leaching circuits, autoclave piping and abrasive slurry mineral processing lines",
    name: "Mining & Mineral Processing",
    tagline: "Leaching, autoclave and tailings systems",
    summary:
      "Hydrometallurgical processing exposes piping to hot acidic slurries containing chlorides and oxidising metal ions, combining corrosion with severe erosion — the most demanding combination in industrial piping.",
    environment: [
      "Sulphuric acid leaching at elevated temperature and pressure",
      "Chloride-bearing process water in many orebodies",
      "Ferric and cupric ions creating strongly oxidising conditions",
      "Abrasive slurry causing erosion-corrosion",
    ],
    alloys: [
      "Hastelloy C-276 and C-22 for autoclave and leach circuits",
      "Alloy 20 and 904L for sulphuric acid service",
      "Super duplex for chloride-bearing process water",
      "Titanium-compatible flange interfaces where specified",
    ],
    products: [
      "Heavy-class flanges for autoclave connections",
      "Buttweld fittings with wear allowance",
      "Long radius bends for slurry lines",
      "Blind flanges and inspection closures",
    ],
    standards: [
      "ASME B16.5 / B16.9",
      "ASTM B564 / B366 / B462",
      "ASTM G28 corrosion testing",
      "Client-specific hydrometallurgical specifications",
    ],
    procurement: [
      "Provide slurry composition, solids loading and velocity",
      "Consider increased wall thickness for erosion allowance",
      "Confirm oxidising ion content before selecting Ni-Mo alloys",
      "Specify long radius bends in abrasive service",
    ],
    testing: [
      "G28 corrosion testing",
      "Wall thickness verification",
      "PMI on all alloy items",
      "Hydrostatic testing on autoclave-related components",
    ],
  },
  {
    slug: "industrial-process-plants",
    image: industrialProcessPlantsImg,
    imageAlt: "Specialty industrial processing plants, batch reactors and utility piping networks",
    name: "Industrial Process Plants",
    tagline: "General manufacturing, utilities and balance-of-plant piping",
    summary:
      "General industrial facilities need reliable, well-documented flanges and fittings across a wide range of moderate-severity services, where availability, certification quality and delivery reliability matter more than exotic alloy selection.",
    environment: [
      "Steam, condensate and hot water utilities",
      "Compressed air and nitrogen systems",
      "Cooling water with treatment chemicals",
      "Moderate-severity process chemicals",
    ],
    alloys: [
      "SS 304L and 316L for the majority of service",
      "Duplex 2205 where chloride or strength governs",
      "Alloy 20 and 904L for acid handling sections",
      "Nickel 200 for caustic circuits",
    ],
    products: [
      "Weld neck, slip-on and blind flanges",
      "Buttweld and forged fittings",
      "Reducers and caps",
      "Spectacle blinds and spacers",
    ],
    standards: [
      "ASME B16.5 / B16.9 / B16.11",
      "ASTM A182 / A403",
      "EN 1092-1 where European standards apply",
      "EN 10204 3.1 certification",
    ],
    procurement: [
      "Standardise on a limited grade and class list to simplify stocking",
      "Consolidate requirements into fewer, larger orders for better pricing",
      "Confirm whether EN or ASME dimensional standards apply",
      "Request consistent marking for warehouse identification",
    ],
    testing: [
      "Standard mechanical and chemical certification",
      "PMI on request",
      "Dimensional inspection",
      "Hydrostatic testing where the class requires",
    ],
  },
  {
    slug: "seawater-systems",
    image: seawaterImg,
    imageAlt: "Seawater intake, chlorination distribution and offshore cooling water piping networks",
    name: "Seawater Systems",
    tagline: "Lift, cooling, firewater and ballast piping in natural seawater",
    summary:
      "Seawater is the single most demanding common industrial fluid for stainless steels because chloride, temperature, biofouling and crevices under gaskets combine to attack any material with insufficient PREN.",
    environment: [
      "Chloride content around 19,000 ppm in open ocean",
      "Biofouling and under-deposit crevice conditions",
      "Chlorination raising the oxidising potential",
      "Stagnant periods in standby firewater systems",
    ],
    alloys: [
      "Super Duplex S32750 / S32760 as the standard choice",
      "254 SMO where austenitic fabrication is preferred",
      "Inconel 625 for the highest-risk components",
      "Monel 400 for flowing seawater pumps and fittings",
    ],
    products: [
      "Weld neck and blind flanges",
      "Large-diameter buttweld fittings",
      "Stub ends and lap joint assemblies",
      "Spectacle blinds for isolation",
    ],
    standards: [
      "ASTM A182 F53 / F55 / F44",
      "ASTM A815 / A403",
      "ASTM G48 Method A / B",
      "NORSOK M-630 material requirements where applicable",
    ],
    procurement: [
      "Specify maximum seawater temperature and chlorination residual",
      "Require G48 testing at the temperature stated in the project specification",
      "Consider crevice testing in addition to pitting tests",
      "Confirm gasket material to avoid crevice initiation at the flange face",
    ],
    testing: [
      "ASTM G48 Method A pitting test",
      "Crevice corrosion testing where specified",
      "Ferrite count and A923 screening",
      "PMI and hardness verification",
    ],
  },
  {
    slug: "high-temperature-applications",
    image: highTemperatureImg,
    imageAlt: "Industrial pyrolysis furnaces, reformer headers and high-temperature thermal piping",
    name: "High-Temperature Applications",
    tagline: "Furnace, reformer and thermal processing components",
    summary:
      "Above roughly 550 °C the governing properties change from corrosion resistance to creep strength, oxidation resistance and structural stability during long exposure, which is why the alloy families used are entirely different.",
    environment: [
      "Sustained creep loading at 600–1100 °C",
      "Cyclic oxidation causing scale spalling",
      "Carburising and nitriding furnace atmospheres",
      "Thermal fatigue during start-up and shutdown",
    ],
    alloys: [
      "Incoloy 800H / 800HT for reformer and heater service",
      "Inconel 601 for cyclic oxidation resistance",
      "Inconel 617 for the highest creep-strength requirements",
      "SS 321H / 347H for moderate temperatures",
    ],
    products: [
      "Weld neck flanges for hot headers",
      "180° return bends for coils",
      "Buttweld fittings in creep grades",
      "Long weld neck connections",
    ],
    standards: [
      "ASME B31.1 / B31.3 and Section I / VIII",
      "ASTM B564 / B366 for nickel alloys",
      "ASTM A182 / A403 H grades",
      "API 530 for heater tube design",
    ],
    procurement: [
      "Always specify the H variant where creep allowables are used",
      "Require grain size and solution annealing records on the MTC",
      "Confirm whether dual certification is acceptable",
      "Plan long lead times for large high-nickel forgings",
    ],
    testing: [
      "Grain size measurement per ASTM E112",
      "Elevated-temperature tensile testing where specified",
      "PMI verification",
      "Ultrasonic examination of heavy sections",
    ],
  },
  {
    slug: "sour-service-applications",
    image: sourServiceImg,
    imageAlt: "NACE MR0175 compliant H2S sour gas piping, gathering spools and wellhead CRA components",
    name: "Sour Service Applications",
    tagline: "H2S-bearing systems governed by NACE MR0175 / ISO 15156",
    summary:
      "Sour service is defined by the presence of H2S at partial pressures capable of causing sulphide stress cracking, and compliance is a documented, testable requirement rather than a general material preference.",
    environment: [
      "H2S partial pressure above 0.05 psi (0.0003 MPa)",
      "Chloride content and in-situ pH governing material group limits",
      "Elemental sulphur deposition in some gas systems",
      "Temperature affecting cracking mechanism and severity",
    ],
    alloys: [
      "Incoloy 825 and Inconel 625 for CRA piping",
      "Duplex 2205 and super duplex within defined envelopes",
      "Inconel 718 / 725 for high-strength components",
      "Hastelloy C-276 for the most severe conditions",
    ],
    products: [
      "Weld neck flanges with certified hardness",
      "Buttweld and forged fittings",
      "Long weld neck and drawing-based components",
      "Blind flanges and isolation components",
    ],
    standards: [
      "NACE MR0175 / ISO 15156 Parts 1, 2 and 3",
      "API 6A / 6ACRA for wellhead equipment",
      "ASTM B564 / B366 / A182 / A815",
      "ASME B16 series for dimensions",
    ],
    procurement: [
      "Supply H2S partial pressure, chloride level, in-situ pH and temperature with the enquiry",
      "State the required material group and hardness limit explicitly",
      "Require hardness results and heat-treatment condition on the MTC",
      "Confirm whether SSC or HIC testing is required",
    ],
    testing: [
      "Hardness testing per MR0175 limits",
      "NACE TM0177 SSC testing where specified",
      "HIC testing per NACE TM0284 for carbon steel interfaces",
      "PMI and full traceability documentation",
    ],
  },
  {
    slug: "data-centres-and-liquid-cooling",
    image: heatExchangersImg,
    imageAlt: "Hyperscale data centre liquid cooling headers, distribution manifolds and quick-disconnect stainless piping",
    name: "Data Centres & Liquid Cooling",
    tagline: "Precision stainless piping and manifolds for high-density AI and compute cooling loops",
    summary:
      "Modern AI clusters and hyperscale data centres generate thermal loads exceeding 100 kW per rack, transitioning thermal management from air cooling to direct-to-chip liquid cooling and rear-door heat exchangers. This demands high-purity austenitic stainless steel piping, manifolds and fittings free of particulate contamination, corrosion or braze failure risks.",
    environment: [
      "Deionized / reverse-osmosis treated water and propylene glycol mixtures at 25–65 °C",
      "Closed-loop cooling with ultra-low particulate and dissolved ion limits",
      "Zero-leakage tolerance above server blades and high-voltage power distribution",
      "Continuous 24/7 pumping operation with rapid thermal cycling under fluctuating compute loads",
    ],
    alloys: [
      "Stainless 316L (UNS S31603) for high corrosion resistance and chemical cleanliness",
      "Stainless 304L (UNS S30403) for secondary cooling loops and facility chiller circuits",
      "Titanium and Inconel 625 for specialized dielectric and extreme density immersion cooling",
    ],
    products: [
      "Orbital-welded and clean-bore instrumentation tubing and manifolds",
      "Class 150 weld neck and lap joint flanges with precision machine faces",
      "Sanitary and buttweld elbows, equal tees and concentric reducers",
      "Custom CNC machined distribution blocks and coolant distribution unit (CDU) headers",
    ],
    standards: [
      "ASME B16.5, ASME B16.9, ASME B31.3 Process Piping",
      "ASTM A269 / A270 for seamless and welded austenitic stainless tubing",
      "ASTM A182 / A403 for forged flanges and fittings",
      "ASHRAE TC 9.9 Thermal Guidelines for Data Processing Environments",
    ],
    procurement: [
      "Specify electropolished or bright-annealed ID surface finish (Ra ≤ 0.5 µm / 20 µin) where required",
      "State required tube end prep for compression fittings or automatic orbital welding",
      "Demand 100% helium leak testing and hydrocarbon-free cleaning certification",
      "Include protective end caps and sealed poly packaging for cleanroom installation",
    ],
    testing: [
      "Helium mass spectrometer leak testing",
      "Hydrostatic pressure testing at 1.5× design rating",
      "Surface roughness measurement (profilometer Ra check)",
      "PMI on 100% of wetted manifold and fitting components",
    ],
  },
  {
    slug: "green-hydrogen",
    image: gasProcessingImg,
    imageAlt: "Green hydrogen electrolysis plant piping, high-pressure hydrogen storage manifolds and fuel cell distribution lines",
    name: "Green Hydrogen & Clean Fuels",
    tagline: "High-pressure, embrittlement-resistant alloy piping for electrolysis, transport and storage",
    summary:
      "Hydrogen is the smallest molecule and diffuses into metal lattices, inducing hydrogen embrittlement, stress cracking, and micro-void formation under high pressure. Green hydrogen production via PEM and alkaline electrolysers operating at pressures up to 350–700 bar requires strictly certified low-carbon austenitic stainless steels and nickel alloys with controlled chemical composition, low delta-ferrite, and high surface finish integrity.",
    environment: [
      "High-pressure gaseous hydrogen (H2) service at 30 to 700 bar",
      "Cryogenic liquid hydrogen storage and transport at −253 °C",
      "Corrosive caustic (KOH) electrolytes in alkaline electrolysis cells",
      "Cyclic pressurization and thermal fluctuations during intermittent renewable generation",
    ],
    alloys: [
      "High-nickel austenitic Stainless 316L (min 12–14% Ni) with high resistance to hydrogen embrittlement",
      "Inconel 625 (UNS N06625) and Hastelloy C-276 for high-temperature and high-pressure electrolysis stages",
      "Super Duplex UNS S32750 for balanced mechanical strength in support infrastructure",
      "High-purity 304L for cryogenic liquid hydrogen storage vessels and insulation jackets",
    ],
    products: [
      "Heavy-wall seamless pipes to ASTM A312 / ASME SA312",
      "High-pressure forged flanges (Class 900 to 2500, and API 10,000 psi ratings)",
      "Socket-weld and buttweld forged fittings with controlled bore geometry",
      "Instrumentation tubing and double-ferrule compression fittings for gas detection panels",
    ],
    standards: [
      "ASME B31.12 Hydrogen Piping and Pipelines",
      "ISO 19880 / ISO 16111 Gaseous Hydrogen and Metal Hydride Storage",
      "CGA G-5.4 Standard for Hydrogen Piping Systems at Consumer Locations",
      "ASTM A182, A403, A312, B564, B366",
    ],
    procurement: [
      "State hydrogen design pressure, temperature and operating concentration explicitly",
      "Specify maximum delta-ferrite content (< 1%) in austenitic stainless materials",
      "Verify that nickel content meets ASME B31.12 guidelines (minimum 12% Ni recommended)",
      "Request oxygen-service cleaning and degreasing for electrolysis balance-of-plant lines",
    ],
    testing: [
      "Helium leak testing at 1.1× maximum allowable working pressure",
      "Charpy V-notch impact testing at design minimum temperature (down to −196 °C / −253 °C)",
      "Microstructure evaluation and ferrite scope measurement per ASTM E562",
      "100% PMI and ultrasonic testing of heavy wall forgings and seamless pipe",
    ],
  },
  {
    slug: "carbon-capture",
    image: industrialProcessPlantsImg,
    imageAlt: "Post-combustion carbon capture amine absorption towers, CO2 compression spools and supercritical CO2 pipeline infrastructure",
    name: "Carbon Capture, Utilization & Storage (CCUS)",
    tagline: "Alloy solutions for wet acidic amine recovery, high-pressure CO2 dehydration and supercritical transport",
    summary:
      "Carbon capture systems subject process piping to extreme corrosion from hot concentrated amine solutions (MEA, DEA, MDEA), wet acidic carbon dioxide, carbonic acid condensation, and supercritical CO2 carrying residual trace impurities (SOx, NOx, water). Trishul Metals supplies austenitic stainless, duplex, and nickel alloy piping packages engineered to prevent catastrophic stress corrosion cracking and localized pitting in CCUS facilities.",
    environment: [
      "Wet, concentrated CO2 gas streams forming aggressive carbonic acid (H2CO3) condensate",
      "Hot aqueous amine solutions (100–140 °C) in stripping and absorption regenerators",
      "Supercritical CO2 at pressures exceeding 74 bar and temperatures up to 150 °C",
      "Trace impurities including SO2, NOx, oxygen and hydrogen sulphide accelerating acid attack",
    ],
    alloys: [
      "Duplex 2205 (UNS S31803 / S32205) for high-pressure CO2 transport and amine reboilers",
      "Stainless 316L and 317L for general amine process and absorption tower piping",
      "Super Duplex 2507 for dense-phase CO2 compression headers and aggressive rich-amine lines",
      "Inconel 625 and Hastelloy C-276 for severe flue-gas quench coolers and acid gas contactors",
    ],
    products: [
      "Weld neck, blind and orifice flanges, Classes 300 to 2500",
      "Seamless and welded pipes NPS ½ to 24 with heavy wall thicknesses (SCH 80 to XXS)",
      "Long-radius buttweld elbows, tees and reducers to ASME B16.9",
      "Custom machined thermowells, nozzles and heavy forgings for pressure vessels",
    ],
    standards: [
      "ASME B31.3 Process Piping and ASME B31.4 Liquid Transportation Systems",
      "ISO 27913 Pipeline transportation systems for carbon dioxide",
      "DNV-RP-J202 Design and operation of CO2 pipelines",
      "NACE MR0175 / ISO 15156 (for sour CO2 streams)",
    ],
    procurement: [
      "Clarify whether CO2 stream is gas phase, dense phase or supercritical",
      "Confirm maximum water content and presence of SOx / NOx / H2S acid contaminants",
      "Specify low-temperature toughness for rapid depressurization (Joule-Thomson chilling down to −60 °C)",
      "Verify whether amine solvent manufacturer mandates specific alloy grade restrictions",
    ],
    testing: [
      "Charpy V-notch impact testing down to −46 °C or −60 °C for depressurization safety",
      "Intergranular corrosion testing per ASTM A262 Practice E",
      "Microstructural examination for intermetallic phase absence in duplex alloys",
      "100% Radiographic / Ultrasonic examination on seamless and welded piping spools",
    ],
  },
  {
    slug: "semiconductor-fabs",
    image: highTemperatureImg,
    imageAlt: "Semiconductor wafer fabrication cleanroom gas distribution, ultra-pure water (UPW) lines and chemical delivery piping",
    name: "Semiconductor & Advanced Electronics Fabs",
    tagline: "Ultra-high purity (UHP) stainless piping and electropolished fittings for sub-nanometer wafer manufacturing",
    summary:
      "Semiconductor fabrication plants operate under stringent contamination standards where a single metallic ion or sub-micron particle causes wafer yield failure. Trishul Metals supplies ultra-high purity (UHP) 316L stainless steel tubing, micro-fittings, high-pressure gas distribution headers, and chemical-resistant alloys tailored for fab sub-fabs, cleanrooms, and bulk chemical distribution systems (BCDS).",
    environment: [
      "Ultra-pure deionized water (UPW) with 18.2 MΩ·cm resistivity",
      "Aggressive specialty wet etching chemicals (HF, HCl, H2SO4, HNO3, NH4OH)",
      "Hazardous, pyrophoric and toxic specialty gases (silane, arsine, phosphine, NF3)",
      "Sub-micron particulate cleanliness and strict metallic ion leach-out thresholds",
    ],
    alloys: [
      "VIM-VAR (Vacuum Induction Melt / Vacuum Arc Remelt) 316L Ultra-High Purity Stainless Steel",
      "Low-manganese, sulfur-controlled 316L for optimal automatic orbital weld pool consistency",
      "Hastelloy C-22 and C-276 for aggressive fluorinated acid exhaust and delivery lines",
      "High-purity fluoropolymer and PVDF/PFA companion piping solutions",
    ],
    products: [
      "Electropolished (EP) seamless tubing to ASTM A269 with Ra ≤ 0.25 µm (10 µin)",
      "Micro-fit and mini-weld fittings for tight sub-fab gas jungle routing",
      "Face-seal and metal gasket vacuum fittings with zero dead-leg geometry",
      "Cleanroom-packaged Class 150/300 flanges and custom gas stick manifolds",
    ],
    standards: [
      "SEMI F19 / SEMI F20 Specification for 316L Stainless Steel for Semiconductor Manufacturing",
      "SEMI F57 Specification for Polymer Components in Ultrapure Water and Liquid Chemical Systems",
      "ASTM A269 / A270 / A632 for high purity and miniature tubing",
      "ASME BPE (Bioprocessing Equipment) dimensional and surface finish standards",
    ],
    procurement: [
      "Specify electropolished ID surface roughness requirement (Ra ≤ 0.13 to 0.25 µm)",
      "Confirm sulfur content range (typically 0.005% to 0.012% for orbital autogenous welding)",
      "Request Class 10 / Class 100 cleanroom double-bagging with dry nitrogen purge",
      "Provide chemical compatibility matrix for specialty process fluid or gas",
    ],
    testing: [
      "Auger Electron Spectroscopy (AES) and ESCA surface chemistry analysis",
      "Particle count and metallic extractable ion testing in DI water extract",
      "Surface roughness profilometry verified on every production heat",
      "Helium leak detection with sensitivity down to 1 × 10⁻⁹ mbar·L/s",
    ],
  },
  {
    slug: "offshore-wind-and-renewables",
    image: subseaEngineeringImg,
    imageAlt: "Offshore wind substation jacket platform, J-tube internal piping, marine cooling systems and tidal turbine alloy hardware",
    name: "Offshore Wind & Marine Renewables",
    tagline: "Corrosion-resistant alloys and heavy structural piping for offshore wind substations, monopiles and marine turbines",
    summary:
      "Offshore wind installations, high-voltage direct current (HVDC) converter platforms, and tidal energy devices face 25–30 year uninterrupted design lives in violent North Sea, Atlantic, and tropical cyclone environments. Trishul Metals supplies super duplex, marine bronze equivalents, Inconel alloys, and structural tubulars for substation seawater cooling, J-tube seals, firewater rings, and structural jacket foundations.",
    environment: [
      "High-salinity splash zone with continuous wave action, cyclic fatigue, and oxygenation",
      "Subsea immersion with hydrostatic pressure and marine biological fouling",
      "Atmospheric marine exposure with high chloride deposition on unmanned topside decks",
      "Strict 25–30 year design lifecycle with minimal planned offshore maintenance access",
    ],
    alloys: [
      "Super Duplex 2507 (UNS S32750 / S32760) for critical seawater cooling, pump columns, and fire monitors",
      "Duplex 2205 (UNS S32205) for topside drainage, instrument air, and utility spools",
      "Inconel 625 for splash-zone cladding, fastener bolting, and expansion bellows",
      "Cupro-Nickel 90/10 and 70/30 for anti-fouling seawater cooling circuits",
    ],
    products: [
      "Weld neck and blind flanges Class 150 to 900 to ASME B16.5 / B16.47",
      "Buttweld spools, heavy-wall elbows and reducers with full radiography",
      "Heavy structural tubulars and hollow sections for substation framing and J-tube guides",
      "Forged high-strength anchor studs, flange bolts and fasteners in Alloy 718 / 625",
    ],
    standards: [
      "DNV-ST-0145 Offshore substations",
      "DNV-ST-0126 Support structures for wind turbines",
      "NORSOK M-630 / M-650 material data sheets",
      "EN 10225 Weldable structural steels for fixed offshore installations",
      "EN 10204 Type 3.2 inspection certification",
    ],
    procurement: [
      "State whether 3.2 third-party inspection with DNV / Lloyd's Register witness is required",
      "Verify Charpy V-notch impact toughness requirements at −40 °C for arctic/sub-arctic locations",
      "Confirm corrosion testing requirements (ASTM G48 Method A at 50 °C for super duplex)",
      "Specify seaworthy marine export packing with VCI preservation for extended dockside storage",
    ],
    testing: [
      "Charpy V-notch impact testing at −40 °C or −46 °C across base metal and weld HAZ",
      "ASTM G48 pitting corrosion testing for duplex and super duplex grades",
      "Ferrite balance verification per ASTM E562 (35% to 55% target)",
      "100% Ultrasonic examination of forgings and plates per ASME Section V",
    ],
  },
  {
    slug: "water-and-wastewater",
    image: desalinationPlantsImg,
    imageAlt: "Municipal water filtration plant piping, wastewater aeration headers, sludge digestion lines and desalination brine outfalls",
    name: "Water Infrastructure & Wastewater Treatment",
    tagline: "Long-life stainless and alloy piping systems for municipal water, sewage treatment and brine disposal",
    summary:
      "Modern municipal water filtration, industrial wastewater recycling, and biological treatment facilities demand corrosion-resistant piping that resists microbiologically influenced corrosion (MIC), hydrogen sulphide sewer gas, chemical coagulants, and abrasive sludge slurries without the frequent lining failures common to coated carbon steel.",
    environment: [
      "Wastewater digestion with biogenic sulphuric acid (H2SO4) and dissolved hydrogen sulphide",
      "High-chloride wastewater, membrane concentrate (brine) and aeration basins",
      "Corrosive chemical dosing: ferric chloride, alum, sodium hypochlorite, ozone",
      "Abrasive grit and solids suspension demanding high erosion-corrosion resistance",
    ],
    alloys: [
      "Stainless 316L (UNS S31603) for wastewater treatment, sludge digestion, and chemical dosing",
      "Stainless 304L (UNS S30403) for potable water transmission, aeration, and filtration manifolds",
      "Duplex 2205 for high-chloride industrial effluent, brine reject lines, and centrifuge piping",
      "Apex UPVC, CPVC and SWR companion polymer lines for gravity sewer and chemical drainage",
    ],
    products: [
      "Large-diameter welded stainless pipe to ASTM A312 / A358 up to NPS 48 (1200 mm)",
      "Lightweight slip-on and angle-face backing flanges with stainless stub ends to ASME B16.5",
      "Fabricated and pressed buttweld elbows, equal tees, and reducers to MSS SP-43 / ASME B16.9",
      "Complete PVC/CPVC schedule 40/80 pipe and drainage fittings for low-pressure utilities",
    ],
    standards: [
      "AWWA C220 Stainless-Steel Pipe and Fittings for Water Transmission",
      "EN 10217-7 Welded circular tubes of stainless steel for pressure and water service",
      "ASTM A312 / A778 for unannealed and annealed water utility stainless piping",
      "NSF/ANSI 61 Drinking Water System Components — Health Effects",
    ],
    procurement: [
      "Confirm whether potable water certification (NSF/ANSI 61 or WRAS equivalent) is required",
      "Select between thin-wall schedule 5S/10S with stub ends versus schedule 40S",
      "Specify pickling and passivation per ASTM A380 to restore chromium oxide layer after fabrication",
      "Combine metallic alloy piping with companion polymer drainage for single-source efficiency",
    ],
    testing: [
      "Hydrostatic testing to AWWA C220 requirements",
      "Weld radiographic or dye penetrant inspection",
      "Passivation testing via ferroxyl or chemical test kit per ASTM A967",
      "PMI verification on chemical dosing and high-chloride lines",
    ],
  },
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
