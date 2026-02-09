import { createClient } from "./client";
import type {
  Exercise,
  ExerciseCategory,
  BlogPost,
  Transformation,
  TrainingPlan,
  TrainingDay,
  NutritionPlan,
  ContactMessage,
  Questionnaire,
  Profile,
} from "./types";

// ============================================================
// PUBLIC QUERIES
// ============================================================

export async function getExercises(category?: string) {
  const supabase = createClient();
  let query = supabase.from("exercises").select("*").order("created_at", { ascending: false });
  if (category) {
    query = query.eq("category", category);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as Exercise[];
}

export async function getExerciseBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as Exercise;
}

export async function getExerciseCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exercise_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as ExerciseCategory[];
}

export async function getBlogPosts(limit?: number) {
  const supabase = createClient();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return data as BlogPost[];
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (error) return null;
  return data as BlogPost;
}

export async function getTransformations() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transformations")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as Transformation[];
}

// ============================================================
// CLIENT QUERIES (authenticated)
// ============================================================

export async function getMyProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (error) return null;
  return data as Profile;
}

export async function getMyTrainingPlan() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("training_plans")
    .select("*, training_days(*, training_exercises(*))")
    .eq("client_id", user.id)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return data as TrainingPlan & { training_days: (TrainingDay & { training_exercises: unknown[] })[] };
}

export async function getMyNutritionPlan() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("nutrition_plans")
    .select("*")
    .eq("client_id", user.id)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return data as NutritionPlan;
}

// ============================================================
// FORM SUBMISSIONS
// ============================================================

export async function submitContactMessage(message: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const supabase = createClient();
  const { error } = await supabase.from("contact_messages").insert(message);
  if (error) throw error;
}

export async function submitQuestionnaire(data: Record<string, unknown>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("questionnaires")
    .insert({ user_id: user.id, data });
  if (error) throw error;
}

// ============================================================
// ADMIN QUERIES
// ============================================================

export async function getUsers(search?: string) {
  const supabase = createClient();
  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as Profile[];
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("user_id", userId);
  if (error) throw error;
}

export async function updateUserTier(userId: string, tier: string, active: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ subscription_tier: tier, subscription_active: active })
    .eq("user_id", userId);
  if (error) throw error;
}

export async function getContactMessages() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ContactMessage[];
}

export async function markMessageRead(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id);
  if (error) throw error;
}

export async function getQuestionnaires() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("questionnaires")
    .select("*, profiles(full_name, email)")
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return data as (Questionnaire & { profiles: { full_name: string; email: string } })[];
}
