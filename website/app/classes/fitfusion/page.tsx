import {
  ClassDetailHeroSection,
  ClassDetailAboutSection,
  ClassDetailBenefitsSection,
  ClassDetailGallerySection,
  ClassDetailRelatedSection,
  ClassDetailCtaSection,
  Footer,
} from "@/components/sections";

export default function FitFusion() {
  return (
    <main className="flex flex-col items-center">
      <ClassDetailHeroSection />
      <div className="flex flex-col gap-[140px] max-lg:gap-[80px] max-sm:gap-[60px] items-center w-full mt-[140px] max-lg:mt-[80px] max-sm:mt-[60px]">
        <ClassDetailAboutSection />
        <ClassDetailBenefitsSection />
        <ClassDetailGallerySection />
        <ClassDetailRelatedSection />
      </div>
      <div className="flex flex-col gap-[80px] max-lg:gap-[60px] items-center w-full mt-[140px] max-lg:mt-[80px] max-sm:mt-[60px]">
        <ClassDetailCtaSection />
        <Footer />
      </div>
      <div className="pb-[50px] max-sm:pb-[30px]" />
    </main>
  );
}
