#!/usr/bin/env node
/**
 * STIBADA MASA — Full-Page Screenshot Tool
 *
 * Usage:
 *   pnpm screenshot <page> [mode|width height] [dark]
 *
 * Examples:
 *   pnpm screenshot home                           # desktop default (1280×720)
 *   pnpm screenshot home desktop                   # desktop preset
 *   pnpm screenshot home mobile                    # iPhone 15 (390×844)
 *   pnpm screenshot home tablet                    # iPad (768×1024)
 *   pnpm screenshot home 390 844                   # custom width × height
 *   pnpm screenshot home mode:desktop              # with colon syntax
 *   pnpm screenshot home width:1440 height:900     # dimensions with colon
 *   pnpm screenshot home iphone-17-pro-max         # specific device preset
 *   pnpm screenshot home mobile dark               # dark mode
 *
 * Saved to: screenshots/<page>/<page>-DD.MM.YYYY-HH.MM-WxH-mode.png
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

// ─── Device Presets ──────────────────────────────────────────────────────────
const DEVICES = {
  // Desktop
  desktop: { width: 1280, height: 720, label: "Desktop 1280×720" },
  "desktop-hd": { width: 1920, height: 1080, label: "Desktop HD 1920×1080" },
  "desktop-2k": { width: 2560, height: 1440, label: "Desktop 2K 2560×1440" },
  "macbook-13": { width: 1280, height: 800, label: "MacBook 13\" 1280×800" },
  "macbook-16": { width: 1728, height: 1117, label: "MacBook 16\" 1728×1117" },
  laptop: { width: 1366, height: 768, label: "Laptop 1366×768" },
  "laptop-lg": { width: 1440, height: 900, label: "Laptop LG 1440×900" },
  imac: { width: 2560, height: 1440, label: "iMac 2560×1440" },
  "4k": { width: 3840, height: 2160, label: "4K UHD 3840×2160" },
  wide: { width: 2560, height: 1440, label: "Wide 2560×1440" },

  // Tablet
  tablet: { width: 768, height: 1024, label: "Tablet iPad 768×1024" },
  ipad: { width: 820, height: 1180, label: "iPad Air 820×1180" },
  "ipad-pro": { width: 1024, height: 1366, label: "iPad Pro 1024×1366" },
  "ipad-mini": { width: 768, height: 1024, label: "iPad Mini 768×1024" },
  "surface-pro": { width: 912, height: 1368, label: "Surface Pro 912×1368" },
  "galaxy-tab": { width: 800, height: 1280, label: "Galaxy Tab 800×1280" },

  // Mobile — Apple
  mobile: { width: 390, height: 844, label: "Mobile iPhone 15 390×844" },
  "iphone-se": { width: 375, height: 667, label: "iPhone SE 375×667" },
  "iphone-14": { width: 390, height: 844, label: "iPhone 14 390×844" },
  "iphone-15": { width: 393, height: 852, label: "iPhone 15 393×852" },
  "iphone-15-pro": { width: 393, height: 852, label: "iPhone 15 Pro 393×852" },
  "iphone-15-pro-max": { width: 430, height: 932, label: "iPhone 15 Pro Max 430×932" },
  "iphone-16": { width: 393, height: 852, label: "iPhone 16 393×852" },
  "iphone-16-pro": { width: 402, height: 874, label: "iPhone 16 Pro 402×874" },
  "iphone-16-pro-max": { width: 440, height: 956, label: "iPhone 16 Pro Max 440×956" },
  "iphone-17": { width: 393, height: 852, label: "iPhone 17 393×852" },
  "iphone-17-pro": { width: 402, height: 874, label: "iPhone 17 Pro 402×874" },
  "iphone-17-pro-max": { width: 440, height: 956, label: "iPhone 17 Pro Max 440×956" },

  // Mobile — Android
  "pixel-9": { width: 412, height: 915, label: "Pixel 9 412×915" },
  "pixel-9-pro": { width: 412, height: 900, label: "Pixel 9 Pro 412×900" },
  "galaxy-s25": { width: 360, height: 800, label: "Galaxy S25 360×800" },
  "galaxy-s25-ultra": { width: 384, height: 854, label: "Galaxy S25 Ultra 384×854" },
  "galaxy-fold": { width: 280, height: 653, label: "Galaxy Z Fold 280×653" },
  android: { width: 412, height: 915, label: "Android Generic 412×915" },
};

// ─── Page Routes ─────────────────────────────────────────────────────────────
const ROUTES = {
  // Public
  home: "/",
  beranda: "/",
  pendaftaran: "/pendaftaran",
  "program-studi": "/program-studi",
  prodi: "/program-studi",
  beasiswa: "/beasiswa",
  galeri: "/galeri",
  pengumuman: "/pengumuman",
  "informasi-pmb": "/informasi-pmb",
  "info-pmb": "/informasi-pmb",
  pmb: "/informasi-pmb",

  // Dashboard
  dashboard: "/dashboard/mahasiswa",
  "dashboard-mahasiswa": "/dashboard/mahasiswa",
  mahasiswa: "/dashboard/mahasiswa",
  "dashboard-dosen": "/dashboard/dosen",
  dosen: "/dashboard/dosen",
  "dashboard-admin": "/dashboard/admin",
  admin: "/dashboard/admin",
  "dashboard-rektor": "/dashboard/rektor",
  rektor: "/dashboard/rektor",
  "dashboard-jadwal": "/dashboard/mahasiswa/jadwal",
  jadwal: "/dashboard/mahasiswa/jadwal",
  krs: "/dashboard/mahasiswa/krs",
  nilai: "/dashboard/mahasiswa/nilai",
  absensi: "/dashboard/mahasiswa/absensi",
  diskusi: "/dashboard/mahasiswa/diskusi",
};

// ─── Find Playwright Chromium ─────────────────────────────────────────────────
function findChromium() {
  // Replit pre-installs playwright browsers in nix store
  const nixBrowsersPath =
    process.env.REPLIT_PID2_PLAYWRIGHT_BROWSERS_PATH ||
    "/nix/store/kcvsxrmgwp3ffz5jijyy7wn9fcsjl4hz-playwright-browsers-1.55.0-with-cjk";

  // Try known chromium revisions (newest first)
  const revisions = ["chromium-1187", "chromium-1196", "chromium-1080"];
  for (const rev of revisions) {
    const candidate = path.join(nixBrowsersPath, rev, "chrome-linux", "chrome");
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getBaseUrl() {
  if (process.env.REPLIT_DEV_DOMAIN) {
    return "http://localhost:80";
  }
  const port = process.env.PORT || process.env.VITE_PORT || "5173";
  return `http://localhost:${port}`;
}

function parseArgs(argv) {
  const args = argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    printHelp();
    process.exit(0);
  }

  const page = args[0];
  const rest = args.slice(1);

  let width = 1280;
  let height = 720;
  let deviceLabel = "Desktop 1280×720";
  let darkMode = false;

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];

    // Colon syntax: mode:desktop, width:390, height:844, dark:true
    if (arg.includes(":")) {
      const colonIdx = arg.indexOf(":");
      const key = arg.slice(0, colonIdx);
      const val = arg.slice(colonIdx + 1);
      if (key === "mode" || key === "device") {
        const preset = DEVICES[val];
        if (preset) {
          width = preset.width;
          height = preset.height;
          deviceLabel = preset.label;
        } else {
          console.warn(`⚠  Unknown mode: "${val}". Using default.`);
        }
      } else if (key === "width" || key === "w") {
        width = parseInt(val, 10);
        deviceLabel = `Custom ${width}×${height}`;
      } else if (key === "height" || key === "h") {
        height = parseInt(val, 10);
        deviceLabel = `Custom ${width}×${height}`;
      } else if (key === "dark") {
        darkMode = val === "true" || val === "1" || val === "yes";
      }
      continue;
    }

    // Named preset
    if (DEVICES[arg]) {
      const preset = DEVICES[arg];
      width = preset.width;
      height = preset.height;
      deviceLabel = preset.label;
      continue;
    }

    // Dark / light
    if (arg === "dark") { darkMode = true; continue; }
    if (arg === "light") { darkMode = false; continue; }

    // Numeric width [height]
    if (/^\d+$/.test(arg)) {
      width = parseInt(arg, 10);
      if (rest[i + 1] && /^\d+$/.test(rest[i + 1])) {
        i++;
        height = parseInt(rest[i], 10);
      }
      deviceLabel = `Custom ${width}×${height}`;
      continue;
    }
  }

  return { page, width, height, deviceLabel, darkMode };
}

function getTimestamp() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${yyyy}-${hh}.${min}`;
}

function printHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║         STIBADA MASA — Screenshot Tool                          ║
╠══════════════════════════════════════════════════════════════════╣
║  Usage: pnpm screenshot <page> [options]                        ║
╠══════════════════════════════════════════════════════════════════╣
║  Examples:                                                       ║
║    pnpm screenshot home                   # desktop default      ║
║    pnpm screenshot home desktop           # desktop 1280×720     ║
║    pnpm screenshot home mobile            # iPhone 15 390×844    ║
║    pnpm screenshot home tablet            # iPad 768×1024        ║
║    pnpm screenshot home iphone-17-pro-max # iPhone 17 Pro Max   ║
║    pnpm screenshot home 390 844           # custom 390×844       ║
║    pnpm screenshot home dark              # dark mode            ║
║    pnpm screenshot home mobile dark       # mobile + dark mode   ║
╠══════════════════════════════════════════════════════════════════╣
║  Pages: home, pendaftaran, program-studi, beasiswa, galeri,     ║
║         pengumuman, informasi-pmb, dashboard, admin, dosen,     ║
║         rektor, krs, nilai, absensi, diskusi, jadwal            ║
╠══════════════════════════════════════════════════════════════════╣
║  Devices: desktop, desktop-hd, laptop, tablet, ipad, ipad-pro, ║
║    mobile, iphone-se, iphone-15, iphone-15-pro-max,            ║
║    iphone-17, iphone-17-pro, iphone-17-pro-max,                 ║
║    pixel-9, galaxy-s25, android, surface-pro                    ║
╚══════════════════════════════════════════════════════════════════╝
`);
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const { page, width, height, deviceLabel, darkMode } = parseArgs(process.argv);

  // Resolve route
  let route = ROUTES[page];
  if (!route) {
    if (page.startsWith("/")) {
      route = page;
    } else {
      console.error(`\n❌ Unknown page: "${page}"`);
      console.log("\n📋 Available pages:");
      Object.entries(ROUTES).forEach(([alias, r]) => {
        console.log(`   ${alias.padEnd(24)} → ${r}`);
      });
      process.exit(1);
    }
  }

  const chromiumPath = findChromium();
  if (!chromiumPath) {
    console.error("❌ Could not find a Chromium binary.");
    console.error(
      "   Expected: REPLIT_PID2_PLAYWRIGHT_BROWSERS_PATH or the default nix store path."
    );
    process.exit(1);
  }

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${route}`;
  const timestamp = getTimestamp();
  const modeLabel = darkMode ? "dark" : "light";
  const filename = `${page}-${timestamp}-${width}x${height}-${modeLabel}.png`;
  const outDir = path.join(ROOT, "screenshots", page);
  const outPath = path.join(outDir, filename);

  fs.mkdirSync(outDir, { recursive: true });

  console.log(`\n📸 STIBADA MASA Screenshot`);
  console.log(`   Page    : ${page} → ${route}`);
  console.log(`   Device  : ${deviceLabel}`);
  console.log(`   Size    : ${width}×${height}px`);
  console.log(`   Mode    : ${modeLabel}`);
  console.log(`   URL     : ${url}`);
  console.log(`   Output  : screenshots/${page}/${filename}`);
  console.log("");

  // Load playwright dynamically
  const { chromium } = await import(
    path.join(ROOT, "node_modules", "playwright", "index.mjs")
  ).catch(() => import("playwright"));

  console.log("⏳ Launching browser...");
  const browser = await chromium.launch({
    executablePath: chromiumPath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const context = await browser.newContext({
      viewport: { width, height },
      colorScheme: darkMode ? "dark" : "light",
      deviceScaleFactor: 1,
    });

    const browserPage = await context.newPage();

    console.log("⏳ Loading page...");
    await browserPage.goto(url, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    // Wait for fonts & animations to settle
    await browserPage.evaluate(() => document.fonts.ready);

    if (darkMode) {
      // Force dark class on html element (for Tailwind dark mode)
      await browserPage.evaluate(() => {
        document.documentElement.classList.add("dark");
      });
    }

    await browserPage.waitForTimeout(1200);

    console.log("📷 Taking full-page screenshot...");
    await browserPage.screenshot({
      path: outPath,
      fullPage: true,
      type: "png",
    });

    const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
    console.log(`✅ Saved: ${outPath}`);
    console.log(`   File size: ${sizeKB} KB\n`);

    await context.close();
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("❌ Screenshot failed:", err.message);
  if (process.env.DEBUG) console.error(err.stack);
  process.exit(1);
});
