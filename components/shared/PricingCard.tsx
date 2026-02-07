import Image from "next/image";
import Button from "./Button";

type PricingCardProps = {
  planName: string;
  price: string;
  period?: string;
  frequency: string;
  features: string[];
  ctaText?: string;
  className?: string;
};

export default function PricingCard({
  planName,
  price,
  period = "/month",
  frequency,
  features,
  ctaText = "GET STARTED",
  className = "",
}: PricingCardProps) {
  return (
    <div
      className={`bg-white/[0.04] border-[0.5px] border-white flex flex-col gap-[40px] items-center py-[60px] w-[400px] max-xl:w-full max-lg:max-w-[400px] max-sm:py-[40px] max-sm:gap-[30px] ${className}`}
    >
      {/* Plan name & price */}
      <div className="flex flex-col gap-[24px] items-center px-[40px] text-center w-full">
        <p className="font-[family-name:var(--font-roboto)] font-semibold text-[16px] leading-[26px] text-white w-full">
          {planName}
        </p>
        <p className="text-[#F2FD84] w-full">
          <span className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px]">
            {price}
          </span>
          <span className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
            {period}
          </span>
        </p>
      </div>

      {/* Frequency bar */}
      <div className="bg-white/[0.06] flex items-center justify-center py-[18px] w-full">
        <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white text-center tracking-[1.6px]">
          {frequency}
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-[24px] items-start px-[40px] w-full">
        {features.map((feature) => (
          <div key={feature} className="flex gap-[20px] items-center w-full">
            <Image
              src="/assets/icons/icon-checkmark.svg"
              alt=""
              width={16}
              height={16}
              className="shrink-0"
            />
            <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] text-white opacity-60">
              {feature}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button className="w-[320px] max-sm:w-[calc(100%-40px)] font-[family-name:var(--font-sora)] font-semibold text-[16px] leading-[26px] tracking-[0.24px] px-[32px] py-[18px] inline-flex items-center justify-center bg-[#F2FD84] text-[#222] shadow-[0_4px_18px_rgba(242,253,132,0.09)]">
        {ctaText}
      </Button>
    </div>
  );
}
