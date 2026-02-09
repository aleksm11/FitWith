import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import AdminContent from "./AdminContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  return {
    title: t("title"),
  };
}

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdminContent />;
}
