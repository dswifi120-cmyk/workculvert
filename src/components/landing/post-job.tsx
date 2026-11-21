"use client";

import { useMemo, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  Info,
  LoaderCircle,
  Send,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";
import {
  CATEGORY_OPTIONS,
  JOB_TYPE_OPTIONS,
  getCategoriesForTab,
  type CategoryTabSlug,
} from "@/lib/categories";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

type State = "idle" | "loading" | "done" | "error";

const inputCls =
  "w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-pine focus:bg-card";

export function PostJobForm({
  activeTab,
  initialCategory,
  sectionLabel,
}: {
  activeTab?: CategoryTabSlug;
  initialCategory?: string;
  sectionLabel?: string;
} = {}) {
  const { locale, t } = useLanguage();
  const pt = t.postForm;

  const availableOptions = useMemo(() => {
    if (!activeTab || activeTab === "any-work") {
      return CATEGORY_OPTIONS;
    }
    return getCategoriesForTab(activeTab);
  }, [activeTab]);

  const defaultCat = useMemo(() => {
    if (
      initialCategory &&
      CATEGORY_OPTIONS.some((c) => c.value === initialCategory)
    ) {
      return initialCategory;
    }
    return availableOptions[0]?.value ?? "ইলেকট্রিশিয়ান";
  }, [initialCategory, availableOptions]);

  const [selectedCategory, setSelectedCategory] = useState(defaultCat);
  const [prevDefaultCat, setPrevDefaultCat] = useState(defaultCat);
  if (defaultCat !== prevDefaultCat) {
    setPrevDefaultCat(defaultCat);
    setSelectedCategory(defaultCat);
  }
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [demoCode, setDemoCode] = useState("");
  const [otpNote, setOtpNote] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const canSubmit = useMemo(
    () => verified && state !== "loading",
    [verified, state]
  );

  async function requestOtp() {
    if (otpLoading) return;
    if (phone.trim().length < 11) {
      setOtpNote(pt.phoneMinErr);
      return;
    }
    setOtpLoading(true);
    setOtpNote("");
    setDemoCode("");
    setVerified(false);
    try {
      const res = await fetch("/api/employer/request-otp", {
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
    if (verifyLoading) return;
    setVerifyLoading(true);
    setOtpNote("");
    try {
      const res = await fetch("/api/employer/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          code: otpCode,
          fullName: employerName,
          location,
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setVerified(false);
        setOtpNote(json.error ?? pt.otpInvalidErr);
        return;
      }
      setVerified(true);
      setOtpNote(pt.verifiedText);
    } catch {
      setOtpNote(pt.networkErr);
    } finally {
      setVerifyLoading(false);
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!verified || state === "loading") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerName: data.get("employerName"),
          phone: data.get("phone"),
          title: data.get("title"),
          category: selectedCategory,
          location: data.get("location"),
          budget: data.get("budget"),
          jobType: data.get("jobType"),
          durationText: data.get("durationText"),
          description: data.get("description"),
          urgent: data.get("urgent") === "on",
          terms: data.get("terms") === "on",
        }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok || !json.ok) {
        setState("error");
        setMessage(json.error ?? pt.genericErr);
        return;
      }
      setState("done");
      setVerified(false);
      setOtpCode("");
      setOtpNote("");
      setDemoCode("");
      form.reset();
      setEmployerName("");
      setPhone("");
      setLocation("");
      setSelectedCategory(defaultCat);
      setTimeout(() => setState("idle"), 6000);
    } catch {
      setState("error");
      setMessage(pt.networkErr);
    }
  }

  return (
    <div
      id="post-form"
      className="shadow-lift scroll-mt-32 rounded-3xl border border-line bg-card p-5 sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-bold text-ink">{pt.heading}</h3>
        {sectionLabel && (
          <span className="rounded-full bg-tint px-3 py-1 text-[12px] font-semibold text-pine">
            {pt.preselectedBadge} {sectionLabel}
          </span>
        )}
      </div>

      <p className="mt-1.5 text-[13.5px] leading-relaxed text-mist">
        {pt.subheading}
      </p>

      <div className="mt-3 flex items-start gap-2 rounded-2xl border border-pine/15 bg-tint/60 px-3.5 py-2.5 text-[12px] leading-relaxed text-pine">
        <Info size={14} className="mt-0.5 shrink-0" />
        <span>{pt.demoBanner}</span>
      </div>

      {/* Quick Subcategory Chips when inside a category tab */}
      {activeTab && activeTab !== "any-work" && (
        <div className="mt-4">
          <p className="mb-2 text-[12px] font-semibold text-mist">
            {pt.quickPickLabel}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {availableOptions.map((opt) => {
              const active = selectedCategory === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedCategory(opt.value)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                    active
                      ? "border-pine bg-pine text-paper"
                      : "border-line bg-paper text-ink hover:border-pine/40"
                  )}
                >
                  {locale === "en" ? opt.en : opt.bn}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
              {pt.nameLabel}
            </label>
            <input
              name="employerName"
              required
              value={employerName}
              onChange={(e) => {
                setEmployerName(e.target.value);
              }}
              placeholder={pt.namePlaceholder}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
              {pt.phoneLabel}
            </label>
            <div className="flex gap-2">
              <input
                name="phone"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setVerified(false);
                }}
                placeholder={pt.phonePlaceholder}
                className={inputCls}
              />
              <button
                type="button"
                onClick={requestOtp}
                disabled={otpLoading}
                className="shrink-0 rounded-xl border border-line bg-paper px-3.5 py-3 text-[13px] font-semibold text-pine transition-colors hover:bg-tint disabled:opacity-60"
              >
                {otpLoading ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  pt.sendOtp
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
              {pt.locationLabel}
            </label>
            <input
              name="location"
              required
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
              }}
              placeholder={pt.locationPlaceholder}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
              {pt.otpLabel}
            </label>
            <div className="flex gap-2">
              <input
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder={pt.otpPlaceholder}
                className={inputCls}
              />
              <button
                type="button"
                onClick={verifyOtp}
                disabled={verifyLoading}
                className="shrink-0 rounded-xl bg-pine px-3.5 py-3 text-[13px] font-semibold text-paper transition-colors hover:bg-pine-dark disabled:opacity-60"
              >
                {verifyLoading ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  pt.verifyBtn
                )}
              </button>
            </div>
          </div>
        </div>

        {(otpNote || demoCode || verified) && (
          <div
            className={`rounded-2xl border px-4 py-3 text-[13px] ${
              verified
                ? "border-pine/20 bg-tint text-pine"
                : "border-ochre/20 bg-ochre-soft text-ink"
            }`}
          >
            <p className="flex items-center gap-2 font-medium">
              {verified ? <ShieldCheck size={15} /> : <Smartphone size={15} />}
              {otpNote || (verified ? pt.verifiedText : "OTP")}
            </p>
            {demoCode && !verified ? (
              <p className="mt-1 font-semibold">
                {pt.demoOtpPrefix} {demoCode}
              </p>
            ) : null}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
            {pt.titleLabel}
          </label>
          <input
            name="title"
            required
            minLength={4}
            placeholder={pt.titlePlaceholder}
            className={inputCls}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
              {pt.categoryLabel}
            </label>
            <select
              name="category"
              required
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={inputCls}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {locale === "en" ? opt.en : opt.bn}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
              {pt.jobTypeLabel}
            </label>
            <select name="jobType" required className={inputCls}>
              {JOB_TYPE_OPTIONS.map((jt) => (
                <option key={jt.value} value={jt.value}>
                  {locale === "en" ? jt.en : jt.bn}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
              {pt.budgetLabel}
            </label>
            <input
              name="budget"
              required
              inputMode="numeric"
              pattern="[0-9,০-৯]+"
              placeholder={pt.budgetPlaceholder}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
              {pt.durationLabel}
            </label>
            <input
              name="durationText"
              required
              placeholder={pt.durationPlaceholder}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">
            {pt.descLabel}
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder={pt.descPlaceholder}
            className="w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-pine focus:bg-card"
          />
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-line bg-paper/50 px-4 py-3 text-[13.5px] font-medium text-ink">
          <input
            type="checkbox"
            name="urgent"
            className="size-4 rounded border-line text-pine"
          />
          {pt.urgentLabel}
        </label>

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

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-ochre py-3.5 text-[15.5px] font-semibold text-ink shadow-[0_10px_26px_-8px_rgba(245,158,11,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ochre-deep hover:text-white disabled:cursor-not-allowed disabled:opacity-55"
        >
          {state === "loading" ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <>
              <Send size={16} /> {pt.submitBtn}
            </>
          )}
        </button>

        {!verified && (
          <p className="text-center text-[12px] text-faint">{pt.verifyHint}</p>
        )}

        <AnimatePresence>
          {state === "done" && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-tint px-4 py-3 text-center text-[13.5px] font-semibold text-pine"
            >
              <Check size={15} className="shrink-0" /> {pt.successMsg}
            </motion.p>
          )}
          {state === "error" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl bg-brick-soft px-4 py-3 text-center text-[13.5px] font-medium text-brick"
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      {/* Clean Terms Modal instead of window.alert */}
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
    </div>
  );
}
