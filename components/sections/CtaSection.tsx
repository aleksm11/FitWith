import { Button } from "@/components/shared";

export default function CtaSection() {
  return (
    <section
      className="relative w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/images/cta-bg.png')" }}
    >
      <div className="flex justify-end pr-[100px] max-xl:pr-[60px] max-lg:justify-center max-lg:pr-0 max-lg:px-[40px] max-sm:px-[20px]">
        <div className="flex flex-col items-start py-[115px] max-lg:items-center max-lg:text-center max-lg:py-[80px] max-sm:py-[60px]">
          <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px] max-lg:text-[40px] max-lg:leading-[50px] max-sm:text-[28px] max-sm:leading-[38px] text-white w-[656px] max-lg:w-full">
            READY TO START YOUR JOURNEY WITH FITFLEX?
          </h2>
          <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] text-white mt-[17px]">
            Reserve Your Spot Today!
          </p>
          <Button className="mt-[50px]">JOIN NOW</Button>
        </div>
      </div>
    </section>
  );
}
