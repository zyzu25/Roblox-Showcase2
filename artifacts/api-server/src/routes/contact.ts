import { Router, type Request, type Response } from "express";
import { Resend } from "resend";
import { logger } from "../lib/logger";

const router = Router();

const OWNER_EMAIL   = "dangert913@gmail.com";
const FROM_ADDR     = "MYSTICFUSION7X <onboarding@resend.dev>";

const rateLimits    = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT    = 8;
const RATE_WINDOW   = 60_000;

function checkRateLimit(ip: string): boolean {
  const now   = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateLimits) if (now > v.resetAt) rateLimits.delete(k);
}, 300_000);

function esc(s: string) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
          .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

function siteUrl() {
  const d = process.env.REPLIT_DOMAINS;
  if (d) return `https://${d.split(",")[0].trim()}`;
  const dev = process.env.REPLIT_DEV_DOMAIN;
  if (dev) return `https://${dev}`;
  return "";
}

/* ── Shared design tokens ──────────────────────────────────────────────── */
const T = {
  bg:      "#05040a",
  card:    "#0b0914",
  bdr:     "rgba(139,61,255,0.22)",
  div:     "rgba(139,61,255,0.18)",
  p1:      "#a855f7",
  p2:      "#7c3aed",
  muted:   "rgba(255,255,255,0.35)",
  body:    "rgba(255,255,255,0.82)",
  dim:     "rgba(255,255,255,0.18)",
  pill:    "rgba(168,85,247,0.12)",
  pillB:   "rgba(168,85,247,0.28)",
  font:    `-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif`,
};

const sigBlock = (url: string) => `
<tr>
  <td align="center" style="padding:36px 32px 20px 32px;">
    <img src="${esc(url)}/signature.png" alt="MYSTICFUSION7X" width="200"
      style="display:block;margin:0 auto;
             filter:invert(1) brightness(0.85) contrast(1.1) sepia(0.3) hue-rotate(260deg);
             opacity:0.95;" />
    <p style="margin:14px 0 2px 0;color:${T.p1};font-size:13px;font-weight:700;
              letter-spacing:0.12em;text-transform:uppercase;font-family:${T.font};">
      MYSTICFUSION7X
    </p>
    <p style="margin:0;color:${T.muted};font-size:11px;letter-spacing:0.06em;
              text-transform:uppercase;font-family:${T.font};">
      Roblox UI Designer
    </p>
  </td>
</tr>`;

const divider = `
<tr>
  <td style="padding:0 32px;">
    <div style="height:1px;background:linear-gradient(90deg,
      transparent 0%,${T.div} 30%,${T.p2} 50%,${T.div} 70%,transparent 100%);"></div>
  </td>
</tr>`;

const footerRow = (url: string) => `
<tr>
  <td align="center" style="padding:24px 32px 36px 32px;font-family:${T.font};">
    <p style="margin:0 0 10px 0;color:${T.dim};font-size:11px;letter-spacing:0.04em;">
      Roblox: ZYZU25 &nbsp;·&nbsp; Discord: mysticfusion7x &nbsp;·&nbsp; X: @mysticfusion7x_
    </p>
    <a href="${esc(url)}" style="color:${T.p1};font-size:11px;text-decoration:none;opacity:0.7;">
      ${esc(url.replace("https://",""))}
    </a>
  </td>
</tr>`;

const wrap = (inner: string) => `<!DOCTYPE html><html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:${T.bg};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
  style="background:${T.bg};padding:40px 16px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="max-width:560px;background:${T.card};border:1px solid ${T.bdr};
             border-radius:20px;overflow:hidden;box-shadow:0 0 60px rgba(124,58,237,0.12);">
      <!-- top glow bar -->
      <tr><td style="height:3px;background:linear-gradient(90deg,${T.p2},${T.p1},${T.p2});"></td></tr>
      ${inner}
    </table>
  </td></tr>
</table>
</body></html>`;

