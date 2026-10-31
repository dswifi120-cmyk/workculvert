"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";

type State = "idle" | "loading" | "done" | "error";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setState("error");
        setMessage(data.error ?? "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন।");
        return;
      }
      setState("done");
    } catch {
      setState("error");
      setMessage("নেটওয়ার্ক সমস্যা — আবার চেষ্টা করুন।");
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-md">
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint/15 px-6 py-4 text-[15px] font-semibold text-mint"
          >
            <Check size={16} />
            ধন্যবাদ! আপডেট সবার আগে আপনার ইনবক্সে যাবে।
          </motion.p>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -10 }}
            onSubmit={submit}
            className="glass-dark flex items-center gap-2 rounded-full border border-white/15 p-1.5 pl-5 transition-colors focus-within:border-mint/50"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="আপনার ইমেইল ঠিকানা"
              className="w-full min-w-0 flex-1 bg-transparent text-[15px] text-paper outline-none placeholder:text-paper/40"
              aria-label="ইমেইল ঠিকানা"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ochre px-5 py-3 text-[14.5px] font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-ochre-deep hover:text-white disabled:opacity-70"
            >
              {state === "loading" ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <>
                  আপডেট পান
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {state === "error" && message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-center text-[13px] text-brick"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
