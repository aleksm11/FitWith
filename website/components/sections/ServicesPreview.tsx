"use client";

import { useTranslations, useLocale } from "next-intl";
import Button from "@/components/shared/Button";
import SectionHeading from "@/components/shared/SectionHeading";

const serviceIcons = [
  // Mentoring icon
  <svg key="mentoring" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>,
  // Training icon
  <svg key="training" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>,
  // Nutrition icon
  <svg key="nutrition" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.126-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265z" />
  </svg>,
];

export default function ServicesPreview() {
  const t = useTranslations("Services");
  const locale = useLocale();

  const services = [
    { icon: serviceIcons[0], title: t("tier1Title"), desc: t("tier1Desc") },
    { icon: serviceIcons[1], title: t("tier2Title"), desc: t("tier2Desc") },
    { icon: serviceIcons[2], title: t("tier3Title"), desc: t("tier3Desc") },
  ];

  return (
    <section className="py-[120px] max-sm:py-[80px] bg-[#0A0A0A]">
      <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-[64px] grid grid-cols-3 gap-[24px] max-lg:grid-cols-1 max-lg:max-w-[500px] max-lg:mx-auto">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-white/[0.03] border border-white/10 p-[40px] max-sm:p-[28px] flex flex-col gap-[20px] hover:border-orange-500/30 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="text-orange-500">{service.icon}</div>
              <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[22px] leading-[30px] text-white">
                {service.title}
              </h3>
              <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white/60">
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-[48px] flex justify-center">
          <Button as="link" href={`/${locale}/saradnja`} variant="outline">
            {t("subtitle")}
          </Button>
        </div>
      </div>
    </section>
  );
}
