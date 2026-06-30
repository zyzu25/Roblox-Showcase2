import { Router } from "express";

const router = Router();

/**
 * Promo codes — add/remove codes here as needed.
 * Format: { code: "UPPERCASE", discount: "human-readable discount string" }
 */
const PROMO_CODES: Record<string, { discount: string }> = {
  "MYSTIC10": { discount: "10% off" },
  "NEWCLIENT": { discount: "15% off your first order" },
  "ROBLOX20": { discount: "20% off" },
};

// POST /api/promo/validate
router.post("/promo/validate", (req, res) => {
  const { code } = req.body as { code?: unknown };
  if (typeof code !== "string" || !code.trim()) {
    res.status(400).json({ error: "Provide a promo code." });
    return;
  }
  const key = code.trim().toUpperCase();
  const promo = PROMO_CODES[key];
  if (!promo) {
    res.json({ valid: false });
    return;
  }
  res.json({ valid: true, code: key, discount: promo.discount });
});

export default router;
