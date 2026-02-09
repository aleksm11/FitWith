export type Transformation = {
  id: string;
  slug: string;
  nameKey: string;
  quoteKey: string;
  duration: string;
  weightBefore: string;
  weightAfter: string;
  goal: string;
  tier: "mentoring" | "training" | "nutrition";
};

export const transformations: Transformation[] = [
  {
    id: "t1",
    slug: "marko-p",
    nameKey: "transformation1Name",
    quoteKey: "transformation1Quote",
    duration: "12",
    weightBefore: "95kg",
    weightAfter: "82kg",
    goal: "gubitak-masti",
    tier: "mentoring",
  },
  {
    id: "t2",
    slug: "ana-m",
    nameKey: "transformation2Name",
    quoteKey: "transformation2Quote",
    duration: "16",
    weightBefore: "72kg",
    weightAfter: "61kg",
    goal: "gubitak-masti",
    tier: "mentoring",
  },
  {
    id: "t3",
    slug: "nikola-j",
    nameKey: "transformation3Name",
    quoteKey: "transformation3Quote",
    duration: "20",
    weightBefore: "68kg",
    weightAfter: "78kg",
    goal: "hipertrofija",
    tier: "training",
  },
  {
    id: "t4",
    slug: "jelena-i",
    nameKey: "transformation4Name",
    quoteKey: "transformation4Quote",
    duration: "10",
    weightBefore: "80kg",
    weightAfter: "68kg",
    goal: "gubitak-masti",
    tier: "mentoring",
  },
];

export function getTransformationBySlug(slug: string): Transformation | undefined {
  return transformations.find((t) => t.slug === slug);
}
