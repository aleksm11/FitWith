"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import SectionHeading from "@/components/shared/SectionHeading";
import Button from "@/components/shared/Button";
import { getSortedBlogPosts } from "@/lib/blog/data";

export default function BlogPreview() {
  const t = useTranslations("Blog");
  const locale = useLocale();

  const latest = getSortedBlogPosts().slice(0, 3);

  return (
    <section className="py-[120px] max-sm:py-[80px] bg-[#111111]">
      <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-[64px] grid grid-cols-3 gap-[24px] max-lg:grid-cols-2 max-sm:grid-cols-1">
          {latest.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group bg-white/[0.03] border border-white/10 hover:border-orange-500/20 transition-all duration-300"
            >
              {/* Cover placeholder */}
              <div className="aspect-[16/9] bg-white/[0.02] flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white/[0.06] group-hover:text-orange-500/20 transition-colors duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>

              <div className="p-[24px] max-sm:p-[20px]">
                {/* Tags */}
                <div className="flex flex-wrap gap-[6px] mb-[12px]">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1.5px] text-orange-500 bg-orange-500/10 px-[10px] py-[3px]"
                    >
                      {t(`tag_${tag}`)}
                    </span>
                  ))}
                </div>

                <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[18px] leading-[26px] text-white group-hover:text-orange-400 transition-colors duration-200 mb-[8px]">
                  {t(post.titleKey)}
                </h3>

                <p className="font-[family-name:var(--font-roboto)] text-[14px] leading-[22px] text-white/50 line-clamp-2">
                  {t(post.excerptKey)}
                </p>

                <div className="mt-[16px] flex items-center gap-[12px]">
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

        <div className="mt-[48px] flex justify-center">
          <Button as="link" href={`/${locale}/blog`} variant="outline">
            {t("allPosts")}
          </Button>
        </div>
      </div>
    </section>
  );
}
