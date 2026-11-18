import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Breadcrumbs, Section, SectionHead, SpecTable } from "@/components/site/parts";
import { company } from "@/data/company";
import {
  type PortalData,
  getCertificateDownload,
  getPortalData,
  updateMyProfile,
} from "@/lib/portal.functions";
import { downloadRfqAcknowledgement, type RfqAcknowledgement } from "@/lib/rfq-acknowledgement";
import { downloadRfqQuotation } from "@/lib/rfq-quotation";

export const Route = createFileRoute("/portal")({
  ssr: false,
  loader: async (): Promise<PortalData> => {
    try {
      return await getPortalData();
    } catch {
      return {
        email: "portal@trishulmetal.com",
        profile: {
          company: "Trishul Metals & Alloys Client",
          contact_name: "Customer",
          phone: "",
          country: "",
        },
        orders: [],
        lines: [],
        documents: [],
        rfqs: [],
      };
    }
  },
  head: () => ({
    meta: [
      { title: "Customer Dashboard — RFQs, Orders & Certificates | Trishul Metals" },
      { name: "description", content: "Trishul customer dashboard for quotation requests, order history, shipment details and certificates." },
      { property: "og:title", content: "Customer Dashboard | Trishul Metals & Alloys" },
      { property: "og:description", content: "Access to quotation requests, orders, shipment details and certificate records." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PortalPage,
});


function PortalPage() {
  const initial = Route.useLoaderData();
  const saveProfile = useServerFn(updateMyProfile);
  const downloadCertificate = useServerFn(getCertificateDownload);
  const [data, setData] = useState<PortalData>(initial);
  const [tab, setTab] = useState<"rfqs" | "orders" | "certificates" | "profile">("rfqs");
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const profile = data.profile;
  const rfqs = data.rfqs;
  const orders = data.orders;
  const docs = data.documents;

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    const form = new FormData(event.currentTarget);
    try {
      await saveProfile({
        data: {
          company: String(form.get("company") ?? ""),
          contactName: String(form.get("contactName") ?? ""),
          phone: String(form.get("phone") ?? ""),
          country: String(form.get("country") ?? ""),
        },
      });
      const refreshed = await getPortalData();
      setData(refreshed);
      setNotice("Company details saved.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The profile could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function openCertificate(id: string) {
    try {
      const result = await downloadCertificate({ data: { documentId: id } });
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The document is temporarily unavailable.");
    }
  }

  return (
    <>
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Customer dashboard" }]} />
        <div className="mt-6">
          <SectionHead
            as="h1"
            eyebrow="Customer access"
            title="RFQs, orders and certificates"
            intro="Review submitted enquiries, follow active orders and retrieve released documentation linked to your company."
          />
        </div>
      </Section>
      <Section>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="eyebrow">Customer portal</p>
            <p className="mt-2 break-all font-display text-xl font-semibold">Active enquiries &amp; orders</p>
          </div>
        </div>
        <div className="mt-6 flex max-w-full gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Customer records">
          {(
            [
              ["rfqs", `RFQs (${rfqs.length})`],
              ["orders", `Orders (${orders.length})`],
              ["certificates", `Certificates (${docs.length})`],
              ["profile", "Company profile"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => {
                setTab(key);
                setNotice(null);
              }}
              className={`shrink-0 rounded-sm border px-4 py-2 text-sm font-semibold ${
                tab === key ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {notice ? (
          <p className="mt-5 rounded-sm border border-primary/30 bg-primary/5 p-3 text-sm text-primary" role="status">
            {notice}
          </p>
        ) : null}

        {tab === "rfqs" ? (
          <div className="mt-8 space-y-5">
            {rfqs.length ? (
              rfqs.map((raw) => {
                const items = Array.isArray(raw.items) ? (raw.items as RfqAcknowledgement["items"]) : [];
                const attachments = Array.isArray(raw.attachments)
                  ? (raw.attachments as RfqAcknowledgement["attachments"])
                  : [];
                const testing = Array.isArray(raw.testing)
                  ? raw.testing.filter((item): item is string => typeof item === "string")
                  : [];
                const acknowledgement: RfqAcknowledgement = {
                  reference: raw.reference ?? "RFQ",
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
                  testing,
                  items,
                  attachments,
                };
                return (
                  <article key={raw.id} className="surface-panel rounded-md p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-xs uppercase text-primary">{raw.reference ?? "Submitted RFQ"}</p>
                        <h2 className="mt-2 text-xl font-semibold">{raw.project_name || raw.company}</h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Submitted {new Date(raw.created_at).toLocaleDateString("en-GB")} · Status: {raw.status}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void downloadRfqQuotation(acknowledgement)}
                          className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                        >
                          Download quotation
                        </button>
                        <button
                          type="button"
                          onClick={() => void downloadRfqAcknowledgement(acknowledgement)}
                          className="rounded-sm border border-primary/50 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/10"
                        >
                          Download acknowledgement
                        </button>
                      </div>
                    </div>
                    <div className="mt-5 overflow-x-auto">
                      <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="text-xs text-muted-foreground">
                          <tr>
                            <th className="pb-2">Grade</th>
                            <th className="pb-2">Product</th>
                            <th className="pb-2">Size</th>
                            <th className="pb-2">Class / schedule</th>
                            <th className="pb-2">Facing</th>
                            <th className="pb-2">Quantity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {items.map((item, index) => (
                            <tr key={`${raw.id}-${index}`}>
                              <td className="py-3 pr-4">{item.material || "—"}</td>
                              <td className="py-3 pr-4">{item.product || "—"}</td>
                              <td className="py-3 pr-4">{item.size || "—"}</td>
                              <td className="py-3 pr-4">{item.rating || "—"}</td>
                              <td className="py-3 pr-4">{item.facing || "—"}</td>
                              <td className="py-3">
                                {item.quantity || "—"} {item.unit || "pcs"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>
                );
              })
            ) : (
              <Empty
                title="No quotation requests yet"
                body="Submit an enquiry and it will appear here as soon as it is securely recorded."
                action={
                  <Link
                    to="/rfq"
                    className="inline-block rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                  >
                    Request a quotation
                  </Link>
                }
              />
            )}
          </div>
        ) : null}

        {tab === "orders" ? (
          <div className="mt-8 space-y-6">
            {orders.length ? (
              orders.map((order) => {
                const lines = data.lines.filter((line) => line.order_id === order.id);
                return (
                  <article key={order.id} className="surface-panel rounded-md p-5 sm:p-6">
                    <div className="flex flex-wrap justify-between gap-4">
                      <div>
                        <p className="font-mono text-xs uppercase text-primary">{order.po_number}</p>
                        <h2 className="mt-2 text-xl font-semibold">{order.project_name || "Order"}</h2>
                      </div>
                      <span className="rounded-sm border border-primary/40 px-3 py-1 text-xs uppercase text-primary">
                        {order.status.replaceAll("-", " ")}
                      </span>
                    </div>
                    <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
                      {[
                        ["Incoterm", order.incoterm || "—"],
                        ["Destination", order.destination_port || "—"],
                        ["ETA", order.eta || "To be confirmed"],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="text-muted-foreground">{label}</dt>
                          <dd className="mt-1">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    {lines.length ? (
                      <div className="mt-6">
                        <SpecTable
                          caption="Order lines and heat lineage"
                          head={["Description", "Size", "Quantity", "Heat reference"]}
                          rows={lines.map((line) => [
                            line.description,
                            line.size || "—",
                            `${line.quantity} ${line.unit}`,
                            line.heat_ref || "On dispatch",
                          ])}
                        />
                      </div>
                    ) : null}
                  </article>
                );
              })
            ) : (
              <Empty
                title="No orders linked yet"
                body={`Purchase orders will appear here once booked. Contact ${company.exportEmail} with a PO number if you expect records here.`}
              />
            )}
          </div>
        ) : null}

        {tab === "certificates" ? (
          <div className="mt-8 divide-y divide-border border-y border-border">
            {docs.length ? (
              docs.map((doc) => (
                <div key={doc.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase text-muted-foreground">
                      {doc.doc_type} · {doc.reference || "No reference"} · {doc.issued_on}
                    </p>
                  </div>
                  {doc.storage_path ? (
                    <button
                      type="button"
                      onClick={() => void openCertificate(doc.id)}
                      className="rounded-sm border border-primary/50 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/10"
                    >
                      Download secure copy
                    </button>
                  ) : (
                    <a
                      href={`mailto:${company.exportEmail}?subject=${encodeURIComponent(
                        `Certified copy request — ${doc.reference || doc.title}`,
                      )}`}
                      className="rounded-sm border border-primary/50 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/10"
                    >
                      Request certified copy
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="py-6 text-sm text-muted-foreground">Released certificates will appear here.</p>
            )}
          </div>
        ) : null}

        {tab === "profile" ? (
          <form onSubmit={save} className="mt-8 max-w-2xl surface-panel rounded-md p-6">
            <p className="eyebrow">Reusable company details</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <ProfileField label="Company" name="company" defaultValue={profile?.company || ""} required />
              <ProfileField
                label="Contact name"
                name="contactName"
                defaultValue={profile?.contact_name || ""}
                required
              />
              <ProfileField label="Phone / WhatsApp" name="phone" defaultValue={profile?.phone || ""} />
              <ProfileField label="Country" name="country" defaultValue={profile?.country || ""} />
            </div>
            <button
              disabled={busy}
              className="mt-6 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save company details"}
            </button>
          </form>
        ) : null}
      </Section>
    </>
  );
}

function ProfileField({
  label,
  name,
  defaultValue,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="eyebrow">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="motion-field mt-2 w-full rounded-sm border border-border bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}

function Empty({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="surface-panel rounded-md p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
