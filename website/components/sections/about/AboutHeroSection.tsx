import Link from "next/link";
import Navbar from "../Navbar";

export default function AboutHeroSection() {
  return (
    <section
      className="relative w-full h-[504px] max-lg:h-auto max-lg:min-h-[400px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/images/about-hero.png')" }}
    >
      <div className="flex flex-col h-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px] pt-[30px] pb-[200px] max-lg:pb-[60px] justify-between">
        <Navbar activePage="About Us" />

        <div className="flex flex-col gap-[35px] max-lg:mt-[60px] max-sm:mt-[40px]">
          <h1 className="font-[family-name:var(--font-sora)] font-bold text-[72px] leading-[82px] max-lg:text-[54px] max-lg:leading-[64px] max-sm:text-[36px] max-sm:leading-[46px] text-white">
            ABOUT FITFLEX
          </h1>
          <p className="font-[family-name:var(--font-roboto)] text-[18px] leading-[28px] text-white">
            <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">
              Home
            </Link>
            <span className="opacity-60">{" > "}</span>
            <span className="font-semibold text-[16px] leading-[26px]">About Us</span>
          </p>
        </div>
      </div>
    </section>
  );
}
