"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type State = "idle" | "loading" | "done";

type SessionWorker = { id: number; fullName: string; phone: string } | null;

export function ApplyButton({
  jobId,
  jobTitle,
  variant = "landing",
}: {
  jobId: number;
  jobTitle: string;
  variant?: "landing" | "dashboard";
}) {
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [note, setNote] = useState("");
  const [worker, setWorker] = useState<SessionWorker>(null);

  useEffect(() => {
    fetch("/api/worker/session")
      .then((r) => r.json())
      .then((d) => setWorker((d.worker as SessionWorker) ?? null))
      .catch(() => undefined);
  }, []);

  async function apply() {
    if (state !== "idle") return;
    if (!worker) {
      router.push("/login");
      return;
    }

    setState("loading");
    setNote("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, jobTitle }),
      });
      const json = (await res.json()) as { ok: boolean; duplicate?: boolean; message?: string; error?: string };
      if (!res.ok || !json.ok) {
        setState("idle");
        setNote(json.error ?? "আবার চেষ্টা করুন।");
        setTimeout(() => setNote(""), 3500);
        return;
      }
      setState("done");
      setNote(json.duplicate ? "আগেই আবেদন করা ছিল" : "আবেদন পাঠানো হয়েছে");
    } catch {
      setState("idle");
      setNote("নেটওয়ার্ক সমস্যা");
      setTimeout(() => setNote(""), 3500);
    }
  }

  if (variant === "dashboard") {
    return (
      <span className="flex flex-col items-end gap-1">
        <button type="button" onClick={apply} disabled={state !== "idle"} className={cn("rounded-full border-2 px-4 py-2 text-[13px] font-semibold transition-colors", state === "done" ? "border-pine bg-pine text-paper" : "border-pine/25 text-pine hover:border-pine hover:bg-pine hover:text-paper")}>
          {state === "loading" ? <LoaderCircle size={14} className="animate-spin" /> : state === "done" ? <span className="flex items-center gap-1"><Check size={13} /> পাঠানো হয়েছে</span> : "আবেদন"}
        </button>
        {note && <span className="text-[11px] font-medium text-mist">{note}</span>}
      </span>
    );
  }

  return (
    <span className="flex flex-col items-end gap-1">
      <button type="button" onClick={apply} disabled={state !== "idle"} className={cn("flex items-center gap-1 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors", state === "done" ? "bg-pine text-paper" : "bg-pine/[0.08] text-pine hover:bg-pine hover:text-paper")}>
        {state === "loading" ? <LoaderCircle size={14} className="animate-spin" /> : state === "done" ? <><Check size={13} /> পাঠানো হয়েছে</> : <><ArrowRight size={13} /> আবেদন করুন</>}
      </button>
      {note && <span className="text-[11px] font-medium text-mist">{note}</span>}
    </span>
  );
}
