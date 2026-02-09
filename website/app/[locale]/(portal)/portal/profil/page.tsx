import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ProfileContent from "./ProfileContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portal" });
  return {
    title: t("profile"),
  };
}

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProfileContent />;
}
