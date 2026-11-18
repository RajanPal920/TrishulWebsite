import { company } from "@/data/company";

const SITE_URL = company.siteUrl;


export type BreadcrumbItem = { label: string; to?: string };

/**
 * Builds a schema.org BreadcrumbList JSON-LD script entry for a route head(),
 * mirroring the visible <Breadcrumbs> items rendered on the page.
 */
export function breadcrumbScript(items: BreadcrumbItem[]) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.label,
        ...(item.to ? { item: `${SITE_URL}${item.to === "/" ? "" : item.to}` } : {}),
      })),
    }),
  };
}
