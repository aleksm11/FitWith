"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getMyProfile, getMyTrainingPlan, getMyNutritionPlan } from "@/lib/supabase/queries";
import { localizedField } from "@/lib/supabase/types";
import type { Locale } from "@/lib/supabase/types";
import {
  getTodayTraining,
  getNextWorkoutDay,
  mockProfile,
  nutritionPlan as mockNutritionPlan,
} from "@/lib/portal/mock-data";

type DashboardData = {
  profileName: string;
  tier: string;
  active: boolean;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  todayFocus: string;
  todayExercises: { name: string; slug: string; sets: number; reps: string }[];
  isRestDay: boolean;
  nextWorkout: { label: string; focus: string; count: number } | null;
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
        const profileName = profile?.full_name || mockProfile.fullName;
        const tier = profile?.subscription_tier || mockProfile.subscriptionTier;
        const active = profile?.subscription_active ?? mockProfile.subscriptionActive;

        // Nutrition
        let totalCalories = mockNutritionPlan.totalCalories;
        let totalProtein = mockNutritionPlan.totalProtein;
        let totalCarbs = mockNutritionPlan.totalCarbs;
        let totalFat = mockNutritionPlan.totalFat;
        if (nutritionPlan?.data) {
          const np = nutritionPlan.data as { totalCalories?: number; totalProtein?: number; totalCarbs?: number; totalFat?: number };
          if (np.totalCalories) {
            totalCalories = np.totalCalories;
            totalProtein = np.totalProtein || 0;
            totalCarbs = np.totalCarbs || 0;
            totalFat = np.totalFat || 0;
          }
        }

        // Training
        let todayFocus = "";
        let todayExercises: { name: string; slug: string; sets: number; reps: string }[] = [];
        let isRestDay = true;
        let nextWorkout: { label: string; focus: string; count: number } | null = null;

        if (trainingPlan && trainingPlan.training_days.length > 0) {
          const dayIndex = new Date().getDay();
          const mapped = dayIndex === 0 ? 6 : dayIndex - 1;
          const sorted = [...trainingPlan.training_days].sort((a, b) => a.sort_order - b.sort_order);
          const today = sorted[mapped] || sorted[0];

          if (today) {
            const exs = today.training_exercises?.sort((a, b) => a.sort_order - b.sort_order) || [];
            isRestDay = exs.length === 0;
            todayFocus = today.notes || localizedField(today as unknown as Record<string, unknown>, "day_name", locale);
            todayExercises = exs.map((ex) => ({
              name: ex.exercises
                ? localizedField(ex.exercises as unknown as Record<string, unknown>, "name", locale)
                : ex.exercise_name || "",
              slug: ex.exercises?.slug || "",
              sets: ex.sets || 0,
              reps: ex.reps || "",
            }));
          }

          // Find next workout day
          if (isRestDay) {
            for (let i = 1; i <= sorted.length; i++) {
              const nextDay = sorted[(mapped + i) % sorted.length];
              if (nextDay && (nextDay.training_exercises?.length || 0) > 0) {
                nextWorkout = {
                  label: localizedField(nextDay as unknown as Record<string, unknown>, "day_name", locale),
                  focus: nextDay.notes || "",
                  count: nextDay.training_exercises.length,
                };
                break;
              }
            }
          }
        } else {
          // Mock data fallback
          const today = getTodayTraining();
          const next = getNextWorkoutDay();
          isRestDay = today.exercises.length === 0;
          todayFocus = isRestDay ? "" : t(`focus_${today.focusKey}`);
          todayExercises = today.exercises.map((ex) => ({
            name: t(`exercise_${ex.nameKey}`),
            slug: ex.exerciseSlug,
            sets: ex.sets,
            reps: ex.reps,
          }));
          if (next && isRestDay) {
            nextWorkout = {
              label: t(`day_${next.dayKey}`),
              focus: t(`focus_${next.focusKey}`),
              count: next.exercises.length,
            };
          }
        }

        setData({
          profileName,
          tier,
          active,
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat,
          todayFocus,
          todayExercises,
          isRestDay,
          nextWorkout,
        });
      })
      .catch(() => {
        // Full mock fallback
        const today = getTodayTraining();
        const next = getNextWorkoutDay();
        const isRestDay = today.exercises.length === 0;
        setData({
          profileName: mockProfile.fullName,
          tier: mockProfile.subscriptionTier,
          active: mockProfile.subscriptionActive,
          totalCalories: mockNutritionPlan.totalCalories,
          totalProtein: mockNutritionPlan.totalProtein,
          totalCarbs: mockNutritionPlan.totalCarbs,
          totalFat: mockNutritionPlan.totalFat,
          todayFocus: isRestDay ? "" : t(`focus_${today.focusKey}`),
          todayExercises: today.exercises.map((ex) => ({
            name: t(`exercise_${ex.nameKey}`),
            slug: ex.exerciseSlug,
            sets: ex.sets,
            reps: ex.reps,
          })),
          isRestDay,
          nextWorkout: next && isRestDay
            ? { label: t(`day_${next.dayKey}`), focus: t(`focus_${next.focusKey}`), count: next.exercises.length }
            : null,
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

  return (
    <div>
      {/* Welcome */}
      <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[8px]">
        {t("welcomeBack")}
      </h1>
      <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[32px]">
        {t("dashboardSubtitle")}
      </p>

      {/* Status cards */}
      <div className="grid grid-cols-3 gap-[16px] max-lg:grid-cols-1 mb-[32px]">
        {/* Subscription */}
        <div className="bg-white/[0.03] border border-white/10 p-[24px]">
          <p className="font-[family-name:var(--font-roboto)] text-[12px] uppercase tracking-[1.5px] text-white/40 mb-[8px]">
            {t("subscriptionLabel")}
          </p>
          <p className="font-[family-name:var(--font-sora)] font-semibold text-[20px] text-white">
            {t(`tier_${data.tier}`)}
          </p>
          <span className={`inline-block mt-[8px] font-[family-name:var(--font-roboto)] text-[12px] px-[10px] py-[3px] ${
            data.active
              ? "text-green-400 bg-green-400/10"
              : "text-red-400 bg-red-400/10"
          }`}>
            {data.active ? t("active") : t("inactive")}
          </span>
        </div>

        {/* Today's macros */}
        <div className="bg-white/[0.03] border border-white/10 p-[24px]">
          <p className="font-[family-name:var(--font-roboto)] text-[12px] uppercase tracking-[1.5px] text-white/40 mb-[8px]">
            {t("todaysMacros")}
          </p>
          <p className="font-[family-name:var(--font-sora)] font-semibold text-[20px] text-white">
            {data.totalCalories} kcal
          </p>
          <div className="flex gap-[16px] mt-[8px]">
            <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40">
              P: {data.totalProtein}g
            </span>
            <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40">
              C: {data.totalCarbs}g
            </span>
            <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40">
              F: {data.totalFat}g
            </span>
          </div>
        </div>

        {/* Training status */}
        <div className="bg-white/[0.03] border border-white/10 p-[24px]">
          <p className="font-[family-name:var(--font-roboto)] text-[12px] uppercase tracking-[1.5px] text-white/40 mb-[8px]">
            {t("todaysTraining")}
          </p>
          {data.isRestDay ? (
            <p className="font-[family-name:var(--font-sora)] font-semibold text-[20px] text-white/60">
              {t("restDay")}
            </p>
          ) : (
            <>
              <p className="font-[family-name:var(--font-sora)] font-semibold text-[20px] text-white">
                {data.todayFocus}
              </p>
              <p className="mt-[8px] font-[family-name:var(--font-roboto)] text-[12px] text-white/40">
                {data.todayExercises.length} {t("exercisesCount")}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Today's workout detail */}
      <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px] mb-[24px]">
        <div className="flex items-center justify-between mb-[24px]">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white">
            {data.isRestDay ? t("restDayTitle") : t("todaysWorkout")}
          </h2>
          {!data.isRestDay && (
            <Link
              href={`/${locale}/portal/trening`}
              className="font-[family-name:var(--font-roboto)] text-[14px] text-orange-500 hover:text-orange-400 transition-colors"
            >
              {t("viewFullPlan")}
            </Link>
          )}
        </div>

        {data.isRestDay ? (
          <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 leading-[26px]">
            {t("restDayMessage")}
          </p>
        ) : (
          <div className="space-y-[12px]">
            {data.todayExercises.map((ex, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-[12px] border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-[12px]">
                  <span className="font-[family-name:var(--font-sora)] font-semibold text-[14px] text-orange-500 w-[24px]">
                    {i + 1}
                  </span>
                  {ex.slug ? (
                    <Link
                      href={`/${locale}/vezbe/${ex.slug}`}
                      className="font-[family-name:var(--font-roboto)] text-[15px] text-white hover:text-orange-400 transition-colors"
                    >
                      {ex.name}
                    </Link>
                  ) : (
                    <span className="font-[family-name:var(--font-roboto)] text-[15px] text-white">
                      {ex.name}
                    </span>
                  )}
                </div>
                <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40">
                  {ex.sets} x {ex.reps}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next workout */}
      {data.nextWorkout && data.isRestDay && (
        <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px]">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white mb-[12px]">
            {t("nextWorkout")}
          </h2>
          <p className="font-[family-name:var(--font-roboto)] text-[15px] text-white/60">
            {data.nextWorkout.label} — {data.nextWorkout.focus}
          </p>
          <p className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40 mt-[4px]">
            {data.nextWorkout.count} {t("exercisesCount")}
          </p>
        </div>
      )}
    </div>
  );
}
