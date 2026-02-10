# FitWith Bugfixes & Features Round 3

## R3-1: Weekday-based plans + today's plan on Početna
- Training & nutrition plans: change day labels from "Dan A/B/C" → actual weekday names (Ponedeljak, Utorak, Sreda, Četvrtak, Petak, Subota, Nedelja)
- Update `training_days` schema: `day_number` → `day_of_week` (1=Monday...7=Sunday) or similar
- Nutrition plans need same weekday structure
- Portal homepage (Početna) detects current day in `Europe/Belgrade` timezone and shows the matching training + nutrition plan for that day

## R3-2: Training plan card formatting fixes
- Title format: `Ponedeljak — Donji deo tela` (weekday + muscle group, ties into R3-1)
- "X vežbi" count label on far right — must stay on ONE line (currently wrapping on mobile)
- Exercise names become tappable links → navigate to that exercise's page in the exercise library (where the video lives)
- Match exercise by name to exercise in the `exercises` table, link to `/vezbe/[slug]` or equivalent

## R3-3: Nutrition plan templates — structured like training plans
- Same card/table visual format as training plan cards
- Structure: days → meals per day → food items
- Columns per food item: food name, amount/grams, calories, protein, carbs, fat
- No linking on food names (unlike exercises)
- Admin can create nutrition templates (same flow as training templates)
- Templates are importable to a client and fully editable after import
- Supabase: ensure `plan_templates` table supports type='nutrition' with structured JSONB data

## R3-4: Portal homepage (Početna) layout restructure
- Remove current layout
- New layout (top to bottom):
  1. **Today's Training** — full training plan card for current weekday (from R3-1)
  2. **Today's Nutrition** — full nutrition plan card for current weekday
  3. **Pretplata (Subscription)** — subscription status/info section
- If no plan assigned for today, show a friendly empty state
- Day detection uses `Europe/Belgrade` timezone
