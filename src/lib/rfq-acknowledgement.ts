import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoAsset from "@/assets/brand/trishul-metals-logo.png.asset.json";
import { company } from "@/data/company";

export interface RfqAcknowledgement {
  reference: string;
  createdAt: string;
  company: string;
  contactName: string;
  email: string;
  phone: string | null;
  country: string | null;
  projectName: string | null;
  incoterm: string | null;
  deliveryPort: string | null;
  targetLeadTime: string | null;
  message: string | null;
  certification: string | null;
  testing: string[];
  items: Array<{
    material: string;
    product: string;
    size: string;
    rating: string;
    facing?: string;
    quantity: string;
    unit: string;
    cutLength: string;
    processing: string[];
  }>;
  attachments: Array<{ name: string; size: number }>;
}

let logoPromise: Promise<string> | undefined;

function getLogo() {
  if (!logoPromise) {
    logoPromise = fetch(logoAsset.url)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load the document logo.");
        return response.blob();
      })
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Invalid logo data."));
            reader.onerror = () => reject(new Error("Unable to read the document logo."));
            reader.readAsDataURL(blob);
          }),
      );
  }
  return logoPromise;
}

const clean = (value: string | null | undefined) => value?.trim() || "—";

export async function downloadRfqAcknowledgement(rfq: RfqAcknowledgement) {
  const doc = new jsPDF();
  doc.setFillColor(24, 24, 26);
  doc.rect(0, 0, 210, 32, "F");
  doc.addImage(await getLogo(), "PNG", 14, 5, 58, 20, undefined, "FAST");
  doc.setTextColor(220, 220, 220);
  doc.setFontSize(8);
  doc.text("RFQ ACKNOWLEDGEMENT", 196, 13, { align: "right" });
  doc.text(`Mumbai, India  |  ${company.email}`, 196, 20, { align: "right" });

  doc.setTextColor(26, 26, 26);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`Enquiry ${rfq.reference}`, 14, 45);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Received ${new Date(rfq.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`, 14, 52);
  doc.setDrawColor(201, 165, 90);
  doc.setLineWidth(0.6);
  doc.line(14, 57, 196, 57);

  autoTable(doc, {
    startY: 64,
    head: [["Customer", "Project & delivery"]],
    body: [[
      `${rfq.company}\n${rfq.contactName}\n${rfq.email}${rfq.phone ? `\n${rfq.phone}` : ""}${rfq.country ? `\n${rfq.country}` : ""}`,
      `Project: ${clean(rfq.projectName)}\nIncoterm: ${clean(rfq.incoterm)}\nDestination: ${clean(rfq.deliveryPort)}\nRequired delivery: ${clean(rfq.targetLeadTime)}`,
    ]],
    theme: "grid",
    styles: { fontSize: 8.5, cellPadding: 3, lineColor: [220, 216, 205], textColor: [50, 50, 50] },
    headStyles: { fillColor: [36, 36, 38], textColor: [201, 165, 90] },
    margin: { left: 14, right: 14 },
  });

  autoTable(doc, {
    // @ts-expect-error provided by jspdf-autotable
    startY: (doc.lastAutoTable?.finalY ?? 95) + 8,
    head: [["Grade / material", "Product", "Size / class", "Qty", "Processing"]],
    body: rfq.items.map((item) => [
      clean(item.material),
      clean(item.product),
      [item.size, item.rating, item.facing, item.cutLength ? `Cut: ${item.cutLength}` : ""].filter(Boolean).join("\n") || "—",
      `${clean(item.quantity)} ${clean(item.unit)}`,
      item.processing.join(", ") || "—",
    ]),
    theme: "grid",
    styles: { fontSize: 7.5, cellPadding: 2.5, lineColor: [220, 216, 205], textColor: [50, 50, 50] },
    headStyles: { fillColor: [36, 36, 38], textColor: [201, 165, 90] },
    alternateRowStyles: { fillColor: [250, 248, 243] },
    margin: { left: 14, right: 14 },
  });

  // @ts-expect-error provided by jspdf-autotable
  let y = (doc.lastAutoTable?.finalY ?? 145) + 10;
  const detailLines = [
    `Certification: ${clean(rfq.certification)}`,
    `Testing: ${rfq.testing.join(", ") || "Not specified"}`,
    `Files received: ${rfq.attachments.map((file) => file.name).join(", ") || "None"}`,
    `Notes: ${clean(rfq.message)}`,
  ];
  doc.setFontSize(9);
  doc.setTextColor(55, 55, 55);
  for (const line of detailLines) {
    const wrapped = doc.splitTextToSize(line, 182);
    if (y + wrapped.length * 5 > 260) {
      doc.addPage();
      y = 20;
    }
    doc.text(wrapped, 14, y);
    y += wrapped.length * 5 + 3;
  }

  if (y > 235) {
    doc.addPage();
    y = 24;
  }
  doc.setFillColor(247, 244, 236);
  doc.rect(14, y, 182, 28, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 26, 26);
  doc.text("Commercial review status", 19, y + 8);
  doc.setFont("helvetica", "normal");
  doc.text("Estimated landed cost: pending specification review.", 19, y + 15);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("This is an acknowledgement of your enquiry, not a quotation, offer, or price commitment.", 19, y + 22);

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(225, 220, 210);
    doc.line(14, 283, 196, 283);
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 110);
    doc.text(`${company.name}  |  ${company.phone}  |  www.trishulmetal.com`, 14, 288);
    doc.text(`Page ${page} of ${pages}`, 196, 288, { align: "right" });
  }
  doc.save(`${rfq.reference}-RFQ-acknowledgement.pdf`);
}