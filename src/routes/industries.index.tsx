import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHead, CardLink, Breadcrumbs, CtaBand } from "@/components/site/parts";
import { industries } from "@/data/industries";
import { breadcrumbScript } from "@/lib/breadcrumb";

export const Route = createFileRoute("/industries/")({
  head: () => ({
    meta: [
      { title: "Industries Served — Oil & Gas, Refinery, Marine, Power | Trishul Metals" },
      {
        name: "description",
        content:
          "Corrosion-Resistant Alloy (CRA) flanges and fittings for offshore, refinery, petrochemical, desalination, marine, power, pharma and fertiliser projects, matched to service conditions and to ASTM, ASME, NACE and applicable NORSOK M-630 requirements.",
      },
      { property: "og:title", content: "Industries We Supply | Trishul Metals & Alloys" },
      { property: "og:description", content: "26 industrial sectors with CRA grade and standards guidance." },
      { property: "og:url", content: "https://www.trishulmetal.com/industries" },
    ],
    links: [{ rel: "canonical", href: "https://www.trishulmetal.com/industries" }],
    scripts: [breadcrumbScript([{ label: "Home", to: "/" }, { label: "Industries" }])],
  }),
  component: IndustriesIndex,
});

function IndustriesIndex() {
  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Industries" }]} />
        <div className="mt-6">
          <SectionHead as="h1"
            eyebrow="Industries we supply"
            title="Industries we supply"
            intro={`Service environment drives alloy selection. Across all ${industries.length} industrial sectors, each sector page sets out the corrosive conditions, preferred grades, product forms, standards and procurement checkpoints.`}
          />
        </div>
      </Section>
      <Section>
         <div className="motion-stagger-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <CardLink
              key={i.slug}
              to="/industries/$slug"
              params={{ slug: i.slug }}
              title={i.name}
              body={i.tagline}
              image={i.image}
              imageAlt={i.imageAlt}
              interactive
            />
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
