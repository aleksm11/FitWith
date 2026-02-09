"use client";

import { useTranslations, useLocale } from "next-intl";
import Button from "@/components/shared/Button";
import ExerciseCard from "@/components/shared/ExerciseCard";
import { getExerciseBySlug, getRelatedExercises } from "@/lib/exercises/data";

type Props = {
  slug: string;
};

export default function ExerciseDetailContent({ slug }: Props) {
  const t = useTranslations("Exercises");
  const locale = useLocale();

  const exercise = getExerciseBySlug(slug);
  if (!exercise) return null;

  const related = getRelatedExercises(slug, 3);
  const instructions = t.raw(exercise.instructionsKey) as string[];

  return (
    <>
      {/* Hero */}
      <section className="pt-[140px] pb-[40px] max-sm:pt-[100px] max-sm:pb-[20px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          <Button as="link" href={`/${locale}/vezbe`} variant="ghost" size="sm">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            {t("backToExercises")}
          </Button>
        </div>
      </section>

      {/* Video + Info */}
      <section className="pb-[80px] max-sm:pb-[60px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          <div className="grid grid-cols-[2fr_1fr] gap-[40px] max-lg:grid-cols-1">
            {/* Video placeholder */}
            <div className="aspect-video bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center gap-4">
              <svg
                className="w-16 h-16 text-white/10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                />
              </svg>
              <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/20">
                {t("videoPlaceholder")}
              </span>
            </div>

            {/* Exercise info sidebar */}
            <div>
              {/* Category badge */}
              <span className="inline-block font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1.5px] text-orange-500 bg-orange-500/10 px-[10px] py-[4px] mb-[16px]">
                {t(`category_${exercise.category}`)}
              </span>

              {/* Title */}
              <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white">
                {t(exercise.nameKey)}
              </h1>

              {/* Muscle groups */}
              <div className="mt-[16px] flex flex-wrap gap-[8px]">
                {exercise.muscleGroupKeys.map((k) => (
                  <span
                    key={k}
                    className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50 border border-white/10 px-[12px] py-[4px]"
                  >
                    {t(k)}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="mt-[24px] font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white/70">
                {t(exercise.descKey)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="py-[80px] max-sm:py-[60px] bg-[#111111]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[32px] leading-[40px] max-sm:text-[24px] max-sm:leading-[32px] text-white mb-[32px]">
            {t("instructions")}
          </h2>

          <ol className="space-y-[16px]">
            {instructions.map((step, i) => (
              <li
                key={i}
                className="flex gap-[16px] bg-white/[0.03] border border-white/10 p-[24px]"
              >
                <span className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-orange-500 shrink-0 w-[32px]">
                  {i + 1}
                </span>
                <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white/70">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Related exercises */}
      {related.length > 0 && (
        <section className="py-[80px] max-sm:py-[60px] bg-[#0A0A0A]">
          <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
            <h2 className="font-[family-name:var(--font-sora)] font-bold text-[32px] leading-[40px] max-sm:text-[24px] max-sm:leading-[32px] text-white mb-[32px]">
              {t("relatedExercises")}
            </h2>

            <div className="grid grid-cols-3 gap-[24px] max-lg:grid-cols-2 max-sm:grid-cols-1">
              {related.map((ex) => (
                <ExerciseCard
                  key={ex.slug}
                  slug={ex.slug}
                  name={t(ex.nameKey)}
                  category={t(`category_${ex.category}`)}
                  muscleGroups={ex.muscleGroupKeys.map((k) => t(k))}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
