import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHead, Breadcrumbs, BulletList } from "@/components/site/parts";
import { company, offices } from "@/data/company";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Trishul Metals — Mumbai Headquarters" },
      {
        name: "description",
        content:
          "Reach the Mumbai operational headquarters for Corrosion-Resistant Alloy (CRA) flange, fitting and pipe enquiries — nickel alloy, duplex, super duplex and stainless — with pricing and documentation.",
      },
      { property: "og:title", content: "Contact | Trishul Metals & Alloys" },
      { property: "og:description", content: "Mumbai headquarters — email, phone and enquiry details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <Section>
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Contact" }]} />
      <div className="mt-6 grid gap-12 md:grid-cols-2">
        <div>
          <SectionHead as="h1"
            eyebrow="Contact"
            title="Talk to the technical desk"
            intro="Send your specification, drawing or line list and we will respond with pricing, lead time and the documentation scope."
          />
          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="eyebrow">Email</dt>
              <dd className="mt-1">
                <a className="text-primary" href={`mailto:${company.email}`}>
                  {company.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Phone / WhatsApp</dt>
              <dd className="mt-1">
                <a className="text-primary" href={company.phoneHref}>
                  {company.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Office</dt>
              <dd className="mt-1 text-muted-foreground">{company.addressLine}</dd>
            </div>
            <div>
              <dt className="eyebrow">Warehouse</dt>
              <dd className="mt-1 text-muted-foreground">{company.warehouseLine}</dd>
            </div>
            <div>
              <dt className="eyebrow">Hours</dt>
              <dd className="mt-1 text-muted-foreground">{company.hours}</dd>
            </div>
          </dl>
        </div>
        <div className="surface-panel rounded-md p-6">
          <p className="eyebrow">Include with your enquiry</p>
          <div className="mt-4">
            <BulletList
              items={[
                "Grade and UNS number, or the service conditions if unspecified",
                "Product type, size range, schedule or thickness",
                "Pressure class, facing and bore requirements",
                "Governing standards and any project specification numbers",
                "Test and certification scope, quantity and delivery terms",
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-14 border-t border-border pt-12">
        <SectionHead
          eyebrow="Our offices"
          title="One desk, one accountable supply chain"
          intro="Enquiries, documentation and despatch are run from our Mumbai office, while ready stock, cutting, inspection and export packing are held at our Kalamboli warehouse, with export shipments handled out of Nhava Sheva and Mundra for buyers worldwide."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {offices.map((o) => (
            <div key={o.id} className="surface-panel rounded-md p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                {o.flag} · {o.country}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold">{o.city}</h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {o.role}
              </p>
              <address className="mt-4 not-italic text-sm leading-relaxed text-muted-foreground">
                {o.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{o.covers}</p>
              <div className="mt-4 space-y-1 text-sm">
                <a className="block text-primary" href={`mailto:${o.email}`}>
                  {o.email}
                </a>
                <a className="block text-primary" href={o.phoneHref}>
                  {o.phone}
                </a>
                <p className="text-muted-foreground">{o.hours}</p>
                <a
                  className="inline-block pt-1 text-primary hover:underline"
                  href={o.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Google Maps ↗
                </a>
                {o.visitNote ? (
                  <p className="pt-1 text-xs leading-relaxed text-muted-foreground">{o.visitNote}</p>
                ) : null}
              </div>

              {/* Embedded Google Map according to office address */}
              <div className="mt-5 overflow-hidden rounded-sm border border-border bg-card/60 shadow-inner">
                <iframe
                  title={`Map location for Trishul Metals ${o.city} ${o.role}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    o.lines.join(", ")
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="h-56 w-full border-0 grayscale-[20%] contrast-105"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
