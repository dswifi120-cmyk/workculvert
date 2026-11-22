import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import {
  ArrowUpRight,
  Briefcase,
  Clock3,
  MapPin,
  PhoneCall,
  UserCheck,
} from "lucide-react";
import { getDb } from "@/db";
import { jobs } from "@/db/schema";
import { requireWorker } from "@/lib/auth";
import { formatNumber, localizeDigits, timeAgo } from "@/lib/utils";
import { getServerLocale } from "@/lib/server-locale";
import { getDictionary } from "@/lib/i18n";
import { translateCategory, translateJobType } from "@/lib/categories";
import { LogoutButton } from "@/components/logout-button";
import { JobResponseButtons } from "@/components/job-response-buttons";
import { LanguageSwitcher } from "@/components/language-switcher";

export const metadata: Metadata = {
  title: "Worker Dashboard",
};

export const dynamic = "force-dynamic";

export default async function WorkerDashboardPage() {
  const worker = await requireWorker();
  const locale = await getServerLocale();
  const d = getDictionary(locale).dashboard;
  const db = await getDb();

  let workerSkills: string[] = [worker.category];
  try {
    const parsed = JSON.parse(worker.skillsList || "[]");
    if (Array.isArray(parsed) && parsed.length > 0) {
      workerSkills = Array.from(new Set([worker.category, ...parsed]));
    }
  } catch {
    workerSkills = [worker.category];
  }

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
        inArray(jobs.category, workerSkills),
        isNull(jobs.assignedWorkerId)
      )
    )
    .orderBy(desc(jobs.createdAt))
    .limit(6);

  return (
    <main className="min-h-screen bg-paper">
      <div className="border-b border-line bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-pine">
              {d.badge}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-ink">
              {d.welcome} {worker.fullName}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <LanguageSwitcher />
            <Link
              href="/#jobs"
              className="inline-flex items-center gap-2 rounded-full bg-pine px-4 py-2.5 text-sm font-semibold text-paper transition-all hover:-translate-y-0.5 hover:bg-pine-dark"
            >
              {d.browseJobs} <ArrowUpRight size={15} />
            </Link>
            <LogoutButton
              kind="worker"
              label={d.logout}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-mist transition-colors hover:border-pine/35 hover:text-pine"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <section className="shadow-card rounded-3xl border border-line bg-card p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">
                  {d.profileTag}
                </p>
                <h2 className="mt-1 text-xl font-bold text-ink">
                  {worker.fullName}
                </h2>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[12px] font-bold ${
                  worker.isActive
                    ? "bg-tint text-pine"
                    : "bg-linen text-mist"
                }`}
              >
                {worker.isActive ? d.active : d.inactive}
              </span>
            </div>

            <div className="mt-5 space-y-2 text-[14px] text-mist">
              <div className="flex flex-wrap gap-1.5">
                {workerSkills.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center gap-1 rounded-full bg-tint px-2.5 py-0.5 text-[12px] font-semibold text-pine"
                  >
                    <Briefcase size={12} /> {translateCategory(sk, locale)}
                  </span>
                ))}
              </div>
              <p className="flex items-center gap-2 pt-1">
                <PhoneCall size={15} className="text-pine" /> {worker.phone}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={15} className="text-pine" /> {d.baseLabel}{" "}
                {worker.baseLocation}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={15} className="text-river" /> {d.currentLabel}{" "}
                {worker.currentLocation}
              </p>
              <p className="flex items-center gap-2">
                <UserCheck size={15} className="text-pine" /> {d.expLabel}{" "}
                {worker.isFresher
                  ? locale === "en"
                    ? "Fresher"
                    : "ফ্রেশার"
                  : `${localizeDigits(worker.experienceYears, locale)} ${d.years}`}
              </p>
            </div>

            <form
              action="/api/worker/profile"
              method="post"
              className="mt-6 space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">
                  {d.currentLocInput}
                </label>
                <input
                  name="currentLocation"
                  defaultValue={worker.currentLocation}
                  placeholder={locale === "en" ? "e.g. Dhaka / Chattogram / Rajshahi" : "যেমন: ঢাকা / চট্টগ্রাম / রাজশাহী"}
                  className="w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-[14px] text-ink outline-none focus:border-pine"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">
                  {locale === "en" ? "Preferred Work Areas" : "পছন্দের কাজের এলাকা"}
                </label>
                <input
                  name="preferredAreas"
                  defaultValue={worker.preferredAreas || worker.currentLocation}
                  placeholder={locale === "en" ? "Areas where you want to take jobs" : "কোন কোন এলাকায় কাজ নিতে চান"}
                  className="w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-[14px] text-ink outline-none focus:border-pine"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-ink">
                  {d.bioInput}
                </label>
                <textarea
                  name="bio"
                  defaultValue={worker.bio}
                  rows={4}
                  className="w-full rounded-xl border border-line bg-paper/60 px-4 py-3 text-[14px] text-ink outline-none focus:border-pine"
                />
              </div>
              <label className="flex items-center gap-3 rounded-2xl border border-line bg-paper/50 px-4 py-3 text-[14px] font-medium text-ink">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={worker.isActive}
                  className="size-4 rounded border-line text-pine"
                />
                {d.activeCheckbox}
              </label>
              <button className="w-full rounded-full bg-pine py-3 text-[14px] font-semibold text-paper transition-all hover:-translate-y-0.5 hover:bg-pine-dark">
                {d.updateBtn}
              </button>
            </form>
          </section>

          <div className="space-y-4">
            <section className="shadow-card rounded-3xl border border-line bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">
                    {d.assignedTag}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-ink">
                    {d.assignedHeading}
                  </h2>
                </div>
                <span className="rounded-full bg-ochre-soft px-3 py-1 text-[12px] font-bold text-ochre-deep">
                  {localizeDigits(assignedJobs.length, locale)}
                  {d.countSuffix}
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {assignedJobs.length > 0 ? (
                  assignedJobs.map((job) => (
                    <article
                      key={job.id}
                      className="rounded-2xl border border-line bg-paper/60 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[16px] font-semibold text-ink">
                            {job.title}
                          </p>
                          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-mist">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="text-river" />{" "}
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock3 size={12} />{" "}
                              {timeAgo(job.createdAt, locale)}
                            </span>
                            <span className="rounded-full bg-tint px-2 py-0.5 text-[11px] font-semibold text-pine">
                              {job.durationText}
                            </span>
                          </p>
                        </div>
                        <p className="text-lg font-bold text-ink">
                          ৳{formatNumber(job.budget, 0, locale === "bn")}
                        </p>
                      </div>
                      <p className="mt-3 text-[13px] leading-relaxed text-mist">
                        {job.description || d.defaultAssignedDesc}
                      </p>

                      <JobResponseButtons
                        jobId={job.id}
                        workerResponse={job.workerResponse}
                        contactPhone={job.contactPhone}
                        workerName={worker.fullName}
                        jobTitle={job.title}
                      />
                    </article>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-line py-10 text-center text-sm text-mist">
                    {d.emptyAssigned}
                  </p>
                )}
              </div>
            </section>

            <section className="shadow-card rounded-3xl border border-line bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">
                    {d.matchedTag}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-ink">
                    {d.matchedHeading}
                  </h2>
                </div>
                <span className="rounded-full bg-tint px-3 py-1 text-[12px] font-bold text-pine">
                  {localizeDigits(matchedJobs.length, locale)}
                  {d.countSuffix}
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {matchedJobs.length > 0 ? (
                  matchedJobs.map((job) => (
                    <article
                      key={job.id}
                      className="rounded-2xl border border-line bg-paper/60 p-4"
                    >
                      <p className="text-[15px] font-semibold text-ink">
                        {job.title}
                      </p>
                      <p className="mt-1 text-[12.5px] text-mist">
                        {job.location} · {translateJobType(job.jobType, locale)}{" "}
                        · {job.durationText}
                      </p>
                      <p className="mt-3 text-[18px] font-bold text-ink">
                        ৳{formatNumber(job.budget, 0, locale === "bn")}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-line py-10 text-center text-sm text-mist sm:col-span-2">
                    {d.emptyMatched}
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
