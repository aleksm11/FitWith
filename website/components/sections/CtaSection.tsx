"use client";

import { useTranslations, useLocale } from "next-intl";
import Button from "@/components/shared/Button";

export default function CtaSection() {
  const t = useTranslations("Cta");
  const locale = useLocale();

  return (
    <section className="relative py-[120px] max-sm:py-[80px] bg-[#0A0A0A] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px]" />

      <div className="relative max-w-[800px] mx-auto px-[40px] max-sm:px-[20px] text-center">
        <h2 className="font-[family-name:var(--font-sora)] font-bold text-[48px] leading-[56px] max-lg:text-[36px] max-lg:leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white">
          {t("title")}
        </h2>
        <p className="mt-[20px] font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] max-sm:text-[16px] max-sm:leading-[26px] text-white/60">
          {t("subtitle")}
        </p>
        <div className="mt-[40px]">
          <Button as="link" href={`/${locale}/kontakt`} size="lg">
            {t("button")}
          </Button>
        </div>
      </div>
    </section>
  );
}
