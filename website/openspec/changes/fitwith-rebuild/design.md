# Design Decisions — FitWith Rebuild

## 1. Why Supabase over custom backend?
- Shared auth between website and future mobile app
- Built-in RLS eliminates most API middleware
- Storage with CDN for videos
- Real-time subscriptions if needed later
- Free tier generous enough for initial launch

## 2. Why next-intl over next-i18next?
- Better App Router support (Next.js 16)
- Server component friendly
- Simpler message file structure
- Built-in middleware for locale detection

## 3. Content structure: DB columns vs JSONB
- **Structured columns** for exercises, training plans (need querying, filtering, sorting)
- **JSONB** for questionnaires (flexible schema), nutrition plans (varied formats)
- **Trilingual columns** (`_sr`, `_en`, `_ru`) over separate translation tables — simpler queries, this is a small site not a CMS

## 4. Exercise auto-linking approach
- Fuzzy text matching on exercise name when admin types in training plan builder
- Dropdown suggestions from exercise library
- On select, stores `exercise_id` foreign key
- Client sees exercise name as a clickable link to the exercise page with video

## 5. Video hosting: Supabase Storage
- Start with Supabase Storage (5GB free, then $0.021/GB)
- Exercise videos are short (30s-2min), ~10-50MB each
- If library grows large, migrate to Cloudflare R2 (cheaper for bandwidth)
- Videos served via Supabase CDN URL

## 6. Admin panel: built-in vs separate
- Built into the same Next.js app under `/admin` routes
- Protected by middleware + RLS
- No separate admin deployment needed
- Rich text editor: Tiptap (lightweight, React-native support for future app)

## 7. DNS cutover strategy
- Build and deploy to Vercel on staging subdomain first
- When ready: point onlinetrener.rs DNS to Vercel
- Keep WordPress backup for 30 days
- Set up 301 redirects for old URL structure (WordPress slugs → new routes)
