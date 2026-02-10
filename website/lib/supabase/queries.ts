import { createClient } from "./client";
import type {
  Exercise,
  ExerciseCategory,
  BlogPost,
  Transformation,
  TrainingPlan,
  TrainingDay,
  TrainingExercise,
  NutritionPlan,
  NutritionPlanMeal,
  ContactMessage,
  Questionnaire,
  Profile,
  SiteSetting,
  PlanTemplate,
  WorkoutPlan,
  WorkoutPlanWeek,
  WorkoutPlanDay,
  WorkoutPlanExercise,
} from "./types";

// ============================================================
// PUBLIC QUERIES
// ============================================================

export async function getExercises(categoryId?: string) {
  const supabase = createClient();
  let query = supabase.from("exercises").select("*, exercise_categories(*)").order("created_at", { ascending: false });
  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as (Exercise & { exercise_categories: ExerciseCategory | null })[];
}

export async function getExerciseBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select("*, exercise_categories(*)")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as Exercise & { exercise_categories: ExerciseCategory | null };
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

export async function getSiteSettings() {
  const supabase = createClient();
  const { data, error } = await supabase.from("site_settings").select("*");
  if (error) throw error;
  return data as SiteSetting[];
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

export async function updateMyProfile(updates: Partial<Pick<Profile, "full_name" | "phone" | "preferred_locale">>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", user.id);
  if (error) throw error;
}

export async function getMyTrainingPlan() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  // First get profile to get profile id
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return null;
  const { data, error } = await supabase
    .from("training_plans")
    .select("*, training_days(*, training_exercises(*, exercises(*)))")
    .eq("client_id", profile.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error) return null;
  return data as TrainingPlan & {
    training_days: (TrainingDay & {
      training_exercises: (TrainingExercise & { exercises: Exercise | null })[];
    })[];
  };
}

export async function getMyNutritionPlan() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return null;
  const { data, error } = await supabase
    .from("nutrition_plans")
    .select("*, nutrition_plan_meals(*)")
    .eq("client_id", profile.id)
    .eq("status", "active")
    .limit(1)
    .single();
  if (error) return null;
  return data as NutritionPlan & { nutrition_plan_meals: NutritionPlanMeal[] };
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

export async function getMyQuestionnaire() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("questionnaires")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function submitQuestionnaire(data: Record<string, unknown>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase
    .from("questionnaires")
    .insert({ user_id: user.id, data });
  if (error) throw error;
  // Update last_report_at on profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (profile) {
    await supabase
      .from("profiles")
      .update({ last_report_at: new Date().toISOString() })
      .eq("id", profile.id);
  }
}

// ============================================================
// ADMIN QUERIES
// ============================================================

// --- Dashboard ---
export async function getAdminStats() {
  const supabase = createClient();
  const [profiles, plans, messages, exercises] = await Promise.all([
    supabase.from("profiles").select("id, role, subscription_active", { count: "exact" }),
    supabase.from("training_plans").select("id, is_active", { count: "exact" }),
    supabase.from("contact_messages").select("id, is_read", { count: "exact" }),
    supabase.from("exercises").select("id", { count: "exact" }),
  ]);
  const profileData = profiles.data || [];
  const planData = plans.data || [];
  const messageData = messages.data || [];
  return {
    totalClients: profileData.filter((p) => p.role === "client").length,
    activeClients: profileData.filter((p) => p.subscription_active).length,
    activePlans: planData.filter((p) => p.is_active).length,
    pendingMessages: messageData.filter((m) => !m.is_read).length,
    totalExercises: exercises.count || 0,
  };
}

// --- Users ---
export async function getUsers(search?: string, tier?: string) {
  const supabase = createClient();
  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }
  if (tier && tier !== "all") {
    query = query.eq("subscription_tier", tier);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as Profile[];
}

export async function updateUserRole(profileId: string, role: string) {
  const supabase = createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", profileId);
  if (error) throw error;
}

export async function updateUserTier(profileId: string, tier: string, active: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ subscription_tier: tier, subscription_active: active })
    .eq("id", profileId);
  if (error) throw error;
}

export async function updateUserSubscription(profileId: string, endDate: string | null, planFeatures: string[]) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ subscription_end_date: endDate, plan_features: planFeatures })
    .eq("id", profileId);
  if (error) throw error;
}

