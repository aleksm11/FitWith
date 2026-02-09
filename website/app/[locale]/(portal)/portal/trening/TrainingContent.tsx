"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getMyTrainingPlan } from "@/lib/supabase/queries";
import { localizedField } from "@/lib/supabase/types";
import type { Locale } from "@/lib/supabase/types";
import { trainingPlan as mockTrainingPlan } from "@/lib/portal/mock-data";
import type { TrainingDay as MockTrainingDay } from "@/lib/portal/mock-data";

type SupabaseDay = {
  id: string;
  day_number: number;
  day_name_sr: string | null;
  day_name_en: string | null;
  day_name_ru: string | null;
  notes: string | null;
  sort_order: number;
  training_exercises: {
    id: string;
    exercise_id: string | null;
    exercise_name: string | null;
    sets: number | null;
    reps: string | null;
    rest_seconds: number | null;
    notes: string | null;
    sort_order: number;
    exercises: {
      id: string;
      name_sr: string;
      name_en: string;
      name_ru: string;
      slug: string;
    } | null;
  }[];
};

// Normalized display type
type DisplayDay = {
  label: string;
  focus: string;
  exercises: {
    name: string;
    slug: string;
    sets: number;
    reps: string;
    restSeconds: number;
  }[];
};

const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

function normalizeMockDay(day: MockTrainingDay, t: (key: string) => string): DisplayDay {
  return {
    label: t(`day_${day.dayKey}`),
    focus: t(`focus_${day.focusKey}`),
    exercises: day.exercises.map((ex) => ({
      name: t(`exercise_${ex.nameKey}`),
      slug: ex.exerciseSlug,
      sets: ex.sets,
      reps: ex.reps,
      restSeconds: ex.restSeconds,
    })),
  };
}

function normalizeSupabaseDay(day: SupabaseDay, locale: Locale, t: (key: string) => string): DisplayDay {
  const name = localizedField(day as unknown as Record<string, unknown>, "day_name", locale);
  return {
    label: name || t(`day_${dayKeys[day.day_number - 1] || "monday"}`),
    focus: day.notes || "",
    exercises: day.training_exercises
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((ex) => ({
        name: ex.exercises
          ? localizedField(ex.exercises as unknown as Record<string, unknown>, "name", locale)
          : ex.exercise_name || "",
        slug: ex.exercises?.slug || "",
        sets: ex.sets || 0,
        reps: ex.reps || "",
        restSeconds: ex.rest_seconds || 0,
      })),
  };
}

export default function TrainingContent() {
  const t = useTranslations("Portal");
  const locale = useLocale() as Locale;

  const todayIndex = (() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  })();
  const [activeDay, setActiveDay] = useState(todayIndex);
  const [days, setDays] = useState<DisplayDay[]>([]);
  const [dayLabels, setDayLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTrainingPlan()
      .then((plan) => {
        if (plan && plan.training_days.length > 0) {
          const sorted = [...plan.training_days].sort((a, b) => a.sort_order - b.sort_order);
          const normalizedDays = sorted.map((d) => normalizeSupabaseDay(d as unknown as SupabaseDay, locale, t));
          const labels = sorted.map((d) => {
            const name = localizedField(d as unknown as Record<string, unknown>, "day_name", locale);
            return name || `${t("dayLabel")} ${d.day_number}`;
          });
          setDays(normalizedDays);
          setDayLabels(labels);
          setActiveDay(0);
        } else {
          // Fallback to mock data
          const normalizedDays = mockTrainingPlan.map((d) => normalizeMockDay(d, t));
          const labels = dayKeys.map((key) => t(`day_${key}`));
          setDays(normalizedDays);
          setDayLabels(labels);
        }
      })
      .catch(() => {
        const normalizedDays = mockTrainingPlan.map((d) => normalizeMockDay(d, t));
        const labels = dayKeys.map((key) => t(`day_${key}`));
        setDays(normalizedDays);
        setDayLabels(labels);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const day = days[activeDay];
  if (!day) return null;
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
        {dayLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className={`font-[family-name:var(--font-roboto)] text-[13px] px-[16px] py-[10px] transition-all duration-200 cursor-pointer ${
              activeDay === i
                ? "bg-orange-500 text-white"
                : "bg-white/[0.03] border border-white/10 text-white/50 hover:border-white/20 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Day content */}
      <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px]">
        <div className="flex items-center justify-between mb-[24px]">
          <div>
            <h2 className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white">
              {day.label}
            </h2>
            {day.focus && (
              <p className="font-[family-name:var(--font-roboto)] text-[14px] text-orange-500 mt-[4px]">
                {day.focus}
              </p>
            )}
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
                    {ex.slug ? (
                      <Link
                        href={`/${locale}/vezbe/${ex.slug}`}
                        className="font-[family-name:var(--font-roboto)] text-[15px] text-white hover:text-orange-400 transition-colors underline decoration-white/20 underline-offset-2"
                      >
                        {ex.name}
                      </Link>
                    ) : (
                      <span className="font-[family-name:var(--font-roboto)] text-[15px] text-white">
                        {ex.name}
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
