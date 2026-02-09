# Tasks — FitWith Rebuild

## Phase 0: Infrastructure Setup (via Claude Code MCPs)
- [ ] 0.1 Verify Claude Code has working Supabase MCP and Vercel MCP
- [ ] 0.2 Create Supabase project "FitWithAS" — region: EU (Frankfurt), configure auth (email/password), enable RLS, set up storage buckets
- [ ] 0.3 Create Vercel project "FitWithAS" — personal account, link GitHub repo, configure env vars, deploy
- [ ] 0.4 Validate: login/register flow works on deployed preview URL

## Phase 1: Foundation & Public Pages
- [ ] 1.1 Create database schema (all tables from proposal)
- [ ] 1.2 Write RLS policies (public, client, admin)
- [ ] 1.3 Set up Supabase Storage buckets (exercises, transformations, blog, avatars)
- [ ] 1.5 Install and configure next-intl (SR/EN/RU), create message files
- [ ] 1.6 Refactor design system — adapt current dark theme for personal coaching brand
- [ ] 1.7 Build shared components: Navbar (with language switcher, Login/Register buttons top-right; show client full name when logged in), Footer, Button, Card
- [ ] 1.8 Homepage — hero (responsive background: landscape mock for desktop ≥1024px, portrait mock for mobile; "YOUR PERSONAL FITNESS COACH" text overlay) → transformations auto-slideshow (before/after, mock placeholder images) → "How can I help you" → services preview → pricing cards → blog preview → CTA
- [ ] 1.9 About page — coach bio, certifications, stats (copy content from onlinetrener.rs)
- [ ] 1.10 Services page — 3 tiers with detailed descriptions
- [ ] 1.11 Pricing page — comparison table, CTA buttons
- [ ] 1.12 Contact page — form that saves to Supabase `contact_messages`
- [ ] 1.13 Privacy policy page
- [ ] 1.14 SEO setup — meta tags, Open Graph, sitemap.xml, robots.txt, structured data

## Phase 2: Auth & Exercise Library
- [ ] 2.1 Auth pages — login, register, forgot password (Supabase Auth)
- [ ] 2.2 Auth middleware — protect client/admin routes
- [ ] 2.3 Role management — admin vs client detection from profiles table
- [ ] 2.4 Exercise library — public listing page with category filter
- [ ] 2.5 Single exercise page — video player, description, related exercises
- [ ] 2.6 Admin: exercise CRUD — create/edit/delete exercises
- [ ] 2.7 Admin: video upload to Supabase Storage with thumbnail
- [ ] 2.8 Admin: exercise category management

## Phase 3: Client Portal & Training Plans
- [ ] 3.1 Client dashboard — today's training overview, plan status
- [ ] 3.2 Training plan viewer — daily view with exercises, sets, reps, rest
- [ ] 3.3 Exercise links in training plan — click to see video/description
- [ ] 3.4 Nutrition plan viewer
- [ ] 3.5 Client profile page — edit info, view subscription status

## Phase 4: Admin Panel
- [ ] 4.1 Admin layout — sidebar nav, dashboard with stats
- [ ] 4.2 User management — list, search, filter, view details
- [ ] 4.3 User detail — change role, assign subscription tier, view questionnaire
- [ ] 4.4 Training plan builder — create plan, add days, add exercises
- [ ] 4.5 Exercise auto-linking — type exercise name → suggest from library → link
- [ ] 4.6 Training plan copy — duplicate full plan for another client
- [ ] 4.7 Nutrition plan builder
- [ ] 4.8 Contact message inbox — list, mark as read
- [ ] 4.9 Questionnaire viewer — list submitted forms, view details

## Phase 5: Blog & Transformations
- [ ] 5.1 Blog listing page — paginated, tag filtering
- [ ] 5.2 Single blog post page — rich content, SEO meta
- [ ] 5.3 Admin: blog editor — rich text, multilingual fields, cover image upload
- [ ] 5.4 Transformations gallery page — before/after with lightbox
- [ ] 5.5 Admin: transformation manager — upload pairs, add descriptions
- [ ] 5.6 Admin: site settings editor — pricing text, service descriptions

## Phase 6: Questionnaire & Polish
- [ ] 6.1 Initial questionnaire — multi-step form, saves to Supabase
- [ ] 6.2 Full SEO audit — structured data (JSON-LD), hreflang, performance
- [ ] 6.3 Image optimization — next/image, lazy loading, WebP
- [ ] 6.4 Cross-browser testing (Chrome, Safari, Firefox, mobile)
- [ ] 6.5 Final review with Aleksa and Aleksandar
