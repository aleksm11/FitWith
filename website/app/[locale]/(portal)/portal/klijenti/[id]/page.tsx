import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ClientDetailContent from "./ClientDetailContent";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portal" });
  return {
    title: t("clientDetail"),
  };
}

export default async function ClientDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <ClientDetailContent clientId={id} />;
}
