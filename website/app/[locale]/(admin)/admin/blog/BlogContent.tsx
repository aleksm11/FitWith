"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  getAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  uploadFile,
} from "@/lib/supabase/queries";
import type { BlogPost } from "@/lib/supabase/types";

type PostForm = {
  title_sr: string;
  title_en: string;
  title_ru: string;
  slug: string;
  content_sr: string;
  content_en: string;
  content_ru: string;
  excerpt_sr: string;
  excerpt_en: string;
  excerpt_ru: string;
  tags: string;
  seo_title: string;
  seo_description: string;
};

const emptyForm: PostForm = {
  title_sr: "",
  title_en: "",
  title_ru: "",
  slug: "",
  content_sr: "",
  content_en: "",
  content_ru: "",
  excerpt_sr: "",
  excerpt_en: "",
  excerpt_ru: "",
  tags: "",
  seo_title: "",
  seo_description: "",
};

export default function BlogContent() {
  const t = useTranslations("Admin");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    getAllBlogPosts()
      .then((data) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleEdit(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      title_sr: post.title_sr,
      title_en: post.title_en,
      title_ru: post.title_ru,
      slug: post.slug,
      content_sr: post.content_sr || "",
      content_en: post.content_en || "",
      content_ru: post.content_ru || "",
      excerpt_sr: post.excerpt_sr || "",
      excerpt_en: post.excerpt_en || "",
      excerpt_ru: post.excerpt_ru || "",
      tags: (post.tags || []).join(", "),
      seo_title: post.seo_title || "",
      seo_description: post.seo_description || "",
    });
    setCoverFile(null);
    setShowForm(true);
  }

  function handleNew() {
    setEditingId(null);
    setForm(emptyForm);
    setCoverFile(null);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      let cover_image_url: string | undefined;
      if (coverFile) {
        const path = `blog/${Date.now()}-${coverFile.name}`;
        cover_image_url = await uploadFile("images", path, coverFile);
      }

      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: Partial<BlogPost> = {
        title_sr: form.title_sr,
        title_en: form.title_en,
        title_ru: form.title_ru,
        slug: form.slug,
        content_sr: form.content_sr || null,
        content_en: form.content_en || null,
        content_ru: form.content_ru || null,
        excerpt_sr: form.excerpt_sr || null,
        excerpt_en: form.excerpt_en || null,
        excerpt_ru: form.excerpt_ru || null,
        tags,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
      };

      if (cover_image_url) {
        payload.cover_image_url = cover_image_url;
      }

      if (editingId) {
        await updateBlogPost(editingId, payload);
        setPosts(posts.map((p) => (p.id === editingId ? { ...p, ...payload, tags } : p)));
      } else {
        const created = await createBlogPost({ ...payload, is_published: false });
        setPosts([created, ...posts]);
      }
      setShowForm(false);
    } catch {
      // Fallback: keep form open for retry
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      await deleteBlogPost(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch {
      // silent
    }
  }

  async function handleTogglePublish(post: BlogPost) {
    const is_published = !post.is_published;
    const published_at = is_published ? new Date().toISOString() : null;
    try {
      await updateBlogPost(post.id, { is_published, published_at });
      setPosts(posts.map((p) => (p.id === post.id ? { ...p, is_published, published_at } : p)));
    } catch {
      // silent
    }
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[čć]/g, "c")
      .replace(/š/g, "s")
      .replace(/ž/g, "z")
      .replace(/đ/g, "dj")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
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
            {editingId ? t("editPost") : t("createPost")}
          </h1>
          <button
            onClick={() => setShowForm(false)}
            className="font-[family-name:var(--font-roboto)] text-[14px] text-white/50 hover:text-white/70 transition-colors"
          >
            {t("cancel")}
          </button>
        </div>

        <div className="space-y-[24px]">
          {/* Title fields - SR, EN, RU */}
          <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-[16px]">
            {(["sr", "en", "ru"] as const).map((lang) => (
              <div key={lang}>
                <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase mb-[6px]">
                  {t("postTitle")} ({lang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={form[`title_${lang}`]}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((f) => ({
                      ...f,
                      [`title_${lang}`]: val,
                      ...(lang === "sr" && !editingId ? { slug: slugify(val) } : {}),
                    }));
                  }}
                  className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[10px] text-white font-[family-name:var(--font-roboto)] text-[14px] focus:border-orange-500/50 focus:outline-none"
                />
              </div>
            ))}
          </div>

          {/* Slug */}
          <div>
            <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase mb-[6px]">
              {t("postSlug")}
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full max-w-[400px] bg-white/[0.03] border border-white/10 px-[12px] py-[10px] text-white font-[family-name:var(--font-roboto)] text-[14px] focus:border-orange-500/50 focus:outline-none"
            />
          </div>

          {/* Content fields */}
          {(["sr", "en", "ru"] as const).map((lang) => (
            <div key={`content_${lang}`}>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase mb-[6px]">
                {t("postContent")} ({lang.toUpperCase()})
              </label>
              <textarea
                value={form[`content_${lang}`]}
                onChange={(e) => setForm((f) => ({ ...f, [`content_${lang}`]: e.target.value }))}
                rows={8}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[10px] text-white font-[family-name:var(--font-roboto)] text-[14px] focus:border-orange-500/50 focus:outline-none resize-y"
              />
            </div>
          ))}

          {/* Excerpt fields */}
          <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-[16px]">
            {(["sr", "en", "ru"] as const).map((lang) => (
              <div key={`excerpt_${lang}`}>
                <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase mb-[6px]">
                  {t("postExcerpt")} ({lang.toUpperCase()})
                </label>
                <textarea
                  value={form[`excerpt_${lang}`]}
                  onChange={(e) => setForm((f) => ({ ...f, [`excerpt_${lang}`]: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[10px] text-white font-[family-name:var(--font-roboto)] text-[14px] focus:border-orange-500/50 focus:outline-none resize-y"
                />
              </div>
            ))}
          </div>

          {/* Cover image */}
          <div>
            <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase mb-[6px]">
              {t("coverImage")}
            </label>
            <label className="inline-block cursor-pointer bg-white/[0.03] border border-white/10 px-[16px] py-[10px] hover:border-white/20 transition-colors">
              <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50">
                {coverFile ? coverFile.name : t("uploadImage")}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase mb-[6px]">
              {t("tags")}
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="trening, ishrana, saveti"
              className="w-full max-w-[400px] bg-white/[0.03] border border-white/10 px-[12px] py-[10px] text-white font-[family-name:var(--font-roboto)] text-[14px] focus:border-orange-500/50 focus:outline-none placeholder:text-white/20"
            />
          </div>

          {/* SEO */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[16px]">
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase mb-[6px]">
                {t("seoTitle")}
              </label>
              <input
                type="text"
                value={form.seo_title}
                onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[10px] text-white font-[family-name:var(--font-roboto)] text-[14px] focus:border-orange-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase mb-[6px]">
                {t("seoDescription")}
              </label>
              <input
                type="text"
                value={form.seo_description}
                onChange={(e) => setForm((f) => ({ ...f, seo_description: e.target.value }))}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[10px] text-white font-[family-name:var(--font-roboto)] text-[14px] focus:border-orange-500/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-[12px] pt-[8px]">
            <button
              onClick={handleSave}
              disabled={saving || !form.title_sr || !form.slug}
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
            {t("blogTitle")}
          </h1>
          <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50">
            {posts.filter((p) => p.is_published).length} objavljenih od {posts.length} članaka
          </p>
        </div>
        <button
          onClick={handleNew}
          className="bg-orange-500 hover:bg-orange-600 text-white px-[20px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] font-medium transition-colors"
        >
          + {t("createPost")}
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/10 p-[40px] text-center">
          <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/40">
            {t("noData")}
          </p>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_120px_120px_140px] max-lg:hidden gap-[16px] px-[20px] py-[12px] border-b border-white/10 bg-white/[0.02]">
            <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("postTitle")}</span>
            <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("status")}</span>
            <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("date")}</span>
            <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("actions")}</span>
          </div>

          {posts.map((post, i) => (
            <div
              key={post.id}
              className={`grid grid-cols-[1fr_120px_120px_140px] max-lg:grid-cols-1 gap-[16px] max-lg:gap-[8px] px-[20px] py-[14px] ${
                i < posts.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div>
                <p className="font-[family-name:var(--font-roboto)] text-[14px] text-white">{post.title_sr}</p>
                <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30">/{post.slug}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-[4px] mt-[4px] flex-wrap">
                    {post.tags.map((tag) => (
                      <span key={tag} className="font-[family-name:var(--font-roboto)] text-[10px] bg-white/5 text-white/40 px-[6px] py-[1px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <span
                  className={`inline-block font-[family-name:var(--font-roboto)] text-[12px] px-[8px] py-[2px] ${
                    post.is_published ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {post.is_published ? t("published") : t("unpublished")}
                </span>
              </div>
              <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40">
                {new Date(post.created_at).toLocaleDateString("sr-Latn")}
              </span>
              <div className="flex gap-[12px]">
                <button
                  onClick={() => handleEdit(post)}
                  className="font-[family-name:var(--font-roboto)] text-[12px] text-orange-400 hover:text-orange-300 transition-colors"
                >
                  {t("edit")}
                </button>
                <button
                  onClick={() => handleTogglePublish(post)}
                  className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 hover:text-white/60 transition-colors"
                >
                  {post.is_published ? t("unpublish") : t("publish")}
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="font-[family-name:var(--font-roboto)] text-[12px] text-red-400/60 hover:text-red-400 transition-colors"
                >
                  {t("delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
