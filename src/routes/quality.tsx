import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHead, Breadcrumbs, BulletList, CtaBand, FaqList } from "@/components/site/parts";
import { certifications, credentials } from "@/data/company";
import { MtcSample } from "@/components/site/MtcSample";
import { PmiSample, TpiSample } from "@/components/site/SpecimenDoc";
import { HeatVerify } from "@/components/site/HeatVerify";
import { faqsByCategory } from "@/data/faq";
import mtcDossier from "@/assets/mtc-dossier.jpg";
import packingCases from "@/assets/packing-cases.jpg";
import packingVci from "@/assets/packing-vci-bundles.jpg";
import packingStamp from "@/assets/packing-heat-stamp.jpg";
import { packingSpecs } from "@/data/packing";
import { downloadPackingSpecimen } from "@/lib/datasheet";
import { DownloadCard, DownloadLink } from "@/components/site/DownloadGate";
import qualityCaliper1200 from "@/assets/editorial/quality-caliper-1200.webp.asset.json";
import qualityCaliper2000 from "@/assets/editorial/quality-caliper-2000.webp.asset.json";




export const Route = createFileRoute("/quality")({
  head: () => ({
    meta: [
      { title: "Quality Assurance, Testing & Certification | Trishul Metals & Alloys" },
      {
        name: "description",
        content:
          "EN 10204 3.1 and 3.2 certification, PMI, ferrite count, impact testing, ASTM G48 corrosion testing, hardness and NDT with third-party inspection coordination. Materials available against applicable NORSOK M-630 Material Data Sheets.",
      },
      { property: "og:title", content: "Quality Assurance & Testing | Trishul Metals" },
      { property: "og:description", content: "Traceability, testing and inspection scope for every consignment, including NORSOK M-630 material requirements." },
      { property: "og:url", content: "/quality" },
    ],
    links: [{ rel: "canonical", href: "/quality" }],
  }),
  component: Quality,
});

