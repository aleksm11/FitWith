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
  ];

  return (
    <section className="relative w-full min-h-[100dvh] max-lg:min-h-[80dvh] flex flex-col">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#111111]" />
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]" />

      <div className="relative flex flex-col flex-1 max-w-[1280px] mx-auto w-full px-[40px] max-sm:px-[20px] pt-[160px] max-lg:pt-[120px] max-sm:pt-[100px] pb-[60px]">
        {/* Hero Content */}
        <div className="flex flex-col gap-[32px] max-w-[700px]">
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
            <Button as="link" href={`/${locale}/cene`} variant="outline" size="lg">
              {t("cta2")}
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-auto pt-[80px] max-sm:pt-[48px]">
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
