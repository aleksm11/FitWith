# FitWith - Fitness Website

## Tech Stack
- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Deployment:** Vercel

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint

## Architecture
```
app/                  # Next.js App Router pages & layouts
components/
  shared/             # Reusable components (buttons, cards, typography)
  sections/           # Page sections (hero, features, pricing, etc.)
  ui/                 # Small UI primitives
  forms/              # Form components
public/assets/        # Images, icons, fonts
src/styles/           # Design tokens, shared styles
```

## Styling Conventions
- Tailwind CSS 4 with `@theme inline` in globals.css for CSS variables
- Design tokens extracted from Figma stored in `src/styles/design-tokens.ts`
- Desktop-first responsive: design for 1440px, adapt down (1024, 768, 375)
- Use exact Figma values (colors, spacing, font sizes, border radius, shadows)
- No dark mode unless specified in design

## MCP Tools
- **Figma Desktop MCP** — Extract design context, metadata, screenshots
- **Next.js DevTools MCP** — Check errors, runtime diagnostics, docs lookup
- **Playwright MCP** — Browser automation, screenshots, visual testing
- **Vercel MCP** — Deployment
