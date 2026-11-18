import { createFileRoute, notFound } from "@tanstack/react-router";
import { Section, SectionHead, Breadcrumbs, BulletList, CtaBand, Eyebrow } from "@/components/site/parts";
import { industryBySlug } from "@/data/industries";
import { breadcrumbScript } from "@/lib/breadcrumb";

export const Route = createFileRoute("/industries/$slug")({
  loader: ({ params }) => {
    const industry = industryBySlug(params.slug);
    if (!industry) throw notFound();
    return { industry };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Industry unavailable | Trishul Metals" }, { name: "robots", content: "noindex" }] };
    }
    const i = loaderData.industry;
    const title = `${i.name} — Alloy Flanges & Fittings | Trishul Metals`;
    return {
      meta: [
        { title },
        { name: "description", content: i.summary.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: i.tagline },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/industries/${i.slug}` },
      ],
      links: [{ rel: "canonical", href: `/industries/${i.slug}` }],
      scripts: [
        breadcrumbScript([
          { label: "Home", to: "/" },
          { label: "Industries", to: "/industries" },
          { label: i.name },
        ]),
      ],
    };
  },
  component: IndustryPage,
});

function IndustryPage() {
  const { industry: i } = Route.useLoaderData();
  const blocks: [string, string, string[]][] = [
    ["Service conditions", "Environment", i.environment],
    ["Materials", "Preferred alloys", i.alloys],
    ["Scope", "Products supplied", i.products],
    ["Compliance", "Standards applied", i.standards],
    ["Procurement", "Checkpoints at RFQ", i.procurement],
    ["Verification", "Testing and inspection", i.testing],
  ];

  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Industries", to: "/industries" }, { label: i.name }]}
        />
        <div className="mt-6 max-w-4xl">
          <Eyebrow>Industry application</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">{i.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{i.tagline}</p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{i.summary}</p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          {blocks.map(([eyebrow, title, items]) => (
            <div key={title}>
              <SectionHead eyebrow={eyebrow} title={title} />
              <div className="mt-6">
                <BulletList items={items} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand title={`Discuss your ${i.name.toLowerCase()} requirement`} />
    </>
  );
}
