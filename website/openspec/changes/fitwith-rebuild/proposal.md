# FitWith Website — Full Rebuild

## Summary
Rebuild onlinetrener.rs from a generic gym template into a fully functional personal fitness coaching platform for Aleksandar Stojanović. The site must support 3 languages (SR/EN/RU), have full SEO, Supabase backend, client portal with training plans, exercise library with video, admin panel, blog, and contact/questionnaire forms.

## Context
- **Current production site**: onlinetrener.rs (WordPress/WooCommerce, slow, poorly built)
- **Current codebase**: Next.js 16 + Tailwind 4 + TypeScript (generic gym template, needs complete rework)
- **Target**: Replace the WordPress site entirely on the same domain
- **Backend**: Supabase (Auth, Database, Storage) — shared with future mobile app
- **Owner**: Aleksandar Stojanović — personal fitness coach, online mentoring, nutrition plans

## Content from existing site (onlinetrener.rs)
- **Homepage**: Hero, transformations preview, 3 service tiers (mentorstvo, plan treninga, plan ishrane), pricing, blog preview, contact CTA
- **About (O meni)**: Coach bio — born 1998, Belgrade, DIF graduate, certified by Dušan Petrović, 4-5 years experience, 100+ clients
- **Services (Saradnja)**: Full descriptions of online mentoring — personalized training plans, nutrition plans, continuous monitoring, motivation support, exercise library access
- **Transformations**: Before/after client photos (big selling point)
- **Exercise library (Vežbe)**: Categories — chest, back, legs, shoulders, arms, abs, corrective, advanced techniques. Each exercise has video + description
- **Blog**: Fitness/nutrition articles
- **Contact form**: Name, email, message
- **Initial questionnaire (Inicijalni upitnik)**: Detailed intake form for new clients (behind login wall on current site)
- **Pricing**: 3 tiers with different service levels

---

## Architecture

### Tech Stack
- **Frontend**: Next.js 16 (App Router), Tailwind CSS 4, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Row Level Security)
- **i18n**: next-intl (SR/EN/RU)
- **Video hosting**: Supabase Storage (or external CDN if needed)
- **Deployment**: Vercel (or similar, TBD)
- **Domain**: onlinetrener.rs (DNS cutover from WordPress)

### Database Schema (Supabase)
```
profiles          — user profiles (extends Supabase auth.users)
  id, user_id, full_name, email, phone, role (client|admin), avatar_url, 
  subscription_tier (mentoring|training|nutrition|none), subscription_active,
  created_at, updated_at

questionnaires    — initial intake forms
  id, user_id, data (JSONB), submitted_at

exercises         — exercise library
  id, name_sr, name_en, name_ru, description_sr, description_en, description_ru,
  video_url, thumbnail_url, category, muscle_group, created_at

exercise_categories — chest, back, legs, shoulders, arms, abs, corrective, advanced
  id, name_sr, name_en, name_ru, slug, sort_order

training_plans    — per-client training plans (created by admin)
  id, client_id, name, start_date, end_date, is_active, created_at, updated_at

training_days     — days within a plan
  id, plan_id, day_number, day_name_sr, day_name_en, day_name_ru, notes

training_exercises — exercises within a day
  id, day_id, exercise_id, sets, reps, rest_seconds, notes, sort_order

nutrition_plans   — per-client nutrition plans
  id, client_id, data (JSONB or structured), is_active, created_at

blog_posts        — blog articles
  id, title_sr, title_en, title_ru, slug, content_sr, content_en, content_ru,
  excerpt_sr, excerpt_en, excerpt_ru, cover_image_url, published_at, 
  is_published, author_id, tags, seo_title, seo_description

transformations   — before/after client photos
  id, client_name, description_sr, description_en, description_ru,
  before_image_url, after_image_url, duration, is_featured, sort_order

contact_messages  — contact form submissions
  id, name, email, phone, message, created_at, is_read

site_settings     — dynamic site content (pricing, service descriptions, etc.)
  id, key, value_sr, value_en, value_ru
```

### Row Level Security
- **Public**: exercises, exercise_categories, blog_posts (published), transformations, site_settings
- **Authenticated client**: own profile, own questionnaire, own training_plans, own nutrition_plans
- **Admin only**: all tables (full CRUD), contact_messages, all users' data

---

## Pages & Routes

### Public Pages (no auth required)
| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, services, transformations preview, pricing, blog preview, CTA |
| `/o-meni` | About — coach bio, certifications, philosophy |
| `/saradnja` | Services — detailed descriptions of 3 tiers |
| `/transformacije` | Transformations gallery — before/after photos |
| `/vezbe` | Exercise library — browse by category (public, video behind paywall optional) |
| `/vezbe/[slug]` | Single exercise — video, description, related exercises |
| `/blog` | Blog listing — paginated, with tags/categories |
| `/blog/[slug]` | Single blog post |
| `/cene` | Pricing page — 3 tiers with comparison table |
| `/kontakt` | Contact form |
| `/inicijalni-upitnik` | Initial questionnaire (may require auth) |
| `/prijava` | Login |
| `/registracija` | Register |
| `/politika-privatnosti` | Privacy policy |

