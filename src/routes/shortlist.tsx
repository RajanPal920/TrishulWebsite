import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHead, Breadcrumbs } from "@/components/site/parts";
import { useShortlist } from "@/lib/shortlist";
import { materialBySlug } from "@/data/materials";
import { downloadComparisonSheet } from "@/lib/datasheet";

export const Route = createFileRoute("/shortlist")({
  head: () => ({
    meta: [
      { title: "Shortlist & Compare Alloy Grades | Trishul Metals" },
      {
        name: "description",
        content:
          "Compare shortlisted alloy grades, products and technical sheets side by side, download a comparison PDF and send the selection straight to our quotation desk.",
      },
      { property: "og:title", content: "Shortlist & Compare | Trishul Metals & Alloys" },
      { property: "og:description", content: "Side-by-side comparison of shortlisted grades and products." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/shortlist" },
    ],
    links: [{ rel: "canonical", href: "/shortlist" }],
  }),
  component: ShortlistPage,
});

function ShortlistPage() {
  const { compareItems, favouriteItems, remove, clear } = useShortlist();

  const materials = compareItems
    .map((i) => (i.materialSlug ? materialBySlug(i.materialSlug) : undefined))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const rows = materials.length
    ? [
        { label: "UNS", values: materials.map((m) => m.uns) },
        { label: "Werkstoff", values: materials.map((m) => m.werkstoff ?? "—") },
        { label: "Family", values: materials.map((m) => m.family) },
        {
          label: "Tensile strength",
          values: materials.map(
            (m) => m.mechanical.find((r) => /tensile/i.test(r.label))?.value ?? "—",
          ),
        },
        {
          label: "Yield strength",
          values: materials.map((m) => m.mechanical.find((r) => /yield/i.test(r.label))?.value ?? "—"),
        },
        {
          label: "PREN",
          values: materials.map((m) => m.physical.find((r) => /PREN/i.test(r.label))?.value ?? "—"),
        },
        {
          label: "Density",
          values: materials.map((m) => m.physical.find((r) => /density/i.test(r.label))?.value ?? "—"),
        },
        { label: "Service limit", values: materials.map((m) => m.maxTemp ?? "—") },
      ]
    : [];

  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Shortlist" }]} />
        <div className="mt-6">
          <SectionHead as="h1"
            eyebrow="Shortlist"
            title="Compare and save your selection"
            intro="Grades, products and technical sheets you shortlist are kept in this browser. Compare them side by side, export a PDF, or send the whole list to our quotation desk."
          />
        </div>
      </Section>

      <Section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Compare ({compareItems.length})</h2>
          <div className="flex flex-wrap gap-3">
            {rows.length ? (
              <button
                type="button"
                onClick={() => downloadComparisonSheet(materials.map((m) => m.name), rows)}
                className="rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Download comparison PDF
              </button>
            ) : null}
            <Link
              to="/rfq"
              className="rounded-sm border border-primary/50 px-5 py-2.5 text-sm font-semibold text-primary"
            >
              Request quote for shortlist
            </Link>
            {compareItems.length || favouriteItems.length ? (
              <button
                type="button"
                onClick={clear}
                className="rounded-sm border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground"
              >
                Clear all
              </button>
            ) : null}
          </div>
        </div>

        {compareItems.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Nothing in compare yet — use “Add to compare” on any grade, product or material × product page.
          </p>
        ) : rows.length ? (
          <div className="surface-panel mt-8 overflow-x-auto rounded-md">
            <table className="spec-table">
              <thead>
                <tr>
                  <th>Property</th>
                  {materials.map((m) => (
                    <th key={m.slug}>{m.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label}>
                    <td>{r.label}</td>
                    {r.values.map((v, i) => (
                      <td key={i}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {compareItems.map((i) => (
              <li key={i.id} className="surface-panel flex items-center justify-between rounded-md p-4">
                <a href={i.href} className="text-sm font-semibold hover:text-primary">
                  {i.title}
                </a>
                <button type="button" onClick={() => remove(i.id)} className="text-xs text-muted-foreground">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section className="border-t border-border bg-card/30">
        <h2 className="text-2xl font-semibold">Saved items ({favouriteItems.length})</h2>
        {favouriteItems.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No saved items yet.</p>
        ) : (
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {favouriteItems.map((i) => (
              <li key={i.id} className="surface-panel flex items-center justify-between rounded-md p-4">
                <div>
                  <a href={i.href} className="text-sm font-semibold hover:text-primary">
                    {i.title}
                  </a>
                  {i.subtitle ? <p className="text-xs text-muted-foreground">{i.subtitle}</p> : null}
                </div>
                <button type="button" onClick={() => remove(i.id)} className="text-xs text-muted-foreground">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
