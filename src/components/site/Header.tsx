import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, User as UserIcon, Shield } from "lucide-react";
import { company, offices } from "@/data/company";
import { BrandLogo } from "@/components/site/BrandLogo";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  to: string;
  label: string;
  desc?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface IndustryColumn {
  title: string;
  items: { to: string; label: string }[];
}

export const industryColumns: IndustryColumn[] = [
  {
    title: "Oil, Gas & Offshore",
    items: [
      { to: "/industries/offshore-oil-and-gas", label: "Offshore Oil & Gas" },
      { to: "/industries/onshore-oil-and-gas", label: "Onshore Oil & Gas" },
      { to: "/industries/subsea-engineering", label: "Subsea Engineering" },
      { to: "/industries/refineries", label: "Refineries & Upgrading" },
      { to: "/industries/lng-plants", label: "LNG Plants & Terminals" },
      { to: "/industries/fpso-projects", label: "FPSO Piping Packages" },
    ],
  },
  {
    title: "Process & Chemicals",
    items: [
      { to: "/industries/chemical-processing", label: "Chemical Processing" },
      { to: "/industries/petrochemical-plants", label: "Petrochemical Plants" },
      { to: "/industries/fertilizer-plants", label: "Fertilizer Plants" },
      { to: "/industries/gas-processing", label: "Gas Processing" },
      { to: "/industries/pulp-and-paper", label: "Pulp & Paper" },
      { to: "/industries/sour-service-applications", label: "Sour Service Duty" },
    ],
  },
  {
    title: "Power & Energy",
    items: [
      { to: "/industries/power-generation", label: "Power Generation" },
      { to: "/industries/green-hydrogen", label: "Green Hydrogen & Ammonia" },
      { to: "/industries/carbon-capture", label: "Carbon Capture & Storage" },
      { to: "/industries/offshore-wind-and-renewables", label: "Offshore Wind & Renewables" },
      { to: "/industries/high-temperature-applications", label: "High-Temperature Systems" },
      { to: "/industries/heat-exchangers", label: "Heat Exchangers" },
    ],
  },
  {
    title: "Water, Marine & Tech",
    items: [
      { to: "/industries/desalination-plants", label: "Desalination Plants" },
      { to: "/industries/marine-and-shipbuilding", label: "Marine & Shipbuilding" },
      { to: "/industries/seawater-systems", label: "Seawater Systems" },
      { to: "/industries/water-and-wastewater", label: "Water & Wastewater" },
      { to: "/industries/data-centres-and-liquid-cooling", label: "Data Centres & Cooling" },
      { to: "/industries/semiconductor-fabs", label: "Semiconductor Fabs" },
    ],
  },
];

const productsMenu: NavGroup = {
  label: "Products & Supply",
  items: [
    { to: "/products", label: "Products catalogue", desc: "Flanges, fittings, pipes & structural sections" },
    { to: "/materials", label: "Materials & alloys", desc: "Nickel alloys, duplex, super duplex & stainless" },
    { to: "/stock", label: "Live warehouse stock", desc: "Ready facility inventory with allocations" },
    { to: "/processing", label: "Value-add processing", desc: "Cut-to-size, bevelling & custom machining" },
    { to: "/matrix", label: "Specification matrix", desc: "Grade × product ASTM/ASME cross-reference" },
  ],
};

const buyerToolsMenu: NavGroup = {
  label: "Buyer Tools",
  items: [
    { to: "/rfq", label: "Request for quote (RFQ)", desc: "Multi-line inquiry engine & BOQ / MTO import" },
    { to: "/planner", label: "Delivery planner", desc: "Milestone & reverse PO date calculator" },
    { to: "/trade-desk", label: "Export trade desk", desc: "HS code lookup, tariff stacks & 2026 trade measures" },
    { to: "/landed-cost", label: "Landed cost calculator", desc: "Multi-currency FOB, CIF, DDP export estimator" },
    { to: "/tools", label: "Engineering calculators", desc: "Pipe weight, flange ratings & pressure calculators" },
  ],
};

const industriesMenu: NavGroup = {
  label: "Industries",
  items: [
    { to: "/industries", label: "All 26 industries overview", desc: "Critical piping supply across 26 sectors" },
    { to: "/industries/offshore-oil-and-gas", label: "Offshore oil & gas", desc: "Upstream, subsea & platform piping" },
    { to: "/industries/data-centres-and-liquid-cooling", label: "Data centres & cooling", desc: "Direct-to-chip & immersion manifolds" },
    { to: "/industries/green-hydrogen", label: "Green hydrogen & ammonia", desc: "High-pressure H₂ embrittlement resistance" },
    { to: "/industries/power-generation", label: "Power generation", desc: "Thermal, combined cycle & energy piping" },
    { to: "/industries/chemical-processing", label: "Chemical & petrochemical", desc: "Corrosive acid & high-temp service" },
    { to: "/industries/marine-and-shipbuilding", label: "Marine & shipbuilding", desc: "Seawater cooling, ballast & hull piping" },
  ],
};