// --- Exercises ---
export async function createExercise(exercise: {
  name_sr: string;
  name_en: string;
  name_ru: string;
  description_sr?: string;
  description_en?: string;
  description_ru?: string;
  slug: string;
  category_id?: string;
  muscle_group?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from("exercises").insert(exercise).select().single();
  if (error) throw error;
  return data as Exercise;
}

export async function updateExercise(id: string, updates: Partial<Exercise>) {
  const supabase = createClient();
  const { error } = await supabase.from("exercises").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteExercise(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("exercises").delete().eq("id", id);
  if (error) throw error;
}

// --- Exercise Categories ---
export async function createExerciseCategory(category: {
  name_sr: string;
  name_en: string;
  name_ru: string;
  slug: string;
  sort_order?: number;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from("exercise_categories").insert(category).select().single();
  if (error) throw error;
  return data as ExerciseCategory;
}

// --- Training Plans ---
export async function getTrainingPlans() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("training_plans")
    .select("*, profiles(full_name, email), training_days(*, training_exercises(*))")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as (TrainingPlan & {
    profiles: { full_name: string; email: string };
    training_days: (TrainingDay & { training_exercises: TrainingExercise[] })[];
  })[];
}

export async function createTrainingPlan(plan: {
  client_id: string;
  name: string;
  start_date?: string;
  end_date?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from("training_plans").insert(plan).select().single();
  if (error) throw error;
  return data as TrainingPlan;
}

export async function updateTrainingPlan(id: string, updates: Partial<TrainingPlan>) {
  const supabase = createClient();
  const { error } = await supabase.from("training_plans").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteTrainingPlan(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("training_plans").delete().eq("id", id);
  if (error) throw error;
}

export async function copyTrainingPlan(planId: string, newClientId: string) {
  const supabase = createClient();
  // Fetch original plan with days and exercises
  const { data: original, error: fetchError } = await supabase
    .from("training_plans")
    .select("*, training_days(*, training_exercises(*))")
    .eq("id", planId)
    .single();
  if (fetchError || !original) throw fetchError || new Error("Plan not found");

  // Create new plan
  const { data: newPlan, error: planError } = await supabase
    .from("training_plans")
    .insert({
      client_id: newClientId,
      name: `${original.name} (kopija)`,
      start_date: original.start_date,
      end_date: original.end_date,
    })
    .select()
    .single();
  if (planError || !newPlan) throw planError;

  // Copy days and exercises
  for (const day of (original as { training_days: (TrainingDay & { training_exercises: TrainingExercise[] })[] }).training_days) {
    const { data: newDay, error: dayError } = await supabase
      .from("training_days")
      .insert({
        plan_id: newPlan.id,
        day_number: day.day_number,
        day_name_sr: day.day_name_sr,
        day_name_en: day.day_name_en,
        day_name_ru: day.day_name_ru,
        notes: day.notes,
        sort_order: day.sort_order,
      })
      .select()
      .single();
    if (dayError || !newDay) continue;

    const exercisesToInsert = day.training_exercises.map((ex) => ({
      day_id: newDay.id,
      exercise_id: ex.exercise_id,
      exercise_name: ex.exercise_name,
      sets: ex.sets,
      reps: ex.reps,
      rest_seconds: ex.rest_seconds,
      notes: ex.notes,
      sort_order: ex.sort_order,
    }));
    if (exercisesToInsert.length > 0) {
      await supabase.from("training_exercises").insert(exercisesToInsert);
    }
  }

  return newPlan as TrainingPlan;
}

// --- Training Days ---
export async function createTrainingDay(day: {
  plan_id: string;
  day_number: number;
  day_name_sr?: string;
  day_name_en?: string;
  day_name_ru?: string;
  notes?: string;
  sort_order?: number;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from("training_days").insert(day).select().single();
  if (error) throw error;
  return data as TrainingDay;
}

export async function deleteTrainingDay(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("training_days").delete().eq("id", id);
  if (error) throw error;
}

// --- Training Exercises ---
export async function createTrainingExercise(exercise: {
  day_id: string;
  exercise_id?: string;
  exercise_name?: string;
  sets?: number;
  reps?: string;
  rest_seconds?: number;
  notes?: string;
  sort_order?: number;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from("training_exercises").insert(exercise).select().single();
  if (error) throw error;
  return data as TrainingExercise;
}

export async function updateTrainingExercise(id: string, updates: Partial<TrainingExercise>) {
  const supabase = createClient();
  const { error } = await supabase.from("training_exercises").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteTrainingExercise(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("training_exercises").delete().eq("id", id);
  if (error) throw error;
}

// --- Exercise Search (for auto-linking) ---
export async function searchExercises(query: string, locale: string = "sr") {
  const supabase = createClient();
  const field = `name_${locale}`;
  const { data, error } = await supabase
    .from("exercises")
    .select("id, name_sr, name_en, name_ru, slug")
    .ilike(field, `%${query}%`)
    .limit(10);
  if (error) throw error;
  return data as Pick<Exercise, "id" | "name_sr" | "name_en" | "name_ru" | "slug">[];
}

// --- Nutrition Plans ---
export async function getNutritionPlans() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("nutrition_plans")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as (NutritionPlan & { profiles: { full_name: string; email: string } })[];
}

export async function createNutritionPlan(plan: {
  client_id: string;
  name: string;
  daily_calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fats_g?: number;
}) {
  const supabase = createClient();
  const { data: result, error } = await supabase.from("nutrition_plans").insert(plan).select().single();
  if (error) throw error;
  return result as NutritionPlan;
}

export async function updateNutritionPlan(id: string, updates: Partial<NutritionPlan>) {
  const supabase = createClient();
  const { error } = await supabase.from("nutrition_plans").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteNutritionPlan(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("nutrition_plans").delete().eq("id", id);
  if (error) throw error;
}

// --- Blog Posts ---
export async function getAllBlogPosts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as BlogPost[];
}

export async function createBlogPost(post: Partial<BlogPost>) {
  const supabase = createClient();
  const { data, error } = await supabase.from("blog_posts").insert(post).select().single();
  if (error) throw error;
  return data as BlogPost;
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>) {
  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteBlogPost(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}

// --- Transformations ---
export async function createTransformation(transformation: Partial<Transformation>) {
  const supabase = createClient();
  const { data, error } = await supabase.from("transformations").insert(transformation).select().single();
  if (error) throw error;
  return data as Transformation;
}

export async function updateTransformation(id: string, updates: Partial<Transformation>) {
  const supabase = createClient();
  const { error } = await supabase.from("transformations").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteTransformation(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("transformations").delete().eq("id", id);
  if (error) throw error;
}

// --- Contact Messages ---
export async function getContactMessages() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ContactMessage[];
}

export async function markMessageRead(id: string, isRead: boolean = true) {
  const supabase = createClient();
  const { error } = await supabase.from("contact_messages").update({ is_read: isRead }).eq("id", id);
  if (error) throw error;
}

// --- Questionnaires ---
export async function getQuestionnaires() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("questionnaires")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return data as Questionnaire[];
}

// --- Site Settings ---
export async function updateSiteSetting(key: string, values: { value_sr?: string; value_en?: string; value_ru?: string }) {
  const supabase = createClient();
  const { data: existing } = await supabase.from("site_settings").select("id").eq("key", key).single();
  if (existing) {
    const { error } = await supabase.from("site_settings").update(values).eq("key", key);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("site_settings").insert({ key, ...values });
    if (error) throw error;
  }
}

// --- Client Management (admin) ---
export async function getClientProfile(profileId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single();
  if (error) return null;
  return data as Profile;
}

export async function updateUserPlanType(profileId: string, planType: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ plan_type: planType })
    .eq("id", profileId);
  if (error) throw error;
}

export async function getClientWorkoutPlans(clientId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("workout_plans")
    .select("*, workout_plan_weeks(*, workout_plan_days(*, workout_plan_exercises(*, exercises(*))))")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as (WorkoutPlan & {
    workout_plan_weeks: (WorkoutPlanWeek & {
      workout_plan_days: (WorkoutPlanDay & {
        workout_plan_exercises: (WorkoutPlanExercise & { exercises: Exercise | null })[];
      })[];
    })[];
  })[];
}

export async function getClientNutritionPlans(clientId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("nutrition_plans")
    .select("*, nutrition_plan_meals(*)")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as (NutritionPlan & { nutrition_plan_meals: NutritionPlanMeal[] })[];
}

export async function getClientTrainingPlans(clientId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("training_plans")
    .select("*, training_days(*, training_exercises(*, exercises(*)))")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as (TrainingPlan & {
    training_days: (TrainingDay & {
      training_exercises: (TrainingExercise & { exercises: Exercise | null })[];
    })[];
  })[];
}

// --- Plan Templates ---
export async function getPlanTemplates(type?: string) {
  const supabase = createClient();
  let query = supabase.from("plan_templates").select("*").order("created_at", { ascending: false });
  if (type) query = query.eq("type", type);
  const { data, error } = await query;
  if (error) throw error;
  return data as PlanTemplate[];
}

export async function getPlanTemplate(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("plan_templates")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as PlanTemplate;
}

export async function createPlanTemplate(template: {
  name: string;
  type: string;
  description?: string;
  duration_weeks?: number;
  difficulty?: string;
  goal?: string;
  data?: Record<string, unknown>;
  tags?: string[];
  created_by?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from("plan_templates").insert(template).select().single();
  if (error) throw error;
  return data as PlanTemplate;
}

export async function updatePlanTemplate(id: string, updates: Partial<PlanTemplate>) {
  const supabase = createClient();
  const { error } = await supabase.from("plan_templates").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deletePlanTemplate(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("plan_templates").delete().eq("id", id);
  if (error) throw error;
}

// --- Workout Plans CRUD ---
export async function createWorkoutPlan(plan: {
  client_id: string;
  name: string;
  template_id?: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  created_by?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from("workout_plans").insert(plan).select().single();
  if (error) throw error;
  return data as WorkoutPlan;
}

export async function updateWorkoutPlan(id: string, updates: Partial<WorkoutPlan>) {
  const supabase = createClient();
  const { error } = await supabase.from("workout_plans").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteWorkoutPlan(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("workout_plans").delete().eq("id", id);
  if (error) throw error;
}

// --- Workout Plan Weeks ---
export async function createWorkoutPlanWeek(week: {
  plan_id: string;
  week_number: number;
  name?: string;
  deload?: boolean;
  notes?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from("workout_plan_weeks").insert(week).select().single();
  if (error) throw error;
  return data as WorkoutPlanWeek;
}

export async function deleteWorkoutPlanWeek(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("workout_plan_weeks").delete().eq("id", id);
  if (error) throw error;
}

// --- Workout Plan Days ---
export async function createWorkoutPlanDay(day: {
  week_id: string;
  day_number: number;
  name?: string;
  focus?: string;
  notes?: string;
  sort_order?: number;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from("workout_plan_days").insert(day).select().single();
  if (error) throw error;
  return data as WorkoutPlanDay;
}

export async function deleteWorkoutPlanDay(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("workout_plan_days").delete().eq("id", id);
  if (error) throw error;
}

// --- Workout Plan Exercises ---
export async function createWorkoutPlanExercise(exercise: {
  day_id: string;
  exercise_id?: string;
  exercise_name?: string;
  sets?: number;
  reps?: string;
  weight?: string;
  rest_seconds?: number;
  tempo?: string;
  superset_group?: number;
  notes?: string;
  sort_order?: number;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from("workout_plan_exercises").insert(exercise).select().single();
  if (error) throw error;
  return data as WorkoutPlanExercise;
}

export async function updateWorkoutPlanExercise(id: string, updates: Partial<WorkoutPlanExercise>) {
  const supabase = createClient();
  const { error } = await supabase.from("workout_plan_exercises").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteWorkoutPlanExercise(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("workout_plan_exercises").delete().eq("id", id);
  if (error) throw error;
}

// --- Nutrition Plan Meals ---
export async function createNutritionPlanMeal(meal: {
  plan_id: string;
  meal_number: number;
  name?: string;
  time_suggestion?: string;
  foods?: Record<string, unknown>[];
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fats_g?: number;
  notes?: string;
  sort_order?: number;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from("nutrition_plan_meals").insert(meal).select().single();
  if (error) throw error;
  return data as NutritionPlanMeal;
}

export async function updateNutritionPlanMeal(id: string, updates: Partial<NutritionPlanMeal>) {
  const supabase = createClient();
  const { error } = await supabase.from("nutrition_plan_meals").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteNutritionPlanMeal(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("nutrition_plan_meals").delete().eq("id", id);
  if (error) throw error;
}

// --- File Upload ---
export async function uploadFile(bucket: string, path: string, file: File) {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicUrl;
}
