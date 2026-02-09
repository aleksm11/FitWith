"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Button from "@/components/shared/Button";
import PricingCard from "@/components/shared/PricingCard";
import SectionHeading from "@/components/shared/SectionHeading";

export default function ServicesContent() {
  const t = useTranslations("ServicesPage");
  const tPricing = useTranslations("Pricing");
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

  const plans = [
    {
      name: tPricing("plan1Name"),
      price: tPricing("plan1Price"),
      features: tPricing.raw("plan1Features") as string[],
      highlighted: false,
    },
    {
      name: tPricing("plan2Name"),
      price: tPricing("plan2Price"),
      features: tPricing.raw("plan2Features") as string[],
      highlighted: false,
    },
    {
      name: tPricing("plan3Name"),
      price: tPricing("plan3Price"),
      features: tPricing.raw("plan3Features") as string[],
      highlighted: true,
      badge: tPricing("plan3Badge"),
    },
  ];

  const faqs = [
    { q: tPricing("faq1Q"), a: tPricing("faq1A") },
    { q: tPricing("faq2Q"), a: tPricing("faq2A") },
    { q: tPricing("faq3Q"), a: tPricing("faq3A") },
    { q: tPricing("faq4Q"), a: tPricing("faq4A") },
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
                  <Button as="a" href="#cene" variant={tier.accent ? "primary" : "outline"}>
                    {tPricing("title")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Pricing Cards */}
      <section id="cene" className="py-[120px] max-sm:py-[80px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          <SectionHeading title={tPricing("title")} subtitle={tPricing("subtitle")} />

          <div className="mt-[64px] grid grid-cols-3 gap-[24px] max-lg:grid-cols-1 items-start justify-items-center">
            {plans.map((plan) => (
              <PricingCard
                key={plan.name}
                planName={plan.name}
                price={plan.price}
                period={tPricing("monthly")}
                features={plan.features}
                ctaText={tPricing("ctaText")}
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
          <SectionHeading title={tPricing("faqTitle")} />

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
