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
  CardLink,
} from "@/components/site/parts";
import { materialBySlug } from "@/data/materials";
import { productsForMaterial } from "@/data/matrix";
import { categoryMeta } from "@/data/products";
import { relatedGrades } from "@/data/related";
import { familyLabel } from "@/data/types";
import { groupForGrade, ratingRows, pressureClasses } from "@/data/ratings";
import { equivalentFor } from "@/data/equivalents";
import { GradeFinder } from "@/components/site/GradeFinder";
import { breadcrumbScript } from "@/lib/breadcrumb";
import { faqScript } from "@/lib/jsonld";


export const Route = createFileRoute("/materials/$slug/")({
  loader: ({ params }) => {
    const material = materialBySlug(params.slug);
    if (!material) throw notFound();
    return { material };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Grade unavailable | Trishul Metals" }, { name: "robots", content: "noindex" }] };
    }
    const m = loaderData.material;
    const title =
      m.family === "polymer"
        ? `${m.name} — Pipes & Fittings | Trishul Metals`
        : `${m.name} (${m.uns}) Flanges & Fittings | Trishul Metals`;
    return {
      meta: [
        { title },
        { name: "description", content: m.summary.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: m.tagline },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/materials/${m.slug}` },
      ],
      links: [{ rel: "canonical", href: `/materials/${m.slug}` }],
      scripts: [
        breadcrumbScript([
          { label: "Home", to: "/" },
          { label: "Materials", to: "/materials" },
          { label: m.name },
        ]),
        ...(m.faqs?.length ? [faqScript(m.faqs)] : []),
      ],
    };
  },
  component: MaterialPage,
});

function MaterialPage() {
  const { material: m } = Route.useLoaderData();
  const group = groupForGrade(m.slug);
  const equiv = equivalentFor(m.slug);
  const equivRows = equiv
    ? ([
        ["ASTM / ASME", equiv.astm],
        ["UNS", equiv.uns],
        ["Werkstoff", equiv.werkstoff],
        ["EN designation", equiv.en],
        ["DIN", equiv.din],
        ["JIS", equiv.jis],
        ["BS", equiv.bs],
        ["GOST", equiv.gost],
        ["AFNOR", equiv.afnor],
      ].filter((r) => r[1]) as string[][])
    : [];

  const related = (relatedGrades[m.slug] ?? [])
    .map((r) => ({ ...r, grade: materialBySlug(r.slug) }))
    .filter((r) => r.grade);
  const availableProducts = productsForMaterial(m);

  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Materials", to: "/materials" }, { label: m.name }]}
        />
        <div className="mt-6 max-w-4xl">
          <Eyebrow>
            {familyLabel[m.family]} · {m.uns}
            {m.werkstoff ? ` · ${m.werkstoff}` : ""}
          </Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">{m.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{m.tagline}</p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{m.summary}</p>
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="Overview" title={`Understanding ${m.name}`} />
        <div className="mt-6">
          <Prose paragraphs={m.overview} />
        </div>
      </Section>

      <Section className="border-y border-border bg-card/30">
        <SectionHead eyebrow="Technical data" title="Composition and properties" />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <SpecTable
            caption="Chemical composition (%)"
            head={["Element", "Content"]}
            rows={m.composition.map((c) => [c.element, c.percent])}
          />
          <SpecTable
            caption="Mechanical properties"
            head={["Property", "Value"]}
            rows={m.mechanical.map((r) => [r.label, r.value])}
          />
          <SpecTable
            caption="Physical properties"
            head={["Property", "Value"]}
            rows={m.physical.map((r) => [r.label, r.value])}
          />
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHead eyebrow="Corrosion" title="Corrosion behaviour" />
            <div className="mt-6">
              <BulletList items={m.corrosion} />
            </div>
          </div>
          <div>
            <SectionHead eyebrow="Characteristics" title="Key features" />
            <div className="mt-6">
              <BulletList items={m.features} />
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-y border-border bg-card/30">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHead eyebrow="Applications" title="Where it is specified" />
            <div className="mt-6">
              <BulletList items={m.applications} />
            </div>
          </div>
          <div>
            <SectionHead eyebrow="Standards" title="Governing specifications" />
            <div className="mt-6 space-y-6">
              <div>
                <p className="eyebrow">Flanges</p>
                <div className="mt-3">
                  <BulletList items={m.standards.flanges} />
                </div>
              </div>
              <div>
                <p className="eyebrow">Fittings</p>
                <div className="mt-3">
                  <BulletList items={m.standards.fittings} />
                </div>
              </div>
              {m.standards.other?.length ? (
                <div>
                  <p className="eyebrow">Other forms</p>
                  <div className="mt-3">
                    <BulletList items={m.standards.other} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Section>

      {equivRows.length ? (
        <Section>
          <SectionHead
            eyebrow="Cross-reference"
            title="Equivalent international designations"
            intro="The same chemistry carries a different designation in each standards regime. Order against the standard named in your specification; we cross-reference the rest on the certificate."
          />
          <div className="mt-8">
            <SpecTable head={["Standard", "Designation"]} rows={equivRows} />
          </div>
        </Section>
      ) : null}

      {group ? (
        <Section className="border-y border-border bg-card/30">
          <SectionHead
            eyebrow="Pressure–temperature"
            title={`Flange ratings — ${group.label}`}
            intro={`${group.examples}. Indicative working pressure in bar gauge for flanged joints; the governing figures are ASME B16.5 Table 2 for the edition invoked by your specification.`}
          />
          <div className="mt-8">
            <SpecTable
              head={["Temp °C", ...pressureClasses.map((c) => `Class ${c}`)]}
              rows={ratingRows(group).map((r) => [
                String(r.temp),
                ...pressureClasses.map((c) => r.values[c].toFixed(1)),
              ])}
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{group.note}</p>
        </Section>
      ) : null}

      <Section>
        <SectionHead eyebrow="Selection" title={`${m.name} compared`} />
        <div className="mt-8">
          <SpecTable head={["Compared with", "Engineering note"]} rows={m.comparison.map((c) => [c.vs, c.note])} />
        </div>
      </Section>

      {related.length ? (
        <Section className="border-t border-border">
          <SectionHead
            eyebrow="Related grades"
            title="Metallurgically related grades"
            intro="Grades engineers commonly evaluate alongside this one — higher-alloy step-ups, stabilised variants and economical alternatives."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <CardLink
                key={r.slug}
                to={`/materials/${r.slug}`}
                eyebrow={familyLabel[r.grade!.family]}
                title={r.grade!.name}
                body={r.reason}
              />
            ))}
          </div>
        </Section>
      ) : null}

      <Section className="border-t border-border bg-card/30">
        <SectionHead
          eyebrow="Quick lookup"
          title={`Size selector & equivalent grades for ${m.name}`}
          intro="Cross-reference international designations and map NPS, schedule, class and facing without leaving the page."
        />
        <div className="mt-8">
          <GradeFinder initialSlug={m.slug} compact />
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHead eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-8">
          <FaqList faqs={m.faqs} />
        </div>
      </Section>

      {availableProducts.length ? (
        <Section className="border-t border-border">
          <SectionHead
            eyebrow="Product forms"
            title={`${m.name} available as`}
            intro="Every product form we supply in this grade, with dimensions and datasheets on the individual combination pages."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {availableProducts.map((p) => (
              <CardLink
                key={p.slug}
                to={`/materials/${m.slug}/${p.slug}`}
                eyebrow={categoryMeta[p.category].name}
                title={`${m.name} ${p.name}`}
                body={p.tagline}
              />
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand title={`Request a quotation for ${m.name} flanges and fittings`} />
    </>
  );
}
