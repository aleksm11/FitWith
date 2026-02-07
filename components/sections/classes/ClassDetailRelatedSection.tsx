import { Button, ServiceCardAlt } from "@/components/shared";

const relatedClasses = [
  { title: "CARDIO KICK", subtitle: "Kickboxing Cardio", level: "INTERMEDIATE", imageSrc: "/assets/images/class-4.png" },
  { title: "MINDFUL PILATES", subtitle: "Pilates", level: "INTERMEDIATE", imageSrc: "/assets/images/class-5.png" },
  { title: "CYCLE FUSION", subtitle: "Indoor Cycling", level: "INTERMEDIATE", imageSrc: "/assets/images/class-6.png" },
];

export default function ClassDetailRelatedSection() {
  return (
    <section className="w-full flex flex-col gap-[70px] px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px]">
      {/* Heading row */}
      <div className="flex items-end justify-between max-lg:flex-col max-lg:items-start max-lg:gap-[30px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px] max-lg:text-[42px] max-lg:leading-[52px] max-sm:text-[32px] max-sm:leading-[42px] w-[546px] max-lg:w-full">
          <span className="text-[#F2FD84]">YOU MAY </span>
          <span className="text-white">ALSO INTERESTED IN</span>
        </h2>
        <Button as="a" href="/classes">VIEW MORE</Button>
      </div>

      {/* Cards row */}
      <div className="flex gap-[20px] max-lg:flex-col max-lg:items-center">
        {relatedClasses.map((cls, index) => (
          <ServiceCardAlt
            key={cls.title}
            title={cls.title}
            subtitle={cls.subtitle}
            level={cls.level}
            imageSrc={cls.imageSrc}
            className={
              index === 1
                ? "!border-[#F2FD84] shadow-[4px_4px_20px_rgba(242,253,132,0.05)] [&_a]:!opacity-100 [&>div:first-child]:border-l [&>div:first-child]:border-r [&>div:first-child]:border-t [&>div:first-child]:border-[#F2FD84]"
                : ""
            }
          />
        ))}
      </div>
    </section>
  );
}