function Quality() {
  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Quality" }]} />
        <div className="mt-6">
          <SectionHead as="h1"
            eyebrow="Quality assurance"
            title="Traceable material, verifiable documentation"
            intro="Every item is supplied with heat-linked certification and the test scope agreed at order stage — no substitutions after release."
          />
        </div>
      </Section>

      <Section>
        <SectionHead
          eyebrow="Certifications &amp; registrations"
          title="Credentials you can verify"
          intro="Trishul Metals &amp; Alloys is an ISO 9001:2015-certified, DGFT-licensed exporter, GST- and MSME-registered, and DPIIT-recognised."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {credentials.map((c) => (
            <article key={c.name} className="surface-panel rounded-md p-6">
              <h3 className="font-display text-lg font-semibold leading-snug">{c.name}</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">{c.issuer}</p>
              {c.number && (
                <p className="mt-3 font-mono text-sm tracking-wide text-primary">{c.number}</p>
              )}
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.detail}</p>
              {c.validity && (
                <p className="mt-3 text-xs font-medium text-foreground">{c.validity}</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
                {c.documentKey && <DownloadLink documentKey={c.documentKey} title={c.name} />}
                {c.verify && (
                  <a
                    href={c.verify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center text-xs font-semibold text-primary hover:underline"
                  >
                    Verify →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHead
          eyebrow="Downloads &amp; resources"
          title="Catalogue and technical documentation"
          intro="Share your contact details and the PDF download starts straight away."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <DownloadCard
            documentKey="product-catalogue-2026"
            title="Product Catalogue 2026"
            description="Full range of CRA flanges, pipe fittings, pipe, sheet and bar with grades, sizes, ratings and standards covered."
          />
          <DownloadCard
            documentKey="technical-guide"
            title="Technical Guide"
            description="Grade equivalents, mechanical and chemical data, testing scope and specification guidance for CRA piping components."
          />
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          <div>
            <SectionHead eyebrow="Documentation" title="Certification package" />
            <div className="mt-6">
              <BulletList
                items={[
                  "EN 10204 3.1 mill test certificates as standard",
                  "EN 10204 3.2 with third-party endorsement where specified",
                  "Chemical composition and mechanical property reports",
                  "Heat treatment and solution annealing records",
                  "Marking per MSS SP-25 with heat number traceability",
                ]}
              />
            </div>
          </div>
          <div className="space-y-8">
            <figure className="relative aspect-[16/10] overflow-hidden rounded-md border border-border">
              <img
                src={qualityCaliper1200.url}
                srcSet={`${qualityCaliper1200.url} 1200w, ${qualityCaliper2000.url} 2000w`}
                sizes="(min-width: 1024px) 48vw, 100vw"
                alt="Digital caliper measuring a steel section during dimensional inspection"
                loading="lazy"
                width={2000}
                height={1336}
                className="h-full w-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent px-5 pb-4 pt-14 text-xs text-foreground">
                Dimensional verification forms part of the agreed inspection scope before material release.
              </figcaption>
            </figure>
            <div>
            <SectionHead eyebrow="Testing" title="Available test scope" />
            <div className="mt-6">
              <BulletList
                items={[
                  "Positive material identification (PMI) on 100% of items on request",
                  "Ferrite content measurement for duplex and super duplex",
                  "Charpy V-notch impact testing at specified temperatures",
                  "ASTM G48 Method A pitting corrosion testing",
                  "Intergranular corrosion testing to ASTM A262 / G28",
                  "Hardness testing to NACE MR0175 / ISO 15156 limits",
                  "Dye penetrant, ultrasonic and radiographic examination",
                ]}
              />
            </div>
            </div>
          </div>
        </div>
      </Section>
      <Section className="border-t border-border">
        <SectionHead
          eyebrow="Sample documentation"
          title="What a Trishul mill test certificate looks like"
          intro="A redacted specimen of the EN 10204 3.1 certificate issued with every consignment — heat number, chemistry, mechanical results and the full test scope on one traceable document. Customer and mill identifiers are blacked out on this sample only."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-start">
          <figure className="surface-panel overflow-hidden rounded-md">
            <img
              src={mtcDossier}
              alt="Printed EN 10204 3.1 inspection certificate dossier with a pipe offcut, heat number tag and inspection stamp"
              loading="lazy"
              width={1536}
              height={1024}
              className="h-56 w-full object-cover lg:h-64"
            />
            <figcaption className="px-5 py-4 text-sm leading-relaxed text-muted-foreground">
              The physical dispatch dossier: signed 3.1 certificates, test reports and dimensional records, cross-checked
              against the heat-number tag on the material before release.
            </figcaption>
          </figure>
          <MtcSample />
        </div>

      </Section>
      <Section className="border-t border-border">
        <SectionHead
          eyebrow="Documentation dossier"
          title="PMI and third-party inspection specimens"
          intro="The certificate is only part of the release. Positive material identification proves the item in the crate is the alloy on the paperwork, and the third-party release note proves an independent inspector agreed. Both specimens below are redacted and downloadable."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
          <PmiSample />
          <TpiSample />
        </div>
      </Section>

      <Section className="border-t border-border bg-card/30">
        <SectionHead
          eyebrow="Traceability"
          title="MTC batch verification"
          intro="Enter a heat number to see the certificate record behind it. Try one of the demonstration heats below; live project heats resolve through the client portal dossier vault."
        />
        <div className="mt-8">
          <HeatVerify />
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHead
          eyebrow="Export packing"
          title="How the material actually leaves the works"
          intro="Documentation is worthless if the material arrives pitted, mixed or held at phytosanitary inspection. Seaworthy ISPM-15 cases, VCI preservation and stencilled heat-linked marking are standard on every export consignment."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { src: packingCases, alt: "ISPM-15 stamped seaworthy plywood export cases on skids", cap: "Seaworthy plywood cases, battened and skid-mounted" },
            { src: packingVci, alt: "VCI wrapped stainless steel pipe bundles with plastic end caps", cap: "VCI-wrapped bundles with capped pipe ends" },
            { src: packingStamp, alt: "IPPC heat treatment stamp burned into export crate plywood", cap: "IPPC heat-treatment mark on every wooden member" },
          ].map((img) => (
            <figure key={img.cap} className="overflow-hidden rounded-md border border-border bg-card/40">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                width={1024}
                height={768}
                className="h-56 w-full object-cover"
              />
              <figcaption className="px-4 py-3 text-xs leading-relaxed text-muted-foreground">{img.cap}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <dl className="divide-y divide-border rounded-md border border-border">
            {packingSpecs.map((p) => (
              <div key={p.label} className="px-5 py-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">{p.label}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.detail}</dd>
              </div>
            ))}
          </dl>
          <div className="rounded-md border border-primary/40 bg-primary/5 p-6">
            <p className="eyebrow">Specimen document</p>
            <h3 className="mt-3 font-display text-xl font-semibold">Export packing list &amp; marking sheet</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A redacted case-wise packing list showing marks, heat numbers, net and gross weights and the packing
              standard applied — the same format issued with your consignment documents.
            </p>
            <button
              type="button"
              onClick={() => downloadPackingSpecimen()}
              className="mt-5 rounded-sm border border-primary/60 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
            >
              Download specimen packing list (PDF)
            </button>
          </div>
        </div>
      </Section>


      <Section className="border-t border-border">
        <SectionHead
          eyebrow="NORSOK M-630"
          title="NORSOK M-630 material requirements"
          intro="Materials can be sourced against applicable NORSOK M-630 Material Data Sheets (MDS), with supporting manufacturer documentation, material certificates, testing and traceability available as required by the applicable specification and purchase order."
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              NORSOK M-630 is a material specification, not a certification held by a
              distributor. Trishul Metals &amp; Alloys does not claim NORSOK certification
              or NORSOK M-650 qualification in its own name; material is offered against
              the applicable MDS and the qualification status of the actual manufacturing
              source, verified enquiry by enquiry.
            </p>
            <div>
              <BulletList
                items={[
                  "The exact NORSOK M-630 MDS depends on the material, grade and product form — state the MDS number on the enquiry where the project specifies one",
                  "Applicable manufacturer qualification requirements must be verified against the nominated manufacturing source before the order is confirmed",
                  "NORSOK M-650 qualification is claimed only where the actual manufacturing source holds valid qualification applicable to the required MDS and product form",
                  "MTCs, inspection reports, NDT records, heat-treatment records, testing and traceability are provided where required by the applicable MDS or project specification",
                  "ASTM, ASME or NACE documentation on its own does not demonstrate compliance with NORSOK M-630",
                ]}
              />
            </div>
          </div>
          <div className="rounded-md border border-primary/40 bg-primary/5 p-6">
            <p className="eyebrow">Documentation &amp; evidence</p>
            <h3 className="mt-3 font-display text-xl font-semibold">
              Supporting documents available for NORSOK enquiries
            </h3>
            <div className="mt-5">
              <BulletList
                items={[
                  "Applicable NORSOK M-630 Material Data Sheet (MDS)",
                  "Manufacturer's NORSOK M-650 qualification documentation, where applicable",
                  "EN 10204 3.1 / 3.2 Material Test Certificate, as required",
                  "Chemical composition report",
                  "Mechanical test report",
                  "Heat-treatment records",
                  "NDT reports — UT, MPI, DPI or RT where applicable",
                  "Corrosion-testing documentation where required",
                  "Manufacturer ISO 9001 certificate",
                  "Third-party inspection documentation where specified",
                  "Full heat / batch / product traceability documentation",
                ]}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHead eyebrow="FAQ" title="Quality and testing questions" />
        <div className="mt-8">
          <FaqList faqs={faqsByCategory("quality").map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </Section>

      <Section className="border-t border-border bg-card/30">
        <SectionHead eyebrow="Compliance" title="Standards and approvals" />
        <div className="mt-6 max-w-3xl">
          <BulletList items={[...certifications]} />
        </div>
      </Section>
      <CtaBand />

    </>
  );
}
