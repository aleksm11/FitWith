import Link from "next/link";
import Navbar from "../Navbar";

export default function ClassDetailHeroSection() {
  return (
    <section
      className="relative w-full h-[380px] max-lg:h-auto max-lg:min-h-[320px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/images/class-detail-hero.png')" }}
    >
      <div className="flex flex-col h-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px] pt-[30px] pb-[100px] max-lg:pb-[60px] gap-[100px] max-lg:gap-[60px] max-sm:gap-[40px]">
        <Navbar activePage="Classes" />

        <div className="flex flex-col gap-[35px]">
          <h1 className="font-[family-name:var(--font-sora)] font-bold text-[72px] leading-[82px] max-lg:text-[54px] max-lg:leading-[64px] max-sm:text-[36px] max-sm:leading-[46px]">
            <span className="text-[#F2FD84]">FIT</span>
            <span className="text-white">FUSION</span>
          </h1>
          <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] text-white">
            <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">
              Home
            </Link>
            <span className="opacity-60">{" > "}</span>
            <Link href="/classes" className="text-[16px] leading-[26px] opacity-60 hover:opacity-100 transition-opacity">
              Services
            </Link>
            <span className="opacity-60">{" > "}</span>
            <span className="font-semibold text-[16px] leading-[26px]">FitFusion</span>
          </p>
        </div>
      </div>
    </section>
  );
}
