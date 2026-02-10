# FitWith Bugfixes & Features Round 4

## R4-1: Dashboard page section order
- Reorder portal homepage (Početna) sections:
  1. Today's Training (compact: exercise name + sets x reps, like reference screenshot)
  2. Daily Macros (calories, protein, carbs, fat — as standalone section)
  3. Today's Nutrition (meals with food items)
  4. Subscription (pretplata)
- Macros should be a SEPARATE card between training and nutrition (not embedded in nutrition card)

## R4-2: Training plan day naming — fully replace Dan A/B with weekdays
- On the full training plan page, titles still show "Dan B — Donji deo tela" — must be "Ponedeljak — Donji deo tela"
- Replace ALL instances of "Dan A/B/C/D..." with actual weekday names (Ponedeljak through Nedelja)
- Translate weekday names for all 3 languages (SR/EN/RU)
- This enables correct day matching on dashboard (today = Utorak → show Utorak's plan)
- Update existing mock/seed templates to use weekday-based days instead of "Dan A/B"

## R4-3: Nutrition template preview missing data
- When expanding a nutrition template (e.g. "Balansirana ishrana") in the templates list, full meal details are missing
- The expanded preview must show: all meals → all food items with names and amounts
- Should match what the template editor shows when editing

## R4-4: Templates button styling on Clients page
- "Templates" link should look like a proper button (bordered/filled, not just icon + text)
- Vertically aligned with the "Clients" title heading
- Positioned on the far right of the header row
