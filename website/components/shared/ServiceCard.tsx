import Image from "next/image";

type ServiceCardProps = {
  title: string;
  description: string;
  imageSrc?: string;
  href?: string;
  className?: string;
  titleClassName?: string;
};

export default function ServiceCard({
  title,
  description,
  imageSrc,
  href = "#",
  className = "",
  titleClassName = "",
}: ServiceCardProps) {
  return (
    <div className={`group flex flex-col items-center ${className}`}>
      {/* Photo area */}
      <div className="relative w-full h-[340px] max-lg:h-[280px] max-sm:h-[240px] flex items-center justify-center overflow-hidden">
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
        {/* Hover button */}
        <a
          href={href}
          className="relative z-10 border border-white text-white font-[family-name:var(--font-sora)] font-semibold text-[16px] leading-[26px] tracking-[0.24px] px-[32px] py-[18px] opacity-0 group-hover:opacity-100 transition-opacity"
        >
          VIEW MORE
        </a>
      </div>
      {/* Text area */}
      <div className="backdrop-blur-[9px] bg-white/[0.02] border-[0.5px] border-white flex flex-col gap-[20px] items-center px-[20px] py-[40px] text-center text-white w-full min-h-[196px]">
        <h3
          className={`font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px] group-hover:underline ${titleClassName}`}
        >
          {title}
        </h3>
        <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] opacity-60">
          {description}
        </p>
      </div>
    </div>
  );
}
