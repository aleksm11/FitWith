"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/shared/Button";

export default function LoginContent() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setStatus("error");
        setErrorMessage(t("invalidCredentials"));
        return;
      }

      // Redirect to intended page or portal
      window.location.href = redirect || `/${locale}/portal`;
    } catch {
      setStatus("error");
      setErrorMessage(t("genericError"));
    }
  }

  return (
    <div className="w-full max-w-[440px]">
      {/* Header */}
      <div className="text-center mb-[40px]">
        <h1 className="font-[family-name:var(--font-sora)] font-bold text-[32px] leading-[40px] max-sm:text-[24px] max-sm:leading-[32px] text-white mb-[8px]">
          {t("loginTitle")}
        </h1>
        <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50">
          {t("loginSubtitle")}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
        {/* Email */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70">
            {t("emailLabel")}
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder={t("emailPlaceholder")}
            className="bg-white/[0.03] border border-white/10 px-[16px] py-[14px] text-white font-[family-name:var(--font-roboto)] text-[16px] placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none transition-colors"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center justify-between">
            <label className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70">
              {t("passwordLabel")}
            </label>
            <Link
              href={`/${locale}/zaboravljena-lozinka`}
              className="font-[family-name:var(--font-roboto)] text-[13px] text-orange-500 hover:text-orange-400 transition-colors"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <input
            type="password"
            name="password"
            required
            placeholder={t("passwordPlaceholder")}
            className="bg-white/[0.03] border border-white/10 px-[16px] py-[14px] text-white font-[family-name:var(--font-roboto)] text-[16px] placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none transition-colors"
          />
        </div>

        {/* Error */}
        {status === "error" && (
          <p className="font-[family-name:var(--font-roboto)] text-[14px] text-red-400">
            {errorMessage}
          </p>
        )}

        {/* Submit */}
        <Button type="submit" disabled={status === "loading"} className="w-full">
          {status === "loading" ? t("loggingIn") : t("loginButton")}
        </Button>
      </form>

      {/* Register link */}
      <p className="text-center mt-[32px] font-[family-name:var(--font-roboto)] text-[14px] text-white/50">
        {t("noAccount")}{" "}
        <Link
          href={`/${locale}/registracija`}
          className="text-orange-500 hover:text-orange-400 transition-colors"
        >
          {t("registerButton")}
        </Link>
      </p>
    </div>
  );
}
