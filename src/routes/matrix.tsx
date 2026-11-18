import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHead, Breadcrumbs, CtaBand } from "@/components/site/parts";
import { materials } from "@/data/materials";
import { familyLabel, type Family } from "@/data/types";
import { families } from "@/data/materials";
import { productsForMaterial, matrixCount } from "@/data/matrix";

const count = matrixCount();
const title = `Grade × Product Directory — ${count} Technical Pages | Trishul Metals`;
const description =
  "Complete directory of CRA grade and product-form combinations: Inconel 625 weld neck flanges, Duplex 2205 butt weld fittings, 316L seamless pipes and every other supplied pairing.";

export const Route = createFileRoute("/matrix")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/matrix" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/matrix" }],
  }),
  component: MatrixIndex,
});

function MatrixIndex() {
  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Grade × product directory" }]} />
        <div className="mt-6">
          <SectionHead as="h1"
            eyebrow={`${count} combination pages`}
            title="Grade × product directory"
            intro="Every CRA grade we supply — plus the companion carbon and low-temperature steel offered alongside it — crossed against every product form it is genuinely produced in, each with its governing specification, size range, chemistry and pressure class data."
          />
        </div>
      </Section>

      {families.map((family: Family) => {
        const grades = materials.filter((m) => m.family === family);
        return (
          <Section key={family} className="border-b border-border">
            <SectionHead eyebrow={familyLabel[family]} title={`${familyLabel[family]} combinations`} />
            <div className="mt-8 space-y-8">
              {grades.map((m) => {
                const products = productsForMaterial(m);
                if (!products.length) return null;
                return (
                  <div key={m.slug}>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <Link
                        to="/materials/$slug"
                        params={{ slug: m.slug }}
                        className="font-display text-base font-semibold text-foreground hover:text-primary"
                      >
                        {m.name}
                      </Link>
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {m.uns} · {products.length} product pages
                      </span>
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {products.map((p) => (
                        <li key={p.slug}>
                          <Link
                            to="/materials/$slug/$product"
                            params={{ slug: m.slug, product: p.slug }}
                            className="inline-block rounded-sm border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                          >
                            {m.name} {p.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </Section>
        );
      })}

      <CtaBand title="Cannot see your exact grade and form combination?" />
    </>
  );
}
