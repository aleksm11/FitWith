import Navbar from "@/components/sections/Navbar";
import PortalSubNav from "@/components/portal/PortalSubNav";
import QuestionnaireNag from "@/components/portal/QuestionnaireNag";
import SwipePortalWrapper from "@/components/portal/SwipePortalWrapper";

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
      <Navbar />
      <QuestionnaireNag />
      <div className="pt-[80px] max-sm:pt-[64px]">
        <PortalSubNav />
        <SwipePortalWrapper>
          <main className="px-[40px] max-sm:px-[20px] py-[40px]">
            <div className="max-w-[1280px] mx-auto">
              {children}
            </div>
          </main>
        </SwipePortalWrapper>
      </div>
    </div>
  );
}
