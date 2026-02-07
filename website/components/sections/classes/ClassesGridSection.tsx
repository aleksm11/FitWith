import { ServiceCardAlt } from "@/components/shared";

const classesData = [
  { title: "FITFUSION", subtitle: "High-Intensity Interval Training (HIIT)", level: "INTERMEDIATE", imageSrc: "/assets/images/class-1.png", href: "/classes/fitfusion" },
  { title: "YOGA HARMONY", subtitle: "Vinyasa Flow", level: "ALL LEVELS", imageSrc: "/assets/images/class-2.png" },
  { title: "STRENGTH SCULPT", subtitle: "Strength Training", level: "BEGINNER", imageSrc: "/assets/images/class-3.png" },
  { title: "CARDIO KICK", subtitle: "Kickboxing Cardio", level: "ALL LEVELS", imageSrc: "/assets/images/class-4.png" },
  { title: "MINDFUL PILATES", subtitle: "Pilates", level: "BEGINNER", imageSrc: "/assets/images/class-5.png" },
  { title: "CYCLE FUSION", subtitle: "Indoor Cycling", level: "ALL LEVELS", imageSrc: "/assets/images/class-6.png" },
  { title: "ZEN STRETCH", subtitle: "Stretch and Relaxation", level: "INTERMEDIATE", imageSrc: "/assets/images/class-7.png" },
  { title: "DANCE CARDIO GROOVE", subtitle: "Dance Fitness", level: "ALL LEVELS", imageSrc: "/assets/images/class-8.png" },
  { title: "FUNCTIONAL FITNESS", subtitle: "CrossFit-inspired", level: "ADVANCED", imageSrc: "/assets/images/class-9.png" },
];

export default function ClassesGridSection() {
  return (
    <section className="w-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px]">
      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-x-[20px] gap-y-[40px] justify-items-center">
        {classesData.map((cls, index) => (
          <ServiceCardAlt
            key={cls.title}
            title={cls.title}
            subtitle={cls.subtitle}
            level={cls.level}
            imageSrc={cls.imageSrc}
            href={cls.href}
            className={
              index === 4
                ? "!border-[#F2FD84] shadow-[4px_4px_20px_rgba(242,253,132,0.05)] [&_a]:!opacity-100 [&>div:first-child]:border-l [&>div:first-child]:border-r [&>div:first-child]:border-t [&>div:first-child]:border-[#F2FD84]"
                : ""
            }
          />
        ))}
      </div>
    </section>
  );
}
