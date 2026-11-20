import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHead, CardLink, Breadcrumbs, CtaBand } from "@/components/site/parts";
import { articles, articleCategories } from "@/data/technical";

export const Route = createFileRoute("/technical/")({
  head: () => ({
    meta: [
      { title: "Technical & Standards Knowledge Centre | Trishul Metals & Alloys" },
      {
        name: "description",
        content:
          "Engineering guides on ASME B16.5, B16.9 and B16.11, ASTM and NACE requirements, applicable NORSOK M-630 material data sheets, flange facings, pressure-temperature ratings, pitting resistance and CRA material selection.",
      },
      { property: "og:title", content: "Technical Knowledge Centre | Trishul Metals" },
      { property: "og:description", content: "ASTM, ASME, NACE and NORSOK M-630 standards, corrosion and CRA material selection guidance." },
      { property: "og:url", content: "https://www.trishulmetal.com/technical" },
    ],
    links: [{ rel: "canonical", href: "https://www.trishulmetal.com/technical" }],
  }),
  component: TechnicalIndex,
});

function TechnicalIndex() {
  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Technical" }]} />
        <div className="mt-6">
          <SectionHead as="h1"
            eyebrow="Knowledge centre"
            title="Standards, corrosion and selection guidance"
            intro="Reference material written for piping engineers and procurement teams evaluating alloy flanges and fittings."
          />
        </div>
      </Section>

      {articleCategories.map((category) => (
        <Section key={category} className="border-b border-border">
          <SectionHead title={category} />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles
              .filter((a) => a.category === category)
              .map((a) => (
                <CardLink
                  key={a.slug}
                  to="/technical/$slug"
                  params={{ slug: a.slug }}
                  title={a.title}
                  body={a.summary}
                />
              ))}
          </div>
        </Section>
      ))}

      <CtaBand />
    </>
  );
}
