import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import LoginContent from "./LoginContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });
  return {
    title: t("loginTitle"),
  };
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
