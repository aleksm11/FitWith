"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ServiceCard } from "@/components/shared";

const programs = [
  {
    title: "STRENGTH TRAINING",
    description: "Build muscle, increase stamina.",
    imageSrc: "/assets/images/service-1.png",
  },
  {
    title: "CARDIO BLAST",
    description: "Maximize heart health and weight loss.",
    imageSrc: "/assets/images/service-2.png",
  },
  {
    title: "YOGA & FLEXIBILITY",
    description: "Achieve mental clarity and flexibility.",
    imageSrc: "/assets/images/service-3.png",
  },
  {
    title: "NUTRITION COUNSELING",
    description: "Eat right to complement your workout.",
    imageSrc: "/assets/images/service-4.png",
  },
];

const CARD_WIDTH = 300;
const GAP = 20;
const STEP = CARD_WIDTH + GAP;
const AUTO_SLIDE_INTERVAL = 5000;

export default function ProgramsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);

  const totalSlides = programs.length;
  const trackWidth = totalSlides * CARD_WIDTH + (totalSlides - 1) * GAP;

  const getMaxOffset = useCallback(() => {
    const containerWidth = containerRef.current?.offsetWidth ?? 1240;
    return Math.max(0, trackWidth - containerWidth);
  }, [trackWidth]);

  const getTranslateX = useCallback(
    (slide: number) => {
      const offset = slide * STEP;
      const maxOffset = getMaxOffset();
      return Math.min(offset, maxOffset);
    },
    [getMaxOffset]
  );

  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }
    }, AUTO_SLIDE_INTERVAL);
  }, [totalSlides]);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentSlide(index);
      startAutoSlide();
    },
    [startAutoSlide]
  );

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoSlide]);

  return (
    <section className="flex flex-col items-center w-full">
      {/* Heading */}
      <div className="px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px] w-full">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px] max-lg:text-[40px] max-lg:leading-[50px] max-sm:text-[28px] max-sm:leading-[38px] text-white text-center">
          CHOOSE YOUR PATH TO FITNESS
        </h2>
      </div>

      {/* Carousel */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden mt-[70px] max-lg:mt-[50px] max-sm:mt-[30px] px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px]"
        onMouseEnter={() => {
          isPausedRef.current = true;
        }}
        onMouseLeave={() => {
          isPausedRef.current = false;
        }}
      >
        <div
          className="flex gap-[20px] transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${getTranslateX(currentSlide)}px)` }}
        >
          {programs.map((program, index) => (
            <ServiceCard
              key={program.title}
              title={program.title}
              description={program.description}
              imageSrc={program.imageSrc}
              className="w-[300px] shrink-0 max-lg:w-[280px] max-sm:w-[260px]"
              titleClassName={index === 0 ? "underline decoration-solid" : ""}
            />
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center gap-[12px] mt-[60px] max-sm:mt-[40px]">
        {programs.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-[6px] rounded-[8px] transition-all duration-300 cursor-pointer ${
              index === currentSlide
                ? "w-[70px] bg-[#F2FD84]"
                : "w-[40px] bg-white/20"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
