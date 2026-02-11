"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getMyNutritionPlan, getClientNutritionPlans, getMyProfile } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import NutritionPlanEditor from "@/components/portal/NutritionPlanEditor";
import NutritionPlanCard from "@/components/portal/NutritionPlanCard";
import { getCurrentDayOfWeekBelgrade, getWeekdayName } from "@/lib/utils/timezone";
import type { NutritionPlan, NutritionPlanMeal } from "@/lib/supabase/types";

type NutritionPlanWithMeals = NutritionPlan & {
  nutrition_plan_meals: NutritionPlanMeal[];
};

export default function NutritionContent() {
  const t = useTranslations("Portal");
  const locale = useLocale() as "sr" | "en" | "ru";
  const [plan, setPlan] = useState<NutritionPlanWithMeals | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminPlans, setAdminPlans] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDay, setSelectedDay] = useState(getCurrentDayOfWeekBelgrade());

  useEffect(() => {
    getMyProfile().then((p) => {
      if (p) {
        setProfileId(p.id);
        setIsAdmin(p.role === "admin");
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
    loadPlan();
  }

  function loadPlan() {
    getMyNutritionPlan()
      .then((data) => setPlan(data || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Build weekday-based nutrition data from meals
  const buildNutritionDay = () => {
    if (!plan || !plan.nutrition_plan_meals || plan.nutrition_plan_meals.length === 0) return null;
    const meals = plan.nutrition_plan_meals
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((meal) => ({
        name: meal.name || t("mealDefault", {n: meal.meal_number}),
        foods: (meal.foods || []).map((f) => ({
          name: f.name,
          amount: f.unit ? `${f.amount}${f.unit}` : String(f.amount || ""),
          calories: f.calories || 0,
          protein: f.protein || 0,
          carbs: f.carbs || 0,
          fat: f.fats || 0,
        })),
      }));
    // Same meals apply to all days (nutrition doesn't vary by weekday typically)
    return { day_of_week: selectedDay, meals };
  };

  const todayNutrition = buildNutritionDay();
  const weekdays = [1, 2, 3, 4, 5, 6, 7];

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

      {/* Weekday tabs */}
      <div className="flex gap-[4px] mb-[24px] overflow-x-auto pb-[4px]">
        {weekdays.map((dow) => {
          const isToday = dow === getCurrentDayOfWeekBelgrade();
          return (
            <button
              key={dow}
              onClick={() => setSelectedDay(dow)}
              className={`font-[family-name:var(--font-roboto)] text-[13px] px-[14px] py-[8px] transition-all cursor-pointer whitespace-nowrap ${
                selectedDay === dow
                  ? "bg-orange-500 text-white"
                  : isToday
                  ? "bg-white/[0.06] border border-orange-500/30 text-orange-400"
                  : "bg-white/[0.03] border border-white/10 text-white/50 hover:border-white/20"
              }`}
            >
              {getWeekdayName(dow, locale)}
            </button>
          );
        })}
      </div>

      {/* Nutrition plan card for selected day */}
      <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px]">
        {/* Plan name + macros header */}
        <div className="flex items-center justify-between mb-[20px]">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white">
            {plan.name}
          </h2>
          <span className={`inline-block font-[family-name:var(--font-roboto)] text-[11px] px-[8px] py-[2px] ${
            plan.status === "active" ? "text-green-400 bg-green-400/10" : "text-white/40 bg-white/5"
          }`}>
            {plan.status === "active" ? t("active") : plan.status}
          </span>
        </div>

        <NutritionPlanCard
          dayOfWeek={selectedDay}
          day={todayNutrition}
          locale={locale}
        />
      </div>
    </div>
  );
}
