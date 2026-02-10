"use client";

import { useTranslations, useLocale } from "next-intl";
import Button from "@/components/shared/Button";

export default function HeroSection() {
  const t = useTranslations("Hero");
  const locale = useLocale();

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ];

  return (
    <section className="relative w-full flex flex-col">
      {/* ===== HERO IMAGE AREA ===== */}
      <div className="relative w-full h-[100dvh] max-lg:h-[85dvh]">
        {/* Desktop Image */}
        <picture>
          <source media="(min-width: 1024px)" srcSet="/assets/hero-desktop.jpg" />
          <img
            src="/assets/hero-mobile.jpg"
            alt="Aleksandar Stojanović — Personal Fitness Coach"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </picture>

        {/* Dark gradient — bottom (for text readability, only bottom 25%) */}
        <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
        
        {/* Dark gradient — top (for navbar readability) */}
        <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-[#0A0A0A]/80 to-transparent" />

        {/* ===== DECORATIVE ORANGE STRIPES ===== */}
        {/* Top-left corner stripes (horizontal) */}
        <div className="absolute top-[90px] left-[20px] lg:left-[40px] z-10 flex flex-col gap-[6px]">
          <div className="w-[50px] lg:w-[80px] h-[3px] bg-orange-500" />
          <div className="w-[30px] lg:w-[50px] h-[3px] bg-orange-500" />
        </div>

        {/* Bottom-right corner stripes (horizontal) */}
        <div className="absolute bottom-[22%] lg:bottom-[25%] right-[20px] lg:right-[40px] z-10 flex flex-col items-end gap-[6px]">
          <div className="w-[50px] lg:w-[80px] h-[3px] bg-orange-500" />
          <div className="w-[30px] lg:w-[50px] h-[3px] bg-orange-500" />
        </div>

        {/* Left edge vertical accent */}
        <div className="hidden lg:block absolute left-[40px] top-[25%] h-[200px] w-[3px] bg-gradient-to-b from-transparent via-orange-500 to-transparent z-10" />

        {/* Right edge vertical accent */}
        <div className="hidden lg:block absolute right-[40px] top-[15%] h-[150px] w-[3px] bg-gradient-to-b from-transparent via-orange-500 to-transparent z-10" />

        {/* ===== HERO TEXT — positioned at very bottom, extending below image ===== */}
        <div className="absolute bottom-[-50px] max-sm:bottom-[-50px] left-0 right-0 z-10 px-[40px] max-sm:px-[20px]">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col gap-[12px] max-sm:gap-[8px] max-w-[700px] lg:max-w-[50%]">
              <h1 className="font-[family-name:var(--font-sora)] font-bold text-[42px] leading-[48px] max-lg:text-[34px] max-lg:leading-[40px] max-sm:text-[26px] max-sm:leading-[32px] text-white drop-shadow-lg">
                {t("title")}
              </h1>
              <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[24px] max-sm:text-[14px] max-sm:leading-[21px] text-white/80 max-w-[460px] drop-shadow-md">
                {t("subtitle")}
              </p>

              {/* CTA Buttons */}
              <div className="flex gap-[12px] mt-[4px] max-sm:flex-col">
                <Button as="link" href={`/${locale}/kontakt`} size="lg">
                  {t("cta1")}
                </Button>
                <Button as="link" href={`/${locale}/saradnja#cene`} variant="outline" size="lg">
                  {t("cta2")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATS BAR — below hero ===== */}
      <div className="relative bg-[#0A0A0A] px-[40px] max-sm:px-[20px] py-[12px]">
        <div className="max-w-[1280px] mx-auto">
          <div className="bg-white/[0.03] border border-white/10 backdrop-blur-[18px] px-[48px] py-[36px] max-sm:px-[24px] max-sm:py-[24px] flex items-center justify-between max-lg:flex-wrap max-lg:gap-[32px]">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-[4px] max-lg:w-[calc(50%-16px)] max-sm:w-full">
                <span className="font-[family-name:var(--font-sora)] font-bold text-[42px] leading-[52px] max-sm:text-[32px] max-sm:leading-[42px] text-orange-500">
                  {stat.value}
                </span>
                <span className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white/60">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
