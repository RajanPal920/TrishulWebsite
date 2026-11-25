import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Section, SectionHead, Breadcrumbs, CtaBand } from "@/components/site/parts";
import { company, offices, credentials } from "@/data/company";
import {
  Building2,
  Copy,
  Check,
  Download,
  FileText,
  ShieldCheck,
  CreditCard,
  Truck,
  MapPin,
  Mail,
  Phone,
  Eye,
  ExternalLink,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/vendor-registration")({
  head: () => ({
    meta: [
      {
        title: "Vendor Registration & Supplier Onboarding Pack | Trishul Metals & Alloys",
      },
      {
        name: "description",
        content:
          "Official supplier profile, tax registrations (GSTIN, IEC, PAN), ISO 9001:2015 certification, bank remittance details, and standard Incoterms for procurement teams onboarding Trishul Metals & Alloys.",
      },
      {
        property: "og:title",
        content: "Vendor Registration & Supplier Onboarding Profile | Trishul Metals",
      },
      {
        property: "og:description",
        content:
          "Complete ERP vendor registration pack: GSTIN 27AAYFT9507B1ZP, IEC AAYFT9507B, ISO 9001:2015, banking wire details, and downloadable compliance dossiers.",
      },
      { property: "og:url", content: "https://www.trishulmetal.com/vendor-registration" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.trishulmetal.com/vendor-registration" }],
  }),
  component: VendorRegistrationPage,
});

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/60 p-3">
      <div className="min-w-0">
        <span className="block text-[11px] font-mono uppercase text-muted-foreground">{label}</span>
        <span className="block font-mono text-xs font-semibold text-foreground truncate">{value}</span>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
        className="inline-flex shrink-0 items-center gap-1 rounded border border-border bg-card px-2 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 text-emerald-400" />
            <span className="text-emerald-400">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
}

