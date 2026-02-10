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
      {/* ===== DESKTOP HERO — two columns ===== */}
      <div className="hidden lg:flex relative w-full min-h-[75dvh] bg-[#0A0A0A]">
        {/* Left column — text */}
        <div className="flex flex-col justify-center w-[45%] xl:w-[50%] pl-[40px] xl:pl-[80px] pr-[20px] py-[100px]">
          <div className="max-w-[550px] ml-auto">
            {/* Decorative stripes */}
            <div className="flex flex-col gap-[6px] mb-[32px]">
              <div className="w-[80px] h-[3px] bg-orange-500" />
              <div className="w-[50px] h-[3px] bg-orange-500" />
            </div>

            <h1 className="font-[family-name:var(--font-sora)] font-bold text-[52px] leading-[60px] xl:text-[60px] xl:leading-[68px] text-white">
              {t("title")}
            </h1>
            <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] text-white/80 max-w-[460px] mt-[16px]">
              {t("subtitle")}
            </p>
            <div className="flex gap-[16px] mt-[24px]">
              <Button as="link" href={`/${locale}/kontakt`} size="lg">
                {t("cta1")}
              </Button>
              <Button as="link" href={`/${locale}/saradnja#cene`} variant="outline" size="lg">
                {t("cta2")}
              </Button>
            </div>
          </div>
        </div>

        {/* Right column — image */}
        <div className="relative w-[55%] xl:w-[50%]">
          <img
            src="/assets/hero-desktop.jpg"
            alt="Aleksandar Stojanović — Personal Fitness Coach"
            className="absolute inset-0 w-full h-full object-cover object-[center_25%]"
          />
          {/* Fade left edge into background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent w-[30%]" />
          {/* Fade bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-[#0A0A0A] to-transparent" />

          {/* Decorative stripes — bottom right */}
          <div className="absolute bottom-[20%] right-[40px] z-10 flex flex-col items-end gap-[6px]">
            <div className="w-[80px] h-[3px] bg-orange-500" />
            <div className="w-[50px] h-[3px] bg-orange-500" />
          </div>

          {/* Right edge vertical accent */}
          <div className="absolute right-[40px] top-[15%] h-[150px] w-[3px] bg-gradient-to-b from-transparent via-orange-500 to-transparent z-10" />
        </div>
      </div>

      {/* ===== MOBILE HERO — full-width image with text at bottom ===== */}
      <div className="lg:hidden relative w-full h-[85dvh]">
        <img
          src="/assets/hero-mobile.jpg"
          alt="Aleksandar Stojanović — Personal Fitness Coach"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* Dark gradient — bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
        {/* Dark gradient — top (navbar) */}
        <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-[#0A0A0A]/80 to-transparent" />

        {/* Decorative stripes — top left */}
        <div className="absolute top-[90px] left-[20px] z-10 flex flex-col gap-[6px]">
          <div className="w-[50px] h-[3px] bg-orange-500" />
          <div className="w-[30px] h-[3px] bg-orange-500" />
        </div>

        {/* Text at bottom */}
        <div className="absolute bottom-[12px] left-0 right-0 z-10 px-[20px] sm:px-[40px]">
          <div className="flex flex-col gap-[8px]">
            <h1 className="font-[family-name:var(--font-sora)] font-bold text-[26px] leading-[32px] sm:text-[34px] sm:leading-[40px] text-white drop-shadow-lg">
              {t("title")}
            </h1>
            <p className="font-[family-name:var(--font-roboto)] text-[14px] leading-[21px] sm:text-[16px] sm:leading-[24px] text-white/80 max-w-[460px] drop-shadow-md">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* ===== MOBILE CTA BUTTONS ===== */}
      <div className="lg:hidden relative bg-[#0A0A0A] px-[20px] sm:px-[40px] pt-[24px] pb-[12px]">
        <div className="flex gap-[12px] flex-col sm:flex-row">
          <Button as="link" href={`/${locale}/kontakt`} size="lg">
            {t("cta1")}
          </Button>
          <Button as="link" href={`/${locale}/saradnja#cene`} variant="outline" size="lg">
            {t("cta2")}
          </Button>
        </div>
      </div>

      {/* ===== STATS BAR ===== */}
      <div className="relative bg-[#0A0A0A] px-[40px] max-sm:px-[20px] py-[16px]">
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
