"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getMyTrainingPlan } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import { localizedField } from "@/lib/supabase/types";
import type { Locale } from "@/lib/supabase/types";

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

function normalizeSupabaseDay(day: SupabaseDay, locale: Locale, t: (key: string) => string): DisplayDay {
  const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
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

  const [activeDay, setActiveDay] = useState(0);
  const [days, setDays] = useState<DisplayDay[]>([]);
  const [dayLabels, setDayLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPlan, setHasPlan] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
          setHasPlan(true);
          // Set active day to today
          const todayIndex = (() => {
            const d = new Date().getDay();
            return d === 0 ? 6 : d - 1;
          })();
          setActiveDay(Math.min(todayIndex, sorted.length - 1));
        }
      })
      .catch(() => {})
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

  if (!hasPlan) {
    return (
      <div>
        <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[8px]">
          {t("training")}
        </h1>
        <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[32px]">
          {t("trainingSubtitle")}
        </p>
        <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px]">
          <div className="py-[48px] text-center">
            <svg className="w-16 h-16 text-white/10 mx-auto mb-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <p className="font-[family-name:var(--font-sora)] font-semibold text-[20px] text-white/50 mb-[8px]">
              {t("noTrainingPlanAssigned")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const day = days[activeDay];
  if (!day) return null;
  const isRestDay = day.exercises.length === 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-[8px]">
        <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white">
          {t("training")}
        </h1>
        {isAdmin && profileId && (
          <Link
            href={`/${locale}/portal/klijenti/${profileId}`}
            className="flex items-center gap-[6px] font-[family-name:var(--font-roboto)] text-[13px] text-orange-400 hover:text-orange-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            {t("editPlan")}
          </Link>
        )}
      </div>
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
