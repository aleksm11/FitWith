"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

type Exercise = {
  name: string;
  slug?: string;
  sets: number;
  reps: string;
  restSeconds?: number;
};

type Props = {
  exercises: Exercise[];
  locale: string;
};

export default function ExerciseTable({ exercises, locale }: Props) {
  const t = useTranslations("Portal");

  return (
    <div>
      {/* Header */}
      <div className="grid grid-cols-[1fr_70px_70px_70px] max-sm:grid-cols-[1fr_60px_60px_60px] gap-[6px] pb-[6px] mb-[4px] border-b border-white/5">
        <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500">
          {t("exerciseLabel")}
        </span>
        <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 text-center">
          {t("setsLabel")}
        </span>
        <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 text-center">
          {t("repsLabel")}
        </span>
        <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 text-center">
          {t("restLabel")}
        </span>
      </div>

      {/* Rows */}
      {exercises.map((ex, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_70px_70px_70px] max-sm:grid-cols-[1fr_60px_60px_60px] gap-[6px] py-[8px] border-b border-white/5 last:border-0 items-center"
        >
          <div className="flex items-center gap-[12px]">
            <span className="font-[family-name:var(--font-sora)] font-semibold text-[13px] text-orange-500 w-[20px] shrink-0">
              {i + 1}
            </span>
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
          </div>
          <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/70 text-center">
            {ex.sets}
          </span>
          <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/70 text-center">
            {ex.reps}
          </span>
          <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40 text-center">
            {ex.restSeconds ? `${ex.restSeconds}s` : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}
