"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  getClientProfile,
  updateUserPlanType,
  updateUserTier,
  updateUserSubscription,
  getClientTrainingPlans,
  getClientNutritionPlans,
} from "@/lib/supabase/queries";
import type { Profile, TrainingPlan, TrainingDay, TrainingExercise, Exercise, NutritionPlan, NutritionPlanMeal } from "@/lib/supabase/types";
import WorkoutPlanEditor from "@/components/portal/WorkoutPlanEditor";
import NutritionPlanEditor from "@/components/portal/NutritionPlanEditor";

type TrainingPlanWithDetails = TrainingPlan & {
  training_days: (TrainingDay & {
    training_exercises: (TrainingExercise & { exercises: Exercise | null })[];
  })[];
};

type NutritionPlanWithMeals = NutritionPlan & {
  nutrition_plan_meals: NutritionPlanMeal[];
};

type Tab = "profile" | "training" | "nutrition";

export default function ClientDetailContent({ clientId }: { clientId: string }) {
  const t = useTranslations("Portal");
  const locale = useLocale();

  const [client, setClient] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [planType, setPlanType] = useState("none");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Training data
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlanWithDetails[]>([]);
  const [loadingTraining, setLoadingTraining] = useState(false);

  // Nutrition data
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlanWithMeals[]>([]);
  const [loadingNutrition, setLoadingNutrition] = useState(false);

  // Subscription editing
  const [tier, setTier] = useState("none");
  const [endDate, setEndDate] = useState("");
  const [planFeatures, setPlanFeatures] = useState("");

  useEffect(() => {
    getClientProfile(clientId)
      .then((data) => {
        if (data) {
          setClient(data);
          setPlanType(data.plan_type);
          setTier(data.subscription_tier);
          setEndDate(data.subscription_end_date || "");
          setPlanFeatures((data.plan_features || []).join("\n"));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [clientId]);

  function loadTraining() {
    setLoadingTraining(true);
    getClientTrainingPlans(clientId)
      .then(setTrainingPlans)
      .catch(() => {})
      .finally(() => setLoadingTraining(false));
  }

  function loadNutrition() {
    setLoadingNutrition(true);
    getClientNutritionPlans(clientId)
      .then(setNutritionPlans)
      .catch(() => {})
      .finally(() => setLoadingNutrition(false));
  }

  useEffect(() => {
    if (activeTab === "training" && trainingPlans.length === 0) loadTraining();
    if (activeTab === "nutrition" && nutritionPlans.length === 0) loadNutrition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, clientId]);

  async function handleSavePlanType() {
    setSaving(true);
    try {
      await updateUserPlanType(clientId, planType);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveSubscription() {
    setSaving(true);
    try {
      await updateUserTier(clientId, tier, !!endDate && new Date(endDate) >= new Date());
      await updateUserSubscription(
        clientId,
        endDate || null,
        planFeatures.split("\n").filter(Boolean)
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-[80px]">
        <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50">
          {t("clientNotFound")}
        </p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: t("profile") },
    { key: "training", label: t("training") },
    { key: "nutrition", label: t("nutrition") },
  ];

  return (
    <div>
      {/* Back link + header */}
      <Link
        href={`/${locale}/portal/klijenti`}
        className="inline-flex items-center gap-[6px] font-[family-name:var(--font-roboto)] text-[13px] text-white/40 hover:text-white transition-colors mb-[20px]"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        {t("backToClients")}
      </Link>

      {/* Client header */}
      <div className="flex items-center gap-[16px] mb-[32px]">
        <div className="w-[48px] h-[48px] bg-orange-500/10 flex items-center justify-center shrink-0">
          <span className="font-[family-name:var(--font-sora)] font-bold text-[18px] text-orange-500">
            {(client.full_name || client.email || "?")[0].toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-sora)] font-bold text-[28px] leading-[36px] text-white">
            {client.full_name || client.email}
          </h1>
          <p className="font-[family-name:var(--font-roboto)] text-[14px] text-orange-400">
            {t("viewingClient")}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-[4px] mb-[32px]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`font-[family-name:var(--font-roboto)] text-[13px] px-[20px] py-[10px] transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-orange-500 text-white"
                : "bg-white/[0.03] border border-white/10 text-white/50 hover:border-white/20 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-[1fr_320px] gap-[32px] max-lg:grid-cols-1">
          {/* Client info */}
          <div className="space-y-[24px]">
            <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px]">
              <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white mb-[24px]">
                {t("clientInfo")}
              </h2>
              <div className="space-y-[16px]">
                <div className="flex items-center justify-between py-[8px] border-b border-white/5">
                  <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">{t("nameLabel")}</span>
                  <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white">{client.full_name || "—"}</span>
                </div>
                <div className="flex items-center justify-between py-[8px] border-b border-white/5">
                  <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">{t("emailLabel")}</span>
                  <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white">{client.email || "—"}</span>
                </div>
                <div className="flex items-center justify-between py-[8px] border-b border-white/5">
                  <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">{t("phoneLabel")}</span>
                  <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white">{client.phone || "—"}</span>
                </div>
                <div className="flex items-center justify-between py-[8px]">
                  <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">{t("memberSince")}</span>
                  <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white">
                    {new Date(client.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Plan type assignment */}
            <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px]">
              <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white mb-[24px]">
                {t("assignPlanType")}
              </h2>
              <div className="space-y-[16px]">
                <div className="grid grid-cols-2 gap-[8px] max-sm:grid-cols-1">
                  {(["none", "workout", "nutrition", "both"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setPlanType(type)}
                      className={`font-[family-name:var(--font-roboto)] text-[14px] px-[16px] py-[14px] border transition-all cursor-pointer text-left ${
                        planType === type
                          ? "bg-orange-500/10 border-orange-500/50 text-orange-400"
                          : "bg-white/[0.02] border-white/10 text-white/50 hover:border-white/20"
                      }`}
                    >
                      {t(`planType_${type}`)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSavePlanType}
                  disabled={saving}
                  className="bg-orange-500 text-white font-[family-name:var(--font-sora)] font-semibold text-[14px] px-[24px] py-[12px] hover:bg-orange-400 active:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? t("saving") : t("savePlanType")}
                </button>
                {saved && (
                  <span className="ml-[12px] font-[family-name:var(--font-roboto)] text-[13px] text-green-400">
                    {t("savedSuccess")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Subscription sidebar */}
          <div className="space-y-[16px]">
            <div className="bg-white/[0.03] border border-white/10 p-[24px]">
              <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[16px] text-white mb-[16px]">
                {t("subscriptionLabel")}
              </h3>
              <div className="space-y-[16px]">
                <div>
                  <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[6px]">
                    {t("planLabel")}
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[10px] font-[family-name:var(--font-roboto)] text-[13px] text-white focus:border-orange-500/50 focus:outline-none cursor-pointer"
                  >
                    <option value="none" className="bg-[#1a1a1a]">{t("tier_none")}</option>
                    <option value="mentoring" className="bg-[#1a1a1a]">{t("tier_mentoring")}</option>
                    <option value="training" className="bg-[#1a1a1a]">{t("tier_training")}</option>
                    <option value="nutrition" className="bg-[#1a1a1a]">{t("tier_nutrition")}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[6px]">
                    {t("subscriptionValidUntil")}
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[10px] font-[family-name:var(--font-roboto)] text-[13px] text-white focus:border-orange-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[6px]">
                    {t("planFeaturesLabel")}
                  </label>
                  <textarea
                    value={planFeatures}
                    onChange={(e) => setPlanFeatures(e.target.value)}
                    rows={4}
                    placeholder={t("planFeaturesPlaceholder")}
                    className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[10px] font-[family-name:var(--font-roboto)] text-[13px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none resize-none"
                  />
                </div>
                <button
                  onClick={handleSaveSubscription}
                  disabled={saving}
                  className="w-full bg-orange-500 text-white font-[family-name:var(--font-sora)] font-semibold text-[13px] px-[16px] py-[12px] hover:bg-orange-400 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? t("saving") : t("saveSubscription")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "training" && (
        <div>
          {loadingTraining ? (
            <div className="flex items-center justify-center py-[60px]">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <WorkoutPlanEditor
              clientId={clientId}
              plans={trainingPlans}
              onRefresh={loadTraining}
            />
          )}
        </div>
      )}

      {activeTab === "nutrition" && (
        <div>
          {loadingNutrition ? (
            <div className="flex items-center justify-center py-[60px]">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <NutritionPlanEditor
              clientId={clientId}
              plans={nutritionPlans}
              onRefresh={loadNutrition}
            />
          )}
        </div>
      )}
    </div>
  );
}