/* ── Owner notification email ─────────────────────────────────────────── */
function ownerEmail(f: {
  name: string; email: string; roblox: string; discord: string;
  pkg: string; extraRev: string; rush: string; details: string;
}) {
  const url = siteUrl();
  const row = (label: string, val: string) => val ? `
    <tr>
      <td style="padding:9px 0;vertical-align:top;width:140px;font-family:${T.font};">
        <span style="color:${T.muted};font-size:11px;font-weight:700;
                     text-transform:uppercase;letter-spacing:0.09em;">${esc(label)}</span>
      </td>
      <td style="padding:9px 0;vertical-align:top;font-family:${T.font};">
        <span style="color:${T.body};font-size:14px;">${esc(val)}</span>
      </td>
    </tr>` : "";

  return wrap(`
    ${sigBlock(url)}
    ${divider}
    <tr>
      <td align="center" style="padding:22px 32px 8px 32px;">
        <span style="display:inline-block;padding:6px 18px;border-radius:100px;
                     background:${T.pill};border:1px solid ${T.pillB};
                     color:${T.p1};font-size:11px;font-weight:700;
                     letter-spacing:0.1em;text-transform:uppercase;font-family:${T.font};">
          New Commission Request
        </span>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px 8px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row("Name",           f.name)}
          ${row("Email",          f.email)}
          ${row("Roblox",         f.roblox)}
          ${row("Discord",        f.discord)}
          ${row("Package",        f.pkg)}
          ${row("Extra Revisions",f.extraRev)}
          ${row("Rush Delivery",  f.rush)}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 32px 24px 32px;font-family:${T.font};">
        <p style="margin:0 0 8px 0;color:${T.muted};font-size:11px;font-weight:700;
                  text-transform:uppercase;letter-spacing:0.09em;">Project Details</p>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);
                    border-radius:12px;padding:16px;color:${T.body};font-size:14px;
                    line-height:1.65;white-space:pre-wrap;">
          ${f.details ? esc(f.details) : `<span style="color:${T.muted}">No additional details.</span>`}
        </div>
      </td>
    </tr>
    ${divider}
    ${footerRow(url)}
  `);
}

/* ── Client confirmation email ────────────────────────────────────────── */
function clientEmail(f: { name: string; pkg: string; discord: string }) {
  const url  = siteUrl();
  const steps = [
    ["1", "I'll review your project details and pricing."],
    ["2", `I'll reach out on Discord (<strong style="color:rgba(255,255,255,0.65);">mysticfusion7x</strong>) within 24 hours.`],
    ["3", "We'll finalise scope, timeline, and kick off your project."],
  ];

  return wrap(`
    ${sigBlock(url)}
    ${divider}
    <tr>
      <td align="center" style="padding:28px 40px 10px 40px;font-family:${T.font};">
        <div style="width:56px;height:56px;border-radius:16px;
                    background:rgba(168,85,247,0.14);border:1px solid rgba(168,85,247,0.3);
                    display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
          <span style="font-size:26px;">✦</span>
        </div>
        <h1 style="margin:0 0 10px 0;color:#ffffff;font-size:24px;
                   font-weight:800;letter-spacing:-0.02em;">Request Received!</h1>
        <p style="margin:0;color:${T.muted};font-size:14px;line-height:1.65;max-width:380px;">
          Hey <strong style="color:rgba(255,255,255,0.75);">${esc(f.name)}</strong> —
          your commission request has landed. I'll review the details and
          reach back out to you on Discord shortly.
        </p>
      </td>
    </tr>
    ${f.pkg || f.discord ? `
    <tr>
      <td style="padding:20px 32px 8px 32px;">
        <div style="background:rgba(139,61,255,0.06);border:1px solid rgba(139,61,255,0.18);
                    border-radius:14px;padding:18px 20px;font-family:${T.font};">
          <p style="margin:0 0 4px 0;color:${T.muted};font-size:11px;font-weight:700;
                    text-transform:uppercase;letter-spacing:0.1em;">Your Request Summary</p>
          ${f.pkg ? `<p style="margin:8px 0 0 0;color:${T.body};font-size:14px;">
            <span style="color:${T.muted};font-size:12px;">Package: </span>${esc(f.pkg)}</p>` : ""}
          ${f.discord ? `<p style="margin:6px 0 0 0;color:${T.body};font-size:14px;">
            <span style="color:${T.muted};font-size:12px;">Discord: </span>${esc(f.discord)}</p>` : ""}
        </div>
      </td>
    </tr>` : ""}
    <tr>
      <td style="padding:16px 32px 28px 32px;font-family:${T.font};">
        <p style="margin:0 0 12px 0;color:${T.muted};font-size:11px;font-weight:700;
                  text-transform:uppercase;letter-spacing:0.09em;">What happens next</p>
        ${steps.map(([n, text]) => `
        <div style="display:flex;gap:12px;margin-bottom:10px;align-items:flex-start;">
          <span style="flex-shrink:0;width:22px;height:22px;border-radius:50%;
                       background:rgba(168,85,247,0.18);border:1px solid rgba(168,85,247,0.35);
                       color:${T.p1};font-size:11px;font-weight:700;
                       display:inline-flex;align-items:center;justify-content:center;margin-top:1px;">
            ${n}
          </span>
          <p style="margin:0;color:${T.body};font-size:13px;line-height:1.6;">${text}</p>
        </div>`).join("")}
      </td>
    </tr>
    ${divider}
    ${footerRow(url)}
  `);
}

