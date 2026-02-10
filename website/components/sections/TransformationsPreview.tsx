"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import SectionHeading from "@/components/shared/SectionHeading";
import Button from "@/components/shared/Button";
import { transformations } from "@/lib/transformations/data";

export default function TransformationsPreview() {
  const t = useTranslations("Transformations");
  const tPage = useTranslations("TransformationsPage");
  const locale = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % transformations.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <section className="py-[120px] max-sm:py-[80px] bg-[#111111]">
      <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-[64px]">
          {/* Slideshow */}
          <div className="relative bg-white/[0.03] border border-white/10 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {transformations.map((item, idx) => (
                <div key={idx} className="grid grid-cols-2 max-lg:grid-cols-1 min-w-full">
                  {/* Before/After image area */}
                  <div className="relative h-[400px] max-sm:h-[300px] flex">
                    <div className="w-1/2 bg-white/[0.06] flex items-center justify-center relative">
                      <span className="text-white/20 text-[14px] font-[family-name:var(--font-roboto)] uppercase tracking-[2px]">
                        {tPage("before")}
                      </span>
                    </div>
                    <div className="w-[2px] bg-orange-500/40" />
                    <div className="w-1/2 bg-white/[0.1] flex items-center justify-center relative">
                      <span className="text-white/20 text-[14px] font-[family-name:var(--font-roboto)] uppercase tracking-[2px]">
                        {tPage("after")}
                      </span>
                    </div>
                  </div>

                  {/* Info panel */}
                  <div className="p-[40px] max-sm:p-[24px] flex flex-col justify-center">
                    <h3 className="font-[family-name:var(--font-sora)] font-bold text-[28px] leading-[36px] max-sm:text-[22px] max-sm:leading-[30px] text-white mb-[16px]">
                      {tPage(item.nameKey)}
                    </h3>
                    <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white/60 mb-[24px] italic">
                      &ldquo;{tPage(item.quoteKey)}&rdquo;
                    </p>

                    <div className="flex gap-[32px] max-sm:gap-[20px]">
                      <div>
                        <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-[1px] mb-[4px]">
                          {tPage("duration")}
                        </p>
                        <p className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-orange-500">
                          {item.duration} {tPage("weeks")}
                        </p>
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-[1px] mb-[4px]">
                          {tPage("weightBefore")}
                        </p>
                        <p className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white">
                          {item.weightBefore}
                        </p>
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-[1px] mb-[4px]">
                          {tPage("weightAfter")}
                        </p>
                        <p className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-orange-500">
                          {item.weightAfter}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots / indicators */}
          <div className="flex items-center justify-center gap-[12px] mt-[32px]">
            {transformations.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-[12px] h-[12px] rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? "bg-orange-500 w-[32px]"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-[48px] flex justify-center">
          <Button as="link" href={`/${locale}/transformacije`} variant="outline">
            {t("viewAll")}
          </Button>
        </div>
      </div>
    </section>
  );
}
