"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  HardHat,
  Info,
  LoaderCircle,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  Wrench,
  X,
} from "lucide-react";
import { CATEGORY_OPTIONS } from "@/lib/categories";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-line bg-paper/60 py-3.5 pl-11 pr-4 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-pine focus:bg-card";

export function WorkerAuthForm() {
  const router = useRouter();
  const { locale, t, setLocale } = useLanguage();
  const wa = t.workerAuth;
  const pt = t.postForm;

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerifyLoading, setOtpVerifyLoading] = useState(false);
  const [otpNote, setOtpNote] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [demoCode, setDemoCode] = useState("");
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  async function requestOtp() {
    if (otpLoading) return;
    if (phone.trim().length < 11) {
      setOtpNote(pt.phoneMinErr);
      return;
    }
    setOtpLoading(true);
    setOtpNote("");
    setPhoneVerified(false);
    try {
      const res = await fetch("/api/worker/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        message?: string;
        demoCode?: string;
      };
      if (!res.ok || !json.ok) {
        setOtpNote(json.error ?? pt.otpSendErr);
        return;
      }
      setOtpNote(json.message ?? pt.otpSentMsg);
      setDemoCode(json.demoCode ?? "");
      if (json.demoCode) {
        setOtpCode(json.demoCode);
      }
    } catch {
      setOtpNote(pt.networkErr);
    } finally {
      setOtpLoading(false);
    }
  }

  async function verifyOtp() {
    if (otpVerifyLoading) return;
    setOtpVerifyLoading(true);
    setOtpNote("");
    try {
      const res = await fetch("/api/worker/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otpCode }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setPhoneVerified(false);
        setOtpNote(json.error ?? pt.otpInvalidErr);
        return;
      }
      setPhoneVerified(true);
      setOtpNote(pt.verifiedText);
    } catch {
      setOtpNote(pt.networkErr);
    } finally {
      setOtpVerifyLoading(false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "signup") {
      if (!phoneVerified) {
        setLoading(false);
        setError(wa.otpRequiredErr);
        return;
      }
      if (password !== confirmPassword) {
        setLoading(false);
        setError(wa.passwordMismatchErr);
        return;
      }
    }

    try {
      const body = Object.fromEntries(data.entries());
      const res = await fetch(
        mode === "login" ? "/api/worker/login" : "/api/worker/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok || !json.ok) {
        setError(json.error ?? pt.genericErr);
        return;
      }
      if (mode === "login") {
        router.push("/dashboard");
        router.refresh();
        return;
      }
      form.reset();
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setOtpCode("");
      setPhoneVerified(false);
      setOtpNote("");
      setDemoCode("");
      setMode("login");
      setMessage(json.message ?? "");
    } catch {
      setError(pt.networkErr);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.08fr_1fr]">
      <div className="relative hidden overflow-hidden bg-pine-deep text-paper lg:flex lg:flex-col">
        <div className="dots-bg-light absolute inset-0 opacity-40" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-mint/10 blur-[120px]" />
        <div className="absolute -right-16 top-16 h-72 w-72 rounded-full bg-ochre/10 blur-[100px]" />
        <div className="relative flex flex-1 flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-mint text-pine-deep">
              <HardHat size={18} strokeWidth={2.2} />
            </span>
            <span className="font-latin text-lg font-bold">
              Work<span className="text-mint">Culvert</span>
            </span>
          </Link>

          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[12px] font-semibold text-mint">
              <Sparkles size={12} /> {wa.sideBadge}
            </p>
            <h2 className="mt-6 max-w-md text-4xl font-bold leading-[1.35]">
              {wa.sideTitlePrefix}{" "}
              <span className="font-serif text-mint">
                {wa.sideTitleHighlight}
              </span>
              {wa.sideTitleSuffix}
            </h2>
            <ul className="mt-8 space-y-4 text-[14px] text-paper/70">
              {wa.sideBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <p className="text-[12px] text-paper/40">{wa.sideFooter}</p>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="dots-bg absolute inset-0" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-xl"
        >
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-mist transition-colors hover:text-pine"
            >
              <ArrowLeft size={15} /> {wa.backHome}
            </Link>
            <div className="inline-flex items-center rounded-full border border-line bg-card p-0.5 text-[12px] font-bold">
              <button
                type="button"
                onClick={() => setLocale("bn")}
                className={cn(
                  "rounded-full px-2.5 py-1 transition-colors",
                  locale === "bn" ? "bg-pine text-paper" : "text-mist"
                )}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={cn(
                  "rounded-full px-2.5 py-1 font-latin transition-colors",
                  locale === "en" ? "bg-pine text-paper" : "text-mist"
                )}
              >
                EN
              </button>
            </div>
          </div>

          <div className="shadow-lift rounded-3xl border border-line bg-card p-6 sm:p-9">
            <div className="grid grid-cols-2 gap-1 rounded-full border border-line bg-paper p-1">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    setError("");
                    setMessage("");
                  }}
                  className={`rounded-full py-2.5 text-[14px] font-semibold transition-colors ${
                    mode === m
                      ? "bg-pine text-paper shadow"
                      : "text-mist hover:text-ink"
                  }`}
                >
                  {m === "login" ? wa.tabLogin : wa.tabSignup}
                </button>
              ))}
            </div>

            <h1 className="mt-6 text-[24px] font-bold text-ink sm:text-[26px]">
              {mode === "login" ? wa.loginHeading : wa.signupHeading}
            </h1>
            <p className="mt-1.5 text-[14px] text-mist">
              {mode === "login" ? wa.loginSub : wa.signupSub}
            </p>

            {mode === "signup" && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-pine/15 bg-tint/60 px-3.5 py-2.5 text-[12px] leading-relaxed text-pine">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>{wa.demoNotice}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {mode === "signup" && (
                <>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-faint"
                    />
                    <input
                      name="fullName"
                      required
                      placeholder={wa.fullNamePlaceholder}
                      className={inputCls}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative">
                      <Wrench
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-faint"
                      />
                      <select
                        name="category"
                        required
                        className={inputCls}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {wa.categoryPlaceholder}
                        </option>
                        {CATEGORY_OPTIONS.map((c) => (
                          <option key={c.value} value={c.value}>
                            {locale === "en" ? c.en : c.bn}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-faint"
                      />
                      <input
                        name="baseLocation"
                        required
                        placeholder={wa.baseLocationPlaceholder}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-faint"
                      />
                      <input
                        name="currentLocation"
                        required
                        placeholder={wa.currentLocationPlaceholder}
                        className={inputCls}
                      />
                    </div>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-faint"
                      />
                      <input
                        name="experienceYears"
                        inputMode="numeric"
                        placeholder={wa.expPlaceholder}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <textarea
                    name="bio"
                    rows={3}
                    placeholder={wa.bioPlaceholder}
                    className="w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-pine focus:bg-card"
                  />
                </>
              )}

              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-faint"
                />
                <input
                  name="phone"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneVerified(false);
                  }}
                  placeholder={wa.phonePlaceholder}
                  className={inputCls}
                />
              </div>

              {mode === "signup" && (
                <>
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <div className="relative">
                      <ShieldCheck
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-faint"
                      />
                      <input
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder={wa.otpPlaceholder}
                        className={inputCls}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={requestOtp}
                        disabled={otpLoading}
                        className="flex-1 rounded-xl border border-line bg-paper px-4 py-3 text-[13px] font-semibold text-pine transition-colors hover:bg-tint disabled:opacity-60 sm:flex-none"
                      >
                        {otpLoading ? (
                          <LoaderCircle size={15} className="animate-spin" />
                        ) : (
                          wa.sendOtpBtn
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={verifyOtp}
                        disabled={otpVerifyLoading}
                        className="flex-1 rounded-xl bg-pine px-4 py-3 text-[13px] font-semibold text-paper transition-colors hover:bg-pine-dark disabled:opacity-60 sm:flex-none"
                      >
                        {otpVerifyLoading ? (
                          <LoaderCircle size={15} className="animate-spin" />
                        ) : (
                          wa.verifyOtpBtn
                        )}
                      </button>
                    </div>
                  </div>
                  {(otpNote || demoCode || phoneVerified) && (
                    <div
                      className={`rounded-2xl border px-4 py-3 text-[13px] ${
                        phoneVerified
                          ? "border-pine/20 bg-tint text-pine"
                          : "border-ochre/20 bg-ochre-soft text-ink"
                      }`}
                    >
                      <p className="flex items-center gap-2 font-medium">
                        {phoneVerified ? (
                          <CheckCircle2 size={15} />
                        ) : (
                          <Phone size={15} />
                        )}
                        {otpNote || (phoneVerified ? pt.verifiedText : "OTP")}
                      </p>
                      {demoCode && !phoneVerified ? (
                        <p className="mt-1 font-semibold">
                          {pt.demoOtpPrefix} {demoCode}
                        </p>
                      ) : null}
                    </div>
                  )}
                </>
              )}

              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-faint"
                />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder={
                    mode === "login"
                      ? wa.passwordLoginPlaceholder
                      : wa.passwordNewPlaceholder
                  }
                  className={inputCls}
                />
              </div>

              {mode === "signup" && (
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-faint"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder={wa.passwordConfirmPlaceholder}
                    className={inputCls}
                  />
                </div>
              )}

              {mode === "signup" && (
                <label className="flex items-start gap-3 rounded-2xl border border-line bg-paper/50 px-4 py-3 text-[13.5px] font-medium text-ink">
                  <input
                    type="checkbox"
                    name="terms"
                    required
                    className="mt-0.5 size-4 rounded border-line text-pine"
                  />
                  <span>
                    {pt.termsPrefix}{" "}
                    <button
                      type="button"
                      onClick={() => setTermsModalOpen(true)}
                      className="font-semibold text-pine underline decoration-pine/30 underline-offset-2"
                    >
                      {pt.termsLink}
                    </button>{" "}
                    {pt.termsSuffix}
                  </span>
                </label>
              )}

              {message && (
                <p className="rounded-xl bg-tint px-4 py-3 text-[13px] font-semibold text-pine">
                  {message}
                </p>
              )}
              {error && (
                <p className="flex items-start gap-2 rounded-xl bg-brick-soft px-4 py-3 text-[13px] font-medium text-brick">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />{" "}
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-pine py-3.5 text-[15px] font-semibold text-paper shadow-[0_12px_30px_-10px_rgba(12,91,78,0.5)] transition-all hover:-translate-y-0.5 hover:bg-pine-dark disabled:opacity-60"
              >
                {loading ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : mode === "login" ? (
                  wa.loginBtn
                ) : (
                  wa.signupBtn
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Terms Modal */}
      <AnimatePresence>
        {termsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTermsModalOpen(false)}
            className="fixed inset-0 z-[90] grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="shadow-lift w-full max-w-lg rounded-3xl border border-line bg-card p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-lg font-bold text-ink">
                  {pt.termsModalTitle}
                </h4>
                <button
                  type="button"
                  onClick={() => setTermsModalOpen(false)}
                  className="grid size-8 place-items-center rounded-full border border-line text-mist hover:text-ink"
                >
                  <X size={15} />
                </button>
              </div>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-mist">
                {pt.termsPoints.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setTermsModalOpen(false)}
                className="mt-6 w-full rounded-full bg-pine py-2.5 text-sm font-semibold text-paper hover:bg-pine-dark"
              >
                {pt.closeBtn}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
