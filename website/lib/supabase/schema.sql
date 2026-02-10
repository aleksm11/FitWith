-- FitWith Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'none' CHECK (subscription_tier IN ('mentoring', 'training', 'nutrition', 'none')),
  subscription_active BOOLEAN DEFAULT FALSE,
  subscription_end_date DATE,
  plan_features JSONB DEFAULT '[]',
  preferred_locale TEXT DEFAULT 'sr' CHECK (preferred_locale IN ('sr', 'en', 'ru')),
  plan_type TEXT NOT NULL DEFAULT 'none' CHECK (plan_type IN ('workout', 'nutrition', 'both', 'none')),
  last_report_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- EXERCISE CATEGORIES
-- ============================================================
CREATE TABLE exercise_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_sr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EXERCISES
-- ============================================================
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_sr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  description_sr TEXT,
  description_en TEXT,
  description_ru TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  category_id UUID REFERENCES exercise_categories(id) ON DELETE SET NULL,
  muscle_group TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRAINING PLANS
-- ============================================================
CREATE TABLE training_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRAINING DAYS
-- ============================================================
CREATE TABLE training_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES training_plans(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  day_name_sr TEXT,
  day_name_en TEXT,
  day_name_ru TEXT,
  notes TEXT,
  sort_order INTEGER DEFAULT 0
);

-- ============================================================
-- TRAINING EXERCISES
-- ============================================================
CREATE TABLE training_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_id UUID REFERENCES training_days(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
  exercise_name TEXT, -- fallback if exercise not in library
  sets INTEGER,
  reps TEXT, -- can be "8-12" or "to failure"
  rest_seconds INTEGER,
  notes TEXT,
  sort_order INTEGER DEFAULT 0
);

-- ============================================================
-- PLAN TEMPLATES (reusable workout/nutrition templates)
-- ============================================================
CREATE TABLE plan_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('workout', 'nutrition')),
  description TEXT,
  duration_weeks INTEGER DEFAULT 4,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  goal TEXT, -- e.g. 'muscle_gain', 'fat_loss', 'strength', 'maintenance'
  data JSONB NOT NULL DEFAULT '{}', -- full template structure
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WORKOUT PLANS (assigned to clients)
-- ============================================================
CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES plan_templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WORKOUT PLAN WEEKS
-- ============================================================
CREATE TABLE workout_plan_weeks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE NOT NULL,
  week_number INTEGER NOT NULL,
  name TEXT, -- e.g. "Adaptation Week"
  deload BOOLEAN DEFAULT FALSE,
  notes TEXT,
  UNIQUE(plan_id, week_number)
);

-- ============================================================
-- WORKOUT PLAN DAYS
-- ============================================================
CREATE TABLE workout_plan_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_id UUID REFERENCES workout_plan_weeks(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  name TEXT, -- e.g. "Push Day", "Upper Body"
  focus TEXT, -- e.g. "chest_triceps", "back_biceps", "legs"
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  UNIQUE(week_id, day_number)
);

-- ============================================================
-- WORKOUT PLAN EXERCISES
-- ============================================================
CREATE TABLE workout_plan_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_id UUID REFERENCES workout_plan_days(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
  exercise_name TEXT, -- fallback if exercise not in library
  sets INTEGER,
  reps TEXT, -- e.g. "8-12", "to failure", "AMRAP"
  weight TEXT, -- e.g. "80kg", "RPE 8", "bodyweight"
  rest_seconds INTEGER,
  tempo TEXT, -- e.g. "3-1-2-0"
  superset_group INTEGER, -- exercises with same group number are supersetted
  notes TEXT,
  sort_order INTEGER DEFAULT 0
);

-- ============================================================
-- NUTRITION PLANS (assigned to clients)
-- ============================================================
CREATE TABLE nutrition_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES plan_templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  goal TEXT, -- e.g. 'bulk', 'cut', 'maintenance', 'recomp'
  daily_calories INTEGER,
  protein_g INTEGER,
  carbs_g INTEGER,
  fats_g INTEGER,
  meals_per_day INTEGER DEFAULT 4,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  start_date DATE,
  end_date DATE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NUTRITION PLAN MEALS
