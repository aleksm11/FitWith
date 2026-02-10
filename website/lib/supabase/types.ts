// Database types matching supabase/schema.sql

export type UserRole = "pending" | "client" | "admin";
export type SubscriptionTier = "mentoring" | "training" | "nutrition" | "none";
export type Locale = "sr" | "en" | "ru";

// ============================================================
// PROFILES
// ============================================================
export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  subscription_active: boolean;
  subscription_end_date: string | null;
  plan_features: string[];
  preferred_locale: Locale;
  created_at: string;
  updated_at: string;
}

// ============================================================
// EXERCISE CATEGORIES
// ============================================================
export interface ExerciseCategory {
  id: string;
  name_sr: string;
  name_en: string;
  name_ru: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

// ============================================================
// EXERCISES
// ============================================================
export interface Exercise {
  id: string;
  name_sr: string;
  name_en: string;
  name_ru: string;
  description_sr: string | null;
  description_en: string | null;
  description_ru: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  category_id: string | null;
  muscle_group: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface ExerciseWithCategory extends Exercise {
  category: ExerciseCategory | null;
}

// ============================================================
// TRAINING PLANS
// ============================================================
export interface TrainingPlan {
  id: string;
  client_id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrainingDay {
  id: string;
  plan_id: string;
  day_number: number;
  day_name_sr: string | null;
  day_name_en: string | null;
  day_name_ru: string | null;
  notes: string | null;
  sort_order: number;
}

export interface TrainingExercise {
  id: string;
  day_id: string;
  exercise_id: string | null;
  exercise_name: string | null;
  sets: number | null;
  reps: string | null;
  rest_seconds: number | null;
  notes: string | null;
  sort_order: number;
}

export interface TrainingDayWithExercises extends TrainingDay {
  exercises: (TrainingExercise & { exercise?: Exercise | null })[];
}

export interface TrainingPlanFull extends TrainingPlan {
  days: TrainingDayWithExercises[];
}

// ============================================================
// NUTRITION PLANS
// ============================================================
export interface NutritionPlan {
  id: string;
  client_id: string;
  data: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// BLOG POSTS
// ============================================================
export interface BlogPost {
  id: string;
  title_sr: string;
  title_en: string;
  title_ru: string;
  slug: string;
  content_sr: string | null;
  content_en: string | null;
  content_ru: string | null;
  excerpt_sr: string | null;
  excerpt_en: string | null;
  excerpt_ru: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  author_id: string | null;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// TRANSFORMATIONS
// ============================================================
export interface Transformation {
  id: string;
  client_name: string | null;
  description_sr: string | null;
  description_en: string | null;
  description_ru: string | null;
  before_image_url: string;
  after_image_url: string;
  duration: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

// ============================================================
// QUESTIONNAIRES
// ============================================================
export interface Questionnaire {
  id: string;
  user_id: string;
  data: Record<string, unknown>;
  submitted_at: string;
}

// ============================================================
// CONTACT MESSAGES
// ============================================================
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ============================================================
// SITE SETTINGS
// ============================================================
export interface SiteSetting {
  id: string;
  key: string;
  value_sr: string | null;
  value_en: string | null;
  value_ru: string | null;
  updated_at: string;
}

// ============================================================
// HELPERS
// ============================================================

/** Get the localized field name for a given locale */
export function localizedField<T extends Record<string, unknown>>(
  row: T,
  field: string,
  locale: Locale
): string {
  const key = `${field}_${locale}` as keyof T;
  return (row[key] as string) ?? (row[`${field}_sr` as keyof T] as string) ?? "";
}
