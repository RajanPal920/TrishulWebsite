import { z } from "zod";

export const rfqLineSchema = z.object({
  material: z.string().max(120).default(""),
  product: z.string().max(120).default(""),
  size: z.string().max(120).default(""),
  rating: z.string().max(120).default(""),
  facing: z.string().max(120).default(""),
  quantity: z.coerce.string().max(60).default(""),
  unit: z.string().max(30).default("pcs"),
  cutLength: z.string().max(120).default(""),
  processing: z.array(z.string().max(80)).max(12).default([]),
});

export const rfqAttachmentSchema = z.object({
  name: z.string().max(200),
  type: z.string().max(120).default("application/octet-stream"),
  size: z.number().nonnegative().max(25 * 1024 * 1024),
  data: z.string().max(36_000_000),
});


export const rfqSchema = z.object({
  company: z.string().min(2).max(200),
  contactName: z.string().min(2).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(60).optional().default(""),
  country: z.string().max(120).optional().default(""),
  incoterm: z.string().max(60).optional().default(""),
  deliveryPort: z.string().max(160).optional().default(""),
  targetLeadTime: z.string().max(120).optional().default(""),
  projectName: z.string().max(200).optional().default(""),
  message: z.string().max(4000).optional().default(""),
  testing: z.array(z.string().max(80)).max(20).default([]),
  certification: z.string().max(120).optional().default(""),
  items: z.array(rfqLineSchema).min(1).max(25),
  attachments: z.array(rfqAttachmentSchema).max(10).default([]),
});

export type RfqInput = z.infer<typeof rfqSchema>;

const ALLOWED = [
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


function base64ToBytes(b64: string): Uint8Array {
  const clean = b64.includes(",") ? b64.slice(b64.indexOf(",") + 1) : b64;
  const bin = atob(clean);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function makeReference(): string {
  const d = new Date();
  const stamp = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TMA-${stamp}-${rand}`;
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function persistRfq(input: RfqInput): Promise<{ reference: string; confirmationToken: string }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const reference = makeReference();
  const confirmationToken = crypto.randomUUID();

  const stored: { name: string; path: string; size: number }[] = [];
  for (const file of input.attachments) {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED.includes(ext)) continue;
    const path = `${reference}/${file.name.replace(/[^\w.\-]+/g, "_")}`;
    const { error } = await supabaseAdmin.storage
      .from("rfq-uploads")
      .upload(path, base64ToBytes(file.data), {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });
    if (!error) stored.push({ name: file.name, path, size: file.size });
  }

  const { error } = await supabaseAdmin.from("rfq_requests").insert({
    reference,
    confirmation_token: confirmationToken,
    company: input.company,
    contact_name: input.contactName,
    email: input.email,
    phone: input.phone || null,
    country: input.country || null,
    incoterm: input.incoterm || null,
    delivery_port: input.deliveryPort || null,
    target_lead_time: input.targetLeadTime || null,
    project_name: input.projectName || null,
    message: input.message || null,
    certification: input.certification || null,
    testing: input.testing,
    items: input.items,
    attachments: stored,
  });

  if (error) throw new Error("Could not save your enquiry. Please email us directly.");

  try {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Email service is not configured.");
    const { sendLovableEmail } = await import("@lovable.dev/email-js");
    const itemRows = input.items
      .map(
        (item, index) =>
          `<tr><td>${index + 1}</td><td>${escapeHtml(item.material || "—")}</td><td>${escapeHtml(item.product || "—")}</td><td>${escapeHtml(item.size || "—")}</td><td>${escapeHtml(item.rating || "—")}</td><td>${escapeHtml(item.facing || "—")}</td><td>${escapeHtml(`${item.quantity || "—"} ${item.unit || "pcs"}`)}</td><td>${escapeHtml(item.processing.join(", ") || "—")}</td></tr>`,
      )
      .join("");
    const confirmationUrl = `https://www.trishulmetal.com/rfq/confirmation?token=${confirmationToken}`;
    await sendLovableEmail(
      {
        to: "contactustrishul@gmail.com",
        from: "notifications@trishulmetal.com",
        subject: `New RFQ ${reference} — ${input.company}`,
        html: `<h2>New quotation request ${reference}</h2><p><strong>${escapeHtml(input.company)}</strong><br>${escapeHtml(input.contactName)} · ${escapeHtml(input.email)} · ${escapeHtml(input.phone || "No phone")}</p><p>Project: ${escapeHtml(input.projectName || "—")}<br>Delivery: ${escapeHtml([input.incoterm, input.deliveryPort, input.targetLeadTime].filter(Boolean).join(" · ") || "—")}<br>Certification: ${escapeHtml(input.certification || "—")}<br>Testing: ${escapeHtml(input.testing.join(", ") || "—")}</p><table border="1" cellpadding="6" cellspacing="0"><thead><tr><th>#</th><th>Grade</th><th>Product</th><th>Size</th><th>Class / schedule</th><th>Facing</th><th>Quantity</th><th>Processing</th></tr></thead><tbody>${itemRows}</tbody></table><p>Files: ${escapeHtml(stored.map((file) => file.name).join(", ") || "None")}</p><p>Notes: ${escapeHtml(input.message || "—")}</p><p><a href="${confirmationUrl}">Open acknowledgement</a></p>`,
        text: `New quotation request ${reference}\n${input.company}\n${input.contactName} · ${input.email} · ${input.phone || "No phone"}\nProject: ${input.projectName || "—"}\nDelivery: ${[input.incoterm, input.deliveryPort, input.targetLeadTime].filter(Boolean).join(" · ") || "—"}\nCertification: ${input.certification || "—"}\nTesting: ${input.testing.join(", ") || "—"}\n\n${input.items.map((item, index) => `${index + 1}. ${item.material} | ${item.product} | ${item.size} | ${item.rating || "No class/schedule"} | ${item.facing || "No facing"} | ${item.quantity} ${item.unit} | ${item.processing.join(", ") || "No processing"}`).join("\n")}\n\nFiles: ${stored.map((file) => file.name).join(", ") || "None"}\nNotes: ${input.message || "—"}\n${confirmationUrl}`,
        purpose: "transactional",
        idempotency_key: `rfq-notify-${reference}`,
      },
      { apiKey },
    );
  } catch (emailError) {
    console.warn("[rfq] inbox notification skipped:", emailError instanceof Error ? emailError.message : "Unavailable");
  }

  return { reference, confirmationToken };
}