-- ============================================================
CREATE TABLE nutrition_plan_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES nutrition_plans(id) ON DELETE CASCADE NOT NULL,
  meal_number INTEGER NOT NULL,
  name TEXT, -- e.g. "Breakfast", "Post-Workout"
  time_suggestion TEXT, -- e.g. "07:00", "After training"
  foods JSONB NOT NULL DEFAULT '[]', -- [{name, amount, unit, calories, protein, carbs, fats}]
  calories INTEGER,
  protein_g INTEGER,
  carbs_g INTEGER,
  fats_g INTEGER,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  UNIQUE(plan_id, meal_number)
);

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_sr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content_sr TEXT,
  content_en TEXT,
  content_ru TEXT,
  excerpt_sr TEXT,
  excerpt_en TEXT,
  excerpt_ru TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRANSFORMATIONS
-- ============================================================
CREATE TABLE transformations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT,
  description_sr TEXT,
  description_en TEXT,
  description_ru TEXT,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  duration TEXT, -- e.g. "12 nedelja"
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- QUESTIONNAIRES
-- ============================================================
CREATE TABLE questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SITE SETTINGS
-- ============================================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value_sr TEXT,
  value_en TEXT,
  value_ru TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ADMIN HELPER FUNCTION (SECURITY DEFINER to bypass RLS)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plan_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plan_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_plan_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins have full access to profiles" ON profiles FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- EXERCISES (public read)
CREATE POLICY "Anyone can view exercises" ON exercises FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage exercises" ON exercises FOR ALL USING (
  public.is_admin()
);

-- EXERCISE CATEGORIES (public read)
CREATE POLICY "Anyone can view categories" ON exercise_categories FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage categories" ON exercise_categories FOR ALL USING (
  public.is_admin()
);

-- TRAINING PLANS (own data)
CREATE POLICY "Clients can view own plans" ON training_plans FOR SELECT USING (
  client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all plans" ON training_plans FOR ALL USING (
  public.is_admin()
);

