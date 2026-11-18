import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoAsset from "@/assets/brand/trishul-metals-logo.png.asset.json";
import { company } from "@/data/company";
import type { RfqAcknowledgement } from "@/lib/rfq-acknowledgement";

let logoPromise: Promise<string> | undefined;

function getLogo() {
  if (!logoPromise) {
    logoPromise = fetch(logoAsset.url)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load the quotation logo.");
        return response.blob();
      })
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Invalid logo data."));
            reader.onerror = () => reject(new Error("Unable to read the quotation logo."));
            reader.readAsDataURL(blob);
          }),
      );
  }
  return logoPromise;
}

const clean = (value: string | null | undefined) => value?.trim() || "-";

export async function downloadRfqQuotation(rfq: RfqAcknowledgement) {
  const doc = new jsPDF();
  const logo = await getLogo();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const drawHeader = () => {
    doc.setFillColor(24, 24, 26);
    doc.rect(0, 0, pageWidth, 34, "F");
    doc.addImage(logo, "PNG", 14, 5, 58, 20, undefined, "FAST");
    doc.setTextColor(220, 220, 220);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("PRELIMINARY QUOTATION", pageWidth - 14, 12, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(`${company.phone}  |  ${company.email}`, pageWidth - 14, 19, { align: "right" });
    doc.text("Mumbai, India", pageWidth - 14, 25, { align: "right" });
  };

  const drawFooter = (page: number, pages: number) => {
    doc.setDrawColor(225, 220, 210);
    doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(105, 105, 105);
    doc.text(`${company.name}  |  www.trishulmetal.com`, 14, pageHeight - 9);
    doc.text(`Page ${page} of ${pages}`, pageWidth - 14, pageHeight - 9, { align: "right" });
  };

  drawHeader();
  doc.setTextColor(26, 26, 26);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`Quotation ${rfq.reference}`, 14, 47);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(95, 95, 95);
  doc.text(`Issued ${new Date(rfq.createdAt).toLocaleDateString("en-GB", { dateStyle: "long" })}`, 14, 54);
  doc.setDrawColor(201, 165, 90);
  doc.setLineWidth(0.6);
  doc.line(14, 59, pageWidth - 14, 59);

  autoTable(doc, {
    startY: 65,
    head: [["Prepared for", "Project & delivery"]],
    body: [[
      `${rfq.company}\nAttn: ${rfq.contactName}\n${rfq.email}${rfq.phone ? `\n${rfq.phone}` : ""}${rfq.country ? `\n${rfq.country}` : ""}`,
      `Project: ${clean(rfq.projectName)}\nIncoterm: ${clean(rfq.incoterm)}\nDestination: ${clean(rfq.deliveryPort)}\nRequired delivery: ${clean(rfq.targetLeadTime)}`,
    ]],
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 3, lineColor: [220, 216, 205], textColor: [50, 50, 50] },
    headStyles: { fillColor: [36, 36, 38], textColor: [201, 165, 90] },
    margin: { left: 14, right: 14 },
  });

  autoTable(doc, {
    // @ts-expect-error provided by jspdf-autotable
    startY: (doc.lastAutoTable?.finalY ?? 98) + 8,
    head: [["Grade", "Product", "Size", "Class / schedule", "Facing", "Qty", "Processing"]],
    body: rfq.items.map((item) => [
      clean(item.material),
      clean(item.product),
      clean(item.size),
      clean(item.rating),
      clean(item.facing),
      `${clean(item.quantity)} ${clean(item.unit)}`,
      [item.cutLength ? `Cut: ${item.cutLength}` : "", ...item.processing].filter(Boolean).join(", ") || "-",
    ]),
    theme: "grid",
    styles: { fontSize: 6.7, cellPadding: 2, lineColor: [220, 216, 205], textColor: [48, 48, 48], overflow: "linebreak" },
    headStyles: { fillColor: [36, 36, 38], textColor: [201, 165, 90], fontSize: 6.5 },
    alternateRowStyles: { fillColor: [250, 248, 243] },
    columnStyles: {
      0: { cellWidth: 27 },
      1: { cellWidth: 25 },
      2: { cellWidth: 24 },
      3: { cellWidth: 25 },
      4: { cellWidth: 17 },
      5: { cellWidth: 18 },
      6: { cellWidth: 46 },
    },
    margin: { top: 40, left: 14, right: 14, bottom: 22 },
    didDrawPage: () => drawHeader(),
  });

  // @ts-expect-error provided by jspdf-autotable
  let y = (doc.lastAutoTable?.finalY ?? 150) + 8;
  const ensureSpace = (height: number) => {
    if (y + height <= pageHeight - 22) return;
    doc.addPage();
    drawHeader();
    y = 44;
  };

  const details: Array<{ label: string; value: string }> = [
    { label: "Certification", value: clean(rfq.certification) },
    { label: "Testing / inspection", value: rfq.testing.join(", ") || "Not specified" },
    { label: "Files received", value: rfq.attachments.map((file) => file.name).join(", ") || "None" },
    { label: "Customer notes", value: clean(rfq.message) },
  ];
  doc.setFontSize(8.5);
  for (const { label, value } of details) {
    const wrapped = doc.splitTextToSize(`${label}: ${value}`, pageWidth - 28);
    ensureSpace(wrapped.length * 4.5 + 3);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(55, 55, 55);
    doc.text(`${label}:`, 14, y);
    doc.setFont("helvetica", "normal");
    const labelWidth = doc.getTextWidth(`${label}: `);
    const valueLines = doc.splitTextToSize(value, pageWidth - 28 - labelWidth);
    doc.text(valueLines, 14 + labelWidth, y);
    y += Math.max(1, valueLines.length) * 4.5 + 3;
  }

  ensureSpace(39);
  doc.setFillColor(247, 244, 236);
  doc.setDrawColor(201, 165, 90);
  doc.rect(14, y, pageWidth - 28, 31, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(26, 26, 26);
  doc.text("COMMERCIAL SUMMARY", 19, y + 8);
  doc.setFontSize(12);
  doc.setTextColor(160, 123, 42);
  doc.text("Landed cost: pending specification review", 19, y + 17);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(95, 95, 95);
  doc.text("This preliminary quotation template is not a binding offer or price commitment.", 19, y + 25);

  ensureSpace(39);
  y += 39;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(45, 45, 45);
  doc.text("TRISHUL METALS & ALLOYS", 14, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(90, 90, 90);
  const addressLines = [
    `Office: ${company.addressLine}`,
    `Warehouse: ${company.warehouseLine}`,
    `${company.email}  |  ${company.phone}  |  www.trishulmetal.com`,
  ];
  addressLines.forEach((line, index) => doc.text(doc.splitTextToSize(line, pageWidth - 28), 14, y + 5 + index * 5));

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    drawFooter(page, pages);
  }
  doc.save(`${rfq.reference}-preliminary-quotation.pdf`);
}