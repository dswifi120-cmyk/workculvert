"use client";

import { useMemo, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, LoaderCircle, Send, ShieldCheck, Smartphone } from "lucide-react";

type State = "idle" | "loading" | "done" | "error";

const inputCls =
  "w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-pine focus:bg-card";

export function PostJobForm() {
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

  const canSubmit = useMemo(() => verified && state !== "loading", [verified, state]);

  async function requestOtp() {
    if (otpLoading || phone.trim().length < 11) return;
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
    if (verifyLoading) return;
    setVerifyLoading(true);
    setOtpNote("");
    try {
      const res = await fetch("/api/employer/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otpCode, fullName: employerName, location }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setVerified(false);
        setOtpNote(json.error ?? "OTP সঠিক নয়।");
        return;
      }
      setVerified(true);
      setOtpNote("ফোন নম্বর সফলভাবে যাচাই হয়েছে।");
    } catch {
      setOtpNote("নেটওয়ার্ক সমস্যা — আবার চেষ্টা করুন।");
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
          category: data.get("category"),
          location: data.get("location"),
          budget: data.get("budget"),
          jobType: data.get("jobType"),
          durationText: data.get("durationText"),
          description: data.get("description"),
          urgent: data.get("urgent") === "on",
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string; message?: string };
      if (!res.ok || !json.ok) {
        setState("error");
        setMessage(json.error ?? "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন।");
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
      setTimeout(() => setState("idle"), 5000);
    } catch {
      setState("error");
      setMessage("নেটওয়ার্ক সমস্যা — আবার চেষ্টা করুন।");
    }
  }

  return (
    <div className="shadow-lift rounded-3xl border border-line bg-card p-6 sm:p-7">
      <h3 className="text-xl font-bold text-ink">কাজ পোস্ট করুন</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-mist">
        fake order কমাতে কাজ পোস্টের আগে ফোন OTP যাচাই বাধ্যতামূলক। পোস্ট submit হলে সেটা আগে admin review-তে যাবে, এরপর verified worker-দের কাছে যাবে।
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">আপনার নাম</label>
            <input name="employerName" required value={employerName} onChange={(e) => { setEmployerName(e.target.value); setVerified(false); }} placeholder="যেমন: রফিকুল ইসলাম" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">ফোন নম্বর</label>
            <div className="flex gap-2">
              <input name="phone" required value={phone} onChange={(e) => { setPhone(e.target.value); setVerified(false); }} placeholder="01XXXXXXXXX" className={inputCls} />
              <button type="button" onClick={requestOtp} disabled={otpLoading} className="shrink-0 rounded-xl bg-paper px-3.5 py-3 text-[13px] font-semibold text-pine border border-line transition-colors hover:bg-tint disabled:opacity-60">
                {otpLoading ? <LoaderCircle size={15} className="animate-spin" /> : "OTP পাঠান"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">কাজের লোকেশন</label>
            <input name="location" required value={location} onChange={(e) => { setLocation(e.target.value); setVerified(false); }} placeholder="যেমন: সাতমাথা, বগুড়া" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">OTP কোড</label>
            <div className="flex gap-2">
              <input value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="৬ অংকের কোড" className={inputCls} />
              <button type="button" onClick={verifyOtp} disabled={verifyLoading} className="shrink-0 rounded-xl bg-pine px-3.5 py-3 text-[13px] font-semibold text-paper transition-colors hover:bg-pine-dark disabled:opacity-60">
                {verifyLoading ? <LoaderCircle size={15} className="animate-spin" /> : "যাচাই"}
              </button>
            </div>
          </div>
        </div>

        {(otpNote || demoCode || verified) && (
          <div className={`rounded-2xl border px-4 py-3 text-[13px] ${verified ? "border-pine/20 bg-tint text-pine" : "border-ochre/20 bg-ochre-soft text-ink"}`}>
            <p className="flex items-center gap-2 font-medium">
              {verified ? <ShieldCheck size={15} /> : <Smartphone size={15} />}
              {otpNote || (verified ? "ফোন নম্বর যাচাই হয়েছে" : "OTP information")}
            </p>
            {demoCode && !verified ? <p className="mt-1 font-semibold">ডেমো OTP: {demoCode}</p> : null}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">কাজের নাম</label>
          <input name="title" required minLength={4} placeholder="যেমন: বাথরুমের ট্যাপ মেরামত" className={inputCls} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">ক্যাটাগরি</label>
            <select name="category" required className={inputCls}>
              <option value="ইলেকট্রিশিয়ান">ইলেকট্রিশিয়ান</option>
              <option value="প্লাম্বার">প্লাম্বার</option>
              <option value="ক্লিনার">ক্লিনার</option>
              <option value="কেয়ারগিভার">কেয়ারগিভার</option>
              <option value="রংমিস্ত্রি">রংমিস্ত্রি</option>
              <option value="কারপেন্টার">কারপেন্টার</option>
              <option value="ড্রাইভার">ড্রাইভার</option>
              <option value="নিরাপত্তাকর্মী">নিরাপত্তাকর্মী</option>
              <option value="এসি মিস্ত্রি">এসি মিস্ত্রি</option>
              <option value="অন্যান্য">অন্যান্য</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">ধরন</label>
            <select name="jobType" required className={inputCls}>
              <option value="দৈনিক">দৈনিক</option>
              <option value="সাপ্তাহিক">সাপ্তাহিক</option>
              <option value="মাসিক">মাসিক</option>
              <option value="চুক্তিভিত্তিক">চুক্তিভিত্তিক</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">বাজেট (৳)</label>
            <input name="budget" required inputMode="numeric" pattern="[0-9,০-৯]+" placeholder="যেমন: 2000" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">সময়/মেয়াদ</label>
            <input name="durationText" required placeholder="যেমন: ৬ ঘণ্টা / ২ দিন / ১ মাস" className={inputCls} />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13.5px] font-semibold text-ink">কাজের বর্ণনা (optional)</label>
          <textarea name="description" rows={4} placeholder="কাজের বিস্তারিত, কোন সময়ে করতে হবে, কী কী লাগবে…" className="w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-pine focus:bg-card" />
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-line bg-paper/50 px-4 py-3 text-[13.5px] font-medium text-ink">
          <input type="checkbox" name="urgent" className="size-4 rounded border-line text-pine" />
          জরুরি কাজ — admin priority review করবে
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-line bg-paper/50 px-4 py-3 text-[13.5px] font-medium text-ink">
          <input type="checkbox" name="terms" required className="mt-0.5 size-4 rounded border-line text-pine" />
          <span>
            আমি WorkCulvert-এর{" "}
            <button type="button" onClick={() => alert("শর্তাবলী: ১. কোনো অবৈধ কাজ পোস্ট করা যাবে না। ২. প্ল্যাটফর্মের বাইরে লেনদেন হলে প্ল্যাটফর্ম দায়ী নয়।")} className="font-semibold text-pine underline decoration-pine/30 underline-offset-2">Terms, Policy & Conditions</button>
            {" "}পড়েছি এবং মেনে নিচ্ছি।
          </span>
        </label>

        <button type="submit" disabled={!canSubmit} className="flex w-full items-center justify-center gap-2 rounded-full bg-ochre py-3.5 text-[15.5px] font-semibold text-ink shadow-[0_10px_26px_-8px_rgba(245,158,11,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ochre-deep hover:text-white disabled:cursor-not-allowed disabled:opacity-55">
          {state === "loading" ? <LoaderCircle size={17} className="animate-spin" /> : <><Send size={16} /> admin review-তে পাঠান</>}
        </button>

        {!verified && <p className="text-center text-[12px] text-faint">কাজ submit করার আগে ফোন OTP verify করতে হবে।</p>}

        <AnimatePresence>
          {state === "done" && (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-1.5 rounded-xl bg-tint px-4 py-3 text-center text-[13.5px] font-semibold text-pine">
              <Check size={15} /> আপনার কাজ admin review-তে গেছে। যাচাইয়ের পর worker-দের কাছে যাবে।
            </motion.p>
          )}
          {state === "error" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl bg-brick-soft px-4 py-3 text-center text-[13.5px] font-medium text-brick">
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
