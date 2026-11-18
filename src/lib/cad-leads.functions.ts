import { createServerFn } from "@tanstack/react-start";
import { cadDownloadSchema, handleCadDownload } from "./cad-leads.server";

export const logCadDownload = createServerFn({ method: "POST" })
  .validator((data: unknown) => cadDownloadSchema.parse(data))
  .handler(async ({ data }) => handleCadDownload(data));
