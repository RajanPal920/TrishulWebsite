import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { materials } from "@/data/materials";
import { productTypes } from "@/data/products";
import { industries } from "@/data/industries";
import { articles } from "@/data/technical";
import { allMatrixPairs } from "@/data/matrix";
import { company } from "@/data/company";

const BASE_URL = company.siteUrl;

interface Entry {
  path: string;
  changefreq?: string;
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const entries: Entry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/materials", changefreq: "weekly", priority: "0.9" },
          { path: "/products", changefreq: "weekly", priority: "0.9" },
          { path: "/matrix", changefreq: "weekly", priority: "0.9" },
          { path: "/processing", changefreq: "monthly", priority: "0.9" },
          { path: "/industries", changefreq: "monthly", priority: "0.7" },
          { path: "/technical", changefreq: "monthly", priority: "0.7" },
          { path: "/stock", changefreq: "daily", priority: "0.8" },
          { path: "/cad", changefreq: "monthly", priority: "0.7" },
          { path: "/landed-cost", changefreq: "monthly", priority: "0.6" },
          { path: "/tools", changefreq: "monthly", priority: "0.6" },
          { path: "/clients", changefreq: "monthly", priority: "0.6" },
          { path: "/quality", changefreq: "monthly", priority: "0.8" },
          { path: "/faq", changefreq: "monthly", priority: "0.7" },
          { path: "/about", changefreq: "yearly", priority: "0.5" },
          { path: "/contact", changefreq: "yearly", priority: "0.6" },
          { path: "/rfq", changefreq: "monthly", priority: "0.9" },
        ];

        for (const m of materials) entries.push({ path: `/materials/${m.slug}`, priority: "0.8" });
        for (const p of productTypes) entries.push({ path: `/products/${p.slug}`, priority: "0.8" });
        for (const i of industries) entries.push({ path: `/industries/${i.slug}`, priority: "0.6" });
        for (const a of articles) entries.push({ path: `/technical/${a.slug}`, priority: "0.6" });
        for (const pair of allMatrixPairs())
          entries.push({ path: `/materials/${pair.material.slug}/${pair.product.slug}`, priority: "0.7" });

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((e) =>
            [
              `  <url>`,
              `    <loc>${BASE_URL}${e.path}</loc>`,
              e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n"),
          ),
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