-- TRAINING DAYS
CREATE POLICY "Clients can view own training days" ON training_days FOR SELECT USING (
  plan_id IN (SELECT id FROM training_plans WHERE client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Admins can manage all training days" ON training_days FOR ALL USING (
  public.is_admin()
);

-- TRAINING EXERCISES
CREATE POLICY "Clients can view own training exercises" ON training_exercises FOR SELECT USING (
  day_id IN (SELECT id FROM training_days WHERE plan_id IN (SELECT id FROM training_plans WHERE client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
);
CREATE POLICY "Admins can manage all training exercises" ON training_exercises FOR ALL USING (
  public.is_admin()
);

-- PLAN TEMPLATES (admin manages, clients can view)
CREATE POLICY "Anyone can view plan templates" ON plan_templates FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage plan templates" ON plan_templates FOR ALL USING (
  public.is_admin()
);

-- WORKOUT PLANS (own data + admin full access)
CREATE POLICY "Clients can view own workout plans" ON workout_plans FOR SELECT USING (
  client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all workout plans" ON workout_plans FOR ALL USING (
  public.is_admin()
);

-- WORKOUT PLAN WEEKS
CREATE POLICY "Clients can view own workout weeks" ON workout_plan_weeks FOR SELECT USING (
  plan_id IN (SELECT id FROM workout_plans WHERE client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Admins can manage all workout weeks" ON workout_plan_weeks FOR ALL USING (
  public.is_admin()
);

-- WORKOUT PLAN DAYS
CREATE POLICY "Clients can view own workout days" ON workout_plan_days FOR SELECT USING (
  week_id IN (SELECT id FROM workout_plan_weeks WHERE plan_id IN (SELECT id FROM workout_plans WHERE client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
);
CREATE POLICY "Admins can manage all workout days" ON workout_plan_days FOR ALL USING (
  public.is_admin()
);

-- WORKOUT PLAN EXERCISES
CREATE POLICY "Clients can view own workout exercises" ON workout_plan_exercises FOR SELECT USING (
  day_id IN (SELECT id FROM workout_plan_days WHERE week_id IN (SELECT id FROM workout_plan_weeks WHERE plan_id IN (SELECT id FROM workout_plans WHERE client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))))
);
CREATE POLICY "Admins can manage all workout exercises" ON workout_plan_exercises FOR ALL USING (
  public.is_admin()
);

-- NUTRITION PLANS (own data + admin full access)
CREATE POLICY "Clients can view own nutrition plans" ON nutrition_plans FOR SELECT USING (
  client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all nutrition plans" ON nutrition_plans FOR ALL USING (
  public.is_admin()
);

-- NUTRITION PLAN MEALS
CREATE POLICY "Clients can view own nutrition meals" ON nutrition_plan_meals FOR SELECT USING (
  plan_id IN (SELECT id FROM nutrition_plans WHERE client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Admins can manage all nutrition meals" ON nutrition_plan_meals FOR ALL USING (
  public.is_admin()
);

-- BLOG POSTS (public read for published)
CREATE POLICY "Anyone can view published posts" ON blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admins can manage all posts" ON blog_posts FOR ALL USING (
  public.is_admin()
);

-- TRANSFORMATIONS (public read)
CREATE POLICY "Anyone can view transformations" ON transformations FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage transformations" ON transformations FOR ALL USING (
  public.is_admin()
);

-- QUESTIONNAIRES
CREATE POLICY "Users can view own questionnaires" ON questionnaires FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own questionnaires" ON questionnaires FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all questionnaires" ON questionnaires FOR SELECT USING (
  public.is_admin()
);

-- CONTACT MESSAGES (anyone can insert, admin can read)
CREATE POLICY "Anyone can submit contact message" ON contact_messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can view messages" ON contact_messages FOR SELECT USING (
  public.is_admin()
);
CREATE POLICY "Admins can update messages" ON contact_messages FOR UPDATE USING (
  public.is_admin()
);

-- SITE SETTINGS (public read)
CREATE POLICY "Anyone can view settings" ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage settings" ON site_settings FOR ALL USING (
  public.is_admin()
);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- Run these in the Supabase Dashboard > Storage section:
-- 1. Create bucket: exercise-videos (public)
-- 2. Create bucket: exercise-thumbnails (public)
-- 3. Create bucket: blog-images (public)
-- 4. Create bucket: transformation-images (public)
-- 5. Create bucket: avatars (authenticated access)
-- 6. Create bucket: questionnaire-photos (authenticated access)

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_exercises_category ON exercises(category_id);
CREATE INDEX idx_exercises_slug ON exercises(slug);
CREATE INDEX idx_training_plans_client ON training_plans(client_id);
CREATE INDEX idx_training_days_plan ON training_days(plan_id);
CREATE INDEX idx_training_exercises_day ON training_exercises(day_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX idx_transformations_featured ON transformations(is_featured, sort_order);
CREATE INDEX idx_contact_messages_read ON contact_messages(is_read, created_at DESC);
CREATE INDEX idx_plan_templates_type ON plan_templates(type);
CREATE INDEX idx_plan_templates_created_by ON plan_templates(created_by);
CREATE INDEX idx_workout_plans_client ON workout_plans(client_id);
CREATE INDEX idx_workout_plans_status ON workout_plans(client_id, status);
CREATE INDEX idx_workout_plan_weeks_plan ON workout_plan_weeks(plan_id);
CREATE INDEX idx_workout_plan_days_week ON workout_plan_days(week_id);
CREATE INDEX idx_workout_plan_exercises_day ON workout_plan_exercises(day_id);
CREATE INDEX idx_workout_plan_exercises_exercise ON workout_plan_exercises(exercise_id);
CREATE INDEX idx_nutrition_plans_client ON nutrition_plans(client_id);
CREATE INDEX idx_nutrition_plans_status ON nutrition_plans(client_id, status);
CREATE INDEX idx_nutrition_plan_meals_plan ON nutrition_plan_meals(plan_id);
