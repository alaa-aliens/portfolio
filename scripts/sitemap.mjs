// Writes dist/sitemap.xml from the projects list (only published case studies).
import { readFileSync, writeFileSync } from "node:fs";
const src = readFileSync("src/app/data/projects.tsx", "utf8");
const ready = [...src.matchAll(/slug:\s*"([^"]+)"[\s\S]*?status:\s*"(ready|soon)"/g)]
  .filter((m) => m[2] === "ready")
  .map((m) => m[1]);
const urls = ["/", "/work", ...ready.map((s) => `/work/${s}`)];
const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>https://alaa-ali.com${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
writeFileSync("dist/sitemap.xml", xml);
console.log(`sitemap: ${urls.length} urls`);
