import Image from "next/image";

const points = [
  {
    title: "Personalized Training",
    description:
      "We create personalized workout plans designed specifically for your needs and goals, ensuring that every aspect of your fitness journey is customized to help you achieve success.",
  },
  {
    title: "Flexible Schedules",
    description:
      "Enjoy the flexibility of our fitness programs, offering early morning to late night classes, so you can choose the time that suits your schedule best.",
  },
  {
    title: "Latest Equipment",
    description:
      "Stay ahead in your fitness journey with cutting-edge technology that not only enhances your workouts but also provides real-time data and analysis to help you track your progress.",
  },
  {
    title: "Expert Nutritionists",
    description:
      "Our comprehensive fitness program goes beyond exercise; we also provide tailored meal plans to fuel your fitness journey. These nutritionally balanced meal plans are designed to support your specific fitness goals.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="flex flex-col w-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px]">
      {/* Heading */}
      <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px] max-lg:text-[40px] max-lg:leading-[50px] max-sm:text-[28px] max-sm:leading-[38px] text-white">
        WHY FITFLEX IS YOUR IDEAL FITNESS PARTNER
      </h2>

      {/* Content */}
      <div className="flex items-start justify-between w-full mt-[70px] max-lg:mt-[50px] max-sm:mt-[30px] max-lg:flex-col-reverse max-lg:gap-[40px]">
        {/* Left: Points */}
        <div className="flex flex-col gap-[40px]">
          {points.map((point) => (
            <div key={point.title} className="flex flex-col gap-[23px]">
              {/* Heading row */}
              <div className="flex gap-[26px] items-center">
                <Image
                  src="/assets/icons/icon-checkmark.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="shrink-0"
                />
                <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px] text-white">
                  {point.title}
                </h3>
              </div>
              {/* Description */}
              <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white opacity-60 pl-[50px] w-[663px] max-xl:w-full">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Right: Photo */}
        <div className="relative w-[400px] h-[479px] shrink-0 max-lg:w-full max-lg:h-[350px] max-sm:h-[280px]">
          <Image
            src="/assets/images/why-choose-us.png"
            alt="Why choose FitFlex"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
