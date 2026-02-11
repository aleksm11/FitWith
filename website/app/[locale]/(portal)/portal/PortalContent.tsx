"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getMyProfile, getMyTrainingPlan, getMyNutritionPlan } from "@/lib/supabase/queries";
import NutritionPlanCard from "@/components/portal/NutritionPlanCard";
import type { NutritionPlanMeal } from "@/lib/supabase/types";
import { localizedField } from "@/lib/supabase/types";
import type { Locale } from "@/lib/supabase/types";
import { getCurrentDayOfWeekBelgrade, getWeekdayName } from "@/lib/utils/timezone";

type DashboardData = {
  profileName: string;
  tier: string;
  subscriptionEndDate: string | null;
  hasTrainingPlan: boolean;
  hasNutritionPlan: boolean;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  todayFocus: string;
  todayExercises: { name: string; slug: string; sets: number; reps: string }[];
  isRestDay: boolean;
  nextWorkout: { label: string; focus: string; count: number } | null;
  nutritionMeals: NutritionPlanMeal[];
};

export default function PortalContent() {
  const t = useTranslations("Portal");
  const locale = useLocale() as Locale;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyProfile(), getMyTrainingPlan(), getMyNutritionPlan()])
      .then(([profile, trainingPlan, nutritionPlan]) => {
        // Profile
        const profileName = profile?.full_name || "";
        const tier = profile?.subscription_tier || "none";
        const subscriptionEndDate = profile?.subscription_end_date ?? null;

        // Nutrition
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        const hasNutritionPlan = !!nutritionPlan?.daily_calories;
        let nutritionMeals: NutritionPlanMeal[] = [];
        if (nutritionPlan) {
          totalCalories = nutritionPlan.daily_calories || 0;
          totalProtein = nutritionPlan.protein_g || 0;
          totalCarbs = nutritionPlan.carbs_g || 0;
          totalFat = nutritionPlan.fats_g || 0;
          nutritionMeals = (nutritionPlan as unknown as { nutrition_plan_meals?: NutritionPlanMeal[] }).nutrition_plan_meals || [];
        }

        // Training - use Belgrade timezone to detect today
        let todayFocus = "";
        let todayExercises: { name: string; slug: string; sets: number; reps: string }[] = [];
        let isRestDay = true;
        let nextWorkout: { label: string; focus: string; count: number } | null = null;
        const hasTrainingPlan = !!(trainingPlan && trainingPlan.training_days.length > 0);

        if (hasTrainingPlan) {
          const todayDayOfWeek = getCurrentDayOfWeekBelgrade(); // 1=Monday...7=Sunday
          const today = trainingPlan.training_days.find((d) => d.day_of_week === todayDayOfWeek);

          if (today) {
            const exs = today.training_exercises?.sort((a, b) => a.sort_order - b.sort_order) || [];
            isRestDay = exs.length === 0;
            const weekdayName = getWeekdayName(todayDayOfWeek, locale as "sr" | "en" | "ru");
            todayFocus = today.notes ? `${weekdayName} — ${today.notes}` : weekdayName;
            todayExercises = exs.map((ex) => ({
              name: ex.exercises
                ? localizedField(ex.exercises as unknown as Record<string, unknown>, "name", locale)
                : ex.exercise_name || "",
              slug: ex.exercises?.slug || "",
              sets: ex.sets || 0,
              reps: ex.reps || "",
            }));
          } else {
            // No plan for today
            isRestDay = true;
          }

          // Find next workout day
          if (isRestDay) {
            for (let offset = 1; offset <= 7; offset++) {
              const nextDayOfWeek = ((todayDayOfWeek - 1 + offset) % 7) + 1;
              const nextDay = trainingPlan.training_days.find((d) => d.day_of_week === nextDayOfWeek);
              if (nextDay && (nextDay.training_exercises?.length || 0) > 0) {
                const nextWeekdayName = getWeekdayName(nextDayOfWeek, locale as "sr" | "en" | "ru");
                nextWorkout = {
                  label: nextDay.notes ? `${nextWeekdayName} — ${nextDay.notes}` : nextWeekdayName,
                  focus: nextDay.notes || "",
                  count: nextDay.training_exercises.length,
                };
                break;
              }
            }
          }
        }

        setData({
          profileName,
          tier,
          subscriptionEndDate,
          hasTrainingPlan,
          hasNutritionPlan,
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat,
          todayFocus,
          todayExercises,
          isRestDay,
          nextWorkout,
          nutritionMeals,
        });
      })
      .catch(() => {
        setData({
          profileName: "",
          tier: "none",
          subscriptionEndDate: null,
          hasTrainingPlan: false,
          hasNutritionPlan: false,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          todayFocus: "",
          todayExercises: [],
          isRestDay: true,
          nextWorkout: null,
          nutritionMeals: [],
        });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Compute subscription status dynamically from end date
  const isActive = data.subscriptionEndDate
    ? new Date(data.subscriptionEndDate) >= new Date(new Date().toISOString().split("T")[0])
    : false;

  return (
    <div>
      {/* Welcome */}
      <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[8px]">
        {t("welcomeBack")}
      </h1>
      <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[32px]">
        {t("dashboardSubtitle")}
      </p>

      {/* R4-1: New layout - Training → Daily Macros → Nutrition → Subscription */}
      
      {/* 1. TODAY'S TRAINING */}
      <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px] mb-[24px]">
        <div className="flex items-center justify-between mb-[20px]">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white">
            {t("todaysTraining")}
          </h2>
          {data.hasTrainingPlan && !data.isRestDay && (
            <Link
              href={`/${locale}/portal/trening`}
              className="font-[family-name:var(--font-roboto)] text-[14px] text-orange-500 hover:text-orange-400 transition-colors whitespace-nowrap"
            >
              {t("viewFullPlan")}
            </Link>
          )}
        </div>

        {!data.hasTrainingPlan ? (
          <div className="py-[24px] text-center">
            <svg className="w-10 h-10 text-white/10 mx-auto mb-[12px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <p className="font-[family-name:var(--font-roboto)] text-[15px] text-white/40">
              {t("noTrainingPlanToday")}
            </p>
          </div>
        ) : data.isRestDay ? (
          <div className="py-[12px]">
            <p className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-white/60 mb-[8px]">
              {t("restDay")}
            </p>
            <p className="font-[family-name:var(--font-roboto)] text-[14px] text-white/40">
              {t("restDayMessage")}
            </p>
            {data.nextWorkout && (
              <div className="mt-[16px] pt-[16px] border-t border-white/5">
                <p className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40 mb-[6px]">
                  {t("nextWorkout")}:
                </p>
                <p className="font-[family-name:var(--font-roboto)] text-[15px] text-white">
                  {data.nextWorkout.label}
                </p>
                <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mt-[4px]">
                  {data.nextWorkout.count} {t("exercisesCount")}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-white mb-[16px]">
              {data.todayFocus}
            </h3>
            <p className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40 mb-[16px]">
              {data.todayExercises.length} {t("exercisesCount")}
            </p>
            <div>
              {/* Table header */}
              <div className="grid grid-cols-[1fr_60px_70px] gap-[6px] pb-[6px] mb-[4px] border-b border-white/5">
                <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500">{t("exerciseLabel")}</span>
                <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 text-center">{t("setsLabel")}</span>
                <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 text-center">{t("repsLabel")}</span>
              </div>
              {/* Exercise rows */}
              {data.todayExercises.map((ex, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_60px_70px] gap-[6px] py-[8px] border-b border-white/5 last:border-0 items-center"
                >
                  {ex.slug ? (
                    <Link
                      href={`/${locale}/vezbe/${ex.slug}`}
                      className="font-[family-name:var(--font-roboto)] text-[13px] text-white hover:text-orange-400 transition-colors underline decoration-white/20 underline-offset-2"
                    >
                      {ex.name}
                    </Link>
                  ) : (
                    <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/70">
                      {ex.name}
                    </span>
                  )}
                  <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/60 text-center">{ex.sets}</span>
                  <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/60 text-center">{ex.reps}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. DAILY MACROS */}
      <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px] mb-[24px]">
        <h2 className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white mb-[20px]">
          {t("dailyMacros")}
        </h2>
        {data.hasNutritionPlan ? (
          <div className="grid grid-cols-4 gap-[12px]">
            <div className="bg-white/[0.02] p-[12px] border border-white/5">
              <p className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1px] text-white/40 mb-[4px]">
                {t("calories")}
              </p>
              <p className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-orange-500">
                {data.totalCalories}
              </p>
            </div>
            <div className="bg-white/[0.02] p-[12px] border border-white/5">
              <p className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1px] text-white/40 mb-[4px]">
                {t("protein")}
              </p>
              <p className="font-[family-name:var(--font-sora)] font-semibold text-[16px] text-white">
                {data.totalProtein}g
              </p>
            </div>
            <div className="bg-white/[0.02] p-[12px] border border-white/5">
              <p className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1px] text-white/40 mb-[4px]">
                {t("carbs")}
              </p>
              <p className="font-[family-name:var(--font-sora)] font-semibold text-[16px] text-white">
                {data.totalCarbs}g
              </p>
            </div>
            <div className="bg-white/[0.02] p-[12px] border border-white/5">
              <p className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1px] text-white/40 mb-[4px]">
                {t("fat")}
              </p>
              <p className="font-[family-name:var(--font-sora)] font-semibold text-[16px] text-white">
                {data.totalFat}g
              </p>
            </div>
          </div>
        ) : (
          <div className="py-[12px] text-center">
            <p className="font-[family-name:var(--font-roboto)] text-[15px] text-white/40">
              {t("noNutritionPlanToday")}
            </p>
          </div>
        )}
      </div>

      {/* 3. TODAY'S NUTRITION */}
      <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px] mb-[24px]">
        <div className="flex items-center justify-between mb-[20px]">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white">
            {t("todaysNutrition")}
          </h2>
          {data.hasNutritionPlan && (
            <Link
              href={`/${locale}/portal/ishrana`}
              className="font-[family-name:var(--font-roboto)] text-[14px] text-orange-500 hover:text-orange-400 transition-colors whitespace-nowrap"
            >
              {t("viewFullPlan")}
            </Link>
          )}
        </div>

        {!data.hasNutritionPlan ? (
          <div className="py-[24px] text-center">
            <svg className="w-10 h-10 text-white/10 mx-auto mb-[12px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-[family-name:var(--font-roboto)] text-[15px] text-white/40">
              {t("noNutritionPlanToday")}
            </p>
          </div>
        ) : (
          <NutritionPlanCard
            dayOfWeek={getCurrentDayOfWeekBelgrade()}
            day={data.nutritionMeals.length > 0 ? {
              day_of_week: getCurrentDayOfWeekBelgrade(),
              meals: data.nutritionMeals
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((meal) => ({
                  name: meal.name || `${t("mealDefault")} ${meal.meal_number}`,
                  foods: (meal.foods || []).map((f) => ({
                    name: f.name,
                    amount: f.unit ? `${f.amount}${f.unit}` : String(f.amount || ""),
                    calories: f.calories || 0,
                    protein: f.protein || 0,
                    carbs: f.carbs || 0,
                    fat: f.fats || 0,
                  })),
                })),
            } : {
              day_of_week: getCurrentDayOfWeekBelgrade(),
              meals: [{
                name: t("dailyOverview"),
                foods: [{
                  name: `${data.totalCalories} kcal | P: ${data.totalProtein}g | C: ${data.totalCarbs}g | F: ${data.totalFat}g`,
                  amount: "",
                  calories: data.totalCalories,
                  protein: data.totalProtein,
                  carbs: data.totalCarbs,
                  fat: data.totalFat,
                }],
              }],
            }}
            locale={locale as "sr" | "en" | "ru"}
          />
        )}
      </div>

      {/* 4. PRETPLATA (SUBSCRIPTION) */}
      <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px]">
        <h2 className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white mb-[20px]">
          {t("subscriptionLabel")}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-[family-name:var(--font-sora)] font-semibold text-[20px] text-white mb-[8px]">
              {t(`tier_${data.tier}`)}
            </p>
            {data.subscriptionEndDate && (
              <p className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">
                {isActive ? t("activeUntil") : t("expiredOn")} {new Date(data.subscriptionEndDate).toLocaleDateString(locale)}
              </p>
            )}
          </div>
          <div>
            {data.subscriptionEndDate ? (
              <span className={`inline-block font-[family-name:var(--font-roboto)] text-[12px] px-[12px] py-[6px] ${
                isActive
                  ? "text-green-400 bg-green-400/10"
                  : "text-red-400 bg-red-400/10"
              }`}>
                {isActive ? t("active") : t("inactive")}
              </span>
            ) : (
              <span className="inline-block font-[family-name:var(--font-roboto)] text-[12px] px-[12px] py-[6px] text-white/40 bg-white/5">
                {t("noSubscription")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
