type CategoryTabProps = {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function CategoryTab({
  active = false,
  children,
  className = "",
  onClick,
}: CategoryTabProps) {
  return (
    <button
      onClick={onClick}
      className={`font-[family-name:var(--font-sora)] font-semibold text-[16px] leading-[26px] tracking-[0.24px] px-[32px] py-[15px] transition-colors ${
        active
          ? "bg-[#F2FD84] text-[#222] shadow-[0_4px_18px_rgba(242,253,132,0.09)]"
          : "border-[0.4px] border-white text-white"
      } ${className}`}
    >
      {children}
    </button>
  );
}
