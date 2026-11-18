import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getPortalData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: identity, error: identityError } = await context.supabase.auth.getUser();
    const email = identity.user?.email;
    if (identityError || !email) throw new Error("Your session could not be verified.");

    const metadata = (identity.user.user_metadata as Record<string, unknown>) || {};
    const company = typeof metadata["company_name"] === "string" ? metadata["company_name"] : "";
    const contactName =
      typeof metadata["contact_name"] === "string"
        ? metadata["contact_name"]
        : typeof metadata["full_name"] === "string"
          ? metadata["full_name"]
          : typeof metadata["name"] === "string"
            ? metadata["name"]
            : "";
    await context.supabase.from("profiles").upsert(
      { id: context.userId, email, company, contact_name: contactName, updated_at: new Date().toISOString() },
      { onConflict: "id", ignoreDuplicates: true },
    );

    const [profile, orders, lines, docs, rfqs] = await Promise.all([
      context.supabase.from("profiles").select("*").eq("id", context.userId).maybeSingle(),
      context.supabase.from("client_orders").select("*").order("created_at", { ascending: false }),
      context.supabase.from("client_order_lines").select("*"),
      context.supabase.from("client_documents").select("*").order("issued_on", { ascending: false }),
      context.supabase
        .from("rfq_requests")
        .select("id, reference, company, contact_name, email, phone, country, incoterm, delivery_port, target_lead_time, project_name, message, items, attachments, testing, certification, status, created_at")
        .order("created_at", { ascending: false }),
    ]);
    const failed = [profile, orders, lines, docs, rfqs].find((result) => result.error);
    if (failed?.error) throw failed.error;
    return {
      email,
      profile: profile.data,
      orders: orders.data ?? [],
      lines: lines.data ?? [],
      documents: docs.data ?? [],
      rfqs: rfqs.data ?? [],
    };
  });

const profileSchema = z.object({
  company: z.string().min(2).max(200),
  contactName: z.string().min(2).max(200),
  phone: z.string().max(60).default(""),
  country: z.string().max(120).default(""),
});

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => profileSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: identity, error: identityError } = await context.supabase.auth.getUser();
    const email = identity.user?.email;
    if (identityError || !email) throw new Error("Your session could not be verified.");
    const { error } = await context.supabase.from("profiles").upsert({
      id: context.userId,
      email,
      company: data.company,
      contact_name: data.contactName,
      phone: data.phone || null,
      country: data.country || null,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    return { ok: true as const };
  });

export const getCertificateDownload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ documentId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: document, error } = await context.supabase
      .from("client_documents")
      .select("title, storage_path")
      .eq("id", data.documentId)
      .single();
    if (error || !document?.storage_path) throw new Error("A downloadable copy is not available yet.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const signed = await supabaseAdmin.storage.from("documents").createSignedUrl(document.storage_path, 120);
    if (signed.error || !signed.data?.signedUrl) throw new Error("The document is temporarily unavailable.");
    return { url: signed.data.signedUrl, title: document.title };
  });