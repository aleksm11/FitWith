import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import RegisterContent from "./RegisterContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });
  return {
    title: t("registerTitle"),
  };
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RegisterContent />;
}
