export type BlogPost = {
  slug: string;
  titleKey: string;
  excerptKey: string;
  contentKeys: string[];
  author: string;
  date: string;
  readTime: number;
  tags: string[];
  coverPlaceholder: "training" | "nutrition" | "mindset" | "recovery";
};

export const blogTags = [
  "trening",
  "ishrana",
  "oporavak",
  "motivacija",
  "suplementi",
  "gubitak-masti",
  "hipertrofija",
] as const;

export type BlogTag = (typeof blogTags)[number];

export const blogPosts: BlogPost[] = [
  {
    slug: "kako-poceti-sa-treningom",
    titleKey: "post1Title",
    excerptKey: "post1Excerpt",
    contentKeys: ["post1Content1", "post1Content2", "post1Content3", "post1Content4"],
    author: "Aleksandar Stojanović",
    date: "2026-02-05",
    readTime: 7,
    tags: ["trening", "motivacija"],
    coverPlaceholder: "training",
  },
  {
    slug: "proteini-komplet-vodic",
    titleKey: "post2Title",
    excerptKey: "post2Excerpt",
    contentKeys: ["post2Content1", "post2Content2", "post2Content3", "post2Content4"],
    author: "Aleksandar Stojanović",
    date: "2026-01-28",
    readTime: 9,
    tags: ["ishrana", "suplementi", "hipertrofija"],
    coverPlaceholder: "nutrition",
  },
  {
    slug: "vaznost-sna-za-oporavak",
    titleKey: "post3Title",
    excerptKey: "post3Excerpt",
    contentKeys: ["post3Content1", "post3Content2", "post3Content3"],
    author: "Aleksandar Stojanović",
    date: "2026-01-20",
    readTime: 6,
    tags: ["oporavak", "trening"],
    coverPlaceholder: "recovery",
  },
  {
    slug: "gubitak-masti-bez-gubitka-misica",
    titleKey: "post4Title",
    excerptKey: "post4Excerpt",
    contentKeys: ["post4Content1", "post4Content2", "post4Content3", "post4Content4"],
    author: "Aleksandar Stojanović",
    date: "2026-01-12",
    readTime: 8,
    tags: ["ishrana", "gubitak-masti", "trening"],
    coverPlaceholder: "mindset",
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit: number): BlogPost[] {
  const post = getBlogPostBySlug(slug);
  if (!post) return [];
  return blogPosts
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, limit);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter((p) => p.tags.includes(tag));
}
