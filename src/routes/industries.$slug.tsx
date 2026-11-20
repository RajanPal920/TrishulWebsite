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
        { property: "og:url", content: `https://www.trishulmetal.com/industries/${i.slug}` },
      ],
      links: [{ rel: "canonical", href: `https://www.trishulmetal.com/industries/${i.slug}` }],
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
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="max-w-2xl">
            <Eyebrow>Industry application</Eyebrow>
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl text-white">{i.name}</h1>
            <p className="mt-4 text-lg font-medium text-[#F5F5F5]">{i.tagline}</p>
            <p className="mt-4 text-base leading-relaxed text-[#EAEAEA]">{i.summary}</p>
          </div>
          {i.image && (
            <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-card shadow-elevated">
              <img
                src={i.image}
                alt={i.imageAlt || i.name}
                loading="eager"
                decoding="async"
                width={1200}
                height={750}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
            </div>
          )}
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
