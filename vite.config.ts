// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

const isBuild =
  process.env.NODE_ENV === "production" ||
  Boolean(process.env.VERCEL) ||
  process.argv.some((arg) => arg === "build" || arg.endsWith("build"));

function expressBackendPlugin(): Plugin {
  return {
    name: "express-backend-plugin",
    async configureServer(server) {
      if (isBuild) return;
      try {
        const serverPath = "./server/index.js";
        const initPath = "./server/db/init.js";
        const { default: app } = await import(/* @vite-ignore */ serverPath);
        const { initDatabase } = await import(/* @vite-ignore */ initPath);
        await initDatabase().catch((e: any) => console.warn("[DB Init Notice]:", e?.message));
        server.middlewares.use(app);
        console.log("[Trishul Dev] Express API mounted directly into Vite dev server.");
      } catch (err) {
        console.error("[Trishul Dev] Failed to mount Express in Vite:", err);
      }
    },
    async configurePreviewServer(server) {
      if (isBuild) return;
      try {
        const serverPath = "./server/index.js";
        const initPath = "./server/db/init.js";
        const { default: app } = await import(/* @vite-ignore */ serverPath);
        const { initDatabase } = await import(/* @vite-ignore */ initPath);
        await initDatabase().catch((e: any) => console.warn("[DB Init Notice]:", e?.message));
        server.middlewares.use(app);
        console.log("[Trishul Preview] Express API mounted directly into Vite preview server.");
      } catch (err) {
        console.error("[Trishul Preview] Failed to mount Express in Vite:", err);
      }
    },
  };
}

export default defineConfig({
  vite: {
    plugins: isBuild ? [] : [expressBackendPlugin()],
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
