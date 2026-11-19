import { z } from "zod";

export const cadDownloadSchema = z.object({
  partCode: z.string().min(1).max(120),
  family: z.string().min(1).max(120),
  standard: z.string().max(120).optional().default(""),
  size: z.string().max(60).optional().default(""),
  spec: z.string().max(60).optional().default(""),
  facing: z.string().max(20).optional().default(""),
  material: z.string().max(60).optional().default(""),
  format: z.string().min(1).max(20),
  name: z.string().max(200).optional().default(""),
  company: z.string().max(200).optional().default(""),
  email: z.string().email().max(200),
  phone: z.string().min(6).max(40),
  userAgent: z.string().max(500).optional().default(""),
  referrer: z.string().max(500).optional().default(""),
});

export type CadDownloadInput = z.infer<typeof cadDownloadSchema>;

const NOTIFY_TO = "contactustrishul@gmail.com";

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function handleCadDownload(input: CadDownloadInput) {
  const { run } = await import("../../server/db/connection.js");
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    await run(
      `INSERT INTO cad_downloads (id, part_code, email, name, company, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, input.partCode, input.email, input.name || null, input.company || null, now]
    );
  } catch (dbErr) {
    console.warn("[CAD Download DB Warning]:", dbErr);
  }

  try {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("email not configured");
    const { sendLovableEmail } = await import("@lovable.dev/email-js");
    const when = new Date().toISOString();
    const rows: [string, string][] = [
      ["Part code", input.partCode],
      ["Family", input.family],
      ["Standard", input.standard || "—"],
      ["Size", input.size || "—"],
      ["Class / schedule", input.spec || "—"],
      ["Facing", input.facing || "—"],
      ["Material", input.material || "—"],
      ["Format", input.format.toUpperCase()],
      ["Name", input.name || "—"],
      ["Company", input.company || "—"],
      ["Email", input.email],
      ["Phone", input.phone],
      ["Time (UTC)", when],
      ["Referrer", input.referrer || "—"],
    ];
    await sendLovableEmail(
      {
        to: NOTIFY_TO,
        from: "notifications@trishulmetal.com",
        subject: `CAD lead: ${input.partCode} (${input.format.toUpperCase()})`,
        html: `<p>A buyer unlocked a CAD download.</p><ul>${rows
          .map(([k, v]) => `<li><strong>${escape(k)}:</strong> ${escape(v)}</li>`)
          .join("")}</ul>`,
        text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
        purpose: "transactional",
        idempotency_key: `cad-${input.partCode}-${input.format}-${input.email}-${when}`,
      },
      { apiKey },
    );
  } catch (e) {
    console.warn("[cad-download] notification email skipped:", e instanceof Error ? e.message : e);
  }

  return { ok: true as const };
}
