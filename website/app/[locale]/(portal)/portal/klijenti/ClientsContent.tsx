"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getUsers, getMyProfile } from "@/lib/supabase/queries";
import type { Profile } from "@/lib/supabase/types";

export default function ClientsContent() {
  const t = useTranslations("Portal");
  const locale = useLocale();

  const [clients, setClients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPlanType, setFilterPlanType] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getMyProfile().then((p) => {
      if (p?.role === "admin") setIsAdmin(true);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getUsers(search || undefined)
      .then((data) => setClients(data.filter((p) => p.role === "client")))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search]);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50">
          {t("adminOnly")}
        </p>
      </div>
    );
  }

  const filtered = filterPlanType === "all"
    ? clients
    : clients.filter((c) => c.plan_type === filterPlanType);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[8px]">
        {t("clients")}
      </h1>
      <div className="flex items-center gap-[16px] mb-[32px]">
        <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 flex-1">
          {t("clientsSubtitle")}
        </p>
        <Link
          href={`/${locale}/portal/klijenti/sabloni`}
          className="font-[family-name:var(--font-roboto)] text-[13px] text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-[6px] shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          {t("templates")}
        </Link>
      </div>

      {/* Search & filters */}
      <div className="flex items-center gap-[16px] mb-[24px] max-sm:flex-col max-sm:items-stretch">
        <div className="relative flex-1">
          <svg
            className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchClients")}
            className="w-full bg-white/[0.03] border border-white/10 pl-[42px] pr-[16px] py-[12px] font-[family-name:var(--font-roboto)] text-[14px] text-white placeholder-white/30 focus:border-orange-500/50 focus:outline-none transition-colors"
          />
        </div>
        <select
          value={filterPlanType}
          onChange={(e) => setFilterPlanType(e.target.value)}
          className="bg-white/[0.03] border border-white/10 px-[16px] py-[12px] font-[family-name:var(--font-roboto)] text-[14px] text-white focus:border-orange-500/50 focus:outline-none transition-colors cursor-pointer"
        >
          <option value="all" className="bg-[#1a1a1a]">{t("allPlanTypes")}</option>
          <option value="workout" className="bg-[#1a1a1a]">{t("planType_workout")}</option>
          <option value="nutrition" className="bg-[#1a1a1a]">{t("planType_nutrition")}</option>
          <option value="both" className="bg-[#1a1a1a]">{t("planType_both")}</option>
          <option value="none" className="bg-[#1a1a1a]">{t("planType_none")}</option>
        </select>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-[24px] mb-[24px]">
        <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40">
          {filtered.length} {t("clientsCount")}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-[80px]">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/10 p-[32px]">
          <div className="py-[48px] text-center">
            <svg className="w-16 h-16 text-white/10 mx-auto mb-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="font-[family-name:var(--font-sora)] font-semibold text-[20px] text-white/50">
              {t("noClientsFound")}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/10">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_200px_140px_100px] max-lg:grid-cols-[1fr_140px_120px] max-sm:grid-cols-[1fr_100px] gap-[8px] px-[24px] py-[14px] border-b border-white/10">
            <span className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1.5px] text-white/30">
              {t("clientName")}
            </span>
            <span className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1.5px] text-white/30 max-sm:hidden">
              {t("emailLabel")}
            </span>
            <span className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1.5px] text-white/30 max-lg:hidden">
              {t("planTypeLabel")}
            </span>
            <span className="font-[family-name:var(--font-roboto)] text-[11px] uppercase tracking-[1.5px] text-white/30 text-right">
              {t("actions")}
            </span>
          </div>

          {/* Client rows */}
          {filtered.map((client) => (
            <div
              key={client.id}
              className="grid grid-cols-[1fr_200px_140px_100px] max-lg:grid-cols-[1fr_140px_120px] max-sm:grid-cols-[1fr_100px] gap-[8px] px-[24px] py-[16px] border-b border-white/5 last:border-0 items-center hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <p className="font-[family-name:var(--font-roboto)] text-[15px] text-white">
                  {client.full_name || t("unnamed")}
                </p>
                <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30 sm:hidden">
                  {client.email}
                </p>
              </div>
              <p className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50 truncate max-sm:hidden">
                {client.email}
              </p>
              <span className={`inline-block font-[family-name:var(--font-roboto)] text-[12px] px-[10px] py-[3px] w-fit max-lg:hidden ${
                client.plan_type === "both" ? "text-green-400 bg-green-400/10" :
                client.plan_type === "workout" ? "text-blue-400 bg-blue-400/10" :
                client.plan_type === "nutrition" ? "text-orange-400 bg-orange-400/10" :
                "text-white/40 bg-white/5"
              }`}>
                {t(`planType_${client.plan_type}`)}
              </span>
              <div className="text-right">
                <Link
                  href={`/${locale}/portal/klijenti/${client.id}`}
                  className="font-[family-name:var(--font-roboto)] text-[13px] text-orange-400 hover:text-orange-300 transition-colors"
                >
                  {t("viewClient")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
