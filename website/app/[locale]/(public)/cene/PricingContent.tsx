"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import PricingCard from "@/components/shared/PricingCard";
import SectionHeading from "@/components/shared/SectionHeading";

export default function PricingContent() {
  const t = useTranslations("Pricing");
  const locale = useLocale();

  const plans = [
    {
      name: t("plan1Name"),
      price: t("plan1Price"),
      features: t.raw("plan1Features") as string[],
      highlighted: false,
    },
    {
      name: t("plan2Name"),
      price: t("plan2Price"),
      features: t.raw("plan2Features") as string[],
      highlighted: false,
    },
    {
      name: t("plan3Name"),
      price: t("plan3Price"),
      features: t.raw("plan3Features") as string[],
      highlighted: true,
      badge: t("plan3Badge"),
    },
  ];

  const faqs = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

      {/* Pricing Cards */}
      <section className="pb-[120px] max-sm:pb-[80px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          <div className="grid grid-cols-3 gap-[24px] max-lg:grid-cols-1 items-start justify-items-center">
            {plans.map((plan) => (
              <PricingCard
                key={plan.name}
                planName={plan.name}
                price={plan.price}
                period={t("monthly")}
                features={plan.features}
                ctaText={t("ctaText")}
                ctaHref={`/${locale}/kontakt`}
                highlighted={plan.highlighted}
                badge={plan.badge}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-[120px] max-sm:py-[80px] bg-[#111111]">
        <div className="max-w-[800px] mx-auto px-[40px] max-sm:px-[20px]">
          <SectionHeading title={t("faqTitle")} />

          <div className="mt-[48px] flex flex-col gap-[16px]">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/[0.03] border border-white/10"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-[24px] max-sm:p-[20px] cursor-pointer text-left"
                >
                  <span className="font-[family-name:var(--font-sora)] font-semibold text-[17px] leading-[26px] text-white pr-4">
                    {faq.q}
                  </span>
                  <svg
                    className={`w-5 h-5 shrink-0 text-orange-500 transition-transform duration-200 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? "max-h-[300px]" : "max-h-0"
                  }`}
                >
                  <p className="px-[24px] pb-[24px] max-sm:px-[20px] max-sm:pb-[20px] font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white/60">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
