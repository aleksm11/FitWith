"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  getPlanTemplates,
  createPlanTemplate,
  updatePlanTemplate,
  deletePlanTemplate,
  getMyProfile,
  searchExercises,
} from "@/lib/supabase/queries";
import { localizedField } from "@/lib/supabase/types";
import type { PlanTemplate, Locale } from "@/lib/supabase/types";

// Template data types
type TemplateExercise = {
  exercise_id: string | null;
  name: string;
  slug: string;
  sets: number;
  reps: string;
  rest_seconds: number;
};

type TemplateDay = {
  name: string;
  exercises: TemplateExercise[];
};

type TemplateFood = {
  name: string;
  amount: string;
};

type TemplateMeal = {
  name: string;
  time_suggestion: string;
  foods: TemplateFood[];
};

type WorkoutTemplateData = {
  days: TemplateDay[];
};

type NutritionTemplateData = {
  daily_calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  meals: TemplateMeal[];
};

type FormData = {
  name: string;
  type: "workout" | "nutrition";
  description: string;
  duration_weeks: number;
  difficulty: string;
  goal: string;
  workoutData: WorkoutTemplateData;
  nutritionData: NutritionTemplateData;
};

const emptyWorkoutData: WorkoutTemplateData = { days: [] };
const emptyNutritionData: NutritionTemplateData = {
  daily_calories: 2000,
  protein_g: 150,
  carbs_g: 250,
  fats_g: 70,
  meals: [],
};

const emptyForm: FormData = {
  name: "",
  type: "workout",
  description: "",
  duration_weeks: 4,
  difficulty: "",
  goal: "",
  workoutData: { ...emptyWorkoutData },
  nutritionData: { ...emptyNutritionData },
};

