---
name: Referral system
description: How the referral system works end-to-end, key decisions, and known constraints.
---

## Architecture
- **Backend**: `artifacts/api-server/src/routes/referral.ts` — three routes:
  - `POST /api/referral/generate` — creates/retrieves a code tied to a Discord username
  - `POST /api/referral/validate` — validates a code, checks for self-referral, returns referrer info
  - `POST /api/referral/use` — increments use counter (called on commission submit)
- **Storage**: in-memory Map + JSON file at `artifacts/api-server/data/referrals.json` (created on first generate)
- **Frontend**: `artifacts/portfolio/src/components/ReferralSection.tsx` — two-panel component (Generate + Redeem)
- **Contact integration**: validated code stored in `sessionStorage` keys `referralCode` / `referralReferrer`, pre-filled in Contact form, submitted as hidden fields

## Code format
`[FIRST3CHARS_OF_DISCORD]-[5_HEX_CHARS]` e.g. `MYS-81B23`

## Anti-bias
Self-referral detection: `claimerDiscord === entry.discord` → `selfReferral: true` returned, discount blocked in UI.

## Discount
10% off for both referrer and referee. Applied manually by MYSTICFUSION7X — form submission includes "Referral Code" and "Referred By" fields.

**Why:** No payment processing integration, so discounts are manually applied at commission time.

## AI Estimator constraint
OpenAI API key (user-provided) may hit quota limits. Backend detects `status 429` → returns `{ error: "quota_exceeded" }`. Frontend shows a helpful fallback message pointing to Discord/Pricing section instead of a generic error.

**Why:** The API key is the user's own; quota is their billing responsibility.

## Timezone
`AvailableHours` uses `Africa/Cairo` (UTC+2, no DST) + `hourCycle: "h23"` to avoid midnight returning "24" instead of "00". Active window: 12 PM to 3 AM Cairo time.
