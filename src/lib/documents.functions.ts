import { createServerFn } from "@tanstack/react-start";
import { documentDownloadSchema, handleDocumentDownload } from "./documents.server";

export const requestDocumentDownload = createServerFn({ method: "POST" })
  .validator((data: unknown) => documentDownloadSchema.parse(data))
  .handler(async ({ data }) => handleDocumentDownload(data));
