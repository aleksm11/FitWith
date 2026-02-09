import Link from "next/link";
import LogoutButton from "@/components/shared/LogoutButton";

export default function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  void params;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Portal header */}
      <header className="border-b border-white/10 px-[40px] max-sm:px-[20px] py-[16px] flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white hover:text-orange-400 transition-colors"
        >
          Fit<span className="text-orange-500">With</span>
        </Link>
        <LogoutButton />
      </header>

      {/* Portal content */}
      <main className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px] py-[40px]">
        {children}
      </main>
    </div>
  );
}
