import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Section, SectionHead, Breadcrumbs, CtaBand, SpecTable } from "@/components/site/parts";
import {
  computeLanded,
  currencies,
  destPorts,
  formatMoney,
  incotermCodes,
  incotermScope,
  materialBands,
  type IncotermCode,
} from "@/data/landed";

export const Route = createFileRoute("/landed-cost")({
  head: () => ({
    meta: [
      { title: "Landed Cost & Incoterms Calculator — FOB, CIF, DDP in USD, EUR, AED | Trishul Metals" },
      {
        name: "description",
        content:
          "Estimate landed cost from Mumbai to Rotterdam, Houston, Jebel Ali, Singapore and 19 destination ports. Choose Incoterm (FOB, CFR, CIF, DAP, DDP), alloy band and currency for an instant preliminary projection before you raise the RFQ.",
      },
      { property: "og:title", content: "Multi-Currency Incoterms & Landed Cost Calculator | Trishul Metals" },
      {
        property: "og:description",
        content: "Instant FOB, CIF and DDP landed-cost projection in USD, EUR, GBP, AED, SAR, SGD or INR.",
      },
      { property: "og:url", content: "/landed-cost" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/landed-cost" }],
  }),
  component: LandedCostPage,
});

function LandedCostPage() {
  const [bandId, setBandId] = useState("sduplex");
  const [portId, setPortId] = useState("rotterdam");
  const [incoterm, setIncoterm] = useState<IncotermCode>("CIF");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [weight, setWeight] = useState(2500);
  const [documentation, setDocumentation] = useState(true);
  const [urgent, setUrgent] = useState(false);

  const band = materialBands.find((b) => b.id === bandId)!;
  const port = destPorts.find((p) => p.id === portId)!;
  const currency = currencies.find((c) => c.code === currencyCode)!;

  const result = useMemo(
    () => computeLanded({ weightKg: weight, band, port, incoterm, documentation, urgent }),
    [weight, band, port, incoterm, documentation, urgent],
  );

  const comparison = incotermCodes.map((code) => ({
    code,
    total: computeLanded({ weightKg: weight, band, port, incoterm: code, documentation, urgent }).totalUsd,
  }));

  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Landed cost calculator" }]} />
        <div className="mt-6">
          <SectionHead as="h1"
            eyebrow="Procurement planning"
            title="Multi-currency landed cost & Incoterms estimator"
            intro="Translate an ex-works Mumbai position into FOB, CFR, CIF, DAP or DDP at your destination port, in your own currency, without waiting a day for a freight quote. Use it to sanity-check budgets and compare terms before raising the formal enquiry."
          />
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-panel rounded-md p-6">
            <p className="eyebrow">Shipment parameters</p>

            <div className="mt-5 space-y-5">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Material band
                </label>
                <select
                  value={bandId}
                  onChange={(e) => setBandId(e.target.value)}
                  className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
                >
                  {materialBands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <span>Consignment weight</span>
                  <span className="text-primary">{weight.toLocaleString()} kg</span>
                </label>
                <input
                  type="range"
                  min={100}
                  max={30000}
                  step={100}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="mt-3 w-full accent-[var(--primary)]"
                />
                <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
                  <span>100 kg</span>
                  <span>30 t</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Destination port
                  </label>
                  <select
                    value={portId}
                    onChange={(e) => setPortId(e.target.value)}
                    className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
                  >
                    {["Middle East", "Europe", "Americas", "Asia Pacific", "Africa"].map((region) => (
                      <optgroup key={region} label={region}>
                        {destPorts
                          .filter((p) => p.region === region)
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}, {p.country}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Currency
                  </label>
                  <select
                    value={currencyCode}
                    onChange={(e) => setCurrencyCode(e.target.value)}
                    className="mt-2 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} — {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Incoterm 2020
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {incotermCodes.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setIncoterm(code)}
                      className={`rounded-sm border px-3 py-2 font-mono text-xs tracking-[0.12em] transition-colors ${
                        incoterm === code
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{incotermScope[incoterm]}</p>
              </div>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={documentation}
                    onChange={(e) => setDocumentation(e.target.checked)}
                    className="mt-1 accent-[var(--primary)]"
                  />
                  <span>Third-party inspection and EN 10204 3.2 certification (SGS / BV / Intertek / TUV)</span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={urgent}
                    onChange={(e) => setUrgent(e.target.checked)}
                    className="mt-1 accent-[var(--primary)]"
                  />
                  <span>Expedited shutdown routing (priority booking and premium sailing)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="surface-panel rounded-md p-6">
              <p className="eyebrow">
                Indicative {incoterm} {["EXW", "FOB"].includes(incoterm) ? "Mumbai" : port.name}
              </p>
              <p className="mt-3 font-display text-4xl font-semibold text-primary">
                {formatMoney(result.totalUsd, currency)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatMoney(result.perKgUsd, currency)} per kg · {weight.toLocaleString()} kg ·{" "}
                {result.transitDays} transit
              </p>
              {currency.code !== "USD" ? (
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Converted at 1 USD = {currency.perUsd} {currency.code} (indicative reference rate)
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/rfq"
                  className="rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Convert to firm quotation
                </Link>
                <Link
                  to="/stock"
                  className="rounded-sm border border-primary/50 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  Check ready stock
                </Link>
              </div>
            </div>

            <SpecTable
              caption="Cost build-up"
              head={["Cost element", "Basis", currency.code]}
              rows={[
                ...result.lines.map((l) => [l.label, l.note, formatMoney(l.usd, currency)]),
                ["Total", `${incoterm} ${["EXW", "FOB"].includes(incoterm) ? "Mumbai" : port.name}`, formatMoney(result.totalUsd, currency)],
              ]}
            />

            <SpecTable
              caption="Term comparison for this consignment"
              head={["Incoterm", "Scope", currency.code]}
              rows={comparison.map((c) => [c.code, incotermScope[c.code], formatMoney(c.total, currency)])}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              Figures are planning-grade indications built from recent freight, handling and alloy price ranges, not a
              contractual offer. Alloy surcharges, size-driven forging premiums, LME nickel movement, current sailing
              rates, war-risk surcharges and destination duty classification are confirmed in the formal quotation.
            </p>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Turn this projection into a firm, documented offer"
        body="Send the line list with grade, size, class and quantity — we return firm pricing on your chosen Incoterm with lead time, documentation scope and sailing options."
      />
    </>
  );
}
