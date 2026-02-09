import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import QuestionnaireContent from "./QuestionnaireContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Questionnaire" });
  return {
    title: t("title"),
  };
}

export default async function QuestionnairePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <QuestionnaireContent />;
}
