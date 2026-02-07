import Image from "next/image";
import { ValueCard } from "@/components/shared";

const InclusivityIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.93 23.68C14.93 23.68 10.07 8.47 10.07 3.88C10.07 1.74 11.8 0 13.95 0C16.09 0 17.82 1.74 17.82 3.88C17.82 8.47 12.96 23.68 12.96 23.68" fill="currentColor"/>
    <path d="M29.07 23.68C29.07 23.68 24.21 8.47 24.21 3.88C24.21 1.74 25.94 0 28.08 0C30.23 0 31.96 1.74 31.96 3.88C31.96 8.47 27.1 23.68 27.1 23.68" fill="currentColor"/>
    <path d="M22 0C20.19 0 18.72 1.47 18.72 3.28V10.56C18.72 12.37 20.19 13.84 22 13.84C23.81 13.84 25.28 12.37 25.28 10.56V3.28C25.28 1.47 23.81 0 22 0Z" fill="currentColor"/>
    <path d="M10.28 23.8C10.28 23.8 4.46 30.95 1.82 33.59C0.3 35.11 0.3 37.58 1.82 39.1C3.34 40.62 5.81 40.62 7.33 39.1C9.97 36.46 17.12 30.64 17.12 30.64" fill="currentColor"/>
    <path d="M7.63 31.57C7.63 31.57 1.83 37.37 0 39.2C-0.73 39.93 -0.73 41.11 0 41.84C0.73 42.57 1.91 42.57 2.64 41.84C4.47 40.01 10.27 34.21 10.27 34.21" fill="currentColor"/>
    <path d="M33.72 23.8C33.72 23.8 39.54 30.95 42.18 33.59C43.7 35.11 43.7 37.58 42.18 39.1C40.66 40.62 38.19 40.62 36.67 39.1C34.03 36.46 26.88 30.64 26.88 30.64" fill="currentColor"/>
    <path d="M36.37 31.57C36.37 31.57 42.17 37.37 44 39.2C44.73 39.93 44.73 41.11 44 41.84C43.27 42.57 42.09 42.57 41.36 41.84C39.53 40.01 33.73 34.21 33.73 34.21" fill="currentColor"/>
  </svg>
);

const InnovationIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32.23 10.24C32.23 10.24 32.23 10.24 32.23 10.24C28.57 6.58 23.64 5.05 18.87 5.65C12.31 6.47 6.87 11.52 5.57 18.02C4.37 24.02 6.59 29.68 10.89 33.18C12.36 34.38 13.2 36.16 13.2 38.04V44H30.8V38.04C30.8 36.16 31.64 34.38 33.12 33.18C37.06 29.96 39.6 25.08 39.6 19.58C39.6 16.08 38.41 12.42 32.23 10.24Z" fill="currentColor"/>
    <circle cx="22" cy="22" r="6.82" fill="#F2FD84"/>
    <path d="M15.44 28.56C15.44 28.56 28.56 28.56 28.56 28.56C28.56 32.18 25.62 35.12 22 35.12C18.38 35.12 15.44 32.18 15.44 28.56Z" fill="currentColor"/>
  </svg>
);

const PersonalizationIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="5.5" r="3.67" fill="currentColor"/>
    <rect x="14.67" y="40.33" width="14.67" height="3.67" rx="1.83" fill="currentColor"/>
    <rect x="20.17" y="33.46" width="3.67" height="10.54" fill="currentColor"/>
    <rect x="20.17" y="22.92" width="3.67" height="9.63" fill="currentColor"/>
    <path d="M12.83 29.33C12.83 29.33 18.33 29.33 18.33 29.33V36.67C18.33 36.67 12.83 36.67 12.83 36.67C12.83 36.67 12.83 29.33 12.83 29.33Z" fill="currentColor"/>
    <path d="M14.67 11C14.67 11 29.33 11 29.33 11V25.67C29.33 25.67 14.67 25.67 14.67 25.67C14.67 25.67 14.67 11 14.67 11Z" fill="currentColor"/>
    <rect y="12.83" width="9.17" height="12.83" fill="currentColor"/>
    <rect x="34.83" y="12.83" width="9.17" height="12.83" fill="currentColor"/>
    <path d="M3.67 3.67C3.67 3.67 14.67 3.67 14.67 3.67V11C14.67 11 3.67 11 3.67 11V3.67Z" fill="currentColor"/>
  </svg>
);

const values = [
  {
    title: "Community",
    description: "Fostering a sense of belonging and support.",
    icon: (
      <Image
        src="/assets/icons/icon-community.svg"
        alt="Community icon"
        width={44}
        height={44}
        className="text-[#222]"
      />
    ),
  },
  {
    title: "Inclusivity",
    description: "Embracing diversity in fitness for all body types and abilities.",
    icon: <InclusivityIcon />,
  },
  {
    title: "Innovation",
    description: "Offering cutting-edge workouts and technology.",
    icon: <InnovationIcon />,
  },
  {
    title: "Personalization",
    description: "Tailoring fitness plans to individual needs.",
    icon: <PersonalizationIcon />,
  },
];

export default function CoreValuesSection() {
  return (
    <section className="flex flex-col gap-[70px] items-center w-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px]">
      {/* Heading */}
      <div className="flex flex-col gap-[40px] items-center text-center w-full">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px] max-lg:text-[42px] max-lg:leading-[52px] max-sm:text-[32px] max-sm:leading-[42px] text-white">
          OUR CORE VALUES
        </h2>
        <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] max-sm:text-[16px] max-sm:leading-[26px] text-white opacity-60">
          guide everything we do
        </p>
      </div>

      {/* Value Cards */}
      <div className="flex items-start justify-between w-full max-lg:flex-wrap max-lg:justify-center max-lg:gap-[20px]">
        {values.map((value) => (
          <ValueCard
            key={value.title}
            title={value.title}
            description={value.description}
            icon={value.icon}
          />
        ))}
      </div>
    </section>
  );
}
