import Image from "next/image";

export default function ClassDetailGallerySection() {
  return (
    <section className="w-full flex items-start justify-between px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px] max-lg:flex-col max-lg:gap-[22px]">
      {/* Left column */}
      <div className="flex flex-col gap-[22px] max-lg:w-full">
        <div className="relative w-[292px] h-[400px] max-lg:w-full max-lg:h-[300px]">
          <Image
            src="/assets/images/gallery-1.png"
            alt="Gallery image 1"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative w-[292px] h-[300px] max-lg:w-full max-lg:h-[250px]">
          <Image
            src="/assets/images/gallery-3.png"
            alt="Gallery image 3"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Center column */}
      <div className="relative w-[292px] h-[722px] max-lg:w-full max-lg:h-[400px]">
        <Image
          src="/assets/images/gallery-5.png"
          alt="Gallery image 5"
          fill
          className="object-cover"
        />
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-[22px] max-lg:w-full">
        <div className="relative w-[610px] h-[400px] max-lg:w-full max-lg:h-[300px]">
          <Image
            src="/assets/images/gallery-2.png"
            alt="Gallery image 2"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex gap-[20px] max-sm:flex-col max-sm:gap-[22px]">
          <div className="relative w-[295px] h-[300px] max-lg:w-full max-lg:h-[250px]">
            <Image
              src="/assets/images/gallery-4.png"
              alt="Gallery image 4"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-[295px] h-[300px] max-lg:w-full max-lg:h-[250px]">
            <Image
              src="/assets/images/gallery-6.png"
              alt="Gallery image 6"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
