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
  const reference = makeReference();
  const confirmationToken = crypto.randomUUID();

  const stored: { name: string; path: string; size: number }[] = [];
  for (const file of input.attachments) {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED.includes(ext)) continue;
    const path = `${reference}/${file.name.replace(/[^\w.\-]+/g, "_")}`;
    stored.push({ name: file.name, path, size: file.size });
  }

  const { run } = await import("../../server/db/connection.js");
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    await run(
      `INSERT INTO rfq_requests (
        id, reference, confirmation_token, company, contact_name,
        email, phone, country, incoterm, delivery_port, target_lead_time,
        project_name, message, certification, testing, items, attachments,
        status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', ?)`,
      [
        id,
        reference,
        confirmationToken,
        input.company,
        input.contactName,
        input.email,
        input.phone || null,
        input.country || null,
        input.incoterm || null,
        input.deliveryPort || null,
        input.targetLeadTime || null,
        input.projectName || null,
        input.message || null,
        input.certification || null,
        JSON.stringify(input.testing || []),
        JSON.stringify(input.items || []),
        JSON.stringify(stored),
        now,
      ]
    );
  } catch (dbErr) {
    console.error("[RFQ Save Error]:", dbErr);
    throw new Error("Could not save your enquiry. Please email us directly.");
  }

  return { reference, confirmationToken };
}
