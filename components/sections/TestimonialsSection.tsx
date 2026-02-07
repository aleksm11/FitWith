import { TestimonialCard, Button } from "@/components/shared";

const testimonials = [
  {
    name: "Joanne",
    quote:
      "Before joining FitFlex, I was stuck in a fitness rut. But the trainers here are amazing, and the community is so supportive! It's like a second home to me now.",
    rating: 4,
    imageSrc: "/assets/images/testimonial-1.png",
  },
  {
    name: "Caleb",
    quote:
      "I used to dread going to the gym, but FitFlex changed that for me. The variety of classes ensures I never get bored, and I genuinely look forward to each workout session!",
    rating: 4,
    imageSrc: "/assets/images/testimonial-2.png",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="flex flex-col w-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px]">
      {/* Top: Heading + Button */}
      <div className="flex items-end justify-between w-full max-md:flex-col max-md:items-start max-md:gap-[24px]">
        <h2 className="font-[family-name:var(--font-sora)] font-semibold text-[54px] leading-[64px] max-lg:text-[40px] max-lg:leading-[50px] max-sm:text-[28px] max-sm:leading-[38px] text-white w-[788px] max-lg:w-full">
          TRANSFORMATIONS SPEAK LOUDER THAN WORDS
        </h2>
        <Button>VIEW MORE</Button>
      </div>

      {/* Cards */}
      <div className="flex items-center justify-between w-full mt-[70px] max-lg:mt-[50px] max-sm:mt-[30px] max-lg:flex-col max-lg:gap-[30px]">
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.name}
            name={testimonial.name}
            quote={testimonial.quote}
            rating={testimonial.rating}
            imageSrc={testimonial.imageSrc}
          />
        ))}
      </div>
    </section>
  );
}
