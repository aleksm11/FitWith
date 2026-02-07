import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="flex items-center justify-between w-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px] max-lg:flex-col max-lg:gap-[50px]">
      {/* Photos */}
      <div className="flex gap-[20px] items-center shrink-0 max-lg:w-full max-lg:justify-center">
        <div className="relative w-[200px] h-[400px] max-sm:w-[140px] max-sm:h-[280px] overflow-hidden">
          <Image
            src="/assets/images/about-photo-small.png"
            alt="Fitness training"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative w-[300px] h-[400px] max-sm:w-[200px] max-sm:h-[280px] overflow-hidden">
          <Image
            src="/assets/images/about-photo-large.png"
            alt="Fitness training"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-[80px] max-lg:gap-[40px] text-white max-lg:items-start">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px] max-lg:text-[42px] max-lg:leading-[52px] max-sm:text-[32px] max-sm:leading-[42px] w-[630px] max-lg:w-full">
          EMPOWERING YOUR FITNESS JOURNEY
        </h2>
        <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] max-sm:text-[16px] max-sm:leading-[26px] opacity-60 w-[588px] max-lg:w-full">
          Welcome to FitFlex, where we believe that a healthier, happier you
          begins with personalized fitness and a supportive community. Our
          state-of-the-art studio is not just a gym; it&apos;s a space for
          transformation, where individuals of all fitness levels come together
          to achieve their goals. With a commitment to innovation and
          inclusivity, FitFlex is more than a workout — it&apos;s a lifestyle.
        </p>
      </div>
    </section>
  );
}
