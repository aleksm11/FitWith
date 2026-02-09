import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ExerciseListContent from "./ExerciseListContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Exercises" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ExercisesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ExerciseListContent />;
}
