import Image from "next/image";

type ServiceCardAltProps = {
  title: string;
  subtitle: string;
  level?: string;
  imageSrc?: string;
  href?: string;
  className?: string;
};

export default function ServiceCardAlt({
  title,
  subtitle,
  level = "INTERMEDIATE",
  imageSrc,
  href = "#",
  className = "",
}: ServiceCardAltProps) {
  return (
    <div
      className={`group flex flex-col items-end transition-all ${className}`}
    >
      {/* Photo area */}
      <div className="relative w-[400px] h-[340px] flex flex-col gap-[10px] items-center justify-center overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#d9d9d9]" />
        )}
        {/* Level badge */}
        <div className="absolute top-0 right-0 backdrop-blur-[9px] bg-white/[0.05] border-[0.5px] border-white flex items-center justify-center px-[18px] py-[15px]">
          <span className="font-[family-name:var(--font-roboto)] font-medium text-[16px] leading-[26px] tracking-[1.76px] text-white text-center">
            {level}
          </span>
        </div>
        {/* Hover button */}
        <a
          href={href}
          className="relative z-10 bg-[#F2FD84] text-[#222] font-[family-name:var(--font-sora)] font-semibold text-[16px] leading-[26px] tracking-[0.24px] px-[32px] py-[18px] shadow-[0_4px_18px_rgba(242,253,132,0.09)] opacity-0 group-hover:opacity-100 transition-opacity"
        >
          VIEW MORE
        </a>
      </div>
      {/* Text area */}
      <div className="backdrop-blur-[9px] bg-white/[0.02] border-[0.5px] border-white group-hover:border-[#F2FD84] group-hover:shadow-[4px_4px_20px_rgba(242,253,132,0.05)] flex flex-col gap-[20px] items-center px-[20px] py-[40px] text-center w-full transition-all">
        <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px] text-[#F2FD84]">
          {title}
        </h3>
        <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] text-white opacity-60">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
