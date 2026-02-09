"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import SectionHeading from "@/components/shared/SectionHeading";
import ExerciseCard from "@/components/shared/ExerciseCard";
import { exercises, categories } from "@/lib/exercises/data";
import type { ExerciseCategory } from "@/lib/exercises/data";

export default function ExerciseListContent() {
  const t = useTranslations("Exercises");
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<ExerciseCategory | null>(null);

  const filtered = activeCategory
    ? exercises.filter((e) => e.category === activeCategory)
    : exercises;

  return (
    <>
      {/* Hero */}
      <section className="pt-[140px] pb-[80px] max-sm:pt-[100px] max-sm:pb-[60px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          <div className="max-w-[700px]">
            <p className="font-[family-name:var(--font-roboto)] text-[14px] uppercase tracking-[2px] text-orange-500 mb-4">
              {t("label")}
            </p>
            <h1 className="font-[family-name:var(--font-sora)] font-bold text-[56px] leading-[64px] max-lg:text-[42px] max-lg:leading-[50px] max-sm:text-[32px] max-sm:leading-[40px] text-white">
              {t("title")}
            </h1>
            <p className="mt-4 font-[family-name:var(--font-roboto)] text-[20px] leading-[30px] max-sm:text-[18px] max-sm:leading-[28px] text-white/60">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Category filter + Grid */}
      <section className="py-[80px] max-sm:py-[60px] bg-[#111111]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-[8px] mb-[48px]">
            <button
              onClick={() => setActiveCategory(null)}
              className={`font-[family-name:var(--font-roboto)] text-[14px] px-[20px] py-[10px] transition-all duration-200 cursor-pointer ${
                activeCategory === null
                  ? "bg-orange-500 text-white"
                  : "bg-white/[0.03] border border-white/10 text-white/60 hover:border-white/20 hover:text-white"
              }`}
            >
              {t("allCategories")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-[family-name:var(--font-roboto)] text-[14px] px-[20px] py-[10px] transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-orange-500 text-white"
                    : "bg-white/[0.03] border border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                }`}
              >
                {t(`category_${cat}`)}
              </button>
            ))}
          </div>

          {/* Exercise grid */}
          <div className="grid grid-cols-3 gap-[24px] max-lg:grid-cols-2 max-sm:grid-cols-1">
            {filtered.map((exercise) => (
              <ExerciseCard
                key={exercise.slug}
                slug={exercise.slug}
                name={t(exercise.nameKey)}
                category={t(`category_${exercise.category}`)}
                muscleGroups={exercise.muscleGroupKeys.map((k) => t(k))}
                locale={locale}
              />
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-[60px]">
              <p className="font-[family-name:var(--font-roboto)] text-[18px] text-white/40">
                {t("noExercises")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-[80px] max-sm:py-[60px] bg-[#0A0A0A]">
        <div className="max-w-[800px] mx-auto px-[40px] max-sm:px-[20px] text-center">
          <SectionHeading title={t("ctaTitle")} subtitle={t("ctaSubtitle")} />
        </div>
      </section>
    </>
  );
}
