"use client";

import { useTranslations, useLocale } from "next-intl";
import Button from "@/components/shared/Button";

export default function ServicesContent() {
  const t = useTranslations("ServicesPage");
  const locale = useLocale();

  const tiers = [
    {
      title: t("tier1Title"),
      subtitle: t("tier1Subtitle"),
      desc: t("tier1Desc"),
      features: t.raw("tier1Features") as string[],
      accent: true,
    },
    {
      title: t("tier2Title"),
      subtitle: t("tier2Subtitle"),
      desc: t("tier2Desc"),
      features: t.raw("tier2Features") as string[],
      accent: false,
    },
    {
      title: t("tier3Title"),
      subtitle: t("tier3Subtitle"),
      desc: t("tier3Desc"),
      features: t.raw("tier3Features") as string[],
      accent: false,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="pt-[140px] pb-[80px] max-sm:pt-[100px] max-sm:pb-[60px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px] text-center">
          <p className="font-[family-name:var(--font-roboto)] text-[14px] uppercase tracking-[2px] text-orange-500 mb-4">
            {t("title")}
          </p>
          <h1 className="font-[family-name:var(--font-sora)] font-bold text-[48px] leading-[56px] max-lg:text-[36px] max-lg:leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white max-w-[700px] mx-auto">
            {t("subtitle")}
          </h1>
        </div>
      </section>

      {/* Service Tiers */}
      {tiers.map((tier, index) => (
        <section
          key={tier.title}
          className={`py-[80px] max-sm:py-[60px] ${
            index % 2 === 0 ? "bg-[#111111]" : "bg-[#0A0A0A]"
          }`}
        >
          <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
            <div className="grid grid-cols-2 gap-[60px] max-lg:grid-cols-1 items-center">
              {/* Text */}
              <div className={`flex flex-col gap-[20px] ${index % 2 === 1 ? "max-lg:order-1 lg:order-2" : ""}`}>
                <div className="flex items-center gap-3">
                  {tier.accent && (
                    <span className="bg-gradient-to-r from-orange-500 to-amber-400 text-white text-[11px] font-[family-name:var(--font-sora)] font-semibold px-3 py-1 uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                </div>
                <h2 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white">
                  {tier.title}
                </h2>
                <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-orange-500/80">
                  {tier.subtitle}
                </p>
                <p className="font-[family-name:var(--font-roboto)] text-[17px] leading-[28px] text-white/60">
                  {tier.desc}
                </p>
              </div>

              {/* Features */}
              <div className={`bg-white/[0.03] border border-white/10 p-[40px] max-sm:p-[28px] ${index % 2 === 1 ? "max-lg:order-2 lg:order-1" : ""}`}>
                <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-white mb-6">
                  {tier.title}
                </h3>
                <div className="flex flex-col gap-[16px]">
                  {tier.features.map((feature: string) => (
                    <div key={feature} className="flex gap-[12px] items-start">
                      <svg
                        className="w-5 h-5 mt-[3px] shrink-0 text-orange-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white/70">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Button as="link" href={`/${locale}/cene`} variant={tier.accent ? "primary" : "outline"}>
                    {t("title")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-[80px] max-sm:py-[60px] bg-[#0A0A0A]">
        <div className="max-w-[800px] mx-auto px-[40px] max-sm:px-[20px] text-center">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white">
            {t("ctaTitle")}
          </h2>
          <p className="mt-4 font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] text-white/60">
            {t("ctaText")}
          </p>
          <div className="mt-[32px]">
            <Button as="link" href={`/${locale}/kontakt`} size="lg">
              {t("ctaTitle")}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
