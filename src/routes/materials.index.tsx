import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHead, CardLink, Breadcrumbs, CtaBand } from "@/components/site/parts";
import { families, materialsByFamily } from "@/data/materials";
import { familyLabel } from "@/data/types";
import { breadcrumbScript } from "@/lib/breadcrumb";

export const Route = createFileRoute("/materials/")({
  head: () => ({
    meta: [
      { title: "CRA Grades — Nickel, Duplex, Super Duplex & Stainless | Trishul Metals" },
      {
        name: "description",
        content:
          "36 documented Corrosion-Resistant Alloy (CRA) grades with composition, mechanical properties, corrosion behaviour and governing ASTM, ASME, NACE and applicable NORSOK M-630 requirements for flanges and pipe fittings.",
      },
      { property: "og:title", content: "CRA Grades | Trishul Metals & Alloys" },
      {
        property: "og:description",
        content: "Corrosion-Resistant Alloy (CRA) grades — nickel alloy, duplex, super duplex and stainless — with full technical data.",
      },
      { property: "og:url", content: "/materials" },
    ],
    links: [{ rel: "canonical", href: "/materials" }],
    scripts: [breadcrumbScript([{ label: "Home", to: "/" }, { label: "Materials" }])],
  }),
  component: MaterialsIndex,
});

function MaterialsIndex() {
  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Materials" }]} />
        <div className="mt-6">
          <SectionHead as="h1"
            eyebrow="Corrosion-Resistant Alloy (CRA) grades"
            title="CRA grades supplied"
            intro="Each grade page documents chemistry, mechanical and physical properties, corrosion behaviour, comparison against neighbouring alloys and the ASTM, ASME, NACE and applicable NORSOK M-630 requirements that govern flanges and fittings. Standard austenitic stainless and companion carbon steel are supplied alongside CRA grades for mixed-metallurgy builds."
          />
        </div>
      </Section>

      {families.map((family) => (
        <Section key={family} className="border-b border-border">
          <SectionHead
            eyebrow={`${materialsByFamily(family).length} grades · ${
              family === "carbon"
                ? "Companion grades"
                : family === "polymer"
                  ? "Supporting Product Line — manufactured by Apex Polymer & Engineering"
                  : family === "stainless"
                    ? "Supporting grades"
                    : "CRA"
            }`}
            title={familyLabel[family]}
            {...(family === "carbon"
              ? {
                  intro:
                    "Companion carbon and low-temperature steel supplied alongside CRA grades where a project requires a single-source supplier — not offered as a general structural or commodity steel line.",
                }
              : family === "stainless"
                ? {
                    intro:
                      "Standard austenitic stainless steel supplied alongside CRA grades for mixed-metallurgy builds and projects requiring a single-source supplier.",
                  }
                : {})}
          />
           <div className="motion-stagger-grid mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {materialsByFamily(family).map((m) => (
              <CardLink
                key={m.slug}
                to="/materials/$slug"
                params={{ slug: m.slug }}
                eyebrow={m.uns}
                title={m.name}
                body={m.tagline}
                tags={[m.maxTemp]}
                interactive
              />
            ))}
          </div>
        </Section>
      ))}

      <CtaBand />
    </>
  );
}
