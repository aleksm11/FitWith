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

## Priority Order
1. BUG-4 (Auth.logout translation) — quick fix
2. BUG-1 (verification URL) — Supabase config change
3. BUG-3 (login without verification) — Supabase config + client check
4. BUG-6 (profile auto-creation) — DB trigger
5. BUG-5 (mock data) — component rewrites
6. BUG-2 (OAuth) — needs decision from Aleksa
