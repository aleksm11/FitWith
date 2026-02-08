"use client";

import { useTranslations, useLocale } from "next-intl";
import SectionHeading from "@/components/shared/SectionHeading";
import PricingCard from "@/components/shared/PricingCard";

export default function PricingPreview() {
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

  return (
    <section className="py-[120px] max-sm:py-[80px] bg-[#0A0A0A]">
      <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-[64px] grid grid-cols-3 gap-[24px] max-lg:grid-cols-1 items-start justify-items-center">
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
  );
}
