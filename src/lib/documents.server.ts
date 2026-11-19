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

  const { run } = await import("../../server/db/connection.js");
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  try {
    await run(
      `INSERT INTO document_downloads (id, doc_id, email, name, company, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, doc.key, input.email, input.name || null, input.company || null, now]
    );
  } catch (dbErr) {
    console.warn("[Document Download DB Warning]:", dbErr);
  }

  // Provide direct document link
  const signedUrl = `/${doc.bucketPath}`;

  return { ok: true as const, signedUrl, fileName: `${doc.key}.pdf`, title: doc.title, emailSent: false, emailNote: "" };
}
