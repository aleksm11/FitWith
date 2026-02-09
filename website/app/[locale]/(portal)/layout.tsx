import Link from "next/link";
import LogoutButton from "@/components/shared/LogoutButton";
import PortalNav from "@/components/portal/PortalNav";

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

      {/* Sidebar + content */}
      <div className="flex max-lg:flex-col">
        {/* Sidebar */}
        <aside className="w-[240px] max-lg:w-full shrink-0 border-r max-lg:border-r-0 max-lg:border-b border-white/10 py-[24px] max-lg:py-[16px] px-[16px] max-lg:px-[40px] max-sm:px-[20px]">
          <PortalNav />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-[40px] max-sm:px-[20px] py-[40px]">
          <div className="max-w-[1040px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
