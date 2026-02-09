import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import TrainingContent from "./TrainingContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  return {
    title: t("trainingTitle"),
  };
}

export default async function TrainingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TrainingContent />;
}
