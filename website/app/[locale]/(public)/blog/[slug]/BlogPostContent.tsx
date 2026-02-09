"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Button from "@/components/shared/Button";
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/blog/data";

type Props = {
  slug: string;
};

function renderMarkdown(text: string) {
  const parts = text.split(/\n/);
  return parts.map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="font-[family-name:var(--font-sora)] font-bold text-[24px] leading-[32px] max-sm:text-[20px] max-sm:leading-[28px] text-white mt-[32px] mb-[16px]"
        >
          {line.replace("## ", "")}
        </h2>
      );
    }
    if (line.trim() === "") return null;
    return (
      <p
        key={i}
        className="font-[family-name:var(--font-roboto)] text-[16px] leading-[28px] text-white/70 mb-[16px]"
      >
        {line}
      </p>
    );
  });
}

export default function BlogPostContent({ slug }: Props) {
  const t = useTranslations("Blog");
  const locale = useLocale();

  const post = getBlogPostBySlug(slug);
  if (!post) return null;

  const related = getRelatedPosts(slug, 2);

  return (
    <>
      {/* Back button + Hero */}
      <section className="pt-[140px] pb-[40px] max-sm:pt-[100px] max-sm:pb-[20px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          <Button as="link" href={`/${locale}/blog`} variant="ghost" size="sm">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            {t("backToBlog")}
          </Button>
        </div>
      </section>

      {/* Article */}
      <section className="pb-[80px] max-sm:pb-[60px] bg-[#0A0A0A]">
        <div className="max-w-[800px] mx-auto px-[40px] max-sm:px-[20px]">
          {/* Tags */}
          <div className="flex flex-wrap gap-[6px] mb-[16px]">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/${locale}/blog`}
                className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1.5px] text-orange-500 bg-orange-500/10 px-[10px] py-[3px] hover:bg-orange-500/20 transition-colors"
              >
                {t(`tag_${tag}`)}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-sora)] font-bold text-[40px] leading-[48px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[24px]">
            {t(post.titleKey)}
          </h1>

          {/* Meta bar */}
          <div className="flex items-center gap-[24px] pb-[32px] mb-[32px] border-b border-white/10">
            <div className="flex items-center gap-[8px]">
              <div className="w-[36px] h-[36px] bg-orange-500/10 flex items-center justify-center text-orange-400 font-[family-name:var(--font-sora)] font-bold text-[14px]">
                AS
              </div>
              <div>
                <p className="font-[family-name:var(--font-roboto)] text-[13px] text-white">
                  {post.author}
                </p>
                <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30">
                  {post.date} &middot; {post.readTime} {t("readTime")}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-[48px]">
            {post.contentKeys.map((key) => (
              <div key={key}>{renderMarkdown(t(key))}</div>
            ))}
          </div>

          {/* Tags footer */}
          <div className="border-t border-white/10 pt-[24px]">
            <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30 uppercase tracking-wider mb-[12px]">
              {t("tags")}
            </p>
            <div className="flex flex-wrap gap-[8px]">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/${locale}/blog`}
                  className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50 border border-white/10 px-[12px] py-[6px] hover:border-orange-500/30 hover:text-orange-400 transition-colors"
                >
                  {t(`tag_${tag}`)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="py-[80px] max-sm:py-[60px] bg-[#111111]">
          <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
            <h2 className="font-[family-name:var(--font-sora)] font-bold text-[32px] leading-[40px] max-sm:text-[24px] max-sm:leading-[32px] text-white mb-[32px]">
              {t("relatedPosts")}
            </h2>

            <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-[24px]">
              {related.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/${locale}/blog/${rp.slug}`}
                  className="group bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-200 p-[24px]"
                >
                  <div className="flex flex-wrap gap-[6px] mb-[12px]">
                    {rp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1.5px] text-orange-500 bg-orange-500/10 px-[8px] py-[2px]"
                      >
                        {t(`tag_${tag}`)}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-[family-name:var(--font-sora)] font-bold text-[18px] leading-[26px] text-white group-hover:text-orange-400 transition-colors duration-200 mb-[8px]">
                    {t(rp.titleKey)}
                  </h3>
                  <p className="font-[family-name:var(--font-roboto)] text-[14px] leading-[22px] text-white/50 line-clamp-2 mb-[12px]">
                    {t(rp.excerptKey)}
                  </p>
                  <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30">
                    {rp.date} &middot; {rp.readTime} {t("readTime")}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
