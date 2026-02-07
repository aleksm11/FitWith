// FitWith Design Tokens — extracted from Figma

export const colors = {
  black: "#222222",
  lemon: "#F2FD84",
  white: "#FFFFFF",
  glass: "rgba(255, 255, 255, 0.03)",
  glassBorder: "rgba(255, 255, 255, 0.5)",
  glassLight: "rgba(255, 255, 255, 0.04)",
} as const;

export const fonts = {
  sora: "var(--font-sora)",
  roboto: "var(--font-roboto)",
} as const;

export const typography = {
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
  dropShadow: "4px 4px 20px rgba(242, 253, 132, 0.05)",
  buttonGlow: "0 4px 18px rgba(242, 253, 132, 0.09)",
} as const;
