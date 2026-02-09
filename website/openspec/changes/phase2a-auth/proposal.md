# Phase 2A: Authentication System

## Goal
Add Supabase Auth with login, register, forgot-password pages. Protect client/admin routes with middleware. Detect roles from profiles table.

## Tasks
1. Create auth pages at `app/[locale]/(auth)/login/`, `register/`, `forgot-password/` — dark theme, orange accents, centered card layout
2. Wire up Supabase Auth (email/password) — signUp, signIn, signOut, resetPassword
3. Update middleware.ts to protect `/portal/*` (client) and `/admin/*` (admin) routes — redirect unauthenticated to login
4. Add role detection: query `profiles.role` after login, store in cookie/session. Admin = role 'admin', Client = role 'client'
5. Add auth translations to sr.json, en.json, ru.json
6. Create a simple `/portal` and `/admin` placeholder page that shows "Welcome, {name}" to verify auth flow works
7. Run `npm run build` to verify no errors

## Constraints
- Use `@supabase/ssr` for cookie-based auth (already installed)
- Use existing Supabase helpers in `lib/supabase/`
- Keep dark theme consistent with Phase 1
- Auth pages are public, portal/admin are protected
