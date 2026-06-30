import { Router, type Request, type Response } from "express";
import OpenAI from "openai";

const router = Router();

// ─── Simple in-memory rate limiter (per IP, resets per minute) ───────────────
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;          // max requests per window per IP
const RATE_WINDOW_MS = 60_000;  // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// Prune stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, e] of rateLimits) if (now > e.resetAt) rateLimits.delete(ip);
}, 300_000);

// ─── Constraints ──────────────────────────────────────────────────────────────
const MAX_MESSAGES     = 20;
const MAX_MSG_LENGTH   = 800;
const ALLOWED_ROLES    = new Set(["user", "assistant"]);

// ─── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a friendly, concise pricing assistant for MYSTICFUSION7X — a professional Roblox UI designer.

Your job: listen to what the client needs, then recommend the right package and give a clear price estimate.

PRICING:
UI Packages (USD prices shown; Robux also accepted):
- Starter UI: $5–$15 (R$1,000–4,000) · 1–2 days · 1–2 simple frames (menu, shop, settings, HUD).
- Game UI Package (MOST POPULAR): $15–$50 (R$4,000–12,000) · 2–5 days · Connected system, up to 4 frames (HUD + shop + inventory). Best for early/mid-stage games.
- Full Game UI Package: $50–$100 (R$12,000–30,000) · 5–10 days · Complete system (HUD, shop, inventory, rebirth, pets, menus). 5+ screens.
- Premium UI Package: $100+ (R$30,000+) · 1–3 weeks · High-end UI for large-scale games with strong visual identity.

Logo Packages:
- High Quality: $7 / 779 R$ · ~3 hrs per logo · 3D icon, custom ring.
- Mid Quality: $4 / 459 R$ · ~2 hrs per logo · 2D icon, custom ring. Min 2.
- Low Quality: $2 / 229 R$ · ~1 hr per logo · 2D emblem. Min 3.

Add-ons:
- Extra revisions: $2 each (included: 1 for Starter, 2 for Game, multiple for Full/Premium).
- Rush delivery: +$5 flat.
- USD gets a 20% discount vs Robux equivalent.

Deposit: 30% for small projects, 50% for large.

RULES:
- No scripting/Lua — design only (Figma + Roblox Studio).
- No refunds once work starts.
- New features after approval are charged separately.

Keep replies short (3–5 sentences max). Be friendly and professional. Always recommend a specific package. If asked about scripting, clarify you only do UI design.`;

// ─── Route ────────────────────────────────────────────────────────────────────
router.post("/commission-chat", async (req: Request, res: Response) => {
  // Rate limit
  const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim()
    ?? req.socket.remoteAddress
    ?? "unknown";

  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: "Too many requests. Please wait a minute before trying again." });
    return;
  }

  // Validate body
  const { messages } = req.body as { messages?: unknown };

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages must be a non-empty array." });
    return;
  }

  if (messages.length > MAX_MESSAGES) {
    res.status(400).json({ error: `Conversation too long (max ${MAX_MESSAGES} messages).` });
    return;
  }

  // Validate each message shape
  for (const msg of messages) {
    if (
      typeof msg !== "object" || msg === null ||
      !ALLOWED_ROLES.has((msg as any).role) ||
      typeof (msg as any).content !== "string" ||
      (msg as any).content.length > MAX_MSG_LENGTH
    ) {
      res.status(400).json({ error: "Invalid message format or content too long." });
      return;
    }
  }

  const safeMessages = (messages as { role: "user" | "assistant"; content: string }[])
    .map(m => ({ role: m.role, content: m.content.trim() }));

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safeMessages],
    });

    const reply = completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (err: any) {
    console.error("[commission-chat] OpenAI error:", err?.message ?? err);
    // Surface quota/billing issues clearly — all other errors are generic
    const status = err?.status ?? err?.statusCode ?? 500;
    if (status === 429) {
      res.status(503).json({ error: "quota_exceeded" });
    } else if (status === 401) {
      res.status(503).json({ error: "invalid_key" });
    } else {
      res.status(500).json({ error: "AI service unavailable. Please try again later." });
    }
  }
});

export default router;
