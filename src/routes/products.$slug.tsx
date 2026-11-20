import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  Section,
  SectionHead,
  Breadcrumbs,
  SpecTable,
  BulletList,
  Prose,
  FaqList,
  CtaBand,
  Eyebrow,
} from "@/components/site/parts";
import { productBySlug, categoryMeta } from "@/data/products";
import { materialsForProduct, matrixPath } from "@/data/matrix";
import { familyLabel } from "@/data/types";
import { CardLink } from "@/components/site/parts";
import { breadcrumbScript } from "@/lib/breadcrumb";
import { faqScript } from "@/lib/jsonld";
import { productImage } from "@/data/productImages";
import { productPhotoAlt } from "@/lib/imageAlt";


export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = productBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product unavailable | Trishul Metals" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.product;
    const title =
      p.category === "pvc-piping"
        ? `${p.name} — UPVC, CPVC & SWR | Trishul Metals`
        : `${p.name} — Alloy & Stainless | Trishul Metals`;
    return {
      meta: [
        { title },
        { name: "description", content: p.summary.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: p.tagline },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://www.trishulmetal.com/products/${p.slug}` },
      ],
      links: [{ rel: "canonical", href: `https://www.trishulmetal.com/products/${p.slug}` }],
      scripts: [
        breadcrumbScript([
          { label: "Home", to: "/" },
          { label: "Products", to: "/products" },
          { label: p.name },
        ]),
        ...(p.faqs?.length ? [faqScript(p.faqs)] : []),
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const image = productImage(p.slug);
  const grades = materialsForProduct(p);

  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Products", to: "/products" }, { label: p.name }]}
        />
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div className="max-w-4xl">
            <Eyebrow>{categoryMeta[p.category].name}</Eyebrow>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">{p.name}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{p.tagline}</p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{p.summary}</p>
          </div>
          {image ? (
            <div className="overflow-hidden rounded-md border border-border bg-card/40">
              <img
                src={image}
                alt={productPhotoAlt(p)}
                width={1024}
                height={768}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </Section>


      <Section>
        <SectionHead eyebrow="Engineering" title="Design and use" />
        <div className="mt-6">
          <Prose paragraphs={p.overview} />
        </div>
      </Section>

      <Section className="border-y border-border bg-card/30">
        <div className="grid gap-8 lg:grid-cols-2">
          <SpecTable
            caption="Supply specification"
            head={["Parameter", "Range"]}
            rows={p.specs.map((s) => [s.label, s.value])}
          />
          <div>
            <SectionHead eyebrow="Standards" title="Governing standards" />
            <div className="mt-6">
              <BulletList items={p.standards} />
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHead eyebrow="Features" title="Why it is specified" />
            <div className="mt-6">
              <BulletList items={p.features} />
            </div>
          </div>
          <div>
            <SectionHead eyebrow="Applications" title="Typical service" />
            <div className="mt-6">
              <BulletList items={p.applications} />
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHead eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-8">
          <FaqList faqs={p.faqs} />
        </div>
      </Section>

      {grades.length ? (
        <Section className="border-t border-border">
          <SectionHead
            eyebrow="Material options"
            title={`${p.name} by grade`}
            intro="Select a grade for composition, ratings, dimensions and the downloadable datasheet for this product form."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {grades.map((g) => (
              <CardLink
                key={g.slug}
                to={matrixPath(g, p)}
                eyebrow={familyLabel[g.family]}
                title={`${g.name} ${p.name}`}
                body={g.tagline}
              />
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand title={`Request a quotation for ${p.name}`} />
    </>
  );
}
