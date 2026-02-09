"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { getSortedBlogPosts, blogTags } from "@/lib/blog/data";

const POSTS_PER_PAGE = 6;

const coverIcons: Record<string, React.ReactNode> = {
  training: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  ),
  nutrition: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
  ),
  recovery: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  ),
  mindset: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  ),
};

export default function BlogListContent() {
  const t = useTranslations("Blog");
  const locale = useLocale();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const sortedPosts = useMemo(() => getSortedBlogPosts(), []);

  const filtered = useMemo(() => {
    return sortedPosts.filter((post) => {
      const title = t(post.titleKey).toLowerCase();
      const excerpt = t(post.excerptKey).toLowerCase();
      const matchesSearch =
        !search || title.includes(search.toLowerCase()) || excerpt.includes(search.toLowerCase());
      const matchesTag = !activeTag || post.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [search, activeTag, t]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  function handleTagClick(tag: string) {
    setActiveTag(activeTag === tag ? null : tag);
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-[140px] pb-[60px] max-sm:pt-[100px] max-sm:pb-[40px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          <h1 className="font-[family-name:var(--font-sora)] font-bold text-[48px] leading-[56px] max-sm:text-[32px] max-sm:leading-[40px] text-white mb-[16px]">
            {t("title")}
          </h1>
          <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] max-sm:text-[16px] max-sm:leading-[26px] text-white/60 max-w-[640px]">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-[40px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          {/* Search */}
          <div className="mb-[24px]">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t("search")}
              className="w-full max-w-[400px] bg-white/[0.03] border border-white/10 px-[16px] py-[12px] text-[14px] text-white font-[family-name:var(--font-roboto)] placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-[8px]">
            <button
              onClick={() => { setActiveTag(null); setPage(1); }}
              className={`px-[16px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] transition-colors ${
                !activeTag
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                  : "bg-white/[0.03] text-white/50 border border-white/10 hover:border-white/20"
              }`}
            >
              {t("allPosts")}
            </button>
            {blogTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-[16px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] transition-colors ${
                  activeTag === tag
                    ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                    : "bg-white/[0.03] text-white/50 border border-white/10 hover:border-white/20"
                }`}
              >
                {t(`tag_${tag}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="pb-[80px] max-sm:pb-[60px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          {paginated.length === 0 ? (
            <div className="text-center py-[60px]">
              <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/40">
                {t("noResults")}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[24px]">
                {paginated.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/${locale}/blog/${post.slug}`}
                    className="group bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    {/* Cover placeholder */}
                    <div className="aspect-[16/9] bg-white/[0.02] flex items-center justify-center relative overflow-hidden">
                      <svg
                        className="w-16 h-16 text-white/[0.06] group-hover:text-orange-500/20 transition-colors duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                      >
                        {coverIcons[post.coverPlaceholder]}
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="p-[24px] max-sm:p-[20px]">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-[6px] mb-[12px]">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1.5px] text-orange-500 bg-orange-500/10 px-[10px] py-[3px]"
                          >
                            {t(`tag_${tag}`)}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] leading-[28px] max-sm:text-[18px] max-sm:leading-[26px] text-white group-hover:text-orange-400 transition-colors duration-200 mb-[8px]">
                        {t(post.titleKey)}
                      </h2>

                      {/* Excerpt */}
                      <p className="font-[family-name:var(--font-roboto)] text-[14px] leading-[22px] text-white/50 mb-[16px] line-clamp-2">
                        {t(post.excerptKey)}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-[16px]">
                        <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30">
                          {post.date}
                        </span>
                        <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30">
                          {post.readTime} {t("readTime")}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-[8px] mt-[48px]">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-[40px] h-[40px] flex items-center justify-center font-[family-name:var(--font-roboto)] text-[14px] transition-colors ${
                        page === p
                          ? "bg-orange-500 text-white"
                          : "bg-white/[0.03] text-white/50 border border-white/10 hover:border-white/20"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
