import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import PricingContent from "./PricingContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pricing" });
  return {
    title: t("title"),
  };
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onlinetrener.rs";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "Person",
      name: "Aleksandar Stojanović",
    },
    name: "Online Fitness Coaching",
    description: "Personalized training plans, nutrition plans, and comprehensive online mentoring.",
    url: `${BASE_URL}/${locale}/cene`,
    offers: [
      {
        "@type": "Offer",
        name: "Training Plan",
        price: "40",
        priceCurrency: "EUR",
        description: "Custom training plan tailored to your goals",
      },
      {
        "@type": "Offer",
        name: "Nutrition Plan",
        price: "40",
        priceCurrency: "EUR",
        description: "Personalized nutrition plan based on your needs",
      },
      {
        "@type": "Offer",
        name: "Online Mentoring",
        price: "80",
        priceCurrency: "EUR",
        description: "Complete coaching package: training + nutrition + weekly check-ins",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PricingContent />
    </>
  );
}
