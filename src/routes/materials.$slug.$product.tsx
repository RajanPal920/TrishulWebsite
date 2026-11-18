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
import { ShortlistButtons } from "@/components/site/ShortlistControls";
import { matrixPair, specForPair, productsForMaterial } from "@/data/matrix";
import { company } from "@/data/company";
import { categoryMeta } from "@/data/products";
import { downloadMatrixDatasheet } from "@/lib/datasheet";
import { groupForGrade, ratingRows, pressureClasses, facings } from "@/data/ratings";
import { flangeDims, pipeDims, fittingDims } from "@/data/cad";
import { GradeFinder } from "@/components/site/GradeFinder";
import { CutToSizeConfigurator } from "@/components/site/CutToSizeConfigurator";
import { breadcrumbScript } from "@/lib/breadcrumb";
import { faqScript, productScript } from "@/lib/jsonld";

export const Route = createFileRoute("/materials/$slug/$product")({
  loader: ({ params }) => {
    const pair = matrixPair(params.slug, params.product);
    if (!pair) throw notFound();
    return { material: pair.material, product: pair.product, spec: specForPair(pair.material, pair.product) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Combination unavailable | Trishul Metals" }, { name: "robots", content: "noindex" }] };
    }
    const { material: m, product: p, spec } = loaderData;
    const title = `${m.name} ${p.name} — ${spec} | Trishul Metals`;
    const description = `${m.name} (${m.uns}) ${p.name.toLowerCase()} supplied to ${spec} with EN 10204 3.1/3.2 certification, full heat traceability and worldwide export from Mumbai.`;
    return {
      meta: [
        { title: title.slice(0, 60) },
        { name: "description", content: description.slice(0, 158) },
        { property: "og:title", content: `${m.name} ${p.name} | Trishul Metals` },
        { property: "og:description", content: description.slice(0, 158) },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/materials/${m.slug}/${p.slug}` },
      ],
      links: [{ rel: "canonical", href: `/materials/${m.slug}/${p.slug}` }],
      scripts: [
        breadcrumbScript([
          { label: "Home", to: "/" },
          { label: "Materials", to: "/materials" },
          { label: m.name, to: `/materials/${m.slug}` },
          { label: p.name },
        ]),
        productScript({
          name: `${m.name} ${p.name}`,
          description: description.slice(0, 300),
          url: `${company.siteUrl}/materials/${m.slug}/${p.slug}`,
          material: `${m.name} (${m.uns})`,
          sku: `${m.uns}-${p.slug}`,
          standard: spec,
        }),
        ...(p.faqs?.length || m.faqs?.length
          ? [faqScript([...(p.faqs ?? []).slice(0, 3), ...(m.faqs ?? []).slice(0, 3)])]
          : []),
      ],
    };
  },
  component: MatrixPage,
});

function MatrixPage() {
  const { material: m, product: p, spec } = Route.useLoaderData();
  const group = groupForGrade(m.slug);
  const isFlange = p.category === "flanges";
  const isPipe = p.category === "pipes-tubes";
  const isFitting = p.category === "pipe-fittings";
  const related = productsForMaterial(m).filter((x) => x.slug !== p.slug);

  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Materials", to: "/materials" },
            { label: m.name, to: `/materials/${m.slug}` },
            { label: p.name },
          ]}
        />
        <div className="mt-6 max-w-4xl">
          <Eyebrow>
            {categoryMeta[p.category].name} · {m.uns} · {spec}
          </Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            {m.name} {p.name}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {p.tagline} — supplied in {m.name} to {spec}.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{m.summary}</p>
          <ShortlistButtons
            item={{
              id: `matrix:${m.slug}:${p.slug}`,
              kind: "matrix",
              title: `${m.name} ${p.name}`,
              subtitle: spec,
              href: `/materials/${m.slug}/${p.slug}`,
              materialSlug: m.slug,
              productSlug: p.slug,
            }}
            onDownload={() => downloadMatrixDatasheet(m, p, spec)}
          />
        </div>
      </Section>

      <Section>
        <SectionHead
          eyebrow="Scope of supply"
          title={`${p.name} in ${m.name}`}
          intro={`Manufactured and certified to ${spec} together with the dimensional standards below, with heat-number traceability from melt to dispatch.`}
        />
        <div className="mt-6">
          <Prose paragraphs={p.overview.slice(0, 2)} />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <SpecTable
            caption="Supply specification"
            head={["Parameter", "Range"]}
            rows={p.specs.map((s) => [s.label, s.value])}
          />
          <SpecTable
            caption="Material data"
            head={["Property", "Value"]}
            rows={[
              ["Material specification", spec],
              ["UNS", m.uns],
              ["Werkstoff", m.werkstoff ?? "—"],
              ...m.mechanical.map((r) => [r.label, r.value] as [string, string]),
            ]}
          />
        </div>
      </Section>

      <Section className="border-y border-border bg-card/30">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <Eyebrow>Chemistry</Eyebrow>
            <div className="mt-4">
              <SpecTable
                head={["Element", "Content"]}
                rows={m.composition.map((c) => [c.element, c.percent])}
              />
            </div>
          </div>
          <div>
            <Eyebrow>Corrosion behaviour</Eyebrow>
            <div className="mt-4">
              <BulletList items={m.corrosion} />
            </div>
            <div className="mt-8">
              <Eyebrow>Standards applied</Eyebrow>
              <div className="mt-4">
                <BulletList items={[`Material: ${spec}`, ...p.standards]} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {group && (isFlange || isFitting) ? (
        <Section>
          <SectionHead
            eyebrow="Pressure–temperature"
            title={`${m.name} ratings — ${group.label}`}
            intro={`Indicative working pressure in bar gauge for ${m.name} flanged joints. Confirm against ASME B16.5 Table 2 of the edition invoked by the project specification before release.`}
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

      {isFlange ? (
        <Section className="border-y border-border bg-card/30">
          <SectionHead
            eyebrow="Dimensions"
            title="Class 150 and Class 300 size matrix"
            intro="Nominal inches per ASME B16.5. Larger sizes above NPS 24 are supplied to ASME B16.47 Series A or B."
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {(["150", "300"] as const).map((cls) => (
              <div key={cls}>
                <Eyebrow>Class {cls}</Eyebrow>
                <div className="mt-4">
                  <SpecTable
                    head={["NPS", "OD", "Thk", "Bolt circle", "Bolts"]}
                    rows={flangeDims[cls].map((f) => [
                      f.nps,
                      `${f.od}"`,
                      `${f.tf}"`,
                      `${f.bc}"`,
                      `${f.bolts} × ${f.hole}"`,
                    ])}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Eyebrow>Facings offered</Eyebrow>
            <div className="mt-4">
              <SpecTable head={["Facing", "Description", "Finish"]} rows={facings.map((f) => [f.code, f.label, f.finish])} />
            </div>
          </div>
        </Section>
      ) : null}

      {isPipe ? (
        <Section className="border-y border-border bg-card/30">
          <SectionHead
            eyebrow="Dimensions"
            title="NPS, outside diameter and schedule wall"
            intro="Wall thicknesses to ASME B36.10M (carbon) and B36.19M (stainless and alloy) in nominal inches."
          />
          <div className="mt-8">
            <SpecTable
              head={["NPS", "OD (in)", "OD (mm)", "SCH 10S", "SCH 40", "SCH 80"]}
              rows={pipeDims.map((d) => [
                d.nps,
                d.od.toFixed(3),
                (d.od * 25.4).toFixed(1),
                `${d.s10}"`,
                `${d.s40}"`,
                `${d.s80}"`,
              ])}
            />
          </div>
        </Section>
      ) : null}

      {isFitting ? (
        <Section className="border-y border-border bg-card/30">
          <SectionHead
            eyebrow="Dimensions"
            title="ASME B16.9 centre-to-end dimensions"
            intro="Long-radius elbows, tees, reducers and caps in nominal inches."
          />
          <div className="mt-8">
            <SpecTable
              head={["NPS", "90° LR elbow", "45° elbow", "Tee C-to-E", "Reducer", "Cap"]}
              rows={fittingDims.map((d) => [
                `${d.npsNum}"`,
                `${d.elbow90}"`,
                `${d.elbow45}"`,
                `${d.tee}"`,
                `${d.reducer}"`,
                `${d.cap}"`,
              ])}
            />
          </div>
        </Section>
      ) : null}

      {related.length ? (
        <Section>
          <SectionHead eyebrow="Also available" title={`Other products in ${m.name}`} />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <CardLink
                key={r.slug}
                to={`/materials/${m.slug}/${r.slug}`}
                eyebrow={categoryMeta[r.category].name}
                title={`${m.name} ${r.name}`}
                body={r.tagline}
              />
            ))}
          </div>
        </Section>
      ) : null}

      <Section className="border-t border-border bg-card/30">
        <SectionHead
          eyebrow="Quick lookup"
          title="Confirm size, class, facing and equivalent grade"
          intro="Check the controlled dimensions and international designations for this combination before you raise the enquiry."
        />
        <div className="mt-8">
          <GradeFinder initialSlug={m.slug} compact />
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHead
          eyebrow="Cut-to-size & pre-machining"
          title="Configure a finished, installation-ready component"
          intro="Specify exact lengths, quantities, processing and third-party inspection before continuing to the existing quotation form."
        />
        <div className="mt-8">
          <CutToSizeConfigurator grade={m.name} product={p.name} />
        </div>
      </Section>

      <Section className="border-t border-border">

        <SectionHead eyebrow="FAQ" title="Common questions" />
        <div className="mt-8">
          <FaqList faqs={[...p.faqs.slice(0, 3), ...m.faqs.slice(0, 3)]} />
        </div>
      </Section>

      <CtaBand title={`Request a quotation for ${m.name} ${p.name.toLowerCase()}`} />
    </>
  );
}
