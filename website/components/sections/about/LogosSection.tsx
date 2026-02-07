const LogoPlaceholder = ({ iconPath }: { iconPath: React.ReactNode }) => (
  <div className="flex gap-[12px] items-center">
    <div className="w-[33px] h-[36px] text-[#F2FD84]">{iconPath}</div>
    <span className="font-[family-name:var(--font-roboto)] font-bold text-[24px] max-sm:text-[18px] text-[#F2FD84] leading-normal">
      logoipsum
    </span>
  </div>
);

const logoIcons = [
  <svg key="1" width="36" height="36" viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 0L22.5 13.5H36L25.2 21.6L29.7 36L18 27L6.3 36L10.8 21.6L0 13.5H13.5L18 0Z" />
  </svg>,
  <svg key="2" width="33" height="36" viewBox="0 0 33 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <rect width="33" height="36" rx="4" />
  </svg>,
  <svg key="3" width="34" height="34" viewBox="0 0 34 34" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="17" cy="17" r="17" />
  </svg>,
  <svg key="4" width="30" height="36" viewBox="0 0 30 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0L30 18L15 36L0 18L15 0Z" />
  </svg>,
  <svg key="5" width="33" height="36" viewBox="0 0 33 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.5 0L33 10V26L16.5 36L0 26V10L16.5 0Z" />
  </svg>,
];

export default function LogosSection() {
  return (
    <section className="flex items-center justify-between w-full px-[100px] max-xl:px-[60px] max-lg:px-[40px] max-sm:px-[20px] opacity-50 max-lg:flex-wrap max-lg:gap-[30px] max-lg:justify-center">
      {logoIcons.map((icon, i) => (
        <LogoPlaceholder key={i} iconPath={icon} />
      ))}
    </section>
  );
}
