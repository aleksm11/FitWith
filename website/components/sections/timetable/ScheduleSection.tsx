"use client";

import { useState } from "react";
import { CategoryTab, ScheduleCard } from "@/components/shared";

const categories = [
  "ALL EVENTS",
  "FITFUSION",
  "CYCLE FUSION",
  "CARDIO KICK",
  "FUNCTIONAL FITNESS",
];

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const timeSlots = [
  "6:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "12:00 PM",
  "1:00 PM",
  "6:00 PM",
  "7:00 PM",
];

type ScheduleEntry = {
  time: string;
  day: string;
  title: string;
  range: string;
  instructor: string;
  active?: boolean;
};

const scheduleData: ScheduleEntry[] = [
  { time: "6:00 AM", day: "MON", title: "FITFUSION", range: "6:00-7:00 AM", instructor: "Alexandra Rodriguez" },
  { time: "6:00 AM", day: "FRI", title: "FITFUSION", range: "6:00-7:00 AM", instructor: "Alexandra Rodriguez" },
  { time: "6:00 AM", day: "SUN", title: "FITFUSION", range: "6:00-7:00 AM", instructor: "Alexandra Rodriguez" },
  { time: "8:00 AM", day: "TUE", title: "YOGA HARMONY", range: "8:00-9:00 AM", instructor: "David Chen" },
  { time: "8:00 AM", day: "WED", title: "DANCE CARDIO GROOVE", range: "8:00-9:00 AM", instructor: "Sophie Nguyen" },
  { time: "8:00 AM", day: "SAT", title: "YOGA HARMONY", range: "8:00-9:00 AM", instructor: "David Chen" },
  { time: "9:00 AM", day: "TUE", title: "FUNCTIONAL FITNESS", range: "9:00-10:00 AM", instructor: "Dr. Maya Patel" },
  { time: "9:00 AM", day: "WED", title: "MINDFUL PILATES", range: "9:00-10:00 AM", instructor: "Sophie Nguyen", active: true },
  { time: "10:00 AM", day: "WED", title: "STRENGTH SCULPT", range: "10:00-11:00 AM", instructor: "Mark Johnson" },
  { time: "10:00 AM", day: "FRI", title: "YOGA HARMONY", range: "10:00-11:00 AM", instructor: "David Chen" },
  { time: "10:00 AM", day: "SAT", title: "STRENGTH SCULPT", range: "10:00-11:00 AM", instructor: "Mark Johnson" },
  { time: "10:00 AM", day: "SUN", title: "DANCE CARDIO GROOVE", range: "10:00-11:00 AM", instructor: "Sophie Nguyen" },
  { time: "12:00 PM", day: "MON", title: "CARDIO KICK", range: "12:00-1:00 PM", instructor: "Emily Turner" },
  { time: "12:00 PM", day: "TUE", title: "CYCLE FUSION", range: "12:00-1:00 PM", instructor: "Mark Johnson" },
  { time: "12:00 PM", day: "THU", title: "CARDIO KICK", range: "12:00-1:00 PM", instructor: "Emily Turner" },
  { time: "12:00 PM", day: "FRI", title: "CYCLE FUSION", range: "12:00-1:00 PM", instructor: "Mark Johnson" },
  { time: "12:00 PM", day: "SUN", title: "CARDIO KICK", range: "12:00-1:00 PM", instructor: "Emily Turner" },
  { time: "1:00 PM", day: "WED", title: "FITFUSION", range: "1:00-2:00 PM", instructor: "Mark Johnson" },
  { time: "1:00 PM", day: "SAT", title: "CYCLE FUSION", range: "1:00-2:00 PM", instructor: "Mark Johnson" },
  { time: "6:00 PM", day: "SUN", title: "ZEN STRETCH", range: "6:00-7:00 PM", instructor: "Alexandra Rodriguez" },
  { time: "7:00 PM", day: "MON", title: "YOGA HARMONY", range: "7:00-8:00 PM", instructor: "David Chen" },
  { time: "7:00 PM", day: "TUE", title: "STRENGTH SCULPT", range: "7:00-8:00 PM", instructor: "Mark Johnson" },
  { time: "7:00 PM", day: "SAT", title: "STRENGTH SCULPT", range: "7:00-8:00 PM", instructor: "Mark Johnson" },
];

function ChevronLeft() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5 1L1.5 8L8.5 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 1L8.5 8L1.5 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ScheduleSection() {
  const [activeCategory, setActiveCategory] = useState("ALL EVENTS");

  const filteredData =
    activeCategory === "ALL EVENTS"
      ? scheduleData
      : scheduleData.filter((entry) => entry.title === activeCategory);

  const getEntry = (time: string, day: string) =>
    filteredData.find((e) => e.time === time && e.day === day);

  return (
    <section className="w-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px]">
      {/* Category Filter Bar */}
      <div className="flex items-start justify-between w-full gap-[20px] mb-[60px] max-lg:mb-[40px]">
        <button className="size-[42px] flex items-center justify-center border-[0.4px] border-white shrink-0">
          <ChevronLeft />
        </button>

        <div className="flex items-center gap-[10px] flex-wrap max-lg:gap-[8px]">
          {categories.map((cat) => (
            <CategoryTab
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </CategoryTab>
          ))}
        </div>

        <button className="size-[42px] flex items-center justify-center border-[0.4px] border-white shrink-0">
          <ChevronRight />
        </button>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white/[0.02] overflow-x-auto">
        <div className="grid grid-cols-[190px_repeat(7,140px)] gap-[10px] min-w-[1240px]">
          {/* Header Row */}
          <div className="bg-[#F2FD84]/10 h-[60px] flex items-center justify-center">
            <span className="font-[family-name:var(--font-sora)] font-semibold text-[16px] leading-[26px] tracking-[0.24px] text-white">
              Time
            </span>
          </div>
          {days.map((day) => (
            <div
              key={day}
              className="bg-[#F2FD84]/10 h-[60px] flex items-center justify-center"
            >
              <span className="font-[family-name:var(--font-sora)] font-semibold text-[16px] leading-[26px] tracking-[0.24px] text-white">
                {day}
              </span>
            </div>
          ))}

          {/* Data Rows */}
          {timeSlots.map((time) => (
            <div key={`row-${time}`} className="contents">
              {/* Time Label */}
              <div
                className="bg-white/[0.02] flex items-center justify-center"
              >
                <span className="font-[family-name:var(--font-roboto)] text-[12px] leading-[22px] text-white">
                  {time}
                </span>
              </div>

              {/* Day Cells */}
              {days.map((day) => {
                const entry = getEntry(time, day);
                return (
                  <div key={`${time}-${day}`}>
                    {entry ? (
                      <ScheduleCard
                        title={entry.title}
                        time={entry.range}
                        instructor={entry.instructor}
                        active={entry.active}
                        className="w-full"
                      />
                    ) : (
                      <div className="bg-white/[0.02] border-[0.4px] border-white/10 min-h-[180px]" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
