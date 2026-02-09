import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sr", "en", "ru"],
  defaultLocale: "sr",
  pathnames: {
    "/": "/",
    "/o-meni": {
      sr: "/o-meni",
      en: "/about",
      ru: "/o-nas",
    },
    "/saradnja": {
      sr: "/saradnja",
      en: "/services",
      ru: "/uslugi",
    },
    "/cene": {
      sr: "/cene",
      en: "/pricing",
      ru: "/ceny",
    },
    "/kontakt": {
      sr: "/kontakt",
      en: "/contact",
      ru: "/kontakty",
    },
    "/politika-privatnosti": {
      sr: "/politika-privatnosti",
      en: "/privacy-policy",
      ru: "/politika-konfidencialnosti",
    },
    "/transformacije": {
      sr: "/transformacije",
      en: "/transformations",
      ru: "/transformacii",
    },
    "/vezbe": {
      sr: "/vezbe",
      en: "/exercises",
      ru: "/uprazhneniya",
    },
    "/blog": "/blog",
    "/prijava": {
      sr: "/prijava",
      en: "/login",
      ru: "/vhod",
    },
    "/registracija": {
      sr: "/registracija",
      en: "/register",
      ru: "/registraciya",
    },
    "/zaboravljena-lozinka": {
      sr: "/zaboravljena-lozinka",
      en: "/forgot-password",
      ru: "/zabyli-parol",
    },
    "/portal": "/portal",
    "/admin": "/admin",
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;
