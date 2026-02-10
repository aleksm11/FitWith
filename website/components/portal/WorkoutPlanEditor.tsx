"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  createTrainingPlan,
  createTrainingDay,
  createTrainingExercise,
  updateTrainingExercise,
  deleteTrainingExercise,
  deleteTrainingDay,
  deleteTrainingPlan,
  searchExercises,
  getPlanTemplates,
  getPlanTemplate,
} from "@/lib/supabase/queries";
import { localizedField } from "@/lib/supabase/types";
import type { Locale, TrainingPlan, TrainingDay, TrainingExercise, Exercise, PlanTemplate } from "@/lib/supabase/types";

type TrainingPlanWithDetails = TrainingPlan & {
  training_days: (TrainingDay & {
    training_exercises: (TrainingExercise & { exercises: Exercise | null })[];
  })[];
};

type Props = {
  clientId: string;
  plans: TrainingPlanWithDetails[];
  onRefresh: () => void;
};

type EditingExercise = {
  dayId: string;
  exerciseId?: string;
  exercise_name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes: string;
  id?: string; // existing exercise ID for updates
};

const emptyExercise: Omit<EditingExercise, "dayId"> = {
  exercise_name: "",
  sets: 3,
  reps: "8-12",
  rest_seconds: 90,
  notes: "",
};

