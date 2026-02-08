// FitWith Design Tokens — Dark fitness theme with orange/amber accents

export const colors = {
  bgPrimary: "#0A0A0A",
  bgSecondary: "#111111",
  bgTertiary: "#1A1A1A",
  accent: "#F97316",
  accentLight: "#FB923C",
  accentDark: "#EA580C",
  accentGlow: "rgba(249, 115, 22, 0.15)",
  white: "#FFFFFF",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textMuted: "rgba(255, 255, 255, 0.5)",
  border: "rgba(255, 255, 255, 0.1)",
  borderHover: "rgba(255, 255, 255, 0.2)",
  glass: "rgba(255, 255, 255, 0.03)",
  glassBorder: "rgba(255, 255, 255, 0.1)",
} as const;

export const fonts = {
  sora: "var(--font-sora)",
  roboto: "var(--font-roboto)",
} as const;

export const typography = {
  h1: { fontFamily: fonts.sora, fontWeight: 700, fontSize: "64px", lineHeight: "72px" },
  h2: { fontFamily: fonts.sora, fontWeight: 700, fontSize: "48px", lineHeight: "56px" },
  h3: { fontFamily: fonts.sora, fontWeight: 600, fontSize: "24px", lineHeight: "34px" },
  h4: { fontFamily: fonts.roboto, fontWeight: 600, fontSize: "16px", lineHeight: "26px" },
  h5: { fontFamily: fonts.roboto, fontWeight: 500, fontSize: "16px", lineHeight: "26px", letterSpacing: "1.76px" },
  p1: { fontFamily: fonts.roboto, fontWeight: 400, fontSize: "18px", lineHeight: "28px" },
  p2: { fontFamily: fonts.roboto, fontWeight: 400, fontSize: "16px", lineHeight: "26px" },
  p3: { fontFamily: fonts.roboto, fontWeight: 400, fontSize: "12px", lineHeight: "22px" },
  priceLarge: { fontFamily: fonts.sora, fontWeight: 600, fontSize: "54px", lineHeight: "64px" },
  priceUnit: { fontFamily: fonts.sora, fontWeight: 600, fontSize: "24px", lineHeight: "34px" },
} as const;

export const effects = {
  backdropBlur: "blur(18px)",
  dropShadow: "4px 4px 20px rgba(249, 115, 22, 0.05)",
  buttonGlow: "0 4px 18px rgba(249, 115, 22, 0.15)",
  accentGlow: "0 0 40px rgba(249, 115, 22, 0.1)",
} as const;
