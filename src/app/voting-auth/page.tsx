"use client";

import { Tajawal } from "next/font/google";
import { ArrowRight, KeyRound, Loader2, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "signin" | "signup";

type VoterForm = {
  name: string;
  commercialRegistration: string;
  mobile: string;
  establishmentName: string;
};

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function validateCommercialRegistration(value: string) {
  const digits = normalizeDigits(value);
  if (!digits) return "رقم السجل التجاري مطلوب";
  if (!/^\d{10}$/.test(digits)) return "رقم السجل التجاري يجب أن يكون 10 أرقام";
  return "";
}


function validateKsaMobile(value: string) {
  const digits = normalizeDigits(value);
  if (!digits) return "رقم الجوال مطلوب";
  
  // Regex pattern: ^(\+\d{1,3}|0)?5\d{8}$
  // Matches: +9665XXXXXXXX, 05XXXXXXXX, 5XXXXXXXX
  const regex = /^(\+\d{1,3}|0)?5\d{8}$/;
  if (!regex.test(value.trim())) return "رقم الجوال غير صحيح";
  
  return "";
}

export default function VotingAuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("signin");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [otpPhone, setOtpPhone] = useState("");
  const [otpTouched, setOtpTouched] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [voter, setVoter] = useState<VoterForm>({
    name: "",
    commercialRegistration: "",
    mobile: "",
    establishmentName: "",
  });

  const [touched, setTouched] = useState<
    Partial<Record<keyof VoterForm, boolean>>
  >({});
  const [errors, setErrors] = useState<
    Partial<Record<keyof VoterForm, string>>
  >({});

  const tabs = useMemo(
    () => [
      { key: "signin" as const, label: "تسجيل الدخول (OTP)" },
      { key: "signup" as const, label: "بيانات المصوّت" },
    ],
    []
  );

  function validateField(key: keyof VoterForm, value: string) {
    if (key === "name") return value.trim() ? "" : "الاسم مطلوب";
    if (key === "establishmentName")
      return value.trim() ? "" : "اسم المنشأة مطلوب";
    if (key === "commercialRegistration")
      return validateCommercialRegistration(value);
    if (key === "mobile") return validateKsaMobile(value);
    return "";
  }

  function validateAll(next: VoterForm) {
    const nextErrors: Partial<Record<keyof VoterForm, string>> = {};
    (Object.keys(next) as (keyof VoterForm)[]).forEach((k) => {
      const message = validateField(k, next[k]);
      if (message) nextErrors[k] = message;
    });
    return nextErrors;
  }

  async function handleSignin(phoneNumber: string) {
    setIsSubmitting(true);
    setApiError("");
    try {
      const res = await fetch("/api/GeneralAssembly/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "فشل تسجيل الدخول");

      localStorage.setItem("ga_authed", "1");
      localStorage.setItem("ga_auth_mode", "otp");
      localStorage.setItem("ga_phone", phoneNumber);
      const userId =
        data?.id || data?.userId || data?.user?.id || data?.user?.userId;
      if (userId) localStorage.setItem("ga_userId", String(userId));

      router.push("/voting-dashboard");
    } catch (e) {
      setApiError(e instanceof Error ? e.message : "حدث خطأ غير متوقع");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignup(next: VoterForm) {
    setIsSubmitting(true);
    setApiError("");
    try {
      const payload = {
        name: next.name.trim(),
        commercialRegister: normalizeDigits(next.commercialRegistration),
        mobileNumber: next.mobile,
        establishmentName: next.establishmentName.trim(),
      };

      const res = await fetch("/api/GeneralAssembly/Add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "فشل إنشاء الحساب");

      localStorage.setItem("ga_authed", "1");
      localStorage.setItem("ga_auth_mode", "registered");
      localStorage.setItem("ga_phone", payload.mobileNumber);
      const userId =
        data?.id || data?.userId || data?.user?.id || data?.user?.userId;
      if (userId) localStorage.setItem("ga_userId", String(userId));

      router.push("/voting-dashboard");
    } catch (e) {
      setApiError(e instanceof Error ? e.message : "حدث خطأ غير متوقع");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      dir="rtl"
      className={`${tajawal.className} min-h-screen bg-slate-50 py-10`}
    >
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative border-b border-slate-200 px-6 py-7">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-teal-600/10 via-white to-white" />
            <div className="relative flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-2xl font-extrabold tracking-tight text-slate-900">
                    بوابة التصويت
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-600">
                    سجّل دخولك أو أنشئ حساباً للمتابعة
                  </div>
                </div>
                {/* <button
                  type="button"
                  onClick={() => router.push('/voting-dashboard')}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                >
                  <ArrowRight className="h-4 w-4" />
                  الذهاب للوحة التصويت
                </button> */}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-2">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => {
                      setMode(t.key);
                      setApiError("");
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-extrabold transition ${
                      mode === t.key
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-700 hover:bg-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            {mode === "signin" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                    <KeyRound className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-lg font-extrabold text-slate-900">
                      التسجيل السريع (OTP)
                    </div>
                    <div className="text-sm text-slate-600">
                      أدخل رقم الجوال لإرسال رمز التحقق
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setOtpTouched(true);
                    const msg = validateKsaMobile(otpPhone);
                    setOtpError(msg);
                    if (msg) return;
                    await handleSignin(otpPhone);
                  }}
                >
                  <label className="mb-2 block text-sm font-extrabold text-slate-700">
                    رقم الجوال :
                    <span className="mr-2 text-xs font-normal text-slate-500">(05XXXXXXXX أو +9665XXXXXXXX)</span>
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      value={otpPhone}
                      onChange={(e) => {
                        setOtpPhone(e.target.value);
                        if (otpTouched)
                          setOtpError(validateKsaMobile(e.target.value));
                      }}
                      onBlur={() => {
                        setOtpTouched(true);
                        setOtpError(validateKsaMobile(otpPhone));
                      }}
                      placeholder="مثال: 0512345678"
                      inputMode="tel"
                      className="w-full flex-1 rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-right text-slate-900 shadow-inner transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                    >
                      <Loader2
                        className={`h-4 w-4 animate-spin transition-opacity ${
                          isSubmitting ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <span>تسجيل الدخول</span>
                    </button>
                  </div>
                  {otpTouched && otpError && (
                    <div className="mt-2 text-sm font-semibold text-red-600">
                      {otpError}
                    </div>
                  )}
                </form>
              </div>
            )}

            {mode === "signup" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-lg font-extrabold text-slate-900">
                      بيانات المصوّت
                    </div>
                    <div className="text-sm text-slate-600">
                      أكمل البيانات لإنشاء حساب ثم المتابعة
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const nextErrors = validateAll(voter);
                    setErrors(nextErrors);
                    setTouched({
                      name: true,
                      establishmentName: true,
                      commercialRegistration: true,
                      mobile: true,
                    });
                    if (Object.keys(nextErrors).length > 0) return;
                    await handleSignup(voter);
                  }}
                >
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="mb-2 block text-sm font-extrabold text-slate-700">
                        الاسم :
                      </label>
                      <input
                        value={voter.name}
                        onChange={(e) => {
                          const value = e.target.value;
                          setVoter((prev) => ({ ...prev, name: value }));
                          if (touched.name)
                            setErrors((prev) => ({
                              ...prev,
                              name: validateField("name", value) || undefined,
                            }));
                        }}
                        onBlur={() => {
                          setTouched((p) => ({ ...p, name: true }));
                          setErrors((p) => ({
                            ...p,
                            name:
                              validateField("name", voter.name) || undefined,
                          }));
                        }}
                        placeholder="الاسم"
                        className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-right text-slate-900 shadow-inner transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                      {touched.name && errors.name && (
                        <div className="mt-2 text-sm font-semibold text-red-600">
                          {errors.name}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-extrabold text-slate-700">
                        اسم المنشأة :
                      </label>
                      <input
                        value={voter.establishmentName}
                        onChange={(e) => {
                          const value = e.target.value;
                          setVoter((prev) => ({
                            ...prev,
                            establishmentName: value,
                          }));
                          if (touched.establishmentName)
                            setErrors((prev) => ({
                              ...prev,
                              establishmentName:
                                validateField("establishmentName", value) ||
                                undefined,
                            }));
                        }}
                        onBlur={() => {
                          setTouched((p) => ({
                            ...p,
                            establishmentName: true,
                          }));
                          setErrors((p) => ({
                            ...p,
                            establishmentName:
                              validateField(
                                "establishmentName",
                                voter.establishmentName
                              ) || undefined,
                          }));
                        }}
                        placeholder="مؤسسة"
                        className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-right text-slate-900 shadow-inner transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                      {touched.establishmentName &&
                        errors.establishmentName && (
                          <div className="mt-2 text-sm font-semibold text-red-600">
                            {errors.establishmentName}
                          </div>
                        )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-extrabold text-slate-700">
                        رقم الجوال :
                        <span className="mr-2 text-xs font-normal text-slate-500">(05XXXXXXXX أو +9665XXXXXXXX)</span>
                      </label>
                      <input
                        value={voter.mobile}
                        onChange={(e) => {
                          const value = e.target.value;
                          setVoter((prev) => ({ ...prev, mobile: value }));
                          if (touched.mobile)
                            setErrors((prev) => ({
                              ...prev,
                              mobile:
                                validateField("mobile", value) || undefined,
                            }));
                        }}
                        onBlur={() => {
                          setTouched((p) => ({ ...p, mobile: true }));
                          setErrors((p) => ({
                            ...p,
                            mobile:
                              validateField("mobile", voter.mobile) ||
                              undefined,
                          }));
                        }}
                        placeholder="مثال: 0512345678"
                        inputMode="tel"
                        className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-right text-slate-900 shadow-inner transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                      {touched.mobile && errors.mobile && (
                        <div className="mt-2 text-sm font-semibold text-red-600">
                          {errors.mobile}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-extrabold text-slate-700">
                        رقم السجل التجاري :
                      </label>
                      <input
                        value={voter.commercialRegistration}
                        onChange={(e) => {
                          const value = e.target.value;
                          setVoter((prev) => ({
                            ...prev,
                            commercialRegistration: value,
                          }));
                          if (touched.commercialRegistration)
                            setErrors((prev) => ({
                              ...prev,
                              commercialRegistration:
                                validateField(
                                  "commercialRegistration",
                                  value
                                ) || undefined,
                            }));
                        }}
                        onBlur={() => {
                          setTouched((p) => ({
                            ...p,
                            commercialRegistration: true,
                          }));
                          setErrors((p) => ({
                            ...p,
                            commercialRegistration:
                              validateField(
                                "commercialRegistration",
                                voter.commercialRegistration
                              ) || undefined,
                          }));
                        }}
                        placeholder="0101010101"
                        inputMode="numeric"
                        className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-right text-slate-900 shadow-inner transition focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      />
                      {touched.commercialRegistration &&
                        errors.commercialRegistration && (
                          <div className="mt-2 text-sm font-semibold text-red-600">
                            {errors.commercialRegistration}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                      <Loader2
                        className={`h-4 w-4 animate-spin transition-opacity ${
                          isSubmitting ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <span>إنشاء الحساب والمتابعة</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {apiError && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {apiError}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
