"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { signInWithEmail, signInWithGoogle, signInWithApple } from "@/lib/supabase/auth";
import Button from "@/components/shared/Button";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );
}

export default function LoginContent() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "unverified">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const needsVerification = searchParams.get("verify") === "1";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error, emailConfirmed } = await signInWithEmail(email, password);
    if (error) {
      setStatus("error");
      setErrorMessage(error);
      return;
    }

    if (!emailConfirmed) {
      setStatus("unverified");
      return;
    }

    window.location.href = redirect || `/${locale}/portal`;
  }

  return (
    <div className="w-full max-w-[440px]">
      {/* Header */}
      <div className="text-center mb-[40px]">
        <h1 className="font-[family-name:var(--font-sora)] font-bold text-[32px] leading-[40px] max-sm:text-[24px] max-sm:leading-[32px] text-white mb-[8px]">
          {t("loginTitle")}
        </h1>
      </div>

      {/* Email verification warnings */}
      {(needsVerification || status === "unverified") && (
        <div className="mb-[24px] bg-orange-500/10 border border-orange-500/30 p-[16px]">
          <p className="font-[family-name:var(--font-roboto)] text-[14px] text-orange-400">
            {t("emailNotVerified")}
          </p>
        </div>
      )}

      {/* Social Login Buttons */}
      <div className="flex flex-col gap-[12px] mb-[24px]">
        <button
          type="button"
          onClick={() => signInWithGoogle(redirect || `/${locale}/portal`)}
          className="flex items-center justify-center gap-[12px] w-full bg-white/[0.03] border border-white/10 px-[16px] py-[14px] text-white font-[family-name:var(--font-roboto)] text-[15px] hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer"
        >
          <GoogleIcon />
          {t("signInWithGoogle")}
        </button>
        <button
          type="button"
          onClick={() => signInWithApple(redirect || `/${locale}/portal`)}
          className="flex items-center justify-center gap-[12px] w-full bg-white/[0.03] border border-white/10 px-[16px] py-[14px] text-white font-[family-name:var(--font-roboto)] text-[15px] hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer"
        >
          <AppleIcon />
          {t("signInWithApple")}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-[16px] mb-[24px]">
        <div className="flex-1 h-px bg-white/10" />
        <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40 uppercase">{t("or")}</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[8px]">
          <label className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70">
            {t("email")}
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="email@example.com"
            className="bg-white/[0.03] border border-white/10 px-[16px] py-[14px] text-white font-[family-name:var(--font-roboto)] text-[16px] placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center justify-between">
            <label className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70">
              {t("password")}
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
            placeholder="••••••••"
            className="bg-white/[0.03] border border-white/10 px-[16px] py-[14px] text-white font-[family-name:var(--font-roboto)] text-[16px] placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none transition-colors"
          />
        </div>

        {status === "error" && (
          <p className="font-[family-name:var(--font-roboto)] text-[14px] text-red-400">
            {errorMessage}
          </p>
        )}

        <Button type="submit" disabled={status === "loading"} className="w-full">
          {status === "loading" ? t("loading") : t("loginTitle")}
        </Button>
      </form>

      <p className="text-center mt-[32px] font-[family-name:var(--font-roboto)] text-[14px] text-white/50">
        {t("noAccount")}{" "}
        <Link
          href={`/${locale}/registracija`}
          className="text-orange-500 hover:text-orange-400 transition-colors"
        >
          {t("signUp")}
        </Link>
      </p>
    </div>
  );
}
