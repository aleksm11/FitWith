"use client";

import { useState, useRef, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/shared/Button";
import { createClient } from "@/lib/supabase/client";

const TOTAL_STEPS = 4;

type FormData = {
  name: string;
  email: string;
  phone: string;
  age: string;
  height: string;
  weight: string;
  gender: string;
  fitnessGoal: string;
  experienceLevel: string;
  trainingFrequency: string;
  equipment: string;
  injuries: string;
  occupation: string;
  activityLevel: string;
  sleepHours: string;
  stressLevel: string;
  dietPreferences: string;
  allergies: string;
  additionalNotes: string;
  consent: boolean;
};

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  age: "",
  height: "",
  weight: "",
  gender: "",
  fitnessGoal: "",
  experienceLevel: "",
  trainingFrequency: "",
  equipment: "",
  injuries: "",
  occupation: "",
  activityLevel: "",
  sleepHours: "",
  stressLevel: "",
  dietPreferences: "",
  allergies: "",
  additionalNotes: "",
  consent: false,
};

const inputClass =
  "bg-white/[0.03] border border-white/10 px-[16px] py-[14px] text-white font-[family-name:var(--font-roboto)] text-[16px] placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none transition-colors w-full";

const selectClass =
  "bg-white/[0.03] border border-white/10 px-[16px] py-[14px] text-white font-[family-name:var(--font-roboto)] text-[16px] focus:border-orange-500/50 focus:outline-none transition-colors w-full appearance-none cursor-pointer";

const labelClass = "font-[family-name:var(--font-roboto)] text-[14px] text-white/70";

