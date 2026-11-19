import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface PortalProfile {
  company: string;
  contact_name: string;
  phone: string | null;
  country: string | null;
  email?: string;
}

export interface ClientOrder {
  id: string;
  order_number: string;
  status: string;
  total_amount?: number;
  currency?: string;
  created_at: string;
}

export interface ClientDocument {
  id: string;
  title: string;
  document_type: string;
  storage_path: string;
  issued_on: string;
}

export interface RfqRequestRecord {
  id: string;
  reference: string;
  company: string;
  contact_name: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  incoterm?: string | null;
  delivery_port?: string | null;
  target_lead_time?: string | null;
  project_name?: string | null;
  message?: string | null;
  items: any;
  attachments: any;
  testing?: any;
  certification?: string | null;
  status: string;
  created_at: string;
  confirmation_token: string;
}

export interface PortalData {
  email: string;
  profile: PortalProfile | null;
  orders: ClientOrder[];
  lines: any[];
  documents: ClientDocument[];
  rfqs: RfqRequestRecord[];
}

export const getPortalData = createServerFn({ method: "GET" }).handler(async (): Promise<PortalData> => {
  try {
    const { all } = await import("../../server/db/connection.js");
    const rfqs = await all(
      `SELECT id, reference, company, contact_name, email, phone, country, incoterm, delivery_port,
              target_lead_time, project_name, message, items, attachments, testing, certification,
              status, created_at, confirmation_token
       FROM rfq_requests
       ORDER BY created_at DESC`
    );

    return {
      email: "portal@trishulmetal.com",
      profile: {
        company: "Trishul Metals & Alloys Client",
        contact_name: "Customer",
        phone: "",
        country: "India",
      },
      orders: [],
      lines: [],
      documents: [],
      rfqs: (rfqs ?? []).map((r: any) => ({
        ...r,
        items: typeof r.items === "string" ? JSON.parse(r.items) : (r.items || []),
        attachments: typeof r.attachments === "string" ? JSON.parse(r.attachments) : (r.attachments || []),
      })),
    };
  } catch (err) {
    console.warn("[Portal Data Fetch Warning]:", err);
    return {
      email: "portal@trishulmetal.com",
      profile: null,
      orders: [],
      lines: [],
      documents: [],
      rfqs: [],
    };
  }
});

const profileSchema = z.object({
  company: z.string().min(2).max(200),
  contactName: z.string().min(2).max(200),
  phone: z.string().max(60).default(""),
  country: z.string().max(120).default(""),
});

export const updateMyProfile = createServerFn({ method: "POST" })
  .validator((input: unknown) => profileSchema.parse(input))
  .handler(async () => {
    return { ok: true as const };
  });

export const getCertificateDownload = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ documentId: z.string() }).parse(input))
  .handler(async ({ data }) => {
    return { url: `/documents/${data.documentId}.pdf`, title: "Inspection Certificate" };
  });
