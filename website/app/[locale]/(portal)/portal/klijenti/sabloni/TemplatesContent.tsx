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
} from "@/lib/supabase/queries";
import type { PlanTemplate } from "@/lib/supabase/types";

type FormData = {
  name: string;
  type: "workout" | "nutrition";
  description: string;
  duration_weeks: number;
  difficulty: string;
  goal: string;
};

const emptyForm: FormData = {
  name: "",
  type: "workout",
  description: "",
  duration_weeks: 4,
  difficulty: "",
  goal: "",
};

export default function TemplatesContent() {
  const t = useTranslations("Portal");
  const locale = useLocale();

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
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(template: PlanTemplate) {
    setForm({
      name: template.name,
      type: template.type as "workout" | "nutrition",
      description: template.description || "",
      duration_weeks: template.duration_weeks,
      difficulty: template.difficulty || "",
      goal: template.goal || "",
    });
    setEditingId(template.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await updatePlanTemplate(editingId, {
          name: form.name,
          type: form.type,
          description: form.description || undefined,
          duration_weeks: form.duration_weeks,
          difficulty: form.difficulty || null,
          goal: form.goal || null,
        } as Partial<PlanTemplate>);
      } else {
        await createPlanTemplate({
          name: form.name,
          type: form.type,
          description: form.description || undefined,
          duration_weeks: form.duration_weeks,
          difficulty: form.difficulty || undefined,
          goal: form.goal || undefined,
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

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50">
          {t("adminOnly")}
        </p>
      </div>
    );
  }

  const filtered = filterType === "all"
    ? templates
    : templates.filter((t) => t.type === filterType);

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

      {/* Form modal */}
      {showForm && (
        <div className="bg-white/[0.03] border border-white/10 p-[32px] max-sm:p-[20px] mb-[24px]">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white mb-[24px]">
            {editingId ? t("editTemplate") : t("createTemplate")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-[16px]">
            <div className="grid grid-cols-2 gap-[16px] max-sm:grid-cols-1">
              <div>
                <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[6px]">
                  {t("templateName")} *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[6px]">
                  {t("templateType")} *
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as "workout" | "nutrition" })}
                  className="w-full bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white focus:border-orange-500/50 focus:outline-none cursor-pointer"
                >
                  <option value="workout" className="bg-[#1a1a1a]">{t("planType_workout")}</option>
                  <option value="nutrition" className="bg-[#1a1a1a]">{t("planType_nutrition")}</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-[16px] max-sm:grid-cols-1">
              <div>
                <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[6px]">
                  {t("templateDuration")}
                </label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={form.duration_weeks}
                  onChange={(e) => setForm({ ...form, duration_weeks: parseInt(e.target.value) || 4 })}
                  className="w-full bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white focus:border-orange-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[6px]">
                  {t("templateDifficulty")}
                </label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white focus:border-orange-500/50 focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-[#1a1a1a]">—</option>
                  <option value="beginner" className="bg-[#1a1a1a]">{t("difficulty_beginner")}</option>
                  <option value="intermediate" className="bg-[#1a1a1a]">{t("difficulty_intermediate")}</option>
                  <option value="advanced" className="bg-[#1a1a1a]">{t("difficulty_advanced")}</option>
                </select>
              </div>
              <div>
                <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[6px]">
                  {t("templateGoal")}
                </label>
                <input
                  type="text"
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[6px]">
                {t("templateDescription")}
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-white/[0.03] border border-white/10 px-[14px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none resize-none"
              />
            </div>
            <div className="flex items-center gap-[12px] pt-[8px]">
              <button
                type="submit"
                disabled={saving}
                className="bg-orange-500 text-white font-[family-name:var(--font-sora)] font-semibold text-[14px] px-[24px] py-[12px] hover:bg-orange-400 transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving ? t("saving") : editingId ? t("save") : t("create")}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="font-[family-name:var(--font-roboto)] text-[14px] text-white/50 hover:text-white transition-colors cursor-pointer px-[16px] py-[12px]"
              >
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
            <p className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-white/50">
              {t("noTemplates")}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-[16px] max-lg:grid-cols-1">
          {filtered.map((template) => (
            <div key={template.id} className="bg-white/[0.03] border border-white/10 p-[24px]">
              <div className="flex items-start justify-between mb-[12px]">
                <div>
                  <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[18px] text-white">
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-[8px] mt-[6px]">
                    <span className={`font-[family-name:var(--font-roboto)] text-[11px] px-[8px] py-[2px] ${
                      template.type === "workout" ? "text-blue-400 bg-blue-400/10" : "text-orange-400 bg-orange-400/10"
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
                  </div>
                </div>
                <div className="flex items-center gap-[8px]">
                  <button
                    onClick={() => openEditForm(template)}
                    className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 hover:text-orange-400 transition-colors cursor-pointer"
                  >
                    {t("editTemplate")}
                  </button>
                  {confirmDeleteId === template.id ? (
                    <div className="flex items-center gap-[6px]">
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="font-[family-name:var(--font-roboto)] text-[12px] text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        {t("confirmDelete")}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30 hover:text-white transition-colors cursor-pointer"
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(template.id)}
                      className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      {t("deleteTemplate")}
                    </button>
                  )}
                </div>
              </div>
              {template.description && (
                <p className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50 mb-[8px]">
                  {template.description}
                </p>
              )}
              {template.goal && (
                <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30">
                  {t("templateGoal")}: {template.goal}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
