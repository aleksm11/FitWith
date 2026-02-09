"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { mockProfile } from "@/lib/portal/mock-data";

export default function ProfileContent() {
  const t = useTranslations("Portal");

  const [fullName, setFullName] = useState(mockProfile.fullName);
  const [email, setEmail] = useState(mockProfile.email);
  const [phone, setPhone] = useState(mockProfile.phone);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Mock save — simulate network delay
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[8px]">
        {t("profile")}
      </h1>
      <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[32px]">
        {t("profileSubtitle")}
      </p>

      <div className="grid grid-cols-[1fr_320px] gap-[32px] max-lg:grid-cols-1">
        {/* Edit form */}
        <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px]">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white mb-[24px]">
            {t("personalInfo")}
          </h2>

          <form onSubmit={handleSave} className="space-y-[20px]">
            {/* Name */}
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[13px] text-white/50 mb-[6px]">
                {t("nameLabel")}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 px-[16px] py-[12px] font-[family-name:var(--font-roboto)] text-[15px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[13px] text-white/50 mb-[6px]">
                {t("emailLabel")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 px-[16px] py-[12px] font-[family-name:var(--font-roboto)] text-[15px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[13px] text-white/50 mb-[6px]">
                {t("phoneLabel")}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 px-[16px] py-[12px] font-[family-name:var(--font-roboto)] text-[15px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Save button */}
            <div className="pt-[8px]">
              <button
                type="submit"
                disabled={saving}
                className="bg-orange-500 text-white font-[family-name:var(--font-sora)] font-semibold text-[15px] px-[32px] py-[14px] hover:bg-orange-400 active:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? t("saving") : t("saveChanges")}
              </button>

              {saved && (
                <span className="ml-[16px] font-[family-name:var(--font-roboto)] text-[14px] text-green-400">
                  {t("savedSuccess")}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Subscription info sidebar */}
        <div className="space-y-[16px]">
          {/* Subscription card */}
          <div className="bg-white/[0.03] border border-white/10 p-[24px]">
            <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[16px] text-white mb-[16px]">
              {t("subscriptionLabel")}
            </h3>

            <div className="space-y-[12px]">
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">
                  {t("planLabel")}
                </span>
                <span className="font-[family-name:var(--font-sora)] font-semibold text-[14px] text-white">
                  {t(`tier_${mockProfile.subscriptionTier}`)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">
                  {t("statusLabel")}
                </span>
                <span className={`font-[family-name:var(--font-roboto)] text-[13px] px-[10px] py-[3px] ${
                  mockProfile.subscriptionActive
                    ? "text-green-400 bg-green-400/10"
                    : "text-red-400 bg-red-400/10"
                }`}>
                  {mockProfile.subscriptionActive ? t("active") : t("inactive")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">
                  {t("memberSince")}
                </span>
                <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/70">
                  {new Date(mockProfile.memberSince).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription features */}
          <div className="bg-orange-500/5 border border-orange-500/20 p-[24px]">
            <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[14px] text-orange-400 mb-[12px]">
              {t("yourPlanIncludes")}
            </h3>
            <ul className="space-y-[8px]">
              {(t.raw("mentoringFeatures") as string[]).map((feature, i) => (
                <li key={i} className="flex items-start gap-[8px]">
                  <svg
                    className="w-4 h-4 text-orange-500 shrink-0 mt-[3px]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/60">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
