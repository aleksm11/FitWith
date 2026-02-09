import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  HeroSection,
  ServicesPreview,
  TransformationsPreview,
  PricingPreview,
  WhyChooseSection,
  CtaSection,
} from "@/components/sections";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onlinetrener.rs";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: "FitWith — Online Fitness Coaching",
        description:
          "Personalized fitness coaching by Aleksandar Stojanović. Training plans, nutrition plans, and online mentoring.",
        url: `${BASE_URL}/${locale}`,
        telephone: "+381 63 XXX XXXX",
        email: "info@onlinetrener.rs",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Belgrade",
          addressCountry: "RS",
        },
        priceRange: "€40-€80",
      },
      {
        "@type": "Person",
        name: "Aleksandar Stojanović",
        jobTitle: "Certified Fitness Coach",
        description:
          "Graduate of DIF Belgrade, certified by Dušan Petrović. 4+ years of experience, 100+ satisfied clients.",
        url: `${BASE_URL}/${locale}/o-meni`,
        knowsAbout: [
          "Fitness Training",
          "Nutrition Planning",
          "Personal Coaching",
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <ServicesPreview />
      <TransformationsPreview />
      <PricingPreview />
      <WhyChooseSection />
      <CtaSection />
    </>
  );
}
