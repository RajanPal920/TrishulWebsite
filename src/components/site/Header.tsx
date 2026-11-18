import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { company, offices } from "@/data/company";
import { BrandLogo } from "@/components/site/BrandLogo";

interface NavItem {
  to: string;
  label: string;
  desc?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const productMenu: NavGroup = {
  label: "Products & Supply",
  items: [
    { to: "/products", label: "Products", desc: "Flanges, pipe fittings, pipes & tubes" },
    { to: "/materials", label: "Materials", desc: "Nickel alloys, duplex, super duplex & stainless" },
    { to: "/stock", label: "Live stock", desc: "Ready warehouse inventory in Kalamboli" },
    { to: "/processing", label: "Processing", desc: "Cut-to-size, bevelling & custom machining" },
    { to: "/matrix", label: "Directory", desc: "Grade × product specification matrix" },
  ],
};

const technicalMenu: NavGroup = {
  label: "Technical & Tools",
  items: [
    { to: "/cad", label: "CAD library", desc: "3D CAD models & 2D engineering drawings" },
    { to: "/technical", label: "Technical centre", desc: "Material data, standards & metallurgy" },
    { to: "/tools", label: "Calculation tools", desc: "Pipe weight & engineering calculators" },
    { to: "/landed-cost", label: "Landed cost", desc: "Export freight & landed cost estimator" },
  ],
};

const companyMenu: NavGroup = {
  label: "Company",
  items: [
    { to: "/quality", label: "Quality & testing", desc: "ISO 9001:2015, MTC 3.1/3.2 dossiers" },
    { to: "/industries", label: "Industries", desc: "Offshore, marine, chemical & desalination" },
    { to: "/clients", label: "Clients", desc: "Approved vendor track record & references" },
    { to: "/faq", label: "FAQ", desc: "Ordering, lead times & technical FAQs" },
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
      )}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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
        <nav className="hidden items-center gap-4 lg:flex xl:gap-6" aria-label="Main">
          {/* Products & Supply Menu */}
          <DesktopDropdown
            group={productMenu}
            isOpen={activeMenu === productMenu.label}
            onOpen={() => setActiveMenu(productMenu.label)}
            onClose={() => setActiveMenu(null)}
          />

          {/* Technical & Tools Menu */}
          <DesktopDropdown
            group={technicalMenu}
            isOpen={activeMenu === technicalMenu.label}
            onOpen={() => setActiveMenu(technicalMenu.label)}
            onClose={() => setActiveMenu(null)}
          />

          {/* Company Menu */}
          <DesktopDropdown
            group={companyMenu}
            isOpen={activeMenu === companyMenu.label}
            onOpen={() => setActiveMenu(companyMenu.label)}
            onClose={() => setActiveMenu(null)}
          />

          {/* Direct Stock link with badge */}
          <Link
            to="/stock"
            activeProps={{ className: "text-primary font-semibold" }}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary xl:text-sm whitespace-nowrap"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            Live stock
          </Link>

          {/* Direct Contact link */}
          <Link
            to="/contact"
            activeProps={{ className: "text-primary font-semibold" }}
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary xl:text-sm whitespace-nowrap"
          >
            Contact
          </Link>
        </nav>

        {/* Action Buttons & Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/auth"
            search={{ next: "/portal" }}
            className="hidden lg:inline-flex rounded-sm border border-border px-3 py-1.5 text-xs xl:text-sm font-medium text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary whitespace-nowrap"
          >
            Customer login
          </Link>
          <Link
            to="/rfq"
            className="hidden lg:inline-flex rounded-sm bg-primary px-3.5 sm:px-4 py-1.5 text-xs xl:text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-opacity hover:opacity-90 whitespace-nowrap"
          >
            Request quote
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle navigation"
            className="flex items-center gap-1.5 rounded-sm border border-border/80 bg-card/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-all hover:border-primary hover:text-primary active:scale-95 lg:hidden"
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
          className="border-t border-border bg-card px-5 py-5 lg:hidden animate-in fade-in-50 duration-150 max-h-[calc(100vh-80px)] overflow-y-auto"
          aria-label="Mobile"
        >
          <div className="space-y-5">
            {/* Products & Supply Group */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">
                Products & Supply
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {productMenu.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      activeProps={{ className: "text-primary font-semibold" }}
                      className="block py-1 text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical & Tools Group */}
            <div className="border-t border-border/50 pt-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">
                Technical & Tools
              </p>
              <ul className="grid grid-cols-2 gap-2">
                {technicalMenu.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      activeProps={{ className: "text-primary font-semibold" }}
                      className="block py-1 text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Group */}
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
                      className="block py-1 text-sm font-medium text-muted-foreground hover:text-primary"
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
                    className="block py-1 text-sm font-semibold text-primary hover:underline"
                  >
                    Contact Desk →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mobile Actions */}
            <div className="border-t border-border pt-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/auth"
                  search={{ next: "/portal" }}
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center rounded-sm border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  Customer login
                </Link>
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
