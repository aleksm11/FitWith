"use client";

import { useTranslations } from "next-intl";

export default function AdminContent() {
  const t = useTranslations("Admin");

  return (
    <div>
      <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[16px]">
        {t("title")}
      </h1>
      <div className="bg-white/[0.03] border border-white/10 p-[40px] max-sm:p-[24px] mt-[24px]">
        <div className="flex items-start gap-[16px]">
          <svg
            className="w-8 h-8 text-orange-500 shrink-0 mt-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/60 leading-[26px]">
            {t("welcomeText")}
          </p>
        </div>
      </div>
    </div>
  );
}