const knowledgeMenu: NavGroup = {
  label: "Knowledge",
  items: [
    { to: "/cad", label: "CAD & 2D drawing library", desc: "Download 3D STEP & 2D dimensional drawings" },
    { to: "/technical", label: "Technical centre", desc: "Metallurgy data, standards & corrosion guides" },
    { to: "/matrix", label: "Material cross-reference", desc: "Equivalent grades: ASTM, DIN, EN, ISO, UNS" },
    { to: "/processing", label: "Processing & tolerances", desc: "Bevel angles, cutting tolerances & testing" },
  ],
};

const companyMenu: NavGroup = {
  label: "Company",
  items: [
    { to: "/about", label: "About Trishul Metals", desc: "Leadership, facility, history & capabilities" },
    { to: "/quality", label: "Quality & compliance", desc: "ISO 9001:2015, EN 10204 3.1/3.2, TPI inspections" },
    { to: "/vendor-registration", label: "Vendor onboarding pack", desc: "GSTIN, IEC, PAN, bank details & terms" },
    { to: "/clients", label: "Track record & clients", desc: "Global supply history & verified project delivery" },
    { to: "/faq", label: "Frequently asked questions", desc: "Ordering, lead times, packing & payment FAQs" },
    { to: "/contact", label: "Contact & locations", desc: "Mumbai HQ & Kalamboli central warehouse" },
  ],
};

