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
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { parseBoqTable } from "@/lib/boq";
import { extractRowsFromFile } from "@/lib/xlsx-lite";
import {
  FileSpreadsheet,
  LayoutGrid,
  Table as TableIcon,
  Upload,
  X,
  Check,
  Trash2,
  AlertCircle,
} from "lucide-react";


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
      { property: "og:url", content: "https://www.trishulmetal.com/rfq" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.trishulmetal.com/rfq" }],
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

function parseBoqText(rawText: string): Line[] {
  const rawRows = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!rawRows.length) return [];

  const firstRow = (rawRows[0] || "").toLowerCase();
  const hasHeader =
    firstRow.includes("grade") ||
    firstRow.includes("material") ||
    firstRow.includes("product") ||
    firstRow.includes("size") ||
    firstRow.includes("qty") ||
    firstRow.includes("quantity") ||
    firstRow.includes("item");

  const rows = hasHeader ? rawRows.slice(1) : rawRows;

  return rows.map((row) => {
    let cols: string[] = [];
    if (row.includes("\t")) {
      cols = row.split("\t").map((c) => c.trim().replace(/^["']|["']$/g, ""));
    } else {
      cols = (row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(",")).map((c) =>
        c.trim().replace(/^["']|["']$/g, "")
      );
    }

    let material = "";
    let product = "";
    let size = "";
    let rating = "";
    let facing = "";
    let quantity = "";
    let unit = "pcs";
    let cutLength = "";

    for (const c of cols) {
      if (!c) continue;
      const lower = c.toLowerCase();
      if (/^\d+(\.\d+)?$/.test(c) && !quantity) {
        quantity = c;
        continue;
      }
      if (/^(pcs|pieces|mtr|meters|kg|kgs|nos|units|set|tonnes|tons)$/i.test(c)) {
        unit = lower.startsWith("m") ? "mtr" : lower.startsWith("k") ? "kg" : lower.startsWith("t") ? "tons" : "pcs";
        continue;
      }
      if (/^(class\s*\d+|\d+#|sch\s*\w+|schedule\s*\w+|pn\s*\d+|3000#|6000#|9000#|150#|300#|600#|900#|1500#|2500#)/i.test(c)) {
        rating = c;
        continue;
      }
      if (/^(rf|rtj|ff|flat\s*face|raised\s*face|ring\s*type\s*joint)/i.test(c)) {
        facing = c.toUpperCase();
        continue;
      }
      if (/^(\d+(\.\d+)?(\/\d+)?["']?(\s*nps)?|\d+\s*mm|\d+x\d+)/i.test(c) && !size) {
        size = c;
        continue;
      }
      if (/(flange|elbow|tee|reducer|cap|pipe|tube|fitting|bend|nipple|coupling|o-let|beam|channel|angle)/i.test(c) && !product) {
        product = c;
        continue;
      }
      if (/(304|316|321|347|904|2205|2507|inconel|incoloy|hastelloy|monel|a105|a350|a234|a106|a333|titanium|carbon|duplex|ss|stainless)/i.test(c) && !material) {
        material = c;
        continue;
      }
      if (!material) material = c;
      else if (!product) product = c;
      else if (!size) size = c;
    }

    return {
      material,
      product: product || "Piping Component",
      size,
      rating,
      facing,
      quantity: quantity || "1",
      unit: unit || "pcs",
      cutLength,
      processing: [],
    };
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
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [customer, setCustomer] = useState({ company: "", contactName: "", email: "", phone: "", country: "" });

  useEffect(() => {
    if (user) {
      setCustomer((prev) => ({
        ...prev,
        company: user.company || prev.company,
        contactName: user.fullName || prev.contactName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [boqModalOpen, setBoqModalOpen] = useState(false);
  const [boqInputText, setBoqInputText] = useState("");
  const [boqParsedLines, setBoqParsedLines] = useState<Line[]>([]);
  const [boqFileName, setBoqFileName] = useState("");

  const handleBoqTextChange = (text: string) => {
    setBoqInputText(text);
    const parsed = parseBoqTable(text).map((p) => ({
      material: p.material,
      product: p.product,
      size: p.size,
      rating: p.rating,
      facing: p.facing,
      quantity: p.quantity,
      unit: p.unit,
      cutLength: p.cutLength || "",
      processing: p.processing || [],
    }));
    setBoqParsedLines(parsed);
  };

  const handleBoqFileUpload = async (file: File) => {
    setBoqFileName(file.name);
    try {
      const content = await extractRowsFromFile(file);
      handleBoqTextChange(content);
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = String(e.target?.result || "");
        handleBoqTextChange(content);
      };
      reader.readAsText(file);
    }
  };

  const applyBoq = (mode: "append" | "replace") => {
    if (!boqParsedLines.length) return;
    if (mode === "append") {
      setLines((prev) => [...prev.filter((l) => l.material || l.product), ...boqParsedLines]);
    } else {
      setLines(boqParsedLines);
    }
    const sourceBlob = new Blob([boqInputText], { type: "text/csv" });
    const sourceFile = new File([sourceBlob], boqFileName || `imported-mto-${Date.now()}.csv`, {
      type: "text/csv",
    });
    setFiles((prev) => [...prev, sourceFile]);
    setBoqModalOpen(false);
    setBoqInputText("");
    setBoqParsedLines([]);
    setBoqFileName("");
    if (boqParsedLines.length >= 4) {
      setViewMode("table");
    }
  };

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
    if (busy || submitSuccess) return;

    setError(null);
    const form = new FormData(e.currentTarget);

    const rawEmail = String(form.get("email") ?? "").trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!rawEmail || !emailRegex.test(rawEmail)) {
      setError("Please provide a valid work email address for RFQ submission.");
      return;
    }

    const companyName = String(form.get("company") ?? "").trim();
    if (!companyName || companyName.length < 2) {
      setError("Please provide your company or organization name.");
      return;
    }

    const contactName = String(form.get("contactName") ?? "").trim();
    if (!contactName || contactName.length < 2) {
      setError("Please provide the contact person's full name.");
      return;
    }

    const rawPhone = String(form.get("phone") ?? "").trim();
    if (rawPhone) {
      const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;
      if (!phoneRegex.test(rawPhone)) {
        setError("Please enter a valid phone number with country code (e.g. +91 98200 12345).");
        return;
      }
    }

    if (!lines || lines.length === 0 || !lines.some((l) => l.material || l.product)) {
      setError("Please add at least one line item with specified material grade or product.");
      return;
    }

    setBusy(true);

    try {
      const attachments = await Promise.all(
        files.map(async (f) => ({
          name: f.name,
          type: f.type || "application/octet-stream",
          size: f.size,
          data: await readAsBase64(f),
        })),
      );

      const payload = {
        company: companyName,
        contactName: contactName,
        email: rawEmail,
        phone: rawPhone || null,
        country: String(form.get("country") ?? "").trim() || null,
        incoterm: String(form.get("incoterm") ?? "").trim() || null,
        deliveryPort: String(form.get("deliveryPort") ?? "").trim() || null,
        targetLeadTime: String(form.get("targetLeadTime") ?? "").trim() || null,
        projectName: String(form.get("projectName") ?? "").trim() || null,
        message: String(form.get("message") ?? "").trim() || null,
        certification,
        testing,
        items: lines,
        line_items: lines,
        attachments,
      };

      let token = "";
      try {
        const res = await api.rfq.submit(payload);
        if (res && res.success) {
          token = res.confirmationToken;
        } else {
          throw new Error(res?.message || "Server did not confirm RFQ.");
        }
      } catch (apiErr: any) {
        console.warn("[API RFQ submit fallback to serverFn]:", apiErr?.message);
        const fnRes = await send({ data: payload as any });
        token = fnRes?.confirmationToken;
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        void navigate({ to: "/rfq/confirmation", search: { token } });
      }, 500);
    } catch (err: any) {
      setError(
        err?.message || "Something went wrong sending your enquiry. Please check your details and try again."
      );
      setBusy(false);
      setSubmitSuccess(false);
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
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/80">
                <div>
                  <p className="eyebrow">1 — Line items ({lines.length})</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add components manually or import your entire MTO / BOQ spreadsheet.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBoqModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-primary/50 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Import BOQ / MTO</span>
                  </button>
                  <div className="flex items-center rounded-sm border border-border bg-background p-0.5">
                    <button
                      type="button"
                      onClick={() => setViewMode("card")}
                      className={`p-1.5 rounded-sm transition-colors ${
                        viewMode === "card"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title="Card view"
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("table")}
                      className={`p-1.5 rounded-sm transition-colors ${
                        viewMode === "table"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title="Compact table view"
                    >
                      <TableIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {viewMode === "table" ? (
                /* Compact Table View */
                <div className="mt-4 overflow-x-auto rounded-md border border-border bg-card">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
                        <th className="py-2.5 px-3 text-center w-10">#</th>
                        <th className="py-2.5 px-3 min-w-[140px]">Material Grade</th>
                        <th className="py-2.5 px-3 min-w-[150px]">Product Category</th>
                        <th className="py-2.5 px-3 min-w-[120px]">Size / NPS</th>
                        <th className="py-2.5 px-3 min-w-[120px]">Class / Sched</th>
                        <th className="py-2.5 px-3 min-w-[80px]">Facing</th>
                        <th className="py-2.5 px-3 min-w-[70px]">Qty</th>
                        <th className="py-2.5 px-3 min-w-[75px]">Unit</th>
                        <th className="py-2.5 px-3 text-right w-14"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {lines.map((line, i) => (
                        <tr key={i} className="hover:bg-muted/10 transition-colors">
                          <td className="py-2 px-3 font-mono text-[11px] text-muted-foreground text-center">
                            {i + 1}
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              list="rfq-materials"
                              value={line.material}
                              onChange={(e) => setLine(i, { material: e.target.value })}
                              className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                              placeholder="e.g. Duplex 2205"
                            />
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              list="rfq-products"
                              value={line.product}
                              onChange={(e) => setLine(i, { product: e.target.value })}
                              className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                              placeholder="e.g. Weld Neck Flanges"
                            />
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              value={line.size}
                              onChange={(e) => setLine(i, { size: e.target.value })}
                              className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                              placeholder='e.g. 6"'
                            />
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              value={line.rating}
                              onChange={(e) => setLine(i, { rating: e.target.value })}
                              className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                              placeholder="e.g. Class 300"
                            />
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              value={line.facing}
                              onChange={(e) => setLine(i, { facing: e.target.value })}
                              className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                              placeholder="RF"
                            />
                          </td>
                          <td className="py-1.5 px-2">
                            <input
                              value={line.quantity}
                              onChange={(e) => setLine(i, { quantity: e.target.value })}
                              className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none text-right font-mono"
                              placeholder="1"
                            />
                          </td>
                          <td className="py-1.5 px-2">
                            <select
                              value={line.unit}
                              onChange={(e) => setLine(i, { unit: e.target.value })}
                              className="w-full rounded border border-border bg-background px-1.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                            >
                              {units.map((u) => (
                                <option key={u} value={u}>
                                  {u}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-1.5 px-2 text-right">
                            {lines.length > 1 ? (
                              <button
                                type="button"
                                onClick={() => setLines((prev) => prev.filter((_, idx) => idx !== i))}
                                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
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
            )}
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
                disabled={busy || submitSuccess}
                className="magnetic-action rounded-sm bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-all hover:opacity-90 disabled:opacity-50"
              >
                {submitSuccess ? "RFQ Submitted" : busy ? "Sending…" : "Submit RFQ"}
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

      {/* BOQ / MTO Import Modal */}
      {boqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in-0 duration-150">
          <div className="surface-panel w-full max-w-3xl rounded-lg border border-border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-foreground">
                  Import Material Take-Off (MTO) / Bill of Quantities (BOQ)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBoqModalOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Paste rows copied directly from Microsoft Excel, Google Sheets, or a CSV file. The parser detects grade, product type, dimensions, pressure rating, facing, and quantity automatically.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Paste Excel Cells or CSV Lines:
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-primary hover:underline">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Choose .csv / .txt file</span>
                  <input
                    type="file"
                    accept=".csv,.txt,.tsv"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleBoqFileUpload(e.target.files[0]);
                    }}
                  />
                </label>
              </div>

              <textarea
                rows={6}
                value={boqInputText}
                onChange={(e) => handleBoqTextChange(e.target.value)}
                placeholder="Paste here... Example:&#10;Duplex 2205	Weld Neck Flange	6&quot;	Class 300	RF	24	pcs&#10;Inconel 625	Seamless Pipe	2&quot;	SCH 80S		120	mtr&#10;316L	Equal Tee	4&quot;	SCH 40S		45	pcs"
                className="w-full rounded-md border border-border bg-background p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Parsed Preview */}
            {boqParsedLines.length > 0 && (
              <div className="space-y-2 border-t border-border pt-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-foreground">
                    Parsed Preview ({boqParsedLines.length} item{boqParsedLines.length > 1 ? "s" : ""})
                  </span>
                  <span className="text-emerald-400 font-mono text-[11px]">
                    ✓ Auto-classified columns
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto rounded border border-border bg-background/50">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead className="bg-muted/50 border-b border-border font-mono text-[10px] text-muted-foreground uppercase sticky top-0">
                      <tr>
                        <th className="p-2">#</th>
                        <th className="p-2">Grade</th>
                        <th className="p-2">Product</th>
                        <th className="p-2">Size</th>
                        <th className="p-2">Class</th>
                        <th className="p-2">Facing</th>
                        <th className="p-2">Qty</th>
                        <th className="p-2">Unit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {boqParsedLines.map((row, idx) => (
                        <tr key={idx} className="hover:bg-muted/20">
                          <td className="p-1.5 font-mono text-muted-foreground">{idx + 1}</td>
                          <td className="p-1.5 font-medium text-foreground">{row.material || "—"}</td>
                          <td className="p-1.5 text-foreground">{row.product || "—"}</td>
                          <td className="p-1.5 text-muted-foreground">{row.size || "—"}</td>
                          <td className="p-1.5 text-muted-foreground">{row.rating || "—"}</td>
                          <td className="p-1.5 text-muted-foreground">{row.facing || "—"}</td>
                          <td className="p-1.5 font-mono text-foreground">{row.quantity}</td>
                          <td className="p-1.5 text-muted-foreground">{row.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <span className="text-[11px] text-muted-foreground">
                Original raw file will be automatically attached to your RFQ submission.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBoqModalOpen(false)}
                  className="rounded-md border border-border px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={boqParsedLines.length === 0}
                  onClick={() => applyBoq("replace")}
                  className="rounded-md border border-border px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-40"
                >
                  Replace Lines ({boqParsedLines.length})
                </button>
                <button
                  type="button"
                  disabled={boqParsedLines.length === 0}
                  onClick={() => applyBoq("append")}
                  className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40 shadow-sm"
                >
                  Append to Inquiry ({boqParsedLines.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
