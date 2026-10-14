// After the client build: put the rendered homepage into dist/index.html,
// and write robots.txt and sitemap.xml for the production address.
import { readFileSync, readdirSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { loadEnv } from "vite";

const root = resolve(import.meta.dirname, "..");
const env = loadEnv(process.env.MODE ?? "production", root, "VITE_");
const site = (env.VITE_SITE_URL || "https://quotewell.app").replace(/\/$/, "");

const { render } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")).href);
const file = resolve(root, "dist/index.html");
// Preload the two fonts the homepage needs above the fold.
const fonts = readdirSync(resolve(root, "dist/assets")).filter((f) => /^(geist-latin-wght|instrument-serif-latin-400-italic).*\.woff2$/.test(f));
const preload = fonts.map((f) => `<link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin>`).join("\n    ");
const html = readFileSync(file, "utf8").replace("<!--app-->", render()).replace("</head>", `  ${preload}\n  </head>`);
writeFileSync(file, html);
rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });

writeFileSync(
  resolve(root, "dist/robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /app\nDisallow: /login\n\nSitemap: ${site}/sitemap.xml\n`,
);
writeFileSync(
  resolve(root, "dist/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site}/</loc><changefreq>monthly</changefreq></url>\n</urlset>\n`,
);
console.log(`prerendered ${file} (${html.length} bytes), site ${site}`);
