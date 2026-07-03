import { Router } from "express";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const router = Router();

const __dir = dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = join(__dir, "../../data");
const DATA_FILE = join(DATA_DIR, "reviews.json");

interface Review {
  id: string;
  rating: number;
  comment: string;
  username: string;
  gameName: string;
  createdAt: string;
}

function loadReviews(): Review[] {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    const raw = readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Review[];
  } catch { /* first run or corrupt file */ }
  return [];
}

function saveReviews(list: Review[]): void {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save reviews:", err);
  }
}

const reviews: Review[] = loadReviews();

function getStats() {
  const total = reviews.length;
  const average = total > 0
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10
    : 0;
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) distribution[r.rating] = (distribution[r.rating] ?? 0) + 1;
  return { total, average, distribution };
}

router.get("/reviews", (_req, res) => {
  res.json({ reviews: [...reviews].reverse().slice(0, 50), ...getStats() });
});

router.post("/reviews", (req, res) => {
  const { rating, comment, username, gameName } = req.body as {
    rating?: unknown; comment?: unknown; username?: unknown; gameName?: unknown;
  };

  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    res.status(400).json({ error: "Rating must be an integer between 1 and 5." });
    return;
  }
  const text      = typeof comment  === "string" ? comment.trim().slice(0, 300)  : "";
  const user      = typeof username === "string" ? username.trim().slice(0, 40)  : "";
  const game      = typeof gameName === "string" ? gameName.trim().slice(0, 60)  : "";

  const review: Review = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    rating,
    comment: text,
    username: user,
    gameName: game,
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  saveReviews(reviews);

  res.status(201).json({ ok: true, review, ...getStats() });
});

export default router;
