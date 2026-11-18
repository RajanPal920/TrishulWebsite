import { createServerFn } from "@tanstack/react-start";
import { assistantSchema, runAssistant } from "./assistant.server";

export const askAssistant = createServerFn({ method: "POST" })
  .validator((data: unknown) => assistantSchema.parse(data))
  .handler(async ({ data }) => runAssistant(data));
