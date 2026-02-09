import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import PortalContent from "./PortalContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portal" });
  return {
    title: t("title"),
  };
}

export default async function PortalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PortalContent />;
}
