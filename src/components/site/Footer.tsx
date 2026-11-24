import { Link } from "@tanstack/react-router";
import { company, offices } from "@/data/company";
import { materials } from "@/data/materials";
import { BrandLogo } from "@/components/site/BrandLogo";

export function Footer() {
  const featured = materials.filter((m) => m.family !== "carbon").slice(0, 8);
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 md:px-10">
        <div>
          <BrandLogo className="w-[260px] sm:w-[290px] max-w-full" />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{company.tagline}</p>
          <div className="mt-5 space-y-5">
            {offices.map((o) => (
              <div key={o.id}>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                  {o.flag} · {o.city}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {o.role}
                </p>
                <address className="mt-2 not-italic text-sm leading-relaxed text-muted-foreground">
                  {o.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                <a href={`mailto:${o.email}`} className="mt-1 block text-sm text-primary">
                  {o.email}
                </a>
                <a href={o.phoneHref} className="text-sm text-primary">
                  {o.phone}
                </a>
                <a
                  href={o.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-muted-foreground hover:text-primary"
                >
                  View on Google Maps ↗
                </a>
                {o.visitNote ? (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{o.visitNote}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">CRA grades</p>
          <ul className="mt-4 space-y-2">
            {featured.map((m) => (
              <li key={m.slug}>
                <Link
                  to="/materials/$slug"
                  params={{ slug: m.slug }}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {m.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/materials" className="text-sm text-primary">
                All CRA grades →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Products</p>
          <ul className="mt-4 space-y-2">
            <li>
              <a href="/products#flanges" className="text-sm text-muted-foreground hover:text-primary">
                Flanges
              </a>
            </li>
            <li>
              <a href="/products#buttweld-fittings" className="text-sm text-muted-foreground hover:text-primary">
                Pipe Fittings
              </a>
            </li>
            <li>
              <Link to="/matrix" className="text-sm text-muted-foreground hover:text-primary">
                Grade × product directory
              </Link>
            </li>
            <li>
              <Link to="/technical" className="text-sm text-muted-foreground hover:text-primary">
                Technical knowledge centre
              </Link>
            </li>
            <li>
              <Link to="/industries" className="text-sm text-muted-foreground hover:text-primary">
                Industries served
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Company</p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
                About Trishul
              </Link>
            </li>
            <li>
              <Link to="/quality" className="text-sm text-muted-foreground hover:text-primary">
                Quality assurance
              </Link>
            </li>
            <li>
              <Link to="/vendor-registration" className="text-sm text-muted-foreground hover:text-primary">
                Vendor onboarding pack
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary">
                Procurement FAQ
              </Link>
            </li>
            <li>
              <Link to="/rfq" className="text-sm text-muted-foreground hover:text-primary">
                Request for quotation
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </li>
            <li>
              <a href={company.social.linkedin} className="text-sm text-muted-foreground hover:text-primary" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <Link to="/portal" className="text-sm text-muted-foreground hover:text-primary">
                Customer portal
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-5 py-6 md:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              © {new Date().getFullYear()} {company.legalName} · Grades supplied subject to availability and specification review
            </p>
            <p className="text-[11px] text-muted-foreground/80">
              A <strong className="text-foreground">Modi Group of Industries</strong> company · Alloyaage Products · Metalloys Inc · Trishul Metals & Alloys · Apex Polymer & Engineering
            </p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
            Mumbai &amp; Kalamboli, India
          </p>
        </div>
      </div>
    </footer>
  );
}
