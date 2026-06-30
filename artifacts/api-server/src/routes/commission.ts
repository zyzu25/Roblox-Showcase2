import { Router, type Request, type Response } from "express";
import OpenAI from "openai";

const router = Router();

// ─── Simple in-memory rate limiter (per IP, resets per minute) ───────────────
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

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

setInterval(() => {
  const now = Date.now();
  for (const [ip, e] of rateLimits) if (now > e.resetAt) rateLimits.delete(ip);
}, 300_000);

// ─── Constraints ──────────────────────────────────────────────────────────────
const MAX_MESSAGES   = 20;
const MAX_MSG_LENGTH = 800;
const ALLOWED_ROLES  = new Set(["user", "assistant"]);

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

// ─── Rule-based fallback estimator ────────────────────────────────────────────
function ruleBasedReply(lastUserMessage: string): string {
  const msg = lastUserMessage.toLowerCase();

  // Logo queries
  if (/logo|icon|emblem|badge|watermark/.test(msg)) {
    if (/3d|high.?qual|premium|best/.test(msg))
      return "For a High Quality logo you're looking at **$7 (779 R$)** — includes a 3D icon and custom ring, done in ~3 hours. DM me on Discord (mysticfusion7x) to get started! 🎨";
    if (/mid|medium|standard|2d/.test(msg))
      return "Mid Quality logos are **$4 each (459 R$)**, minimum 2 — 2D icon with custom ring, done in ~2 hours each. Grab me on Discord (mysticfusion7x) when ready! 🎨";
    return "Logo pricing: High Quality $7 (3D icon + ring), Mid $4 (2D icon + ring, min 2), Low $2 (2D emblem, min 3). Which style fits your game? 🎨";
  }

  // Scripting queries
  if (/script|lua|code|program|backend/.test(msg))
    return "I do UI design only — no scripting or Lua code. I design everything in Figma and Roblox Studio and hand off the final frames ready for your developer to script. 🎨";

  // Rush / deadline queries
  if (/rush|urgent|fast|asap|quick|tomorrow|today/.test(msg))
    return "Rush delivery is available for **+$5 flat** on any package. Just mention it when you commission me! Turnaround for a Starter UI could be as quick as 1 day. ⚡";

  // Robux queries
  if (/robux|r\$|roblox pay/.test(msg))
    return "I accept both USD and Robux! USD gets a 20% discount vs the Robux equivalent. Starter UI: R$1,000–4,000 · Game Package: R$4,000–12,000 · Full Package: R$12,000–30,000. 💰";

  // Cheapest / budget queries
  if (/cheap|budget|low|affordable|minimum|least/.test(msg))
    return "The cheapest option is the **Starter UI at $5–$15** — covers 1–2 simple screens like a menu, shop, or HUD. Ready in 1–2 days. Perfect if you're just starting out! 💰";

  // Count up UI screens mentioned
  const screens: string[] = [];
  if (/hud|health|stats|status bar/.test(msg)) screens.push("HUD");
  if (/shop|store|purchase/.test(msg)) screens.push("shop");
  if (/inventory|backpack|bag/.test(msg)) screens.push("inventory");
  if (/menu|main menu|title/.test(msg)) screens.push("menu");
  if (/setting/.test(msg)) screens.push("settings");
  if (/rebirth|prestige/.test(msg)) screens.push("rebirth");
  if (/pet/.test(msg)) screens.push("pets");
  if (/leaderboard|leaderstat/.test(msg)) screens.push("leaderboard");
  if (/crafting|craft/.test(msg)) screens.push("crafting");
  if (/quest|mission/.test(msg)) screens.push("quests");

  if (screens.length >= 5) {
    return `That's a solid scope (${screens.join(", ")}) — that fits the **Full Game UI Package at $50–$100 (R$12,000–30,000)**, delivered in 5–10 days. It covers 5+ connected screens with a cohesive visual style. DM me on Discord (mysticfusion7x) to lock in your slot! 🚀`;
  }
  if (screens.length >= 3) {
    return `For ${screens.join(", ")}, I'd recommend the **Game UI Package at $15–$50 (R$4,000–12,000)** — 2–5 days, up to 4 connected frames. It's the most popular option for mid-stage games. DM mysticfusion7x on Discord to get started! 🎮`;
  }
  if (screens.length >= 1) {
    return `For ${screens.join(" + ")}, the **Starter UI at $5–$15 (R$1,000–4,000)** covers you — 1–2 simple frames, done in 1–2 days. Want to add more screens or details? Just let me know! 💬`;
  }

  // "Full game" / "everything" catch-all
  if (/full|complete|everything|entire|whole game/.test(msg))
    return "For a complete game UI system, the **Full Game UI Package ($50–$100)** is the way to go — HUD, shop, inventory, menus, rebirth, pets and more, delivered in 5–10 days. DM me on Discord (mysticfusion7x) to get started! 🚀";

  // Pricing / general queries
  if (/price|cost|how much|pricing|rate|charge/.test(msg))
    return "Here's a quick breakdown: **Starter UI** $5–$15 (1–2 screens) · **Game Package** $15–$50 (up to 4 screens) · **Full Package** $50–$100 (5+ screens) · **Premium** $100+ for large-scale games. What does your game need?";

  // Greeting / general opener
  if (/^(hi|hey|hello|sup|yo|hii|helo|what'?s up|howdy)/.test(msg.trim()))
    return "Hey! 👋 Tell me what UI screens you need for your game and I'll give you an instant price estimate. Not sure? Just describe your game and I'll figure out what fits!";

  // Default fallback
  return "Tell me more about what you need — how many screens, what type of game, and any special features — and I'll give you a proper price estimate right away! 😊";
}

// ─── Route ────────────────────────────────────────────────────────────────────
router.post("/commission-chat", async (req: Request, res: Response) => {
  const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim()
    ?? req.socket.remoteAddress
    ?? "unknown";

  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: "Too many requests. Please wait a minute before trying again." });
    return;
  }

  const { messages } = req.body as { messages?: unknown };

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages must be a non-empty array." });
    return;
  }
  if (messages.length > MAX_MESSAGES) {
    res.status(400).json({ error: `Conversation too long (max ${MAX_MESSAGES} messages).` });
    return;
  }
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

  // Try OpenAI first, fall back to rule-based
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 300,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safeMessages],
      });
      const reply = completion.choices[0]?.message?.content ?? "";
      if (reply) {
        res.json({ reply });
        return;
      }
    } catch (err: any) {
      // Log but fall through to rule-based
      console.warn("[commission-chat] OpenAI unavailable, using rule-based fallback:", err?.message ?? err);
    }
  }

  // Rule-based fallback
  const lastUserMsg = safeMessages.filter(m => m.role === "user").at(-1)?.content ?? "";
  const reply = ruleBasedReply(lastUserMsg);
  res.json({ reply });
});

export default router;
