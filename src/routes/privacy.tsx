import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, Breadcrumbs, BulletList, Eyebrow } from "@/components/site/parts";
import { company } from "@/data/company";

const title = "Privacy Policy — Trishul Metals & Alloys";
const description =
  "How Trishul Metals & Alloys collects, uses, shares and protects personal data submitted through RFQ forms, the client portal and this website.";

const lastUpdated = "21-09-2026";

interface PrivacySection {
  n: number;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

const privacySections: PrivacySection[] = [
  {
    n: 1,
    heading: "Who we are",
    paragraphs: [
      `This Privacy Policy applies to trishulmetal.com and its subdomains (the "Site"), operated by Trishul Metals & Alloys ("Trishul," "we," "us"), Suite 206, 89/91 Durgadevi Street, Mumbai, Maharashtra 400004, India.`,
    ],
  },
  {
    n: 2,
    heading: "What personal data we collect",
    bullets: [
      "Contact and RFQ form data: name, company name, email address, phone number, and project/specification details you submit",
      "Client portal data: account credentials, order history, certificates issued to your account, and shipment tracking information",
      `Communications: any information you provide when contacting us or using the "Ask a metallurgist" feature`,
      "Automatically collected data: IP address, browser and device information, and cookies used for site functionality and analytics",
    ],
  },
  {
    n: 3,
    heading: "How we use your data",
    paragraphs: [
      "We process personal data to: respond to enquiries and prepare quotations; manage client portal accounts and order history; prepare export and shipping documentation as legally required; and improve our website and services. Where required by applicable law, we rely on your consent, the necessity of processing to perform a contract with you, or our legitimate business interests.",
    ],
  },
  {
    n: 4,
    heading: "Who we share data with",
    paragraphs: [
      "We may share limited data with: third-party inspection agencies (SGS, BV, Intertek, TUV, Lloyd's) where required for certification purposes; logistics and freight-forwarding partners to arrange shipment; and IT/hosting service providers who support this website. We do not sell personal data to third parties.",
    ],
  },
  {
    n: 5,
    heading: "International data transfers",
    paragraphs: [
      "As we serve customers globally and use international hosting infrastructure, your data may be processed outside your home country. Where this involves transferring data from the EU or UK, we take steps to ensure appropriate safeguards are in place.",
    ],
  },
  {
    n: 6,
    heading: "Data retention",
    paragraphs: [
      "We retain personal data for as long as necessary to fulfil the purposes described above, including any period required to meet legal, accounting, or export-documentation obligations.",
    ],
  },
  {
    n: 7,
    heading: "Your rights",
    paragraphs: [
      "Depending on your location, you may have rights to access, correct, delete, or object to the processing of your personal data, and to request a copy of it in a portable format. To exercise these rights, contact us using the details below.",
    ],
  },
  {
    n: 8,
    heading: "Cookies",
    paragraphs: [
      "We use cookies to operate the site and understand how it's used. You can control cookies through your browser settings.",
    ],
  },
  {
    n: 9,
    heading: "Security",
    paragraphs: [
      "We take reasonable technical and organizational measures to protect personal data against unauthorized access, loss, or misuse.",
    ],
  },
  {
    n: 10,
    heading: "Children's data",
    paragraphs: [
      "This Site is intended for business use and is not directed at children. We do not knowingly collect personal data from children.",
    ],
  },
  {
    n: 11,
    heading: "Changes to this policy",
    paragraphs: [
      `We may update this Privacy Policy from time to time. The "Last updated" date above reflects the most recent revision.`,
    ],
  },
];

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.trishulmetal.com/privacy" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.trishulmetal.com/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyBlock({ section }: { section: PrivacySection }) {
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
      {section.bullets?.length ? (
        <div className="mt-5 max-w-3xl">
          <BulletList items={section.bullets} />
        </div>
      ) : null}
    </article>
  );
}

function PrivacyPage() {
  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Privacy Policy" }]} />
        <div className="mt-6">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">Privacy Policy</h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>
      </Section>

      <Section className="border-b border-border">
        <div className="divide-y divide-border">
          {privacySections.slice(0, 6).map((s) => (
            <PrivacyBlock key={s.n} section={s} />
          ))}
        </div>
      </Section>

      <Section className="border-b border-border bg-card/30">
        <div className="divide-y divide-border">
          {privacySections.slice(6).map((s) => (
            <PrivacyBlock key={s.n} section={s} />
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
              12
            </span>
            <h2 className="text-xl font-semibold leading-snug md:text-2xl">Contact us</h2>
          </div>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            For privacy-related questions or to exercise your data rights, contact us at{" "}
            <a href={`mailto:${company.email}`} className="text-primary hover:underline">
              {company.email}
            </a>{" "}
            or write to the address above.
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
          <Link
            to="/contact"
            className="mt-6 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Contact team →
          </Link>
        </div>
      </Section>
    </>
  );
}
