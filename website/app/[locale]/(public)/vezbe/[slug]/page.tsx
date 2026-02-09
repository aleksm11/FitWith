import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { exercises, getExerciseBySlug } from "@/lib/exercises/data";
import ExerciseDetailContent from "./ExerciseDetailContent";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return exercises.map((exercise) => ({
    slug: exercise.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const exercise = getExerciseBySlug(slug);
  if (!exercise) return {};
  const t = await getTranslations({ locale, namespace: "Exercises" });
  return {
    title: t(exercise.nameKey),
    description: t(exercise.descKey),
  };
}

export default async function ExerciseDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const exercise = getExerciseBySlug(slug);
  if (!exercise) notFound();

  return <ExerciseDetailContent slug={slug} />;
}
