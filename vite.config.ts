// Vite & TanStack Start build configuration
// Bundles TanStack Start, Vite React, Tailwind CSS, Nitro and Express backend
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

function expressBackendPlugin(): Plugin {
  return {
    name: "express-backend-plugin",
    apply(config, { command }) {
      return command === "serve";
    },
    async configureServer(server) {
      try {
        const { default: app } = await import("./server/index.js");
        const { initDatabase } = await import("./server/db/init.js");
        await initDatabase().catch((e: any) => console.warn("[DB Init Notice]:", e?.message));
        server.middlewares.use(app as any);
        console.log("[Trishul Dev] Express API mounted directly into Vite dev server.");
      } catch (err) {
        console.error("[Trishul Dev] Failed to mount Express in Vite:", err);
      }
    },
    async configurePreviewServer(server) {
      try {
        const { default: app } = await import("./server/index.js");
        const { initDatabase } = await import("./server/db/init.js");
        await initDatabase().catch((e: any) => console.warn("[DB Init Notice]:", e?.message));
        server.middlewares.use(app as any);
        console.log("[Trishul Preview] Express API mounted directly into Vite preview server.");
      } catch (err) {
        console.error("[Trishul Preview] Failed to mount Express in Vite:", err);
      }
    },
  };
}

export default defineConfig({
  vite: {
    plugins: [expressBackendPlugin()],
    build: {
      rollupOptions: {
        external: ["sqlite3", "better-sqlite3"],
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
