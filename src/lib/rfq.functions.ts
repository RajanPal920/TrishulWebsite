import { createServerFn } from "@tanstack/react-start";
import { rfqSchema, persistRfq } from "./rfq.server";
import { z } from "zod";

export const submitRfq = createServerFn({ method: "POST" })
  .validator((data: unknown) => rfqSchema.parse(data))
  .handler(async ({ data }) => persistRfq(data));

export const getRfqConfirmation = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ token: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { get } = await import("../../server/db/connection.js");
    const rfq = await get(
      `SELECT reference, company, contact_name, email, phone, country, incoterm, delivery_port,
              target_lead_time, project_name, message, items, attachments, testing, certification,
              status, created_at
       FROM rfq_requests
       WHERE confirmation_token = ?`,
      [data.token]
    );
    if (!rfq?.reference) throw new Error("This acknowledgement link is invalid or no longer available.");
    return {
      ...rfq,
      items: typeof rfq.items === "string" ? JSON.parse(rfq.items) : (rfq.items || []),
      attachments: typeof rfq.attachments === "string" ? JSON.parse(rfq.attachments) : (rfq.attachments || []),
      testing: typeof rfq.testing === "string" ? JSON.parse(rfq.testing) : (rfq.testing || []),
    };
  });
