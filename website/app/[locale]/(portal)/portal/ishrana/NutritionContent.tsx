"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getMyNutritionPlan } from "@/lib/supabase/queries";
import { nutritionPlan as mockNutritionPlan } from "@/lib/portal/mock-data";
import type { NutritionDay } from "@/lib/portal/mock-data";

export default function NutritionContent() {
  const t = useTranslations("Portal");
  const [plan, setPlan] = useState<NutritionDay>(mockNutritionPlan);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyNutritionPlan()
      .then((data) => {
        if (data?.data) {
          const parsed = data.data as unknown as NutritionDay;
          if (parsed.meals && parsed.totalCalories) {
            setPlan(parsed);
          }
        }
      })
      .catch(() => {
        // Use mock data
      })
      .finally(() => setLoading(false));
  }, []);

  const macroBar = (value: number, color: string) => {
    const multiplier = color === "bg-green-500" ? 9 : 4;
    const pct = Math.round((value * multiplier) / plan.totalCalories * 100);
    return (
      <div className="flex items-center gap-[12px]">
        <div className="flex-1 h-[6px] bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
        </div>
        <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40 w-[40px] text-right">
          {pct}%
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[8px]">
        {t("nutrition")}
      </h1>
      <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[32px]">
        {t("nutritionSubtitle")}
      </p>

      {/* Macros overview */}
      <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px] mb-[24px]">
        <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white mb-[24px]">
          {t("dailyOverview")}
        </h2>

        <div className="text-center mb-[32px]">
          <span className="font-[family-name:var(--font-sora)] font-bold text-[48px] max-sm:text-[36px] text-orange-500">
            {plan.totalCalories}
          </span>
          <span className="font-[family-name:var(--font-roboto)] text-[18px] text-white/40 ml-[8px]">
            kcal
          </span>
        </div>

        <div className="grid grid-cols-3 gap-[24px] max-sm:grid-cols-1">
          <div>
            <div className="flex items-center justify-between mb-[8px]">
              <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70">
                {t("protein")}
              </span>
              <span className="font-[family-name:var(--font-sora)] font-semibold text-[16px] text-white">
                {plan.totalProtein}g
              </span>
            </div>
            {macroBar(plan.totalProtein, "bg-orange-500")}
          </div>
          <div>
            <div className="flex items-center justify-between mb-[8px]">
              <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70">
                {t("carbs")}
              </span>
              <span className="font-[family-name:var(--font-sora)] font-semibold text-[16px] text-white">
                {plan.totalCarbs}g
              </span>
            </div>
            {macroBar(plan.totalCarbs, "bg-blue-500")}
          </div>
          <div>
            <div className="flex items-center justify-between mb-[8px]">
              <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70">
                {t("fat")}
              </span>
              <span className="font-[family-name:var(--font-sora)] font-semibold text-[16px] text-white">
                {plan.totalFat}g
              </span>
            </div>
            {macroBar(plan.totalFat, "bg-green-500")}
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-[16px]">
        {plan.meals.map((meal, i) => (
          <div
            key={i}
            className="bg-white/[0.03] border border-white/10 p-[24px] max-sm:p-[16px]"
          >
            <div className="flex items-center justify-between mb-[16px]">
              <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-white">
                {t(`meal_${meal.nameKey}`)}
              </h3>
              <span className="font-[family-name:var(--font-sora)] font-semibold text-[16px] text-orange-500">
                {meal.calories} kcal
              </span>
            </div>

            <div className="space-y-[8px] mb-[16px]">
              {meal.foods.map((food, j) => (
                <div
                  key={j}
                  className="flex items-center justify-between py-[6px] border-b border-white/5 last:border-0"
                >
                  <span className="font-[family-name:var(--font-roboto)] text-[15px] text-white/70">
                    {t(`food_${food.nameKey}`)}
                  </span>
                  <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40">
                    {food.amount}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-[20px] pt-[12px] border-t border-white/10">
              <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40">
                P: {meal.protein}g
              </span>
              <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40">
                C: {meal.carbs}g
              </span>
              <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40">
                F: {meal.fat}g
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
