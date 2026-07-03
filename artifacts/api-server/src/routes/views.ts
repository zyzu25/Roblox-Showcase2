import { Router } from "express";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const router = Router();

const __dir = dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = join(__dir, "../../data");
const DATA_FILE = join(DATA_DIR, "views.json");
const SEED = 568;

function loadCount(): number {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    const raw = readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (typeof parsed.count === "number") return parsed.count;
  } catch { /* first run */ }
  return SEED;
}

function saveCount(count: number): void {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify({ count }, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save view count:", err);
  }
}

let viewCount = loadCount();

router.get("/views", (_req, res) => {
  res.json({ count: viewCount });
});

router.post("/views", (_req, res) => {
  viewCount += 1;
  saveCount(viewCount);
  res.json({ count: viewCount });
});

export default router;
