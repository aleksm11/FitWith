"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  mockTrainingPlans,
  mockExercises as mockExList,
  mockUsers,
  type AdminTrainingPlan,
  type AdminTrainingDay,
  type AdminTrainingExercise,
} from "@/lib/admin/mock-data";
import {
  getTrainingPlans,
  getUsers,
  getExercises,
  createTrainingPlan,
  createTrainingDay,
  createTrainingExercise,
} from "@/lib/supabase/queries";
import type { Profile, Exercise, ExerciseCategory } from "@/lib/supabase/types";
import { getWeekdayName } from "@/lib/utils/timezone";

const WEEKDAYS = [
  { value: 1, label: "Ponedeljak" },
  { value: 2, label: "Utorak" },
  { value: 3, label: "Sreda" },
  { value: 4, label: "Četvrtak" },
  { value: 5, label: "Petak" },
  { value: 6, label: "Subota" },
  { value: 7, label: "Nedelja" },
];

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-400",
  draft: "bg-yellow-500/10 text-yellow-400",
  archived: "bg-white/5 text-white/40",
};

type ClientOption = { id: string; name: string };
type ExerciseOption = { id: string; name: string };

export default function TrainingContent() {
  const t = useTranslations("Admin");
  const [plans, setPlans] = useState<AdminTrainingPlan[]>(mockTrainingPlans);
  const [selectedPlan, setSelectedPlan] = useState<AdminTrainingPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [clients, setClients] = useState<ClientOption[]>(
    mockUsers.filter((u) => u.role === "client").map((u) => ({ id: u.id, name: u.fullName }))
  );
  const [exerciseOptions, setExerciseOptions] = useState<ExerciseOption[]>(
    mockExList.map((e) => ({ id: e.id, name: e.name }))
  );
  const [newPlan, setNewPlan] = useState({
    name: "",
    clientId: "",
    daysPerWeek: 3,
    goal: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getTrainingPlans(), getUsers(), getExercises()])
      .then(([tpData, usersData, exData]) => {
        if (tpData && tpData.length > 0) {
          setPlans(
            tpData.map((tp) => ({
              id: tp.id,
              name: tp.name,
              clientName: tp.profiles?.full_name || "",
              clientId: tp.client_id,
              daysPerWeek: tp.training_days?.length || 0,
              goal: "",
              status: tp.is_active ? "active" : "draft",
              createdAt: new Date(tp.created_at).toLocaleDateString("sr-Latn"),
              days: (tp.training_days || []).map((d) => ({
                id: d.id,
                dayName: d.day_of_week ? getWeekdayName(d.day_of_week, "sr") : (d.day_name_sr || `Dan ${d.day_number}`),
                dayOfWeek: d.day_of_week || null,
                focus: d.notes || "",
                exercises: (d.training_exercises || []).map((ex) => ({
                  exerciseId: ex.exercise_id || "",
                  exerciseName: ex.exercise_name || "",
                  sets: ex.sets || 3,
                  reps: ex.reps || "10-12",
                  restSeconds: ex.rest_seconds || 60,
                  notes: ex.notes || "",
                })),
              })),
            }))
          );
        }
        if (usersData && usersData.length > 0) {
          setClients(
            usersData
              .filter((u: Profile) => u.role === "client")
              .map((u: Profile) => ({ id: u.id, name: u.full_name || u.email || "—" }))
          );
        }
        if (exData && exData.length > 0) {
          setExerciseOptions(
            exData.map((e: Exercise & { exercise_categories: ExerciseCategory | null }) => ({
              id: e.id,
              name: e.name_sr,
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleCreatePlan() {
    setIsCreating(true);
    setSelectedPlan(null);
    setNewPlan({ name: "", clientId: "", daysPerWeek: 3, goal: "" });
  }

  function handleSavePlan() {
    if (!newPlan.clientId || !newPlan.name) return;
    setSaving(true);

    createTrainingPlan({
      client_id: newPlan.clientId,
      name: newPlan.name,
    })
      .then((result) => {
        const client = clients.find((c) => c.id === newPlan.clientId);
        const plan: AdminTrainingPlan = {
          id: result.id,
          name: result.name,
          clientName: client?.name || "",
          clientId: newPlan.clientId,
          daysPerWeek: newPlan.daysPerWeek,
          goal: newPlan.goal,
          status: "draft",
          createdAt: new Date().toLocaleDateString("sr-Latn"),
          days: [],
        };
        setPlans([plan, ...plans]);
        setIsCreating(false);
        setSelectedPlan(plan);
      })
      .catch(() => {
        // Fallback to local
        const plan: AdminTrainingPlan = {
          id: `tp${Date.now()}`,
          name: newPlan.name,
          clientName: clients.find((c) => c.id === newPlan.clientId)?.name || "",
          clientId: newPlan.clientId,
          daysPerWeek: newPlan.daysPerWeek,
          goal: newPlan.goal,
          status: "draft",
          createdAt: new Date().toLocaleDateString("sr-Latn"),
          days: [],
        };
        setPlans([plan, ...plans]);
        setIsCreating(false);
        setSelectedPlan(plan);
      })
      .finally(() => setSaving(false));
  }

  function handleAddDay(dayOfWeek: number) {
    if (!selectedPlan) return;
    const dayNumber = selectedPlan.days.length + 1;
    const weekdayName = getWeekdayName(dayOfWeek, "sr");

    createTrainingDay({
      plan_id: selectedPlan.id,
      day_number: dayNumber,
      day_of_week: dayOfWeek,
      day_name_sr: weekdayName,
      sort_order: dayOfWeek,
    })
      .then((result) => {
        const newDay: AdminTrainingDay = {
          id: result.id,
          dayName: weekdayName,
          dayOfWeek: dayOfWeek,
          focus: "",
          exercises: [],
        };
        const updated = { ...selectedPlan, days: [...selectedPlan.days, newDay] };
        setSelectedPlan(updated);
        setPlans(plans.map((p) => (p.id === updated.id ? updated : p)));
      })
      .catch(() => {
        const newDay: AdminTrainingDay = {
          id: `td${Date.now()}`,
          dayName: weekdayName,
          dayOfWeek: dayOfWeek,
          focus: "",
          exercises: [],
        };
        const updated = { ...selectedPlan, days: [...selectedPlan.days, newDay] };
        setSelectedPlan(updated);
        setPlans(plans.map((p) => (p.id === updated.id ? updated : p)));
      });
  }

  function handleAddExercise(dayId: string) {
    if (!selectedPlan) return;

    createTrainingExercise({
      day_id: dayId,
      sets: 3,
      reps: "10-12",
      rest_seconds: 60,
      sort_order: (selectedPlan.days.find((d) => d.id === dayId)?.exercises.length || 0) + 1,
    })
      .then(() => {})
      .catch(() => {});

    const newExercise: AdminTrainingExercise = {
      exerciseId: "",
      exerciseName: "",
      sets: 3,
      reps: "10-12",
      restSeconds: 60,
      notes: "",
    };
    const updated = {
      ...selectedPlan,
      days: selectedPlan.days.map((d) =>
        d.id === dayId ? { ...d, exercises: [...d.exercises, newExercise] } : d
      ),
    };
    setSelectedPlan(updated);
    setPlans(plans.map((p) => (p.id === updated.id ? updated : p)));
  }

  function handleExerciseChange(dayId: string, exIndex: number, field: string, value: string | number) {
    if (!selectedPlan) return;
    const updated = {
      ...selectedPlan,
      days: selectedPlan.days.map((d) => {
        if (d.id !== dayId) return d;
        const exercises = d.exercises.map((ex, i) => {
          if (i !== exIndex) return ex;
          if (field === "exerciseId") {
            const found = exerciseOptions.find((e) => e.id === value);
            return { ...ex, exerciseId: value as string, exerciseName: found?.name || "" };
          }
          return { ...ex, [field]: value };
        });
        return { ...d, exercises };
      }),
    };
    setSelectedPlan(updated);
    setPlans(plans.map((p) => (p.id === updated.id ? updated : p)));
  }

  function handleDayFieldChange(dayId: string, field: string, value: string | number) {
    if (!selectedPlan) return;
    const parsedValue = field === "dayOfWeek" ? Number(value) : value;
    const updated = {
      ...selectedPlan,
      days: selectedPlan.days.map((d) =>
        d.id === dayId ? { ...d, [field]: parsedValue } : d
      ),
    };
    setSelectedPlan(updated);
    setPlans(plans.map((p) => (p.id === updated.id ? updated : p)));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-[8px] max-sm:flex-col max-sm:items-start max-sm:gap-[12px]">
        <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white">
          {t("trainingTitle")}
        </h1>
        <button
          onClick={handleCreatePlan}
          className="bg-orange-500 text-white px-[20px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] hover:bg-orange-400 transition-colors flex items-center gap-[8px]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {t("createPlan")}
        </button>
      </div>
      <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[32px]">
        {plans.length} planova
      </p>

      {/* Create form */}
      {isCreating && (
        <div className="bg-white/[0.03] border border-orange-500/30 p-[24px] mb-[24px]">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white mb-[20px]">
            {t("createPlan")}
          </h2>
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-[16px]">
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("planName")}</label>
              <input
                type="text"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("selectClient")}</label>
              <select
                value={newPlan.clientId}
                onChange={(e) => setNewPlan({ ...newPlan, clientId: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
              >
                <option value="" className="bg-[#1A1A1A]">{t("selectClient")}</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#1A1A1A]">{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("daysPerWeek")}</label>
              <input
                type="number"
                min={1}
                max={7}
                value={newPlan.daysPerWeek}
                onChange={(e) => setNewPlan({ ...newPlan, daysPerWeek: parseInt(e.target.value) || 3 })}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("goal")}</label>
              <input
                type="text"
                value={newPlan.goal}
                onChange={(e) => setNewPlan({ ...newPlan, goal: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
              />
            </div>
          </div>
          <div className="flex gap-[12px] mt-[20px]">
            <button
              onClick={handleSavePlan}
              disabled={saving}
              className="bg-orange-500 text-white px-[20px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] hover:bg-orange-400 transition-colors disabled:opacity-50"
            >
              {saving ? "..." : t("save")}
            </button>
            <button onClick={() => setIsCreating(false)} className="border border-white/20 text-white/70 px-[20px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] hover:border-white/40 transition-colors">
              {t("cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Plans list */}
      <div className="space-y-[12px] mb-[32px]">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}
            className={`w-full text-left bg-white/[0.03] border p-[20px] hover:border-white/20 transition-colors ${
              selectedPlan?.id === plan.id ? "border-orange-500/30" : "border-white/10"
            }`}
          >
            <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-[8px]">
              <div>
                <h3 className="font-[family-name:var(--font-sora)] font-bold text-[16px] text-white">{plan.name}</h3>
                <p className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40 mt-[4px]">
                  {plan.clientName} &middot; {plan.daysPerWeek} dana/nedelja {plan.goal && <>·&nbsp;{plan.goal}</>}
                </p>
              </div>
              <div className="flex items-center gap-[12px]">
                <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30">{plan.createdAt}</span>
                <span className={`font-[family-name:var(--font-roboto)] text-[12px] px-[8px] py-[2px] ${statusColors[plan.status]}`}>
                  {t(plan.status === "active" ? "active" : plan.status === "draft" ? "draft" : "archived")}
                </span>
              </div>
            </div>
            {plan.days.length > 0 && (
              <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30 mt-[8px]">
                {plan.days.length} dana &middot; {plan.days.reduce((sum, d) => sum + d.exercises.length, 0)} vežbi
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Plan builder */}
      {selectedPlan && !isCreating && (
        <div className="bg-white/[0.03] border border-white/10 p-[24px]">
          <div className="flex items-center justify-between mb-[20px]">
            <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white">
              {selectedPlan.name}
            </h2>
            <div className="flex items-center gap-[8px]">
              <select
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val) handleAddDay(val);
                  e.target.value = "";
                }}
                defaultValue=""
                className="bg-orange-500/10 text-orange-400 px-[12px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] hover:bg-orange-500/20 transition-colors border-0 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="" disabled className="bg-[#1A1A1A]">+ {t("addDay")}</option>
                {WEEKDAYS.filter((w) => !selectedPlan.days.some((d) => d.dayOfWeek === w.value)).map((w) => (
                  <option key={w.value} value={w.value} className="bg-[#1A1A1A]">{w.label}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedPlan.days.length === 0 && (
            <p className="font-[family-name:var(--font-roboto)] text-[14px] text-white/30 text-center py-[32px]">
              Dodaj dane treninga klikom na &quot;{t("addDay")}&quot;
            </p>
          )}

          <div className="space-y-[16px]">
            {selectedPlan.days.map((day) => (
              <div key={day.id} className="border border-white/5 p-[16px]">
                <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-[12px] mb-[16px]">
                  <div>
                    <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("dayName")}</label>
                    <select
                      value={day.dayOfWeek || ""}
                      onChange={(e) => {
                        const dow = parseInt(e.target.value);
                        const name = getWeekdayName(dow, "sr");
                        handleDayFieldChange(day.id, "dayOfWeek", String(dow));
                        handleDayFieldChange(day.id, "dayName", name);
                      }}
                      className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
                    >
                      <option value="" className="bg-[#1A1A1A]">{t("dayName")}...</option>
                      {WEEKDAYS.map((w) => (
                        <option key={w.value} value={w.value} className="bg-[#1A1A1A]">{w.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("focus")}</label>
                    <input
                      type="text"
                      value={day.focus}
                      onChange={(e) => handleDayFieldChange(day.id, "focus", e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>

                {/* Exercises in this day */}
                {day.exercises.length > 0 && (
                  <div className="space-y-[8px] mb-[12px]">
                    {day.exercises.map((ex, exIndex) => (
                      <div key={exIndex} className="space-y-[8px] bg-white/[0.02] p-[10px] border border-white/5">
                        <div>
                          <label className="block font-[family-name:var(--font-roboto)] text-[11px] text-white/30 mb-[2px]">{t("selectExercise")}</label>
                          <select
                            value={ex.exerciseId}
                            onChange={(e) => handleExerciseChange(day.id, exIndex, "exerciseId", e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[6px] text-[13px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
                          >
                            <option value="" className="bg-[#1A1A1A]">{t("selectExercise")}</option>
                            {exerciseOptions.map((e) => (
                              <option key={e.id} value={e.id} className="bg-[#1A1A1A]">{e.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-3 gap-[8px]">
                          <div>
                            <label className="block font-[family-name:var(--font-roboto)] text-[11px] text-white/30 mb-[2px]">{t("sets")}</label>
                            <input
                              type="number"
                              value={ex.sets}
                              onChange={(e) => handleExerciseChange(day.id, exIndex, "sets", parseInt(e.target.value) || 0)}
                              className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[6px] text-[13px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
                            />
                          </div>
                          <div>
                            <label className="block font-[family-name:var(--font-roboto)] text-[11px] text-white/30 mb-[2px]">{t("reps")}</label>
                            <input
                              type="text"
                              value={ex.reps}
                              onChange={(e) => handleExerciseChange(day.id, exIndex, "reps", e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[6px] text-[13px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
                            />
                          </div>
                          <div>
                            <label className="block font-[family-name:var(--font-roboto)] text-[11px] text-white/30 mb-[2px]">{t("rest")}</label>
                            <input
                              type="number"
                              value={ex.restSeconds}
                              onChange={(e) => handleExerciseChange(day.id, exIndex, "restSeconds", parseInt(e.target.value) || 0)}
                              className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[6px] text-[13px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => handleAddExercise(day.id)}
                  className="text-orange-400/60 hover:text-orange-400 font-[family-name:var(--font-roboto)] text-[13px] transition-colors flex items-center gap-[4px]"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  {t("addExercise")}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
