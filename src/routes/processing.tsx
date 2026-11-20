import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHead, Breadcrumbs } from "@/components/site/parts";
import { SubcomponentMatrix } from "@/components/site/SubcomponentMatrix";
import { subcomponents } from "@/data/subcomponents";
import { itemListScript } from "@/lib/jsonld";
import { breadcrumbScript } from "@/lib/breadcrumb";

const capabilities = [
  {
    label: "Precision saw cutting",
    body: "Exact-length cutting from pipe, tube, bar and forged stock with square-faced ends and length tolerances held to your requirement.",
  },
  {
    label: "End bevelling (ASME B16.25)",
    body: "Weld-prep bevels applied to your WPS, bevel angle and root-face / root-gap requirements, ready for fit-up on site.",
  },
  {
    label: "Rough machining, boring & facing",
    body: "ID/OD turning, boring and facing from bar, pipe or forged blanks — supplied semi-finished with machining allowance where required.",
  },
  {
    label: "Cut-to-drawing components",
    body: "Sub-components machined to your drawing or isometric dimensions and tolerances, delivered drop-in ready for welding or assembly.",
  },
];

export const Route = createFileRoute("/processing")({
  head: () => ({
    meta: [
      { title: "Custom Cutting, Machining & Cut-to-Size Alloy Components | Trishul Metals" },
      {
        name: "description",
        content:
          "Cut-to-size, bevelled and pre-machined alloy components supplied to drawing for oil & gas, subsea, refinery, LNG, desalination and railway projects.",
      },
      {
        property: "og:title",
        content: "Custom Cutting, Machining & Cut-to-Size Components | Trishul Metals & Alloys",
      },
      {
        property: "og:description",
        content:
          "Precision saw cutting, ASME B16.25 end bevelling, boring and facing — drop-in alloy sub-components machined to your drawing.",
      },
      { property: "og:url", content: "https://www.trishulmetal.com/processing" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.trishulmetal.com/processing" }],
    scripts: [
      breadcrumbScript([{ label: "Home", to: "/" }, { label: "Processing" }]),
      itemListScript({
        name: "Pre-processed & cut-to-size components by sector",
        items: subcomponents.map((entry) => ({
          name: `${entry.industry} — ${entry.product}`,
          description: entry.finishedComponent,
        })),
      }),
    ],
  }),
  component: ProcessingPage,
});

function ProcessingPage() {
  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Processing" }]} />
        <div className="mt-6">
          <SectionHead
            as="h1"
            eyebrow="Value-added processing"
            title="Custom cutting, machining & cut-to-size components"
            intro="We take alloy stock — seamless pipe, tube, bar, plate and forged blanks — and deliver drop-in, ready-to-install sub-components instead of random mill lengths. Supply your length, tolerance or drawing and the material arrives cut, bevelled and machined, so you avoid cutting waste, offcut stock and local machine-shop delays."
          />
        </div>
      </Section>

      <Section className="border-b border-border bg-card/30">
        <SectionHead
          eyebrow="Capabilities"
          title="What we do before the material ships"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {capabilities.map((c) => (
            <article key={c.label} className="surface-panel rounded-md p-6">
              <h3 className="text-base font-semibold text-foreground">{c.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="border-b border-border">
        <SectionHead
          eyebrow="By sector"
          title="Pre-processed & cut-to-size components we supply"
          intro="Typical raw stock and the finished, pre-processed component we deliver for each sector we serve."
        />
        <SubcomponentMatrix />
      </Section>

      <Section className="bg-card/40">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Next step</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              Send your length, tolerance or drawing
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Share the grade, product form, cut lengths and any bevel or machining requirement — we
              respond with pricing, lead time and the documentation scope.
            </p>
          </div>
          <Link
            to="/rfq"
            className="inline-flex min-h-11 w-fit items-center rounded-sm bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Request a technical quotation
          </Link>
        </div>
      </Section>
    </>
  );
}
