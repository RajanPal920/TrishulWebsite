export const rfqProcessingOptions = [
  "Precision saw cutting",
  "End bevelling (ASME B16.25)",
  "Rough machining / boring / facing",
  "Cut-to-drawing (supply drawing)",
] as const;

export const rfqUnits = ["pcs", "m", "kg", "MT", "ft", "sets"] as const;

export const rfqCertificationOptions = [
  "EN 10204 3.1",
  "EN 10204 3.2 with TPI",
  "EN 10204 2.1 / 2.2",
  "As per attached specification",
] as const;