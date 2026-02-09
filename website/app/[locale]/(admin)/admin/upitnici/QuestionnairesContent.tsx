"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { mockQuestionnaires } from "@/lib/admin/mock-data";

export default function QuestionnairesContent() {
  const t = useTranslations("Admin");
  const [questionnaires, setQuestionnaires] = useState(mockQuestionnaires);

  function handleToggleReviewed(id: string) {
    setQuestionnaires(
      questionnaires.map((q) => (q.id === id ? { ...q, isReviewed: !q.isReviewed } : q))
    );
  }

  const unreviewedCount = questionnaires.filter((q) => !q.isReviewed).length;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[8px]">
        {t("questionnairesTitle")}
      </h1>
      <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[32px]">
        {unreviewedCount} nepregledanih od {questionnaires.length} upitnika
      </p>

      <div className="bg-white/[0.03] border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_120px_140px_100px] max-lg:hidden gap-[16px] px-[20px] py-[12px] border-b border-white/10 bg-white/[0.02]">
          <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("client")}</span>
          <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("goal")}</span>
          <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("submittedAt")}</span>
          <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("status")}</span>
          <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("actions")}</span>
        </div>

        {questionnaires.map((q, i) => (
          <div
            key={q.id}
            className={`grid grid-cols-[1fr_1fr_120px_140px_100px] max-lg:grid-cols-1 gap-[16px] max-lg:gap-[8px] px-[20px] py-[14px] ${
              i < questionnaires.length - 1 ? "border-b border-white/5" : ""
            } ${!q.isReviewed ? "bg-white/[0.01]" : ""}`}
          >
            <div>
              <p className="font-[family-name:var(--font-roboto)] text-[14px] text-white">{q.clientName}</p>
              <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30">{q.clientEmail}</p>
            </div>
            <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/60 max-lg:pl-0">{q.goal}</span>
            <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40">{q.submittedAt}</span>
            <div>
              <span className={`inline-block font-[family-name:var(--font-roboto)] text-[12px] px-[8px] py-[2px] ${
                q.isReviewed ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
              }`}>
                {q.isReviewed ? t("reviewed") : t("notReviewed")}
              </span>
            </div>
            <div>
              <button
                onClick={() => handleToggleReviewed(q.id)}
                className="font-[family-name:var(--font-roboto)] text-[12px] text-orange-400 hover:text-orange-300 transition-colors"
              >
                {q.isReviewed ? t("notReviewed") : t("reviewed")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
