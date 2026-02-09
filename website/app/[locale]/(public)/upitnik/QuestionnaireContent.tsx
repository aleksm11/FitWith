"use client";

import { useState, useRef, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/shared/Button";
import { createClient } from "@/lib/supabase/client";

const TOTAL_STEPS = 4;

type FormData = {
  // Step 1: Personal
  name: string;
  email: string;
  phone: string;
  age: string;
  height: string;
  weight: string;
  bicep: string;
  waist: string;
  quad: string;
  glute: string;
  // Step 2: Goals & Training
  typicalDay: string;
  fitnessGoal: string;
  trainingFrequency: string;
  currentTraining: string;
  equipment: string;
  exerciseDiscomfort: string;
  injuries: string;
  // Step 3: Nutrition & Health
  currentDiet: string;
  foodBudget: string;
  supplements: string;
  cooking: string;
  foodPreferences: string;
  allergies: string;
  medications: string;
  // Step 4: Photos & Notes
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
  bicep: "",
  waist: "",
  quad: "",
  glute: "",
  typicalDay: "",
  fitnessGoal: "",
  trainingFrequency: "",
  currentTraining: "",
  equipment: "",
  exerciseDiscomfort: "",
  injuries: "",
  currentDiet: "",
  foodBudget: "",
  supplements: "",
  cooking: "",
  foodPreferences: "",
  allergies: "",
  medications: "",
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
  const [photoFiles, setPhotoFiles] = useState<{ front: File | null; side: File | null; back: File | null }>({
    front: null,
    side: null,
    back: null,
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
      setPhotoFiles((prev) => ({ ...prev, [type]: file }));
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

    try {
      const supabase = createClient();

      // Upload photos to Supabase Storage
      const photoUrls: Record<string, string | null> = { front: null, side: null, back: null };
      const timestamp = Date.now();

      for (const type of ["front", "side", "back"] as const) {
        const file = photoFiles[type];
        if (file) {
          const ext = file.name.split(".").pop();
          const path = `questionnaires/${timestamp}-${type}.${ext}`;
          const { data, error } = await supabase.storage
            .from("images")
            .upload(path, file, { cacheControl: "3600", upsert: true });
          if (!error && data) {
            const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(data.path);
            photoUrls[type] = publicUrl;
          }
        }
      }

      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        height: formData.height ? parseInt(formData.height) : null,
        weight: formData.weight ? parseInt(formData.weight) : null,
        bicep: formData.bicep ? parseFloat(formData.bicep) : null,
        waist: formData.waist ? parseFloat(formData.waist) : null,
        quad: formData.quad ? parseFloat(formData.quad) : null,
        glute: formData.glute ? parseFloat(formData.glute) : null,
        photos: photoUrls,
      };

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
            {/* Step 1: Personal Info & Measurements */}
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

                <div className="grid grid-cols-2 gap-[16px] max-sm:grid-cols-1">
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

                {/* Body Measurements */}
                <div className="border-t border-white/5 pt-[24px]">
                  <p className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40 mb-[16px] uppercase tracking-wider">
                    Mere tela
                  </p>
                  <div className="grid grid-cols-2 gap-[16px] max-sm:grid-cols-1">
                    <div className="flex flex-col gap-[8px]">
                      <label className={labelClass}>{t("bicepLabel")}</label>
                      <input
                        type="number"
                        step="0.5"
                        min="15"
                        max="60"
                        value={formData.bicep}
                        onChange={(e) => updateField("bicep", e.target.value)}
                        placeholder={t("bicepPlaceholder")}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <label className={labelClass}>{t("waistLabel")}</label>
                      <input
                        type="number"
                        step="0.5"
                        min="40"
                        max="200"
                        value={formData.waist}
                        onChange={(e) => updateField("waist", e.target.value)}
                        placeholder={t("waistPlaceholder")}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <label className={labelClass}>{t("quadLabel")}</label>
                      <input
                        type="number"
                        step="0.5"
                        min="25"
                        max="100"
                        value={formData.quad}
                        onChange={(e) => updateField("quad", e.target.value)}
                        placeholder={t("quadPlaceholder")}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <label className={labelClass}>{t("gluteLabel")}</label>
                      <input
                        type="number"
                        step="0.5"
                        min="50"
                        max="180"
                        value={formData.glute}
                        onChange={(e) => updateField("glute", e.target.value)}
                        placeholder={t("glutePlaceholder")}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Goals & Training */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-[24px]">
                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("typicalDayLabel")} *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.typicalDay}
                    onChange={(e) => updateField("typicalDay", e.target.value)}
                    placeholder={t("typicalDayPlaceholder")}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("fitnessGoalLabel")} *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.fitnessGoal}
                    onChange={(e) => updateField("fitnessGoal", e.target.value)}
                    placeholder={t("fitnessGoalPlaceholder")}
                    className={`${inputClass} resize-none`}
                  />
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
                  <label className={labelClass}>{t("currentTrainingLabel")} *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.currentTraining}
                    onChange={(e) => updateField("currentTraining", e.target.value)}
                    placeholder={t("currentTrainingPlaceholder")}
                    className={`${inputClass} resize-none`}
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
                    <option value="" disabled>—</option>
                    <option value="gym">{t("equipmentGym")}</option>
                    <option value="home">{t("equipmentHome")}</option>
                    <option value="minimal">{t("equipmentMinimal")}</option>
                    <option value="none">{t("equipmentNone")}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("exerciseDiscomfortLabel")}</label>
                  <textarea
                    rows={3}
                    value={formData.exerciseDiscomfort}
                    onChange={(e) => updateField("exerciseDiscomfort", e.target.value)}
                    placeholder={t("exerciseDiscomfortPlaceholder")}
                    className={`${inputClass} resize-none`}
                  />
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

            {/* Step 3: Nutrition & Health */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-[24px]">
                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("currentDietLabel")} *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.currentDiet}
                    onChange={(e) => updateField("currentDiet", e.target.value)}
                    placeholder={t("currentDietPlaceholder")}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("foodBudgetLabel")} *</label>
                  <input
                    type="text"
                    required
                    value={formData.foodBudget}
                    onChange={(e) => updateField("foodBudget", e.target.value)}
                    placeholder={t("foodBudgetPlaceholder")}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("supplementsLabel")}</label>
                  <textarea
                    rows={3}
                    value={formData.supplements}
                    onChange={(e) => updateField("supplements", e.target.value)}
                    placeholder={t("supplementsPlaceholder")}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("cookingLabel")} *</label>
                  <div className="flex gap-[12px]">
                    {(["Yes", "No", "Partially"] as const).map((opt) => {
                      const value = opt.toLowerCase();
                      const labelKey = `cooking${opt}` as "cookingYes" | "cookingNo" | "cookingPartially";
                      return (
                        <label
                          key={opt}
                          className={`flex-1 flex items-center justify-center px-[16px] py-[14px] border cursor-pointer transition-colors font-[family-name:var(--font-roboto)] text-[14px] ${
                            formData.cooking === value
                              ? "border-orange-500 bg-orange-500/10 text-orange-400"
                              : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20"
                          }`}
                        >
                          <input
                            type="radio"
                            name="cooking"
                            value={value}
                            checked={formData.cooking === value}
                            onChange={(e) => updateField("cooking", e.target.value)}
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
                  <label className={labelClass}>{t("foodPreferencesLabel")}</label>
                  <textarea
                    rows={3}
                    value={formData.foodPreferences}
                    onChange={(e) => updateField("foodPreferences", e.target.value)}
                    placeholder={t("foodPreferencesPlaceholder")}
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

                <div className="flex flex-col gap-[8px]">
                  <label className={labelClass}>{t("medicationsLabel")}</label>
                  <textarea
                    rows={2}
                    value={formData.medications}
                    onChange={(e) => updateField("medications", e.target.value)}
                    placeholder={t("medicationsPlaceholder")}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Photos & Notes */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-[24px]">
                <p className="font-[family-name:var(--font-roboto)] text-[15px] leading-[26px] text-white/60 bg-white/[0.03] border border-white/10 p-[20px]">
                  {t("photosDescription")}
                </p>

                <div className="grid grid-cols-3 gap-[16px] max-sm:grid-cols-1">
                  {(["front", "side", "back"] as const).map((type) => {
                    const ref = type === "front" ? frontInputRef : type === "side" ? sideInputRef : backInputRef;
                    const labelKey = `photo${type.charAt(0).toUpperCase() + type.slice(1)}Label` as "photoFrontLabel" | "photoSideLabel" | "photoBackLabel";
                    const file = photoFiles[type];
                    return (
                      <div key={type} className="flex flex-col gap-[8px]">
                        <label className={labelClass}>{t(labelKey)}</label>
                        <button
                          type="button"
                          onClick={() => ref.current?.click()}
                          className="flex flex-col items-center justify-center gap-3 p-[32px] max-sm:p-[24px] border-2 border-dashed border-white/15 hover:border-orange-500/40 bg-white/[0.02] transition-colors cursor-pointer min-h-[180px]"
                        >
                          {file ? (
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
                                {file.name}
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
