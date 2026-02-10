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
import { localizedField } from "@/lib/supabase/types";
import type { Profile, Locale, TrainingPlan, TrainingDay, TrainingExercise, Exercise, NutritionPlan, NutritionPlanMeal } from "@/lib/supabase/types";

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
  const locale = useLocale() as Locale;

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

  useEffect(() => {
    if (activeTab === "training" && trainingPlans.length === 0) {
      setLoadingTraining(true);
      getClientTrainingPlans(clientId)
        .then(setTrainingPlans)
        .catch(() => {})
        .finally(() => setLoadingTraining(false));
    }
    if (activeTab === "nutrition" && nutritionPlans.length === 0) {
      setLoadingNutrition(true);
      getClientNutritionPlans(clientId)
        .then(setNutritionPlans)
        .catch(() => {})
        .finally(() => setLoadingNutrition(false));
    }
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
          ) : trainingPlans.length === 0 ? (
            <div className="bg-white/[0.03] border border-white/10 p-[32px]">
              <div className="py-[48px] text-center">
                <svg className="w-16 h-16 text-white/10 mx-auto mb-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <p className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-white/50 mb-[8px]">
                  {t("noTrainingPlans")}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-[24px]">
              {trainingPlans.map((plan) => (
                <div key={plan.id} className="bg-white/[0.03] border border-white/10 p-[24px] max-sm:p-[16px]">
                  <div className="flex items-center justify-between mb-[16px]">
                    <div>
                      <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-white">
                        {plan.name}
                      </h3>
                      <span className={`inline-block font-[family-name:var(--font-roboto)] text-[11px] px-[8px] py-[2px] mt-[4px] ${
                        plan.is_active ? "text-green-400 bg-green-400/10" : "text-white/40 bg-white/5"
                      }`}>
                        {plan.is_active ? t("active") : t("inactive")}
                      </span>
                    </div>
                  </div>
                  {plan.training_days
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((day) => (
                      <div key={day.id} className="mb-[12px] last:mb-0">
                        <p className="font-[family-name:var(--font-roboto)] text-[13px] text-orange-400 mb-[6px]">
                          {localizedField(day as unknown as Record<string, unknown>, "day_name", locale) || `${t("dayLabel")} ${day.day_number}`}
                        </p>
                        {day.training_exercises.length > 0 ? (
                          <div className="space-y-[2px]">
                            {day.training_exercises
                              .sort((a, b) => a.sort_order - b.sort_order)
                              .map((ex) => (
                                <div key={ex.id} className="flex items-center justify-between py-[6px] border-b border-white/5">
                                  <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/70">
                                    {ex.exercises
                                      ? localizedField(ex.exercises as unknown as Record<string, unknown>, "name", locale)
                                      : ex.exercise_name || ""}
                                  </span>
                                  <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40">
                                    {ex.sets} x {ex.reps}
                                  </span>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30">{t("restDay")}</p>
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "nutrition" && (
        <div>
          {loadingNutrition ? (
            <div className="flex items-center justify-center py-[60px]">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : nutritionPlans.length === 0 ? (
            <div className="bg-white/[0.03] border border-white/10 p-[32px]">
              <div className="py-[48px] text-center">
                <svg className="w-16 h-16 text-white/10 mx-auto mb-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                </svg>
                <p className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-white/50 mb-[8px]">
                  {t("noNutritionPlans")}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-[24px]">
              {nutritionPlans.map((plan) => (
                <div key={plan.id} className="bg-white/[0.03] border border-white/10 p-[24px] max-sm:p-[16px]">
                  <div className="flex items-center justify-between mb-[16px]">
                    <div>
                      <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-white">
                        {plan.name}
                      </h3>
                      <span className={`inline-block font-[family-name:var(--font-roboto)] text-[11px] px-[8px] py-[2px] mt-[4px] ${
                        plan.status === "active" ? "text-green-400 bg-green-400/10" : "text-white/40 bg-white/5"
                      }`}>
                        {plan.status === "active" ? t("active") : plan.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-orange-500">
                        {plan.daily_calories || 0}
                      </span>
                      <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40 ml-[4px]">kcal</span>
                    </div>
                  </div>
                  <div className="flex gap-[24px] mb-[16px]">
                    <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">
                      P: {plan.protein_g || 0}g
                    </span>
                    <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">
                      C: {plan.carbs_g || 0}g
                    </span>
                    <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">
                      F: {plan.fats_g || 0}g
                    </span>
                  </div>
                  {plan.nutrition_plan_meals.length > 0 && (
                    <div className="space-y-[8px]">
                      {plan.nutrition_plan_meals
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((meal) => (
                          <div key={meal.id} className="flex items-center justify-between py-[6px] border-b border-white/5">
                            <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/70">
                              {meal.name || `Meal ${meal.meal_number}`}
                            </span>
                            <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40">
                              {meal.calories || 0} kcal
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
