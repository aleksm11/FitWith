-- Round 4 Migration: Add missing columns to plan_templates

-- Add missing columns that the UI expects
ALTER TABLE plan_templates ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE plan_templates ADD COLUMN IF NOT EXISTS duration_weeks INTEGER DEFAULT 4;
ALTER TABLE plan_templates ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'));
ALTER TABLE plan_templates ADD COLUMN IF NOT EXISTS goal TEXT;
ALTER TABLE plan_templates ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