function VendorRegistrationPage() {
  const [copiedAll, setCopiedAll] = useState(false);

  const fullProfileText = `VENDOR ONBOARDING SUMMARY — TRISHUL METALS & ALLOYS
Legal Entity Name: Trishul Metals & Alloys
Constitution: Partnership firm
Parent Group: Modi Group of Industries
Group Founder & Principal: Ramesh Modi
Headquarters: Suite 206, 89/91 Durgadevi Street, Mumbai, Maharashtra 400004, India
Central Warehouse: Plot No. 1818, Road No. 23, Kalamboli Warehouse Complex (KWC), Kalamboli, Navi Mumbai 410218, India
GSTIN: 27AAYFT9507B1ZP
IEC (DGFT India): AAYFT9507B
Income Tax PAN: AAYFT9507B
MSME / Udyam: UDYAM-MH-19-0404041
DPIIT Startup India ID: DIPP243391
ISO 9001:2015 Cert No.: 26MEQXH09 (Magnitude Management Services / EGAC / IAF MLA)
Official Website: https://www.trishulmetal.com
Export Contact: export@trishulmetal.com / +91 79772 81567
Bank Remittance Notice: Bank details are issued on company letterhead with the proforma invoice. Always confirm by phone before paying.`;

  const copyFullProfile = () => {
    navigator.clipboard.writeText(fullProfileText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const certificateDownloads = [
    {
      title: "ISO 9001:2015 Certificate",
      desc: "Quality Management System (IAF / EGAC)",
      href: "/certificates/iso-9001.pdf",
    },
    {
      title: "Importer-Exporter Code (IEC)",
      desc: "Ministry of Commerce & Industry / DGFT",
      href: "/certificates/iec-code.pdf",
    },
    {
      title: "GST Registration Certificate",
      desc: "Government of India (Form GST REG-06)",
      href: "/certificates/gst-certificate.pdf",
    },
    {
      title: "MSME / Udyam Registration",
      desc: "Ministry of MSME, Govt of India",
      href: "/certificates/udyam-registration.pdf",
    },
    {
      title: "DPIIT Recognition Certificate",
      desc: "Startup India Certificate of Recognition",
      href: "/certificates/dpiit-recognition.pdf",
    },
    {
      title: "CIFFA Training Certificate (Govind Modi)",
      desc: "Canadian International Freight Forwarders Association — Personal Training",
      href: "/certificates/ciffa-certificate.pdf",
    },
    {
      title: "Product & Engineering Catalogue 2026",
      desc: "Complete 2026 Piping & Structural Range",
      href: "/resources/product-catalogue-2026.pdf",
    },
    {
      title: "Technical Metallurgy Guide",
      desc: "ASTM, ASME, DIN, EN & NORSOK Specifications",
      href: "/resources/technical-guide.pdf",
    },
  ];

  return (
    <>
      {/* Header */}
      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Vendor Registration Pack" }]} />
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionHead
              as="h1"
              eyebrow="Procurement & ERP Onboarding"
              title="Vendor Registration & Supplier Profile"
              intro="Everything required by procurement, supply chain, and finance departments to onboard Trishul Metals & Alloys into SAP, Oracle, Microsoft Dynamics, or client vendor master registries."
            />
          </div>
          <button
            type="button"
            onClick={copyFullProfile}
            className="flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            {copiedAll ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copiedAll ? "Vendor Data Copied to Clipboard!" : "Copy Full ERP Vendor Dossier"}</span>
          </button>
        </div>
      </Section>

      {/* Main Grid: Registrations & Bank Details */}
      <Section className="border-b border-border">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Card 1: Statutory & Tax Identification */}
          <div className="surface-panel rounded-md p-6 border border-border space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">
                Statutory, Tax & Business Registrations
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <CopyField label="Legal Entity Name" value="Trishul Metals & Alloys" />
              <CopyField label="Constitution" value="Partnership firm" />
              <CopyField label="Parent Group" value="Modi Group of Industries" />
              <CopyField label="Group Founder & Principal" value="Ramesh Modi" />
              <CopyField label="GSTIN (Maharashtra)" value="27AAYFT9507B1ZP" />
              <CopyField label="IEC (DGFT India)" value="AAYFT9507B" />
              <CopyField label="Income Tax PAN" value="AAYFT9507B" />
              <CopyField label="MSME / Udyam Registration" value="UDYAM-MH-19-0404041" />
              <CopyField label="Startup India DPIIT ID" value="DIPP243391" />
              <CopyField label="ISO 9001:2015 Cert No." value="26MEQXH09" />
            </div>

            <div className="mt-4 rounded-md border border-border/80 bg-background/50 p-3.5 text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Registration Verification: </span>
              All certificates and status records can be independently cross-verified on the official DGFT (dgft.gov.in), GST Portal (gst.gov.in), and Udyam Registration portals.
            </div>
          </div>

          {/* Card 2: Banking & Wire Remittance Notice */}
          <div className="surface-panel rounded-md p-6 border border-border space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">
                Banking & Wire Remittance Security Policy
              </h2>
            </div>

            <div className="rounded-md border border-primary/30 bg-primary/5 p-5 space-y-3">
              <p className="text-sm font-semibold text-foreground">
                Bank details are issued on company letterhead with the proforma invoice. Always confirm by phone before paying.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                For international fraud prevention and buyer security, Trishul Metals & Alloys never publishes live bank account numbers or wire remittance codes online. Bank accounts are verified directly with procurement officers upon contract award.
              </p>
            </div>

            <div className="mt-4 rounded-md border border-border bg-background/50 p-3.5 text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Multi-Currency Capability: </span>
              Trishul accepts telegraphic wire transfers (TT/SWIFT) in USD, EUR, GBP, AED, SAR, SGD, and INR. Irrevocable Letters of Credit (LC) at sight from first-class international banks are supported.
            </div>
          </div>
        </div>

        {/* Operating Facilities & Commercial Terms */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Facilities */}
          <div className="surface-panel rounded-md p-6 border border-border space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">
                Operating Facilities & Export Hubs
              </h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-md border border-border bg-background/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Operational HQ & Despatch</span>
                  <span className="font-mono text-[10px] uppercase text-primary">Mumbai</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Suite 206, 89/91 Durgadevi Street, Mumbai 400004, Maharashtra, India
                </p>
                <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-primary" /> {company.exportEmail}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-primary" /> {company.phone}</span>
                </div>
              </div>

              <div className="rounded-md border border-border bg-background/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Central Warehouse & Inspection Facility</span>
                  <span className="font-mono text-[10px] uppercase text-primary">Kalamboli (Navi Mumbai)</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Plot No. 1818, Road No. 23, Kalamboli Warehouse Complex (KWC), Kalamboli, Navi Mumbai 410218, Maharashtra, India
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Despatch Gateway: Nhava Sheva (JNPT Port) / Mumbai Air Cargo Complex.
                </p>
              </div>
            </div>
          </div>

          {/* Commercial & Incoterms Policy */}
          <div className="surface-panel rounded-md p-6 border border-border space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Truck className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">
                Commercial & Incoterms Policy
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 rounded-md border border-border bg-background/50 p-3">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Supported Incoterms 2020: </strong>
                  <span className="text-muted-foreground">
                    FOB Nhava Sheva / Mundra, CIF (any global seaport), CFR, EXW Kalamboli warehouse, DAP, and DDP (US & EU with clearance partner).
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-md border border-border bg-background/50 p-3">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Standard Payment Terms: </strong>
                  <span className="text-muted-foreground">
                    100% Irrevocable LC at Sight; CAD (Cash Against Documents); 30% advance deposit with balance 70% against Bill of Lading and MTC copy; 30–60 days open credit for pre-approved EPC clients.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-md border border-border bg-background/50 p-3">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Quality Dossiers Included: </strong>
                  <span className="text-muted-foreground">
                    EN 10204 Type 3.1 MTCs with heat traceability, PMI reports, NDT certifications, dimension reports, and certificate of origin supplied with every shipment.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Downloadable Certificates Grid */}
      <Section className="border-b border-border">
        <div className="mb-6">
          <p className="eyebrow">Official Documentation</p>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Download Official Registration Certificates & Documents
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Directly download high-resolution PDF copies of our statutory credentials, ISO certification, and product catalogues.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {certificateDownloads.map((doc, idx) => (
            <div
              key={idx}
              className="surface-panel rounded-md p-4 border border-border flex flex-col justify-between hover:border-primary/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-mono text-[10px] text-muted-foreground uppercase">PDF</span>
                </div>
                <h3 className="mt-3 text-xs font-bold text-foreground">{doc.title}</h3>
                <p className="mt-1 text-[11px] text-muted-foreground">{doc.desc}</p>
              </div>

              <div className="mt-4 flex items-center gap-2 pt-2 border-t border-border/40">
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded bg-primary py-2 text-[11px] font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
                  title={`Open and view ${doc.title} in new tab`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Open PDF</span>
                </a>
                <a
                  href={doc.href}
                  download
                  className="flex items-center justify-center rounded border border-border bg-background p-2 text-foreground hover:border-primary hover:text-primary transition-colors"
                  title={`Download copy of ${doc.title}`}
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Supplier & Mill Enrolment Application Form */}
      <Section className="border-b border-border bg-card/40">
        <div className="max-w-3xl mx-auto">
          <SectionHead
            eyebrow="Supplier &amp; Mill Onboarding"
            title="Register as an Approved Trishul Metals Vendor"
            intro="Mills, forging units, testing laboratories, and pipe manufacturers supplying nickel alloys, duplex, titanium, and specialized CRA components may apply for vendor code enrolment."
          />
          <div className="mt-8 surface-panel rounded-md p-6 border border-border">
            <SupplierRegistrationForm />
          </div>
        </div>
      </Section>

      {/* CTA */}
      <CtaBand
        title="Require customized vendor questionnaires, bank references, or NDA signing?"
        body="Send your vendor onboarding portal invite or questionnaire to our compliance desk for same-day completion."
      />
    </>
  );
}

function SupplierRegistrationForm() {
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("India");
  const [categories, setCategories] = useState("");
  const [certifications, setCertifications] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!companyName.trim()) {
      setError("Company / Mill name is required.");
      return;
    }
    if (!contactPerson.trim()) {
      setError("Contact person name is required.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please provide a valid work email address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName.trim(),
          contact_person: contactPerson.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          country: country.trim() || undefined,
          product_categories: categories.trim() ? categories.split(",").map((c) => c.trim()) : undefined,
          certifications: certifications.trim() ? certifications.split(",").map((c) => c.trim()) : undefined,
          message: message.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit vendor registration.");
      }

      setSuccess(true);
      setCompanyName("");
      setContactPerson("");
      setEmail("");
      setPhone("");
      setCategories("");
      setCertifications("");
      setMessage("");
    } catch (err: any) {
      setError(err?.message || "Failed to submit vendor profile. Please reach out to procurement directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-md border border-primary/40 bg-primary/10 p-5 space-y-2">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <CheckCircle2 className="h-5 w-5" />
          <span>Vendor Application Submitted Successfully</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Thank you for applying to Trishul Metals &amp; Alloys approved vendor panel. Our QA &amp; procurement division will evaluate your certifications and product scope and reach out regarding audit requirements and formal vendor code issuance.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-2 text-xs font-semibold text-primary underline"
        >
          Submit another profile
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Company / Mill Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Bharat Heavy Forgings Ltd"
            disabled={isSubmitting}
            className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Contact Person <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            required
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            placeholder="e.g. Rajesh Sharma (Head of Marketing)"
            disabled={isSubmitting}
            className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Work Email <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. sales@millcompany.com"
            disabled={isSubmitting}
            className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </div>
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
            Country / Region
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. India, Germany, UAE"
            disabled={isSubmitting}
            className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Product Categories Manufactured
          </label>
          <input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="e.g. Forged Flanges, Buttweld Fittings, Seamless Pipes"
            disabled={isSubmitting}
            className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
            Quality Approvals &amp; Certifications
          </label>
          <input
            type="text"
            value={certifications}
            onChange={(e) => setCertifications(e.target.value)}
            placeholder="e.g. ISO 9001, PED 2014/68/EU, NORSOK M-650, IBR"
            disabled={isSubmitting}
            className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
          Manufacturing Capacity &amp; Mill Notes
        </label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please describe your plant capacities, testing laboratory facilities (PMI, UT, RT, Charpy Impact), and major approved end-user lists..."
          disabled={isSubmitting}
          className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-primary py-2.5 px-6 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Submitting Vendor Profile...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Submit Vendor Onboarding Profile</span>
          </>
        )}
      </button>
    </form>
  );
}