### Client Portal (auth required, role: client)
| Route | Description |
|-------|-------------|
| `/portal` | Client dashboard — today's training, quick stats |
| `/portal/trening` | Current training plan — daily view with exercises, sets, reps |
| `/portal/trening/[dayId]` | Single training day — exercise list with linked videos |
| `/portal/ishrana` | Nutrition plan |
| `/portal/profil` | Profile settings, questionnaire status |

### Admin Panel (auth required, role: admin)
| Route | Description |
|-------|-------------|
| `/admin` | Admin dashboard — stats, recent activity |
| `/admin/korisnici` | User management — list, search, filter by tier |
| `/admin/korisnici/[id]` | User detail — promote, assign plan, view questionnaire |
| `/admin/treninzi` | Training plan builder — create/edit/copy plans |
| `/admin/treninzi/[id]` | Edit training plan — add days, exercises (with auto-link to exercise library) |
| `/admin/ishrana` | Nutrition plan builder |
| `/admin/vezbe` | Exercise library management — CRUD, upload videos |
| `/admin/blog` | Blog post management — CRUD, rich editor |
| `/admin/transformacije` | Transformation management — upload before/after |
| `/admin/poruke` | Contact form inbox |
| `/admin/upitnici` | View submitted questionnaires |
| `/admin/podesavanja` | Site settings — pricing, service descriptions |

---

## Key Features

### 1. Exercise Auto-Linking
When admin types exercise name in training plan builder, the system suggests matching exercises from the library. On selection, the exercise in the client's training plan links to the video/description page. This is the **smart matching** feature.

### 2. Training Plan Copy
Admin can duplicate an entire training plan (with all days and exercises) and assign it to a different client or edit the copy.

### 3. i18n (SR/EN/RU)
- All public content trilingual
- Admin panel in Serbian only (Aleksandar's language)
- Client portal follows user's language preference
- SEO: hreflang tags, localized URLs, localized meta tags
- Content stored with `_sr`, `_en`, `_ru` suffixes in DB

### 4. Full SEO
- Server-side rendering (Next.js SSR/SSG)
- Structured data (JSON-LD): LocalBusiness, Person, Article, FAQPage, VideoObject
- Open Graph + Twitter cards
- Sitemap.xml (auto-generated)
- robots.txt
- hreflang for 3 languages
- Canonical URLs
- Image alt tags (translated)
- Page speed optimization (image optimization, lazy loading, font optimization)

### 5. Video Hosting
- Supabase Storage for exercise videos
- Thumbnail generation
- Lazy loading with placeholder
- If videos are too large for Supabase, fallback to Cloudflare R2 or similar

---

## Implementation Phases

### Phase 1: Foundation & Public Pages
- Supabase project setup (auth, DB schema, RLS, storage buckets)
- i18n setup (next-intl, 3 locales)
- Design system refinement (dark fitness theme from current template)
- Homepage rebuild with real content from onlinetrener.rs
- About page
- Services page
- Pricing page
- Contact form (sends to Supabase + optional email notification)
- Footer, navbar, shared components
- Basic SEO (meta tags, sitemap, robots.txt)

### Phase 2: Auth & Exercise Library
- Login/Register with Supabase Auth
- Exercise library (public browsing)
- Exercise categories with filtering
- Single exercise page with video player
- Exercise CRUD in admin panel
- Video upload to Supabase Storage

### Phase 3: Client Portal & Training Plans
- Client dashboard
- Training plan viewer (daily view)
- Exercise auto-linking in training plans
- Nutrition plan viewer
- Profile page

### Phase 4: Admin Panel
- User management (list, search, promote/demote, assign tier)
- Training plan builder (create, edit, copy, assign)
- Nutrition plan builder
- Questionnaire viewer
- Contact message inbox
- Blog post editor (rich text, multilingual)
- Transformation manager (upload before/after)
- Site settings editor

### Phase 5: Blog & Transformations
- Blog listing page (paginated, filtered by tags)
- Single blog post page
- Transformations gallery with lightbox
- SEO finalization (structured data, hreflang, performance audit)

### Phase 6: Questionnaire & Polish
- Initial questionnaire form (multi-step)
- Privacy policy page
- Final SEO audit
- Performance optimization
- Cross-browser/device testing
- DNS cutover plan (WordPress → Vercel)

---

## Open Questions
1. Exact pricing amounts for the 3 tiers?
2. Does Aleksandar want email notifications for contact form / new signups?
3. Should exercise videos be gated (paid users only) or fully public?
4. Does the questionnaire require login, or can anyone fill it out?
5. Any specific design preferences beyond the current dark theme?
6. Cloudflare or other CDN for video delivery?
