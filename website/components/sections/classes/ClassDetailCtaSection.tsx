import { Button } from "@/components/shared";

export default function ClassDetailCtaSection() {
  return (
    <section
      className="relative w-full h-[550px] max-lg:h-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/images/class-detail-cta-bg.png')" }}
    >
      <div className="flex items-end justify-between h-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px] py-[80px] max-sm:py-[50px] max-lg:flex-col max-lg:items-start max-lg:justify-end max-lg:gap-[40px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px] max-lg:text-[42px] max-lg:leading-[52px] max-sm:text-[32px] max-sm:leading-[42px] text-white w-[810px] max-lg:w-full">
          READY TO EXPERIENCE THE INTENSITY AND VERSATILITY OF FITFUSION?
        </h2>
        <Button>SIGN UP FOR THE CLASS</Button>
      </div>
    </section>
  );
}
