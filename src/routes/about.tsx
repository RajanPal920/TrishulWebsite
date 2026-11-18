import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHead, Breadcrumbs, BulletList, CtaBand } from "@/components/site/parts";
import { FacilityGallery } from "@/components/site/FacilityGallery";

import { company, trustPoints } from "@/data/company";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Trishul Metals & Alloys — CRA Piping Component Specialist" },
      {
        name: "description",
        content:
          "Trishul Metals & Alloys is a Mumbai specialist in critical Corrosion-Resistant Alloy (CRA) piping components — nickel alloy, duplex, super duplex and stainless flanges and fittings supplied against ASTM, ASME, NACE and applicable NORSOK M-630 requirements.",
      },
      { property: "og:title", content: "About Trishul Metals & Alloys" },
      { property: "og:description", content: company.tagline },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Company" }]} />
        <div className="mt-6">
          <SectionHead as="h1" eyebrow="Company" title="Engineered for critical industries" intro={company.description} />
        </div>
      </Section>
      <Section>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {trustPoints.map((t) => (
            <div key={t.title}>
              <h2 className="text-base font-semibold">{t.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section className="border-t border-border bg-card/30">
        <SectionHead eyebrow="How we work" title="Specification review before pricing" />
        <div className="mt-6 max-w-3xl">
          <BulletList
            items={[
              "Enquiry reviewed against the governing ASTM, ASME, NACE or NORSOK requirement",
              "Grade, class, facing, bore, schedule and test scope confirmed in writing",
              "Material sourced with heat traceability and EN 10204 3.1 certification",
              "Third-party inspection and additional testing coordinated where specified",
              "Marking, preservation, packing and export documentation handled in-house",
            ]}
          />
        </div>
      </Section>
      <Section className="border-t border-border">
        <SectionHead
          eyebrow="Operations"
          title="A physical stockyard, not a broker's desk"
          intro="Racked inventory, heat-number tagging, export packing and the documentation dossier that ships with every consignment."
        />
        <div className="mt-8">
          <FacilityGallery />
        </div>
      </Section>
      <CtaBand />

    </>
  );
}
