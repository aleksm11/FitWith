"use client";

import { useTranslations, useLocale } from "next-intl";
import SectionHeading from "@/components/shared/SectionHeading";
import Button from "@/components/shared/Button";

// Placeholder transformations — will be replaced with Supabase data
const placeholderTransformations = [
  { id: 1, beforeBg: "bg-white/[0.06]", afterBg: "bg-white/[0.1]", duration: "12 nedelja" },
  { id: 2, beforeBg: "bg-white/[0.06]", afterBg: "bg-white/[0.1]", duration: "8 nedelja" },
  { id: 3, beforeBg: "bg-white/[0.06]", afterBg: "bg-white/[0.1]", duration: "16 nedelja" },
];

export default function TransformationsPreview() {
  const t = useTranslations("Transformations");
  const locale = useLocale();

  return (
    <section className="py-[120px] max-sm:py-[80px] bg-[#111111]">
      <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-[64px] grid grid-cols-3 gap-[24px] max-lg:grid-cols-2 max-sm:grid-cols-1">
          {placeholderTransformations.map((item) => (
            <div
              key={item.id}
              className="bg-white/[0.03] border border-white/10 overflow-hidden group hover:border-orange-500/20 transition-all duration-300"
            >
              {/* Before/After placeholder */}
              <div className="relative h-[300px] max-sm:h-[240px] flex">
                <div className={`w-1/2 ${item.beforeBg} flex items-center justify-center`}>
                  <span className="text-white/20 text-[14px] font-[family-name:var(--font-roboto)]">
                    BEFORE
                  </span>
                </div>
                <div className="w-[1px] bg-orange-500/40" />
                <div className={`w-1/2 ${item.afterBg} flex items-center justify-center`}>
                  <span className="text-white/20 text-[14px] font-[family-name:var(--font-roboto)]">
                    AFTER
                  </span>
                </div>
              </div>
              <div className="p-[20px]">
                <p className="font-[family-name:var(--font-roboto)] text-[14px] text-white/50">
                  {t("duration")}: <span className="text-orange-500">{item.duration}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[48px] flex justify-center">
          <Button as="link" href={`/${locale}/transformacije`} variant="outline">
            {t("viewAll")}
          </Button>
        </div>
      </div>
    </section>
  );
}
