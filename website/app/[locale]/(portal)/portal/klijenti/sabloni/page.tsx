import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import TemplatesContent from "./TemplatesContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portal" });
  return {
    title: t("templates"),
  };
}

export default async function TemplatesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TemplatesContent />;
}
