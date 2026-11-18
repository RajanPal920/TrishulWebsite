import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Breadcrumbs, Section, SectionHead, SpecTable } from "@/components/site/parts";
import { getRfqConfirmation } from "@/lib/rfq.functions";
import { downloadRfqAcknowledgement, type RfqAcknowledgement } from "@/lib/rfq-acknowledgement";
import { downloadRfqQuotation } from "@/lib/rfq-quotation";

interface ConfirmationSearch { token: string }

export const Route = createFileRoute("/rfq_/confirmation")({
  validateSearch: (search: Record<string, unknown>): ConfirmationSearch => ({ token: typeof search["token"] === "string" ? search["token"] : "" }),
  loaderDeps: ({ search }) => ({ token: search.token }),
  loader: ({ deps }) => getRfqConfirmation({ data: { token: deps.token } }),
  head: () => ({ meta: [
    { title: "RFQ Received | Trishul Metals & Alloys" },
    { name: "description", content: "Secure acknowledgement for a quotation request submitted to Trishul Metals & Alloys." },
    { property: "og:title", content: "RFQ Received | Trishul Metals & Alloys" },
    { property: "og:description", content: "Secure quotation request acknowledgement and submitted item summary." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  errorComponent: InvalidConfirmation,
  component: ConfirmationPage,
});

function InvalidConfirmation() {
  return <Section>
    <div className="mx-auto max-w-2xl surface-panel rounded-md p-8 text-center">
      <p className="eyebrow">Acknowledgement unavailable</p>
      <h1 className="mt-3 font-display text-3xl font-semibold">This confirmation link is invalid or unavailable.</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Check that the complete link was copied from your submission confirmation. For assistance, contact our quotation desk.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/rfq" className="rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Start a new enquiry</Link>
        <a href="mailto:contactustrishul@gmail.com" className="rounded-sm border border-primary/50 px-5 py-3 text-sm font-semibold text-primary">Email quotation desk</a>
      </div>
    </div>
  </Section>;
}

function ConfirmationPage() {
  const raw = Route.useLoaderData();
  const [downloading, setDownloading] = useState(false);
  const rfq: RfqAcknowledgement = {
    reference: raw.reference ?? "",
    createdAt: raw.created_at,
    company: raw.company,
    contactName: raw.contact_name,
    email: raw.email,
    phone: raw.phone,
    country: raw.country,
    projectName: raw.project_name,
    incoterm: raw.incoterm,
    deliveryPort: raw.delivery_port,
    targetLeadTime: raw.target_lead_time,
    message: raw.message,
    certification: raw.certification,
    testing: Array.isArray(raw.testing) ? raw.testing.filter((value): value is string => typeof value === "string") : [],
    items: Array.isArray(raw.items) ? raw.items as RfqAcknowledgement["items"] : [],
    attachments: Array.isArray(raw.attachments) ? raw.attachments as RfqAcknowledgement["attachments"] : [],
  };
  return <>
    <Section className="border-b border-border">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Request a quotation", to: "/rfq" }, { label: "Confirmation" }]} />
      <div className="mt-6"><SectionHead as="h1" eyebrow="Enquiry received" title={`Reference ${rfq.reference}`} intro="Your enquiry is securely recorded with our export desk. We will review the specification, availability, documentation scope and delivery basis before issuing commercial pricing." /></div>
    </Section>
    <Section>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-8">
          <SpecTable caption="Submitted line items" head={["Grade / material", "Product", "Size", "Class / schedule", "Facing", "Quantity"]} rows={rfq.items.map((item) => [item.material || "—", item.product || "—", [item.size, item.cutLength ? `Cut ${item.cutLength}` : ""].filter(Boolean).join(" · ") || "—", item.rating || "—", item.facing || "—", `${item.quantity || "—"} ${item.unit || "pcs"}`])} />
          <div className="surface-panel rounded-md p-6"><p className="eyebrow">Customer and delivery</p><dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">{[["Company", rfq.company], ["Contact", rfq.contactName], ["Email", rfq.email], ["Project", rfq.projectName || "—"], ["Delivery basis", [rfq.incoterm, rfq.deliveryPort].filter(Boolean).join(" · ") || "—"], ["Certification", rfq.certification || "—"]].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-foreground">{value}</dd></div>)}</dl></div>
          {rfq.attachments.length ? <div className="surface-panel rounded-md p-6"><p className="eyebrow">Files received ({rfq.attachments.length})</p><ul className="mt-4 space-y-2">{rfq.attachments.map((file) => <li key={file.name} className="truncate text-sm text-muted-foreground">{file.name}</li>)}</ul></div> : null}
        </div>
        <aside className="space-y-5"><div className="border-l-2 border-primary bg-primary/5 p-6"><p className="eyebrow">Commercial review</p><h2 className="mt-3 font-display text-xl font-semibold">Estimated landed cost</h2><p className="mt-2 text-primary">Pending specification review</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">The preliminary quotation is not a binding offer or price commitment.</p></div><button type="button" disabled={downloading} onClick={() => { setDownloading(true); void downloadRfqQuotation(rfq).finally(() => setDownloading(false)); }} className="w-full rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">{downloading ? "Preparing PDF…" : "Download quotation PDF"}</button><button type="button" disabled={downloading} onClick={() => { setDownloading(true); void downloadRfqAcknowledgement(rfq).finally(() => setDownloading(false)); }} className="w-full rounded-sm border border-primary/50 px-5 py-3 text-sm font-semibold text-primary disabled:opacity-50">Download acknowledgement PDF</button><Link to="/portal" className="block w-full rounded-sm border border-primary/50 px-5 py-3 text-center text-sm font-semibold text-primary hover:bg-primary/10">View customer dashboard</Link><Link to="/rfq" className="block text-center text-sm text-muted-foreground hover:text-primary">Submit another enquiry</Link></aside>
      </div>
    </Section>
  </>;
}