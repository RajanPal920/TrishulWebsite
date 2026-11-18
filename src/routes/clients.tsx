import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Section, SectionHead, Breadcrumbs, CtaBand } from "@/components/site/parts";
import { caseCards, dispatchStats, inspectionAgencies, projectSnapshots, trustSectors } from "@/data/clients";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "Verified Client Trust Feed — Project Dispatches & Inspection Record | Trishul Metals" },
      {
        name: "description",
        content:
          "Anonymised dispatch records and project snapshots by sector: 1,400+ tonnes exported, zero rejections across witnessed TPI inspections worldwide.",
      },
      { property: "og:title", content: "Verified Global Client Trust Feed | Trishul Metals & Alloys" },
      {
        property: "og:description",
        content: "Project-sector dispatch record with inspection outcomes, tonnage and documentation scope.",
      },
      { property: "og:url", content: "/clients" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/clients" }],
  }),
  component: ClientsPage,
});

function ClientsPage() {
  const sectors = useMemo(() => ["All sectors", ...new Set(caseCards.map((c) => c.sector))], []);
  const [sector, setSector] = useState("All sectors");
  const filtered = sector === "All sectors" ? caseCards : caseCards.filter((c) => c.sector === sector);

  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Client trust feed" }]} />
        <div className="mt-6">
          <SectionHead as="h1"
            eyebrow="Proof of supply"
            title="Verified global client trust feed"
            intro="Industrial buyers do not buy star ratings — they buy an inspection record. Below is our dispatch history mapped to project sectors and destinations, with the documentation scope and the inspection outcome for each package. Client names are withheld under supply agreements; references are released on request under NDA."
          />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dispatchStats.map((s) => (
            <div key={s.label} className="surface-panel rounded-md p-6">
              <p className="font-display text-3xl font-semibold text-primary">{s.value}</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{s.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-card/30">
        <SectionHead
          eyebrow="Recent supply"
          title="Project snapshots"
          intro="Short-form anonymised case notes — sector, grade/product, order scale and inspection outcome. These entries are illustrative placeholders until confirmed project data is supplied."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {projectSnapshots.map((s) => (
            <article key={s.id} className="surface-panel flex flex-col rounded-md p-6">
              <p className="eyebrow">{s.sector}</p>
              <h3 className="mt-3 text-lg font-semibold leading-snug">{s.project}</h3>
              <dl className="mt-4 space-y-2 text-sm">
                {[
                  ["Product supplied", s.product],
                  ["Approximate order size", s.orderSize],
                  ["Inspection / certification outcome", s.outcome],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                    <dt className="w-44 shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {k}
                    </dt>
                    <dd className="text-muted-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead
          eyebrow="Dispatch records"
          title="Anonymised project case cards"
          intro="Filter by sector to see comparable packages, the certification scope requested and how the package cleared inspection."
        />

        <div className="mt-6 flex flex-wrap gap-2">
          {sectors.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSector(s)}
              className={`rounded-sm border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                sector === s
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {filtered.map((c) => (
            <article key={c.id} className="surface-panel flex flex-col rounded-md p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="eyebrow">{c.sector}</p>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {c.destination} · {c.year}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-snug">{c.scope}</h3>
              <dl className="mt-4 space-y-2 text-sm">
                {[
                  ["Material", c.material],
                  ["Dispatched weight", c.tonnage],
                  ["Documentation", c.documentation],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                    <dt className="w-40 shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {k}
                    </dt>
                    <dd className="text-muted-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-foreground">{c.outcome}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-card/40">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="Sector coverage" title="Where our material is installed" />
            <div className="mt-6 flex flex-wrap gap-2">
              {trustSectors.map((s) => (
                <span
                  key={s}
                  className="rounded-sm border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <SectionHead
              eyebrow="Inspection partners"
              title="Third-party agencies we are routinely witnessed by"
            />
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {inspectionAgencies.map((a) => (
                <div
                  key={a}
                  className="flex h-20 items-center justify-center rounded-md border border-border bg-background px-3 text-center font-display text-sm font-semibold tracking-wide text-muted-foreground"
                >
                  {a}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Inspection is arranged against the client's nominated agency. Agency names are listed as inspection
              partners we work with routinely and do not imply endorsement.
            </p>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Ask for a reference package in your sector"
        body="Tell us the service conditions and the specification, and we will share a comparable anonymised dossier along with the quotation."
      />
    </>
  );
}
