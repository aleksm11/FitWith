import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import UsersContent from "./UsersContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });
  return {
    title: t("usersTitle"),
  };
}

export default async function UsersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <UsersContent />;
}
