/** Shared JSON-LD builders for route head() scripts. */

export function faqScript(faqs: { q: string; a: string }[]) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }),
  };
}

export function productScript(input: {
  name: string;
  description: string;
  url: string;
  brand?: string;
  material?: string;
  sku?: string;
  standard?: string;
}) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: input.name,
      description: input.description,
      url: input.url,
      brand: { "@type": "Brand", name: input.brand ?? "Trishul Metals & Alloys" },
      ...(input.material ? { material: input.material } : {}),
      ...(input.sku ? { sku: input.sku } : {}),
      ...(input.standard
        ? {
            additionalProperty: [
              { "@type": "PropertyValue", name: "Specification", value: input.standard },
            ],
          }
        : {}),
    }),
  };
}

export function itemListScript(input: {
  name: string;
  items: { name: string; description: string }[];
}) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: input.name,
      itemListElement: input.items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: item.name,
          description: item.description,
          provider: { "@type": "Organization", name: "Trishul Metals & Alloys" },
        },
      })),
    }),
  };
}
