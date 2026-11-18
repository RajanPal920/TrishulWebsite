import { z } from "zod";

export type DownloadableDocument = {
  key: string;
  title: string;
  bucketPath: string;
};

export const DOCUMENT_REGISTRY: Record<string, DownloadableDocument> = {
  "product-catalogue-2026": {
    key: "product-catalogue-2026",
    title: "Product Catalogue 2026",
    bucketPath: "resources/product-catalogue-2026.pdf",
  },
  "technical-guide": {
    key: "technical-guide",
    title: "Technical Guide",
    bucketPath: "resources/technical-guide.pdf",
  },
  "iso-9001": {
    key: "iso-9001",
    title: "ISO 9001:2015 Certificate",
    bucketPath: "certificates/iso-9001.pdf",
  },
  "iec-code": {
    key: "iec-code",
    title: "Importer-Exporter Code (IEC) Certificate",
    bucketPath: "certificates/iec-code.pdf",
  },
  "gst-certificate": {
    key: "gst-certificate",
    title: "GST Registration Certificate",
    bucketPath: "certificates/gst-certificate.pdf",
  },
  "udyam-registration": {
    key: "udyam-registration",
    title: "MSME / Udyam Registration Certificate",
    bucketPath: "certificates/udyam-registration.pdf",
  },
  "dpiit-recognition": {
    key: "dpiit-recognition",
    title: "Startup India — DPIIT Recognition Certificate",
    bucketPath: "certificates/dpiit-recognition.pdf",
  },
  "ciffa-certificate": {
    key: "ciffa-certificate",
    title: "CIFFA International Freight Forwarding Certificate",
    bucketPath: "certificates/ciffa-certificate.pdf",
  },
};

export const documentDownloadSchema = z.object({
  documentKey: z.string().min(1).max(120),
  name: z.string().max(200).optional().default(""),
  company: z.string().max(200).optional().default(""),
  email: z.string().email().max(200),
  phone: z.string().min(6).max(40),
  userAgent: z.string().max(500).optional().default(""),
  referrer: z.string().max(500).optional().default(""),
});

export type DocumentDownloadInput = z.infer<typeof documentDownloadSchema>;

const NOTIFY_TO = "contactustrishul@gmail.com";

export async function handleDocumentDownload(input: DocumentDownloadInput) {
  const doc = DOCUMENT_REGISTRY[input.documentKey];
  if (!doc) throw new Error("Unknown document requested.");

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { error: insertError } = await supabaseAdmin.from("document_downloads").insert({
    document_key: doc.key,
    document_title: doc.title,
    name: input.name || null,
    company: input.company || null,
    email: input.email,
    phone: input.phone,
    user_agent: input.userAgent || null,
    referrer: input.referrer || null,
  });
  if (insertError) throw new Error("Could not process your download. Please email us directly.");

  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .createSignedUrl(doc.bucketPath, 120);
  if (error || !data?.signedUrl) throw new Error("Document is temporarily unavailable.");

  let emailSent = false;
  let emailNote = "";
  try {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("email not configured");
    const { sendLovableEmail } = await import("@lovable.dev/email-js");
    const when = new Date().toISOString();
    const lines = [
      `Name: ${input.name || "—"}`,
      `Company: ${input.company || "—"}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone}`,
      `Time (UTC): ${when}`,
      `Referrer: ${input.referrer || "—"}`,
    ];
    await sendLovableEmail(
      {
        to: NOTIFY_TO,
        from: "notifications@trishulmetal.com",
        subject: `Document downloaded: ${doc.title}`,
        html: `<p><strong>${doc.title}</strong> was downloaded.</p><ul>${lines
          .map((l) => `<li>${l}</li>`)
          .join("")}</ul>`,
        text: `${doc.title} was downloaded.\n${lines.join("\n")}`,
        purpose: "transactional",
        idempotency_key: `dl-${doc.key}-${input.email}-${when}`,
      },
      { apiKey },
    );
    emailSent = true;
  } catch (e) {
    emailNote = e instanceof Error ? e.message : "email unavailable";
    console.warn("[document-download] notification email skipped:", emailNote);
  }

  return { ok: true as const, signedUrl: data.signedUrl, fileName: `${doc.key}.pdf`, title: doc.title, emailSent, emailNote };
}
