import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables } from "@/integrations/supabase/types";

export interface PortalProfile {
  company: string;
  contact_name: string;
  phone: string | null;
  country: string | null;
  email?: string;
}

export interface PortalData {
  email: string;
  profile: PortalProfile | null;
  orders: Tables<"client_orders">[];
  lines: Tables<"client_order_lines">[];
  documents: Tables<"client_documents">[];
  rfqs: Tables<"rfq_requests">[];
}

export const getPortalData = createServerFn({ method: "GET" }).handler(async (): Promise<PortalData> => {
  const [orders, lines, docs, rfqs] = await Promise.all([
    supabaseAdmin.from("client_orders").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("client_order_lines").select("*"),
    supabaseAdmin.from("client_documents").select("*").order("issued_on", { ascending: false }),
    supabaseAdmin
      .from("rfq_requests")
      .select(
        "id, reference, company, contact_name, email, phone, country, incoterm, delivery_port, target_lead_time, project_name, message, items, attachments, testing, certification, status, created_at, confirmation_token, owner_id",
      )
      .order("created_at", { ascending: false }),
  ]);

  return {
    email: "portal@trishulmetal.com",
    profile: {
      company: "Trishul Metals & Alloys Client",
      contact_name: "Customer",
      phone: "",
      country: "",
    },
    orders: orders.data ?? [],
    lines: lines.data ?? [],
    documents: docs.data ?? [],
    rfqs: (rfqs.data ?? []) as Tables<"rfq_requests">[],
  };
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
  .validator((input: unknown) => z.object({ documentId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: document, error } = await supabaseAdmin
      .from("client_documents")
      .select("title, storage_path")
      .eq("id", data.documentId)
      .single();

    if (error || !document?.storage_path) {
      throw new Error("A downloadable copy is not available yet.");
    }

    const signed = await supabaseAdmin.storage.from("documents").createSignedUrl(document.storage_path, 120);
    if (signed.error || !signed.data?.signedUrl) {
      throw new Error("The document is temporarily unavailable.");
    }
    return { url: signed.data.signedUrl, title: document.title };
  });
