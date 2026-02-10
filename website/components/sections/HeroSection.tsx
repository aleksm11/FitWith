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
    <section className="relative w-full min-h-[85dvh] max-lg:min-h-[80dvh] flex flex-col overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#111111]" />

      {/* Hero Image — Desktop (right side) */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[50%]">
        {/* Orange glow behind image */}
        <div className="absolute inset-0 bg-orange-500/10 blur-[80px] rounded-full scale-75 translate-x-[10%]" />
        
        {/* Decorative orange stripes — top-right corner */}
        <div className="absolute top-[80px] right-[40px] z-10">
          <div className="w-[60px] h-[3px] bg-orange-500 mb-[8px]" />
          <div className="w-[40px] h-[3px] bg-orange-500 mb-[8px]" />
          <div className="w-[20px] h-[3px] bg-orange-500" />
        </div>
        
        {/* Decorative orange stripes — bottom-left of image */}
        <div className="absolute bottom-[120px] left-[20px] z-10">
          <div className="w-[3px] h-[60px] bg-orange-500 mb-0 inline-block" />
          <div className="w-[3px] h-[40px] bg-orange-500 ml-[8px] inline-block align-bottom" />
          <div className="w-[3px] h-[20px] bg-orange-500 ml-[8px] inline-block align-bottom" />
        </div>

        {/* Orange accent line — left edge */}
        <div className="absolute left-0 top-[15%] bottom-[15%] w-[3px] bg-gradient-to-b from-transparent via-orange-500 to-transparent z-10" />

        {/* Image with gradient overlay */}
        <div className="relative h-full">
          <img
            src="/assets/hero-desktop.jpg"
            alt="Aleksandar Stojanović — Personal Fitness Coach"
            className="h-full w-full object-cover object-top"
          />
          {/* Gradient fade to blend with left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent w-[40%]" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-[#111111] to-transparent" />
          {/* Top fade for navbar */}
          <div className="absolute top-0 left-0 right-0 h-[15%] bg-gradient-to-b from-[#0A0A0A] to-transparent" />
        </div>
      </div>

      {/* Hero Image — Mobile (behind content, subtle) */}
      <div className="lg:hidden absolute inset-0">
        <img
          src="/assets/hero-mobile.jpg"
          alt="Aleksandar Stojanović — Personal Fitness Coach"
          className="h-full w-full object-cover object-top opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-[#0A0A0A]/80 to-[#0A0A0A]" />
        
        {/* Mobile decorative stripes — top right */}
        <div className="absolute top-[70px] right-[20px] z-10">
          <div className="w-[40px] h-[2px] bg-orange-500 mb-[6px]" />
          <div className="w-[25px] h-[2px] bg-orange-500 mb-[6px]" />
          <div className="w-[12px] h-[2px] bg-orange-500" />
        </div>
      </div>

      <div className="relative flex flex-col flex-1 max-w-[1280px] mx-auto w-full px-[40px] max-sm:px-[20px] pt-[140px] max-lg:pt-[120px] max-sm:pt-[100px] pb-[60px] z-10">
        {/* Hero Content */}
        <div className="flex flex-col gap-[32px] max-w-[700px] lg:max-w-[50%]">
          <h1 className="font-[family-name:var(--font-sora)] font-bold text-[64px] leading-[72px] max-lg:text-[48px] max-lg:leading-[56px] max-sm:text-[36px] max-sm:leading-[44px] text-white">
            {t("title")}
          </h1>
          <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] max-sm:text-[16px] max-sm:leading-[26px] text-white/60 max-w-[540px]">
            {t("subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-[16px] mt-[16px] max-sm:flex-col">
            <Button as="link" href={`/${locale}/kontakt`} size="lg">
              {t("cta1")}
            </Button>
            <Button as="link" href={`/${locale}/saradnja#cene`} variant="outline" size="lg">
              {t("cta2")}
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-auto pt-[48px] max-sm:pt-[48px]">
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
