import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHead, Breadcrumbs, FaqList, CtaBand } from "@/components/site/parts";
import { faqCategories, faqCategoryMeta, faqMatrix, faqsByCategory } from "@/data/faq";

const title = "Industrial Supply FAQ — Compliance, Testing, Logistics & RFQ | Trishul Metals";
const description =
  `${faqMatrix.length} answers on grade equivalence, NACE compliance, EN 10204 3.1 certification, PMI and TPI, export packing, Incoterms, lead times and the RFQ workflow.`;

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.trishulmetal.com/faq" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.trishulmetal.com/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqMatrix.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "FAQ" }]} />
        <div className="mt-6">
          <SectionHead as="h1"
            eyebrow="Buyer objections, neutralised"
            title={`${faqMatrix.length}-point procurement FAQ`}
            intro="Everything an inspection engineer, QA lead or category buyer normally asks before releasing an order — answered in one place, grouped by discipline."
          />
        </div>
        <nav aria-label="FAQ categories" className="mt-8 flex flex-wrap gap-2">
          {faqCategories.map((c) => (
            <a
              key={c}
              href={`#${c}`}
              className="rounded-sm border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {faqCategoryMeta[c].name}
            </a>
          ))}
        </nav>
      </Section>

      {faqCategories.map((c) => (
        <Section key={c} className="border-b border-border">
          <div id={c} className="scroll-mt-28">
            <SectionHead
              eyebrow={`${faqsByCategory(c).length} questions`}
              title={faqCategoryMeta[c].name}
              intro={faqCategoryMeta[c].blurb}
            />
            <div className="mt-8">
              <FaqList faqs={faqsByCategory(c).map((f) => ({ q: f.q, a: f.a }))} />
            </div>
          </div>
        </Section>
      ))}

      <CtaBand title="Still have a specification question? Send it with your enquiry." />
    </>
  );
}
