import { Router } from "express";

const router = Router();

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// In-memory store (persists per server process)
const reviews: Review[] = [];

function getStats() {
  const total = reviews.length;
  const average = total > 0
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10
    : 0;
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) distribution[r.rating] = (distribution[r.rating] ?? 0) + 1;
  return { total, average, distribution };
}

// GET /api/reviews
router.get("/reviews", (_req, res) => {
  const stats = getStats();
  res.json({
    reviews: [...reviews].reverse().slice(0, 30),
    ...stats,
  });
});

// POST /api/reviews
router.post("/reviews", (req, res) => {
  const { rating, comment } = req.body as { rating?: unknown; comment?: unknown };

  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    res.status(400).json({ error: "Rating must be an integer between 1 and 5." });
    return;
  }
  const text = typeof comment === "string" ? comment.trim().slice(0, 300) : "";

  const review: Review = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    rating,
    comment: text,
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);

  const stats = getStats();
  res.status(201).json({ ok: true, review, ...stats });
});

export default router;
