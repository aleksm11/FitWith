type SocialIconsProps = {
  className?: string;
};

export default function SocialIcons({ className = "" }: SocialIconsProps) {
  const socials = [
    { label: "ig", href: "#" },
    { label: "tw", href: "#" },
    { label: "yt", href: "#" },
    { label: "ln", href: "#" },
  ];

  return (
    <div className={`flex gap-[12px] items-center ${className}`}>
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          className="w-[32px] h-[32px] rounded-full bg-[#F2FD84] flex items-center justify-center"
        >
          <span className="font-[family-name:var(--font-roboto)] font-medium text-[12px] text-[#222] text-center">
            {social.label}
          </span>
        </a>
      ))}
    </div>
  );
}
