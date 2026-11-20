import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHead, CardLink, Breadcrumbs, CtaBand, BulletList } from "@/components/site/parts";
import { categoryMeta, productsByCategory, categoryOrder } from "@/data/products";
import { productImage } from "@/data/productImages";
import { breadcrumbScript } from "@/lib/breadcrumb";
import { productPhotoAlt } from "@/lib/imageAlt";
import { company } from "@/data/company";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Flanges, Pipe Fittings & Structural Steel — Product Range | Trishul Metals & Alloys" },
      {
        name: "description",
        content:
          "Weld neck, slip-on, blind, socket weld, lap joint and orifice flanges, buttweld fittings, pipes and structural steel sections to ASME, ASTM, EN, IS and NACE requirements.",
      },
      { property: "og:title", content: "Flanges, Pipe Fittings & Structural Steel | Trishul Metals & Alloys" },
      { property: "og:description", content: "Engineered piping components and structural steel sections in critical alloy and carbon grades." },
      { property: "og:url", content: `${company.siteUrl}/products` },
    ],
    links: [{ rel: "canonical", href: `${company.siteUrl}/products` }],
    scripts: [breadcrumbScript([{ label: "Home", to: "/" }, { label: "Products" }])],
  }),
  component: ProductsIndex,
});

const categories = categoryOrder;

function ProductsIndex() {
  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Products" }]} />
        <div className="mt-6">
          <SectionHead as="h1"
            eyebrow="Product engineering"
            title="CRA piping & structural component catalogue"
            intro="Flanges, buttweld and forged fittings, pipes and tubes, structural steel sections, bars and plate in corrosion-resistant alloys. Each product page covers dimensional standards, size ranges, typical applications and the inspection scope we supply against."
          />
        </div>
      </Section>

      {categories.map((cat) => (
        <Section key={cat} id={cat} className="border-b border-border scroll-mt-20">
          <SectionHead eyebrow={categoryMeta[cat].name} title={categoryMeta[cat].singular} intro={categoryMeta[cat].blurb} />
           <div className="motion-stagger-grid mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {productsByCategory(cat).map((p) => (
              <CardLink
                key={p.slug}
                to="/products/$slug"
                params={{ slug: p.slug }}
                title={p.name}
                body={p.tagline}
                image={productImage(p.slug)}
                imageAlt={productPhotoAlt(p)}
              />
            ))}

          </div>
          <div className="mt-10 max-w-3xl">
            <BulletList items={categoryMeta[cat].standards} />
          </div>
        </Section>
      ))}

      <CtaBand />
    </>
  );
}
