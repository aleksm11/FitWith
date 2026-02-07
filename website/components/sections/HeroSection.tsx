import { Button } from "@/components/shared";
import Navbar from "./Navbar";

const stats = [
  {
    number: "500+",
    title: "Happy Members",
    subtitle: "Our community is growing fast!",
  },
  {
    number: "30+",
    title: "Weekly Classes",
    subtitle: "Pick from various workouts",
  },
  {
    number: "10",
    title: "Certified Trainers",
    subtitle: "Guidance at every step.",
  },
  {
    number: "99%",
    title: "Customer Satisfaction",
    subtitle: "We ensure your progress satisfaction",
  },
];

export default function HeroSection() {
  return (
    <section
      className="relative w-full h-[800px] max-lg:h-auto max-lg:min-h-[600px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/images/hero-numbers-bg.png')" }}
    >
      <div className="flex flex-col h-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px] pt-[30px] max-lg:pb-[40px]">
        {/* Navbar */}
        <Navbar />

        {/* Hero Content */}
        <div className="flex flex-col mt-[109px] max-lg:mt-[60px] max-sm:mt-[40px]">
          <div className="flex flex-col gap-[50px]">
            <h1 className="font-[family-name:var(--font-sora)] font-bold text-[72px] leading-[82px] max-lg:text-[54px] max-lg:leading-[64px] max-sm:text-[36px] max-sm:leading-[46px] text-white w-[784px] max-xl:w-full">
              ACHIEVE MORE THAN JUST FITNESS
            </h1>
            <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] max-sm:text-[16px] max-sm:leading-[26px] text-white opacity-60 w-[536px] max-lg:w-full">
              Combine strength, flexibility, and endurance in a community that
              values well-rounded health and supportive growth.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-[18px] mt-[50px] max-sm:flex-col max-sm:gap-[12px]">
            <Button>START NOW</Button>
            <Button variant="outline">JOIN FREE TRIAL</Button>
          </div>
        </div>

        {/* Stats Bar - pushed to bottom */}
        <div className="mt-auto">
          <div className="backdrop-blur-[9px] bg-white/[0.03] border-[0.5px] border-white px-[40px] py-[44px] max-sm:px-[20px] max-sm:py-[30px] flex items-start justify-between w-full max-lg:flex-wrap max-lg:gap-[30px]">
            {stats.map((stat) => (
              <div key={stat.title} className="flex flex-col gap-[4px] max-lg:w-[calc(50%-15px)] max-sm:w-full">
                <span className="font-[family-name:var(--font-sora)] font-bold text-[42px] leading-[52px] max-sm:text-[32px] max-sm:leading-[42px] text-white">
                  {stat.number}
                </span>
                <span className="font-[family-name:var(--font-roboto)] font-semibold text-[16px] leading-[26px] text-white">
                  {stat.title}
                </span>
                <span className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white opacity-60">
                  {stat.subtitle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
