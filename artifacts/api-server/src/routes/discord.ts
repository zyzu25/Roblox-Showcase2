import { Router, type Request, type Response } from "express";

const router = Router();

// Set DISCORD_USER_ID env var to your Discord user ID (not username — the 18-digit number).
// Join discord.gg/lanyard first so Lanyard can track your presence.
const DISCORD_USER_ID = process.env.DISCORD_USER_ID ?? "";

router.get("/discord-status", async (_req: Request, res: Response) => {
  if (!DISCORD_USER_ID) {
    res.json({ available: false });
    return;
  }

  try {
    const r = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(4000),
    });

    if (!r.ok) {
      res.json({ available: false });
      return;
    }

    const data = await r.json() as any;
    const d = data?.data;

    if (!d) {
      res.json({ available: false });
      return;
    }

    const avatar = d.discord_user?.avatar
      ? `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${d.discord_user.avatar}.webp?size=128`
      : null;

    res.json({
      available: true,
      username: d.discord_user?.username ?? null,
      displayName: d.discord_user?.display_name ?? d.discord_user?.global_name ?? null,
      avatar,
      status: d.discord_status ?? "offline",         // online | idle | dnd | offline
      customStatus: d.activities?.find((a: any) => a.type === 4)?.state ?? null,
      activity: d.activities?.find((a: any) => a.type !== 4)?.name ?? null,
    });
  } catch {
    res.json({ available: false });
  }
});

export default router;
