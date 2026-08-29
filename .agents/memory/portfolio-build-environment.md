---
name: Portfolio build environment
description: Environment variables needed when manually building the portfolio artifact
---

Manual builds of the portfolio must provide both `PORT` and `BASE_PATH`, even though the development workflow supplies them automatically.

**Why:** The Vite config fails fast when either variable is absent, which can look like a code regression during local verification.

**How to apply:** Use the values from the portfolio artifact workflow when running a standalone production build.