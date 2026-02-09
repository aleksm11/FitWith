"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  mockTrainingPlans,
  mockExercises,
  mockUsers,
  type AdminTrainingPlan,
  type AdminTrainingDay,
  type AdminTrainingExercise,
} from "@/lib/admin/mock-data";

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-400",
  draft: "bg-yellow-500/10 text-yellow-400",
  archived: "bg-white/5 text-white/40",
};

export default function TrainingContent() {
  const t = useTranslations("Admin");
  const [plans, setPlans] = useState(mockTrainingPlans);
  const [selectedPlan, setSelectedPlan] = useState<AdminTrainingPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    clientId: "",
    daysPerWeek: 3,
    goal: "",
  });

  const clients = mockUsers.filter((u) => u.role === "client");

  function handleCreatePlan() {
    setIsCreating(true);
    setSelectedPlan(null);
    setNewPlan({ name: "", clientId: "", daysPerWeek: 3, goal: "" });
  }

  function handleSavePlan() {
    const client = clients.find((c) => c.id === newPlan.clientId);
    const plan: AdminTrainingPlan = {
      id: `tp${Date.now()}`,
      name: newPlan.name,
      clientName: client?.fullName || "",
      clientId: newPlan.clientId,
      daysPerWeek: newPlan.daysPerWeek,
      goal: newPlan.goal,
      status: "draft",
      createdAt: new Date().toISOString().split("T")[0],
      days: [],
    };
    setPlans([plan, ...plans]);
    setIsCreating(false);
    setSelectedPlan(plan);
  }

  function handleAddDay() {
    if (!selectedPlan) return;
    const newDay: AdminTrainingDay = {
      id: `td${Date.now()}`,
      dayName: `Dan ${selectedPlan.days.length + 1}`,
      focus: "",
      exercises: [],
    };
    const updated = {
      ...selectedPlan,
      days: [...selectedPlan.days, newDay],
    };
    setSelectedPlan(updated);
    setPlans(plans.map((p) => (p.id === updated.id ? updated : p)));
  }

  function handleAddExercise(dayId: string) {
    if (!selectedPlan) return;
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
            const found = mockExercises.find((e) => e.id === value);
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

  function handleDayFieldChange(dayId: string, field: string, value: string) {
    if (!selectedPlan) return;
    const updated = {
      ...selectedPlan,
      days: selectedPlan.days.map((d) =>
        d.id === dayId ? { ...d, [field]: value } : d
      ),
    };
    setSelectedPlan(updated);
    setPlans(plans.map((p) => (p.id === updated.id ? updated : p)));
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
                  <option key={c.id} value={c.id} className="bg-[#1A1A1A]">{c.fullName}</option>
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
            <button onClick={handleSavePlan} className="bg-orange-500 text-white px-[20px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] hover:bg-orange-400 transition-colors">
              {t("save")}
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
                  {plan.clientName} &middot; {plan.daysPerWeek} dana/nedelja &middot; {plan.goal}
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
            <button
              onClick={handleAddDay}
              className="bg-orange-500/10 text-orange-400 px-[16px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] hover:bg-orange-500/20 transition-colors flex items-center gap-[6px]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {t("addDay")}
            </button>
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
                    <input
                      type="text"
                      value={day.dayName}
                      onChange={(e) => handleDayFieldChange(day.id, "dayName", e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
                    />
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
                      <div key={exIndex} className="grid grid-cols-[1fr_60px_80px_60px] max-sm:grid-cols-2 gap-[8px] items-end">
                        <div>
                          <label className="block font-[family-name:var(--font-roboto)] text-[11px] text-white/30 mb-[2px]">{t("selectExercise")}</label>
                          <select
                            value={ex.exerciseId}
                            onChange={(e) => handleExerciseChange(day.id, exIndex, "exerciseId", e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 px-[10px] py-[6px] text-[13px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
                          >
                            <option value="" className="bg-[#1A1A1A]">{t("selectExercise")}</option>
                            {mockExercises.map((e) => (
                              <option key={e.id} value={e.id} className="bg-[#1A1A1A]">{e.name}</option>
                            ))}
                          </select>
                        </div>
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
