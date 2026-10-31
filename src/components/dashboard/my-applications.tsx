"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Inbox, LoaderCircle } from "lucide-react";
import { useAuthUser, GUEST_IDENTITY } from "@/lib/use-auth";
import { cn, timeAgoBn } from "@/lib/utils";

type Row = {
  id: number;
  jobTitle: string;
  status: string;
  createdAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  গৃহীত: "bg-tint text-pine",
  বিবেচনাধীন: "bg-ochre-soft text-ochre-deep",
  বাতিল: "bg-brick-soft text-brick",
};

export function MyApplications() {
  const { user, configured, loading } = useAuthUser();
  const [rows, setRows] = useState<Row[]>([]);
  const [fetching, setFetching] = useState(true);

  const uid = configured && user ? user.uid : GUEST_IDENTITY.uid;

  useEffect(() => {
    if (loading) return;
    let alive = true;
    fetch(`/api/apply?uid=${encodeURIComponent(uid)}`)
      .then((r) => r.json())
      .then((d) => {
        if (alive && d.ok) setRows(d.applications as Row[]);
      })
      .catch(() => undefined)
      .finally(() => {
        if (alive) setFetching(false);
      });
    return () => {
      alive = false;
    };
  }, [uid, loading]);

  return (
    <section className="shadow-card rounded-2xl border border-line bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-ink">আমার আবেদনসমূহ</h3>
          <p className="mt-0.5 text-xs text-faint">
            আপনার সর্বশেষ আবেদনগুলোর অবস্থা — ডাটাবেস থেকে সরাসরি
          </p>
        </div>
        <Link
          href="/#jobs"
          className="rounded-full border-2 border-pine/25 px-4 py-2 text-[13px] font-semibold text-pine transition-colors hover:border-pine hover:bg-tint"
        >
          নতুন কাজ খুঁজুন
        </Link>
      </div>

      {fetching ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-mist">
          <LoaderCircle size={18} className="animate-spin text-pine" />
          আবেদন লোড হচ্ছে…
        </div>
      ) : rows.length > 0 ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {rows.map((r) => (
            <li
              key={r.id}
              className="flex items-center gap-4 rounded-2xl border border-line bg-paper/50 p-4 transition-colors hover:border-pine/30"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] font-semibold text-ink">
                  {r.jobTitle}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[12px] text-faint">
                  <Clock size={11} /> {timeAgoBn(new Date(r.createdAt))}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-[11.5px] font-bold",
                  STATUS_STYLES[r.status] ?? "bg-linen text-mist"
                )}
              >
                {r.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line py-10 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-tint text-pine">
            <Inbox size={20} />
          </span>
          <p className="text-sm font-semibold text-ink">এখনো কোনো আবেদন নেই</p>
          <p className="max-w-xs text-[12.5px] leading-relaxed text-mist">
            নিচের &ldquo;নতুন কাজ&rdquo; তালিকা বা হোমপেজের লাইভ ফিড থেকে আপনার
            প্রথম আবেদন করুন — এক ট্যাপেই হয়।
          </p>
        </div>
      )}
    </section>
  );
}
