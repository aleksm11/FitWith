import { Sora, Roboto } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${sora.variable} ${roboto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
