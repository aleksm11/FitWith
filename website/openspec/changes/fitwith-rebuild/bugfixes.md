# Bugfixes — Found 2026-02-09

## BUG-1: Email verification link points to localhost:3000
- **Issue**: Supabase sends verification email with `localhost:3000` as redirect URL
- **Cause**: Supabase project's Site URL config still defaults to localhost
- **Fix**: Update Supabase Auth settings → Site URL to `https://website-alpha-seven-ivex9xlmyi.vercel.app` (and later `https://onlinetrener.rs`). Also update Redirect URLs allowlist.

## BUG-2: Google and Apple login not working
- **Issue**: OAuth providers (Google, Apple) buttons exist but aren't configured
- **Decision**: Keep them. Need to configure:
  - Google OAuth: Create OAuth client in Google Cloud Console, add client ID + secret to Supabase Auth providers
  - Apple Sign-In: Create Service ID in Apple Developer account, configure in Supabase
- **Action needed from Aleksa**: Provide Google Cloud Console + Apple Developer account access, or credentials

## BUG-3: Can login without email verification
- **Issue**: User can sign in even though email isn't verified
- **Cause**: Supabase Auth default allows login before email confirmation
- **Fix**: Enable "Confirm email" in Supabase Auth settings (Authentication → Providers → Email → toggle "Confirm email"). Also add client-side check to show "please verify your email" message if `user.email_confirmed_at` is null.

## BUG-4: "Auth.logout" shows as text instead of translated string
- **Issue**: Navbar shows raw translation key `Auth.logout` instead of actual text
- **Cause**: Missing `Auth.logout` key in all 3 message files (sr.json, en.json, ru.json)
- **Fix**: Add `"logout"` key under `"Auth"` section in all message files. Values: "Odjavi se" (sr), "Logout" (en), "Выйти" (ru). Also check if it should be under "Nav" namespace instead of "Auth".

## BUG-5: Portal/dashboard uses mock data instead of real Supabase data
- **Issue**: All portal pages show hardcoded mock data (subscription "Online mentorstvo", macros "2210 kcal", training "Grudi i triceps", etc.) instead of real user data
- **Scope**: Affects ALL portal pages — dashboard, training plan, nutrition plan, profile
- **Cause**: Components use hardcoded mock arrays/objects instead of querying Supabase
- **Fix**:
  - Dashboard: fetch user's real subscription tier from `profiles`, real training plan from `training_plans`/`training_days`/`training_exercises`, real nutrition data from `nutrition_plans`
  - Training page: fetch actual assigned training plan or show empty state. NOTE: the current mock training data structure (e.g. "Grudi i triceps", 5 exercises with sets/reps) is good — seed it as real data in the DB so the "today's training" section works with real queries
  - Nutrition page: fetch actual nutrition plan or show empty state
  - Profile page: fetch real profile data, allow editing real fields
  - ALL mock data arrays must be removed and replaced with Supabase queries
  - Show proper empty states everywhere when no data exists (new user has no plan yet)

## BUG-6: Navbar shows logged-in user's name incorrectly
- **Issue**: After login, navbar should show user's full name but profile query may fail if `profiles` table row doesn't exist yet for new users
- **Fix**: Create a Supabase trigger/function that auto-creates a `profiles` row on user signup. Fallback to email if no profile name exists.

## BUG-7: Logo should be "FitWithAS" not "FitWith"
- **Issue**: Logo in navbar shows "FitWith" but should be "FitWithAS"
- **Fix**: Update Navbar.tsx logo — `Fit<orange>With</orange><orange>AS</orange>` (or style AS separately if needed)

## BUG-9: Logged-in navbar shows email instead of full name
- **Issue**: After login, top-right shows email address (e.g. "aleksa.ma123@gmail.com") instead of full name
- **Cause**: Profile row doesn't exist yet for the user (BUG-6), so `profileName` is null and it falls back to `user.email.split("@")[0]` — but on mobile it seems to show the full email
- **Fix**: 
  - Depends on BUG-6 (auto-create profile with full_name from registration)
  - Registration form should collect full name and save to profiles table
  - Fallback display should truncate properly on mobile

## BUG-10: Safari mobile — slow load / possible layout issues
- **Issue**: Safari on iOS initially showed page cut off, but loaded correctly after a delay. Might be false alarm but check anyway.
- **Fix**:
  - Audit for `vh` usage — replace with `dvh` where needed (Safari dynamic toolbar)
  - Check page load performance — large bundle? Unoptimized images? Slow SSR?
  - Review if middleware (Supabase session refresh) adds latency on first load
  - Test `min-height: 100dvh` or `-webkit-fill-available` fallback on hero/full-height sections
  - Check if the mobile menu overlay causes scroll lock issues in Safari

