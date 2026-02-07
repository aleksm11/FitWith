import Image from "next/image";

type ScheduleCardProps = {
  title: string;
  time: string;
  instructor: string;
  active?: boolean;
  className?: string;
};

export default function ScheduleCard({
  title,
  time,
  instructor,
  active = false,
  className = "",
}: ScheduleCardProps) {
  return (
    <div
      className={`flex flex-col gap-[30px] items-center px-[12px] py-[30px] w-[140px] ${
        active
          ? "bg-[#F2FD84]"
          : "bg-white/[0.03] border-[0.4px] border-white"
      } ${className}`}
    >
      {/* Icon */}
      <Image
        src="/assets/icons/icon-schedule.svg"
        alt=""
        width={27}
        height={17}
        className={active ? "invert" : ""}
        style={active ? { filter: "brightness(0)" } : { filter: "brightness(0) invert(1)" }}
      />

      {/* Text */}
      <div className="flex flex-col gap-[16px] items-center text-center w-full">
        <p
          className={`font-[family-name:var(--font-roboto)] font-semibold text-[16px] leading-[26px] ${
            active ? "text-[#222]" : "text-[#F2FD84]"
          }`}
        >
          {title}
        </p>
        <p
          className={`font-[family-name:var(--font-roboto)] text-[12px] leading-[22px] ${
            active ? "text-[#222]" : "text-white"
          }`}
        >
          {time}
        </p>
        <p
          className={`font-[family-name:var(--font-roboto)] text-[12px] leading-[22px] ${
            active ? "text-[#222] opacity-60" : "text-white opacity-60"
          }`}
        >
          {instructor}
        </p>
      </div>
    </div>
  );
}
