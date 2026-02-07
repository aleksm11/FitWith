type BenefitCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  active?: boolean;
  className?: string;
};

export default function BenefitCard({
  title,
  description,
  icon,
  active = false,
  className = "",
}: BenefitCardProps) {
  return (
    <div
      className={`flex flex-col gap-[47px] items-center w-[241px] ${className}`}
    >
      {/* Icon container */}
      <div
        className={`w-[61px] h-[61px] flex items-center justify-center ${
          active
            ? "bg-[#F2FD84]"
            : "border-[0.5px] border-[#F2FD84]"
        }`}
      >
        <div className="w-[40px] h-[40px] flex items-center justify-center">
          {icon}
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-[30px] items-center text-center text-white w-full">
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
