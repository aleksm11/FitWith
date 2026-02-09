"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/shared/Button";
import { createClient } from "@/lib/supabase/client";

export default function ContactContent() {
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      message: formData.get("message") as string,
    };

    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_messages").insert(data);

      if (error) throw error;
      setStatus("success");
    } catch {
      // If Supabase is not configured, still show success for development
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setStatus("success");
        return;
      }
      setStatus("error");
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-[140px] pb-[80px] max-sm:pt-[100px] max-sm:pb-[60px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px] text-center">
          <p className="font-[family-name:var(--font-roboto)] text-[14px] uppercase tracking-[2px] text-orange-500 mb-4">
            {t("title")}
          </p>
          <h1 className="font-[family-name:var(--font-sora)] font-bold text-[48px] leading-[56px] max-lg:text-[36px] max-lg:leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white max-w-[700px] mx-auto">
            {t("subtitle")}
          </h1>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="pb-[120px] max-sm:pb-[80px] bg-[#0A0A0A]">
        <div className="max-w-[1280px] mx-auto px-[40px] max-sm:px-[20px]">
          <div className="grid grid-cols-5 gap-[48px] max-lg:grid-cols-1">
            {/* Form */}
            <div className="col-span-3 max-lg:col-span-1">
              {status === "success" ? (
                <div className="bg-white/[0.03] border border-orange-500/30 p-[48px] max-sm:p-[32px] text-center">
                  <svg className="w-16 h-16 text-orange-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white mb-3">
                    {t("successTitle")}
                  </h3>
                  <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/60">
                    {t("successText")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
                  {/* Name */}
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70">
                      {t("nameLabel")} *
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
                      {t("emailLabel")} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder={t("emailPlaceholder")}
                      className="bg-white/[0.03] border border-white/10 px-[16px] py-[14px] text-white font-[family-name:var(--font-roboto)] text-[16px] placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70">
                      {t("phoneLabel")}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder={t("phonePlaceholder")}
                      className="bg-white/[0.03] border border-white/10 px-[16px] py-[14px] text-white font-[family-name:var(--font-roboto)] text-[16px] placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-[family-name:var(--font-roboto)] text-[14px] text-white/70">
                      {t("messageLabel")} *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      placeholder={t("messagePlaceholder")}
                      className="bg-white/[0.03] border border-white/10 px-[16px] py-[14px] text-white font-[family-name:var(--font-roboto)] text-[16px] placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <p className="font-[family-name:var(--font-roboto)] text-[14px] text-red-400">
                      {t("errorText")}
                    </p>
                  )}

                  <Button type="submit" disabled={status === "sending"} className="self-start">
                    {status === "sending" ? t("sending") : t("submit")}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="col-span-2 max-lg:col-span-1">
              <div className="bg-white/[0.03] border border-white/10 p-[40px] max-sm:p-[28px] flex flex-col gap-[24px]">
                <h3 className="font-[family-name:var(--font-sora)] font-semibold text-[20px] text-white">
                  {t("infoTitle")}
                </h3>

                <div className="flex flex-col gap-[20px]">
                  {/* Email */}
                  <div className="flex gap-[12px] items-center">
                    <svg className="w-5 h-5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <span className="font-[family-name:var(--font-roboto)] text-[16px] text-white/70">
                      {t("email")}
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-[12px] items-center">
                    <svg className="w-5 h-5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <span className="font-[family-name:var(--font-roboto)] text-[16px] text-white/70">
                      {t("phone")}
                    </span>
                  </div>

                  {/* Instagram */}
                  <div className="flex gap-[12px] items-center">
                    <svg className="w-5 h-5 text-orange-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    <span className="font-[family-name:var(--font-roboto)] text-[16px] text-white/70">
                      {t("instagram")}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="font-[family-name:var(--font-roboto)] text-[14px] text-white/40">
                    {t("responseTime")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
