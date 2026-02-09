# Tasks — Phase 2A: Auth System

- [ ] Create auth pages (login, register, forgot-password) at `app/[locale]/(auth)/` with dark theme, centered card layout, orange accent buttons
- [ ] Wire up Supabase Auth (email/password) — signUp, signIn, signOut, resetPassword using `@supabase/ssr`
- [ ] Update middleware.ts to protect `/portal/*` and `/admin/*` routes — redirect unauthenticated users to login
- [ ] Add role detection: query `profiles.role` after login. Admin = 'admin', Client = 'client'
- [ ] Add auth translations to sr.json, en.json, ru.json (login, register, forgot-password labels/messages)
- [ ] Create placeholder pages at `/portal` and `/admin` showing "Welcome, {name}" to verify auth flow works
- [ ] Run `npm run build` — must pass with 0 errors
