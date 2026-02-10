# FitWith Round 3 Implementation Status

## ✅ COMPLETED

### R3-1: Weekday-based plans + today's plan display
- ✅ Added `day_of_week` field (1-7) to `training_days` schema
- ✅ Implemented Europe/Belgrade timezone detection (`getCurrentDayOfWeekBelgrade`)
- ✅ Changed day labels to weekday names (Ponedeljak, Utorak, etc.)
- ✅ Created timezone utility with localized weekday names (SR/EN/RU)
- ✅ Portal homepage detects current day and shows matching training plan
- ✅ Migration: `20260210_add_weekday_support.sql`

### R3-2: Training plan card formatting
- ✅ Title format: "Ponedeljak — Donji deo tela" (weekday + muscle group)
- ✅ "X vežbi" label fixed with `whitespace-nowrap` to prevent wrapping
- ✅ Exercise names already clickable links to `/vezbe/[slug]`
- ✅ Card layout preserved from existing design

### R3-4: Portal homepage restructure
- ✅ Layout reordered: Today's Training → Today's Nutrition → Pretplata
- ✅ Removed old 3-card status layout
- ✅ Added empty states for missing plans
- ✅ All sections use Europe/Belgrade timezone for day detection
- ✅ Responsive design maintained

## 🚧 PARTIAL / IN PROGRESS

### R3-3: Nutrition plan templates
**Status:** Foundation laid, full implementation requires additional work

#### ✅ Completed:
- ✅ Database schema: `plan_templates` table created (migration)
- ✅ JSONB structure defined for nutrition days → meals → food items
- ✅ Created `NutritionPlanCard` component with proper layout
- ✅ Designed data structure:
  ```typescript
  {
    days: [
      {
        day_of_week: 1,
        meals: [
          {
            name: "Doručak",
            foods: [
              { name: "Jaja", amount: "100g", calories: 150, protein: 13, carbs: 1, fat: 10 }
            ]
          }
        ]
      }
    ]
  }
  ```

#### ❌ TODO:
1. **Admin UI for template creation**
   - Template list page (`/portal/klijenti/sabloni`)
   - Create/edit template form
   - Meal and food item management UI
   - Template preview

2. **Template import functionality**
   - "Import template" button in client nutrition plan editor
   - Template selection modal
   - Copy template data to client's nutrition plan
   - Preserve ability to edit after import

3. **Client nutrition plan editor**
   - Weekday-based view (like training plans)
   - Add/edit/delete meals per day
   - Add/edit/delete food items per meal
   - Auto-calculate daily macros

4. **Queries & API**
   - `createNutritionTemplate()`
   - `updateNutritionTemplate()`
   - `deleteNutritionTemplate()`
   - `importTemplateToClient()`
   - `getClientNutritionPlan()` with structured data
   - `updateClientNutritionPlan()`

5. **Integration**
   - Update `NutritionContent.tsx` to use new structured format
   - Show weekday tabs like training plan page
   - Display meals in table format (matching training card style)

## Build Status
✅ All code compiles successfully
✅ TypeScript checks pass
✅ No runtime errors in completed features

## Next Steps
To complete R3-3, recommend creating a follow-up ticket/issue with:
- Admin template management UI
- Client nutrition editor
- Import/export functionality
- Full weekday-based nutrition display
