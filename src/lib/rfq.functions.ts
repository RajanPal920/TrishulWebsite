import { createServerFn } from "@tanstack/react-start";
import { rfqSchema, persistRfq } from "./rfq.server";
import { z } from "zod";

export const submitRfq = createServerFn({ method: "POST" })
  .validator((data: unknown) => rfqSchema.parse(data))
  .handler(async ({ data }) => persistRfq(data));

export const getRfqConfirmation = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ token: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rfq, error } = await supabaseAdmin
      .from("rfq_requests")
      .select("reference, company, contact_name, email, phone, country, incoterm, delivery_port, target_lead_time, project_name, message, items, attachments, testing, certification, status, created_at")
      .eq("confirmation_token", data.token)
      .single();
    if (error || !rfq?.reference) throw new Error("This acknowledgement link is invalid or no longer available.");
    return rfq;
  });
