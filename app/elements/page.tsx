import Image from "next/image";
import {
  Button,
  CategoryTab,
  StarRating,
  ServiceCard,
  ServiceCardAlt,
  TestimonialCard,
  PricingCard,
  ValueCard,
  TeamCard,
  BenefitCard,
  ScheduleCard,
  PhotoFrame,
  SocialIcons,
} from "@/components/shared";

export default function ElementsPage() {
  return (
    <div className="min-h-screen bg-[#222] text-white p-[60px] flex flex-col gap-[80px]">
      <h1 className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px] text-[#F2FD84]">
        Elements Showcase
      </h1>

      {/* Buttons */}
      <section className="flex flex-col gap-[30px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
          Buttons
        </h2>
        <div className="flex gap-[18px] items-center">
          <Button variant="primary">START NOW</Button>
          <Button variant="outline">JOIN FREE TRIAL</Button>
          <Button variant="primary" as="a" href="#">
            SUBSCRIBE
          </Button>
          <Button variant="outline">CONTACT</Button>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="flex flex-col gap-[30px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
          Category Tabs
        </h2>
        <div className="flex gap-[12px] items-center">
          <CategoryTab active>All Categories</CategoryTab>
          <CategoryTab>Strength Training</CategoryTab>
          <CategoryTab>Yoga & Flexibility</CategoryTab>
          <CategoryTab>Cardio</CategoryTab>
          <CategoryTab>High-Intensity Training</CategoryTab>
        </div>
      </section>

      {/* Star Rating */}
      <section className="flex flex-col gap-[30px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
          Star Rating
        </h2>
        <div className="flex gap-[30px] items-center">
          <StarRating rating={5} />
          <StarRating rating={4} />
          <StarRating rating={3} />
        </div>
      </section>

      {/* Social Icons */}
      <section className="flex flex-col gap-[30px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
          Social Icons
        </h2>
        <SocialIcons />
      </section>

      {/* Service Cards (v1) */}
      <section className="flex flex-col gap-[30px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
          Service Cards (v1 — Homepage)
        </h2>
        <div className="flex gap-[20px]">
          <ServiceCard
            title="STRENGTH TRAINING"
            description="Build muscle, increase stamina."
          />
          <ServiceCard
            title="CARDIO BLAST"
            description="Maximize heart health and weight loss."
          />
          <ServiceCard
            title="YOGA & FLEXIBILITY"
            description="Achieve mental clarity and flexibility."
          />
        </div>
      </section>

      {/* Service Cards (v2) */}
      <section className="flex flex-col gap-[30px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
          Service Cards (v2 — Classes)
        </h2>
        <div className="flex gap-[20px]">
          <ServiceCardAlt
            title="FITFUSION"
            subtitle="High-Intensity Interval Training (HIIT)"
            level="INTERMEDIATE"
          />
          <ServiceCardAlt
            title="YOGA HARMONY"
            subtitle="Vinyasa Flow Yoga"
            level="BEGINNER"
          />
          <ServiceCardAlt
            title="POWER SURGE"
            subtitle="Strength & Conditioning"
            level="ADVANCED"
          />
        </div>
      </section>

      {/* Testimonial Cards */}
      <section className="flex flex-col gap-[30px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
          Testimonial Cards
        </h2>
        <div className="flex gap-[20px]">
          <TestimonialCard
            quote={`"Before joining FitFlex, I was stuck in a fitness rut. But the trainers here are amazing, and the community is so supportive! It's like a second home to me now."`}
            name="Joanne"
            rating={4}
          />
          <TestimonialCard
            quote={`"I used to dread going to the gym, but FitFlex changed that for me. The variety of classes ensures I never get bored, and I genuinely look forward to each workout session!"`}
            name="Caleb"
            rating={4}
          />
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="flex flex-col gap-[30px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
          Pricing Cards
        </h2>
        <div className="flex gap-[20px] items-start">
          <PricingCard
            planName="BASIC PLAN"
            price="$39"
            frequency="3 DAYS/WEEK"
            features={[
              "Access to all cardio classes",
              "Monthly body assessment",
              "Nutritional guidance",
            ]}
          />
          <PricingCard
            planName="PREMIUM PLAN"
            price="$59"
            frequency="3 DAYS/WEEK"
            features={[
              "All Basic Plan features",
              "Strength training sessions",
              "Nutritional guidance",
            ]}
          />
          <PricingCard
            planName="ELITE PLAN"
            price="$89"
            frequency="3 DAYS/WEEK"
            features={[
              "All Premium Plan features",
              "Personal training session once a month",
              "Priority booking for all classes",
            ]}
          />
        </div>
      </section>

      {/* Value Cards */}
      <section className="flex flex-col gap-[30px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
          Value Cards
        </h2>
        <div className="flex gap-[20px]">
          <ValueCard
            title="Community"
            description="Fostering a sense of belonging and support."
            icon={
              <Image
                src="/assets/icons/icon-community.svg"
                alt=""
                width={44}
                height={44}
              />
            }
          />
          <ValueCard
            title="Inclusivity"
            description="Embracing diversity in fitness for all body types and abilities."
            icon={
              <span className="text-[#222] text-[20px] font-bold">★</span>
            }
          />
          <ValueCard
            title="Innovation"
            description="Offering cutting-edge workouts and technology."
            icon={
              <span className="text-[#222] text-[20px] font-bold">⚡</span>
            }
          />
          <ValueCard
            title="Personalization"
            description="Tailoring fitness plans to individual needs."
            icon={
              <span className="text-[#222] text-[20px] font-bold">🎯</span>
            }
          />
        </div>
      </section>

      {/* Benefit Cards */}
      <section className="flex flex-col gap-[30px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
          Benefit Cards
        </h2>
        <div className="flex gap-[40px]">
          <BenefitCard
            title="Calorie Torch"
            description="Burn a maximum number of calories in a short amount of time."
            active
            icon={
              <Image
                src="/assets/icons/benefit-1.svg"
                alt=""
                width={31}
                height={40}
                className="text-[#222]"
                style={{ filter: "brightness(0)" }}
              />
            }
          />
          <BenefitCard
            title="Full-Body Conditioning"
            description="Elevate your cardiovascular fitness levels effectively."
            icon={
              <Image
                src="/assets/icons/benefit-2.svg"
                alt=""
                width={40}
                height={32}
                style={{ filter: "brightness(0) invert(1) sepia(1) saturate(50) hue-rotate(20deg)" }}
              />
            }
          />
          <BenefitCard
            title="Increased Endurance"
            description="Push your limits and build lasting endurance."
            active
            icon={
              <Image
                src="/assets/icons/benefit-3.svg"
                alt=""
                width={40}
                height={35}
                style={{ filter: "brightness(0)" }}
              />
            }
          />
          <BenefitCard
            title="Metabolic Boost"
            description="Maximize your metabolic rate and fat burning potential."
            icon={
              <Image
                src="/assets/icons/benefit-4.svg"
                alt=""
                width={27}
                height={40}
                style={{ filter: "brightness(0) invert(1) sepia(1) saturate(50) hue-rotate(20deg)" }}
              />
            }
          />
        </div>
        <div className="flex gap-[40px]">
          <BenefitCard
            title="Time Efficiency"
            description="Get maximum results in minimum time."
            icon={
              <Image
                src="/assets/icons/benefit-5.svg"
                alt=""
                width={37}
                height={37}
                style={{ filter: "brightness(0) invert(1) sepia(1) saturate(50) hue-rotate(20deg)" }}
              />
            }
          />
          <BenefitCard
            title="Mental Focus"
            description="Sharpen your mental clarity and reduce stress."
            active
            icon={
              <Image
                src="/assets/icons/benefit-6.svg"
                alt=""
                width={37}
                height={40}
                style={{ filter: "brightness(0)" }}
              />
            }
          />
          <BenefitCard
            title="Adaptability"
            description="Workouts that adapt to your fitness level."
            icon={
              <Image
                src="/assets/icons/benefit-7.svg"
                alt=""
                width={35}
                height={35}
                style={{ filter: "brightness(0) invert(1) sepia(1) saturate(50) hue-rotate(20deg)" }}
              />
            }
          />
          <BenefitCard
            title="Community"
            description="Join a supportive fitness community."
            active
            icon={
              <Image
                src="/assets/icons/benefit-8.svg"
                alt=""
                width={40}
                height={40}
                style={{ filter: "brightness(0)" }}
              />
            }
          />
        </div>
      </section>

      {/* Team Cards */}
      <section className="flex flex-col gap-[30px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
          Team Cards
        </h2>
        <div className="flex gap-[20px]">
          <TeamCard
            name="Alexandra Rodriguez"
            role="Strength & Conditioning Specialist"
          />
          <TeamCard name="David Chen" role="Yoga Instructor" />
          <TeamCard name="Sarah Johnson" role="Nutritionist" />
        </div>
      </section>

      {/* Schedule Cards */}
      <section className="flex flex-col gap-[30px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
          Schedule Cards
        </h2>
        <div className="flex gap-[10px]">
          <ScheduleCard
            title="FITFUSION"
            time="6:00 AM - 7:00 AM"
            instructor="Alexandra Rodriguez"
          />
          <ScheduleCard
            title="YOGA HARMONY"
            time="8:00 AM - 9:00 AM"
            instructor="David Chen"
          />
          <ScheduleCard
            title="POWER SURGE"
            time="10:00 AM - 11:00 AM"
            instructor="Sarah Johnson"
            active
          />
          <ScheduleCard
            title="CARDIO BLAST"
            time="12:00 PM - 1:00 PM"
            instructor="Michael Brown"
          />
        </div>
      </section>

      {/* Photo Frames */}
      <section className="flex flex-col gap-[30px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[24px] leading-[34px]">
          Photo Frames
        </h2>
        <div className="flex gap-[40px] items-center">
          <PhotoFrame
            variant={1}
            className="w-[200px] h-[300px]"
          />
          <PhotoFrame
            variant={2}
            className="w-[200px] h-[300px]"
          />
          <PhotoFrame
            variant={3}
            className="w-[200px] h-[300px]"
          />
        </div>
      </section>
    </div>
  );
}