export default function QuestionnaireContent() {
  const t = useTranslations("Questionnaire");
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [photoNames, setPhotoNames] = useState<{ front: string; side: string; back: string }>({
    front: "",
    side: "",
    back: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const frontInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  function updateField(field: keyof FormData, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handlePhotoChange(type: "front" | "side" | "back", e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoNames((prev) => ({ ...prev, [type]: file.name }));
    }
  }

  function handleNext() {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handlePrevious() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (currentStep < TOTAL_STEPS - 1) {
      handleNext();
      return;
    }

    setStatus("sending");

    const payload = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
      height: formData.height ? parseInt(formData.height) : null,
      weight: formData.weight ? parseInt(formData.weight) : null,
      sleepHours: formData.sleepHours ? parseInt(formData.sleepHours) : null,
      photos: {
        front: photoNames.front || null,
        side: photoNames.side || null,
        back: photoNames.back || null,
      },
    };

    try {
      const supabase = createClient();
      const { error } = await supabase.from("questionnaires").insert({
        data: payload,
        email: formData.email,
        name: formData.name,
      });

      if (error) throw error;
      setStatus("success");
    } catch {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setStatus("success");
        return;
      }
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <>
        <section className="pt-[140px] pb-[120px] max-sm:pt-[100px] max-sm:pb-[80px] bg-[#0A0A0A]">
          <div className="max-w-[640px] mx-auto px-[40px] max-sm:px-[20px]">
            <div className="bg-white/[0.03] border border-orange-500/30 p-[48px] max-sm:p-[32px] text-center">
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
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-[family-name:var(--font-sora)] font-bold text-[24px] text-white mb-3">
                {t("successTitle")}
              </h3>
              <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/60">
                {t("successText")}
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-[140px] pb-[40px] max-sm:pt-[100px] max-sm:pb-[24px] bg-[#0A0A0A]">
        <div className="max-w-[640px] mx-auto px-[40px] max-sm:px-[20px] text-center">
          <p className="font-[family-name:var(--font-roboto)] text-[14px] uppercase tracking-[2px] text-orange-500 mb-4">
            {t("title")}
          </p>
          <h1 className="font-[family-name:var(--font-sora)] font-bold text-[48px] leading-[56px] max-lg:text-[36px] max-lg:leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-6">
            {t("subtitle")}
          </h1>
          <p className="font-[family-name:var(--font-roboto)] text-[16px] leading-[28px] text-white/60">
            {t("intro")}
          </p>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="pb-[40px] max-sm:pb-[24px] bg-[#0A0A0A]">
        <div className="max-w-[640px] mx-auto px-[40px] max-sm:px-[20px]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/50">
              {t("step")} {currentStep + 1} {t("of")} {TOTAL_STEPS}
            </span>
            <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/50">
              {[t("step1Title"), t("step2Title"), t("step3Title"), t("step4Title")][currentStep]}
            </span>
          </div>
          <div className="h-[3px] bg-white/10 w-full">
            <div
              className="h-full bg-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {[t("step1Title"), t("step2Title"), t("step3Title"), t("step4Title")].map((label, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setCurrentStep(i);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                  i <= currentStep ? "text-orange-500" : "text-white/30"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-[family-name:var(--font-sora)] font-semibold border transition-colors ${
                    i < currentStep
                      ? "bg-orange-500 border-orange-500 text-white"
                      : i === currentStep
                        ? "border-orange-500 text-orange-500"
                        : "border-white/20 text-white/30"
                  }`}
                >
                  {i < currentStep ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="text-[12px] font-[family-name:var(--font-roboto)] hidden sm:block">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-[120px] max-sm:pb-[80px] bg-[#0A0A0A]">
        <div className="max-w-[640px] mx-auto px-[40px] max-sm:px-[20px]">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Info */}
            {currentStep === 0 && (
              <div className="flex flex-col gap-[24px]">
                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("nameLabel")} *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder={t("namePlaceholder")}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("emailLabel")} *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("phoneLabel")} *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder={t("phonePlaceholder")}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-3 gap-[16px] max-sm:grid-cols-1">
                  <div className="flex flex-col gap-[8px]">
                    <label className={labelClass}>{t("ageLabel")} *</label>
                    <input
                      type="number"
                      required
                      min="14"
                      max="99"
                      value={formData.age}
                      onChange={(e) => updateField("age", e.target.value)}
                      placeholder={t("agePlaceholder")}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <label className={labelClass}>{t("heightLabel")} *</label>
                    <input
                      type="number"
                      required
                      min="100"
                      max="250"
                      value={formData.height}
                      onChange={(e) => updateField("height", e.target.value)}
                      placeholder={t("heightPlaceholder")}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <label className={labelClass}>{t("weightLabel")} *</label>
                    <input
                      type="number"
                      required
                      min="30"
                      max="300"
                      value={formData.weight}
                      onChange={(e) => updateField("weight", e.target.value)}
                      placeholder={t("weightPlaceholder")}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("genderLabel")} *</label>
                  <div className="flex gap-[16px]">
                    {(["Male", "Female", "Other"] as const).map((g) => {
                      const value = g.toLowerCase();
                      const labelKey = `gender${g}` as const;
                      return (
                        <label
                          key={g}
                          className={`flex-1 flex items-center justify-center gap-2 px-[16px] py-[14px] border cursor-pointer transition-colors font-[family-name:var(--font-roboto)] text-[14px] ${
                            formData.gender === value
                              ? "border-orange-500 bg-orange-500/10 text-orange-400"
                              : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20"
                          }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={value}
                            checked={formData.gender === value}
                            onChange={(e) => updateField("gender", e.target.value)}
                            className="sr-only"
                            required
                          />
                          {t(labelKey)}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Goals */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-[24px]">
                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("fitnessGoalLabel")} *</label>
                  <select
                    required
                    value={formData.fitnessGoal}
                    onChange={(e) => updateField("fitnessGoal", e.target.value)}
                    className={selectClass}
                  >
                    <option value="" disabled>
                      {t("fitnessGoalPlaceholder")}
                    </option>
                    <option value="weight_loss">{t("goalWeightLoss")}</option>
                    <option value="muscle_gain">{t("goalMuscleGain")}</option>
                    <option value="strength">{t("goalStrength")}</option>
                    <option value="endurance">{t("goalEndurance")}</option>
                    <option value="health">{t("goalHealth")}</option>
                    <option value="other">{t("goalOther")}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("experienceLabel")} *</label>
                  <div className="flex flex-col gap-[10px]">
                    {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => {
                      const value = lvl.toLowerCase();
                      const labelKey = `experience${lvl}` as const;
                      return (
                        <label
                          key={lvl}
                          className={`flex items-center gap-3 px-[16px] py-[14px] border cursor-pointer transition-colors font-[family-name:var(--font-roboto)] text-[14px] ${
                            formData.experienceLevel === value
                              ? "border-orange-500 bg-orange-500/10 text-orange-400"
                              : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20"
                          }`}
                        >
                          <input
                            type="radio"
                            name="experienceLevel"
                            value={value}
                            checked={formData.experienceLevel === value}
                            onChange={(e) => updateField("experienceLevel", e.target.value)}
                            className="sr-only"
                            required
                          />
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              formData.experienceLevel === value
                                ? "border-orange-500"
                                : "border-white/30"
                            }`}
                          >
                            {formData.experienceLevel === value && (
                              <div className="w-2 h-2 rounded-full bg-orange-500" />
                            )}
                          </div>
                          {t(labelKey)}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("trainingFrequencyLabel")} *</label>
                  <input
                    type="text"
                    required
                    value={formData.trainingFrequency}
                    onChange={(e) => updateField("trainingFrequency", e.target.value)}
                    placeholder={t("trainingFrequencyPlaceholder")}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("equipmentLabel")} *</label>
                  <select
                    required
                    value={formData.equipment}
                    onChange={(e) => updateField("equipment", e.target.value)}
                    className={selectClass}
                  >
                    <option value="" disabled>
                      —
                    </option>
                    <option value="gym">{t("equipmentGym")}</option>
                    <option value="home">{t("equipmentHome")}</option>
                    <option value="minimal">{t("equipmentMinimal")}</option>
                    <option value="none">{t("equipmentNone")}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("injuriesLabel")}</label>
                  <textarea
                    rows={3}
                    value={formData.injuries}
                    onChange={(e) => updateField("injuries", e.target.value)}
                    placeholder={t("injuriesPlaceholder")}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Lifestyle */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-[24px]">
                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("occupationLabel")} *</label>
                  <input
                    type="text"
                    required
                    value={formData.occupation}
                    onChange={(e) => updateField("occupation", e.target.value)}
                    placeholder={t("occupationPlaceholder")}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("activityLevelLabel")} *</label>
                  <select
                    required
                    value={formData.activityLevel}
                    onChange={(e) => updateField("activityLevel", e.target.value)}
                    className={selectClass}
                  >
                    <option value="" disabled>
                      —
                    </option>
                    <option value="sedentary">{t("activitySedentary")}</option>
                    <option value="light">{t("activityLight")}</option>
                    <option value="moderate">{t("activityModerate")}</option>
                    <option value="active">{t("activityActive")}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("sleepLabel")} *</label>
                  <input
                    type="number"
                    required
                    min="3"
                    max="14"
                    value={formData.sleepHours}
                    onChange={(e) => updateField("sleepHours", e.target.value)}
                    placeholder={t("sleepPlaceholder")}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("stressLabel")} *</label>
                  <div className="grid grid-cols-4 gap-[10px] max-sm:grid-cols-2">
                    {(["Low", "Medium", "High", "VeryHigh"] as const).map((lvl) => {
                      const value = lvl.toLowerCase();
                      const labelKey = `stress${lvl}` as const;
                      return (
                        <label
                          key={lvl}
                          className={`flex items-center justify-center px-[12px] py-[12px] border cursor-pointer transition-colors font-[family-name:var(--font-roboto)] text-[13px] text-center ${
                            formData.stressLevel === value
                              ? "border-orange-500 bg-orange-500/10 text-orange-400"
                              : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20"
                          }`}
                        >
                          <input
                            type="radio"
                            name="stressLevel"
                            value={value}
                            checked={formData.stressLevel === value}
                            onChange={(e) => updateField("stressLevel", e.target.value)}
                            className="sr-only"
                            required
                          />
                          {t(labelKey)}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("dietLabel")}</label>
                  <textarea
                    rows={3}
                    value={formData.dietPreferences}
                    onChange={(e) => updateField("dietPreferences", e.target.value)}
                    placeholder={t("dietPlaceholder")}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("allergiesLabel")}</label>
                  <textarea
                    rows={2}
                    value={formData.allergies}
                    onChange={(e) => updateField("allergies", e.target.value)}
                    placeholder={t("allergiesPlaceholder")}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Photos */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-[24px]">
                <p className="font-[family-name:var(--font-roboto)] text-[15px] leading-[26px] text-white/60 bg-white/[0.03] border border-white/10 p-[20px]">
                  {t("photosDescription")}
                </p>

                <div className="grid grid-cols-3 gap-[16px] max-sm:grid-cols-1">
                  {(["front", "side", "back"] as const).map((type) => {
                    const ref = type === "front" ? frontInputRef : type === "side" ? sideInputRef : backInputRef;
                    const labelKey = `photo${type.charAt(0).toUpperCase() + type.slice(1)}Label` as "photoFrontLabel" | "photoSideLabel" | "photoBackLabel";
                    return (
                      <div key={type} className="flex flex-col gap-[8px]">
                        <label className={labelClass}>{t(labelKey)}</label>
                        <button
                          type="button"
                          onClick={() => ref.current?.click()}
                          className="flex flex-col items-center justify-center gap-3 p-[32px] max-sm:p-[24px] border-2 border-dashed border-white/15 hover:border-orange-500/40 bg-white/[0.02] transition-colors cursor-pointer min-h-[180px]"
                        >
                          {photoNames[type] ? (
                            <>
                              <svg
                                className="w-8 h-8 text-orange-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/60 text-center break-all">
                                {photoNames[type]}
                              </span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-8 h-8 text-white/30"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                />
                              </svg>
                              <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40 text-center">
                                {t("photoUploadText")}
                              </span>
                              <span className="font-[family-name:var(--font-roboto)] text-[11px] text-white/25">
                                {t("photoFormats")}
                              </span>
                            </>
                          )}
                        </button>
                        <input
                          ref={ref}
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={(e) => handlePhotoChange(type, e)}
                          className="hidden"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("additionalNotesLabel")}</label>
                  <textarea
                    rows={4}
                    value={formData.additionalNotes}
                    onChange={(e) => updateField("additionalNotes", e.target.value)}
                    placeholder={t("additionalNotesPlaceholder")}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => updateField("consent", e.target.checked)}
                    required
                    className="mt-1 w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                  <span className="font-[family-name:var(--font-roboto)] text-[14px] text-white/60 leading-[22px]">
                    {t("consentLabel")} *
                  </span>
                </label>
              </div>
            )}

            {/* Error message */}
            {status === "error" && (
              <p className="font-[family-name:var(--font-roboto)] text-[14px] text-red-400 mt-6">
                {t("errorText")}
              </p>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-[40px] gap-4">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center gap-2 font-[family-name:var(--font-roboto)] text-[14px] text-white/60 hover:text-white transition-colors cursor-pointer px-[20px] py-[12px]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  {t("previous")}
                </button>
              ) : (
                <div />
              )}

              {currentStep < TOTAL_STEPS - 1 ? (
                <Button type="submit">{t("next")}</Button>
              ) : (
                <Button type="submit" disabled={status === "sending"}>
                  {status === "sending" ? t("sending") : t("submit")}
                </Button>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
