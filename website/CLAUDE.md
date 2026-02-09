# FitWith — Personal Fitness Coaching Platform

## What This Is
A personal fitness coaching website for Aleksandar Stojanović (onlinetrener.rs). Replacing an old WordPress site. This is NOT a gym website — it's a personal coaching platform where one trainer manages clients, creates training/nutrition plans, and provides an exercise video library.

## Tech Stack
- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 4
- **Backend:** Supabase (Auth, PostgreSQL, Storage, RLS)
- **i18n:** next-intl (Serbian, English, Russian)
- **Deployment:** Vercel

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint

## Architecture
```
app/
  [locale]/              # i18n locale prefix (sr, en, ru)
    (public)/            # Public pages (no auth)
      page.tsx           # Homepage
      o-meni/            # About
      saradnja/          # Services
      transformacije/    # Transformations gallery
      vezbe/             # Exercise library
      vezbe/[slug]/      # Single exercise
      blog/              # Blog listing
      blog/[slug]/       # Single blog post
      cene/              # Pricing
      kontakt/           # Contact form
      inicijalni-upitnik/# Questionnaire
      prijava/           # Login
      registracija/      # Register
    (portal)/            # Client portal (auth required)
      portal/            # Dashboard
      portal/trening/    # Training plan
      portal/ishrana/    # Nutrition plan
      portal/profil/     # Profile
    (admin)/             # Admin panel (admin role required)
      admin/             # Dashboard
      admin/korisnici/   # Users
      admin/treninzi/    # Training plans
      admin/vezbe/       # Exercises
      admin/blog/        # Blog posts
      admin/transformacije/ # Transformations
      admin/poruke/      # Contact messages
      admin/upitnici/    # Questionnaires
      admin/podesavanja/ # Settings
components/
  shared/                # Reusable (Button, Card, etc.)
  sections/              # Page sections (Hero, Pricing, etc.)
  ui/                    # Small UI primitives
  forms/                 # Form components
  admin/                 # Admin-specific components
  portal/                # Client portal components
lib/
  supabase/              # Supabase client, types, helpers
  i18n/                  # next-intl config
messages/                # i18n message files (sr.json, en.json, ru.json)
public/assets/           # Images, icons
src/styles/              # Design tokens
openspec/                # OpenSpec plans and specs
```

## Styling Conventions
- Tailwind CSS 4 with `@theme inline` in globals.css
- Design tokens in `src/styles/design-tokens.ts`
- Dark fitness theme — dark backgrounds, orange/amber accents
- Desktop-first responsive: 1440px → 1024 → 768 → 375
- Modern, clean, premium feel — this is a professional coaching brand

## Database Schema (Supabase)
See `openspec/changes/fitwith-rebuild/proposal.md` for full schema.

Key tables: profiles, exercises, exercise_categories, training_plans, training_days, training_exercises, nutrition_plans, blog_posts, transformations, questionnaires, contact_messages, site_settings

## Content
The coach is Aleksandar Stojanović from Belgrade. His bio and service descriptions are in `openspec/changes/fitwith-rebuild/proposal.md`. The questionnaire spec is in `openspec/changes/fitwith-rebuild/questionnaire-spec.md`.

## i18n
- Primary: Serbian (sr)
- Secondary: English (en), Russian (ru)
- Admin panel: Serbian only
- Client portal: follows user preference
- URL structure: /sr/..., /en/..., /ru/...

## Important Notes
- Always create feature branches, never commit to main
- Use Supabase client-side SDK for auth and data fetching
- All public content pages should be SSR/SSG for SEO
- Exercise videos will be uploaded by admin — just create the upload UI and storage structure
- Training plan builder needs "exercise auto-linking" — when typing exercise name, suggest from library
