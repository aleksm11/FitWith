import {
  AboutHeroSection,
  AboutSection,
  CoreValuesSection,
  VideoSection,
  TeamSection,
  LogosSection,
  AboutCtaSection,
  Footer,
} from "@/components/sections";

export default function About() {
  return (
    <main className="flex flex-col items-center">
      <AboutHeroSection />
      <div className="flex flex-col gap-[140px] max-lg:gap-[80px] max-sm:gap-[60px] items-center w-full mt-[140px] max-lg:mt-[80px] max-sm:mt-[60px]">
        <AboutSection />
        <CoreValuesSection />
        <VideoSection />
      </div>
      <div className="flex flex-col gap-[140px] max-lg:gap-[80px] max-sm:gap-[60px] items-center w-full mt-[258px] max-lg:mt-[160px] max-sm:mt-[120px]">
        <TeamSection />
        <LogosSection />
      </div>
      <div className="flex flex-col gap-[80px] max-lg:gap-[60px] items-center w-full mt-[140px] max-lg:mt-[80px] max-sm:mt-[60px]">
        <AboutCtaSection />
        <Footer />
      </div>
      <div className="pb-[50px] max-sm:pb-[30px]" />
    </main>
  );
}
