"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  getTransformations,
  createTransformation,
  updateTransformation,
  deleteTransformation,
  uploadFile,
} from "@/lib/supabase/queries";
import type { Transformation } from "@/lib/supabase/types";

type TransformationForm = {
  client_name: string;
  description_sr: string;
  description_en: string;
  description_ru: string;
  duration: string;
  is_featured: boolean;
  sort_order: number;
};

const emptyForm: TransformationForm = {
  client_name: "",
  description_sr: "",
  description_en: "",
  description_ru: "",
  duration: "",
  is_featured: false,
  sort_order: 0,
};

export default function TransformationsContent() {
  const t = useTranslations("Admin");
  const [items, setItems] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TransformationForm>(emptyForm);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);

  useEffect(() => {
    getTransformations()
      .then((data) => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleEdit(item: Transformation) {
    setEditingId(item.id);
    setForm({
      client_name: item.client_name || "",
      description_sr: item.description_sr || "",
      description_en: item.description_en || "",
      description_ru: item.description_ru || "",
      duration: item.duration || "",
      is_featured: item.is_featured,
      sort_order: item.sort_order,
    });
    setBeforeFile(null);
    setAfterFile(null);
    setShowForm(true);
  }

  function handleNew() {
    setEditingId(null);
    setForm({ ...emptyForm, sort_order: items.length });
    setBeforeFile(null);
    setAfterFile(null);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      let before_image_url: string | undefined;
      let after_image_url: string | undefined;

      if (beforeFile) {
        const path = `transformations/${Date.now()}-before-${beforeFile.name}`;
        before_image_url = await uploadFile("images", path, beforeFile);
      }
      if (afterFile) {
        const path = `transformations/${Date.now()}-after-${afterFile.name}`;
        after_image_url = await uploadFile("images", path, afterFile);
      }

      const payload: Partial<Transformation> = {
        client_name: form.client_name || null,
        description_sr: form.description_sr || null,
        description_en: form.description_en || null,
        description_ru: form.description_ru || null,
        duration: form.duration || null,
        is_featured: form.is_featured,
        sort_order: form.sort_order,
      };

      if (before_image_url) payload.before_image_url = before_image_url;
      if (after_image_url) payload.after_image_url = after_image_url;

      if (editingId) {
        await updateTransformation(editingId, payload);
        setItems(items.map((item) => (item.id === editingId ? { ...item, ...payload } as Transformation : item)));
      } else {
        if (!before_image_url || !after_image_url) {
          setSaving(false);
          return;
        }
        const created = await createTransformation({
          ...payload,
          before_image_url,
          after_image_url,
        });
        setItems([...items, created]);
      }
      setShowForm(false);
    } catch {
      // keep form open for retry
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      await deleteTransformation(id);
      setItems(items.filter((item) => item.id !== id));
    } catch {
      // silent
    }
  }

  async function handleToggleFeatured(item: Transformation) {
    const is_featured = !item.is_featured;
    try {
      await updateTransformation(item.id, { is_featured });
      setItems(items.map((i) => (i.id === item.id ? { ...i, is_featured } : i)));
    } catch {
      // silent
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (showForm) {
    return (
      <div>
        <div className="flex items-center justify-between mb-[32px]">
          <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white">
            {editingId ? t("editTransformation") : t("createTransformation")}
          </h1>
          <button
            onClick={() => setShowForm(false)}
            className="font-[family-name:var(--font-roboto)] text-[14px] text-white/50 hover:text-white/70 transition-colors"
          >
            {t("cancel")}
          </button>
        </div>

        <div className="space-y-[24px]">
          {/* Client name + duration */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[16px]">
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase mb-[6px]">
                {t("clientName")}
              </label>
              <input
                type="text"
                value={form.client_name}
                onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[10px] text-white font-[family-name:var(--font-roboto)] text-[14px] focus:border-orange-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase mb-[6px]">
                {t("duration")}
              </label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="3 meseca"
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[10px] text-white font-[family-name:var(--font-roboto)] text-[14px] focus:border-orange-500/50 focus:outline-none placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Description fields - SR, EN, RU */}
          {(["sr", "en", "ru"] as const).map((lang) => (
            <div key={lang}>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase mb-[6px]">
                {t("description")} ({lang.toUpperCase()})
              </label>
              <textarea
                value={form[`description_${lang}`]}
                onChange={(e) => setForm((f) => ({ ...f, [`description_${lang}`]: e.target.value }))}
                rows={3}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[10px] text-white font-[family-name:var(--font-roboto)] text-[14px] focus:border-orange-500/50 focus:outline-none resize-y"
              />
            </div>
          ))}

          {/* Before / After images */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[16px]">
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase mb-[6px]">
                {t("beforeImage")} {!editingId && <span className="text-red-400">*</span>}
              </label>
              <label className="inline-block cursor-pointer bg-white/[0.03] border border-white/10 px-[16px] py-[10px] hover:border-white/20 transition-colors">
                <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">
                  {beforeFile ? beforeFile.name : t("uploadImage")}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setBeforeFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase mb-[6px]">
                {t("afterImage")} {!editingId && <span className="text-red-400">*</span>}
              </label>
              <label className="inline-block cursor-pointer bg-white/[0.03] border border-white/10 px-[16px] py-[10px] hover:border-white/20 transition-colors">
                <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">
                  {afterFile ? afterFile.name : t("uploadImage")}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAfterFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>

          {/* Sort order + Featured */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[16px]">
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase mb-[6px]">
                {t("sortOrder")}
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                className="w-full max-w-[120px] bg-white/[0.03] border border-white/10 px-[12px] py-[10px] text-white font-[family-name:var(--font-roboto)] text-[14px] focus:border-orange-500/50 focus:outline-none"
              />
            </div>
            <div className="flex items-end pb-[10px]">
              <label className="flex items-center gap-[8px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/60">
                  {t("featured")}
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-[12px] pt-[8px]">
            <button
              onClick={handleSave}
              disabled={saving || (!editingId && (!beforeFile || !afterFile))}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white px-[24px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] font-medium transition-colors"
            >
              {saving ? "..." : t("save")}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-white/20 text-white/50 px-[24px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] hover:border-white/40 hover:text-white/70 transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-[32px]">
        <div>
          <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[8px]">
            {t("transformationsTitle")}
          </h1>
          <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50">
            {items.length} transformacija, {items.filter((i) => i.is_featured).length} istaknutih
          </p>
        </div>
        <button
          onClick={handleNew}
          className="bg-orange-500 hover:bg-orange-600 text-white px-[20px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] font-medium transition-colors"
        >
          + {t("createTransformation")}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/10 p-[40px] text-center">
          <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/40">
            {t("noData")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[16px]">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white/[0.03] border border-white/10 overflow-hidden"
            >
              {/* Images row */}
              <div className="grid grid-cols-2 h-[200px]">
                <div className="relative bg-white/[0.02] flex items-center justify-center overflow-hidden">
                  {item.before_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.before_image_url}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/20">PRE</span>
                  )}
                  <span className="absolute bottom-[6px] left-[6px] bg-black/60 px-[6px] py-[2px] font-[family-name:var(--font-roboto)] text-[10px] text-white/60 uppercase">
                    Pre
                  </span>
                </div>
                <div className="relative bg-white/[0.02] flex items-center justify-center overflow-hidden">
                  {item.after_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.after_image_url}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/20">POSLE</span>
                  )}
                  <span className="absolute bottom-[6px] left-[6px] bg-black/60 px-[6px] py-[2px] font-[family-name:var(--font-roboto)] text-[10px] text-white/60 uppercase">
                    Posle
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-[16px]">
                <div className="flex items-center justify-between mb-[8px]">
                  <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[16px] text-white">
                    {item.client_name || "—"}
                  </h3>
                  <div className="flex items-center gap-[8px]">
                    {item.is_featured && (
                      <span className="font-[family-name:var(--font-roboto)] text-[10px] bg-orange-500/10 text-orange-400 px-[6px] py-[2px] uppercase">
                        {t("featured")}
                      </span>
                    )}
                    {item.duration && (
                      <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40">
                        {item.duration}
                      </span>
                    )}
                  </div>
                </div>
                {item.description_sr && (
                  <p className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50 mb-[12px] line-clamp-2">
                    {item.description_sr}
                  </p>
                )}
                <div className="flex gap-[12px]">
                  <button
                    onClick={() => handleEdit(item)}
                    className="font-[family-name:var(--font-roboto)] text-[12px] text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 hover:text-white/60 transition-colors"
                  >
                    {item.is_featured ? "Ukloni iz istaknutih" : "Istakni"}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="font-[family-name:var(--font-roboto)] text-[12px] text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
