import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import QuestionnairesContent from "./QuestionnairesContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  return {
    title: t("questionnairesTitle"),
  };
}

export default async function QuestionnairesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <QuestionnairesContent />;
}
