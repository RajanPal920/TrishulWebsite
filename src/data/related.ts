/**
 * Curated metallurgical relationships between grades, used for the
 * "Related grades" internal-linking block on material pages.
 * Each entry: target slug + a short engineering reason (varied anchor context).
 */
export type RelatedGrade = { slug: string; reason: string };

const rel = (slug: string, reason: string): RelatedGrade => ({ slug, reason });

export const relatedGrades: Record<string, RelatedGrade[]> = {
  // Duplex / super duplex
  "duplex-2205": [
    rel("super-duplex-2507", "Higher chloride and pitting resistance"),
    rel("duplex-s31803", "The original UNS S31803 chemistry it refines"),
    rel("stainless-steel-316", "The austenitic grade it typically upgrades"),
  ],
  "duplex-s31803": [
    rel("duplex-2205", "Tighter nitrogen control for better weldability"),
    rel("super-duplex-2507", "Step up for severe seawater service"),
  ],
  "super-duplex-2507": [
    rel("super-duplex-s32760", "Comparable PREN with tungsten additions"),
    rel("duplex-2205", "A more economical option for milder chlorides"),
    rel("254-smo", "Austenitic alternative for similar PREN"),
  ],
  "super-duplex-s32760": [
    rel("super-duplex-2507", "The more widely specified super duplex"),
    rel("duplex-2205", "Lower alloy where PREN 40 is not required"),
  ],
  // Nickel alloys
  "inconel-625": [
    rel("inconel-686", "Higher corrosion resistance in aggressive acids"),
    rel("hastelloy-c276", "A workhorse alternative for reducing media"),
    rel("incoloy-825", "A more economical nickel-iron-chromium option"),
  ],
  "inconel-686": [
    rel("inconel-625", "Widely stocked for less severe service"),
    rel("hastelloy-c22", "Comparable versatility in oxidising media"),
  ],
  "inconel-600": [
    rel("inconel-601", "Better high-temperature oxidation resistance"),
    rel("inconel-690", "Higher chromium for caustic and nitric service"),
    rel("incoloy-800", "A lower-nickel high-temperature option"),
  ],
  "inconel-601": [
    rel("inconel-600", "The base grade for general caustic service"),
    rel("inconel-617", "Higher creep strength at extreme temperatures"),
  ],
  "inconel-617": [
    rel("inconel-601", "A lower-alloy oxidation-resistant option"),
    rel("inconel-625", "Better aqueous corrosion resistance"),
  ],
  "inconel-690": [rel("inconel-600", "Lower chromium for general caustic service")],
  "inconel-718": [
    rel("inconel-725", "Similar age-hardening with better corrosion resistance"),
    rel("inconel-x-750", "The earlier precipitation-hardened grade"),
  ],
  "inconel-725": [
    rel("inconel-718", "The more widely stocked age-hardened grade"),
    rel("inconel-625", "The solid-solution base it hardens from"),
  ],
  "inconel-x-750": [rel("inconel-718", "Higher strength with better weldability")],
  "incoloy-800": [
    rel("incoloy-800h", "Controlled carbon for creep-rupture service"),
    rel("inconel-600", "Higher nickel for caustic environments"),
  ],
  "incoloy-800h": [
    rel("incoloy-800ht", "Tighter aluminium-plus-titanium control"),
    rel("incoloy-800", "The annealed base grade"),
  ],
  "incoloy-800ht": [
    rel("incoloy-800h", "Nearly identical chemistry, looser Al + Ti window"),
    rel("inconel-617", "Higher-temperature creep performance"),
  ],
  "incoloy-825": [
    rel("incoloy-925", "Age-hardened for higher strength in sour service"),
    rel("alloy-20", "An alternative for sulphuric acid plants"),
    rel("hastelloy-c276", "Step up for more aggressive reducing acids"),
  ],
  "incoloy-925": [rel("incoloy-825", "The non-hardened base grade")],
  "hastelloy-c22": [
    rel("hastelloy-c276", "Proven in similar mixed-acid service"),
    rel("hastelloy-c2000", "Adds copper for better sulphuric resistance"),
    rel("inconel-686", "Comparable performance in hot contaminated acids"),
  ],
  "hastelloy-c276": [
    rel("hastelloy-c22", "Better oxidising-media resistance"),
    rel("inconel-686", "A newer chemistry for severe pitting service"),
    rel("incoloy-825", "More economical for moderate sulphuric duty"),
  ],
  "hastelloy-c2000": [
    rel("hastelloy-c22", "The copper-free predecessor"),
    rel("hastelloy-c276", "Long-established alternative in wet chlorine"),
  ],
  "hastelloy-b2": [rel("hastelloy-b3", "Improved thermal stability during fabrication")],
  "hastelloy-b3": [rel("hastelloy-b2", "The original nickel-molybdenum grade")],
  "monel-400": [rel("monel-k500", "Age-hardened version for higher strength")],
  "monel-k500": [rel("monel-400", "The non-hardened base with the same corrosion profile")],
  "nickel-200": [rel("nickel-201", "Low-carbon version for service above 315 °C")],
  "nickel-201": [rel("nickel-200", "Standard carbon version for lower temperatures")],
  "alloy-20": [
    rel("incoloy-825", "Broader acid coverage with molybdenum"),
    rel("stainless-steel-904l", "A lower-nickel sulphuric-service option"),
  ],
  // Stainless
  "stainless-steel-304": [
    rel("stainless-steel-316", "Adds molybdenum for chloride pitting resistance"),
    rel("stainless-steel-321", "Titanium-stabilised for elevated temperatures"),
  ],
  "stainless-steel-316": [
    rel("stainless-steel-317l", "Higher molybdenum for stronger pitting resistance"),
    rel("stainless-steel-904l", "Super-austenitic step up for acids"),
    rel("duplex-2205", "Double the strength with better chloride SCC resistance"),
  ],
  "stainless-steel-317l": [
    rel("stainless-steel-316", "The lower-molybdenum workhorse"),
    rel("254-smo", "6 % molybdenum for severe chloride exposure"),
    rel("stainless-steel-904l", "Copper-bearing grade for sulphuric duty"),
  ],
  "stainless-steel-321": [
    rel("stainless-steel-347", "Niobium-stabilised alternative"),
    rel("stainless-steel-304", "The unstabilised base chemistry"),
  ],
  "stainless-steel-347": [
    rel("stainless-steel-321", "Titanium-stabilised alternative"),
    rel("stainless-steel-310s", "Higher chromium for furnace temperatures"),
  ],
  "stainless-steel-310s": [
    rel("incoloy-800", "Nickel-bearing option for cyclic furnace duty"),
    rel("stainless-steel-304", "The economical general-purpose grade"),
  ],
  "stainless-steel-904l": [
    rel("254-smo", "Higher PREN for chloride-rich service"),
    rel("alloy-20", "Comparable sulphuric resistance with higher nickel"),
    rel("stainless-steel-317l", "A lower-alloy molybdenum grade"),
  ],
  "254-smo": [
    rel("super-duplex-2507", "Duplex alternative at similar PREN"),
    rel("stainless-steel-904l", "A lower-alloy super-austenitic option"),
    rel("hastelloy-c276", "Nickel-alloy step up for reducing acids"),
  ],
  // Carbon steel
  "carbon-steel-a106": [
    rel("carbon-steel-a53", "General-purpose welded and seamless alternative"),
    rel("api-5l-line-pipe", "Line-pipe grades for transmission service"),
  ],
  "carbon-steel-a53": [
    rel("carbon-steel-a106", "Seamless grade for high-temperature service"),
    rel("carbon-steel-a234-wpb", "Matching buttweld fitting material"),
  ],
  "api-5l-line-pipe": [
    rel("carbon-steel-a106", "Process-piping alternative to line pipe"),
    rel("carbon-steel-a333-gr6", "Impact-tested grade for low temperatures"),
  ],
  "carbon-steel-a333-gr6": [
    rel("carbon-steel-a350-lf2", "Matching forged flange material"),
    rel("carbon-steel-a106", "Standard-temperature seamless equivalent"),
  ],
  "carbon-steel-a105": [
    rel("carbon-steel-a350-lf2", "Impact-tested forging for low temperatures"),
    rel("carbon-steel-a234-wpb", "Companion fitting specification"),
  ],
  "carbon-steel-a350-lf2": [
    rel("carbon-steel-a105", "Ambient-temperature forging equivalent"),
    rel("carbon-steel-a333-gr6", "Matching low-temperature pipe"),
  ],
  "carbon-steel-a234-wpb": [
    rel("carbon-steel-a105", "Companion flange forging material"),
    rel("carbon-steel-a420-wpl6", "Low-temperature fitting alternative"),
  ],
  "carbon-steel-a420-wpl6": [
    rel("carbon-steel-a234-wpb", "Standard-temperature fitting equivalent"),
    rel("carbon-steel-a350-lf2", "Matching low-temperature flange"),
  ],
  "carbon-steel-a516-gr70": [
    rel("carbon-steel-a105", "Forged equivalent for flanges"),
    rel("carbon-steel-a106", "Seamless pipe in similar service"),
  ],
  // Polymer
  upvc: [
    rel("cpvc", "Higher temperature rating for hot fluids"),
    rel("swr-pvc", "Soil, waste and rainwater drainage variant"),
  ],
  cpvc: [rel("upvc", "More economical for ambient-temperature service")],
  "swr-pvc": [rel("upvc", "Pressure-rated piping variant")],
};
