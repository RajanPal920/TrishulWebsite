import { createFileRoute, notFound } from "@tanstack/react-router";
import { Section, Breadcrumbs, BulletList, Prose, FaqList, CtaBand, Eyebrow } from "@/components/site/parts";
import { articleBySlug } from "@/data/technical";
import { breadcrumbScript } from "@/lib/breadcrumb";
import { faqScript } from "@/lib/jsonld";

export const Route = createFileRoute("/technical/$slug")({
  loader: ({ params }) => {
    const article = articleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article unavailable | Trishul Metals" }, { name: "robots", content: "noindex" }] };
    }
    const a = loaderData.article;
    return {
      meta: [
        { title: `${a.title} | Trishul Metals & Alloys` },
        { name: "description", content: a.summary.slice(0, 155) },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.summary.slice(0, 155) },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/technical/${a.slug}` },
      ],
      links: [{ rel: "canonical", href: `/technical/${a.slug}` }],
      scripts: [
        breadcrumbScript([
          { label: "Home", to: "/" },
          { label: "Technical", to: "/technical" },
          { label: a.title },
        ]),
        ...(a.faqs?.length ? [faqScript(a.faqs)] : []),
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article: a } = Route.useLoaderData();
  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Technical", to: "/technical" }, { label: a.title }]}
        />
        <div className="mt-6 max-w-4xl">
          <Eyebrow>{a.category}</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">{a.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{a.summary}</p>
        </div>
      </Section>

      <Section>
        <div className="space-y-12">
          {a.sections.map((s) => (
            <div key={s.heading}>
              <h2 className="text-2xl font-semibold md:text-3xl">{s.heading}</h2>
              <div className="mt-4">
                <Prose paragraphs={s.body} />
              </div>
              {s.bullets?.length ? (
                <div className="mt-6 max-w-3xl">
                  <BulletList items={s.bullets} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      {a.faqs?.length ? (
        <Section className="border-t border-border">
          <h2 className="text-2xl font-semibold md:text-3xl">Frequently asked questions</h2>
          <div className="mt-8">
            <FaqList faqs={a.faqs} />
          </div>
        </Section>
      ) : null}

      <CtaBand />
    </>
  );
}
