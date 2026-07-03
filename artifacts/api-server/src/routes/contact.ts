import { Router, type Request, type Response } from "express";
import { Resend } from "resend";
import { logger } from "../lib/logger";

const router = Router();

const CONTACT_TO_EMAIL = "dangert913@gmail.com";
const CONTACT_FROM_EMAIL = "MYSTICFUSION7X <onboarding@resend.dev>";

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 8;
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

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getSiteBaseUrl(): string {
  const domains = process.env.REPLIT_DOMAINS;
  if (domains) return `https://${domains.split(",")[0].trim()}`;
  const devDomain = process.env.REPLIT_DEV_DOMAIN;
  if (devDomain) return `https://${devDomain}`;
  return "";
}

function buildEmailHtml(fields: {
  name: string;
  roblox: string;
  discord: string;
  packageSelected: string;
  extraRevisions: string;
  rushDelivery: string;
  details: string;
}): string {
  const row = (label: string, value: string) =>
    value
      ? `<tr>
          <td style="padding:10px 0;color:rgba(255,255,255,0.35);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;width:150px;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:10px 0;color:rgba(255,255,255,0.9);font-size:14px;vertical-align:top;">${escapeHtml(value)}</td>
        </tr>`
      : "";

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background-color:#040406;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#040406;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.16) 0%, transparent 60%), linear-gradient(160deg,#08060f 0%,#0c0a16 100%);border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;">
            <tr>
              <td align="center" style="padding:40px 32px 24px 32px;">
                <img src="${escapeHtml(getSiteBaseUrl())}/images/signature-white.png" alt="MYSTICFUSION7X" width="220" style="display:block;margin:0 auto;opacity:0.92;" />
                <p style="margin:16px 0 0 0;color:rgba(255,255,255,0.3);font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;">New Commission Request</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <div style="height:1px;background:linear-gradient(90deg,transparent 0%,rgba(168,85,247,0.35) 50%,transparent 100%);"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${row("Name", fields.name)}
                  ${row("Roblox Username", fields.roblox)}
                  ${row("Discord", fields.discord)}
                  ${row("Package", fields.packageSelected)}
                  ${row("Extra Revisions", fields.extraRevisions)}
                  ${row("Rush Delivery", fields.rushDelivery)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 32px 32px;">
                <p style="margin:0 0 8px 0;color:rgba(255,255,255,0.35);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">Project Details</p>
                <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;color:rgba(255,255,255,0.8);font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(fields.details) || "<span style=\"color:rgba(255,255,255,0.3)\">No additional details provided.</span>"}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <div style="height:1px;background:rgba(255,255,255,0.06);"></div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 32px 36px 32px;">
                <p style="margin:0;color:rgba(255,255,255,0.22);font-size:11px;letter-spacing:0.04em;">Sent from the MYSTICFUSION7X portfolio contact form</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

router.post("/api/contact", async (req: Request, res: Response) => {
  const ip = req.ip ?? "unknown";
  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: "Too many requests. Please try again in a minute." });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "Email service is not configured." });
    return;
  }

  const {
    name,
    roblox,
    discord,
    packageSelected,
    extraRevisions,
    rushDelivery,
    details,
  } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    res.status(400).json({ error: "Name is required." });
    return;
  }

  const fields = {
    name: String(name).slice(0, 200),
    roblox: typeof roblox === "string" ? roblox.slice(0, 200) : "",
    discord: typeof discord === "string" ? discord.slice(0, 200) : "",
    packageSelected: typeof packageSelected === "string" ? packageSelected.slice(0, 200) : "",
    extraRevisions: typeof extraRevisions === "string" ? extraRevisions.slice(0, 60) : "No",
    rushDelivery: typeof rushDelivery === "string" ? rushDelivery.slice(0, 60) : "No",
    details: typeof details === "string" ? details.slice(0, 4000) : "",
  };

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: undefined,
      subject: `New Commission Request — ${fields.name}`,
      html: buildEmailHtml(fields),
    });

    if (error) {
      logger.error({ err: error }, "[contact] Resend send failed");
      res.status(502).json({ error: "Failed to send email." });
      return;
    }

    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "[contact] Unexpected error sending email");
    res.status(500).json({ error: "Failed to send email." });
  }
});

export default router;
