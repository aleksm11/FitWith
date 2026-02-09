import Link from "next/link";
import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

type BaseProps = {
  variant?: "primary" | "outline" | "ghost";
  size?: "default" | "lg" | "sm";
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string };

type ButtonAsNextLink = BaseProps & { as: "link"; href: string; locale?: string };

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsNextLink;

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "default", className = "", children } = props;

  const base =
    "font-[family-name:var(--font-sora)] font-semibold tracking-[0.24px] inline-flex items-center justify-center transition-all duration-200 cursor-pointer";

  const sizes = {
    sm: "text-[14px] leading-[22px] px-[20px] py-[10px]",
    default: "text-[16px] leading-[26px] px-[32px] py-[16px] max-sm:px-[24px] max-sm:py-[12px] max-sm:text-[14px]",
    lg: "text-[18px] leading-[28px] px-[40px] py-[20px] max-sm:px-[32px] max-sm:py-[16px] max-sm:text-[16px]",
  };

  const variants = {
    primary:
      "bg-orange-500 text-white hover:bg-orange-400 active:bg-orange-600 shadow-[0_4px_18px_rgba(249,115,22,0.15)]",
    outline:
      "border border-white/20 text-white hover:border-orange-500 hover:text-orange-400",
    ghost:
      "text-white/70 hover:text-white hover:bg-white/5",
  };

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (props.as === "link") {
    return (
      <Link href={props.href} className={classes} locale={props.locale}>
        {children}
      </Link>
    );
  }

  if (props.as === "a") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as: _as, variant: _v, size: _s, className: _c, children: _ch, ...anchorProps } = props as ButtonAsLink;
    return (
      <a className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { as: _as, variant: _v, size: _s, className: _c, children: _ch, ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
