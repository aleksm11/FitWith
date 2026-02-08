import Button from "./Button";

type PricingCardProps = {
  planName: string;
  price: string;
  period: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
  className?: string;
};

export default function PricingCard({
  planName,
  price,
  period,
  features,
  ctaText,
  ctaHref,
  highlighted = false,
  badge,
  className = "",
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col items-center py-[48px] px-[32px] max-sm:py-[36px] max-sm:px-[24px] w-full max-w-[400px] border transition-all duration-300 ${
        highlighted
          ? "bg-white/[0.06] border-orange-500/50 shadow-[0_0_40px_rgba(249,115,22,0.1)]"
          : "bg-white/[0.03] border-white/10 hover:border-white/20"
      } ${className}`}
    >
      {badge && (
        <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-[12px] font-[family-name:var(--font-sora)] font-semibold px-[16px] py-[4px] tracking-wider uppercase">
          {badge}
        </div>
      )}

      <p className="font-[family-name:var(--font-roboto)] font-semibold text-[16px] leading-[26px] text-white/80 uppercase tracking-[1.6px]">
        {planName}
      </p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-[family-name:var(--font-sora)] font-bold text-[54px] leading-[64px] max-sm:text-[42px] max-sm:leading-[52px] text-orange-500">
          {price}
        </span>
        <span className="font-[family-name:var(--font-sora)] font-semibold text-[18px] leading-[28px] text-white/50">
          /{period}
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-[16px] w-full">
        {features.map((feature) => (
          <div key={feature} className="flex gap-[12px] items-start">
            <svg
              className="w-[20px] h-[20px] mt-[4px] shrink-0 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white/70">
              {feature}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 w-full">
        <Button
          as="link"
          href={ctaHref}
          variant={highlighted ? "primary" : "outline"}
          className="w-full"
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
}
