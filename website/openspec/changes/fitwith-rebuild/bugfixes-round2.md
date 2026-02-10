# FitWith Bugfixes Round 2

## Quick CSS/UI Fixes

### R2-1: Logo spacing — "Fit" still separated from "WithAS"
- **File:** `components/sections/Navbar.tsx`, `components/sections/Footer.tsx`
- **Issue:** JSX whitespace creates a visible space between "Fit" and "WithAS" despite using `{"Fit"}` fix
- **Fix:** Ensure zero whitespace — try wrapping entire text in a single span or using CSS `letter-spacing`/`word-spacing`

### R2-2: TVOJ hollow text stroke overlaps
- **File:** `components/sections/HeroSection.tsx`
- **Issue:** The `-webkit-text-stroke` on "TVOJ" creates visible overlapping artifacts at letter intersections
- **Fix:** Use `paint-order: stroke fill` CSS property to render stroke behind fill, or use SVG text for cleaner strokes

### R2-9: Portal logo mismatch
- **Files:** `app/[locale]/(portal)/layout.tsx`, `app/[locale]/(admin)/layout.tsx`
- **Issue:** Portal sidebar shows "FitWith" without SVG icon and without "AS"
- **Fix:** Use same logo component as homepage — SVG icon + "FitWithAS" with no spaces

### R2-13: Decorative diagonal stripes on hero image
- **File:** `components/sections/HeroSection.tsx`
- **Issue:** Current stripes are small horizontal orange lines. Should be large diagonal bands overlaying the hero image corner (like Figma reference)
- **Fix:** Replace current stripe divs with diagonal CSS transforms — semi-transparent orange bands at ~45° angle on the right side of the image

## Navbar/Layout Changes

### R2-10: "Plan i Program" button when logged in
- **Files:** `components/sections/Navbar.tsx`
- **Desktop:** Add "Plan i Program" button in navbar (between nav links and language switcher) that links to `/portal`. Only visible when logged in.
- **Mobile:** Replace the email/name display next to logo with a "Plan i Program" button linking to portal. Move user's full name (NOT email) inside hamburger menu.

### R2-11: Portal uses same navbar as public site
- **Files:** `app/[locale]/(portal)/layout.tsx`
- **Issue:** Portal has its own sidebar layout. Should use the same Navbar component as the public pages.
- **Fix:** Remove portal-specific sidebar. Portal pages render under the main navbar. Portal-specific navigation (Početna, Plan treninga, Plan ishrane, Profil, Clients) can be tabs/sub-nav below the main navbar, or a secondary horizontal nav.

### R2-12: Mobile hamburger sidebar bugs
- **File:** `components/sections/Navbar.tsx`
- **Issues:**
  1. When scrolled down, navbar semi-transparent → sidebar becomes fully transparent (should stay opaque)
  2. Sidebar should be half screen width or less, not full width
  3. "Plan i Program" portal button at the bottom of sidebar
- **Fix:** Sidebar background always opaque (`bg-[#0A0A0A]`), `max-w-[280px]` or `w-[60vw]`, portal button sticky at bottom

## Profile Fixes

### R2-3: Email field read-only with change flow
- **Files:** `app/[locale]/(portal)/profil/ProfileContent.tsx`
- **Issue:** Email field is editable but shouldn't be directly editable
- **Fix:** Show email as read-only text with a "Change email" link/button. On click, show input for new email + submit. Backend sends verification to new email. On confirmation, migrate profile. For now, just make it read-only with a TODO comment for the change flow.

### R2-4: Profile form not saving / not autofilling
- **Files:** `app/[locale]/(portal)/profil/ProfileContent.tsx`
- **Issue:** Form fields don't autofill with existing data. Saving full name doesn't update — navbar still shows email.
- **Fix:**
  1. On load, fetch profile from Supabase and populate form fields
  2. On submit, update `profiles` table in Supabase
  3. After successful save, refresh the navbar state (profile name should appear instead of email)
  4. Show success/error toast on save

## Major Features

### R2-5: Admin edit workout/nutrition plans
- **Files:** Portal plan pages (`plan-treninga/`, `plan-ishrane/`)
- **Issue:** Admin sees empty state, can't edit plans
- **Fix:**
  1. Admin sees edit (pencil) icon button on plans
  2. Clicking edit opens a structured form/table editor
  3. Training plan: days of week, exercises per day (name, sets, reps, rest), notes
  4. Nutrition plan: meals per day (meal name, foods, calories, protein, carbs, fat), daily totals
  5. Save to Supabase (need `workout_plans` and `nutrition_plans` tables)
  6. Clean table UI matching the existing design language

### R2-6: Admin Clients tab
- **Files:** New portal page `app/[locale]/(portal)/klijenti/`
- **Sidebar:** New "Klijenti" tab below Profil (admin-only)
- **Features:**
  1. Search/list all registered users
  2. Click on client → see their profile, training plan, nutrition plan
  3. Assign plan type: nutrition only, training only, or both
  4. Client sidebar tabs filtered by assigned plan (no "Plan treninga" if not paid for it)
  5. Clear header showing "Viewing: [Client Name]" when editing someone else's plan
  6. "Templates" subtab under Clients section

### R2-7: Plan templates
- **Files:** New portal page `app/[locale]/(portal)/klijenti/sabloni/` (or similar)
- **Features:**
  1. Admin can create and save reusable training/nutrition plan templates
  2. Templates list page with create/edit/delete
  3. When editing a client's plan, "Add template" button to insert a template
  4. After inserting, admin can customize specific fields for that client
  5. Supabase tables: `plan_templates` (id, name, type: training|nutrition, data: jsonb, created_by, created_at)

### R2-8: Weekly report notification
- **Files:** Portal questionnaire popup component
- **Issue:** Currently nags on every visit. Should be once per week.
- **Fix:**
  1. Store `last_report_submitted_at` in profiles or separate table
  2. Show popup only if ≥7 days since last submission (interval configurable)
  3. After submission, update timestamp
  4. Don't show again until next cycle

## Supabase Schema Changes Needed
- `workout_plans` table (user_id, plan_data jsonb, assigned_by, created_at, updated_at)
- `nutrition_plans` table (user_id, plan_data jsonb, assigned_by, created_at, updated_at)
- `plan_templates` table (id, name, type, data jsonb, created_by, created_at)
- Add `plan_type` column to profiles (enum: 'training', 'nutrition', 'both', null)
- Add `last_report_at` column to profiles
- RLS policies for admin access to all plans
