"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/shared/Button";

const localeLabels: Record<string, string> = {
  sr: "SR",
  en: "EN",
  ru: "RU",
};

export default function Navbar() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenus = useCallback(() => {
    setIsOpen(false);
    setLangOpen(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(sr|en|ru)/, "");
    router.push(`/${newLocale}${pathWithoutLocale || "/"}`);
    setLangOpen(false);
  };

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/o-meni`, label: t("about") },
    { href: `/${locale}/saradnja`, label: t("services") },
    { href: `/${locale}/cene`, label: t("pricing") },
    { href: `/${locale}/kontakt`, label: t("contact") },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0A0A0A]/90 backdrop-blur-[18px] border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px] flex items-center justify-between h-[80px] max-sm:h-[64px]">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white hover:text-orange-400 transition-colors"
        >
          Fit<span className="text-orange-500">With</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-[32px]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-[family-name:var(--font-roboto)] text-[14px] tracking-[0.5px] uppercase transition-colors ${
                pathname === link.href
                  ? "text-orange-500"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-white/70 hover:text-white text-[14px] font-[family-name:var(--font-roboto)] transition-colors cursor-pointer"
            >
              {localeLabels[locale]}
              <svg
                className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute top-full mt-2 right-0 bg-[#1A1A1A] border border-white/10 min-w-[60px] py-1">
                {Object.entries(localeLabels)
                  .filter(([key]) => key !== locale)
                  .map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => switchLocale(key)}
                      className="block w-full px-4 py-2 text-[14px] text-white/70 hover:text-white hover:bg-white/5 text-left cursor-pointer"
                    >
                      {label}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <Button as="link" href={`/${locale}/kontakt`} size="sm">
            {t("startNow")}
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden flex flex-col gap-[5px] cursor-pointer p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`w-[24px] h-[2px] bg-white transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`w-[24px] h-[2px] bg-white transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-[24px] h-[2px] bg-white transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-[64px] transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } bg-[#0A0A0A]/95 backdrop-blur-[18px]`}
      >
        <div className="flex flex-col px-[40px] max-sm:px-[20px] py-[32px] gap-[20px]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenus}
              className={`font-[family-name:var(--font-roboto)] text-[18px] py-[8px] transition-colors ${
                pathname === link.href
                  ? "text-orange-500"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Language Switcher */}
          <div className="flex gap-[16px] py-[8px] border-t border-white/10 mt-2 pt-4">
            {Object.entries(localeLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => switchLocale(key)}
                className={`text-[14px] font-[family-name:var(--font-roboto)] transition-colors cursor-pointer ${
                  key === locale
                    ? "text-orange-500"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Button as="link" href={`/${locale}/kontakt`} size="default" className="mt-4 self-start">
            {t("startNow")}
          </Button>
        </div>
      </div>
    </nav>
  );
}
