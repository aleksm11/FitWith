import type { MetadataRoute } from "next";
import { exercises } from "@/lib/exercises/data";
import { blogPosts } from "@/lib/blog/data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onlinetrener.rs";

const locales = ["sr", "en", "ru"] as const;

const pages = [
  "",
  "/o-meni",
  "/saradnja",
  "/cene",
  "/kontakt",
  "/politika-privatnosti",
  "/vezbe",
  "/blog",
  "/transformacije",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : page === "/blog" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : page === "/blog" ? 0.9 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}${page}`])
          ),
        },
      });
    }
  }

  // Exercise detail pages
  for (const exercise of exercises) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/vezbe/${exercise.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/vezbe/${exercise.slug}`])
          ),
        },
      });
    }
  }

  // Blog post pages
  for (const post of blogPosts) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/blog/${post.slug}`])
          ),
        },
      });
    }
  }

  return entries;
}
