import { Button } from "@/components/shared";

export default function TimetableCtaSection() {
  return (
    <section
      className="relative w-full h-[550px] max-lg:h-auto max-lg:min-h-[450px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/images/timetable-cta-bg.png')" }}
    >
      <div className="flex flex-col items-start justify-between h-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px] py-[80px] max-lg:py-[60px] max-sm:py-[40px] max-lg:gap-[40px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px] max-lg:text-[40px] max-lg:leading-[50px] max-sm:text-[30px] max-sm:leading-[40px] text-white w-[674px] max-lg:w-full">
          EXPLORE OUR DIVERSE CLASS SCHEDULE
        </h2>

        <div className="flex flex-col gap-[30px]">
          <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] text-white w-[305px] max-sm:w-full">
            Join FitFlex today and enjoy a variety of classes throughout the day!
          </p>
          <Button>VIEW FULL SCHEDULE</Button>
        </div>
      </div>
    </section>
  );
}
