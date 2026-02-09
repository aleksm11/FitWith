import { createClient } from "./client";
import type { UserRole } from "./types";

type AuthResult = {
  error: string | null;
};

/** Sign in with email + password */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}

/** Sign up with email + password */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { error: error?.message ?? null };
}

/** Sign in with Google OAuth */
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback${
        redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""
      }`,
    },
  });
}

/** Sign in with Apple OAuth */
export async function signInWithApple(redirectTo?: string) {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: `${window.location.origin}/auth/callback${
        redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""
      }`,
    },
  });
}

/** Sign out */
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

/** Get current session (client-side) */
export async function getSession() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/** Get current user (client-side) */
export async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Get user role from profiles table */
export async function getUserRole(
  userId: string
): Promise<UserRole | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .single();
  return (data?.role as UserRole) ?? null;
}
