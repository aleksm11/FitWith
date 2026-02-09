"use client";

import { useTranslations } from "next-intl";

export default function PrivacyContent() {
  const t = useTranslations("Privacy");

  const sections = [
    { title: t("section1Title"), text: t("section1Text") },
    { title: t("section2Title"), text: t("section2Text") },
    { title: t("section3Title"), text: t("section3Text") },
    { title: t("section4Title"), text: t("section4Text") },
    { title: t("section5Title"), text: t("section5Text") },
  ];

  return (
    <>
      <section className="pt-[140px] pb-[120px] max-sm:pt-[100px] max-sm:pb-[80px] bg-[#0A0A0A]">
        <div className="max-w-[800px] mx-auto px-[40px] max-sm:px-[20px]">
          <h1 className="font-[family-name:var(--font-sora)] font-bold text-[48px] leading-[56px] max-lg:text-[36px] max-lg:leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white">
            {t("title")}
          </h1>
          <p className="mt-4 font-[family-name:var(--font-roboto)] text-[14px] text-white/40">
            {t("lastUpdated")}
          </p>
          <p className="mt-8 font-[family-name:var(--font-roboto)] text-[17px] leading-[28px] text-white/60">
            {t("intro")}
          </p>

          <div className="mt-[48px] flex flex-col gap-[40px]">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[22px] leading-[30px] text-white mb-4">
                  {section.title}
                </h2>
                <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[28px] text-white/60">
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
