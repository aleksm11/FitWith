import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ServicesContent from "./ServicesContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ServicesPage" });
  return {
    title: t("title"),
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ServicesContent />;
}
