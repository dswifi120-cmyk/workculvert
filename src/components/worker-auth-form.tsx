"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  HardHat,
  LoaderCircle,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";

const inputCls =
  "w-full rounded-xl border border-line bg-paper/60 py-3.5 pl-11 pr-4 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-pine focus:bg-card";

const CATEGORIES = [
  "ইলেকট্রিশিয়ান",
  "প্লাম্বার",
  "ক্লিনার",
  "কেয়ারগিভার",
  "রংমিস্ত্রি",
  "কারপেন্টার",
  "ড্রাইভার",
  "নিরাপত্তাকর্মী",
  "এসি মিস্ত্রি",
  "অন্যান্য",
];

export function WorkerAuthForm() {
  const router = useRouter();
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

  async function requestOtp() {
    if (otpLoading || phone.trim().length < 11) return;
    setOtpLoading(true);
    setOtpNote("");
    setPhoneVerified(false);
    try {
      const res = await fetch("/api/worker/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string; message?: string; demoCode?: string };
      if (!res.ok || !json.ok) {
        setOtpNote(json.error ?? "OTP পাঠানো যায়নি।");
        return;
      }
      setOtpNote(json.message ?? "OTP পাঠানো হয়েছে।");
      setDemoCode(json.demoCode ?? "");
    } catch {
      setOtpNote("নেটওয়ার্ক সমস্যা — OTP পাঠানো যায়নি।");
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
        setOtpNote(json.error ?? "OTP সঠিক নয়।");
        return;
      }
      setPhoneVerified(true);
      setOtpNote("ফোন নম্বর সফলভাবে যাচাই হয়েছে।");
    } catch {
      setOtpNote("নেটওয়ার্ক সমস্যা — আবার চেষ্টা করুন।");
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
        setError("সাইনআপের আগে ফোন OTP যাচাই বাধ্যতামূলক।");
        return;
      }
      if (password !== confirmPassword) {
        setLoading(false);
        setError("New password এবং confirm password মেলেনি।");
        return;
      }
    }

    try {
      const body = Object.fromEntries(data.entries());
      const res = await fetch(mode === "login" ? "/api/worker/login" : "/api/worker/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { ok: boolean; error?: string; message?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "কিছু একটা সমস্যা হয়েছে।");
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
      setMessage(json.message ?? "সফলভাবে জমা হয়েছে।");
    } catch {
      setError("নেটওয়ার্ক সমস্যা — আবার চেষ্টা করুন।");
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
            <span className="font-latin text-lg font-bold">Work<span className="text-mint">Culvert</span></span>
          </Link>

          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[12px] font-semibold text-mint">
              <Sparkles size={12} /> অ্যাডমিন অনুমোদনভিত্তিক workforce network
            </p>
            <h2 className="mt-6 max-w-md text-4xl font-bold leading-[1.35]">
              প্রোফাইল তৈরি করুন, <span className="font-serif text-mint">যাচাই</span> হন,
              তারপর নিরাপদে কাজ পান।
            </h2>
            <ul className="mt-8 space-y-4 text-[14px] text-paper/70">
              <li>• Signup করার আগে phone OTP যাচাই বাধ্যতামূলক</li>
              <li>• Signup করার পর আপনার প্রোফাইল আগে অ্যাডমিন review করবেন</li>
              <li>• approve হলেই আপনি dashboard-এ login করতে পারবেন</li>
            </ul>
          </div>

          <p className="text-[12px] text-paper/40">নিরাপদ যাচাই, ম্যানুয়াল matching, স্থানীয় আস্থা</p>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-4 py-14 sm:px-8">
        <div className="dots-bg absolute inset-0" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-xl"
        >
          <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-mist transition-colors hover:text-pine">
            <ArrowLeft size={15} /> হোমে ফিরুন
          </Link>

          <div className="shadow-lift rounded-3xl border border-line bg-card p-7 sm:p-9">
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
                    mode === m ? "bg-pine text-paper shadow" : "text-mist hover:text-ink"
                  }`}
                >
                  {m === "login" ? "Worker Login" : "Worker Signup"}
                </button>
              ))}
            </div>

            <h1 className="mt-6 text-[26px] font-bold text-ink">
              {mode === "login" ? "Worker Dashboard-এ প্রবেশ করুন" : "Worker Profile তৈরি করুন"}
            </h1>
            <p className="mt-1.5 text-[14px] text-mist">
              {mode === "login"
                ? "শুধু approved worker-রাই login করতে পারবেন।"
                : "আপনার skill, location, experience দিলে profile admin panel-এ review-তে যাবে।"}
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {mode === "signup" && (
                <>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                    <input name="fullName" required placeholder="পূর্ণ নাম" className={inputCls} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative">
                      <Wrench size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                      <select name="category" required className={inputCls} defaultValue="">
                        <option value="" disabled>ক্যাটাগরি</option>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                      <input name="baseLocation" required placeholder="মূল এলাকা" className={inputCls} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                      <input name="currentLocation" required placeholder="বর্তমান অবস্থান" className={inputCls} />
                    </div>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                      <input name="experienceYears" inputMode="numeric" placeholder="অভিজ্ঞতা (বছর)" className={inputCls} />
                    </div>
                  </div>
                  <textarea
                    name="bio"
                    rows={4}
                    placeholder="সংক্ষিপ্ত পরিচিতি, কোন কাজগুলো ভালো পারেন, কোন এলাকায় যেতে পারবেন…"
                    className="w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-pine focus:bg-card"
                  />
                </>
              )}

              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                <input name="phone" required value={phone} onChange={(e) => { setPhone(e.target.value); setPhoneVerified(false); }} placeholder="ফোন নম্বর" className={inputCls} />
              </div>

              {mode === "signup" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                    <div className="relative">
                      <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                      <input value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="OTP কোড লিখুন" className={inputCls} />
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={requestOtp} disabled={otpLoading} className="rounded-xl border border-line bg-paper px-4 py-3 text-[13px] font-semibold text-pine transition-colors hover:bg-tint disabled:opacity-60">
                        {otpLoading ? <LoaderCircle size={15} className="animate-spin" /> : "OTP পাঠান"}
                      </button>
                      <button type="button" onClick={verifyOtp} disabled={otpVerifyLoading} className="rounded-xl bg-pine px-4 py-3 text-[13px] font-semibold text-paper transition-colors hover:bg-pine-dark disabled:opacity-60">
                        {otpVerifyLoading ? <LoaderCircle size={15} className="animate-spin" /> : "যাচাই"}
                      </button>
                    </div>
                  </div>
                  {(otpNote || demoCode || phoneVerified) && (
                    <div className={`rounded-2xl border px-4 py-3 text-[13px] ${phoneVerified ? "border-pine/20 bg-tint text-pine" : "border-ochre/20 bg-ochre-soft text-ink"}`}>
                      <p className="flex items-center gap-2 font-medium">
                        {phoneVerified ? <CheckCircle2 size={15} /> : <Phone size={15} />}
                        {otpNote || (phoneVerified ? "ফোন নম্বর যাচাই হয়েছে" : "OTP information")}
                      </p>
                      {demoCode && !phoneVerified ? <p className="mt-1 font-semibold">ডেমো OTP: {demoCode}</p> : null}
                    </div>
                  )}
                </>
              )}

              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="New Password" className={inputCls} />
              </div>

              {mode === "signup" && (
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                  <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} placeholder="Confirm Password" className={inputCls} />
                </div>
              )}

              {mode === "signup" && (
                <label className="flex items-start gap-3 rounded-2xl border border-line bg-paper/50 px-4 py-3 text-[13.5px] font-medium text-ink">
                  <input type="checkbox" name="terms" required className="mt-0.5 size-4 rounded border-line text-pine" />
                  <span>
                    আমি WorkCulvert-এর{" "}
                    <button type="button" onClick={() => alert("শর্তাবলী: ১. সঠিক তথ্য দিতে হবে। ২. প্ল্যাটফর্মের বাইরে লেনদেন হলে প্ল্যাটফর্ম দায়ী নয়। ৩. কোনো অবৈধ, প্রতারণামূলক বা ক্ষতিকর কার্যকলাপের সম্পূর্ণ দায় সংশ্লিষ্ট ব্যবহারকারীর।")} className="font-semibold text-pine underline decoration-pine/30 underline-offset-2">Terms, Policy & Conditions</button>
                    {" "}পড়েছি এবং মেনে নিচ্ছি।
                  </span>
                </label>
              )}

              {message && (
                <p className="rounded-xl bg-tint px-4 py-3 text-[13px] font-semibold text-pine">{message}</p>
              )}
              {error && (
                <p className="flex items-start gap-2 rounded-xl bg-brick-soft px-4 py-3 text-[13px] font-medium text-brick">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {error}
                </p>
              )}

              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-pine py-3.5 text-[15px] font-semibold text-paper shadow-[0_12px_30px_-10px_rgba(12,91,78,0.5)] transition-all hover:-translate-y-0.5 hover:bg-pine-dark disabled:opacity-60">
                {loading ? <LoaderCircle size={17} className="animate-spin" /> : mode === "login" ? "লগইন করুন" : "Profile Review-তে পাঠান"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
