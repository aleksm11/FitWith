"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import { dashboardStats, recentSignups } from "@/lib/admin/mock-data";

const statCards = [
  { key: "totalClients", value: dashboardStats.totalClients, color: "text-orange-400", href: "/admin/korisnici" },
  { key: "activePlans", value: dashboardStats.activePlans, color: "text-green-400", href: "/admin/treninzi" },
  { key: "pendingMessages", value: dashboardStats.pendingMessages, color: "text-yellow-400", href: "/admin/poruke" },
  { key: "totalExercises", value: dashboardStats.totalExercises, color: "text-blue-400", href: "/admin/vezbe" },
];

export default function AdminContent() {
  const t = useTranslations("Admin");
  const locale = useLocale();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[8px]">
        {t("title")}
      </h1>
      <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[32px]">
        {t("welcomeText")}
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-4 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-[16px] mb-[32px]">
        {statCards.map((stat) => (
          <Link
            key={stat.key}
            href={`/${locale}${stat.href}`}
            className="bg-white/[0.03] border border-white/10 p-[24px] hover:border-white/20 transition-colors group"
          >
            <p className="font-[family-name:var(--font-roboto)] text-[14px] text-white/50 mb-[8px]">
              {t(stat.key)}
            </p>
            <p className={`font-[family-name:var(--font-sora)] font-bold text-[32px] ${stat.color} group-hover:brightness-110 transition-all`}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent signups */}
      <div className="bg-white/[0.03] border border-white/10 p-[24px]">
        <div className="flex items-center justify-between mb-[20px]">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white">
            {t("recentSignups")}
          </h2>
          <Link
            href={`/${locale}/admin/korisnici`}
            className="font-[family-name:var(--font-roboto)] text-[14px] text-orange-400 hover:text-orange-300 transition-colors"
          >
            {t("viewAll")}
          </Link>
        </div>

        <div className="space-y-0">
          {recentSignups.map((signup, i) => (
            <div
              key={i}
              className={`flex items-center justify-between py-[12px] ${
                i < recentSignups.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div className="flex items-center gap-[12px]">
                <div className="w-[36px] h-[36px] bg-orange-500/10 flex items-center justify-center text-orange-400 font-[family-name:var(--font-sora)] font-bold text-[14px]">
                  {signup.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-[family-name:var(--font-roboto)] text-[14px] text-white">
                    {signup.name}
                  </p>
                  <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40">
                    {signup.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-[16px]">
                <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 max-sm:hidden">
                  {signup.date}
                </span>
                <span className={`font-[family-name:var(--font-roboto)] text-[12px] px-[8px] py-[2px] ${
                  signup.tier === "mentoring"
                    ? "bg-orange-500/10 text-orange-400"
                    : signup.tier === "training"
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-green-500/10 text-green-400"
                }`}>
                  {t(signup.tier === "training" ? "trainingTier" : signup.tier === "nutrition" ? "nutritionTier" : signup.tier)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
