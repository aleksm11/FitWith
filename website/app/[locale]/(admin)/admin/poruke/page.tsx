import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import MessagesContent from "./MessagesContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  return {
    title: t("messagesTitle"),
  };
}

export default async function MessagesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MessagesContent />;
}
