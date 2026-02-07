import Image from "next/image";
import StarRating from "./StarRating";

type TestimonialCardProps = {
  quote: string;
  name: string;
  rating: number;
  imageSrc?: string;
  className?: string;
};

export default function TestimonialCard({
  quote,
  name,
  rating,
  imageSrc,
  className = "",
}: TestimonialCardProps) {
  return (
    <div
      className={`bg-white/[0.03] border-[0.5px] border-white flex gap-[40px] items-center pr-[40px] w-[610px] max-lg:w-full max-md:flex-col max-md:pr-0 max-md:gap-0 ${className}`}
    >
      {/* Photo */}
      <div className="relative w-[220px] h-[332px] shrink-0 max-md:w-full max-md:h-[240px]">
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
      {/* Text */}
      <div className="flex flex-col gap-[38px] items-start justify-center flex-1 min-w-0 max-md:p-[24px] max-md:gap-[24px]">
        <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] text-white opacity-60">
          {quote}
        </p>
        <div className="flex flex-col gap-[20px] items-start w-full">
          <StarRating rating={rating} />
          <p className="font-[family-name:var(--font-roboto)] font-bold text-[18px] leading-[28px] text-white">
            {name}
          </p>
        </div>
      </div>
    </div>
  );
}
