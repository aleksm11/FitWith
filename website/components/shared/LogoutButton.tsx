"use client";

import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const t = useTranslations("Auth");

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleLogout}
      className="font-[family-name:var(--font-roboto)] text-[14px] text-white/50 hover:text-white transition-colors cursor-pointer"
    >
      {t("logout")}
    </button>
  );
}
