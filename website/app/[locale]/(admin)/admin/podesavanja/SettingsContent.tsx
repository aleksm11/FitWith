"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getSiteSettings, updateSiteSetting } from "@/lib/supabase/queries";
import type { SiteSetting } from "@/lib/supabase/types";

const SETTING_KEYS = [
  { key: "site_title", label: "Naziv sajta" },
  { key: "site_description", label: "Opis sajta (SEO)" },
  { key: "coach_bio", label: "Bio trenera" },
  { key: "coach_phone", label: "Telefon" },
  { key: "coach_email", label: "Email" },
  { key: "instagram_url", label: "Instagram URL" },
  { key: "facebook_url", label: "Facebook URL" },
  { key: "youtube_url", label: "YouTube URL" },
  { key: "tiktok_url", label: "TikTok URL" },
];

export default function SettingsContent() {
  const t = useTranslations("Admin");
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<
    Record<string, { value_sr: string; value_en: string; value_ru: string }>
  >({});

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        setSettings(data);
        const values: Record<string, { value_sr: string; value_en: string; value_ru: string }> = {};
        for (const s of data) {
          values[s.key] = {
            value_sr: s.value_sr || "",
            value_en: s.value_en || "",
            value_ru: s.value_ru || "",
          };
        }
        // Add empty entries for keys not yet in DB
        for (const item of SETTING_KEYS) {
          if (!values[item.key]) {
            values[item.key] = { value_sr: "", value_en: "", value_ru: "" };
          }
        }
        setEditValues(values);
      })
      .catch(() => {
        // Initialize with empty values on error
        const values: Record<string, { value_sr: string; value_en: string; value_ru: string }> = {};
        for (const item of SETTING_KEYS) {
          values[item.key] = { value_sr: "", value_en: "", value_ru: "" };
        }
        setEditValues(values);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(key: string) {
    const values = editValues[key];
    if (!values) return;
    setSaving(key);
    try {
      await updateSiteSetting(key, values);
      // Update local settings list
      setSettings((prev) => {
        const existing = prev.find((s) => s.key === key);
        if (existing) {
          return prev.map((s) =>
            s.key === key ? { ...s, ...values } : s
          );
        }
        return [...prev, { id: key, key, ...values, updated_at: new Date().toISOString() }];
      });
    } catch {
      // silent fail — settings may not have RLS policy yet
    } finally {
      setSaving(null);
    }
  }

  function handleChange(key: string, locale: "sr" | "en" | "ru", value: string) {
    setEditValues((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [`value_${locale}`]: value,
      },
    }));
  }

  const isDirty = (key: string) => {
    const existing = settings.find((s) => s.key === key);
    const current = editValues[key];
    if (!current) return false;
    if (!existing) return current.value_sr !== "" || current.value_en !== "" || current.value_ru !== "";
    return (
      (existing.value_sr || "") !== current.value_sr ||
      (existing.value_en || "") !== current.value_en ||
      (existing.value_ru || "") !== current.value_ru
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[8px]">
        {t("settingsTitle")}
      </h1>
      <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[40px]">
        Upravljajte podešavanjima sajta i društvenim mrežama.
      </p>

      <div className="space-y-[32px]">
        {SETTING_KEYS.map((item) => {
          const values = editValues[item.key];
          if (!values) return null;
          const isSocialOrContact = item.key.includes("_url") || item.key === "coach_phone" || item.key === "coach_email";

          return (
            <div
              key={item.key}
              className="bg-white/[0.03] border border-white/10 p-[24px]"
            >
              <div className="flex items-center justify-between mb-[16px]">
                <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[16px] text-white">
                  {item.label}
                </h3>
                <button
                  onClick={() => handleSave(item.key)}
                  disabled={saving === item.key || !isDirty(item.key)}
                  className={`px-[16px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] transition-colors cursor-pointer ${
                    isDirty(item.key)
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-white/5 text-white/30 cursor-not-allowed"
                  }`}
                >
                  {saving === item.key ? "..." : t("save")}
                </button>
              </div>

              {isSocialOrContact ? (
                <input
                  type="text"
                  value={values.value_sr}
                  onChange={(e) => {
                    handleChange(item.key, "sr", e.target.value);
                    handleChange(item.key, "en", e.target.value);
                    handleChange(item.key, "ru", e.target.value);
                  }}
                  placeholder={item.label}
                  className="w-full bg-white/[0.05] border border-white/10 px-[16px] py-[12px] text-white font-[family-name:var(--font-roboto)] text-[14px] placeholder:text-white/20 focus:border-orange-500/50 focus:outline-none transition-colors"
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px]">
                  {(["sr", "en", "ru"] as const).map((loc) => (
                    <div key={loc}>
                      <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/30 uppercase tracking-[0.5px] mb-[6px]">
                        {loc.toUpperCase()}
                      </label>
                      {item.key.includes("bio") || item.key.includes("description") ? (
                        <textarea
                          value={values[`value_${loc}`]}
                          onChange={(e) => handleChange(item.key, loc, e.target.value)}
                          rows={3}
                          className="w-full bg-white/[0.05] border border-white/10 px-[16px] py-[12px] text-white font-[family-name:var(--font-roboto)] text-[14px] placeholder:text-white/20 focus:border-orange-500/50 focus:outline-none transition-colors resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={values[`value_${loc}`]}
                          onChange={(e) => handleChange(item.key, loc, e.target.value)}
                          className="w-full bg-white/[0.05] border border-white/10 px-[16px] py-[12px] text-white font-[family-name:var(--font-roboto)] text-[14px] placeholder:text-white/20 focus:border-orange-500/50 focus:outline-none transition-colors"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
