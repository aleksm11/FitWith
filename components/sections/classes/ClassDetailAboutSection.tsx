import Image from "next/image";

const infoBlocks = [
  { label: "Type", value: "High-Intensity Interval Training (HIIT)" },
  { label: "Level", value: "Intermediate" },
  { label: "Duration", value: "60 minutes" },
];

const description =
  "Immerse yourself in a dynamic 60-minute session that combines heart-pounding cardio intervals with targeted strength exercises. FitFusion is designed to push your limits, alternating between intense bursts of activity and strategic recovery periods. Expect a full-body challenge that not only torches calories but also builds lean muscle, boosts endurance, and enhances overall fitness.";

export default function ClassDetailAboutSection() {
  return (
    <section className="w-full flex items-center justify-between px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px] max-lg:flex-col max-lg:gap-[60px]">
      {/* Left: Image */}
      <div className="relative w-[715px] h-[435px] max-lg:w-full max-lg:h-[300px] shrink-0">
        <Image
          src="/assets/images/class-detail-about.png"
          alt="FitFusion class session"
          fill
          className="object-cover"
        />
      </div>

      {/* Right: Info */}
      <div className="flex flex-col gap-[40px] max-lg:w-full">
        {infoBlocks.map((block) => (
          <div key={block.label} className="flex flex-col gap-[19px]">
            <span className="font-[family-name:var(--font-roboto)] font-semibold text-[16px] leading-[26px] text-white">
              {block.label}
            </span>
            <span className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] text-white opacity-60">
              {block.value}
            </span>
          </div>
        ))}
        <div className="flex flex-col gap-[19px]">
          <span className="font-[family-name:var(--font-roboto)] font-semibold text-[16px] leading-[26px] text-white">
            Description
          </span>
          <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] text-white opacity-60 w-[420px] max-lg:w-full">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
