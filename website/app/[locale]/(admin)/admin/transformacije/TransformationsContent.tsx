"use client";

import { useTranslations } from "next-intl";

export default function TransformationsContent() {
  const t = useTranslations("Admin");

  return (
    <div>
      <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[32px]">
        {t("transformations")}
      </h1>
      <div className="bg-white/[0.03] border border-white/10 p-[40px] max-sm:p-[24px]">
        <div className="flex flex-col items-center justify-center gap-[16px] py-[24px]">
          <svg className="w-12 h-12 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
          <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/40 text-center">
            {t("transformationsComingSoon")}
          </p>
        </div>
      </div>
    </div>
  );
}
