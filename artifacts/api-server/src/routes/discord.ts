import { Router, type Request, type Response } from "express";

const router = Router();

// Mysticfusion7x's Discord user ID — also overrideable via env var
const DISCORD_USER_ID = process.env.DISCORD_USER_ID ?? "1064172887839342674";

router.get("/discord-status", async (_req: Request, res: Response) => {
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

    const userId  = d.discord_user?.id ?? DISCORD_USER_ID;
    const avatar  = d.discord_user?.avatar
      ? `https://cdn.discordapp.com/avatars/${userId}/${d.discord_user.avatar}.webp?size=128`
      : null;
    const banner  = d.discord_user?.banner
      ? `https://cdn.discordapp.com/banners/${userId}/${d.discord_user.banner}.webp?size=480`
      : null;
    const bannerColor = d.discord_user?.banner_color ?? null;

    const customStatusActivity = d.activities?.find((a: any) => a.type === 4);
    const richActivity         = d.activities?.find((a: any) => a.type !== 4);

    res.json({
      available: true,
      userId,
      username:     d.discord_user?.username ?? "mysticfusion7x",
      displayName:  d.discord_user?.global_name ?? d.discord_user?.display_name ?? d.discord_user?.username ?? "mysticfusion7x",
      discriminator: d.discord_user?.discriminator ?? "0",
      avatar,
      banner,
      bannerColor,
      status:       d.discord_status ?? "offline",   // online | idle | dnd | offline
      customStatus: customStatusActivity?.state ?? customStatusActivity?.emoji?.name ?? null,
      customEmoji:  customStatusActivity?.emoji?.name ?? null,
      activity:     richActivity?.name ?? null,
      activityDetails: richActivity?.details ?? null,
      activityState:   richActivity?.state ?? null,
      activityType:    richActivity?.type ?? null,
    });
  } catch {
    res.json({ available: false });
  }
});

export default router;
