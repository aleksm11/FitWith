import { Button } from "@/components/shared";

export default function AboutCtaSection() {
  return (
    <section
      className="relative w-full h-[550px] max-lg:h-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/images/about-cta-bg.png')" }}
    >
      <div className="flex flex-col gap-[80px] max-lg:gap-[50px] items-start justify-center h-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px] py-[80px] max-sm:py-[50px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px] max-lg:text-[42px] max-lg:leading-[52px] max-sm:text-[32px] max-sm:leading-[42px] text-white w-[596px] max-lg:w-full">
          READY TO EMBARK ON YOUR FITNESS JOURNEY WITH FITFLEX?
        </h2>
        <Button>JOIN NOW</Button>
      </div>
    </section>
  );
}
