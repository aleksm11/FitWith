"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { trainingPlan } from "@/lib/portal/mock-data";

const dayKeys = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export default function TrainingContent() {
  const t = useTranslations("Portal");
  const locale = useLocale();

  // Default to current day
  const todayIndex = (() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  })();
  const [activeDay, setActiveDay] = useState(todayIndex);

  const day = trainingPlan[activeDay];
  const isRestDay = day.exercises.length === 0;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[8px]">
        {t("training")}
      </h1>
      <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[32px]">
        {t("trainingSubtitle")}
      </p>

      {/* Day tabs */}
      <div className="flex flex-wrap gap-[6px] mb-[32px]">
        {dayKeys.map((key, i) => (
          <button
            key={key}
            onClick={() => setActiveDay(i)}
            className={`font-[family-name:var(--font-roboto)] text-[13px] px-[16px] py-[10px] transition-all duration-200 cursor-pointer ${
              activeDay === i
                ? "bg-orange-500 text-white"
                : "bg-white/[0.03] border border-white/10 text-white/50 hover:border-white/20 hover:text-white"
            }`}
          >
            {t(`day_${key}`)}
          </button>
        ))}
      </div>

      {/* Day content */}
      <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px]">
        {/* Day header */}
        <div className="flex items-center justify-between mb-[24px]">
          <div>
            <h2 className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white">
              {t(`day_${day.dayKey}`)}
            </h2>
            <p className="font-[family-name:var(--font-roboto)] text-[14px] text-orange-500 mt-[4px]">
              {t(`focus_${day.focusKey}`)}
            </p>
          </div>
          {!isRestDay && (
            <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40">
              {day.exercises.length} {t("exercisesCount")}
            </span>
          )}
        </div>

        {isRestDay ? (
          <div className="py-[40px] text-center">
            <svg
              className="w-12 h-12 text-white/10 mx-auto mb-[16px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
            <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50">
              {t("restDayMessage")}
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-[1fr_80px_80px_80px] max-sm:grid-cols-[1fr_60px_60px_60px] gap-[8px] pb-[12px] border-b border-white/10 mb-[8px]">
              <span className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1.5px] text-white/30">
                {t("exerciseLabel")}
              </span>
              <span className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1.5px] text-white/30 text-center">
                {t("setsLabel")}
              </span>
              <span className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1.5px] text-white/30 text-center">
                {t("repsLabel")}
              </span>
              <span className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1.5px] text-white/30 text-center">
                {t("restLabel")}
              </span>
            </div>

            {/* Exercise rows */}
            <div className="space-y-[4px]">
              {day.exercises.map((ex, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_80px_80px_80px] max-sm:grid-cols-[1fr_60px_60px_60px] gap-[8px] py-[14px] border-b border-white/5 last:border-0 items-center"
                >
                  <div className="flex items-center gap-[12px]">
                    <span className="font-[family-name:var(--font-sora)] font-semibold text-[13px] text-orange-500 w-[20px] shrink-0">
                      {i + 1}
                    </span>
                    {ex.exerciseSlug ? (
                      <Link
                        href={`/${locale}/vezbe/${ex.exerciseSlug}`}
                        className="font-[family-name:var(--font-roboto)] text-[15px] text-white hover:text-orange-400 transition-colors underline decoration-white/20 underline-offset-2"
                      >
                        {t(`exercise_${ex.nameKey}`)}
                      </Link>
                    ) : (
                      <span className="font-[family-name:var(--font-roboto)] text-[15px] text-white">
                        {t(`exercise_${ex.nameKey}`)}
                      </span>
                    )}
                  </div>
                  <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70 text-center">
                    {ex.sets}
                  </span>
                  <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70 text-center">
                    {ex.reps}
                  </span>
                  <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/40 text-center">
                    {ex.restSeconds}s
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
