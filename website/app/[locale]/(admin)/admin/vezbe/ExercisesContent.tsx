"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  mockExercises,
  exerciseCategories as mockCategories,
  type AdminExercise,
} from "@/lib/admin/mock-data";
import {
  getExercises,
  getExerciseCategories,
  createExercise,
  updateExercise,
  deleteExercise,
  uploadFile,
} from "@/lib/supabase/queries";
import type { Exercise, ExerciseCategory } from "@/lib/supabase/types";

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-400",
  advanced: "bg-red-500/10 text-red-400",
};

type ExerciseForm = {
  name_sr: string;
  name_en: string;
  name_ru: string;
  slug: string;
  category_id: string;
  muscle_group: string;
  difficulty: string;
};

const emptyForm: ExerciseForm = {
  name_sr: "",
  name_en: "",
  name_ru: "",
  slug: "",
  category_id: "",
  muscle_group: "",
  difficulty: "beginner",
};

function exerciseToDisplay(ex: Exercise & { exercise_categories: ExerciseCategory | null }): AdminExercise {
  return {
    id: ex.id,
    slug: ex.slug,
    name: ex.name_sr,
    category: ex.exercise_categories?.slug || "",
    muscles: ex.muscle_group ? ex.muscle_group.split(",").map((m) => m.trim()) : [],
    difficulty: (ex.muscle_group?.includes("advanced") ? "advanced" : ex.muscle_group?.includes("intermediate") ? "intermediate" : "beginner") as AdminExercise["difficulty"],
    hasVideo: !!ex.video_url,
    createdAt: new Date(ex.created_at).toLocaleDateString("sr-Latn"),
  };
}

