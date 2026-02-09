"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const year = new Date().getFullYear();

  const pageLinks = [
    { href: `/${locale}`, label: tNav("home") },
    { href: `/${locale}/o-meni`, label: tNav("about") },
    { href: `/${locale}/saradnja`, label: tNav("services") },
    { href: `/${locale}/vezbe`, label: tNav("exercises") },
    { href: `/${locale}/blog`, label: tNav("blog") },
    { href: `/${locale}/transformacije`, label: tNav("transformations") },
    { href: `/${locale}/kontakt`, label: tNav("contact") },
  ];

  return (
    <footer className="border-t border-white/5 bg-[#0A0A0A]">
      <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px] py-[80px] max-sm:py-[48px]">
        <div className="grid grid-cols-4 gap-[40px] max-lg:grid-cols-2 max-sm:grid-cols-1">
          {/* Brand */}
          <div className="flex flex-col gap-[16px] max-lg:col-span-2 max-sm:col-span-1">
            <Link
              href={`/${locale}`}
              className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white"
            >
              Fit<span className="text-orange-500">With</span><span className="text-orange-500">AS</span>
            </Link>
            <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white/50">
              {t("tagline")}
            </p>
            {/* Social Links */}
            <div className="flex gap-[16px] mt-2">
              <a
                href="https://www.instagram.com/fitwith.as"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-orange-500 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@fitwith.as"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-orange-500 transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Pages */}
          <div className="flex flex-col gap-[16px]">
            <h4 className="font-[family-name:var(--font-roboto)] font-bold text-[14px] leading-[24px] text-white uppercase tracking-[1px]">
              {t("pagesTitle")}
            </h4>
            <ul className="flex flex-col gap-[8px]">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-[family-name:var(--font-roboto)] text-[15px] leading-[24px] text-white/50 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-[16px]">
            <h4 className="font-[family-name:var(--font-roboto)] font-bold text-[14px] leading-[24px] text-white uppercase tracking-[1px]">
              {t("servicesTitle")}
            </h4>
            <ul className="flex flex-col gap-[8px]">
              <li>
                <Link
                  href={`/${locale}/saradnja`}
                  className="font-[family-name:var(--font-roboto)] text-[15px] leading-[24px] text-white/50 hover:text-white transition-colors"
                >
                  {t("service1")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/saradnja`}
                  className="font-[family-name:var(--font-roboto)] text-[15px] leading-[24px] text-white/50 hover:text-white transition-colors"
                >
                  {t("service2")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/saradnja`}
                  className="font-[family-name:var(--font-roboto)] text-[15px] leading-[24px] text-white/50 hover:text-white transition-colors"
                >
                  {t("service3")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-[16px]">
            <h4 className="font-[family-name:var(--font-roboto)] font-bold text-[14px] leading-[24px] text-white uppercase tracking-[1px]">
              {t("legalTitle")}
            </h4>
            <ul className="flex flex-col gap-[8px]">
              <li>
                <Link
                  href={`/${locale}/politika-privatnosti`}
                  className="font-[family-name:var(--font-roboto)] text-[15px] leading-[24px] text-white/50 hover:text-white transition-colors"
                >
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-[60px] pt-[24px] border-t border-white/5 flex items-center justify-between max-sm:flex-col max-sm:gap-4 max-sm:text-center">
          <p className="font-[family-name:var(--font-roboto)] text-[14px] text-white/30">
            {t("copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
