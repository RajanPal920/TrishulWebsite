import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "motion/react";
import { Section, SectionHead, Breadcrumbs, BulletList } from "@/components/site/parts";
import { useHydrationSafeReducedMotion } from "@/components/site/InteractionMotion";
import { company } from "@/data/company";
import { materials } from "@/data/materials";
import { productTypes } from "@/data/products";
import { submitRfq } from "@/lib/rfq.functions";
import { rfqCertificationOptions, rfqProcessingOptions, rfqUnits } from "@/data/rfq-options";
import { supabase } from "@/integrations/supabase/client";


interface RfqSearch {
  grade?: string;
  product?: string;
  size?: string;
  rating?: string;
  facing?: string;
  note?: string;
  cutLength?: string;
  quantity?: string;
  unit?: string;
  processing?: string;
  cert?: string;
}

export const Route = createFileRoute("/rfq")({
  validateSearch: (search: Record<string, unknown>): RfqSearch => ({
    ...(typeof search["grade"] === "string" ? { grade: search["grade"] } : {}),
    ...(typeof search["product"] === "string" ? { product: search["product"] } : {}),
    ...(typeof search["size"] === "string" ? { size: search["size"] } : {}),
    ...(typeof search["rating"] === "string" ? { rating: search["rating"] } : {}),
    ...(typeof search["facing"] === "string" ? { facing: search["facing"] } : {}),
    ...(typeof search["note"] === "string" ? { note: search["note"] } : {}),
    ...(typeof search["cutLength"] === "string" ? { cutLength: search["cutLength"] } : {}),
    ...(typeof search["quantity"] === "string" ? { quantity: search["quantity"] } : {}),
    ...(typeof search["unit"] === "string" ? { unit: search["unit"] } : {}),
    ...(typeof search["processing"] === "string" ? { processing: search["processing"] } : {}),
    ...(typeof search["cert"] === "string" ? { cert: search["cert"] } : {}),
  }),

  head: () => ({
    meta: [
      { title: "Request a Quotation — Upload Your MTO or Drawing | Trishul Metals" },
      {
        name: "description",
        content:
          "Build a multi-line enquiry with grade, product, size, class and quantity, add processing options and upload your MTO or drawing for a priced quotation.",
      },
      { property: "og:title", content: "Request a Quotation | Trishul Metals & Alloys" },
      {
        property: "og:description",
        content: "Multi-line RFQ with MTO spreadsheet and drawing upload — priced with lead time and documentation scope.",
      },
      { property: "og:url", content: "/rfq" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/rfq" }],
  }),
  component: Rfq,
});

interface Line {
  material: string;
  product: string;
  size: string;
  rating: string;
  facing: string;
  quantity: string;
  unit: string;
  cutLength: string;
  processing: string[];
}

const emptyLine: Line = {
  material: "",
  product: "",
  size: "",
  rating: "",
  facing: "",
  quantity: "",
  unit: "pcs",
  cutLength: "",
  processing: [] as string[],
};

const processingOptions = [...rfqProcessingOptions];

const testOptions = [
  "PMI",
  "Hydrostatic",
  "UT / ET",
  "Radiography",
  "PT / MT",
  "IGC ASTM A262",
  "Ferrite count",
  "Impact (Charpy)",
  "Hardness",
  "NACE MR0175",
  "ASTM G48",
];

const incotermOptions = ["EXW", "FOB", "CFR", "CIF", "DAP", "DDP"];
const units = [...rfqUnits];
const inputCls =
  "motion-field w-full rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none";

const MAX_FILE = 25 * 1024 * 1024;
const MAX_FILES = 10;
const ACCEPTED = [
  ".pdf",
  ".xlsx",
  ".xlsm",
  ".xls",
  ".csv",
  ".doc",
  ".docx",
  ".dwg",
  ".dxf",
  ".dwf",
  ".step",
  ".stp",
  ".iges",
  ".igs",
  ".png",
  ".jpg",
  ".jpeg",
  ".zip",
  ".rar",
  ".7z",
];

const extOf = (name: string) => name.slice(name.lastIndexOf(".")).toLowerCase();
const fmtSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;


function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function Rfq() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const send = useServerFn(submitRfq);
  const reduceMotion = useHydrationSafeReducedMotion();
  const dynamicMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10, height: 0 },
        animate: { opacity: 1, y: 0, height: "auto" },
        exit: { opacity: 0, y: -6, height: 0 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
      };

  useEffect(() => {
    if (window.location.hash !== "#build-enquiry") return;
    window.requestAnimationFrame(() => {
      document.getElementById("build-enquiry")?.scrollIntoView({ block: "start" });
    });
  }, []);

  const [lines, setLines] = useState<Line[]>([
    {
      ...emptyLine,
      material: search.grade ?? "",
      product: search.product ?? "",
      size: search.size ?? "",
      rating: search.rating ?? "",
      facing: search.facing ?? "",
      cutLength: search.cutLength ?? "",
      quantity: search.quantity ?? "",
      unit: search.unit ?? "pcs",
      processing: (search.processing ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter((value) => processingOptions.some((option) => option === value)),
    },
  ]);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState<string[]>([]);

  const [testing, setTesting] = useState<string[]>([]);
  const [certification, setCertification] = useState(
    search.cert && rfqCertificationOptions.includes(search.cert as (typeof rfqCertificationOptions)[number])
      ? search.cert
      : "EN 10204 3.1",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState({ company: "", contactName: "", email: "", phone: "", country: "" });

  useEffect(() => {
    void supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      if (!user?.email) return;
      const { data: profile } = await supabase.from("profiles").select("company, contact_name, phone, country").eq("id", user.id).maybeSingle();
      setCustomer({
        company: profile?.company ?? "",
        contactName: profile?.contact_name ?? "",
        email: user.email ?? "",
        phone: profile?.phone ?? "",
        country: profile?.country ?? "",
      });
    });
  }, []);

  const setLine = (i: number, patch: Partial<Line>) =>
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const onFiles = (list: FileList | null) => {
    if (!list || !list.length) return;
    const notes: string[] = [];
    const picked: File[] = [];
    for (const f of Array.from(list)) {
      if (!ACCEPTED.includes(extOf(f.name))) {
        notes.push(`${f.name} — file type not accepted`);
        continue;
      }
      if (f.size > MAX_FILE) {
        notes.push(`${f.name} — ${fmtSize(f.size)}, over the 25 MB limit`);
        continue;
      }
      picked.push(f);
    }
    setFiles((prev) => {
      const merged = [...prev];
      for (const f of picked) {
        if (merged.some((m) => m.name === f.name && m.size === f.size)) continue;
        if (merged.length >= MAX_FILES) {
          notes.push(`${f.name} — over the ${MAX_FILES} file limit`);
          continue;
        }
        merged.push(f);
      }
      return merged;
    });
    setRejected(notes);
  };

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);



  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(e.currentTarget);
    try {
      const attachments = await Promise.all(
        files.map(async (f) => ({
          name: f.name,
          type: f.type || "application/octet-stream",
          size: f.size,
          data: await readAsBase64(f),
        })),
      );
      const res = await send({
        data: {
          company: String(form.get("company") ?? ""),
          contactName: String(form.get("contactName") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          country: String(form.get("country") ?? ""),
          incoterm: String(form.get("incoterm") ?? ""),
          deliveryPort: String(form.get("deliveryPort") ?? ""),
          targetLeadTime: String(form.get("targetLeadTime") ?? ""),
          projectName: String(form.get("projectName") ?? ""),
          message: String(form.get("message") ?? ""),
          certification,
          testing,
          items: lines,
          attachments,
        },
      });
      await navigate({ to: "/rfq/confirmation", search: { token: res.confirmationToken } });
    } catch (err) {
      setError(
        err instanceof Error && err.message.includes("save")
          ? err.message
          : "Something went wrong sending your enquiry. Please email us and we will pick it up straight away.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes("Files")) {
          e.preventDefault();
          setDragging(true);
        }
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDragging(false);
      }}
      onDrop={(e) => {
        if (e.dataTransfer.files?.length) {
          e.preventDefault();
          setDragging(false);
          onFiles(e.dataTransfer.files);
          document.getElementById("rfq-documents")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }}
      onPaste={(e) => {
        if (e.clipboardData.files?.length) onFiles(e.clipboardData.files);
      }}
      className="relative"
    >
      {dragging ? (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <p className="rounded-md border-2 border-dashed border-primary px-10 py-8 font-display text-2xl font-semibold text-primary">
            Drop your MTO, drawing or CAD files anywhere
          </p>
        </div>
      ) : null}

      <Section className="border-b border-border">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Request a quotation" }]} />
        <div className="mt-6">
          <SectionHead as="h1"
            eyebrow="Request for quotation"
            title="Build your enquiry — or just upload the MTO"
            intro="Add each line with grade, product, size, class and quantity, or attach your material take-off spreadsheet, isometric or specification and we will build the enquiry for you."
          />
        </div>
      </Section>


      <Section id="build-enquiry">

        <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-10">
            <div className="scroll-reveal">
              <p className="eyebrow">1 — Line items</p>
              <div className="mt-4 space-y-4">
                <AnimatePresence initial={false}>
                {lines.map((line, i) => (
                  <motion.div key={i} className="surface-panel overflow-hidden rounded-md p-5" {...dynamicMotion}>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        Line {i + 1}
                      </p>
                      {lines.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => setLines((prev) => prev.filter((_, idx) => idx !== i))}
                          className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="eyebrow">Material grade</span>
                        <input
                          list="rfq-materials"
                          value={line.material}
                          onChange={(e) => setLine(i, { material: e.target.value })}
                          className={inputCls}
                          placeholder="e.g. Duplex 2205"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="eyebrow">Product</span>
                        <input
                          list="rfq-products"
                          value={line.product}
                          onChange={(e) => setLine(i, { product: e.target.value })}
                          className={inputCls}
                          placeholder="e.g. Weld Neck Flanges"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="eyebrow">Size / NPS / OD x WT</span>
                        <input
                          value={line.size}
                          onChange={(e) => setLine(i, { size: e.target.value })}
                          className={inputCls}
                          placeholder='e.g. 6" or 168.3 x 7.11 mm'
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="eyebrow">Class / schedule</span>
                        <input
                          value={line.rating}
                          onChange={(e) => setLine(i, { rating: e.target.value })}
                          className={inputCls}
                          placeholder="e.g. Class 300 / SCH 40S"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="eyebrow">Facing</span>
                        <input
                          value={line.facing}
                          onChange={(e) => setLine(i, { facing: e.target.value })}
                          className={inputCls}
                          placeholder="e.g. RF / RTJ / FF"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="eyebrow">Quantity</span>
                        <input
                          value={line.quantity}
                          onChange={(e) => setLine(i, { quantity: e.target.value })}
                          className={inputCls}
                          inputMode="decimal"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="eyebrow">Unit</span>
                        <select
                          value={line.unit}
                          onChange={(e) => setLine(i, { unit: e.target.value })}
                          className={inputCls}
                        >
                          {units.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="mt-5 border-t border-border pt-4">
                      <p className="eyebrow">Value-added processing (as applicable)</p>
                      <label className="mt-3 flex max-w-xs flex-col gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                          Cut length
                        </span>
                        <input
                          value={line.cutLength}
                          onChange={(e) => setLine(i, { cutLength: e.target.value })}
                          className={inputCls}
                          placeholder="e.g. 1000 mm"
                        />
                      </label>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {processingOptions.map((opt) => {
                          const on = line.processing.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                setLine(i, {
                                  processing: on
                                    ? line.processing.filter((x) => x !== opt)
                                    : [...line.processing, opt],
                                })
                              }
                               className={`selector-chip rounded-sm border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-[color,border-color,background-color,transform,box-shadow] duration-300 ${
                                on
                                  ? "border-primary bg-primary/15 text-primary"
                                  : "border-border text-muted-foreground hover:border-primary/50"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>
              <button
                type="button"
                onClick={() => setLines((prev) => [...prev, { ...emptyLine }])}
                className="selector-chip mt-4 rounded-sm border border-primary/50 px-4 py-2 text-sm font-semibold text-primary transition-[color,border-color,background-color,transform,box-shadow] duration-300 hover:bg-primary/10"
              >
                + Add another line
              </button>
              <datalist id="rfq-materials">
                {materials.map((m) => (
                  <option key={m.slug} value={m.name} />
                ))}
              </datalist>
              <datalist id="rfq-products">
                {productTypes.map((p) => (
                  <option key={p.slug} value={p.name} />
                ))}
              </datalist>
            </div>

            <div id="rfq-documents" className="scroll-reveal">
              <p className="eyebrow">2 — Documents</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Need it cut, bevelled or machined to a drawing? Select the processing on each line above and attach
                the drawing below —{" "}
                <Link to="/processing" className="text-primary underline-offset-2 hover:underline">
                  see processing capabilities
                </Link>
                .
              </p>
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragging(false);
                  onFiles(e.dataTransfer.files);
                }}
                 className={`rfq-upload-zone mt-4 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-16 text-center transition-[border-color,background-color,box-shadow,transform] duration-300 ${
                  dragging
                    ? "border-primary bg-primary/15"
                    : "border-primary/50 bg-primary/5 hover:bg-primary/10"
                }`}
              >
                <span className="font-display text-xl font-semibold text-primary">
                  Drag &amp; drop your MTO, drawing or CAD file here
                </span>
                <span className="mt-2 text-sm text-muted-foreground">
                  Drop anywhere on this page, paste from the clipboard, or click to browse — no need to retype line
                  items
                </span>
                <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  XLSX · XLSM · CSV · PDF · DWG · DXF · DWF · STEP · IGES · DOCX · ZIP · images · up to {MAX_FILES}{" "}
                  files, 25 MB each
                </span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept={ACCEPTED.join(",")}
                  onChange={(e) => {
                    onFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>

              <AnimatePresence initial={false}>
              {rejected.length ? (
                <motion.ul className="mt-3 space-y-1 overflow-hidden rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2" {...dynamicMotion}>
                  {rejected.map((r) => (
                    <li key={r} className="text-xs text-destructive">
                      {r}
                    </li>
                  ))}
                </motion.ul>
              ) : null}
              </AnimatePresence>

              {files.length ? (
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {files.length} of {MAX_FILES} files queued · {fmtSize(totalBytes)} total
                </p>
              ) : null}


              {files.length ? (
                <motion.ul layout={!reduceMotion} className="mt-4 space-y-2">
                  <AnimatePresence initial={false}>
                  {files.map((f, i) => (
                    <motion.li
                      key={`${f.name}-${i}`}
                      className="flex items-center justify-between overflow-hidden rounded-sm border border-border px-3 py-2 text-sm"
                      {...dynamicMotion}
                    >
                      <span className="truncate">
                        {f.name} <span className="text-muted-foreground">({fmtSize(f.size)})</span>{" "}
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                          {busy ? "Uploading" : "Queued"}
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
                      >
                        Remove
                      </button>
                    </motion.li>
                  ))}
                  </AnimatePresence>
                </motion.ul>
              ) : null}
            </div>

            <div className="scroll-reveal">
              <p className="eyebrow">3 — Testing &amp; certification</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {testOptions.map((t) => {
                  const on = testing.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setTesting((prev) => (on ? prev.filter((x) => x !== t) : [...prev, t]))
                      }
                       className={`selector-chip rounded-sm border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-[color,border-color,background-color,transform,box-shadow] duration-300 ${
                        on
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              <label className="mt-5 flex max-w-sm flex-col gap-2">
                <span className="eyebrow">Certification level</span>
                <select
                  value={certification}
                  onChange={(e) => setCertification(e.target.value)}
                  className={inputCls}
                >
                  {rfqCertificationOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="scroll-reveal">
              <p className="eyebrow">4 — Your details</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="eyebrow">Company *</span>
                  <input name="company" required value={customer.company} onChange={(e) => setCustomer((value) => ({ ...value, company: e.target.value }))} className={inputCls} />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="eyebrow">Contact name *</span>
                  <input name="contactName" required value={customer.contactName} onChange={(e) => setCustomer((value) => ({ ...value, contactName: e.target.value }))} className={inputCls} />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="eyebrow">Email *</span>
                  <input name="email" type="email" required value={customer.email} onChange={(e) => setCustomer((value) => ({ ...value, email: e.target.value }))} className={inputCls} />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="eyebrow">Phone / WhatsApp</span>
                  <input name="phone" value={customer.phone} onChange={(e) => setCustomer((value) => ({ ...value, phone: e.target.value }))} className={inputCls} />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="eyebrow">Country</span>
                  <input name="country" value={customer.country} onChange={(e) => setCustomer((value) => ({ ...value, country: e.target.value }))} className={inputCls} />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="eyebrow">Project / end user</span>
                  <input name="projectName" className={inputCls} />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="eyebrow">Incoterm</span>
                  <select name="incoterm" className={inputCls} defaultValue="FOB">
                    {incotermOptions.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="eyebrow">Destination port</span>
                  <input name="deliveryPort" className={inputCls} />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="eyebrow">Required delivery</span>
                  <input name="targetLeadTime" className={inputCls} placeholder="e.g. 6 weeks" />
                </label>
              </div>
              <label className="mt-4 flex flex-col gap-2">
                <span className="eyebrow">Notes</span>
                <textarea name="message" rows={4} className={inputCls} defaultValue={search.note ?? ""} />
              </label>
            </div>

            <AnimatePresence initial={false}>
              {error ? <motion.p className="overflow-hidden text-sm text-amber-400" {...dynamicMotion}>{error}</motion.p> : null}
            </AnimatePresence>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={busy}
                className="magnetic-action rounded-sm bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Sending…" : "Submit enquiry"}
              </button>
              <a
                href={`mailto:${company.exportEmail}?subject=RFQ%20-%20Alloy%20flanges%20and%20fittings`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                or email {company.exportEmail}
              </a>
            </div>
          </div>

          <aside className="motion-stagger-grid space-y-6">
            <div className="scroll-reveal surface-panel rounded-md p-6">
              <p className="eyebrow">RFQ checklist</p>
              <div className="mt-4">
                <BulletList
                  items={[
                    "Material grade / UNS, or service conditions for selection support",
                    "Product type, facing, bore, schedule and end preparation",
                    "Size range and pressure class or rating",
                    "Applicable standards: ASME, ASTM, NACE, NORSOK M-630, project spec",
                    "For NORSOK enquiries: the applicable MDS number, and whether manufacturer M-650 qualification is required",
                    "Certification level: EN 10204 3.1 or 3.2 with TPI",
                    "Quantity, Incoterm and destination port",
                  ]}
                />
              </div>
            </div>
            <div className="scroll-reveal surface-panel rounded-md p-6">
              <p className="eyebrow">Direct line</p>
              <p className="mt-3 text-sm text-muted-foreground">
                {company.exportEmail}
                <br />
                {company.phone}
                <br />
                {company.hours}
              </p>
              <a
                href={company.whatsapp}
                className="mt-4 inline-block rounded-sm border border-primary/50 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
              >
                WhatsApp the desk
              </a>
            </div>
          </aside>
        </form>
      </Section>
    </div>
  );
}