function DesktopDropdown({
  group,
  isOpen,
  onOpen,
  onClose,
}: {
  group: NavGroup;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpen();
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      onClose();
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => (isOpen ? onClose() : onOpen())}
        aria-expanded={isOpen}
        className={`flex items-center gap-1.5 py-1 text-xs font-medium transition-colors xl:text-sm whitespace-nowrap ${
          isOpen ? "text-primary" : "text-muted-foreground hover:text-primary"
        }`}
      >
        <span>{group.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        group.label === "Industries" ? (
          <div className="absolute left-1/2 -translate-x-1/2 top-full z-50 mt-2 w-[840px] rounded-md border border-border bg-card/98 p-5 shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="grid grid-cols-4 gap-4">
              {industryColumns.map((col) => (
                <div key={col.title}>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-primary font-semibold mb-2 pb-1 border-b border-border/60">
                    {col.title}
                  </p>
                  <ul className="space-y-1">
                    {col.items.map((item) => (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={onClose}
                          className="block rounded-sm px-2 py-1 text-xs text-foreground/85 transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Comprehensive CRA piping supply for 26 demanding sectors</span>
              <Link
                to="/industries"
                onClick={onClose}
                className="font-semibold text-primary hover:underline flex items-center gap-1"
              >
                View all 26 industries →
              </Link>
            </div>
          </div>
        ) : (
          <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-md border border-border bg-card/95 p-2 shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150">
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    activeProps={{ className: "bg-primary/10 text-primary font-semibold" }}
                    className="block rounded-sm px-3 py-2 text-xs transition-colors hover:bg-primary/10 hover:text-primary xl:text-sm"
                  >
                    <div className="font-medium text-foreground">{item.label}</div>
                    {item.desc && (
                      <div className="text-[11px] text-muted-foreground line-clamp-1">{item.desc}</div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      {/* Utility sub-bar for desktop */}
      <div className="hidden border-b border-border bg-card/50 md:block">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-2 md:px-10">
          <div className="flex flex-wrap items-center gap-6">
            {offices.map((o) => (
              <p
                key={o.id}
                className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
              >
                <span className="text-primary">{o.flag}</span> {o.city} — {o.role}
              </p>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <a
              href={`mailto:${company.exportEmail}`}
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:text-primary transition-colors"
            >
              {company.exportEmail}
            </a>
            <a
              href={company.phoneHref}
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary hover:underline"
            >
              {company.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 md:px-10 md:py-3">
        {/* Brand Logo - Made Prominent and Clean */}
        <Link
          to="/"
          className="shrink-0 flex items-center transition-opacity hover:opacity-95"
          aria-label="Trishul Metals & Alloys home"
        >
          <BrandLogo
            priority
            className="h-11 sm:h-14 md:h-16 lg:h-20 w-auto max-w-[210px] sm:max-w-[280px] lg:max-w-[320px] drop-shadow-sm"
          />
        </Link>

        {/* Desktop Navigation Links with Dropdown Groups */}
        <nav className="hidden items-center gap-3 min-[1180px]:flex xl:gap-5" aria-label="Main">
          {/* 1. Products & Supply Menu */}
          <DesktopDropdown
            group={productsMenu}
            isOpen={activeMenu === productsMenu.label}
            onOpen={() => setActiveMenu(productsMenu.label)}
            onClose={() => setActiveMenu(null)}
          />

          {/* 2. Buyer Tools Menu */}
          <DesktopDropdown
            group={buyerToolsMenu}
            isOpen={activeMenu === buyerToolsMenu.label}
            onOpen={() => setActiveMenu(buyerToolsMenu.label)}
            onClose={() => setActiveMenu(null)}
          />

          {/* 3. Industries Menu */}
          <DesktopDropdown
            group={industriesMenu}
            isOpen={activeMenu === industriesMenu.label}
            onOpen={() => setActiveMenu(industriesMenu.label)}
            onClose={() => setActiveMenu(null)}
          />

          {/* 4. Knowledge Menu */}
          <DesktopDropdown
            group={knowledgeMenu}
            isOpen={activeMenu === knowledgeMenu.label}
            onOpen={() => setActiveMenu(knowledgeMenu.label)}
            onClose={() => setActiveMenu(null)}
          />

          {/* 5. Company Menu */}
          <DesktopDropdown
            group={companyMenu}
            isOpen={activeMenu === companyMenu.label}
            onOpen={() => setActiveMenu(companyMenu.label)}
            onClose={() => setActiveMenu(null)}
          />

          {/* Direct Stock link with live badge */}
          <Link
            to="/stock"
            activeProps={{ className: "text-primary font-semibold" }}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary xl:text-sm whitespace-nowrap"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            Live stock
          </Link>
        </nav>

        {/* Action Buttons & Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
            <Link
              to="/portal"
              className="hidden min-[1180px]:inline-flex items-center gap-1.5 rounded-sm border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs xl:text-sm font-medium text-primary transition-colors hover:bg-primary/20 whitespace-nowrap"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Portal ({user.fullName?.split(" ")[0] || "Account"})</span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="hidden min-[1180px]:inline-flex rounded-sm border border-border px-3 py-1.5 text-xs xl:text-sm font-medium text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary whitespace-nowrap"
            >
              Customer login
            </Link>
          )}
          <Link
            to="/rfq"
            className="hidden min-[1180px]:inline-flex rounded-sm bg-primary px-3.5 sm:px-4 py-1.5 text-xs xl:text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-opacity hover:opacity-90 whitespace-nowrap"
          >
            Request quote
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle navigation"
            className="flex items-center gap-1.5 rounded-sm border border-border/80 bg-card/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-all hover:border-primary hover:text-primary active:scale-95 min-[1180px]:hidden"
          >
            {open ? (
              <>
                <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                <span>Close</span>
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
                <span>Menu</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open ? (
        <nav
          className="border-t border-border bg-card px-5 py-5 min-[1180px]:hidden animate-in fade-in-50 duration-150 max-h-[calc(100vh-80px)] overflow-y-auto"
          aria-label="Mobile"
        >
          <div className="space-y-5">
            {/* 1. Products & Supply Group */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">
                Products & Supply
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {productsMenu.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      activeProps={{ className: "text-primary font-semibold" }}
                      className="block py-1 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Buyer Tools Group */}
            <div className="border-t border-border/50 pt-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">
                Buyer Tools
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {buyerToolsMenu.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      activeProps={{ className: "text-primary font-semibold" }}
                      className="block py-1 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Industries Group */}
            <div className="border-t border-border/50 pt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">
                  Industries (26 Sectors)
                </p>
                <Link
                  to="/industries"
                  onClick={() => setOpen(false)}
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {industryColumns.map((col) => (
                  <div key={col.title} className="rounded border border-border/60 bg-background/50 p-2.5">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold mb-1.5">
                      {col.title}
                    </p>
                    <ul className="space-y-1">
                      {col.items.slice(0, 3).map((item) => (
                        <li key={item.to}>
                          <Link
                            to={item.to}
                            onClick={() => setOpen(false)}
                            className="block py-0.5 text-xs text-muted-foreground hover:text-primary"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Knowledge Group */}
            <div className="border-t border-border/50 pt-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">
                Knowledge
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {knowledgeMenu.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      activeProps={{ className: "text-primary font-semibold" }}
                      className="block py-1 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. Company Group */}
            <div className="border-t border-border/50 pt-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">
                Company & Contact
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {companyMenu.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      activeProps={{ className: "text-primary font-semibold" }}
                      className="block py-1 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/contact"
                    onClick={() => setOpen(false)}
                    activeProps={{ className: "text-primary font-semibold" }}
                    className="block py-1 text-xs sm:text-sm font-semibold text-primary hover:underline"
                  >
                    Contact Desk →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mobile Actions */}
            <div className="border-t border-border pt-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {user ? (
                  <Link
                    to="/portal"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center rounded-sm border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
                  >
                    Portal ({user.fullName?.split(" ")[0] || "Account"})
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center rounded-sm border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                  >
                    Customer login
                  </Link>
                )}
                <Link
                  to="/rfq"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Request quote
                </Link>
              </div>

              <div className="flex items-center justify-between pt-1 font-mono text-[11px] text-muted-foreground">
                <a href={company.phoneHref} className="text-primary hover:underline">
                  {company.phone}
                </a>
                <a
                  href={company.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline"
                >
                  WhatsApp Desk ↗
                </a>
              </div>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
