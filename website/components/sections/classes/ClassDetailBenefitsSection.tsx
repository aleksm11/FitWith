import Image from "next/image";
import { BenefitCard } from "@/components/shared";

const benefitsData = [
  { icon: "/assets/icons/benefit-1.svg", title: "Calorie Torch", description: "Burn a maximum number of calories in a short amount of time.", active: true },
  { icon: "/assets/icons/benefit-2.svg", title: "Full-Body Conditioning", description: "Target multiple muscle groups for a comprehensive workout.", active: false },
  { icon: "/assets/icons/benefit-3.svg", title: "Increased Endurance", description: "Boost cardiovascular stamina", active: true },
  { icon: "/assets/icons/benefit-4.svg", title: "Metabolic Boost", description: "Experience the afterburn effect for continued calorie burn post-workout.", active: false },
  { icon: "/assets/icons/benefit-5.svg", title: "Time Efficiency", description: "Achieve results with a time-efficient, intense workout.", active: false },
  { icon: "/assets/icons/benefit-6.svg", title: "Mental Focus", description: "Enhance mental resilience and focus through challenging intervals.", active: true },
  { icon: "/assets/icons/benefit-7.svg", title: "Adaptability", description: "Suitable for various fitness levels with adaptable exercises.", active: false },
  { icon: "/assets/icons/benefit-8.svg", title: "Community Engagement", description: "Join a supportive community for motivation and camaraderie.", active: true },
];

function BenefitRow({ items }: { items: typeof benefitsData }) {
  return (
    <div className="flex items-start justify-between w-full max-lg:flex-wrap max-lg:gap-[40px] max-lg:justify-center">
      {items.map((benefit, index) => (
        <div key={benefit.title} className="flex items-start">
          <BenefitCard
            title={benefit.title}
            description={benefit.description}
            icon={
              <Image
                src={benefit.icon}
                alt={benefit.title}
                width={40}
                height={40}
              />
            }
            active={benefit.active}
          />
          {index < items.length - 1 && (
            <div className="border-l border-white/20 h-[234px] mx-auto self-center max-lg:hidden" />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ClassDetailBenefitsSection() {
  const row1 = benefitsData.slice(0, 4);
  const row2 = benefitsData.slice(4, 8);

  return (
    <section className="w-full flex flex-col items-center gap-[70px] px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px]">
      <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px] max-lg:text-[42px] max-lg:leading-[52px] max-sm:text-[32px] max-sm:leading-[42px] text-white text-center">
        BENEFITS
      </h2>
      <div className="flex flex-col gap-[80px] w-full">
        <BenefitRow items={row1} />
        <BenefitRow items={row2} />
      </div>
    </section>
  );
}
