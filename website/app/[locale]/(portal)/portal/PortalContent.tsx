"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  getTodayTraining,
  getNextWorkoutDay,
  mockProfile,
  nutritionPlan,
} from "@/lib/portal/mock-data";

export default function PortalContent() {
  const t = useTranslations("Portal");
  const locale = useLocale();

  const today = getTodayTraining();
  const nextWorkout = getNextWorkoutDay();
  const isRestDay = today.exercises.length === 0;

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
            {t(`tier_${mockProfile.subscriptionTier}`)}
          </p>
          <span className={`inline-block mt-[8px] font-[family-name:var(--font-roboto)] text-[12px] px-[10px] py-[3px] ${
            mockProfile.subscriptionActive
              ? "text-green-400 bg-green-400/10"
              : "text-red-400 bg-red-400/10"
          }`}>
            {mockProfile.subscriptionActive ? t("active") : t("inactive")}
          </span>
        </div>

        {/* Today's macros */}
        <div className="bg-white/[0.03] border border-white/10 p-[24px]">
          <p className="font-[family-name:var(--font-roboto)] text-[12px] uppercase tracking-[1.5px] text-white/40 mb-[8px]">
            {t("todaysMacros")}
          </p>
          <p className="font-[family-name:var(--font-sora)] font-semibold text-[20px] text-white">
            {nutritionPlan.totalCalories} kcal
          </p>
          <div className="flex gap-[16px] mt-[8px]">
            <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40">
              P: {nutritionPlan.totalProtein}g
            </span>
            <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40">
              C: {nutritionPlan.totalCarbs}g
            </span>
            <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40">
              F: {nutritionPlan.totalFat}g
            </span>
          </div>
        </div>

        {/* Training status */}
        <div className="bg-white/[0.03] border border-white/10 p-[24px]">
          <p className="font-[family-name:var(--font-roboto)] text-[12px] uppercase tracking-[1.5px] text-white/40 mb-[8px]">
            {t("todaysTraining")}
          </p>
          {isRestDay ? (
            <p className="font-[family-name:var(--font-sora)] font-semibold text-[20px] text-white/60">
              {t("restDay")}
            </p>
          ) : (
            <>
              <p className="font-[family-name:var(--font-sora)] font-semibold text-[20px] text-white">
                {t(`focus_${today.focusKey}`)}
              </p>
              <p className="mt-[8px] font-[family-name:var(--font-roboto)] text-[12px] text-white/40">
                {today.exercises.length} {t("exercisesCount")}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Today's workout detail */}
      <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px] mb-[24px]">
        <div className="flex items-center justify-between mb-[24px]">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white">
            {isRestDay ? t("restDayTitle") : t("todaysWorkout")}
          </h2>
          {!isRestDay && (
            <Link
              href={`/${locale}/portal/trening`}
              className="font-[family-name:var(--font-roboto)] text-[14px] text-orange-500 hover:text-orange-400 transition-colors"
            >
              {t("viewFullPlan")}
            </Link>
          )}
        </div>

        {isRestDay ? (
          <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 leading-[26px]">
            {t("restDayMessage")}
          </p>
        ) : (
          <div className="space-y-[12px]">
            {today.exercises.map((ex, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-[12px] border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-[12px]">
                  <span className="font-[family-name:var(--font-sora)] font-semibold text-[14px] text-orange-500 w-[24px]">
                    {i + 1}
                  </span>
                  {ex.exerciseSlug ? (
                    <Link
                      href={`/${locale}/vezbe/${ex.exerciseSlug}`}
                      className="font-[family-name:var(--font-roboto)] text-[15px] text-white hover:text-orange-400 transition-colors"
                    >
                      {t(`exercise_${ex.nameKey}`)}
                    </Link>
                  ) : (
                    <span className="font-[family-name:var(--font-roboto)] text-[15px] text-white">
                      {t(`exercise_${ex.nameKey}`)}
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
      {nextWorkout && isRestDay && (
        <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px]">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white mb-[12px]">
            {t("nextWorkout")}
          </h2>
          <p className="font-[family-name:var(--font-roboto)] text-[15px] text-white/60">
            {t(`day_${nextWorkout.dayKey}`)} — {t(`focus_${nextWorkout.focusKey}`)}
          </p>
          <p className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40 mt-[4px]">
            {nextWorkout.exercises.length} {t("exercisesCount")}
          </p>
        </div>
      )}
    </div>
  );
}
