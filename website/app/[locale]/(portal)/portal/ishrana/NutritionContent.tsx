"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getMyNutritionPlan, getClientNutritionPlans } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import NutritionPlanEditor from "@/components/portal/NutritionPlanEditor";

type Meal = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: { name: string; amount: string }[];
};

type NutritionData = {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: Meal[];
};

export default function NutritionContent() {
  const t = useTranslations("Portal");
  const locale = useLocale();
  const [plan, setPlan] = useState<NutritionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminPlans, setAdminPlans] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("profiles")
          .select("id, role")
          .eq("user_id", user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setProfileId(data.id);
              setIsAdmin(data.role === "admin");
            }
          });
      }
    });
  }, []);

  useEffect(() => {
    if (isAdmin && profileId) {
      getClientNutritionPlans(profileId).then(setAdminPlans).catch(() => {});
    }
  }, [isAdmin, profileId, refreshKey]);

  function handleRefresh() {
    setRefreshKey((k) => k + 1);
    getMyNutritionPlan()
      .then((data) => {
        if (data?.daily_calories) {
          setPlan({
            totalCalories: data.daily_calories || 0,
            totalProtein: data.protein_g || 0,
            totalCarbs: data.carbs_g || 0,
            totalFat: data.fats_g || 0,
            meals: [],
          });
        }
      })
      .catch(() => {});
  }

  useEffect(() => {
    getMyNutritionPlan()
      .then((data) => {
        if (data?.daily_calories) {
          setPlan({
            totalCalories: data.daily_calories || 0,
            totalProtein: data.protein_g || 0,
            totalCarbs: data.carbs_g || 0,
            totalFat: data.fats_g || 0,
            meals: [],
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div>
        <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[8px]">
          {t("nutrition")}
        </h1>
        <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[32px]">
          {t("nutritionSubtitle")}
        </p>
        {isAdmin && profileId ? (
          <div className="mb-[32px]">
            <NutritionPlanEditor clientId={profileId} plans={adminPlans} onRefresh={handleRefresh} />
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px]">
            <div className="py-[48px] text-center">
              <svg className="w-16 h-16 text-white/10 mx-auto mb-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
              </svg>
              <p className="font-[family-name:var(--font-sora)] font-semibold text-[20px] text-white/50 mb-[8px]">
                {t("noNutritionPlanAssigned")}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  const macroBar = (value: number, color: string) => {
    const multiplier = color === "bg-green-500" ? 9 : 4;
    const pct = plan.totalCalories > 0 ? Math.round((value * multiplier) / plan.totalCalories * 100) : 0;
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

  return (
    <div>
      <div className="flex items-center justify-between mb-[8px]">
        <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white">
          {t("nutrition")}
        </h1>
        {isAdmin && profileId && (
          <button
            onClick={() => setShowEditor(!showEditor)}
            className="flex items-center gap-[6px] font-[family-name:var(--font-roboto)] text-[13px] text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            {t("editPlan")}
          </button>
        )}
      </div>
      <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[32px]">
        {t("nutritionSubtitle")}
      </p>

      {/* Admin editor */}
      {isAdmin && profileId && showEditor && (
        <div className="mb-[24px] border border-orange-500/20 p-[24px] max-sm:p-[16px] bg-white/[0.02]">
          <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[16px] text-orange-400 mb-[16px]">{t("editPlan")}</h3>
          <NutritionPlanEditor clientId={profileId} plans={adminPlans} onRefresh={handleRefresh} />
        </div>
      )}

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
                {meal.name}
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
                    {food.name}
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
