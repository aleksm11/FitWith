"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  createNutritionPlan,
  updateNutritionPlan,
  deleteNutritionPlan,
  createNutritionPlanMeal,
  updateNutritionPlanMeal,
  deleteNutritionPlanMeal,
  getPlanTemplates,
  getPlanTemplate,
} from "@/lib/supabase/queries";
import type { NutritionPlan, NutritionPlanMeal, PlanTemplate } from "@/lib/supabase/types";

type NutritionPlanWithMeals = NutritionPlan & {
  nutrition_plan_meals: NutritionPlanMeal[];
};

type Props = {
  clientId: string;
  plans: NutritionPlanWithMeals[];
  onRefresh: () => void;
};

export default function NutritionPlanEditor({ clientId, plans, onRefresh }: Props) {
  const t = useTranslations("Portal");

  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<PlanTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  useEffect(() => {
    if (creating) {
      getPlanTemplates("nutrition").then(setTemplates).catch(() => {});
    }
  }, [creating]);

  const [newPlan, setNewPlan] = useState({
    name: "",
    daily_calories: 2000,
    protein_g: 150,
    carbs_g: 250,
    fats_g: 70,
  });

  // Edit macros state
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editMacros, setEditMacros] = useState({ daily_calories: 0, protein_g: 0, carbs_g: 0, fats_g: 0 });

  // Add meal state
  const [addingMealToPlan, setAddingMealToPlan] = useState<string | null>(null);
  const [newMeal, setNewMeal] = useState({ name: "", calories: 0, protein_g: 0, carbs_g: 0, fats_g: 0, time_suggestion: "" });

  async function handleCreatePlan() {
    if (!newPlan.name.trim()) return;
    setSaving(true);
    try {
      const plan = await createNutritionPlan({
        client_id: clientId,
        name: newPlan.name,
        daily_calories: newPlan.daily_calories,
        protein_g: newPlan.protein_g,
        carbs_g: newPlan.carbs_g,
        fats_g: newPlan.fats_g,
      });

      // If template selected, populate meals from template data
      if (selectedTemplateId && plan?.id) {
        const template = await getPlanTemplate(selectedTemplateId);
        const data = template?.data as { meals?: { name: string; time_suggestion?: string; foods?: { name: string; amount: string }[] }[] } | null;
        if (data?.meals) {
          for (let mi = 0; mi < data.meals.length; mi++) {
            const mealData = data.meals[mi];
            await createNutritionPlanMeal({
              plan_id: plan.id,
              meal_number: mi + 1,
              name: mealData.name,
              time_suggestion: mealData.time_suggestion || undefined,
              sort_order: mi + 1,
            });
          }
        }
      }

      setCreating(false);
      setSelectedTemplateId("");
      setNewPlan({ name: "", daily_calories: 2000, protein_g: 150, carbs_g: 250, fats_g: 70 });
      onRefresh();
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePlan(planId: string) {
    try {
      await deleteNutritionPlan(planId);
      onRefresh();
    } catch {
      // silent
    }
  }

  function startEditMacros(plan: NutritionPlanWithMeals) {
    setEditingPlanId(plan.id);
    setEditMacros({
      daily_calories: plan.daily_calories || 0,
      protein_g: plan.protein_g || 0,
      carbs_g: plan.carbs_g || 0,
      fats_g: plan.fats_g || 0,
    });
  }

  async function handleSaveMacros(planId: string) {
    try {
      await updateNutritionPlan(planId, editMacros as Partial<NutritionPlan>);
      setEditingPlanId(null);
      onRefresh();
    } catch {
      // silent
    }
  }

  async function handleAddMeal(planId: string) {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;
    const mealNumber = plan.nutrition_plan_meals.length + 1;
    try {
      await createNutritionPlanMeal({
        plan_id: planId,
        meal_number: mealNumber,
        name: newMeal.name || `Obrok ${mealNumber}`,
        time_suggestion: newMeal.time_suggestion || undefined,
        calories: newMeal.calories || undefined,
        protein_g: newMeal.protein_g || undefined,
        carbs_g: newMeal.carbs_g || undefined,
        fats_g: newMeal.fats_g || undefined,
        sort_order: mealNumber,
      });
      setAddingMealToPlan(null);
      setNewMeal({ name: "", calories: 0, protein_g: 0, carbs_g: 0, fats_g: 0, time_suggestion: "" });
      onRefresh();
    } catch {
      // silent
    }
  }

  async function handleUpdateMeal(id: string, updates: Partial<NutritionPlanMeal>) {
    try {
      await updateNutritionPlanMeal(id, updates);
      onRefresh();
    } catch {
      // silent
    }
  }

  async function handleDeleteMeal(id: string) {
    try {
      await deleteNutritionPlanMeal(id);
      onRefresh();
    } catch {
      // silent
    }
  }

  return (
    <div className="space-y-[24px]">
      {/* Create new plan */}
      {creating ? (
        <div className="bg-white/[0.03] border border-orange-500/30 p-[24px] space-y-[16px]">
          {templates.length > 0 && (
            <select
              value={selectedTemplateId}
              onChange={(e) => {
                setSelectedTemplateId(e.target.value);
                const tpl = templates.find((t) => t.id === e.target.value);
                if (tpl) {
                  const data = tpl.data as Record<string, number>;
                  setNewPlan({
                    ...newPlan,
                    name: newPlan.name || tpl.name,
                    daily_calories: data?.daily_calories || newPlan.daily_calories,
                    protein_g: data?.protein_g || newPlan.protein_g,
                    carbs_g: data?.carbs_g || newPlan.carbs_g,
                    fats_g: data?.fats_g || newPlan.fats_g,
                  });
                }
              }}
              className="w-full bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white/70 focus:border-orange-500/50 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#1a1a1a]">{t("templates")}...</option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id} className="bg-[#1a1a1a]">{tpl.name}</option>
              ))}
            </select>
          )}
          <input
            type="text"
            value={newPlan.name}
            onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
            placeholder={t("newPlanName")}
            className="w-full bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none"
          />
          <div className="grid grid-cols-4 gap-[12px]">
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 mb-[4px]">kcal</label>
              <input type="number" value={newPlan.daily_calories} onChange={(e) => setNewPlan({ ...newPlan, daily_calories: parseInt(e.target.value) || 0 })}
                className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white text-center focus:border-orange-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 mb-[4px]">{t("protein")}</label>
              <input type="number" value={newPlan.protein_g} onChange={(e) => setNewPlan({ ...newPlan, protein_g: parseInt(e.target.value) || 0 })}
                className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white text-center focus:border-orange-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[9px] uppercase tracking-[1px] text-orange-500 mb-[4px] leading-tight">{t("carbs")}</label>
              <input type="number" value={newPlan.carbs_g} onChange={(e) => setNewPlan({ ...newPlan, carbs_g: parseInt(e.target.value) || 0 })}
                className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white text-center focus:border-orange-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 mb-[4px]">{t("fat")}</label>
              <input type="number" value={newPlan.fats_g} onChange={(e) => setNewPlan({ ...newPlan, fats_g: parseInt(e.target.value) || 0 })}
                className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white text-center focus:border-orange-500/50 focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-[8px]">
            <button onClick={handleCreatePlan} disabled={saving}
              className="bg-orange-500 text-white font-[family-name:var(--font-sora)] font-semibold text-[13px] px-[20px] py-[10px] hover:bg-orange-400 transition-colors cursor-pointer disabled:opacity-50">
              {t("create")}
            </button>
            <button onClick={() => setCreating(false)}
              className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40 hover:text-white cursor-pointer px-[12px] py-[10px]">
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setCreating(true)}
          className="flex items-center gap-[8px] font-[family-name:var(--font-roboto)] text-[14px] text-orange-400 hover:text-orange-300 transition-colors cursor-pointer">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {t("createNutritionPlan")}
        </button>
      )}

      {/* Existing plans */}
      {plans.map((plan) => (
        <div key={plan.id} className="bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between p-[24px] border-b border-white/10">
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
            <div className="flex items-center gap-[12px]">
              <button onClick={() => startEditMacros(plan)}
                className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 hover:text-orange-400 transition-colors cursor-pointer">
                {t("editMacros")}
              </button>
              <button onClick={() => handleDeletePlan(plan.id)}
                className="font-[family-name:var(--font-roboto)] text-[12px] text-red-400/60 hover:text-red-400 hover:bg-red-400/10 border border-red-400/20 hover:border-red-400/40 px-[12px] py-[6px] transition-colors cursor-pointer">
                {t("deleteTemplate")}
              </button>
            </div>
          </div>

          {/* Macros display/edit */}
          <div className="px-[24px] py-[16px] border-b border-white/5">
            {editingPlanId === plan.id ? (
              <div className="space-y-[12px]">
                <div className="grid grid-cols-4 gap-[12px]">
                  <div>
                    <label className="block font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 mb-[4px]">kcal</label>
                    <input type="number" value={editMacros.daily_calories} onChange={(e) => setEditMacros({ ...editMacros, daily_calories: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white text-center focus:border-orange-500/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 mb-[4px]">{t("protein")}</label>
                    <input type="number" value={editMacros.protein_g} onChange={(e) => setEditMacros({ ...editMacros, protein_g: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white text-center focus:border-orange-500/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-roboto)] text-[9px] uppercase tracking-[1px] text-orange-500 mb-[4px] leading-tight">{t("carbs")}</label>
                    <input type="number" value={editMacros.carbs_g} onChange={(e) => setEditMacros({ ...editMacros, carbs_g: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white text-center focus:border-orange-500/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 mb-[4px]">{t("fat")}</label>
                    <input type="number" value={editMacros.fats_g} onChange={(e) => setEditMacros({ ...editMacros, fats_g: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white text-center focus:border-orange-500/50 focus:outline-none" />
                  </div>
                </div>
                <div className="flex gap-[8px]">
                  <button onClick={() => handleSaveMacros(plan.id)}
                    className="bg-orange-500 text-white font-[family-name:var(--font-sora)] font-semibold text-[12px] px-[16px] py-[8px] hover:bg-orange-400 transition-colors cursor-pointer">
                    {t("save")}
                  </button>
                  <button onClick={() => setEditingPlanId(null)}
                    className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 hover:text-white cursor-pointer px-[12px]">
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-[24px]">
                <span className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-orange-500">{plan.daily_calories || 0} <span className="text-[13px] text-white/40 font-normal">kcal</span></span>
                <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">P: {plan.protein_g || 0}g</span>
                <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">C: {plan.carbs_g || 0}g</span>
                <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">F: {plan.fats_g || 0}g</span>
              </div>
            )}
          </div>

          {/* Meals */}
          {plan.nutrition_plan_meals
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((meal) => (
              <div key={meal.id} className="flex items-center gap-[8px] px-[24px] py-[12px] border-b border-white/5 last:border-0">
                <input
                  type="text"
                  defaultValue={meal.name || ""}
                  onBlur={(e) => handleUpdateMeal(meal.id, { name: e.target.value } as Partial<NutritionPlanMeal>)}
                  className="flex-1 bg-transparent border border-transparent hover:border-white/10 focus:border-orange-500/50 px-[8px] py-[4px] font-[family-name:var(--font-roboto)] text-[13px] text-white/70 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  defaultValue={meal.time_suggestion || ""}
                  onBlur={(e) => handleUpdateMeal(meal.id, { time_suggestion: e.target.value } as Partial<NutritionPlanMeal>)}
                  placeholder="00:00"
                  className="w-[70px] bg-transparent border border-transparent hover:border-white/10 focus:border-orange-500/50 px-[6px] py-[4px] font-[family-name:var(--font-roboto)] text-[12px] text-white/40 text-center focus:outline-none transition-colors"
                />
                <input
                  type="number"
                  defaultValue={meal.calories || 0}
                  onBlur={(e) => handleUpdateMeal(meal.id, { calories: parseInt(e.target.value) || 0 } as Partial<NutritionPlanMeal>)}
                  className="w-[70px] bg-transparent border border-white/10 px-[6px] py-[4px] font-[family-name:var(--font-roboto)] text-[12px] text-white/50 text-center focus:border-orange-500/50 focus:outline-none"
                />
                <span className="font-[family-name:var(--font-roboto)] text-[10px] text-white/20 w-[30px]">kcal</span>
                <button onClick={() => handleDeleteMeal(meal.id)}
                  className="text-white/20 hover:text-red-400 transition-colors cursor-pointer">
                  ×
                </button>
              </div>
            ))}

          {/* Add meal */}
          <div className="px-[24px] py-[12px]">
            {addingMealToPlan === plan.id ? (
              <div className="space-y-[8px]">
                <div className="grid grid-cols-[1fr_80px_80px] gap-[8px]">
                  <input type="text" value={newMeal.name} onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    placeholder={t("mealName")}
                    className="bg-white/[0.03] border border-white/10 px-[12px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none" />
                  <input type="text" value={newMeal.time_suggestion} onChange={(e) => setNewMeal({ ...newMeal, time_suggestion: e.target.value })}
                    placeholder="07:00"
                    className="bg-white/[0.03] border border-white/10 px-[12px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white placeholder-white/30 text-center focus:border-orange-500/50 focus:outline-none" />
                  <input type="number" value={newMeal.calories || ""} onChange={(e) => setNewMeal({ ...newMeal, calories: parseInt(e.target.value) || 0 })}
                    placeholder="kcal"
                    className="bg-white/[0.03] border border-white/10 px-[12px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white placeholder-white/30 text-center focus:border-orange-500/50 focus:outline-none" />
                </div>
                <div className="flex gap-[8px]">
                  <button onClick={() => handleAddMeal(plan.id)}
                    className="bg-orange-500 text-white font-[family-name:var(--font-sora)] font-semibold text-[12px] px-[16px] py-[8px] hover:bg-orange-400 transition-colors cursor-pointer">
                    {t("addMeal")}
                  </button>
                  <button onClick={() => { setAddingMealToPlan(null); setNewMeal({ name: "", calories: 0, protein_g: 0, carbs_g: 0, fats_g: 0, time_suggestion: "" }); }}
                    className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 hover:text-white cursor-pointer px-[12px]">
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingMealToPlan(plan.id)}
                className="flex items-center gap-[4px] font-[family-name:var(--font-roboto)] text-[12px] text-white/30 hover:text-orange-400 transition-colors cursor-pointer">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {t("addMeal")}
              </button>
            )}
          </div>
        </div>
      ))}

      {plans.length === 0 && !creating && (
        <div className="bg-white/[0.03] border border-white/10 p-[32px]">
          <div className="py-[48px] text-center">
            <svg className="w-16 h-16 text-white/10 mx-auto mb-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
            </svg>
            <p className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-white/50">
              {t("noNutritionPlans")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