/* ── Route ────────────────────────────────────────────────────────────── */
router.post("/contact", async (req: Request, res: Response) => {
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

  const { name, email, roblox, discord,
          packageSelected, extraRevisions, rushDelivery, details } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    res.status(400).json({ error: "Name is required." });
    return;
  }

  const clientEmail_ = typeof email === "string" ? email.trim().slice(0, 320) : "";
  const validEmail   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail_);

  const f = {
    name:     String(name).slice(0, 200),
    email:    clientEmail_,
    roblox:   typeof roblox             === "string" ? roblox.slice(0, 200)    : "",
    discord:  typeof discord            === "string" ? discord.slice(0, 200)   : "",
    pkg:      typeof packageSelected    === "string" ? packageSelected.slice(0, 200) : "",
    extraRev: typeof extraRevisions     === "string" ? extraRevisions.slice(0, 60)  : "No",
    rush:     typeof rushDelivery       === "string" ? rushDelivery.slice(0, 60)    : "No",
    details:  typeof details            === "string" ? details.slice(0, 4000)       : "",
  };

  try {
    const resend = new Resend(apiKey);

    // Send owner notification + optional client confirmation concurrently
    const sends: Promise<{ error: unknown }>[] = [
      resend.emails.send({
        from:    FROM_ADDR,
        to:      OWNER_EMAIL,
        subject: `✦ New Commission — ${f.name}${f.pkg ? ` · ${f.pkg.split(" (")[0]}` : ""}`,
        html:    ownerEmail(f),
      }),
    ];

    if (validEmail) {
      sends.push(
        resend.emails.send({
          from:    FROM_ADDR,
          to:      clientEmail_,
          subject: "✦ Your Commission Request Was Received — MYSTICFUSION7X",
          html:    clientEmail({ name: f.name, pkg: f.pkg, discord: f.discord }),
        })
      );
    }

    const [ownerRes, clientRes] = await Promise.all(sends);

    if (ownerRes.error) {
      logger.error({ err: ownerRes.error }, "[contact] owner email failed");
      res.status(502).json({ error: "Failed to send email." });
      return;
    }
    if (clientRes?.error) {
      logger.warn({ err: clientRes.error }, "[contact] confirmation email failed (non-fatal)");
    }

    res.json({ ok: true, confirmationSent: validEmail && !clientRes?.error });
  } catch (err) {
    logger.error({ err }, "[contact] unexpected error");
    res.status(500).json({ error: "Failed to send email." });
  }
});

export default router;
