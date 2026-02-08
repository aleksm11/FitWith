type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
};

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <h2 className="font-[family-name:var(--font-sora)] font-bold text-[40px] leading-[48px] max-lg:text-[32px] max-lg:leading-[40px] max-sm:text-[28px] max-sm:leading-[36px] text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] max-sm:text-[16px] max-sm:leading-[26px] text-white/70 max-w-[600px] mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
