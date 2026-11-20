import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, Breadcrumbs, Eyebrow } from "@/components/site/parts";
import { company } from "@/data/company";

const title = "Terms of Service — Trishul Metals & Alloys";
const description =
  "The terms governing use of trishulmetal.com, including quotations and pricing, intellectual property, client portal accounts, export compliance and liability.";

const lastUpdated = "21-09-2026";

interface TermsSection {
  n: number;
  heading: string;
  paragraphs?: string[];
}

const termsSections: TermsSection[] = [
  {
    n: 1,
    heading: "Acceptance of terms",
    paragraphs: [
      "By accessing this website, submitting a request for quotation (RFQ), or creating a client portal account, you agree to these Terms of Service.",
    ],
  },
  {
    n: 2,
    heading: "About Trishul",
    paragraphs: [
      "Trishul Metals & Alloys is a Mumbai, India-based supplier and exporter of corrosion-resistant alloy (CRA) flanges, pipe fittings, and related components. This website provides product information, technical tools, and a request-for-quotation process.",
    ],
  },
  {
    n: 3,
    heading: "Quotations and pricing",
    paragraphs: [
      "Information generated through the equivalent grade finder, size selector, calculators, or landed-cost estimator is indicative and provided for planning purposes only. It does not constitute a binding offer. All quotations are subject to formal specification review, material availability, and confirmation in writing before an order is considered accepted. Pricing is subject to change without notice until formally confirmed in a quotation.",
    ],
  },
  {
    n: 4,
    heading: "Intellectual property",
    paragraphs: [
      "All content on this Site, including text, images, CAD/BIM models, and technical data, is the property of Trishul Metals & Alloys or its licensors. CAD and BIM files made available for download are provided for evaluation and design-integration purposes only and may not be redistributed, resold, or used for purposes other than evaluating or specifying Trishul products without our written permission.",
    ],
  },
  {
    n: 5,
    heading: "Client portal accounts",
    paragraphs: [
      "If you create a client portal account, you are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. Please notify us immediately of any unauthorized use.",
    ],
  },
  {
    n: 6,
    heading: "Export compliance",
    paragraphs: [
      "Buyers are responsible for ensuring their purchase and use of our products complies with all applicable export control, import, and trade sanctions laws in their jurisdiction and ours. Trishul reserves the right to decline, delay, or cancel any order where we reasonably believe it may violate applicable trade control or sanctions laws.",
    ],
  },
  {
    n: 7,
    heading: "Limitation of liability",
    paragraphs: [
      "Technical data, calculators, and tools on this Site are provided for reference and are not a substitute for a formal engineering review or confirmed quotation. To the fullest extent permitted by law, Trishul is not liable for any loss arising from reliance on preliminary information on this Site prior to formal order confirmation. Product warranties are governed by the terms of the applicable sales contract, not by these website Terms.",
    ],
  },
  {
    n: 8,
    heading: "Governing law",
    paragraphs: [
      "These Terms are governed by the laws of India, and any disputes arising from them are subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.",
    ],
  },
  {
    n: 9,
    heading: "Changes to these terms",
    paragraphs: [
      "We may update these Terms from time to time. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms.",
    ],
  },
];

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.trishulmetal.com/terms" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.trishulmetal.com/terms" }],
  }),
  component: TermsPage,
});

function TermsBlock({ section }: { section: TermsSection }) {
  return (
    <article className="scroll-reveal py-10 first:pt-0 last:pb-0">
      <div className="flex items-baseline gap-4">
        <span
          aria-hidden
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary"
        >
          {String(section.n).padStart(2, "0")}
        </span>
        <h2 className="text-xl font-semibold leading-snug md:text-2xl">{section.heading}</h2>
      </div>
      {section.paragraphs?.length ? (
        <div className="mt-4 space-y-4">
          {section.paragraphs.map((p, i) => (
            <p key={i} className="max-w-3xl text-base leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function TermsPage() {
  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Terms of Service" }]} />
        <div className="mt-6">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">Terms of Service</h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>
      </Section>

      <Section className="border-b border-border">
        <div className="divide-y divide-border">
          {termsSections.slice(0, 6).map((s) => (
            <TermsBlock key={s.n} section={s} />
          ))}
        </div>
      </Section>

      <Section className="border-b border-border bg-card/30">
        <div className="divide-y divide-border">
          {termsSections.slice(6).map((s) => (
            <TermsBlock key={s.n} section={s} />
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="scroll-reveal max-w-3xl">
          <div className="flex items-baseline gap-4">
            <span
              aria-hidden
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary"
            >
              10
            </span>
            <h2 className="text-xl font-semibold leading-snug md:text-2xl">Contact us</h2>
          </div>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Questions about these Terms can be sent to{" "}
            <a href={`mailto:${company.email}`} className="text-primary hover:underline">
              {company.email}
            </a>{" "}
            or the address listed on our Contact page.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="surface-panel rounded-md p-5">
              <p className="eyebrow">Email</p>
              <a
                href={`mailto:${company.email}`}
                className="mt-2 block text-sm text-primary hover:underline"
              >
                {company.email}
              </a>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{company.hours}</p>
            </div>
            <div className="surface-panel rounded-md p-5">
              <p className="eyebrow">Post</p>
              <address className="mt-2 not-italic text-sm leading-relaxed text-muted-foreground">
                {company.legalName}
                <br />
                {company.address.street}
                <br />
                {company.address.city}, {company.address.region} {company.address.postalCode}
                <br />
                {company.address.country}
              </address>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              to="/contact"
              className="inline-block text-sm font-semibold text-primary hover:underline"
            >
              Contact team →
            </Link>
            <Link
              to="/privacy"
              className="inline-block text-sm font-semibold text-primary hover:underline"
            >
              Privacy Policy →
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
