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
  role TEXT NOT NULL DEFAULT 'pending' CHECK (role IN ('pending', 'client', 'admin')),
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'none' CHECK (subscription_tier IN ('mentoring', 'training', 'nutrition', 'none')),
  subscription_active BOOLEAN DEFAULT FALSE,
  preferred_locale TEXT DEFAULT 'sr' CHECK (preferred_locale IN ('sr', 'en', 'ru')),
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

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

CREATE TRIGGER exercises_updated_at BEFORE UPDATE ON exercises
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

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

CREATE TRIGGER training_plans_updated_at BEFORE UPDATE ON training_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

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
  exercise_name TEXT,
  sets INTEGER,
  reps TEXT,
  rest_seconds INTEGER,
  notes TEXT,
  sort_order INTEGER DEFAULT 0
);

-- ============================================================
-- NUTRITION PLANS
-- ============================================================
CREATE TABLE nutrition_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER nutrition_plans_updated_at BEFORE UPDATE ON nutrition_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

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

CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

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
  duration TEXT,
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
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- EXERCISES (public read)
CREATE POLICY "Anyone can view exercises" ON exercises FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage exercises" ON exercises FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- EXERCISE CATEGORIES (public read)
CREATE POLICY "Anyone can view categories" ON exercise_categories FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage categories" ON exercise_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- TRAINING PLANS (own data)
CREATE POLICY "Clients can view own plans" ON training_plans FOR SELECT USING (
  client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all plans" ON training_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- TRAINING DAYS
CREATE POLICY "Clients can view own training days" ON training_days FOR SELECT USING (
  plan_id IN (SELECT id FROM training_plans WHERE client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Admins can manage all training days" ON training_days FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- TRAINING EXERCISES
CREATE POLICY "Clients can view own training exercises" ON training_exercises FOR SELECT USING (
  day_id IN (SELECT id FROM training_days WHERE plan_id IN (SELECT id FROM training_plans WHERE client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
);
CREATE POLICY "Admins can manage all training exercises" ON training_exercises FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- NUTRITION PLANS
CREATE POLICY "Clients can view own nutrition plans" ON nutrition_plans FOR SELECT USING (
  client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all nutrition plans" ON nutrition_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- BLOG POSTS (public read for published)
CREATE POLICY "Anyone can view published posts" ON blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admins can manage all posts" ON blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- TRANSFORMATIONS (public read)
CREATE POLICY "Anyone can view transformations" ON transformations FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage transformations" ON transformations FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- QUESTIONNAIRES
CREATE POLICY "Users can view own questionnaires" ON questionnaires FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own questionnaires" ON questionnaires FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all questionnaires" ON questionnaires FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- CONTACT MESSAGES (anyone can insert, admin can read)
CREATE POLICY "Anyone can submit contact message" ON contact_messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can view messages" ON contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update messages" ON contact_messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- SITE SETTINGS (public read)
CREATE POLICY "Anyone can view settings" ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage settings" ON site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_exercises_category ON exercises(category_id);
CREATE INDEX idx_exercises_slug ON exercises(slug);
CREATE INDEX idx_training_plans_client ON training_plans(client_id);
CREATE INDEX idx_training_days_plan ON training_days(plan_id);
CREATE INDEX idx_training_exercises_day ON training_exercises(day_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX idx_transformations_featured ON transformations(is_featured, sort_order);
CREATE INDEX idx_contact_messages_read ON contact_messages(is_read, created_at DESC);

-- ============================================================
-- STORAGE BUCKETS (create via Supabase Dashboard > Storage)
-- ============================================================
-- 1. exercise-videos (public)
-- 2. exercise-thumbnails (public)
-- 3. blog-images (public)
-- 4. transformation-images (public)
-- 5. avatars (authenticated access)
-- 6. questionnaire-photos (authenticated access)