export default function TemplatesContent() {
  const t = useTranslations("Portal");
  const locale = useLocale() as Locale;

  const [templates, setTemplates] = useState<PlanTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminProfileId, setAdminProfileId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("all");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Expanded days/meals in the editor
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
  const [expandedMeals, setExpandedMeals] = useState<Set<number>>(new Set());

  // Exercise search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string; name_sr: string; name_en: string; name_ru: string; slug: string }[]>([]);
  const [searchingForDay, setSearchingForDay] = useState<number | null>(null);

  // Expanded templates in list view
  const [expandedTemplates, setExpandedTemplates] = useState<Set<string>>(new Set());

  useEffect(() => {
    getMyProfile().then((p) => {
      if (p?.role === "admin") {
        setIsAdmin(true);
        setAdminProfileId(p.id);
      }
    });
  }, []);

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    setLoading(true);
    try {
      const data = await getPlanTemplates();
      setTemplates(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setForm({ ...emptyForm, workoutData: { days: [] }, nutritionData: { ...emptyNutritionData, meals: [] } });
    setEditingId(null);
    setExpandedDays(new Set());
    setExpandedMeals(new Set());
    setShowForm(true);
  }

  function openEditForm(template: PlanTemplate) {
    const data = template.data as Record<string, unknown>;
    setForm({
      name: template.name,
      type: template.type as "workout" | "nutrition",
      description: template.description || "",
      duration_weeks: template.duration_weeks,
      difficulty: template.difficulty || "",
      goal: template.goal || "",
      workoutData: template.type === "workout" && data?.days
        ? (data as unknown as WorkoutTemplateData)
        : { days: [] },
      nutritionData: template.type === "nutrition" && data?.meals
        ? (data as unknown as NutritionTemplateData)
        : { ...emptyNutritionData, meals: [] },
    });
    setEditingId(template.id);
    setExpandedDays(new Set());
    setExpandedMeals(new Set());
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const templateData = form.type === "workout" ? form.workoutData : form.nutritionData;
      if (editingId) {
        await updatePlanTemplate(editingId, {
          name: form.name,
          type: form.type,
          description: form.description || null,
          duration_weeks: form.duration_weeks,
          difficulty: form.difficulty || null,
          goal: form.goal || null,
          data: templateData as unknown as Record<string, unknown>,
        } as Partial<PlanTemplate>);
      } else {
        await createPlanTemplate({
          name: form.name,
          type: form.type,
          description: form.description || undefined,
          duration_weeks: form.duration_weeks,
          difficulty: form.difficulty || undefined,
          goal: form.goal || undefined,
          data: templateData as unknown as Record<string, unknown>,
          created_by: adminProfileId || undefined,
        });
      }
      setShowForm(false);
      setEditingId(null);
      await loadTemplates();
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePlanTemplate(id);
      setConfirmDeleteId(null);
      await loadTemplates();
    } catch {
      // silent
    }
  }

  // --- Workout data helpers ---
  function addDay() {
    const days = [...form.workoutData.days, { name: "", exercises: [] }];
    setForm({ ...form, workoutData: { ...form.workoutData, days } });
    setExpandedDays(new Set([...expandedDays, days.length - 1]));
  }

  function removeDay(index: number) {
    const days = form.workoutData.days.filter((_, i) => i !== index);
    setForm({ ...form, workoutData: { ...form.workoutData, days } });
  }

  function updateDayName(index: number, name: string) {
    const days = [...form.workoutData.days];
    days[index] = { ...days[index], name };
    setForm({ ...form, workoutData: { ...form.workoutData, days } });
  }

  function addExerciseToDay(dayIndex: number, exercise: TemplateExercise) {
    const days = [...form.workoutData.days];
    days[dayIndex] = { ...days[dayIndex], exercises: [...days[dayIndex].exercises, exercise] };
    setForm({ ...form, workoutData: { ...form.workoutData, days } });
    setSearchingForDay(null);
    setSearchQuery("");
    setSearchResults([]);
  }

  function updateExercise(dayIndex: number, exIndex: number, updates: Partial<TemplateExercise>) {
    const days = [...form.workoutData.days];
    const exercises = [...days[dayIndex].exercises];
    exercises[exIndex] = { ...exercises[exIndex], ...updates };
    days[dayIndex] = { ...days[dayIndex], exercises };
    setForm({ ...form, workoutData: { ...form.workoutData, days } });
  }

  function removeExercise(dayIndex: number, exIndex: number) {
    const days = [...form.workoutData.days];
    days[dayIndex] = { ...days[dayIndex], exercises: days[dayIndex].exercises.filter((_, i) => i !== exIndex) };
    setForm({ ...form, workoutData: { ...form.workoutData, days } });
  }

  async function handleExerciseSearch(query: string) {
    setSearchQuery(query);
    if (query.length >= 2) {
      try {
        const results = await searchExercises(query, locale);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  }

  // --- Nutrition data helpers ---
  function addMeal() {
    const meals = [...form.nutritionData.meals, { name: "", time_suggestion: "", foods: [] }];
    setForm({ ...form, nutritionData: { ...form.nutritionData, meals } });
    setExpandedMeals(new Set([...expandedMeals, meals.length - 1]));
  }

  function removeMeal(index: number) {
    const meals = form.nutritionData.meals.filter((_, i) => i !== index);
    setForm({ ...form, nutritionData: { ...form.nutritionData, meals } });
  }

  function updateMealField(index: number, field: keyof TemplateMeal, value: string) {
    const meals = [...form.nutritionData.meals];
    if (field === "foods") return;
    meals[index] = { ...meals[index], [field]: value };
    setForm({ ...form, nutritionData: { ...form.nutritionData, meals } });
  }

  function addFoodToMeal(mealIndex: number) {
    const meals = [...form.nutritionData.meals];
    meals[mealIndex] = { ...meals[mealIndex], foods: [...meals[mealIndex].foods, { name: "", amount: "" }] };
    setForm({ ...form, nutritionData: { ...form.nutritionData, meals } });
  }

  function updateFood(mealIndex: number, foodIndex: number, field: keyof TemplateFood, value: string) {
    const meals = [...form.nutritionData.meals];
    const foods = [...meals[mealIndex].foods];
    foods[foodIndex] = { ...foods[foodIndex], [field]: value };
    meals[mealIndex] = { ...meals[mealIndex], foods };
    setForm({ ...form, nutritionData: { ...form.nutritionData, meals } });
  }

  function removeFood(mealIndex: number, foodIndex: number) {
    const meals = [...form.nutritionData.meals];
    meals[mealIndex] = { ...meals[mealIndex], foods: meals[mealIndex].foods.filter((_, i) => i !== foodIndex) };
    setForm({ ...form, nutritionData: { ...form.nutritionData, meals } });
  }

  function toggleDay(index: number) {
    const next = new Set(expandedDays);
    next.has(index) ? next.delete(index) : next.add(index);
    setExpandedDays(next);
  }

  function toggleMeal(index: number) {
    const next = new Set(expandedMeals);
    next.has(index) ? next.delete(index) : next.add(index);
    setExpandedMeals(next);
  }

  function toggleTemplate(id: string) {
    const next = new Set(expandedTemplates);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedTemplates(next);
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50">
          {t("adminOnly")}
        </p>
      </div>
    );
  }

  const filtered = filterType === "all" ? templates : templates.filter((tpl) => tpl.type === filterType);

  // --- Chevron icon ---
  const Chevron = ({ expanded }: { expanded: boolean }) => (
    <svg className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );

  return (
    <div>
      {/* Back link */}
      <Link
        href={`/${locale}/portal/klijenti`}
        className="inline-flex items-center gap-[6px] font-[family-name:var(--font-roboto)] text-[13px] text-white/40 hover:text-white transition-colors mb-[20px]"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        {t("backToClients")}
      </Link>

      <div className="flex items-center justify-between mb-[8px]">
        <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white">
          {t("templates")}
        </h1>
        <button
          onClick={openCreateForm}
          className="bg-orange-500 text-white font-[family-name:var(--font-sora)] font-semibold text-[14px] px-[24px] py-[12px] hover:bg-orange-400 active:bg-orange-600 transition-colors cursor-pointer flex items-center gap-[8px]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {t("createTemplate")}
        </button>
      </div>
      <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[32px]">
        {t("templatesSubtitle")}
      </p>

      {/* Filter */}
      <div className="flex gap-[8px] mb-[24px]">
        {["all", "workout", "nutrition"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`font-[family-name:var(--font-roboto)] text-[13px] px-[16px] py-[8px] transition-all cursor-pointer ${
              filterType === type
                ? "bg-orange-500 text-white"
                : "bg-white/[0.03] border border-white/10 text-white/50 hover:border-white/20"
            }`}
          >
            {type === "all" ? t("allPlanTypes") : t(`planType_${type}`)}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px] mb-[24px]">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white mb-[24px]">
            {editingId ? t("editTemplate") : t("createTemplate")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-[20px]">
            {/* Metadata */}
            <div className="grid grid-cols-2 gap-[16px] max-sm:grid-cols-1">
              <div>
                <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[6px]">
                  {t("templateName")} *
                </label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="w-full bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[6px]">
                  {t("templateType")} *
                </label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "workout" | "nutrition" })}
                  className="w-full bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white focus:border-orange-500/50 focus:outline-none cursor-pointer">
                  <option value="workout" className="bg-[#1a1a1a]">{t("planType_workout")}</option>
                  <option value="nutrition" className="bg-[#1a1a1a]">{t("planType_nutrition")}</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-[16px] max-sm:grid-cols-1">
              <div>
                <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[6px]">{t("templateDuration")}</label>
                <input type="number" min="1" max="52" value={form.duration_weeks} onChange={(e) => setForm({ ...form, duration_weeks: parseInt(e.target.value) || 4 })}
                  className="w-full bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white focus:border-orange-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[6px]">{t("templateDifficulty")}</label>
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white focus:border-orange-500/50 focus:outline-none cursor-pointer">
                  <option value="" className="bg-[#1a1a1a]">—</option>
                  <option value="beginner" className="bg-[#1a1a1a]">{t("difficulty_beginner")}</option>
                  <option value="intermediate" className="bg-[#1a1a1a]">{t("difficulty_intermediate")}</option>
                  <option value="advanced" className="bg-[#1a1a1a]">{t("difficulty_advanced")}</option>
                </select>
              </div>
              <div>
                <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[6px]">{t("templateGoal")}</label>
                <input type="text" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[6px]">{t("templateDescription")}</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                className="w-full bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none resize-none" />
            </div>

            {/* Structured editor divider */}
            <div className="border-t border-white/10 pt-[20px]">
              <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[16px] text-orange-400 mb-[16px]">
                {form.type === "workout" ? t("training") : t("nutrition")}
              </h3>

              {/* WORKOUT EDITOR */}
              {form.type === "workout" && (
                <div className="space-y-[12px]">
                  {form.workoutData.days.map((day, di) => (
                    <div key={di} className="border border-white/10 bg-white/[0.02]">
                      <div
                        className="flex items-center justify-between px-[16px] py-[12px] cursor-pointer hover:bg-white/[0.02]"
                        onClick={() => toggleDay(di)}
                      >
                        <div className="flex items-center gap-[8px]">
                          <Chevron expanded={expandedDays.has(di)} />
                          <input
                            type="text"
                            value={day.name}
                            onChange={(e) => { e.stopPropagation(); updateDayName(di, e.target.value); }}
                            onClick={(e) => e.stopPropagation()}
                            placeholder={t("dayNamePlaceholder")}
                            className="bg-transparent border-none px-0 py-0 font-[family-name:var(--font-sora)] font-semibold text-[14px] text-white placeholder-white/30 focus:outline-none w-[200px] max-sm:w-[140px]"
                          />
                          <span className="font-[family-name:var(--font-roboto)] text-[11px] text-white/30">
                            {day.exercises.length} {t("exercisesCount")}
                          </span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeDay(di); }}
                          className="font-[family-name:var(--font-roboto)] text-[11px] text-red-400/60 hover:text-red-400 hover:bg-red-400/10 border border-red-400/20 px-[8px] py-[4px] transition-colors cursor-pointer"
                        >
                          {t("deleteTemplate")}
                        </button>
                      </div>

                      {expandedDays.has(di) && (
                        <div className="px-[16px] pb-[16px]">
                          {/* Exercise table header */}
                          {day.exercises.length > 0 && (
                            <div className="grid grid-cols-[1fr_60px_70px_60px_28px] gap-[6px] pb-[6px] mb-[4px] border-b border-white/5">
                              <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500">{t("exerciseLabel")}</span>
                              <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 text-center">{t("setsLabel")}</span>
                              <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 text-center">{t("repsLabel")}</span>
                              <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 text-center">{t("restLabel")}</span>
                              <span />
                            </div>
                          )}

                          {/* Exercise rows */}
                          {day.exercises.map((ex, ei) => (
                            <div key={ei} className="grid grid-cols-[1fr_60px_70px_60px_28px] gap-[6px] py-[8px] border-b border-white/5 last:border-0 items-center">
                              <div>
                                {ex.slug ? (
                                  <Link href={`/${locale}/vezbe/${ex.slug}`} className="font-[family-name:var(--font-roboto)] text-[13px] text-white hover:text-orange-400 transition-colors underline decoration-white/20 underline-offset-2">
                                    {ex.name}
                                  </Link>
                                ) : (
                                  <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/70">{ex.name}</span>
                                )}
                              </div>
                              <input type="number" value={ex.sets} onChange={(e) => updateExercise(di, ei, { sets: parseInt(e.target.value) || 0 })}
                                className="w-full bg-transparent border border-white/10 px-[4px] py-[4px] font-[family-name:var(--font-roboto)] text-[12px] text-white/60 text-center focus:border-orange-500/50 focus:outline-none" />
                              <input type="text" value={ex.reps} onChange={(e) => updateExercise(di, ei, { reps: e.target.value })}
                                className="w-full bg-transparent border border-white/10 px-[4px] py-[4px] font-[family-name:var(--font-roboto)] text-[12px] text-white/60 text-center focus:border-orange-500/50 focus:outline-none" />
                              <input type="number" value={ex.rest_seconds} onChange={(e) => updateExercise(di, ei, { rest_seconds: parseInt(e.target.value) || 0 })}
                                className="w-full bg-transparent border border-white/10 px-[4px] py-[4px] font-[family-name:var(--font-roboto)] text-[12px] text-white/60 text-center focus:border-orange-500/50 focus:outline-none" />
                              <button onClick={() => removeExercise(di, ei)} className="text-white/20 hover:text-red-400 transition-colors cursor-pointer text-center">×</button>
                            </div>
                          ))}

                          {/* Add exercise */}
                          {searchingForDay === di ? (
                            <div className="pt-[8px] space-y-[6px]">
                              <div className="relative">
                                <input type="text" value={searchQuery} onChange={(e) => handleExerciseSearch(e.target.value)}
                                  placeholder={t("searchExercise")} autoFocus
                                  className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none" />
                                {searchResults.length > 0 && (
                                  <div className="absolute top-full left-0 right-0 bg-[#1a1a1a] border border-white/10 z-10 max-h-[200px] overflow-y-auto">
                                    {searchResults.map((ex) => (
                                      <button key={ex.id} onClick={() => addExerciseToDay(di, {
                                        exercise_id: ex.id,
                                        name: localizedField(ex as unknown as Record<string, unknown>, "name", locale),
                                        slug: ex.slug,
                                        sets: 3,
                                        reps: "8-12",
                                        rest_seconds: 90,
                                      })}
                                        className="block w-full text-left px-[10px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white/70 hover:bg-white/5 cursor-pointer">
                                        {localizedField(ex as unknown as Record<string, unknown>, "name", locale)}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-[8px]">
                                <button type="button" onClick={() => {
                                  if (searchQuery.trim()) {
                                    addExerciseToDay(di, { exercise_id: null, name: searchQuery, slug: "", sets: 3, reps: "8-12", rest_seconds: 90 });
                                  }
                                }}
                                  className="font-[family-name:var(--font-roboto)] text-[11px] text-orange-400 hover:text-orange-300 cursor-pointer">
                                  + {t("addExercise")}
                                </button>
                                <button type="button" onClick={() => { setSearchingForDay(null); setSearchQuery(""); setSearchResults([]); }}
                                  className="font-[family-name:var(--font-roboto)] text-[11px] text-white/30 cursor-pointer">
                                  {t("cancel")}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button type="button" onClick={() => setSearchingForDay(di)}
                              className="flex items-center gap-[4px] pt-[8px] font-[family-name:var(--font-roboto)] text-[12px] text-white/30 hover:text-orange-400 transition-colors cursor-pointer">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                              {t("addExercise")}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  <button type="button" onClick={addDay}
                    className="flex items-center gap-[6px] font-[family-name:var(--font-roboto)] text-[13px] text-orange-400 hover:text-orange-300 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {t("addDay")}
                  </button>
                </div>
              )}

              {/* NUTRITION EDITOR */}
              {form.type === "nutrition" && (
                <div className="space-y-[16px]">
                  {/* Macros */}
                  <div className="grid grid-cols-4 gap-[12px]">
                    <div>
                      <label className="block font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 mb-[4px]">kcal</label>
                      <input type="number" value={form.nutritionData.daily_calories} onChange={(e) => setForm({ ...form, nutritionData: { ...form.nutritionData, daily_calories: parseInt(e.target.value) || 0 } })}
                        className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white text-center focus:border-orange-500/50 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 mb-[4px]">{t("protein")}</label>
                      <input type="number" value={form.nutritionData.protein_g} onChange={(e) => setForm({ ...form, nutritionData: { ...form.nutritionData, protein_g: parseInt(e.target.value) || 0 } })}
                        className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white text-center focus:border-orange-500/50 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block font-[family-name:var(--font-roboto)] text-[9px] uppercase tracking-[1px] text-orange-500 mb-[4px] leading-tight">{t("carbs")}</label>
                      <input type="number" value={form.nutritionData.carbs_g} onChange={(e) => setForm({ ...form, nutritionData: { ...form.nutritionData, carbs_g: parseInt(e.target.value) || 0 } })}
                        className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white text-center focus:border-orange-500/50 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-orange-500 mb-[4px]">{t("fat")}</label>
                      <input type="number" value={form.nutritionData.fats_g} onChange={(e) => setForm({ ...form, nutritionData: { ...form.nutritionData, fats_g: parseInt(e.target.value) || 0 } })}
                        className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white text-center focus:border-orange-500/50 focus:outline-none" />
                    </div>
                  </div>

                  {/* Meals */}
                  {form.nutritionData.meals.map((meal, mi) => (
                    <div key={mi} className="border border-white/10 bg-white/[0.02]">
                      <div className="flex items-center justify-between px-[16px] py-[12px] cursor-pointer hover:bg-white/[0.02]" onClick={() => toggleMeal(mi)}>
                        <div className="flex items-center gap-[8px]">
                          <Chevron expanded={expandedMeals.has(mi)} />
                          <input type="text" value={meal.name} onChange={(e) => { e.stopPropagation(); updateMealField(mi, "name", e.target.value); }}
                            onClick={(e) => e.stopPropagation()}
                            placeholder={t("mealName")}
                            className="bg-transparent border-none px-0 py-0 font-[family-name:var(--font-sora)] font-semibold text-[14px] text-white placeholder-white/30 focus:outline-none w-[160px] max-sm:w-[120px]" />
                          <input type="text" value={meal.time_suggestion} onChange={(e) => { e.stopPropagation(); updateMealField(mi, "time_suggestion", e.target.value); }}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="07:00"
                            className="bg-transparent border-none px-0 py-0 font-[family-name:var(--font-roboto)] text-[12px] text-white/40 focus:outline-none w-[50px] text-center" />
                          <span className="font-[family-name:var(--font-roboto)] text-[11px] text-white/30">{meal.foods.length} {t("itemsCount")}</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); removeMeal(mi); }}
                          className="font-[family-name:var(--font-roboto)] text-[11px] text-red-400/60 hover:text-red-400 hover:bg-red-400/10 border border-red-400/20 px-[8px] py-[4px] transition-colors cursor-pointer">
                          {t("deleteTemplate")}
                        </button>
                      </div>

                      {expandedMeals.has(mi) && (
                        <div className="px-[16px] pb-[16px] space-y-[6px]">
                          {meal.foods.map((food, fi) => (
                            <div key={fi} className="flex items-center gap-[8px]">
                              <input type="text" value={food.name} onChange={(e) => updateFood(mi, fi, "name", e.target.value)}
                                placeholder={t("foodNamePlaceholder")}
                                className="flex-1 min-w-0 bg-white/[0.03] border border-white/10 px-[10px] py-[6px] font-[family-name:var(--font-roboto)] text-[13px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none" />
                              <input type="text" value={food.amount} onChange={(e) => updateFood(mi, fi, "amount", e.target.value)}
                                placeholder="100g"
                                className="w-[80px] bg-white/[0.03] border border-white/10 px-[8px] py-[6px] font-[family-name:var(--font-roboto)] text-[12px] text-white/60 placeholder-white/30 text-center focus:border-orange-500/50 focus:outline-none" />
                              <button onClick={() => removeFood(mi, fi)} className="text-white/20 hover:text-red-400 transition-colors cursor-pointer">×</button>
                            </div>
                          ))}
                          <button type="button" onClick={() => addFoodToMeal(mi)}
                            className="flex items-center gap-[4px] font-[family-name:var(--font-roboto)] text-[12px] text-white/30 hover:text-orange-400 transition-colors cursor-pointer">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            {t("addFood")}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  <button type="button" onClick={addMeal}
                    className="flex items-center gap-[6px] font-[family-name:var(--font-roboto)] text-[13px] text-orange-400 hover:text-orange-300 transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {t("addMeal")}
                  </button>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex items-center gap-[12px] pt-[8px]">
              <button type="submit" disabled={saving}
                className="bg-orange-500 text-white font-[family-name:var(--font-sora)] font-semibold text-[14px] px-[24px] py-[12px] hover:bg-orange-400 transition-colors cursor-pointer disabled:opacity-50">
                {saving ? t("saving") : editingId ? t("save") : t("create")}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
                className="font-[family-name:var(--font-roboto)] text-[14px] text-white/50 hover:text-white transition-colors cursor-pointer px-[16px] py-[12px]">
                {t("cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Templates list */}
      {loading ? (
        <div className="flex items-center justify-center py-[80px]">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/10 p-[32px]">
          <div className="py-[48px] text-center">
            <svg className="w-16 h-16 text-white/10 mx-auto mb-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-white/50">{t("noTemplates")}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-[16px]">
          {filtered.map((template) => {
            const isExpanded = expandedTemplates.has(template.id);
            const data = template.data as Record<string, unknown>;
            const isWorkout = template.type === "workout";
            const days = isWorkout ? (data?.days as TemplateDay[] || []) : [];
            const meals = !isWorkout ? (data?.meals as TemplateMeal[] || []) : [];

            return (
              <div key={template.id} className="bg-white/[0.03] border border-white/10">
                <div className="flex items-start justify-between p-[24px] max-sm:p-[16px] cursor-pointer" onClick={() => toggleTemplate(template.id)}>
                  <div className="flex items-start gap-[12px]">
                    <div className="mt-[4px]"><Chevron expanded={isExpanded} /></div>
                    <div>
                      <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-white">{template.name}</h3>
                      <div className="flex flex-wrap items-center gap-[8px] mt-[6px]">
                        <span className={`font-[family-name:var(--font-roboto)] text-[11px] px-[8px] py-[2px] ${
                          isWorkout ? "text-blue-400 bg-blue-400/10" : "text-orange-400 bg-orange-400/10"
                        }`}>
                          {t(`planType_${template.type}`)}
                        </span>
                        {template.difficulty && (
                          <span className="font-[family-name:var(--font-roboto)] text-[11px] px-[8px] py-[2px] text-white/40 bg-white/5">
                            {t(`difficulty_${template.difficulty}`)}
                          </span>
                        )}
                        <span className="font-[family-name:var(--font-roboto)] text-[11px] text-white/30">
                          {template.duration_weeks}w
                        </span>
                        {isWorkout && days.length > 0 && (
                          <span className="font-[family-name:var(--font-roboto)] text-[11px] text-white/30">{days.length} {t("daysCount")}</span>
                        )}
                        {!isWorkout && meals.length > 0 && (
                          <span className="font-[family-name:var(--font-roboto)] text-[11px] text-white/30">{meals.length} {t("mealsCount")}</span>
                        )}
                      </div>
                      {template.description && (
                        <p className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40 mt-[6px]">{template.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-[8px] shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => openEditForm(template)}
                      className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 hover:text-orange-400 transition-colors cursor-pointer">
                      {t("editTemplate")}
                    </button>
                    {confirmDeleteId === template.id ? (
                      <div className="flex items-center gap-[6px]">
                        <button onClick={() => handleDelete(template.id)}
                          className="font-[family-name:var(--font-roboto)] text-[12px] text-red-400 hover:text-red-300 cursor-pointer">{t("confirmDelete")}</button>
                        <button onClick={() => setConfirmDeleteId(null)}
                          className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30 cursor-pointer">{t("cancel")}</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDeleteId(template.id)}
                        className="font-[family-name:var(--font-roboto)] text-[12px] text-red-400/60 hover:text-red-400 hover:bg-red-400/10 border border-red-400/20 px-[8px] py-[4px] transition-colors cursor-pointer">
                        {t("deleteTemplate")}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-white/10 p-[24px] max-sm:p-[16px]">
                    {isWorkout && days.length > 0 && (
                      <div className="space-y-[12px]">
                        {days.map((day, di) => (
                          <div key={di}>
                            <h4 className="font-[family-name:var(--font-sora)] font-semibold text-[14px] text-orange-400 mb-[8px]">{day.name || `${t("dayDefault")} ${di + 1}`}</h4>
                            {day.exercises.length > 0 && (
                              <>
                                <div className="grid grid-cols-[1fr_60px_70px_60px] gap-[6px] pb-[4px] border-b border-white/5">
                                  <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/30">{t("exerciseLabel")}</span>
                                  <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/30 text-center">{t("setsLabel")}</span>
                                  <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/30 text-center">{t("repsLabel")}</span>
                                  <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/30 text-center">{t("restLabel")}</span>
                                </div>
                                {day.exercises.map((ex, ei) => (
                                  <div key={ei} className="grid grid-cols-[1fr_60px_70px_60px] gap-[6px] py-[8px] border-b border-white/5 last:border-0 items-center">
                                    {ex.slug ? (
                                      <Link href={`/${locale}/vezbe/${ex.slug}`} className="font-[family-name:var(--font-roboto)] text-[13px] text-white hover:text-orange-400 underline decoration-white/20 underline-offset-2">
                                        {ex.name}
                                      </Link>
                                    ) : (
                                      <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/70">{ex.name}</span>
                                    )}
                                    <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/60 text-center">{ex.sets}</span>
                                    <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/60 text-center">{ex.reps}</span>
                                    <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40 text-center">{ex.rest_seconds}s</span>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {!isWorkout && (
                      <div className="space-y-[12px]">
                        {/* Macros summary */}
                        {(data as NutritionTemplateData)?.daily_calories && (
                          <div className="flex flex-wrap gap-[16px] mb-[12px]">
                            <span className="font-[family-name:var(--font-sora)] font-bold text-[18px] text-orange-500">{(data as NutritionTemplateData).daily_calories} <span className="text-[12px] text-white/40 font-normal">kcal</span></span>
                            <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">{t("protein")}: {(data as NutritionTemplateData).protein_g}g</span>
                            <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">{t("carbs")}: {(data as NutritionTemplateData).carbs_g}g</span>
                            <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">{t("fat")}: {(data as NutritionTemplateData).fats_g}g</span>
                          </div>
                        )}
                        {meals.map((meal, mi) => (
                          <div key={mi}>
                            <h4 className="font-[family-name:var(--font-sora)] font-semibold text-[14px] text-orange-400 mb-[4px]">
                              {meal.name || `${t("mealDefault")} ${mi + 1}`}
                              {meal.time_suggestion && <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30 ml-[8px]">{meal.time_suggestion}</span>}
                            </h4>
                            {meal.foods.map((food, fi) => (
                              <div key={fi} className="flex justify-between py-[4px] border-b border-white/5 last:border-0">
                                <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/70">{food.name}</span>
                                <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40">{food.amount}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {isWorkout && days.length === 0 && !isWorkout && meals.length === 0 && (
                      <p className="font-[family-name:var(--font-roboto)] text-[13px] text-white/30 text-center py-[20px]">{t("noDataAvailable")}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
