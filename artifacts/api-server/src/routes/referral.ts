import { Router, type Request, type Response } from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const router = Router();

// ─── Persistence ──────────────────────────────────────────────────────────────
interface ReferralEntry { discord: string; createdAt: number; uses: number }
const store = new Map<string, ReferralEntry>();

const DATA_DIR  = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "referrals.json");

function loadStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (fs.existsSync(DATA_FILE)) {
      const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as Record<string, ReferralEntry>;
      for (const [code, entry] of Object.entries(raw)) store.set(code, entry);
    }
  } catch {}
}

function saveStore() {
  try {
    const obj: Record<string, ReferralEntry> = {};
    store.forEach((v, k) => { obj[k] = v; });
    fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2));
  } catch {}
}

loadStore();

// ─── Helpers ─────────────────────────────────────────────────────────────────
function makeCode(discord: string): string {
  const prefix = discord.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase().padEnd(3, "X");
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 5);
  return `${prefix}-${suffix}`;
}

function findByDiscord(discord: string): [string, ReferralEntry] | null {
  for (const [code, entry] of store.entries()) {
    if (entry.discord === discord) return [code, entry];
  }
  return null;
}

// ─── Rate limiting (shared logic with commission) ────────────────────────────
const rl = new Map<string, { n: number; reset: number }>();
function rateOk(ip: string, limit = 15): boolean {
  const now = Date.now();
  const e = rl.get(ip);
  if (!e || now > e.reset) { rl.set(ip, { n: 1, reset: now + 60_000 }); return true; }
  if (e.n >= limit) return false;
  e.n++;
  return true;
}
setInterval(() => { const now = Date.now(); for (const [k, v] of rl) if (now > v.reset) rl.delete(k); }, 300_000);

function getIP(req: Request) {
  return (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim()
    ?? req.socket.remoteAddress ?? "unknown";
}

// ─── POST /api/referral/generate ─────────────────────────────────────────────
// Body: { discord: string }
// Returns: { code, existing }
router.post("/referral/generate", (req: Request, res: Response) => {
  if (!rateOk(getIP(req), 10)) {
    res.status(429).json({ error: "Too many requests. Wait a minute and try again." });
    return;
  }

  const raw = req.body?.discord;
  if (!raw || typeof raw !== "string" || raw.trim().length < 2 || raw.trim().length > 50) {
    res.status(400).json({ error: "A valid Discord username is required." });
    return;
  }

  const discord = raw.trim().toLowerCase();

  // Existing code for this Discord?
  const existing = findByDiscord(discord);
  if (existing) {
    res.json({ code: existing[0], existing: true });
    return;
  }

  // Generate unique code
  let code = makeCode(discord);
  let attempts = 0;
  while (store.has(code) && attempts < 20) { code = makeCode(discord); attempts++; }
  if (store.has(code)) { res.status(500).json({ error: "Could not generate a unique code. Try again." }); return; }

  store.set(code, { discord, createdAt: Date.now(), uses: 0 });
  saveStore();

  res.json({ code, existing: false });
});

// ─── POST /api/referral/validate ─────────────────────────────────────────────
// Body: { code: string, claimerDiscord?: string }
// Returns: { valid, referrer?, discount?, selfReferral? }
router.post("/referral/validate", (req: Request, res: Response) => {
  if (!rateOk(getIP(req), 30)) {
    res.status(429).json({ error: "Too many requests." });
    return;
  }

  const rawCode    = req.body?.code;
  const rawClaimer = req.body?.claimerDiscord;

  if (!rawCode || typeof rawCode !== "string") {
    res.status(400).json({ error: "A code is required." });
    return;
  }

  const code    = rawCode.trim().toUpperCase();
  const claimer = typeof rawClaimer === "string" ? rawClaimer.trim().toLowerCase() : null;
  const entry   = store.get(code);

  if (!entry) {
    res.json({ valid: false });
    return;
  }

  const selfReferral = claimer !== null && claimer === entry.discord;

  res.json({
    valid: true,
    referrer: entry.discord,
    code,
    discount: "10% off your commission",
    referrerDiscount: "10% off their next commission",
    selfReferral,
  });
});

// ─── POST /api/referral/use (called on contact form submit) ──────────────────
router.post("/referral/use", (req: Request, res: Response) => {
  const rawCode = req.body?.code;
  if (!rawCode || typeof rawCode !== "string") {
    res.status(400).json({ error: "Code required." });
    return;
  }
  const code  = rawCode.trim().toUpperCase();
  const entry = store.get(code);
  if (!entry) { res.status(404).json({ error: "Invalid code." }); return; }

  entry.uses++;
  saveStore();
  res.json({ ok: true, uses: entry.uses });
});

export default router;
