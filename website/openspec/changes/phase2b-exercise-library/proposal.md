# Phase 2B: Exercise Library (Public)

## Goal
Build public exercise library pages. Users can browse exercises by category, view individual exercises with video player.

## Tasks
1. Create exercise listing page at `app/[locale]/(public)/vezbe/page.tsx` — grid layout with category filter tabs (grudi, leđa, noge, ramena, ruke, stomak, korektivne, napredne)
2. Create ExerciseCard component — thumbnail placeholder, exercise name, category badge, muscle group tags
3. Create single exercise page `app/[locale]/(public)/vezbe/[slug]/page.tsx` — video player area (placeholder for now), description, instructions, related exercises
4. Add exercise translations to message files
5. Seed some mock exercise data (hardcoded array for now, will connect to Supabase later)
6. Add exercises to sitemap.ts
7. Run `npm run build` to verify

## Constraints
- Use placeholder images/videos (gray boxes with labels) — real content comes later via admin
- Category slugs in URL should be Serbian (matches existing onlinetrener.rs URL structure)
- Responsive: 1-col mobile, 2-col tablet, 3-col desktop
