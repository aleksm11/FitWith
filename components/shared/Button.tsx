import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

type BaseProps = {
  variant?: "primary" | "outline";
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button(props: ButtonProps) {
  const { variant = "primary", className = "", children, ...rest } = props;

  const base =
    "font-[family-name:var(--font-sora)] font-semibold text-[16px] leading-[26px] tracking-[0.24px] px-[32px] py-[18px] max-sm:px-[24px] max-sm:py-[14px] max-sm:text-[14px] max-sm:leading-[22px] inline-flex items-center justify-center transition-colors";

  const variants = {
    primary:
      "bg-[#F2FD84] text-[#222] shadow-[0_4px_18px_rgba(242,253,132,0.09)]",
    outline: "border border-white text-white",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (props.as === "a") {
    const { as: _, variant: _v, ...anchorProps } = rest as ButtonAsLink;
    return (
      <a className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { as: _, variant: _v, ...buttonProps } = rest as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