export default function ExercisesContent() {
  const t = useTranslations("Admin");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [exercises, setExercises] = useState<AdminExercise[]>(mockExercises);
  const [categories, setCategories] = useState<ExerciseCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<ExerciseForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    Promise.all([getExercises(), getExerciseCategories()])
      .then(([exData, catData]) => {
        if (exData && exData.length > 0) {
          setExercises(exData.map(exerciseToDisplay));
        }
        if (catData && catData.length > 0) {
          setCategories(catData);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categoryLabels: Record<string, string> = categories.length > 0
    ? Object.fromEntries(categories.map((c) => [c.slug, c.name_sr]))
    : {
        grudi: "Grudi",
        ledja: "Leđa",
        noge: "Noge",
        ramena: "Ramena",
        ruke: "Ruke",
        stomak: "Stomak",
        korektivne: "Korektivne",
        napredne: "Napredne",
      };

  const categoryOptions = categories.length > 0
    ? categories.map((c) => c.slug)
    : mockCategories;

  const filtered = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || ex.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  function handleCreate() {
    setIsCreating(true);
    setEditingId(null);
    setFormData(emptyForm);
    setVideoFile(null);
  }

  function handleEdit(exercise: AdminExercise) {
    setEditingId(exercise.id);
    setIsCreating(false);
    setFormData({
      name_sr: exercise.name,
      name_en: "",
      name_ru: "",
      slug: exercise.slug,
      category_id: categories.find((c) => c.slug === exercise.category)?.id || "",
      muscle_group: exercise.muscles.join(", "),
      difficulty: exercise.difficulty,
    });
    setVideoFile(null);
  }

  function handleSave() {
    setSaving(true);

    const doSave = async () => {
      let videoUrl: string | undefined;
      if (videoFile) {
        const path = `exercises/${formData.slug || Date.now()}-${videoFile.name}`;
        videoUrl = await uploadFile("videos", path, videoFile);
      }

      if (isCreating) {
        const result = await createExercise({
          name_sr: formData.name_sr,
          name_en: formData.name_en || formData.name_sr,
          name_ru: formData.name_ru || formData.name_sr,
          slug: formData.slug || formData.name_sr.toLowerCase().replace(/\s+/g, "-"),
          category_id: formData.category_id || undefined,
          muscle_group: formData.muscle_group || undefined,
        });
        if (videoUrl) {
          await updateExercise(result.id, { video_url: videoUrl } as Partial<Exercise>);
        }
        const newDisplay: AdminExercise = {
          id: result.id,
          slug: result.slug,
          name: result.name_sr,
          category: categories.find((c) => c.id === formData.category_id)?.slug || "",
          muscles: formData.muscle_group ? formData.muscle_group.split(",").map((m) => m.trim()) : [],
          difficulty: formData.difficulty as AdminExercise["difficulty"],
          hasVideo: !!videoUrl,
          createdAt: new Date().toLocaleDateString("sr-Latn"),
        };
        setExercises([newDisplay, ...exercises]);
      } else if (editingId) {
        await updateExercise(editingId, {
          name_sr: formData.name_sr,
          name_en: formData.name_en || formData.name_sr,
          name_ru: formData.name_ru || formData.name_sr,
          slug: formData.slug,
          category_id: formData.category_id || null,
          muscle_group: formData.muscle_group || null,
          ...(videoUrl ? { video_url: videoUrl } : {}),
        } as Partial<Exercise>);
        setExercises(
          exercises.map((ex) =>
            ex.id === editingId
              ? {
                  ...ex,
                  name: formData.name_sr,
                  slug: formData.slug,
                  category: categories.find((c) => c.id === formData.category_id)?.slug || ex.category,
                  muscles: formData.muscle_group ? formData.muscle_group.split(",").map((m) => m.trim()) : ex.muscles,
                  hasVideo: videoUrl ? true : ex.hasVideo,
                }
              : ex
          )
        );
      }
      handleCancel();
    };

    doSave().catch(() => {}).finally(() => setSaving(false));
  }

  function handleDelete(id: string) {
    deleteExercise(id).catch(() => {});
    setExercises(exercises.filter((ex) => ex.id !== id));
    if (editingId === id) handleCancel();
  }

  function handleCancel() {
    setIsCreating(false);
    setEditingId(null);
    setFormData(emptyForm);
    setVideoFile(null);
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
          {t("exercisesTitle")}
        </h1>
        <button
          onClick={handleCreate}
          className="bg-orange-500 text-white px-[20px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] hover:bg-orange-400 transition-colors flex items-center gap-[8px]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {t("createExercise")}
        </button>
      </div>
      <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[32px]">
        {filtered.length} vežbi
      </p>

      {/* Filters */}
      <div className="flex gap-[12px] mb-[24px] max-sm:flex-col">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search")}
          className="flex-1 bg-white/[0.03] border border-white/10 px-[16px] py-[10px] text-[14px] text-white font-[family-name:var(--font-roboto)] placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-colors"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white/[0.03] border border-white/10 px-[16px] py-[10px] text-[14px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50 transition-colors"
        >
          <option value="all" className="bg-[#1A1A1A]">Sve kategorije</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat} className="bg-[#1A1A1A]">{categoryLabels[cat] || cat}</option>
          ))}
        </select>
      </div>

      {/* Create/Edit form */}
      {(isCreating || editingId) && (
        <div className="bg-white/[0.03] border border-orange-500/30 p-[24px] mb-[24px]">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white mb-[20px]">
            {isCreating ? t("createExercise") : t("editExercise")}
          </h2>
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-[16px]">
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("exerciseName")} (SR)</label>
              <input
                type="text"
                value={formData.name_sr}
                onChange={(e) => setFormData({ ...formData, name_sr: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("slug")}</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("exerciseName")} (EN)</label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                placeholder={formData.name_sr || "English name"}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] placeholder:text-white/20 focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("exerciseName")} (RU)</label>
              <input
                type="text"
                value={formData.name_ru}
                onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                placeholder={formData.name_sr || "Russian name"}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] placeholder:text-white/20 focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("category")}</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
              >
                <option value="" className="bg-[#1A1A1A]">—</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#1A1A1A]">{cat.name_sr}</option>
                ))}
                {categories.length === 0 && categoryOptions.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#1A1A1A]">{categoryLabels[cat]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("difficulty")}</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
              >
                <option value="beginner" className="bg-[#1A1A1A]">{t("beginner")}</option>
                <option value="intermediate" className="bg-[#1A1A1A]">{t("intermediate")}</option>
                <option value="advanced" className="bg-[#1A1A1A]">{t("advanced")}</option>
              </select>
            </div>
            <div className="col-span-2 max-sm:col-span-1">
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("muscles")} (razdvojeni zarezom)</label>
              <input
                type="text"
                value={formData.muscle_group}
                onChange={(e) => setFormData({ ...formData, muscle_group: e.target.value })}
                placeholder="Grudi, Triceps, Ramena"
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] placeholder:text-white/30 focus:outline-none focus:border-orange-500/50"
              />
            </div>
            <div className="col-span-2 max-sm:col-span-1">
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[8px]">{t("uploadVideo")}</label>
              <div className="border-2 border-dashed border-white/10 p-[32px] flex flex-col items-center justify-center gap-[8px]">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center gap-[8px]">
                  <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <p className="font-[family-name:var(--font-roboto)] text-[14px] text-white/30">
                    {videoFile ? videoFile.name : t("videoPlaceholder")}
                  </p>
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-[12px] mt-[20px]">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-orange-500 text-white px-[20px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] hover:bg-orange-400 transition-colors disabled:opacity-50"
            >
              {saving ? "..." : t("save")}
            </button>
            <button
              onClick={handleCancel}
              className="border border-white/20 text-white/70 px-[20px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] hover:border-white/40 transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Exercise list */}
      <div className="bg-white/[0.03] border border-white/10 overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_160px_100px_80px] max-lg:hidden gap-[16px] px-[20px] py-[12px] border-b border-white/10 bg-white/[0.02]">
          <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("exerciseName")}</span>
          <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("category")}</span>
          <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("muscles")}</span>
          <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("difficulty")}</span>
          <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("actions")}</span>
        </div>

        {filtered.map((exercise, i) => (
          <div
            key={exercise.id}
            className={`grid grid-cols-[1fr_120px_160px_100px_80px] max-lg:grid-cols-1 gap-[16px] max-lg:gap-[8px] px-[20px] py-[14px] ${
              i < filtered.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <div className="flex items-center gap-[10px]">
              <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white">{exercise.name}</span>
              {!exercise.hasVideo && (
                <span className="text-[10px] text-white/30 bg-white/5 px-[6px] py-[1px]">No video</span>
              )}
            </div>
            <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/60 max-lg:pl-0">
              {categoryLabels[exercise.category] || exercise.category}
            </span>
            <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 truncate">
              {exercise.muscles.join(", ")}
            </span>
            <div>
              <span className={`inline-block font-[family-name:var(--font-roboto)] text-[12px] px-[8px] py-[2px] ${difficultyColors[exercise.difficulty]}`}>
                {t(exercise.difficulty)}
              </span>
            </div>
            <div className="flex gap-[8px]">
              <button
                onClick={() => handleEdit(exercise)}
                className="text-white/40 hover:text-orange-400 transition-colors"
                title={t("edit")}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(exercise.id)}
                className="text-white/40 hover:text-red-400 transition-colors"
                title={t("delete")}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
