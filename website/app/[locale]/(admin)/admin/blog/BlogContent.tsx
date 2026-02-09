"use client";

import { useTranslations } from "next-intl";

export default function BlogContent() {
  const t = useTranslations("Admin");

  return (
    <div>
      <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[32px]">
        {t("blog")}
      </h1>
      <div className="bg-white/[0.03] border border-white/10 p-[40px] max-sm:p-[24px]">
        <div className="flex flex-col items-center justify-center gap-[16px] py-[24px]">
          <svg className="w-12 h-12 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
          </svg>
          <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/40 text-center">
            {t("blogComingSoon")}
          </p>
        </div>
      </div>
    </div>
  );
}
