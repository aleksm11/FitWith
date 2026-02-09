"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/shared/Button";

export default function RegisterContent() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validation
    if (password.length < 6) {
      setStatus("error");
      setErrorMessage(t("passwordMinLength"));
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setErrorMessage(t("passwordMismatch"));
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setStatus("error");
        if (error.message.includes("already registered")) {
          setErrorMessage(t("emailInUse"));
        } else {
          setErrorMessage(t("genericError"));
        }
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(t("genericError"));
    }
  }

  if (status === "success") {
    return (
      <div className="w-full max-w-[440px] text-center">
        <div className="bg-white/[0.03] border border-orange-500/30 p-[48px] max-sm:p-[32px]">
          <svg
            className="w-16 h-16 text-orange-500 mx-auto mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
          <h2 className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white mb-3">
            {t("registerTitle")}
          </h2>
          <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/60">
            {t("registerSuccess")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px]">
      {/* Header */}
      <div className="text-center mb-[40px]">
        <h1 className="font-[family-name:var(--font-sora)] font-bold text-[32px] leading-[40px] max-sm:text-[24px] max-sm:leading-[32px] text-white mb-[8px]">
          {t("registerTitle")}
        </h1>
        <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50">
          {t("registerSubtitle")}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
        {/* Name */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70">
            {t("nameLabel")}
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder={t("namePlaceholder")}
            className="bg-white/[0.03] border border-white/10 px-[16px] py-[14px] text-white font-[family-name:var(--font-roboto)] text-[16px] placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none transition-colors"
          />
        </div>

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
          <label className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70">
            {t("passwordLabel")}
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            placeholder={t("passwordPlaceholder")}
            className="bg-white/[0.03] border border-white/10 px-[16px] py-[14px] text-white font-[family-name:var(--font-roboto)] text-[16px] placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none transition-colors"
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-[8px]">
          <label className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70">
            {t("confirmPasswordLabel")}
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={6}
            placeholder={t("confirmPasswordPlaceholder")}
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
          {status === "loading" ? t("registering") : t("registerButton")}
        </Button>
      </form>

      {/* Login link */}
      <p className="text-center mt-[32px] font-[family-name:var(--font-roboto)] text-[14px] text-white/50">
        {t("hasAccount")}{" "}
        <Link
          href={`/${locale}/prijava`}
          className="text-orange-500 hover:text-orange-400 transition-colors"
        >
          {t("loginButton")}
        </Link>
      </p>
    </div>
  );
}
