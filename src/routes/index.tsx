import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHead, CardLink, BulletList } from "@/components/site/parts";
import { CtaBand } from "@/components/site/parts";
import { FacilityGallery } from "@/components/site/FacilityGallery";
import { GradeFinder } from "@/components/site/GradeFinder";
import { SubcomponentBento } from "@/components/site/SubcomponentBento";
import { HomeSourcingScope } from "@/components/site/HomeSourcingScope";
import { HomeHero } from "@/components/site/HomeHero";
import { TechIcon, type TechIconName } from "@/components/site/icons";
import { matrixCount } from "@/data/matrix";

import { company, credentials, trustPoints } from "@/data/company";
import { dispatchStats } from "@/data/clients";
import { materials } from "@/data/materials";
import { industries } from "@/data/industries";
import { familyLabel, type Family } from "@/data/types";
import catalogueStockRacks from "@/assets/home/stock-rack-study-1200.webp";
import catalogueExportPacking from "@/assets/home/export-packing-study-1200.webp";
import branchOutletFittings from "@/assets/products/branch-outlet-fittings.jpg";
import largeDiameterFlanges from "@/assets/products/large-diameter-flanges.jpg";
import weldedPipes from "@/assets/products/welded-pipes.jpg";
import seamlessPipes from "@/assets/products/seamless-pipes.jpg";
import socketWeldFittings from "@/assets/products/socket-weld-fittings.jpg";
import lowTemperaturePipes from "@/assets/products/low-temperature-pipes.jpg";
import heroPipeInventory1280 from "@/assets/editorial/hero-pipe-inventory-1280.webp.asset.json";
import heroPipeInventory2560 from "@/assets/editorial/hero-pipe-inventory-2560.webp.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "CRA Flanges & Fittings | Trishul Metals & Alloys",
      },
      {
        name: "description",
        content:
          "Mumbai-based exporter of Corrosion-Resistant Alloy (CRA) flanges & pipe fittings - Inconel, duplex, super duplex, stainless - to ASTM/ASME, EN 10204 3.1.",
      },
      {
        property: "og:title",
        content: "Corrosion-Resistant Alloy (CRA) Flanges & Fittings | Trishul Metals & Alloys",
      },
      {
        property: "og:description",
        content:
          "Mumbai-based exporter of Corrosion-Resistant Alloy (CRA) flanges & pipe fittings - Inconel, duplex, super duplex, stainless - to ASTM/ASME, EN 10204 3.1.",
      },
      { name: "twitter:description", content: "Mumbai-based exporter of Corrosion-Resistant Alloy (CRA) flanges & pipe fittings - Inconel, duplex, super duplex, stainless - to ASTM/ASME, EN 10204 3.1." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${company.siteUrl}${heroPipeInventory2560.url}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${company.siteUrl}${heroPipeInventory2560.url}` },
      { property: "og:url", content: "https://www.trishulmetal.com/" },
    ],
    links: [
      { rel: "canonical", href: "https://www.trishulmetal.com/" },
      {
        rel: "preload",
        as: "image",
        href: heroPipeInventory1280.url,
        imageSrcSet: `${heroPipeInventory1280.url} 1280w, ${heroPipeInventory2560.url} 2560w`,
        imageSizes: "100vw",
      },
    ],
  }),
  component: Home,
});

const craFamilies: Family[] = ["nickel", "duplex", "super-duplex"];

// Featured six on the homepage. Desalination replaces Onshore Oil & Gas as a
// more differentiated use case for duplex / super duplex grades; Onshore Oil &
// Gas remains in the full 20-industry list.
const featuredIndustrySlugs = [
  "offshore-oil-and-gas",
  "desalination-plants",
  "subsea-engineering",
  "refineries",
  "petrochemical-plants",
  "lng-plants",
];

const credentialBadgeLabels: Record<string, string> = {
  "iso-9001": "ISO 9001:2015",
  "iec-code": "Importer-Exporter Code (IEC)",
  "gst-certificate": "GST registered",
  "udyam-registration": "MSME / Udyam registered",
  "dpiit-recognition": "DPIIT Startup India recognised",
  "ciffa-certificate": "CIFFA-trained export desk",
};

const credentialBadges = credentials.flatMap((credential) => {
  if (!credential.documentKey) return [];
  const label = credentialBadgeLabels[credential.documentKey];
  return label ? [{ label, issuer: credential.issuer }] : [];
});

const trustPointIcons: Record<string, TechIconName> = {
  "Material Traceability": "traceability",
  "Specification Review": "specification",
  "Inspection Documentation": "inspection",
  "PMI & Testing Coordination": "testing",
  "Drawing-Based Components": "drawing",
  "Export Documentation": "export-docs",
};

const rfqResponseStat = dispatchStats.find((stat) => stat.label === "Median RFQ response");
const countriesServedStat = dispatchStats.find((stat) => stat.label === "Countries served");

function Home() {
  const stainlessList = materials.filter((m) => m.family === "stainless");

  return (
    <div className="home-image-system overflow-x-clip">
      <HomeHero />

      <Section className="bg-background">
        <SectionHead
          eyebrow="Corrosion-Resistant Alloy (CRA) Grades"
          title="From material grade to final documentation"
          intro="Every enquiry is reviewed against the governing specification before pricing, so deviations surface at RFQ stage rather than at inspection."
        />
        <div className="motion-stagger-grid mt-10 grid gap-4 md:grid-cols-3">
          {craFamilies.map((family) => {
            const list = materials.filter((m) => m.family === family);
            return (
              <CardLink
                key={family}
                to="/materials"
                eyebrow={`${list.length} grades`}
                title={familyLabel[family]}
                body={list
                  .slice(0, 4)
                  .map((m) => m.name)
                  .join(" · ")}
                interactive
              />
            );
          })}
        </div>
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Also Available — Supporting Grades
          </p>
          <div className="mt-3 border border-border bg-card/40 px-6 py-5">
            <Link
              to="/materials"
              className="group block"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    {stainlessList.length} grades
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
                    Stainless Steel
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground underline-offset-4 group-hover:underline">
                  View stainless grades →
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Standard austenitic stainless steel supplied alongside CRA grades for
                mixed-metallurgy builds and projects requiring a single-source supplier.
              </p>
              <p className="mt-2 text-xs text-[#EAEAEA]">
                {stainlessList.map((m) => m.name).join(" · ")}
              </p>
            </Link>
          </div>
        </div>
      </Section>



      <Section className="rule-grid border-t border-border bg-card/15">
        <SectionHead
          eyebrow="Engineering selection"
          title="Specified Against Failure Mode"
          intro="Material families matched to the environments that cause the most expensive in-service failures."
        />
        <div className="motion-stagger-grid mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardLink
            to="/materials/$slug"
            params={{ slug: "inconel-625" }}
            title="Sour Service (H2S)"
            body="Hydrogen sulfide environments require materials qualified under NACE MR0175 / ISO 15156 to resist sulfide stress cracking."
            tags={["Super Duplex", "Duplex", "Inconel 625"]}
          />
          <CardLink
            to="/materials/$slug"
            params={{ slug: "super-duplex-2507" }}
            title="Chloride Pitting & Stress-Corrosion Cracking"
            body="High-chloride environments — seawater, produced water, brine — attack standard stainless at welds and crevices first."
            tags={["Duplex", "Super Duplex"]}
          />
          <CardLink
            to="/materials/$slug"
            params={{ slug: "inconel-601" }}
            title="High-Temperature Oxidation"
            body="Sustained high-temperature service degrades standard alloys through scaling and creep."
            tags={["Inconel 601", "Inconel 617", "Inconel 690"]}
          />
          <CardLink
            to="/materials/$slug"
            params={{ slug: "stainless-steel-316" }}
            title="Cryogenic Service"
            body="LNG and cryogenic systems require materials that stay ductile and fracture-resistant at sub-zero temperatures."
            tags={["Stainless 304L/316L", "Nickel Alloys"]}
          />
        </div>
      </Section>

      <Section className="border-y border-border bg-card/35 shadow-elevated">
        <SectionHead
          eyebrow="Start here"
          title="Controlled size selector & equivalent grade finder"
          intro="Arrived with a European or Japanese designation? Cross-reference it to the grade we stock, lock the NPS, schedule, class and facing, and jump straight to the matching technical page."
        />
        <div className="mt-8">
          <GradeFinder />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/matrix"
            className="rounded-sm border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Browse every grade and product combination →
          </Link>
          <Link
            to="/faq"
            className="rounded-sm border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            20-point procurement FAQ →
          </Link>
        </div>
      </Section>

      <HomeSourcingScope />

      <SubcomponentBento />

      <Section className="border-t border-border bg-background">
        <SectionHead
          eyebrow="Buyer tools"
          title="Engineering calculators, landed cost, and instant MTO review"
          intro="Everything buyers and project engineers need to qualify material, verify landed tariffs, check inventory, and submit bills of materials."
        />
        <div className="motion-stagger-grid mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CardLink
            to="/stock"
            eyebrow="Live stock"
            title="Ready-stock lookup"
            body="Search what is physically held in our Mumbai warehouse by grade, product, size and specification, with heat references."
            interactive
          />
          <CardLink
            to="/rfq"
            eyebrow="Instant BOQ / MTO"
            title="Bill of materials upload"
            body="Paste or upload piping bills of quantities (.xlsx, .csv, copy-paste) for automatic item recognition and fast quotation."
            interactive
          />
          <CardLink
            to="/landed-cost"
            eyebrow="Tariffs & Incoterms"
            title="Landed cost estimator"
            body="Calculate CIF, CFR, DDP and Section 232 customs duty implications across 19 global destination ports."
            interactive
          />
          <CardLink
            to="/planner"
            eyebrow="Project schedule"
            title="Procurement planner"
            body="Interactive piping package builder with multi-grade scheduling, specification checks, and milestone tracking."
            interactive
          />
          <CardLink
            to="/trade-desk"
            eyebrow="Duty & Logistics"
            title="Trade desk & tariff schedules"
            body="Verified customs classification, HS codes, Section 232 steel rates, and destination country import documentation."
            interactive
          />
          <CardLink
            to="/vendor-registration"
            eyebrow="Audit & Compliance"
            title="Vendor registration pack"
            body="One-click download of GST, IEC, MSME, ISO 9001 and verified banking policy on corporate letterhead."
            interactive
          />
        </div>
      </Section>

      <Section className="rule-grid border-t border-border bg-card/15">
        <SectionHead
          eyebrow="Proof of operations"
          title="Racked stock, stamped material, documented dispatch"
          intro="Physical inventory in Mumbai with heat-number tagging, in-house export packing and a full certification dossier with every shipment."
        />
        <div className="mt-8">
          <FacilityGallery catalogueGrade />
        </div>
      </Section>





      <Section className="border-y border-border bg-card/30">
        <div className="grid min-w-0 gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch">
          <figure className="relative min-h-72 overflow-hidden border border-border shadow-elevated lg:min-h-full">
            <img src={catalogueStockRacks} alt="Heat-number tagged seamless alloy pipe bundles arranged on heavy-duty stock racks" loading="lazy" decoding="async" width={1200} height={900} className="home-catalogue-image absolute inset-0 h-full w-full object-cover opacity-80" />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 border-t border-primary/35 bg-background/75 px-5 py-4 backdrop-blur-sm">
              <p className="eyebrow">Physical stock · Heat traceability</p>
            </figcaption>
          </figure>
          <div className="min-w-0 py-2">
            <SectionHead eyebrow="Why Trishul" title="Procurement discipline, not catalogue selling" />
            <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
              {trustPoints.map((t, index) => (
                <div key={t.title} className={`border-t pt-5 ${index === 0 ? "border-primary" : "border-border"}`}>
                  <TechIcon
                    name={trustPointIcons[t.title] ?? "specification"}
                    className={`mb-3 ${index === 0 ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <h3 className="text-base font-semibold text-foreground">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-background">
        <SectionHead
          eyebrow="Industries"
          title="Specified for environments where failure is expensive"
        />
        <div className="motion-stagger-grid mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredIndustrySlugs.map((slug) => {
            const industry = industries.find((i) => i.slug === slug)!;
            const isDesalination = industry.slug === "desalination-plants";
            return (
              <CardLink
                key={industry.slug}
                to="/industries/$slug"
                params={{ slug: industry.slug }}
                title={isDesalination ? "Desalination & Seawater Systems" : industry.name}
                body={
                  isDesalination
                    ? "RO, MSF and MED plant piping specified in duplex and super duplex for chloride and pitting resistance"
                    : industry.tagline
                }
                image={industry.image}
                imageAlt={industry.imageAlt}
                interactive
              />
            );
          })}
        </div>
        <div className="mt-8">
          <Link to="/industries" className="text-sm font-semibold text-primary">
            All {industries.length} industry applications →
          </Link>
        </div>
      </Section>

      <Section className="rule-grid border-y border-border bg-card/30">
        <div className="grid min-w-0 gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-stretch">
          <div className="flex min-w-0 flex-col justify-between">
            <SectionHead
              eyebrow="Global supply"
              title="Export documentation handled in-house"
              intro="FOB, CFR, CIF and DDP shipments with commercial invoice, packing list, certificate of origin, MTC set and third-party release notes compiled per consignment."
            />
            <figure className="relative mt-8 min-h-56 overflow-hidden border-l-2 border-primary shadow-elevated md:flex-1">
              <img src={catalogueExportPacking} alt="Precision alloy piping components prepared for protected international export dispatch" loading="lazy" decoding="async" width={1200} height={900} className="home-catalogue-image absolute inset-0 h-full w-full object-cover opacity-75" />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-r from-background/15 to-background/65" />
            </figure>
          </div>
          <div className="border-t border-primary pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <BulletList items={["Enquiries reviewed against ASTM / ASME / NACE and applicable NORSOK M-630 requirements", "Materials available against applicable NORSOK M-630 Material Data Sheets, subject to grade, product form and manufacturer qualification", "Third-party inspection coordinated with SGS, BV, Intertek, TUV and Lloyd's", "PMI, ferrite count, impact and ASTM G48 testing arranged on request", "Marking to MSS SP-25 with heat numbers matched item by item to certificates"]} />
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="eyebrow">Where we export</p>
          <div className="motion-stagger-grid mt-5 grid min-w-0 gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            <article className="scroll-reveal min-w-0 bg-card/90 p-6 lg:p-8">
              <TechIcon name="offshore" className="mb-3 text-muted-foreground" />
              <p className="font-mono text-[11px] uppercase text-primary">Middle East &amp; GCC</p>
              <h3 className="mt-3 font-display text-xl font-semibold text-foreground">Qualification-ready for Gulf procurement</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Vendor-qualification-ready documentation against applicable NORSOK M-630 material requirements, NACE MR0175 / ISO 15156 compliance for defined sour-service conditions, and TPI-witnessed inspection where specified — suited to offshore, onshore oil and gas, petrochemical, and desalination procurement across the Gulf.
              </p>
            </article>

            <article className="scroll-reveal min-w-0 bg-background p-6 lg:p-8">
              <TechIcon name="standards" className="mb-3 text-muted-foreground" />
              <p className="font-mono text-[11px] uppercase text-primary">Europe</p>
              <h3 className="mt-3 font-display text-xl font-semibold text-foreground">Fluent across ASTM, ASME and EN</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Dual ASTM / ASME and EN standards fluency, EN 10204 3.1 certification, and heat-number-traceable documentation for buyers reviewing and diversifying their alloy and steel supplier base.
              </p>
            </article>

            <article className="scroll-reveal min-w-0 bg-background p-6 lg:p-8">
              <TechIcon name="verification" className="mb-3 text-muted-foreground" />
              <p className="font-mono text-[11px] uppercase text-primary">Africa</p>
              <h3 className="mt-3 font-display text-xl font-semibold text-foreground">Verification where it matters most</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Documentation and inspection rigor provide an important point of difference in markets where added verification matters most. Complete EN 10204 3.1 material test certificates and third-party inspection dossiers are supplied with every consignment.
              </p>
            </article>

            <article className="scroll-reveal min-w-0 border-l-2 border-primary bg-card/90 p-6 lg:p-8">
              <TechIcon name="globe" className="mb-3 text-primary" />
              <p className="font-mono text-[11px] uppercase text-primary">Worldwide</p>
              <h3 className="mt-3 font-display text-xl font-semibold text-foreground">Exports to the Middle East, Europe, Africa and Southeast Asia</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Direct exports and EPC-nominated supply across key energy, maritime and process corridors. The same documentation and inspection discipline is applied to every consignment, regardless of destination.
              </p>
            </article>
          </div>
        </div>
      </Section>

      <Section className="border-b border-border bg-background">
        <SectionHead
          eyebrow="Supply-chain diversification"
          title="A Reliable Partner as Global Buyers Diversify Their Supply Base"
          intro="As global buyers diversify sourcing beyond single-country dependency, Trishul provides documented, inspection-ready supply across nickel alloys, duplex, super duplex, stainless steel and carbon steel, alongside PVC piping manufactured by sister concern Apex Polymer & Engineering."
        />

        <ul aria-label="Business credentials" className="mt-10 grid border-y border-border sm:grid-cols-2 lg:grid-cols-3">
          {credentialBadges.map((credential) => (
            <li
              key={credential.label}
              title={credential.issuer}
              className="flex min-h-14 items-center border-b border-r border-border px-4 py-3 font-mono text-[11px] uppercase text-muted-foreground last:border-b-0 sm:odd:border-l sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
            >
              <span aria-hidden className="mr-3 h-1.5 w-1.5 shrink-0 bg-primary" />
              {credential.label}
            </li>
          ))}
        </ul>

        <div className="mt-10 grid border-t border-border md:grid-cols-3">
          <div className="border-b border-border py-7 md:border-b-0 md:border-r md:pr-8">
            <p className="eyebrow">Documentation transparency</p>
            <h3 className="mt-3 text-xl font-semibold">Evidence available before commitment</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Review a sample MTC before ordering. Supply is backed by heat-number-traceable EN 10204 documentation, with third-party inspection available for every consignment when specified.
            </p>
          </div>
          <div className="border-b border-border py-7 md:border-b-0 md:border-r md:px-8">
            <p className="eyebrow">Commercial ease</p>
            <h3 className="mt-3 text-xl font-semibold">Clear communication across borders</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              English-language business communication, specification review in writing, and established export handling under FOB, CFR, CIF and DDP Incoterms.
            </p>
          </div>
          <div className="py-7 md:pl-8">
            <p className="eyebrow">Responsive RFQs</p>
            <h3 className="mt-3 text-xl font-semibold">Fast specification review</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Every enquiry is reviewed against governing standards before quotation to prevent on-site discrepancies.
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-t border-border bg-background">
        <SectionHead
          eyebrow="Buyer platform"
          title="Tools that shorten the distance from specification to purchase order"
          intro="Everything an engineer or buyer needs before the enquiry is even raised — models, landed cost, live stock, proof of supply and a metallurgical desk that answers immediately."
        />
        <div className="motion-stagger-grid mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              to: "/cad",
              icon: "cad" as TechIconName,
              eyebrow: "CAD & BIM",
              title: "Download 3D and 2D component models",
              body: "Parametric STL solids and DXF blocks for ASME B16.5 flanges and B16.9 fittings in every size and class, with a part code for your bill of materials.",
            },
            {
              to: "/landed-cost",
              icon: "landed-cost" as TechIconName,
              eyebrow: "Landed cost",
              title: "Multi-currency Incoterms estimator",
              body: "FOB, CFR, CIF, DAP and DDP projections to 19 destination ports in USD, EUR, GBP, AED, SAR, SGD or INR — in seconds, not a day.",
            },
            {
              to: "/stock",
              icon: "stock" as TechIconName,
              eyebrow: "Live stock",
              title: "See what is physically ready today",
              body: "Search the Mumbai stockyard by grade, product, size and class with verified quantities and heat references.",
            },
            {
              to: "/clients",
              icon: "proof" as TechIconName,
              eyebrow: "Proof of supply",
              title: "Verified client trust feed",
              body: "Export track record across global energy, maritime and process projects, with complete EN 10204 3.1 certification and third-party inspection dossiers.",
            },
            {
              to: "/portal",
              icon: "portal" as TechIconName,
              eyebrow: "Repeat buyers",
              title: "Client portal & dossier vault",
              body: "Review submitted inquiries, track RFQ status, and access project documentation directly from your customer account.",
            },
            {
              to: "/tools",
              icon: "calculator" as TechIconName,
              eyebrow: "Calculators",
              title: "Pipe weight, pressure and flange class",
              body: "Barlow allowable pressure, alloy-density weight per metre, NPS and schedule lookup and unit conversion.",
            },
          ].map((c) => (
            <CardLink key={c.to} to={c.to} eyebrow={c.eyebrow} title={c.title} body={c.body} icon={<TechIcon name={c.icon} />} interactive />
          ))}
        </div>
      </Section>

      <CtaBand image={catalogueExportPacking} imageAlt="Precision alloy piping components prepared for protected export packing" />

    </div>
  );
}
