type ValueCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
};

export default function ValueCard({
  title,
  description,
  icon,
  className = "",
}: ValueCardProps) {
  return (
    <div
      className={`bg-white/[0.03] border-[0.5px] border-white flex flex-col gap-[80px] items-end pb-[30px] w-[295px] ${className}`}
    >
      {/* Icon */}
      <div className="relative">
        <div className="bg-[#F2FD84] w-[68px] h-[68px] flex items-center justify-center">
          <div className="w-[44px] h-[44px] flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-[30px] items-start px-[30px] w-full text-white">
        <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
          {title}
        </h3>
        <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] opacity-60">
          {description}
        </p>
      </div>
    </div>
  );
}
