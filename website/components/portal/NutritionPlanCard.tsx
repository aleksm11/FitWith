"use client";

import { getWeekdayName } from "@/lib/utils/timezone";

/**
 * R3-3: Structured nutrition plan card component
 * Displays nutrition plan for a specific day with meals → food items
 */

export type NutritionFood = {
  name: string;
  amount: string; // e.g., "100g", "200ml"
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type NutritionMeal = {
  name: string; // e.g., "Doručak", "Ručak", "Večera"
  foods: NutritionFood[];
};

export type NutritionDay = {
  day_of_week: number; // 1=Monday...7=Sunday
  meals: NutritionMeal[];
};

export type NutritionPlanData = {
  days: NutritionDay[];
};

type Props = {
  dayOfWeek: number;
  day: NutritionDay | null;
  locale: "sr" | "en" | "ru";
};

export default function NutritionPlanCard({ dayOfWeek, day, locale }: Props) {
  const weekdayName = getWeekdayName(dayOfWeek, locale);

  if (!day || day.meals.length === 0) {
    return (
      <div className="py-[24px] text-center">
        <svg className="w-10 h-10 text-white/10 mx-auto mb-[12px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-[family-name:var(--font-roboto)] text-[15px] text-white/40">
          Nema plana ishrane za {weekdayName}
        </p>
      </div>
    );
  }

  // Calculate daily totals
  const dailyTotals = day.meals.reduce(
    (acc, meal) => {
      meal.foods.forEach((food) => {
        acc.calories += food.calories;
        acc.protein += food.protein;
        acc.carbs += food.carbs;
        acc.fat += food.fat;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div>
      <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-white mb-[16px]">
        {weekdayName}
      </h3>

      {/* Daily macros summary */}
      <div className="grid grid-cols-4 gap-[8px] mb-[20px]">
        <div className="bg-white/[0.02] p-[10px] border border-white/5">
          <p className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/40 mb-[3px]">
            Kalorije
          </p>
          <p className="font-[family-name:var(--font-sora)] font-semibold text-[15px] text-white">
            {dailyTotals.calories}
          </p>
        </div>
        <div className="bg-white/[0.02] p-[10px] border border-white/5">
          <p className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/40 mb-[3px]">
            Proteini
          </p>
          <p className="font-[family-name:var(--font-sora)] font-semibold text-[15px] text-white">
            {dailyTotals.protein}g
          </p>
        </div>
        <div className="bg-white/[0.02] p-[10px] border border-white/5">
          <p className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/40 mb-[3px]">
            Ugljenih.
          </p>
          <p className="font-[family-name:var(--font-sora)] font-semibold text-[15px] text-white">
            {dailyTotals.carbs}g
          </p>
        </div>
        <div className="bg-white/[0.02] p-[10px] border border-white/5">
          <p className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/40 mb-[3px]">
            Masti
          </p>
          <p className="font-[family-name:var(--font-sora)] font-semibold text-[15px] text-white">
            {dailyTotals.fat}g
          </p>
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-[16px]">
        {day.meals.map((meal, mealIndex) => (
          <div key={mealIndex} className="border-t border-white/5 pt-[16px] first:border-0 first:pt-0">
            <h4 className="font-[family-name:var(--font-sora)] font-semibold text-[15px] text-orange-400 mb-[10px]">
              {meal.name}
            </h4>
            
            {/* Food items table */}
            <div className="space-y-[6px]">
              {/* Header */}
              <div className="grid grid-cols-[2fr_1fr_80px_60px_60px_60px] max-sm:hidden gap-[8px] pb-[8px] border-b border-white/10">
                <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/30">
                  Namirnica
                </span>
                <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/30">
                  Količina
                </span>
                <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/30 text-right">
                  Kalorije
                </span>
                <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/30 text-right">
                  P
                </span>
                <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/30 text-right">
                  C
                </span>
                <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/30 text-right">
                  F
                </span>
              </div>

              {/* Food rows */}
              {meal.foods.map((food, foodIndex) => (
                <div
                  key={foodIndex}
                  className="grid grid-cols-[2fr_1fr_80px_60px_60px_60px] max-sm:grid-cols-1 gap-[8px] py-[8px] border-b border-white/5 last:border-0 items-center max-sm:bg-white/[0.02] max-sm:p-[12px]"
                >
                  <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white">
                    {food.name}
                  </span>
                  <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/60 max-sm:text-[12px]">
                    {food.amount}
                  </span>
                  <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/70 text-right max-sm:hidden">
                    {food.calories}
                  </span>
                  <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50 text-right max-sm:hidden">
                    {food.protein}g
                  </span>
                  <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50 text-right max-sm:hidden">
                    {food.carbs}g
                  </span>
                  <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50 text-right max-sm:hidden">
                    {food.fat}g
                  </span>
                  {/* Mobile view macros */}
                  <div className="sm:hidden flex gap-[12px] mt-[6px] text-[11px] text-white/50">
                    <span>{food.calories} kcal</span>
                    <span>P: {food.protein}g</span>
                    <span>C: {food.carbs}g</span>
                    <span>F: {food.fat}g</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
