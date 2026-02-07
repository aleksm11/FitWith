import { Button, SocialIcons } from "@/components/shared";

const columns = [
  {
    title: "About",
    links: ["Our Story", "Mission & Vision", "Meet the Team", "Careers", "FAQs"],
  },
  {
    title: "Contact",
    links: ["Contact Us", "Location & Hours", "Support", "Partnership Inquiries"],
  },
  {
    title: "Classes",
    links: ["Class Schedule", "Types of Workouts", "Trainers", "Virtual Classes"],
  },
  {
    title: "Resources",
    links: ["Blog", "Exercise Tips", "Nutrition Guides", "Equipment Reviews"],
  },
];

export default function Footer() {
  return (
    <footer className="flex items-start justify-between w-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px] max-lg:flex-col max-lg:gap-[50px]">
      {/* Left: Nav Columns */}
      <div className="flex gap-[60px] max-lg:flex-wrap max-lg:gap-[40px]">
        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-[32px] max-sm:w-[calc(50%-15px)]">
            <h4 className="font-[family-name:var(--font-roboto)] font-bold text-[16px] leading-[26px] text-white">
              {column.title}
            </h4>
            <ul className="flex flex-col gap-0">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Right: Newsletter */}
      <div className="flex flex-col gap-[34px] max-lg:w-full">
        <h4 className="font-[family-name:var(--font-roboto)] font-bold text-[16px] leading-[26px] text-white">
          Sign up for our newsletter
        </h4>
        <div className="flex gap-[14px] items-center max-sm:flex-col max-sm:items-stretch">
          <input
            type="email"
            placeholder="Email Address"
            className="w-[276px] max-sm:w-full h-[48px] pl-[20px] bg-white text-[#222] font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] placeholder:opacity-50 outline-none"
          />
          <Button className="py-[12px]">SUBSCRIBE</Button>
        </div>
        <SocialIcons />
      </div>
    </footer>
  );
}
