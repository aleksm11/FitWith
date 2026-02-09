"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { mockUsers, type AdminUser } from "@/lib/admin/mock-data";

const tierColors: Record<string, string> = {
  mentoring: "bg-orange-500/10 text-orange-400",
  training: "bg-blue-500/10 text-blue-400",
  nutrition: "bg-green-500/10 text-green-400",
  none: "bg-white/5 text-white/40",
};

export default function UsersContent() {
  const t = useTranslations("Admin");
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const filtered = mockUsers.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesTier = tierFilter === "all" || user.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[8px]">
        {t("usersTitle")}
      </h1>
      <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[32px]">
        {filtered.length} korisnika
      </p>

      {/* Filters */}
      <div className="flex gap-[12px] mb-[24px] max-sm:flex-col">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search")}
          className="flex-1 bg-white/[0.03] border border-white/10 px-[16px] py-[10px] text-[14px] text-white font-[family-name:var(--font-roboto)] placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-colors"
        />
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="bg-white/[0.03] border border-white/10 px-[16px] py-[10px] text-[14px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50 transition-colors"
        >
          <option value="all" className="bg-[#1A1A1A]">{t("allTiers")}</option>
          <option value="mentoring" className="bg-[#1A1A1A]">{t("mentoring")}</option>
          <option value="training" className="bg-[#1A1A1A]">{t("trainingTier")}</option>
          <option value="nutrition" className="bg-[#1A1A1A]">{t("nutritionTier")}</option>
          <option value="none" className="bg-[#1A1A1A]">{t("none")}</option>
        </select>
      </div>

      {/* Users table */}
      <div className="bg-white/[0.03] border border-white/10 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_1fr_120px_120px_80px] max-lg:hidden gap-[16px] px-[20px] py-[12px] border-b border-white/10 bg-white/[0.02]">
          <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("name")}</span>
          <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("email")}</span>
          <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("tier")}</span>
          <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("status")}</span>
          <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 uppercase tracking-wider">{t("role")}</span>
        </div>

        {/* Table rows */}
        {filtered.map((user, i) => (
          <button
            key={user.id}
            onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
            className={`w-full text-left grid grid-cols-[1fr_1fr_120px_120px_80px] max-lg:grid-cols-1 gap-[16px] max-lg:gap-[8px] px-[20px] py-[14px] hover:bg-white/[0.02] transition-colors cursor-pointer ${
              i < filtered.length - 1 ? "border-b border-white/5" : ""
            } ${selectedUser?.id === user.id ? "bg-orange-500/5" : ""}`}
          >
            <div className="flex items-center gap-[10px]">
              <div className="w-[32px] h-[32px] bg-orange-500/10 flex items-center justify-center text-orange-400 font-[family-name:var(--font-sora)] font-bold text-[12px] shrink-0">
                {user.fullName.split(" ").map((n) => n[0]).join("")}
              </div>
              <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white truncate">
                {user.fullName}
              </span>
            </div>
            <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/60 truncate max-lg:pl-[42px]">
              {user.email}
            </span>
            <div className="max-lg:pl-[42px]">
              <span className={`inline-block font-[family-name:var(--font-roboto)] text-[12px] px-[8px] py-[2px] ${tierColors[user.tier]}`}>
                {t(user.tier === "training" ? "trainingTier" : user.tier === "nutrition" ? "nutritionTier" : user.tier === "mentoring" ? "mentoring" : "none")}
              </span>
            </div>
            <div className="max-lg:pl-[42px]">
              <span className={`inline-block font-[family-name:var(--font-roboto)] text-[12px] px-[8px] py-[2px] ${
                user.subscriptionActive ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/40"
              }`}>
                {user.subscriptionActive ? t("active") : t("inactive")}
              </span>
            </div>
            <span className={`font-[family-name:var(--font-roboto)] text-[12px] max-lg:pl-[42px] ${
              user.role === "admin" ? "text-orange-400" : "text-white/40"
            }`}>
              {user.role === "admin" ? t("admin") : t("client")}
            </span>
          </button>
        ))}
      </div>

      {/* User detail panel */}
      {selectedUser && (
        <div className="mt-[24px] bg-white/[0.03] border border-white/10 p-[24px]">
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white mb-[20px]">
            {t("userDetails")}
          </h2>
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-[16px]">
            <DetailRow label={t("name")} value={selectedUser.fullName} />
            <DetailRow label={t("email")} value={selectedUser.email} />
            <DetailRow label={t("phone")} value={selectedUser.phone} />
            <DetailRow label={t("memberSince")} value={selectedUser.memberSince} />
            <DetailRow label={t("lastLogin")} value={selectedUser.lastLogin} />
            <div>
              <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("role")}</p>
              <select
                defaultValue={selectedUser.role}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
              >
                <option value="client" className="bg-[#1A1A1A]">{t("client")}</option>
                <option value="admin" className="bg-[#1A1A1A]">{t("admin")}</option>
              </select>
            </div>
            <div>
              <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{t("tier")}</p>
              <select
                defaultValue={selectedUser.tier}
                className="w-full bg-white/[0.03] border border-white/10 px-[12px] py-[8px] text-[14px] text-white font-[family-name:var(--font-roboto)] focus:outline-none focus:border-orange-500/50"
              >
                <option value="mentoring" className="bg-[#1A1A1A]">{t("mentoring")}</option>
                <option value="training" className="bg-[#1A1A1A]">{t("trainingTier")}</option>
                <option value="nutrition" className="bg-[#1A1A1A]">{t("nutritionTier")}</option>
                <option value="none" className="bg-[#1A1A1A]">{t("none")}</option>
              </select>
            </div>
          </div>
          <div className="flex gap-[12px] mt-[20px]">
            <button className="bg-orange-500 text-white px-[20px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] hover:bg-orange-400 transition-colors">
              {t("save")}
            </button>
            <button
              onClick={() => setSelectedUser(null)}
              className="border border-white/20 text-white/70 px-[20px] py-[10px] font-[family-name:var(--font-roboto)] text-[14px] hover:border-white/40 transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-[family-name:var(--font-roboto)] text-[12px] text-white/40 mb-[4px]">{label}</p>
      <p className="font-[family-name:var(--font-roboto)] text-[14px] text-white">{value}</p>
    </div>
  );
}
