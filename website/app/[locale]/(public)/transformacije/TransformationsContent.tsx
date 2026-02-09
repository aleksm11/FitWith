"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import Button from "@/components/shared/Button";
import { transformations, type Transformation } from "@/lib/transformations/data";

const tierLabels: Record<string, string> = {
  mentoring: "tierMentoring",
  training: "tierTraining",
  nutrition: "tierNutrition",
};

export default function TransformationsContent() {
  const t = useTranslations("TransformationsPage");
  const locale = useLocale();
  const [selectedTransformation, setSelectedTransformation] = useState<Transformation | null>(null);

  const closeLightbox = useCallback(() => {
    setSelectedTransformation(null);
  }, []);

  useEffect(() => {
    if (!selectedTransformation) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedTransformation, closeLightbox]);

  return (
    <>
      {/* Hero */}
      <section className="pt-[140px] pb-[60px] max-sm:pt-[100px] max-sm:pb-[40px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          <h1 className="font-[family-name:var(--font-sora)] font-bold text-[48px] leading-[56px] max-sm:text-[32px] max-sm:leading-[40px] text-white mb-[16px]">
            {t("title")}
          </h1>
          <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] max-sm:text-[16px] max-sm:leading-[26px] text-white/60 max-w-[640px]">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="pb-[80px] max-sm:pb-[60px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[24px]">
            {transformations.map((tr) => (
              <button
                key={tr.id}
                onClick={() => setSelectedTransformation(tr)}
                className="group bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-200 text-left cursor-pointer"
              >
                {/* Before/After images */}
                <div className="grid grid-cols-2">
                  {/* Before */}
                  <div className="aspect-[3/4] bg-white/[0.02] relative flex items-center justify-center">
                    <div className="flex flex-col items-center gap-[8px]">
                      <svg className="w-12 h-12 text-white/[0.06]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <span className="font-[family-name:var(--font-roboto)] text-[11px] text-white/20 uppercase tracking-wider">
                        {t("before")}
                      </span>
                    </div>
                    <span className="absolute top-[12px] left-[12px] font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-wider text-white/30 bg-black/40 px-[8px] py-[3px]">
                      {t("before")}
                    </span>
                  </div>

                  {/* After */}
                  <div className="aspect-[3/4] bg-orange-500/[0.03] relative flex items-center justify-center">
                    <div className="flex flex-col items-center gap-[8px]">
                      <svg className="w-12 h-12 text-orange-500/10 group-hover:text-orange-500/20 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <span className="font-[family-name:var(--font-roboto)] text-[11px] text-orange-500/30 uppercase tracking-wider">
                        {t("after")}
                      </span>
                    </div>
                    <span className="absolute top-[12px] left-[12px] font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-wider text-orange-400/60 bg-black/40 px-[8px] py-[3px]">
                      {t("after")}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-[24px] max-sm:p-[20px]">
                  <h3 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white group-hover:text-orange-400 transition-colors mb-[8px]">
                    {t(tr.nameKey)}
                  </h3>
                  <div className="flex flex-wrap items-center gap-[16px] mb-[12px]">
                    <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40">
                      {tr.weightBefore} → {tr.weightAfter}
                    </span>
                    <span className="font-[family-name:var(--font-roboto)] text-[13px] text-orange-400">
                      {tr.duration} {t("weeks")}
                    </span>
                    <span className="font-[family-name:var(--font-roboto)] text-[11px] text-white/30 bg-white/5 px-[8px] py-[2px]">
                      {t(tierLabels[tr.tier])}
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-roboto)] text-[14px] leading-[22px] text-white/50 italic">
                    &ldquo;{t(tr.quoteKey)}&rdquo;
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[80px] max-sm:py-[60px] bg-[#111111]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px] text-center">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[16px]">
            {t("ctaTitle")}
          </h2>
          <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] text-white/60 mb-[32px] max-w-[500px] mx-auto">
            {t("ctaText")}
          </p>
          <Button as="link" href={`/${locale}/kontakt`}>
            {t("ctaButton")}
          </Button>
        </div>
      </section>

      {/* Lightbox */}
      {selectedTransformation && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-[24px]"
          onClick={closeLightbox}
        >
          <div
            className="bg-[#111111] border border-white/10 max-w-[900px] w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="flex justify-end p-[16px] pb-0">
              <button
                onClick={closeLightbox}
                className="text-white/40 hover:text-white transition-colors p-[4px]"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Before/After large */}
            <div className="grid grid-cols-2 gap-[2px] px-[24px]">
              <div className="aspect-[3/4] bg-white/[0.02] flex flex-col items-center justify-center gap-[12px]">
                <svg className="w-20 h-20 text-white/[0.06]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/30 uppercase tracking-wider">
                  {t("before")} — {selectedTransformation.weightBefore}
                </span>
              </div>
              <div className="aspect-[3/4] bg-orange-500/[0.03] flex flex-col items-center justify-center gap-[12px]">
                <svg className="w-20 h-20 text-orange-500/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className="font-[family-name:var(--font-roboto)] text-[14px] text-orange-400/50 uppercase tracking-wider">
                  {t("after")} — {selectedTransformation.weightAfter}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="p-[24px]">
              <h2 className="font-[family-name:var(--font-sora)] font-bold text-[28px] text-white mb-[16px]">
                {t(selectedTransformation.nameKey)}
              </h2>

              <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-[16px] mb-[24px]">
                <div className="bg-white/[0.03] border border-white/5 p-[16px]">
                  <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("duration")}</p>
                  <p className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-orange-400">
                    {selectedTransformation.duration} {t("weeks")}
                  </p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 p-[16px]">
                  <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("weightBefore")}</p>
                  <p className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white">
                    {selectedTransformation.weightBefore}
                  </p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 p-[16px]">
                  <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("weightAfter")}</p>
                  <p className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-green-400">
                    {selectedTransformation.weightAfter}
                  </p>
                </div>
              </div>

              <div className="mb-[16px]">
                <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30 uppercase tracking-wider mr-[8px]">
                  {t("tier")}:
                </span>
                <span className="font-[family-name:var(--font-roboto)] text-[13px] text-orange-400 bg-orange-500/10 px-[10px] py-[3px]">
                  {t(tierLabels[selectedTransformation.tier])}
                </span>
              </div>

              <blockquote className="border-l-2 border-orange-500 pl-[20px] py-[8px]">
                <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white/70 italic">
                  &ldquo;{t(selectedTransformation.quoteKey)}&rdquo;
                </p>
                <cite className="font-[family-name:var(--font-roboto)] text-[14px] text-white/40 mt-[8px] block not-italic">
                  — {t(selectedTransformation.nameKey)}
                </cite>
              </blockquote>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
