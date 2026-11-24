// Permanent (301) redirects from the previous website's URLs to this site's pages.
// Keys are matched exactly as the old site exposed them (trailing slashes included).
export const legacyRedirects: Record<string, string> = {
  "/products/": "/products",
  "/material-grades/": "/materials",
  "/material-grades": "/materials",
  "/industries/": "/industries",
  "/certifications/": "/quality",
  "/certifications": "/quality",
  "/technical-resources/": "/technical",
  "/technical-resources": "/technical",
  "/about/": "/about",
  "/contact/": "/contact",
  "/products/steel-pipes-tubes/": "/products#pipes-tubes",
  "/products/steel-pipes-tubes": "/products#pipes-tubes",
  "/products/industrial-flanges/": "/products#flanges",
  "/products/industrial-flanges": "/products#flanges",
  "/products/pipe-fittings/": "/products#pipe-fittings",
  "/products/pipe-fittings": "/products#pipe-fittings",
  "/products/structural-steel/": "/products#structural",
  "/products/structural-steel": "/products#structural",
  "/products/structural/": "/products#structural",
  "/products/structural": "/products#structural",
  "/products/industrial-valves/": "/products",
  "/products/industrial-valves": "/products",
  "/products/industrial-fasteners/": "/products",
  "/products/industrial-fasteners": "/products",
  "/products/steel-raw-materials/": "/materials",
  "/products/steel-raw-materials": "/materials",
  "/industries/oil-gas": "/industries/offshore-oil-and-gas",
  "/industries/oil-gas/": "/industries/offshore-oil-and-gas",
  "/industries/data-centres-liquid-cooling": "/industries/data-centres-and-liquid-cooling",
  "/industries/data-centres-liquid-cooling/": "/industries/data-centres-and-liquid-cooling",
  "/industries/nuclear-power": "/industries/power-generation",
  "/industries/nuclear-power/": "/industries/power-generation",
  "/industries/marine-defense": "/industries/marine-and-shipbuilding",
  "/industries/marine-defense/": "/industries/marine-and-shipbuilding",
};

export function legacyRedirectTarget(pathname: string): string | undefined {
  return legacyRedirects[pathname];
}
