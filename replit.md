# Mysticfusion7x Portfolio

A personal portfolio site for **Mysticfusion7x**, a Roblox UI designer. Features a dark cinematic aesthetic with a WebGL liquid background, magnetic buttons, and a CSS-variable theme system.

## Stack

- **Frontend**: React 19 + Vite, Tailwind CSS v4, Radix UI, Framer Motion
- **Backend**: Express 5 API server (TypeScript, built with esbuild)
- **Monorepo**: pnpm workspaces (`artifacts/portfolio`, `artifacts/api-server`)
- **Router**: Wouter (client-side)

## How to run

Two workflows run in parallel automatically:

| Workflow | Command | Port |
|---|---|---|
| Start application | `pnpm --filter @workspace/portfolio run dev` | 21113 (external: 3000) |
| API Server | `pnpm --filter @workspace/api-server run dev` | 8080 |

The frontend is visible in the Replit preview pane. The API server handles requests like `/api/discord-status`.

## Project structure

```
artifacts/
  portfolio/      # React + Vite frontend
    src/
      pages/      # Route-level page components
      components/ # Shared UI components
      hooks/      # Custom React hooks
      lib/        # Utilities
  api-server/     # Express API server
    src/
      routes/     # API route handlers
      middlewares/
      lib/        # Logger, utilities
lib/              # Shared workspace packages (api-zod, db, etc.)
```

## User preferences

- Use pnpm (not npm or yarn) for all package management
- Keep existing monorepo structure
