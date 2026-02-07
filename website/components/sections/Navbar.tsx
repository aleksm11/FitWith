"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/shared";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Classes", href: "/classes" },
  { label: "Pricing", href: "#" },
  { label: "Timetable", href: "/timetable" },
];

type NavbarProps = {
  activePage?: string;
};

export default function Navbar({ activePage = "Home" }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav className="flex items-center justify-between w-full">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center gap-[80px]">
        {/* Logo */}
        <a href="#" className="flex items-center gap-[10px]">
          <Image
            src="/assets/icons/logo-vector.svg"
            alt="FitFlex logo"
            width={38}
            height={24}
          />
          <span className="font-[family-name:var(--font-sora)] font-semibold text-[32px] leading-[42px] max-sm:text-[24px] max-sm:leading-[32px] text-white">
            FitFlex
          </span>
        </a>

        {/* Nav Links - hidden on tablet/mobile */}
        <ul className="flex gap-[50px] items-center max-lg:hidden">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`font-[family-name:var(--font-roboto)] text-[16px] leading-[26px] text-white ${
                  link.label === activePage ? "font-bold" : "opacity-60"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Contact Button - hidden on tablet/mobile */}
      <Button variant="outline" as="a" href="#" className="max-lg:hidden">
        CONTACT
      </Button>

      {/* Hamburger Button - visible on tablet/mobile */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="hidden max-lg:flex flex-col justify-center items-center w-[44px] h-[44px] gap-[6px] z-50"
        aria-label="Toggle menu"
      >
        <span
          className={`block w-[24px] h-[2px] bg-white transition-all duration-300 ${
            menuOpen ? "rotate-45 translate-y-[8px]" : ""
          }`}
        />
        <span
          className={`block w-[24px] h-[2px] bg-white transition-all duration-300 ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-[24px] h-[2px] bg-white transition-all duration-300 ${
            menuOpen ? "-rotate-45 -translate-y-[8px]" : ""
          }`}
        />
      </button>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 top-[60px] bg-[#222]/95 backdrop-blur-md z-40 hidden max-lg:flex flex-col items-center justify-center gap-[40px]">
          <ul className="flex flex-col gap-[32px] items-center">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`font-[family-name:var(--font-roboto)] text-[20px] leading-[30px] text-white ${
                    link.label === activePage ? "font-bold" : "opacity-60"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button variant="outline" as="a" href="#" onClick={() => setMenuOpen(false)}>
            CONTACT
          </Button>
        </div>
      )}
    </nav>
  );
}