## BUG-8: No way to access admin panel / become admin
- **Issue**: New users are always role "client", no UI or mechanism to become admin
- **Fix**:
  - After BUG-6 (profile auto-creation trigger), manually set Aleksa's account role to "admin" in Supabase SQL: `UPDATE profiles SET role = 'admin' WHERE email = '...'`
  - Add admin route: `/admin` — middleware already protects it, just need the role to be correct
  - Long-term: add a "promote to admin" button in admin panel (only visible to existing admins)

## BUG-11: Subscription section wording + expiry date + dynamic status
- **Issue**: "Član od" should be "Članarina važi do" and show subscription END date, not start date. Status should be dynamic based on expiry.
- **Fix**: 
  - Change label from "Član od" to "Članarina važi do" in translations
  - Display `subscription_end_date` instead of `created_at`
  - DB: add `subscription_end_date` column to `profiles` table if not present
  - Admin sets this when assigning subscription
  - **Status logic**: if `today < subscription_end_date` → "Aktivna" (green), if `today >= subscription_end_date` → "Neaktivna" (red). No hardcoded status — always computed from date.

## BUG-12: "Vaš plan uključuje" should be admin-configurable per client
- **Issue**: The plan features list (personalizovan plan treninga, ishrane, etc.) is hardcoded, but should be set by admin per client based on their subscription tier
- **Fix**:
  - Admin panel → user detail page: ability to select which features/perks each client's plan includes
  - Store in DB (either per-tier defaults in `site_settings` or per-client overrides)
  - Client portal reads from DB, not hardcoded list
  - Empty state if admin hasn't assigned features yet

## BUG-15: Social media links in footer need real URLs
- **Fix**: 
  - Instagram: https://www.instagram.com/fitwith.as
  - TikTok: https://www.tiktok.com/@fitwith.as
  - YouTube: remove or hide (no account yet)

## BUG-16: Registration form needs full name field
- **Issue**: Registration only asks email/password, no name collected
- **Fix**: Add "Ime i prezime" (full name) field to registration form. Save to `profiles.full_name` on signup.

## BUG-13: Footer "Usluge" links not clickable
- **Issue**: Footer services section (Online mentorstvo, Plan treninga, Plan ishrane) items are plain text, not links
- **Fix**: Link them to the services/pricing page with anchor sections, e.g. `/saradnja#mentorstvo`, `/saradnja#trening`, `/saradnja#ishrana` (or just `/saradnja` if no anchors exist)

## BUG-14: Footer shows "FitWith" not "FitWithAS" + copyright
- **Issue**: Footer logo says "FitWith" and copyright says "© 2026 FitWith" — should be "FitWithAS"
- **Fix**: Update footer logo and copyright text (same as BUG-7 for navbar)

## BUG-17: Desktop hero — too much empty space, layout issues
- **Issue**: Huge gap between hero text ("YOUR PERSONAL FITNESS COACH") and the stats section (100+ happy clients). Hero takes too much vertical space on desktop.
- **Fix**:
  - Move hero text lower (more centered vertically, less top padding)
  - Reduce hero section height — no need for full viewport height, compact it
  - Stats bar should sit closer to hero, not floating far below
  - Once real hero images are added, the right side won't be empty black

## BUG-18: Stats section — add more stats
- **Issue**: Only 3 stats (100+ happy clients, 4+ years, 1000+ plans). Could use more.
- **Fix**: Add "500+ vežbi" (exercises in library) as 4th stat.

## BUG-19: Transformations slideshow needs sliding animation
- **Issue**: Transformations section has no slide animation
- **Fix**: Add smooth sliding/fade transition animation to the auto-slideshow (CSS transition or lightweight carousel). Before/after cards should slide in from the side.

## BUG-20: Blog should show newest posts first
- **Issue**: Blog listing doesn't sort by date (newest first)
- **Fix**: Sort blog posts by `published_at DESC` in the query. Both on homepage preview and blog listing page.

## Priority Order
1. BUG-7 (logo FitWithAS) — quick fix
2. BUG-4 (Auth.logout translation) — quick fix
3. BUG-1 (verification URL) — Supabase config change
4. BUG-3 (login without verification) — Supabase config + client check
5. BUG-6 (profile auto-creation) — DB trigger
6. BUG-8 (admin access) — set Aleksa as admin after BUG-6
7. BUG-9 (email instead of name in navbar) — tied to BUG-6
8. BUG-5 (mock data → real Supabase data) — component rewrites + seed data
9. BUG-10 (Safari slow load) — performance check + viewport audit
10. BUG-11 (subscription wording + expiry) — translation + DB column
11. BUG-12 (plan features admin-configurable) — admin UI + DB
12. BUG-2 (Google/Apple OAuth) — waiting for credentials from Aleksa
