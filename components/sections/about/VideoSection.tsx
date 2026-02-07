import Image from "next/image";

export default function VideoSection() {
  return (
    <section className="relative w-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px]">
      <div className="relative h-[600px] max-lg:h-[400px] max-sm:h-[300px] w-full">
        {/* Background Video Image */}
        <Image
          src="/assets/images/video-section-bg.png"
          alt="Video background"
          fill
          className="object-cover"
        />

        {/* Play Button */}
        <button className="absolute left-1/2 -translate-x-1/2 top-[223px] max-lg:top-1/2 max-lg:-translate-y-1/2 w-[118px] h-[118px] max-sm:w-[80px] max-sm:h-[80px] rounded-full bg-[#F2FD84] flex items-center justify-center shadow-[0_4px_30px_rgba(242,253,132,0.3)] hover:scale-105 transition-transform z-10">
          <svg
            width="30"
            height="36"
            viewBox="0 0 30 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-[4px]"
          >
            <path
              d="M30 18L0 36V0L30 18Z"
              fill="#222222"
            />
          </svg>
        </button>

        {/* Glass Text Card */}
        <div className="absolute bottom-[-118px] max-lg:bottom-[-80px] left-0 backdrop-blur-[9px] bg-gradient-to-b from-white/[0.03] to-white/0 border-[0.5px] border-white w-[700px] max-lg:w-[500px] max-sm:w-full pl-[40px] pr-[50px] max-sm:px-[20px] py-[40px] max-sm:py-[30px] flex flex-col gap-[30px] text-white z-10">
          <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px] max-lg:text-[42px] max-lg:leading-[52px] max-sm:text-[32px] max-sm:leading-[42px]">
            EXPERIENCE FITFLEX
          </h2>
          <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] max-sm:text-[16px] max-sm:leading-[26px] opacity-60">
            Where Your Fitness Journey Thrives
          </p>
        </div>
      </div>
    </section>
  );
}