export default function WorkoutPlanEditor({ clientId, plans, onRefresh }: Props) {
  const t = useTranslations("Portal");
  const locale = useLocale() as Locale;

  const [creating, setCreating] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<PlanTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  // Load templates when creating
  useEffect(() => {
    if (creating) {
      getPlanTemplates("workout").then(setTemplates).catch(() => {});
    }
  }, [creating]);

  // Add exercise state
  const [addingToDay, setAddingToDay] = useState<string | null>(null);
  const [newExercise, setNewExercise] = useState(emptyExercise);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string; name_sr: string; name_en: string; name_ru: string; slug: string }[]>([]);

  // Add day state
  const [addingDayToPlan, setAddingDayToPlan] = useState<string | null>(null);
  const [newDayName, setNewDayName] = useState("");

  async function handleCreatePlan() {
    if (!newPlanName.trim()) return;
    setSaving(true);
    try {
      const plan = await createTrainingPlan({ client_id: clientId, name: newPlanName });

      // If template selected, populate days and exercises from template data
      if (selectedTemplateId && plan?.id) {
        const template = await getPlanTemplate(selectedTemplateId);
        const data = template?.data as { days?: { name: string; exercises: { exercise_id: string | null; name: string; sets: number; reps: string; rest_seconds: number }[] }[] } | null;
        if (data?.days) {
          for (let di = 0; di < data.days.length; di++) {
            const dayData = data.days[di];
            const day = await createTrainingDay({
              plan_id: plan.id,
              day_number: di + 1,
              day_name_sr: dayData.name,
              sort_order: di + 1,
            });
            if (day?.id && dayData.exercises) {
              for (let ei = 0; ei < dayData.exercises.length; ei++) {
                const ex = dayData.exercises[ei];
                await createTrainingExercise({
                  day_id: day.id,
                  exercise_id: ex.exercise_id || undefined,
                  exercise_name: ex.name,
                  sets: ex.sets,
                  reps: ex.reps,
                  rest_seconds: ex.rest_seconds,
                  sort_order: ei + 1,
                });
              }
            }
          }
        }
      }

      setNewPlanName("");
      setSelectedTemplateId("");
      setCreating(false);
      onRefresh();
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePlan(planId: string) {
    try {
      await deleteTrainingPlan(planId);
      onRefresh();
    } catch {
      // silent
    }
  }

  async function handleAddDay(planId: string) {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;
    const dayNumber = plan.training_days.length + 1;
    try {
      await createTrainingDay({
        plan_id: planId,
        day_number: dayNumber,
        day_name_sr: newDayName || `Dan ${dayNumber}`,
        sort_order: dayNumber,
      });
      setAddingDayToPlan(null);
      setNewDayName("");
      onRefresh();
    } catch {
      // silent
    }
  }

  async function handleDeleteDay(dayId: string) {
    try {
      await deleteTrainingDay(dayId);
      onRefresh();
    } catch {
      // silent
    }
  }

  async function handleSearchExercise(query: string) {
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

  async function handleAddExercise(dayId: string) {
    try {
      const sortOrder = plans
        .flatMap((p) => p.training_days)
        .find((d) => d.id === dayId)
        ?.training_exercises.length || 0;
      await createTrainingExercise({
        day_id: dayId,
        exercise_id: newExercise.exerciseId || undefined,
        exercise_name: newExercise.exercise_name,
        sets: newExercise.sets,
        reps: newExercise.reps,
        rest_seconds: newExercise.rest_seconds,
        notes: newExercise.notes || undefined,
        sort_order: sortOrder,
      });
      setAddingToDay(null);
      setNewExercise(emptyExercise);
      setSearchQuery("");
      setSearchResults([]);
      onRefresh();
    } catch {
      // silent
    }
  }

  async function handleUpdateExercise(id: string, updates: Partial<TrainingExercise>) {
    try {
      await updateTrainingExercise(id, updates);
      onRefresh();
    } catch {
      // silent
    }
  }

  async function handleDeleteExercise(id: string) {
    try {
      await deleteTrainingExercise(id);
      onRefresh();
    } catch {
      // silent
    }
  }

  return (
    <div className="space-y-[24px]">
      {/* Create new plan */}
      {creating ? (
        <div className="bg-white/[0.03] border border-orange-500/30 p-[24px] space-y-[12px]">
          {templates.length > 0 && (
            <select
              value={selectedTemplateId}
              onChange={(e) => {
                setSelectedTemplateId(e.target.value);
                const tpl = templates.find((t) => t.id === e.target.value);
                if (tpl && !newPlanName) setNewPlanName(tpl.name);
              }}
              className="w-full bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white/70 focus:border-orange-500/50 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#1a1a1a]">{t("templates")}...</option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id} className="bg-[#1a1a1a]">{tpl.name}</option>
              ))}
            </select>
          )}
          <div className="flex flex-wrap items-center gap-[12px]">
            <input
              type="text"
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
              placeholder={t("newPlanName")}
              className="flex-1 min-w-0 bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleCreatePlan()}
            />
            <button
              onClick={handleCreatePlan}
              disabled={saving}
              className="bg-orange-500 text-white font-[family-name:var(--font-sora)] font-semibold text-[13px] px-[20px] py-[10px] hover:bg-orange-400 transition-colors cursor-pointer disabled:opacity-50"
            >
              {t("create")}
            </button>
            <button
              onClick={() => setCreating(false)}
              className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40 hover:text-white cursor-pointer px-[12px] py-[10px]"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-[8px] font-[family-name:var(--font-roboto)] text-[14px] text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {t("createTrainingPlan")}
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
                plan.is_active ? "text-green-400 bg-green-400/10" : "text-white/40 bg-white/5"
              }`}>
                {plan.is_active ? t("active") : t("inactive")}
              </span>
            </div>
            <button
              onClick={() => handleDeletePlan(plan.id)}
              className="font-[family-name:var(--font-roboto)] text-[12px] text-red-400/60 hover:text-red-400 hover:bg-red-400/10 border border-red-400/20 hover:border-red-400/40 px-[12px] py-[6px] transition-colors cursor-pointer"
            >
              {t("deleteTemplate")}
            </button>
          </div>

          {/* Days */}
          {plan.training_days
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((day) => (
              <div key={day.id} className="border-b border-white/5 last:border-0">
                <div className="flex items-center justify-between px-[24px] py-[12px] bg-white/[0.02]">
                  <span className="font-[family-name:var(--font-roboto)] text-[14px] text-orange-400 font-medium">
                    {localizedField(day as unknown as Record<string, unknown>, "day_name", locale) || `${t("dayLabel")} ${day.day_number}`}
                  </span>
                  <div className="flex items-center gap-[12px]">
                    <span className="font-[family-name:var(--font-roboto)] text-[11px] text-white/30">
                      {day.training_exercises.length} {t("exercisesCount")}
                    </span>
                    <button
                      onClick={() => handleDeleteDay(day.id)}
                      className="font-[family-name:var(--font-roboto)] text-[11px] text-white/20 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Exercises table */}
                <div className="px-[24px]">
                  {day.training_exercises
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((ex) => (
                      <div key={ex.id} className="grid grid-cols-[1fr_70px_70px_70px_32px] gap-[8px] py-[10px] border-b border-white/5 last:border-0 items-center">
                        <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/70 truncate">
                          {ex.exercises
                            ? localizedField(ex.exercises as unknown as Record<string, unknown>, "name", locale)
                            : ex.exercise_name || ""}
                        </span>
                        <input
                          type="number"
                          defaultValue={ex.sets || 0}
                          onBlur={(e) => handleUpdateExercise(ex.id, { sets: parseInt(e.target.value) || 0 })}
                          className="w-full bg-transparent border border-white/10 px-[6px] py-[4px] font-[family-name:var(--font-roboto)] text-[12px] text-white/60 text-center focus:border-orange-500/50 focus:outline-none"
                        />
                        <input
                          type="text"
                          defaultValue={ex.reps || ""}
                          onBlur={(e) => handleUpdateExercise(ex.id, { reps: e.target.value })}
                          className="w-full bg-transparent border border-white/10 px-[6px] py-[4px] font-[family-name:var(--font-roboto)] text-[12px] text-white/60 text-center focus:border-orange-500/50 focus:outline-none"
                        />
                        <input
                          type="number"
                          defaultValue={ex.rest_seconds || 0}
                          onBlur={(e) => handleUpdateExercise(ex.id, { rest_seconds: parseInt(e.target.value) || 0 })}
                          className="w-full bg-transparent border border-white/10 px-[6px] py-[4px] font-[family-name:var(--font-roboto)] text-[12px] text-white/60 text-center focus:border-orange-500/50 focus:outline-none"
                        />
                        <button
                          onClick={() => handleDeleteExercise(ex.id)}
                          className="text-white/20 hover:text-red-400 transition-colors cursor-pointer text-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                  {/* Column headers when exercises exist */}
                  {day.training_exercises.length > 0 && (
                    <div className="grid grid-cols-[1fr_70px_70px_70px_32px] gap-[8px] pb-[6px]">
                      <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/20">{t("exerciseLabel")}</span>
                      <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/20 text-center">{t("setsLabel")}</span>
                      <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/20 text-center">{t("repsLabel")}</span>
                      <span className="font-[family-name:var(--font-roboto)] text-[10px] uppercase tracking-[1px] text-white/20 text-center">{t("restLabel")}</span>
                      <span />
                    </div>
                  )}

                  {/* Add exercise form */}
                  {addingToDay === day.id ? (
                    <div className="py-[12px] space-y-[8px]">
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery || newExercise.exercise_name}
                          onChange={(e) => {
                            setNewExercise({ ...newExercise, exercise_name: e.target.value, exerciseId: undefined });
                            handleSearchExercise(e.target.value);
                          }}
                          placeholder={t("searchExercise")}
                          className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none"
                        />
                        {searchResults.length > 0 && (
                          <div className="absolute top-full left-0 right-0 bg-[#1a1a1a] border border-white/10 z-10 max-h-[200px] overflow-y-auto">
                            {searchResults.map((ex) => (
                              <button
                                key={ex.id}
                                onClick={() => {
                                  setNewExercise({
                                    ...newExercise,
                                    exercise_name: localizedField(ex as unknown as Record<string, unknown>, "name", locale),
                                    exerciseId: ex.id,
                                  });
                                  setSearchQuery("");
                                  setSearchResults([]);
                                }}
                                className="block w-full text-left px-[12px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white/70 hover:bg-white/5 cursor-pointer"
                              >
                                {localizedField(ex as unknown as Record<string, unknown>, "name", locale)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-[8px]">
                        <input
                          type="number"
                          value={newExercise.sets}
                          onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 0 })}
                          placeholder={t("setsLabel")}
                          className="bg-white/[0.03] border border-white/10 px-[12px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white text-center focus:border-orange-500/50 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={newExercise.reps}
                          onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                          placeholder={t("repsLabel")}
                          className="bg-white/[0.03] border border-white/10 px-[12px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white text-center focus:border-orange-500/50 focus:outline-none"
                        />
                        <input
                          type="number"
                          value={newExercise.rest_seconds}
                          onChange={(e) => setNewExercise({ ...newExercise, rest_seconds: parseInt(e.target.value) || 0 })}
                          placeholder={t("restLabel")}
                          className="bg-white/[0.03] border border-white/10 px-[12px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white text-center focus:border-orange-500/50 focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-[8px]">
                        <button
                          onClick={() => handleAddExercise(day.id)}
                          className="bg-orange-500 text-white font-[family-name:var(--font-sora)] font-semibold text-[12px] px-[16px] py-[8px] hover:bg-orange-400 transition-colors cursor-pointer"
                        >
                          {t("addExercise")}
                        </button>
                        <button
                          onClick={() => { setAddingToDay(null); setNewExercise(emptyExercise); setSearchResults([]); }}
                          className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 hover:text-white cursor-pointer px-[12px] py-[8px]"
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingToDay(day.id)}
                      className="flex items-center gap-[4px] py-[10px] font-[family-name:var(--font-roboto)] text-[12px] text-white/30 hover:text-orange-400 transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      {t("addExercise")}
                    </button>
                  )}
                </div>
              </div>
            ))}

          {/* Add day */}
          <div className="px-[24px] py-[12px]">
            {addingDayToPlan === plan.id ? (
              <div className="flex flex-wrap items-center gap-[8px]">
                <input
                  type="text"
                  value={newDayName}
                  onChange={(e) => setNewDayName(e.target.value)}
                  placeholder={t("dayNamePlaceholder")}
                  className="flex-1 min-w-0 bg-white/[0.03] border border-white/10 px-[12px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none"
                  onKeyDown={(e) => e.key === "Enter" && handleAddDay(plan.id)}
                />
                <div className="flex items-center gap-[8px]">
                  <button
                    onClick={() => handleAddDay(plan.id)}
                    className="bg-orange-500/20 text-orange-400 font-[family-name:var(--font-roboto)] text-[12px] px-[14px] py-[8px] hover:bg-orange-500/30 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {t("addDay")}
                  </button>
                  <button
                    onClick={() => { setAddingDayToPlan(null); setNewDayName(""); }}
                    className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30 cursor-pointer px-[8px] whitespace-nowrap"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingDayToPlan(plan.id)}
                className="flex items-center gap-[4px] font-[family-name:var(--font-roboto)] text-[12px] text-white/30 hover:text-orange-400 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {t("addDay")}
              </button>
            )}
          </div>
        </div>
      ))}

      {plans.length === 0 && !creating && (
        <div className="bg-white/[0.03] border border-white/10 p-[32px]">
          <div className="py-[48px] text-center">
            <svg className="w-16 h-16 text-white/10 mx-auto mb-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <p className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-white/50">
              {t("noTrainingPlans")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
