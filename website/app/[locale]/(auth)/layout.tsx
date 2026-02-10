import Logo from "@/components/shared/Logo";

export default function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // params is used by Next.js for locale — suppress unused warning
  void params;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Minimal header */}
      <header className="px-[40px] max-sm:px-[20px] py-[24px]">
        <Logo />
      </header>

      {/* Auth content */}
      <main className="flex-1 flex items-center justify-center px-[40px] max-sm:px-[20px] pb-[80px]">
        {children}
      </main>
    </div>
  );
}
