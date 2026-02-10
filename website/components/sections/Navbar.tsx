"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/shared/Button";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

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
  const [user, setUser] = useState<User | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
      if (u) {
        supabase
          .from("profiles")
          .select("full_name, role")
          .eq("user_id", u.id)
          .single()
          .then(({ data }) => {
            if (data?.full_name) setProfileName(data.full_name);
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setProfileName(null);
      }
    });

    return () => subscription.unsubscribe();
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

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfileName(null);
    router.push(`/${locale}`);
  };

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/o-meni`, label: t("about") },
    { href: `/${locale}/saradnja`, label: t("services") },
    { href: `/${locale}/vezbe`, label: t("exercises") },
    { href: `/${locale}/blog`, label: t("blog") },
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
          className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white hover:text-orange-400 transition-colors flex items-center gap-[8px]"
        >
          <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 14.2579V9.73976H2.21236L2.21202 14.2579H0ZM4.53921 19.3426C4.20671 19.3426 3.89413 19.2053 3.65902 18.956C3.42391 18.7068 3.29449 18.3754 3.2945 18.023L3.29475 14.8364C3.29475 14.8349 3.29496 14.8334 3.29496 14.8318C3.29496 14.8303 3.29475 14.8288 3.29475 14.8273L3.29542 5.97588C3.29551 5.24852 3.8539 4.6567 4.54013 4.6567H6.63375L6.63273 19.3426L4.53921 19.3426ZM11.0274 23.6137C10.7923 23.8628 10.4798 24 10.1474 24H10.1472L8.95979 23.9998C8.27357 23.9997 7.71529 23.4078 7.71529 22.6804L7.71658 4.08683C7.7166 4.08546 7.71677 4.08418 7.71677 4.08281C7.71677 4.08144 7.71658 4.08015 7.71658 4.07878L7.71677 1.31942C7.71677 0.966968 7.84628 0.635622 8.08142 0.386449C8.31653 0.137275 8.62902 3.99508e-05 8.96148 3.99508e-05H8.96165L10.1488 0.000261831H10.1488C10.8351 0.000322252 11.3933 0.59228 11.3933 1.31972L11.3929 9.16333C11.3929 9.1644 11.3927 9.16549 11.3927 9.16662C11.3927 9.16774 11.3928 9.16881 11.3929 9.16994L11.3921 22.6807C11.3921 23.0331 11.2626 23.3645 11.0274 23.6137ZM12.4753 14.2588L12.4756 9.74061L25.5246 9.74202L25.5249 14.2602L12.4753 14.2588ZM29.0403 23.9998L27.853 23.9999C27.1667 23.9999 26.6083 23.4081 26.6082 22.6805L26.6068 1.3196C26.6068 0.592099 27.1651 0.00022131 27.8515 0.00014075L29.0387 0C29.3712 0 29.6837 0.137154 29.9188 0.386348C30.1539 0.635602 30.2834 0.966867 30.2835 1.3194L30.2847 19.9163C30.2847 19.9164 30.2847 19.9165 30.2847 19.9167C30.2847 19.9168 30.2847 19.9169 30.2847 19.917L30.2849 22.6803C30.2849 23.4078 29.7266 23.9997 29.0403 23.9998ZM33.461 19.3425L31.3674 19.3427L31.3665 4.6568L33.46 4.65662C33.7925 4.65662 34.1051 4.79377 34.3402 5.04297C34.5753 5.29214 34.7048 5.62349 34.7048 5.97594L34.705 9.16803C34.705 9.16835 34.705 9.16865 34.705 9.16897C34.705 9.1693 34.705 9.16962 34.705 9.16992L34.7056 18.023C34.7056 18.7505 34.1474 19.3424 33.461 19.3425ZM38 14.261H35.7882L35.7878 9.74287H38V14.261Z" fill="#F97316"/>
          </svg>
          <>Fit<span className="text-orange-500">WithAS</span></>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center flex-1">
          {/* Nav links — closer to logo */}
          <div className="flex items-center gap-[28px] ml-[40px]">
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
          </div>

          {/* Right side — language + auth */}
          <div className="flex items-center gap-[24px] ml-auto">
          {/* Plan i Program button (logged in only) */}
          {user && (
            <Link
              href={`/${locale}/portal`}
              className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70 hover:text-white transition-colors"
            >
              Plan i Program
            </Link>
          )}

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

          {/* Auth Buttons / User info */}
          {user ? (
            <div className="flex items-center gap-[12px]">
              <Link
                href={`/${locale}/portal`}
                className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70 hover:text-white transition-colors flex items-center gap-[6px]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {profileName || user.email?.split("@")[0]}
              </Link>
              <button
                onClick={handleSignOut}
                className="font-[family-name:var(--font-roboto)] text-[14px] text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-[12px]">
              <Link
                href={`/${locale}/prijava`}
                className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70 hover:text-white transition-colors"
              >
                {t("login")}
              </Link>
              <Button as="link" href={`/${locale}/registracija`} size="sm">
                {t("register")}
              </Button>
            </div>
          )}
          </div>
        </div>

        {/* Mobile Auth + Menu Toggle */}
        <div className="lg:hidden flex items-center gap-[12px]">
          {user ? (
            <Link
              href={`/${locale}/portal`}
              className="font-[family-name:var(--font-roboto)] text-[13px] bg-orange-500 hover:bg-orange-600 text-white px-[12px] py-[6px] transition-colors"
            >
              Plan i Program
            </Link>
          ) : (
            <>
              <Link
                href={`/${locale}/prijava`}
                className="font-[family-name:var(--font-roboto)] text-[13px] text-white/70 hover:text-white transition-colors"
              >
                {t("login")}
              </Link>
              <Link
                href={`/${locale}/registracija`}
                className="font-[family-name:var(--font-roboto)] text-[13px] bg-orange-500 hover:bg-orange-600 text-white px-[12px] py-[6px] transition-colors"
              >
                {t("register")}
              </Link>
            </>
          )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col gap-[5px] cursor-pointer p-2"
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
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed right-0 top-[64px] bottom-0 w-[65vw] max-w-[280px] transition-transform duration-300 bg-[#0A0A0A] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
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

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-[12px] mt-4 pt-4 border-t border-white/10">
            {user ? (
              <>
                <div className="flex items-center gap-[8px] pb-2">
                  <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70">
                    {profileName || user.email?.split("@")[0] || "User"}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 font-[family-name:var(--font-roboto)] text-[14px] text-white/50 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  {t("logout")}
                </button>
              </>
            ) : (
              <>
                <Button as="link" href={`/${locale}/prijava`} variant="outline" size="default" className="flex-1">
                  {t("login")}
                </Button>
                <Button as="link" href={`/${locale}/registracija`} size="default" className="flex-1">
                  {t("register")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
