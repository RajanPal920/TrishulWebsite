import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Ship,
  CheckCircle2,
  Download,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  FileText,
  Anchor,
  Truck,
  Building,
} from "lucide-react";
import { Section, SectionHead, Breadcrumbs } from "@/components/site/parts";
import { company } from "@/data/company";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Export Delivery & PO Schedule Planner | Trishul Metals & Alloys" },
      {
        name: "description",
        content:
          "Reverse schedule calculator for international project procurement: enter your required on-site date to calculate the latest PO release date across manufacturing, TPI, export packing, sailing and customs.",
      },
      { property: "og:title", content: "Export Delivery & PO Schedule Planner | Trishul Metals & Alloys" },
      {
        property: "og:description",
        content: "Milestone-by-milestone export lead time calculator with calendar (.ics) export and RFQ integration.",
      },
      { property: "og:url", content: `${company.siteUrl}/planner` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${company.siteUrl}/planner` }],
  }),
  component: DeliveryPlannerPage,
});

interface Milestone {
  id: string;
  title: string;
  durationDays: number;
  startDate: Date;
  endDate: Date;
  iconName: string;
  description: string;
}

const defaultOnSiteDate = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 90); // default 90 days out
  return d.toISOString().split("T")[0] || "";
};

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function DeliveryPlannerPage() {
  const navigate = useNavigate();

  // Planning Form State
  const [onSiteDateStr, setOnSiteDateStr] = useState<string>(defaultOnSiteDate());
  const [productType, setProductType] = useState<"ex-stock" | "standard" | "heavy-alloy" | "fabricated">("standard");
  const [tpiScope, setTpiScope] = useState<"standard-31" | "witness-32" | "special-ndt">("witness-32");
  const [destinationRegion, setDestinationRegion] = useState<"gcc" | "europe-suez" | "europe-cape" | "usa" | "apac" | "africa" | "air">("europe-cape");
  const [bufferDays, setBufferDays] = useState<number>(5);

  // Production lead time in calendar days
  const productionDays = useMemo(() => {
    switch (productType) {
      case "ex-stock":
        return 7; // Inspection, testing, cut & tag from ready stock
      case "standard":
        return 28; // 4 weeks for standard forged flanges & fittings
      case "heavy-alloy":
        return 49; // 7 weeks for special alloy (super duplex, Inconel 625/825)
      case "fabricated":
        return 35; // 5 weeks for custom spools, heavy wall pipe
      default:
        return 28;
    }
  }, [productType]);

  // TPI and certification lead time in calendar days
  const inspectionDays = useMemo(() => {
    switch (tpiScope) {
      case "standard-31":
        return 2; // Concurrent with final packing
      case "witness-32":
        return 7; // Agency call-out, witness testing, stamp & dossier
      case "special-ndt":
        return 12; // G48 pitting corrosion, Charpy at -46C, IGC Practice E
      default:
        return 7;
    }
  }, [tpiScope]);

  // Export packing and customs clearance at Nhava Sheva / Mumbai port
  const packingClearanceDays = 5;

  // Transit days by ocean / air route
  const transitDays = useMemo(() => {
    switch (destinationRegion) {
      case "gcc":
        return 8; // Nhava Sheva to Jebel Ali / Dammam
      case "europe-suez":
        return 24; // Via Suez Canal to Rotterdam / Antwerp
      case "europe-cape":
        return 38; // Via Cape of Good Hope (Current active maritime route)
      case "usa":
        return 34; // Via Atlantic to Houston / New York
      case "apac":
        return 14; // To Singapore / Port Klang / Melbourne
      case "africa":
        return 22; // To Lagos / Durban / Alexandria
      case "air":
        return 4; // International air freight door-to-door
      default:
        return 30;
    }
  }, [destinationRegion]);

  // Destination port clearance and inland haulage
  const destinationClearanceDays = 4;

  // Total required lead time in calendar days
  const totalDays = productionDays + inspectionDays + packingClearanceDays + transitDays + destinationClearanceDays + bufferDays;

  // Calculate milestone dates working BACKWARDS from the required on-site date
  const { milestones, latestPoDate, onSiteDate } = useMemo(() => {
    const targetOnSite = new Date(onSiteDateStr);
    if (isNaN(targetOnSite.getTime())) {
      const fallback = new Date();
      fallback.setDate(fallback.getDate() + 90);
      targetOnSite.setTime(fallback.getTime());
    }

    // 1. Destination Customs & Inland Haulage
    const customsEnd = new Date(targetOnSite);
    const customsStart = new Date(customsEnd);
    customsStart.setDate(customsStart.getDate() - (destinationClearanceDays + bufferDays));

    // 2. Ocean / Air Sailing Transit
    const sailingEnd = new Date(customsStart);
    const sailingStart = new Date(sailingEnd);
    sailingStart.setDate(sailingStart.getDate() - transitDays);

    // 3. Indian Export Clearance & Port Gate-In
    const exportEnd = new Date(sailingStart);
    const exportStart = new Date(exportEnd);
    exportStart.setDate(exportStart.getDate() - packingClearanceDays);

    // 4. Inspection, Testing & Dossier Release
    const tpiEnd = new Date(exportStart);
    const tpiStart = new Date(tpiEnd);
    tpiStart.setDate(tpiStart.getDate() - inspectionDays);

    // 5. Manufacturing / Processing / Stock Preparation
    const mfgEnd = new Date(tpiStart);
    const mfgStart = new Date(mfgEnd);
    mfgStart.setDate(mfgStart.getDate() - productionDays);

    const poDate = new Date(mfgStart);

    const list: Milestone[] = [
      {
        id: "po-release",
        title: "Latest Purchase Order (PO) & Advance / LC Issue",
        durationDays: 0,
        startDate: poDate,
        endDate: poDate,
        iconName: "FileText",
        description: "Latest date to finalize contractual scope, technical datasheets, and release order downpayment or confirmed letter of credit.",
      },
      {
        id: "manufacturing",
        title: "Manufacturing, Machining & Heat Treatment",
        durationDays: productionDays,
        startDate: mfgStart,
        endDate: mfgEnd,
        iconName: "Building",
        description: `Billet heating, forging, CNC finish-machining, solution annealing and dimensional QC inspection (${productionDays} days).`,
      },
      {
        id: "inspection",
        title: "TPI Witness Inspection & Certification Dossier",
        durationDays: inspectionDays,
        startDate: tpiStart,
        endDate: tpiEnd,
        iconName: "CheckCircle2",
        description: `Witnessed inspection hold points by SGS, BV, TUV or DNV, 100% PMI verification, and EN 10204 3.1/3.2 certificate compilation (${inspectionDays} days).`,
      },
      {
        id: "export-clearance",
        title: "ISPM-15 Export Packing & Nhava Sheva Customs",
        durationDays: packingClearanceDays,
        startDate: exportStart,
        endDate: exportEnd,
        iconName: "Truck",
        description: "Seaworthy fumigated plywood crating with VCI preservation, e-way bill generation, customs shipping bill filing, and port terminal gate-in (5 days).",
      },
      {
        id: "sailing",
        title: `Ocean Transit (${destinationRegion === "air" ? "Air Freight" : "Sea Vessel"})`,
        durationDays: transitDays,
        startDate: sailingStart,
        endDate: sailingEnd,
        iconName: "Ship",
        description:
          destinationRegion === "europe-cape"
            ? `Deep-sea voyage via Cape of Good Hope avoidance route to European hub port (${transitDays} days).`
            : destinationRegion === "europe-suez"
              ? `Direct transit via Suez Canal route (${transitDays} days).`
              : destinationRegion === "air"
                ? `Expedited scheduled air cargo flight (${transitDays} days).`
                : `Liner vessel voyage ex-Nhava Sheva to destination discharge port (${transitDays} days).`,
      },
      {
        id: "destination-delivery",
        title: "Destination Customs Clearance & Site Delivery",
        durationDays: destinationClearanceDays + bufferDays,
        startDate: customsStart,
        endDate: customsEnd,
        iconName: "Anchor",
        description: `Destination port terminal handling, import customs duty clearance, and final truck haulage to your project site or fabrication yard (${destinationClearanceDays + bufferDays} days including contingency buffer).`,
      },
      {
        id: "on-site",
        title: "Required On-Site Date",
        durationDays: 0,
        startDate: targetOnSite,
        endDate: targetOnSite,
        iconName: "Calendar",
        description: "Target delivery window at project destination.",
      },
    ];

    return { milestones: list, latestPoDate: poDate, onSiteDate: targetOnSite };
  }, [onSiteDateStr, productionDays, inspectionDays, packingClearanceDays, transitDays, destinationClearanceDays, bufferDays, destinationRegion]);

  const isPoInPast = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return latestPoDate < today;
  }, [latestPoDate]);

  // Generate downloadable iCalendar (.ics) file
  const handleDownloadCalendar = () => {
    let icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Trishul Metals & Alloys//Delivery Planner//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n";

    milestones.forEach((m) => {
      const dtStart = m.startDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const dtEnd = m.endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const summary = `[Trishul Procurement] ${m.title}`;
      const description = `${m.description} | Target On-Site: ${formatDate(onSiteDate)}`;

      icsContent += `BEGIN:VEVENT\r\nUID:${m.id}-${Date.now()}@trishulmetal.com\r\nDTSTAMP:${dtStart}\r\nDTSTART:${dtStart}\r\nDTEND:${dtEnd}\r\nSUMMARY:${summary}\r\nDESCRIPTION:${description}\r\nSTATUS:CONFIRMED\r\nEND:VEVENT\r\n`;
    });

    icsContent += "END:VCALENDAR\r\n";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Trishul-Delivery-Schedule-${onSiteDateStr}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Hand the calculated schedule over to the RFQ page
  const handleSendToRfq = () => {
    const leadTimeSummary = `${Math.ceil(totalDays / 7)} weeks (${totalDays} calendar days) — PO target: ${formatDate(latestPoDate)} for on-site delivery on ${formatDate(onSiteDate)}`;
    void navigate({
      to: "/rfq",
      search: {
        leadTime: leadTimeSummary,
        deliveryPort: destinationRegion.toUpperCase(),
      } as any,
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Buyer Tools", to: "/tools" }, { label: "Delivery Planner" }]} />
        <div className="mt-6">
          <SectionHead
            as="h1"
            eyebrow="Milestone Schedule Engine"
            title="Export Delivery & PO Schedule Planner"
            intro="Industrial projects cannot afford arbitrary lead times. Enter your required on-site delivery date to reverse-calculate the exact milestone timeline — from mill manufacturing and TPI witness testing through Cape/Suez maritime sailing and import clearance."
          />
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.9fr]">
          {/* Controls Column */}
          <div className="space-y-6">
            <div className="rounded-md border border-border bg-card p-6 shadow-sm">
              <h2 className="font-serif text-lg font-bold text-foreground">1. Project Parameters</h2>
              <p className="mt-1 text-xs text-muted-foreground">Configure your project requirements to calculate realistic delivery milestones.</p>

              <div className="mt-6 space-y-4">
                {/* On-Site Date */}
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Required On-Site Delivery Date *
                  </label>
                  <input
                    type="date"
                    value={onSiteDateStr}
                    onChange={(e) => setOnSiteDateStr(e.target.value)}
                    className="mt-1.5 w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                {/* Material / Production Scope */}
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Product Form &amp; Material Scope
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value as any)}
                    className="mt-1.5 w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="ex-stock">Ready Stock (Flanges, fittings, cut pipe in 316L, 2205) — 1 week</option>
                    <option value="standard">Standard Machined / Forged Package (ASME B16.5 / B16.9) — 4 weeks</option>
                    <option value="heavy-alloy">Special CRA / Heavy Wall (Super Duplex, Inconel 625/825, Hastelloy) — 7 weeks</option>
                    <option value="fabricated">Fabricated Spools &amp; Large Diameter Pipe (IS 3589 / A358) — 5 weeks</option>
                  </select>
                </div>

                {/* TPI & Testing Scope */}
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Inspection &amp; Quality Scope
                  </label>
                  <select
                    value={tpiScope}
                    onChange={(e) => setTpiScope(e.target.value as any)}
                    className="mt-1.5 w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="standard-31">EN 10204 3.1 Mill Test Certificate (Concurrent)</option>
                    <option value="witness-32">EN 10204 3.2 TPI Witness (SGS, BV, TUV, Lloyd's, DNV) — +7 days</option>
                    <option value="special-ndt">Special Corrosion Testing (ASTM G48 Method A / Impact at −46 °C) — +12 days</option>
                  </select>
                </div>

                {/* Ocean / Air Transit Route */}
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Destination &amp; Freight Route
                  </label>
                  <select
                    value={destinationRegion}
                    onChange={(e) => setDestinationRegion(e.target.value as any)}
                    className="mt-1.5 w-full rounded-sm border border-border bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="gcc">Middle East / GCC (Jebel Ali, Dammam, Hamad) — 8 days ocean</option>
                    <option value="europe-cape">Europe / UK (Via Cape of Good Hope — Current Route) — 38 days ocean</option>
                    <option value="europe-suez">Europe / UK (Via Suez Canal Route — Normalized) — 24 days ocean</option>
                    <option value="usa">Americas (Houston, New York, Los Angeles, Montreal) — 34 days ocean</option>
                    <option value="apac">Southeast Asia &amp; Australia (Singapore, Port Klang, Melbourne) — 14 days ocean</option>
                    <option value="africa">Africa (Lagos, Durban, Alexandria) — 22 days ocean</option>
                    <option value="air">Worldwide Priority Air Cargo — 4 days air</option>
                  </select>
                </div>

                {/* Contingency Buffer */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Contingency Buffer ({bufferDays} days)
                    </label>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    value={bufferDays}
                    onChange={(e) => setBufferDays(Number(e.target.value))}
                    className="mt-2 w-full accent-primary"
                  />
                  <div className="mt-1 flex justify-between text-[10px] font-mono text-muted-foreground">
                    <span>0 days (Strict)</span>
                    <span>5 days (Standard)</span>
                    <span>15 days (High Risk)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="rounded-md border border-border bg-card/60 p-6">
              <h3 className="text-sm font-semibold text-foreground">Schedule Actions</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Download this schedule to your corporate calendar or attach it directly to your formal RFQ.
              </p>

              <div className="mt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={handleDownloadCalendar}
                  className="flex w-full items-center justify-center gap-2 rounded-sm border border-primary/50 bg-primary/10 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
                >
                  <Download className="h-4 w-4" />
                  Export to Calendar (.ics)
                </button>
                <button
                  type="button"
                  onClick={handleSendToRfq}
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow transition hover:opacity-90"
                >
                  <span>Hand Schedule to RFQ Form</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="space-y-6">
            {/* Target PO Date Banner */}
            <div
              className={`rounded-md border p-6 shadow-md ${
                isPoInPast
                  ? "border-red-500/40 bg-red-500/10 text-red-300"
                  : "border-primary/40 bg-primary/10 text-primary"
              }`}
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
                    {isPoInPast ? "Critical Alert — Schedule Deficit" : "Calculated Procurement Deadline"}
                  </span>
                  <h3 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                    Latest PO Date: {formatDate(latestPoDate)}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Total cumulative lead time: <strong className="text-foreground">{totalDays} calendar days</strong> (~{Math.ceil(totalDays / 7)} weeks) to achieve on-site delivery on <strong className="text-foreground">{formatDate(onSiteDate)}</strong>.
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <span className="inline-block rounded border border-current px-3 py-1 font-mono text-xs font-bold uppercase">
                    {isPoInPast ? "Expedite Required" : "Feasible Schedule"}
                  </span>
                </div>
              </div>

              {isPoInPast ? (
                <div className="mt-4 flex items-center gap-2 border-t border-red-500/20 pt-3 text-xs text-red-400">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>
                    To hit this delivery date, immediate stock drawing or air freight will be necessary. Please discuss urgent options with our quotation desk.
                  </span>
                </div>
              ) : null}
            </div>

            {/* Visual Milestones Timeline */}
            <div className="rounded-md border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-base font-bold text-foreground">Procurement &amp; Logistics Timeline</h3>
                  <p className="text-xs text-muted-foreground">Milestone progression from order commitment to project laydown yard.</p>
                </div>
                <span className="font-mono text-xs text-primary">{milestones.length} Key Milestones</span>
              </div>

              <div className="relative mt-6 space-y-6 before:absolute before:bottom-3 before:left-4 before:top-3 before:w-0.5 before:bg-border">
                {milestones.map((m, index) => {
                  const isFirst = index === 0;
                  const isLast = index === milestones.length - 1;

                  return (
                    <div key={m.id} className="relative flex items-start gap-4 pl-2">
                      {/* Milestone Icon Node */}
                      <div
                        className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs shadow-sm ${
                          isFirst
                            ? "border-red-500 bg-red-500/20 text-red-400 font-bold"
                            : isLast
                              ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold"
                              : "border-primary bg-card text-primary"
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* Content Box */}
                      <div className="flex-1 rounded-sm border border-border bg-card/60 p-4 transition hover:border-primary/40">
                        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                          <h4 className="font-semibold text-foreground text-sm">{m.title}</h4>
                          <span className="font-mono text-xs font-bold text-primary">
                            {formatDate(m.startDate)}
                            {m.durationDays > 0 ? ` → ${formatDate(m.endDate)}` : ""}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
                        {m.durationDays > 0 ? (
                          <div className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3 text-primary" />
                            <span>Duration: {m.durationDays} calendar days</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technical Guidance Note */}
            <div className="rounded-md border border-border bg-muted/20 p-5 text-xs text-muted-foreground space-y-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                Planning Assumptions &amp; Maritime Routes
              </h4>
              <p>
                • <strong>Cape of Good Hope vs. Suez:</strong> Transit times to Europe and the UK reflect current maritime diversions via the Cape of Good Hope (~38 days). When normalized Suez canal operations resume, transit drops to 22–26 days.
              </p>
              <p>
                • <strong>Customs &amp; TPI:</strong> All export shipments from Nhava Sheva are cleared against pre-filed shipping bills with e-sealed containers. Third-party inspection call-out notices are issued 72 hours prior to scheduled testing.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
export default DeliveryPlannerPage;
