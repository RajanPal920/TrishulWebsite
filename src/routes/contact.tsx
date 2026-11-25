import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Section, SectionHead, Breadcrumbs, BulletList } from "@/components/site/parts";
import { company, offices } from "@/data/company";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

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
      { property: "og:url", content: "https://www.trishulmetal.com/contact" },
    ],
    links: [{ rel: "canonical", href: "https://www.trishulmetal.com/contact" }],
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
                <a className="text-primary font-medium" href={`mailto:${company.exportEmail}`}>
                  {company.exportEmail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Phone / WhatsApp</dt>
              <dd className="mt-1">
                <a className="text-primary font-medium" href={company.phoneHref}>
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
        <div className="surface-panel rounded-md p-6 space-y-6">
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">Send an Enquiry to the Technical Desk</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Direct connection to our Mumbai metallurgical engineers and export pricing desk.
            </p>
          </div>

          <ContactForm />

          <div className="border-t border-border/80 pt-4">
            <p className="eyebrow">Include with your enquiry</p>
            <div className="mt-3">
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

      {/* Modi Group Leadership & Entities */}
      <div className="mt-14 border-t border-border pt-12">
        <SectionHead
          eyebrow="Parent Organization"
          title="Modi Group of Industries"
          intro="Trishul Metals & Alloys operates within the Modi Group of Industries, backed by over three decades of metallurgical sourcing, manufacturing, and global procurement excellence."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Ramesh Modi Card */}
          <div className="surface-panel rounded-md border border-primary/40 bg-primary/5 p-6 space-y-3 md:col-span-2 lg:col-span-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold">
              Group Leadership
            </span>
            <h3 className="font-display text-xl font-bold text-foreground">
              Ramesh Modi
            </h3>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">
              Group Founder &amp; Principal
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              3 Decades of Metallurgy Industrial Excellence in Global Sourcing &amp; Manufacturing.
            </p>
            <div className="pt-2 space-y-1.5 text-xs font-mono">
              <div>
                <span className="text-muted-foreground">Direct Line: </span>
                <a href="tel:+919833358382" className="text-primary hover:underline font-semibold">
                  +91 98333 58382
                </a>
              </div>
              <div>
                <span className="text-muted-foreground">Desk: </span>
                <a href="mailto:alloyaageproduct@gmail.com" className="text-primary hover:underline">
                  alloyaageproduct@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Group Sister Companies Grid */}
          <div className="surface-panel rounded-md p-6 space-y-4 md:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Modi Group Operating Entities
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded border border-border/80 bg-background/50 p-3.5 space-y-1">
                <p className="text-xs font-bold text-foreground">Alloyaage Products</p>
                <p className="text-[11px] text-muted-foreground">Art of Alloying Metals &amp; Special Sourcing</p>
                <a href="mailto:alloyaageproduct@gmail.com" className="block text-xs font-mono text-primary hover:underline pt-1">
                  alloyaageproduct@gmail.com
                </a>
              </div>

              <div className="rounded border border-border/80 bg-background/50 p-3.5 space-y-1">
                <p className="text-xs font-bold text-foreground">Metalloys Inc</p>
                <p className="text-[11px] text-muted-foreground">Specialty Alloys &amp; Industrial Supplies</p>
                <a href="mailto:metalloysinc@gmail.com" className="block text-xs font-mono text-primary hover:underline pt-1">
                  metalloysinc@gmail.com
                </a>
              </div>

              <div className="rounded border border-primary/40 bg-primary/10 p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-foreground">Trishul Metals &amp; Alloys</p>
                  <span className="text-[9px] font-mono uppercase bg-primary text-primary-foreground px-1.5 py-0.5 rounded">You are here</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Corrosion-Resistant Alloy Piping Components &amp; Export Desk</p>
                <a href="mailto:export@trishulmetal.com" className="block text-xs font-mono text-primary hover:underline pt-1">
                  export@trishulmetal.com
                </a>
              </div>

              <div className="rounded border border-border/80 bg-background/50 p-3.5 space-y-1">
                <p className="text-xs font-bold text-foreground">Apex Polymer &amp; Engineering</p>
                <p className="text-[11px] text-muted-foreground">Connect With Flow — Industrial UPVC, CPVC &amp; SWR Piping</p>
                <a href="mailto:apexpolymereng@gmail.com" className="block text-xs font-mono text-primary hover:underline pt-1">
                  apexpolymereng@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }
    if (!message.trim()) {
      setError("Please include your inquiry details or component specification.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          company: companyName.trim() || undefined,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit enquiry. Please try again.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setCompanyName("");
      setMessage("");
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please reach out via email or phone directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-md border border-primary/40 bg-primary/10 p-5 space-y-2">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <CheckCircle2 className="h-5 w-5" />
          <span>Enquiry Received Successfully</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Thank you. Your message has been routed to our Mumbai metallurgical engineers and export desk. A technical specialist will review your specification and follow up promptly.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-2 text-xs font-semibold text-primary underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {error && (
        <div className="flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
            disabled={isSubmitting}
            className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Work Email <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. buyer@company.com"
            disabled={isSubmitting}
            className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Phone / Mobile
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +91 98200 12345"
            disabled={isSubmitting}
            className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Petro Engineering Ltd"
            disabled={isSubmitting}
            className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
          Inquiry / Material Details <span className="text-primary">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please describe the grade, product types, size, schedule/class, quantity, and certification scope (e.g. Inconel 625 flanges Class 300 to ASME B16.5 with 3.1 MTC)..."
          disabled={isSubmitting}
          className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded bg-primary py-2.5 px-4 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sending Enquiry...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Submit Technical Enquiry</span>
          </>
        )}
      </button>
    </form>
  );
}
