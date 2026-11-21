import type { Metadata } from "next";
import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { Briefcase, MapPin, PhoneCall, Users, UserRound } from "lucide-react";
import { getDb } from "@/db";
import { employers, jobs, workers } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { formatNumber, localizeDigits, timeAgo } from "@/lib/utils";
import { getServerLocale } from "@/lib/server-locale";
import { translateCategory, translateJobType } from "@/lib/categories";
import { LogoutButton } from "@/components/logout-button";
import { LanguageSwitcher } from "@/components/language-switcher";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const locale = await getServerLocale();
  const isEn = locale === "en";
  const db = await getDb();

  const [
    pendingWorkers,
    allWorkers,
    employerList,
    latestJobs,
    workerCount,
    employerCount,
    jobCount,
  ] = await Promise.all([
    db
      .select()
      .from(workers)
      .where(eq(workers.status, "pending"))
      .orderBy(desc(workers.createdAt))
      .limit(20),
    db.select().from(workers).orderBy(desc(workers.createdAt)).limit(50),
    db.select().from(employers).orderBy(desc(employers.createdAt)).limit(30),
    db.select().from(jobs).orderBy(desc(jobs.createdAt)).limit(40),
    db.select({ value: count() }).from(workers),
    db.select({ value: count() }).from(employers),
    db.select({ value: count() }).from(jobs),
  ]);

  const approvedWorkers = allWorkers.filter((w) => w.isApproved);

  return (
    <main className="min-h-screen bg-paper">
      <div className="border-b border-line bg-ink text-paper">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-mint">
              Admin Operations
            </p>
            <h1 className="mt-1 text-2xl font-bold">Welcome, {admin.email}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <LanguageSwitcher />
            <Link
              href="/"
              className="rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-paper/80 transition-colors hover:bg-white/5 hover:text-paper"
            >
              {isEn ? "Public site" : "পাবলিক সাইট"}
            </Link>
            <LogoutButton
              kind="admin"
              label={isEn ? "Logout" : "লগআউট"}
              className="inline-flex items-center gap-2 rounded-full bg-ochre px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:bg-ochre-deep hover:text-paper"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Users,
              label: isEn ? "Total Workers" : "মোট Worker",
              value: workerCount[0]?.value ?? 0,
            },
            {
              icon: UserRound,
              label: isEn ? "Total Employers" : "মোট Employer",
              value: employerCount[0]?.value ?? 0,
            },
            {
              icon: Briefcase,
              label: isEn ? "Total Job Orders" : "মোট Job Order",
              value: jobCount[0]?.value ?? 0,
            },
          ].map((k) => (
            <div
              key={k.label}
              className="shadow-card rounded-3xl border border-line bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-tint text-pine">
                  <k.icon size={20} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-mist">
                    {k.label}
                  </p>
                  <p className="text-3xl font-bold text-ink">
                    {localizeDigits(k.value, locale)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="shadow-card rounded-3xl border border-line bg-card p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">
                  Worker review queue
                </p>
                <h2 className="mt-1 text-xl font-bold text-ink">
                  {isEn ? "Pending worker approvals" : "অনুমোদনের অপেক্ষায় থাকা কর্মী"}
                </h2>
              </div>
              <span className="rounded-full bg-ochre-soft px-3 py-1 text-[12px] font-bold text-ochre-deep">
                {localizeDigits(pendingWorkers.length, locale)} pending
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {pendingWorkers.length > 0 ? (
                pendingWorkers.map((w) => (
                  <article
                    key={w.id}
                    className="rounded-2xl border border-line bg-paper/60 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-[16px] font-semibold text-ink">
                          {w.fullName}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-mist">
                          <span>{translateCategory(w.category, locale)}</span>
                          <span>
                            • {localizeDigits(w.experienceYears, locale)}{" "}
                            {isEn ? "yrs" : "বছর"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-river" />{" "}
                            {w.baseLocation}
                          </span>
                          <span className="flex items-center gap-1">
                            <PhoneCall size={12} className="text-pine" />{" "}
                            {w.phone}
                          </span>
                        </p>
                        <p className="mt-2 text-[13px] leading-relaxed text-mist">
                          {w.bio || (isEn ? "No additional bio provided." : "কোনো অতিরিক্ত বর্ণনা দেয়নি।")}
                        </p>
                      </div>
                      <form
                        action={`/api/admin/workers/${w.id}/approve`}
                        method="post"
                      >
                        <button className="rounded-full bg-pine px-4 py-2.5 text-[13px] font-semibold text-paper transition-all hover:-translate-y-0.5 hover:bg-pine-dark">
                          Approve worker
                        </button>
                      </form>
                    </div>
                  </article>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-line py-10 text-center text-sm text-mist">
                  {isEn ? "No pending workers right now." : "এখন কোনো pending worker নেই।"}
                </p>
              )}
            </div>
          </section>

          <section className="shadow-card rounded-3xl border border-line bg-card p-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">
              Employer directory
            </p>
            <h2 className="mt-1 text-xl font-bold text-ink">
              {isEn ? "Verified / known employers" : "যাচাইকৃত নিয়োগদাতা তালিকা"}
            </h2>
            <div className="mt-5 space-y-3">
              {employerList.length > 0 ? (
                employerList.map((e) => (
                  <article
                    key={e.id}
                    className="rounded-2xl border border-line bg-paper/60 p-4"
                  >
                    <p className="text-[15px] font-semibold text-ink">
                      {e.fullName}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-mist">
                      <span className="flex items-center gap-1">
                        <PhoneCall size={12} className="text-pine" /> {e.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-river" />{" "}
                        {e.location}
                      </span>
                    </p>
                    <p className="mt-2 text-[12px] font-semibold text-pine">
                      {e.isPhoneVerified ? "Phone verified" : "Not verified"}
                    </p>
                  </article>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-line py-10 text-center text-sm text-mist">
                  {isEn ? "No employer records yet." : "এখনো কোনো employer record নেই।"}
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="shadow-card rounded-3xl border border-line bg-card p-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">
              Order verification + assignment
            </p>
            <h2 className="mt-1 text-xl font-bold text-ink">
              {isEn ? "All Job Orders" : "সব Job Order"}
            </h2>
            <div className="mt-5 space-y-4">
              {latestJobs.map((job) => {
                const assignedWorker = approvedWorkers.find(
                  (w) => w.id === job.assignedWorkerId
                );
                return (
                  <article
                    key={job.id}
                    className="rounded-3xl border border-line bg-paper/60 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[16px] font-semibold text-ink">
                            {job.title}
                          </p>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              job.status === "pending_review"
                                ? "bg-ochre-soft text-ochre-deep"
                                : job.status === "assigned"
                                  ? "bg-rivertint text-river"
                                  : "bg-tint text-pine"
                            }`}
                          >
                            {job.status}
                          </span>
                          {job.verifiedByAdmin && (
                            <span className="rounded-full bg-tint px-2.5 py-1 text-[11px] font-bold text-pine">
                              verified
                            </span>
                          )}
                        </div>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-mist">
                          <span>{translateCategory(job.category, locale)}</span>
                          <span>• {translateJobType(job.jobType, locale)}</span>
                          <span>• {job.durationText}</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-river" />{" "}
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <PhoneCall size={12} className="text-pine" />{" "}
                            {job.contactPhone || "—"}
                          </span>
                        </p>
                        <p className="mt-2 text-[13px] leading-relaxed text-mist">
                          {job.description || (isEn ? "No description provided." : "কোনো description দেওয়া হয়নি।")}
                        </p>
                        <p className="mt-3 text-[18px] font-bold text-ink">
                          ৳{formatNumber(job.budget, 0, !isEn)}{" "}
                          <span className="text-[12px] font-medium text-faint">
                            · {job.postedBy}
                          </span>
                        </p>
                        <p className="mt-1 text-[12px] text-faint">
                          {isEn ? "Posted:" : "পোস্ট হয়েছে:"}{" "}
                          {timeAgo(job.createdAt, locale)}
                        </p>
                        {assignedWorker ? (
                          <div className="mt-2 rounded-xl border border-line bg-paper p-3 text-[13px]">
                            <p className="font-semibold text-river">
                              Assigned to: {assignedWorker.fullName} (
                              {assignedWorker.currentLocation})
                            </p>
                            <p className="mt-1 text-mist">
                              Response:{" "}
                              <span
                                className={`font-semibold ${
                                  job.workerResponse === "accepted"
                                    ? "text-pine"
                                    : job.workerResponse === "declined"
                                      ? "text-brick"
                                      : "text-ochre-deep"
                                }`}
                              >
                                {job.workerResponse.toUpperCase()}
                              </span>
                              {job.workerResponseAt &&
                                ` · ${timeAgo(job.workerResponseAt, locale)}`}
                            </p>
                          </div>
                        ) : null}
                      </div>
                      <div className="w-full max-w-xs space-y-3">
                        {!job.verifiedByAdmin && (
                          <form
                            action={`/api/admin/jobs/${job.id}/verify`}
                            method="post"
                          >
                            <button className="w-full rounded-full bg-pine px-4 py-2.5 text-[13px] font-semibold text-paper transition-all hover:-translate-y-0.5 hover:bg-pine-dark">
                              Verify job order
                            </button>
                          </form>
                        )}
                        <form
                          action={`/api/admin/jobs/${job.id}/assign`}
                          method="post"
                          className="space-y-2"
                        >
                          <select
                            name="workerId"
                            defaultValue={job.assignedWorkerId ?? ""}
                            className="w-full rounded-xl border border-line bg-card px-4 py-3 text-[13px] text-ink outline-none focus:border-pine"
                          >
                            <option value="">
                              {isEn ? "Select a Worker" : "Worker select করুন"}
                            </option>
                            {approvedWorkers.map((w) => (
                              <option key={w.id} value={w.id}>
                                {w.fullName} ·{" "}
                                {translateCategory(w.category, locale)} ·{" "}
                                {w.currentLocation}{" "}
                                {w.isActive ? "(active)" : "(inactive)"}
                              </option>
                            ))}
                          </select>
                          <button className="w-full rounded-full border border-pine/25 px-4 py-2.5 text-[13px] font-semibold text-pine transition-colors hover:border-pine hover:bg-tint">
                            Assign / share via dashboard
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="shadow-card rounded-3xl border border-line bg-card p-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">
              Worker directory
            </p>
            <h2 className="mt-1 text-xl font-bold text-ink">
              {isEn ? "All Worker Profiles" : "সব Worker profile"}
            </h2>
            <div className="mt-5 space-y-3">
              {allWorkers.map((w) => (
                <article
                  key={w.id}
                  className="rounded-2xl border border-line bg-paper/60 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold text-ink">
                        {w.fullName}
                      </p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-mist">
                        <span>{translateCategory(w.category, locale)}</span>
                        <span>
                          • {localizeDigits(w.experienceYears, locale)}{" "}
                          {isEn ? "yrs" : "বছর"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-river" />{" "}
                          {w.currentLocation}
                        </span>
                      </p>
                      <p className="mt-1 text-[12px] text-faint">{w.phone}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        w.isApproved
                          ? "bg-tint text-pine"
                          : "bg-ochre-soft text-ochre-deep"
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {w.isApproved ? (
                      <form
                        action={`/api/admin/workers/${w.id}/status`}
                        method="post"
                      >
                        <input
                          type="hidden"
                          name="action"
                          value={w.isActive ? "deactivate" : "activate"}
                        />
                        <button className="rounded-full border border-line px-3 py-2 text-[12px] font-semibold text-pine transition-colors hover:border-pine hover:bg-tint">
                          {w.isActive ? "Set inactive" : "Set active"}
                        </button>
                      </form>
                    ) : (
                      <form
                        action={`/api/admin/workers/${w.id}/approve`}
                        method="post"
                      >
                        <button className="rounded-full bg-pine px-3 py-2 text-[12px] font-semibold text-paper">
                          Approve
                        </button>
                      </form>
                    )}
                    <a
                      href={`tel:${w.phone}`}
                      className="rounded-full border border-line px-3 py-2 text-[12px] font-semibold text-mist transition-colors hover:border-river hover:text-river"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${w.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                        `Assalamu Alaikum ${w.fullName}, contacting from WorkCulvert admin panel.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-line px-3 py-2 text-[12px] font-semibold text-mist transition-colors hover:border-pine hover:text-pine"
                    >
                      WhatsApp
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
