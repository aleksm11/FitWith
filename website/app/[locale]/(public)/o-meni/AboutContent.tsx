"use client";

import { useTranslations, useLocale } from "next-intl";
import Button from "@/components/shared/Button";
import SectionHeading from "@/components/shared/SectionHeading";

export default function AboutContent() {
  const t = useTranslations("About");
  const tHero = useTranslations("Hero");
  const locale = useLocale();

  const certifications = [t("cert1"), t("cert2"), t("cert3")];

  const stats = [
    { value: tHero("stat1Value"), label: tHero("stat1Label") },
    { value: tHero("stat2Value"), label: tHero("stat2Label") },
    { value: tHero("stat3Value"), label: tHero("stat3Label") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="pt-[140px] pb-[80px] max-sm:pt-[100px] max-sm:pb-[60px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          <div className="max-w-[700px]">
            <p className="font-[family-name:var(--font-roboto)] text-[14px] uppercase tracking-[2px] text-orange-500 mb-4">
              {t("title")}
            </p>
            <h1 className="font-[family-name:var(--font-sora)] font-bold text-[56px] leading-[64px] max-lg:text-[42px] max-lg:leading-[50px] max-sm:text-[32px] max-sm:leading-[40px] text-white">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 font-[family-name:var(--font-roboto)] text-[20px] leading-[30px] max-sm:text-[18px] max-sm:leading-[28px] text-white/60">
              {t("heroSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="py-[80px] max-sm:py-[60px] bg-[#111111]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          <div className="grid grid-cols-2 gap-[60px] max-lg:grid-cols-1">
            {/* Photo placeholder */}
            <div className="bg-white/[0.03] border border-white/10 h-[500px] max-lg:h-[400px] max-sm:h-[300px] flex items-center justify-center">
              <span className="text-white/20 font-[family-name:var(--font-roboto)] text-[14px]">
                PHOTO
              </span>
            </div>

            {/* Bio text */}
            <div className="flex flex-col gap-[20px] justify-center">
              <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[30px] text-white/70">
                {t("bio1")}
              </p>
              <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[30px] text-white/70">
                {t("bio2")}
              </p>
              <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[30px] text-white/70">
                {t("bio3")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-[80px] max-sm:py-[60px] bg-[#0A0A0A]">
        <div className="max-w-[800px] mx-auto px-[40px] max-sm:px-[20px] text-center">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white">
            {t("philosophyTitle")}
          </h2>
          <p className="mt-6 font-[family-name:var(--font-roboto)] text-[18px] leading-[30px] text-white/60">
            {t("philosophyText")}
          </p>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-[80px] max-sm:py-[60px] bg-[#111111]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          <SectionHeading title={t("certTitle")} />

          <div className="mt-[48px] grid grid-cols-3 gap-[24px] max-lg:grid-cols-1">
            {certifications.map((cert) => (
              <div
                key={cert}
                className="bg-white/[0.03] border border-white/10 p-[32px] flex items-center gap-[16px]"
              >
                <svg
                  className="w-6 h-6 shrink-0 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                </svg>
                <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white/70">
                  {cert}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-[80px] max-sm:py-[60px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          <SectionHeading title={t("statsTitle")} />

          <div className="mt-[48px] grid grid-cols-3 gap-[24px] max-sm:grid-cols-1">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/[0.03] border border-white/10 p-[40px] text-center"
              >
                <span className="font-[family-name:var(--font-sora)] font-bold text-[48px] leading-[56px] text-orange-500">
                  {stat.value}
                </span>
                <p className="mt-2 font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[80px] max-sm:py-[60px] bg-[#111111]">
        <div className="max-w-[800px] mx-auto px-[40px] max-sm:px-[20px] text-center">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white">
            {t("ctaTitle")}
          </h2>
          <div className="mt-[32px]">
            <Button as="link" href={`/${locale}/kontakt`} size="lg">
              {t("ctaText")}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
