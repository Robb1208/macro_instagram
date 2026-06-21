#!/usr/bin/env node
/**
 * Export all slides from a JSON preset as PNG files using Puppeteer.
 * Usage: node export-slides.js <path-to-post.json> [output-dir]
 *
 * If output-dir is omitted, PNGs are saved next to the JSON file.
 */

const puppeteer = require("puppeteer");
const http = require("http");
const fs = require("fs");
const path = require("path");

const TOOL_DIR = __dirname;
const PORT = 18923; // obscure port to avoid conflicts

async function serve() {
  const handler = (req, res) => {
    let url;
    try { url = decodeURIComponent(req.url.split("?")[0]); }
    catch { url = req.url.split("?")[0]; }
    if (url === "/") url = "/index.html";
    const fp = path.join(TOOL_DIR, url);
    if (!fp.startsWith(TOOL_DIR)) { res.writeHead(403); res.end(); return; }
    fs.readFile(fp, (err, data) => {
      if (err) { res.writeHead(404); res.end(); return; }
      const ext = path.extname(fp).toLowerCase();
      const mime = {
        ".html": "text/html", ".css": "text/css", ".js": "application/javascript",
        ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2",
        ".woff": "font/woff", ".ttf": "font/ttf",
      }[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": mime });
      res.end(data);
    });
  };
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(PORT, resolve));
  return server;
}

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error("Usage: node export-slides.js <post.json> [output-dir]");
    process.exit(1);
  }
  const absJson = path.resolve(jsonPath);
  if (!fs.existsSync(absJson)) {
    console.error("File not found:", absJson);
    process.exit(1);
  }
  const outDir = process.argv[3] ? path.resolve(process.argv[3]) : path.dirname(absJson);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const preset = JSON.parse(fs.readFileSync(absJson, "utf-8"));
  const slideCount = (preset.slides || []).length;
  if (slideCount === 0) {
    console.error("No slides in JSON.");
    process.exit(1);
  }
  console.log(`${slideCount} slides found. Starting export...`);

  const server = await serve();
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: "networkidle0", timeout: 30000 });

    // Wait for logos and players to load
    await page.waitForFunction(() => typeof logosReady !== "undefined" && logosReady, { timeout: 15000 });

    // Load fonts — give them a moment
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 1000));

    // Apply the preset
    await page.evaluate((data) => {
      applyJsonPreset(data, []);
    }, preset);

    // Wait for render to settle
    await new Promise((r) => setTimeout(r, 500));

    // Export each slide
    for (let i = 0; i < slideCount; i++) {
      await page.evaluate((idx) => {
        setActive(idx);
      }, i);
      await new Promise((r) => setTimeout(r, 300));

      const pngData = await page.evaluate(() => {
        render();
        return cv.toDataURL("image/png");
      });

      const base64 = pngData.replace(/^data:image\/png;base64,/, "");
      const outFile = path.join(outDir, `slide-${i + 1}.png`);
      fs.writeFileSync(outFile, Buffer.from(base64, "base64"));
      console.log(`  -> ${outFile}`);
    }

    console.log("Done!");
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
