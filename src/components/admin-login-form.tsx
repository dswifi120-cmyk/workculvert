"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { AlertTriangle, ArrowLeft, HardHat, LoaderCircle, Lock, Mail, ShieldCheck } from "lucide-react";

const inputCls =
  "w-full rounded-xl border border-line bg-paper/60 py-3.5 pl-11 pr-4 text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-pine focus:bg-card";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "লগইন করা যায়নি।");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("নেটওয়ার্ক সমস্যা — আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      <div className="relative hidden overflow-hidden bg-ink text-paper lg:flex lg:flex-col">
        <div className="dots-bg-light absolute inset-0 opacity-30" />
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-mint/10 blur-[110px]" />
        <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-ochre/10 blur-[110px]" />
        <div className="relative flex flex-1 flex-col justify-between p-12">
          <span className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-ochre text-ink"><HardHat size={18} strokeWidth={2.2} /></span>
            <span className="font-latin text-lg font-bold">Work<span className="text-ochre">Culvert</span> Admin</span>
          </span>
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[12px] font-semibold text-mint">
              <ShieldCheck size={12} /> private operations console
            </p>
            <h2 className="mt-6 max-w-md text-4xl font-bold leading-[1.3]">Order verify, worker approve, location-based assignment — সব এক জায়গায়।</h2>
          </div>
          <p className="text-[12px] text-paper/45">fixed admin email + OTP protected access</p>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-4 py-14 sm:px-8">
        <div className="dots-bg absolute inset-0" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="relative w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-mist transition-colors hover:text-pine">
            <ArrowLeft size={15} /> হোমে ফিরুন
          </Link>
          <div className="shadow-lift rounded-3xl border border-line bg-card p-7 sm:p-9">
            <h1 className="text-[26px] font-bold text-ink">Admin Login</h1>
            <p className="mt-1.5 text-[14px] text-mist">শুধু নির্দিষ্ট admin email এবং OTP/security code দিয়ে প্রবেশ।</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Admin email" className={inputCls} />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                <input value={code} onChange={(e) => setCode(e.target.value)} required placeholder="৬ অংকের OTP / security code" className={inputCls} />
              </div>
              {error && <p className="flex items-start gap-2 rounded-xl bg-brick-soft px-4 py-3 text-[13px] font-medium text-brick"><AlertTriangle size={15} className="mt-0.5 shrink-0" /> {error}</p>}
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[15px] font-semibold text-paper transition-all hover:-translate-y-0.5 hover:bg-pine disabled:opacity-60">
                {loading ? <LoaderCircle size={17} className="animate-spin" /> : "Admin panel-এ প্রবেশ করুন"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
