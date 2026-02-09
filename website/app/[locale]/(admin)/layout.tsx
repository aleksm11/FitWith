import Link from "next/link";
import LogoutButton from "@/components/shared/LogoutButton";
import AdminNav from "@/components/admin/AdminNav";

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

      {/* Sidebar + content */}
      <div className="flex max-lg:flex-col">
        {/* Sidebar */}
        <aside className="w-[240px] max-lg:w-full shrink-0 border-r max-lg:border-r-0 max-lg:border-b border-white/10 py-[24px] max-lg:py-[16px] px-[16px] max-lg:px-[40px] max-sm:px-[20px]">
          <AdminNav />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-[40px] max-sm:px-[20px] py-[40px]">
          <div className="max-w-[1120px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
