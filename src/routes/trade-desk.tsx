import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  TRADE_REVIEWED_ON,
  upcomingTradeDates,
  hsCodeDirectory,
  countryTradeProfiles,
  type HsCodeMapping,
  type CountryTradeProfile,
} from "@/data/trade";
import { Section, SectionHead, Breadcrumbs, CtaBand } from "@/components/site/parts";
import {
  Globe2,
  Calendar,
  Search,
  FileCheck2,
  ArrowRight,
  ShieldAlert,
  Scale,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/trade-desk")({
  head: () => ({
    meta: [
      {
        title: "Export Trade Desk — HS Codes, 2026 Tariffs & Trade Measures | Trishul Metals",
      },
      {
        name: "description",
        content:
          "Harmonized System (HS) code directory for flanges, pipe fittings, pipes and structural steel. Verified 2026 import tariff stacks, US Section 232, EU/UK CBAM regulations, and customs documentation requirements across 11 key export jurisdictions.",
      },
      {
        property: "og:title",
        content: "Export Trade Desk — HS Codes & Global Tariffs | Trishul Metals & Alloys",
      },
      {
        property: "og:description",
        content:
          "Cross-border piping procurement desk: HS 6-digit classification, Section 232, CBAM timelines, FOB/CIF valuation bases, and mandatory import documentation checklist.",
      },
      { property: "og:url", content: "https://www.trishulmetal.com/trade-desk" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.trishulmetal.com/trade-desk" }],
  }),
  component: TradeDeskPage,
});

function TradeDeskPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductFilter, setSelectedProductFilter] = useState("all");
  const countryKeys = useMemo(() => Object.keys(countryTradeProfiles), []);
  const [selectedCountryKey, setSelectedCountryKey] = useState("US");

  const productsList = useMemo(() => {
    const set = new Set<string>();
    hsCodeDirectory.forEach((item) => set.add(item.product));
    return ["all", ...Array.from(set)];
  }, []);

  const filteredHsCodes = useMemo(() => {
    return hsCodeDirectory.filter((item) => {
      const matchesProduct =
        selectedProductFilter === "all" || item.product === selectedProductFilter;
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        item.hsCode.toLowerCase().includes(term) ||
        item.product.toLowerCase().includes(term) ||
        item.materialFamily.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.sampleSpecs.toLowerCase().includes(term);
      return matchesProduct && matchesSearch;
    });
  }, [selectedProductFilter, searchTerm]);

  const activeCountry: CountryTradeProfile = useMemo(() => {
    return countryTradeProfiles[selectedCountryKey] || countryTradeProfiles["US"]!;
  }, [selectedCountryKey]);

  return (
    <>
      {/* Hero / Header Section */}
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Export Trade Desk" }]} />
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionHead
              as="h1"
              eyebrow="International Trade & Compliance"
              title="Global Export Trade Desk & Tariff Directory"
              intro="Precision HS code classification, country-specific tariff stacks, 2026 trade defence measures (Section 232 & CBAM), and customs documentation requirements for critical alloy piping components exported from Mumbai, India."
            />
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs text-primary">
            <Calendar className="h-4 w-4" />
            <span>Reviewed & Audited: <strong>{TRADE_REVIEWED_ON}</strong></span>
          </div>
        </div>
      </Section>

      {/* Upcoming Trade Dates Notice Banner */}
      <Section className="py-8 bg-card/40 border-b border-border">
        <div>
          <div className="mb-4 flex items-center gap-2 text-xs font-mono tracking-wider text-muted-foreground uppercase">
            <Globe2 className="h-4 w-4 text-primary" />
            <span>Key Regulatory & Logistics Milestones (2026–2027)</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {upcomingTradeDates.map((item, idx) => (
              <div
                key={idx}
                className="surface-panel rounded-md p-5 border border-border/80 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-primary">{item.date}</span>
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] uppercase font-mono text-primary">
                    Measure
                  </span>
                </div>
                <h2 className="mt-2 text-sm font-semibold text-foreground">{item.measure}</h2>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 1: HS Code Directory */}
      <Section className="border-b border-border">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow">Harmonized Tariff Schedule</p>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              HS 6-Digit Product Classification Directory
            </h2>
            <p className="mt-1 text-xs text-muted-foreground max-w-2xl">
              Standard 6-digit Harmonized System codes accepted by customs authorities across the US (HTS), EU (TARIC), UK, GCC, and Commonwealth nations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search HS code, ASTM spec, alloy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <select
              value={selectedProductFilter}
              onChange={(e) => setSelectedProductFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              {productsList.map((prod) => (
                <option key={prod} value={prod}>
                  {prod === "all" ? "All Product Categories" : prod}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* HS Codes Table */}
        <div className="mt-6 overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-mono text-[11px] text-muted-foreground uppercase">
                <th className="py-3 px-4">HS Code</th>
                <th className="py-3 px-4">Product Category</th>
                <th className="py-3 px-4">Material Family</th>
                <th className="py-3 px-4">Harmonized Description</th>
                <th className="py-3 px-4">Sample Specifications</th>
                <th className="py-3 px-4 text-right">Inquiry Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredHsCodes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No matching HS code classifications found. Try a different search term or category.
                  </td>
                </tr>
              ) : (
                filteredHsCodes.map((item: HsCodeMapping, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary whitespace-nowrap">
                      {item.hsCode}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-foreground whitespace-nowrap">
                      {item.product}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {item.materialFamily}
                    </td>
                    <td className="py-3.5 px-4 text-foreground/90 max-w-xs sm:max-w-md">
                      {item.description}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground max-w-xs">
                      {item.sampleSpecs}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        to="/rfq"
                        search={{
                          product: item.product,
                          note: `HS Code: ${item.hsCode} (${item.materialFamily})`,
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                      >
                        <span>RFQ</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 2: Country Tariff Stacks & Regulatory Measures */}
      <Section className="border-b border-border">
        <div className="mb-6">
          <p className="eyebrow">Import Tariffs & Trade Measures</p>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Country-by-Country Import Tariff Stacks & Compliance
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Explore duty structures, carbon border adjustment taxes, Section 232 impacts, and customs valuation rules across 11 key export destinations.
          </p>
        </div>

        {/* Country Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          {countryKeys.map((key) => {
            const profile = countryTradeProfiles[key]!;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCountryKey(key)}
                className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  selectedCountryKey === key
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {profile.country}
              </button>
            );
          })}
        </div>

        {/* Selected Country Breakdown */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="surface-panel rounded-md p-6 border border-border">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="font-mono text-xs uppercase text-primary tracking-wider">
                    Export Destination Profile ({activeCountry.region})
                  </span>
                  <h3 className="text-xl font-bold text-foreground mt-0.5">
                    {activeCountry.country}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground block">Valuation Basis</span>
                  <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-primary">
                    <Scale className="h-3.5 w-3.5" />
                    {activeCountry.valuationBasis}
                  </span>
                </div>
              </div>

              {/* Duty & Trade Measures Summary */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-border/80 bg-background/50 p-4">
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    Standard Base Duty Rate
                  </span>
                  <div className="mt-1 text-base font-bold text-foreground">
                    {activeCountry.baseDutyRate}
                  </div>
                  <span className="mt-1 text-[11px] text-muted-foreground block">
                    Assessed on {activeCountry.valuationBasis} value
                  </span>
                </div>

                <div className="rounded-md border border-border/80 bg-background/50 p-4">
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    FTA / Trade Framework
                  </span>
                  <div className="mt-1 text-xs font-semibold text-primary leading-snug">
                    {activeCountry.ftaStatus}
                  </div>
                </div>
              </div>

              {/* Active Measures List */}
              <div className="mt-5 space-y-2">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                  Applicable 2026 Trade Defence Measures
                </h4>
                <ul className="space-y-2">
                  {activeCountry.tradeMeasures.map((measure, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-foreground/90 bg-muted/20 p-2.5 rounded border border-border/60">
                      <ShieldAlert className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Regulatory Note */}
              {activeCountry.notes && (
                <div className="mt-5 rounded-md border border-border bg-card p-4">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                    Customs Valuation & Port Advisory
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {activeCountry.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Mandatory Customs Documentation Checklist */}
          <div>
            <div className="surface-panel rounded-md p-6 border border-border h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <FileCheck2 className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-foreground">
                    Mandatory Import Documentation Checklist
                  </h3>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Trishul Metals & Alloys prepares and executes the complete export dossier to satisfy customs clearance in {activeCountry.country}:
                </p>

                <ul className="mt-4 space-y-3">
                  {activeCountry.requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-border space-y-3">
                <Link
                  to="/landed-cost"
                  className="w-full flex items-center justify-center gap-2 rounded-md border border-border bg-background py-2.5 text-xs font-semibold text-foreground hover:border-primary/50 transition-colors"
                >
                  <span>Model Landed Cost for {activeCountry.country}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  to={"/planner" as any}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <span>Calculate Required PO Date (Planner)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Band */}
      <CtaBand
        title="Need tariff optimization, duty drawback verification, or custom MTO classification?"
        body="Our export documentation and trade desk reviews project bills of materials against local tariff rulings, preferential trade agreements, and bilateral exemptions."
      />
    </>
  );
}
