import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, isNull } from "drizzle-orm";
import { ArrowUpRight, BadgeCheck, Briefcase, Clock3, MapPin, PhoneCall, UserCheck } from "lucide-react";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { requireWorker } from "@/lib/auth";
import { formatNumber, timeAgoBn } from "@/lib/utils";
import { LogoutButton } from "@/components/logout-button";

export const metadata: Metadata = {
  title: "Worker Dashboard",
};

export const dynamic = "force-dynamic";

export default async function WorkerDashboardPage() {
  const worker = await requireWorker();

  const assignedJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.assignedWorkerId, worker.id))
    .orderBy(desc(jobs.createdAt))
    .limit(6);

  const matchedJobs = await db
    .select()
    .from(jobs)
    .where(
      and(
        eq(jobs.verifiedByAdmin, true),
        eq(jobs.category, worker.category),
        isNull(jobs.assignedWorkerId)
      )
    )
    .orderBy(desc(jobs.createdAt))
    .limit(6);

  return (
    <main className="min-h-screen bg-paper">
      <div className="border-b border-line bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-pine">Worker Dashboard</p>
            <h1 className="mt-1 text-2xl font-bold text-ink">স্বাগতম, {worker.fullName}</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/#jobs" className="inline-flex items-center gap-2 rounded-full bg-pine px-4 py-2.5 text-sm font-semibold text-paper transition-all hover:-translate-y-0.5 hover:bg-pine-dark">
              নতুন কাজ দেখুন <ArrowUpRight size={15} />
            </Link>
            <LogoutButton kind="worker" label="লগআউট" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-mist transition-colors hover:border-pine/35 hover:text-pine" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <section className="shadow-card rounded-3xl border border-line bg-card p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">আপনার প্রোফাইল</p>
                <h2 className="mt-1 text-xl font-bold text-ink">{worker.fullName}</h2>
              </div>
              <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${worker.isActive ? "bg-tint text-pine" : "bg-linen text-mist"}`}>
                {worker.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-5 space-y-2 text-[14px] text-mist">
              <p className="flex items-center gap-2"><Briefcase size={15} className="text-pine" /> {worker.category}</p>
              <p className="flex items-center gap-2"><PhoneCall size={15} className="text-pine" /> {worker.phone}</p>
              <p className="flex items-center gap-2"><MapPin size={15} className="text-pine" /> বেইস: {worker.baseLocation}</p>
              <p className="flex items-center gap-2"><MapPin size={15} className="text-river" /> এখন: {worker.currentLocation}</p>
              <p className="flex items-center gap-2"><UserCheck size={15} className="text-pine" /> অভিজ্ঞতা: {worker.experienceYears} বছর</p>
            </div>

            <form action="/api/worker/profile" method="post" className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">Current location</label>
                <input name="currentLocation" defaultValue={worker.currentLocation} className="w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-[14px] text-ink outline-none focus:border-pine" />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">Bio / note</label>
                <textarea name="bio" defaultValue={worker.bio} rows={4} className="w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-[14px] text-ink outline-none focus:border-pine" />
              </div>
              <label className="flex items-center gap-3 rounded-2xl border border-line bg-paper/50 px-4 py-3 text-[14px] font-medium text-ink">
                <input type="checkbox" name="isActive" defaultChecked={worker.isActive} className="size-4 rounded border-line text-pine" />
                আমি এখন active — admin আমাকে location অনুযায়ী refer করতে পারবে
              </label>
              <button className="w-full rounded-full bg-pine py-3 text-[14px] font-semibold text-paper transition-all hover:-translate-y-0.5 hover:bg-pine-dark">স্ট্যাটাস ও লোকেশন আপডেট করুন</button>
            </form>
          </section>

          <div className="space-y-4">
            <section className="shadow-card rounded-3xl border border-line bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">Assigned by admin</p>
                  <h2 className="mt-1 text-xl font-bold text-ink">আপনার কাছে পাঠানো কাজ</h2>
                </div>
                <span className="rounded-full bg-ochre-soft px-3 py-1 text-[12px] font-bold text-ochre-deep">{assignedJobs.length}টি</span>
              </div>
              <div className="mt-5 space-y-3">
                {assignedJobs.length > 0 ? assignedJobs.map((job) => (
                  <article key={job.id} className="rounded-2xl border border-line bg-paper/60 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[16px] font-semibold text-ink">{job.title}</p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-mist">
                          <span className="flex items-center gap-1"><MapPin size={12} className="text-river" /> {job.location}</span>
                          <span className="flex items-center gap-1"><Clock3 size={12} /> {timeAgoBn(job.createdAt)}</span>
                          <span className="rounded-full bg-tint px-2 py-0.5 text-[11px] font-semibold text-pine">{job.durationText}</span>
                        </p>
                      </div>
                      <p className="text-lg font-bold text-ink">৳{formatNumber(job.budget)}</p>
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-mist">{job.description || "অ্যাডমিন এই কাজটি আপনার skill/location অনুযায়ী share করেছেন।"}</p>
                    
                    {job.workerResponse === "pending" ? (
                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                        <p className="w-full text-[13px] font-semibold text-ink">কাজটি কি আপনি করতে ইচ্ছুক?</p>
                        <button onClick={async () => {
                          await fetch(`/api/worker/jobs/${job.id}/response`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ response: "accepted" }) });
                          window.location.reload();
                        }} className="rounded-full bg-pine px-4 py-2 text-[13px] font-semibold text-paper transition-all hover:-translate-y-0.5 hover:bg-pine-dark">হ্যাঁ, কাজ করবো</button>
                        <button onClick={async () => {
                          await fetch(`/api/worker/jobs/${job.id}/response`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ response: "declined" }) });
                          window.location.reload();
                        }} className="rounded-full border border-brick/30 bg-brick-soft px-4 py-2 text-[13px] font-semibold text-brick transition-all hover:-translate-y-0.5 hover:bg-brick/10">না, এখন পারবো না</button>
                      </div>
                    ) : job.workerResponse === "accepted" ? (
                      <>
                        <div className="mt-3 inline-block rounded-lg bg-tint px-3 py-1.5 text-[12px] font-semibold text-pine">✓ আপনি কাজটি গ্রহণ করেছেন</div>
                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                          <a href={`tel:${job.contactPhone}`} className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-pine transition-colors hover:border-pine hover:bg-tint">কল করুন</a>
                          <a href={`https://wa.me/${job.contactPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি ${worker.fullName}। WorkCulvert admin আমাকে "${job.title}" কাজটির জন্য refer করেছেন।`)}`} target="_blank" className="rounded-full bg-pine px-4 py-2 text-[13px] font-semibold text-paper">WhatsApp যোগাযোগ</a>
                        </div>
                      </>
                    ) : (
                      <div className="mt-3 inline-block rounded-lg bg-linen px-3 py-1.5 text-[12px] font-semibold text-mist">✕ আপনি কাজটি ডিক্লাইন করেছেন</div>
                    )}
                  </article>
                )) : <p className="rounded-2xl border border-dashed border-line py-10 text-center text-sm text-mist">এখনো কোনো কাজ admin আপনার কাছে share করেননি।</p>}
              </div>
            </section>

            <section className="shadow-card rounded-3xl border border-line bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">Verified opportunities</p>
                  <h2 className="mt-1 text-xl font-bold text-ink">আপনার skill-এর সাথে মিলে এমন verified কাজ</h2>
                </div>
                <span className="rounded-full bg-tint px-3 py-1 text-[12px] font-bold text-pine">{matchedJobs.length}টি</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {matchedJobs.length > 0 ? matchedJobs.map((job) => (
                  <article key={job.id} className="rounded-2xl border border-line bg-paper/60 p-4">
                    <p className="text-[15px] font-semibold text-ink">{job.title}</p>
                    <p className="mt-1 text-[12.5px] text-mist">{job.location} · {job.jobType} · {job.durationText}</p>
                    <p className="mt-3 text-[18px] font-bold text-ink">৳{formatNumber(job.budget)}</p>
                  </article>
                )) : <p className="rounded-2xl border border-dashed border-line py-10 text-center text-sm text-mist sm:col-span-2">এই মুহূর্তে আপনার category-তে নতুন verified কাজ নেই।</p>}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
