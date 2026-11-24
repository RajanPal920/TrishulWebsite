import { createFileRoute, notFound, Link } from "@tanstack/react-router";
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
    let title = `${p.name} — Alloy & Stainless | Trishul Metals`;
    if (p.slug === "structural-beams") {
      title = "Structural Beams (ISMB, ISHB, UB, UC, HEA, HEB) — IS 2062 / EN 10025 / ASTM A36";
    } else if (p.category === "structural") {
      title = `${p.name} — Carbon & Structural Steel (IS 2062 / EN 10025) | Trishul Metals`;
    } else if (p.category === "pvc-piping") {
      title = `${p.name} — UPVC, CPVC & SWR | Trishul Metals`;
    }
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

      <Section className="border-t border-border bg-card/20">
        <div className="surface-panel rounded-md border border-border p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>BIM &amp; Engineering Downloads</Eyebrow>
              <h2 className="mt-2 text-2xl font-bold text-foreground">
                Parametric 2D DXF &amp; 3D STL Models Available
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Download verified dimensional technical drawings and CAD solids for {p.name} across full NPS ranges and pressure classes, generated against governing ASME/ASTM engineering dimensions with standard part codes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                to="/cad"
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <span>Open CAD Library →</span>
              </Link>
              <Link
                to="/rfq"
                search={{ product: p.name }}
                className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <span>Request Quote</span>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand title={`Request a quotation for ${p.name}`} />
    </>
  );
}
