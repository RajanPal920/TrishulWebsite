import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { company } from "@/data/company";
import type { Material } from "@/data/types";
import type { ProductType } from "@/data/products.types";
import type { Industry } from "@/data/industries";
import { mtcSpecimen } from "@/data/mtc";
import { pmiSpecimen, tpiSpecimen } from "@/data/docs";
import { packingSpecimen, packingSpecs } from "@/data/packing";
import logoAsset from "@/assets/brand/trishul-metals-logo.png.asset.json";

const GOLD: [number, number, number] = [201, 165, 90];
const INK: [number, number, number] = [26, 26, 26];
const MUTED: [number, number, number] = [110, 110, 110];

interface DocState {
  doc: jsPDF;
  y: number;
}

let logoDataUrlPromise: Promise<string> | undefined;

function getLogoDataUrl(): Promise<string> {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = fetch(logoAsset.url)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load document logo (${response.status})`);
        return response.blob();
      })
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Invalid logo data"));
            reader.onerror = () => reject(reader.error ?? new Error("Unable to read document logo"));
            reader.readAsDataURL(blob);
          }),
      );
  }
  return logoDataUrlPromise;
}

async function header(doc: jsPDF, title: string, subtitle: string): Promise<number> {
  doc.setFillColor(24, 24, 26);
  doc.rect(0, 0, 210, 30, "F");
  const logoDataUrl = await getLogoDataUrl();
  doc.addImage(logoDataUrl, "PNG", 14, 4.5, 58, 20.2, undefined, "FAST");
  doc.setTextColor(220, 220, 220);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Corrosion-Resistant Alloys · Nickel · Duplex · Super Duplex · Stainless", 196, 13, { align: "right" });
  doc.text(`Mumbai, India  ·  ${company.email}  ·  ${company.phone}`, 196, 19, { align: "right" });

  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text(doc.splitTextToSize(title, 180), 14, 42);
  const titleLines = doc.splitTextToSize(title, 180).length;
  let y = 42 + titleLines * 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(doc.splitTextToSize(subtitle, 180), 14, y);
  y += doc.splitTextToSize(subtitle, 180).length * 5 + 4;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.line(14, y, 196, y);
  return y + 8;
}

function pageBreak(s: DocState, needed = 40) {
  if (s.y + needed > 275) {
    s.doc.addPage();
    s.y = 20;
  }
}

function heading(s: DocState, text: string) {
  pageBreak(s, 24);
  s.doc.setFont("helvetica", "bold");
  s.doc.setFontSize(11);
  s.doc.setTextColor(...INK);
  s.doc.text(text.toUpperCase(), 14, s.y);
  s.y += 6;
}

function paragraph(s: DocState, text: string) {
  s.doc.setFont("helvetica", "normal");
  s.doc.setFontSize(9.5);
  s.doc.setTextColor(60, 60, 60);
  const lines = s.doc.splitTextToSize(text, 182);
  for (const line of lines) {
    pageBreak(s, 12);
    s.doc.text(line, 14, s.y);
    s.y += 5;
  }
  s.y += 3;
}

function bullets(s: DocState, items: string[]) {
  s.doc.setFont("helvetica", "normal");
  s.doc.setFontSize(9.5);
  s.doc.setTextColor(60, 60, 60);
  for (const item of items) {
    const lines = s.doc.splitTextToSize(item, 176);
    pageBreak(s, 12);
    s.doc.setTextColor(...GOLD);
    s.doc.text("•", 14, s.y);
    s.doc.setTextColor(60, 60, 60);
    lines.forEach((line: string, idx: number) => {
      if (idx > 0) pageBreak(s, 10);
      s.doc.text(line, 19, s.y);
      s.y += 5;
    });
  }
  s.y += 3;
}

function table(s: DocState, head: string[], body: string[][]) {
  pageBreak(s, 40);
  autoTable(s.doc, {
    startY: s.y,
    head: [head],
    body,
    theme: "grid",
    styles: { fontSize: 8.5, cellPadding: 2, textColor: [50, 50, 50], lineColor: [220, 216, 205] },
    headStyles: { fillColor: [36, 36, 38], textColor: GOLD, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [250, 248, 243] },
    margin: { left: 14, right: 14 },
  });
  // @ts-expect-error lastAutoTable is added by the plugin
  s.y = (s.doc.lastAutoTable?.finalY ?? s.y) + 8;
}

function footer(doc: jsPDF) {
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(225, 220, 210);
    doc.line(14, 283, 196, 283);
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(
      `Trishul Metals & Alloys · ${company.email} · ${company.phone} · www.trishulmetal.com`,
      14,
      288,
    );
    doc.text(`Page ${i} of ${pages}`, 196, 288, { align: "right" });
    doc.setFontSize(6.5);
    doc.text(
      "Data is indicative and offered in good faith for design guidance. Confirm requirements against the governing standard and purchase specification.",
      14,
      292,
    );
  }
}

const save = (doc: jsPDF, name: string) => {
  footer(doc);
  doc.save(name);
};

export async function downloadMaterialDatasheet(m: Material) {
  const doc = new jsPDF();
  const y = await header(
    doc,
    `${m.name} — Technical Datasheet`,
    `${m.uns}${m.werkstoff ? ` · ${m.werkstoff}` : ""} — ${m.tagline}`,
  );
  const s: DocState = { doc, y };

  heading(s, "Grade overview");
  m.overview.forEach((p) => paragraph(s, p));

  heading(s, "Chemical composition (%)");
  table(s, ["Element", "Content"], m.composition.map((c) => [c.element, c.percent]));

  heading(s, "Mechanical properties");
  table(s, ["Property", "Value"], m.mechanical.map((r) => [r.label, r.value]));

  heading(s, "Physical properties");
  table(s, ["Property", "Value"], m.physical.map((r) => [r.label, r.value]));

  heading(s, "Corrosion behaviour");
  bullets(s, m.corrosion);

  heading(s, "Governing standards");
  table(s, ["Scope", "Standards"], [
    ["Flanges", (m.standards.flanges ?? []).join(", ") || "—"],
    ["Fittings", (m.standards.fittings ?? []).join(", ") || "—"],
    ["Other product forms", (m.standards.other ?? []).join(", ") || "—"],
  ]);

  heading(s, "Typical applications");
  bullets(s, m.applications);

  if (m.maxTemp) {
    heading(s, "Service limit");
    paragraph(s, m.maxTemp);
  }

  save(doc, `Trishul-${m.slug}-datasheet.pdf`);
}

export async function downloadProductDatasheet(p: ProductType) {
  const doc = new jsPDF();
  const y = await header(doc, `${p.name} — Product Specification`, p.tagline);
  const s: DocState = { doc, y };

  heading(s, "Description");
  p.overview.forEach((par) => paragraph(s, par));

  heading(s, "Supply specification");
  table(s, ["Parameter", "Range"], p.specs.map((sp) => [sp.label, sp.value]));

  heading(s, "Governing standards");
  bullets(s, p.standards);

  heading(s, "Design features");
  bullets(s, p.features);

  heading(s, "Applications");
  bullets(s, p.applications);

  save(doc, `Trishul-${p.slug}-specification.pdf`);
}

export async function downloadIndustryDatasheet(i: Industry) {
  const doc = new jsPDF();
  const y = await header(doc, `${i.name} — Material & Supply Guide`, i.tagline);
  const s: DocState = { doc, y };

  heading(s, "Sector summary");
  paragraph(s, i.summary);

  const blocks: [string, string[]][] = [
    ["Service conditions", i.environment],
    ["Preferred alloys", i.alloys],
    ["Products supplied", i.products],
    ["Standards applied", i.standards],
    ["Procurement checkpoints", i.procurement],
    ["Testing and inspection", i.testing],
  ];
  blocks.forEach(([title, items]) => {
    heading(s, title);
    bullets(s, items);
  });

  save(doc, `Trishul-${i.slug}-industry-guide.pdf`);
}

export async function downloadMatrixDatasheet(m: Material, p: ProductType, spec: string) {
  const doc = new jsPDF();
  const y = await header(
    doc,
    `${m.name} ${p.name}`,
    `${m.uns}${m.werkstoff ? ` · ${m.werkstoff}` : ""} — supplied to ${spec}`,
  );
  const s: DocState = { doc, y };

  heading(s, "Scope of supply");
  paragraph(
    s,
    `Trishul Metals & Alloys supplies ${p.name.toLowerCase()} in ${m.name} (${m.uns}) to ${spec} and the dimensional standards listed below, with EN 10204 3.1 or 3.2 certification and full heat traceability.`,
  );
  p.overview.slice(0, 2).forEach((par) => paragraph(s, par));

  heading(s, "Product specification");
  table(s, ["Parameter", "Range"], p.specs.map((sp) => [sp.label, sp.value]));

  heading(s, "Material data");
  table(s, ["Element", "Content"], m.composition.map((c) => [c.element, c.percent]));
  table(s, ["Mechanical property", "Value"], m.mechanical.map((r) => [r.label, r.value]));

  heading(s, "Corrosion behaviour");
  bullets(s, m.corrosion);

  heading(s, "Standards");
  bullets(s, [`Material specification: ${spec}`, ...p.standards]);

  heading(s, "Typical applications");
  bullets(s, Array.from(new Set([...p.applications, ...m.applications])).slice(0, 10));

  save(doc, `Trishul-${m.slug}-${p.slug}.pdf`);
}

export interface ComparableRow {
  label: string;
  values: string[];
}

export async function downloadComparisonSheet(titles: string[], rows: ComparableRow[]) {
  const doc = new jsPDF({ orientation: titles.length > 2 ? "landscape" : "portrait" });
  const y = await header(doc, "Shortlist Comparison Sheet", titles.join("  |  "));
  const s: DocState = { doc, y };
  table(s, ["Property", ...titles], rows.map((r) => [r.label, ...r.values]));
  save(doc, "Trishul-comparison-sheet.pdf");
}

const REDACTED = "\u0000REDACTED";

/** jsPDF standard fonts are WinAnsi — map glyphs they cannot render. */
function ansi(v: string): string {
  return v
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/−/g, "-")
    .replace(/–/g, "-")
    .replace(/—/g, "-")
    .replace(/·/g, "-")
    .replace(/’/g, "'");
}

export async function downloadMtcSpecimen() {
  const doc = new jsPDF();
  const y = await header(
    doc,
    "Inspection Certificate EN 10204 Type 3.1 - Specimen",
    `${company.name}, Mumbai, India  |  Certificate no. ${mtcSpecimen.certPrefix}[redacted]`,
  );
  const s: DocState = { doc, y };

  // Specimen stamp
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(14, s.y - 4, 96, 9, 1, 1, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GOLD);
  doc.text("SPECIMEN - CUSTOMER DATA REDACTED", 18, s.y + 2);
  s.y += 14;

  heading(s, "Order & material summary");
  pageBreak(s, 60);
  autoTable(doc, {
    startY: s.y,
    head: [["Field", "Detail"]],
    body: mtcSpecimen.summary.map((r) => [ansi(r.label), r.value ? ansi(r.value) : REDACTED]),
    theme: "grid",
    styles: { fontSize: 8.5, cellPadding: 2, textColor: [50, 50, 50], lineColor: [220, 216, 205] },
    headStyles: { fillColor: [36, 36, 38], textColor: GOLD, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [250, 248, 243] },
    columnStyles: { 0: { cellWidth: 55 } },
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      if (data.section === "body" && data.cell.raw === REDACTED) data.cell.text = [""];
    },
    didDrawCell: (data) => {
      if (data.section === "body" && data.cell.raw === REDACTED) {
        doc.setFillColor(150, 150, 150);
        doc.rect(data.cell.x + 2, data.cell.y + data.cell.height / 2 - 1.4, 34, 2.8, "F");
      }
    },
  });
  // @ts-expect-error lastAutoTable is added by the plugin
  s.y = (doc.lastAutoTable?.finalY ?? s.y) + 8;

  heading(s, "Chemical composition (%)");
  table(s, ["Element", "Result", "Specified"], mtcSpecimen.chem.map((r) => r.map(ansi)));

  pageBreak(s, 75);
  heading(s, "Mechanical & physical results");
  table(s, ["Property", "Result", "Specified"], mtcSpecimen.mech.map((r) => r.map(ansi)));

  pageBreak(s, 70);
  heading(s, "Testing & inspection");
  table(s, ["Test", "Method", "Result"], mtcSpecimen.tests.map((r) => r.map(ansi)));

  pageBreak(s, 60);
  heading(s, "Declaration");
  paragraph(s, ansi(mtcSpecimen.declaration));

  pageBreak(s, 32);
  s.y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...INK);
  doc.text("AUTHORISED SIGNATORY", 14, s.y);
  doc.setFillColor(150, 150, 150);
  doc.rect(14, s.y + 5, 46, 3, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text(`Quality Assurance - ${company.shortName}`, 14, s.y + 15);
  s.y += 20;

  save(doc, "Trishul-Metals-Specimen-MTC-EN10204-3.1.pdf");
}

/* ---------------------------------------------------------------- */
/* PMI and TPI specimen reports                                      */
/* ---------------------------------------------------------------- */

function specimenStamp(doc: jsPDF, s: DocState, label: string) {
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(14, s.y - 4, 96, 9, 1, 1, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GOLD);
  doc.text(label, 18, s.y + 2);
  s.y += 14;
}

function summaryTable(doc: jsPDF, s: DocState, rows: { label: string; value: string | null }[]) {
  autoTable(doc, {
    startY: s.y,
    head: [["Field", "Detail"]],
    body: rows.map((r) => [ansi(r.label), r.value ? ansi(r.value) : REDACTED]),
    theme: "grid",
    styles: { fontSize: 8.5, cellPadding: 2, textColor: [50, 50, 50], lineColor: [220, 216, 205] },
    headStyles: { fillColor: [36, 36, 38], textColor: GOLD, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [250, 248, 243] },
    columnStyles: { 0: { cellWidth: 55 } },
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      if (data.section === "body" && data.cell.raw === REDACTED) data.cell.text = [""];
    },
    didDrawCell: (data) => {
      if (data.section === "body" && data.cell.raw === REDACTED) {
        doc.setFillColor(150, 150, 150);
        doc.rect(data.cell.x + 2, data.cell.y + data.cell.height / 2 - 1.4, 34, 2.8, "F");
      }
    },
  });
  // @ts-expect-error lastAutoTable is added by the plugin
  s.y = (doc.lastAutoTable?.finalY ?? s.y) + 8;
}

function signature(doc: jsPDF, s: DocState, role: string) {
  pageBreak(s, 32);
  s.y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...INK);
  doc.text("AUTHORISED SIGNATORY", 14, s.y);
  doc.setFillColor(150, 150, 150);
  doc.rect(14, s.y + 5, 46, 3, "F");
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text(ansi(role), 14, s.y + 15);
  s.y += 20;
}

export async function downloadPmiSpecimen() {
  const doc = new jsPDF();
  const y = await header(
    doc,
    "Positive Material Identification Report - Specimen",
    `${company.name}, Mumbai, India  |  Report no. ${pmiSpecimen.reportNo}`,
  );
  const s: DocState = { doc, y };
  specimenStamp(doc, s, "SPECIMEN - CUSTOMER DATA REDACTED");

  heading(s, "Inspection summary");
  summaryTable(doc, s, pmiSpecimen.summary);

  heading(s, "Method");
  paragraph(s, ansi(`${pmiSpecimen.method}. Coverage: ${pmiSpecimen.coverage}.`));

  pageBreak(s, 75);
  heading(s, "Measured alloying content (%)");
  table(s, ["Element", "Measured", "Specified", "Result"], pmiSpecimen.readings.map((r) => r.map(ansi)));

  pageBreak(s, 50);
  heading(s, "Declaration");
  paragraph(s, ansi(pmiSpecimen.declaration));

  signature(doc, s, `Quality Assurance - ${company.shortName}`);
  save(doc, "Trishul-Metals-Specimen-PMI-Report.pdf");
}

export async function downloadTpiSpecimen() {
  const doc = new jsPDF();
  const y = await header(
    doc,
    "Third-Party Inspection Release Note - Specimen",
    `${company.name}, Mumbai, India  |  Report no. ${tpiSpecimen.reportNo}`,
  );
  const s: DocState = { doc, y };
  specimenStamp(doc, s, "SPECIMEN - CLIENT & AGENCY REDACTED");

  heading(s, "Release summary");
  summaryTable(doc, s, tpiSpecimen.summary);

  heading(s, "Witnessed activities");
  table(s, ["Activity", "Reference", "Result"], tpiSpecimen.activities.map((r) => r.map(ansi)));

  pageBreak(s, 50);
  heading(s, "Declaration");
  paragraph(s, ansi(`${tpiSpecimen.declaration} Scope issued under ${tpiSpecimen.standard}.`));

  signature(doc, s, "Inspector - independent agency (redacted)");
  save(doc, "Trishul-Metals-Specimen-TPI-Release-Note.pdf");
}

export async function downloadPackingSpecimen() {
  const doc = new jsPDF();
  const y = await header(
    doc,
    "Export Packing List & Marking Sheet - Specimen",
    `${company.name}, Mumbai, India  |  Document no. ${packingSpecimen.docNo}  |  ${packingSpecimen.incoterm}`,
  );
  const s: DocState = { doc, y };
  specimenStamp(doc, s, "SPECIMEN - BUYER DETAILS REDACTED");

  heading(s, "Consignment summary");
  summaryTable(doc, s, packingSpecimen.summary);

  heading(s, "Case-wise packing list");
  table(
    s,
    ["Case", "Description", "Heat no.", "Quantity", "Net wt.", "Gross wt."],
    packingSpecimen.lines.map((l) => [l.case_, l.description, l.heat, l.qty, l.net, l.gross].map(ansi)),
  );

  pageBreak(s, 70);
  heading(s, "Packing, preservation & marking standard");
  table(s, ["Item", "Standard applied"], packingSpecs.map((p) => [ansi(p.label), ansi(p.detail)]));

  pageBreak(s, 50);
  heading(s, "Declaration");
  paragraph(s, ansi(packingSpecimen.declaration));

  signature(doc, s, "Despatch & export documentation");
  save(doc, "Trishul-Metals-Specimen-Packing-List.pdf");
}
