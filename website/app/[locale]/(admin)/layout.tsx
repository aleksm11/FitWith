import Link from "next/link";
import LogoutButton from "@/components/shared/LogoutButton";

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  void params;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Admin header */}
      <header className="border-b border-white/10 px-[40px] max-sm:px-[20px] py-[16px] flex items-center justify-between">
        <div className="flex items-center gap-[16px]">
          <Link
            href="/"
            className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white hover:text-orange-400 transition-colors"
          >
            Fit<span className="text-orange-500">With</span>
          </Link>
          <span className="text-[12px] font-[family-name:var(--font-roboto)] uppercase tracking-[1px] text-orange-500 bg-orange-500/10 px-[8px] py-[2px]">
            Admin
          </span>
        </div>
        <LogoutButton />
      </header>

      {/* Admin content */}
      <main className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px] py-[40px]">
        {children}
      </main>
    </div>
  );
}
