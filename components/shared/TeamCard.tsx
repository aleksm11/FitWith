import Image from "next/image";

type TeamCardProps = {
  name: string;
  role: string;
  imageSrc?: string;
  className?: string;
};

export default function TeamCard({
  name,
  role,
  imageSrc,
  className = "",
}: TeamCardProps) {
  return (
    <div
      className={`group backdrop-blur-[9px] bg-white/[0.03] border-[0.5px] border-white hover:border-[#F2FD84] hover:shadow-[4px_4px_20px_rgba(242,253,132,0.05)] flex flex-col gap-[32px] items-center pt-[25px] px-[25px] pb-[40px] w-[400px] transition-all ${className}`}
    >
      {/* Photo + Button */}
      <div className="flex flex-col items-center pb-[48px]">
        <div className="relative w-[350px] h-[350px] mb-[-48px] overflow-hidden">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[#d9d9d9]" />
          )}
        </div>
        <button className="relative z-10 bg-[#F2FD84] text-[#222] font-[family-name:var(--font-sora)] font-semibold text-[16px] leading-[26px] tracking-[0.24px] px-[32px] py-[18px] shadow-[0_4px_18px_rgba(242,253,132,0.09)] mb-[-48px]">
          BOOK NOW
        </button>
      </div>

      {/* Profile info */}
      <div className="flex flex-col gap-[26px] items-center text-white">
        <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
          {name}
        </h3>
        <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] opacity-60">
          {role}
        </p>
      </div>
    </div>
  );
}
