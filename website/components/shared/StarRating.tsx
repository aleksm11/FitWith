import Image from "next/image";

type StarRatingProps = {
  rating: number;
  max?: number;
  className?: string;
};

export default function StarRating({
  rating,
  max = 5,
  className = "",
}: StarRatingProps) {
  return (
    <div className={`flex gap-[4px] items-center ${className}`}>
      {Array.from({ length: max }, (_, i) => (
        <Image
          key={i}
          src={
            i < rating
              ? "/assets/icons/icon-star-filled.svg"
              : "/assets/icons/icon-star-empty.svg"
          }
          alt={i < rating ? "Filled star" : "Empty star"}
          width={16}
          height={14}
        />
      ))}
    </div>
  );
}
