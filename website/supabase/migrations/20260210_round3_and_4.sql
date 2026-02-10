-- Round 3 Migration: Add weekday support to training plans and nutrition templates

-- Add day_of_week column to training_days (1=Monday, 7=Sunday)
ALTER TABLE training_days ADD COLUMN IF NOT EXISTS day_of_week INTEGER CHECK (day_of_week BETWEEN 1 AND 7);

-- Update existing data: if day_number 1-7, copy to day_of_week
UPDATE training_days SET day_of_week = day_number WHERE day_number BETWEEN 1 AND 7 AND day_of_week IS NULL;

-- Create plan_templates table for reusable training/nutrition templates
CREATE TABLE IF NOT EXISTS plan_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('training', 'nutrition')),
  data JSONB NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on plan_templates
ALTER TABLE plan_templates ENABLE ROW LEVEL SECURITY;

-- Admin-only access to plan templates (skip if exists)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage plan templates') THEN
    CREATE POLICY "Admins can manage plan templates" ON plan_templates FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
    );
  END IF;
END $$;

-- Create index for faster template lookups
CREATE INDEX IF NOT EXISTS idx_plan_templates_type ON plan_templates(type);
CREATE INDEX IF NOT EXISTS idx_plan_templates_created_by ON plan_templates(created_by);

-- Create indexes (skip if exists)
CREATE INDEX IF NOT EXISTS idx_plan_templates_type ON plan_templates(type);
CREATE INDEX IF NOT EXISTS idx_plan_templates_created_by ON plan_templates(created_by);

-- Update nutrition_plans to support structured weekday-based data
-- The JSONB data column will store:
-- {
--   "days": [
--     {
--       "day_of_week": 1,  // 1=Monday...7=Sunday
--       "meals": [
--         {
--           "name": "Doručak",
--           "foods": [
--             {"name": "Jaja", "amount": "100g", "calories": 150, "protein": 13, "carbs": 1, "fat": 10}
--           ]
--         }
--       ]
--     }
--   ]
-- }

-- Add updated_at trigger for plan_templates
DROP TRIGGER IF EXISTS update_plan_templates_updated_at ON plan_templates;
CREATE TRIGGER update_plan_templates_updated_at BEFORE UPDATE ON plan_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Round 4 Migration: Add missing columns to plan_templates

-- Add missing columns that the UI expects
ALTER TABLE plan_templates ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE plan_templates ADD COLUMN IF NOT EXISTS duration_weeks INTEGER DEFAULT 4;
ALTER TABLE plan_templates ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'));
ALTER TABLE plan_templates ADD COLUMN IF NOT EXISTS goal TEXT;
ALTER TABLE plan_templates ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
