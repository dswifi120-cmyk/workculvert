"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function JobResponseButtons({
  jobId,
  workerResponse,
  contactPhone,
  workerName,
  jobTitle,
}: {
  jobId: number;
  workerResponse: string;
  contactPhone: string;
  workerName: string;
  jobTitle: string;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const d = t.dashboard;
  const [loading, setLoading] = useState<"accepted" | "declined" | null>(null);

  async function respond(choice: "accepted" | "declined") {
    if (loading) return;
    setLoading(choice);
    try {
      await fetch(`/api/worker/jobs/${jobId}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: choice }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  if (workerResponse === "pending") {
    return (
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <p className="w-full text-[13px] font-semibold text-ink">
          {d.willingPrompt}
        </p>
        <button
          type="button"
          disabled={Boolean(loading)}
          onClick={() => respond("accepted")}
          className="inline-flex items-center gap-1.5 rounded-full bg-pine px-4 py-2 text-[13px] font-semibold text-paper transition-all hover:-translate-y-0.5 hover:bg-pine-dark disabled:opacity-60"
        >
          {loading === "accepted" && (
            <LoaderCircle size={13} className="animate-spin" />
          )}
          {d.acceptBtn}
        </button>
        <button
          type="button"
          disabled={Boolean(loading)}
          onClick={() => respond("declined")}
          className="inline-flex items-center gap-1.5 rounded-full border border-brick/30 bg-brick-soft px-4 py-2 text-[13px] font-semibold text-brick transition-all hover:-translate-y-0.5 hover:bg-brick/10 disabled:opacity-60"
        >
          {loading === "declined" && (
            <LoaderCircle size={13} className="animate-spin" />
          )}
          {d.declineBtn}
        </button>
      </div>
    );
  }

  if (workerResponse === "accepted") {
    return (
      <>
        <div className="mt-3 inline-block rounded-lg bg-tint px-3 py-1.5 text-[12px] font-semibold text-pine">
          {d.acceptedBadge}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <a
            href={`tel:${contactPhone}`}
            className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-pine transition-colors hover:border-pine hover:bg-tint"
          >
            {d.callBtn}
          </a>
          <a
            href={`https://wa.me/${contactPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
              `Assalamu Alaikum, I am ${workerName}. WorkCulvert admin referred me for "${jobTitle}".`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-pine px-4 py-2 text-[13px] font-semibold text-paper"
          >
            {d.whatsappBtn}
          </a>
        </div>
      </>
    );
  }

  return (
    <div className="mt-3 inline-block rounded-lg bg-linen px-3 py-1.5 text-[12px] font-semibold text-mist">
      {d.declinedBadge}
    </div>
  );
}
