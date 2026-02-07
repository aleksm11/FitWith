import { PricingCard } from "@/components/shared";

const plans = [
  {
    planName: "BASIC PLAN",
    price: "$39",
    frequency: "3 DAYS/WEEK",
    features: [
      "Access to all cardio classes",
      "Monthly body assessment",
      "Nutritional guidance",
    ],
  },
  {
    planName: "PREMIUM PLAN",
    price: "$59",
    frequency: "3 DAYS/WEEK",
    features: [
      "All Basic Plan features",
      "Strength training sessions",
      "Nutritional guidance",
    ],
  },
  {
    planName: "ELITE PLAN",
    price: "$89",
    frequency: "3 DAYS/WEEK",
    features: [
      "All Premium Plan features",
      "Personal training session once a month",
      "Priority booking for all classes",
    ],
  },
];

export default function PricingSection() {
  return (
    <section className="flex flex-col items-center w-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px]">
      {/* Heading */}
      <div className="flex flex-col items-center gap-[50px] max-sm:gap-[30px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px] max-lg:text-[40px] max-lg:leading-[50px] max-sm:text-[28px] max-sm:leading-[38px] text-white text-center">
          FLEXIBLE PLANS FOR EVERY BUDGET
        </h2>
        <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white opacity-60 text-center">
          Choose a plan that suits you. No long-term commitments required.
        </p>
      </div>

      {/* Cards */}
      <div className="flex items-center justify-between w-full mt-[70px] max-lg:mt-[50px] max-sm:mt-[30px] gap-[20px] max-lg:flex-col max-lg:items-center max-lg:gap-[30px]">
        {plans.map((plan) => (
          <PricingCard
            key={plan.planName}
            planName={plan.planName}
            price={plan.price}
            frequency={plan.frequency}
            features={plan.features}
          />
        ))}
      </div>
    </section>
  );
}
