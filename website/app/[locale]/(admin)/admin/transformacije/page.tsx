import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import TransformationsContent from "./TransformationsContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  return {
    title: t("transformations"),
  };
}

export default async function TransformationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TransformationsContent />;
}
