import Link from "next/link";

type ExerciseCardProps = {
  slug: string;
  name: string;
  category: string;
  muscleGroups: string[];
  locale: string;
};

export default function ExerciseCard({
  slug,
  name,
  category,
  muscleGroups,
  locale,
}: ExerciseCardProps) {
  return (
    <Link
      href={`/${locale}/vezbe/${slug}`}
      className="group bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-200"
    >
      {/* Thumbnail placeholder */}
      <div className="aspect-video bg-white/[0.02] flex items-center justify-center relative overflow-hidden">
        <svg
          className="w-12 h-12 text-white/10 group-hover:text-orange-500/30 transition-colors duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="p-[20px]">
        {/* Category badge */}
        <span className="inline-block font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1.5px] text-orange-500 bg-orange-500/10 px-[10px] py-[4px] mb-[12px]">
          {category}
        </span>

        {/* Name */}
        <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[18px] leading-[26px] text-white group-hover:text-orange-400 transition-colors duration-200">
          {name}
        </h3>

        {/* Muscle group tags */}
        <div className="mt-[10px] flex flex-wrap gap-[6px]">
          {muscleGroups.map((muscle) => (
            <span
              key={muscle}
              className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 border border-white/10 px-[8px] py-[2px]"
            >
              {muscle}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
