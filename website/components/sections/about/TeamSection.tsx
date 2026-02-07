import { Button, TeamCard } from "@/components/shared";

const teamMembers = [
  {
    name: "Alexandra Rodriguez",
    role: "Strength & Conditioning Specialist",
    imageSrc: "/assets/images/team-1.png",
  },
  {
    name: "David Chen",
    role: "Certified Yoga Instructor",
    imageSrc: "/assets/images/team-2.png",
    highlighted: true,
  },
  {
    name: "Emily Turner",
    role: "Nutrition and Wellness Coach",
    imageSrc: "/assets/images/team-3.png",
  },
  {
    name: "Mark Johnson",
    role: "High-Intensity Interval Training (HIIT) Expert",
    imageSrc: "/assets/images/team-4.png",
  },
  {
    name: "Dr. Maya Patel",
    role: "Injury Prevention Specialist",
    imageSrc: "/assets/images/team-5.png",
  },
  {
    name: "Sophie Nguyen",
    role: "Pilates and Flexibility Trainer",
    imageSrc: "/assets/images/team-6.png",
  },
];

export default function TeamSection() {
  return (
    <section className="flex flex-col gap-[70px] items-center w-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px]">
      {/* Header */}
      <div className="flex items-end justify-between w-full max-sm:flex-col max-sm:items-start max-sm:gap-[30px]">
        <div className="flex flex-col gap-[38px] text-white">
          <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px] max-lg:text-[42px] max-lg:leading-[52px] max-sm:text-[32px] max-sm:leading-[42px]">
            MEET THE EXPERT
          </h2>
          <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] max-sm:text-[16px] max-sm:leading-[26px] opacity-60">
            Each member of our team brings unique expertise to ensure a
            well-rounded and holistic fitness experience.
          </p>
        </div>
        <Button>SEE MORE</Button>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-x-[20px] gap-y-[30px] w-full justify-items-center">
        {teamMembers.map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            imageSrc={member.imageSrc}
            className={
              member.highlighted
                ? "!border-[#F2FD84] !border-[1px] shadow-[4px_4px_20px_rgba(242,253,132,0.05)]"
                : ""
            }
          />
        ))}
      </div>
    </section>
  );
}
